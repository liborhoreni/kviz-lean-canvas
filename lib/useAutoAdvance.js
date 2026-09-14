'use client';

import { useEffect, useRef } from 'react';
import { COUNTDOWN_MS, REVEAL_AUTO_MS } from './questions';

async function callHostAction(action) {
  try {
    await fetch('/api/host', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });
  } catch {
    // ignore – další připojené zařízení to zkusí na svém dalším tiku
  }
}

// Hlídá automatické kroky hry (odpočet -> otázka -> vyhodnocení -> žebříček).
// Volá se z HOSTOVA i HRÁČOVA zařízení zároveň: díky idempotentním akcím na
// serveru je bezpečné, když to "zmáčkne" víc zařízení najednou – vyhraje první
// a ostatní jsou no-op. Díky tomu hra nezůstane trčet, i kdyby lektorův
// prohlížeč na chvíli usnul nebo zpomalil na pozadí.
export function useAutoAdvance(data, now) {
  const beganForRef = useRef(-1);
  const revealedForRef = useRef(-1);
  const leaderboardForRef = useRef(-1);
  const phase = data?.state?.phase;

  useEffect(() => {
    if (phase === 'lobby') {
      beganForRef.current = -1;
      revealedForRef.current = -1;
      leaderboardForRef.current = -1;
    }
  }, [phase]);

  useEffect(() => {
    if (phase !== 'countdown' || !data?.state?.countdownStartedAt) return;
    const elapsed = now - data.state.countdownStartedAt;
    if (elapsed >= COUNTDOWN_MS && beganForRef.current !== data.state.questionIndex) {
      beganForRef.current = data.state.questionIndex;
      callHostAction('begin-question');
    }
     
  }, [phase, now, data?.state?.countdownStartedAt, data?.state?.questionIndex]);

  useEffect(() => {
    if (phase !== 'question' || !data?.state?.startedAt) return;
    const remaining = data.state.timeLimitMs - (now - data.state.startedAt);
    if (remaining <= 0 && revealedForRef.current !== data.state.questionIndex) {
      revealedForRef.current = data.state.questionIndex;
      callHostAction('reveal');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, now, data?.state?.startedAt, data?.state?.questionIndex]);

  useEffect(() => {
    if (phase !== 'reveal' || !data?.state?.startedAt) return;
    const sinceReveal = now - data.state.startedAt - data.state.timeLimitMs;
    if (sinceReveal >= REVEAL_AUTO_MS && leaderboardForRef.current !== data.state.questionIndex) {
      leaderboardForRef.current = data.state.questionIndex;
      callHostAction('leaderboard');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, now, data?.state?.startedAt, data?.state?.questionIndex]);
}
