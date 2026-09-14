import { getLeaderboard } from '@/lib/store';

export async function GET() {
  const leaderboard = await getLeaderboard();
  return Response.json({ leaderboard });
}
