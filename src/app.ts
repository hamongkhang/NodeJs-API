import express from 'express'
import bodyParser from 'body-parser'

// Controllers (route handlers)
import * as controller from './controller'
import { dbClient } from './database'
import { MONGODB_URI } from './util'

// Create Express server
const app = express()

// Connect to MongoDB
dbClient.connect(MONGODB_URI)

// Express configuration
app.set('port', process.env.PORT || 3000)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

/**
 * Primary app routes.
 */
app.get('/', controller.ping)
app.get('/reviews', controller.getManyPerfReview)
app.post('/reviews', controller.createPerfReview)
app.put('/reviews/:id', controller.updatePerfReview)
app.delete('/reviews/:id', controller.deletePerfReview)

export default app
