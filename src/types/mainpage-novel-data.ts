export interface MainPageNovelData {
  top10: Top10[];
  recommend: Recommend[];
}

export interface Top10 {
  title: string;
  author: string;
  description: string;
  thumbnail: string;
}

export interface Recommend {
  title: string;
  author: string;
  description: string;
  thumbnail: string;
}
