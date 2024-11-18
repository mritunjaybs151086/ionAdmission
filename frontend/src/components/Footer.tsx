import React from "react";
// import { useAuth } from "../hooks/useAuth";

const Footer: React.FC = () => {
  // const { currentOrg } = useAuth();

  return (
    <footer className='bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 py-1'>
      <div className='container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400'>
        © {new Date().getFullYear()} IonAdmission. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
