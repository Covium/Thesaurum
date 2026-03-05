import * as dotenv from 'dotenv'

dotenv.config({ quiet: true })

export const getBotToken = (): string => {
  const token = process.env.BOT_TOKEN
  if (!token) {
    throw new Error('BOT_TOKEN is not set!')
  }
  return token
}

export const getDictionaryApiPath = (): string => {
  const apiPath = process.env.DICTIONARY_API_PATH
  if (!apiPath) {
    throw new Error('DICTIONARY_API_PATH is not set!')
  }
  return apiPath
}
