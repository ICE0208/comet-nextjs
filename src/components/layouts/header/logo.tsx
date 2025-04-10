import Image from "next/image";
import styles from "./logo.module.css";
import Link from "next/link";

export default function Logo() {
  return (
    <div className={styles.logo}>
      <Link href="/">
        <Image
          src="/images/header-logo.svg"
          alt="logo"
          width={159}
          height={35}
          className={styles.logoImage}
        />
      </Link>
    </div>
  );
}
