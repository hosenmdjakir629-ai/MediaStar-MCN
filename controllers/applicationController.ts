import { Request, Response } from 'express';
import { adminDb as db } from '../lib/firebaseAdmin';

const applicationsCollection = db.collection('applications');

export const getAllApplications = async (req: Request, res: Response) => {
  try {
    const snapshot = await applicationsCollection.get();
    const applications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
};

export const createApplication = async (req: Request, res: Response) => {
  try {
    const newApp = await applicationsCollection.add({ ...req.body, status: 'Pending', createdAt: new Date() });
    res.json({ id: newApp.id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create application' });
  }
};

export const updateApplication = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  try {
    await applicationsCollection.doc(id).update(req.body);
    res.json({ message: 'Application updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update application' });
  }
};

export const deleteApplication = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  try {
    await applicationsCollection.doc(id).delete();
    res.json({ message: 'Application deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete application' });
  }
};
