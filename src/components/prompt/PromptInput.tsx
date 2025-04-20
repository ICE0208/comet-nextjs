import React from "react";
import styles from "./PromptInput.module.css";
import CheckboxList from "./CheckboxList";

const PromptInput = () => (
  <div className={styles.container}>
    <textarea
      name="inp"
      id="in"
      className={styles.textarea}
    />
    <div className={styles.checkboxContainer}>
      <CheckboxList />
    </div>
  </div>
);

export default PromptInput;
