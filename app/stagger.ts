import type { CSSProperties } from "react";

/** Extends CSSProperties so the `--stagger` custom property can be set
 * inline without fighting React's typed style object. Plain data, no
 * client-only behavior, so Server Components can call it directly. */
export interface StaggerStyle extends CSSProperties {
  "--stagger"?: number;
}

export function stagger(index: number): StaggerStyle {
  return { "--stagger": index };
}
