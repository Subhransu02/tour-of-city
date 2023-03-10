import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCE4MJ1r1UYLBtFgh2q-9RCrDPB2q_FzAE",
  authDomain: "tour-of-city.firebaseapp.com",
  projectId: "tour-of-city",
  storageBucket: "tour-of-city.appspot.com",
  messagingSenderId: "706525541677",
  appId: "1:706525541677:web:0c4ebe4338912032014fa4"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const storage = getStorage(app);