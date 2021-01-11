import { NextApiRequest, NextApiResponse } from 'next'
import connect from '../../utils/dbConnection'

interface ErrorResponseType {
  error: string;
}

export default async (req: NextApiRequest, res: NextApiResponse<object[] | ErrorResponseType>
  ): Promise<void> => {

    if (req.method === 'GET') {
      // Init get languages
      const { languages } = req.body

      // If param language not provided return error
      if (!languages) {
        res.status(400).json({ error: 'Provide language' })

        return;
      }

      const { db } = await connect()

      // Query returns all users with specified language param 
      const response = await db.collection('users').find({ languages }).toArray()

      // If language not avalible in the db return error
      if (response.length === 0) {
        res.status(400).json({ error: 'Language not available' })

        return;
      }

      res.status(200).json(response)
    } else {
      res.status(400).json({ error: 'Request method not allowed' })
    }
}

// Route search responsable to find all languages avalible in the database