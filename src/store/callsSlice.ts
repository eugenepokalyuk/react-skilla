import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchCalls } from '../api/callsApi';

interface CallsState {
    calls: any[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: CallsState = {
    calls: [],
    status: 'idle',
    error: null,
};

export const fetchCallsAsync: any = createAsyncThunk('calls/fetchCalls', async (params: any) => {
    const response = await fetchCalls(params);
    return response.results;
});

const callsSlice = createSlice({
    name: 'calls',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCallsAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCallsAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.calls = action.payload;
            })
            .addCase(fetchCallsAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            });
    },
});

export default callsSlice.reducer;