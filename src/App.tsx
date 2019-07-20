import './App.scss'

import { Content } from './ui/Content/Content'
import { ContentProvider } from './ui/AppContext/AppProvider'
import React from 'react'

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
