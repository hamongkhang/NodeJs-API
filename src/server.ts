import app from './app'
import { logger } from './util'

/**
 * Start Express server.
 */
const server = app.listen(app.get('port'), () => {
  logger.info(`  App is running at http://localhost:${app.get('port')} in ${app.get('env')} mode`)
})

export default server
