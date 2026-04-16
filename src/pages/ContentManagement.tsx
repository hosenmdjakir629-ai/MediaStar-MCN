import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy, updateDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebase";
import MainLayout from "../layout/MainLayout";

interface Claim {
  id: string;
  title: string;
  claimant: string;
  status: 'Active' | 'Disputed' | 'Released';
  date: string;
}

export default function ContentManagement() {
  const [claims, setClaims] = useState<Claim[]>([]);

  useEffect(() => {
    const q = query(collection(db, "claims"), orderBy("date", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Claim));
      setClaims(data);
    });
    return () => unsubscribe();
  }, []);

  const updateClaimStatus = async (id: string, status: string) => {
    await updateDoc(doc(db, "claims", id), { status });
  };

  return (
    <MainLayout>
      <h2 className="text-2xl font-bold mb-6">Content Management System</h2>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Copyright Claims</h3>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="pb-3">Video Title</th>
              <th className="pb-3">Claimant</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {claims.map((claim) => (
              <tr key={claim.id} className="border-b">
                <td className="py-3">{claim.title}</td>
                <td className="py-3">{claim.claimant}</td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded text-xs ${claim.status === 'Active' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {claim.status}
                  </span>
                </td>
                <td className="py-3">
                  {claim.status === 'Active' && (
                    <button onClick={() => updateClaimStatus(claim.id, 'Released')} className="text-blue-600 hover:underline">Release</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
}
