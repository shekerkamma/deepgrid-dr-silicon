import type {Clip} from './evidence-clip';

/** Source data for /applications, told as a story (docs/applications-story.md).
 *
 *  The spine is the playbook public/downloads/docs/deepgrid-dg32-ai-30-use-cases.pdf; page numbers
 *  below are its own. Each film moment is one whole slide segment from app/data/*-film.json, so a
 *  clip starts and stops where the narrated film changes slide, and its poster is the slide on screen.
 *  scripts/check-clips.mjs checks every `saying` against the caption file over that range.
 */

// The clips must stay in this exact shape (two-space keys, one field per line) for
// scripts/check-clips.mjs to parse them.
export const clips: Record<string, Clip> = {
  'why': {
    deck: 'DG32-LITE architecture',
    film: '/media/dg32-lite-architecture.mp4',
    captions: '/media/dg32-lite-architecture.vtt',
    poster: '/decks/dg32-lite/slide-03.webp', start: 61.36, duration: 30.52, slide: 3,
    shows: 'A silent CPU fault can destroy a power bridge.',
    saying: 'Why build it this way? A motor drive switches power transistors thousands of times a second. If the CPU silently computes a wrong value, it writes a wrong PWM edge, and a wrong edge can short a bridge leg. Entry-level motor MCUs catch faults with watchdogs and periodic software self-test. Hardware lockstep has lived in automotive parts such as AURIX, S32K and Hercules.',
  },
  'budget': {
    deck: 'DG32-LITE architecture',
    film: '/media/dg32-lite-architecture.mp4',
    captions: '/media/dg32-lite-architecture.vtt',
    poster: '/decks/dg32-lite/slide-09.webp', start: 239.68, duration: 51.14, slide: 9,
    shows: 'One current loop costs about 300 hardware cycles, at every loop rate.',
    saying: 'Here is what one loop costs. The current sample takes one hundred seventy-seven cycles. Each CORDIC operation takes fifty-three to fifty-eight. The regulators cost about eight cycles per instruction. Together the hardware part is about three hundred cycles, and it is the same at every loop rate. At twenty kilohertz, that is twelve percent of the period. So the question becomes how much firmware fits. At ten kilohertz there are about forty-seven hundred cycles left: enough for a full current and speed loop with an observer. At twenty kilohertz, twenty-two hundred, enough for field-weakening. At fifty kilohertz, seven hundred, an inner current loop only. The simulated ceiling is about one hundred kilohertz.',
  },
  'analog': {
    deck: 'DG32-LITE architecture',
    film: '/media/dg32-lite-architecture.mp4',
    captions: '/media/dg32-lite-architecture.vtt',
    poster: '/decks/dg32-lite/slide-14.webp', start: 373.17, duration: 28.24, slide: 14,
    shows: 'DG32 leads on safety and trails on analog.',
    saying: 'Against the STM32G0, the entry-level incumbent, the comparison is honest. DG32 leads on hardware lockstep, native DShot, hardware CORDIC and the on-chip AI variant, with an open RISC-V core. The G0 leads clearly on its twelve-bit multi-channel ADC, embedded flash, USB and CAN-FD, and on production maturity.',
  },
  'engine': {
    deck: 'DG32-2DOM architecture',
    film: '/media/dg32-2dom-architecture.mp4',
    captions: '/media/dg32-2dom-architecture.vtt',
    poster: '/decks/dg32-2dom/slide-01.webp', start: 0, duration: 29.73, slide: 1,
    shows: 'Condition monitoring on the motor-control chip.',
    saying: 'DG32-2DOM is the attention variant of Deepgrid Semi\'s DG32-LITE motor-control chip. It keeps the dual-core lockstep controller and adds an INT8 attention engine on its own clock, so a drive can watch its own motor for faults. The design is complete and in physical trials. Every figure here is a post-route, simulated or analytic value, and each one is labelled.',
  },
  'bearing': {
    deck: 'DG32-2DOM architecture',
    film: '/media/dg32-2dom-architecture.mp4',
    captions: '/media/dg32-2dom-architecture.vtt',
    poster: '/decks/dg32-2dom/slide-12.webp', start: 316.54, duration: 32.37, slide: 12,
    shows: 'The engine targets bearing faults in the drive.',
    saying: 'What is it for? Catching a wearing bearing, or a drive that starts behaving oddly, without an extra processor on the board, because the motor controller watches its own motor. The STM32G0 can only run that kind of model in software, so a hardware engine sets DG32-2DOM apart. On the roadmap it runs alongside DG32-LITE\'s first silicon, with its design finished and undergoing physical trials.',
  },
  'trip': {
    deck: 'DG32-LITE architecture',
    film: '/media/dg32-lite-architecture.mp4',
    captions: '/media/dg32-lite-architecture.vtt',
    poster: '/decks/dg32-lite/slide-06.webp', start: 153.43, duration: 25.40, slide: 6,
    shows: 'Two cores must agree on every committed store.',
    saying: 'This is the safety core. MAIN runs the application. CHECKER runs the same instructions two cycles later, on the same inputs, and the comparator checks every committed store. On a mismatch, the first cause is latched and FAULT_N goes low. Route that pin to the gate-driver enable, and the bridge turns off in hardware, without waiting for firmware.',
  },
  'measured': {
    deck: 'DG32-LITE architecture',
    film: '/media/dg32-lite-architecture.mp4',
    captions: '/media/dg32-lite-architecture.vtt',
    poster: '/decks/dg32-lite/slide-16.webp', start: 433.54, duration: 29.59, slide: 16,
    shows: 'Safety in the core. Control in silicon.',
    saying: 'Three ideas to hold on to. The protection is built into the processor itself, not bolted on in software. The costly parts of motor control are dedicated hardware, so the price of one loop is fixed and known in advance. And the weaknesses are named, with fixes scheduled. None of this has yet been measured on silicon, and no functional-safety certification is claimed; bring-up is where the numbers become real.',
  },
};

