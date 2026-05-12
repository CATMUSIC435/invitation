"use server";

import { db } from '@/lib/db/drizzle';
import { avatarTemplates } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function uploadToWordPress(formData: FormData) {
  const file = formData.get('file') as File;
  if (!file) throw new Error("No file uploaded");

  const wpUrl = process.env.WP_URL;
  const wpUser = process.env.WP_USERNAME;
  const wpPass = process.env.WP_APP_PASSWORD;

  if (!wpUrl || !wpUser || !wpPass) {
    throw new Error("Vui lòng cấu hình WP_URL, WP_USERNAME, WP_APP_PASSWORD trong file .env");
  }

  const authHeader = 'Basic ' + Buffer.from(`${wpUser}:${wpPass}`).toString('base64');
  
  const buffer = await file.arrayBuffer();
  
  const response = await fetch(`${wpUrl}/wp-json/wp/v2/media`, {
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
    throw new Error(`Tải ảnh lên WordPress thất bại: ${response.statusText}`);
  }

  const data = await response.json();
  return data.source_url; // URL ảnh tĩnh từ WP
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
