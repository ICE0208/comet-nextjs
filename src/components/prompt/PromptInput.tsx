"use client";
import React, { useState } from "react";
import styles from "./PromptInput.module.css";

const PromptInput = () => {
  const [text, setText] = useState<string>("");
  const [checkboxOptions, setCheckboxOptions] = useState([
    { id: "checkbox1", name: "문법 교정", state: false },
    { id: "checkbox2", name: "맞춤법 교정", state: false },
    { id: "checkbox3", name: "가독성 향상", state: false },
    { id: "checkbox4", name: "문체 개선", state: false },
    { id: "checkbox5", name: "일관성 유지", state: false },
  ]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleCheckboxChange = (id: string) => {
    setCheckboxOptions((prevOptions) =>
      prevOptions.map((option) =>
        option.id === id ? { ...option, state: !option.state } : option
      )
    );
  };

  const handleSubmit = async () => {
    const selectedOptions = checkboxOptions
      .filter((option) => option.state)
      .map((option) => option.id);

    const data = {
      text,
      selectedOptions,
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
          {checkboxOptions.map((option) => (
            <div
              key={option.id}
              className={styles.checkboxWrapper}
            >
              <input
                type="checkbox"
                id={option.id}
                className={styles.checkbox}
                checked={option.state}
                onChange={() => handleCheckboxChange(option.id)}
              />
              <label
                htmlFor={option.id}
                className={styles.checkboxLabel}
              >
                {option.name}
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
