import { createModel } from '@rematch/core';
import { RootModel } from './';

interface RoomState {
  isEnteredRoom: boolean;
  isConnectedSocket: boolean;
  userInfo: any | null;
  participants: any | null;
  remoteVideos: any[];
}

const initialState: RoomState = {
  isEnteredRoom: false,
  isConnectedSocket: false,
  userInfo: null,
  participants: null,
  remoteVideos: [],
};

export const room = createModel<RootModel>()({
  state: initialState,
  selectors: (slice, createSelector) => ({
    state: () => slice,
  }),
  reducers: {
    updateSocketConnectionState(state, payload: boolean) {
      state.isConnectedSocket = payload;
      return state;
    },
    updateEnteredRoomState(state, payload: boolean) {
      state.isEnteredRoom = payload;
      return state;
    },
    updateParticipants(state, payload: {}) {
      state.participants = payload;
      return state;
    },
    setUserInfo(state, payload: {}) {
      state.userInfo = payload;
      return state;
    },
    addRemoteVideo(state, payload: MediaStream) {
      state.remoteVideos.push(payload);
      return state;
    },
  },
  effects: (dispatch) => ({
    incrementAsync(payload: number, state) {
      dispatch.count.increment(payload);
    },
  }),
});
