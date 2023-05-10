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
  const bpm = state.get('bpm');

  //This function takes in the duration component of the note and changes it to be
  // the correct timing subdivision in seconds/fractions of a second.
  function noteDurationToTime(duration: string) {
    let denom: number = parseInt(duration.charAt(0));
    if (duration.includes('t')) { //triplet
      return 1/(denom*3);
    } else if (duration.includes('.')) {
      return 1.5/denom;
    } else {
      return 1/denom;
    }
  }

  useEffect(() => {
    const notes = state.get('notes');
    if (notes && synth) {
      let playbackTime = 0;
      let eachNote = notes.split(' ');
      for (let i: number = 0; i < eachNote.length; i++) {
        eachNote[i] = eachNote[i].split('/'); //split each note to get pitch and duration
      }
      console.log("eachNote",JSON.stringify(eachNote));//debug output

      let noteObjs = eachNote.map((note: string, idx: number) => {
        let result = {
        idx,
        time: `+${playbackTime*120/bpm}`,
        duration: note[1],
        note: note[0],
        velocity: 1,
      }
      playbackTime += noteDurationToTime(note[1]);
      //console.log("playbackTime:",playbackTime);//debug output
      return result;
    });

      new Tone.Part((time, value) => {
        // the value is an object which contains both the note and the velocity
        synth.triggerAttackRelease(value.note, value.duration, time, value.velocity);
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
