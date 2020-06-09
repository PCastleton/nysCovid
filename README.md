# nysCovid
Google Apps Scripts used in updating the NY Covid testing data and are intended to be used in conjunction with Google Sheets.  
The first script will first download the latest dataset from https://health.data.ny.gov/ and then pivot it into two 2-D tables: one for daily tests and one for daily cases.  
The second script will convert the case data into a sparsely formatted table allowing Google Sheets to draw a 7-day xy-line graph looking at total vs new positive cases.  Useful using a log scale on both the x and y axis.
