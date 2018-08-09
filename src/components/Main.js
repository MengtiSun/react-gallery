require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

// get images related data
let imageData = require('../data/imageData.json');

// add url to each image
for (let singleImage of imageData) {
  singleImage.imageUrl = require('../images/' + singleImage.fileName);
}

//get a random number from a range
function getRangeRandom(low, high) {
  return Math.floor(Math.random() * (high - low) + low);
}

// get a degree between -30 to 30
function get30DegRandom() {
  return (Math.random() > 0.5? '' : '-') + Math.floor(Math.random() * 30);
}

let ImgFigure = React.createClass({
  handleClick(e) {
    this.props.inverse();
    e.stopPropagation();
    e.preventDefault();
  },
  render: function() {
    let styleObj = {};
    if (this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }
    if (this.props.arrange.rotate) {
      ['-moz-', '-ms-', '-webkit-', ''].forEach((value)=>{
          styleObj[value + 'transform'] = `rotate(${this.props.arrange.rotate}deg)`;
      })
    }
    let imgFigureClassName = 'img-figure';
    imgFigureClassName += this.props.arrange.isInverse? ' is-inverse': '';
    return (
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
        <img src={this.props.data.imageUrl}
             alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick}>
            <p>{this.props.data.desc}</p>
          </div>
        </figcaption>
      </figure>
    );
  }
})

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.Constant = {
      centerPos: {
        left: 0,
        right: 0
      },
      hPosRange: {        // horizontal position range
        leftSecX: [0, 0],
        rightSecX: [0, 0],
        y: [0, 0]
      },
      vPosRange: {        // vertical position range
        x: [0, 0],
        topY: [0, 0]
      }
    };
    this.state = {
      imgsArrangeArr: [
        //{
        //  pos:{
        //    left:'0',
        //    top:'0'
        //  },
      ]
    };
  }
  // inverse an image
  inverse(index) {
    return ()=> {
      let imgsArrangeArr = this.state.imgsArrangeArr;
      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
      this.setState({
        imgsArrangeArr: imgsArrangeArr
      })
    }
  }

  // Rearrage all images
  // @param centerIndex: indicate which image stays in the center
  rearrange(centerIndex) {
    let imgsArrangeArr = this.state.imgsArrangeArr;
    // give position to image in the center position
    let imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);
    imgsArrangeCenterArr[0] = {
      pos: this.Constant.centerPos,
      rotate: 0
    }
    // give position to image in the top section
    let topImgNum = Math.floor(Math.random() * 2);
    let topImgIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));
    let imgsArrangeTopArr = imgsArrangeArr.splice(topImgIndex, topImgNum);
    imgsArrangeTopArr.forEach((value, index)=> {
      // imgsArrangeTopArr[index] = {
      //   pos: {
      //     top: getRangeRandom(this.Constant.vPosRange.topY[0], this.Constant.vPosRange.topY[1]),
      //     left: getRangeRandom(this.Constant.vPosRange.x[0], this.Constant.vPosRange.x[1])
      //   }
      // }
      value.pos.top = getRangeRandom(this.Constant.vPosRange.topY[0], this.Constant.vPosRange.topY[1]);
      value.pos.left = getRangeRandom(this.Constant.vPosRange.x[0], this.Constant.vPosRange.x[1]);
      value.rotate = get30DegRandom();
    })
    // give position to images in the left and right sections
    let k = imgsArrangeArr.length / 2;
    for (let i = 0; i < imgsArrangeArr.length; i++) {
      let hPosRangeLORX = null;
      if (i < k) {
        hPosRangeLORX = this.Constant.hPosRange.leftSecX;
      } else {
        hPosRangeLORX = this.Constant.hPosRange.rightSecX;
      }
      imgsArrangeArr[i] = {
        pos: {
          top: getRangeRandom(this.Constant.hPosRange.y[0], this.Constant.hPosRange.y[1]),
          left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
        },
        rotate: get30DegRandom()
      }
    }
    if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
      imgsArrangeArr.splice(topImgIndex, 0, imgsArrangeTopArr[0]);
    }
    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
    this.setState({
      imgsArrangeArr: imgsArrangeArr
    })
  }

  // after component is mounted, calculate position range for each image
  componentDidMount() {
    // get the size of the stage
    let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
        stageW = stageDOM.scrollWidth,
        stageH = stageDOM.scrollHeight,
        halfStageW = Math.ceil(stageW / 2),
        halfStageH = Math.ceil(stageH / 2);
    // get the size of a imageFigure
    let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
        imgW = imgFigureDOM.scrollWidth,
        imgH = imgFigureDOM.scrollHeight,
        halfImgW = Math.ceil(imgW / 2),
        halfImgH = Math.ceil(imgH / 2);
    // calculate the position of the center image
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    }
    // calculate the layout range of images in the left and right regions
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;
    // calculate the layout range of images in the top area
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;

    this.rearrange(0);
  }
  render() {
    let controllerUnits = [];
    let imgFigures = [];
    
    imageData.forEach((value, index)=> {
      if (!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: '0',
            top: '0'
          },
          rotate: 0,
          isInverse: false
        }
      }
      imgFigures.push(<ImgFigure data={value} ref={'imgFigure' + index}
                        arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)}/>)
    });

    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
