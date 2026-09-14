'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { shuffledAvatars } from '@/lib/avatars';
import { burstConfetti } from '@/lib/confetti';
import { playersLabel } from '@/lib/pluralize';
import CountdownView from '@/components/CountdownView';
import { useAutoAdvance } from '@/lib/useAutoAdvance';

const TILE_CLASSES = ['tile-0', 'tile-1', 'tile-2'];
const LETTERS = ['A', 'B', 'C'];
const STORAGE_KEY = 'leancanvas_quiz_player';

function loadStoredPlayer() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function storePlayer(player) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(player));
  } catch {
    // soukromý režim / zakázané úložiště – hra pojede dál, jen nepřežije refresh
  }
}

function clearStoredPlayer() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export default function PlayPage() {
  const [player, setPlayer] = useState(undefined); // undefined = ještě nezjištěno, null = nepřipojen
  const [data, setData] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [leaderboard, setLeaderboard] = useState([]);
  const [answering, setAnswering] = useState(false);
  const revealSeenRef = useRef(-1);
  const canvasRef = useRef(null);

  useEffect(() => {
    setPlayer(loadStoredPlayer());
  }, []);

  const refresh = useCallback(async () => {
    if (!player) return;
    const res = await fetch(`/api/state?playerId=${player.id}`, { cache: 'no-store' });
    const json = await res.json();
    if (!json.meKnown) {
      clearStoredPlayer();
      setPlayer(null);
      return;
    }
    setData(json);
  }, [player]);

  useEffect(() => {
    if (!player) return;
    refresh();
    const id = setInterval(refresh, 1000);
    return () => clearInterval(id);
  }, [player, refresh]);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(id);
  }, []);

  const phase = data?.state?.phase;

  useAutoAdvance(data, now);

  const refreshLeaderboard = useCallback(async () => {
    const res = await fetch('/api/leaderboard', { cache: 'no-store' });
    const json = await res.json();
    setLeaderboard(json.leaderboard || []);
  }, []);

  useEffect(() => {
    if (phase === 'leaderboard' || phase === 'end') refreshLeaderboard();
  }, [phase, refreshLeaderboard]);

  useEffect(() => {
    if (phase === 'reveal' && data?.myAnswer?.correct && revealSeenRef.current !== data.question.index) {
      revealSeenRef.current = data.question.index;
      burstConfetti(canvasRef.current, { count: 100 });
    }
  }, [phase, data]);

  async function submitAnswer(choice) {
    if (answering || !data?.question) return;
    setAnswering(true);
    await fetch('/api/answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId: player.id, questionIndex: data.question.index, choice }),
    });
    await refresh();
    setAnswering(false);
  }

  if (player === undefined) {
    return (
      <main className="screen">
        <div className="content" style={{ marginTop: '30vh' }} />
      </main>
    );
  }

  if (!player) {
    return <JoinForm onJoined={(p) => { storePlayer(p); setPlayer(p); }} />;
  }

  return (
    <main className="screen">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <canvas ref={canvasRef} className="canvas-confetti" />

      <div className="content">
        {!data && <p className="subtitle">Připojuji se ke hře…</p>}

        {data && phase === 'lobby' && <PlayerLobby player={player} data={data} />}

        {data && phase === 'countdown' && <CountdownView data={data} now={now} />}

        {data && phase === 'question' && (
          <PlayerQuestion data={data} now={now} answering={answering} onAnswer={submitAnswer} />
        )}

        {data && phase === 'reveal' && <PlayerReveal data={data} />}

        {data && phase === 'leaderboard' && (
          <PlayerLeaderboard leaderboard={leaderboard} player={player} />
        )}

        {data && phase === 'end' && <PlayerEnd leaderboard={leaderboard} player={player} />}
      </div>
    </main>
  );
}

