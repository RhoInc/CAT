import unloadDOM from './initRendererSelect/unloadDOM';
import loadPackageJSON from '../init/loadPackageJSON';
import loadRenderer from '../init/loadRenderer';
import getVersions from '../init/getVersions';
import updateSettings from '../init/updateSettings';

/*
    1. Removes the previous library's .js, .css, and/or stylesheet from the DOM.
    2. Updates the status section.
    3. Loads the master branch of the selected library.
      1. Loads the library's package.json file to know where the main .js file lives.
      2. Optionally loads the settings-schema.json file to populate the settings text/form if the library has a settings schema file.
      3. Loads the main .js file.
      4. Optionally loads the main .css file if the library has a .css file.
    4. Loads the branches and releases of the library.
    5. Updates the settings text/form.
*/

export function initRendererSelect() {
    unloadDOM.call(this);
    //updateStatus.call(this);
    
    const cat = this;
    this.controls.rendererSelect
        .selectAll('option')
        .data(this.config.renderers)
        .enter()
        .append('option')
        .text(d => d.name);
    this.controls.rendererSelect.on('change', function() {
        updateRenderer.call(cat, this);
        getVersions(cat.controls.versionSelect, cat.current.api_url);
    });
    this.controls.versionSelect.on('change', function() {
        console.log(this.value);
        cat.current.version = this.value;
        cat.settings.set(cat);
    });
    this.controls.moreOptions
        .on('click', function() {
            d3.select(this).remove();
            cat.controls.rendererWrap.selectAll('*').classed('hidden', false);
        });
    this.controls.mainFunction.node().value = this.current.main;
    this.controls.subFunction.node().value = this.current.sub;
    this.controls.schema.node().value = this.current.schema;
    this.controls.addEnterEventListener(this.controls.rendererWrap, cat);
}
