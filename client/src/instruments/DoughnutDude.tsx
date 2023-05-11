// 3rd party library imports
import * as Tone from 'tone';
import classNames from 'classnames';
import { List, Range } from 'immutable';
import React, { useEffect, FormEvent } from 'react';

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

function EffectRangeInput({ title, clickHandler, update }: any): JSX.Element {
  let input: number = 0;
  const styles = ['b--black black', 'gray b--light-gray'];
  const [status, setStatus] = React.useState({active: false, style: styles[1]});
  return (
    <div>
    <label htmlFor={title}
      onClick={()=>{
        console.log("input",input);//debug output
        setStatus({active: clickHandler(status.active, input), style: styles[+ status.active]});
        console.log(status);
      }}
      className={classNames('dim pointer ph2 pv1 ba mr2 br1 fw7 bw1', status.style)}
    >
      {title}
    </label>
    <input name={title} type='range' min='0' max='60' defaultValue='30'
    onInput={(event) => {
      input = parseInt((event.target as HTMLInputElement).value)-30;
      console.log("input: ",input);//debug output
      update(status.active, input);
    }}
    style={{
      width: '20rem',
      backgroundColor: 'darkgray',
      borderRadius: '5px',
      borderColor: 'tan',
    }}></input>
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

  useEffect(() => {
    setOscillator('sine');
  }, []); 
  
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
          <EffectRangeInput
            title={"Detune"}
            clickHandler={(detuneActive: boolean, input: number)=>{
              console.log("toggling detuneactive:", detuneActive);//debug output
              if (!detuneActive) {
                synth.set({
                  detune: input,
                });
              } else {
                synth.set({
                  detune: 0,
                });
              }
              return !detuneActive;
            }}
            update={(detuneActive: boolean, input:number)=>{
              if (detuneActive) {
                synth.set({
                  detune: input,
                });
              }
              console.log("detune:",synth?.detune.value);//debug output
            }}
          />
        </div>
        <div>Frequency: {currentNote.freq.toString().padStart(5,'0')}Hz</div>,
        <div>Volume: {currentNote.vol >= 0 ? '+'+currentNote.vol : currentNote.vol}dB</div>
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
