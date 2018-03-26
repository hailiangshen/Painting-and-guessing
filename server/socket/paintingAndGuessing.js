// mongodb
const _ = require("lodash");
const socketMethods = require("../../model/socketMethods");

const User = require('../../model/user');
const Room = require('../../model/room');

let generateRoom = ((seed) => {
    return (roomsSet, name) => {
        let _room = new Room({id: seed++, name, onDestroy: (room) => {
            let id = roomsSet.findIndex(x => x.id === room.id);
            roomsSet.length > 1 && roomsSet.splice(id, 1);
        }});
        roomsSet.push(_room);
        return _room;
    }
})(10000);

let getRoom = roomId => {
    return roomsCache.find(x => x.id === roomId);
};

let userDestory = (user) =>{
    if (user.roomId) {
        let room = getRoom(user.roomId);
        room.removeUser(user, socket);
        socket.broadcast.to(room.id).emit(socketMethods.getCurrentRoom, {
            data: room.serializable()
        });
    }
    delete userCache[user.id];
}

// 这俩对象应该闭包包起来
let userCache = {},
    roomsCache = [];

generateRoom(roomsCache, "哎呀一个房间");

let socketHandler = socket => {
    let token = socket.handshake.query.token || socket.id;

    let user = userCache[token]
        ? userCache[token]
        : (userCache[token] = new User({id: token, socket, onDestroy: userDestory}));
    // user.socket = socket;

    socket.emit(socketMethods.updateUser, {
        data: user.serializable()
    });

    socket.on(socketMethods.updateUser, nickName => {
        user.nickName = nickName;
        // broadcast
    });

    socket.on(socketMethods.getCurrentRoom, () => {
        socket.emit(socketMethods.getCurrentRoom, {
            data: user.roomId ? getRoom(user.roomId).serializable() : null
        });
    });

    socket.on(socketMethods.getRooms, page => {
        let start = (page.pageIndex - 1) * page.pageSize,
            end = page.pageIndex * page.pageSize;
        socket.emit(socketMethods.getRooms, {
            // for page load
            data: roomsCache.slice(start, end).map(x => x.serializable())
        });
    });

    socket.on(socketMethods.enterRoom, ({ id }) => {
        if(id) {
            if (user.roomId) {
                if (user.roomId === id) {
                    return;
                }
                getRoom(user.roomId).removeUser(user, socket);
            }
            let room = getRoom(id);
            room.addUser(user, socket);
            user.roomId = id;

            socket.broadcast.to(room.id).emit(socketMethods.getCurrentRoom, {
                data: room.serializable()
            });
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

module.exports = {
    bindTo: io => {
        io.of('/painting-and-guessing').on("connection", socketHandler);
    }
}
