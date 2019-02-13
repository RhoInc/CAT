import loadPackageJson from './loadRenderer/loadPackageJson';
import { getCSS } from './env/getCSS';
import { getJS } from './env/getJS';
import { scriptLoader } from '../util/scriptLoader';
import { renderChart } from './renderChart';

export function loadRenderer(cat) {
    const promisedPackage = loadPackageJson(cat);
    promisedPackage.then(function(response) {
        cat.current.package = JSON.parse(response);
        console.log(cat.current.package);
        cat.current.js_url = `${cat.current.url}/${cat.current.package.main.replace(
            /^\.?\/?/,
            ''
        )}`;
        cat.current.css_url = cat.current.css ? `${cat.current.url}/${cat.current.css}` : null;
        console.log(cat.current.js_url);
        console.log(cat.current.css_url);

        if (cat.current.css) {
            var current_css = getCSS().filter(f => f.link == cat.current.css_url);
            var css_loaded = current_css.length > 0;
            if (!css_loaded) {
                var link = document.createElement('link');
                link.href = cat.current.css_url;

                link.type = 'text/css';
                link.rel = 'stylesheet';
                document.getElementsByTagName('head')[0].appendChild(link);
            } else if (current_css[0].disabled) {
                //enable the css if it's disabled
                d3.select(current_css[0].sel).property('disabled', false);
                cat.controls.cssList
                    .selectAll('li')
                    .filter(d => d.link == cat.current.css_url)
                    .select('input')
                    .property('checked', true);
            }
        }

        var current_js = getJS().filter(f => f.link == cat.current.js_url);
        var js_loaded = current_js.length > 0;

        if (!js_loaded) {
            console.log('not loaded');
            var loader = new scriptLoader();
            loader.require(cat.current.js_url, {
                async: true,
                success: function() {
                    cat.status.loadStatus(
                        cat.statusDiv,
                        true,
                        cat.current.js_url,
                        cat.current.name,
                        cat.current.version
                    );
                    renderChart(cat);
                },
                failure: function() {
                    cat.status.loadStatus(
                        cat.statusDiv,
                        false,
                        cat.current.js_url,
                        cat.current.name,
                        cat.current.version
                    );
                }
            });
        } else {
            console.log('loaded');
            cat.status.loadStatus(
                cat.statusDiv,
                true,
                cat.current.js_url,
                cat.current.name,
                cat.current.version
            );
            renderChart(cat);
        }
    });
}
