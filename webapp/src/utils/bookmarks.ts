const BOOKMARKS_KEY = 'prayers365_bookmarks';
const LAST_READ_KEY = 'prayers365_last_read';

export type BookmarkKey = string;

export const makeKey = (month: string, day: number): BookmarkKey => `${month}:${day}`;

export const getBookmarks = (): Set<BookmarkKey> => {
  const raw = localStorage.getItem(BOOKMARKS_KEY);
  if (!raw) return new Set();
  return new Set(JSON.parse(raw));
};

export const toggleBookmark = (key: BookmarkKey): boolean => {
  const bookmarks = getBookmarks();
  if (bookmarks.has(key)) {
    bookmarks.delete(key);
  } else {
    bookmarks.add(key);
  }
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify([...bookmarks]));
  return bookmarks.has(key);
};

export const isBookmarked = (key: BookmarkKey): boolean => {
  return getBookmarks().has(key);
};

export const saveLastRead = (month: string, day: number): void => {
  localStorage.setItem(LAST_READ_KEY, JSON.stringify({ month, day }));
};

export const getLastRead = (): { month: string; day: number } | null => {
  const raw = localStorage.getItem(LAST_READ_KEY);
  if (!raw) return null;
  return JSON.parse(raw);
};
