import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        currentUser: null,
        currentRoom: null,
        rooms: [],
    },
    // computed: {
    //     nickName: 
    // },
    mutations: {
        setUser(state, user) {
            state.currentUser = user;
        },
        setRoom(state, room) {
            state.currentRoom = room;
        },
        updedateRooms(state, rooms) {
            state.rooms = rooms;
        }
    }
});

export default store;