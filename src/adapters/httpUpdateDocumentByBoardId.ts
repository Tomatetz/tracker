/*!
 * Copyright © 2018-present Upvest GmbH. All rights reserved.
 *
 * License is found in the LICENSE file in the root directory of this source tree.
 */

import * as firebase from 'firebase'
import { BoardId, Board } from '../model'

export const httpUpdateDocumentByBoardId = (boardId: BoardId, board: Board) => {
    return firebase
        .firestore()
        .collection('tasks')
        .doc(boardId.toString())
        .update(board)
}
