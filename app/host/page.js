'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { burstConfetti } from '@/lib/confetti';
import { playersLabel } from '@/lib/pluralize';
import { useAutoAdvance } from '@/lib/useAutoAdvance';
import CountdownView from '@/components/CountdownView';

const TILE_CLASSES = ['tile-0', 'tile-1', 'tile-2'];
const LETTERS = ['A', 'B', 'C'];

export default function HostPage() {
  const [data, setData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [now, setNow] = useState(Date.now());
  const [joinUrl, setJoinUrl] = useState('');
  const confettiPhaseRef = useRef(null);
  const canvasRef = useRef(null);

  const refresh = useCallback(async () => {
    const res = await fetch('/api/state', { cache: 'no-store' });
    const json = await res.json();
    setData(json);
  }, []);

  const refreshLeaderboard = useCallback(async () => {
    const res = await fetch('/api/leaderboard', { cache: 'no-store' });
    const json = await res.json();
    setLeaderboard(json.leaderboard || []);
  }, []);

  useEffect(() => {
    setJoinUrl(`${window.location.origin}/play`);
    refresh();
    const id = setInterval(refresh, 1200);
    return () => clearInterval(id);
  }, [refresh]);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(id);
  }, []);

  const phase = data?.state?.phase;

  useEffect(() => {
    if (phase === 'leaderboard' || phase === 'end') refreshLeaderboard();
  }, [phase, refreshLeaderboard]);

  useEffect(() => {
    if ((phase === 'leaderboard' || phase === 'end') && confettiPhaseRef.current !== phase) {
      confettiPhaseRef.current = phase;
      burstConfetti(canvasRef.current, { count: phase === 'end' ? 220 : 120 });
    }
  }, [phase]);

  async function callHost(action) {
    await fetch('/api/host', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });
    await refresh();
  }

  useAutoAdvance(data, now);

  function handleReset() {
    if (window.confirm('Opravdu resetovat hru? Smaže se skóre i seznam hráčů.')) {
      confettiPhaseRef.current = null;
      callHost('reset');
    }
  }

  return (
    <main className="screen">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      <canvas ref={canvasRef} className="canvas-confetti" />

      <div className="host-topbar">
        <span className="eyebrow" style={{ fontSize: 15 }}>
          🎓 Lean Canvas Kvíz · lektor
        </span>
        <button className="btn btn-danger" onClick={handleReset}>
          Resetovat hru
        </button>
      </div>

      <div className="content">
        {!data && <p className="subtitle">Načítám hru…</p>}

        {data && phase === 'lobby' && (
          <Lobby data={data} joinUrl={joinUrl} onStart={() => callHost('start')} />
        )}

        {data && phase === 'countdown' && <CountdownView data={data} now={now} />}

        {data && phase === 'question' && <QuestionView data={data} now={now} />}

        {data && phase === 'reveal' && (
          <RevealView data={data} onNext={() => callHost('leaderboard')} />
        )}

        {data && phase === 'leaderboard' && (
          <LeaderboardView leaderboard={leaderboard} data={data} onNext={() => callHost('next')} />
        )}

        {data && phase === 'end' && <EndView leaderboard={leaderboard} onReset={handleReset} />}
      </div>
    </main>
  );
}

function Lobby({ data, joinUrl, onStart }) {
  return (
    <>
      <h1 className="title">
        Lean Canvas <span className="accent">Kvíz</span>
      </h1>
      <p className="subtitle">Naskenujte QR kód telefonem a připojte se do hry.</p>
      <div className="qr-wrap">{joinUrl && <QRCodeSVG value={joinUrl} size={220} marginSize={2} />}</div>
      <p className="helper-text">{joinUrl}</p>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
        <span className="pill">
          {data.playersCount} připojených {playersLabel(data.playersCount)}
        </span>
        <div className="chip-row">
          {data.players.map((p) => (
            <span className="chip" key={p.id}>
              <span className="em">{p.avatar}</span>
              {p.name}
            </span>
          ))}
        </div>
      </div>

      <button className="btn btn-primary btn-lg" onClick={onStart}>
        ▶️ Spustit hru
      </button>
    </>
  );
}

