// 3rd party library imports
import P5 from 'p5';
import * as Tone from 'tone';

// project imports
import { Visualizer } from '../Visualizers';

const colorShiftTimeInterval = 1;
let colorShift = 0;
function shiftColors() {
  if (colorShift === 255) {
    colorShift = 0;
  } else {
    colorShift++;
  }
}

export const MyVisualizer = new Visualizer(
    'Star',
    (p5: P5, analyzer: Tone.Analyser) => {
    const width = window.innerWidth;
    const height = window.innerHeight / 2;
    const dim = Math.min(width, height);
    const innerRadius = dim * 0.2;
    const outerRadius = dim * 0.4;

    p5.background(0, 0, 0, 255);

    p5.strokeWeight(dim * 0.01);
    p5.stroke(255, 255, 255, 255);
    p5.noFill();

    const centerX = width / 2;
    const centerY = height / 2;

    const numPoints = 10;
    const values = analyzer.getValue();
    const valuesPerPoint = Math.floor(values.length / numPoints);

    p5.beginShape();
    for (let point = 0; point < numPoints; point++) {
      for (let i = 0; i < valuesPerPoint; i++) {
        const amplitude = values[point * valuesPerPoint + i] as number;
        const angle = p5.map(point, 0, numPoints, 0, p5.TWO_PI);
        const angleOffset = p5.TWO_PI / (numPoints * 2);
        const r = i % 2 === 0 ? outerRadius + amplitude * height : innerRadius + amplitude * height;
        
        const x = centerX + r * p5.cos(angle + angleOffset * i);
        const y = centerY + r * p5.sin(angle + angleOffset * i);
        let circleSize = amplitude * height / 1.75;

        const hue = p5.map(colorShift, 0,255,0,360);
        const saturation = p5.map(amplitude,-30,100,20,100);
        const brightness = p5.map(amplitude,-30,100,80,100);
        const color = p5.color(hue,saturation,brightness);
        p5.stroke(color);
        p5.circle(x, y, circleSize);
        p5.vertex(x, y);
      }
    }
    setTimeout(shiftColors,colorShiftTimeInterval);
    p5.endShape(p5.CLOSE);
  },


    // 'Square',
    // (p5: P5, analyzer: Tone.Analyser) => {
    //     const width = window.innerWidth;
    //     const height = window.innerHeight / 2;
    //     const dim = Math.min(width, height);
    // 
    //     p5.background(0, 0, 0, 255);
    // 
    //     p5.strokeWeight(dim * 0.01);
    //     p5.stroke(255, 255, 255, 255);
    //     p5.noFill();
    //     
    // 
    //     const values = analyzer.getValue();
    //     p5.beginShape();
    //     for (let i = 0; i < values.length; i++) {
    //       const amplitude = values[i] as number;
    //       const x = p5.map(i, 0, values.length - 1, 0, width);
    //       const y = height / 2 + amplitude * height;
    //       // Place vertex
    //       //p5.vertex(x, y);
    //       p5.curveVertex(x,y, x+5, y+5);
    //     }
    //     p5.endShape();
    //   },
);