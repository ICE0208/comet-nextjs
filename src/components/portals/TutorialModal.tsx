import React, { useState } from "react";
import styles from "./TutorialModal.module.css";
import ReactPortal from "./ReactPortal";
import TutorialSteps, { TutorialStep } from "../tutorial/TutorialSteps";
import { updateUserTutorialStatus } from "@/app/(page)/workspaces/actions";

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const tutorialSteps: TutorialStep[] = [
  {
    title: "작업 생성하기",
    content:
      "왼쪽 상단의 '새 작업 만들기' 버튼을 클릭하여 새로운 작업을 시작할 수 있습니다.",
    step: 1,
    position: {
      top: 125,
      bottom: 1,
      left: 1,
      right: 420,
    },
    // 새 작업 만들기 버튼
    targetSelector: "button[class*='createButton']",
  },
  {
    title: "작업 확인하기",
    content:
      "각 작업 카드를 통해 해당 작업의 요약 정보를 확인할 수 있고, 작업 카드를 클릭하여 작업 상세 페이지로 이동할 수 있습니다.",
    step: 2,
    position: {
      top: 125,
      bottom: 1,
      left: 1,
      right: 1400,
    },
    // 뷰 토글 버튼들을 하이라이트
    targetSelector: "div[class*='card']:first-child",
  },
  {
    title: "작업 관리하기",
    content:
      "그리드 또는 리스트 뷰로 작업을 확인하고, 정렬 방식을 선택할 수 있습니다.",
    step: 3,
    position: {
      top: 125,
      bottom: 1,
      left: 1,
      right: 1400,
    },
    // 뷰 토글 버튼들을 하이라이트
    targetSelector: "div[class*='rightControls']",
  },
  {
    title: "작업 편집하기",
    content:
      "각 작업 카드의 옵션 메뉴를 통해 이름 변경과 삭제 작업을 수행할 수 있습니다.",
    step: 4,
    position: {
      top: 225,
      bottom: 1,
      left: 1,
      right: 680,
    },
    // 작업 카드의 옵션 메뉴 버튼
    targetSelector: "div[class*='card']:first-child button[class*='optionBtn']",
  },
  {
    title: "작업 현황 확인하기",
    content:
      "각 모드별 작업 현황을 확인할 수 있습니다. 새로고침 버튼을 클릭하여 작업 현황을 업데이트 할 수 있습니다.",
    step: 5,
    position: {
      top: 225,
      bottom: 1,
      left: 1,
      right: 680,
    },
    // 작업 카드의 옵션 메뉴 버튼
    targetSelector: "div[class*='queueSection']",
  },
  {
    title: "도움말",
    content:
      "도움말 버튼을 클릭하여 튜토리얼을 다시 볼 수 있습니다. 언제든지 도움말을 확인하세요",
    step: 6,
    position: {
      top: 95,
      bottom: 1,
      left: 1,
      right: 100,
    },
    // 도움말 버튼
    targetSelector: "button[class*='helpButton']",
  },
];

const TutorialModal = ({ isOpen, onClose }: TutorialModalProps) => {
  const [step, setStep] = useState<number>(1);

  const currentStep =
    tutorialSteps.find((s) => s.step === step) || tutorialSteps[0];

  const handleNextStep = async () => {
    if (step < tutorialSteps.length) {
      setStep(step + 1);
    } else {
      // 튜토리얼 완료 시 isTutorial 상태 업데이트
      await updateUserTutorialStatus();
      onClose();
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <ReactPortal>
      <div className={styles.overlay} />
      <TutorialSteps {...currentStep} />

      {/* 하단에 고정된 네비게이션 버튼 */}
      <div className={styles.fixedNavigation}>
        <button
          className={styles.fixedPrevButton}
          style={{
            opacity: step === 1 ? 0.5 : 1,
            cursor: step === 1 ? "not-allowed" : "pointer",
          }}
          disabled={step === 1}
          onClick={step === 1 ? undefined : handlePrevStep}
        >
          이전
        </button>

        <span className={styles.stepCounter}>
          {step} / {tutorialSteps.length}
        </span>

        <button
          className={styles.fixedNextButton}
          onClick={handleNextStep}
        >
          {step === tutorialSteps.length ? "완료" : "다음"}
        </button>
      </div>
    </ReactPortal>
  );
};

export default TutorialModal;
