import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getEntry, getEntriesByMonth } from '../data/index';
import { MONTHS } from '../data/months';
import { makeKey, toggleBookmark, isBookmarked, saveLastRead } from '../utils/bookmarks';

export default function DailyScreen() {
  const { monthName, day } = useParams<{ monthName: string; day: string }>();
  const navigate = useNavigate();
  const dayNum = Number(day);
  const entry = monthName ? getEntry(monthName, dayNum) : undefined;
  const [bookmarked, setBookmarked] = useState(false);

  const month = MONTHS.find(m => m.name === monthName);
  const monthEntries = monthName ? getEntriesByMonth(monthName) : [];

  useEffect(() => {
    if (monthName && dayNum) {
      setBookmarked(isBookmarked(makeKey(monthName, dayNum)));
      saveLastRead(monthName, dayNum);
    }
    window.scrollTo(0, 0);
  }, [monthName, dayNum]);

  if (!entry || !month) return <div className="page">Запись не найдена</div>;

  const currentIndex = monthEntries.findIndex(e => e.day === dayNum);
  const prevEntry = currentIndex > 0 ? monthEntries[currentIndex - 1] : null;
  const nextEntry = currentIndex < monthEntries.length - 1 ? monthEntries[currentIndex + 1] : null;

  const handleBookmark = () => {
    const key = makeKey(entry.month, entry.day);
    const result = toggleBookmark(key);
    setBookmarked(result);
  };

  const handleShare = () => {
    const text = `📖 ${entry.title}\n${entry.month}, день ${entry.day}\n\n✨ Луч Света:\n${entry.light}\n\n🌿 Мудрость Дня:\n${entry.wisdom}${entry.prayer ? `\n\n🙏 Молитва:\n${entry.prayer}` : ''}`;

    if (window.Telegram?.WebApp) {
      // Share via Telegram
      window.Telegram.WebApp.switchInlineQuery(entry.title, ['users', 'groups', 'channels']);
    } else if (navigator.share) {
      navigator.share({ title: entry.title, text });
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="daily-page">
      <div className="daily-header" style={{ background: `linear-gradient(135deg, ${month.color}, ${month.color}dd)` }}>
        <div className="top-row">
          <button className="back-btn" onClick={() => navigate(`/month/${monthName}`)}>←</button>
          <button className="bookmark-btn" onClick={handleBookmark}>
            {bookmarked ? '★' : '☆'}
          </button>
        </div>
        <h1>{entry.title}</h1>
        <div className="meta">{month.emoji} {entry.month} · День {entry.day} · Стр. {entry.page}</div>
      </div>

      {entry.light && (
        <div className="section">
          <div className="section-label">✨ Луч Света</div>
          <div className="section-text">{entry.light}</div>
        </div>
      )}

      {entry.wisdom && (
        <div className="section">
          <div className="section-label">🌿 Мудрость Дня</div>
          <div className="section-text">{entry.wisdom}</div>
        </div>
      )}

      {entry.prayer && (
        <div className="section">
          <div className="section-label">🙏 Молитва</div>
          <div className="section-text">{entry.prayer}</div>
        </div>
      )}

      <div className="daily-nav">
        {prevEntry ? (
          <button className="prev-btn" onClick={() => navigate(`/daily/${monthName}/${prevEntry.day}`)}>
            ← День {prevEntry.day}
          </button>
        ) : <div />}
        {nextEntry ? (
          <button className="next-btn" onClick={() => navigate(`/daily/${monthName}/${nextEntry.day}`)}>
            День {nextEntry.day} →
          </button>
        ) : <div />}
      </div>

      <button className="share-btn" onClick={handleShare}>
        Поделиться
      </button>
    </div>
  );
}
