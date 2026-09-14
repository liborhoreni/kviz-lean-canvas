import { getState, setState, resetGame } from '@/lib/store';
import { QUESTIONS, TIME_LIMIT_MS } from '@/lib/questions';

export async function POST(request) {
  const { action } = await request.json();
  const state = await getState();

  switch (action) {
    case 'start': {
      const next = await setState({ phase: 'question', questionIndex: 0, startedAt: Date.now(), timeLimitMs: TIME_LIMIT_MS });
      return Response.json(next);
    }
    case 'reveal': {
      const next = await setState({ phase: 'reveal' });
      return Response.json(next);
    }
    case 'leaderboard': {
      const next = await setState({ phase: 'leaderboard' });
      return Response.json(next);
    }
    case 'next': {
      const nextIndex = state.questionIndex + 1;
      if (nextIndex >= QUESTIONS.length) {
        const next = await setState({ phase: 'end' });
        return Response.json(next);
      }
      const next = await setState({ phase: 'question', questionIndex: nextIndex, startedAt: Date.now(), timeLimitMs: TIME_LIMIT_MS });
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
