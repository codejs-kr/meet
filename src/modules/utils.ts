import { v4 as uuidv4 } from 'uuid';
import { throttle } from 'lodash-es';

const REPEAT_HOLD_TIME = 1000;
const THROTTLE_OPTIONS = {
  trailing: false, // throttle 후행 이벤트 발동 설정
};

/**
 * UUID를 반환합니다.
 */
export const getUuid = () => {
  return uuidv4();
};

/**
 * 이벤트 쓰로틀이 적용된 함수를 반환합니다.
 * @param func
 * @returns
 */
export const getThrottledFunc = (func: any) => {
  return throttle(func, REPEAT_HOLD_TIME, THROTTLE_OPTIONS);
};
