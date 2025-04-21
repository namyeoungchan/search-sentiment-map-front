// 감성 분석 데이터 타입
export interface SentimentData {
  id: string;
  query: string;
  location: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  timestamp: string;
  keywords?: string[];
}

// 감성 분석 상태 타입
export interface SentimentState {
  data: SentimentData[];
  loading: boolean;
  error: string | null;
}
