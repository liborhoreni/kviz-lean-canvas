'use client';

import { COUNTDOWN_MS } from '@/lib/questions';

const COLORS = ['var(--gold-deep)', 'var(--blue-deep)', 'var(--purple)'];

export default function CountdownView({ data, now }) {
  const q = data.question;
  const st = data.state;
  const totalSeconds = COUNTDOWN_MS / 1000;
  const elapsed = now - (st.countdownStartedAt || now);
  const secondsLeft = Math.max(1, Math.min(totalSeconds, totalSeconds - Math.floor(elapsed / 1000)));
  const color = COLORS[secondsLeft - 1] || COLORS[0];

  return (
    <>
      {q && (
        <div className="host-topbar" style={{ marginBottom: 0, justifyContent: 'center', gap: 10 }}>
          <span className="pill">
            Téma {q.topicNumber}/{q.topicCount} · {q.topic}
          </span>
          <span className="pill">
            Otázka {q.index + 1}/{q.total}
          </span>
        </div>
      )}
      {q && (
        <div className="card">
          <h2 style={{ fontSize: 'clamp(20px, 3.4vw, 30px)', textAlign: 'center' }}>{q.q}</h2>
        </div>
      )}
      <p className="subtitle" style={{ margin: 0 }}>Připravte se…</p>
      <div className="countdown-number" key={secondsLeft} style={{ background: color }}>
        {secondsLeft}
      </div>
    </>
  );
}
