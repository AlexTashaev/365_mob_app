import { useNavigate, useParams } from 'react-router-dom';
import { MONTHS } from '../data/months';
import { getEntriesByMonth } from '../data/index';
import { getBookmarks, makeKey } from '../utils/bookmarks';

export default function MonthDaysScreen() {
  const { monthName } = useParams<{ monthName: string }>();
  const navigate = useNavigate();

  const month = MONTHS.find(m => m.name === monthName);
  const monthEntries = monthName ? getEntriesByMonth(monthName) : [];
  const bookmarks = getBookmarks();

  if (!month) return <div className="page">Месяц не найден</div>;

  return (
    <div className="page">
      <div className="header">
        <button className="back-btn" onClick={() => navigate(-1)}>←</button>
        {month.emoji} {month.name}
        <span style={{ fontSize: 14, opacity: 0.8, marginLeft: 'auto' }}>{month.nameHe}</span>
      </div>

      <div style={{ padding: '12px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: 14 }}>
        {month.description}
      </div>

      <div className="days-grid">
        {monthEntries.map(entry => {
          const key = makeKey(entry.month, entry.day);
          const isBm = bookmarks.has(key);
          return (
            <button
              key={entry.day}
              className={`day-btn ${isBm ? 'bookmarked' : ''}`}
              style={{ borderColor: isBm ? 'var(--bookmark)' : undefined }}
              onClick={() => navigate(`/daily/${monthName}/${entry.day}`)}
            >
              {entry.day}
              {isBm && <span className="bookmark-dot" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
