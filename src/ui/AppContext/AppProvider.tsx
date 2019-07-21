/*!
 * Copyright © 2019-present Aleksei Ganikhin. All rights reserved.
 *
 * License is found in the LICENSE file in the root directory of this source tree.
 */

import * as firebase from 'firebase'

import { Board, BoardId, CardModel, CombinedDateAndTime } from '../../model'
import React, { Component, createContext } from 'react'

type Props = {}

const initialState = {
    reorderCards: (_: BoardId) => {
        return
    },
    saveCards: (_: BoardId) => {
        return
    },
    addCard: (boardId: BoardId, card: CardModel) => {
        return
    },
    saveUpdatedCard: (boardId: BoardId, card: CardModel) => {
        return
    },
    deleteCard: (boardId: BoardId, cardId: number) => {
        return
    },
    updateDraggedCard: (boardId: BoardId, card: CardModel) => {
        return
    },
    boards: [] as Board[],
    draggedCard: {
        card: {} as CardModel,
        boardId: '' as BoardId,
    },
}
type State = typeof initialState

export const Context = createContext(initialState)

const { Provider, Consumer } = Context

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
            saveUpdatedCard: this.saveUpdatedCard,
        }
    }
    public render() {
        return <Provider value={this.state}>{this.props.children}</Provider>
    }
    public componentDidMount() {
        firebase
            .firestore()
            .collection('tasks')
            .onSnapshot(snap => {
                const boards: Board[] = []
                snap.docs.forEach((doc, i) => {
                    const data = doc.data()
                    data.id = doc.id
                    boards.push(data as Board)
                })
                this.setState({ boards })
            })
    }
    private getDateTime: () => CombinedDateAndTime = () => new Date().toLocaleString('ru')
    private reorderCards = (boardOverId: BoardId) => {
        const { boards } = this.state
        const { card } = this.state.draggedCard
        const newBoards: Board[] = [...boards]
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
    private saveCards = (boardId: BoardId) => {
        const { boardId: boardDropFromId, card } = this.state.draggedCard
        const { boards } = this.state

        if (boardId !== boardDropFromId) {
            const boardDropTo = JSON.parse(JSON.stringify(boards)).filter(
                (board: Board) => board.id === boardId,
            )[0]
            const boardDropFrom = JSON.parse(JSON.stringify(boards)).filter(
                (board: Board) => board.id === boardDropFromId,
            )[0]
            boardDropTo.tasks = boardDropTo.tasks.map((task: CardModel) => {
                return task.id === card.id ? { ...card, lastEdited: this.getDateTime() } : task
            })

            const batch = firebase.firestore().collection('tasks')
            batch
                .doc(boardDropFromId.toString())
                .update(boardDropFrom)
                .then(() => {
                    batch.doc(boardId.toString()).update(boardDropTo)
                })
        }
    }
    private deleteCard = (boardId: BoardId, cardId: number) => {
        const { boards } = this.state
        const currentboard = JSON.parse(JSON.stringify(boards)).filter(
            (board: Board) => board.id === boardId,
        )[0]
        currentboard.tasks = currentboard.tasks.filter((value: CardModel) => value.id !== cardId)

        firebase
            .firestore()
            .collection('tasks')
            .doc(boardId.toString())
            .update(currentboard)
    }
    private addCard = (boardId: BoardId, card: CardModel) => {
        const { boards } = this.state

        card.lastEdited = this.getDateTime()
        const currentboard = JSON.parse(JSON.stringify(boards)).filter(
            (board: Board) => board.id === boardId,
        )[0]
        currentboard.tasks.push(card)
        firebase
            .firestore()
            .collection('tasks')
            .doc(boardId.toString())
            .update(currentboard)
    }
    private saveUpdatedCard = (boardId: BoardId, card: CardModel) => {
        const { boards } = this.state

        card.lastEdited = this.getDateTime()
        const currentboard = JSON.parse(JSON.stringify(boards)).filter(
            (board: Board) => board.id === boardId,
        )[0]
        currentboard.tasks = currentboard.tasks.map((task: CardModel) => {
            return task.id === card.id ? card : task
        })
        firebase
            .firestore()
            .collection('tasks')
            .doc(boardId.toString())
            .update(currentboard)
    }
    private updateDraggedCard = (boardId: BoardId, card: CardModel) => {
        this.setState({ draggedCard: { boardId, card } })
    }
}
export const ContentConsumer = Consumer
