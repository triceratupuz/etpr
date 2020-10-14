
function onResaiz() {
	//to resize canvases according to browser window
	canvasW = window.innerWidth * 0.97;
	top_coords = findTopLeft("pianoRoll");
	top_at = top_coords[1];
	left_at = top_coords[0];
	canvasH = (window.innerHeight - top_at) * 0.95;
	c_pr.width = canvasW;
	c_pr.height = canvasH;
	c_ti.width = canvasW;
	c_ti.height = canvasH;
	c_no.width = canvasW;
	c_no.height = canvasH;
	c_ts.width = canvasW;
	c_ts.height = canvasH;

	drawKeys(ctx_pr, notesOctave_, frequencies)
	drawTime();
	drawNotes();
}

function drawKeys(ctx_pr, notesOctave_, frequencies){
              error = canvasH / keysN / 1.5;//see main, global variable
              //draw keyboard
	ctx_pr.clearRect(0, 0, c_pr.width, c_pr.height);
	//keys in current tuning
	var pxfont = Math.round(canvasH / keysN/3) + 1;
	ctx_pr.lineWidth=0.3;
		
	for (var keys_ = 0;  keys_ < keysN; keys_++){
		actkey = keys_ + keysLowest;
		if (actkey < frequencies.length){
			ctx_pr.beginPath();
			if (actkey % notesOctave_ == 0){
				ctx_pr.strokeStyle = "#AA0000"
			} else {
			
				ctx_pr.strokeStyle = 'rgb(' + Math.floor(256 * (actkey % notesOctave_) / notesOctave_) + ', ' + Math.floor(228 * (actkey % notesOctave_) / notesOctave_ ) + ', 220)';
			}
			ctx_pr.moveTo(0, canvasH - (canvasH * keys_ / keysN));
			ctx_pr.lineTo(canvasW , canvasH - (canvasH * keys_ / keysN));
			ctx_pr.stroke();
			//Text
			ctx_pr.font = pxfont.toString() + "px Arial";
			ctx_pr.fillText(actkey.toString() + "_ "+ keys_ % notesOctave_ + " : " + frequencies[actkey].toFixed(3).toString() + " Hz", 0, canvasH - (canvasH * keys_ / keysN) + pxfont);
		}
	}
	
	//keys in standard tuning
	var noteNames = ["C", "", "D", "", "E", "F", "", "G", "", "A", "", "B"];
	var lowf = frequencies[keysLowest];
	var stdLowest = 0;
	//var stdlow = 0;
	for (var stdlow = 0; stdlow < stdFreq.length; stdlow++){
		if (stdFreq[stdlow] >= lowf) {
			stdLowest = stdFreq[stdlow];
			break
		}
	}
	
	for (var stdNoteCounter = stdlow; stdNoteCounter < stdFreq.length; stdNoteCounter++) {
		
		for (var tunNoteCounter = 0; tunNoteCounter < (frequencies.length - 1); tunNoteCounter++){
			if (stdFreq[stdNoteCounter] >= frequencies[tunNoteCounter + keysLowest] && stdFreq[stdNoteCounter] < frequencies[tunNoteCounter + keysLowest + 1]){
				
				var diffratio = (stdFreq[stdNoteCounter] - frequencies[tunNoteCounter + keysLowest]) / (frequencies[tunNoteCounter + keysLowest + 1] - frequencies[tunNoteCounter + keysLowest]);
				var diff = diffratio * (canvasH / keysN);
								
				var pos = canvasH - (tunNoteCounter * canvasH / keysN) - diff;
				
				var idx = (stdNoteCounter) % 12;
				var note =  noteNames[idx];
				
				ctx_pr.lineWidth = 2;
				if (note == "C"){
					ctx_pr.strokeStyle = "#DD0000"
				} else if (note == "") {
					ctx_pr.strokeStyle = "#000000"
				} else {
					ctx_pr.strokeStyle = "#AAAAAA"
				}
				
				ctx_pr.beginPath();
				ctx_pr.moveTo(keysW - keysW / 11, pos);
				ctx_pr.lineTo(keysW, pos);
				ctx_pr.stroke();
					
			} 
		}
	}
}


