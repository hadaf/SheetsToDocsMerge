# SheetsToDocsMerge
##### A Google Apps Script that merges information from a Google Sheet into a Template created by Google Docs. The result is a new Google Docs file that is populated by the Sheet data.

---

This work is based on [a response](http://webapps.stackexchange.com/a/40076/83041) from StackExchange user [Vidal S. Ramdal](https://webapps.stackexchange.com/users/21583/vidar-s-ramdal), which I have altered, streamlined and updated.

I have also modified the code to work around [a bug](https://code.google.com/p/google-apps-script-issues/issues/detail?id=1612) that is present in Google Apps Script. The bug damages [images that are copied across Docs files](https://code.google.com/p/google-apps-script-issues/issues/detail?id=1612#c14), and is still present as of March 2015.

---

#### How to use this script

* Open your Sheet file and make sure the first row of the data is column headers.

* Reference the column headers in the template by enclosing the headers in square brackets.
An example that can be in your template Doc may be: 
> This is [header1] that corresponds to a value of [header2].

* Copy the contents of `merge.gs` to the script editor of your Google Sheets file, modify the first line
of the `doMerge()` method according to the ID of your template Doc, and save it. 

* Then close and open the Sheet file, and you should see a new menu for the Sheet file, called `Merge`. From there, pick `Fill template`.

* A new merged file will be created for you.






