import updateRenderer from './initRendererSelect/updateRenderer';

export function initRendererSelect() {
    var cat = this;
    cat.controls.rendererWrap.append('h3').text('1. Choose a Charting Library');
    cat.controls.rendererWrap.append('span').text('Library: ');

    cat.controls.rendererSelect = cat.controls.rendererWrap.append('select');
    cat.controls.rendererSelect
        .selectAll('option')
        .data(cat.config.renderers)
        .enter()
        .append('option')
        .attr('label', d => (d.sub ? d.name + ' (' + d.sub.split('.').pop() + ')' : d.name))
        .attr('selected', d => (d == cat.current ? 'selected' : null))
        .text(d => d.name);

    cat.controls.rendererSelect.on('change', function() {
        updateRenderer.call(cat, this);
    });
    cat.controls.rendererWrap.append('br');
    cat.controls.rendererWrap.append('span').text('Version: ');
    cat.controls.versionSelect = cat.controls.rendererWrap.append('input');
    cat.controls.versionSelect.node().value = cat.current.version;
    cat.controls.versionSelect.on('input', function() {
        cat.current.version = this.value;
    });
    cat.controls.versionSelect.on('change', function() {
        cat.settings.set(cat);
    });
    cat.controls.rendererWrap.append('br');

    cat.controls.rendererWrap
        .append('a')
        .text('More Options')
        .style('text-decoration', 'underline')
        .style('color', 'blue')
        .style('cursor', 'pointer')
        .on('click', function() {
            d3.select(this).remove();
            cat.controls.rendererWrap.selectAll('*').classed('hidden', false);
        });

    //specify the code to create the chart
    cat.controls.rendererWrap
        .append('span')
        .text(' Init: ')
        .classed('hidden', true);
    cat.controls.mainFunction = cat.controls.rendererWrap.append('input').classed('hidden', true);
    cat.controls.mainFunction.node().value = cat.current.main;
    cat.controls.rendererWrap
        .append('span')
        .text('.')
        .classed('hidden', true);
    cat.controls.subFunction = cat.controls.rendererWrap.append('input').classed('hidden', true);
    cat.controls.subFunction.node().value = cat.current.sub;
    cat.controls.rendererWrap.append('br').classed('hidden', true);
    //Webcharts versionSelect
    cat.controls.rendererWrap
        .append('span')
        .text('Webcharts Version: ')
        .classed('hidden', true);
    cat.controls.libraryVersion = cat.controls.rendererWrap.append('input').classed('hidden', true);
    cat.controls.libraryVersion.node().value = 'master';
    cat.controls.rendererWrap.append('br').classed('hidden', true);

    cat.controls.rendererWrap
        .append('span')
        .text('Schema: ')
        .classed('hidden', true);
    cat.controls.schema = cat.controls.rendererWrap.append('input').classed('hidden', true);
    cat.controls.schema.node().value = cat.current.schema;
    cat.controls.rendererWrap.append('br').classed('hidden', true);

    //add enter listener
    cat.controls.addEnterEventListener(cat.controls.rendererWrap, cat);
}
