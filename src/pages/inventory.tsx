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
        (vehicle.vehicle_spec?.model?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      
      const matchesAvailability = !showAvailableOnly || vehicle.availability;

      return matchesSearch && matchesAvailability;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.rental_rate - b.rental_rate;
        case "price-high":
          return b.rental_rate - a.rental_rate;
        default:
          return (a.vehicle_spec?.model || '').localeCompare(b.vehicle_spec?.model || '');
      }
    });

  const handleInquiry = (model: string) => {
    alert(`Inquiry sent for: ${model}\nOur team will contact you shortly!`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* <Navbar /> */}
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
            <p className="text-gray-600">Loading our premium vehicle collection...</p>
          </div>
        </div>
        {/* <Footer /> */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* <Navbar /> */}
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
        {/* <Footer /> */}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-blue-800 text-white pt-16 pb-8 px-8 text-center">
        <h1 className="text-5xl mb-4 font-bold">
          🚗 Our Premium Vehicle Collection
        </h1>
        <p className="text-xl max-w-2xl mx-auto leading-relaxed opacity-90">
          Discover our carefully curated fleet featuring the best vehicles for your rental needs.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-50 p-8 border-b border-gray-200">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-4 items-center justify-center">
          {/* Search Bar */}
          <div className="flex-1 min-w-64 max-w-96">
            <input
              type="text"
              placeholder="🔍 Search vehicles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-full text-base outline-none transition-colors duration-300 focus:border-blue-800"
            />
          </div>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 border-2 border-gray-300 rounded-lg text-base bg-white cursor-pointer outline-none focus:border-blue-800"
          >
            <option value="name">📝 Sort by Name</option>
            <option value="price-low">💰 Price: Low to High</option>
            <option value="price-high">💎 Price: High to Low</option>
          </select>

          {/* Available Only Toggle */}
          <label className="flex items-center gap-2 cursor-pointer text-base">
            <input
              type="checkbox"
              checked={showAvailableOnly}
              onChange={(e) => setShowAvailableOnly(e.target.checked)}
              className="scale-125"
            />
            ✅ Available Only
          </label>
        </div>
      </div>

      {/* Results Count */}
      <div className="py-4 px-8 bg-white text-center border-b border-gray-200">
        <p className="text-lg text-gray-500 m-0">
          Found {filteredVehicles.length} vehicle{filteredVehicles.length !== 1 ? 's' : ''}
          {searchTerm && ` matching "${searchTerm}"`}
        </p>
      </div>

      {/* Vehicles Grid */}
      <div className="flex-1 p-8 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {filteredVehicles.length === 0 ? (
            <div className="text-center col-span-full py-16 px-8 text-gray-500">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl mb-2 text-gray-700">
                No vehicles found
              </h3>
              <p className="text-base">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            filteredVehicles.map(vehicle => (
              <div
                key={vehicle.vehicle_id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200 transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-2"
              >
                {/* Image Section */}
                <div className="relative bg-gray-200 h-48 flex items-center justify-center">
                  <div className="text-6xl">🚗</div>
                  
                  {/* Availability Badge */}
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white ${
                    vehicle.availability ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {vehicle.availability ? '✅ Available' : '❌ Unavailable'}
                  </div>

                  {/* Year Badge */}
                  <div className="absolute top-4 left-4 bg-blue-800 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {vehicle.vehicle_spec?.year || 'N/A'}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl text-blue-800 mb-2 font-bold">
                    {vehicle.vehicle_spec?.manufacturer} {vehicle.vehicle_spec?.model}
                  </h3>

                  {/* Vehicle Specifications */}
                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <span>👥</span>
                      <span>{vehicle.vehicle_spec?.seating_capacity || "N/A"} seats</span>
                    </div>
                    <div className="flex items-center">
                      <span>⛽</span>
                      <span>{vehicle.vehicle_spec?.fuel_type || "N/A"}</span>
                    </div>
                    <div className="flex items-center">
                      <span>🎨</span>
                      <span>{vehicle.vehicle_spec?.color || "N/A"}</span>
                    </div>
                    <div className="flex items-center">
                      <span>⚙️</span>
                      <span>{vehicle.vehicle_spec?.transmission || "N/A"}</span>
                    </div>
                  </div>

                  {/* Price and Action Buttons */}
                  <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold text-green-600">
                      ${vehicle.rental_rate}
                      <p className="text-xs text-gray-500">per day</p>
                    </div>

                    <div className="flex space-x-2">
                      <Link 
                        to={`/vehicles/${vehicle.vehicle_id}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 text-sm"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => handleInquiry(`${vehicle.vehicle_spec?.manufacturer} ${vehicle.vehicle_spec?.model}`)}
                        disabled={!vehicle.availability}
                        className={`font-bold py-2 px-4 rounded-lg transition duration-300 text-sm ${
                          vehicle.availability 
                            ? 'bg-green-600 hover:bg-green-700 text-white' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {vehicle.availability ? "Inquire Now" : "Unavailable"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Inventory;