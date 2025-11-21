export interface Definition {
  en: string;
  cn: string;
}

export interface Example {
  en: string;
  cn: string;
}

export interface Collocation {
  phrase: string;
  cn: string;
}

export interface Task {
  instruction: string;
  demo_en: string;
  demo_cn: string;
}

export interface VocabContent {
  core_meaning: string;
  ipa: string;
  definitions: Definition[];
  related_words?: string;
  collocations?: Collocation[];
  examples?: Example[];
  task?: Task;
}

export interface VocabItem {
  word: string;
  pos: string;
  level: number;
  content: VocabContent;
}