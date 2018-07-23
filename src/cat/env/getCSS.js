export function getCSS() {
    var current_css = [];
    d3.selectAll('link').each(function() {
        var obj = {};
        obj.sel = this;
        obj.link = d3.select(this).property('href');
        obj.disabled = d3.select(this).property('disabled');
        obj.filename = obj.link.substring(obj.link.lastIndexOf('/') + 1);
        obj.wrap = d3.select(this);
        current_css.push(obj);
    });
    return current_css;
}
