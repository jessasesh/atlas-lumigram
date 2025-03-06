import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyCknTTMx5gjMUEgaSNEfW1NGsYR8klVRw4",
  authDomain: "lumigram-ab48e.firebaseapp.com",
  projectId: "lumigram-ab48e",
  storageBucket: "lumigram-ab48e.firebasestorage.app",
  messagingSenderId: "1054223540871",
  appId: "1:1054223540871:web:8173563cc7a59aba688e22"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

onAuthStateChanged(auth, async (user) => {
  if (user) {
    await AsyncStorage.setItem("user", JSON.stringify(user));
  } else {
    await AsyncStorage.removeItem("user");
  }
});

export const restoreUserSession = async () => {
  const userData = await AsyncStorage.getItem("user");
  return userData ? JSON.parse(userData) : null;
};

export { app, auth, db, storage };