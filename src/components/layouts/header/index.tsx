import Image from "next/image";
import styles from "./styles.module.css";

export default function Header() {
  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <Image
          src="/images/header-logo.svg"
          alt="logo"
          width={159}
          height={35}
          style={{ width: "100%", height: "auto" }}
        />
      </div>
      <div className={styles.profile}>
        <Image
          src="/images/profile-temp/profile.jpg"
          alt="profile"
          width={30}
          height={30}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    </div>
  );
}
