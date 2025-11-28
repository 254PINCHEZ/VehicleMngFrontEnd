import React from 'react';


interface BookingFiltersProps {
  activeFilter: 'all' | 'upcoming' | 'active' | 'completed' | 'cancelled';
  onFilterChange: (filter: 'all' | 'upcoming' | 'active' | 'completed' | 'cancelled') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  stats: {
    total: number;
    upcoming: number;
    active: number;
    completed: number;
    cancelled: number;
  };
}

const BookingFilters: React.FC<BookingFiltersProps> = ({
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  stats,
}) => {
  const filters = [
    { key: 'all' as const, label: 'All Bookings', count: stats.total, color: 'slate' },
    { key: 'upcoming' as const, label: 'Upcoming', count: stats.upcoming, color: 'emerald' },
    { key: 'active' as const, label: 'Active', count: stats.active, color: 'blue' },
    { key: 'completed' as const, label: 'Completed', count: stats.completed, color: 'green' },
    { key: 'cancelled' as const, label: 'Cancelled', count: stats.cancelled, color: 'red' },
  ];

  const getFilterClasses = (filterKey: string, isActive: boolean) => {
    const baseClasses = "flex items-center space-x-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border-2 ";
    
    if (isActive) {
      const activeClasses = {
        all: "bg-slate-100 border-slate-300 text-slate-900 shadow-sm",
        upcoming: "bg-emerald-100 border-emerald-300 text-emerald-900 shadow-sm",
        active: "bg-blue-100 border-blue-300 text-blue-900 shadow-sm", 
        completed: "bg-green-100 border-green-300 text-green-900 shadow-sm",
        cancelled: "bg-red-100 border-red-300 text-red-900 shadow-sm",
      };
      return baseClasses + (activeClasses[filterKey as keyof typeof activeClasses] || activeClasses.all);
    }

    return baseClasses + "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm";
  };

  const getCountBadgeClasses = (color: string) => {
    const colorMap = {
      slate: "bg-slate-200 text-slate-700",
      emerald: "bg-emerald-200 text-emerald-700",
      blue: "bg-blue-200 text-blue-700",
      green: "bg-green-200 text-green-700", 
      red: "bg-red-200 text-red-700",
    };
    return `inline-flex items-center justify-center min-w-8 h-6 px-1.5 rounded-full text-xs font-semibold ${colorMap[color as keyof typeof colorMap] || colorMap.slate}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by vehicle name or type..."
              className="input input-bordered w-full pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg className="h-5 w-5 text-slate-400 hover:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => onFilterChange(filter.key)}
              className={getFilterClasses(filter.key, activeFilter === filter.key)}
            >
              <span>{filter.label}</span>
              <span className={getCountBadgeClasses(filter.color)}>
                {filter.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Filters Display */}
      {(searchQuery || activeFilter !== 'all') && (
        <div className="mt-4 flex items-center space-x-3">
          <span className="text-sm text-slate-600">Active filters:</span>
          <div className="flex flex-wrap gap-2">
            {activeFilter !== 'all' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                {filters.find(f => f.key === activeFilter)?.label}
                <button
                  onClick={() => onFilterChange('all')}
                  className="ml-1.5 hover:text-blue-900 transition-colors"
                >
                  ×
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                Search: "{searchQuery}"
                <button
                  onClick={() => onSearchChange('')}
                  className="ml-1.5 hover:text-slate-900 transition-colors"
                >
                  ×
                </button>
              </span>
            )}
          </div>
          <button
            onClick={() => {
              onFilterChange('all');
              onSearchChange('');
            }}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingFilters;