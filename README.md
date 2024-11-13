Data Viz Dashboard. I needed to get used to this sort of workflow - plumbing sanitized data into a database and performing queries against that data.

This uses nodemon to watch the express server. You may need to install nodemon to your machine: `$ npm i nodemon` adding `-g` for global install.

You'll need to add a `.env` file to the root of the `swishDashboard` directory. It's for Prisma to create a client instance of your database.

Refer to `.env.example` file for the connection string's structure.

You're going to need to use (formerly known as, 'postgresql,') postgresql@14.

If you don't, and maybe you use homebrew? :D

        - run `brew install postgresql@14`
        - && `brew services start postgresql@14`

Otherwise: https://www.postgresql.org/docs/

Once you're here, split your terminal into two panes so that in one you can direct to `swish/swishDashboard` (server directory) and `swish/client` (client directory), respectively.

In `swishDashboard`, run `npm i` to install all dependecies, then `$ npm run swish` to run the server.

In `client`, run `npm i` to install all dependencies, then `$ npm start` to fire up the React front end.

    If you don't have a database to perform queries, refer to the `scratch.txt` file in the root. In there you'll see the step by step break down of how I've ingested all of the sample data to my database. 
    This can be treated as a boiler-plate approach to ingesting any/all data provided it's coming from a .json file, and is an array of json objects. Null values are accounted for, as well.
    Feel free to edit the schema of the Transaction object to fit your sample data - just be mindful of what you're treating as Strings/Integers/Floats! :)

Upon load up, you'll see the dashboard. It's very simple. You could also just use the swishDashboard dir as a baseline for your own data crunching needs.

You can set constrains on your search queries by adding filters using the dropdown menus and input fields - now that I'm revisiting this repo, I could build a CLI to accompany this so you could do most of that config from the shell. There's an idea.

There are two categories you can set as of right now (These were determined in the schema file representing a capital 'T' Transaction object from the original data set I was given.

        1) String type properties
                ex: field_a : "client_25"       -> sets a constrait on your query on the field_a column of your table
        2) Numeric type properties
                ex: fubar_b : 5.3               -> sets additional constraints, and so on



You can also omit this step entirely to get a preview of the data viz dashboard's capabilities. Clicking "Query Database" without any constraints will grab the first 5000 results.

Results are currently being sorted by accepted_datetime_utc.

The backend builds the 'powerFilter' object, justly named, and passes that object to Prisma. The result is an accurate, filtered response of our DB table.

You can reset all queries, which upon doing so you'll see your query string empty out on the Query Builder Menu. You can also edit existing constraints by re-selecting the column's name and entering a new value.



A massive thank you to the engineer, Keith, who shared with me a dataset with over 500k rows. The 'CSV Rainbow' extension in my IDE made for inspiring flows and patterns,

Thanks for visiting an early project of mine,
-M
