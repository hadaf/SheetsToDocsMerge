/*  This is the main method that should be invoked. 
 *  Copy and paste the ID of your template Doc in the first line of this method.
 *
 *  Make sure the first row of the data Sheet is column headers.
 *
 *  Reference the column headers in the template by enclosing the header in square brackets.
 *  Example: "This is [header1] that corresponds to a value of [header2]."
 */
function doMerge() {
  var selectedTemplateId = "1foobarfoobarfoobarfoobarfoobarfoobar";//Copy and paste the ID of the template document here (you can find this in the document's URL)
  
  var templateFile = DriveApp.getFileById(selectedTemplateId);
  var mergedFile = templateFile.makeCopy();//make a copy of the template file to use for the merged File. Note: It is necessary to make a copy upfront, and do the rest of the content manipulation inside this single copied file, otherwise, if the destination file and the template file are separate, a Google bug will prevent copying of images from the template to the destination. See the description of the bug here: https://code.google.com/p/google-apps-script-issues/issues/detail?id=1612#c14
  mergedFile.setName("filled_"+templateFile.getName());//give a custom name to the new file (otherwise it is called "copy of ...")
  var mergedDoc = DocumentApp.openById(mergedFile.getId());
  var bodyElement = mergedDoc.getBody();//the body of the merged document, which is at this point the same as the template doc.
  var bodyCopy = bodyElement.copy();//make a copy of the body
  
  bodyElement.clear();//clear the body of the mergedDoc so that we can write the new data in it.
  
  var sheet = SpreadsheetApp.getActiveSheet();//current sheet

  var rows = sheet.getDataRange();
  var numRows = rows.getNumRows();
  var values = rows.getValues();
  var fieldNames = values[0];//First row of the sheet must be the the field names

  for (var i = 1; i < numRows; i++) {//data values start from the second row of the sheet 
    var row = values[i];
    var body = bodyCopy.copy();
    
    for (var f = 0; f < fieldNames.length; f++) {
      body.replaceText("\\[" + fieldNames[f] + "\\]", row[f]);//replace [fieldName] with the respective data value
    }
    
    var numChildren = body.getNumChildren();//number of the contents in the template doc
   
    for (var c = 0; c < numChildren; c++) {//Go over all the content of the template doc, and replicate it for each row of the data.
      var child = body.getChild(c);
      child = child.copy();
      if (child.getType() == DocumentApp.ElementType.HORIZONTALRULE) {
        mergedDoc.appendHorizontalRule(child);
      } else if (child.getType() == DocumentApp.ElementType.INLINEIMAGE) {
        mergedDoc.appendImage(child.getBlob());
      } else if (child.getType() == DocumentApp.ElementType.PARAGRAPH) {
        mergedDoc.appendParagraph(child);
      } else if (child.getType() == DocumentApp.ElementType.LISTITEM) {
        mergedDoc.appendListItem(child);
      } else if (child.getType() == DocumentApp.ElementType.TABLE) {
        mergedDoc.appendTable(child);
      } else {
        Logger.log("Unknown element type: " + child);
      }
   }
    
   mergedDoc.appendPageBreak();//Appending page break. Each row will be merged into a new page.

  }
}



/**
 * Adds a custom menu to the active spreadsheet, containing a single menu item
 * for invoking the doMerge() function specified above.
 * The onOpen() function, when defined, is automatically invoked whenever the
 * spreadsheet is opened.
 * For more information on using the Spreadsheet API, see
 * https://developers.google.com/apps-script/service_spreadsheet
 */
function onOpen() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var entries = [{
    name : "Fill template",
    functionName : "doMerge"
  }];
  spreadsheet.addMenu("Merge", entries);
};
