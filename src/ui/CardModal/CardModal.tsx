/*!
 * Copyright © 2019-present Aleksei Ganikhin. All rights reserved.
 *
 * License is found in the LICENSE file in the root directory of this source tree.
 */

import './CardModal.scss'

import { BoardId, CardModel } from '../../model'
import React, { FC, useContext, useState } from 'react'

import { Context } from '../AppContext/AppProvider'
import avatarLesha from '../static/avatar.jpg'
import avatarLiza from '../static/avatar-liza.jpg'

interface Props {
    readonly defaultCard: CardModel
    readonly boardId: BoardId
    readonly toggleShowCardModalWindow: (_: boolean) => void
}
export const CardModal: FC<Props> = ({ toggleShowCardModalWindow, boardId, defaultCard }) => {
    const [card, setCardData] = useState(defaultCard)
    const { saveUpdatedCard, saveNewCard } = useContext(Context)

    return (
        <div className="add-card-modal-content">
            <section className="basic-element">
                <label>Name</label>
                <input
                    className="input-basic"
                    autoFocus
                    value={card.name}
                    onChange={e => setCardData({ ...card, name: e.currentTarget.value })}
                />
            </section>
            <section className="basic-element">
                <label>Description</label>
                <textarea
                    className="textarea-basic"
                    value={card.body}
                    onChange={e => setCardData({ ...card, body: e.currentTarget.value })}
                />
            </section>
            <section className="basic-element">
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
            </section>
            <footer className="footer-basic">
                <button className="button-basic" onClick={_ => toggleShowCardModalWindow(false)}>
                    Cancel
                </button>
                <button
                    className="button-brand"
                    disabled={!card.name || !card.body}
                    onClick={_ => {
                        toggleShowCardModalWindow(false)
                        defaultCard.name
                            ? saveUpdatedCard({ boardId, card })
                            : saveNewCard({ boardId, card })
                    }}
                >
                    Submit
                </button>
            </footer>
        </div>
    )
}
