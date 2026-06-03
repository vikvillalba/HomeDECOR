// src/features/auth/services/authService.ts

import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../../../config/firebase";

export async function loginWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function logout() {
  return signOut(auth);
}