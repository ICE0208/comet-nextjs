import React from "react";
import { novelInfoData } from "./actions";
import NovelInfoItemList from "@/components/novel-info/NovelInfoItemList";
import NovelInfo from "@/components/novel-info/NovelInfo";
import styles from "./page.module.css";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export type Novel = Awaited<ReturnType<typeof novelInfoData>>;

const NovelInfoPage = async ({ params }: Props) => {
  const { id } = await params;
  const getNovelInfoData: Novel = await novelInfoData(id);
  const novel = getNovelInfoData;

  return (
    <main className={styles.container}>
      <NovelInfo novel={novel} />
      {novel && <NovelInfoItemList novel={novel} />}
    </main>
  );
};

export default NovelInfoPage;
