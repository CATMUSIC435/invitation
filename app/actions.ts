'use server';

import { db } from '@/lib/db/drizzle';
import { invitations, invitationTemplates } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
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

export async function saveInvitationTemplate(data: {
  id?: number;
  slug: string;
  name: string;
  title?: string;
  description?: string;
  background_url?: string;
  text_position_x: number;
  text_position_y: number;
  avatar_position_x?: number;
  avatar_position_y?: number;
  has_avatar: boolean;
  save_user_info?: boolean;
}) {
  try {
    if (data.id) {
      await db.update(invitationTemplates)
        .set({ ...data, updated_at: new Date() })
        .where(eq(invitationTemplates.id, data.id));
    } else {
      // Check for duplicate slug
      const existing = await db.select().from(invitationTemplates).where(eq(invitationTemplates.slug, data.slug)).limit(1);
      if (existing.length > 0) {
        return { success: false, error: 'Slug này đã tồn tại, vui lòng chọn slug khác' };
      }
      await db.insert(invitationTemplates).values(data);
    }
    
    revalidatePath(`/invitations/${data.slug}`);
    revalidatePath('/invitations');
    revalidatePath('/admin/invitation-templates');
    return { success: true };
  } catch (error) {
    console.error('Failed to save template', error);
    return { success: false, error: 'Lỗi khi lưu template' };
  }
}

export async function getInvitationTemplateBySlug(slug: string) {
  'use cache';
  try {
    const [template] = await db.select().from(invitationTemplates).where(eq(invitationTemplates.slug, slug)).limit(1);
    return template || null;
  } catch (error) {
    console.error('Failed to get template', error);
    return null;
  }
}

export async function getInvitationTemplates() {
  'use cache';
  try {
    const templates = await db.select().from(invitationTemplates).orderBy(invitationTemplates.created_at);
    return templates;
  } catch (error) {
    console.error('Failed to get templates', error);
    return [];
  }
}

export async function deleteInvitationTemplate(id: number) {
  try {
    await db.delete(invitationTemplates).where(eq(invitationTemplates.id, id));
    revalidatePath('/dashboard/invitation-templates');
    revalidatePath('/invitations');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete template', error);
    return { success: false, error: 'Lỗi khi xóa template' };
  }
}

export async function uploadTemplateBackground(base64Image: string, name: string) {
  try {
    const isJpeg = base64Image.startsWith('data:image/jpeg');
    const ext = isJpeg ? 'jpg' : 'png';
    const mimeType = isJpeg ? 'image/jpeg' : 'image/png';
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');
    
    const fileName = `template-bg-${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.${ext}`;

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
      return { success: true, url: wpData.source_url };
    } else {
      console.error('WordPress Upload failed:', wpRes.status, await wpRes.text());
      return { success: false, error: 'Lỗi khi upload ảnh lên WordPress' };
    }
  } catch (error) {
    console.error('Failed to upload background', error);
    return { success: false, error: 'Lỗi hệ thống khi upload ảnh' };
  }
}

export async function getProxyImage(url: string) {
  try {
    const res = await fetch(url);
    const buffer = await res.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const type = res.headers.get('content-type') || 'image/png';
    return `data:${type};base64,${base64}`;
  } catch (error) {
    console.error('Failed to proxy image', error);
    return url;
  }
}
