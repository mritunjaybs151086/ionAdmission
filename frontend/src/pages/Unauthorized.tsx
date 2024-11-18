import React from 'react';

const Unauthorized: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <h1 className="text-3xl font-bold text-red-500">403 - Unauthorized</h1>
    </div>
  );
};

export default Unauthorized;
