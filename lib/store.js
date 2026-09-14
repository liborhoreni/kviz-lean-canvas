import { Redis } from '@upstash/redis';
import { QUESTIONS, TIME_LIMIT_MS } from './questions';

const REDIS_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = REDIS_URL && REDIS_TOKEN ? new Redis({ url: REDIS_URL, token: REDIS_TOKEN }) : null;

const DEFAULT_STATE = { phase: 'lobby', questionIndex: -1, startedAt: 0, timeLimitMs: TIME_LIMIT_MS };

// In-memory fallback (local dev bez Redisu). globalThis přežije hot-reload v `next dev`.
const mem =
  globalThis.__quizMem ||
  (globalThis.__quizMem = {
    state: { ...DEFAULT_STATE },
    players: new Map(),
    answers: new Map(), // qIndex -> Map(playerId -> {choice, correct, points, ts})
    scores: new Map(),
  });

function answersKey(qIndex) {
  return `quiz:answers:${qIndex}`;
}

export async function getState() {
  if (redis) {
    const s = await redis.get('quiz:state');
    return s || { ...DEFAULT_STATE };
  }
  return { ...mem.state };
}

export async function setState(patch) {
  const current = await getState();
  const next = { ...current, ...patch };
  if (redis) {
    await redis.set('quiz:state', next);
  } else {
    mem.state = next;
  }
  return next;
}

export async function addPlayer(id, name, avatar) {
  const player = { name, avatar, joinedAt: Date.now() };
  if (redis) {
    await redis.hset('quiz:players', { [id]: player });
  } else {
    mem.players.set(id, player);
  }
  return player;
}

export async function getPlayer(id) {
  if (redis) {
    return (await redis.hget('quiz:players', id)) || null;
  }
  return mem.players.get(id) || null;
}

export async function listPlayers() {
  if (redis) {
    const all = (await redis.hgetall('quiz:players')) || {};
    return Object.entries(all).map(([id, p]) => ({ id, ...p }));
  }
  return [...mem.players.entries()].map(([id, p]) => ({ id, ...p }));
}

export async function submitAnswer(playerId, questionIndex, choice) {
  const question = QUESTIONS[questionIndex];
  if (!question) throw new Error('invalid_question');

  const existing = redis
    ? await redis.hget(answersKey(questionIndex), playerId)
    : mem.answers.get(questionIndex)?.get(playerId);
  if (existing) return existing; // hráč už na tuto otázku odpověděl

  const state = await getState();
  const elapsed = Date.now() - (state.startedAt || Date.now());
  const remainingFraction = Math.min(1, Math.max(0, 1 - elapsed / (state.timeLimitMs || TIME_LIMIT_MS)));
  const correct = choice === question.correct;
  const points = correct ? Math.round(500 + 500 * remainingFraction) : 0;
  const record = { choice, correct, points, ts: Date.now() };

  if (redis) {
    await redis.hset(answersKey(questionIndex), { [playerId]: record });
    if (points > 0) await redis.hincrby('quiz:scores', playerId, points);
  } else {
    if (!mem.answers.has(questionIndex)) mem.answers.set(questionIndex, new Map());
    mem.answers.get(questionIndex).set(playerId, record);
    mem.scores.set(playerId, (mem.scores.get(playerId) || 0) + points);
  }
  return record;
}

export async function getAnswers(questionIndex) {
  if (redis) {
    const all = (await redis.hgetall(answersKey(questionIndex))) || {};
    return all;
  }
  const map = mem.answers.get(questionIndex);
  return map ? Object.fromEntries(map) : {};
}

export async function getLeaderboard() {
  const players = await listPlayers();
  let scores = {};
  if (redis) {
    scores = (await redis.hgetall('quiz:scores')) || {};
  } else {
    scores = Object.fromEntries(mem.scores);
  }
  return players
    .map((p) => ({ ...p, score: Number(scores[p.id]) || 0 }))
    .sort((a, b) => b.score - a.score);
}

export async function resetGame() {
  if (redis) {
    const keys = ['quiz:state', 'quiz:players', 'quiz:scores', ...QUESTIONS.map((_, i) => answersKey(i))];
    await Promise.all(keys.map((k) => redis.del(k)));
  } else {
    mem.state = { ...DEFAULT_STATE };
    mem.players.clear();
    mem.answers.clear();
    mem.scores.clear();
  }
}

export function isUsingRedis() {
  return !!redis;
}
