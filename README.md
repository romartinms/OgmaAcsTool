# OgmaAcsTool
Tool For Comparing Ogma/Acs

# Prerequisites

Node.JS

Browser plug-in to disable CORS: https://add0n.com/access-control.html

# Setup

npm install

npm start

# Usage

Open http://localhost:3000 in browser

Paste in content and token

Click either Translate with Ogma or Translate with ACS and compare the result

To get email content from OWA. Use F12 debug tool. Got to element and search for "Message Body". Find an elemant that looks like:

\<div role="region" tabindex="-1" ==aria-label="Message body"== class="fEEQb BeMje TiApU J8uu2 allowTextSelection"\>

Right click on the element and do Copy/Copy outerHTML
