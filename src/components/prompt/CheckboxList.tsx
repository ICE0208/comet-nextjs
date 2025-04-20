import React from "react";
import styles from "./CheckboxList.module.css";
import Checkbox from "./Checkbox";

interface CheckboxProps {
  id: string;
  label: string;
}

const CheckboxList = () => {
  const checkboxes = [
    { id: "checkbox1", label: "맞춤법 교정" },
    { id: "checkbox2", label: "문법 교정" },
    { id: "checkbox3", label: "가독성 향상" },
    { id: "checkbox4", label: "문체 개선" },
    { id: "checkbox5", label: "일관성 유지" },
  ];
  return (
    <div className={styles.container}>
      {checkboxes.map((checkbox: CheckboxProps) => (
        <Checkbox
          key={checkbox.id}
          checkboxId={checkbox.id}
          checkboxLabel={checkbox.label}
        />
      ))}
      <button className={styles.button}>제출</button>
    </div>
  );
};

export default CheckboxList;
