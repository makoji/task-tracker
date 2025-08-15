import { Search } from 'lucide-react';
import { FILTER_OPTIONS } from '../utils/constants.js';

// let the user view tasks based on specific filters established beforehand
// (categories, priority level - could later on add dates or by person it's assigned by too)
export default function FilterBar({ filters, onFiltersChange }) {
  const handleFilterChange = (key, value) => {
    onFiltersChange(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="filters-container">
      <div className="filters-grid">
        <div>
          <label className="form-label">Search</label>
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="form-search"
            />
          </div>
        </div>
        
        <div>
          <label className="form-label">Category</label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="form-select"
          >
            <option value="all">All Categories</option>
            {FILTER_OPTIONS.categories.slice(1).map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="form-label">Priority</label>
          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            className="form-select"
          >
            <option value="all">All Priorities</option>
            {FILTER_OPTIONS.priorities.slice(1).map(priority => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="form-label">Status</label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="form-select"
          >
            {FILTER_OPTIONS.statuses.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}