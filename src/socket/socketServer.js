// socket/socketServer.js
import { Server } from 'socket.io';
import { SOCKET_CONFIG, SOCKET_EVENTS } from './config/socketConfig.js';
import { handleConnection } from './handlers/connectionHandler.js';

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server);

export const initializeSocket = (server) => {
    // const io = new Server(server, SOCKET_CONFIG);
    const io = new Server(server);
    
    io.on(SOCKET_EVENTS.CONNECTION, (socket) => {
        handleConnection(socket, io);
    });
    
    return io;
};
