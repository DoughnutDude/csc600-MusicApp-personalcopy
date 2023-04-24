// 3rd party library imports
import P5 from 'p5';
import * as Tone from 'tone';

// project imports
import { Visualizer } from '../Visualizers';


function superformula(p: P5, t: number, m: number, n1: number, n2: number, n3: number, a: number, b: number): number {
  const phi = (Math.PI * 2 * t) / p.TWO_PI;
  const cosPhi = Math.cos(m * phi / 4);
  const numerator = Math.pow(Math.abs(cosPhi / a), n2);
  
  const sinPhi = Math.sin(m * phi / 4);
  const denominator = Math.pow(Math.abs(sinPhi / b), n3);
  
  const r = Math.pow(numerator + denominator, -1 / n1);
  return r;
}

function rose(p: P5, t: number, k: number): number {
  return Math.sin(k * t);
}

const colorShiftTimeInterval = 1;
let colorShift = 0;
function shiftColors() {
  if (colorShift === 255) {
    colorShift = 0;
  } else {
    colorShift++;
  }
}

export const KilianKistenbroker = new Visualizer(
  'KilianKistenbroker',

  // --------------------------------------- circle ----------------------------------------- //

  // (p5: P5, analyzer: Tone.Analyser) => {
  //   const width = window.innerWidth;
  //   const height = window.innerHeight / 2;
  //   const dim = Math.min(width, height);
  //   const radius = dim * 0.4;

  //   p5.background(0, 0, 0, 255);

  //   p5.strokeWeight(dim * 0.01);
  //   p5.stroke(255, 255, 255, 255);
  //   p5.noFill();

  //   const centerX = width / 2;
  //   const centerY = height / 2;

  //   const values = analyzer.getValue();
  //   p5.beginShape();
  //   for (let i = 0; i < values.length; i++) {
  //     const amplitude = values[i] as number;
  //     const angle = p5.map(i, 0, values.length - 1, 0, p5.TWO_PI);
  //     const r = radius + amplitude * height;
  //     // Calculate x and y coordinates based on angle and radius
  //     const x = centerX + r * p5.cos(angle);
  //     const y = centerY + r * p5.sin(angle);
  //     // Place vertex
  //     p5.vertex(x, y);
  //   }
  //   p5.endShape(p5.CLOSE);
  // },

  // ----------------------------------- star --------------------------------- //

  // (p5: P5, analyzer: Tone.Analyser) => {
  //   const width = window.innerWidth;
  //   const height = window.innerHeight / 2;
  //   const dim = Math.min(width, height);
  //   const innerRadius = dim * 0.2;
  //   const outerRadius = dim * 0.4;

  //   p5.background(0, 0, 0, 255);

  //   p5.strokeWeight(dim * 0.01);
  //   p5.stroke(255, 255, 255, 255);
  //   p5.noFill();

  //   const centerX = width / 2;
  //   const centerY = height / 2;

  //   const numPoints = 10;
  //   const values = analyzer.getValue();
  //   const valuesPerPoint = Math.floor(values.length / numPoints);

  //   p5.beginShape();
  //   for (let point = 0; point < numPoints; point++) {
  //     for (let i = 0; i < valuesPerPoint; i++) {
  //       const amplitude = values[point * valuesPerPoint + i] as number;
  //       const angle = p5.map(point, 0, numPoints, 0, p5.TWO_PI);
  //       const angleOffset = p5.TWO_PI / (numPoints * 2);
  //       const r = i % 2 === 0 ? outerRadius + amplitude * height : innerRadius + amplitude * height;
        
  //       const x = centerX + r * p5.cos(angle + angleOffset * i);
  //       const y = centerY + r * p5.sin(angle + angleOffset * i);
        
  //       p5.vertex(x, y);
  //     }
  //   }
  //   p5.endShape(p5.CLOSE);
  // },

  // ------------------------------ spiral ----------------------------------- //

  // (p5: P5, analyzer: Tone.Analyser) => {
  //   const width = window.innerWidth;
  //   const height = window.innerHeight / 2;

  //   p5.background(0, 0, 0, 255);

  //   p5.strokeWeight(1);
  //   p5.stroke(255, 255, 255, 255);
  //   p5.noFill();

  //   const values = analyzer.getValue();
  //   const numPoints = values.length;

  //   const centerX = width / 2;
  //   const centerY = height / 2;
  //   const maxRadius = Math.min(width, height) / 3;

  //   p5.push();
  //   p5.translate(centerX, centerY);

  //   p5.beginShape();
  //   for (let i = 0; i < numPoints; i++) {
  //     const amplitude = values[i] as number;
  //     const angle = p5.map(i, 0, numPoints, 0, p5.TWO_PI * 2); // Change the number of spiral loops by adjusting the multiplier of p5.TWO_PI
  //     const normalizedRadius = p5.map(i, 0, numPoints, 0, maxRadius);
  //     const radius = normalizedRadius + amplitude * height;

  //     const x = radius * p5.cos(angle);
  //     const y = radius * p5.sin(angle);

  //     p5.vertex(x, y);
  //   }
  //   p5.endShape();
  //   p5.pop();
  // },

  // ------------------------------ Lissajous ----------------------------- //

  (p5: P5, analyzer: Tone.Analyser) => {
    const width = window.innerWidth;
    const height = window.innerHeight / 2;
    const dim = Math.min(width, height)

    // p5.strokeWeight(2);
    p5.strokeWeight(dim * 0.01);
    // p5.stroke(152,251,152);

    p5.colorMode(p5.HSB, 360, 100, 100); // set color mode to HSB
    p5.background(0, 0, 0);
    p5.noFill();

    const values = analyzer.getValue();
    const numPoints = values.length;

    const centerX = width / 2.25;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) / 5;

    const a = 5; // Lissajous curve parameter a, change to control the shape
    const b = 6; // Lissajous curve parameter b, change to control the shape
    const delta = p5.PI / 2; // Lissajous curve parameter delta, change to control the shape

    p5.push();
    p5.translate(centerX, centerY);

    p5.beginShape();
    for (let i = 0; i < numPoints; i++) {
      const amplitude = values[i] as number;
      const angle = p5.map(i, 0, numPoints, 0, p5.TWO_PI);
      const radius = maxRadius + amplitude * height;

      const x = radius * p5.sin(a * angle + delta);
      const y = radius * p5.sin(b * angle);

      
      const hue = p5.map(colorShift, 0, 255, 0, 360);
      const saturation = p5.map(amplitude, -30, 100, 20, 100);
      const brightness = p5.map(amplitude, -30, 100, 80, 100)
      const color = p5.color(hue, saturation, brightness);
      p5.stroke(color);

      p5.vertex(x, y);
    }
    setTimeout(shiftColors,colorShiftTimeInterval);
    p5.endShape(p5.CLOSE);
    p5.pop();
  },

  // ----------------------------- superformula ---------------------------- //

  // (p5: P5, analyzer: Tone.Analyser) => {
  //   const width = window.innerWidth;
  //   const height = window.innerHeight / 2;

  //   p5.background(0, 0, 0, 255);

  //   p5.strokeWeight(1);
  //   p5.stroke(255, 255, 255, 255);
  //   p5.noFill();

  //   const values = analyzer.getValue();
  //   const numPoints = values.length;

  //   const centerX = width / 2;
  //   const centerY = height / 2;
  //   const maxRadius = Math.min(width, height) / 3;

  //   const m = 4; // Superformula parameter m
  //   const n1 = 1; // Superformula parameter n1
  //   const n2 = 1; // Superformula parameter n2
  //   const n3 = 1; // Superformula parameter n3
  //   const a = 1;  // Superformula parameter a
  //   const b = 1;  // Superformula parameter b

  //   p5.push();
  //   p5.translate(centerX, centerY);

  //   p5.beginShape();
  //   for (let i = 0; i < numPoints; i++) {
  //     const amplitude = values[i] as number;
  //     const t = p5.map(i, 0, numPoints, 0, p5.TWO_PI);

  //     const r = superformula(p5, t, m, n1, n2, n3, a, b);
  //     const radius = maxRadius * r + amplitude * height;

  //     const x = radius * p5.cos(t);
  //     const y = radius * p5.sin(t);

  //     p5.vertex(x, y);
  //   }
  //   p5.endShape(p5.CLOSE);
  //   p5.pop();
  // },

  // --------------------------------- rose ----------------------------- //

  // (p5: P5, analyzer: Tone.Analyser) => {
  //   const width = window.innerWidth;
  //   const height = window.innerHeight / 2;

  //   p5.background(0, 0, 0, 255);

  //   p5.strokeWeight(1);
  //   p5.stroke(255, 255, 255, 255);
  //   p5.noFill();

  //   const values = analyzer.getValue();
  //   const numPoints = values.length;

  //   const centerX = width / 2;
  //   const centerY = height / 2;
  //   const maxRadius = Math.min(width, height) / 3;

  //   const k = 5; // Rose curve parameter k, change to control the shape

  //   p5.push();
  //   p5.translate(centerX, centerY);

  //   p5.beginShape();
  //   for (let i = 0; i < numPoints; i++) {
  //     const amplitude = values[i] as number;
  //     const t = p5.map(i, 0, numPoints, 0, p5.TWO_PI);

  //     const r = rose(p5, t, k);
  //     const radius = maxRadius * r + amplitude * height;

  //     const x = radius * p5.cos(t);
  //     const y = radius * p5.sin(t);

  //     p5.vertex(x, y);
  //   }
  //   p5.endShape(p5.CLOSE);
  //   p5.pop();
  // },

  // -------------------------------- rose + lissajous -------------------------- //

  // (p5: P5, analyzer: Tone.Analyser) => {
  //   const width = window.innerWidth;
  //   const height = window.innerHeight / 2;

  //   p5.background(0, 0, 0, 255);

  //   p5.strokeWeight(1);
  //   p5.stroke(255, 255, 255, 255);
  //   p5.noFill();

  //   const values = analyzer.getValue();
  //   const numPoints = values.length;

  //   const centerX = width / 2;
  //   const centerY = height / 2;
  //   const maxRadius = Math.min(width, height) / 3;

  //   const k = 5; // Rose curve parameter k, change to control the shape
  //   const a = 3; // Lissajous curve parameter a, change to control the shape
  //   const b = 4; // Lissajous curve parameter b, change to control the shape
  //   const delta = p5.PI / 2; // Lissajous curve parameter delta, change to control the shape

  //   p5.push();
  //   p5.translate(centerX, centerY);

  //   p5.beginShape();
  //   for (let i = 0; i < numPoints; i++) {
  //     const amplitude = values[i] as number;
  //     const t = p5.map(i, 0, numPoints, 0, p5.TWO_PI);

  //     const r1 = rose(p5, t, k);
  //     const r2 = maxRadius * r1 + amplitude * height;

  //     const x1 = r2 * p5.sin(a * t + delta);
  //     const y1 = r2 * p5.sin(b * t);

  //     const x = x1 * p5.cos(t) - y1 * p5.sin(t);
  //     const y = x1 * p5.sin(t) + y1 * p5.cos(t);

  //     p5.vertex(x, y);
  //   }
  //   p5.endShape(p5.CLOSE);
  //   p5.pop();
  // },

);
