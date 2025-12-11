import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import { useGetAllVehiclesQuery } from "../API/VehicleAPI";

const Inventory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState("name");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  const { data: vehicles = [], isLoading, error } = useGetAllVehiclesQuery();

  const filteredVehicles = vehicles
    .filter(vehicle => {
      const matchesSearch = 
        (vehicle.vehicle_spec?.model?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (vehicle.vehicle_spec?.manufacturer?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      
      const matchesAvailability = !showAvailableOnly || vehicle.availability;

      return matchesSearch && matchesAvailability;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.rental_rate - b.rental_rate;
        case "price-high":
          return b.rental_rate - a.rental_rate;
        case "year-new":
          return (b.vehicle_spec?.year || 0) - (a.vehicle_spec?.year || 0);
        case "year-old":
          return (a.vehicle_spec?.year || 0) - (b.vehicle_spec?.year || 0);
        default:
          return (a.vehicle_spec?.manufacturer || '').localeCompare(b.vehicle_spec?.manufacturer || '');
      }
    });

  const handleInquiry = (model: string) => {
    alert(`Inquiry sent for: ${model}\nOur team will contact you shortly!`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
            <p className="text-gray-600">Loading our premium vehicle collection...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Connection Error</h3>
            <p className="text-gray-600 mb-4">Unable to load vehicles. Please check your backend connection.</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
            >
              Retry
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-blue-800 text-white pt-24 pb-12 px-8 text-center">
        <h1 className="text-4xl md:text-5xl mb-4 font-bold">
          🚗 Our Premium Vehicle Collection
        </h1>
        <p className="text-xl max-w-2xl mx-auto leading-relaxed opacity-90">
          Browse our carefully curated fleet featuring real images of each vehicle.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 md:p-8 border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-4 items-center justify-center">
          {/* Search Bar */}
          <div className="flex-1 min-w-64 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="🔍 Search by make, model, or year..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 border-2 border-gray-300 rounded-full text-base outline-none transition-colors duration-300 focus:border-blue-600 focus:shadow-lg"
              />
              <div className="absolute left-4 top-3.5 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Sort By */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border-2 border-gray-300 rounded-lg text-base bg-white cursor-pointer outline-none focus:border-blue-600 appearance-none pr-10"
            >
              <option value="name">Sort by Make</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="year-new">Year: Newest First</option>
              <option value="year-old">Year: Oldest First</option>
            </select>
            <div className="absolute right-3 top-3.5 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Available Only Toggle */}
          <label className="flex items-center gap-3 cursor-pointer text-base bg-gray-100 hover:bg-gray-200 px-4 py-3 rounded-lg transition-colors">
            <div className="relative">
              <input
                type="checkbox"
                checked={showAvailableOnly}
                onChange={(e) => setShowAvailableOnly(e.target.checked)}
                className="sr-only"
              />
              <div className={`block w-12 h-6 rounded-full transition-colors ${showAvailableOnly ? 'bg-green-500' : 'bg-gray-400'}`}>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${showAvailableOnly ? 'transform translate-x-6' : ''}`}></div>
              </div>
            </div>
            <span className="font-medium">Available Only</span>
          </label>
        </div>
      </div>

      {/* Results Count */}
      <div className="py-4 px-8 bg-white text-center border-b border-gray-200">
        <p className="text-lg text-gray-600 m-0">
          Showing <span className="font-bold text-blue-600">{filteredVehicles.length}</span> vehicle{filteredVehicles.length !== 1 ? 's' : ''}
          {searchTerm && ` matching "${searchTerm}"`}
        </p>
      </div>

      {/* Vehicles Grid */}
      <div className="flex-1 p-4 md:p-8 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
          {filteredVehicles.length === 0 ? (
            <div className="text-center col-span-full py-16 px-8 bg-white rounded-xl shadow-sm">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl mb-2 text-gray-700 font-semibold">
                No vehicles found
              </h3>
              <p className="text-gray-500 mb-6">
                Try adjusting your search or filters
              </p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setShowAvailableOnly(false);
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            filteredVehicles.map(vehicle => (
              <div
                key={vehicle.vehicle_id}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl border border-gray-200 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image Section */}
                <div className="relative h-56 bg-gray-100 overflow-hidden">
                  {vehicle.vehicle_spec?.image_url ? (
                    <>
                      <img 
                        src={vehicle.vehicle_spec.image_url} 
                        alt={`${vehicle.vehicle_spec.manufacturer} ${vehicle.vehicle_spec.model}`}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        onError={(e) => {
                          // Image failed to load - show fallback
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            e.currentTarget.style.display = 'none';
                            const fallback = document.createElement('div');
                            fallback.className = 'absolute inset-0 flex flex-col items-center justify-center';
                            fallback.innerHTML = `
                              <div class="text-5xl mb-2">🚗</div>
                              <div class="text-sm text-gray-600 text-center px-4">
                                <div class="font-medium">${vehicle.vehicle_spec?.manufacturer || ''} ${vehicle.vehicle_spec?.model || ''}</div>
                                <div class="text-xs mt-1">Image not available</div>
                              </div>
                            `;
                            parent.appendChild(fallback);
                          }
                        }}
                      />
                      {/* Loading indicator for images */}
                      <div className="absolute inset-0 bg-gray-200 animate-pulse" style={{ display: 'none' }}></div>
                    </>
                  ) : (
                    // No image URL provided - show emoji placeholder
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <div className="text-6xl mb-3">🚗</div>
                      <div className="text-center px-4">
                        <div className="font-medium text-gray-800">
                          {vehicle.vehicle_spec?.manufacturer || ''} {vehicle.vehicle_spec?.model || ''}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {vehicle.vehicle_spec?.year || ''}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Availability Badge */}
                  <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-md ${
                    vehicle.availability ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {vehicle.availability ? '✅ Available' : '❌ Unavailable'}
                  </div>

                  {/* Year Badge */}
                  <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-md">
                    {vehicle.vehicle_spec?.year || 'N/A'}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {vehicle.vehicle_spec?.manufacturer} {vehicle.vehicle_spec?.model}
                  </h3>

                  {/* Vehicle Specifications */}
                  <div className="grid grid-cols-2 gap-3 mb-5 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">👥</span>
                      <span>{vehicle.vehicle_spec?.seating_capacity || "N/A"} seats</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">⛽</span>
                      <span>{vehicle.vehicle_spec?.fuel_type || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">🎨</span>
                      <span className="capitalize">{vehicle.vehicle_spec?.color?.toLowerCase() || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">⚙️</span>
                      <span>{vehicle.vehicle_spec?.transmission || "N/A"}</span>
                    </div>
                  </div>

                  {/* Features Preview */}
                  {vehicle.vehicle_spec?.features && (
                    <div className="mb-5">
                      <p className="text-xs text-gray-500 mb-1">Features:</p>
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {vehicle.vehicle_spec.features.length > 100 
                          ? vehicle.vehicle_spec.features.substring(0, 100) + '...'
                          : vehicle.vehicle_spec.features}
                      </p>
                    </div>
                  )}

                  {/* Price and Action Buttons */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        ${vehicle.rental_rate.toFixed(2)}
                        <span className="text-sm font-normal text-gray-500"> /day</span>
                      </div>
                      {vehicle.location?.name && (
                        <div className="text-xs text-gray-500 mt-1">
                          📍 {vehicle.location.name}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Link 
                        to={`/vehicles/${vehicle.vehicle_id}`}
                        className="px-4 py-2 bg-blue-50 text-blue-600 font-semibold rounded-lg hover:bg-blue-100 transition-colors text-sm border border-blue-100"
                      >
                        Details
                      </Link>
                      <button
                        onClick={() => handleInquiry(`${vehicle.vehicle_spec?.manufacturer} ${vehicle.vehicle_spec?.model}`)}
                        disabled={!vehicle.availability}
                        className={`px-4 py-2 font-semibold rounded-lg transition-colors text-sm ${
                          vehicle.availability 
                            ? 'bg-green-600 hover:bg-green-700 text-white' 
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {vehicle.availability ? "Inquire" : "Unavailable"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Empty State Message */}
        {filteredVehicles.length > 0 && filteredVehicles.every(v => !v.vehicle_spec?.image_url) && (
          <div className="mt-8 text-center max-w-2xl mx-auto bg-blue-50 border border-blue-100 rounded-lg p-6">
            <div className="text-4xl mb-3">🖼️</div>
            <h4 className="text-lg font-semibold text-blue-800 mb-2">Want to see real vehicle images?</h4>
            <p className="text-blue-700 mb-4">
              Many vehicles in our inventory don't have images yet. Our team is working hard to add real photos for each vehicle.
            </p>
            <div className="text-sm text-blue-600">
              <p>✅ Some vehicles already have real images</p>
              <p>🚗 Others show emoji placeholders</p>
            </div>
          </div>
        )}

        {/* Image Status Summary */}
        {filteredVehicles.length > 0 && (
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              Showing {filteredVehicles.filter(v => v.vehicle_spec?.image_url).length} vehicles with images • 
              {filteredVehicles.filter(v => !v.vehicle_spec?.image_url).length} with emoji placeholders
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Inventory;