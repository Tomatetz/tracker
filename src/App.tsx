import './App.scss'

import { ContentConsumer, ContentProvider } from './ui/AppContext/AppProvider'

import { Content } from './ui/Content/Content'
import React from 'react'

// import logo from './logo.svg'

const App: React.FC = () => {
    return (
        <div className="App">
            <header className="App-header">
                <ContentProvider>
                    <ContentConsumer>
                        {({ addCard }) => <Content addCard={addCard} />}
                    </ContentConsumer>
                </ContentProvider>
            </header>
        </div>
    )
}

export default App
