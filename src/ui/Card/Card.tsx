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
    readonly task: CardModel
    readonly boardId: BoardId
    readonly showEditCardModal: (card: CardModel) => void
}

export const Card: FC<Props> = ({ task, boardId, showEditCardModal }) => {
    const { deleteCard, updateDraggedCard } = useContext(Context)

    return (
        <div
            draggable
            className={'card' + (task.owner === 'lesha' ? ' owner-lesha' : ' owner-liza')}
            onDragStart={_ => updateDraggedCard(boardId, task)}
        >
            <section className="card-header">
                <img
                    className="owner-image"
                    src={task.owner === 'lesha' ? avatarLesha : avatarLiza}
                    alt="avatar"
                />
                <aside className="card-header__navigation">
                    <div
                        className="card-header__navigation-icon edit-card"
                        onClick={_ => showEditCardModal(task)}
                    >
                        <EditIcon />
                    </div>
                    <div
                        className="card-header__navigation-icon delete-card"
                        onClick={_ => deleteCard(boardId, task.id)}
                    >
                        <DeleteIcon />
                    </div>
                </aside>
            </section>
            <header className="card-name">{task.name}</header>
            <article className="card-body">
                <div>{task.body}</div>
            </article>
            <footer>
                last edited:<time>{task.lastEdited}</time>
            </footer>
        </div>
    )
}
