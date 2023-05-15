// 3rd party library imports
import * as Tone from "tone";
import classNames from "classnames";
import { List } from "immutable";
import { useEffect, useState } from "react";

// project imports
import { Instrument, InstrumentProps } from "../Instruments";

/** ------------------------------------------------------------------------ **
 * Contains implementation of components for a SoundBoard
 ** ------------------------------------------------------------------------ */

interface SoundButtonProps {
  note: string;
  synth?: Tone.Synth;
}
export function SoundButton({ note, synth }: SoundButtonProps): JSX.Element {
  const [isPlaying, setIsPlaying] = useState(false);
  const [repeatCount, setRepeatCount] = useState(0);
  const [buttonColor, setButtonColor] = useState("white");

  const playNote = (count: number) => {
    setIsPlaying(true);
    setRepeatCount(count);
    if (synth) {
      synth.triggerAttackRelease(note, "8n");
      setTimeout(() => {
        if (count > 1) {
          playNote(count - 1);
        } else {
          setIsPlaying(false);
          setRepeatCount(0);
        }
      }, 500);
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

  useEffect(() => {
    if (isPlaying) {
      const colors = [
        "red",
        "blue",
        "green",
        "yellow",
        "pink",
        "orange",
        "purple",
        "white",
      ];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      setButtonColor(randomColor);
    }
  }, [isPlaying]);

  const buttonClassName = isPlaying ? `bg-${buttonColor}` : `bg`;

  return (
    <button
      onMouseDown={() => playNote(4)}
      onMouseUp={stopNote}
      onMouseLeave={stopNote}
      className={buttonClassName}
      style={{
        width: "30px",
        height: "30px",
        borderRadius: "10px",
      }}
    />
  );
}

function ButtonType({ title, onClick, active }: any): JSX.Element {
  return (
    <div
      onClick={onClick}
      className={classNames("dim pointer ph2 pv1 ba mr2 br1 fw7 bw1", {
        "b--black black": active,
        "gray b--light-gray": !active,
      })}
    >
      {title}
    </div>
  );
}

function SoundBoard({ synth, setSynth }: InstrumentProps): JSX.Element {
  const keys = ["A", "B", "C", "D", "E", "F", "G"];
  const octaves = [5, 4, 3, 2, 1];
  const grid = Array.from({ length: octaves.length }, () =>
    new Array(keys.length).fill(false)
  );

  const oscillators: List<OscillatorType> = List([
    "sine",
    "sawtooth",
    "square",
    "triangle",
    "fmsine",
    "fmsawtooth",
    "fmtriangle",
    "amsine",
    "amsawtooth",
    "amtriangle",
  ]) as List<OscillatorType>;

  const setOscillator = (newType: Tone.ToneOscillatorType) => {
    setSynth((oldSynth: any) => {
      oldSynth.disconnect();
      return new Tone.MembraneSynth({
        oscillator: { type: newType } as Tone.OmniOscillatorOptions,
      }).toDestination() as any;
    });
  };

  useEffect(() => {
    setOscillator("square");
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
      <div className={"pl4 pt4 flex"}>
        {oscillators.map((o) => (
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

export const SoundBoardInstrument = new Instrument("SoundBoard", SoundBoard);
