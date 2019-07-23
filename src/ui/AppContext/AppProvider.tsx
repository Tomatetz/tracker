/*!
 * Copyright © 2019-present Aleksei Ganikhin. All rights reserved.
 *
 * License is found in the LICENSE file in the root directory of this source tree.
 */

import * as firebase from 'firebase'

import { Board, BoardCardInfo, BoardId, CardModel, DragNDropCongig } from '../../model'
import React, { Component, createContext } from 'react'
import { deepArrayCopy, getDateTime } from '../../services/'

import { httpUpdateDocumentByBoardId } from '../../adapters/'

type Props = {}

const initialState = {
    saveCards: (_: BoardId) => {
        return
    },
    saveNewCard: (_: BoardCardInfo) => {
        return
    },
    saveUpdatedCard: (_: BoardCardInfo) => {
        return
    },
    deleteCard: (_: BoardCardInfo) => {
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

    /*
     *  Drag-n-drop logic
     */
    private updateDraggedCardModel = (draggedCard: BoardCardInfo) => {
        this.setState({ draggedCard })
    }
    private dragCard = (config: DragNDropCongig) => {
        const { card } = this.state.draggedCard
        const { boardId, targetCardPosition, positionShift } = config
        const { boards } = this.state

        const newBoards: Board[] = deepArrayCopy<Board[]>(boards)
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

    /*
     *  Update database functions
     */
    private saveCards = (boardId: BoardId) => {
        const { boardId: boardDropFromId, card } = this.state.draggedCard
        const { boards } = this.state
        const boardCopy = deepArrayCopy<Board[]>(boards)
        const boardDropTo = boardCopy.filter((board: Board) => board.id === boardId)[0]
        boardDropTo.tasks = boardDropTo.tasks.map((task: CardModel) => {
            return task.id === card.id ? { ...card, lastEdited: getDateTime() } : task
        })

        if (boardId !== boardDropFromId) {
            const boardDropFrom = boardCopy.filter(
                (board: Board) => board.id === boardDropFromId,
            )[0]

            // Save to firebase
            httpUpdateDocumentByBoardId(boardDropFromId, boardDropFrom).then(() => {
                httpUpdateDocumentByBoardId(boardId, boardDropTo)
            })
        } else {
            // Save to firebase
            httpUpdateDocumentByBoardId(boardId, boardDropTo)
        }
    }
    private deleteCard = (cardToDelete: BoardCardInfo) => {
        const { boards } = this.state
        const { boardId, card } = cardToDelete

        const currentboard = deepArrayCopy<Board[]>(boards).filter(
            (board: Board) => board.id === boardId,
        )[0]
        currentboard.tasks = currentboard.tasks.filter((value: CardModel) => value.id !== card.id)

        // Save to firebase
        httpUpdateDocumentByBoardId(boardId, currentboard)
    }
    private saveNewCard = (cardToSave: BoardCardInfo) => {
        const { boards } = this.state
        const { boardId, card } = cardToSave

        card.lastEdited = getDateTime()
        const currentboard = deepArrayCopy<Board[]>(boards).filter(
            (board: Board) => board.id === boardId,
        )[0]
        currentboard.tasks.push(card)

        // Save to firebase
        httpUpdateDocumentByBoardId(boardId, currentboard)
    }
    private saveUpdatedCard = (cardToUpdate: BoardCardInfo) => {
        const { boards } = this.state
        const { boardId, card } = cardToUpdate

        card.lastEdited = getDateTime()
        const currentboard = deepArrayCopy<Board[]>(boards).filter(
            (board: Board) => board.id === boardId,
        )[0]
        currentboard.tasks = currentboard.tasks.map((task: CardModel) => {
            return task.id === card.id ? card : task
        })

        // Save to firebase
        httpUpdateDocumentByBoardId(boardId, currentboard)
    }
}
export const ContentConsumer = Consumer
