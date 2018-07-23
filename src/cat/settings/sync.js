import { makeForm } from './makeForm';

export function sync(cat, printStatus) {
    function IsJsonString(str) {
        try {
            JSON5.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    // set current config
    if (cat.current.settingsView == 'text') {
        var text = cat.controls.settingsInput.node().value;

        if (IsJsonString(text)) {
            var settings = JSON5.parse(text);
            var json = JSON.stringify(settings, null, 4);

            if (cat.printStatus) {
                cat.statusDiv
                    .append('div')
                    .html('Successfully loaded settings from text input.')
                    .classed('success', true);
            }

            cat.controls.settingsInput.node().value = json;
            cat.current.config = settings;
        } else {
            if (cat.printStatus) {
                cat.statusDiv
                    .append('div')
                    .html(
                        "Couldn't load settings from text. Check to see if you have <a href='https://jsonlint.com/?json=" +
                            text +
                            "'>valid JSON</a>."
                    )
                    .classed('error', true);
            }
        }

        if (cat.current.hasValidSchema) {
            makeForm(cat, cat.current.config);
        }
    } else if (cat.current.settingsView == 'form') {
        //this submits the form which:
        //- saves the current object
        //- updates the hidden text view
        //$(".settingsForm form").trigger("submit");
        //get settings object from form
        cat.current.config = cat.current.form.getData();
        //update settings text field to match form
        cat.controls.settingsInput.node().value = JSON.stringify(cat.current.config, null, 4);
    }
}
