import express from 'express'
import logger from 'morgan'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient({ log: ["query", "warn", "info", "error"]});


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

app.get(`/`, async (req, res) => {      // Testing out the new set up with prisma. Very happy with the results so far!
    try {
        const transactions = await prisma.transaction.findMany({take: 5, where: { client_name: 'client_25' }});
        if(transactions) {
            console.log("Retrieving All " + transactions.length + " Transactions");
            const homie = await prisma.transaction.findFirst({ where: { client_name: "client_3" }});
            console.log(homie.line_at_bet);
            return res.status(200).json({transactions, homie});
        } else {
            console.log("Oops! Looks like there was something wrong.");
        }
        } catch(error) {
            res.status(400).json({error: error.message});
        }
})

app.listen(PORT, () => {
    console.log(`App w/ Prisma.io listening on port ${PORT}`);
})