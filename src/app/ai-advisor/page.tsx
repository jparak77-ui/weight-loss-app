import { AppShell } from '@/components/layout/AppShell';
import { AIChatView } from '@/components/ai-advisor/AIChatView';

export default function AIAdvisorPage() {
  return (
    <AppShell>
      <AIChatView />
    </AppShell>
  );
}
