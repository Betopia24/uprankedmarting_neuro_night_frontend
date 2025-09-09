import React from "react";
import { Phone } from "lucide-react";

// Component 1: Phone Number Assignment
const PhoneNumberSection = () => {
  const phoneNumbers = [
    { location: "Seattle, WA", number: "206-123-4567" },
    { location: "Seattle, WA", number: "206-123-4568" },
    { location: "Seattle, WA", number: "206-123-4567" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <h2 className="text-xl font-semibold mb-2">
        Your Autoowner.ai Number: Location Ready Scale
      </h2>
      <p className="text-gray-600 mb-4 text-sm">
        Each Autoowner.ai AI agent is assigned a dedicated phone number within a
        local area code that matches your region of choice. This number provides
        a direct connection between your business line, your AI agent, and your
        customers.
      </p>
      <p className="text-gray-600 mb-6 text-sm">
        Utilizing Using your SmartCall number as your main contact line ensures
        a quick, seamless setup — so you can start delivering smart, automated
        service right away.
      </p>

      <div className="space-y-3">
        {phoneNumbers.map((item, index) => (
          <div
            key={index}
            className="flex items-center space-x-3 p-3 bg-pink-50 rounded-lg"
          >
            <Phone className="text-pink-500 w-5 h-5" />
            <div>
              <div className="text-sm text-gray-600">{item.location}</div>
              <div className="font-semibold">{item.number}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Component 2: Platform Integrations
const PlatformIntegrations = () => {
  const platforms = [
    { name: "HubSpot", color: "orange" },
    { name: "Google Sheets", color: "green" },
    { name: "Microsoft Teams", color: "blue" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">
        Accelerate Growth by Connecting with Your Favorite Tools
      </h2>
      <p className="text-gray-600 mb-6 text-sm">
        Autoowner.ai easily integrates with the platforms you already rely on.
        With powerful Zapier integrations, you can streamline your operations by
        automating tasks, tracking events, and connecting to 1000+ apps for CRM,
        scheduling, marketing automation, and beyond — all without writing a
        single line of code.
      </p>

      <div className="space-y-3">
        {platforms.map((platform, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 border rounded-lg"
          >
            <div className="flex items-center space-x-3">
              {/* Logo placeholder */}
              <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                <div className="text-gray-500 text-xs">IMG</div>
              </div>
              <span className="font-medium">{platform.name}</span>
            </div>
            <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">+</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Component 3: Appointment Management
const AppointmentManagement = () => {
  const features = [
    { label: "Bookings" },
    { label: "Reschedules" },
    { label: "Cancellations" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">
        Let Appointments Run Automatically — So You Can Focus on What Matters
      </h2>
      <p className="text-gray-600 mb-6 text-sm">
        Enhance customer satisfaction while keeping your calendar optimized and
        organized. By syncing with your CRM and calendar tools, your AI
        assistant performs logical AI-based phone scheduling — cutting booking
        time by up to 5X. It automatically finds the best time slots, handles
        rescheduling, and frees up your team to focus on meaningful
        conversations, not calendar conflicts.
      </p>

      <div className="space-y-3">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex items-center space-x-3 p-3 border rounded-lg"
          >
            {/* Icon placeholder */}
            <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">
              <div className="text-gray-500 text-xs">⚬</div>
            </div>
            <span className="font-medium">{feature.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 text-center">
        <button className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
          Subscribe →
        </button>
      </div>
    </div>
  );
};

// Component 4: Analytics Dashboard
const AnalyticsDashboard = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold mb-4">
        Turn Conversations into Strategic Insights
      </h2>
      <p className="text-gray-600 mb-6 text-sm">
        Every call is an opportunity to learn. With detailed analytics, track
        key metrics and automation levels. Call times, and caller locations, and
        use our intuitive dashboard. Understand caller intent, measure outcomes,
        and continuously improve your service with real-time, actionable
        intelligence.
      </p>

      <div className="flex items-center justify-center mb-4">
        {/* Chart placeholder */}
        <div className="w-48 h-48 bg-gray-100 rounded-full border-4 border-dashed border-gray-300 flex items-center justify-center">
          <div className="text-gray-500 text-center">
            <div className="text-sm">Analytics Chart</div>
            <div className="text-xs">Placeholder</div>
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
          <span>Call Volume</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
          <span>Success Rate</span>
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component
const AutoownerDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PhoneNumberSection />
          <PlatformIntegrations />
          <AppointmentManagement />
          <AnalyticsDashboard />
        </div>
      </div>
    </div>
  );
};

export default AutoownerDashboard;
