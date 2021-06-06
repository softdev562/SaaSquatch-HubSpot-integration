import { Router } from 'express'

const router = Router()
router.get('/api/', (_, res) => {
	res.setHeader('content-type', 'application/json')
	res.end(JSON.stringify({
		apiVersion: 1,
		documentation: 'https://github.com/SENG499-team-2/SaaSquatch-HubSpot-integration'
	}))
})

export default router
