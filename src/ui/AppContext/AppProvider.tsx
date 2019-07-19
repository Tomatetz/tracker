/*!
 * Copyright © 2019-present Aleksei Ganikhin. All rights reserved.
 *
 * License is found in the LICENSE file in the root directory of this source tree.
 */

import * as firebase from 'firebase'

import { Board, Task } from '../../model'
import React, { Component, createContext } from 'react'

type Props = {}

const initialState = {
    setTasks: (_: string) => {
        return
    },
    saveTasks: (_: string) => {
        return
    },
    addCard: (zoneId: string, card: Task) => {
        return { zoneId, card }
    },
    deleteCard: (zoneId: string, cardId: number) => {
        return { zoneId, cardId }
    },
    updateDraggedCard: (zoneId: string, card: Task) => {
        return { zoneId, card }
    },
    updateEditedCard: (zoneId: string, card: Task) => {
        return { zoneId, card }
    },
    boards: [] as Board[],
    draggedCard: {
        card: {} as Task,
        zoneId: '',
    },
}
type State = typeof initialState
const { Provider, Consumer } = createContext(initialState)

export class ContentProvider extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            ...initialState,
            setTasks: this.setTasks,
            deleteCard: this.deleteCard,
            addCard: this.addCard,
            saveTasks: this.saveTasks,
            updateDraggedCard: this.updateDraggedCard,
            updateEditedCard: this.updateEditedCard,
        }
    }
    public componentDidMount() {
        firebase
            .firestore()
            .collection('tasks')
            .onSnapshot(snap => {
                let boards: Board[] = []
                snap.docs.forEach((_doc, i) => {
                    const data = _doc.data()
                    data['id'] = _doc.id
                    boards.push(data as Board)

                    if (i === snap.docs.length - 1) {
                    }
                })
                this.setState({ boards })
            })
    }
    private setTasks = (zoneOverId: string) => {
        const { boards } = this.state
        const { card } = this.state.draggedCard
        let newBoards: Board[] = [...boards]
        newBoards.forEach((board: Board, i: number) => {
            if (board.id === zoneOverId) {
                if (!board.tasks.some(item => item.id === card.id)) {
                    board.tasks.push(card)
                }
            } else {
                board.tasks = board.tasks.filter(value => value.id !== card.id)
            }
            if (i === newBoards.length - 1) {
                this.setState({ boards: newBoards })
            }
        })
    }
    private deleteCard = (zoneId: string, cardId: number) => {
        const { boards } = this.state
        const currentZone = JSON.parse(JSON.stringify(boards)).filter(
            (board: Board) => board.id === zoneId,
        )[0]
        currentZone.tasks = currentZone.tasks.filter((value: Task) => value.id !== cardId)

        firebase
            .firestore()
            .collection('tasks')
            .doc(zoneId)
            .set(currentZone)
        return { zoneId, cardId }
    }
    private addCard = (zoneId: string, card: Task) => {
        const { boards } = this.state
        const currentZone = JSON.parse(JSON.stringify(boards)).filter(
            (board: Board) => board.id === zoneId,
        )[0]
        currentZone.tasks.push(card)
        firebase
            .firestore()
            .collection('tasks')
            .doc(zoneId)
            .set(currentZone)
        return { zoneId, card }
    }
    private saveTasks = (zoneId: string) => {
        const { zoneId: zoneDropFromId } = this.state.draggedCard
        const { boards } = this.state
        const zoneDropTo = JSON.parse(JSON.stringify(boards)).filter(
            (board: Board) => board.id === zoneId,
        )[0]
        const zoneDropFrom = JSON.parse(JSON.stringify(boards)).filter(
            (board: Board) => board.id === zoneDropFromId,
        )[0]

        const batch = firebase.firestore().collection('tasks')
        batch
            .doc(zoneDropFromId)
            .update(zoneDropFrom)
            .then(() => {
                batch.doc(zoneId).update(zoneDropTo)
            })
    }
    private updateDraggedCard = (zoneId: string, card: Task) => {
        this.setState({ draggedCard: { zoneId, card } })
        return { zoneId, card }
    }
    private updateEditedCard = (zoneId: string, card: Task) => {

        
        return { zoneId, card }
    }
    public render() {
        return <Provider value={this.state}>{this.props.children}</Provider>
    }
}
export const ContentConsumer = Consumer
