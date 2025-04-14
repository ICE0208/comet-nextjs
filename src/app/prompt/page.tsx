import React from "react";
import styles from "./page.module.css";
import PromptInput from "@/components/prompt/PromptInput";
import PromptOutput from "@/components/prompt/PromptOutput";

const page = () => (
  <div className={styles.container}>
    <div className={styles.ioComponents}>
      <PromptInput />
      <PromptOutput />
    </div>
  </div>
);

export default page;
