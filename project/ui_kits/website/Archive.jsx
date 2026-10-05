function ArchiveScreen() {
  const { EpisodeCard } = window.DR;
  return (
    <section style={{ padding: '8rem 4rem 4rem', maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', borderBottom: '1px solid var(--border-main)', paddingBottom: '1.5rem' }}>
        <h1 style={{ fontSize: 40, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>THE ARCHIVE</h1>
        <div style={{ fontSize: 13, color: 'var(--text-label)', fontWeight: 500 }}>Playlist · <span style={{ color: '#fff' }}>{window.EPISODES.length}</span> episodes</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
        {window.EPISODES.map(e => <EpisodeCard key={e.num} {...e} />)}
      </div>
    </section>
  );
}
window.ArchiveScreen = ArchiveScreen;
