import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import AvatarMergeEditor from '../editor';
import { db } from '@/lib/db/drizzle';
import { avatarTemplates } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  try {
    const template = await getTemplate(params.slug);

    if (template) {
      return {
        title: `Tạo Avatar - ${template.title} | FENICA`,
        description: template.content || `Tham gia chiến dịch ${template.title} cùng FENICA.`,
        openGraph: {
          title: `Tạo Avatar - ${template.title}`,
          description: template.content || `Tạo avatar chiến dịch ${template.title}`,
          images: template.image_url ? [template.image_url] : [],
        }
      };
    }
  } catch (error) {
    // Fallback
  }

  return {
    title: 'Tạo Avatar | FENICA',
    description: 'Tạo avatar chiến dịch cùng FENICA.'
  };
}

export async function generateStaticParams() {
  try {
    const templates = await db.select({ slug: avatarTemplates.slug }).from(avatarTemplates);
    return templates.map((t) => ({ slug: t.slug }));
  } catch (error) {
    return [];
  }
}

async function getTemplate(slug: string) {
  'use cache';
  const [template] = await db.select().from(avatarTemplates).where(eq(avatarTemplates.slug, slug));
  return template;
}

export default async function AvatarMergeSlugPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  
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
