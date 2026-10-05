import { ReactNode, CSSProperties } from 'react';
/** Episode selector chip (EP.01, EP.02…). Active state is the only place the red accent frames a control. */
export interface PillProps { active?: boolean; onClick?: () => void; style?: CSSProperties; children?: ReactNode; }
export function Pill(props: PillProps): JSX.Element;
