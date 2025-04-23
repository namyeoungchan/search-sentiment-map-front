import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { SentimentData, SentimentState } from '../../types/sentiment';

// 샘플 데이터 추가
const sampleData: SentimentData[] = [
  {
    id: '1',
    query: '여행',
    location: '제주특별자치도',
    sentiment: 'positive',
    score: 0.85,
    timestamp: new Date().toISOString(),
    keywords: ['해변', '휴식', '관광']
  },
  {
    id: '2',
    query: '교통',
    location: '경기도',
    sentiment: 'negative',
    score: 0.72,
    timestamp: new Date().toISOString(),
    keywords: ['체증', '지연', '혼잡']
  },
  {
    id: '3',
    query: '축제',
    location: '전라남도',
    sentiment: 'positive',
    score: 0.91,
    timestamp: new Date().toISOString(),
    keywords: ['문화', '전통', '이벤트']
  },
  {
    id: '4',
    query: '물가',
    location: '경상북도',
    sentiment: 'neutral',
    score: 0.51,
    timestamp: new Date().toISOString(),
    keywords: ['상승', '변동', '경제']
  }
];

// 초기 상태 정의
const initialState: SentimentState = {
  data: sampleData, // 샘플 데이터로 초기화
  loading: false,
  error: null,
};

// 비동기 액션 생성
export const fetchSentimentData = createAsyncThunk(
  'sentiment/fetchData',
  async (query: string, { rejectWithValue }) => {
    try {
      // 실제 API가 구현되기 전까지는 샘플 데이터로 모의 응답
      // 실제 구현 시 아래 코드로 대체
      // const response = await fetch(`/api/sentiment?query=${encodeURIComponent(query)}`);
      // if (!response.ok) {
      //   throw new Error('서버 에러 발생');
      // }
      // const data = await response.json();
      
      // 모의 API 응답 (쿼리에 따라 다른 데이터 반환)
      await new Promise(resolve => setTimeout(resolve, 800)); // API 지연 시간 모의
      
      const mockData: SentimentData[] = [
        {
          id: Date.now().toString(),
          query: query,
          location: '강원도',
          sentiment: 'positive',
          score: 0.78,
          timestamp: new Date().toISOString(),
          keywords: [query, '산', '관광']
        },
        {
          id: (Date.now() + 1).toString(),
          query: query,
          location: '충청북도',
          sentiment: 'negative',
          score: 0.65,
          timestamp: new Date().toISOString(),
          keywords: [query, '이슈', '문제']
        }
      ];
      
      return mockData;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// 슬라이스 생성
const sentimentSlice = createSlice({
  name: 'sentiment',
  initialState,
  reducers: {
    clearSentimentData: (state) => {
      state.data = [];
    },
    // 샘플 데이터 복원 액션 추가
    resetToSampleData: (state) => {
      state.data = sampleData;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSentimentData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSentimentData.fulfilled, (state, action: PayloadAction<SentimentData[]>) => {
        state.loading = false;
        // 기존 데이터에 새 데이터 추가 (대체가 아님)
        // 동일 지역이 있으면 새 데이터로 교체
        const newData = action.payload;
        const updatedData = [...state.data];
        
        newData.forEach(newItem => {
          const existingIndex = updatedData.findIndex(
            item => item.location === newItem.location
          );
          
          if (existingIndex >= 0) {
            updatedData[existingIndex] = newItem;
          } else {
            updatedData.push(newItem);
          }
        });
        
        state.data = updatedData;
      })
      .addCase(fetchSentimentData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSentimentData, resetToSampleData } = sentimentSlice.actions;
export const sentimentReducer = sentimentSlice.reducer;