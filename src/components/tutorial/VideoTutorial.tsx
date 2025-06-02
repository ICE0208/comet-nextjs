"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { tutorialConfig } from "@/config/tutorialConfig";
import styles from "./VideoTutorial.module.css";

interface VideoTutorialProps {
  isOpen: boolean;
  onClose: () => void;
  startStep?: number;
}

const VideoTutorial: React.FC<VideoTutorialProps> = ({
  isOpen,
  onClose,
  startStep = 1,
}) => {
  const [currentStep, setCurrentStep] = useState(startStep);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  const steps = tutorialConfig.steps;
  const currentStepData = steps.find((step) => step.id === currentStep);
  const totalSteps = steps.length;
  const progress = (currentStep / totalSteps) * 100;
  const videoProgress =
    videoDuration > 0 ? (videoCurrentTime / videoDuration) * 100 : 0;

  // 튜토리얼이 열릴 때마다 startStep으로 리셋
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(startStep);
    }
  }, [isOpen, startStep]);

  // 키보드 이벤트 핸들러
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1);
          }
          break;
        case "ArrowRight":
          if (currentStep < totalSteps) {
            setCurrentStep((prev) => prev + 1);
          }
          break;
      }
    },
    [isOpen, currentStep, totalSteps, onClose]
  );

  // 키보드 이벤트 리스너 등록
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // 오버레이 클릭 시 닫기
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 단계 변경 시 비디오 리셋 (깜빡임 최소화)
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      // 새 비디오 로드 시에만 로딩 상태 설정
      if (videoRef.current.src !== currentStepData?.videoUrl) {
        setIsVideoLoading(true);
      }
    }
  }, [currentStep, currentStepData?.videoUrl]);

  // 비디오 로딩 완료 핸들러
  const handleVideoLoad = () => {
    setIsVideoLoading(false);
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
    }
  };

  // 비디오 로딩 시작 핸들러
  const handleVideoLoadStart = () => {
    setIsVideoLoading(true);
  };

  // 비디오 시간을 부드럽게 업데이트하는 함수
  const updateVideoTime = useCallback(() => {
    if (videoRef.current && !videoRef.current.paused) {
      setVideoCurrentTime(videoRef.current.currentTime);
      animationRef.current = requestAnimationFrame(updateVideoTime);
    }
  }, []);

  // 애니메이션 시작/정지
  const startTimeUpdate = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    updateVideoTime();
  }, [updateVideoTime]);

  const stopTimeUpdate = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, []);

  // 비디오 재생 시작 핸들러
  const handlePlay = () => {
    setIsPlaying(true);
    startTimeUpdate();
  };

  // 비디오 일시정지 핸들러
  const handlePause = () => {
    setIsPlaying(false);
    stopTimeUpdate();
  };

  // 비디오 클릭으로 재생/정지 토글
  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  // 비디오 메타데이터 로드 핸들러
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
    }
  };

  // 다음 단계로 이동
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  // 이전 단계로 이동
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // 시간을 mm:ss 형식으로 포맷
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // 컴포넌트 언마운트 시 애니메이션 정리
  useEffect(
    () => () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    },
    []
  );

  if (!isOpen || !currentStepData) return null;

  return (
    <div
      className={styles.overlay}
      onClick={handleOverlayClick}
    >
      <div className={styles.container}>
        {/* 헤더 */}
        <div className={styles.header}>
          <h2 className={styles.title}>사용법 가이드</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="튜토리얼 닫기"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* 진행 상황 바 */}
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* 비디오 영역 */}
        <div className={styles.videoContainer}>
          <div
            className={`${styles.loading} ${!isVideoLoading ? styles.hidden : ""}`}
          >
            <div className={styles.loadingSpinner} />
            <span>영상을 불러오는 중...</span>
          </div>
          <video
            ref={videoRef}
            className={`${styles.video} ${isVideoLoading ? styles.loading : ""}`}
            src={currentStepData.videoUrl}
            autoPlay={tutorialConfig.autoPlay}
            controls={false}
            muted
            loop
            onLoadedData={handleVideoLoad}
            onLoadStart={handleVideoLoadStart}
            onPlay={handlePlay}
            onPause={handlePause}
            onLoadedMetadata={handleLoadedMetadata}
            disablePictureInPicture
            controlsList="nodownload nofullscreen noremoteplayback"
          />
          <div
            className={styles.videoOverlay}
            onClick={handleVideoClick}
          >
            {!isPlaying && (
              <div className={styles.playButton}>
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="white"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* 컨텐츠 영역 */}
        <div className={styles.content}>
          <div className={styles.stepInfo}>
            <span className={styles.stepNumber}>
              {currentStep} / {totalSteps}
            </span>
            <span className={styles.duration}>
              {formatTime(videoCurrentTime)} / {formatTime(videoDuration)}
            </span>
          </div>

          {/* 비디오 프로그레스바 */}
          <div className={styles.videoProgressContainer}>
            <div className={styles.videoProgressBar}>
              <div
                className={styles.videoProgressFill}
                style={{ width: `${videoProgress}%` }}
              />
            </div>
          </div>

          <h3 className={styles.stepTitle}>{currentStepData.title}</h3>

          <p className={styles.stepDescription}>
            {currentStepData.description}
          </p>

          {/* 네비게이션 */}
          <div className={styles.navigation}>
            <button
              className={`${styles.navButton} ${styles.prevButton}`}
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              이전
            </button>

            <button
              className={`${styles.navButton} ${styles.nextButton}`}
              onClick={handleNext}
            >
              {currentStep === totalSteps ? (
                <>
                  완료
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </>
              ) : (
                <>
                  다음
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoTutorial;
