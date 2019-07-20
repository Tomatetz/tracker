/*!
 * Copyright © 2019-present Aleksei Ganikhin. All rights reserved.
 *
 * License is found in the LICENSE file in the root directory of this source tree.
 */

import './BoardComponent.scss'

import { Board, Task } from '../../model'
import React, { FC, useContext, useState } from 'react'

import { Card } from '../Card/Card'
import { CardModal } from '../CardModal'
import { Context } from '../AppContext/AppProvider'
import { ModalComponent } from '../ModalWindow'

interface Props {
    readonly board: Board
}

export const BoardComponent: FC<Props> = ({ board }) => {
    const [showCardModalWindow, toggleShowCardModalWindow] = useState(false)
    const [editedCard, setEditedCardValue] = useState({} as Task)
    const showEditCardModal = (editedCard: Task) => {
        setEditedCardValue(editedCard)
        toggleShowCardModalWindow(true)
    }
    const { reorderCards, saveCards } = useContext(Context)
    return (
        <>
            <div className="board" key={board.id}>
                <header className="board-header">
                    <div className="board-name">{board.name}</div>
                    <div className="board-controls">
                        <div
                            className="add-task"
                            onClick={_ => {
                                setEditedCardValue({
                                    name: '',
                                    body: '',
                                    owner: 'lesha',
                                    id: Math.floor(Math.random() * 100000),
                                } as Task)
                                toggleShowCardModalWindow(true)
                            }}
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
                    {board.tasks.map(task => (
                        <Card
                            key={task.id}
                            boardId={board.id}
                            task={task}
                            showEditCardModal={showEditCardModal}
                        />
                    ))}
                </div>
            </div>
            {showCardModalWindow && (
                <ModalComponent>
                    <CardModal
                        toggleShowCardModalWindow={toggleShowCardModalWindow}
                        boardId={board.id}
                        defaultCard={editedCard}
                    />
                </ModalComponent>
            )}
        </>
    )
}
