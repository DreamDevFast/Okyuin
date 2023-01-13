// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getAnalytics} from 'firebase/analytics';
import {getFirestore} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDI4q6USc69kT2OIeFQQSeRWnCB6nARcto',
  authDomain: 'okyuin-akiba.firebaseapp.com',
  projectId: 'okyuin-akiba',
  storageBucket: 'okyuin-akiba.appspot.com',
  messagingSenderId: '368034776080',
  appId: '1:368034776080:web:b2a7b409c8434afd413695',
  measurementId: 'G-5NPY6Y1TYJ',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export {db, auth};
