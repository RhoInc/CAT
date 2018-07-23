export function getJS() {
    var current_js = [];
    d3.selectAll('script').each(function() {
        var obj = {};
        obj.link = d3.select(this).property('src');
        obj.filename = obj.link.substring(obj.link.lastIndexOf('/') + 1);
        if (obj.link) {
            current_js.push(obj);
        }
    });
    return current_js;
}
