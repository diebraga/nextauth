import { NextApiRequest, NextApiResponse } from 'next'
import connect from '../../utils/dbConnection'

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
    if (req.method === 'POST') {
      // Init Post request
      const { 
        name, 
        email, 
        phone, 
        translator, 
        languages, 
        available_hours, 
        plataforms 
      }: {
        name: string;
        email: string;
        phone: string;
        translator: boolean;
        languages: [];
        points: number;
        available_hours: Record<string, number[]>;
        plataforms: string[];      
      } = req.body;

      // Validation
      if (!translator) { // if translator === false post params down bellow
        if (!name || !email || !phone) {
          res.status(400).json({ error: 'param not provided' })
  
          return;
        }  
      } else if (translator) { // if translator === true post params down bellow
        if (!name || !email || !phone || !languages || !available_hours || !plataforms) {
          res.status(400).json({ error: 'param not provided' })
  
          return;
        }  
      }

      const { db } = await connect()

      // insert user to database
      const response = await db.collection('users').insertOne({
        name,
        email, 
        phone, 
        translator,
        points: 1,
        languages: languages || [],
        available_hours: available_hours || {},
        plataforms: plataforms || [],
        reviews: [],
        appointments: [],  
      })
      
      res.status(200).json(response.ops[0])

    } else {
      res.status(400).json({ error: 'Request method not allowed' })
    }
}

// The route Create Users { tranlator and regular }.