import { NextApiRequest, NextApiResponse } from 'next'
import connect from '../../../utils/dbConnection'

interface ErrorResponseType {
  error: string;
}

interface SuccessResponseType {
  name: string;
  email: string;
  phone: string;
  translator: boolean;
  languages: [];
  points: number;
  available_hours: Record<string, number[]>;
  plataforms: string[];
  reviews: Record<string, number[]>;
  appointments: {
    date: string;
  }[];
  _id: string;
}

export default async (req: NextApiRequest, res: NextApiResponse<SuccessResponseType | ErrorResponseType>
  ): Promise<void> => {

    if (req.method === 'GET') {
      // Init Get request
      const { email } = req.query

      // If email not provided in the request return error
      if (!email) {
        res.status(400).json({ error: 'Provide valid email' })

        return;
      }

      const { db } = await connect()

      //  find user in the mongoDb by Email
      const response = await db.collection('users').findOne({ email })

      //  If response is empty return email not found
      if (!response) {
        res.status(400).json({ error: 'Email not found' })

        return;
      }

      res.status(200).json(response)
    } else {
      res.status(400).json({ error: 'Request method not allowed' })
    }
}

// The route Create Users { tranlator and regular } and list them getting by email.