function changeTuning(notesOctave, octaveMultiplier, cFrequency) {
	//update tuning
	var notesOctave__ = notesOctave;
	var octaveMultiplier__ = octaveMultiplier;
	var cFrequency__ = cFrequency;
	document.getElementById("notesOctave").valueAsNumber = notesOctave__;
	document.getElementById("octaveMultiplier").valueAsNumber = octaveMultiplier__;
	document.getElementById("CFrequency").valueAsNumber = cFrequency__;
	updateKeyVals();
}


var drawTimeStart = 0;//to manipulate firstBeat

function setdrawTimeStart(){
	//set time 0
	//selected by dropdown
	var e = document.getElementById("divBeatStart");
	var value = e.options[e.selectedIndex].value;
	if (value == 0) {
		drawTimeStart = 0;
	} else {
		for (var co = 0; co < score.length; co++) {
			if (score[co][5] == 1){
				if (value == 1) {
					drawTimeStart = score[co][1];
				} else if (value == 2) {
					drawTimeStart = score[co][2];	
				}
			}
		}
	}
	drawTime();
}





function drawTime() {
	//draw time lines
	ctx_ti.clearRect(0, 0, c_ti.width, c_ti.height);
	ctx_pr.lineWidth=0.1;
	var startwindow = firstBeat;
	var endwindow = firstBeat + beatN;
	var beatTxt = 0;
	//Straight Beats
	for (var cbeats = drawTimeStart; cbeats < endwindow; cbeats++) {
		
		ctx_ti.beginPath();
		ctx_ti.strokeStyle = '#AAAAAA';	
		ctx_ti.moveTo(scoToPosX(cbeats),0);
		ctx_ti.lineTo(scoToPosX(cbeats),c_ti.height);
		ctx_ti.stroke();
		
		beatTxt = Math.round(cbeats - drawTimeStart);
		ctx_ti.font = "10px Arial";
		ctx_ti.fillText((beatTxt).toString() ,scoToPosX(cbeats), 20);
	}
	//draw division
	var e = document.getElementById("divBeat");
	var qvalue_ = e.options[e.selectedIndex].value;
	var qvalue = timeMultippp[qvalue_];
	for (var cdiv = drawTimeStart; cdiv < endwindow; cdiv = cdiv + qvalue) {
		ctx_ti.beginPath();
		ctx_ti.strokeStyle = '#CC88AA';	
		ctx_ti.moveTo(scoToPosX(cdiv),0);
		ctx_ti.lineTo(scoToPosX(cdiv),c_ti.height);
		ctx_ti.stroke();
		
		
	}
}


function setDrawTimeByNota(nota) {
	//when nota is selected update quantize info
	var notaL = nota.length;
	drawTimeStart = nota[notaL - 3];
	
	var edivis = document.getElementById("divBeat");
	edivis.selectedIndex = nota[notaL - 2];
	
	timeMultiplier = nota[notaL - 1];
	var emultip = document.getElementById("timeMultiplier");
	emultip.value = timeMultiplier;
	
	drawTime()
}




function drawScroller(time) {
	//draw time scroller
	ctx_ts.clearRect(0, 0, c_ts.width, c_ts.height);
	ctx_ts.beginPath();
	ctx_ts.strokeStyle = '#DD0000';	
	ctx_ts.moveTo(scoToPosX(time),0);
	ctx_ts.lineTo(scoToPosX(time),c_ts.height);
	ctx_ts.stroke();
	
}




function upDownKeys(val) {
	//move the keyboard
	var move = parseInt(val);
	notesOctave_ = document.getElementById("notesOctave").valueAsNumber;
	if (Math.abs(move) == 1) {
		keysLowest = keysLowest + move;
	} else {
		if (move > 0) {keysLowest = keysLowest + notesOctave_;} 
		else {keysLowest = keysLowest - notesOctave_;}
	}
	if (keysLowest <= 0) {
		keysLowest = 0;
	} else if (keysLowest >= (frequencies.length - keysN)) {
		keysLowest = frequencies.length - keysN;
	} 
	//redraw keyboard
	drawKeys(ctx_pr, notesOctave_, frequencies);
	drawNotes();
}


function fwdBwdBeat(val) {
	//move time
	var move = parseInt(val);
	if (Math.abs(move) == 1) {
		firstBeat = firstBeat + move;
	} else {
		if (move > 0) {firstBeat = firstBeat + beatN;} 
		else {firstBeat = firstBeat - beatN;}
	}
	if (firstBeat < 0) {
		firstBeat = 0;
	}
	drawTime();
	drawNotes();
	find_srcIdx();//calculation for play audio
}


