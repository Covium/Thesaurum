import type { InlineQueryResultArticle } from 'telegraf/types'
import type { DictionaryItem } from '../types/dictionary.ts'
import {
  formatTitle,
  formatDescription,
  fitMessage,
} from '../utils/formatter.ts'
import { getDictionaryApiPath } from '../config/env.ts'

export const handleInlineQuery = async (
  query: string,
): Promise<InlineQueryResultArticle[]> => {
  const result: InlineQueryResultArticle[] = []
  if (!query) return result

  const response = await fetch(`${getDictionaryApiPath()}${query}`).catch(
    (error) => {
      console.error('Error fetching from dictionary API:', error)
    },
  )
  if (!response) return result

  if (response.ok) {
    try {
      const data: DictionaryItem[] = await response.json()

      data.forEach((item, index) => {
        result.push({
          type: 'article',
          id: index.toString(),
          title: formatTitle(item),
          description: formatDescription(item),
          input_message_content: {
            message_text: fitMessage(item),
            parse_mode: 'MarkdownV2',
            link_preview_options: {
              is_disabled: true,
            },
          },
        })
      })
    } catch (error) {
      console.error('Error processing dictionary data:', error)
    }
  }

  return result
}
