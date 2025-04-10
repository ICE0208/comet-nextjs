import { getNovelData } from "@/app/actions";
import NovelItemList from "@/components/novel/NovelItemList";
import NovelCategories from "@/components/novel/NovelCategories";
import BestsellerRow from "@/components/novel/BestsellerRow";
import styles from "./page.module.css";

export default async function NovelPage() {
  const novelData = await getNovelData();

  // You would typically fetch these categories from your API
  const categories = [
    { id: "all", name: "전체" },
    { id: "fantasy", name: "판타지" },
    { id: "romance", name: "로멘스" },
    { id: "scifi", name: "과학" },
    { id: "life", name: "일상" },
    { id: "mystery", name: "미스테리" },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Our Web Novel Collection</h1>
        <p className={styles.subtitle}>Discover your next favorite story</p>
      </div>

      <BestsellerRow novels={novelData.novelAll} />

      <NovelCategories
        categories={categories}
        activeCategory="all"
      />

      <NovelItemList data={novelData.novelAll} />
    </div>
  );
}
