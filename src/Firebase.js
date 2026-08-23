
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyCnDXcMRe25JwGNDAZSc78KwF2rr5Oeefk',
  authDomain: 'helios-energy-73b90.firebaseapp.com',
  projectId: 'helios-energy-73b90',
  storageBucket: 'helios-energy-73b90.firebasestorage.app',
  messagingSenderId: '710064148182',
  appId: '1:710064148182:web:040324327a59a0017f8377',
  measurementId: 'G-RC2THY5VSV'
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

