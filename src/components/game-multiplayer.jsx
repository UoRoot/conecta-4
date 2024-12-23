import { useEffect } from 'react'
import { useGameMultiplayer } from '../hooks/useGameMultiplayer'
import { Board } from './board'
import { WinnerModal } from './winner-modal'

export function GameMultiplayer() {
  const {
    joinGame,
    startGame,
    makeMove,
    board,
    canStart,
    currentPlayer,
    player,
    isMyTurn,
    winner,
    status,
    error
  } = useGameMultiplayer()

  useEffect(() => {
    joinGame()
  }, [joinGame])

  return (
    <div className='game-container'>
      <div className='game-status'>
        <h2>Eres las fichas de color: {player || 'Connecting...'}</h2>
        <span className='game-state'>Estado del juego: {status}</span>
        {error && <div className='error-message'>{error}</div>}
      </div>

      {canStart && (
        <button
          className='start-button'
          onClick={startGame}
        >
          Iniciar juego
        </button>
      )}

      {status === 'in-progress' && (
        <div className='turn-indicator'>
          {isMyTurn ? 'Es tu turno' : 'Esperando jugada del oponente...'}
        </div>
      )}

      <Board
        makeMove={makeMove}
        board={board}
        disabled={!isMyTurn || status !== 'in-progress'}
      />

      {winner && (
        <WinnerModal
          resetGame={() => console.log('reset game')}
          winner={winner}
          isWinner={winner === player}
        />
      )}

      <span className='current-turn'>
        {currentPlayer ? `Turno de: ${currentPlayer}` : 'Juego no iniciado'}
      </span>
    </div>
  )
}
