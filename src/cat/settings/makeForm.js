import { loadLibrary } from '../loadLibrary';
import addEnterEventListener from '../addEnterEventListener';

export function makeForm(cat, obj) {
    d3
        .select('.settingsForm form')
        .selectAll('*')
        .remove();

    //define form from settings schema
    cat.current.form = brutusin['json-forms'].create(cat.current.schemaObj);

    if (!obj) {
        //Render form with default schema settings.
        cat.current.form.render(d3.select('.settingsForm form').node());

        //Define renderer settings.
        cat.current.config = cat.current.form.getData();

        //Update text settings with default schema settings.
        //cat.controls.settingsInput.node().value = JSON.stringify(cat.current.config, null, 4);
        const json = JSON.stringify(cat.current.config, null, 4);
        cat.controls.settingsInput.attr('rows', json.split('\n').length);
        cat.controls.settingsInput.html(json);
    } else
        //Render form with updated text settings.
        cat.current.form.render(d3.select('.settingsForm form').node(), cat.current.config);

    d3
        .select('.settingsForm form')
        .selectAll('.glyphicon-remove')
        .text('X');

    //handle submission with the "render chart" button
    d3.select('.settingsForm form .form-actions input').remove();
    //format the form a little bit so that we can dodge bootstrap
    d3.selectAll('i.icon-plus-sign').text('+');
    d3.selectAll('i.icon-minus-sign').text('-');

    //add enter listener
    cat.controls.addEnterEventListener(cat.controls.wrap.select('.settingsForm'), cat);
}
