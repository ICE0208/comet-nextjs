"use client";
import React, { useState } from "react";
import styles from "./PromptInput.module.css";

const PromptInput = () => {
  const [text, setText] = useState<string>("");
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<string[]>([]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleCheckboxChange = (id: string) => {
    setSelectedCheckboxes((prev: string[]) =>
      prev.includes(id)
        ? prev.filter((checkboxId) => checkboxId !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    const data = {
      text,
      selectedCheckboxes,
    };

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit data");
      }

      alert("Data submitted successfully!");
    } catch {
      alert("An error occurred while submitting data.");
    }
  };

  return (
    <div className={styles.container}>
      <textarea
        name="inp"
        id="in"
        className={styles.textarea}
        value={text}
        onChange={handleTextareaChange}
        placeholder="입력해주세요..."
      />
      <div className={styles.checkboxContainer}>
        <div className={styles.checkboxOptionsGroup}>
          {["checkbox1", "checkbox2", "checkbox3"].map((option) => (
            <div
              key={option}
              className={styles.checkboxWrapper}
            >
              <input
                type="checkbox"
                id={option}
                className={styles.checkbox}
                checked={selectedCheckboxes.includes(option)}
                onChange={() => handleCheckboxChange(option)}
              />
              <label
                htmlFor={option}
                className={styles.checkboxLabel}
              >
                {option}
              </label>
            </div>
          ))}
        </div>
        <button
          className={styles.submitButton}
          onClick={handleSubmit}
        >
          제출하기
        </button>
      </div>
    </div>
  );
};

export default PromptInput;
