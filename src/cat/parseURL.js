import parseQuery from '../util/parseQuery';

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
    const s = s_raw ? atob(s_raw) : null;

    //find the matching data file (if a number is provided, use the index)
    const d_raw = queries.data || queries.d;
    const d = this.config.dataFiles.filter(function(d, i) {
        return isNaN(+r) ? d == r : i == r;
    });
    //get version
    const v = queries.version || queries.v;

    return { renderer: r, version: v, settings: s, data: d };
}
