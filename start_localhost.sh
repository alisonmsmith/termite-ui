#!/bin/bash

launch_browser() {
	OS=${OSTYPE//[0-9.]/}
	if [ "$OS" == "darwin" ]
	then
		sleep 2
		echo
		echo "Opening http://127.0.0.1:8000 in Google Chrome..."
		echo
		open -a Google\ Chrome "http://127.0.0.1:8000/app/index.html"
	else
		echo "The group-in-a-box visualization is now available at http://127.0.0.1:8000/app"
	fi
}

launch_localhost() {
	echo
	echo "Starting a python SimpleHTTPServer at port 8000..."
	echo "Press Ctrl+C to close this python web server."
	echo
	cd public_html && python -m SimpleHTTPServer 8000
}

launch_browser &
launch_localhost
