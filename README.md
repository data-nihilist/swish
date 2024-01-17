Swish Dashboard,

In server, run `$ npm run swish` after installing dev dependencies. I used nodemon for watching my server but you can use whichever you prefer.

I'm using a postgresql database with an express web server. I'm querying the PG database by using Prisma, an ORM I learned about and have now 
plugged in as of last night (Sun 1/14/2024). Way better than the grueling jsonb type casting I was forcing upon myself!

But now I'm more confident with my SQL skills, so, everyone wins.

    If you don't have a database to perform queries, refer to the `scratch.txt` file in the root. That was for the past few nights between shifts my primary notes. Now it's distilled to how I shaped the data into what         I'm working with in this application. In there you'll see the step by step break down of how I've ingested all of the data to my database. It took the majority of this assignment to figure out, but man is it           worth having moving forwards.

After installing the dependencies in the client directory, navigate to swish/client/src/App.js, and switch the import statements for the CSS styling. Once you've done this, run `$ npm run gulp` in this same directory. This will purge any and all unused rules and classes from my SASS library, so that the final CSS isn't a truck-ton of 3% used helper functions/mixins.

Now, run `$ npm start` to fire up the front end.

I'm most proud of my heat map plotting bet types, players, and listed swish_component_prob. I knew nothing about sports betting for this assessment and now I feel like I'm starting to get it.
My scatterplot is chaotic, but that's because there are 4 separate y-axes plotting specific data I don't fully understand. It's better than yesterdays, thoughh :).

This assessment was a lot of fun. I don't have the implementation as squeaky clean as I'd like it, but being able to say, "Okay, let's burn down that implementation and rebuild the back end.. okay let's rebuild the front end, too,"" pretty much on a whim due to having a Monday holiday felt great. The last few nights of working on this between shifts at my current retail job reminded me why I love programming - thank you!

If you haven't yet guessed, I struggled a lot with understanding the values to plot against accepted_datetime_utc. To be fair, I was provided plenty of reference materials - but at the end of the day my goal is to be a software engineer, not a sports betting professional. I'd have to have a better talk with someone who needs to use this tool in order to provide them exactly what they need, otherwise my margin for error grows exponentially. Still, this has been a very cool data set to jump into.

One thing for sure is that this experience has given me an extremely beneficial position over improving as both an front end engineer and data scientist combined. I can't wait to see what other cool things I can throw together with this data.

You can set constrains on your search queries by adding filters on the dashboard's very simple UI.

There are two categories you can set as of right now (These were determined in the schema file representing a Transaction object. You'll see where I chose to consider each of the 82 fields as which data type there:

        1) String type properties
                ex: client_name : "client_25"
        2) Numeric type properties
                ex: line : 5.3

                The way this works is in the back end, string-type constrains are easier to work with than integer types, which require conversion before hitting our Prisma query.
                Some javascript magic takes care of those filters very easily.

                I then build a new filter object, justly named 'powerFilter' and pass that object to Prisma. The result is an accurate filtered response by our DB.

                Joins will require extra tooling on my end. My SQL has improved immensly this past week alone, and I was considering storing things I consider "meta-data' on transactions in a jsonb column 
                tied to each transaction. More on that once I'm happy with the data viz side of things, though.

        You can reset all queries, which upon doing so you'll see your query string empty out.

Next logical step here will be to allow the user to define the x and y axes. I also want to render a tree but I'll have to figure out which data points are worth doing so (maybe a BT where each node's key is determined by an array of unique values of probability/count (average of how often a probability is submitted)? Only time will tell!

Cheers,
Matthew

Happy to help in any way if I can if the directions I've supplied here aren't enough to get things running.


Cheers,
Matthew McCredy
