function AboutScreen({ portal, setPortal }) {
  const { RuleCard, Button, Em } = window.DR;
  return (<>
    <section style={{ padding: '8rem 4rem', marginTop: '4rem', maxWidth: 1200, marginLeft: 'auto', marginRight: 'auto', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '4rem' }}>
      <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '0.05em', color: 'var(--text-label)', textTransform: 'uppercase' }}>The doctrine</div>
      <div style={{ fontSize: 'var(--type-manifesto)', fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.03em', color: '#fff' }}>Every line must be <Em>visualizable</Em>.<br />Every frame must be <Em>earned</Em>.<br />Every artist must be <Em>ready</Em>.</div>
      <div style={{ marginTop: '4rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', gridColumn: '1 / -1' }}>
        <RuleCard num="RULE 01" title="No audience">The Darkroom has no crowd to hide behind. No energy to borrow. The performance exists in a vacuum — and either it holds or it doesn't.</RuleCard>
        <RuleCard num="RULE 02" title="No second chances">Multiple takes are filmed. The best material is selected. But there is no safety net — what you bring into the room is what the camera sees.</RuleCard>
        <RuleCard num="RULE 03" title="No unbranded content">Every version of every Darkroom episode carries RPCO branding. No exceptions. The Darkroom is a standard, not just a room.</RuleCard>
      </div>
    </section>
    <section id="apply" style={{ padding: '8rem 4rem', maxWidth: 1200, margin: '0 auto', borderTop: '1px solid var(--border-main)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '4rem' }}>
      <div>
        <h2 style={{ fontSize: 'var(--type-apply)', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: '1rem' }}>Are you ready?</h2>
        <p style={{ fontSize: 18, color: 'var(--text-label)', maxWidth: 440, marginBottom: '2rem', lineHeight: 1.5 }}>Applications are reviewed manually by our core visual directors team.</p>
      </div>
      <Button style={{ padding: '14px 32px' }} onClick={() => setPortal(true)}>Apply to Feature</Button>
    </section>
    {portal && <Portal onClose={() => setPortal(false)} />}
  </>);
}
function Portal({ onClose }) {
  const { FieldBox, StepTracker, Button } = window.DR;
  const [step, setStep] = React.useState(1);
  const [done, setDone] = React.useState(false);
  const steps = {
    1: ['Identify yourself.', [['Artist Name'], ['Email Address', 'email'], ['Country'], ['City (optional)']]],
    2: ['The Records.', [['Short Bio', 'text', true], ['Primary Track Link', 'url'], ['Secondary Track Link (optional)', 'url']]],
    3: ['Where you live online.', [['Instagram Handle'], ['YouTube Channel Link (optional)', 'url'], ['TikTok Handle (optional)']]],
  };
  const [title, fields] = steps[step];
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 1000, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      <div style={{ width: '100%', padding: '1.5rem 4rem', borderBottom: '1px solid var(--border-main)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(20px)' }}>
        <div style={{ fontSize: 14, fontWeight: 600 }}>ARTIST ENTRY PORTAL</div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-label)', fontSize: 24, cursor: 'pointer' }}>×</button>
      </div>
      <div style={{ flex: 1, width: '100%', maxWidth: 720, margin: '0 auto', padding: '4rem 2rem', display: 'flex', flexDirection: 'column' }}>
        <StepTracker steps={3} current={step} style={{ marginBottom: '3.5rem' }} />
        {done ? <h3 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em' }}>Application received. We review every submission — you will hear from us.</h3> : <>
          <h3 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: '#fff', marginBottom: '2rem', letterSpacing: '-0.03em' }}>{title}</h3>
          {fields.map(([l, t, m]) => <FieldBox key={l} label={l} type={t} multiline={m} />)}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
            {step > 1 ? <Button variant="dock-back" onClick={() => setStep(step - 1)}>Back</Button> : <div />}
            <Button variant="dock" onClick={() => step < 3 ? setStep(step + 1) : setDone(true)}>{step < 3 ? 'Continue' : 'Submit Application'}</Button>
          </div></>}
      </div>
    </div>
  );
}
window.AboutScreen = AboutScreen;
