export default function addEnterEventListener(selection, cat) {
    //Add Enter event listener to all controls.
    selection.selectAll('select,input').each(function() {
        const element = this;
        this.addEventListener('keypress', function(e) {
            const key = e.which || e.keyCode;

            //13 is Enter
            if (key === 13) cat.controls.submitButton.node().click();
        });
    });
}
