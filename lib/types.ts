export interface Person {
  id: string;
  name: string;
  russian: string;
  image: {
    original: string;
  };
  url: string;
}

export interface Character {
  id: string;
  name: string;
  russian: string;
  image: {
    original: string;
  };
  url: string;
}

export interface Role {
  rolesEn: string[];
  rolesRu: string[];
  character?: Character;
  person?: Person;
}

export interface GameData {
  mainEntity: Person | Character;
  options: (Character | Person)[];
  correctAnswer: number;
}

export type GameMode = 'seiyuu' | 'character';