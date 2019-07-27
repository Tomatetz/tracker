/*!
 * Copyright © 2019-present Aleksei Ganikhin. All rights reserved.
 *
 * License is found in the LICENSE file in the root directory of this source tree.
 */

import * as firebase from 'firebase'

import { Board, BoardCardInfo, BoardId, CardModel, DragNDropCongig } from '../../model'
import React, { Component, createContext } from 'react'
import { deepArrayCopy, getDateTime } from '../../services/'

import { httpUpdateDataId } from '../../adapters/'

type Props = {}

const initialState = {
    saveCards: () => {
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
            .doc('boards')
            .onSnapshot(snap => {
                const data = snap.data()
                if (data) {
                    const { boards } = data
                    this.setState({ boards })
                }
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
    private saveCards = () => {
        httpUpdateDataId(this.state.boards)
    }

    private deleteCard = (cardToDelete: BoardCardInfo) => {
        const { boards } = this.state
        const { boardId, card } = cardToDelete

        const boardsCopy = deepArrayCopy<Board[]>(boards)

        for (let board of boardsCopy) {
            if (board.id === boardId) {
                board.tasks = board.tasks.filter(task => task.id !== card.id)

                // Save to firebase
                httpUpdateDataId(this.state.boards)
                return
            }
        }
    }

    private saveNewCard = (cardToSave: BoardCardInfo) => {
        const { boards } = this.state
        const { boardId, card } = cardToSave

        card.lastEdited = getDateTime()

        const boardsCopy = deepArrayCopy<Board[]>(boards)
        for (let board of boardsCopy) {
            if (board.id === boardId) {
                board.tasks.push(card)

                // Save to firebase
                httpUpdateDataId(this.state.boards)
                return
            }
        }
    }

    private saveUpdatedCard = (cardToUpdate: BoardCardInfo) => {
        const { boards } = this.state
        const { boardId, card } = cardToUpdate

        card.lastEdited = getDateTime()

        const boardsCopy = deepArrayCopy<Board[]>(boards)
        for (let board of boardsCopy) {
            if (board.id === boardId) {
                board.tasks = board.tasks.map(task => {
                    if ((task.id = card.id)) {
                        return { ...task, ...card }
                    } else {
                        return task
                    }
                })

                // Save to firebase
                httpUpdateDataId(boardsCopy)
                return
            }
        }
    }
}

export const ContentConsumer = Consumer
