import { initializeApp } from 'firebase/app';
import { initializeFirestore, collection, doc, setDoc, getDocs, getDocFromServer, query, where } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { CubicajeRecord } from '../types';

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
    tenantId?: string | null;
  }
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});
export const auth = getAuth(app);

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
  };
  console.error('Firestore Error Detailed: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// 1. Connection check validation
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    // Attempt load to verify connection is upright using an allowed path to avoid security block warnings
    await getDocFromServer(doc(db, 'cubicajes', 'handshake_test_doc'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firebase client is currently offline.", error.message);
      return false;
    }
    // Any other error means the connection was made but either document doesn't exist or other safe condition
    return true;
  }
}

// 2. Fetch all backup records from the Cloud for the current user's email
export async function getCubicajesFromCloud(userEmail?: string): Promise<CubicajeRecord[]> {
  const collectionPath = 'cubicajes';
  try {
    let q;
    if (userEmail) {
      q = query(
        collection(db, collectionPath),
        where('userEmail', '==', userEmail)
      );
    } else {
      q = query(collection(db, collectionPath));
    }
    
    const snapshot = await getDocs(q);
    const records: CubicajeRecord[] = [];
    snapshot.forEach((snapDoc) => {
      records.push(snapDoc.data() as CubicajeRecord);
    });

    // Sort client-side by date descending to avoid requiring composite Firestore indexes
    records.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    
    return records;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, collectionPath);
    return [];
  }
}

// 3. Write/Upload a record to cloud backup
export async function saveCubicajeToCloud(record: CubicajeRecord): Promise<void> {
  const collectionPath = `cubicajes`;
  try {
    // Firestore does not accept undefined values. Clean all properties that are undefined.
    const cleanRecord = JSON.parse(JSON.stringify(record, (key, value) => {
      return value === undefined ? null : value;
    }));
    
    const finalRecord = { ...cleanRecord };
    for (const key of Object.keys(finalRecord)) {
      if (finalRecord[key] === null || finalRecord[key] === undefined) {
        delete finalRecord[key];
      }
    }

    await setDoc(doc(db, collectionPath, record.id), finalRecord);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${collectionPath}/${record.id}`);
  }
}
