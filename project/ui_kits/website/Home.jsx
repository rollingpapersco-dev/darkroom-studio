function HomeScreen({ go }) {
  const { Button, Pill, Eyebrow, Headline, Em, CarouselCard } = window.DR;
  const EP = window.EPISODES, N = EP.length;
  const sectionRef = React.useRef(null);
  const [cur, setCur] = React.useState(0);
  const [vw, setVw] = React.useState(window.innerWidth);
  React.useEffect(() => {
    const on = () => {
      const el = sectionRef.current; if (!el) return;
      const r = el.getBoundingClientRect(), total = el.offsetHeight - window.innerHeight;
      const p = total > 0 ? Math.max(0, Math.min(total, -r.top)) / total : 0;
      setCur(p * (N - 1)); setVw(window.innerWidth);
    };
    window.addEventListener('scroll', on, { passive: true }); window.addEventListener('resize', on); on();
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); };
  }, []);
  const jump = i => { const el = sectionRef.current, total = el.offsetHeight - window.innerHeight; window.scrollTo({ top: el.offsetTop + (i / (N - 1)) * total, behavior: 'smooth' }); };
  const sp = Math.min(vw * 0.40, 560), idx = Math.round(cur), ep = EP[idx];
  const pad = 'clamp(1.5rem, 5vw, 4rem)';
  return (<>
    <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: `clamp(6rem, 14vh, 9rem) ${pad} clamp(7rem, 12vh, 8.5rem)`, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: '#000' }} />
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, background: 'var(--overlay-hero)' }} />
      <div style={{ position: 'absolute', top: 'clamp(5.5rem, 12vw, 7.5rem)', left: pad, zIndex: 3, fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: 'var(--text-label)', textTransform: 'uppercase' }}>Season One · <span style={{ color: '#fff' }}>EP.01–{String(N).padStart(2, '0')}</span></div>
      <div style={{ position: 'relative', zIndex: 3, maxWidth: 800 }}>
        <Eyebrow size={12} style={{ marginBottom: '0.75rem' }}>Lagos · Nigeria</Eyebrow>
        <Headline size="hero" as="h1" style={{ marginBottom: '1.5rem' }}>One room.<br />One take.<br /><Em>No spectacle.</Em></Headline>
        <p style={{ fontSize: 'clamp(15px, 1.6vw, 18px)', lineHeight: 1.5, color: 'var(--text-main)', opacity: 0.85, maxWidth: 600, marginBottom: '2.5rem', letterSpacing: '-0.015em' }}>The Darkroom is a musical performance series where artists perform their records in a controlled dark environment — no audience, no safety net, nowhere to hide.</p>
        <Button onClick={() => go('Episodes')}>Stream Episodes</Button>
      </div>
      <div style={{ position: 'absolute', bottom: '1.1rem', left: '50%', transform: 'translateX(-50%)', zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, fontSize: 10, letterSpacing: '0.14em', color: 'var(--text-label)', textTransform: 'uppercase' }}>Scroll to explore<span style={{ width: 1, height: 32, background: 'linear-gradient(to bottom, var(--text-label), transparent)', animation: 'cuePulse 2s ease-in-out infinite' }} /></div>
    </section>

    <section ref={sectionRef} style={{ position: 'relative', height: (N + 1) * 100 + 'vh' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#000' }}>
        <div style={{ position: 'absolute', top: '50%', left: 0, transform: `translateY(-50%) translateX(${-(cur / (N - 1)) * vw * 0.6}px)`, whiteSpace: 'nowrap', fontSize: 'clamp(90px, 14vw, 200px)', fontWeight: 800, letterSpacing: '-0.03em', color: 'transparent', WebkitTextStroke: '1px var(--ghost-stroke)', pointerEvents: 'none', zIndex: 1 }}>{Array(6).fill('DARKROOM').join('\u00a0\u00a0')}</div>
        <div style={{ position: 'absolute', top: 'clamp(5.5rem, 10vw, 7rem)', left: 0, right: 0, textAlign: 'center', zIndex: 5 }}>
          <Eyebrow style={{ letterSpacing: '0.14em', marginBottom: '0.35rem' }}>The Archive</Eyebrow>
          <div style={{ fontSize: 'var(--type-carousel-title)', fontWeight: 800, letterSpacing: '-0.03em', color: '#fff' }}>Season One</div>
        </div>
        <div style={{ position: 'relative', zIndex: 4, width: '100%', height: 'clamp(220px, 42vh, 380px)', perspective: 1400, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {EP.map((e, i) => { const o = i - cur, a = Math.abs(o);
            return <CarouselCard key={i} img={e.img} num={e.num} center={a < 0.5} style={{ position: 'absolute', transform: `translateX(${o * sp}px) translateZ(${-a * 140}px) rotateY(${Math.max(-32, Math.min(32, o * -20))}deg) scale(${Math.max(0.72, 1 - a * 0.12)})`, opacity: a > 2.4 ? 0 : Math.max(0, 1 - a * 0.38), filter: `blur(${Math.min(6, a * 2.2)}px)`, zIndex: 100 - Math.round(a * 10), pointerEvents: a < 0.5 ? 'auto' : 'none' }} />; })}
        </div>
        <div style={{ position: 'relative', zIndex: 5, marginTop: 'clamp(1.2rem, 3vh, 2rem)', textAlign: 'center', maxWidth: 620, padding: '0 1.5rem', minHeight: 96 }}>
          <div style={{ fontSize: 'clamp(18px, 2.2vw, 24px)', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff', marginBottom: '0.4rem' }}>{ep.artist}{ep.track && <> — <Em>{ep.track}</Em></>}</div>
          <Eyebrow tone="accent" size={10} style={{ display: 'inline-block', marginBottom: '0.6rem' }}>{ep.genre}</Eyebrow>
          <p style={{ fontSize: 'clamp(14px, 1.6vw, 17px)', lineHeight: 1.55, color: 'var(--text-main)', opacity: 0.85, letterSpacing: '-0.01em' }}>{ep.context}</p>
        </div>
        <div style={{ position: 'relative', zIndex: 5, display: 'flex', gap: 8, marginTop: 'clamp(1rem, 2.5vh, 1.75rem)', flexWrap: 'wrap', justifyContent: 'center', padding: '0 1.5rem' }}>
          {EP.map((e, i) => <Pill key={i} active={i === idx} onClick={() => jump(i)}>{e.num}</Pill>)}
        </div>
        <div style={{ position: 'absolute', bottom: '1.25rem', left: '50%', transform: 'translateX(-50%)', zIndex: 5, width: 'min(220px, 40vw)', height: 2, background: 'var(--border-main)', borderRadius: 2, overflow: 'hidden' }}><div style={{ height: '100%', width: (cur / (N - 1)) * 100 + '%', background: '#fff', borderRadius: 2 }} /></div>
      </div>
    </section>

    <section style={{ padding: `clamp(4rem, 10vw, 7rem) ${pad}`, textAlign: 'center', borderTop: '1px solid var(--border-main)' }}>
      <Headline size="section" style={{ marginBottom: '1rem' }}>Your record.<br /><Em>This room.</Em></Headline>
      <p style={{ fontSize: 15, color: 'var(--text-label)', maxWidth: 480, margin: '0 auto 2rem', lineHeight: 1.6 }}>Every episode is a permanent content asset — video, photos, captions, and rollout materials from a single session.</p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Button onClick={() => go('Apply')}>Apply to Feature</Button>
        <Button variant="ghost" onClick={() => go('Pricing')}>View Pricing</Button>
      </div>
    </section>
  </>);
}
window.HomeScreen = HomeScreen;