function QuestionView({ data, now }) {
  const q = data.question;
  const st = data.state;
  const remaining = Math.max(0, st.timeLimitMs - (now - st.startedAt));
  const pct = Math.max(0, Math.min(100, (remaining / st.timeLimitMs) * 100));
  const seconds = Math.ceil(remaining / 1000);

  return (
    <>
      <div className="host-topbar" style={{ marginBottom: 0 }}>
        <span className="pill">
          Téma {q.topicNumber}/{q.topicCount} · {q.topic}
        </span>
        <span className="pill">
          Otázka {q.index + 1}/{q.total}
        </span>
        <span className="pill">{data.answeredCount} odpovědělo</span>
      </div>

      <div className="card">
        <h2 style={{ fontSize: 'clamp(22px, 3.4vw, 34px)', textAlign: 'center' }}>{q.q}</h2>
      </div>
      {q.note && <p className="question-note">⚠️ {q.note}</p>}

      <div className="progress-track">
        <div
          className={`progress-fill ${seconds <= 5 ? 'danger' : ''}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="pill">⏱ {seconds}s</span>

      <div className="answers-grid" data-count={q.choices.length}>
        {q.choices.map((c, i) => (
          <div className={`answer-tile ${TILE_CLASSES[i]}`} key={i}>
            <span className="tile-badge">{LETTERS[i]}</span>
            {c}
          </div>
        ))}
      </div>
    </>
  );
}

function RevealView({ data, onNext }) {
  const q = data.question;
  return (
    <>
      <div className="host-topbar" style={{ marginBottom: 0 }}>
        <span className="pill">
          Otázka {q.index + 1}/{q.total}
        </span>
        <span className="pill">{data.answeredCount} odpovědělo</span>
      </div>
      <div className="card">
        <h2 style={{ fontSize: 'clamp(20px, 3vw, 28px)', textAlign: 'center' }}>{q.q}</h2>
      </div>
      <div className="answers-grid" data-count={q.choices.length}>
        {q.choices.map((c, i) => {
          const isCorrect = i === q.correct;
          return (
            <div
              className={`answer-tile ${TILE_CLASSES[i]} ${isCorrect ? 'correct' : 'dim'}`}
              key={i}
            >
              <span className="tile-badge">{LETTERS[i]}</span>
              <span style={{ flex: 1 }}>{c}</span>
              <span className="pill" style={{ color: 'inherit', background: 'rgba(0,0,0,0.18)' }}>
                {data.answerCounts?.[i] ?? 0}× {isCorrect ? '✅' : ''}
              </span>
            </div>
          );
        })}
      </div>
      <button className="btn btn-teal btn-lg" onClick={onNext}>
        🏆 Zobrazit žebříček hned
      </button>
    </>
  );
}

function LeaderboardView({ leaderboard, data, onNext }) {
  const isLast = data.question && data.question.index === data.question.total - 1;
  return (
    <>
      <h2 className="title" style={{ fontSize: 'clamp(26px, 4vw, 38px)' }}>
        Průběžný žebříček
      </h2>
      <div className="leaderboard-list">
        {leaderboard.slice(0, 8).map((p, i) => (
          <div className="leaderboard-row" key={p.id}>
            <span className="rank">{i + 1}.</span>
            <span className="em">{p.avatar}</span>
            <span className="name">{p.name}</span>
            <span className="score">{p.score}</span>
          </div>
        ))}
        {leaderboard.length === 0 && <p className="helper-text">Zatím nikdo neodpověděl.</p>}
      </div>
      <button className="btn btn-primary btn-lg" onClick={onNext}>
        {isLast ? '🏁 Ukončit kvíz' : '➡️ Další otázka'}
      </button>
    </>
  );
}

function EndView({ leaderboard, onReset }) {
  const top3 = leaderboard.slice(0, 3);
  return (
    <>
      <h1 className="title">
        Kvíz <span className="accent">skončil!</span> 🎉
      </h1>
      {top3.length > 0 && (
        <div className="podium">
          {top3.map((p, i) => (
            <div className={`podium-step podium-${i + 1}`} key={p.id}>
              <span className="em">{p.avatar}</span>
              <span>{p.name}</span>
              <span>{p.score} b.</span>
            </div>
          ))}
        </div>
      )}
      <div className="leaderboard-list">
        {leaderboard.slice(3, 10).map((p, i) => (
          <div className="leaderboard-row" key={p.id}>
            <span className="rank">{i + 4}.</span>
            <span className="em">{p.avatar}</span>
            <span className="name">{p.name}</span>
            <span className="score">{p.score}</span>
          </div>
        ))}
      </div>
      <button className="btn btn-ghost" onClick={onReset}>
        🔁 Nová hra
      </button>
    </>
  );
}
