import { getInvitationTemplates } from '@/app/actions';
import TemplateManager from './template-manager';

export default async function InvitationTemplatesPage() {
  const templates = await getInvitationTemplates();

  return <TemplateManager initialTemplates={templates} />;
}
