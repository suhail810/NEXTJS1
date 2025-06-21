import {z} from 'zod'

export const acceptngMessageSchema = z.object({
    acceptMessage: z.boolean()
})