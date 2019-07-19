/*!
 * Copyright © 2019-present Aleksei Ganikhin. All rights reserved.
 *
 * License is found in the LICENSE file in the root directory of this source tree.
 */

import './BoardComponent.scss'

import React, { Component } from 'react'

import { Board } from '../../model'
import { Card } from '../Card/Card'
import { ContentConsumer } from '../AppContext/AppProvider'

interface Props {
    readonly board: Board

    readonly toggleAddCardModalWindow: (showAddCardModalWindow: boolean, boardId?: string) => void
    readonly setTasks: (boardOverId: string) => void
    readonly saveTasks: (boardId: string) => void
}
type State = {}

export class BoardComponent extends Component<Props, State> {
    public state = {}
    private onDragOver = (e: React.DragEvent, boardOverId: string) => {
        e.preventDefault()
        const { setTasks } = this.props
        setTasks(boardOverId)
    }
    private onDrop = (e: React.DragEvent, boardId: string) => {
        e.preventDefault()
        const { saveTasks } = this.props
        saveTasks(boardId)
    }
    public render() {
        const { board, toggleAddCardModalWindow } = this.props
        return (
            <>
                <div className="board" key={board.id}>
                    <header className="board-header">
                        <div className="board-name">{board.name}</div>
                        <div className="board-controls">
                            <div
                                className="add-task"
                                onClick={() => {
                                    toggleAddCardModalWindow(true, board.id)
                                }}
                            >
                                +
                            </div>
                        </div>
                    </header>
                    <div
                        className="droppable"
                        onDragOver={e => this.onDragOver(e, board.id)}
                        onDrop={e => this.onDrop(e, board.id)}
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
            </>
        )
    }
}
