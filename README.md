Termite-UI
=========

This repository contains a GUI for user interaction with Interactive Topic Modeling (the topic model data must be hosted separately; code for that is here: https://github.com/uwdata/termite-data-server). 

Installing Libraries
--------------------
From the termite-ui/public_html directory, run 'bower install' (assuming you've installed bower: http://bower.io/). This should put all necessary libraries in termite-ui/public_html/bower_components. 

Run the Visualization
---------------------
To view the visualization, execute `./start_localhost.sh`.  If you're on a Mac, the script will automatically bring up the visualization in Chrome.  Otherwise, you'll have open `http://127.0.0.1:8000/public_html/app` in a web browser.

If the server is not yet running, the page will load, but will be stuck on a loading indicator. Console errors should point to the fact that the server is not responding.

Run the Data Server
---------------------
To run the server, follow the instructions at https://github.com/uwdata/termite-data-server.
