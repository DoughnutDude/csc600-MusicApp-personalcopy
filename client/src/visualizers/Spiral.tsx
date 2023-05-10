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

    // Calculate the average amplitude
    let sum = 0;
    for (let i = 0; i < values.length; i++) {
      sum += values[i] as number;
    }
    const averageAmplitude = 10 * sum / values.length;

    const rotationSpeed = p5.map(averageAmplitude, 0, 1, 0.001, 0.02); // Adjust the range and speed as needed
    p5.rotate(p5.frameCount * rotationSpeed); // Rotate the entire visualization based on frame count and average amplitude

    for (let i = 0; i < values.length; i += 3) {
      const amplitude = values[i] as number;

      const x = r * p5.cos(angle);
      const y = r * p5.sin(angle);
      let circleSize = 1 + (amplitude * height) / 4;

      const hue = (p5.map(x, -width / 2, width / 2, 0, 360) + p5.frameCount) % 360; // Vary the hue over time
      const saturation = p5.map(y, -height / 2, height / 2, 20, 70);
      const baseBrightness = 60;
      const amplitudeBrightness = p5.map(amplitude, 0, 1, 50, 70);
      const color1 = p5.color(hue, saturation, amplitudeBrightness);
      const color2 = p5.color(128, 128, 128, baseBrightness);
      const color = p5.lerpColor(color1, color2, 0.5);

      p5.stroke(color);
      p5.strokeWeight(4);
      p5.circle(x, y, circleSize);

      // wiggle-like effect
      const wiggleSize = circleSize * 0.25; // Size of the wiggle-like motion
      const wiggleOffset = p5.map(amplitude, 0, 1, -wiggleSize, wiggleSize); // Offset based on the amplitude
      const wiggleX = x + wiggleOffset;
      const wiggleY = y + wiggleOffset;

      p5.circle(wiggleX, wiggleY, circleSize);

      angle += p5.TWO_PI / (values.length / 12) + p5.random(0, 0.05);
      r += 3;
    }
  }
);
