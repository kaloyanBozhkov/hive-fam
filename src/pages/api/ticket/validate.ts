import { error } from 'console';
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import z from 'zod'


const payloadSchema = z.object({
    sessionId: z.string(),
    lineItemId: z.string(),
    staffSecret: z.string()
})

export default function handler({
    req, res
}: {
    req: NextApiRequest,
    res: NextApiResponse,
}) {
try {
    const { sessionId, lineItemId, staffSecret} = payloadSchema.parse(req.body)

    // commit & resolve conflicts

    const session = {} as Stripe.Checkout.Session

    const items = session.line_items?.data!

    const lineItem = items.find((i) => i.id === lineItemId)

    if (!lineItem) {
        console.warn("suspicious ticket scan")
        res.redirect("/error/invalid-ticket")
    }

    const isFirstScan = {} as MockMetadata // lineItem. @TODO merge & resolve conflict

    
    if (isFirstScan) {
        // await update metadata of item
    }
    
    res.redirect(`/ticket?sessionId=${sessionId}&lineItemId=${lineItemId}`)
} catch(error) [
    console.warn(error);
    res.status(500).json({ message: 'Internal server error' })
]


} 


type MockMetadata = any