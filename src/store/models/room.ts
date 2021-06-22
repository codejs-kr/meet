import { createModel } from '@rematch/core';
import { RootModel } from './';

interface RoomState {
  connectedSocket: boolean;
  participants: any[];
}

const initialState: RoomState = {
  connectedSocket: false,
  participants: [],
};

export const room = createModel<RootModel>()({
  state: initialState,
  selectors: (slice, createSelector) => ({
    state() {
      return slice;
    },
  }),
  reducers: {
    connectSocket(state, payload: boolean) {
      state.connectedSocket = payload;
      return state;
    },
    setParticipants(state, payload: any[]) {
      state.participants = payload;
      return state;
    },
  },
  effects: (dispatch) => ({
    incrementAsync(payload: number, state) {
      dispatch.count.increment(payload);
    },
  }),
});
