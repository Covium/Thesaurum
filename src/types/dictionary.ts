export type Phonetic = {
  text?: string
  audio?: string
  sourceUrl?: string
  license?: License
}

export type Meaning = {
  partOfSpeech: string
  synonyms: string[]
  antonyms: string[]
  definitions: Definition[]
}

export type Definition = {
  definition: string
  synonyms: string[]
  antonyms: string[]
  example?: string
}

export type DictionaryItem = {
  word: string
  phonetic?: string
  phonetics?: Phonetic[]
  meanings: Meaning[]
  license?: License
  sourceUrls?: string[]
}

export type License = {
  name: string
  url: string
}
