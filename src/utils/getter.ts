import type {
  DictionaryItem,
  Meaning,
  Definition,
  Phonetic,
} from '../types/dictionary.ts'
import { escapeMarkdownV2 } from './markdown.ts'

export function getPhonetics(item: DictionaryItem): string[] {
  const uniquePhonetics: string[] = []

  if (item.phonetic) {
    uniquePhonetics.push(item.phonetic)
  }

  item.phonetics?.forEach((phonetic: Phonetic) => {
    if (phonetic.text && !uniquePhonetics.includes(phonetic.text)) {
      uniquePhonetics.push(phonetic.text)
    }
  })

  return uniquePhonetics.map((phonetic: string) => escapeMarkdownV2(phonetic))
}

export function getSynonyms(meaning: Meaning): string[] {
  const uniqueSynonyms: string[] = []

  meaning.synonyms.forEach((synonym: string) => {
    if (synonym && !uniqueSynonyms.includes(synonym)) {
      uniqueSynonyms.push(synonym)
    }
  })

  meaning.definitions.forEach((definition: Definition) => {
    definition.synonyms.forEach((synonym: string) => {
      if (synonym && !uniqueSynonyms.includes(synonym)) {
        uniqueSynonyms.push(synonym)
      }
    })
  })

  return uniqueSynonyms.map((synonym: string) => escapeMarkdownV2(synonym))
}

export function getAntonyms(meaning: Meaning): string[] {
  const uniqueAntonyms: string[] = []

  meaning.antonyms.forEach((antonym: string) => {
    if (antonym && !uniqueAntonyms.includes(antonym)) {
      uniqueAntonyms.push(antonym)
    }
  })

  meaning.definitions.forEach((definition: Definition) => {
    definition.antonyms.forEach((antonym: string) => {
      if (antonym && !uniqueAntonyms.includes(antonym)) {
        uniqueAntonyms.push(antonym)
      }
    })
  })

  return uniqueAntonyms.map((antonym: string) => escapeMarkdownV2(antonym))
}
