import type {
  DictionaryItem,
  Meaning,
  Definition,
} from '../types/dictionary.ts'
import { escapeMarkdownV2 } from './markdown.ts'
import { getSynonyms, getAntonyms, getPhonetics } from './getter.ts'

const formatSources = (sourceUrls: string[] = []): string => {
  return sourceUrls.length > 0
    ? sourceUrls
        .map(
          (source: string, index: number) => `[\\[${index + 1}\\]](${source})`,
        )
        .join(' ')
    : ''
}

const formatDefinition = (
  definition: Definition,
  form: 'short' | 'full' = 'full',
  index: number = 0,
): string => {
  switch (form) {
    case 'short':
      return definition.definition
    default:
    case 'full':
      return (
        `${index + 1}\\. ` +
        `${escapeMarkdownV2(definition.definition)}` +
        `${
          definition.example ? `\n>${escapeMarkdownV2(definition.example)}` : ''
        }`
      )
  }
}

const formatMeaning = (
  meaning: Meaning,
  form: 'short' | 'full' = 'full',
): string => {
  switch (form) {
    case 'short':
      return (
        `${meaning.partOfSpeech}: ` +
        `${meaning.definitions
          .map((definition: Definition) =>
            formatDefinition(definition, 'short'),
          )
          .join(' ')}`
      )
    default:
    case 'full':
      return (
        `___${escapeMarkdownV2(meaning.partOfSpeech)}_\r__\n` +
        `${meaning.definitions
          .map((definition: Definition, index: number) =>
            formatDefinition(definition, 'full', index),
          )
          .join('\n')}` +
        `${meaning.synonyms.length > 0 || meaning.antonyms.length > 0 ? '\n' : ''}` +
        `${
          meaning.synonyms.length > 0
            ? `\nSynonyms: ${getSynonyms(meaning)
                .map((synonym: string) => `_${synonym}_`)
                .join(', ')}\\.`
            : ''
        }` +
        `${
          meaning.antonyms.length > 0
            ? `\nAntonyms: ${getAntonyms(meaning)
                .map((antonym: string) => `_${antonym}_`)
                .join(', ')}\\.`
            : ''
        }`
      )
  }
}

export const formatTitle = (item: DictionaryItem): string => {
  return `${item.word} ${getPhonetics(item).join(' ')}`
}

export const formatDescription = (item: DictionaryItem): string => {
  return `${item.meanings
    .map((meaning: Meaning) => formatMeaning(meaning, 'short'))
    .join('\n')}`
}

const formatMessage = (item: DictionaryItem): string => {
  return (
    `*${escapeMarkdownV2(item.word)}* ${formatSources(item.sourceUrls)}\n` +
    `${
      item.phonetic || (item.phonetics?.length && item.phonetics.length > 0)
        ? getPhonetics(item)
            .map((phonetic: string) => `\`${phonetic}\``)
            .join(' ') + '\n'
        : ''
    }\n` +
    `${item.meanings
      .map((meaning: Meaning) => formatMeaning(meaning, 'full'))
      .join('\n\n')}`
  )
}

// Remove least known definitions from most populated meanings until symbol limit is reached.
export const fitMessage = (item: DictionaryItem): string => {
  const workingItem = JSON.parse(JSON.stringify(item)) as DictionaryItem

  let formattedMessage = formatMessage(workingItem)

  while (
    formattedMessage.length > 4096 &&
    workingItem.meanings.some((meaning) => meaning.definitions.length > 0)
  ) {
    const meaningToModify = workingItem.meanings.reduce(
      (prev: Meaning, current: Meaning) =>
        prev.definitions.length > current.definitions.length ? prev : current,
    )

    if (meaningToModify) {
      meaningToModify.definitions.pop()

      if (meaningToModify.definitions.length === 0) {
        const index = workingItem.meanings.indexOf(meaningToModify)
        if (index !== -1) {
          workingItem.meanings.splice(index, 1)
        }
      }

      formattedMessage = formatMessage(workingItem)
    }
  }

  return formattedMessage
}
