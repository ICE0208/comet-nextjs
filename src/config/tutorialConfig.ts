import { VideoTutorialConfig } from "@/types/tutorial";

export const tutorialConfig: VideoTutorialConfig = {
  autoPlay: true,
  showControls: true,
  steps: [
    {
      id: 1,
      title: "교정 시작하기",
      description:
        "교정할 텍스트를 입력한 뒤 [교정하기] 버튼을 클릭하세요.\nPro 모드를 선택하면 속도는 느리지만 더 정확한 교정 결과를 얻을 수 있습니다.\n\n* 현재 Pro 모드는 무료 베타로 제공됩니다.",
      videoUrl: "/videos/tutorial/1.mp4",
    },
    {
      id: 2,
      title: "교정 결과 받기",
      description:
        "잠시 기다리면 교정 결과가 도착합니다.\n기본 모드에서는 결과가 실시간으로 스트리밍됩니다.\n\n* Pro 모드에서는 스트리밍을 지원하지 않습니다.",
      videoUrl: "/videos/tutorial/2.mp4",
    },
    {
      id: 3,
      title: "교정 결과 확인하기",
      description:
        "초록색으로 표시된 문장이 교정된 부분입니다.\n마우스를 올리면 원래 문장과 수정된 문장을 비교할 수 있으며, 수정 이유도 함께 확인할 수 있습니다.",
      videoUrl: "/videos/tutorial/3.mp4",
    },
    {
      id: 4,
      title: "교정 결과 적용하기",
      description:
        "원하는 부분만 선택해 반영하거나, 전체를 반영할 수 있습니다.\n[반영 무시하기]를 클릭하면 해당 교정을 건너뛰며,\n[전부 반영하기] 또는 [부분 반영하기]를 통해 수정 내용을 적용할 수 있습니다.",
      videoUrl: "/videos/tutorial/4.mp4",
    },
    {
      id: 5,
      title: "작업 이어하기",
      description:
        "교정 결과를 반영한 후에도 작업을 계속할 수 있습니다.\n다시 [교정하기] 버튼을 클릭하여 다음 교정을 진행하세요.",
      videoUrl: "/videos/tutorial/5.mp4",
    },
    {
      id: 6,
      title: "작업 내역 확인하기",
      description:
        "우측 상단의 목록 버튼을 클릭하면 이전 작업 내역을 확인할 수 있습니다.\n즐겨찾기에 추가하거나 제목을 변경할 수도 있습니다.",
      videoUrl: "/videos/tutorial/6.mp4",
    },
    {
      id: 7,
      title: "작업 현황 확인하기",
      description:
        "좌측 상단에서 기본 모드와 Pro 모드의 작업 현황을 확인할 수 있습니다.\n작업 수가 한도에 도달한 경우 해당 모드로는 교정할 수 없습니다.\n\n* 우측 새로고침 버튼으로 최신 상태를 불러올 수 있습니다.",
      videoUrl: "/videos/tutorial/7.mp4",
    },
    {
      id: 8,
      title: "도움말 다시 보기",
      description:
        "도움말을 다시 보고 싶다면 우측 상단의 도움말 버튼을 클릭하세요.",
      videoUrl: "/videos/tutorial/8.mp4",
    },
  ],
};
