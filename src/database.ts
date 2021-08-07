import { Collection, Db, Filter, MongoClient } from 'mongodb'
import { logger, USER } from './util'
import { Document, ObjectId } from 'bson'

export class DatabaseClient {
  private uri: string
  private mongo: MongoClient

  private db: Db
  private collection: Collection

  async connect(uri: string): Promise<void> {
    this.uri = uri
    this.mongo = new MongoClient(this.uri)

    try {
      await this.mongo.connect().then(() => logger.debug(`-- Mongo database is connected`))

      this.db = this.mongo.db('nodejs-training')
      this.collection = this.db.collection(USER)
    } catch (err) {
      logger.error(`-- Could not connect Mongo database: ${JSON.stringify(err?.message)}`)
      process.exit(1)
    }
  }

  async findMany<T>(filter: Filter<T>): Promise<T[]> {
    return this.collection.find(filter).toArray()
  }

  async findOne<T>(filter: Filter<T>): Promise<Document> {
    return this.collection.findOne(filter);
  }

   async insertOne<T>(data: Filter<T>): Promise<Document> {
    return await this.collection.insertOne(data)
   }

   async checkDateInput<T>(data: Filter<T>): Promise<Boolean> {
    var comp = data.split('/')
    var d = parseInt(comp[0], 10)
    var m = parseInt(comp[1], 10)
    var y = parseInt(comp[2], 10)
    var date = new Date(y,m-1,d);
    if (date.getFullYear() == y && date.getMonth() + 1 == m && date.getDate() == d) {
      return true
    }
    return false
   }

   async deleteOne(data: ObjectId): Promise<void> {
    await dbClient.collection.deleteOne(
      {_id: data}
    )
  }
  
  async findOneAndUpdate<T>(id: ObjectId, data: Filter<T>): Promise<Document> {
    await dbClient.collection.findOneAndUpdate({_id: id},
    {
      $set: {
        name: data.name,
        description: data.description,
        launchingPeriod: {
          from: data.launchingPeriod.from,
          to: data.launchingPeriod.to
        },
        timelines: data.timelines
      }
    },
    )
      return data;
  }
}
export const dbClient = new DatabaseClient()
