/**
 * Boxed input with the label inside the box (uppercase 11px grey), borderless 16px white text.
 * @startingPoint section="Forms" subtitle="Application form field" viewport="700x200"
 */
export interface FieldBoxProps { label: string; type?: 'text' | 'email' | 'url'; multiline?: boolean; value?: string; onChange?: (e: any) => void; required?: boolean; style?: import('react').CSSProperties; }
export function FieldBox(props: FieldBoxProps): JSX.Element;
