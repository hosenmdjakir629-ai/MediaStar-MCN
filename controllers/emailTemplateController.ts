import { Request, Response } from 'express';
import { adminDb } from '../lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';

const COLLECTION = 'email_templates';

// Get all templates
export const getAllTemplates = async (req: Request, res: Response) => {
  try {
    console.log("Fetching all email templates from Firestore...");
    const snapshot = await adminDb.collection(COLLECTION).orderBy('updatedAt', 'desc').get();
    const templates = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log(`Successfully fetched ${templates.length} templates.`);
    res.json(templates);
  } catch (error: any) {
    console.error("Error fetching email templates:", error);
    res.status(500).json({ success: false, msg: error.message, stack: error.stack });
  }
};

// Create a template
export const createTemplate = async (req: Request, res: Response) => {
  try {
    const { name, subject, body, variables, category } = req.body;
    
    // Check if name is unique
    const snapshot = await adminDb.collection(COLLECTION).where('name', '==', name).get();
    if (!snapshot.empty) {
      return res.status(400).json({ success: false, msg: 'Template name already exists' });
    }

    const templateRef = adminDb.collection(COLLECTION).doc();
    const data = {
        name,
        subject,
        body,
        variables,
        category: category || 'general',
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
    };
    await templateRef.set(data);

    res.status(201).json({ id: templateRef.id, ...data });
  } catch (error: any) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Update a template
export const updateTemplate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { subject, body, variables, category } = req.body;

    const templateRef = adminDb.collection(COLLECTION).doc(id);
    const templateDoc = await templateRef.get();

    if (!templateDoc.exists) {
      return res.status(404).json({ success: false, msg: 'Template not found' });
    }

    await templateRef.update({ 
        subject, 
        body, 
        variables, 
        category,
        updatedAt: FieldValue.serverTimestamp() 
    });

    res.json({ id, ...templateDoc.data(), subject, body, variables, category });
  } catch (error: any) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Delete a template
export const deleteTemplate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await adminDb.collection(COLLECTION).doc(id).delete();

    res.json({ success: true, msg: 'Template deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, msg: error.message });
  }
};
