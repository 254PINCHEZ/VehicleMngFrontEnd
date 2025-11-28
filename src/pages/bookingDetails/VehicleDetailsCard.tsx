import React from 'react';

interface VehicleDetails {
  manufacturer: string;
  model: string;
  year: number;
  fuelType: string;
  seatingCapacity: number;
  transmission: string;
  features: string[];
}

interface VehicleDetailsCardProps {
  vehicle: VehicleDetails;
  image: string;
}

const VehicleDetailsCard: React.FC<VehicleDetailsCardProps> = ({ vehicle, image }) => {
  const getFeatureIcon = (feature: string) => {
    const iconMap: { [key: string]: string } = {
      'Air Conditioning': '❄️',
      'Bluetooth': '📱',
      'Backup Camera': '📹',
      'Cruise Control': '⚡',
      'GPS Navigation': '🧭',
      'Leather Seats': '💺',
      'Sunroof': '🌞',
      'USB Ports': '🔌',
      'Keyless Entry': '🔑',
      'Parking Sensors': '🚨',
      'Apple CarPlay': '📱',
      'Android Auto': '📱',
      'Premium Sound': '🔊',
      'Heated Seats': '🔥',
      'Cooled Seats': '❄️',
    };
    return iconMap[feature] || '✅';
  };

  const getSpecIcon = (spec: string) => {
    const iconMap: { [key: string]: string } = {
      manufacturer: '🏭',
      model: '🚗',
      year: '📅',
      fuelType: '⛽',
      seatingCapacity: '👥',
      transmission: '⚙️',
    };
    return iconMap[spec] || '📋';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center">
          <span className="w-2 h-6 bg-blue-600 rounded-full mr-3"></span>
          Vehicle Details
        </h2>
        <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
          <span className="text-2xl">{image}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Vehicle Specifications */}
        <div className="space-y-6">
          {/* Vehicle Overview */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <h3 className="font-semibold text-slate-900 mb-4 text-sm uppercase tracking-wide flex items-center">
              <span className="w-2 h-4 bg-blue-600 rounded-full mr-2"></span>
              Vehicle Overview
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getSpecIcon('manufacturer')}</span>
                  <span className="text-sm text-slate-600">Manufacturer</span>
                </div>
                <span className="font-semibold text-slate-900">{vehicle.manufacturer}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getSpecIcon('model')}</span>
                  <span className="text-sm text-slate-600">Model</span>
                </div>
                <span className="font-semibold text-slate-900">{vehicle.model}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getSpecIcon('year')}</span>
                  <span className="text-sm text-slate-600">Year</span>
                </div>
                <span className="font-semibold text-slate-900">{vehicle.year}</span>
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
            <h3 className="font-semibold text-slate-900 mb-4 text-sm uppercase tracking-wide flex items-center">
              <span className="w-2 h-4 bg-emerald-600 rounded-full mr-2"></span>
              Technical Specs
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-emerald-100">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getSpecIcon('fuelType')}</span>
                  <span className="text-sm text-slate-600">Fuel Type</span>
                </div>
                <span className="font-semibold text-slate-900 capitalize">{vehicle.fuelType}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-emerald-100">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getSpecIcon('seatingCapacity')}</span>
                  <span className="text-sm text-slate-600">Seating Capacity</span>
                </div>
                <span className="font-semibold text-slate-900">{vehicle.seatingCapacity} people</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-emerald-100">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getSpecIcon('transmission')}</span>
                  <span className="text-sm text-slate-600">Transmission</span>
                </div>
                <span className="font-semibold text-slate-900 capitalize">{vehicle.transmission}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Features & Amenities */}
        <div className="space-y-6">
          {/* Features & Amenities */}
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
            <h3 className="font-semibold text-slate-900 mb-4 text-sm uppercase tracking-wide flex items-center">
              <span className="w-2 h-4 bg-purple-600 rounded-full mr-2"></span>
              Features & Amenities
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {vehicle.features.map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-purple-100 hover:shadow-sm transition-all duration-200"
                >
                  <span className="text-lg flex-shrink-0">{getFeatureIcon(feature)}</span>
                  <span className="text-sm font-medium text-slate-900">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Vehicle Rating & Info */}
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
            <h3 className="font-semibold text-slate-900 mb-4 text-sm uppercase tracking-wide flex items-center">
              <span className="w-2 h-4 bg-amber-600 rounded-full mr-2"></span>
              Vehicle Rating
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Overall Rating</span>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-amber-500">⭐</span>
                  ))}
                  <span className="text-sm font-semibold text-slate-900 ml-2">4.8/5</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Rental Count</span>
                <span className="font-semibold text-slate-900">24 trips</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Vehicle Condition</span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                  Excellent
                </span>
              </div>
            </div>
          </div>

          {/* Safety Information */}
          <div className="bg-red-50 rounded-xl p-4 border border-red-200">
            <h3 className="font-semibold text-slate-900 mb-3 text-sm uppercase tracking-wide flex items-center">
              <span className="w-2 h-4 bg-red-600 rounded-full mr-2"></span>
              Safety Features
            </h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-slate-700">
                <span className="text-red-600">🛡️</span>
                <span>Airbags & ABS Brakes</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-700">
                <span className="text-red-600">🚨</span>
                <span>Stability Control</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-700">
                <span className="text-red-600">📞</span>
                <span>24/7 Roadside Assistance</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Notes */}
      <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-slate-600 text-sm">💡</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-800 mb-1">
              Vehicle Pickup Instructions
            </p>
            <p className="text-slate-600 text-sm">
              Please bring your valid driver's license, the payment method used for booking, 
              and a secondary form of ID for vehicle pickup.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailsCard;