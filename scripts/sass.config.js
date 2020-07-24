const existingConfig = require('../node_modules/@ionic/app-scripts/config/sass.config');
module.exports = Object.assign(existingConfig, {
    includePaths: [
      'node_modules/ionic-angular/themes',
      'node_modules/ionicons/dist/scss',
      'node_modules/ionic-angular/fonts',
      'node_modules/animate.css/animate.min.css'
    ]
  }
);