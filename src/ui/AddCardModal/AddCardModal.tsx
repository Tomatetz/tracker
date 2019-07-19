/*!
 * Copyright © 2019-present Aleksei Ganikhin. All rights reserved.
 *
 * License is found in the LICENSE file in the root directory of this source tree.
 */

import './AddCardModal.scss'

import React, { Component } from 'react'

import { Task } from '../../model'

interface Props {
    readonly toggleAddCardModalWindow: (_: boolean) => void
    readonly saveNewCard: (card: Task) => void
}
type State = {
    name: string
    body: string
}

export class AddCardModal extends Component<Props, State> {
    public state = {
        name: '',
        body: '',
    }
    private onSaveCardClick = () => {
        const { name, body } = this.state
        const { saveNewCard } = this.props
        const newCard = {
            name,
            body,
            id: Math.floor(Math.random() * 100000),
        } as Task
        saveNewCard(newCard)
    }
    public render() {
        const { toggleAddCardModalWindow } = this.props
        const { name, body } = this.state
        return (
            <>
                <div className="add-card-modal-content">
                    <div className="basic-element">
                        <label>Name</label>
                        <input
                            className="input-basic"
                            value={name}
                            onChange={target => {
                                const name = target.currentTarget.value
                                this.setState({ name })
                            }}
                        ></input>
                    </div>
                    <div className="basic-element">
                        <label>Description</label>
                        <input
                            className="input-basic"
                            value={body}
                            onChange={target => {
                                const body = target.currentTarget.value
                                this.setState({ body })
                            }}
                        ></input>
                    </div>

                    <footer className="footer-basic">
                        <button
                            className="button-basic"
                            onClick={() => toggleAddCardModalWindow(false)}
                        >
                            Cancel
                        </button>
                        <button className="button-brand" onClick={this.onSaveCardClick}>
                            Submit
                        </button>
                    </footer>
                </div>
            </>
        )
    }
}
