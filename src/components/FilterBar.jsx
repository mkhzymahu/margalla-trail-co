import { LEVELS } from '../data/config.js';
import { SORT_OPTIONS } from '../utils/sessionQuery.js';

export default function FilterBar({ q, level, availableOnly, sort, onChange, onClear, hasActiveFilters }) {
  return (
    <form className="filter-bar" role="search" aria-label="Search and filter hikes" onSubmit={(e) => e.preventDefault()}>
      <div className="filter-grid">
        <div className="field">
          <label htmlFor="q">Search hikes</label>
          <input id="q" type="search" value={q} placeholder="Trail, area or keyword" onChange={(e) => onChange('q', e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="level">Level</label>
          <select id="level" value={level} onChange={(e) => onChange('level', e.target.value)}>
            <option value="all">All levels</option>
            {LEVELS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="sort">Sort by</label>
          <select id="sort" value={sort} onChange={(e) => onChange('sort', e.target.value)}>
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="filter-actions">
        <label className="checkbox">
          <input type="checkbox" checked={availableOnly} onChange={(e) => onChange('avail', e.target.checked ? '1' : '')} />
          <span>Only hikes with seats left</span>
        </label>
        {hasActiveFilters && (
          <button type="button" className="btn btn-secondary" onClick={onClear}>Clear search and filters</button>
        )}
      </div>
    </form>
  );
}