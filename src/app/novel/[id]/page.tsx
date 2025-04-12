import React from "react";
import { getNovelInfoData } from "@/app/actions";
import NovelInfoItemList from "@/components/novel-info/NovelInfoItemList";
import NovelInfo from "@/components/novel-info/NovelInfo";
import styles from "./page.module.css";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

interface Novels {
  novels: NovelInfoData[];
}

interface NovelInfoData {
  id: string;
  title: string;
  author: string;
  like: boolean;
  description: string;
  thumbnail: string;
  episode: Episode[];
}

interface Episode {
  id: string;
  title: string;
  date: string;
  rating: number;
  thumbnail?: string;
}

// 서버 컴포넌트로 데이터를 가져오고, 클라이언트 컴포넌트를 렌더링
const NovelInfoPage = async ({ params }: Props) => {
  const { id } = await params;
  const novelInfoData: Novels = await getNovelInfoData();
  const novels = novelInfoData.novels;
  const novel = novels.find((novel) => novel.id === id);

  return (
    <main className={styles.container}>
      <NovelInfo novel={novel} />
      {novel ? <NovelInfoItemList novel={novel} /> : null}
    </main>
  );
};

export default NovelInfoPage;
