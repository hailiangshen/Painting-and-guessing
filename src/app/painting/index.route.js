
import {vue, vueRouter} from 'runtime';
import app from './app';

const index = {
    path: '/painting',
    component: app,
    meta: {scrollToTop: true}
};
vueRouter.addRoutes([index]);