function zoomTime(val) {
	//alter the number of beats visible
	var corr = parseInt(val);
	beatN = beatN + corr;
	if (beatN < 1) {beatN = 1;}
	drawTime();
	drawNotes();
	find_srcIdx();//calculation for play audio
}


function zoomKeys(val) {
	//alter the number of keys visible
	var corr = parseInt(val);
	keysN = keysN + corr;
	if (keysN < 1) {keysN = 1;}
	if (keysN > (frequencies.length - keysLowest)) {keysN = frequencies.length - keysLowest;}
	drawKeys(ctx_pr, notesOctave_, frequencies);
	drawNotes();
}


function centervisible(){
	//center view to visible
	var min_freq = 40000;
	var max_freq = 0;
	if (score.length > 0){	
		for (var noteid = 0; noteid < score.length; noteid++) {
			var freq = score[noteid][4];
			if (freq < min_freq) {min_freq = freq;}
			if (freq > max_freq) {max_freq = freq;}
		}
			
		var min_idx	= 400000;
		var max_idx	= -1;
		
		for (var freqidx = 1; freqidx < frequencies.length - 1; freqidx++){
			if (min_freq < frequencies[freqidx + 1] && min_freq > frequencies[freqidx - 1]) {
				//lowest freq
				min_idx = freqidx;
			}
			if (max_freq < frequencies[freqidx + 1] && max_freq > frequencies[freqidx - 1]) {
				//lowest freq
				max_idx = freqidx;
			}
			
		}
		keysLowest = min_idx;
		keysN = max_idx - min_idx;
		//console.log(keysLowest);
		//console.log(keysN);
		
		drawKeys(ctx_pr, notesOctave_, frequencies)
		drawTime();
		drawNotes();
	}
}


function findTopLeft(element) {
  //to find the position of an element in the browser
  var rec = document.getElementById(element).getBoundingClientRect();
  return [rec.left + + window.scrollX, rec.top + window.scrollY];
} 


function instrumentColor() {
	// select your select tag if his id is "selectStatus"
	var selectStatus = document.getElementById("actualInstrument");
	// get the number of the option currently selected
	var optionSelected = selectStatus.selectedIndex;
	// set his background-color to the class'name of the option
	selectStatus.style.background = selectStatus.options[optionSelected].className;
	//Then color each option in her proper class
	for (var option = 0; option < selectStatus.options.length; option++){
		var clor = selectStatus.options[option].className;
	    selectStatus.options[option].style.background = clor;
	}
}


function changeInstr() {
	//on change instrument
	var selectInstr = document.getElementById("actualInstrument");
	var optionSelected = selectInstr.selectedIndex;
	var instr = selectInstr.options[selectInstr.selectedIndex].value;
	//Update color
	selectInstr.style.background = selectInstr.options[optionSelected].className;
	//Update Wave
	var selectWave = document.getElementById("actualInstrument_w");
	selectWave.value = instrWaveMute[instr][0];
	//Update Mute
	var selectMute = document.getElementById("actualInstrument_m");
	var mm = instrWaveMute[instr][1];
	if (mm == 1) {
		selectMute.checked = true;
	} else {
		selectMute.checked = false;
	}
	//Update Hide
	var selectHide = document.getElementById("visibleInstr");
	var hide = instrWaveMute[instr][3];
	if (hide == 1) {
		selectHide.checked = true;
	} else {
		selectHide.checked = false;
	}
	
	
	//Update currentnote structure
	currnote = instrWaveMute[optionSelected][2];
	for (var pfc = 5; pfc < 16; pfc++){
		document.getElementById("validPf" + (pfc + 1).toString()).checked = false;
		document.getElementById("Pf" + (pfc + 1).toString()).value = 0.0;
	}
	updGuiPf(instrWaveMute[instr][2]);

}

function hideInstr(){
	//hide instrument notes on piano roll, flag to not draw
	var selectInstr = document.getElementById("actualInstrument");
	var instr = selectInstr.options[selectInstr.selectedIndex].value;
	var hide = instrWaveMute[instr][3];
	if (hide == 0) {
		instrWaveMute[instr][3] = 1;
	} else {
		instrWaveMute[instr][3] = 0;
	}
	drawNotes();
}


