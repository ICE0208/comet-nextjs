import React from "react";
import styles from "./PromptInput.module.css";

const PromptInput = () => (
  <div className={styles.Container}>
    <textarea
      name="inp"
      id="in"
    />
  </div>
);

export default PromptInput;
