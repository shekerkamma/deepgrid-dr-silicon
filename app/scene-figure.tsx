// A section's scene image: an AI-generated illustration that sets the subject of the section
// (docs/visuals/). The caption always says what the image is and what it is not, because a
// generated board or die can be mistaken for DG32 hardware, and the site claims no silicon yet.
import {url} from './routes';

export function SceneFigure({name, alt, caption, eager}: {name: string; alt: string; caption: string; eager?: boolean}) {
  const base = `/images/scenes/${name}`;
  return (
    <figure className="st-scene">
      <img
        src={url(`${base}-1536.webp`)}
        srcSet={`${url(`${base}-768.webp`)} 768w, ${url(`${base}-1536.webp`)} 1536w`}
        sizes="(max-width: 900px) 100vw, 1210px"
        alt={alt}
        width={1536}
        height={1024}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : undefined}
        decoding="async"
      />
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
