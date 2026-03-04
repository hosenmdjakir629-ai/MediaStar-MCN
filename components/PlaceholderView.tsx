import React from 'react';

interface PlaceholderViewProps {
  title: string;
}

const PlaceholderView: React.FC<PlaceholderViewProps> = ({ title }) => {
  return (
    <div className="flex items-center justify-center h-[60vh] text-gray-400">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p>This feature is currently under development.</p>
      </div>
    </div>
  );
};

export default PlaceholderView;
