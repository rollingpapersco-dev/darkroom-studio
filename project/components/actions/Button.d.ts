import { ReactNode, CSSProperties } from 'react';
/**
 * Darkroom's rounded-pill buttons. White-on-black is primary; everything else is outline or text.
 * @startingPoint section="Actions" subtitle="Primary, ghost, nav, tier and dock buttons" viewport="700x300"
 */
export interface ButtonProps {
  /** primary = white fill (hero CTA); ghost = hairline outline; nav = small "Apply Now"; tier / tier-featured = full-width pricing CTAs; outline = "Watch ▶" on carousel card; dock / dock-back = portal form Continue / Back */
  variant?: 'primary' | 'ghost' | 'nav' | 'tier' | 'tier-featured' | 'outline' | 'dock' | 'dock-back';
  href?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
  children?: ReactNode;
}
export function Button(props: ButtonProps): JSX.Element;
