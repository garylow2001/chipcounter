import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import socket from '../socket';

enum UserActionType {
  BET = 'bet',
  TAKE = 'take',
}

const INITIAL_BET_AMOUNT = 5;

const GameRoom = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const name = location.state?.name;

  const [actionLogs, setActionLogs] = useState<string[]>([]);
  const [chipAmount, setChipAmount] = useState<number>(INITIAL_BET_AMOUNT);
  const [actionType, setActionType] = useState<UserActionType>(
    UserActionType.BET
  );
  const [pot, setPot] = useState<number>(0);

  const handleChipAction = () => {
    socket.emit(actionType as string, {
      roomId,
      name,
      numChips: chipAmount,
    });
    resetChips();
  };

  const resetChips = () => {
    setChipAmount(INITIAL_BET_AMOUNT);
    setActionType(UserActionType.BET);
  };

  const incrChips = () => {
    setChipAmount((prev) =>
      Math.min(prev + 5, actionType === UserActionType.BET ? 1000 : pot)
    );
  };

  const decrChips = () => {
    setChipAmount((prev) =>
      Math.max(
        prev - 5,
        actionType === UserActionType.BET ? INITIAL_BET_AMOUNT : 0
      )
    );
  };

  const toggleActionType = () => {
    if (actionType === UserActionType.BET) {
      setChipAmount(pot);
      setActionType(UserActionType.TAKE);
    } else {
      setChipAmount(INITIAL_BET_AMOUNT);
      setActionType(UserActionType.BET);
    }
  };

  useEffect(() => {
    if (!roomId || !name) {
      console.error('Room ID or name is missing');
      navigate('/');
      return;
    }

    socket.emit('join_room', roomId, name);

    // Listen for pot updates
    socket.on('update_pot', (updatedPot: number) => {
      setPot(updatedPot);
    });

    // Listen for action log updates
    socket.on('update_logs', (logs: string[]) => {
      setActionLogs(logs);
    });
    return () => {
      socket.off('update_pot');
      socket.off('update_logs');
    };
  }, [roomId, name]);

  return (
    <div className="flex flex-col items-center h-screen m-4">
      <h1 className="text-2xl font-bold mb-2">Room: {roomId}</h1>
      <p>Welcome, {name}!</p>
      {/* Action Logs Area */}
      <textarea
        className="w-1/2 h-1/2 border p-2 mt-4"
        placeholder="Action logs will appear here..."
        value={actionLogs.join('\n')}
        readOnly
      />
      {/* Action Type Toggle Slider */}
      <div className="mt-4 flex items-center">
        {/* Bet Label */}
        <span className="mr-4 text-sm font-medium text-gray-900">Bet</span>

        {/* Slider */}
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={actionType === UserActionType.TAKE}
            onChange={toggleActionType}
          />
          <div className="w-16 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-500">
            <div
              className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                actionType === UserActionType.TAKE ? 'translate-x-8' : ''
              }`}
            ></div>
          </div>
        </label>
        {/* Take Label */}
        <span className="ml-4 text-sm font-medium text-gray-900">Take</span>
      </div>
      {/* Chip count controllers */}
      <div className="mt-4 space-x-2 flex items-center">
        <button
          onClick={decrChips} // Ensure it doesn't go below 0
          className="px-2 rounded hover:bg-gray-400"
        >
          -
        </button>
        <input
          type="range"
          min="0"
          max={actionType === UserActionType.BET ? 1000 : pot}
          step="5"
          value={chipAmount}
          onChange={(e) => setChipAmount(Number(e.target.value))}
          className="slider"
        />
        <button
          onClick={incrChips} // Ensure it doesn't exceed max
          className="px-2 rounded hover:bg-gray-400"
        >
          +
        </button>
      </div>
      {/* Button to submit action */}
      <button
        onClick={handleChipAction}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400 disabled:text-gray-700"
        disabled={
          chipAmount <= 0 ||
          (actionType === UserActionType.TAKE && chipAmount > pot)
        }
      >
        {actionType === UserActionType.BET ? 'Bet' : 'Take'} {chipAmount}
      </button>
    </div>
  );
};

export default GameRoom;
