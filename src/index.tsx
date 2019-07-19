import './index.css'

import * as serviceWorker from './serviceWorker'

import App from './App'
import React from 'react'
import ReactDOM from 'react-dom'
import firebase from 'firebase'

firebase.initializeApp({
    apiKey: 'AIzaSyCzJpN2PpAgT1so97__GiymRMVzTmdtom8',
    authDomain: 'tracker-f703d.firebaseapp.com',
    databaseURL: 'https://tracker-f703d.firebaseio.com',
    projectId: 'tracker-f703d',
    storageBucket: '',
    messagingSenderId: '608550862288',
    appId: '1:608550862288:web:2c0b88ad7d99b3c3',
})

ReactDOM.render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
