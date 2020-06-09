function myFunction() {
  importCSVFromWeb();
  myPivot();
}

function importCSVFromWeb() {

  // Provide the full URL of the CSV file.
  var csvUrl = "https://health.data.ny.gov/api/views/xdss-u53e/rows.csv?accessType=DOWNLOAD";
  var csvContent = UrlFetchApp.fetch(csvUrl).getContentText();
  var csvData = Utilities.parseCsv(csvContent);
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var dnld = ss.getSheetByName("Download");
  dnld.getRange(1, 1, csvData.length, csvData[0].length).setValues(csvData);
  
}

function myPivot () {
  
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var dnld = ss.getSheetByName("Download");
    var origArray = dnld.getRange(2, 1, dnld.getLastRow()-1,6).getValues();

    var features = [['cases',3],['tests',5]];
  
    for( let i = 0; i < features.length; i++) {
      // format dates and select feature field
      var inArray = origArray.map(function(r) { return[r[1],Utilities.formatDate(new Date(r[0]),"GMT","MM-dd"),r[features[i][1]]]; });
      // pivot the array
      var outArray = getPivotArray(inArray, 0, 1, 2);
      // set values to field sheet
      var outSheet = ss.getSheetByName(features[i][0]);
      outSheet.getRange(1, 1, outArray.length, outArray[0].length).setValues(outArray);
    }
}

function getPivotArray(dataArray, rowIndex, colIndex, dataIndex) {
    //Code from https://techbrij.com
    var result = {}, ret = [];
    var newCols = [];
    for (var i = 0; i < dataArray.length; i++) {
 
        if (!result[dataArray[i][rowIndex]]) {
            result[dataArray[i][rowIndex]] = {};
        }
        result[dataArray[i][rowIndex]][dataArray[i][colIndex]] = dataArray[i][dataIndex];
 
        //To get column names
        if (newCols.indexOf(dataArray[i][colIndex]) == -1) {
            newCols.push(dataArray[i][colIndex]);
        }
    }
    newCols.sort();
    var item = [];
 
    //Add Header Row
    item.push('County');
    item.push.apply(item, newCols);
    ret.push(item);
 
    //Add content 
    for (var key in result) {
        item = [];
        item.push(key);
        for (var i = 0; i < newCols.length; i++) {
            item.push(result[key][newCols[i]] || "0");
        }
        ret.push(item);
    }
    return ret;
}