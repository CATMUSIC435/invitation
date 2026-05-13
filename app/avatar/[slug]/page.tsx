import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import AvatarMergeEditor from '../editor';
import { db } from '@/lib/db/drizzle';
import { avatarTemplates } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { connection } from 'next/server';

export const dynamic = 'force-dynamic';

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const { connection } = await import('next/server');
  await connection();
  try {
    const template = await getTemplate(params.slug);

    if (template) {
      return {
        title: `Tạo Avatar - ${template.title} | DXMD Vietnam`,
        description: template.content || `Tham gia chiến dịch ${template.title} cùng DXMD Vietnam.`,
        openGraph: {
          title: `Tạo Avatar - ${template.title}`,
          description: template.content || `Tạo avatar chiến dịch ${template.title}`,
          images: template.image_url ? [template.image_url] : ['/og-image.jpg'],
        },
        twitter: {
          card: 'summary_large_image',
          title: `Tạo Avatar - ${template.title}`,
          description: template.content || `Tạo avatar chiến dịch ${template.title}`,
          images: template.image_url ? [template.image_url] : ['/og-image.jpg'],
        }
      };
    }
  } catch (error) {
    // Fallback
  }

  return {
    title: 'Tạo Avatar | DXMD Vietnam',
    description: 'Tạo avatar chiến dịch cùng DXMD Vietnam.'
  };
}


async function getTemplate(slug: string) {
  const [template] = await db.select().from(avatarTemplates).where(eq(avatarTemplates.slug, slug));
  return template;
}

export default async function AvatarMergeSlugPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const { connection } = await import('next/server');
  await connection();
  
  try {
    const template = await getTemplate(params.slug);

    if (!template) {
      redirect('/');
    }

    // Map DB fields to what editor expects
    const editorTemplate = {
      ...template,
      content: template.content || undefined,
      image: template.image_url || undefined
    };

    return <AvatarMergeEditor initialTemplate={editorTemplate} />;
  } catch (error) {
    console.error("Error reading from DB", error);
    redirect('/');
  }
}
