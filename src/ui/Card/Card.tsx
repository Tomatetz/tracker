/*!
 * Copyright © 2019-present Aleksei Ganikhin. All rights reserved.
 *
 * License is found in the LICENSE file in the root directory of this source tree.
 */

import './Card.scss'

import React, { FC } from 'react'

import { Task } from '../../model'

interface Props {
    readonly task: Task
    readonly deleteCard: (zoneId: string, cardId: number) => void
    readonly zoneId: string
    readonly updateDraggedCard: (zoneId: string, card: Task) => void
}

export const Card: FC<Props> = ({ task, deleteCard, zoneId, updateDraggedCard }) => {
    return (
        <div
            draggable
            className="card"
            onDragStart={() => {
                updateDraggedCard(zoneId, task)
            }}
        >
            <header className="card-header">
                <div className="card-header__navigation">
                    <div
                        className="delete-card"
                        onClick={() => {
                            deleteCard(zoneId, task.id)
                        }}
                    >
                        ✕
                    </div>
                </div>
                {task.name}
            </header>
            {task.body && <article className="card-body">{task.body}</article>}
        </div>
    )
}
