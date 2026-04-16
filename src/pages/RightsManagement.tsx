import React, { useState } from 'react';
import { setRights } from '../api/rights';
import { COUNTRIES } from '../constants';

export const RightsManagement: React.FC = () => {
  const [form, setForm] = useState({
    assetId: "",
    territory: "GLOBAL",
    policy: "track",
    creatorShare: 70,
    mcnShare: 30,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await setRights(form);
      alert("Rights Saved 🚀");
    } catch (error) {
      console.error("Error saving rights:", error);
      alert("Failed to save rights. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="rights-management-page" className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">⚖️ Rights Management</h1>

      {/* FORM */}
      <div className="bg-[#1A1A1A] p-6 rounded-xl space-y-4">
        {/* Asset ID */}
        <div>
          <label htmlFor="assetId" className="block text-sm font-medium text-gray-300">Asset ID</label>
          <input
            id="assetId"
            className="w-full p-2 mt-1 bg-black rounded border border-gray-700"
            placeholder="Enter Video/Asset ID"
            onChange={(e) => setForm({ ...form, assetId: e.target.value })}
          />
        </div>

        {/* Territory */}
        <div>
          <label htmlFor="territory" className="block text-sm font-medium text-gray-300">Territory</label>
          <select
            id="territory"
            className="w-full p-2 mt-1 bg-black rounded border border-gray-700"
            value={form.territory}
            onChange={(e) => setForm({ ...form, territory: e.target.value })}
          >
            <option value="GLOBAL">GLOBAL</option>
            <option value="">Select Territory</option>
            {COUNTRIES.map((country) => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>

        {/* Policy */}
        <div>
          <label htmlFor="policy" className="block text-sm font-medium text-gray-300">Policy</label>
          <select
            id="policy"
            className="w-full p-2 mt-1 bg-black rounded border border-gray-700"
            onChange={(e) => setForm({ ...form, policy: e.target.value })}
          >
            <option value="track">Track Only</option>
            <option value="monetize">Monetize</option>
            <option value="block">Block</option>
            <option value="license">License</option>
          </select>
        </div>

        {/* Revenue Split */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="creatorShare" className="block text-sm font-medium text-gray-300">Creator %</label>
            <input
              id="creatorShare"
              type="number"
              className={`w-full p-2 mt-1 bg-black rounded border border-gray-700 ${form.territory === 'GLOBAL' ? 'opacity-50 cursor-not-allowed' : ''}`}
              value={form.creatorShare}
              disabled={form.territory === 'GLOBAL'}
              onChange={(e) =>
                setForm({ ...form, creatorShare: Number(e.target.value) })
              }
            />
          </div>

          <div>
            <label htmlFor="mcnShare" className="block text-sm font-medium text-gray-300">MCN %</label>
            <input
              id="mcnShare"
              type="number"
              className={`w-full p-2 mt-1 bg-black rounded border border-gray-700 ${form.territory === 'GLOBAL' ? 'opacity-50 cursor-not-allowed' : ''}`}
              value={form.mcnShare}
              disabled={form.territory === 'GLOBAL'}
              onChange={(e) =>
                setForm({ ...form, mcnShare: Number(e.target.value) })
              }
            />
          </div>
        </div>

        {/* BUTTON */}
        <button
          id="save-rights-button"
          onClick={() => {
            if (!form.assetId.trim()) {
              alert("Please enter a valid Asset ID.");
              return;
            }
            if (!form.territory) {
              alert("Please select a valid territory.");
              return;
            }
            handleSubmit();
          }}
          disabled={loading}
          className="w-full bg-red-600 p-3 rounded hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Rights ⚖️'}
        </button>
      </div>
    </div>
  );
};