function timeQuantize(time) {
	//quantize time
	//must take in account firstbeat
	var timeinput = time - drawTimeStart
	var qqq = document.getElementById("quantize").checked;
	var e = document.getElementById("divBeat");
	var qvalue_ = e.options[e.selectedIndex].value;
	var qvalue = timeMultippp[qvalue_];
	if (qqq) {
		//quantizza
		var qty = timeinput / qvalue;
		timeoutput = Math.round(qty) * qvalue + drawTimeStart;
	} else {
		timeoutput = time;
	}
	return timeoutput
}





function posToScoX(evt) {
	//convert mouse position to score values
	var x = evt.clientX - left_at - keysW;
	var time = firstBeat + beatN * x / (canvasW - keysW)
	return time
}

function posToScoY(evt) {
	//convert mouse position to score values
	var y = 1 - (evt.clientY - top_at) / canvasH;//adimensional value 
	var note = keysLowest + Math.round(keysN * y);
	//return frequencies[note];
	return [frequencies[note],note];
}

function scoToPosX(time) {
	//convert score values to mouse position
	return keysW + (time - firstBeat) * (canvasW - keysW) / beatN;
}

function scoToPosY(freq) {
	//convert score values to mouse position
	var minf = frequencies[keysLowest];
	var maxf = frequencies[keysLowest + keysN];
	//mathematical approximation crap
	var numn = 0; 
	for (vv = 0; vv <= frequencies.length; vv++) {
		if (frequencies[vv] >= freq) {
			numn = vv;
			break;
		}
	}
	var decc = (freq - frequencies[vv - 1]) / (frequencies[vv] - frequencies[vv - 1])
	var equivkey = vv + decc - keysLowest - 1;
	return ((keysN - equivkey) * (canvasH / keysN));
}

function drawNotePoint(x,y) {
	ctx_no.beginPath();
	ctx_no.arc(x, y, canvasH / keysN / 4, 0, 2*Math.PI);//merda
	ctx_no.stroke();
}

function drawNoteLine(x1, x2, y) {
	//draw line connecting note begin and note end
	ctx_no.beginPath();
	ctx_no.moveTo(x1,y);
	ctx_no.lineTo(x2,y);
	ctx_no.stroke();
}

function drawNoteVol(x, y, vol) {
	//draw vertical line as vol indication
	var volY = 4 * vol * canvasH / keysN
              var y0 = y - error;//see error global variable
              ctx_no.beginPath();
	ctx_no.moveTo(x,y);
	ctx_no.lineTo(x,y0 - volY);
	ctx_no.stroke();
	//draw arrow indication
	ctx_no.beginPath();
              var radius = canvasH / keysN
              var xp = Math.cos(0.5 * Math.PI * vol) * radius
              var yp = Math.sin(0.5 *  Math.PI * vol) * radius
	ctx_no.moveTo(x - xp, y0 + yp - volY);
	ctx_no.lineTo(x,y0 - volY);
	ctx_no.lineTo(x + xp, y0 + yp - volY);
	ctx_no.stroke();
	
}

function drawNota(nota) {
	//draw note
	if (instrWaveMute[nota[0]][3] == 0) {//if instrument visible
		
		var color = "black";//if selected
		var notaL = nota.length;
		if (nota[notaL - 8] == 0) {
			var color = "#" + kelly_colors[nota[0]];//if not selected
		}
		ctx_no.strokeStyle = color;
		ctx_no.lineWidth = canvasH / keysN / 2;
		var x1 = scoToPosX(nota[1]);
		var x2 = scoToPosX(nota[2]);
		var y = scoToPosY(nota[4]);
		var vol = nota[3];
		drawNotePoint(x1, y);
		drawNotePoint(x2, y);
		drawNoteLine(x1, x2, y);
		drawNoteVol(x1, y, vol)
	}
}




function findNotesVisible() {
	//fill the score_visible array
	score_visible = [];
	var scolen = score.length;
	//for (var vnotes = 0; vnotes < score.length; vnotes++) {
	for (var vnotes = 0; vnotes < scolen; vnotes++) {
		//duration check, remove notes with duration 0
		if (score[vnotes][1] >= score[vnotes][2]) {
			
			score.splice(vnotes, 1);
			scolen = score.length;
			vnotes -= 1;
		} else {
		
			//time check
			if (score[vnotes][1] >= firstBeat &&  score[vnotes][2] <= firstBeat + beatN) {
				var minf = frequencies[keysLowest];
				var maxf = frequencies[keysLowest + keysN];
				if (score[vnotes][4] >= minf && score[vnotes][4] <= maxf) {
					score_visible.push(score[vnotes]);
				}
			}
		}

	} 
}

function drawNotes() {
	//draw all the visible notes in the array score_visible
	findNotesVisible();
	ctx_no.clearRect(0, 0, c_pr.width, c_pr.height);
	for (var vnotes = 0; vnotes < score_visible.length; vnotes++) {
		drawNota(score_visible[vnotes]);
	}
}

function clearNotesArray() {
	//reset all the notesarrays	
	score = [];//complete score
	score_visible = [];//only visible score notes
	var inste = document.getElementById("actualInstrument");
	var instv = inste.options[inste.selectedIndex].value;
	currnote = instrWaveMute[instv][2];//note to be inserted
	//currnote = [0, 0, 0, 0, 0, 0, 0, 0, 0];//note to be inserted
	/*
	0 instrument
	1 start
	2 stop
	3 volume
	4 frequency
	//additional pfields
	5  len-8 -5 selected
	6  len-7 -4 var indexnote
	7  len-6 -3 var notesOctave = document.getElementById('notesOctave').value;
	8  len-5 -2 var octaveMultiplier = document.getElementById('octaveMultiplier').value;
	9  len-4 -1 var cFrequency = document.getElementById('CFrequency').value;
	10 len-3 time
	11 len-2 time
	12 len-1 time
	*/
}




//mouse dragging
var drag = 0;
var addNote = 0;//conferma aggiunta nota
var moveNote = 0;//indice della nota da spostare + 1, 0 niente
var chleNote = 0;//indice della nota da allungare/accorciare/cancellare + 1, 0 niente
var volNote = 0;//indice della nota da allungare/accorciare/cancellare + 1, 0 niente

var paste_ready = 0;//?????????????

function mouseClick(evt) {
	if (paste_ready == 0) {
		//draw manipulate notes
		noteStart(evt);
	} else {
		//paste notes
		pasteSelected(evt);
	}
}



