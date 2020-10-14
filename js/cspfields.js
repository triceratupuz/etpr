


function additionalPfields(id) {
	//Update definitions
	var instr = document.getElementById('actualInstrument').value;
	var numbs = id.replace("validPf", "");
	var numbe = parseInt(numbs);
	var instdef = instrWaveMute[instr][2];
	//console.log(instdef);
	var instdefL = instdef.length;
	
	

	//Campo aggiunto
	if (document.getElementById(id).checked == true){
		//Campo aggiunto
		instdef = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		for (var src = 6; src <= numbe; src++){
			var validator = document.getElementById("validPf" + src.toString()).checked;
			if (validator == false){
				document.getElementById("validPf" + src.toString()).checked = true;
			}
			var value = parseFloat(document.getElementById('Pf'+(src).toString()).value);
			instdef.splice(src-1, 0, value);
		}
		instrWaveMute[instr][2] = instdef;
		//console.log(instdef);
		
	} else {
		//Campo tolto
		var instdefL = instdef.length;
		//remove valid field flag
		for (var src = numbe; src <= (instdefL - 8); src++){
			document.getElementById("validPf" + src.toString()).checked = false;
			
		}
		//remove value from model
		for (var src = (instdefL - 8); src >= numbe; src--){
			instdef.splice(src - 1, 1);
		}
		instrWaveMute[instr][2]= instdef;
		//console.log(instdef);
	}
	//console.log(instrWaveMute);
	
	//console.log(score);
	if (score.length > 0) {
		for (var scoi = 0; scoi < score.length;scoi++){
			score[scoi] = updNotesInScore(parseInt(score[scoi][0]), score[scoi]);
		}
	}

	//console.log(score);
}






function updNotesInScore(instr, nota){
	//correct nota fields according to model
	var model = instrWaveMute[instr][2];
	notaL = nota.length;
	modelL = model.length;
	if (notaL < modelL) {
		var stpo = notaL - 8;
		for (var addpf = 0; notaL + addpf < modelL; addpf++){
			nota.splice(stpo + addpf, 0, instrWaveMute[instr][2][stpo + addpf]);
		}
	} else if (notaL > modelL) {
		var notaL = nota.length;
		for (var src = (notaL - 8); src > (modelL - 8); src--){
			nota.splice(src - 1, 1);
		}
	}
	//console.log(nota);
	return nota
}



function copyButtPfield(id, all){
	//to copy selected value into allnotes

	if (all == 0) { 
		var numbs = id.replace("copybuttSPf", "");
	} else if (all == 1) {
		var numbs = id.replace("copybuttAPf", "");
	}	
	var numbe = parseInt(numbs);
	//get value
	var val = parseFloat(document.getElementById("Pf" + numbs).value);
	var instr = document.getElementById('actualInstrument').value;
	//console.log(instr);
	for (var note = 0; note < score.length; note++){
		//console.log(all);
		console.log(score[note]);
		//console.log(score[note][score[note].length - 8]);		
		if (all == 0){
			//only selected
			if (score[note][0] == instr && score[note][score[note].length - 8] == 1){
				
				score[note][numbe - 1] = val;
			}
		} else if(all == 1){
			//all notes
			if (score[note][0] == instr){		
				score[note][numbe - 1] = val;
			}

		}
	}

}




function defaultPfield() {
	//set pfields values as default
	var instr = document.getElementById('actualInstrument').value;
	var structure = instrWaveMute[instr][2];
	var structureL = structure.length;
	for (var val = 5; val < structureL - 8; val++) {
		var value = document.getElementById("Pf" + (val+1).toString()).value
		//console.log(value);
		structure[val] = parseFloat(value);
		
	}
	instrWaveMute[instr][2] = structure;
	//console.log(instrWaveMute[instr][2]);
}




function updGuiPf(nota){
	//update gui
	//console.log(nota);
	notaL = nota.length;
	//
	var instr = parseInt(nota[0]);
	//console.log('model length ' + instrWaveMute[instr][2].length + ' note length ' + notaL);
	
	//
	for (var idx = 5; idx < notaL - 8; idx++) {
		var pf = idx + 1;
		var val = nota[idx];
		//console.log('Pf'+(pf).toString() + ' value ' + val.toString());
		document.getElementById('Pf'+(pf).toString()).value = val;
		document.getElementById("validPf"+(pf).toString()).checked = true;
	}
}



function updPfValue(id){
	//update the pfield value
	var idpf =  parseInt(id.replace("Pf", ""));
	var value = parseFloat(document.getElementById(id).value);
	//console.log(idpf - 1);
	if (score.length > 0){
		score[last_note_i][idpf - 1] = value;
		//console.log(last_note_i);
		//console.log(value);
	}
}