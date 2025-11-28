import React, { useState } from 'react';

interface SupportTicketCardProps {
  bookingId: number;
  vehicle: string;
}

const SupportTicketCard: React.FC<SupportTicketCardProps> = ({ bookingId, vehicle }) => {
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [ticketData, setTicketData] = useState({
    category: '',
    urgency: 'medium',
    subject: '',
    message: '',
  });

  const ticketCategories = [
    { value: 'booking_issue', label: 'Booking Issue', icon: '📅' },
    { value: 'vehicle_problem', label: 'Vehicle Problem', icon: '🚗' },
    { value: 'payment_issue', label: 'Payment Issue', icon: '💳' },
    { value: 'modification', label: 'Modify Booking', icon: '✏️' },
    { value: 'cancellation', label: 'Cancellation Help', icon: '❌' },
    { value: 'other', label: 'Other Issue', icon: '❓' },
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Low', color: 'text-green-600 bg-green-100', description: 'General inquiry' },
    { value: 'medium', label: 'Medium', color: 'text-orange-600 bg-orange-100', description: 'Need help soon' },
    { value: 'high', label: 'High', color: 'text-red-600 bg-red-100', description: 'Urgent assistance' },
  ];

  const handleCreateTicket = () => {
    setIsCreatingTicket(true);
    // Auto-fill subject with booking context
    setTicketData(prev => ({
      ...prev,
      subject: `Support for Booking #${bookingId} - ${vehicle}`,
    }));
  };

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    console.log('Submitting ticket:', { ...ticketData, bookingId });
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Reset form and show success
    setIsCreatingTicket(false);
    setTicketData({
      category: '',
      urgency: 'medium',
      subject: '',
      message: '',
    });
  };

  const handleCancelTicket = () => {
    setIsCreatingTicket(false);
    setTicketData({
      category: '',
      urgency: 'medium',
      subject: '',
      message: '',
    });
  };

  if (!isCreatingTicket) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <div className="flex items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center">
            <span className="w-2 h-6 bg-blue-600 rounded-full mr-3"></span>
            Need Help with This Booking?
          </h2>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 text-lg">💬</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 mb-2">24/7 Customer Support</h3>
                <p className="text-blue-700 text-sm">
                  Our support team is here to help with any questions or issues regarding your booking.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-lg">📞</span>
                <span className="font-semibold text-slate-900 text-sm">Phone Support</span>
              </div>
              <p className="text-slate-600 text-sm">+1 (555) 123-HELP</p>
              <p className="text-slate-500 text-xs mt-1">Available 24/7</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-lg">📧</span>
                <span className="font-semibold text-slate-900 text-sm">Email Support</span>
              </div>
              <p className="text-slate-600 text-sm">support@vehiclerent.com</p>
              <p className="text-slate-500 text-xs mt-1">Response within 2 hours</p>
            </div>
          </div>

          <button
            onClick={handleCreateTicket}
            className="btn btn-primary w-full py-3"
          >
            <span className="text-lg mr-2">🎫</span>
            Create Support Ticket
          </button>

          {/* Emergency Contact */}
          <div className="bg-red-50 rounded-xl p-4 border border-red-200">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-red-600 text-sm">🚨</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-red-800 text-sm mb-1">Emergency Roadside Assistance</p>
                <p className="text-red-700 text-xs">
                  For urgent vehicle issues during your rental, call immediately:
                </p>
                <p className="text-red-800 font-bold text-sm mt-2">+1 (555) 911-HELP</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center">
          <span className="w-2 h-6 bg-blue-600 rounded-full mr-3"></span>
          Create Support Ticket
        </h2>
        <button
          onClick={handleCancelTicket}
          className="btn btn-ghost btn-sm"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmitTicket} className="space-y-6">
        {/* Booking Context */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center space-x-3">
            <span className="text-blue-600">📋</span>
            <div>
              <p className="text-sm font-medium text-blue-900">Regarding Booking #{bookingId}</p>
              <p className="text-xs text-blue-700">Vehicle: {vehicle}</p>
            </div>
          </div>
        </div>

        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            What can we help you with?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {ticketCategories.map((category) => (
              <button
                key={category.value}
                type="button"
                onClick={() => setTicketData(prev => ({ ...prev, category: category.value }))}
                className={`p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                  ticketData.category === category.value
                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{category.icon}</span>
                  <span className="text-sm font-medium text-slate-900">{category.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Urgency Level */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            How urgent is your issue?
          </label>
          <div className="flex space-x-3">
            {urgencyLevels.map((level) => (
              <button
                key={level.value}
                type="button"
                onClick={() => setTicketData(prev => ({ ...prev, urgency: level.value }))}
                className={`flex-1 p-3 rounded-xl border-2 text-center transition-all duration-200 ${
                  ticketData.urgency === level.value
                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium mb-2 ${level.color}`}>
                  {level.label}
                </div>
                <p className="text-xs text-slate-600">{level.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            required
            value={ticketData.subject}
            onChange={(e) => setTicketData(prev => ({ ...prev, subject: e.target.value }))}
            className="input input-bordered w-full"
            placeholder="Brief description of your issue..."
          />
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
            Detailed Description
          </label>
          <textarea
            id="message"
            required
            rows={4}
            value={ticketData.message}
            onChange={(e) => setTicketData(prev => ({ ...prev, message: e.target.value }))}
            className="textarea textarea-bordered w-full"
            placeholder="Please provide detailed information about your issue..."
          />
        </div>

        {/* Submit Button */}
        <div className="flex space-x-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={handleCancelTicket}
            className="btn btn-outline flex-1"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary flex-1"
            disabled={!ticketData.category || !ticketData.subject || !ticketData.message}
          >
            Submit Ticket
          </button>
        </div>

        {/* Response Time Info */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <div className="flex items-center space-x-3">
            <span className="text-slate-600">⏱️</span>
            <div>
              <p className="text-sm font-medium text-slate-900">Expected Response Time</p>
              <p className="text-xs text-slate-600">
                {ticketData.urgency === 'high' 
                  ? 'Within 30 minutes (Urgent)' 
                  : ticketData.urgency === 'medium'
                  ? 'Within 2 hours'
                  : 'Within 24 hours'
                }
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SupportTicketCard;