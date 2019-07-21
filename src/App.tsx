import './App.scss'

import { Content } from './ui/Content/Content'
import { ContentProvider } from './ui/AppContext/AppProvider'
import React from 'react'
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

const App: React.FC = () => {
    return (
        <div className="App">
            <header className="App-header">
                <ContentProvider>
                    <Content />
                </ContentProvider>
            </header>
        </div>
    )
}

export default App
