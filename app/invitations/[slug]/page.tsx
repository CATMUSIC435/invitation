import { getInvitationTemplateBySlug } from '@/app/actions';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getProxyImage } from '@/app/actions';
import UserInvitationCard from '@/components/atoms/user-invitation-card';
import ShinyText from '@/components/atoms/shiny-text';
import TopBranding from '@/components/atoms/top-branding';
import ShareFooter from '@/components/atoms/share-footer';

import { db } from '@/lib/db/drizzle';
import { invitationTemplates } from '@/lib/db/schema';

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamic = 'force-dynamic';

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const { connection } = await import('next/server');
  await connection();
  try {
    const template = await getInvitationTemplateBySlug(params.slug);
    if (template) {
      return {
        title: `Thư Mời - ${template.title || template.name} | DXMD Vietnam`,
        description: template.description || `Thư mời ${template.name}`,
        openGraph: {
          title: `Thư Mời - ${template.title || template.name}`,
          description: template.description || `Thư mời ${template.name}`,
          images: template.background_url ? [template.background_url] : ['/og-image.jpg'],
        },
        twitter: {
          card: 'summary_large_image',
          title: `Thư Mời - ${template.title || template.name}`,
          description: template.description || `Thư mời ${template.name}`,
          images: template.background_url ? [template.background_url] : ['/og-image.jpg'],
        }
      };
    }
  } catch (error) { }

  return {
    title: 'Thư Mời | DXMD Vietnam',
    description: 'Tạo thư mời sự kiện cùng DXMD Vietnam.'
  };
}

export default async function Page({ params }: Props) {
  const resolvedParams = await params;
  const { connection } = await import('next/server');
  await connection();
  const template = await getInvitationTemplateBySlug(resolvedParams.slug);

  if (!template) {
    notFound();
  }

  const preloadedTemplate = {
    ...template,
    background_url: template.background_url ? await getProxyImage(template.background_url).catch(() => template.background_url || null) : template.background_url
  };

  return (
    <main className="p-4 min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <TopBranding url="/invitations" />

      <div className="flex-1 w-full flex flex-col items-center justify-center relative z-10 pb-10">
        <div className="mt-4 mb-4 text-center max-w-2xl mx-auto">
          <h1 className="text-xl md:text-2xl font-bold mb-2 text-center tracking-tight text-white uppercase">
            <span className="text-base md:text-3xl block font-medium tracking-[0.2em] text-[#c19d68] items-center mb-2">
              {template.title || 'THƯ MỜI'}
            </span>
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto text-sm font-light whitespace-pre-wrap">
            {template.description || 'Tạo thiệp mời cá nhân hóa của bạn bằng cách nhập thông tin bên dưới.'}
          </p>
        </div>
        <UserInvitationCard template={preloadedTemplate} />
      </div>

      <ShareFooter />
    </main>
  );
}
