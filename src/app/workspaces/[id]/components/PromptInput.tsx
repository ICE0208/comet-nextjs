"use client";
import React, { useState } from "react";
import styles from "./PromptInput.module.css";
import { usePromptStore } from "@/store/promptStore";
import { submitWork } from "../actions";

interface PromptInputProps {
  workspaceId: string;
  savedInputText: string;
}

const PromptInput = ({
  workspaceId,
  savedInputText: savedText,
}: PromptInputProps) => {
  const [text, setText] = useState<string>(savedText);
  const [checkboxOptions, setCheckboxOptions] = useState([
    { id: "checkbox1", name: "문법 교정", state: false },
    { id: "checkbox2", name: "맞춤법 교정", state: false },
    { id: "checkbox3", name: "가독성 향상", state: false },
    { id: "checkbox4", name: "문체 개선", state: false },
    { id: "checkbox5", name: "일관성 유지", state: false },
  ]);
  const setOutputData = usePromptStore((state) => state.actions.setOutputData);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  // 활성화된 체크박스 추출 함수
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
      .map((option) => option.name);

    try {
      const newAIResponse = await submitWork(
        workspaceId,
        text,
        selectedOptions
      );

      setOutputData(newAIResponse);
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
