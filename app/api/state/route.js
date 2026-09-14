import { getState, listPlayers, getAnswers, getPlayer } from '@/lib/store';
import { publicQuestion, QUESTIONS } from '@/lib/questions';

export async function GET(request) {
  const state = await getState();
  const players = await listPlayers();
  const revealed = state.phase === 'reveal' || state.phase === 'leaderboard' || state.phase === 'end';
  const question =
    state.questionIndex >= 0 && state.questionIndex < QUESTIONS.length
      ? publicQuestion(state.questionIndex, revealed)
      : null;

  const answers = state.questionIndex >= 0 ? await getAnswers(state.questionIndex) : {};
  const answeredCount = Object.keys(answers).length;
  const answerCounts = question ? question.choices.map(() => 0) : [];
  Object.values(answers).forEach((a) => {
    if (question && a && Number.isInteger(a.choice) && answerCounts[a.choice] !== undefined) {
      answerCounts[a.choice] += 1;
    }
  });

  const playerId = request.nextUrl.searchParams.get('playerId');
  let myAnswer = null;
  if (playerId && answers[playerId]) myAnswer = answers[playerId];
  const me = playerId ? await getPlayer(playerId) : null;

  return Response.json({
    state,
    question,
    playersCount: players.length,
    players: players.map((p) => ({ id: p.id, name: p.name, avatar: p.avatar })),
    answeredCount,
    answerCounts,
    myAnswer,
    meKnown: !!me,
  });
}
