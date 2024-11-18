import React, { useState } from "react";
import { Link } from "react-router-dom";
import routes from "../routes.json"; // Import the JSON configuration

const Sidebar: React.FC = () => {
  const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>(
    {}
  );

  const toggleSubmenu = (menu: string) => {
    setOpenSubmenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  return (
    <div className="bg-white text-gray-900 w-56 h-screen shadow-sm z-10">
      <h2 className="text-xl font-bold p-3 bg-gray-100">Logo</h2>
      <nav className="flex-1">
        <ul>
          {routes.map((route) => (
            <li key={route.path}>
              {route.submenu && route.submenu.length > 0 ? (
                <>
                  <button
                    className="block px-4 py-2 w-full text-left text-gray-800 hover:bg-gray-200 focus:outline-none"
                    onClick={() => toggleSubmenu(route.name)}
                  >
                    {route.name}
                  </button>
                  {openSubmenus[route.name] && (
                    <ul className="bg-gray-100">
                      {route.submenu.map((sub: any) => (
                        <li key={sub.path}>
                          <Link
                            to={sub.path}
                            className="block px-8 py-2 text-gray-700 hover:bg-gray-200"
                          >
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <Link
                  to={route.path}
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                >
                  {route.name}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
