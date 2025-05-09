import Image from "next/image";
import styles from "./page.module.css";
import IconMenu from "@/components/icon-menu";
import MainNovelItems from "@/components/main-page/MainNovelItems";
import IntroSection from "@/components/main-page/IntroSection";
import { novelData } from "./actions";
import Link from "next/link";

export type Novels = Awaited<ReturnType<typeof novelData>>;

export const Home = async () => {
  const novelsData: Novels = await novelData();
  const navItems = [
    {
      href: "/workspaces",
      icon: "/icons/magic.svg",
      description: "교열",
    },
    {
      href: "/workspaces",
      icon: "/icons/write.svg",
      description: "창작하기",
    },
    {
      href: "/novel",
      icon: "/icons/book-open.svg",
      description: "소설",
    },
    {
      href: "/workspaces",
      icon: "/icons/question-circle.svg",
      description: "FAQ",
    },
  ];

  return (
    <main>
      <div className={styles.mainImage}>
        <Image
          src="/images/main-image.webp"
          alt="main"
          fill
          priority
          style={{ objectFit: "cover" }}
        />
        <div className={styles.mainImageCover} />
        <div className={styles.tryToDemo}>
          <div className={styles.tryToDemoTitle}>교열 해보기</div>
          <div className={styles.tryToDemoInputContainer}>
            <input
              type="text"
              placeholder="책 제목을 입력해주세요"
            />
            <div>📖</div>
          </div>
        </div>
      </div>
      <IntroSection />
      <div className={styles.navContainer}>
        {navItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={styles.navItem}
          >
            <IconMenu
              svgPath={item.icon}
              description={item.description}
            />
          </Link>
        ))}
      </div>
      <div className={styles.novelContainer}>
        <MainNovelItems
          title="인기"
          data={novelsData}
        />
        <div style={{ marginBottom: "40px" }} />
        <MainNovelItems
          title="최신"
          data={novelsData}
        />
        <div style={{ marginBottom: "40px" }} />
      </div>
    </main>
  );
};
export default Home;
