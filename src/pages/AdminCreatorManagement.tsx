import { useEffect, useState } from "react";
import { collection, onSnapshot, query, updateDoc, doc, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import MainLayout from "../layout/MainLayout";
import { logAdminActivity } from "../lib/logger";
import { Plus, X } from "lucide-react";

export interface Creator {
  id: string;
  name: string;
  email: string;
  status: string;
  niche: string;
  subscribers: number;
}

export default function AdminCreatorManagement({ creators }: { creators: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCreator, setNewCreator] = useState({ name: '', email: '', niche: '', subscribers: 0, status: 'Active' });

  const updateStatus = async (id: string, name: string, newStatus: string) => {
    await updateDoc(doc(db, "creators", id), { status: newStatus });
    await logAdminActivity("Update Creator Status", `Updated creator ${name} status to ${newStatus}`);
  };

  const addCreator = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, "creators"), {
      ...newCreator,
      createdAt: serverTimestamp()
    });
    await logAdminActivity("Add Creator", `Added new creator ${newCreator.name}`);
    setIsModalOpen(false);
    setNewCreator({ name: '', email: '', niche: '', subscribers: 0, status: 'Active' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-slate-800 tracking-tight">Creators Management</h3>
          <p className="text-slate-500 text-sm mt-1">Manage and edit creator profiles and channel information.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          <Plus size={18} /> Add Creator
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="pb-3">Name</th>
              <th className="pb-3">Email</th>
              <th className="pb-3">Niche</th>
              <th className="pb-3">Subscribers</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {creators.map((creator) => (
              <tr key={creator.id} className="border-b">
                <td className="py-3">{creator.name}</td>
                <td className="py-3">{creator.email}</td>
                <td className="py-3">{creator.niche}</td>
                <td className="py-3">{creator.subscribers}</td>
                <td className="py-3">{creator.status}</td>
                <td className="py-3">
                  <select 
                    value={creator.status}
                    onChange={(e) => updateStatus(creator.id, creator.name, e.target.value)}
                    className="border rounded p-1"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold">Add New Creator</h4>
              <button onClick={() => setIsModalOpen(false)}><X size={20}/></button>
            </div>
            <form onSubmit={addCreator} className="space-y-4">
              <input type="text" placeholder="Name" className="w-full border p-2 rounded" value={newCreator.name} onChange={e => setNewCreator({...newCreator, name: e.target.value})} required />
              <input type="email" placeholder="Email" className="w-full border p-2 rounded" value={newCreator.email} onChange={e => setNewCreator({...newCreator, email: e.target.value})} required />
              <input type="text" placeholder="Niche" className="w-full border p-2 rounded" value={newCreator.niche} onChange={e => setNewCreator({...newCreator, niche: e.target.value})} required />
              <input type="number" placeholder="Subscribers" className="w-full border p-2 rounded" value={newCreator.subscribers} onChange={e => setNewCreator({...newCreator, subscribers: parseInt(e.target.value)})} required />
              <button type="submit" className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700">Add Creator</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
