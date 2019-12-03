import { showEnv } from '../env/showEnv';

export function initEnvConfig() {
    var settingsHeading = this.controls.environmentWrap.append('h3').html('4. Environment ');

    this.controls.cssList = this.controls.environmentWrap.append('ul').attr('class', 'cssList');
    this.controls.cssList.append('h5').text('Loaded Stylesheets');

    this.controls.jsList = this.controls.environmentWrap.append('ul').attr('class', 'jsList');
    this.controls.jsList.append('h5').text('Loaded javascript');

    showEnv.call(this);
}
