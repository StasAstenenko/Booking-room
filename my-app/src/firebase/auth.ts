import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { auth, db } from './client';
import { doc, setDoc } from 'firebase/firestore';
import { RegUser, User } from '@/types/authTypes';

export const registerUser = async ({ name, email, password }: RegUser) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  await updateProfile(userCredential.user, { displayName: name });

  await setDoc(doc(db, 'users', userCredential.user.uid), {
    name,
    email,
    createdAt: Date.now(),
  });
  return userCredential.user;
};

export const loginUser = async ({ email, password }: User) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
};
