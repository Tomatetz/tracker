/*!
 * Copyright © 2019-present Aleksei Ganikhin. All rights reserved.
 *
 * License is found in the LICENSE file in the root directory of this source tree.
 */

import './Card.scss'

import React, { FC, useContext } from 'react'

import { Context } from '../AppContext/AppProvider'
import { ReactComponent as EditIcon } from '../static/edit2.svg'
import { Task } from '../../model'
import avatarLesha from '../static/avatar.jpg'
import avatarLiza from '../static/avatar-liza.jpg'

interface Props {
    readonly task: Task
    readonly boardId: string
    readonly showEditCardModal: (card: Task) => void
}

export const Card: FC<Props> = ({ task, boardId, showEditCardModal }) => {
    const { deleteCard, updateDraggedCard } = useContext(Context)

    return (
        <div
            draggable
            className={'card' + (task.owner === 'lesha' ? ' owner-lesha' : ' owner-liza')}
            onDragStart={_ => updateDraggedCard(boardId, task)}
        >
            <header className="card-header">
                <img
                    className="owner-image"
                    src={task.owner === 'lesha' ? avatarLesha : avatarLiza}
                    alt="avatar"
                />
                <div className="card-header__navigation">
                    <div className="edit-card" onClick={_ => showEditCardModal(task)}>
                        <EditIcon />
                    </div>
                    <div className="delete-card" onClick={_ => deleteCard(boardId, task.id)}>
                        ✕
                    </div>
                </div>
            </header>
            {task.name}
            <article className="card-body">{task.body}</article>
        </div>
    )
}