/** The nineteen models that fit, from playbook page 5: inference cost only, feature extraction is
 *  costed separately. Names match app/diagnostic-tasks.ts exactly, so the page can count use. */
export const models: {name: string; role: string; cycles: string; inference: string}[] = [
  {name: 'Random forest, 100×d8', role: 'Primary classifier', cycles: '3,200', inference: '0.06 ms'},
  {name: 'Gradient boosting, 200×d4', role: 'Primary classifier', cycles: '3,200', inference: '0.06 ms'},
  {name: 'Isolation forest', role: 'Unlabelled anomaly detection', cycles: '3,200', inference: '0.06 ms'},
  {name: 'LDA', role: 'Primary classifier', cycles: '128', inference: '0.00 ms'},
  {name: 'Logistic regression', role: 'Primary classifier', cycles: '128', inference: '0.00 ms'},
  {name: 'Naive Bayes', role: 'Regime identification', cycles: '512', inference: '0.01 ms'},
  {name: 'PCA + Hotelling T²', role: 'Anomaly detection, the condition-monitoring standard', cycles: '1,024', inference: '0.02 ms'},
  {name: 'Mahalanobis score', role: 'Anomaly score, single scalar', cycles: '4,096', inference: '0.08 ms'},
  {name: 'One-class SVM', role: 'Anomaly detection with a decision boundary', cycles: '12,800', inference: '0.26 ms'},
  {name: 'k-NN, 200 prototypes', role: 'Field-adaptable classifier', cycles: '25,600', inference: '0.51 ms'},
  {name: 'Nearest centroid', role: 'On-device baselining, no backward pass', cycles: '1,024', inference: '0.02 ms'},
  {name: 'Gaussian mixture', role: 'Regime identification', cycles: '2,048', inference: '0.04 ms'},
  {name: 'HMM, 8 state', role: 'Sequence and state tracking', cycles: '3,072', inference: '0.06 ms'},
  {name: 'Extended Kalman filter', role: 'Observer: sensorless FOC, thermal', cycles: '2,400', inference: '0.05 ms'},
  {name: 'MLP 32-16-8-4', role: 'Nonlinear classifier or regressor', cycles: '2,688', inference: '0.05 ms'},
  {name: 'MLP autoencoder', role: 'Unsupervised drift detection', cycles: '22,016', inference: '0.44 ms'},
  {name: 'MLP 128-64-32-8', role: 'Regression at the dense-network ceiling', cycles: '41,984', inference: '0.84 ms'},
  {name: 'GRU, 16 units', role: 'Short sequence modelling', cycles: '147,456', inference: '2.95 ms'},
  {name: '1D-CNN 8/16/32', role: 'Raw-waveform classification', cycles: '512,000', inference: '10.24 ms'},
];

/** The four families, in playbook order (pages 7 to 10). Each headline is a finding; `lede` is one
 *  sourced sentence; `standards` appears only where the playbook names one. */
export const families: {
  id: 'rotating' | 'electrical' | 'motion' | 'degradation';
  name: string; page: number; headline: string; lede: string; standards?: string;
}[] = [
  {
    id: 'rotating', name: 'Rotating machinery', page: 7,
    headline: 'Bearings are the most common motor failure, and an accelerometer catches them.',
    lede: 'Bearings account for 44 % of motor failures and are the weakest fault class for current-only sensing, so this family reads vibration. Features taken at the bearing’s own fault frequencies outrank raw statistics four to five times, so the classifier behind them stays small.',
    standards: 'ISO 20816 severity zones · ISO 13373 vibration monitoring',
  },
  {
    id: 'electrical', name: 'Electrical and power', page: 8,
    headline: 'The phase current the drive already samples carries rotor and stator faults.',
    lede: 'Motor current signature analysis looks for sidebands around the supply frequency. The FFT that would resolve them is 8 MB, so the playbook evaluates Goertzel filters at only the predicted sideband frequencies instead.',
    standards: 'ISO 20958 motor current signature analysis',
  },
  {
    id: 'motion', name: 'Control, motion and sensing', page: 9,
    headline: 'Most of these run on the sensors the drive already has.',
    lede: 'Sensorless observation, plausibility checking, regime identification, anomaly scoring and duty tracking depend on relative change rather than small-signal resolution, so they need no added parts.',
  },
  {
    id: 'degradation', name: 'Slower-rate and sequence', page: 10,
    headline: 'Trend and forecasting tasks read hours of history, so they can run slower.',
    lede: 'Remaining-useful-life regression works from 64 hourly feature snapshots. Three of the six tasks that run below 1 kHz are in this family.',
  },
];

/** Tasks the playbook (page 11) names as needing more than the part's 8-bit converter. */
export const needsResolution = new Set(['Broken rotor bar detection', 'Air-gap eccentricity', 'Stator inter-turn short']);
