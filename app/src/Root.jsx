import { useEffect, useState } from 'react';
import Studio from './App.jsx';
import Calendar from './calendar/Calendar.jsx';
import Pitches from './pitches/Pitches.jsx';
import Deck from './pitches/Deck.jsx';

// Hash routes: #calendar · #pitches · #pitch/<slug>[/print] · anything else is the Studio
// (a bare template key such as #archA still opens that template, as the Hub links do).
function parse() {
  const h = decodeURIComponent((location.hash || '').slice(1));
  if (h === 'calendar') return { page: 'calendar' };
  if (h === 'pitches') return { page: 'pitches' };
  const m = /^pitch\/([\w-]+)(\/print)?$/.exec(h);
  if (m) return { page: 'deck', slug: m[1], print: !!m[2] };
  return { page: 'studio' };
}

const SECTIONS = [['studio', 'Studio', '#'], ['calendar', 'Calendar', '#calendar'], ['pitches', 'Pitches', '#pitches']];

export default function Root() {
  const [route, setRoute] = useState(parse);
  useEffect(() => {
    const f = () => setRoute(parse());
    addEventListener('hashchange', f);
    return () => removeEventListener('hashchange', f);
  }, []);
  useEffect(() => { document.documentElement.scrollTop = 0; }, [route.page, route.slug]);

  const active = route.page === 'deck' ? 'pitches' : route.page;
  return (
    <div className={'shell shell-' + route.page}>
      {route.page !== 'deck' && (
        <nav className="shell-nav" aria-label="Sections">
          {SECTIONS.map(([k, label, href]) => (
            <a key={k} href={href} className={'nav-tab' + (active === k ? ' on' : '')} aria-current={active === k ? 'page' : undefined}>{label}</a>
          ))}
        </nav>
      )}
      <div className="shell-main">
        {route.page === 'studio' && <Studio />}
        {route.page === 'calendar' && <Calendar />}
        {route.page === 'pitches' && <Pitches />}
        {route.page === 'deck' && <Deck key={route.slug} slug={route.slug} print={route.print} />}
      </div>
    </div>
  );
}