function noteStart(evt) {
	var mouseOV = mouseOverIP(evt);//search if mouse is on a free area or not
	//evt.preventDefault();//not work for right click
	var button = evt.button;//0 left, 1 center, 2 right
	
	var startToFind = evt.clientX - left_at;
	var heightToFind = evt.clientY - top_at;
	var inste = document.getElementById("actualInstrument");
	var instv = inste.options[inste.selectedIndex].value;
	
	if (button == 0) {
		if (mouseOV == 0) {
			//new note
			addNote = 1;//conferma aggiunta nota
			//start note (at begin move note, at end change length)
			drag = 1;
			//instrument
			var inste = document.getElementById("actualInstrument");
			var instv = inste.options[inste.selectedIndex].value;
			pitchInfo = posToScoY(evt)
			noteHeight = pitchInfo[0];//return score values
			noteNumber = pitchInfo[1];
			noteBegin = timeQuantize(posToScoX(evt));//return score values
			volume = 0.5;
			noteEnd = 0;
			var notesOctave = document.getElementById('notesOctave').value;
			var octaveMultiplier = document.getElementById('octaveMultiplier').value;
			var cFrequency = document.getElementById('CFrequency').value;
			
			//pass by ref, not by value
			currnote = instrWaveMute[instv][2];
			var currnoteL = currnote.length;
			
			currnote[0] = instv;
			currnote[1] = noteBegin;
			currnote[2] = noteEnd;
			currnote[3] = volume;
			currnote[4] = noteHeight;
			currnote[currnoteL -8] = 0;
			currnote[currnoteL -7] = noteNumber;
			currnote[currnoteL-6] = notesOctave;
			currnote[currnoteL-5] = octaveMultiplier;
			currnote[currnoteL-4] = cFrequency;
			currnote[currnoteL-3] = drawTimeStart;
			var e = document.getElementById("divBeat");
			var qvalue_ = e.selectedIndex;
			currnote[currnoteL-2] = qvalue_;
			currnote[currnoteL-1] = timeMultiplier;
			
			
		} else if (mouseOV == 1) {
			//move note
			for (var vnotes = 0; vnotes < score.length; vnotes++) {
				var begXpos = scoToPosX(score[vnotes][1]);
				var noteYpos = scoToPosY(score[vnotes][4]);
				var instr = score[vnotes][0];
				if  (begXpos > (startToFind - error) && begXpos < (startToFind + error) && noteYpos > (heightToFind - error) && noteYpos < (heightToFind + error) && instr == instv) {
					 	moveNote = vnotes + 1;
						break;
				}
			}
		} else if (mouseOV == 2) {
			//change lenght or delete on score
			for (var vnotes = 0; vnotes < score.length; vnotes++) {
				var endXpos = scoToPosX(score[vnotes][2]);
				var noteYpos = scoToPosY(score[vnotes][4]);
				var instr = score[vnotes][0];
				if  (endXpos > (startToFind - error) && endXpos < (startToFind + error) && noteYpos > (heightToFind - error) && noteYpos < (heightToFind + error) && instr == instv) {
					 	chleNote = vnotes + 1;
						break;
				}
			}

				
		} else if (mouseOV == 3) {
			//change volume
			for (var vnotes = 0; vnotes < score.length; vnotes++) {
				var begXpos = scoToPosX(score[vnotes][1]);
				var noteYpos = scoToPosY(score[vnotes][4]);
				var instr = score[vnotes][0];
				var volYpos = noteYpos - (4 * score[vnotes][3] * canvasH / keysN)
				if  (begXpos > (startToFind - error) && begXpos < (startToFind + error) && volYpos > (heightToFind - error) && volYpos < (heightToFind + error) && instr == instv) {
					 	volNote = vnotes + 1;
						break;
				}
		
			}
		} else if (mouseOV == 4) {
			//select nota index 5 determie if selected or not
			for (var vnotes = 0; vnotes < score.length; vnotes++) {
				var begXpos = scoToPosX(score[vnotes][1]);
				var endXpos = scoToPosX(score[vnotes][2]);
				var noteYpos = scoToPosY(score[vnotes][4]);
				var instr = score[vnotes][0];
				if ((begXpos + error) < startToFind && (endXpos - error) > startToFind && noteYpos > (heightToFind - error) && noteYpos < (heightToFind + error)){
					var notarrl = score[vnotes].length;
					if (score[vnotes][notarrl-8] == 0) {
						var notarrl = score[vnotes].length;
						score[vnotes][notarrl-8] = 1;
						//change tuning according note
						changeTuning(score[vnotes][notarrl-6], score[vnotes][notarrl-5], score[vnotes][notarrl-4])
						setdrawTimeStart();
						//show note pfields
						updGuiPf(score[vnotes]);
						last_note_i = vnotes;
					
						//SET TIME DIVISORS and update draw
						setDrawTimeByNota(score[vnotes]);
					
						//Play nota
						/*
						audioCtx.resume().then(() => {
							var inst = score[vnotes][0];
							var ct = score[vnotes][1] - counter;
							var et = ct + (score[vnotes][2] - score[vnotes][1]) * 60.0 / bpm;
							var vl = score[vnotes][3];
							var fr = score[vnotes][4];
							var wav = instrWaveMute[vnotes][0];
							playNota(ct, et, vl, fr, wav)
						});
						*/
					} else {
						score[vnotes][notarrl-8] = 0;
						//show note pfields
						updGuiPf(instrWaveMute[document.getElementById('actualInstrument').value][2]);
						last_note_i = vnotes;
					
					}
				}
			}
	
		}
	
	}
}



