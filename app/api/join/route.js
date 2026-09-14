import { addPlayer } from '@/lib/store';

export async function POST(request) {
  const { name, avatar } = await request.json();
  const clean = (name || '').trim().slice(0, 24);
  if (!clean) {
    return Response.json({ error: 'Zadej jméno.' }, { status: 400 });
  }
  const id = crypto.randomUUID();
  await addPlayer(id, clean, avatar || '🦊');
  return Response.json({ id, name: clean, avatar: avatar || '🦊' });
}
