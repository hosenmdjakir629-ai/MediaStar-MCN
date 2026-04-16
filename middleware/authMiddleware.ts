import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../lib/firebaseAdmin';
import firebaseConfig from '../firebase-applet-config.json';

export const authMiddleware = async (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    
    let userData: any = null;
    try {
      // Fetch user role from Firestore using REST API with the user's token
      // This avoids IAM permission issues with firebase-admin in Cloud Run
      const projectId = firebaseConfig.projectId;
      const databaseId = firebaseConfig.firestoreDatabaseId || '(default)';
      const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${databaseId}/documents/users/${decodedToken.uid}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.fields && data.fields.role) {
          userData = { role: data.fields.role.stringValue };
        }
      }
    } catch (dbError) {
      console.error('Database access error in authMiddleware:', dbError);
      // Fallback: if we can't access DB, we still have the token info
    }
    
    req.user = {
      id: decodedToken.uid,
      email: decodedToken.email,
      role: userData?.role || (decodedToken.email === 'hosenmdjakir629@gmail.com' ? 'admin' : 'creator')
    };
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ msg: 'Token is not valid', error: error instanceof Error ? error.message : String(error) });
  }
};

export const adminMiddleware = (req: any, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};