function noteEnd(evt) {
	var button = evt.button;
	if (button == 0 && addNote == 1) {
		drag = 0;
		note_end = timeQuantize(posToScoX(evt));
		var currnotetoappend = new Array();
		for (var icta = 0; icta < currnote.length; icta++){
			currnotetoappend[icta] =  currnote[icta];//BY VAL???
		}
		
		//order begin and end of the note
		if (note_end >= currnote[1]) {
			currnotetoappend[2] = note_end;
			
		} else if (note_end < currnote[1]){
			currnotetoappend[2] = timeQuantize(currnote[1]);
			currnotetoappend[1] = note_end;
			
		}
		
		score.push(currnotetoappend);
		updGuiPf(currnotetoappend);
		
		drawNotes();
		addNote = 0;
		
	} else if (button == 0 && moveNote >= 1) {
		//move
		var dur = score[moveNote - 1][2] - score[moveNote - 1][1]
		var pitchInfo = posToScoY(evt)
		var newHeight = pitchInfo[0];
		var noteNumber = pitchInfo[1];
		var	newBegin = posToScoX(evt)		
		score[moveNote - 1][1] = timeQuantize(newBegin);
		score[moveNote - 1][2] = timeQuantize(newBegin + dur);
		score[moveNote - 1][4] = newHeight;
		var notarrl = score[moveNote - 1].length;
		score[moveNote - 1][notarrl - 7] = noteNumber;
		score[moveNote - 1][notarrl - 6] = document.getElementById('notesOctave').value;
		score[moveNote - 1][notarrl - 5] = document.getElementById('octaveMultiplier').value;
		score[moveNote - 1][notarrl - 4] = document.getElementById('CFrequency').value;
		score[moveNote - 1][notarrl - 3] = drawTimeStart;
		var e = document.getElementById("divBeat");
		var qvalue_ = e.selectedIndex;
		score[moveNote - 1][notarrl - 2] = qvalue_;
		score[moveNote - 1][notarrl - 1] = timeMultiplier;

		last_note_i = moveNote - 1;//indexing for pfields
		
		updGuiPf(score[last_note_i]);
		moveNote = 0;

	} else if (button == 0 && chleNote >= 1) {
		//move - delete
		var	newEnd = timeQuantize(posToScoX(evt));
		if (newEnd > score[chleNote - 1][1]) {
			//se positivo cambia lunghezza
			score[chleNote - 1][2] = newEnd;
			
			last_note_i = chleNote - 1;
			updGuiPf(score[last_note_i]);
			
		} else {
			//se negativo o uguale cancella nota da score
			score.splice(chleNote - 1, 1);
		}
		chleNote = 0;

	} else if (button == 0 && volNote >= 1) {
		var newVolPos = evt.clientY - top_at;
		var noteYpos = scoToPosY(score[volNote - 1][4]);
		var volll = (noteYpos - newVolPos) / (4 * canvasH / keysN)
		if (volll > 1) {
			//normalizza
			score[volNote - 1][3] = 1;
		} else if (volll <= 1 && volll > 0) {
			//OK
			score[volNote - 1][3] = volll;
		} else if (volll <= 0) {
			//se negativo o 0 cancella nota
			score.splice(volNote - 1, 1);
		} 
		
		last_note_i = volNote - 1;
		volNote = 0;
	}
	drawNotes();//Update canvas
}

function noteInterr(evt) {
	drag = 0;
	addNote = 0;
	chleNote = 0;
	volNote = 0;
}

function mouseOverIP(evt) {
	//mouse over interesting point
	var status = 0;
	var mousX = evt.clientX - left_at;
	var mousY = evt.clientY - top_at;
	for (var vnotes = 0; vnotes < score_visible.length; vnotes++) {
		var begX = scoToPosX(score_visible[vnotes][1]);
		var begY = scoToPosY(score_visible[vnotes][4]);
		var endX = scoToPosX(score_visible[vnotes][2]);
		var endY = begY;
		var volX = begX;
		var volY = begY - (4 * score_visible[vnotes][3] * canvasH / keysN);
		if  (begX > (mousX - error) && begX < (mousX + error) && begY > (mousY - error) && begY < (mousY + error)) {
			status = 1;
			document.getElementById("notesCanvas").style.cursor = "pointer";
			break;
		} else if (endX > (mousX - error) && endX < (mousX + error) && endY > (mousY - error) && endY < (mousY + error)) {
			status = 2;
			document.getElementById("notesCanvas").style.cursor = "pointer";
			break;
		} else if (volX > (mousX - error) && volX < (mousX + error) && volY > (mousY - error) && volY < (mousY + error)) {
			document.getElementById("notesCanvas").style.cursor = "pointer";
			status = 3;
			break;
		} else if ((begX + error) < mousX && (endX - error) > mousX && begY > (mousY - error) && begY < (mousY + error)) {
			//WRONG Don't allow to draw another note on top of another note//workaround draw somwhere else than move 
			document.getElementById("notesCanvas").style.cursor = "pointer";
			status = 4;
			break;
		} else {
			status = 0;
			document.getElementById("notesCanvas").style.cursor = "auto";
		}		
	}
	return status;
}


function isNotSelected(note){
	//determine if a note is selected 
	var notarrl = note.length;
	//return note[5] < 1;
	return note[notarrl - 8] < 1;
}



