// 文献数据类型定义

export interface Literature {
  id: string;
  title: string;
  titleEn?: string;
  authors: string[];
  abstract: string;
  abstractEn?: string;
  publication: string;
  year: number;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  pmid?: string;
  pmcid?: string;
  keywords: string[];
  keywordsEn?: string[];
  itemType: 'journalArticle' | 'conferencePaper' | 'book' | 'thesis';
  language: 'zh' | 'en';
  url?: string;
  isOA: boolean;
  citations?: number;
  aiSummary?: string;
  entities?: Entity[];
  tags: string[];
  dateAdded: string;
}

export interface Entity {
  id: string;
  name: string;
  type: EntityType;
  confidence: number;
}

export type EntityType = 
  | 'drug'           // 药物
  | 'disease'        // 疾病
  | 'mechanism'      // 机制
  | 'component'      // 成分
  | 'institution'    // 机构
  | 'symptom'        // 症状
  | 'treatment'      // 治疗方法
  | 'pathway';       // 信号通路

export interface Relation {
  source: string;
  target: string;
  relation: string;
  confidence: number;
}

export interface KnowledgeGraph {
  entities: Entity[];
  relations: Relation[];
}

export interface SearchFilters {
  yearStart?: number;
  yearEnd?: number;
  publication?: string;
  itemType?: string;
  language?: 'zh' | 'en' | 'all';
  isOA?: boolean;
  keywords?: string[];
}

export interface SearchResult {
  items: Literature[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Literature[];
  timestamp: Date;
}

export interface Statistics {
  totalLiterature: number;
  totalJournals: number;
  totalAuthors: number;
  yearRange: [number, number];
  languageDistribution: { zh: number; en: number };
  typeDistribution: Record<string, number>;
  yearlyTrend: { year: number; count: number }[];
  topJournals: { name: string; count: number }[];
  topKeywords: { name: string; count: number }[];
}

export interface DocumentAccess {
  literatureId: string;
  hasFullText: boolean;
  accessType: 'open' | 'institution' | 'purchase' | 'none';
  sourceUrl?: string;
  doiUrl?: string;
  pubmedUrl?: string;
  publisherUrl?: string;
}
