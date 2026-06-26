export interface Brand {
  id: string;
  name: string;
  audience: string | null;
  tone: string | null;
  history: string | null;
  doList: string | null;
  dontList: string | null;
  searchTerms: string | null;
  email: string;
  sendTime: string;
  ideasPerRun: number;
  active: boolean;
  createdAt: string;
  _count?: { ideas: number };
  ideas?: Idea[];
}

export interface Idea {
  id: string;
  brandId: string;
  headline: string;
  platform: string;
  format: string;
  whyNow: string;
  execution: string;
  score: number;
  sourceSignals: string | null;
  imageUrl: string | null;
  createdAt: string;
}
