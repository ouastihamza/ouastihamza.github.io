import Image from "next/image";
import { PortraitMotion } from "./portrait-motion";

export function HeroPortrait() {
  return <div className="portrait-stage" id="portrait-stage">
    <div className="portrait-atmosphere" aria-hidden="true" />
    <div className="identity-orbit" aria-hidden="true">
      <svg className="identity-ring" viewBox="0 0 500 500" focusable="false">
        <defs><path id="identity-circle" d="M 250,26 a 224,224 0 1,1 0,448 a 224,224 0 1,1 0,-448" /></defs>
        <text textLength="1375" lengthAdjust="spacing"><textPath href="#identity-circle"><tspan className="identity-name">HAMZA OUASTI</tspan>{" · "}<tspan className="identity-developer">FULL-STACK DEVELOPER</tspan>{" · "}<tspan className="identity-engineer">SOFTWARE ENGINEER</tspan>{" · "}</textPath></text>
      </svg>
    </div>
    <div className="portrait-parallax">
      <div className="portrait-float">
        <Image className="portrait-image" src="/images/hamza-woodland-cutout.webp" alt="Hamza Ouasti, wearing glasses, a sage-green sweatshirt and a dark scarf" width={958} height={822} preload sizes="(max-width: 680px) 72vw, 370px" />
      </div>
    </div>
    <span className="portrait-ground" aria-hidden="true" />
    <PortraitMotion />
  </div>;
}
