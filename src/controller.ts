import { ObjectId } from 'bson'
import { Request, Response } from 'express'
import { dbClient } from './database'


interface PerfReviewEntity {
  _id: ObjectId
  name: string
  description?: string
  launchingPeriod: { from: Date, to: Date }
  timelines: Array<{ event: string, from: Date, to: Date }>
}

export const ping = (req: Request, res: Response): void => {
  res.json({
    status: 'CONNECTED'
  })
}

export const getManyPerfReview = async (req: Request, res: Response) => {
  const perfReviews = await dbClient.findMany<PerfReviewEntity>({})
  res.json(perfReviews)
}

export const createPerfReview = async (req: Request, res: Response) => {
  if((req.body.name) && (req.body.description) && (req.body.launchingPeriod.from) && (req.body.launchingPeriod.to) && (req.body.timelines)) {
  if((await dbClient.checkDateInput(req.body.launchingPeriod.from)) && (await dbClient.checkDateInput(req.body.launchingPeriod.to))) {
  const perfReview = req.body;
  const launchingPeriodFrom = new Date(perfReview.launchingPeriod.from);
  const launchingPeriodTo = new Date(perfReview.launchingPeriod.to);
  let j = 0;
  let checkDate = true;
  for (j = 0; j < perfReview.timelines.length; j++)
  {
    if((await dbClient.checkDateInput(perfReview.timelines[j].from)) && (await dbClient.checkDateInput(perfReview.timelines[j].to))) {
    const timelineFrom = new Date(perfReview.timelines[j].from);
    const timelineTo = new Date(perfReview.timelines[j].to);
    if ((timelineFrom < launchingPeriodFrom) || (timelineTo > launchingPeriodTo)) {
      checkDate = false;
   }
  }
  else {
    return res.status(400).send({ error: true, message: 'Date timeline wrong !!!' });
  }
  }
  let checkName = true;
  const anyDuplicatedReview = await dbClient.findOne<PerfReviewEntity>({ name: req.body.name })
  if(anyDuplicatedReview) {
    checkName = false;
  }
   if(checkName && checkDate) {
    const perfReviews = await dbClient.insertOne(perfReview)
    res.json(perfReviews)
   } else {
    return res.status(400).send({ error: true, message: 'Date wrong or name already exist !!!' });
   }
  } else {
    return res.status(400).send({ error: true, message: 'Date launchingPeriod wrong!!!' });
  }
  } else {
    return res.status(400).send({ error: true, message: 'Not Empty !!!.'});
  }
}

export const updatePerfReview = async (req: Request, res: Response) => {
  const checkId = await dbClient.findOne<PerfReviewEntity>({ _id: new ObjectId(req.body.id) });
  if(checkId) {
  if((await dbClient.checkDateInput(req.body.launchingPeriod.from)) && (await dbClient.checkDateInput(req.body.launchingPeriod.to))) {
    const perfReview = req.body;
    const id = new ObjectId(req.body.id);
    const launchingPeriodFrom = new Date(perfReview.launchingPeriod.from);
    const launchingPeriodTo = new Date(perfReview.launchingPeriod.to);
    let j = 0;
    let checkDate = true;
    for (j = 0; j < perfReview.timelines.length; j++)
    {
      if((await dbClient.checkDateInput(perfReview.timelines[j].from)) && (await dbClient.checkDateInput(perfReview.timelines[j].to))) {
      const timelineFrom = new Date(perfReview.timelines[j].from);
      const timelineTo = new Date(perfReview.timelines[j].to);
      if ((timelineFrom < launchingPeriodFrom) || (timelineTo > launchingPeriodTo)) {
        checkDate = false;
     }
    }
    else {
      return res.status(400).send({ error: true, message: 'Date timeline wrong !!!' });
    }
    }
    let checkName = true;
    const anyDuplicatedReview = await dbClient.findOne<PerfReviewEntity>({ name: req.body.name })
    if((anyDuplicatedReview) && (id.equals(anyDuplicatedReview._id) === false)) {
      checkName = false;
    }
     if(checkName && checkDate) {
      const perfReviews = await dbClient.findOneAndUpdate(id, perfReview)
      res.json(perfReviews)
     } else {
      return res.status(400).send({ error: true, message: 'Date wrong or name already exist !!!' });
     }
    } else {
      return res.status(400).send({ error: true, message: 'Date launchingPeriod wrong!!!' });
    }
  } else {
    return res.status(400).send({ error: true, message: 'Bland id.'});
  }
}

export const deletePerfReview = async (req: Request, res: Response) => {
if (req.body.id) {
  const id = new ObjectId(req.body.id);
  const checkId = await dbClient.findOne<PerfReviewEntity>({ _id: id });
  if(checkId) {
    const perfReviews = await dbClient.deleteOne(id);
    return res.status(200).send({ error: false, message: 'sucessfully' })
  }
  return res.status(400).send({ error: true, message: 'Invalid id.'});
} else {
  return res.status(400).send({ error: true, message: 'Bland id.'});
}
}
