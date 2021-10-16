// ==UserScript==
// @name         Chateau Golf NettyCaddy Auto Tee Time Reservation
// @version      0.2
// @description  Automatically book tee times at Chateau Golf and Country Club through NetCaddy's online reservation platform based on user preferences
// @downloadURL  https://github.com/levydvm/auto-tee-time-reservation/autoteeres.js
// @include      https://www.chateaugcc.com/Default.aspx?p=DynamicModule&pageid=41*
// @include      https://www.chateaugcc.com/dialog.aspx*
// @icon         https://www.google.com/s2/favicons?domain=chateaugcc.com
// @run-at       document-idle
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant        GM_addStyle
// ==/UserScript==
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

////////////// DECLARE GLOBAL VARIABLES ///////////////
var date
var time
var autoURL
var makeResButton
var errorCheck
var bookMulti
var timeSlots
var area
var submitButton
var loadAutoBooker
var dateChangers

////////////// TIME SELECT PAGE ///////////////////////

waitForKeyElements ('#txtDate', actionFunction1, false);

function actionFunction1 (jNode) {

function selectionPage() {
    // edits selection page to enable time selection and add "Auto Reserve" launch button
    timeSlots = document.querySelectorAll('span.timeText');
    timeSlots.forEach(addCheckbox)
    function addCheckbox(item){
        var val = item.innerHTML.split('"')[0].split('<br>')[0];
        item.innerHTML = "<input type='radio' id='"+val+"' name='tee_times' value='"+val+"'>" + item.innerHTML;
    }
    var parentDiv = document.getElementsByClassName('colorGuideBox')[0];
    var submitButton = document.createElement("div");
		submitButton.setAttribute('style','display: inline-block;margin-top: 50px;height: 75px;width: 100%;background: green;color:white;font-size: x-large;text-align: center;padding: 22px;border: 1px solid #CCC;box-shadow: 0 0 5px -1px rgba(0,0,0,0.2);cursor:pointer;');
		submitButton.addEventListener("click", startAutoBook, true);
		submitButton.innerHTML = "Auto Reserve";
    parentDiv.appendChild(submitButton);
    // monitors for date change and re-runs script when any link within date section is clicked
    dateChangers = document.getElementById('daySelectRow').querySelectorAll('a');
    dateChangers.forEach(monitorClick);
    function monitorClick(item){
        item.addEventListener("click", actionFunction1);
    }
}
function CreateKeepAliveCookieFake() { //attempt to set a cookie to prevent timeout for 30 days
    var fexdate = new Date();
    var fdate = fexdate.getDate();
    fdate += 30;
    fexdate.setDate(fdate);
    document.cookie = "keepAlive_" + escape(document.location.href) + "=open;expires=" + fexdate.toGMTString() + ";path=/";
}
function startAutoBook () {
    // gets desired date and time from within page, checks if trying to book back-to-back times, then opens reservation page in new tab/window
	try{
		date = document.getElementById('txtDate').value;
        time = document.querySelector('input[name="tee_times"]:checked');
        var bookMultiSpan = document.querySelector('span[title="Check this box if you plan to book back to back tee times."]');
        bookMulti = bookMultiSpan.getElementsByTagName('input')[0];
        CreateKeepAliveCookieFake();
        if(time == null){
			alert("Must select a desired tee time.");
		} else {
        autoURL = "https://www.chateaugcc.com/dialog.aspx?p=NetcaddyPop&tt=MakeTeeTime&NoModResize=1&NoNav=1&ShowFooter=False&courseid=1&date=" + date + "&time=" + time.value + "&hole=1&numholes=0&xsome=4";
        if (bookMulti.checked) { autoURL = autoURL + '&B2B=true&b2bSel=&b2bCnt=2';}
        // window.location.href = autoURL;
        window.open(autoURL, '_blank');
        }
	}
	catch(e){
		 alert('An start error has occurred: '+e.message)
        return;
	}
    }
    selectionPage();
}

//attempt to prevent auto-logout, needs work
waitForKeyElements ('#btnKeepAlive', keepSessionAlive, false);
function keepSessionAlive(jNode) {
    jNode.click();
    document.getElementById('form1').remove();
}

//////////////////////////////RESERVE TEE TIME///////////////////////////////////

waitForKeyElements ('#ctl00_ctrl_MakeTeeTime_lbBook', actionFunction2, true);

function actionFunction2 (jNode) {
function autoBookTime() {
    var makeResButton = document.getElementById('ctl00_ctrl_MakeTeeTime_lbBook');
    if (makeResButton.innerHTML.includes('Update')) {
        return;
    } else {makeResButton.click();}
}
    errorCheck = document.getElementById('errorBox');
    if (errorCheck.innerHTML.includes('not yet open for reservations')) {
        window.location.reload();
    } else {
        /* var errorButtons = errorCheck.getElementsByTagName('a');
        errorButtons.forEach(buttonClick);
        function buttonClick(item){
        item.click();
    }*/
        autoBookTime(); }
}
