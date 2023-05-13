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
    let result: number = 1/parseInt(duration.slice(0,duration.length-1));
    //console.log(denom);//debug output
    if (duration.includes('t')) { //triplet
      return result/3;
    } else if (duration.includes('.')) {
      let numOfDots: number = duration.length - duration.indexOf('.');
      //console.log(numOfDots);//debug output
      while (numOfDots > 0) {
        result *= 1.5; // for each dot, add a smaller half
        numOfDots--;
      }
      //console.log(total);//debug output
      return result;
    } else {
      return result;
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
      console.log("playbackTime:",playbackTime);//debug output
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
    } else if (state.get('instrument')?.name === "Xylophone") {
      setSynth(oldSynth => {
        oldSynth.disconnect();

        return new Tone.MetalSynth({
            
          envelope:{
            attack: 0.08,
            decay:0.3,
            sustain:1,
            release:0.5,
          },
          harmonicity:5.1,
          modulationIndex:32,
          resonance: 4000,
          octaves:1.5,

          //oscillator: { type: newType } as Tone.OmniOscillatorOptions,
        }).toDestination() as any;
  
      })
    }
    else {
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

  if (!synth.oscillator && state.get('instrument')?.name === 'Piano' ||
  !synth.oscillator && state.get('instrument')?.name === 'SoundBoard' ||
  !synth.oscillator && state.get('instrument')?.name === 'Slider' ||
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
