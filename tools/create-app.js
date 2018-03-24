const path = require("path");
const fs = require("fs");
const chalk = require("chalk");
const utils = require("./utils");

let appFile = (app) => {
    return `
<template>
<div>

</div>
</template>

<script>

export default {
    data: function() {
        return {

        }
    },
    computed: {

    },
    methods: {

    },
    components: {
        
    }
}
</script>

<style module>

</style>
`;
};

let routeFile = app => {
    return `
import {vue, vueRouter} from 'runtime';
import app from './app';

const index = {
    path: '/${app.camelCaseName}',
    component: app,
    meta: {scrollToTop: true}
};
vueRouter.addRoutes([index]);
`;
};

let app = {
    name: process.argv[2].toLowerCase(),
    camelCaseName: utils.camelDashCaseTocamelCase(process.argv[2].toLowerCase())
}

let appDir = path.resolve(__dirname, `../src/app/${app.name}`);

if(!fs.existsSync(appDir)){
    fs.mkdirSync(appDir);
}

if(
    utils.writeFileOrWarn(path.join(appDir, 'app.vue'), appFile(app)) && 
    utils.writeFileOrWarn(path.join(appDir, `index.route.js`), routeFile(app))
) {
    console.warn(chalk.green(`app ${app.name} created Succeed`));
}

