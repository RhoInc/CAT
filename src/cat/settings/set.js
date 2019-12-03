import { makeForm } from './makeForm';
import { setStatus } from './setStatus';
import { validateSchema } from './validateSchema';

export function set(cat) {
    // load the schema (if any) and see if it is validate
    cat.current.schemaPath = [
        cat.current.rootURL || cat.config.rootURL,
        cat.current.version !== 'master'
            ? cat.current.name + '@' + cat.current.version
            : cat.current.name + '@latest',
        cat.current.schema
    ].join('/');

    cat.current.settingsView = 'text';
    cat.controls.settingsInput.value = JSON.stringify(cat.current.config);

    d3.json(cat.current.schemaPath, function(error, schemaObj) {
        if (error) {
            console.log('No schema loaded.');
            cat.current.hasValidSchema = false;
            cat.current.schemaObj = null;
        } else {
            // attempt to validate the schema
            console.log('Schema found ...');
            cat.current.hasValidSchema = validateSchema(schemaObj);
            cat.current.settingsView = cat.current.hasValidSchema ? 'form' : 'text';
            cat.current.schemaObj = cat.current.hasValidSchema ? schemaObj : null;
        }
        //set the radio buttons
        cat.controls.settingsTypeText.property('checked', cat.current.settingsView == 'text');

        cat.controls.settingsTypeForm
            .property('checked', cat.current.settingsView == 'form')
            .property('disabled', !cat.current.hasValidSchema);

        // Show/Hide sections
        cat.controls.settingsInput.classed('hidden', cat.current.settingsView != 'text');
        cat.controls.settingsForm.classed('hidden', cat.current.settingsView != 'form');

        //update the text or make the schema
        cat.controls.settingsInput.node().value = JSON5.stringify(cat.current.config, null, 4);

        if (cat.current.hasValidSchema) {
            makeForm(
                cat,
                cat.config.fromURL.renderer !== null && JSON.stringify(cat.config.settings) !== '{}'
                    ? cat.current.config
                    : undefined
            );
        }
    });
}
