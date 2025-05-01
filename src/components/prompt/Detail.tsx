"use client";
import React, { useState } from "react";
import styles from "./Detail.module.css";
import { usePromptStore } from "@/store/promptStore";

const Detail = () => {
  const [activeMenu, setActiveMenu] = useState("introduction");
  const outputData = usePromptStore((state) => state.outputData);

  // options 추출
  const menuItems =
    outputData?.options.map((option) => ({
      id: option.optionId,
      name: option.optionName,
    })) || [];

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <h3 className={styles.sectionTitle}>세부사항</h3>
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

      <div className={styles.content} />
    </div>
  );
};

export default Detail;
