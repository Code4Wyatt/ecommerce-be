import express, { Express } from 'express'
import { PORT } from './secrets'
import rootRouter from './routes'
import { PrismaClient } from '@prisma/client'
import { errorMiddleware } from './middlewares/errors'
import { SignupSchema } from './schema/users'

const app: Express = express()

app.use(express.json())

app.use('/api', rootRouter)

export const prismaClient = new PrismaClient({
    log: ['query']
}).$extends({
    result: {
        address: {
            formattedAddress: {
                needs: {
                    lineOne: true,
                    lineTwo: true,
                    city: true,
                    country: true,
                    postCode: true
                },
                compute: (address) => {
                    return `${address.lineOne}, ${address.lineTwo}, ${address.city}, ${address.country} - ${address.postCode}`
                }
            }
        }
    }
})

app.use(errorMiddleware)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))