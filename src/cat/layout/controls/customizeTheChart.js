export default function customizeTheChart() {
    this.controls.settingsWrap = this.controls.wrap
        .append('div')
        .classed('control-section settings-section', true);
    this.controls.settingsWrap.append('h3').html('3. Customize the Chart ');
    this.controls.settingsWrap.append('span').text('Settings: ');
    this.controls.settingsTypeText = this.controls.settingsWrap
        .append('input')
        .attr('class', 'radio')
        .property('type', 'radio')
        .property('name', 'settingsType')
        .property('value', 'text');
    this.controls.settingsWrap.append('span').text('text');
    this.controls.settingsTypeForm = this.controls.settingsWrap
        .append('input')
        .attr('class', 'radio')
        .property('type', 'radio')
        .property('name', 'settingsType')
        .property('value', 'form');
    this.controls.settingsWrap.append('span').text('form');
    this.controls.settingsType = this.controls.settingsWrap.selectAll('input[type="radio"]');
    this.controls.settingsWrap.append('br');
    this.controls.settingsInput = this.controls.settingsWrap
        .append('textarea')
        .attr('rows', 10)
        .style('width', '90%')
        .text('{}');
    this.controls.settingsForm = this.controls.settingsWrap
        .append('div')
        .attr('class', 'settingsForm')
        .append('form');
}
