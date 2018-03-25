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
    props: {
        
    },
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

let app = {
    name: process.argv[2].toLowerCase(),
    camelCaseName: utils.camelDashCaseTocamelCase(process.argv[2].toLowerCase())
}

let appDir = path.resolve(__dirname, `../src/components/${app.name}`);

if(!fs.existsSync(appDir)){
    fs.mkdirSync(appDir);
}

if(utils.writeFileOrWarn(path.join(appDir, 'component.vue'), appFile(app))) {
    console.warn(chalk.green(`component ${app.name} created Succeed`));
}