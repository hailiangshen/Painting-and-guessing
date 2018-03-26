const userRole = require('./userRole');

class Room {
    constructor({ id, name, onDestroy }) {
        this.id = id;
        this.name = name;
        this.users = [];
        this.groupId = id;
        this._timer = null;
        this._onDestroy = onDestroy;

        this.preDestroy();
    }
    disDestroy() {
        if (this._timer) {
            clearTimeout(this._timer);
            this._timer = null;
        }
    }
    preDestroy() {
        this.disDestroy();
        this._timer = setTimeout(() => {
            this._timer = null;
            this._onDestroy && this._onDestroy(this);
        }, 60 * 1000);
    }
    hasUser(user) {
        return this.users.some(x => x.id === user.id);
    }
    removeUser(user, socket) {
        let id = this.users.findIndex(x => x.id === user.id);
        if (id !== -1) {
            socket.leave(this.id);
            this.users.splice(id, 1);
            if (!this.users.length) {
                this.preDestroy();
            }
            return 1;
        }
        return 0;
    }
    addUser(user, socket) {
        if (this.hasUser(user)) {
            return 0;
        }
        this.users.push(user);
        socket.join(this.id);
        this.disDestroy();
        user.roomId = this.id;
        user.userRole = this.users[0] === user ? userRole.Painter : userRole.Guesser;
        return 1;
    }
    serializable() {
        return {
            id: this.id,
            name: this.name,
            users: this.users.map(u => u.serializable())
        }
    }
}


module.exports = Room;