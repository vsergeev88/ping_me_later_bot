import { COMMANDS } from "./enums"
import { getSeconds } from "./helpers"

export const WELCOME_STICKER = 'https://cdn.tlgrm.ru/stickers/f14/450/f144501a-5618-40e9-bbc6-4ffe634d9e79/96/5.webp'

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export const BOT_COMMANDS = [
  { command: COMMANDS.START, description: 'Start the bot' },
  { command: COMMANDS.REMINDERS, description: 'My active reminders' },
  { command: COMMANDS.TIME_ZONE, description: 'Set timezone' },
]

export const GMT: Record<string, number> = {
  ['GMT−11']: -getSeconds(11),
  ['GMT−10']: -getSeconds(10),
  ['GMT−9']: -getSeconds(9),
  ['GMT−8']: -getSeconds(8),
  ['GMT−7']: -getSeconds(7),
  ['GMT−6']: -getSeconds(6),
  ['GMT−5']: -getSeconds(5),
  ['GMT−4']: -getSeconds(4),
  ['GMT−3']: -getSeconds(3),
  ['GMT−2']: -getSeconds(2),
  ['GMT−1']: -getSeconds(1),
  ['GMT+0']: 0,
  ['GMT+1']: getSeconds(1),
  ['GMT+2']: getSeconds(2),
  ['GMT+3']: getSeconds(3),
  ['GMT+4']: getSeconds(4),
  ['GMT+5']: getSeconds(5),
  ['GMT+5:30']: getSeconds(5, 30),
  ['GMT+5:45']: getSeconds(5, 45),
  ['GMT+6']: getSeconds(6),
  ['GMT+7']: getSeconds(7),
  ['GMT+8']: getSeconds(8),
  ['GMT+9']: getSeconds(9),
  ['GMT+10']: getSeconds(10),
  ['GMT+11']: getSeconds(11),
  ['GMT+12']: getSeconds(12),
}
