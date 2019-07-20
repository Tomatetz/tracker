/*!
 * Copyright © 2019-present Aleksei Ganikhin. All rights reserved.
 *
 * License is found in the LICENSE file in the root directory of this source tree.
 */

import './BoardComponent.scss'

import { Board, Task } from '../../model'
import React, { Component } from 'react'

import { Card } from '../Card/Card'
import { CardModal } from '../CardModal'
import { ContentConsumer } from '../AppContext/AppProvider'
import { ModalComponent } from '../ModalWindow'

interface Props {
    readonly board: Board
    readonly reorderCards: (boardOverId: string) => void
    readonly saveCards: (boardId: string) => void
    readonly addCard: (boardId: string, card: Task) => void
}

interface State {
    showAddCardModalWindow: boolean
}

export class BoardComponent extends Component<Props, State> {
    public state = {
        showAddCardModalWindow: false,
    }
    private toggleAddCardModalWindow = (showAddCardModalWindow: boolean) => {
        this.setState({ showAddCardModalWindow })
    }
    public render() {
        const { board, addCard, saveCards, reorderCards } = this.props
        const { showAddCardModalWindow } = this.state
        return (
            <>
                <div className="board" key={board.id}>
                    <header className="board-header">
                        <div className="board-name">{board.name}</div>
                        <div className="board-controls">
                            <div
                                className="add-task"
                                onClick={_ => this.toggleAddCardModalWindow(true)}
                            >
                                +
                            </div>
                        </div>
                    </header>
                    <div
                        className="droppable"
                        onDragOver={e => {
                            e.preventDefault()
                            reorderCards(board.id)
                        }}
                        onDrop={_ => saveCards(board.id)}
                    >
                        <ContentConsumer>
                            {({ deleteCard, updateDraggedCard }) => (
                                <>
                                    {board.tasks.map(task => (
                                        <Card
                                            key={task.id}
                                            boardId={board.id}
                                            task={task}
                                            deleteCard={deleteCard}
                                            updateDraggedCard={updateDraggedCard}
                                        />
                                    ))}
                                </>
                            )}
                        </ContentConsumer>
                    </div>
                </div>

                {showAddCardModalWindow && (
                    <ModalComponent>
                        <CardModal
                            toggleAddCardModalWindow={this.toggleAddCardModalWindow}
                            boardId={board.id}
                            addCard={addCard}
                        />
                    </ModalComponent>
                )}
            </>
        )
    }
}
