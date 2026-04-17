import { Request, Response } from 'express';
import EmailTemplate from '../models/EmailTemplate';

// Get all templates
export const getAllTemplates = async (req: Request, res: Response) => {
  try {
    const templates = await EmailTemplate.find().sort({ updatedAt: -1 });
    res.json(templates);
  } catch (error: any) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Create a template
export const createTemplate = async (req: Request, res: Response) => {
  try {
    const { name, subject, body, variables, category } = req.body;
    
    // Check if name is unique
    const existing = await EmailTemplate.findOne({ name });
    if (existing) {
      return res.status(400).json({ success: false, msg: 'Template name already exists' });
    }

    const template = await EmailTemplate.create({
      name,
      subject,
      body,
      variables,
      category
    });

    res.status(201).json(template);
  } catch (error: any) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Update a template
export const updateTemplate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { subject, body, variables, category } = req.body;

    const template = await EmailTemplate.findByIdAndUpdate(
      id,
      { subject, body, variables, category },
      { new: true, runValidators: true }
    );

    if (!template) {
      return res.status(404).json({ success: false, msg: 'Template not found' });
    }

    res.json(template);
  } catch (error: any) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Delete a template
export const deleteTemplate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const template = await EmailTemplate.findByIdAndDelete(id);

    if (!template) {
      return res.status(404).json({ success: false, msg: 'Template not found' });
    }

    res.json({ success: true, msg: 'Template deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, msg: error.message });
  }
};
