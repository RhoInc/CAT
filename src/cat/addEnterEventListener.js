export default function addEnterEventListener(cat) {
    //Add Enter event listener to all controls.
      cat.controls.wrap.selectAll('select,input')
        .each(function() {
            this.addEventListener('keypress', function(e) {
                const key = e.which || e.keyCode;

                //13 is Enter
                if (key === 13)
                    cat.controls.submitButton.node().click();
            });
        });
}
