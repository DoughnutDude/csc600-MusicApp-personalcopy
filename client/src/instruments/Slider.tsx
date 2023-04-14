// 3rd party library imports
import * as Tone from 'tone';
import classNames from 'classnames';
import { List, Range } from 'immutable';
import React from 'react';

// project imports
import { Instrument, InstrumentProps } from '../Instruments';
import { Frequency } from 'tone/build/esm/core/type/Units';

/** ------------------------------------------------------------------------ **
 * Contains implementation of components for Slider.
 ** ------------------------------------------------------------------------ */

const unitWidth = .1;
const semitoneDistance = 1.06;
const relativeToA4 = 440*(Math.pow(2, (1/12)));
const semitones = [
  32.70,
  34.65,
  36.71,
  38.89,
  41.20,
  43.65,
  46.25,
  49.00,
  51.91,
  27.50,
  29.14,
  30.87,
]

interface SliderKeyProps {
  note: number; //freq in Hz
  duration?: string;
  synth: Tone.Synth;
  index: number; // octave + index together give a location for the piano key
}

function SliderType({ title, onClick, active }: any): JSX.Element {
  return (
    <div
      onClick={onClick}
      className={classNames('dim pointer ph2 pv1 ba mr2 br1 fw7 bw1', {
        'b--black black': active,
        'gray b--light-gray': !active,
      })}
    >
      {title}
    </div>
  );
}

function checkIfFreqIsSemitone(note: number): boolean {
  return  note%semitones[0]===0 || note%semitones[1]===0 || note%semitones[2]===0 ||
          note%semitones[3]===0 || note%semitones[4]===0 || note%semitones[5]===0 ||
          note%semitones[6]===0 || note%semitones[7]===0 || note%semitones[8]===0 ||
          note%semitones[10]===0 || note%semitones[11]===0 || note%semitones[12]===0
          || note % 440*(Math.pow(2, (1/12)))==0;
}

function Slider({ synth, setSynth }: InstrumentProps): JSX.Element {
  const keys = List([
    { note: 'C', freq: 32.70 },
    { note: 'Db',freq: 34.65 },
    { note: 'D', freq: 36.71 },
    { note: 'Eb',freq: 38.89 },
    { note: 'E', freq: 41.20 },
    { note: 'F', freq: 43.65 },
    { note: 'Gb',freq: 46.25 },
    { note: 'G', freq: 49.00 },
    { note: 'Ab',freq: 51.91 },
    { note: 'A', freq: 27.50 },
    { note: 'Bb',freq: 29.14 },
    { note: 'B', freq: 30.87 },
  ]);

  let currentNote: number = 0;

  function SliderKey({
    note,
    synth,
    index,
  }: SliderKeyProps): JSX.Element {
    console.log("let: "+note as Frequency);
    return (
      // Observations:
      // 1. The JSX refers to the HTML-looking syntax within TypeScript.
      // 2. The JSX will be **transpiled** into the corresponding `React.createElement` library call.
      // 3. The curly braces `{` and `}` should remind you of string interpolation.
      <div
        onMouseEnter={()=>{currentNote = note; synth.setNote(note)}}
        className={classNames('ba pointer absolute dim', {
          'black bg-white h4': checkIfFreqIsSemitone(note),
          'black bg-white h3': !checkIfFreqIsSemitone(note),
        })}
        style={{
          // CSS
          top: 0,
          left: `${index * unitWidth}rem`,
          zIndex: 0,
          width: `${unitWidth}rem`,
          marginLeft: 0,
        }}
      ></div>
    );
  }

  const setOscillator = (newType: Tone.ToneOscillatorType) => {
    setSynth(oldSynth => {
      oldSynth.disconnect();

      return new Tone.Synth({
        oscillator: { type: newType } as Tone.OmniOscillatorOptions,
      }).toDestination();
    });
  };

  const oscillators: List<OscillatorType> = List([
    'sine',
    'sawtooth',
    'square',
    'triangle',
    'fmsine',
    'fmsawtooth',
    'fmtriangle',
    'amsine',
    'amsawtooth',
    'amtriangle',
  ]) as List<OscillatorType>;

  return (
    <div 
    onMouseDown={()=>synth?.triggerAttack(currentNote)} // Question: what is `onMouseDown`?
    onMouseUp={() => synth?.triggerRelease('+0.25')} // Question: what is `onMouseUp`?
    className="pv4">
      <div className="relative dib h4 w-100 ml4">
        {Range(16.35, 3520).map(freq => { //Number of semitones in 7 octaves
          //console.log("F: "+Math.pow(2,freq/12));//debug output
          return (
            <SliderKey
              note={freq}
              synth={synth}
              index={freq-17}
            />
          );
        })}
      </div>
      <div className={'pl4 pt4 flex'}>
        {oscillators.map(o => (
          <SliderType
            key={o}
            title={o}
            onClick={() => setOscillator(o)}
            active={synth?.oscillator.type === o}
          />
        ))}
      </div>
    </div>
  );
}

export const SliderInstrument = new Instrument('Slider', Slider);
