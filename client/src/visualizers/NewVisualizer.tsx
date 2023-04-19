import P5 from 'p5';
import * as Tone from 'tone';

import { Visualizer } from '../Visualizers';

export const NewVisualizer = new Visualizer(
  'Spiral',
  (p5: P5, analyzer: Tone.Analyser) => {
    const width = window.innerWidth;
    const height = window.innerHeight / 2;
    const dim = Math.min(width, height);

    p5.colorMode(p5.HSB, 360, 100, 100); // set color mode to HSB

    p5.background(0, 0, 0, 255);

    let angle = 0;
    let r = 75;
    const values = analyzer.getValue();
    for (let i = 0; i < values.length; i++) {
      const amplitude = values[i] as number;

      
      const x = r * p5.cos(angle) + width/2; // add width/2
      const y = r * p5.sin(angle) + height/2; // add height/2
      const circleSize = amplitude * height;
      p5.strokeWeight(4);
      let hue = p5.map(x, 0, width, 0, 360);
      p5.stroke(hue, 238, 33);
      
      p5.circle(x, y, circleSize);

      angle += p5.TWO_PI / (values.length/16);
      r -= 0.05;
    }
  },
);
