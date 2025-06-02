"use client";

import { UserInfo } from "@/lib/auth";
import styles from "./profile-dropdown.module.css";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { logout } from "./actions";

interface ProfileDropdownProps {
  user: UserInfo | null;
}

export default function ProfileDropdown({ user }: ProfileDropdownProps) {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 프로필 이미지 클릭 핸들러
  const handleProfileClick = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // dropdownRef.current가 null이 아닌지 확인하고, 타입 검사를 더 안전하게 수행
      if (
        dropdownRef.current &&
        event.target instanceof Node &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 메뉴 항목 클릭 핸들러
  const handleMenuItemClick = async (path: string) => {
    setIsDropdownOpen(false); // 드롭다운 닫기
    router.push(path);
  };

  // 로그아웃 핸들러
  const handleLogout = async () => {
    setIsDropdownOpen(false); // 드롭다운 닫기
    await logout(); // 로그아웃 서버 액션 호출
  };

  return (
    <div
      className={styles.profileContainer}
      ref={dropdownRef}
    >
      <div
        className={styles.profile}
        onClick={handleProfileClick}
      >
        {user ? (
          <Image
            src="/images/profile-temp/profile.jpg"
            alt="profile"
            width={30}
            height={30}
            className={styles.profileImage}
          />
        ) : (
          <Image
            src="/images/profile-temp/no-login.png"
            alt="profile"
            width={30}
            height={30}
            className={styles.profileImage}
          />
        )}
      </div>

      {isDropdownOpen && (
        <div className={styles.dropdown}>
          <ul className={styles.dropdownList}>
            {user ? (
              <>
                <div
                  className={styles.dropdownItem}
                  onClick={() => handleMenuItemClick("/profile")}
                >
                  마이페이지
                </div>
                <li className={styles.dropdownDivider} />
                {/* <div
                  className={styles.dropdownItem}
                  onClick={() => handleMenuItemClick("/settings")}
                >
                  설정
                </div> */}
                <li className={styles.dropdownDivider} />
                <div
                  className={styles.dropdownItem}
                  onClick={handleLogout}
                >
                  로그아웃
                </div>
              </>
            ) : (
              <>
                <div
                  className={styles.dropdownItem}
                  onClick={() => handleMenuItemClick("/auth/login")}
                >
                  로그인
                </div>
                <div
                  className={styles.dropdownItem}
                  onClick={() => handleMenuItemClick("/auth/signup")}
                >
                  회원가입
                </div>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
