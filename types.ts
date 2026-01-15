
export enum Screen {
  HOME = 'HOME',
  RITUAL = 'RITUAL',
  RESULT = 'RESULT',
  DETAIL = 'DETAIL',
  PROFILE = 'PROFILE',
  HISTORY = 'HISTORY',
  CULTURE = 'CULTURE',
  CULTURE_DETAIL = 'CULTURE_DETAIL',
  COLLECTION = 'COLLECTION',
  SETTINGS = 'SETTINGS',
  FEEDBACK = 'FEEDBACK',
  ORIGIN_STORY = 'ORIGIN_STORY'
}

export interface Coin {
  id: number;
  type: 'UPPER' | 'MIDDLE' | 'LOWER';
  label: string;
  rotation: number;
  x: number;
  y: number;
}

export interface HexagramData {
  id: string;
  number: string; // e.g., "第十二卦"
  name: string; // e.g., "大安"
  nature: string; // e.g., "上吉"
  subTitle: string; // e.g., "万事大吉" or "山天大畜"
  description: string; // e.g., "身不动，无磨难..." (Judgment / 卦辞)
  xiang?: string; // e.g. "天在山中..." (Image / 象曰)
  poem: string; // The 4-character poem
  guidance: {
    wealth: string;
    health: string;
    travel: string;
    love: string;
  };
  date?: string; // For history
}

export interface HistoryItem extends HexagramData {
  timestamp: number;
  queryType?: string; // e.g., '财运'
}

export interface ArticleData {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  image: string;
  content: string;
}
