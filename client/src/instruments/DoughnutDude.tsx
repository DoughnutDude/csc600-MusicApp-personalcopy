// 3rd party library imports
import * as Tone from 'tone';
import classNames from 'classnames';
import { List, Range } from 'immutable';
import React, { FormEvent } from 'react';

// project imports
import { Instrument, InstrumentProps } from '../Instruments';
import { Frequency } from 'tone/build/esm/core/type/Units';

/** ------------------------------------------------------------------------ **
 * Contains implementation of components for Slider.
 ** ------------------------------------------------------------------------ */

function noteToFreq(k: number) {
  return 440*(Math.pow(2, (k/12)));
}

interface SliderKeyProps {
  note: string;
  duration?: string;
  synth: Tone.Synth;
  minor: boolean,
  octave: number,
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

function Slider({ synth, setSynth }: InstrumentProps): JSX.Element {
  const setOscillator = (newType: Tone.ToneOscillatorType) => {
    setSynth(oldSynth => {
      oldSynth.disconnect();

      console.log("osci changing");//debug output
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

  const keys = List([
    { note: 'C', idx: 0 },
    { note: 'Db', idx: 0.5 },
    { note: 'D', idx: 1 },
    { note: 'Eb', idx: 1.5 },
    { note: 'E', idx: 2 },
    { note: 'F', idx: 3 },
    { note: 'Gb', idx: 3.5 },
    { note: 'G', idx: 4 },
    { note: 'Ab', idx: 4.5 },
    { note: 'A', idx: 5 },
    { note: 'Bb', idx: 5.5 },
    { note: 'B', idx: 6 },
  ]);

  const [currentNote, setCurrentNote] = React.useState({freq: 0, vol: 0});
  // const tremolo = new Tone.Tremolo(currentNote.freq, 0);//avoid creating stuff inside the React element functions.

  function setNoteByCoords(event: any) {
    const rect = (event.target as HTMLDivElement).getBoundingClientRect();
    setCurrentNote({
      freq: event.clientX - rect.left + 65, //C_2 ~= 65Hz
      vol: parseInt((-1/12*(event.clientY - rect.top - rect.height/2)).toPrecision(2)),
    });
    synth.volume.value = currentNote.vol;
    synth.setNote(currentNote.freq);
    // console.log("coords: ",currentNote.freq, "   ",currentNote.vol,"   abs: ",rect.left
    // +"   ",rect.top);//debug output
    event.stopPropagation();
  }

  function SliderKey({
    note,
    synth,
    minor,
    octave,
    index,
  }: SliderKeyProps): JSX.Element {
    //console.log(`${index}`);//debug output
    return (
      <div
      // onMouseEnter={(event) => {
      //   synth?.triggerAttack(300);
      //   event.stopPropagation();
      // }}
        className={classNames('absolute h4', {
          'bg-black black': minor, // minor keys are black
          'white bg-white': !minor, // major keys are white
        })}
        style={{
          // CSS
          top: 0,
          left: index-65,
          // zIndex: -1,
          width: '1px',
          pointerEvents: 'none',
        }}
      ></div>
    );
  }

  return (
    <div 
    className="pv4">
      <div className={classNames("relative dib h4 w-100 ml4 black bg-gray ba")}
        onMouseDown={()=> synth?.triggerAttack(currentNote.freq)}
        onMouseUp={() => synth?.triggerRelease('+0.25')}
        onMouseMove={setNoteByCoords}
        style={{
          // CSS
          margin: 0,
        }}
      >
      {Range(-4, 12).map(octave =>
        keys.map(key => {
          const isMinor = key.note.indexOf('b') !== -1;
          const note = `${key.note}${octave}`;
          //console.log(`bepis ${note}`);//debug output
          return (
            <SliderKey
              key={note} //react key
              note={note}
              synth={synth}
              minor={isMinor}
              octave={octave}
              index={Math.round(noteToFreq(octave*12 + keys.indexOf(key)))}
            />
          );
        }),
      )}
      </div>
      <div className={'pl4 pt4 flex'}>
        <div>Frequency: {currentNote.freq.toString().padStart(5,'0')}Hz</div>, <div>Volume: {currentNote.vol}dB</div>
      </div>

      {/* <div className={'pl4 pt4 flex'}>
        <label htmlFor="detune">Detune</label>
        <input name="detune" type='range'
        onInput={(event) => {
          const input = parseInt((event.target as HTMLInputElement).value);
          console.log("detune: ",input);//debug output
          synth.set({
            detune: input,
          });
        }}
        style={{
          width: '20rem',
          backgroundColor: 'darkgray',
          borderRadius: '5px',
          borderColor: 'tan',
        }}></input>
      </div> */}

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

/*
//OLD prototype v1
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
}*/

export const SliderInstrument = new Instrument('Slider', Slider);
