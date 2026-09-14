import { getState, submitAnswer, getPlayer } from '@/lib/store';

export async function POST(request) {
  const { playerId, questionIndex, choice } = await request.json();

  const player = await getPlayer(playerId);
  if (!player) return Response.json({ error: 'Neznámý hráč.' }, { status: 400 });

  const state = await getState();
  if (state.phase !== 'question' || state.questionIndex !== questionIndex) {
    return Response.json({ error: 'Tahle otázka už neběží.' }, { status: 409 });
  }

  const record = await submitAnswer(playerId, questionIndex, choice);
  return Response.json(record);
}
