import { ReactNode } from 'react';
/** Numbered doctrine card (RULE 01 / No audience / body). Glass surface, 20px radius. */
export interface RuleCardProps { num: string; title: string; style?: import('react').CSSProperties; children?: ReactNode; }
export function RuleCard(props: RuleCardProps): JSX.Element;
