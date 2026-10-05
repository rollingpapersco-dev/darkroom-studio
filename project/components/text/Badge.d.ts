import { ReactNode, CSSProperties } from 'react';
/** Tiny label chip. episode = frosted "EP.08" over imagery; featured = white "Recommended" tab on a price card. */
export interface BadgeProps { variant?: 'episode' | 'featured'; style?: CSSProperties; children?: ReactNode; }
export function Badge(props: BadgeProps): JSX.Element;
