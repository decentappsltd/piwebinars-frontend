import { atom } from 'https://cdn.skypack.dev/recoil';

export const appSelectionState = atom({
  key: 'appSelectionState',
  default: "explore",
});

export const appPageState = atom({
  key: 'appPageState',
  default: "home",
});

export const postsScrollState = atom({
  key: 'postsScrollState',
  default: "false",
});