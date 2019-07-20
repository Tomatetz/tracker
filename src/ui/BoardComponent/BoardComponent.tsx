/*!
 * Copyright © 2019-present Aleksei Ganikhin. All rights reserved.
 *
 * License is found in the LICENSE file in the root directory of this source tree.
 */

import './BoardComponent.scss'

import { Board, Task } from '../../model'
import React, { FC, useState } from 'react'

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

export const BoardComponent: FC<Props> = ({ board, addCard, saveCards, reorderCards }) => {
    const [showCardModalWindow, toggleShowCardModalWindow] = useState(false)
    const [editedCard, setEditedCardValue] = useState({} as Task)
    const showEditCardModal = (editedCard: Task) => {
        setEditedCardValue(editedCard)
        toggleShowCardModalWindow(true)
    }
    return (
        <>
            <div className="board" key={board.id}>
                <header className="board-header">
                    <div className="board-name">{board.name}</div>
                    <div className="board-controls">
                        <div
                            className="add-task"
                            onClick={_ => {
                                setEditedCardValue({} as Task)
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
                                        showEditCardModal={showEditCardModal}
                                    />
                                ))}
                            </>
                        )}
                    </ContentConsumer>
                </div>
            </div>
            {showCardModalWindow && (
                <ModalComponent>
                    <CardModal
                        toggleAddCardModalWindow={toggleShowCardModalWindow}
                        boardId={board.id}
                        addCard={addCard}
                        defaultCard={editedCard}
                    />
                </ModalComponent>
            )}
        </>
    )
}
