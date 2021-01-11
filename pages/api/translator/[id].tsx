import { NextApiRequest, NextApiResponse } from 'next'
import { ObjectID } from 'mongodb'
import connect from '../../../utils/dbConnection'

interface ErrorResponseType {
  error: string;
}

interface SuccessResponseType {
  name: string;
  email: string;
  phone: string;
  translator: string;
  languages: [];
  points: number;
  available_hours: object;
  plataforms: string[];
  reviews: object[];
  appointments: object[];
  _id: string;
}

export default async (req: NextApiRequest, res: NextApiResponse<SuccessResponseType | ErrorResponseType>
  ): Promise<void> => {

    if (req.method === 'GET') {
      // init get translator by id
      const id = req.query.id as string;

      // if translator not provided in the request return error
      if (!id) {
        res.status(400).json({ error: 'Provide valid translator id' })

        return;
      }

      const { db } = await connect()

      const response = await db.collection('users').findOne({ _id: new ObjectID(id) })

      // if translator not found return error
      if (!response) {
        res.status(400).json({ error: 'translator id not found' })

        return;
      }

      res.status(200).json(response)
    } else {
      res.status(400).json({ error: 'Request method not allowed' })
    }
}