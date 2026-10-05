/** Segmented 2px progress bar for multi-step flows; completed + current segments are white. */
export interface StepTrackerProps { steps?: number; current?: number; style?: import('react').CSSProperties; }
export function StepTracker(props: StepTrackerProps): JSX.Element;
