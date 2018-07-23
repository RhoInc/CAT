import { showEnv } from '../env/showEnv';

export function initEnvConfig(cat) {
    var settingsHeading = cat.controls.environmentWrap.append('h3').html('4. Environment ');

    cat.controls.cssList = cat.controls.environmentWrap.append('ul').attr('class', 'cssList');
    cat.controls.cssList.append('h5').text('Loaded Stylesheets');

    cat.controls.jsList = cat.controls.environmentWrap.append('ul').attr('class', 'jsList');
    cat.controls.jsList.append('h5').text('Loaded javascript');

    showEnv(cat);
}
