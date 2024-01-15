Swish Dashboard

In server, run `$ npm run swish` after installing dev dependencies. I used nodemon for watching my server but you can use whichever you prefer.

I'm using a postgresql database with an express web server. I'm querying the PG database by using Prisma, an ORM I learned about and have now 
plugged in as of last night (Sun 1/14/2024). Way better than the grueling jsonb type casting I was forcing upon myself!

        But now I'm more confident with my SQL skills, so, everyone wins.

    If you don't have a database to perform queries, refer to the `scratch.txt` file in the root. That was for the past few nights between shifts my primary notes. Now it's distilled to how I shaped the data into what I'm working with in this application.

After installing the dependencies in the client directory, navigate to swish/client/src/App.js, and switch the import statements for the CSS styling. Once you've done this, run `$ npm run gulp` in this same directory. This will purge any and all unused rules and classes from my SASS library, so that the final CSS isn't a truck-ton of 3% used helper functions/mixins.

Now, run `$ npm start` to fire up the front end.

I'm most proud of my heat map plotting bet types, players, and listed swish_component_prob. I knew nothing about sports betting for this assessment and now I feel like I'm starting to get it.

This assessment was a lot of fun. I don't have the implementation as squeaky clean as I'd like it, but being able to say, "Okay, let's burn down that implementation and rebuild the back end," pretty much on a whim due to having a Monday holiday. The last few nights of working on this between shifts at my current retail job reminded me why I love programming - thank you!

If you haven't yet guessed, I struggled a lot with understanding the most beneficial values to plot against accepted_datetime_utc. I was provided plenty of reference materials. I think I'm so intereseted in learning more now because I've just now gotten comfortable thowing the data around. I'm in that, "I don't know how much I don't know yet" stage where you don't want to make assumptions, so, I hope to learn more!

One thing for sure is that this experience has given me an extremely beneficial position over improving as both an front end engineer and data scientist combined. I can't wait to see what other cool things I can throw together with this data.

As of now, you can filter by 'client_name,' set a limiit to the size of your query 
(feel free to remove the `$..prisma.transaction...({take: <LIMIT>})`)               , and pick a team to filter transactions by.

I wanted to treat this as agnostically as possible due to my time constraints between my day and weekend jobs. I love to build and improve things and I imagined myself as attempting a quest from a local statistician in need of a tool to see their data in a way they need to.

The next layer of this build will be to continue building out the backend's Prisma queries. The ability to run the migration command `$npx prisma migrate dev` and have schema, querying abilities right in the server using object/class syntax - in a C#-ified version of JS?? 
                                                                    Chef's kiss

        
The next step here would just be to build up the UI so that we can add more constraints. I've left notes where I felt like reflecting on a previous implementation attempt, or wanted to posit a qustion about certain transaction properties (you'll notice that immediately if you notice the nullVal decorators I added to the Transaction model/schema definition in ```schema.prisma```). Passing pointers to the charts themselves is a next goal provided I can finish creating the 4 or 5 schema definitions outlined in the sample data.

Performing joins with Prisma is extremely straightforward. Since I found so many various null values, I have 3 different instances of draw.io saved in a local repo titled "WhatThatDataDo," now, which rules.

There's a bunch of other stuff we can do with this data, too, of course. One of the interesting things I read that was oddly comforting was to deliminate coincidence as a non-starter when it comes to sports betting. I'd be very interested in performing cross analysis across multiple sporting events of various types to see how exactly points shift as large games in each respective sport ebb and flow throughout their respective seasons.

Maybe a few BSTs plotting lowest and highest grossing betting throughout a given time span and seeing how the champion ship game in one sport influences(or doesn't influence) the other(s). I'd have to see and learn more about what makes a sports betting analyst grin when they look at the data before assuming that project.

Thank you very much for this opportunity to show that I may be relatively new to the sports betting scene, but I don't rely on AI nor do I find greater pleasure than solving puzzles, working both independently and as a team to tackle oceans of data as you have to handle at Swish.

Happy to help in any way if I can if the directions I've supplied here aren't enough to get things running.


Cheers,
Matthew McCredy
