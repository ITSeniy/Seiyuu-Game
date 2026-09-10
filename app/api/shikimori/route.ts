import { NextRequest, NextResponse } from 'next/server';
import { getSeiyuuGameData, getCharacterGameData } from '@/lib/shikimori';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('mode');

  try {
    let gameData;
    
    if (mode === 'seiyuu') {
      gameData = await getSeiyuuGameData();
    } else if (mode === 'character') {
      gameData = await getCharacterGameData();
    } else {
      return NextResponse.json(
        { error: 'Invalid mode. Use "seiyuu" or "character"' },
        { status: 400 }
      );
    }

    return NextResponse.json(gameData);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch game data' },
      { status: 500 }
    );
  }
}