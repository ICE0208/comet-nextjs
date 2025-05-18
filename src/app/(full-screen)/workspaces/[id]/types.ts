import { Workspace } from "@prisma/client";

export type WorkspacePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export type HeaderProps = {
  workspaceTitle: string;
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

export type PromptOutputProps = {
  savedAIResponse: string | null;
};

export type WorkspaceWithHistory = Workspace & {
  history: {
    userRequest: string;
    aiResponse: string;
  }[];
};
