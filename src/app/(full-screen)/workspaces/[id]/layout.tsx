import type { Metadata } from "next";
import { getWorkspaceById } from "./actions";
import { WorkspacePageProps } from "./types";

export async function generateMetadata({
  params,
}: WorkspacePageProps): Promise<Metadata> {
  try {
    const workspace = await getWorkspaceById((await params).id);

    return {
      title: workspace.title || "작업공간",
      description: `${workspace.title}에서 AI와 함께 소설을 창작하고 있습니다. Comet에서 당신만의 이야기를 만들어보세요.`,
      keywords: ["작업공간", "소설 창작", "AI 창작", "Comet", workspace.title],
      openGraph: {
        title: `${workspace.title} | Comet`,
        description: `${workspace.title}에서 AI와 함께 소설을 창작하고 있습니다.`,
        type: "website",
      },
      robots: {
        index: false,
        follow: false,
      },
    };
  } catch {
    return {
      title: "작업공간",
      description: "AI와 함께 소설을 창작하세요.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

export default function WorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
