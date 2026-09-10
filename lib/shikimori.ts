const SHIKIMORI_REST_API = 'https://shikimori.one/api';

// Задержка между запросами
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let requestCount = 0;
let lastResetTime = Date.now();

async function rateLimitedFetch(url: string, maxRetries = 3): Promise<any> {
  const now = Date.now();
  if (now - lastResetTime > 1000) {
    requestCount = 0;
    lastResetTime = now;
  }

  if (requestCount >= 5) {
    await delay(1000);
    requestCount = 0;
    lastResetTime = Date.now();
  }

  requestCount++;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'SeiyuuGame/1.0',
        },
      });

      if (response.status === 429) {
        console.log('Rate limit hit, waiting 2 seconds...');
        await delay(2000);
        continue;
      }

      if (!response.ok) {
        const text = await response.text();
        
        if (attempt < maxRetries - 1) {
          await delay(1000 * (attempt + 1));
          continue;
        }
        
        throw new Error(`HTTP ${response.status}: ${text}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        
        if (text.includes('Retry later') && attempt < maxRetries - 1) {
          await delay(2000);
          continue;
        }
        
        throw new Error(`Non-JSON response: ${text}`);
      }

      return await response.json();
    } catch (error) {
      if (attempt < maxRetries - 1) {
        await delay(1000 * (attempt + 1));
      } else {
        throw error;
      }
    }
  }

  throw new Error('Max retries exceeded');
}

// Расширенный список популярных сейю (топ-100+ с Shikimori)
const POPULAR_SEIYUU_IDS = [
  // Топ-20
  185, 118, 99, 8, 80, 11, 70, 270, 95, 135,
  1, 81, 119, 28, 10, 82, 32, 107, 43, 195,
  // Топ 21-50
  579, 140, 186, 94, 40, 132, 189, 204, 34, 90,
  92, 108, 142, 48, 59, 124, 194, 85, 97, 62,
  63, 131, 13, 86, 191, 111, 104, 112, 177, 98,
  // Топ 51-100
  125, 91, 61, 88, 139, 37, 146, 60, 12, 249,
  150, 170, 19, 244, 176, 192, 76, 75, 89, 141,
  187, 145, 18, 42, 117, 123, 163, 84, 130, 114,
  138, 193, 127, 103, 158, 149, 87, 183, 165, 73,
  147, 17, 197, 96, 110, 148, 184, 77, 188, 71,
  // Дополнительные популярные
  79, 64, 66, 58, 83, 93, 100, 102, 106, 113,
  116, 120, 122, 126, 128, 129, 133, 134, 136, 137
];

// Расширенный список популярных персонажей (топ-100+)
const POPULAR_CHARACTER_IDS = [
  // Топ-30 самых популярных
  40, 71, 417, 45627, 13, 45, 22037, 2476, 1543, 469,
  37522, 84, 80, 1734, 140, 249, 1, 2, 7, 4604,
  725, 3784, 455, 16, 3852, 17, 6, 63, 41, 21,
  // Дополнительные популярные
  61371, 24, 1371, 122, 3918, 82940, 62389, 50, 138, 36,
  46, 73, 138, 87, 19, 202, 89, 35, 90, 31,
  116, 139, 11, 143, 62, 223, 118, 242, 251, 145,
  // Еще популярные персонажи
  423, 1293, 22, 8, 4604, 20, 5, 15, 43, 412,
  3, 48, 47, 1740, 3901, 1943, 38, 29, 205, 425,
  37446, 40882, 1944, 208, 72, 137, 30, 117, 130, 163,
  // Дополнительные из разных аниме
  88, 10, 25, 68, 91, 150, 146, 120, 169, 184,
  226, 245, 273, 284, 298, 301, 317, 334, 352, 366
];

// Функция для получения случайного сейю с проверкой
async function getRandomValidSeiyuu(excludeIds: Set<string>, maxAttempts = 10): Promise<any | null> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      // Сначала пробуем популярных
      if (Math.random() < 0.7 || i < 5) {
        const randomId = POPULAR_SEIYUU_IDS[Math.floor(Math.random() * POPULAR_SEIYUU_IDS.length)];
        if (!excludeIds.has(randomId.toString())) {
          await delay(200);
          const data = await rateLimitedFetch(`${SHIKIMORI_REST_API}/people/${randomId}`);
          if (data && data.id && data.is_seyu) {
            return data;
          }
        }
      } else {
        // Случайный ID из диапазона
        const randomId = Math.floor(Math.random() * 3000) + 1;
        if (!excludeIds.has(randomId.toString())) {
          await delay(200);
          const data = await rateLimitedFetch(`${SHIKIMORI_REST_API}/people/${randomId}`);
          if (data && data.id && data.is_seyu) {
            return data;
          }
        }
      }
    } catch (error) {
      console.error('Error fetching random seiyuu:', error);
    }
  }
  return null;
}

// Функция для получения случайного персонажа с проверкой
async function getRandomValidCharacter(excludeIds: Set<string>, maxAttempts = 10): Promise<any | null> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      // Сначала пробуем популярных
      if (Math.random() < 0.7 || i < 5) {
        const randomId = POPULAR_CHARACTER_IDS[Math.floor(Math.random() * POPULAR_CHARACTER_IDS.length)];
        if (!excludeIds.has(randomId.toString())) {
          await delay(200);
          const data = await rateLimitedFetch(`${SHIKIMORI_REST_API}/characters/${randomId}`);
          if (data && data.id && data.image) {
            return data;
          }
        }
      } else {
        // Случайный ID из диапазона
        const randomId = Math.floor(Math.random() * 50000) + 1;
        if (!excludeIds.has(randomId.toString())) {
          await delay(200);
          const data = await rateLimitedFetch(`${SHIKIMORI_REST_API}/characters/${randomId}`);
          if (data && data.id && data.image) {
            return data;
          }
        }
      }
    } catch (error) {
      console.error('Error fetching random character:', error);
    }
  }
  return null;
}

// Получить роли сейю через REST API
async function getPersonRoles(personId: number) {
  const url = `${SHIKIMORI_REST_API}/people/${personId}`;
  const data = await rateLimitedFetch(url);
  
  const roles = data.roles || [];
  
  return {
    person: data,
    roles: roles.filter((role: any) => role.characters && role.characters.length > 0)
  };
}

// Получить сейю персонажа через REST API
async function getCharacterSeiyuu(characterId: number) {
  const url = `${SHIKIMORI_REST_API}/characters/${characterId}`;
  const data = await rateLimitedFetch(url);
  
  return {
    character: data,
    seiyuu: data.seyu || []
  };
}

// Получить случайного сейю с его персонажами
export async function getSeiyuuGameData(attempt = 0): Promise<any> {
  if (attempt > 15) {
    throw new Error('Too many failed attempts to generate game data');
  }

  try {
    const randomSeiyuuId = POPULAR_SEIYUU_IDS[Math.floor(Math.random() * POPULAR_SEIYUU_IDS.length)];
    
    console.log(`Fetching seiyuu ${randomSeiyuuId} via REST API...`);
    await delay(250);
    
    const { person, roles } = await getPersonRoles(randomSeiyuuId);

    if (!person || !person.id) {
      console.log('Invalid person data, retrying...');
      await delay(500);
      return getSeiyuuGameData(attempt + 1);
    }

    const allCharacters: any[] = [];
    roles.forEach((role: any) => {
      if (role.characters) {
        role.characters.forEach((char: any) => {
          if (char.id && char.name && char.image) {
            allCharacters.push(char);
          }
        });
      }
    });

    console.log(`Found ${allCharacters.length} characters`);
    
    if (allCharacters.length < 8) {
      console.log(`Not enough characters (${allCharacters.length}), trying another seiyuu...`);
      await delay(500);
      return getSeiyuuGameData(attempt + 1);
    }

    const shuffledCharacters = allCharacters.sort(() => Math.random() - 0.5);
    const correctCharacters = shuffledCharacters.slice(0, 8);
    const voicedCharacterIds = new Set(allCharacters.map((char: any) => char.id.toString()));

    // Используем улучшенный поиск неправильного персонажа
    console.log('Finding wrong character...');
    const wrongCharacter = await getRandomValidCharacter(voicedCharacterIds, 20);

    if (!wrongCharacter) {
      console.log('Could not find wrong character, retrying...');
      await delay(500);
      return getSeiyuuGameData(attempt + 1);
    }

    const allOptions = [...correctCharacters, wrongCharacter];
    const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);
    const wrongAnswerIndex = shuffledOptions.findIndex((char: any) => 
      char.id.toString() === wrongCharacter.id.toString()
    );

    console.log('Game data generated successfully');
    
    return {
      mainEntity: {
        id: person.id,
        name: person.name,
        russian: person.russian,
        image: person.image,
        url: person.url,
      },
      options: shuffledOptions,
      correctAnswer: wrongAnswerIndex,
    };
  } catch (error) {
    console.error('Error in getSeiyuuGameData:', error);
    await delay(2000);
    return getSeiyuuGameData(attempt + 1);
  }
}

// Получить случайного персонажа с сейю
export async function getCharacterGameData(attempt = 0): Promise<any> {
  if (attempt > 15) {
    throw new Error('Too many failed attempts to generate game data');
  }

  try {
    const randomCharacterId = POPULAR_CHARACTER_IDS[Math.floor(Math.random() * POPULAR_CHARACTER_IDS.length)];
    
    console.log(`Fetching character ${randomCharacterId} via REST API...`);
    await delay(250);
    
    const { character, seiyuu } = await getCharacterSeiyuu(randomCharacterId);

    if (!character || !character.id) {
      console.log('Invalid character data, retrying...');
      await delay(500);
      return getCharacterGameData(attempt + 1);
    }

    if (seiyuu.length === 0) {
      console.log('Character has no seiyuu, trying another...');
      await delay(500);
      return getCharacterGameData(attempt + 1);
    }

    const correctSeiyuu = seiyuu[0];
    const selectedIds = new Set([correctSeiyuu.id.toString()]);

    console.log('Fetching wrong seiyuu...');
    
    // Используем улучшенный поиск неправильных сейю
    const wrongSeiyuuList = [];
    for (let i = 0; i < 8; i++) {
      const wrongSeiyuu = await getRandomValidSeiyuu(selectedIds, 15);
      if (wrongSeiyuu) {
        wrongSeiyuuList.push(wrongSeiyuu);
        selectedIds.add(wrongSeiyuu.id.toString());
      }
      await delay(200);
    }

    if (wrongSeiyuuList.length < 8) {
      console.log('Not enough seiyuu data, retrying...');
      await delay(500);
      return getCharacterGameData(attempt + 1);
    }

    const allOptions = [correctSeiyuu, ...wrongSeiyuuList];
    const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);
    const correctAnswerIndex = shuffledOptions.findIndex((s: any) => 
      s.id.toString() === correctSeiyuu.id.toString()
    );

    console.log('Game data generated successfully');

    return {
      mainEntity: {
        id: character.id,
        name: character.name,
        russian: character.russian,
        image: character.image,
        url: character.url,
      },
      options: shuffledOptions.slice(0, 9),
      correctAnswer: correctAnswerIndex,
    };
  } catch (error) {
    console.error('Error in getCharacterGameData:', error);
    await delay(2000);
    return getCharacterGameData(attempt + 1);
  }
}