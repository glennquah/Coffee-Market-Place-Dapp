import React from 'react';

const ResponsiveContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="container mx-auto px-4 xs:px-4 sm:px-4 md:px-8 lg:px-20 xl:px-20">
      {children}
    </div>
  );
};

export default ResponsiveContainer;
