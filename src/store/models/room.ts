import { createModel } from '@rematch/core';
import { RootModel } from './';
import { values } from 'lodash-es';

interface VideoState {
  userId: string;
  stream: MediaStream;
  videoEnabled: boolean;
  audioEnabled: boolean;
}
interface RoomState {
  isEnteredRoom: boolean;
  isConnectedSocket: boolean;
  userInfo: any | null;
  participants: any[];
  videos: VideoState[];
}

const initialState: RoomState = {
  isEnteredRoom: false,
  isConnectedSocket: false,
  userInfo: null,
  participants: [],
  videos: [],
};

export const room = createModel<RootModel>()({
  state: initialState,
  selectors: (slice, createSelector) => ({
    state: () => slice,
    localVideoState: () =>
      createSelector(slice, ({ userInfo, videos }) => {
        if (userInfo) {
          return videos.find((info) => info.userId === userInfo.userId);
        }
        return null;
      }),
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
    setParticipants(state, payload: {}) {
      const arr = values(payload);
      state.participants = arr;
      return state;
    },
    setUserInfo(state, payload: {}) {
      state.userInfo = payload;
      return state;
    },
    addVideo(state, payload: VideoState) {
      state.videos.push(payload);
      return state;
    },
    muteVideo(state, payload: { userId: string }) {
      state.videos.forEach((video) => {
        if (video.userId === payload.userId) {
          video.videoEnabled = false;
        }
      });
      return state;
    },
    unmuteVideo(state, payload: { userId: string }) {
      state.videos.forEach((video) => {
        if (video.userId === payload.userId) {
          video.videoEnabled = true;
        }
      });
      return state;
    },
  },
  effects: (dispatch) => ({
    incrementAsync(payload: number, state) {
      dispatch.count.increment(payload);
    },
  }),
});
