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
    reorderCards: (_: string) => {
        return
    },
    saveCards: (_: string) => {
        return
    },
    addCard: (boardId: string, card: Task) => {
        return { boardId, card }
    },
    deleteCard: (boardId: string, cardId: number) => {
        return { boardId, cardId }
    },
    updateDraggedCard: (boardId: string, card: Task) => {
        return { boardId, card }
    },
    boards: [] as Board[],
    draggedCard: {
        card: {} as Task,
        boardId: '',
    },
}
type State = typeof initialState
const { Provider, Consumer } = createContext(initialState)

export class ContentProvider extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            ...initialState,
            reorderCards: this.reorderCards,
            deleteCard: this.deleteCard,
            addCard: this.addCard,
            saveCards: this.saveCards,
            updateDraggedCard: this.updateDraggedCard,
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
    private reorderCards = (boardOverId: string) => {
        const { boards } = this.state
        const { card } = this.state.draggedCard
        let newBoards: Board[] = [...boards]
        newBoards.forEach((board: Board, i: number) => {
            if (board.id === boardOverId) {
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
    private saveCards = (boardId: string) => {
        const { boardId: boardDropFromId } = this.state.draggedCard
        const { boards } = this.state
        if (boardId !== boardDropFromId) {
            const boardDropTo = JSON.parse(JSON.stringify(boards)).filter(
                (board: Board) => board.id === boardId,
            )[0]
            const boardDropFrom = JSON.parse(JSON.stringify(boards)).filter(
                (board: Board) => board.id === boardDropFromId,
            )[0]
            const batch = firebase.firestore().collection('tasks')
            batch
                .doc(boardDropFromId)
                .update(boardDropFrom)
                .then(() => {
                    batch.doc(boardId).update(boardDropTo)
                })
        }
    }
    private deleteCard = (boardId: string, cardId: number) => {
        const { boards } = this.state
        const currentboard = JSON.parse(JSON.stringify(boards)).filter(
            (board: Board) => board.id === boardId,
        )[0]
        currentboard.tasks = currentboard.tasks.filter((value: Task) => value.id !== cardId)

        firebase
            .firestore()
            .collection('tasks')
            .doc(boardId)
            .set(currentboard)
        return { boardId, cardId }
    }
    private addCard = (boardId: string, card: Task) => {
        const { boards } = this.state
        const currentboard = JSON.parse(JSON.stringify(boards)).filter(
            (board: Board) => board.id === boardId,
        )[0]
        currentboard.tasks.push(card)
        firebase
            .firestore()
            .collection('tasks')
            .doc(boardId)
            .update(currentboard)
        return { boardId, card }
    }
    private updateDraggedCard = (boardId: string, card: Task) => {
        this.setState({ draggedCard: { boardId, card } })
        return { boardId, card }
    }
    public render() {
        return <Provider value={this.state}>{this.props.children}</Provider>
    }
}
export const ContentConsumer = Consumer
