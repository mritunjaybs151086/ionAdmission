import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path: string;
}

const Breadcrumb: React.FC = () => {
  const location = useLocation();

  // Split the current location path into an array of parts
  const pathParts = location.pathname.split('/').filter(part => part);

  const breadcrumbItems: BreadcrumbItem[] = pathParts.map((part, index) => {
    const path = `/${pathParts.slice(0, index + 1).join('/')}`;
    const label = part.charAt(0).toUpperCase() + part.slice(1); // Capitalize the first letter of each part
    return { label, path };
  });

  return (
    <nav aria-label="Breadcrumb" className="bg-white p-1 shadow-md">
      <ol className="list-reset flex text-gray-700">
        <li>
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            Home
          </Link>
        </li>
        {breadcrumbItems.map((item, index) => (
          <li key={item.path} className="mx-2">
            <span className="text-gray-500">/</span>
            <Link
              to={item.path}
              className={`${
                index === breadcrumbItems.length - 1
                  ? 'text-gray-800'
                  : 'text-blue-600 hover:text-blue-800'
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
