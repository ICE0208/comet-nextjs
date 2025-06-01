import { getWorkspaceById } from "./actions";

export type WorkspacePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export type HeaderProps = {
  workspaceTitle?: string;
  onToggleHistory?: () => void;
};

export type FooterProps = {
  lastEditDate: Date;
};

export type IconButtonProps = {
  title: string;
  onClick?: () => void;
  children: React.ReactNode;
};

export type PromptInputProps = {
  workspaceId: string;
  savedInputText: string;
};

interface AIResponseItem {
  id: number;
  createdAt: Date;
  text: string;
  workspaceHistoryId: string;
  details?: {
    id: number;
    createdAt: Date;
    text: string;
    type: string;
    aiResponseId: number;
  }[];
}

export type PromptOutputProps = {
  savedAIResponse: AIResponseItem | null;
};

export type QueueStatus = {
  totalUserJobs: number;
  runningJobs: number;
  availableSlots: number;
};

export type QueueStatusAll = {
  basic: {
    totalUserJobs: number;
    runningJobs: number;
    availableSlots: number;
  };
  pro: {
    totalUserJobs: number;
    runningJobs: number;
    availableSlots: number;
  };
};

export type WorkspaceWithHistory = Awaited<ReturnType<typeof getWorkspaceById>>;
