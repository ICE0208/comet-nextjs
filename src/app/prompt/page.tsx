"use client";
import React from "react";
import { useState } from "react";
import styles from "./page.module.css";
import PromptInput from "@/components/prompt/PromptInput";
import PromptOutput from "@/components/prompt/PromptOutput";
import Detail from "@/components/prompt/Detail";

const Page = () => {
  const [submitCount, setSubmitCount] = useState(0);

  // 제출 시 호출될 함수
  const handleSubmit = () => {
    setSubmitCount((prev) => prev + 1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.ioComponents}>
        <PromptInput onSubmitSuccess={handleSubmit} />
        <PromptOutput refreshTrigger={submitCount} />
      </div>
      <Detail />
    </div>
  );
};

export default Page;
