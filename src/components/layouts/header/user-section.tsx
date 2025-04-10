import { UserInfo } from "@/lib/auth";
import styles from "./user-section.module.css";
import ProfileDropdown from "./profile-dropdown";

interface UserSectionProps {
  user: UserInfo;
}

export default function UserSection({ user }: UserSectionProps) {
  return (
    <div className={styles.userSection}>
      {user && (
        <div className={styles.userInfo}>
          <span className={styles.userName}>{user.userId}</span>
        </div>
      )}
      <ProfileDropdown user={user} />
    </div>
  );
}
