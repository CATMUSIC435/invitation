'use server';

import { db } from '@/lib/db/drizzle';
import { invitations } from '@/lib/db/schema';
import { revalidatePath } from 'next/cache';

export async function saveInvitation(name: string, title: string, base64Image?: string) {
  try {
    let imageUrl = null;
    
    if (base64Image) {
      // Prepare image buffer
      const isJpeg = base64Image.startsWith('data:image/jpeg');
      const ext = isJpeg ? 'jpg' : 'png';
      const mimeType = isJpeg ? 'image/jpeg' : 'image/png';
      const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, 'base64');
      
      const fileName = `invitation-${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.${ext}`;

      // Upload to WordPress
      const wpUser = process.env.WP_USERNAME || '';
      const wpPass = process.env.WP_APP_PASSWORD || '';
      const wpRestUrl = process.env.WP_REST_URL || 'https://marketing.dxmdvietnam.vn/index.php?rest_route=/wp/v2/media';
      
      const wpAuth = Buffer.from(`${wpUser}:${wpPass}`).toString('base64');
      
      const wpRes = await fetch(wpRestUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${wpAuth}`,
          'Content-Disposition': `attachment; filename="${fileName}"`,
          'Content-Type': mimeType
        },
        body: buffer
      });
      
      if (wpRes.ok) {
        const wpData = await wpRes.json();
        imageUrl = wpData.source_url;
      } else {
        console.error('WordPress Upload failed:', wpRes.status, await wpRes.text());
      }
    }

    // Generate unique slug
    const randomString = Math.random().toString(36).substring(2, 8);
    const slug = `${name.toLowerCase().replace(/\s+/g, '-')}-${randomString}`;

    const [inserted] = await db.insert(invitations).values({
      slug,
      name,
      title,
      image_url: imageUrl,
    }).returning({ slug: invitations.slug });
    
    // Revalidate the data page so it fetches the fresh list
    revalidatePath('/list');
    revalidatePath('/dashboard');
    
    return { success: true, slug: inserted.slug };
  } catch (error) {
    console.error('Failed to save invitation', error);
    return { success: false, error: 'Lỗi khi lưu dữ liệu vào cơ sở dữ liệu' };
  }
}
