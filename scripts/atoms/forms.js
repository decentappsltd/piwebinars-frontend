import { atom } from 'https://cdn.skypack.dev/recoil';

export const searchValue = atom({
  key: 'searchValue',
  default: "",
});