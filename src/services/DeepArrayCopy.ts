/*!
 * Copyright © 2018-present Aleksei Ganikhin. All rights reserved.
 *
 * License is found in the LICENSE file in the root directory of this source tree.
 */

export function deepArrayCopy<T>(a: T): T {
    return a
}
/*
 * ToDo: Check what is the best way - with function or with arrow as below
 */
// export const deepArrayCopy: <T>(a: T) => T = <T>(a: T) => JSON.parse(JSON.stringify(a))
