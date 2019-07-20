/*!
 * Copyright © 2019-present Aleksei Ganikhin. All rights reserved.
 *
 * License is found in the LICENSE file in the root directory of this source tree.
 */

/* tslint:disable: max-classes-per-file */

export interface Task {
    id: number
    name: string
    body: string
    owner: string
}

export interface Board {
    id: string
    name: string
    tasks: Task[]
}
