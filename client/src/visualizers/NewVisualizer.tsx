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

    p5.strokeWeight(2);
    p5.noFill();
    let x = p5.map(50, 0, 100, 0, width);
    let y = p5.map(50, 0, 100, 0, height);
    let r = 100;
    p5.circle(x, y, r);

    const values = analyzer.getValue();
    for (let i = 0; i < values.length; i++) {
      const amplitude = values[i] as number;
      const x = p5.map(i, 0, values.length - 1, 0, width);
      const y = p5.map(i, 0, values.length - 1, 0, height);
      let r = height / 2 + amplitude * height;

      // map hue based on x position
      let hue = p5.map(x, 0, width, 0, 360);
      p5.stroke(hue, 100, 100);

      p5.circle(x, y, r);
    }
  },
);
