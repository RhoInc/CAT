import parseQuery from '../util/parseQuery';
import isJsonString from '../util/isJsonString';
import isBase64 from '../util/isBase64';

export default function parseURL() {
    //Function to parse data, renderer name, version and settings from the URL
    //Parameters can be specified by number (for renderer and data file), base64 encoded text or raw text (in that order of precedence).

    var queries = parseQuery(window.location.search.substring(1));

    //draw the chart?
    if (queries.hasOwnProperty('draw')) {
        this.config.drawOnLoad = true;
    }

    //hide the controls?
    if (queries.hasOwnProperty('controls')) {
        //minimize controls, but show toggle
        if (
            queries.controls.toLowerCase() == 'min' ||
            queries.controls.toLowerCase() == 'minimized'
        ) {
            this.config.showControls = false;
        }

        // minimize controls, and hide toggle
        if (
            queries.controls.toLowerCase() == 'hide' ||
            queries.controls.toLowerCase() == 'hidden'
        ) {
            this.config.showControls = false;
            this.config.showControlsToggle = false;
        }
    }

    //ignore option if encoded variable can't be parsed
    const encodedOptions = ['re', 'se', 've', 'de'];
    encodedOptions.forEach(function(v) {
        if (queries[v]) {
            if (!isBase64(queries[v])) {
                console.warn("The '" + v + "' parameter isn't properly encoded. Ignoring");
                queries[v] = null;
            }
        }
    });
    //ignore option if a numeric value isn't numeric
    const numericOptions = ['rn', 'dn'];
    numericOptions.forEach(function(v) {
        if (queries[v]) {
            if (isNaN(+queries[v])) {
                console.warn("The '" + v + "' parameter isn't numeric. Ignoring");
                queries[v] = null;
            }
        }
    });

    //initialize object to store parsed values
    var fromURL = { renderer: null, version: null, settings: null, data: null };

    //get renderer name
    if (queries.rn) {
        fromURL.renderer = this.config.renderers.find((d, i) => i == queries.rn).name;
    } else if (queries.re) {
        fromURL.renderer = atob(queries.re);
    } else {
        fromURL.renderer = queries.renderer || queries.r;
    }

    //get settings
    let s_text = null;
    if (queries.se) {
        s_text = atob(queries.se);
    } else {
        s_text = queries.settings || queries.s;
    }

    if (!isJsonString(s_text)) {
        console.warn("Settings aren't valid JSON.  Using default settings instead.");
        s_text = '{}';
    }
    fromURL.settings = JSON5.parse(s_text);

    //get data file name
    if (queries.dn) {
        fromURL.data = this.config.dataFiles.find((d, i) => i == queries.dn).label;
    } else if (queries.de) {
        fromURL.data = atob(queries.de);
    } else {
        fromURL.data = queries.data || queries.d;
    }

    //get version
    if (queries.ve) {
        fromURL.version = atob(queries.ve);
    } else {
        fromURL.version = queries.version || queries.v;
    }

    // Check that the data file and renderer are present
    var data_found = this.config.dataFiles.filter(f => fromURL.data == f.label).length > 0;
    if (!data_found) {
        console.warn('Data file not found. Will try to render with default data instead.');
        fromURL.data = null;
        fromURL.data_obj = null;
    } else {
        fromURL.data_obj = this.config.dataFiles.find(f => fromURL.data == f.label);
    }

    var renderer_found = this.config.renderers.filter(f => fromURL.renderer == f.name).length > 0;
    if (!renderer_found) {
        console.warn('Renderer not found. Will try to render with default renderer instead.');
        fromURL.renderer = null;
        fromURL.renderer_obj = null;
    } else {
        fromURL.renderer_obj = this.config.renderers.find(f => fromURL.renderer == f.name);
    }

    return fromURL;
}
