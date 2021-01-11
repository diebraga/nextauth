import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import { ObjectID } from 'mongodb'
import connect from '../../utils/dbConnection'

interface ErrorResponseType {
  error: string;
}

interface SuccessResponseType {
  date: string; 
  translator_name: string; 
  translator_id: string; 
  client_name: string; 
  client_id: string; 
  language: string; 
  plataform: string; 
  appointment_link: string;
}

export default async (req: NextApiRequest, res: NextApiResponse<SuccessResponseType | ErrorResponseType>
  ): Promise<void> => {

    if (req.method === 'POST') {
      const session = await getSession({ req })
      if (!session) {
        res.status(400).json({ error: 'You need to login to access this route' })

        return;
      } 

      // Init post request to create appointment
      const { 
        date, 
        translator_name, 
        translator_id, 
        client_name, 
        client_id, 
        language, 
        plataform, 
        appointment_link
      }: {
        date: string; 
        translator_name: string; 
        translator_id: string; 
        client_name: string; 
        client_id: string; 
        language: string; 
        plataform: string; 
        appointment_link: string;
      
      } = req.body

      // If one of those params not provided return error
      if (!date || !translator_name || !translator_id || !client_name || !client_id || !language || !plataform || !appointment_link) {
        res.status(400).json({ error: 'Param not provided' })

        return;
      }

      const { db } = await connect()

      const translatorExists = await db.collection('users').findOne({ _id: new ObjectID(translator_id) })
      // If translator does not exists return error
      if (!translatorExists) {
        res.status(400).json({ error: `translator ${translator_name} does not exists` })

        return;
      }

      const clientExists = await db.collection('users').findOne({ _id: new ObjectID(client_id) })
      // If translator does not exists return error
      if (!clientExists) {
        res.status(400).json({ error: `translator ${client_name} does not exists` })

        return;
      }

      const appointment = { 
        date, 
        translator_name, 
        translator_id, 
        client_name, 
        client_id, 
        language, 
        plataform, 
        appointment_link
      } 

      // Update appointment param in translator and client with appointment request translator gain 1 point client gives a point
      await db.collection('users').updateOne({ _id: new ObjectID(translator_id)}, { $push: { appointments: appointment }, $inc: { points: 1 } })

      await db.collection('users').updateOne({ _id: new ObjectID(client_id)}, { $push: { appointments: appointment }, $inc: { points: -1 } })
      // Return appointment
      res.status(200).json(appointment)

    } else {
      res.status(400).json({ error: 'Request method not allowed' })
    }
}

// Route creates appointment and update params in user that is translator true and false.