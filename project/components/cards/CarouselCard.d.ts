/**
 * Floating 16:9 episode card from the home 3D carousel. Desaturated image, bottom shade, frosted EP badge, "Watch ▶" appears when centred.
 * @startingPoint section="Cards" subtitle="Floating carousel card" viewport="620x360"
 */
export interface CarouselCardProps { img: string; num: string; center?: boolean; href?: string; style?: import('react').CSSProperties; }
export function CarouselCard(props: CarouselCardProps): JSX.Element;
