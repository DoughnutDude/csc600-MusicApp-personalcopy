// 3rd party
import { List, Map } from 'immutable';

// project dependencies
import { PianoInstrument } from './instruments/Piano';
import { SoundBoardInstrument } from './instruments/SoundBoard';
import { SliderInstrument } from './instruments/DoughnutDude';
import {XylophoneInstrument} from './instruments/Xylophone';
import { WaveformVisualizer } from './visualizers/Waveform';
import { SpiralVisualizer } from './visualizers/Spiral';
import { PulsingCircle } from './visualizers/DoughnutDude';
import { MyVisualizer } from './visualizers/MyVisualizer';
import { OrgansInstrument } from './instruments/Organ';
import { KilianKistenbroker } from './visualizers/KilianKistenbroker';


/** ------------------------------------------------------------------------ **
 * The entire application state is stored in AppState.
 ** ------------------------------------------------------------------------ */
export type AppState = Map<string, any>;           // similar to { [id: string]: any }

/**
 * Start with the default piano instrument.
 * Add your instruments to this list.
 */
const instruments = List([PianoInstrument, OrgansInstrument, SoundBoardInstrument, SliderInstrument,XylophoneInstrument]);       // similar to Instrument[]

/**
 * Start with the default waveform visualizer.
 * Add your visualizers to this list.
 */
const visualizers = List([WaveformVisualizer, KilianKistenbroker, SpiralVisualizer, PulsingCircle,MyVisualizer]);    // similar to Visualizer[]


/**
 * The default application state contains a list of instruments and a list of visualizers.
 *
 * 'instrument': List<Instrument>
 * 'visualizer': List<Visualizer>
 */
export const defaultState: AppState = Map<string, any>({
  'instruments': instruments,
  'visualizers': visualizers,
});