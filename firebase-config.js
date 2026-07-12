const firebaseConfig = {
  apiKey: "AIzaSyAgu1uiobgixRWcvIja6bI1l6M2KQ36FL4",
  authDomain: "carzzy-apps.firebaseapp.com",
  projectId: "carzzy-apps",
  storageBucket: "carzzy-apps.firebasestorage.app",
  messagingSenderId: "716862658931",
  appId: "1:716862658931:web:2d987c92c3021837dc0d06",
  measurementId: "G-E7YRSGSQ05"
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
