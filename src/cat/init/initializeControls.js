import renderChart from './initializeControls/renderChart';
import changeLibrary from './initializeControls/changeLibrary';
import changeLibraryVersion from './initializeControls/changeLibraryVersion';

export default function initializeControls() {
    renderChart.call(this);
    changeLibrary.call(this);
    changeLibraryVersion.call(this);
}
