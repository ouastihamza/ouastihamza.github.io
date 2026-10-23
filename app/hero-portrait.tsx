import Image from "next/image";

export function HeroPortrait() {
  return <div className="portrait-stage" id="portrait-stage">
    <div className="portrait-atmosphere" aria-hidden="true" />
    <div className="identity-orbit" aria-hidden="true">
      <svg className="identity-ring" viewBox="0 0 500 500" focusable="false">
        <defs><path id="identity-circle" d="M 250,14 a 236,236 0 1,1 0,472 a 236,236 0 1,1 0,-472" /></defs>
        <text><textPath href="#identity-circle" textLength="1450" lengthAdjust="spacing"><tspan className="identity-name">HAMZA OUASTI</tspan>{" · "}<tspan className="identity-developer">FULL-STACK DEVELOPER</tspan>{" · "}<tspan className="identity-engineer">SOFTWARE ENGINEER</tspan>{" · "}</textPath></text>
      </svg>
    </div>
    <div className="portrait-parallax">
      <div className="portrait-float">
        <Image className="portrait-image" src="/images/hamza-woodland-cutout.webp" alt="Hamza Ouasti, wearing glasses, a sage-green sweatshirt and a dark scarf" width={958} height={822} preload sizes="(max-width: 680px) 80vw, 416px" />
      </div>
    </div>
    <span className="portrait-ground" aria-hidden="true" />
  </div>;
}