function tocurrentinstr(){
	//Change the instrument of selected note
	//get instrument
	var inste = document.getElementById("actualInstrument");
	var instv = inste.options[inste.selectedIndex].value;	
	//cange to selected
	for (var notac=0; notac < score.length; notac++){
		var notarrl = score[notac].length;
		if (score[notac][notarrl - 8]>0){
			score[notac][0] = instv;
		}
	}
	drawNotes();
}




function copySelected(cut) {
	//Copy and cut buttons
	//var score_buffer
	score_buffer = [];
	var note_buf = new Array;
	//fill buffer
	for (var notac=0; notac < score.length; notac++){
		var notarrl = score[notac].length;
		if (score[notac][notarrl - 8]>0){  
			note_buf = [];
			for (var cop = 0;cop < score[notac].length; cop++){
				note_buf.push(score[notac][cop]);
			}
			score_buffer.push(note_buf); 
		}
	}
	if (cut=="c"){
		//if cut instead of copy delete the records from the score
		score = score.filter(isNotSelected);
		drawNotes();//Update canvas
	}
	
	//search first note
	if (score_buffer.length > 0){
		var firstbegin = score_buffer[0][1];
		for (var notac=1; notac < score_buffer.length; notac++){
			if (score_buffer[notac][1]<firstbegin){ firstbegin = score_buffer[notac][1]}
		}
		var newbeg;
		var newend;
		for (var notacu=0; notacu < score_buffer.length; notacu++){
			newbeg = score_buffer[notacu][1] - firstbegin;
			score_buffer[notacu][1] = newbeg;
			newend = score_buffer[notacu][2] - firstbegin;
			score_buffer[notacu][2] = newend; 
		}
	}
}




function pasteSelected(evt) {
	//pasting with click
	noteBegin = timeQuantize(posToScoX(evt));//return score values
	//deselect source notes
	for (var notac=0; notac < score.length; notac++){
		var notarrl = score[notac].length;
		if (score[notac][notarrl - 8] > 0){  
			score[notac][notarrl - 8] = 0;
		}
	}
	
	
	//append notes on click location
	var note_buf = new Array;
	for (var notac=0; notac < score_buffer.length; notac++){
		note_buf = [];
		for (var cop = 0;cop < score_buffer[notac].length; cop++){
			if (cop == 1 || cop == 2) {
				note_buf.push(score_buffer[notac][cop] + noteBegin);
			} else {
				note_buf.push(score_buffer[notac][cop]);		
			}
		}
		score.push(note_buf); 
	}
	drawNotes();
}

function pasteButton() {
	//Paste button
	var btn = document.getElementById('pastebtn');
	var btnv = btn.value;
	if (btnv == "Paste") {
		paste_ready = 1;
		btn.value = "PASTING"
		btn.style.backgroundColor="red";
	} else {
		paste_ready = 0;
		btn.value = "Paste"
		btn.style.backgroundColor="";
	}
}


function deselectAll(){
	for (var i = 0; i < score.length; i++) {
		var notarrl = score[i].length;
		score[i][notarrl - 8] = 0;
	}
	drawNotes();
}


function selectFromHereToEnd(mode) {
	if (mode == 'i'){
		//only current
		var inste = document.getElementById("actualInstrument");
		var instv = inste.options[inste.selectedIndex].value;	
		for (var i = 0; i < score.length; i++) {
			if (score[i][1] >= firstBeat && score[i][0] == instv) {
				var notarrl = score[i].length;
				score[i][notarrl - 8] = 1;
			}
		}
	} else {
		//all instruments
		for (var i = 0; i < score.length; i++) {
			if (score[i][1] >= firstBeat) {
				var notarrl = score[i].length;
				score[i][notarrl - 8] = 1;
			}
		}
	}
	drawNotes();
}

function selectFromHereToN(mode) {
	var to = parseFloat(document.getElementById('seleftfhtnn').value);
	if (mode == 'i'){
		//only current
		var inste = document.getElementById("actualInstrument");
		var instv = inste.options[inste.selectedIndex].value;		
		for (var i = 0; i < score.length; i++) {
			if (score[i][1] >= firstBeat && score[i][1] < to && score[i][0] == instv) {
				var notarrl = score[i].length;
				score[i][notarrl - 8] = 1;
			}
		}
	} else {
		//all instruments
		for (var i = 0; i < score.length; i++) {
			if (score[i][1] >= firstBeat && score[i][1] < to) {
				var notarrl = score[i].length;
				score[i][notarrl - 8] = 1;
			}
		}
	}
	drawNotes();
}
