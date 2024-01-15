import express from 'express'
import logger from 'morgan'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient({ log: ["query","warn", "info", "error"]});


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

app.get('/', async (req, res) => {      // Testing out the new set up with prisma. Very happy with the results so far!
    try {
        const transactions = await prisma.transaction.findMany({take: 2000, where: {client_name: "client_25"}});
        if(transactions) {
            // console.log("Retrieving All " + transactions.length + " Transactions"); // because sometimes you just want to see "20000 rows fetched in your console"
            return res.status(200).json({transactions, homie});
        } else {
            console.log("You either don't have your dependencies installed or your forgot to place a connection string for postgresql in a .env file in this director. :)");
        }
        } catch(error) {
            res.status(400).json({error: error.message});
        }
})

app.post('/query', async (req, res) => {
        console.log(req.body);
        const { client_name, LIMIT, team_abbr } = req.body;     // Here is where things were becoming insane during my first appraoch to this. If you still have access to it, check it out. This is 1/1k the size and headache!
        try {
            if(team_abbr === null && client_name === null) {
                console.log("no team selected.");                         // similar to c#/other type safe languages, coercing a string to an int with a bitwise cast can be extremely clutch. Could probably take this approach for some of the binary flags.
                const transactions = await prisma.transaction.findMany({take: +LIMIT, where: {client_name}})
                console.log("Found " + transactions + " Bets Matching " + client_name);
                return res.status(201).json({transactions});
            } else {
                const transactions = await prisma.transaction.findMany({take: +LIMIT, where: {client_name, team_abbr}}) // I'm capping this at 10000. I set it to 100K and it had no issue maxing that outselecting 'client_3' resulted in a crash (lol)
                console.log("Found " + transactions.length + " Bets Matching " + client_name + " with bets placed towards " + team_abbr);
                return res.status(201).json({transactions});
            }
        } catch(error) {
            res.status(400).json({error: error.message});
        }
})

app.listen(PORT, () => {
    console.log(`App w/ Prisma.io listening on port ${PORT}`);
})