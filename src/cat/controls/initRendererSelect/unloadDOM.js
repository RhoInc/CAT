export default function unloadDOM() {
    d3
        .selectAll('link')
        .filter(function() {
            return !this.href.indexOf('css/cat.css');
        })
        .property('disabled', true)
        .remove();

    d3
        .selectAll('style')
        .property('disabled', true)
        .remove();
}
