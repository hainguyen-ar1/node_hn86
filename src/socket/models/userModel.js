class UserManager {
    constructor() {
        this.users = {
            'A': { color: 'blue', room: 'room1', connected: false },
            'B': { color: 'black', room: 'room1', connected: false },
            'C': { color: 'red', room: 'room2', connected: false },
            'D': { color: 'green', room: 'room2', connected: false }
        };
    }

    getUsers() {
        return this.users;
    }

    getUserByName(username) {
        return this.users[username];
    }

    isUserAvailable(username) {
        return this.users[username] && !this.users[username].connected;
    }

    connectUser(username) {
        if (this.users[username]) {
            this.users[username].connected = true;
            return true;
        }
        return false;
    }

    disconnectUser(username) {
        if (this.users[username]) {
            this.users[username].connected = false;
            return true;
        }
        return false;
    }

    getUserRoom(username) {
        return this.users[username]?.room;
    }

    getUserColor(username) {
        return this.users[username]?.color;
    }
}

export const userManager = new UserManager();
