/*!
 * Copyright © 2018-present Aleksei Ganikhin. All rights reserved.
 *
 * License is found in the LICENSE file in the root directory of this source tree.
 */

import './App.scss'

import { Content } from './ui/Content/Content'
import { ContentProvider } from './ui/AppContext/AppProvider'
import React from 'react'
import firebase from 'firebase'

firebase.initializeApp({
    apiKey: process.env.REACT_APP_FIRABASE_KEY,
    authDomain: process.env.REACT_APP_FIRABASE_DOMAIN,
    databaseURL: process.env.REACT_APP_FIRABASE_URL,
    projectId: process.env.REACT_APP_FIRABASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIRABASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIRABASE_SENDER_ID,
    appId: process.env.REACT_APP_FIRABASE_APP_ID,
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
