import P5 from 'p5';
import * as Tone from 'tone';

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

export const PulsingCircle = new Visualizer(
  'Pulsing Circle',
  (p5: P5, analyzer: Tone.Analyser) => {
    const width = window.innerWidth;
    const height = window.innerHeight / 2;
    const dim = Math.min(width, height);

    p5.colorMode(p5.HSB, 360, 100, 100); // set color mode to HSB
    p5.background(0, 0, 0);
    p5.noFill();

    const cx = Math.round(width/2);
    const cy = Math.round(height/2);
    const baseCircleRadius = Math.round(dim/4);

    const values = analyzer.getValue();
    // console.log("values: ",values);//debug output

    let angle = 0;

    for (let i = 0; i < values.length; i++) {
      const amplitude = (values[i] as number)*300;
      // console.log("amp: ",amplitude);//debug output
      const x = (amplitude + baseCircleRadius)*p5.cos(angle) + cx;
      const y = (amplitude + baseCircleRadius)*p5.sin(angle) + cy;

      const hue = p5.map(colorShift, 0, 255, 0, 360);
      const saturation = p5.map(amplitude, -30, 100, 20, 100);
      const brightness = p5.map(amplitude, -30, 100, 80, 100)
      const color = p5.color(hue, saturation, brightness);

      p5.stroke(color);
      p5.strokeWeight(4);
      //console.log("x: ",x,"y: ",y);//debug output
      p5.point(x,y);
      angle += values.length/p5.TWO_PI;
    }
    setTimeout(shiftColors,colorShiftTimeInterval);
  },
);
