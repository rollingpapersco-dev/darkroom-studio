import { ReactNode, CSSProperties } from 'react';
/** Heavy sans headline. Wrap the payoff phrase in <Em> for Darkroom's signature grey Playfair italic. */
export interface HeadlineProps { size?: 'hero' | 'section' | 'page' | 'manifesto'; as?: 'h1' | 'h2' | 'h3' | 'div'; style?: CSSProperties; children?: ReactNode; }
export function Headline(props: HeadlineProps): JSX.Element;
export interface EmProps { children?: ReactNode; }
/** Playfair Display italic 400 in --text-label grey. */
export function Em(props: EmProps): JSX.Element;
