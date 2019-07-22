/*!
 * Copyright © 2019-present Aleksei Ganikhin. All rights reserved.
 *
 * License is found in the LICENSE file in the root directory of this source tree.
 */

import * as firebase from 'firebase'

import { Board, BoardId, CardModel, DragNDropCongig, BoardCardInfo } from '../../model'
import React, { Component, createContext } from 'react'
import { getDateTime } from '../../services/'

type Props = {}

const initialState = {
    saveCards: (_: BoardId) => {
        return
    },
    saveNewCard: (boardId: BoardId, card: CardModel) => {
        return
    },
    saveUpdatedCard: (boardId: BoardId, card: CardModel) => {
        return
    },
    deleteCard: (boardId: BoardId, cardId: number) => {
        return
    },
    updateDraggedCardModel: (_: BoardCardInfo) => {
        return
    },
    dragCard: (_: DragNDropCongig) => {
        return
    },
    boards: [] as Board[],
    draggedCard: {
        card: {} as CardModel,
        boardId: '' as BoardId,
    } as BoardCardInfo,
}
type State = typeof initialState

export const Context = createContext(initialState)

const { Provider, Consumer } = Context

export class ContentProvider extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            ...initialState,
            deleteCard: this.deleteCard,
            saveNewCard: this.saveNewCard,
            saveCards: this.saveCards,
            updateDraggedCardModel: this.updateDraggedCardModel,
            saveUpdatedCard: this.saveUpdatedCard,
            dragCard: this.dragCard,
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
    private updateDraggedCardModel = (draggedCard: BoardCardInfo) => {
        this.setState({ draggedCard })
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
                return task.id === card.id ? { ...card, lastEdited: getDateTime() } : task
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
    private saveNewCard = (boardId: BoardId, card: CardModel) => {
        const { boards } = this.state

        card.lastEdited = getDateTime()
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

        card.lastEdited = getDateTime()
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
    private dragCard = (config: DragNDropCongig) => {
        const { card } = this.state.draggedCard
        const { boardId, targetCardPosition, positionShift } = config
        const { boards } = this.state

        const newBoards: Board[] = JSON.parse(JSON.stringify(boards))
        newBoards.forEach((board: Board, i: number) => {
            board.tasks = board.tasks.filter(value => value.id !== card.id)
            if (board.id === boardId) {
                if (!board.tasks.some(item => item.id === card.id)) {
                    board.tasks.splice(targetCardPosition + positionShift, 0, card)
                }
            } else {
                board.tasks = board.tasks.filter((value: CardModel) => value.id !== card.id)
            }
            if (i === newBoards.length - 1) {
                this.setState({ boards: newBoards })
            }
        })
    }
}
export const ContentConsumer = Consumer
