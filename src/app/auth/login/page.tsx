import Link from "next/link";
import styles from "./page.module.css";

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <div className={styles.formBox}>
        <h2 className={styles.title}>로그인</h2>
        <div className={styles.inputGroup}>
          <label
            htmlFor="userId"
            className={styles.label}
          >
            아이디
          </label>
          <input
            id="userId"
            type="text"
            placeholder="아이디를 입력하세요."
            className={styles.input}
          />
        </div>
        <div className={styles.inputGroup}>
          <label
            htmlFor="userPw"
            className={styles.label}
          >
            비밀번호
          </label>
          <input
            id="userPw"
            type="password"
            placeholder="비밀번호를 입력하세요."
            className={styles.input}
          />
        </div>
        <button className={styles.button}>Log In</button>
        <div className={styles.footer}>
          <p className={styles.footerText}>
            계정이 없으신가요?{" "}
            <Link
              href="/auth/signup"
              className={styles.link}
            >
              계정 만들기
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
