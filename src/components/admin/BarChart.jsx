import { formatCurrency } from '../../utils/format.js';

export default function BarChart({ data, valueKey = 'revenue', labelKey = 'title' }) {
  const max = Math.max(1, ...data.map((item) => item[valueKey]));
  return (
    <div className="bar-chart">
      {data.length === 0 && <p className="muted">Sin datos para el periodo.</p>}
      {data.map((item) => (
        <div className="bar-chart__row" key={item[labelKey]}>
          <span className="bar-chart__label">{item[labelKey]}</span>
          <div className="bar-chart__track">
            <span
              className="bar-chart__bar"
              style={{ width: `${(item[valueKey] / max) * 100}%` }}
            />
          </div>
          <span className="bar-chart__value">{formatCurrency(item[valueKey])}</span>
        </div>
      ))}
    </div>
  );
}
