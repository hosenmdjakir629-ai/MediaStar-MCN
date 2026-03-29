import React from 'react';

const providers = [
  { name: 'bKash', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/BKash_logo.svg/2560px-BKash_logo.svg.png' },
  { name: 'Rocket', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Rocket_logo.png' },
  { name: 'Nagad', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Nagad_Logo.svg/2560px-Nagad_Logo.svg.png' },
  { name: 'Upay', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/32/Upay_logo.png' },
  { name: 'Cellfin', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Cellfin_logo.png' },
  { name: 'Islami Bank', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Islami_Bank_logo.png' },
  { name: 'Cashbaba', logo: 'https://via.placeholder.com/80?text=Cashbaba' },
  { name: 'Pocket', logo: 'https://via.placeholder.com/80?text=Pocket' },
  { name: 'ST Pay', logo: 'https://via.placeholder.com/80?text=ST+Pay' },
  { name: 'Pathao', logo: 'https://via.placeholder.com/80?text=Pathao' },
  { name: 'Rainbow', logo: 'https://via.placeholder.com/80?text=Rainbow' },
  { name: 'Tap', logo: 'https://via.placeholder.com/80?text=Tap' },
];

interface MobileBankingGridProps {
  onSelect: (provider: string) => void;
}

const MobileBankingGrid: React.FC<MobileBankingGridProps> = ({ onSelect }) => {
  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {providers.map((provider) => (
        <button
          key={provider.name}
          onClick={() => onSelect(provider.name)}
          className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col items-center justify-center hover:bg-white/10 transition-all"
        >
          <img src={provider.logo} alt={provider.name} className="w-16 h-16 object-contain" referrerPolicy="no-referrer" />
          <span className="text-xs text-surface-300 mt-2">{provider.name}</span>
        </button>
      ))}
    </div>
  );
};

export default MobileBankingGrid;
