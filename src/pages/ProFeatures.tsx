import { useState } from "react";
import MainLayout from "../layout/MainLayout";

export default function ProFeatures() {
  const [activeTab, setActiveTab] = useState('deals');

  return (
    <MainLayout>
      <h2 className="text-2xl font-bold mb-6">Pro MCN Features</h2>
      <div className="flex gap-4 mb-6">
        <button onClick={() => setActiveTab('deals')} className={`px-4 py-2 rounded ${activeTab === 'deals' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Brand Deals</button>
        <button onClick={() => setActiveTab('contracts')} className={`px-4 py-2 rounded ${activeTab === 'contracts' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Contracts</button>
      </div>
      
      {activeTab === 'deals' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Brand Deal Marketplace</h3>
          <p>List of available sponsorship opportunities...</p>
        </div>
      )}
      
      {activeTab === 'contracts' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Contract Generator</h3>
          <button className="bg-green-600 text-white px-4 py-2 rounded">Generate New Contract</button>
        </div>
      )}
    </MainLayout>
  );
}
