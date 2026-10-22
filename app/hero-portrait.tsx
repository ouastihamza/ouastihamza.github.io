import Image from "next/image";
import { PortraitMotion } from "./portrait-motion";

export function HeroPortrait() {
  return <div className="portrait-stage" id="portrait-stage">
    <div className="portrait-atmosphere" aria-hidden="true" />
    <div className="portrait-parallax">
      <div className="portrait-float">
        <Image className="portrait-image" src="/images/hamza-woodland-cutout.webp" alt="Hamza Ouasti, wearing glasses, a sage-green sweatshirt and a dark scarf" width={958} height={822} preload sizes="(max-width: 680px) 85vw, (max-width: 1000px) 42vw, 480px" />
      </div>
    </div>
    <span className="portrait-ground" aria-hidden="true" />
    <PortraitMotion />
  </div>;
}
