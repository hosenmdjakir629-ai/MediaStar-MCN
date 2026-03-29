import React from "react";

const PaymentLoader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-8">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-orbit-500/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-orbit-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <div className="text-center">
        <p className="text-white font-bold text-lg animate-pulse">Processing Payment...</p>
        <p className="text-surface-400 text-sm">Please do not refresh the page</p>
      </div>
    </div>
  );
};

export default PaymentLoader;
