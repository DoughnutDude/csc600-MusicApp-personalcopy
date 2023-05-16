import P5 from "p5";
import * as Tone from "tone";

import { Visualizer } from "../Visualizers";

export const SpiralVisualizer = new Visualizer(
  "Spiral",
  (p5: P5, analyzer: Tone.Analyser) => {
    const width = window.innerWidth;
    const height = window.innerHeight / 2;

    p5.colorMode(p5.HSB, 360, 100, 100);

    p5.background(0, 0, 0, 255);
    p5.noFill();
    let angle = 0;
    let r = 0;
    const values = analyzer.getValue();

    p5.translate(width / 2, height / 2);

    // Calculate the average amplitude
    let sum = 0;
    for (let i = 0; i < values.length; i++) {
      sum += values[i] as number;
    }
    const averageAmplitude = 20 * sum / values.length;

    const rotationSpeed = p5.map(averageAmplitude, 0, 1, 0.01, 0.1);
    p5.rotate(p5.frameCount * rotationSpeed);

    for (let i = 0; i < values.length; i += 3) {
      const amplitude = values[i] as number;

      const x = r * p5.cos(angle);
      const y = r * p5.sin(angle);
      let circleSize = 1 + (amplitude * height) / 3;

      const hue = (p5.map(x, -width / 2, width / 2, 200 , 300 + amplitude * p5.frameCount * 10) ) % 360;
      const saturation = p5.map(y, -height / 2, height / 2, 70, 80);
      const brightness = p5.map(amplitude, 0, 1, 60, 100);
      const color = p5.color(hue, saturation, brightness);

      p5.stroke(color);
      p5.strokeWeight(4);
      p5.circle(x, y, circleSize);

      // wiggle effect
      const wiggleSize = circleSize * 0.25;
      const wiggleOffset = p5.map(amplitude, 0, 1, -wiggleSize, wiggleSize);
      const wiggleX = x + wiggleOffset;
      const wiggleY = y + wiggleOffset;

      p5.circle(wiggleX, wiggleY, circleSize);

      angle += p5.TWO_PI / (values.length / 12) + p5.random(0, 0.05);
      r += 2;
    }
  }
);
