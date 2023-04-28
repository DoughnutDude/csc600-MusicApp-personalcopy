// 3rd party library imports
import * as Tone from 'tone';
import classNames from 'classnames';
import { List, Range } from 'immutable';
import React from 'react';

// project imports
import { Instrument, InstrumentProps } from '../Instruments';

/** ------------------------------------------------------------------------ **
 * Contains implementation of components for Piano.
 ** ------------------------------------------------------------------------ */

interface BassKeyProps {
  note: string; // e.g. C1, D#2, Gb3, etc.
  duration?: string;
  synth?: Tone.Synth;
  minor?: boolean;
  octave: number;
  index: number;
}

export function BassKey({
  note,
  synth,
  minor,
  index,
}: BassKeyProps): JSX.Element {
  const isBlackKey = note.includes('#') || note.includes('b');
  return (
    <div
      onMouseDown={() => synth?.triggerAttack(`${note}`)}
      onMouseUp={() => synth?.triggerRelease('+0.25')}
      className={classNames('ba pointer absolute dim', {
        'bg-black black h3': isBlackKey,
        'black bg-white h4': !isBlackKey,
      })}
      style={{
        top: 0,
        left: `${index * 2}rem`,
        zIndex: isBlackKey ? 1 : 0,
        width: isBlackKey ? '1.5rem' : '2rem',
        marginLeft: isBlackKey ? '0.25rem' : 0,
      }}
    ></div>
  );
}

function BassType({ title, onClick, active }: any): JSX.Element {
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

function Bass({ synth, setSynth }: InstrumentProps): JSX.Element {
  const keys = List([
    { note: 'C', idx: 0, octave: 1 },
    { note: 'Db', idx: 0.5, octave: 1 },
    { note: 'D', idx: 1, octave: 1 },
    { note: 'Eb', idx: 1.5, octave: 1 },
    { note: 'E', idx: 2, octave: 1 },
    { note: 'F', idx: 3, octave: 1 },
    { note: 'Gb', idx: 3.5, octave: 1 },
    { note: 'G', idx: 4, octave: 1 },
    { note: 'Ab', idx: 4.5, octave: 1 },
    { note: 'A', idx: 5, octave: 1 },
    { note: 'Bb', idx: 5.5, octave: 1 },
    { note: 'B', idx: 6, octave: 1 },
  ]);
  


  const setOscillator = (newType: Tone.ToneOscillatorType) => {
    setSynth(oldSynth => {
      oldSynth.disconnect();
  
      const newSynth = new Tone.Synth({
        oscillator: { type: newType } as Tone.OmniOscillatorOptions,
      });

      // Add distortion effect
      const distortion = new Tone.Distortion(0.8);
      newSynth.connect(distortion);

      // Add a peaking EQ band to boost the bass frequencies
      const eq = new Tone.EQ3({
        low: -24,
        mid: 0, // Adjust this to boost or cut the mid-range frequencies
        high: -12,
      });
      distortion.connect(eq);

      // Add amplitude envelope
      const envelope = new Tone.AmplitudeEnvelope({
        attack: 0.1,
        decay: 0.2,
        sustain: 0.5,
        release: 0.8,
      });
      eq.connect(envelope);

      const lowpass = new Tone.Filter({
        type: 'lowpass',
        frequency: 500, // Adjust this to change the cutoff frequency of the filter
      });
      eq.connect(lowpass);
      lowpass.toDestination();

      return newSynth;
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
    <div className="pv4">
      <div className="relative dib h4 w-100 ml4">
        {Range(2, 4).map(octave =>
          keys.map(key => {
            const isMinor = key.note.indexOf('b') !== -1;
            const note = `${key.note}${octave}`;
            return (
              <BassKey
                key={note} //react key
                note={note}
                synth={synth}
                minor={isMinor}
                octave={octave - 1}
                index={(octave - 2) * 7 + key.idx}
              />
            );
          }),
        )}
      </div>
      <div className={'pl4 pt4 flex'}>
        {oscillators.map(o => (
          <BassType
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

export const BassInstrument = new Instrument('Bass', Bass);

