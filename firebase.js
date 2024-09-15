import {initializeApp} from 'firebase/app'
import {getStorage} from 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyBVgKmYKVIc8wh9EQc8Eo1T4oXKmcBTwxs",
    authDomain: "utlam-a1951.firebaseapp.com",
    projectId: "utlam-a1951",
    storageBucket: "utlam-a1951.appspot.com",
    messagingSenderId: "230121551358",
    appId: "1:230121551358:web:4dd48f0a441f129299bcaf"
  };

  const app = initializeApp(firebaseConfig)
  const storage = getStorage(app)