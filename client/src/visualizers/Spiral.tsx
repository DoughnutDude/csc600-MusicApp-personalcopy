import P5 from "p5";
import * as Tone from "tone";

import { Visualizer } from "../Visualizers";

export const SpiralVisualizer = new Visualizer(
  "Spiral",
  (p5: P5, analyzer: Tone.Analyser) => {
    const width = window.innerWidth;
    const height = window.innerHeight / 2;

    p5.colorMode(p5.HSB, 360, 100, 100); // set color mode to HSB

    p5.background(0, 0, 0, 255);
    p5.noFill();
    let angle = 0;
    let r = 0;
    const values = analyzer.getValue();

    p5.translate(width / 2, height / 2); // Move the origin to the center of the canvas
    
    p5.rotate(p5.frameCount); // Rotate the entire visualization based on frame count

    for (let i = 0; i < values.length; i += 3) {
      const amplitude = values[i] as number;

      const x = r * p5.cos(angle);
      const y = r * p5.sin(angle);
      let circleSize = 1 + (amplitude * height) / 4;

      const hue = p5.map(x, -width / 2, width / 2, 0, 360);
      const saturation = p5.map(y, -height / 2, height / 2, 20, 70);
      const baseBrightness = 60;
      const amplitudeBrightness = p5.map(amplitude, 0, 1, 50, 70);
      const color1 = p5.color(hue, saturation, amplitudeBrightness);
      const color2 = p5.color(128, 128, 128, baseBrightness);
      const color = p5.lerpColor(color1, color2, 0.5);

      p5.stroke(color);
      p5.strokeWeight(4);
      p5.circle(x, y, circleSize);

      // Worm-like effect
      const wormSize = circleSize * 0.25; // Size of the worm-like motion
      const wormOffset = p5.map(amplitude, 0, 1, -wormSize, wormSize); // Offset based on the amplitude
      const wormX = x + wormOffset;
      const wormY = y + wormOffset;

      p5.circle(wormX, wormY, circleSize);

      angle += p5.TWO_PI / (values.length / 12) + p5.random(0, 0.05);
      r += 3;
    }
  }
);
