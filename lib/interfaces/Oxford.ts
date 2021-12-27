export interface MainEntry {
  metadata: object;
  results: Result[];
}

export interface Result {
  id: string;
  language: string;
  lexicalEntries: LexicalEntry[];
  pronunciations: Pronunciation[];
  type: string;
}

export interface LexicalEntry {
  compounds: DomainLang[];
  derivativeOf: DomainLang[];
  derivatives: DomainLang[];
  entries: Entry[];
  grammaticalFeatures: IdTextType[];
  language: string;
  lexicalCategory: IdText;
  notes: Note[];
  phrasalVerbs: DomainLang[];
  phrases: DomainLang[];
  pronunciations: Pronunciation[];
  root: string;
  text: string;
  variantForms: VariantForm[];
}

export interface Pronunciation {
  audioFile: string;
  dialects: string[];
  phoneticNotation: string;
  phoneticSpelling: string;
  regions: IdText[];
  registers: IdText[];
}

export interface DomainLang {
  domains: IdText[];
  id: string;
  language: string;
  regions: IdText[];
  registers: IdText[];
  text: string;
}

export interface Entry {
  crossReferenceMarkers: string[];
  crossReferences: IdTextType[];
  etymologies: string[];
  grammaticalFeatures: IdTextType[];
  homographNumber: string;
  inflections: InflectedForm[];
  notes: Note[];
  pronunciations: Pronunciation[];
  senses: Sense[];
  variantForms: VariantForm[];
}

export interface IdTextType {
  id: string;
  text: string;
  type: string;
}

export interface IdText {
  id: string;
  text: string;
}

export interface Note {
  id: string;
  text: string;
  type: string;
}

export interface VariantForm {
  domains: IdText[];
  notes: Note[];
  pronunciations: Pronunciation[];
  regions: IdText[];
  registers: IdText[];
  text: string;
}

export interface InflectedForm {
  domains: IdText[];
  grammaticalFeatures: IdTextType[];
  inflectedForm: string;
  lexicalCategory: IdText;
  pronunciations: Pronunciation[];
  regions: IdText[];
  registers: IdText[];
}

export interface Sense {
  antonyms: DomainLang[];
  constructions: Construction[];
  crossReferenceMarkers: string[];
  crossReferences: IdTextType[];
  definitions: string[];
  domainClasses: IdText[];
  domains: IdText[];
  etymologies: string[];
  examples: Example[];
  id: string;
  inflections: InflectedForm[];
  notes: Note[];
  pronunciations: Pronunciation[];
  regions: IdText[];
  registers: IdText[];
  semanticClasses: IdText[];
  shortDefinitions: string[];
  subsenses: Sense[];
  synonyms: DomainLang[];
  thesaurusLinks: ThesaurusLink[];
  variantForms: VariantForm[];
}

export interface Construction {
  domains: IdText[];
  examples: string[];
  notes: Note[];
  regions: IdText[];
  registers: IdText[];
  text: string;
}

export interface Example {
  definitions: string[];
  domains: IdText[];
  notes: Note[];
  regions: IdText[];
  registers: IdText[];
  senseIds: string[];
  text: string;
}

export interface ThesaurusLink {
  entry_id: string;
  sense_id: string;
}