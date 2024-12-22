import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router'
import { useSocket } from '../context/websocket-conexion'
import { GAME_STATES, N_COLUMNS, N_ROWS } from '../const'

export function useGameMultiplayer() {
  const socket = useSocket()
  const { id: gameId } = useParams()
  const [board, setBoard] = useState(Array(N_ROWS).fill(Array(N_COLUMNS).fill(null)))
  const [playerColor, setPlayerColor] = useState(null)
  const [currentPlayer, setCurrentPlayer] = useState(null)
  const [winner, setWinner] = useState(null)
  const [status, setStatus] = useState(GAME_STATES.WAITING)
  const [error, setError] = useState(null)

  // Join game
  const joinGame = useCallback(() => {
    if (socket && gameId) {
      socket.emit('join-game', gameId)
    }
  }, [socket, gameId])

  // Start game
  const startGame = useCallback(() => {
    if (socket && gameId) {
      socket.emit('start-game', gameId)
    }
  }, [socket, gameId])

  useEffect(() => {
    if (!socket) return

    socket.on('joined-game', ({ playerColor, status, board, currentPlayer }) => {
      console.log('Joined game as:', playerColor) // remove
      setPlayerColor(playerColor)
      setStatus(status)
      setBoard(board)
      setCurrentPlayer(currentPlayer)
    })

    socket.on('game-updated', ({ status, board, currentPlayer }) => {
      setStatus(status)
      setBoard(board)
      setCurrentPlayer(currentPlayer)
    })

    socket.on('game-started', ({ board, currentPlayer, status }) => {
      console.log('Game started') // remove
      setBoard(board)
      setCurrentPlayer(currentPlayer)
      setStatus(status)
    })

    socket.on('game-error', (message) => {
      setError(message)
      setTimeout(() => setError(null), 3000)
    })

    return () => {
      socket.off('joined-game')
      socket.off('game-started')
      socket.off('game-error')
    }
  }, [socket])

  return {
    board,
    currentPlayer,
    playerColor,
    status,
    winner,
    error,
    joinGame,
    startGame,
    canStart: status === GAME_STATES.READY,
    isMyTurn: currentPlayer === playerColor
  }
}