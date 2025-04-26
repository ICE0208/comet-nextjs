"use client";
import React, { useState } from "react";
import styles from "./Detail.module.css";

const Detail = () => {
  const [activeMenu, setActiveMenu] = useState("introduction");

  const menuItems = [
    { id: "introduction", name: "소개" },
    { id: "usage", name: "사용 방법" },
    { id: "examples", name: "예시" },
    { id: "faq", name: "자주 묻는 질문" },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <h3 className={styles.sectionTitle}>프롬프트 가이드</h3>
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`${styles.sidebarItem} ${activeMenu === item.id ? styles.sidebarItemActive : ""}`}
            onClick={() => setActiveMenu(item.id)}
          >
            {item.name}
          </div>
        ))}
      </div>

      <div className={styles.content}>
        <h2 className={styles.sectionTitle}>
          {activeMenu === "introduction" && "프롬프트 작성 가이드"}
          {activeMenu === "usage" && "사용 방법"}
          {activeMenu === "examples" && "프롬프트 예시"}
          {activeMenu === "faq" && "자주 묻는 질문"}
        </h2>

        {activeMenu === "introduction" && (
          <>
            <div className={styles.contentBlock}>
              <h3 className={styles.contentBlockTitle}>
                효과적인 프롬프트 작성법
              </h3>
              <p className={styles.contentBlockText}>
                좋은 프롬프트는 구체적이고 명확한 지시를 포함합니다. 원하는
                결과물의 형식, 길이, 스타일에 대한 정보를 포함하면 더 나은
                결과를 얻을 수 있습니다.
              </p>
            </div>
            <div className={styles.contentBlock}>
              <h3 className={styles.contentBlockTitle}>프롬프트 구성 요소</h3>
              <p className={styles.contentBlockText}>
                효과적인 프롬프트에는 다음 요소가 포함됩니다: 명확한 지시문,
                맥락 정보, 예시, 원하는 형식에 대한 설명 등이 있습니다.
              </p>
            </div>
          </>
        )}

        {activeMenu === "usage" && (
          <>
            <div className={styles.contentBlock}>
              <h3 className={styles.contentBlockTitle}>기본 사용법</h3>
              <p className={styles.contentBlockText}>
                프롬프트 입력 창에 원하는 내용을 작성하고, 필요에 따라 옵션을
                선택한 후 제출 버튼을 클릭하세요. 결과는 자동으로 생성되어
                표시됩니다.
              </p>
            </div>
            <div className={styles.contentBlock}>
              <h3 className={styles.contentBlockTitle}>고급 기능</h3>
              <p className={styles.contentBlockText}>
                더 정교한 결과를 얻으려면 체크박스 옵션을 활용하세요. 각 옵션은
                결과물의 특정 측면을 향상시키는 데 도움이 됩니다.
              </p>
            </div>
          </>
        )}

        {activeMenu === "examples" && (
          <>
            <div className={styles.contentBlock}>
              <h3 className={styles.contentBlockTitle}>소설 스타일 예시</h3>
              <p className={styles.contentBlockText}>
                현대 도시에 사는 20대 주인공이 갑자기 시간 여행 능력을 얻게 되는
                이야기를 써주세요. 1인칭 시점으로, 약 500단어 분량으로
                작성해주세요.
              </p>
            </div>
            <div className={styles.contentBlock}>
              <h3 className={styles.contentBlockTitle}>정보 요약 예시</h3>
              <p className={styles.contentBlockText}>
                인공지능의 윤리적 쟁점에 대해 중학생도 이해할 수 있는 수준으로
                5가지 핵심 포인트를 bullet point 형식으로 요약해주세요.
              </p>
            </div>
          </>
        )}

        {activeMenu === "faq" && (
          <>
            <div className={styles.contentBlock}>
              <h3 className={styles.contentBlockTitle}>
                생성된 콘텐츠의 저작권은 누구에게 있나요?
              </h3>
              <p className={styles.contentBlockText}>
                이 서비스를 통해 생성된 콘텐츠는 사용자가 자유롭게 활용할 수
                있습니다. 다만, 생성된 콘텐츠를 활용하여 발생하는 모든 책임은
                사용자에게 있습니다.
              </p>
            </div>
            <div className={styles.contentBlock}>
              <h3 className={styles.contentBlockTitle}>
                결과물을 수정할 수 있나요?
              </h3>
              <p className={styles.contentBlockText}>
                네, 생성된 결과물을 다운로드하여 자유롭게 수정할 수 있습니다.
                또한 새로운 프롬프트를 작성하여 다시 생성할 수도 있습니다.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Detail;
