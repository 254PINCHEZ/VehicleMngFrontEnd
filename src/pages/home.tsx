import React from 'react';
import { Link } from 'react-router-dom';
//import Navbar from '../components/Navbar';
import Footer from '../components/footer';
import Header from '../../src/components/Header'

type Vehicle = {
  id: number;
  title: string;
  description: string;
  daily_price: number;
  image: string;
  isFeatured: boolean;
  badge?: string;
  year: number;
  location: string;
  vehicle_type: 'two-wheeler' | 'four-wheeler';
  fuelType: string;
  transmission: string;
  is_available: boolean;
};

type FeatureItem = {
  id: number;
  title: string;
  description: string;
  icon: string;
};

// Vehicle data for RENTAL system
const vehicleData: Vehicle[] = [
  {
    id: 1,
    title: '2024 Tesla Model S Plaid',
    description: 'Ultra-high-performance all-electric sedan with incredible acceleration and autonomous driving capabilities. Perfect for luxury trips.',
    daily_price: 189,
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    isFeatured: true,
    badge: 'Just Added',
    year: 2024,
    location: 'Nairobi CBD',
    vehicle_type: 'four-wheeler',
    fuelType: 'Electric',
    transmission: 'Automatic',
    is_available: true
  },
  {
    id: 2,
    title: '2023 BMW X7 M60i',
    description: 'Luxury full-size SUV with powerful V8 engine, premium interior, and advanced safety features. Spacious and comfortable for family trips.',
    daily_price: 225,
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    isFeatured: true,
    badge: 'Luxury',
    year: 2023,
    location: 'Westlands',
    vehicle_type: 'four-wheeler',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    is_available: true
  },
  {
    id: 3,
    title: '2024 Toyota RAV4 Hybrid',
    description: 'Fuel-efficient compact SUV with hybrid technology, spacious interior, and excellent reliability. Great for city driving and weekend adventures.',
    daily_price: 85,
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    isFeatured: false,
    badge: 'Popular',
    year: 2024,
    location: 'Thika Road',
    vehicle_type: 'four-wheeler',
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    is_available: true
  },
  {
    id: 4,
    title: 'Yamaha MT-15',
    description: 'Sporty and agile motorcycle perfect for city commuting. Great fuel efficiency and modern styling.',
    daily_price: 25,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    isFeatured: false,
    badge: 'Economy',
    year: 2023,
    location: 'Nairobi CBD',
    vehicle_type: 'two-wheeler',
    fuelType: 'Petrol',
    transmission: 'Manual',
    is_available: true
  }
];

const featuresData: FeatureItem[] = [
  {
    id: 1,
    title: 'Wide Selection',
    description: 'Choose from hundreds of verified two-wheelers and four-wheelers across multiple locations.',
    icon: '🚗'
  },
  {
    id: 2,
    title: 'Quality Assured',
    description: 'Every vehicle undergoes rigorous inspection and maintenance for your safety and comfort.',
    icon: '✅'
  },
  {
    id: 3,
    title: 'Best Rates',
    description: 'Competitive daily rates with transparent pricing and no hidden charges.',
    icon: '💰'
  },
  {
    id: 4,
    title: 'Easy Booking',
    description: 'Simple online booking process with instant confirmation and flexible pickup options.',
    icon: '📅'
  }
];

