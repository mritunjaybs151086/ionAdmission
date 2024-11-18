import React, { useState } from "react";

const Header: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="bg-white text-gray-900 p-2 shadow-sm flex justify-between items-center z-10">
      <h1 className="text-xl font-bold">Collage Name</h1>
      <div className="flex items-center space-x-4">
      
        {/* Profile Dropdown */}
        <div className="relative">
          <button
            className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            Profile
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 w-40 mt-2 bg-white shadow-lg rounded-md border border-gray-200">
              <ul>
                <li>
                  <button className="block px-4 py-2 text-left text-gray-700 hover:bg-gray-100">
                    Settings
                  </button>
                </li>
                <li>
                  <button className="block px-4 py-2 text-left text-gray-700 hover:bg-gray-100">
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
