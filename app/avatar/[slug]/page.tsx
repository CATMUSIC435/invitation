import fs from 'fs';
import path from 'path';
import AvatarMergeEditor from '../editor';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const jsonPath = path.join(process.cwd(), 'public', 'index.json');
  try {
    const fileContent = fs.readFileSync(jsonPath, 'utf-8');
    const templates = JSON.parse(fileContent);
    const template = templates.find((t: any) => t.slug === params.slug);

    if (template) {
      return {
        title: `Tạo Avatar - ${template.title} | DXMD Việt Nam`,
        description: template.content || `Tham gia chiến dịch ${template.title} cùng DXMD Việt Nam.`,
        openGraph: {
          title: `Tạo Avatar - ${template.title}`,
          description: template.content || `Tạo avatar chiến dịch ${template.title}`,
          images: template.image ? [template.image] : [],
        }
      };
    }
  } catch (error) {
    // Fallback if file read fails
  }

  return {
    title: 'Tạo Avatar | DXMD Việt Nam',
    description: 'Tạo avatar chiến dịch cùng DXMD Việt Nam.'
  };
}

export async function generateStaticParams() {
  const jsonPath = path.join(process.cwd(), 'public', 'index.json');
  try {
    const fileContent = fs.readFileSync(jsonPath, 'utf-8');
    const templates = JSON.parse(fileContent);
    return templates.map((t: any) => ({ slug: t.slug }));
  } catch (error) {
    return [];
  }
}

export default async function AvatarMergeSlugPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const jsonPath = path.join(process.cwd(), 'public', 'index.json');
  
  try {
    const fileContent = fs.readFileSync(jsonPath, 'utf-8');
    const templates = JSON.parse(fileContent);
    
    const template = templates.find((t: any) => t.slug === params.slug);

    if (!template) {
      redirect('/');
    }

    return <AvatarMergeEditor initialTemplate={template} />;
  } catch (error) {
    console.error("Error reading index.json", error);
    redirect('/');
  }
}
