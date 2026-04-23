import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

// POST /api/org/create
// Creates a new organization and sets the current user as owner.
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Nejsi přihlášen.' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { name, slug, type = 'other' } = body as {
      name: string;
      slug: string;
      type?: string;
    };

    // Validate
    if (!name?.trim()) {
      return NextResponse.json({ error: 'Název organizace je povinný.' }, { status: 400 });
    }

    if (!slug || slug.length < 3) {
      return NextResponse.json({ error: 'URL identifikátor musí mít alespoň 3 znaky.' }, { status: 400 });
    }

    // Validate slug format (matches DB constraint)
    const slugRegex = /^[a-z0-9][a-z0-9-]{1,46}[a-z0-9]$/;
    if (!slugRegex.test(slug)) {
      return NextResponse.json(
        { error: 'Neplatný identifikátor. Použij malá písmena, čísla a pomlčky (3–48 znaků).' },
        { status: 400 }
      );
    }

    // Check slug uniqueness
    const { data: existing } = await supabase
      .from('organizations')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Tento identifikátor je již obsazený. Zvol jiný.' },
        { status: 409 }
      );
    }

    // Create organization
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name: name.trim(),
        slug,
        type,
        plan: 'free',
        settings: {},
      })
      .select()
      .single();

    if (orgError || !org) {
      console.error('[api/org/create] org insert error:', orgError);
      return NextResponse.json(
        { error: 'Nepodařilo se vytvořit organizaci.' },
        { status: 500 }
      );
    }

    // Create owner membership
    const { error: memberError } = await supabase
      .from('org_memberships')
      .insert({
        org_id: org.id,
        user_id: user.id,
        role: 'owner',
        status: 'active',
        joined_at: new Date().toISOString(),
      });

    if (memberError) {
      console.error('[api/org/create] membership insert error:', memberError);
      // Cleanup: delete the org if membership failed
      await supabase.from('organizations').delete().eq('id', org.id);
      return NextResponse.json(
        { error: 'Nepodařilo se vytvořit členství.' },
        { status: 500 }
      );
    }

    // Set as user's active org
    await supabase
      .from('user_profiles')
      .update({ active_org_id: org.id })
      .eq('id', user.id);

    return NextResponse.json({
      id: org.id,
      name: org.name,
      slug: org.slug,
      type: org.type,
      plan: org.plan,
    });
  } catch (error) {
    console.error('[api/org/create] unexpected error:', error);
    return NextResponse.json(
      { error: 'Nastala neočekávaná chyba.' },
      { status: 500 }
    );
  }
}
