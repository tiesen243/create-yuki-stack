import Elysia from 'elysia'

export const loggerPlugin = new Elysia()
  .derive({ as: 'global' }, ({ request }) => {
    const { method, url } = request
    const { pathname } = new URL(url)

    const color =
      {
        GET: COLORS.green,
        POST: COLORS.blue,
        PUT: COLORS.yellow,
        PATCH: COLORS.magenta,
        DELETE: COLORS.red,
      }[method] ?? COLORS.white

    const time = new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })

    const space = ' '.repeat(7 - method.length)
    const base = `${COLORS.reset}[${color}${method}${COLORS.reset}]${space}${COLORS.gray}${time}${COLORS.reset} ${COLORS.brightGreen}${pathname}${COLORS.reset}`

    return {
      logger: {
        info: (message: string) => {
          console.info(`${base} - ${COLORS.white}${message}${COLORS.reset}`)
        },
        success: (message: string) => {
          console.log(`${base} - ${COLORS.cyan}${message}${COLORS.reset}`)
        },
        warn: (message: string) => {
          console.warn(`${base} - ${COLORS.yellow}${message}${COLORS.reset}`)
        },
        error: (message: string) => {
          console.error(`${base} - ${COLORS.red}${message}${COLORS.reset}`)
        },
      },
    }
  })
  .state('startTiem', 0)
  .onRequest(({ store }) => {
    store.startTiem = performance.now()
  })
  .onAfterHandle({ as: 'global' }, ({ logger, store: { startTiem } }) => {
    const endTime = performance.now()
    const duration = (endTime - startTiem).toFixed(2)
    logger.info(`took ${duration}ms`)
  })

const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',

  brightRed: '\x1b[91m',
  brightGreen: '\x1b[92m',
  brightYellow: '\x1b[93m',
  brightBlue: '\x1b[94m',
  brightMagenta: '\x1b[95m',
  brightCyan: '\x1b[96m',
}
