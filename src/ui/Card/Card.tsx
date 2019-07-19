/*!
 * Copyright © 2019-present Aleksei Ganikhin. All rights reserved.
 *
 * License is found in the LICENSE file in the root directory of this source tree.
 */

import './Card.scss'

import React, { FC } from 'react'

import { Task } from '../../model'
import avatarLesha from '../static/avatar.jpg'
import avatarLiza from '../static/avatar-liza.jpg'

interface Props {
    readonly task: Task
    readonly deleteCard: (boardId: string, cardId: number) => void
    readonly boardId: string
    readonly updateDraggedCard: (boardId: string, card: Task) => void
}

export const Card: FC<Props> = ({ task, deleteCard, boardId, updateDraggedCard }) => {
    return (
        <div
            draggable
            className={'card' + (task.owner === 'lesha' ? ' owner-lesha' : ' owner-liza')}
            onDragStart={() => {
                updateDraggedCard(boardId, task)
            }}
        >
            <header className="card-header">
                <img
                    className="owner-image"
                    src={task.owner === 'lesha' ? avatarLesha : avatarLiza}
                    alt="avatar"
                />
                <div className="card-header__navigation">
                    <div
                        className="delete-card"
                        onClick={() => {
                            deleteCard(boardId, task.id)
                        }}
                    >
                        ✕
                    </div>
                </div>
            </header>
            {task.name}
            {task.body && <article className="card-body">{task.body}</article>}
        </div>
    )
}
