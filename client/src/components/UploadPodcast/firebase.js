import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAiuT_8SsNwpx14CGePMmg0ciJWutjxW0Q",
  authDomain: "chat-room-a7b89.firebaseapp.com",
  projectId: "chat-room-a7b89",
  storageBucket: "chat-room-a7b89.appspot.com",
  messagingSenderId: "174234859763",
  appId: "1:174234859763:web:bdf79ae13a143ec4f41f86",
  measurementId: "G-ZGXT4WVR3X",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
