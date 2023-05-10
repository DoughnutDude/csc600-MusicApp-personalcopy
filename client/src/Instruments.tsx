// 3rd party library imports
import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';

// project imports
import { DispatchAction } from './Reducer';
import { AppState } from './State';

/** ------------------------------------------------------------------------ **
 * Contains base implementation of an Instrument.
 ** ------------------------------------------------------------------------ */

export interface InstrumentProps {
  state: AppState;
  dispatch: React.Dispatch<DispatchAction>;
  name: string;
  synth: Tone.Synth;
  setSynth: (f: (oldSynth: Tone.Synth) => Tone.Synth) => void;
}

export class Instrument {
  public readonly name: string;
  public readonly component: React.FC<InstrumentProps>;

  constructor(name: string, component: React.FC<InstrumentProps>) {
    this.name = name;
    this.component = component;
  }
}

function TopNav({ name }: { name: string }) {
  return (
    <div
      className={
        'w-100 h3 bb b--light-gray flex justify-between items-center ph4'
      }
    >
      <div>{name}</div>
    </div>
  );
}

interface InstrumentContainerProps {
  state: AppState;
  dispatch: React.Dispatch<DispatchAction>;
  instrument: Instrument;
}

export const InstrumentContainer: React.FC<InstrumentContainerProps> = ({
  instrument,
  state,
  dispatch,
}: InstrumentContainerProps) => {
  const InstrumentComponent = instrument.component;
  const [synth, setSynth] = useState(
    new Tone.Synth({
      oscillator: { type: 'sine' } as Tone.OmniOscillatorOptions,
    }).toDestination(),
  );

  const notes = state.get('notes');

  useEffect(() => {
    if (notes && synth) {
      let eachNote = notes.split(' ');
      let noteObjs = eachNote.map((note: string, idx: number) => ({
        idx,
        time: `+${idx / 4}`,
        note,
        velocity: 1,
      }));

      new Tone.Part((time, value) => {
        // the value is an object which contains both the note and the velocity
        synth.triggerAttackRelease(value.note, '4n', time, value.velocity);
        if (value.idx === eachNote.length - 1) {
          dispatch(new DispatchAction('STOP_SONG'));
        }
      }, noteObjs).start(0);

      Tone.Transport.start();

      return () => {
        Tone.Transport.cancel();
      };
    }

    return () => {};
  }, [notes, synth, dispatch]);

  useEffect(()=> {
    console.log('state changed to')
    console.log(state.get('instrument')?.name)


    if (state.get('instrument')?.name === 'Organs') {
      setSynth((oldSynth: any) => {
        oldSynth.disconnect();
  
        return new Tone.PolySynth(Tone.FMSynth, {
          oscillator: { type: 'sine' } as Tone.OmniOscillatorOptions,
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
    } else {
      setSynth(oldSynth => {
        oldSynth.disconnect();
  
        return new Tone.Synth({
          oscillator: { type: 'sine' } as Tone.OmniOscillatorOptions,
        }).toDestination();
      });
    }

    // this should resolve the playlist bug.
    /* playlist was changing the state and triggering this useEffect, 
    so I made the param more specific */
    
  }, [state.get('instrument')?.name])



  /* this will simulate a wait() so that non-compatible synths are not passed 
  into InstrumentComponent */

  if (!synth.oscillator && state.get('instrument')?.name !== 'Organs' ||
  !synth.get().oscillator && state.get('instrument')?.name === "Organs") {
    return <div>Loading...</div>
  }

  return (
    <div>
      <TopNav name={instrument.name} />
      <div
        className={'bg-white absolute right-0 left-0'}
        style={{ top: '4rem' }}
      >
        <InstrumentComponent
          name={instrument.name}
          state={state}
          dispatch={dispatch}
          synth={synth}
          setSynth={setSynth}
        />
      </div>
    </div>
  );
};
