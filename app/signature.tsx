import { signature } from "./signature.generated";
import { stagger } from "./stagger";

/** The fill layer is eroded to thin the letters (the font has one weight).
 * The outline layer draws each letter in, then fades out once the fill is
 * visible, so the eroded result is what stays on screen. */
export function Signature() {
  const letters = signature.letters.map((letter, index) => ({
    ...letter,
    className: letter.accent ? "signature-accent" : undefined,
    style: stagger(index + letter.word),
  }));
  return (
    <svg className="signature" viewBox={signature.viewBox} aria-hidden="true" focusable="false">
      <defs>
        <filter id="signature-thin" x="-5%" y="-5%" width="110%" height="110%">
          <feMorphology operator="erode" radius="0.3" />
        </filter>
      </defs>
      <g className="signature-fill" filter="url(#signature-thin)">
        {letters.map((letter, index) => (
          <path key={index} d={letter.d} className={letter.className} style={letter.style} />
        ))}
      </g>
      <g className="signature-stroke">
        {letters.map((letter, index) => (
          <path key={index} d={letter.d} pathLength={100} className={letter.className} style={letter.style} />
        ))}
      </g>
    </svg>
  );
}
