/*!
 * Copyright © 2019-present Aleksei Ganikhin. All rights reserved.
 *
 * License is found in the LICENSE file in the root directory of this source tree.
 */

/* tslint:disable: max-classes-per-file */

export interface CardModel {
    id: number
    name: string
    body: string
    owner: string
    lastEdited: CombinedDateAndTime
}

export interface Board {
    id: BoardId
    name: string
    tasks: CardModel[]
}

export interface BoardCardInfo {
    boardId: BoardId
    card: CardModel
}

export interface DragNDropCongig {
    boardId: BoardId
    targetCardPosition: number
    positionShift: 0 | 1
}

export class CombinedDateAndTime extends String {
    constructor(s: string) {
        super(s)
    }
}

export class BoardId extends String {
    constructor(s: string) {
        super(s)
    }
}
