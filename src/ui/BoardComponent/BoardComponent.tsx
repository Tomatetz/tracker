/*!
 * Copyright © 2019-present Aleksei Ganikhin. All rights reserved.
 *
 * License is found in the LICENSE file in the root directory of this source tree.
 */

import './BoardComponent.scss'

import { Board, CardModel } from '../../model'
import React, { FC, useContext, useState } from 'react'

import { CardMemoized } from '../Card/Card'
import { CardModal } from '../CardModal'
import { Context } from '../AppContext/AppProvider'
import { ModalComponent } from '../ModalWindow'

interface Props {
    readonly board: Board
}

export const BoardComponent: FC<Props> = ({ board }) => {
    const [showCardModalWindow, toggleShowCardModalWindow] = useState(false)
    const [editedCard, setEditedCardValue] = useState({} as CardModel)
    const showEditCardModal = (card: CardModel) => {
        setEditedCardValue(card)
        toggleShowCardModalWindow(true)
    }
    const { saveCards, dragCard } = useContext(Context)

    return (
        <>
            <div className="board">
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
                                } as CardModel)
                                toggleShowCardModalWindow(true)
                            }}
                        >
                            +
                        </div>
                    </div>
                </header>
                <div
                    className="droppable"
                    onDrop={e => {
                        e.preventDefault()
                        console.log('Card drop event')
                        saveCards()
                    }}
                >
                    {board.tasks.length === 0 && (
                        <div
                            className="board-empty-state"
                            onDragOver={e => {
                                e.preventDefault()
                                dragCard({
                                    boardId: board.id,
                                    targetCardPosition: 0,
                                    positionShift: 0,
                                })
                            }}
                        ></div>
                    )}
                    {board.tasks.map((card, i) => (
                        <CardMemoized
                            key={card.id}
                            boardId={board.id}
                            card={card}
                            showEditCardModal={showEditCardModal}
                            position={i}
                        ></CardMemoized>
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
