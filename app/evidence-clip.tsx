'use client';

import {useRef, useState} from 'react';
import {Play} from 'lucide-react';
import {url} from './routes';
import './evidence-clip.css';

/** The moment in a narrated film where one kind of evidence is actually on screen.
 *
 *  These cards used to carry stills from an AMR forklift simulator, captioned "Evidence
 *  visualization: Simulated". The picture had nothing to do with the claim: it was decoration
 *  standing where the evidence should be, which is the same defect scripts/check-visuals.mjs exists
 *  to catch on the Ask DeepGrid images. Each card now shows the deck slide that states the figure,
 *  and plays the film segment that explains it.
 *
 *  The clip is the segment, not the film: it starts at `start`, loops at `start + duration`, and
 *  never runs on into the next slide's narration. preload="none" keeps five films (54 MB) off the
 *  page until someone asks for one; the poster is a real slide, so the card reads correctly before
 *  anything loads.
 */
export type Clip = {
  film: string;          // /media/<slug>.mp4
  captions: string;      // /media/<slug>.vtt
  poster: string;        // /decks/<dir>/slide-NN.webp
  start: number;
  duration: number;
  slide: number;
  deck: string;          // human name of the deck
  shows: string;         // what is on screen, in the slide's own words
  saying: string;        // the narration over that segment, verbatim from the .vtt
};

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;

export default function EvidenceClip({clip, label}: {clip: Clip; label: string}) {
  const v = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const start = () => {
    const el = v.current;
    if (!el) return;
    // preload="none" means readyState is 0 and nothing is fetched until asked. Without the
    // explicit load() the loadedmetadata listener never fires, the seek never happens, and the
    // clip sits at 0:00 paused: measured exactly that before this line existed.
    const seek = () => { el.currentTime = clip.start; el.play().catch(() => {}); };
    if (el.readyState >= 1) seek();
    else { el.addEventListener('loadedmetadata', seek, {once: true}); el.load(); }
    setPlaying(true);
  };

  // Loop inside the segment. Without this the clip runs on into the next slide's narration, which
  // would put the wrong words under the wrong evidence.
  const onTime = () => {
    const el = v.current;
    if (el && el.currentTime >= clip.start + clip.duration) el.currentTime = clip.start;
  };

  return (
    <figure className="dr-ev-clip">
      {/* The frame is the positioning context for the play control. Without it the control was
          absolute against the whole figure and landed on top of the narration below the video. */}
      <div className="dr-ev-clip-frame">
        <video
          ref={v}
          className="dr-ev-clip-video"
          poster={url(clip.poster)}
          preload="none"
          muted
          playsInline
          controls={playing}
          onTimeUpdate={onTime}
          onPause={() => setPlaying(false)}
          aria-label={`${label}: ${clip.shows}. ${clip.deck} film from ${mmss(clip.start)}.`}
        >
          <source src={url(clip.film)} type="video/mp4"/>
          <track kind="captions" src={url(clip.captions)} srcLang="en" label="English" default/>
        </video>

        {!playing && (
          <button className="dr-ev-clip-play" onClick={start}>
            <Play size={15} aria-hidden="true"/>
            <span>Play the {mmss(clip.duration)} explaining this</span>
          </button>
        )}
      </div>

      <figcaption className="dr-ev-clip-cap">
        <span className="mono">{clip.deck} · SLIDE {String(clip.slide).padStart(2, '0')} · {mmss(clip.start)}</span>
        {clip.shows}
      </figcaption>
    </figure>
  );
}

/** The narration as text, rendered beside the argument rather than under the video: a reader who
 *  never presses play still gets what the film says, and the row's second column earns its width. */
export function EvidenceSaid({clip}: {clip: Clip}) {
  return (
    <blockquote className="dr-ev-clip-said">
      <p>{clip.saying}</p>
      <cite>Narration, {clip.deck} film, {mmss(clip.start)}&ndash;{mmss(clip.start + clip.duration)}</cite>
    </blockquote>
  );
}
