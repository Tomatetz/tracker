/*!
 * Copyright © 2019-present Aleksei Ganikhin. All rights reserved.
 *
 * License is found in the LICENSE file in the root directory of this source tree.
 */

import './Card.scss'

import { BoardId, CardModel } from '../../model'
import React, { FC, useContext } from 'react'

import { Context } from '../AppContext/AppProvider'
import { ReactComponent as DeleteIcon } from '../static/delete-button.svg'
import { ReactComponent as EditIcon } from '../static/edit.svg'
import avatarLesha from '../static/avatar.jpg'
import avatarLiza from '../static/avatar-liza.jpg'

interface Props {
    readonly card: CardModel
    readonly boardId: BoardId
    readonly position: number
    readonly showEditCardModal: (card: CardModel) => void
}

export const Card: FC<Props> = ({ card, boardId, position, showEditCardModal }) => {
    const { deleteCard, updateDraggedCardModel, dragCard } = useContext(Context)

    return (
        <div
            draggable
            className={'card' + (card.owner === 'lesha' ? ' owner-lesha' : ' owner-liza')}
            onDragStart={_ => updateDraggedCardModel({ boardId, card })}
        >
            <section
                onDragOver={e => {
                    e.preventDefault()
                    dragCard({ boardId, targetCardPosition: position, positionShift: 0 })
                }}
            >
                <section className="card-header">
                    <img
                        className="owner-image"
                        src={card.owner === 'lesha' ? avatarLesha : avatarLiza}
                        alt="avatar"
                    />
                    <aside className="card-header__navigation">
                        <div
                            className="card-header__navigation-icon edit-card"
                            onClick={_ => showEditCardModal(card)}
                        >
                            <EditIcon />
                        </div>
                        <div
                            className="card-header__navigation-icon delete-card"
                            onClick={_ => deleteCard(boardId, card.id)}
                        >
                            <DeleteIcon />
                        </div>
                    </aside>
                </section>
                <header className="card-name">{card.name}</header>
            </section>
            <section
                onDragOver={e => {
                    e.preventDefault()
                    dragCard({ boardId, targetCardPosition: position, positionShift: 1 })
                }}
            >
                <article className="card-body">
                    <div>{card.body}</div>
                </article>
                <footer>
                    last edited:<time>{card.lastEdited}</time>
                </footer>
            </section>
        </div>
    )
}
