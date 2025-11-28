import React from 'react';

interface StatsCardsProps {
  stats: {
    totalBookings: number;
    upcomingTrips: number;
    completedRentals: number;
    totalSpent: number;
  };
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const statItems = [
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: '📅',
      color: 'blue',
      description: 'All-time rentals',
    },
    {
      title: 'Upcoming Trips',
      value: stats.upcomingTrips,
      icon: '🚀',
      color: 'emerald',
      description: 'Scheduled rentals',
    },
    {
      title: 'Completed Rentals',
      value: stats.completedRentals,
      icon: '✅',
      color: 'green',
      description: 'Finished trips',
    },
    {
      title: 'Total Spent',
      value: `$${stats.totalSpent}`,
      icon: '💰',
      color: 'violet',
      description: 'All rental costs',
    },
  ];

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: string } = {
      blue: 'bg-blue-50 border-blue-200 text-blue-700',
      emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
      green: 'bg-green-50 border-green-200 text-green-700',
      violet: 'bg-violet-50 border-violet-200 text-violet-700',
    };
    return colorMap[color] || colorMap.blue;
  };

  const getIconBgClasses = (color: string) => {
    const colorMap: { [key: string]: string } = {
      blue: 'bg-blue-100 text-blue-600',
      emerald: 'bg-emerald-100 text-emerald-600',
      green: 'bg-green-100 text-green-600',
      violet: 'bg-violet-100 text-violet-600',
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <>
      {statItems.map((stat, index) => (
        <div
          key={stat.title}
          className={`bg-white rounded-xl border p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group`}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-600 mb-1">
                {stat.title}
              </p>
              <p className="text-2xl font-bold text-slate-900 mb-2">
                {stat.value}
              </p>
              <p className="text-xs text-slate-500">
                {stat.description}
              </p>
            </div>
            
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getIconBgClasses(stat.color)} group-hover:scale-110 transition-transform duration-300`}>
              <span className="text-lg">{stat.icon}</span>
            </div>
          </div>

          {/* Progress bar for visual interest */}
          <div className="mt-4">
            <div className="w-full bg-slate-200 rounded-full h-1">
              <div 
                className={`h-1 rounded-full ${getIconBgClasses(stat.color).replace('bg-', 'bg-').replace(' text-', '')}`}
                style={{ 
                  width: `${Math.min((stat.value as number / (index === 3 ? 2000 : 20)) * 100, 100)}%` 
                }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default StatsCards;