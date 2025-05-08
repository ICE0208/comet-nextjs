export interface ChatItem {
  id: number;
  title: string;
  createdAt: string;
  lastUsedAt: string;
  revisionCount: number;
  icon: string;
}

export type ViewType = "grid" | "list";
export type SortType = "latest" | "created";
