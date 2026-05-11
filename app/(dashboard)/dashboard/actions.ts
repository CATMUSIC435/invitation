'use server';

import { db } from '@/lib/db/drizzle';
import { invitations } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function addInvitationAction(name: string, title: string) {
  const randomString = Math.random().toString(36).substring(2, 8);
  const slug = `${name.toLowerCase().replace(/\s+/g, '-')}-${randomString}`;
  
  await db.insert(invitations).values({
    name,
    title,
    slug,
  });
  
  revalidatePath('/dashboard');
  revalidatePath('/list');
  return { success: true };
}

export async function updateInvitationAction(id: number, name: string, title: string) {
  await db.update(invitations).set({
    name,
    title,
  }).where(eq(invitations.id, id));
  
  revalidatePath('/dashboard');
  revalidatePath('/list');
  return { success: true };
}

export async function deleteInvitationAction(id: number) {
  // Get the invitation first to get the image_url
  const [inv] = await db.select().from(invitations).where(eq(invitations.id, id));
  
  if (inv && inv.image_url) {
    try {
      const wpUser = process.env.WP_USERNAME || '';
      const wpPass = process.env.WP_APP_PASSWORD || '';
      const wpRestUrlBase = process.env.WP_REST_URL || 'https://marketing.dxmdvietnam.vn/index.php?rest_route=/wp/v2/media';
      const wpAuth = Buffer.from(`${wpUser}:${wpPass}`).toString('base64');

      // Extract filename from URL
      const urlParts = inv.image_url.split('/');
      const filenameWithExt = urlParts[urlParts.length - 1];
      const filename = filenameWithExt.split('.')[0];

      const separator = wpRestUrlBase.includes('?') ? '&' : '?';
      const searchUrl = `${wpRestUrlBase}${separator}search=${encodeURIComponent(filename)}`;
      
      const searchRes = await fetch(searchUrl, {
        headers: { 'Authorization': `Basic ${wpAuth}` }
      });
      
      if (searchRes.ok) {
        const mediaList = await searchRes.json();
        if (mediaList && mediaList.length > 0) {
          const mediaId = mediaList[0].id;
          
          // Delete media
          const deleteUrl = `${wpRestUrlBase.replace('/wp/v2/media', `/wp/v2/media/${mediaId}`)}${separator}force=true`;
          await fetch(deleteUrl, {
            method: 'DELETE',
            headers: { 'Authorization': `Basic ${wpAuth}` }
          });
        }
      }
    } catch (err) {
      console.error('Failed to delete media from WP:', err);
    }
  }

  await db.delete(invitations).where(eq(invitations.id, id));
  
  revalidatePath('/dashboard');
  revalidatePath('/list');
  return { success: true };
}
