export interface VideoTutorialStep {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
}

export interface VideoTutorialConfig {
  steps: VideoTutorialStep[];
  autoPlay?: boolean;
  showControls?: boolean;
}
