import AsyncStorage from '@react-native-async-storage/async-storage';

const BOOKMARKS_KEY = 'bookmarks';
const LAST_READ_KEY = 'last_read';

export type BookmarkKey = string; // "month:day"

export const makeKey = (month: string, day: number): BookmarkKey => `${month}:${day}`;

export const getBookmarks = async (): Promise<Set<BookmarkKey>> => {
  const raw = await AsyncStorage.getItem(BOOKMARKS_KEY);
  if (!raw) return new Set();
  return new Set(JSON.parse(raw));
};

export const toggleBookmark = async (key: BookmarkKey): Promise<boolean> => {
  const bookmarks = await getBookmarks();
  if (bookmarks.has(key)) {
    bookmarks.delete(key);
  } else {
    bookmarks.add(key);
  }
  await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify([...bookmarks]));
  return bookmarks.has(key);
};

export const isBookmarked = async (key: BookmarkKey): Promise<boolean> => {
  const bookmarks = await getBookmarks();
  return bookmarks.has(key);
};

export const saveLastRead = async (month: string, day: number): Promise<void> => {
  await AsyncStorage.setItem(LAST_READ_KEY, JSON.stringify({ month, day }));
};

export const getLastRead = async (): Promise<{ month: string; day: number } | null> => {
  const raw = await AsyncStorage.getItem(LAST_READ_KEY);
  if (!raw) return null;
  return JSON.parse(raw);
};
