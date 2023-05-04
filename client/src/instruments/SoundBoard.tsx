// 3rd party library imports
import * as Tone from 'tone';
import classNames from 'classnames';
import { List, Range } from 'immutable';
import { useState } from 'react';

// project imports
import { Instrument, InstrumentProps } from '../Instruments';

/** ------------------------------------------------------------------------ **
 * Contains implementation of components for Piano.
 ** ------------------------------------------------------------------------ */

interface SoundButtonProps {
  note: string; // e.g. C1, D#2, Gb3, etc.
  synth?: Tone.Synth;
//  index: number;
}

export function SoundButton({
  note,
  synth,
}: SoundButtonProps): JSX.Element {
  return (
    <button
      onMouseDown={() => synth?.triggerAttack(`${note}`)}
      onMouseUp={() => synth?.triggerRelease('+0.25')}
      //className={'ba pointer absolute dim'}
      style={{
        width: '30px',  // set the width of the button
        height: '30px', // set the height of the button
        borderRadius: '10px',
      }}
    />
  );
}

function ButtonType({ title, onClick, active }: any): JSX.Element {
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

function SoundBoard({ synth, setSynth }: InstrumentProps): JSX.Element {
  const keys = ['C', 'D', 'E', 'G'];
  const octaves = [1, 2, 3, 4];
  const grid = Array.from({ length: octaves.length }, () => new Array(keys.length).fill(false));

  //const synth = new Tone.Synth().toDestination();

  const setOscillator = (newType: Tone.ToneOscillatorType) => {
    setSynth(oldSynth => {
      oldSynth.disconnect();

      const newSynth = new Tone.Synth({
        oscillator: { type: newType } as Tone.OmniOscillatorOptions,
      });

      const distortion = new Tone.Distortion(0.8);
      newSynth.connect(distortion);
      distortion.connect(Tone.Destination);

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
      <div id="sequencer" className="relative dib h4 w-100 ml4">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="grid-row">
            {row.map((note, noteIndex) => (
              <SoundButton
                key={`${rowIndex}-${noteIndex}`}
                note={`${keys[noteIndex]}${octaves[rowIndex]}`}
                synth={synth}
              />
            ))}
          </div>
        ))}
      </div>
      <div className={'pl4 pt4 flex'}>
        {oscillators.map(o => (
          <ButtonType
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

export const SoundBoardInstrument = new Instrument('SoundBoard', SoundBoard);