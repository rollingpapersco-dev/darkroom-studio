function InterviewsScreen() {
  const { InterviewCard, Eyebrow } = window.DR;
  const items = [
    ['Interview • EP.08', 'RANDY MORGAN', '"From Benin radio to a dark room in Lagos — on Changes, the grind before the glow, and why the Darkroom is the visual."'],
    ['Interview • EP.09', 'FIDO', '"On Dance for Jesus, building independently through Oosha Records, and performing a record built for fifty thousand people in a room built for one."'],
    ['Interview • EP.01', 'KJUNI', "\"Unpacking the narrative focus behind 'Leather' and finding space in the creative ecosystem.\""],
  ];
  return (
    <section style={{ padding: '8rem 4rem 4rem', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: '4rem', borderBottom: '1px solid var(--border-main)', paddingBottom: '2rem' }}>
        <Eyebrow size={12} style={{ letterSpacing: '0.1em', marginBottom: '0.5rem' }}>The Conversations</Eyebrow>
        <h1 style={{ fontSize: 40, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: '1rem' }}>Darkroom Interviews</h1>
        <p style={{ fontSize: 16, color: 'var(--text-label)', maxWidth: 600, lineHeight: 1.5 }}>Going behind the performance. Featured artists sit down to unpack their identity, their background, and the execution details behind the tracks.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        {items.map(([m, a, q]) => <InterviewCard key={a} meta={m} artist={a} quote={q} />)}
      </div>
    </section>
  );
}
window.InterviewsScreen = InterviewsScreen;
