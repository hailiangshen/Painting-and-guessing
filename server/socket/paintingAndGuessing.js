// mongodb
const _ = require("lodash");
const socketMethods = require("../../config/socketMethods");

class User {
    constructor(id, socket, name = "anonymous", roomId = null) {
        this.id = id;
        this.socket = socket;
        this.nickName = name;
        this.roomId = roomId;
        this._timer = null;
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
            if (this.roomId) {
                getRoom(this.roomId).removeUser(this);
            }
            delete userCache[this.id]; //
        }, 30 * 60 * 1000);
    }
}

class Room {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.users = [];
        this._timer = null;

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
            let id = roomsCache.findIndex(x => x.id === this.id);
            if (id !== -1) {
                roomsCache.length > 1 && roomsCache.splice(id, 1); //
            }
        }, 60 * 1000);
    }
    hasUser(user) {
        return this.users.some(x => x.id === user.id);
    }
    removeUser(user) {
        let id = this.users.findIndex(x => x.id === user.id);
        if (id !== -1) {
            this.users.splice(id, 1);
            if (!this.users.length) {
                this.preDestroy();
            }
            return 1;
        }
        return 0;
    }
    addUser(user) {
        if (this.hasUser(user)) {
            return 0;
        }
        this.users.push(user);
        this.disDestroy();
        return 1;
    }
}

let generateRoom = (roomsSet, name) => {
    let id = Math.floor(Math.random() * 10000);
    let _room = getRoom(id);
    if (_room) {
        return generateRoom();
    } else {
        _room = new Room(id, name);
        roomsSet.push(roomsSet);
    }
    return _room;
};

let getRoom = roomId => {
    return roomsCache.find(x => x.id === roomId);
};

// 所有需要给前端的room数据都有过滤一次
let filterRoom = (rooms) => {
    if(rooms instanceof Array) {
        return rooms.map(x => {
            return {
                id: x.id,
                name: x.name
            };
        });
    } else {
        return {
            id: rooms.id,
            name: rooms.name
        };
    }    
}

// 这俩对象应该闭包包起来
let userCache = {},
    roomsCache = [new Room("asdasdasd", "哎呀一个房间")];

let socketHanlder = socket => {
    let token = socket.handshake.query.token || socket.id;
    let nickName = socket.handshake.query.nickName || null;
    console.log(token);

    let user = userCache[token]
        ? userCache[token]
        : (userCache[token] = new User(token, socket, nickName));
    user.socket = socket;

    socket.emit(socketMethods.updateUser, {
        data: {
            token,
            nickName
        }
    });

    socket.emit(socketMethods.getCurrentRoom, {
        data: user.roomId ? filterRoom(getRoom(user.roomId)) : null
    });

    socket.on(socketMethods.getRooms, page => {
        let start = (page.pageIndex - 1) * page.pageSize,
            end = page.pageIndex * page.pageSize;
        socket.emit(socketMethods.getRooms, {
            // for page load
            data: filterRoom(roomsCache.slice(start, end))
        });
    });

    socket.on(socketMethods.enterRoom, ({ id }) => {
        if(id) {
            if (user.roomId) {
                if (user.roomId === id) {
                    return;
                }
                getRoom(user.roomId).removeUser(user);
            }
            getRoom(id).addUser(user);
            user.roomId = id;
        }
    });

    socket.on(socketMethods.createRoom, data => {
        return generateRoom(roomsCache, data.name);
    });

    socket.on("disconnect", function() {
        socket.emit("user disconnected");
        // if (user.roomId) {
        //     roomsCache[user.roomId].removeUser(user);
        // }
        // delete userCache[token];
        user.socket = null;
        user.preDestroy();
    });
};

module.exports = socketHanlder;
