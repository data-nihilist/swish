import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient({ log: ["query", "warn", "info", "error"]});


async function main() {
    console.log(`::,_,::-<Prisma_Client|Activated>-::,_,::\nWelcome`)
    // ... write Prisma Client queries here
    const transactions = await prisma.transaction.findMany({take: 5, where: { client_name: 'client_25' }});
    if(transactions) {
        console.log("Retrieving All " + transactions.length + " Transactions");
        const homie:any = await prisma.transaction.findFirst({ where: { client_name: "client_3" }});
        console.log(homie.line_at_bet);
    } else {
        console.log("Oops! Looks like there was something wrong.");
    }
}

main()
    .catch(e => {
        console.error(e.message);
    })
    .finally(async () => {
        console.log(`::!::!:Terminating|Prisma_Client:!::!::\nFarewell!`);
        await prisma.$disconnect()
    });