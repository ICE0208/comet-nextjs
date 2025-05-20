import { Prisma } from "@prisma/client";

export type WorkItem = Prisma.WorkspaceGetPayload<{
  select: {
    id: true;
    title: true;
    createdAt: true;
    lastUsedAt: true;
    _count: {
      select: { history: true };
    };
  };
}>;

export type ViewType = "grid" | "list";
export type SortType = "latest" | "created";
