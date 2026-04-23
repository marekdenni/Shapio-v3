import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import crypto from 'crypto';

// POST /api/org/[slug]/invite
// Creates an invitation for a new member. Org admin/owner only.
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const supabase = createServerClient();
    const { slug } = params;

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Nejsi přihlášen.' }, { status: 401 });
    }

    // Get org by slug
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('id')
      .eq('slug', slug)
      .single();

    if (orgError || !org) {
      return NextResponse.json({ error: 'Organizace nenalezena.' }, { status: 404 });
    }

    // Check that the current user is an admin/owner of this org
    const { data: callerMembership } = await supabase
      .from('org_memberships')
      .select('role')
      .eq('org_id', org.id)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (!callerMembership || !['owner', 'admin'].includes(callerMembership.role)) {
      return NextResponse.json({ error: 'Nemáš oprávnění zvát členy.' }, { status: 403 });
    }

    // Parse request body
    const body = await request.json();
    const { email, role = 'member' } = body as { email: string; role?: string };

    if (!email?.trim()) {
      return NextResponse.json({ error: 'E-mail je povinný.' }, { status: 400 });
    }

    // Validate role
    const validRoles = ['member', 'coach', 'admin'];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: 'Neplatná role.' }, { status: 400 });
    }

    // Check if already a member
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('email', email.trim().toLowerCase())
      .single();

    if (existingProfile) {
      const { data: existingMembership } = await supabase
        .from('org_memberships')
        .select('id, status')
        .eq('org_id', org.id)
        .eq('user_id', existingProfile.id)
        .single();

      if (existingMembership?.status === 'active') {
        return NextResponse.json(
          { error: 'Tento uživatel je již členem organizace.' },
          { status: 409 }
        );
      }
    }

    // Check for existing pending invite
    const { data: existingInvite } = await supabase
      .from('org_invites')
      .select('id')
      .eq('org_id', org.id)
      .eq('email', email.trim().toLowerCase())
      .is('accepted_at', null)
      .single();

    if (existingInvite) {
      return NextResponse.json(
        { error: 'Pozvánka pro tento e-mail již existuje.' },
        { status: 409 }
      );
    }

    // Generate secure invite token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7-day expiry

    // Create invite
    const { data: invite, error: inviteError } = await supabase
      .from('org_invites')
      .insert({
        org_id: org.id,
        email: email.trim().toLowerCase(),
        role,
        token,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (inviteError) {
      console.error('[api/org/invite] insert error:', inviteError);
      return NextResponse.json(
        { error: 'Nepodařilo se vytvořit pozvánku.' },
        { status: 500 }
      );
    }

    // If the user already exists, also create a pending membership
    if (existingProfile) {
      await supabase.from('org_memberships').insert({
        org_id: org.id,
        user_id: existingProfile.id,
        role,
        status: 'invited',
        invited_email: email.trim().toLowerCase(),
        invited_at: new Date().toISOString(),
      });
    }

    // TODO: Send invitation email (future feature)
    // For now, the invite can be accepted via /invite/[token]

    return NextResponse.json({
      id: invite.id,
      email: invite.email,
      role: invite.role,
      token: invite.token,
      expiresAt: invite.expires_at,
    });
  } catch (error) {
    console.error('[api/org/invite] unexpected error:', error);
    return NextResponse.json(
      { error: 'Nastala neočekávaná chyba.' },
      { status: 500 }
    );
  }
}
