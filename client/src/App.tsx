import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import JoinRoom from './pages/JoinRoom'
import GameRoom from './pages/GameRoom'

const App = () => {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/join" element={<JoinRoom />} />
        <Route path="/:roomId" element={<GameRoom />} />
      </Routes>
  )
}

export default App
