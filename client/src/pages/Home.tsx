import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import {Link} from 'react-router-dom';
import socket from '../socket';
import { v4 as uuidv4 } from 'uuid';

const Home = () => {
  const [room, setRoom] = useState('');
  const [name, setName] = useState('');
  const [joined, setJoined] = useState(false);
  const navigate = useNavigate();

  const createRoom = () => {
    // create a room with a unique uuid
    const roomCode = uuidv4().substring(0, 6).toUpperCase();
    setRoom(roomCode);
    socket.emit('join_room', room);
    setJoined(true);
    navigate(`/${roomCode}`, { state: { name } })
  };

  return (
    <div>
      {/* Header Section */}
      <div className="flex justify-between items-center bg-gray-100 p-4">
        <h1 className="text-2xl font-bold whitespace-nowrap">Poker Chips Counter</h1>
        <p className="text-blue-500 cursor-pointer whitespace-nowrap">Help</p>
      </div>

      {/* Tagline */}
      <div className="flex flex-col justify-center items-center p-4 m-4">
          <h2 className="text-xl font-semibold text-left">Count your poker chips with ease</h2>
          <h2 className="text-xl font-semibold text-left">Easily buy-in (if you need to)</h2>
          <h2 className="text-xl font-semibold text-left">Settle your winnings without hassle</h2>
      </div>

      {/* Main Content Section */}
      <div className=" flex flex-col justify-center items-center m-4">
        {!joined ? (
          <div>
            <input 
              placeholder="Enter your name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="border p-2 mr-2"
            />
            <button onClick={createRoom} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Create Room
            </button>
            <p className="text-gray-500 mt-2">Already have a room? <Link to="/join" className='underline'>join an existing table here.</Link></p>
          </div>
        ) : (
          <h2>Joined Room: {room}</h2>
        )}
      </div>
    </div>
  );
}

export default Home;
