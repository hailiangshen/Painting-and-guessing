const userRole = require('./userRole');

class User {
    constructor({ id, socket, name = "anonymous", roomId = null, onDestroy }) {
        this.id = id;
        this.socket = socket;
        this.nickName = name;
        this.roomId = roomId;
        this.userRole = userRole.Guesser;
        this._timer = null;
        this._onDestroy = onDestroy;
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
        }, 30 * 60 * 1000);
    }
    serializable() {
        return {
            id: this.id,
            nickName: this.nickName
        }
    }
}

module.exports = User;