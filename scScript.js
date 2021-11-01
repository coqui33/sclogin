"use strict";
//var w3 = {};

var arrHomes = [];
var arrUsers = [];

class includableElement {
    constructor(element) {
        this.elmnt = element;
    };

    // ---- This method receives a file download and then recurses back to calling for the next includable file
    doReceive(response) {
        var rawName = this.elmnt.innerHTML;
        this.elmnt.innerHTML = response;
        this.elmnt.classList.remove("include");
        myInclude();  // recurse until no element has class="include"
    }; // --- end of doReceive file

    // ---- This method requests dowload of an includable file
    doLoadFile() {
        var fileName = "includes/" + this.elmnt.innerHTML;
        var xhttp = new XMLHttpRequest();
        var myself = this;
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                myself.doReceive(xhttp.responseText);
            };
        };
        xhttp.open("GET", fileName);
        xhttp.send();
    };

}; // ---- end of includableElement class

// ---- button click function
function buttonClick() {
  var gotaMatch = false;
  var failure = "";
  var tryUserID = document.getElementById("userID").value;
  var tryHouseNum = document.getElementById("houseNum").value;

  if (tryUserID.length && tryHouseNum.length) {
    // only if no empty string
//    document.getElementById("debug1").innerHTML =  tryUserID;
//    document.getElementById("debug2").innerHTML = 'Users: ' + arrUserIDs;

    // -- This is the lookup!
    var userIDindex = arrUsers.indexOf(tryUserID);
//    var userIDindex = arrHomeIDs.indexOf(tryUserID);

//    document.getElementById("debug3").innerHTML =  userIDindex;

    // search for user
    if (userIDindex > -1) {
      // found a user ID, try match
      if (arrHomes[userIDindex] == tryHouseNum) {
        location.href = 'https://sites.google.com/view/homeownersonly/';
      } else { // found user but no match
        failure = "User ID and house number do not match.";
      }
    } else { // did not find user
      failure = "No such user ID on file.";
    } 
  } else { // an empty string
    failure = "Please type something into both text boxes.";
  }
  document.getElementById("demo").innerHTML = failure + '<br><br>' +
        '<strong>If you do not yet have a userID, or have forgotten it, <a href="https://docs.google.com/forms/d/e/1FAIpQLSdKNBCZ1WNNVxy9FJs-RSQFqNWWn9U0oj0ZpZcUwR3zYvXV6Q/viewform?usp=sf_link/">click here to set up a new one.</a></strong>';
}

// --- Infinite ping-pong recursion of request/receive files until all includables have been expanded.
function myInclude() {
"use strict"
    var elmnt = document.querySelector(".include");
    if (elmnt) {  // if any element has class="include"
        var elementObj = new includableElement(elmnt);
        elementObj.doLoadFile();
    }; // elmnt > 0
   // drops out here if no element has class="include"
};


// --- load users array function
function loadUsersArray() {
//  document.getElementById("debug1").innerHTML = 'Debug-A: ';

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      var thetext = xhttp.responseText;
//      document.getElementById("debug1").innerHTML = 'Debug-A: ' + thetext;
      arrUsers = thetext.split(/\r\n|\n/);
//      document.getElementById("debug2").innerHTML = 'Debug-B: ' + arrUsers[108];
//      document.getElementById("debug3").innerHTML = 'Debug-C: ' + arrUserIDs;
    }
  }
  xhttp.open('GET', 'scArrayU.txt');
  xhttp.send();

}

// --- load homes array function
function loadHomesArray() {
//  document.getElementById("debug1").innerHTML = 'Debug-A: ';

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      var thetext = xhttp.responseText;
//      document.getElementById("debug2").innerHTML = 'Debug-A: ' + thetext;
      arrHomes = thetext.split(/\r\n|\n/);
//      document.getElementById("debug3").innerHTML = 'Debug-C: ' + arrHomes;
      loadUsersArray();
    }
  }
  xhttp.open('GET', 'scArrayH.txt');
  xhttp.send();

//  document.getElementById("debug2").innerHTML = 'Debug-B: ';
} // --- end of load home array function
