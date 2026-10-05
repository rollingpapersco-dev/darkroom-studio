/**
 * Tall glass card for an artist interview: meta top, name + italic pull-quote bottom, faint ✦ corner glyph.
 * @startingPoint section="Cards" subtitle="Interview teaser card" viewport="480x300"
 */
export interface InterviewCardProps { meta: string; artist: string; quote: string; cta?: string; style?: import('react').CSSProperties; }
export function InterviewCard(props: InterviewCardProps): JSX.Element;
