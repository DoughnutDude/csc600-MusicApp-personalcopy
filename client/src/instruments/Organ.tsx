// 3rd party library imports
import * as Tone from 'tone';
import classNames from 'classnames';
import { List, Range } from 'immutable';

// project imports
import { Instrument, InstrumentProps } from '../Instruments';
import React, {useEffect, useState} from 'react'

/** ------------------------------------------------------------------------ **
 * Contains implementation of components for Organs.
 ** ------------------------------------------------------------------------ */

interface OrgansKeyProps {
  note: string; // C, Db, D, Eb, E, F, Gb, G, Ab, A, Bb, B
  duration?: string;
  synth?: any; // Contains library code for making sound
  minor?: boolean; // True if minor key, false if major key
  octave: number;
  index: number; // octave + index together give a location for the Guitar key
}


export function OrgansKey({
  note,
  synth,
  minor,
  index,
}: OrgansKeyProps): JSX.Element {
  /**
   * This React component corresponds to either a major or minor key in the Organs.
   * See `OrgansKeyWithoutJSX` for the React component without JSX.
   */
  return (
    // Observations:
    // 1. The JSX refers to the HTML-looking syntax within TypeScript.
    // 2. The JSX will be **transpiled** into the corresponding `React.createElement` library call.
    // 3. The curly braces `{` and `}` should remind you of string interpolation.
    <div
      onMouseDown={() => synth?.triggerAttack(`${note}`)}
      // onMouseUp={() => {synth?.triggerRelease('now')}} // Question: what is `onMouseUp`?
      onMouseUp={() => {console.log('onMouseUp triggered', note);
      setTimeout(() => {
        synth?.triggerRelease(note)
      }, 500);
    }}
      onMouseLeave={() => {console.log('onMouseUp triggered', note);
      setTimeout(() => {
        synth?.triggerRelease(note)
      }, 500);
    }}
      className={classNames('ba pointer absolute dim', {
        'bg-black black h3': minor, // minor keys are black
        'black bg-white h4': !minor, // major keys are white
      })}
      style={{
        // CSS
        top: 0,
        left: `${index * 2}rem`,
        zIndex: minor ? 1 : 0,
        width: minor ? '1.5rem' : '2rem',
        height: !minor ? '10rem': '6.75rem',
        marginLeft: minor ? '0.25rem' : 0,
        backgroundColor: !minor ? '#c19a6b' : '',
        borderRadius:'5px',
      }}
    ></div>
  );
}

function OrgansType({ title, onClick, active }: any): JSX.Element {
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

function Organs({ synth, setSynth }: InstrumentProps): JSX.Element {

  // const [mySynth, mySetSynth] = useState(new Tone.PolySynth(Tone.FMSynth, {
  //   oscillator: { type: 'sine' } as Tone.OmniOscillatorOptions,
  //   modulationIndex: 10,
  //   envelope: {
  //     attack: 0.05,
  //     decay: 0.3,
  //     sustain: 0.9,
  //     release: 1,
  //   },
  //   modulation: { type: 'sawtooth' },
  //   modulationEnvelope: {
  //     attack: 0.5,
  //     decay: 0.1,
  //     sustain: 1,
  //     release: 0.5,
  //   },
  // }).toDestination() as any)

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
  const setOscillator = (newType: Tone.ToneOscillatorType) => {
    console.log(newType);

    setSynth((oldSynth: any) => {
      oldSynth.disconnect();

      return new Tone.PolySynth(Tone.FMSynth, {
        oscillator: { type: newType } as Tone.OmniOscillatorOptions,
        modulationIndex: 10,
        envelope: {
          attack: 0.05,
          decay: 0.3,
          sustain: 0.9,
          release: 1,
        },
        modulation: { type: 'sawtooth' },
        modulationEnvelope: {
          attack: 0.5,
          decay: 0.1,
          sustain: 1,
          release: 0.5,
        },
      }).toDestination() as any;
    });
  };

  const oscillators: List<OscillatorType> = List([
    'sine',
    'sawtooth',
    'square',
    'triangle',
    'amsine',
    'amsawtooth',
    'amtriangle',
  ]) as List<OscillatorType>;

  return (
    <div className="pv4">
        <div className="relative dib h4 w-100 ml4">
        {Range(2, 6).map(octave =>
          keys.map(key => {
            const isMinor = key.note.indexOf('b') !== -1;
            const note = `${key.note}${octave}`;
            return (
              <OrgansKey
                key={note} //react key
                note={note}
                synth={synth}
                minor={isMinor}
                octave={octave}
                index={(octave - 2) * 7 + key.idx}
              />
            );
          }),
        )}
      </div>
      <div className={'pl4 pt4 flex'} style={{marginTop:'30px'}}>
        {oscillators.map(o => (
          <OrgansType
            key={o}
            title={o}
            onClick={() => setOscillator(o)}
            active={synth?.get().oscillator.type === o}
          />
        ))}
      </div>
    </div>
  );
}

export const OrgansInstrument = new Instrument('Organs', Organs);
