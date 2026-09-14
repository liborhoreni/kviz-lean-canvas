import { getState, setState, resetGame } from '@/lib/store';
import { QUESTIONS, timeLimitForIndex } from '@/lib/questions';

export async function POST(request) {
  const { action } = await request.json();
  const state = await getState();

  switch (action) {
    case 'start': {
      if (state.phase !== 'lobby') return Response.json(state);
      const next = await setState({ phase: 'countdown', questionIndex: 0, countdownStartedAt: Date.now() });
      return Response.json(next);
    }
    case 'begin-question': {
      // idempotentní: víc zařízení (host i hráči) může tuhle akci "navrhnout" ve
      // stejnou chvíli, projde jen ta první, ostatní jsou no-op
      if (state.phase !== 'countdown') return Response.json(state);
      const next = await setState({
        phase: 'question',
        startedAt: Date.now(),
        timeLimitMs: timeLimitForIndex(state.questionIndex),
      });
      return Response.json(next);
    }
    case 'reveal': {
      if (state.phase !== 'question') return Response.json(state);
      const next = await setState({ phase: 'reveal' });
      return Response.json(next);
    }
    case 'leaderboard': {
      if (state.phase !== 'reveal') return Response.json(state);
      const next = await setState({ phase: 'leaderboard' });
      return Response.json(next);
    }
    case 'next': {
      if (state.phase !== 'leaderboard') return Response.json(state);
      const nextIndex = state.questionIndex + 1;
      if (nextIndex >= QUESTIONS.length) {
        const next = await setState({ phase: 'end' });
        return Response.json(next);
      }
      const next = await setState({ phase: 'countdown', questionIndex: nextIndex, countdownStartedAt: Date.now() });
      return Response.json(next);
    }
    case 'reset': {
      await resetGame();
      const next = await getState();
      return Response.json(next);
    }
    default:
      return Response.json({ error: 'Neznámá akce.' }, { status: 400 });
  }
}
