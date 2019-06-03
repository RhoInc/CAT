export function initChartConfig() {
    const cat = this;

    this.controls.settingsType.on('change', function(d) {
        cat.settings.sync(cat); //first sync the current settings to both views

        //then update to the new view, and update controls.
        cat.current.settingsView = this.value; //
        if (cat.current.settingsView == 'text') {
            cat.controls.settingsInput.classed('hidden', false);
            cat.controls.settingsForm.classed('hidden', true);
        } else if (cat.current.settingsView == 'form') {
            cat.controls.settingsInput.classed('hidden', true);
            cat.controls.settingsForm.classed('hidden', false);
        }
    });

    this.settings.set(this);
}
