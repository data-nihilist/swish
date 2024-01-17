import express from 'express'
import logger from 'morgan'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient({ log: [/*"query",*/"warn", "info", "error"] });


const app = express();
const PORT = 3001;

const corsOptions = {
    origin: "http://localhost:3000",
};

app.use(cors(corsOptions));
app.use(logger("dev"));
app.use(express.urlencoded({
    extended: true,
})
);
app.use(express.json());
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(`Something has gone terribly wrong..`);
});

// Use this getter to troubleshoot your api connection is up and running at localhost:3001/

app.get('/', async (req, res) => {
    try {
        const transactions = await prisma.transaction.findMany({ take: 2000, where: { client_name: "client_25" } });
        if (transactions) {
            return res.status(200).json({ transactions, homie });
        } else {
            console.log("You either don't have your dependencies installed or your forgot to place a connection string for postgresql in a .env file in this director. :)");
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

app.post('/query', async (req, res) => {
    const { stringFilters, numericFilters } = req.body
    const powerFilter = {};
    const numbersToCrunch = Object.keys(numericFilters);
    for (let i = 0; i <= numbersToCrunch.length - 1; i++) {
        powerFilter[numbersToCrunch[i]] = parseFloat(numericFilters[numbersToCrunch[i]]);
    }
    const stringKeys = Object.keys(stringFilters);
    for (let i = 0; i <= stringKeys.length - 1; i++) {
        powerFilter[stringKeys[i]] = stringFilters[stringKeys[i]];
    }
    try {
        console.log("Querying Using ", powerFilter);
        const transactions = await prisma.transaction.findMany({
            take: 10000,
            where: powerFilter
        })
        console.log(`Returning ${transactions.length} results. . .`);
        return res.status(201).json({ transactions });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

app.listen(PORT, () => {
    console.log(`App w/ Prisma.io listening on port ${PORT}`);
})