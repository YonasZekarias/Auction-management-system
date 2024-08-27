
import { Router } from 'express'
import { placebid } from '../controller/bidding.controller.js'

const router = Router()

router.post('/', placebid)


export default router
