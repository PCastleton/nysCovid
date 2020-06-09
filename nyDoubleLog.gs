function myDoubleLog () {
  
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var tbl = ss.getSheetByName("cases");
    var inputRows = 62;
    var dayArray = tbl.getRange(2, 1, inputRows, tbl.getLastColumn()).getValues();
    var weekArray = dayArray.map(weekly);
    var transArray = transpose(weekArray);
    var shiftArray = shift(transArray);
   
    var outSheet = ss.getSheetByName("doubleLog");
    outSheet.getRange(1, 1, shiftArray.length, shiftArray[0].length).setValues(shiftArray);
}

function weekly(item) {  // Grab the total cases for each week
  var ret = [];
  for( let i = 0; i < item.length; i++ ) {
    if(i % 7 === 0 && item[i] !== "") {
      ret.push(item[i]);  
    }
  }
  return ret;
}

function transpose(a) {
    return Object.keys(a[0]).map(function(c) {
        return a.map(function(r) { 
            return r[c]; 
        });
    });
} 
    
function shift(b) {
   var inRows = b.length //13
   var inCols = b[0].length // 62
   var rowShift = inRows - 1;
   var outRows = 1 + rowShift * inCols;
   var outCols = inCols + 1;
   var newCol;
   var sArr = Array(outRows).fill("").map(() => Array(outCols).fill(""));

   // Shift county names one to the right and move total cases to first column
   for( let i =0; i < inRows; i++ ) {
       for( let j = 0; j < inCols; j++) {
           if(i === 0) {
               sArr[0][j+1] = b[i][j]; // shift county names to the right
           } else {
               sArr[i + j*rowShift][0] = b[i][j]; // move cases to first column
           }
       }
   }
   // Create new cases under the appropriate county
   for( let i = 1; i < outRows; i++ ) {  // start at row-index 1 to calc new cases
       for( let j = 1; j < outCols; j++) { // start at col-index 1 to calc new cases
           newCol = Math.ceil(i/rowShift)
           if(i % rowShift === 1) {
               sArr[i][newCol] = sArr[i][0]; // first entry equals current cases
           } else {
               sArr[i][newCol] = sArr[i][0] - sArr[i-1][0]; // other entries equal current less previous cases
           }
       }
   } 
   return sArr;
}

