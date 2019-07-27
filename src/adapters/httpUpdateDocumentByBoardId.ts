/*!
 * Copyright © 2018-present Aleksei Ganikhin. All rights reserved.
 *
 * License is found in the LICENSE file in the root directory of this source tree.
 */

import * as firebase from 'firebase'

import { Board } from '../model'

export const httpUpdateDataId = (boards: Board[]) => {
    return firebase
        .firestore()
        .collection('tasks')
        .doc('boards')
        .update({
            boards,
        })
}
