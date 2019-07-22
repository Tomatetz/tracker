/*!
 * Copyright © 2018-present Aleksei Ganikhin. All rights reserved.
 *
 * License is found in the LICENSE file in the root directory of this source tree.
 */

import { CombinedDateAndTime } from '../model'

export const getDateTime: () => CombinedDateAndTime = () => new Date().toLocaleString()
