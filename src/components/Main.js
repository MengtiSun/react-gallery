require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

// get images related data
var imageData = require('../data/imageData.json');

// add url to each image
for (let singleImage of imageData) {
  singleImage.imageUrl = require('../images/' + singleImage.fileName);
}

class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
        <section className="img-sec">
        </section>
        <nav className="controller-nav">
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
