/*!
 * Copyright © 2018-present Upvest GmbH. All rights reserved.
 *
 * License is found in the LICENSE file in the root directory of this source tree.
 */

import { Board } from '../model'

export const boardsDeepCopy: (boards: Board[]) => Board[] = (boards: Board[]) =>
    JSON.parse(JSON.stringify(boards))
