# CAT

## Overview
This Charting Application Tester (CAT) lets users make and adjust web graphics on the fly.  

### Controls
allow the choice and configuration of charts, as well as the data file with which to initialize the charts

#### 1. Choose a Charting Library
controls which charting application library/version and charting library/version will be loaded

##### Render Chart
button that generates the selected chart

1. Destroys the currently displayed chart if one has been rendered.
2. Loads the selected data file.
3. Initializes the selected charting application library.

##### Library:
dropdown with a list of charting application libraries

1. Removes the previous library's .js, .css, and/or stylesheet from the DOM.
2. Updates the status section.
3. Loads the master branch of the selected library.
  1. Loads the library's package.json file to know where the main .js file lives.
  2. Optionally loads the settings-schema.json file to populate the settings text/form if the library has a settings schema file.
  3. Loads the main .js file.
  4. Optionally loads the main .css file if the library has a .css file.
4. Loads the branches and releases of the library.
5. Updates the settings text/form.

##### Version:
dropdown with a list of branches and releases for the selected charting application library

1. Removes the previous library's .js, .css, and/or stylesheet from the DOM.
2. Loads the selected version of the selected library.
  1. Loads the library's package.json file to know where the main .js file lives.
  2. Optionally loads the settings-schema.json file to populate the settings text/form if the library has a settings schema file.
  3. Loads the main .js file.
  4. Optionally loads the main .css file if the library has a .css file.
3. Updates the settings text/form.

##### Init:
input that allows the specification of the namespace of the selected charting application library

##### .
optional input that allows the specification of a method of the selected charting application library that generates the chart

##### Webcharts Version:
dropdown with a list of branches and releases of the charting library, which is a dependency of the charting application library; Webcharts is currently the only charting library supported

1. Removes the previous library's .js, .css, and/or stylesheet from the DOM.
2. Loads the selected library.
  1. Loads the library's package.json file to know where the main .js file lives.
  2. Loads the main .js file.
  3. Loads the main .css file if the library has a .css file.

##### Schema:
input that accepts the name of the settings schema of the selected charting application library

#### 2. Choose a Dataset
dropdown that allows the selection of data file with which to initialize the selected charting application

##### :magnifying glass:
button that toggles the display from the chart to the loaded dataset

#### 3. Customize the Chart
allows editing of the chart settings, either with a text input or with a settings form generated with the charting application library's settings schema

##### Settings:-text
a simple text input that allows the specification of a settings object in JSON or JavaScript

##### Settings:-form
a list of inputs generated with the settings schema of the loaded charting application library

#### 4. Environment
a list of the loaded .css, .js, and stylesheets
