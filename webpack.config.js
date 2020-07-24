const path = require('path');
const useDefaultConfig = require('@ionic/app-scripts/config/webpack.config.js');

const env = process.env.IONIC_ENV;

useDefaultConfig[env].resolve.alias = {
    "@app": path.resolve('./src/app/'),
    "@assets": path.resolve('./src/assets/'),
    "@directives": path.resolve('./src/directives/'),
    "@interfaces": path.resolve('./src/interfaces/'),
    "@models": path.resolve('./src/models/'),
    "@pages": path.resolve('./src/pages/'),
    "@pipes": path.resolve('./src/pipes/'),
    "@providers": path.resolve('./src/providers/'),
};

module.exports = function () {
    return useDefaultConfig;
};