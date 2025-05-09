import Image from "next/image";
import styles from "./MainNovelItems.module.css";
import { Novels } from "@/app/page";

interface NovelItems {
  title: string;
  data: Novels;
}

const MainNovelItems = ({ title, data }: NovelItems) => (
  <div className={styles.container}>
    <h3 className={styles.title}>{title}</h3>
    <div className={styles.divider} />
    <div className={styles.list}>
      {data.map((item) => (
        <div
          key={item.id}
          className={styles.item}
        >
          <Image
            src={item.imageUrl}
            alt={item.title}
            width={100}
            height={300}
            className={styles.thumbnail}
          />
          <p className={styles.itemTitle}>{item.title}</p>
          <p className={styles.author}>{item.author.userId}</p>
        </div>
      ))}
    </div>
  </div>
);
export default MainNovelItems;
