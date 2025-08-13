export const SOCKET_EVENTS = {
    CONNECTION: 'connection',
    DISCONNECT: 'disconnect',
    JOIN: 'join',
    MESSAGE: 'message',
    USER_JOINED: 'user-joined',
    USER_LEFT: 'user-left',
    JOIN_SUCCESS: 'join-success',
    JOIN_FAILED: 'join-failed',
    AVAILABLE_USERS: 'available-users'
};

export const SOCKET_CONFIG = {
    cors: {
        origin: process.env.NODE_ENV === 'production' ? false : "*",
        methods: ["GET", "POST"]
    },
    pingTimeout: 60000,
    pingInterval: 25000
};
