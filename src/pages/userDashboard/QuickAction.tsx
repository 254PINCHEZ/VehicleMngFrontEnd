import React from 'react';
import { Link } from 'react-router-dom';

const QuickActions: React.FC = () => {
  const quickActions = [
    {
      title: 'Book New Vehicle',
      description: 'Find and reserve your next ride',
      icon: '🚗',
      color: 'blue',
      href: '/inventory',
      action: 'Browse',
    },
    {
      title: 'Manage Profile',
      description: 'Update your personal information',
      icon: '👤',
      color: 'emerald',
      href: '/dashboard/profile',
      action: 'Edit',
    },
    {
      title: 'Get Support',
      description: '24/7 customer assistance',
      icon: '💬',
      color: 'violet',
      href: '/dashboard/support',
      action: 'Contact',
    },
    {
      title: 'Payment Methods',
      description: 'Manage your payment options',
      icon: '💳',
      color: 'amber',
      href: '/dashboard/profile#payment',
      action: 'Manage',
    },
  ];

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: { bg: string; icon: string; hover: string } } = {
      blue: {
        bg: 'bg-blue-50 border-blue-200',
        icon: 'bg-blue-100 text-blue-600',
        hover: 'hover:bg-blue-100 hover:border-blue-300',
      },
      emerald: {
        bg: 'bg-emerald-50 border-emerald-200',
        icon: 'bg-emerald-100 text-emerald-600',
        hover: 'hover:bg-emerald-100 hover:border-emerald-300',
      },
      violet: {
        bg: 'bg-violet-50 border-violet-200',
        icon: 'bg-violet-100 text-violet-600',
        hover: 'hover:bg-violet-100 hover:border-violet-300',
      },
      amber: {
        bg: 'bg-amber-50 border-amber-200',
        icon: 'bg-amber-100 text-amber-600',
        hover: 'hover:bg-amber-100 hover:border-amber-300',
      },
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
      <div className="flex items-center mb-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center">
          <span className="w-2 h-6 bg-blue-600 rounded-full mr-3"></span>
          Quick Actions
        </h2>
      </div>

      <div className="space-y-4">
        {quickActions.map((action, index) => {
          const colorClasses = getColorClasses(action.color);
          
          return (
            <Link
              key={action.title}
              to={action.href}
              className={`
                flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 group
                ${colorClasses.bg} ${colorClasses.hover}
                hover:scale-[1.02] hover:shadow-md
              `}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses.icon} group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-xl">{action.icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 group-hover:text-slate-800 transition-colors duration-200">
                    {action.title}
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    {action.description}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors duration-200">
                  {action.action}
                </span>
                <svg 
                  className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all duration-200" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Additional Quick Stats */}
      <div className="mt-8 pt-6 border-t border-slate-200">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="text-lg font-bold text-slate-900">12</div>
            <div className="text-xs text-slate-600">Vehicles Available</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="text-lg font-bold text-slate-900">24/7</div>
            <div className="text-xs text-slate-600">Support</div>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-red-600 text-sm">🆘</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">Emergency Assistance</p>
            <p className="text-xs text-red-700">Available 24/7 for urgent issues</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;