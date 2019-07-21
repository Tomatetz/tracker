/*!
 * Copyright © 2019-present Aleksei Ganikhin. All rights reserved.
 *
 * License is found in the LICENSE file in the root directory of this source tree.
 */

import './Content.scss'

import React, { Component } from 'react'

import { Board } from '../../model'
import { BoardComponent } from '../BoardComponent'
import { ContentConsumer } from '../AppContext/AppProvider'

interface Props {}

export class Content extends Component<Props> {
    public render() {
        return (
            <div className="content">
                <ContentConsumer>
                    {({ boards }) => (
                        <>
                            {boards.map((board: Board) => (
                                <BoardComponent key={board.id.toString()} board={board} />
                            ))}
                        </>
                    )}
                </ContentConsumer>
            </div>
        )
    }
}
