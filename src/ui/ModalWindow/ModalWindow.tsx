/*!
 * Copyright © 2018-present Aleksei Ganikhin. All rights reserved.
 *
 * License is found in the LICENSE file in the root directory of this source tree.
 */

import './ModalWindow.scss'

import React, { SFC } from 'react'

export interface Props {
    readonly extraClass?: string
}

export const ModalComponent: SFC<Props> = ({ children, extraClass }) => {
    return (
        <div className="modal-window">
            <div className="modal-window-background" />
            <div className={`${extraClass || ''} modal-window-body`}>{children}</div>
        </div>
    )
}
