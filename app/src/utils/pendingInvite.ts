import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'pending_invite_code';

export const pendingInvite = {
  set: (code: string) => AsyncStorage.setItem(KEY, code),
  get: () => AsyncStorage.getItem(KEY),
  clear: () => AsyncStorage.removeItem(KEY),
};
