/**
 * Fixed frosted-glass top bar: white wordmark + RPCO credit left, 12px links + white "Apply Now" pill right.
 * @startingPoint section="Navigation" subtitle="Site header with logo, credit and links" viewport="1200x80"
 */
export interface NavBarProps {
  active?: 'Home' | 'Episodes' | 'Interviews' | 'About' | 'Pricing';
  logoSrc?: string;
  onNavigate?: (page: string) => void;
  /** 'fixed' on real pages; 'relative' for previews */
  position?: 'fixed' | 'sticky' | 'relative';
  style?: import('react').CSSProperties;
}
export function NavBar(props: NavBarProps): JSX.Element;
