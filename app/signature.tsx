import { signature } from "./signature.generated";
import { stagger } from "./stagger";

/** Runs inline before the hero is parsed, so the first paint is already
 * either the start of the animation or the finished signature. It sets
 * data-signature on <html>, which is why the layout suppresses the
 * hydration warning there. */
const playOncePerSession = `try{if(!sessionStorage.getItem("signature-played")&&matchMedia("(prefers-reduced-motion: no-preference)").matches){document.documentElement.dataset.signature="play";sessionStorage.setItem("signature-played","1")}}catch(e){}`;

export function SignatureScript() {
  return <script dangerouslySetInnerHTML={{ __html: playOncePerSession }} />;
}

export function Signature() {
  return (
    <svg className="signature" viewBox={signature.viewBox} aria-hidden="true" focusable="false">
      {signature.letters.map((letter, index) => (
        <path
          key={index}
          d={letter.d}
          pathLength={100}
          className={letter.word ? "signature-accent" : undefined}
          style={stagger(index + letter.word)}
        />
      ))}
    </svg>
  );
}
