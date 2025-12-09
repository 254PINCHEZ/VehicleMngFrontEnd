import React from 'react';
import Header from '../components/Header';
import Footer from '../components/footer';

export default function AboutUs() {
  return (
    <>
      <Header/>  
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-20">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">Driving Excellence</h1>
              <p className="text-xl md:text-2xl text-blue-100">
                Revolutionizing fleet management with cutting-edge technology and unparalleled service
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2">
                <div className="mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
                  <div className="w-24 h-1 bg-blue-600 mb-6"></div>
                </div>
                <p className="text-lg text-gray-700 mb-6">
                  Founded in 2010, VehiclePro Management began with a simple vision: to transform how 
                  businesses manage their fleets. What started as a small startup with three passionate 
                  automotive enthusiasts has grown into a leading force in vehicle management solutions.
                </p>
                <p className="text-lg text-gray-700 mb-8">
                  Today, we serve over 5,000 businesses worldwide, from small enterprises to Fortune 500 
                  companies, helping them optimize their fleet operations, reduce costs, and improve 
                  operational efficiency through our innovative platform.
                </p>
                <div className="border-l-4 border-blue-600 pl-4 py-2">
                  <p className="text-xl font-semibold text-gray-900">Michael Anderson</p>
                  <p className="text-gray-600">CEO & Founder</p>
                </div>
              </div>
              <div className="lg:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
                  alt="Modern fleet management center" 
                  className="rounded-lg shadow-2xl w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2 order-2 lg:order-1">
                <img 
                  src="https://images.unsplash.com/photo-1489659639091-8b687bc4386e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
                  alt="Advanced vehicle analytics dashboard" 
                  className="rounded-lg shadow-xl w-full h-auto"
                />
              </div>
              <div className="lg:w-1/2 order-1 lg:order-2">
                <div className="mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Mission</h2>
                  <div className="w-24 h-1 bg-blue-600 mb-6"></div>
                </div>
                <p className="text-lg text-gray-700 mb-8">
                  To empower businesses with intelligent vehicle management solutions that drive efficiency, 
                  reduce operational costs, and promote sustainable fleet practices through innovation and 
                  exceptional service.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">Real-time Analytics</h4>
                      <p className="text-gray-600">Advanced monitoring and predictive maintenance for optimal fleet performance.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">Compliance & Safety</h4>
                      <p className="text-gray-600">Ensuring regulatory compliance and promoting safe driving practices.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">Cost Optimization</h4>
                      <p className="text-gray-600">Reducing fuel consumption and maintenance costs through smart management.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Leadership Team</h2>
              <p className="text-xl text-gray-600 mb-6">The experts driving innovation in fleet management</p>
              <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="h-64 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                    alt="Michael Anderson - CEO" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">MICHAEL ANDERSON</h3>
                  <p className="text-blue-600 font-semibold mb-4">CEO & Founder</p>
                  <p className="text-gray-600">
                    20+ years in automotive technology. Former VP at AutoTech Solutions. Passionate about sustainable transportation.
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="h-64 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                    alt="Sarah Johnson - CTO" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">SARAH JOHNSON</h3>
                  <p className="text-blue-600 font-semibold mb-4">Chief Technology Officer</p>
                  <p className="text-gray-600">
                    AI and IoT specialist. Built scalable platforms for enterprise fleet management. MIT Computer Science graduate.
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="h-64 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                    alt="David Chen - Head of Operations" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">DAVID CHEN</h3>
                  <p className="text-blue-600 font-semibold mb-4">Head of Operations</p>
                  <p className="text-gray-600">
                    Logistics expert with 15 years in fleet operations. Former director at Global Logistics Inc.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
              <p className="text-xl text-gray-600 mb-6">Principles that guide every decision we make</p>
              <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Reliability</h3>
                <p className="text-gray-600">Consistent performance and dependable service you can count on 24/7.</p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Innovation</h3>
                <p className="text-gray-600">Continuously evolving our technology to stay ahead of industry trends.</p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13-5.197a4 4 0 00-8 0v3m8-3v3m0 0v3m0-3h3m-3 0h-3" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Partnership</h3>
                <p className="text-gray-600">Working collaboratively with clients to achieve their unique goals.</p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Security</h3>
                <p className="text-gray-600">Protecting your data with enterprise-grade security measures.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-blue-900 text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">5,000+</div>
                <div className="text-blue-200">Businesses Served</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">250K+</div>
                <div className="text-blue-200">Vehicles Managed</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">15+</div>
                <div className="text-blue-200">Countries</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">99.9%</div>
                <div className="text-blue-200">Uptime</div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}