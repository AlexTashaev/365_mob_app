import { useNavigate } from 'react-router-dom';
import { getBookmarks } from '../utils/bookmarks';
import { getEntry } from '../data/index';
import { MONTHS } from '../data/months';

export default function BookmarksScreen() {
  const navigate = useNavigate();
  const bookmarks = getBookmarks();

  const bookmarkedEntries = [...bookmarks].map(key => {
    const [month, dayStr] = key.split(':');
    const day = Number(dayStr);
    const entry = getEntry(month, day);
    return entry;
  }).filter(Boolean);

  return (
    <div className="page">
      <div className="header">Закладки</div>
      {bookmarkedEntries.length === 0 ? (
        <div className="empty-state">
          <div className="icon">☆</div>
          <h3>Нет закладок</h3>
          <p>Нажмите ★ при чтении, чтобы сохранить молитву</p>
        </div>
      ) : (
        bookmarkedEntries.map(entry => {
          if (!entry) return null;
          const month = MONTHS.find(m => m.name === entry.month);
          return (
            <div
              key={`${entry.month}:${entry.day}`}
              className="card"
              onClick={() => navigate(`/daily/${entry.month}/${entry.day}`)}
            >
              <div className="bookmark-entry">
                <span className="star">★</span>
                <div className="info">
                  <h3>{entry.title}</h3>
                  <p>{month?.emoji} {entry.month} · День {entry.day}</p>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
