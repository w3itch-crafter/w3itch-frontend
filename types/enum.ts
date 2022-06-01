export enum GamesListSortBy {
  RATE = 'rate',
  TIME = 'updatedAt',
}

export enum ProjectClassification {
  GAMES = 'GAMES',
}

export enum GameEngine {
  RM2K3E = 'rm2k3e',
  // @TODO This field is not currently supported in the background
  MINETEST = 'mt',
}

export enum PaymentMode {
  FREE = 'FREE',
  PAID = 'PAID',
  DISABLE_PAYMENTS = 'DISABLE_PAYMENTS',
}

export enum ReleaseStatus {
  RELEASED = 'RELEASED',
  IN_DEVELOPMENT = 'IN_DEVELOPMENT',
  ON_HOLD = 'ON_HOLD',
  CANCELLED = 'CANCELLED',
  PROTOTYPE = 'PROTOTYPE',
}

export enum Genre {
  NO_GENRE = 'NO_GENRE',
  ACTION = 'ACTION',
  ADVENTURE = 'ADVENTURE',
  CARD_GAME = 'CARD_GAME',
  EDUCATIONAL = 'EDUCATIONAL',
  FIGHTING = 'FIGHTING',
  INTERACTIVE_FICTION = 'INTERACTIVE_FICTION',
  PLATFORMER = 'PLATFORMER',
  PUZZLE = 'PUZZLE',
  RACING = 'RACING',
  RHYTHM = 'RHYTHM',
  ROLE_PLAYING = 'ROLE_PLAYING',
  SHOOTER = 'SHOOTER',
  SIMULATION = 'SIMULATION',
  SPORTS = 'SPORTS',
  STRATEGY = 'STRATEGY',
  SURVIVAL = 'SURVIVAL',
  VISUAL_NOVEL = 'VISUAL_NOVEL',
  OTHER = 'OTHER',
}

export enum Community {
  DISQUS = 'DISQUS',
  DISABLED = 'DISABLED',
}

export enum GameFileCharset {
  UTF8 = 'UTF8',
  GBK = 'GBK',
  SHIFT_JIS = 'SHIFT_JIS',
}

/**
 * List of all the networks supported by the Uniswap Interface
 */
export enum UniswapSupportedChainId {
  MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GOERLI = 5,
  KOVAN = 42,
  ARBITRUM_ONE = 42161,
  ARBITRUM_RINKEBY = 421611,
  OPTIMISM = 10,
  OPTIMISTIC_KOVAN = 69,
  POLYGON = 137,
  POLYGON_MUMBAI = 80001,
}

export enum PancakeSwapSupportedChainId {
  BSC_MAINNET = 56,
  BSC_TESTNET = 97,
}

export enum EditorMode {
  CREATE = 'CREATE',
  EDIT = 'EDIT',
}

export enum ThemeMode {
  Light = 'light',
  Dark = 'dark',
  System = 'system',
}

export enum ThemeList {
  Light = 'light',
  Dark = 'dark',
}
