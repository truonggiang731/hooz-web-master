import {createSlice} from '@reduxjs/toolkit';
import {Tokens} from '../services/Types';

interface SessionState {
  tokens: null | Tokens;
  role: number;
  isRefreshing: boolean;
}

const initialState: SessionState = {
  tokens: null,
  role: 0,
  isRefreshing: false
}

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setTokens: (state, action) => {
      state.tokens = action.payload ? { access_token: action.payload.access_token, refresh_token: action.payload.refresh_token } : null;
      state.role = action.payload ? action.payload.role : 0;
    },
    setIsRefreshing: (state, action) => {
      state.isRefreshing = action.payload;
    }
  }
})

export const { setTokens, setIsRefreshing } = sessionSlice.actions;

export default sessionSlice.reducer
