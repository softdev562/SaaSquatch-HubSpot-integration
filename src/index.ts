import express from 'express'
import 

// constants
const port = process.env.PORT

// initialize application
const app = express();
app.get('/', (_, res) => {
	res.status(200).send('Hello world!')
})

app.listen(port, () => console.log(`running express application on localhost:${port}`))