function JoinForm({ onJoined }) {
  const [name, setName] = useState('');
  const [avatarList] = useState(shuffledAvatars);
  const [avatar, setAvatar] = useState(avatarList[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, avatar }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Něco se nepovedlo.');
      onJoined(json);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <main className="screen">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="content" style={{ marginTop: '6vh' }}>
        <span className="eyebrow">Kurz Lean Canvas</span>
        <h1 className="title">Připoj se do hry</h1>
        <form onSubmit={handleSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label className="helper-text" style={{ display: 'block', marginBottom: 8 }}>
              Vyber si postavičku
            </label>
            <div className="avatar-grid">
              {avatarList.map((em) => (
                <button
                  type="button"
                  key={em}
                  className={`avatar-btn ${avatar === em ? 'selected' : ''}`}
                  onClick={() => setAvatar(em)}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>
          <input
            className="input"
            placeholder="Tvoje jméno"
            value={name}
            maxLength={24}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          {error && <p style={{ color: 'var(--coral)', margin: 0 }}>{error}</p>}
          <button className="btn btn-primary btn-lg" type="submit" disabled={loading || !name.trim()}>
            {avatar} Připojit se
          </button>
        </form>
      </div>
    </main>
  );
}

function PlayerLobby({ player, data }) {
  return (
    <>
      <span className="big-emoji">{player.avatar}</span>
      <h2 className="title" style={{ fontSize: 'clamp(22px, 4vw, 30px)' }}>
        Ahoj, {player.name}!
      </h2>
      <div className="status-banner neutral">Čekej, až lektor spustí hru…</div>
      <span className="pill">
        {data.playersCount} {playersLabel(data.playersCount)} ve hře
      </span>
    </>
  );
}

function PlayerQuestion({ data, now, answering, onAnswer }) {
  const q = data.question;
  const st = data.state;
  const remaining = Math.max(0, st.timeLimitMs - (now - st.startedAt));
  const pct = Math.max(0, Math.min(100, (remaining / st.timeLimitMs) * 100));
  const seconds = Math.ceil(remaining / 1000);
  const alreadyAnswered = !!data.myAnswer;
  const timeUp = remaining <= 0;

  return (
    <>
      <div className="host-topbar" style={{ marginBottom: 0, justifyContent: 'center', gap: 10 }}>
        <span className="pill">
          {q.index + 1}/{q.total} · {q.topic}
        </span>
        <span className="pill">⏱ {seconds}s</span>
      </div>
      <div className="progress-track">
        <div className={`progress-fill ${seconds <= 5 ? 'danger' : ''}`} style={{ width: `${pct}%` }} />
      </div>

      <div className="card">
        <h2 style={{ fontSize: 'clamp(18px, 4vw, 24px)', textAlign: 'center' }}>{q.q}</h2>
      </div>
      {q.note && <p className="question-note">⚠️ {q.note}</p>}

      {alreadyAnswered ? (
        <div className="status-banner neutral">Odpověď odeslána ✅ Čekej na vyhodnocení…</div>
      ) : timeUp ? (
        <div className="status-banner bad">Čas vypršel!</div>
      ) : (
        <div className="answers-grid" data-count={q.choices.length}>
          {q.choices.map((c, i) => (
            <button
              key={i}
              className={`answer-tile ${TILE_CLASSES[i]}`}
              disabled={answering}
              onClick={() => onAnswer(i)}
            >
              <span className="tile-badge">{LETTERS[i]}</span>
              {c}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

function PlayerReveal({ data }) {
  const q = data.question;
  const my = data.myAnswer;
  return (
    <>
      <div className="card">
        <h2 style={{ fontSize: 'clamp(18px, 3.6vw, 24px)', textAlign: 'center' }}>{q.q}</h2>
      </div>

      {my ? (
        <div className={`status-banner ${my.correct ? 'good' : 'bad'}`}>
          {my.correct ? `Správně! +${my.points} bodů 🎉` : 'Tentokrát to nevyšlo.'}
        </div>
      ) : (
        <div className="status-banner neutral">Neodpověděl(a) jsi včas.</div>
      )}

      <div className="answers-grid" data-count={q.choices.length}>
        {q.choices.map((c, i) => {
          const isCorrect = i === q.correct;
          return (
            <div key={i} className={`answer-tile ${TILE_CLASSES[i]} ${isCorrect ? 'correct' : 'dim'}`}>
              <span className="tile-badge">{LETTERS[i]}</span>
              <span>{c}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}

function PlayerLeaderboard({ leaderboard, player }) {
  const rank = leaderboard.findIndex((p) => p.id === player.id);
  const me = leaderboard[rank];
  return (
    <>
      <h2 className="title" style={{ fontSize: 'clamp(24px, 5vw, 32px)' }}>
        Žebříček
      </h2>
      {me && (
        <div className="status-banner neutral">
          Jsi na {rank + 1}. místě se {me.score} body
        </div>
      )}
      <div className="leaderboard-list">
        {leaderboard.slice(0, 6).map((p, i) => (
          <div className={`leaderboard-row ${p.id === player.id ? 'me' : ''}`} key={p.id}>
            <span className="rank">{i + 1}.</span>
            <span className="em">{p.avatar}</span>
            <span className="name">{p.name}</span>
            <span className="score">{p.score}</span>
          </div>
        ))}
      </div>
      <div className="status-banner neutral">Sleduj promítanou obrazovku 👀</div>
    </>
  );
}

function PlayerEnd({ leaderboard, player }) {
  const rank = leaderboard.findIndex((p) => p.id === player.id);
  const me = leaderboard[rank];
  return (
    <>
      <h1 className="title">Konec hry! 🎉</h1>
      {me && (
        <div className="status-banner good">
          Skončil(a) jsi na {rank + 1}. místě se {me.score} body
        </div>
      )}
      <div className="leaderboard-list">
        {leaderboard.slice(0, 10).map((p, i) => (
          <div className={`leaderboard-row ${p.id === player.id ? 'me' : ''}`} key={p.id}>
            <span className="rank">{i + 1}.</span>
            <span className="em">{p.avatar}</span>
            <span className="name">{p.name}</span>
            <span className="score">{p.score}</span>
          </div>
        ))}
      </div>
      <p className="helper-text">Díky za hraní!</p>
    </>
  );
}
