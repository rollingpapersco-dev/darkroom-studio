/**
 * Pricing tier card. Featured = white border, #0c0c0e bg, white "Recommended" tab, white CTA.
 * @startingPoint section="Cards" subtitle="Pricing tier card" viewport="400x640"
 */
export interface PriceCardProps { tier: string; description: string; rate: string; unit?: string; unitBlock?: boolean; features?: string[]; featured?: boolean; cta?: string; href?: string; style?: import('react').CSSProperties; }
export function PriceCard(props: PriceCardProps): JSX.Element;
