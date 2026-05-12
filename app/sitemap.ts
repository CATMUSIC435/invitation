import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dxmd.vn';
  
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/dashboard/social`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/invitations`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ranking`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
  ];

  // Dynamic routes from avatar_templates (Database)
  try {
    const { db } = await import('@/lib/db/drizzle');
    const { avatarTemplates, invitations } = await import('@/lib/db/schema');
    
    const templates = await db.select().from(avatarTemplates);
    templates.forEach((t) => {
      if (t.slug) {
        routes.push({
          url: `${baseUrl}/avatar/${t.slug}`,
          lastModified: t.updated_at ? new Date(t.updated_at) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      }
    });
  } catch (e) {
    console.error("Error generating DB templates sitemap", e);
  }

  // Dynamic routes from database (invitations/shares)
  try {
    const { db } = await import('@/lib/db/drizzle');
    const { invitations } = await import('@/lib/db/schema');
    
    const allInvitations = await db.select().from(invitations);
    allInvitations.forEach((inv) => {
      if (inv.slug) {
        routes.push({
          url: `${baseUrl}/share/${inv.slug}`,
          lastModified: inv.created_at ? new Date(inv.created_at) : new Date(),
          changeFrequency: 'monthly',
          priority: 0.7,
        });
      }
    });
  } catch (e) {
    console.error("Error generating DB sitemap", e);
  }

  return routes;
}
