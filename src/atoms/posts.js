import { atom } from 'recoil';

export const storedPosts = atom({
  key: 'storedPosts',
  default: [],
});

export const storedPurchases = atom({
  key: 'storedPurchases',
  default: [],
});

export const storedWishlist = atom({
  key: 'storedWishlist',
  default: [],
});

export const storedUploads = atom({
  key: 'storedUploads',
  default: [],
});

export const storedCourses = atom({
  key: 'storedCourses',
  default: [],
});

export const storedCollections = atom({
  key: 'storedCollections',
  default: [],
});

export const storedFollowing = atom({
  key: 'storedFollowing',
  default: [],
});