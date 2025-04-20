import React from "react";
import styles from "./Checkbox.module.css";

interface CheckboxProps {
  key: string;
  checkboxId: string;
  checkboxLabel: string;
}

const Checkbox = ({ key, checkboxId, checkboxLabel }: CheckboxProps) => (
  <div className={styles.checkboxWrapper}>
    <label
      htmlFor={checkboxId}
      className={styles.checkboxLabel}
    >
      {checkboxLabel}
    </label>
    <input
      type="checkbox"
      name="checkbox"
      value="checkbox"
      id={key}
      className={styles.checkbox}
    />
  </div>
);

export default Checkbox;
