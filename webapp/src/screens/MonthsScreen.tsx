import { useNavigate } from 'react-router-dom';
import { MONTHS } from '../data/months';
import { getEntriesByMonth } from '../data/index';

export default function MonthsScreen() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <div className="header">Календарь</div>
      {MONTHS.map(m => (
        <div key={m.name} className="card" onClick={() => navigate(`/month/${m.name}`)}>
          <div className="month-card">
            <div className="month-icon" style={{ background: m.color }}>
              {m.emoji}
            </div>
            <div className="month-info">
              <div className="he-name">{m.nameHe}</div>
              <h3>{m.name}</h3>
              <p>{m.description} · {getEntriesByMonth(m.name).length} дней</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
