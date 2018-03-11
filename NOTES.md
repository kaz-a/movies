## RUNNING THIS PROGRAM
1. `npm install`
2. `npm run build`
3. open the browser and type `localhost:3030` on url


## APPROACH
1. Find any interesting patterns in this dataset, particularly pertaining to something that could potentially be an interesting story to tell
2. Pick variables:
    (1) is the industry in general doing well? I don't want to get into a dying field. 
    (2) what kind of movies are popular and/or less competitive so I can focus on creating this type of film? 
    (3) which studios I should try to sign a contract with based on their revenue?
3. Pick a visual style:
    Single chart or dashboard won't tell a story. I decided to do a data journalism sort of thing that can answer some specific questions
4. Pick charts:
    (1) line chart showing the time trend. 
    (2) bubble chart showing all movie titles color-coded by genre and sized by revenue. 
    (3) stacked bar chart by studio. Each bar divided up by genre revenue.


## PROCESS
1. Sketch UI/UX and charts on postits.
2. Set up the project - use node express server and react and heavy d3 on the frontend.
3. prepare csv with python for each chart with aggregated data.
4. code and improvise design along the way.


## CHALLENGES
### Design
* Showing 42 different colors for 42 unique genres on the bubble chart seemed challenging. And combining some of the similar genres into one in order to reduce the number of genres was a bit tricky option also - Does 'Sci-Fi Drama' falls in the category of 'Sci-Fi' or 'Drama'? How about 'Family Comedy' - would that be under 'Family' or 'Comedy'?
*  I decided to simplify the process by ommtting any genres with less than 5 records. So any genre that has less than 5 titles are categorized as 'Others'.
*  By doing so, I reduced to 15 unique genres and used 15 color schemes, which is still not ideal, but far better than 42.
* Another challenge was to come up with a way to incorporate the # of theaters data into this visualization. Still tinkering.

### Code
* I initially thought by having the python script to generate a csv file for each chart would make my life easier. But as the project progressed, I realized I needed to do more aggregation on the frontend.
* React definitely helps modularizing the code, but my d3 code still seemed all over the place at the end. I should have considered using redux in the beginning. If I set up the project with redux, all of my frontend-aggregated data can be in one place and would've been cleaner. 
* Stacked bar chart ended up as a simple bar chart. The project became too ambitious and I ran out of time.


## INSIGHTS
* Film industry seems to have been stable for the last 3 years.
* If I was making a film, I should target my release date to either June or December as those are the months with highest gross total.
*  If I want to be in a less competitive field, I should make more sci-fi films.
*  If I want to be in a popular genre, I should focus on creating Action/Advanture films. 
*  BV(Disney/Buena Vista) studio seems to know what they're doing in terms of marketing and generating a large sum of revenue. I should try to work with them. 

