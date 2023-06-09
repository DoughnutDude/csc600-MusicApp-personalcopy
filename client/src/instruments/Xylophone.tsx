// 3rd party library imports
import * as Tone from 'tone';
import classNames from 'classnames';
import { List, Range } from 'immutable';
import React,{useEffect, useState} from 'react';

// project imports
import { Instrument, InstrumentProps } from '../Instruments';

/** ------------------------------------------------------------------------ **
 * Contains implementation of components for Xylophone.
 ** ------------------------------------------------------------------------ */

 interface XyloPhoneKeyProps {
    note: string; // C, Db, D, Eb, E, F, Gb, G, Ab, A, Bb, B
    duration?: string;
    synth?: any; // Contains library code for making sound
    minor?: boolean; // True if minor key, false if major key
    octave: number;
    index: number; // octave + index together give a location for the piano key
    order: number;
  }

  const helper = (num: number) => {
    if (num > 16) {
      return (num -2.5)
    }
    else if (num > 13) {
      return (num -2)
    }
    else if (num > 9) {
      return (num - 1.5)
    }
    else if (num > 6) {
      return (num - 1);
    } else if (num > 2) {
      return (num - .5)
    }
    else return num;
  }

  function playsound(synth: any, note: string, duration: string) {
    const frequency = Tone.Frequency(note).toFrequency();
    synth.frequency.value = frequency;
    synth.triggerAttackRelease(note, duration);
  }
  
  export function XyloPhoneKey({
    note,
    synth,
    //minor,
    index,
   // order,
  }: XyloPhoneKeyProps): JSX.Element {
    /**
     * This React component corresponds to either a major or minor key in the piano.
     * See `PianoKeyWithoutJSX` for the React component without JSX.
     */
    console.log(`index: `,index);
    return (
      // Observations:
      // 1. The JSX refers to the HTML-looking syntax within TypeScript.
      // 2. The JSX will be **transpiled** into the corresponding `React.createElement` library call.
      // 3. The curly braces `{` and `}` should remind you of string interpolation.
      <div
        //onMouseDown={() => synth?.triggerAttack(`${note}`)} // Question: what is `onMouseDown`?
        onMouseDown={()=> synth && playsound(synth, note, '0.25')}
        onMouseUp={() => synth?.triggerRelease('+0.25')} // Question: what is `onMouseUp`?
        className={classNames('ba pointer absolute dim', {
          'bg-black black h3': false, // minor keys are black
          'black bg-gray h4': true, // major keys are white
        })}
        style={{
          // CSS
          top: 0,
          left: `${helper(index)*3}rem`,
          zIndex: 0,
          width: '1.25rem',
          marginLeft:  '10px',
          marginRight: '10px',
          height: `${10-(index*0.2)}rem`,
        }}
      ></div>
    );
  }
  
  // eslint-disable-next-line
  function XyloPhoneWithoutJSX({
    note,
    synth,
    //minor,
    index,
  }: XyloPhoneKeyProps): JSX.Element {
    /**
     * This React component for pedagogical purposes.
     * See `PianoKey` for the React component with JSX (JavaScript XML).
     */
    return React.createElement(
      'div',
      {
        onMouseDown: () => synth?.triggerAttack(`${note}`),
        onMouseUp: () => synth?.triggerRelease('+0.25'),
        className: classNames('ba pointer absolute dim', {
          'bg-black black h3': false,
          'black bg-white h4': true,
        }),
        style: {
          top: 0,
          left: `${index*2}rem`,
          zIndex:  0,
          width: '1rem',
          marginLeft: 0,
        },
      },
      [],
    );
  }
  
  function XyloPhoneType({ title, onClick, active }: any): JSX.Element {
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


function Xylophone({ synth, setSynth }: InstrumentProps): JSX.Element {

  //const [mySynth, mySetSynth] = useState({})

//let mySynth = JSON.parse(JSON.stringify(synth))
//let mySetSynth = JSON.parse(JSON.stringify(setSynth))

    const keys = List([
        { note: 'C', idx: 0 },
        { note: 'Db', idx: 0.5 },
        { note: 'D', idx: 1 },
        { note: 'Eb', idx: 1.5 },
        { note: 'E', idx: 2 },
        //{ note: 'E', idx: 2.5 },
        { note: 'F', idx: 3 },
        { note: 'Gb', idx: 3.5 },
        { note: 'G', idx: 4 },
        { note: 'Ab', idx: 4.5 },
        { note: 'A', idx: 5 },
        { note: 'Bb', idx: 5.5 },
        { note: 'B', idx: 6 },
      ]);
    
      const setOscillator = () => {
        setSynth(oldSynth => {
          //oldSynth.disconnect();
    
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
    
       useEffect(() =>{
         setOscillator();
       }, [])

      return (
        <div className="pv4" style= {{}}>
          <div className="relative dib h4 w-100 ml4">
            {Range(2, 5).map(octave =>
              keys.map((key, idx) => {
                const isMinor = key.note.indexOf('b') !== -1;
                const note = `${key.note}${octave}`;
                return (
                  <XyloPhoneKey
                    key={note} //react key
                    note={note}
                    synth={synth}
                    minor={isMinor}
                    octave={octave}
                    index={(octave - 2) * 7 + key.idx}
                    order={idx}
                  />
                );
              }),
            )}
          </div>
          <div className={'pl4 pt4 flex'}>
            {oscillators.map(o => (
              <XyloPhoneType
                key={o}
                title={o}
                //onClick={() => setOscillator(o)}
                //active={synth?.oscillator.type === o}
              />
            ))}
          </div>
        </div>
      );

}


export const XylophoneInstrument = new Instrument('Xylophone',Xylophone);