import { ReactNode, CSSProperties } from 'react';
/** Uppercase tracked label above headlines ("Lagos · Nigeria", "The Archive", "Studio Access"). accent = red genre tag. */
export interface EyebrowProps { tone?: 'label' | 'accent'; size?: number; style?: CSSProperties; children?: ReactNode; }
export function Eyebrow(props: EyebrowProps): JSX.Element;
