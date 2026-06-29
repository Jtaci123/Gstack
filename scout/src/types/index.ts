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

export interface AgencyProfile {
  id: string;
  name: string;
  tagline: string | null;
  strengths: string | null;
  pastWork: string | null;
  industries: string | null;
  style: string | null;
  credentials: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Prospect {
  id: string;
  companyName: string;
  website: string | null;
  industry: string | null;
  description: string | null;
  signals: string | null;
  painPoints: string | null;
  whyFit: string | null;
  fitScore: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  pitches?: Pitch[];
  _count?: { pitches: number };
}

export interface Pitch {
  id: string;
  prospectId: string;
  bigIdea: string;
  hook: string;
  situation: string;
  insight: string;
  concept: string;
  execution: string;
  whyUs: string;
  whyNow: string;
  callToAction: string;
  dataPoints: string | null;
  createdAt: string;
}
