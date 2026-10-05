/**
 * Archive grid card: 16:9 thumb, EP number, ARTIST — Track, "Stream Episode ↗". Lifts 4px on hover.
 * @startingPoint section="Cards" subtitle="Episode archive card" viewport="400x380"
 */
export interface EpisodeCardProps { img: string; num: string; artist: string; track?: string; href?: string; style?: import('react').CSSProperties; }
export function EpisodeCard(props: EpisodeCardProps): JSX.Element;
