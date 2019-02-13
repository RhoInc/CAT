import addControlsToggle from './initSubmit/addControlsToggle';
import addSubmitButton from './initSubmit/addSubmitButton';

export function initSubmit(cat) {
    addControlsToggle.call(cat);
    addSubmitButton.call(cat);
}
