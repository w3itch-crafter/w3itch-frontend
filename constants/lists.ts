const UNI_LIST = 'https://tokens.uniswap.org'
const GEMINI_LIST = 'https://www.gemini.com/uniswap/manifest.json'
const PANCAKE_TOP100 = 'https://tokens.pancakeswap.finance/pancakeswap-top-100.json'

// this is the default list of lists that are exposed to users
// lower index == higher priority for token import
const DEFAULT_LIST_OF_LISTS_TO_DISPLAY: string[] = [UNI_LIST, GEMINI_LIST, PANCAKE_TOP100]

export const DEFAULT_LIST_OF_LISTS: string[] = [...DEFAULT_LIST_OF_LISTS_TO_DISPLAY]

// default lists to be 'active' aka searched across
export const DEFAULT_ACTIVE_LIST_URLS: string[] = []
