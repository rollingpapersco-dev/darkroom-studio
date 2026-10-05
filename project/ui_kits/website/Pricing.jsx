function PricingScreen({ go }) {
  const { PriceCard } = window.DR;
  return (
    <section style={{ padding: '10rem 4rem 4rem', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: '5rem', borderBottom: '1px solid var(--border-main)', paddingBottom: '2.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-label)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Studio Access</div>
        <h1 style={{ fontSize: 'var(--type-pricing-title)', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>Performance Tiers</h1>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', alignItems: 'stretch' }}>
        <PriceCard tier="TIER 01 · BASIC" description="For artists building their first major visual content asset." rate="₦200k" features={['Studio time — Lekki', 'Single camera setup', 'Full performance video (branded)', 'Basic colour grade', 'Teaser cut', 'Rollout cards']} />
        <PriceCard featured tier="TIER 02 · STANDARD" description="For artists mid-campaign or building toward a project launch." rate="₦350k" features={['Studio time — Lekki', 'Multi-camera setup', 'Full performance video (branded)', 'Professional colour grade', 'Teaser cut (Reels/TikTok)', 'Rollout cards']} />
        <PriceCard tier="TIER 03 · PREMIUM" description="For established artists and label-backed campaigns." rate="₦1M+" unit="PRICING ON SCOPE" unitBlock features={['Everything in Standard', 'Director of photography', 'Custom set design', 'Master-level colour grade', 'Interview segment (5 cuts)', 'BTS content (video + stills)']} />
      </div>
    </section>
  );
}
window.PricingScreen = PricingScreen;
