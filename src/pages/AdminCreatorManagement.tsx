import { useEffect, useState } from "react";
import { collection, onSnapshot, query, updateDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebase";
import MainLayout from "../layout/MainLayout";
import { logAdminActivity } from "../lib/logger";

export interface Creator {
  id: string;
  name: string;
  email: string;
  status: string;
  niche: string;
  subscribers: number;
}

export default function AdminCreatorManagement({ creators }: { creators: any[] }) {
  const updateStatus = async (id: string, name: string, newStatus: string) => {
    await updateDoc(doc(db, "creators", id), { status: newStatus });
    await logAdminActivity("Update Creator Status", `Updated creator ${name} status to ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-slate-800 tracking-tight">Creators Management</h3>
          <p className="text-slate-500 text-sm mt-1">Manage and edit creator profiles and channel information.</p>
        </div>
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
    </div>
  );
}
