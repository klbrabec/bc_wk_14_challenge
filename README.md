# Plotting Earthquakes Using USGS Data 

## Note:  A API Key for Mapbox.com API will need to be generated to view site live.  (Reference to a config.js file is in the index.html file) 

### Overview 
This project is the capstone of week 14 of the Data Analytics Bootcamp.  It combines knowledge of JavaScript, HTML, CSS, and incorporates Leaflet to build interactive maps that track earthquake activity over the past 7 days.  

Data was sourced from the following USGS API feeds: 
- Site https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
  - All Earthquakes API feed 
  - Major Earthquakes API feed 
  
This data was brought into the site using D3 libraries and processed using Leaflet to be visualized on maps provided by Mapbox.com's API interface.  This provides the ability for the user to view different map frames, as well as powers the layering allowing users to see tectonic plates, all earthquakes, or filter for major quakes (defined as having a Ricter scale measurement of 5 or higher). 

Additional layering and visualizations could be built into this model, including the use of the 'did you feel it' measurement provided by the USGS organization.  This would allow visitors to the site to determine if any activity is happening in their area, as well as if it could possibly be felt.  It may also be beneficial to track and map the depth of the quakes.  This would provide information on how common deep quakes vs shallow quakes are, in light of the fact that shallow quakes have been shown to be more damaging when they occur, regardless of the Ricter scale measurement of the event.  (https://www.usgs.gov/faqs/what-depth-do-earthquakes-occur-what-significance-depth) 


 
