"use server";

import { db } from '@/lib/db/drizzle';
import { avatarTemplates } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function uploadToWordPress(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    if (!file) return { error: "No file uploaded" };

    const wpRestUrl = process.env.WP_REST_URL || 'https://marketing.dxmdvietnam.vn/index.php?rest_route=/wp/v2/media';
    const wpUser = process.env.WP_USERNAME;
    const wpPass = process.env.WP_APP_PASSWORD;

    if (!wpRestUrl || !wpUser || !wpPass) {
      return { error: "Vui lòng cấu hình WP_REST_URL, WP_USERNAME, WP_APP_PASSWORD trong file .env" };
    }

    const authHeader = 'Basic ' + Buffer.from(`${wpUser}:${wpPass}`).toString('base64');
    
    const buffer = await file.arrayBuffer();
    
    const response = await fetch(wpRestUrl, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Disposition': `attachment; filename="${file.name}"`,
        'Content-Type': file.type || 'image/jpeg',
      },
      body: Buffer.from(buffer),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("WP Upload Error:", errorText);
      return { error: `Tải ảnh lên WordPress thất bại: ${response.statusText} - ${errorText}` };
    }

    const data = await response.json();
    return { url: data.source_url };
  } catch (error: any) {
    console.error("Upload Error Exception:", error);
    return { error: error.message || "Lỗi không xác định khi tải ảnh" };
  }
}

export async function getAvatarTemplates() {
  return await db.select().from(avatarTemplates).orderBy(desc(avatarTemplates.created_at));
}

export async function createAvatarTemplate(data: any) {
  await db.insert(avatarTemplates).values({
    slug: data.slug,
    title: data.title,
    content: data.content,
    image_url: data.image_url,
    start_date: data.start_date ? new Date(data.start_date) : null,
    end_date: data.end_date ? new Date(data.end_date) : null,
  });
  revalidatePath('/dashboard/avatar');
  revalidatePath('/');
  revalidatePath('/avatar');
}

export async function updateAvatarTemplate(id: number, data: any) {
  await db.update(avatarTemplates).set({
    slug: data.slug,
    title: data.title,
    content: data.content,
    image_url: data.image_url,
    start_date: data.start_date ? new Date(data.start_date) : null,
    end_date: data.end_date ? new Date(data.end_date) : null,
    updated_at: new Date()
  }).where(eq(avatarTemplates.id, id));
  revalidatePath('/dashboard/avatar');
  revalidatePath('/');
  revalidatePath(`/avatar/${data.slug}`);
}

export async function deleteAvatarTemplate(id: number) {
  await db.delete(avatarTemplates).where(eq(avatarTemplates.id, id));
  revalidatePath('/dashboard/avatar');
  revalidatePath('/');
  revalidatePath('/avatar');
}
