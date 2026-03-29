import React from "react";

interface PaymentButtonProps {
  text: string;
  onClick: () => void;
  loading?: boolean;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ text, onClick, loading }) => {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`
        w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300
        flex items-center justify-center space-x-2
        ${loading 
          ? 'bg-surface-800 text-surface-500 cursor-not-allowed' 
          : 'bg-orbit-500 hover:bg-orbit-600 text-white shadow-lg shadow-orbit-500/20 hover:shadow-orbit-500/40 active:scale-[0.98]'
        }
      `}
    >
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-surface-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Processing...</span>
        </>
      ) : (
        <span>{text}</span>
      )}
    </button>
  );
};

export default PaymentButton;
