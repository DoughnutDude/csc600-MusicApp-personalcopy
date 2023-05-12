// 3rd party library imports
import * as Tone from 'tone';
import classNames from 'classnames';
import { List, Range } from 'immutable';
import React, { useEffect, FormEvent } from 'react';

// project imports
import { Instrument, InstrumentProps } from '../Instruments';
import { Frequency } from 'tone/build/esm/core/type/Units';
import { constants } from 'crypto';
import { DispatchAction } from '../Reducer';

/** ------------------------------------------------------------------------ **
 * Contains implementation of components for Slider.
 ** ------------------------------------------------------------------------ */
const effects: Tone.InputNode[] = [
  new Tone.Vibrato(4, .5,).toDestination(),
  new Tone.Tremolo(7, 0.9).toDestination().start(),
  new Tone.Reverb().toDestination(),
]
const vibratoIndex  = 0;
const tremoloIndex = 1;
const reverbIndex = 2;

const styles = ['gray b--light-gray','b--black black'];

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

function OscillatorType({ title, onClick, active }: any): JSX.Element {
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

function EffectButton({ title, effectID, statuses, setStatuses, clickHandler }: any): JSX.Element {
  return (
    <div>
    <label
      onClick={()=>{
        statuses.active[effectID] = clickHandler(statuses.active[effectID]);
        setStatuses({active: statuses.active});
      }}
      className={classNames('dim pointer ph2 pv1 ba mr2 br1 fw7 bw1', styles[+ statuses.active[effectID]])}
    >
      {title}
    </label>
    </div>
  );
}

function EffectRangeInput({ title, effectID, statuses, setStatuses, clickHandler, update, min, max, defaultValue }: any): JSX.Element {
  const [effectValue, setEffectValue] = React.useState({input: defaultValue});
  return (
    <div>
    <label htmlFor={title}
      onClick={()=>{
        //console.log("input",effectValue.input,"active:",+ statuses.active[effectID]);//debug output
        statuses.active[effectID] = clickHandler(statuses.active[effectID], effectValue.input);
        setStatuses({active: statuses.active});
      }}
      className={classNames('dim pointer ph2 pv1 ba mr2 br1 fw7 bw1', styles[+ statuses.active[effectID]])}
    >
      {title}
    </label>
    <input name={title} type='range' min={min} max={max} defaultValue={defaultValue}
    onInput={(event) => {
      setEffectValue({input: parseInt((event.target as HTMLInputElement).value)});
      //console.log("input: ",effectValue.input);//debug output
      update(statuses.active[effectID], effectValue.input);
    }}
    style={{
      width: '10rem',
      backgroundColor: 'darkgray',
      borderRadius: '5px',
      borderColor: 'tan',
    }}></input>
    </div>
  );
}

function Slider({ synth, setSynth }: InstrumentProps): JSX.Element {
  const effectInitialStates: boolean[] = [];
  //Loop for effects + 1 because detuner isn't technically an effect,
  // but it still needs a state to determine if it's active or not.
  for (let i: number = 0; i < effects.length+1; i++) {
    effectInitialStates.push(false);
  }
  const [statuses, setStatuses] = React.useState({active: effectInitialStates});

  const setOscillator = (newType: Tone.ToneOscillatorType) => {
    setSynth(oldSynth => {
      oldSynth.disconnect();

      //console.log("clearing effects");//debug output
      for (let i in effects) {
        //reset to initial states when switching oscillators
        setStatuses({active: effectInitialStates});
        synth.dispose();
      }
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

  useEffect(() => {
    setOscillator('sine');
  }, []); 
  
  const keys = List([
    { note: 'C' },
    { note: 'Db' },
    { note: 'D' },
    { note: 'Eb' },
    { note: 'E' },
    { note: 'F' },
    { note: 'Gb' },
    { note: 'G' },
    { note: 'Ab' },
    { note: 'A' },
    { note: 'Bb' },
    { note: 'B' },
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
          'bg-black black': minor, // frequencies that match minor keys are black
          'white bg-white': !minor, // frequencies that match major keys are white
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
        <div>
          <EffectButton
            title={"Vibrato"}
            effectID={vibratoIndex}
            statuses={statuses}
            setStatuses={setStatuses}
            clickHandler={(isActive: boolean)=>{
              if (!isActive) {
                synth.connect(effects[vibratoIndex]);
              } else {
                synth.disconnect(effects[vibratoIndex]);
              }
              return !isActive;
            }}
          />
        </div>

        <div>
          <EffectButton
            title={"Tremolo"}
            effectID={tremoloIndex}
            statuses={statuses}
            setStatuses={setStatuses}
            clickHandler={(isActive: boolean)=>{
              if (!isActive) {
                synth.connect(effects[tremoloIndex]);
              } else {
                synth.disconnect(effects[tremoloIndex]);
              }
              return !isActive;
            }}
          />
        </div>
        
        <div>
          <EffectRangeInput
            title={"Reverb"}
            effectID={reverbIndex}
            statuses={statuses}
            setStatuses={setStatuses}
            clickHandler={(isActive: boolean)=>{
              if (!isActive) {
                synth.connect(effects[reverbIndex]);
              } else {
                synth.disconnect(effects[reverbIndex]);
              }
              return !isActive;
            }}
            update={(isActive: boolean, input: number)=>{
              if (isActive) {
                (effects[reverbIndex] as Tone.Reverb).decay = input/10;
              }
            }}
            min='1'
            max='100'
            defaultValue='10'
          />
        </div>
        
        <div>
          <EffectRangeInput
            title={"Detuner"}
            effectID={effects.length}
            statuses={statuses}
            setStatuses={setStatuses}
            clickHandler={(isActive: boolean, input: number)=>{
              //console.log("toggling detuneactive:", isActive);//debug output
              if (!isActive) {
                synth.set({
                  detune: input,
                });
              } else {
                synth.set({
                  detune: 0,
                });
              }
              //console.log(synth.detune.value);//debug output
              return !isActive;
            }}
            update={(isActive: boolean, input:number)=>{
              if (isActive) {
                synth.set({
                  detune: input,
                });
              }
            }}
            min='-30'
            max='30'
            defaultValue='0'
          />
        </div>

        <div>Frequency: {currentNote.freq.toString().padStart(5,'0')}Hz</div>,
        <div>Volume: {currentNote.vol >= 0 ? '+'+currentNote.vol : currentNote.vol}dB</div>
      </div>

      <div className={'pl4 pt4 flex'}>
        {oscillators.map(o => (
          <OscillatorType
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
