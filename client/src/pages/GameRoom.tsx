import React from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import socket from '../socket'

const GameRoom = () => {
  const { roomId } = useParams()
  const location = useLocation()
  const name = location.state?.name

  useEffect(() => {
    if (!roomId || !name) return
    socket.emit('join_room', roomId)
  }, [roomId, name])

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-2">Room: {roomId}</h1>
      <p>Welcome, {name}!</p>
      {/* Add table, cards, and game interactions here */}
    </div>
  )
}

export default GameRoom
