import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

// POST /api/progress/upload
// Uploads a progress photo to Supabase Storage and saves record to DB
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Nejsi přihlášen.' }, { status: 401 });
    }

    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get('photo') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Žádný soubor nebyl nahrán.' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Pouze obrázky jsou povoleny.' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'Fotka je příliš velká. Maximum je 10 MB.' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const ext = file.type.split('/')[1] || 'jpg';
    const filename = `${user.id}/${Date.now()}.${ext}`;

    // Convert file to ArrayBuffer
    const buffer = await file.arrayBuffer();

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('progress-photos')
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return NextResponse.json(
        { error: 'Nahrávání souboru selhalo.' },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('progress-photos')
      .getPublicUrl(uploadData.path);

    const photoUrl = urlData.publicUrl;

    // Save record to progress_photos table
    const { data: photoRecord, error: dbError } = await supabase
      .from('progress_photos')
      .insert({
        user_id: user.id,
        photo_url: photoUrl,
        uploaded_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (dbError) {
      console.error('DB insert error:', dbError);
      return NextResponse.json(
        { error: 'Chyba při ukládání záznamu.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      photoUrl,
      id: photoRecord.id,
    });
  } catch (error) {
    console.error('Photo upload error:', error);
    return NextResponse.json(
      { error: 'Nastala neočekávaná chyba při nahrávání.' },
      { status: 500 }
    );
  }
}
