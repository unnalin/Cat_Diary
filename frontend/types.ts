export enum CatState {
  IDLE = 'idle',
  WALKING = 'walking',
  SURPRISED = 'surprised',
  LOVED = 'loved',
  SAD = 'sad',
  ANGRY = 'angry'
}

export enum CatSkin {
  BLACK = 'black',
  GRAY = 'gray',
  ORANGE_TABBY = 'orange_tabby',
  COW = 'cow',
  SIAMESE = 'siamese'
}

export interface CatAppearance {
  skin: CatSkin;
  eyeColor: string;
  collarColor: string;
  bellColor: string;
}

export interface PageBackground {
  id: string;
  name: string;
  gradient: string;
  patternType: 'sakura' | 'leaf' | 'star' | 'heart' | 'paw' | 'none';
  patternColor: string;
}

export type BackgroundTexture = 'none' | 'dots' | 'paws' | 'lines' | 'grid';

export interface Coordinates {
  x: number;
  y: number;
}

export type Mood = 'happy' | 'sad' | 'calm' | 'excited' | 'tired' | 'neutral' | 'angry' | 'confused';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'cat';
  text: string;
  timestamp: number;
}

export interface DiaryTheme {
  id: string;
  name: string;
  color: string; // Cover color
  pattern: string; // Cover pattern
  textColor: string; // Cover text color
  paperColor: string; // Inner page background color
  paperPattern: string; // Inner page CSS pattern
  accentColor: string; // Inner page header/border color
}

export interface DiaryEntry {
  id: string;
  date: string; // ISO string
  mood: Mood;
  content: string;
  themeId: string;
}

export type Language = 'en' | 'zh';