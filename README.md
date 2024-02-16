Swish Dashboard,

I'm using nodemon to watch my express server, so you may need to install nodemon to your machine: `$ npm i nodemon -g` <-- that '-g' flag installs nodemon globally to your machine. You can omit this flag if you want.

You'll need to add a `.env` file to the root of the `swishDashboard` directory for Prisma to create a client instance of your database. Refer to `.env.example` file for the connection string structure.

Your .env file should have a single line, delimiting the connection string as: `DATABASE_URL="postgresql://{USERNAME}:{PASSWORD}@{URI}:{PORT}/{DB_NAME}?schema=public&"`

Once you're here, split your terminal into two panes so that in one you can direct to `swish/swishDashboard` (server directory) and `swish/client` (client directory), respectively.

In `swishDashboard`, run `npm i` to install all dependecies, then `$ npm run swish` to fire up the server.

In `client`, run `npm i` to install all dependencies, then `$ npm start` to fire up the React front end.

I'm using a postgresql database with an express web server.

    If you don't have a database to perform queries, refer to the `scratch.txt` file in the root. In there you'll see the step by step break down of how I've ingested all of the sample data to my database. 
    This can be treated as a boiler-plate approach to ingesting any/all data from provided it's coming from a .json file, and is an array of json objects. Null values are accounted for, as well.

I'm most proud of my heat map plotting bet types, players, and listed swish_component_prob. I knew nothing about sports betting for this and now I feel like I'm starting to get it.

Upon load up, you'll see the dashboard. It's very simple.

You can set constrains on your search queries by adding filters using the dropdown menus and input fields.

There are two categories you can set as of right now (These were determined in the schema file representing a Transaction object. You'll see where I chose to consider each of the 82 fields as which data type there:

        1) String type properties
                ex: client_name : "client_25"
        2) Numeric type properties
                ex: line : 5.3

The way this works is in the back end, string-type constrains are easier to work with than integer types, which require conversion before hitting our Prisma query.
Some javascript magic takes care of those filters very easily.

I then build a new filter object, justly named 'powerFilter' and pass that object to Prisma. The result is an accurate filtered response by our DB.

You can reset all queries, which upon doing so you'll see your query string empty out on the Query Builder Menu empty out. You can also edit existing constraints by re-selecting the column's name and entering a new value.

Cheers,
Matthew McCredy
