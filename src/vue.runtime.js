import "babel-polyfill";
import Vue from 'vue';
import VueRouter from 'vue-router';
import Socket from './socket';

// import axios from 'axios';
import App from './app.vue';
import 'src/share/static.css'; // 全局样式的引入方式
import store from './store';


Vue.use(VueRouter);
Vue.use(Socket);

/**
 * scrollBehavior:
 * - only available in html5 history mode
 * - defaults to no scroll behavior
 * - return false to prevent scroll
 * */
const scrollBehavior = (to, from, savedPosition) => {
    if(savedPosition){
        // savedPosition is only available for popstate navigations.
        return savedPosition;
    } else {
        let position = {};
        // new navigation.
        // scroll to anchor by returning the selector
        if(to.hash) {
            position.selector = to.hash;
        }
        // check if any matched route config has meta that requires scrolling to top
        if(to.matchd.some(m => m.meta.scrollToTop)) {
            // cords will be used if no selector is provided,
            // or if the selector didn't match any element.
            position.x = position.y = 0;
        }
        return position;
    }
}

const vueRouter = new VueRouter({
    mode: 'history',
    // scrollBehavior
    routes: [

    ],
    beforeEnter: (to, from, next) => {
        // ...
        next();
    }
});

const vue = new Vue({
    render: h => h(App),
    router: vueRouter,
    store
});

document.addEventListener('DOMContentLoaded', () => {
    let root = document.getElementById('root');
    if (!root) {
        root = document.createElement('div');
        root.id = 'root';
        if (document.body.children.length) {
            document.body.insertBefore(root, document.body.children[0]);
        } else {
            document.body.appendChild(root);
        }    
    }
    
    vue.$mount('#root');
    console.log('root mounted');
});


export { vue, vueRouter };
