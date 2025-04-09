import Link from "next/link";
import styles from "./page.module.css";

export default function SignupPage() {
  return (
    <div className={styles.container}>
      <div className={styles.formBox}>
        <h2 className={styles.title}>계정 만들기</h2>
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
            placeholder="사용할 아이디를 입력하세요"
            className={styles.input}
          />
        </div>
        <div className={styles.inputGroup}>
          <label
            htmlFor="userEmail"
            className={styles.label}
          >
            이메일
          </label>
          <input
            id="userEmail"
            type="email"
            placeholder="이메일을 입력하세요"
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
            placeholder="비밀번호를 입력하세요"
            className={styles.input}
          />
        </div>
        <div className={styles.inputGroup}>
          <label
            htmlFor="userPwConfirm"
            className={styles.label}
          >
            비밀번호 확인
          </label>
          <input
            id="userPwConfirm"
            type="password"
            placeholder="비밀번호를 다시 입력하세요"
            className={styles.input}
          />
        </div>
        <button className={styles.button}>가입하기</button>
        <div className={styles.footer}>
          <p className={styles.footerText}>
            이미 계정이 있으신가요?{" "}
            <Link
              href="/auth/login"
              className={styles.link}
            >
              로그인하기
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
