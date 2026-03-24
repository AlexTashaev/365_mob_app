import { useNavigate } from 'react-router-dom';
import { MONTHS } from '../data/months';
import { getEntry, getRandomEntry, getTotalEntries } from '../data/index';
import { getLastRead } from '../utils/bookmarks';

export default function HomeScreen() {
  const navigate = useNavigate();
  const lastRead = getLastRead();
  const lastEntry = lastRead ? getEntry(lastRead.month, lastRead.day) : null;

  const handleRandom = () => {
    const entry = getRandomEntry();
    navigate(`/daily/${entry.month}/${entry.day}`);
  };

  return (
    <div className="page">
      <div className="hero">
        <h1>365 Молитв</h1>
        <p>Ежедневные каббалистические молитвы</p>
        <p style={{ marginTop: 4, opacity: 0.7 }}>{getTotalEntries()} записей по еврейскому календарю</p>
      </div>

      {lastEntry && (
        <div
          className="continue-card"
          onClick={() => navigate(`/daily/${lastEntry.month}/${lastEntry.day}`)}
        >
          <div className="label">Продолжить чтение</div>
          <h3>{lastEntry.title}</h3>
          <p>{lastEntry.month}, день {lastEntry.day}</p>
        </div>
      )}

      <div className="random-card" onClick={handleRandom}>
        <span className="dice">🎲</span>
        <span className="text">Случайная молитва</span>
      </div>

      <div className="section-title">Месяцы</div>
      <div className="months-grid">
        {MONTHS.map(m => (
          <div
            key={m.name}
            className="month-chip"
            style={{ background: m.color }}
            onClick={() => navigate(`/month/${m.name}`)}
          >
            <span className="emoji">{m.emoji}</span>
            {m.name}
          </div>
        ))}
      </div>
    </div>
  );
}
