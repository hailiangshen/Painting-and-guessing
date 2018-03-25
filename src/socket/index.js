import io from "socket.io-client";
import socketMethods from "src/../config/socketMethods";
import store from "src/store";

class paintingAndGuessingSocket {
    constructor() {
        let user = JSON.parse(
            localStorage.getItem("user:sokcet-painting-and-guessing") ||
                '{"name": "捡了西瓜捡芝麻"}'
        );

        this.socket = io.connect("/painting-and-guessing", {
            forceNew: true,
            query: {
                token: user.id || "",
                id: user.id || "",
                nickName: user.nickName || ""
            }
        });

        this.socket.on(socketMethods.updateUser, data => {
            localStorage.setItem(
                "user:sokcet-painting-and-guessing",
                JSON.stringify(data.data)
            );
            store.commit("setUser", data.data);
        });

        this.socket.on(socketMethods.getCurrentRoom, data => {
            if (data.data) {
                store.commit("setRoom", data.data);
            } else {
                // no CurrentRoom
            }
        });

        this.socket.on(socketMethods.getRooms, data => {
            console.log("updedateRooms", data.data);
            store.commit("updedateRooms", data.data);
        });

        this.socket.emit(socketMethods.getRooms, {
            pageSize: 10,
            pageIndex: 1
        });

        this.updateCurrentRoom();

        // setInterval(() => {
        //     socket.emit('test', `=====  ${Math.floor(Math.random() * 1000)}  =====`)
        // }, 3000);
    }
    updateCurrentRoom(){
        this.socket.emit(socketMethods.getCurrentRoom);
    }
    enterRoom({ id }) {
        this.socket.emit(socketMethods.enterRoom, { id });
        this.updateCurrentRoom();
    }
}

export default {
    install: function(Vue, name) {
        Object.defineProperty(Vue.prototype, name || "$socket", {
            value: new paintingAndGuessingSocket()
        });
    }
};
