import parseQuery from '../util/parseQuery';
import isJsonString from '../util/isJsonString';
import isBase64 from '../util/isBase64';

export default function parseURL() {
    var queries = parseQuery(window.location.search.substring(1));
    console.log(queries);
    //find the matching renderer (if a number is provided, use the index)
    const r_raw = queries.renderer || queries.r;
    const r = this.config.renderers.find(function(d, i) {
        return isNaN(+r_raw) ? d.name == r_raw : i == r_raw;
    });

    //parse settings from base64
    const s_raw = queries.settings || queries.s;
    const base64_encoded = isBase64(s_raw);
    let s_text = base64_encoded ? atob(s_raw) : '{}';
    if (!base64_encoded) {
        console.warn(
            "Couldn't load settings from the URL. Settings must be base64 encoded. Using default settings instead."
        );
    }

    //check for valid json
    if (!isJsonString(s_text)) {
        console.warn("Couldn't load settings from the URL.  Using default settings instead.");
        s_text = '{}';
    }

    //parse the settings to an object
    const s = JSON5.parse(s_text);

    //find the matching data file (if a number is provided, use the index)
    const d_raw = queries.data || queries.d;
    const d_obj = this.config.dataFiles.find(function(d, i) {
        return isNaN(+d_raw) ? d_raw == d : i == d_raw;
    });
    const d = d_obj ? d_obj.label : null;

    //get version
    const v = queries.version || queries.v;

    return { renderer: r, version: v, settings: s, data: d };
}
