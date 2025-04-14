import React from "react";
import styles from "./PromptOutput.module.css";
import Summary from "./Summary";

const PromptOutput = () => (
  <div className={styles.container}>
    <div className={styles.outputContainer}>output</div>
    <div className={styles.summaryContainer}>
      <Summary />
    </div>
  </div>
);

export default PromptOutput;
