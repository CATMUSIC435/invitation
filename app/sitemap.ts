import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dxmd.vn';
  
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ];

  const jsonPath = path.join(process.cwd(), 'public', 'index.json');
  try {
    const fileContent = fs.readFileSync(jsonPath, 'utf-8');
    const templates = JSON.parse(fileContent);
    
    templates.forEach((t: any) => {
      if (t.slug) {
        routes.push({
          url: `${baseUrl}/avatar/${t.slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      }
    });
  } catch (e) {
    console.error("Error generating sitemap", e);
  }

  return routes;
}
