import Image from "next/image";
import styles from "./styles.module.css";

export default function NovelThumbnailList({
  data,
  title,
}: {
  data: {
    title: string;
    author: string;
    description: string;
    thumbnail: string;
  }[];
  title: string;
}) {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.divider} />
      <div className={styles.list}>
        {data.map((item) => (
          <div
            key={item.title}
            className={styles.item}
          >
            <Image
              src={item.thumbnail}
              alt={item.title}
              width={100}
              height={300}
              className={styles.thumbnail}
            />
            <p className={styles.itemTitle}>{item.title}</p>
            <p className={styles.author}>{item.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
