import React from 'react';

interface Right {
  assetId: string;
  territory: string;
  policy: string;
  creatorShare: number;
  mcnShare: number;
}

interface RightsTableProps {
  rights: Right[];
}

export const RightsTable: React.FC<RightsTableProps> = ({ rights = [] }) => {
  return (
    <div id="rights-table" className="bg-[#1A1A1A] p-6 rounded-xl mt-6">
      <h2 className="text-lg mb-4 text-white">📜 Active Rights</h2>
      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-400">
            <th className="pb-2">Asset</th>
            <th className="pb-2">Territory</th>
            <th className="pb-2">Policy</th>
            <th className="pb-2">Creator %</th>
            <th className="pb-2">MCN %</th>
          </tr>
        </thead>
        <tbody>
          {rights.map((r, i) => (
            <tr key={i} className="border-t border-gray-800">
              <td className="py-2 text-white">{r.assetId}</td>
              <td className="py-2 text-white">{r.territory}</td>
              <td className="py-2 text-white capitalize">{r.policy}</td>
              <td className="py-2 text-white">{r.creatorShare}%</td>
              <td className="py-2 text-white">{r.mcnShare}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
