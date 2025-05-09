import Image from "next/image";
import styles from "./styles.module.css";

interface IconMenuProps {
  svgPath: string;
  description: string;
}

export default function IconMenu({ svgPath, description }: IconMenuProps) {
  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>
        <Image
          src={svgPath}
          alt="icon"
          width={32}
          height={32}
        />
      </div>
      <div>{description}</div>
    </div>
  );
}
