import express, { Express, Request, Response } from 'express'
import { PORT } from './secrets'

const app: Express = express()

app.get('/', (req: Request, res: Response) => {
    res.send('Working')
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))