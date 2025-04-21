import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { SentimentData, SentimentState } from '../../types/sentiment';

// 초기 상태 정의
const initialState: SentimentState = {
  data: [],
  loading: false,
  error: null,
};

// 비동기 액션 생성
export const fetchSentimentData = createAsyncThunk(
  'sentiment/fetchData',
  async (query: string, { rejectWithValue }) => {
    try {
      // API 호출은 나중에 추가될 것입니다
      const response = await fetch(`/api/sentiment?query=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('서버 에러 발생');
      }
      const data = await response.json();
      return data as SentimentData[];
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSentimentData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSentimentData.fulfilled, (state, action: PayloadAction<SentimentData[]>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchSentimentData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSentimentData } = sentimentSlice.actions;
export const sentimentReducer = sentimentSlice.reducer;
