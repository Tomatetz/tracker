/*!
 * Copyright © 2019-present Aleksei Ganikhin. All rights reserved.
 *
 * License is found in the LICENSE file in the root directory of this source tree.
 */

import './CardModal.scss'

import React, { FC, useContext, useState } from 'react'

import { Context } from '../AppContext/AppProvider'
import { Task } from '../../model'
import avatarLesha from '../static/avatar.jpg'
import avatarLiza from '../static/avatar-liza.jpg'

interface Props {
    readonly defaultCard: Task
    readonly boardId: string
    readonly toggleShowCardModalWindow: (_: boolean) => void
}
export const CardModal: FC<Props> = ({ toggleShowCardModalWindow, boardId, defaultCard }) => {
    const [card, setCardData] = useState(defaultCard)
    const { saveUpdatedCard, addCard } = useContext(Context)

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
                <button className="button-basic" onClick={_ => toggleShowCardModalWindow(false)}>
                    Cancel
                </button>
                <button
                    className="button-brand"
                    onClick={_ => {
                        toggleShowCardModalWindow(false)
                        defaultCard.name ? saveUpdatedCard(boardId, card) : addCard(boardId, card)
                    }}
                >
                    Submit
                </button>
            </footer>
        </div>
    )
}
