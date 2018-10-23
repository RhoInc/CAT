import { scriptLoader } from '../util/scriptLoader';
import { renderChart } from './renderChart';
import { getCSS } from './env/getCSS';
import { getJS } from './env/getJS';

export function loadRenderer(cat) {
    var rendererObj = cat.controls.rendererSelect.selectAll('option:checked').data()[0];

    var version = cat.controls.versionSelect.node().value;

    if (rendererObj.css) {
        const cssPath =
            cat.config.rootURL + '/' + rendererObj.name + '/' + version + '/' + rendererObj.css;
        var current_css = getCSS().filter(f => f.link == cssPath);
        var css_loaded = current_css.length > 0;
        if (!css_loaded) {
            var link = document.createElement('link');
            link.href = cssPath;

            link.type = 'text/css';
            link.rel = 'stylesheet';
            document.getElementsByTagName('head')[0].appendChild(link);
        } else if (current_css[0].disabled) {
            //enable the css if it's disabled
            d3.select(current_css[0].sel).property('disabled', false);
            cat.controls.cssList
                .selectAll('li')
                .filter(d => d.link == cssPath)
                .select('input')
                .property('checked', true);
        }
    }

    var rendererPath =
        cat.config.rootURL +
        '/' +
        rendererObj.name +
        '/' +
        version +
        '/' +
        rendererObj.folder +
        '/' +
        rendererObj.main +
        '.js';

    var current_js = getJS().filter(f => f.link == rendererPath);
    var js_loaded = current_js.length > 0;

    if (!js_loaded) {
        var loader = new scriptLoader();
        loader.require(rendererPath, {
            async: true,
            success: function() {
                cat.status.loadStatus(cat.statusDiv, true, rendererPath, rendererObj.name, version);
                renderChart(cat);
            },
            failure: function() {
                cat.status.loadStatus(
                    cat.statusDiv,
                    false,
                    rendererPath,
                    rendererObj.name,
                    version
                );
            }
        });
    } else {
        cat.status.loadStatus(cat.statusDiv, true, rendererPath, rendererObj.name, version);
        renderChart(cat);
    }
}