const Home: React.FC = () => {
  const featuredVehicles = vehicleData.filter(vehicle => vehicle.isFeatured);
  const popularVehicles = vehicleData.filter(vehicle => !vehicle.isFeatured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent"></div>
        <div 
          className="relative bg-cover bg-center bg-no-repeat min-h-[80vh] flex items-center"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1486496572940-2bb2341fdbdf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")'
          }}
        >
          <div className="container mx-auto px-4 py-20">
            <div className="max-w-2xl relative z-10">
              <div className="mb-8">
                <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
                  Rent Your
                  <span className="block bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    Perfect Ride
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-blue-100 leading-relaxed mb-8 font-light">
                  Discover premium two-wheelers and four-wheelers with transparent pricing, 
                  seamless booking, and exceptional service.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/login" 
                  className="group bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <span className="flex items-center justify-center gap-2">
                    Browse Vehicles
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>
                <Link 
                  to="/how-it-works" 
                  className="group border-2 border-white/80 hover:border-white hover:bg-white/10 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 text-center backdrop-blur-sm"
                >
                  <span className="flex items-center justify-center gap-2">
                    How It Works
                    <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose <span className="text-blue-600">TURAGA SACCO</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experience the future of vehicle rentals with our seamless platform designed for your convenience and peace of mind.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuresData.map(feature => (
              <div key={feature.id} className="group text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-blue-200 hover:-translate-y-2">
                <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Vehicles Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Featured <span className="text-blue-600">Vehicles</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hand-picked selection of premium rental vehicles for exceptional experiences
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredVehicles.map(vehicle => (
              <div key={vehicle.id} className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl overflow-hidden transition-all duration-500 border border-gray-100 hover:border-blue-200">
                <div className="relative overflow-hidden">
                  <img 
                    src={vehicle.image} 
                    alt={vehicle.title}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  {vehicle.badge && (
                    <span className="absolute top-6 left-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      {vehicle.badge}
                    </span>
                  )}
                  <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-2 rounded-xl text-sm font-bold shadow-lg">
                    {vehicle.vehicle_type === 'two-wheeler' ? '🏍️ Motorcycle' : '🚗 SUV/Sedan'}
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {vehicle.title}
                  </h3>
                  <div className="flex items-center text-gray-600 mb-4">
                    <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">{vehicle.location}</span>
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {vehicle.description}
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div className="flex items-center text-gray-500">
                      <span className="font-semibold text-gray-700">Year:</span>
                      <span className="ml-2 font-medium">{vehicle.year}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <span className="font-semibold text-gray-700">Type:</span>
                      <span className="ml-2 font-medium capitalize">{vehicle.vehicle_type}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <span className="font-semibold text-gray-700">Fuel:</span>
                      <span className="ml-2 font-medium">{vehicle.fuelType}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <span className="font-semibold text-gray-700">Trans:</span>
                      <span className="ml-2 font-medium">{vehicle.transmission}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                    <div>
                      <p className="text-3xl font-bold text-green-600">
                        ${vehicle.daily_price}
                        <span className="text-sm font-normal text-gray-500 ml-1">/day</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">All taxes & insurance included</p>
                    </div>
                    <Link 
                      to={`/vehicles/${vehicle.id}`}
                      className="group bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      <span className="flex items-center gap-2">
                        Book Now
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Vehicles Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Popular <span className="text-orange-500">Choices</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Most loved vehicles by our community of renters
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularVehicles.map(vehicle => (
              <div key={vehicle.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-xl overflow-hidden transition-all duration-500 border border-gray-100 hover:border-orange-200 hover:-translate-y-2">
                <div className="relative overflow-hidden">
                  <img 
                    src={vehicle.image} 
                    alt={vehicle.title}
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {vehicle.badge && (
                    <span className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-amber-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      {vehicle.badge}
                    </span>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-900 px-2 py-1 rounded-lg text-xs font-bold shadow-lg">
                    {vehicle.vehicle_type === 'two-wheeler' ? '🏍️' : '🚗'}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors line-clamp-1">
                    {vehicle.title}
                  </h3>
                  <div className="flex justify-between text-sm text-gray-500 mb-3">
                    <span className="font-medium">{vehicle.year}</span>
                    <span className="font-medium capitalize">{vehicle.vehicle_type}</span>
                    <span className="font-medium">{vehicle.fuelType}</span>
                  </div>
                  <div className="flex items-center text-gray-600 mb-4 text-sm">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {vehicle.location}
                  </div>
                  <p className="text-gray-600 text-sm mb-6 line-clamp-2 leading-relaxed">
                    {vehicle.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-2xl font-bold text-green-600">
                        ${vehicle.daily_price}
                        <span className="text-sm font-normal text-gray-500 ml-1">/day</span>
                      </p>
                    </div>
                    <Link 
                      to={`/vehicles/${vehicle.id}`}
                      className="bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 text-sm shadow hover:shadow-md transform hover:-translate-y-0.5"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-800 via-blue-700 to-indigo-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -translate-y-36 translate-x-36"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-48 -translate-x-48"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="group">
              <div className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                200+
              </div>
              <div className="text-xl font-semibold text-blue-100">Vehicles Available</div>
            </div>
            <div className="group">
              <div className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                5K+
              </div>
              <div className="text-xl font-semibold text-blue-100">Happy Renters</div>
            </div>
            <div className="group">
              <div className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                98%
              </div>
              <div className="text-xl font-semibold text-blue-100">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-emerald-600/10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-black mb-8">
            Ready to <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Rent Your Ride</span>?
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of satisfied customers who found their perfect rental vehicle with our premium service
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link 
              to="/inventory"
              className="group bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-5 px-12 rounded-2xl transition-all duration-300 text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-2"
            >
              <span className="flex items-center gap-3">
                Explore All Vehicles
                <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            <Link 
              to="/contact"
              className="group border-2 border-white/30 hover:border-white hover:bg-white/10 text-white font-bold py-5 px-12 rounded-2xl transition-all duration-300 text-lg backdrop-blur-sm"
            >
              <span className="flex items-center gap-3">
                Get In Touch
                <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;