/*!
 * Copyright © 2018-present Aleksei Ganikhin. All rights reserved.
 *
 * License is found in the LICENSE file in the root directory of this source tree.
 */

export function deepArrayCopy<T>(boards: T[]): T[] {
    return JSON.parse(JSON.stringify(boards))
}
