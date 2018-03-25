import io from "socket.io-client";
import socketMethods from "src/../config/socketMethods";
import store from "src/store";

let socketInit = () => {
    let user = JSON.parse(
        localStorage.getItem("user:sokcet-painting-and-guessing") ||
            '{"name": "捡了西瓜捡芝麻"}'
    );

    let socket = io.connect("/painting-and-guessing", {
        forceNew: true,
        query: {
            token: user.token || "",
            nickName: user.nickName || ""
        }
    });

    socket.on(socketMethods.updateUser, data => {
        localStorage.setItem(
            "user:sokcet-painting-and-guessing",
            JSON.stringify(data.data)
        );
        store.commit("setUser", data.data);
    });

    socket.on(socketMethods.getCurrentRoom, data => {
        if (data.data) {
            store.commit("setRoom", data.data);
        } else {
            // no CurrentRoom
        }
    });

    socket.on(socketMethods.getRooms, data => {
        console.log("updedateRooms", data.data);
        store.commit("updedateRooms", data.data);
    });

    socket.emit(socketMethods.getRooms, {
        pageSize: 10,
        pageIndex: 1
    });

    // setInterval(() => {
    //     socket.emit('test', `=====  ${Math.floor(Math.random() * 1000)}  =====`)
    // }, 3000);

    return socket;
};

class paintingAndGuessingSocket {
    constructor() {
        let user = JSON.parse(
            localStorage.getItem("user:sokcet-painting-and-guessing") ||
                '{"name": "捡了西瓜捡芝麻"}'
        );

        let socket = io.connect("/painting-and-guessing", {
            forceNew: true,
            query: {
                token: user.token || "",
                nickName: user.nickName || ""
            }
        });

        socket.on(socketMethods.updateUser, data => {
            localStorage.setItem(
                "user:sokcet-painting-and-guessing",
                JSON.stringify(data.data)
            );
            store.commit("setUser", data.data);
        });

        socket.on(socketMethods.getCurrentRoom, data => {
            if (data.data) {
                store.commit("setRoom", data.data);
            } else {
                // no CurrentRoom
            }
        });

        socket.on(socketMethods.getRooms, data => {
            console.log("updedateRooms", data.data);
            store.commit("updedateRooms", data.data);
        });

        socket.emit(socketMethods.getRooms, {
            pageSize: 10,
            pageIndex: 1
        });

        // setInterval(() => {
        //     socket.emit('test', `=====  ${Math.floor(Math.random() * 1000)}  =====`)
        // }, 3000);

        this.socket = socket;
    }
    enterRoom({ id }) {
        this.socket.emit(socketMethods.enterRoom, { id });
    }
}

export default {
    install: function(Vue, name) {
        Object.defineProperty(Vue.prototype, name || "$socket", {
            value: new paintingAndGuessingSocket()
        });
    }
};
