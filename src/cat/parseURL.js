import parseQuery from '../util/parseQuery';

export default function parseURL() {
    var queries = parseQuery(window.location.search.substring(1));

    // Check to see if a renderer is provided
    const r = queries.renderer || queries.r;
    const v = queries.version || queries.v;
    const d = queries.data || queries.d;
    const s_raw = queries.settings || queries.s;
    const s = s_raw ? atob(s_raw) : null;
    return { renderer: r, version: v, settings: s, data: d };
}
