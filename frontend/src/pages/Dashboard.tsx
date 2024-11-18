import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to the Dashboard</h1>
      <p className="text-lg text-gray-600">
        This is your central hub for managing all aspects of the application.
      </p>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {/* Card 1 */}
        <div className="p-4 bg-white rounded shadow hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold text-gray-700">Products</h2>
          <p className="text-gray-500 mt-2">
            View and manage the list of products available in your inventory.
          </p>
          <a
            href="/products"
            className="mt-4 inline-block text-blue-500 hover:underline"
          >
            Go to Products →
          </a>
        </div>

        {/* Card 2 */}
        <div className="p-4 bg-white rounded shadow hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold text-gray-700">Orders</h2>
          <p className="text-gray-500 mt-2">
            Track and manage customer orders and fulfillment.
          </p>
          <a
            href="/orders"
            className="mt-4 inline-block text-blue-500 hover:underline"
          >
            Go to Orders →
          </a>
        </div>

        {/* Card 3 */}
        <div className="p-4 bg-white rounded shadow hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold text-gray-700">Settings</h2>
          <p className="text-gray-500 mt-2">
            Configure your application preferences and user settings.
          </p>
          <a
            href="/settings"
            className="mt-4 inline-block text-blue-500 hover:underline"
          >
            Go to Settings →
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
