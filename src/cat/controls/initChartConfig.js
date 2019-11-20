export function initChartConfig() {
    var cat = this;
    var settingsHeading = cat.controls.settingsWrap.append('h3').html('3. Customize the Chart ');

    cat.controls.settingsWrap.append('span').text('Settings: ');

    /*
  //////////////////////////////////////
  //initialize the config status icon
  //////////////////////////////////////
  cat.controls.settingsStatus = settingsSection
    .append("div")
    .style("font-size", "1.5em")
    .style("float", "right")
    .style("cursor", "pointer");
  settingsSection.append("br");
*/

    //////////////////////////////////////////////////////////////////////
    //radio buttons to toggle between "text" and "form" based settings
    /////////////////////////////////////////////////////////////////////
    cat.controls.settingsTypeText = cat.controls.settingsWrap
        .append('input')
        .attr('class', 'radio')
        .property('type', 'radio')
        .property('name', 'settingsType')
        .property('value', 'text');
    cat.controls.settingsWrap.append('span').text('text');
    cat.controls.settingsTypeForm = cat.controls.settingsWrap
        .append('input')
        .attr('class', 'radio')
        .property('type', 'radio')
        .property('name', 'settingsType')
        .property('value', 'form');
    cat.controls.settingsWrap.append('span').text('form');
    cat.controls.settingsType = cat.controls.settingsWrap.selectAll('input[type="radio"]');

    cat.controls.settingsType.on('change', function(d) {
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
    cat.controls.settingsWrap.append('br');

    //////////////////////////////////////////////////////////////////////
    //text input section
    /////////////////////////////////////////////////////////////////////
    cat.controls.settingsInput = cat.controls.settingsWrap
        .append('textarea')
        .attr('rows', 10)
        .style('width', '90%')
        .text('{}');

    //////////////////////////////////////////////////////////////////////
    //wrapper for the form
    /////////////////////////////////////////////////////////////////////
    cat.controls.settingsForm = cat.controls.settingsWrap
        .append('div')
        .attr('class', 'settingsForm')
        .append('form');

    //set the text/form settings for the first renderer
    cat.settings.set(cat);
}
