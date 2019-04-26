# RPI Events Forum

# Running the Application
To run the development version of the applications:
First run `ng serve` followed by `node server.js`

# API
## GET Requests:   
(1) `'/database/create'` - pulls events from events.rpi.edu into the mongo databse.
<br>&nbsp;&nbsp;&nbsp;&nbsp; parameters: none
<br>(2) `'/events'` - returns all events in the database
<br>&nbsp;&nbsp;&nbsp;&nbsp; parameters: none
<br>(3) `'/events/id'` - returns event information when ID parameter is passed
<br>&nbsp;&nbsp;&nbsp;&nbsp; parameters: 'eventid' - valid event id
<br>(4) `'/events/comments'` - returns all comments for a given event id
<br>&nbsp;&nbsp;&nbsp;&nbsp; parameters: 'eventid' - valid event id