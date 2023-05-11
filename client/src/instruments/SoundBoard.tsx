// 3rd party library imports
import * as Tone from 'tone';
import classNames from 'classnames';
import { List } from 'immutable';
import { useEffect, useState} from 'react';

// project imports
import { Instrument, InstrumentProps } from '../Instruments';

/** ------------------------------------------------------------------------ **
 * Contains implementation of components for Piano.
 ** ------------------------------------------------------------------------ */

interface SoundButtonProps {
  note: string; // e.g. C1, D#2, Gb3, etc.
  synth?: Tone.Synth;
}

export function SoundButton({
  note,
  synth,
}: SoundButtonProps): JSX.Element {
  const [isPlaying, setIsPlaying] = useState(false);

  const playNote = (repeatCount: number) => {
    setIsPlaying(true);
    if (synth) {
      synth.triggerAttackRelease(note, "8n");
      setTimeout(() => {
        if (repeatCount > 1) {
          playNote(repeatCount - 1);
        } else {
          setIsPlaying(false);
        }
      }, 500); // Adjust the duration between repeats (in milliseconds)
    }
  };

  const stopNote = () => {
    setTimeout(() => {
      if (!isPlaying && synth) {
        synth.triggerRelease();
      }
    }, 0);
  };

  useEffect(() => {
    const handleMouseLeave = () => {
      setTimeout(() => {
        if (!isPlaying && synth) {
          synth.triggerRelease();
        }
      }, 0);
    };

    return () => {
      handleMouseLeave();
    };
  }, [isPlaying, note, synth]);

  return (
    <button
      onMouseDown={() => playNote(4)} // Repeat the note 4 times
      onMouseUp={stopNote}
      onMouseLeave={stopNote}
      className={classNames({
        playing: isPlaying,
      })}
      style={{
        width: '30px',
        height: '30px',
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

function SoundBoard({ synth, setSynth}: InstrumentProps): JSX.Element {

  

  const keys = ['C', 'D', 'E', 'G'];
  const octaves = [4, 3, 2, 1];
  const grid = Array.from({ length: octaves.length }, () => new Array(keys.length).fill(false));


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

  const setOscillator = (newType: Tone.ToneOscillatorType) => {
    console.log(newType);

    setSynth((oldSynth: any) => {
      oldSynth.disconnect();

      return new Tone.MembraneSynth({
        oscillator: { type: newType } as Tone.OmniOscillatorOptions,
      }).toDestination() as any;
    });
  };

  useEffect(() => {
    setOscillator('square');
  }, []); 

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
            active={synth && synth.get().oscillator.type === o}
          />
        ))}
      </div>
    </div>
  );
}

export const SoundBoardInstrument = new Instrument('SoundBoard', SoundBoard);