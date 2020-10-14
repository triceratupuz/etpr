//SAVE LOAD SAVE LOAD SAVE LOAD SAVE LOAD SAVE LOAD SAVE LOAD SAVE LOAD SAVE LOAD
//SAVE LOAD SAVE LOAD SAVE LOAD SAVE LOAD SAVE LOAD SAVE LOAD SAVE LOAD SAVE LOAD
//SAVE LOAD SAVE LOAD SAVE LOAD SAVE LOAD SAVE LOAD SAVE LOAD SAVE LOAD SAVE LOAD
//SAVE LOAD SAVE LOAD SAVE LOAD SAVE LOAD SAVE LOAD SAVE LOAD SAVE LOAD SAVE LOAD
//SAVE LOAD SAVE LOAD SAVE LOAD SAVE LOAD SAVE LOAD SAVE LOAD SAVE LOAD SAVE LOAD



function scoreAsString(score_) {
	//converts the score array to a string to be written
	var outstring = "";
	//GENERAL info
	var notesOctave = document.getElementById('notesOctave').value;
	var octaveMultiplier = document.getElementById('octaveMultiplier').value;
	var cFrequency = document.getElementById('CFrequency').value;
	var bpm = document.getElementById('bpm').value;
	var tdiv = document.getElementById('timeMultiplier').value;
	outstring = ";notesOctave\t" + notesOctave + "\r\n;octaveMultiplier\t" + octaveMultiplier + "\r\n;cFrequency\t" + cFrequency + "\r\n;bpm\t" + bpm + "\r\n;timeMultiplier\t" + tdiv + "\r\n";

	//INSTRUMENTS INFO
	
	
	for (var instr = 0; instr < instrWaveMute.length; instr++) {
		var instrStr = ";";
		instrStr = instrStr + instrWaveMute[instr][0] + "\t" + instrWaveMute[instr][1] + "\t";
		for (pf = 0; pf < instrWaveMute[instr][2].length; pf++){
			//additional pfields
			if (pf < 5 || pf > instrWaveMute[instr][2].length - 6) {
				instrStr = instrStr + "0\t"
			} else {
				instrStr = instrStr + instrWaveMute[instr][2][pf] + "\t"
			}
			
		}
		outstring = outstring + instrStr + "\t" + instrWaveMute[instr][3] + "\r\n" ;
	}
	
	
	//Score begin
	outstring = outstring + ";SCORE\r\n";
	//notes
	for (var vnotes = 0; vnotes < score_.length; vnotes++) {
		var item = score_[vnotes];
		var notarrl = score_[vnotes].length;
		outstring = outstring + "i";
		//console.log(item);
		for (var vparam = 0; vparam < item.length; vparam++) {
			if (vparam == 2) {
				outstring = outstring + "\t" + (item[vparam] - item[1]).toString();//duration instead of endpoint	
			} else if (vparam == (notarrl - 8)) {
				outstring = outstring + "\t;" + item[vparam].toString();//divisore per info tuning
				
			} else {
				outstring = outstring + "\t" + item[vparam].toString();
			}
		}
		outstring = outstring + "\r\n";
	}
	return outstring;
}


function stringAsScore(str){
	//convert a string in score array
	var score_ = new Array();
	var arr1 = str.split("\r\n");
	//GENERAL info
	var notesOctave = arr1[0].split("\t")[1];
	var octaveMultiplier = arr1[1].split("\t")[1];
	var cFrequency = arr1[2].split("\t")[1];
	var bpm = arr1[3].split("\t")[1];
	var tdiv = arr1[4].split("\t")[1];
	document.getElementById('notesOctave').value = notesOctave;
	document.getElementById('octaveMultiplier').value = octaveMultiplier;
	document.getElementById('CFrequency').value = cFrequency;
	document.getElementById('bpm').value = bpm;
	document.getElementById('timeMultiplier').value = tdiv;
	
	//Update Globals
	notesOctave_ = notesOctave;
	octaveMultiplier_ = octaveMultiplier;
	minFreq = cFrequency;
	ratios = calculateTuning(notesOctave_, octaveMultiplier_);
	frequencies = calculateFrequencies(ratios, minFreq, maxFreq, notesOctave_, octaveMultiplier_);

	
	
	//INSTRUMENTS INFO and score start
	//var scoreStart = 0;
	instrWaveMute = [];
	for (var scoreFinder = 5; scoreFinder < arr1.length; scoreFinder++) {
		//console.log(arr1[scoreFinder]);
		if (arr1[scoreFinder] == ";SCORE") {
			break;
		}
		var instrStr = arr1[scoreFinder].replace(";", "");
		var instrsStr = instrStr.split("\t");
		//console.log(instrsStr);
		var instrudef = new Array();
		instrudef.push(instrsStr[0]);
		instrudef.push(instrsStr[1]);


		var instrpf = new Array();
		for (var ipf = 2; ipf < instrsStr.length-2; ipf++){
			instrpf.push(parseFloat(instrsStr[ipf]));
		}
		//console.log(instrpf);
		//console.log(instrpf.length);
		instrudef.push(instrpf);
		
		//Add visibility
		instrudef.push(0);
		
		instrWaveMute.push(instrudef);
	}
	//console.log(instrWaveMute);
	changeInstr();//update GUI
	
	//notes
	for (var co = scoreFinder+1; co < arr1.length; co++) {//not i
		var arrnotas = arr1[co];
		arrnotas = arrnotas.replace(";", "");
		//console.log(arrnotas);
		var arrnota = arrnotas.split("\t");
		//console.log(arrnota);
		//not empty string
		if (arrnota[0] != "") {
			arrnota.splice(0, 1);//remove i at beginning
			//console.log(arrnota);
			//tipizzazione valori
			arrnota[0] =  arrnota[0].toString();
			for (var item = 1; item < arrnota.length; item++) {
				if (item == 2) {
					arrnota[item] = parseFloat(arrnota[item]) + parseFloat(arrnota[1]);//duration instead of endpoint	
				} else {
					arrnota[item] = parseFloat(arrnota[item]);
				}
			}
			//console.log(arrnota);
			score_.push(arrnota);
		}
	}
	//console.log(score_);
	return score_;
}




function saveTextAsFile()
{
    //var textToSave = document.getElementById("inputTextToSave").value;
	var textToSave = scoreAsString(score);
    var textToSaveAsBlob = new Blob([textToSave], {type:"text/plain"});
    var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
    var fileNameToSaveAs = document.getElementById("inputFileNameToSaveAs").value;
 
    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    downloadLink.href = textToSaveAsURL;
    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
 
    downloadLink.click();
	//redraw
	//clearNotesArray();
	drawNotes();//does not redraw after save
}
 
 
function destroyClickedElement(event)
{
    document.body.removeChild(event.target);
	//clearNotesArray();
	//redraw
	drawNotes();//does not redraw after save
}



function loadFileAsText()
{
    var fileToLoad = document.getElementById("fileToLoad").files[0];
 	//console.log(fileToLoad.name);
	document.getElementById("inputFileNameToSaveAs").value = fileToLoad.name;
	
    var fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent) 
    {
        var textFromFileLoaded = fileLoadedEvent.target.result;
        //document.getElementById("inputTextToSave").value = textFromFileLoaded;
		score = stringAsScore(textFromFileLoaded);
		//redraw
		updateKeyVals();
		centervisible();
    };
    fileReader.readAsText(fileToLoad, "UTF-8");
	clearNotesArray();
	
}
 
