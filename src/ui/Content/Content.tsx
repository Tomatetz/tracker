/*!
 * Copyright © 2019-present Aleksei Ganikhin. All rights reserved.
 *
 * License is found in the LICENSE file in the root directory of this source tree.
 */

import './Content.scss'

import React, { Component } from 'react'

import { AddCardModal } from '../AddCardModal'
import { BoardComponent } from '../BoardComponent'
import { ContentConsumer } from '../AppContext/AppProvider'
import { ModalComponent } from '../ModalWindow'
import { Task } from '../../model'

interface Props {
    readonly addCard: (boardId: string, card: Task) => void
}
type State = {
    showAddCardModalWindow: boolean
    currentBoardId?: string
}

export class Content extends Component<Props, State> {
    public state = {
        showAddCardModalWindow: false,
        currentBoardId: '',
    }
    private toggleAddCardModalWindow = (showAddCardModalWindow: boolean, boardId?: string) => {
        this.setState({ showAddCardModalWindow, currentBoardId: boardId })
    }
    private saveNewCard = (card: Task) => {
        const { addCard } = this.props
        const { currentBoardId } = this.state
        if (currentBoardId) {
            this.toggleAddCardModalWindow(false)
            addCard(currentBoardId, card)
        }
    }
    public render() {
        const { showAddCardModalWindow } = this.state
        return (
            <>
                <div className="content">
                    <ContentConsumer>
                        {({ boards, setTasks, saveTasks }) => (
                            <>
                                {boards.map(board => (
                                    <BoardComponent
                                        key={board.id}
                                        board={board}
                                        toggleAddCardModalWindow={this.toggleAddCardModalWindow}
                                        setTasks={setTasks}
                                        saveTasks={saveTasks}
                                    />
                                ))}
                            </>
                        )}
                    </ContentConsumer>
                </div>

                {showAddCardModalWindow && (
                    <ModalComponent>
                        <AddCardModal
                            toggleAddCardModalWindow={this.toggleAddCardModalWindow}
                            saveNewCard={this.saveNewCard}
                        />
                    </ModalComponent>
                )}
            </>
        )
    }
}
