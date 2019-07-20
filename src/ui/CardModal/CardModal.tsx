/*!
 * Copyright © 2019-present Aleksei Ganikhin. All rights reserved.
 *
 * License is found in the LICENSE file in the root directory of this source tree.
 */

import './CardModal.scss'

import React, { FC, useState } from 'react'

import { Task } from '../../model'
import avatarLesha from '../static/avatar.jpg'
import avatarLiza from '../static/avatar-liza.jpg'

interface Props {
    readonly card?: Task
    readonly boardId: string
    readonly toggleAddCardModalWindow: (_: boolean) => void
    readonly addCard: (boardId: string, card: Task) => void
}
export const CardModal: FC<Props> = ({ toggleAddCardModalWindow, addCard, boardId }) => {
    const [card, setCardData] = useState({
        name: '',
        body: '',
        owner: 'lesha',
        id: Math.floor(Math.random() * 100000),
    })

    return (
        <div className="add-card-modal-content">
            <div className="basic-element">
                <label>Name</label>
                <input
                    className="input-basic"
                    value={card.name}
                    onChange={e => setCardData({ ...card, name: e.currentTarget.value })}
                />
            </div>
            <div className="basic-element">
                <label>Description</label>
                <input
                    className="input-basic"
                    value={card.body}
                    onChange={e => setCardData({ ...card, body: e.currentTarget.value })}
                />
            </div>
            <div className="basic-element">
                <label>Owner</label>
                <div>
                    <img
                        className={`owner-image ${card.owner === 'lesha' ? ' selected' : ''}`}
                        src={avatarLesha}
                        alt=""
                        onClick={_ => setCardData({ ...card, owner: 'lesha' })}
                    />
                    <img
                        className={'owner-image' + (card.owner === 'liza' ? ' selected' : '')}
                        src={avatarLiza}
                        alt=""
                        onClick={_ => setCardData({ ...card, owner: 'liza' })}
                    />
                </div>
            </div>
            <footer className="footer-basic">
                <button className="button-basic" onClick={_ => toggleAddCardModalWindow(false)}>
                    Cancel
                </button>
                <button
                    className="button-brand"
                    onClick={_ => {
                        toggleAddCardModalWindow(false)
                        addCard(boardId, card)
                    }}
                >
                    Submit
                </button>
            </footer>
        </div>
    )
}
