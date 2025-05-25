import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust this to client URL during deployment
  },
});

interface Room {
  pot: number;
  participants: string[];
  actionLogs: string[];
}

const emptyRoomState: Room = {
  pot: 0,
  participants: [], // change to participants and chips
  actionLogs: [],
};

const rooms: Record<string, Room> = {}; // Store rooms and their participants

io.on("connection", (socket) => {
  console.log(`New user connected: ${socket.id}`);

  // Handle room creation and joining
  socket.on("join_room", (roomCode, name) => {
    socket.join(roomCode);

    // Create a new room if it doesn't exist
    if (!rooms[roomCode]) {
      rooms[roomCode] = emptyRoomState;
    }

    // Add user to the room
    rooms[roomCode].participants.push(name);
    const userJoinMessage = `${name} has joined the room.`;
    rooms[roomCode].actionLogs.push(userJoinMessage);

    // Log user joining
    console.log(`User ${name}:${socket.id} joined room ${roomCode}`);

    // Emit updates to the room
    socket.to(roomCode).emit("update_logs", rooms[roomCode].actionLogs);
  });

  // Handle betting actions
  socket.on("bet", ({ roomId, name, numChips }) => {
    if (!rooms[roomId]) return;

    rooms[roomId].pot += numChips;
    const message = `${name} bets ${numChips} chips. Pot: ${rooms[roomId].pot}.`;
    rooms[roomId].actionLogs.push(message);

    console.log(`Bet from ${name} in room ${roomId}: ${numChips} chips`);

    io.to(roomId).emit("update_pot", rooms[roomId].pot);
    io.to(roomId).emit("update_logs", rooms[roomId].actionLogs);
  });

  // Handle taking actions
  socket.on("take", ({ roomId, name, numChips }) => {
    if (!rooms[roomId]) return;

    rooms[roomId].pot -= numChips;
    const message = `${name} takes ${numChips} chips. Pot: ${rooms[roomId].pot}.`;
    rooms[roomId].actionLogs.push(message);

    console.log(`Take from ${name} in room ${roomId}: ${numChips} chips`);

    io.to(roomId).emit("update_pot", rooms[roomId].pot);
    io.to(roomId).emit("update_logs", rooms[roomId].actionLogs);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected with id: ${socket.id}`);
  });
});

server.listen(4000, () => console.log("Server running on port 4000"));
