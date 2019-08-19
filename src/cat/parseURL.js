import parseQuery from '../util/parseQuery';
import updateRenderer from './controls/initRendererSelect/updateRenderer';

export default function parseURL() {
    var cat = this;

    var queries = parseQuery(window.location.search.substring(1));
    var renderNow = false;

    // Check to see if a renderer is provided
    const r = queries.renderer || queries.r;
    if (r != undefined) {
        //if the renderer is available, set the control
        var renderer = cat.config.renderers.filter(function(d, i) {
            return isNaN(+r) ? d.name == r : i == r;
        });

        if (renderer.length > 0) {
            var rendererOptions = cat.controls.rendererSelect.selectAll('option');
            var newOption = rendererOptions.filter(f => f == renderer[0]);
            rendererOptions.attr('selected', null);
            newOption.attr('selected', 'selected');
            updateRenderer.call(cat, cat.controls.rendererSelect.node());
            renderNow = true;
        }
    }

    // Check to see if version is provided
    const v = queries.version || queries.v;
    if (v != undefined) {
        cat.controls.versionSelect.node().value = v;
        cat.current.version = v;
    }

    // if the user set a renderer draw the chart and minimize the controls immediately
    if (renderNow) {
        cat.controls.submitButton.node().click(); //click the submit button
        cat.controls.minimize.node().click(); //minimze the controls
        cat.statusDiv.style('display', 'none');
    }
}
