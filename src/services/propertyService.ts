import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy,
  getDocFromServer,
  onSnapshot,
  arrayUnion,
  arrayRemove,
  increment
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Property } from '../types';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const propertyService = {
  getProperties: async (): Promise<Property[]> => {
    const path = 'properties';
    try {
      const q = query(collection(db, path), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  saveProperty: async (property: Omit<Property, 'id' | 'createdAt'>): Promise<string> => {
    const path = 'properties';
    try {
      const docRef = await addDoc(collection(db, path), {
        ...property,
        createdAt: Date.now(),
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
      return '';
    }
  },

  updateProperty: async (id: string, updates: Partial<Property>): Promise<void> => {
    const path = `properties/${id}`;
    try {
      const docRef = doc(db, 'properties', id);
      await updateDoc(docRef, updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  deleteProperty: async (id: string): Promise<void> => {
    const path = `properties/${id}`;
    try {
      const docRef = doc(db, 'properties', id);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  subscribeProperties: (callback: (properties: Property[]) => void) => {
    const path = 'properties';
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const props = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property));
      callback(props);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });
  },

  incrementView: async (id: string): Promise<void> => {
    const path = `properties/${id}`;
    try {
      const docRef = doc(db, 'properties', id);
      await updateDoc(docRef, {
        views: increment(1)
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  toggleLike: async (id: string, userId: string, isLiked: boolean): Promise<void> => {
    const path = `properties/${id}`;
    try {
      const docRef = doc(db, 'properties', id);
      await updateDoc(docRef, {
        likes: isLiked ? arrayRemove(userId) : arrayUnion(userId)
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  testConnection: async () => {
    try {
      // Test connection as suggested in instructions
      await getDocFromServer(doc(db, 'test', 'connection'));
    } catch (error) {
      if (error instanceof Error && error.message.includes('the client is offline')) {
        console.error("Please check your Firebase configuration.");
      }
      // Silently fail if just the test doc doesn't exist, which is fine
    }
  }
};
