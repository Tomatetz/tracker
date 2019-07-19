/*!
 * Copyright © 2019-present Aleksei Ganikhin. All rights reserved.
 *
 * License is found in the LICENSE file in the root directory of this source tree.
 */

import './BoardComponent.scss'

import { Board, Task } from '../../model'
import React, { Component } from 'react'

import { Card } from '../Card/Card'

interface Props {
    readonly board: Board
    readonly toggleAddCardModalWindow: (showAddCardModalWindow: boolean, boardId?: string) => void
    readonly deleteCard: (zoneId: string, cardId: number) => void
    readonly updateDraggedCard: (zoneId: string, card: Task) => void
    readonly setTasks: (zoneOverId: string) => void
    readonly saveTasks: (zoneId: string) => void
}
type State = {}

export class BoardComponent extends Component<Props, State> {
    public state = {}
    private onDragOver = (e: React.DragEvent, zoneOverId: string) => {
        e.preventDefault()
        const { setTasks } = this.props
        setTasks(zoneOverId)
    }
    private onDrop = (e: React.DragEvent, zoneId: string) => {
        e.preventDefault()
        const { saveTasks } = this.props
        saveTasks(zoneId)
    }
    public render() {
        const { board, toggleAddCardModalWindow, deleteCard, updateDraggedCard } = this.props
        return (
            <>
                <div className="zone" key={board.id}>
                    <header className="zone-header">
                        <div className="zone-name">{board.name}</div>
                        <div className="zone-controls">
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
                        {board.tasks.map(task => (
                            <Card
                                key={task.id}
                                zoneId={board.id}
                                task={task}
                                deleteCard={deleteCard}
                                updateDraggedCard={updateDraggedCard}
                            />
                        ))}
                    </div>
                </div>
            </>
        )
    }
}
