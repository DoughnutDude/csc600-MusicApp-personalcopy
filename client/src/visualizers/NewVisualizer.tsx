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
    p5.noFill();
    let angle = 0;
let r = 0;
const values = analyzer.getValue();
for (let i = 0; i < values.length; i++) {
  const amplitude = values[i] as number;

  const x = r * p5.cos(angle) + width/2;
  const y = r * p5.sin(angle) + height/2;
  let circleSize = amplitude * height * 1.5;

  const hue = p5.map(x, 0, width, 0, 360); // map x to a range of 20 to 80 (orange to blue)
const saturation = p5.map(y, 0, height, 20, 70); // map y to a range of 20 to 70
const baseBrightness = 60; // set a higher base brightness for the gray color
const amplitudeBrightness = p5.map(amplitude, 0, 1, 50, 70); // map amplitude to a smaller range of 50 to 70 for brightness
const color1 = p5.color(hue, saturation, amplitudeBrightness);
const color2 = p5.color(128, 128, 128, baseBrightness);
const color = p5.lerpColor(color1, color2, 0.5); // create a color that is a blend of the mapped color and gray



p5.stroke(color);


  p5.strokeWeight(4);
  p5.circle(x, y, circleSize);

  angle += (p5.TWO_PI / (values.length/16)) + p5.random(0, 0.05);
  r += 3 + p5.random(0, 2);
}

    },
);
