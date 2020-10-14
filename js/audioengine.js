//Audio Engine
//https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Advanced_techniques


function waveInstr() {
	//change waveform definition in instrWaveMute
	var selectInstr = document.getElementById("actualInstrument");
	var instr = selectInstr.options[selectInstr.selectedIndex].value;
	
	var selectWave = document.getElementById("actualInstrument_w");
	var wave = selectWave.options[selectWave.selectedIndex].value;
	
	instrWaveMute[instr][0] = wave;
	
}


function muteInstr() {
	//muteunmute
	var selectInstr = document.getElementById("actualInstrument");
	var instr = selectInstr.options[selectInstr.selectedIndex].value;
	
	var selectMute = document.getElementById("actualInstrument_m");
	if (selectMute.checked == true) {
		instrWaveMute[instr][1] = 1;
	} else {
		instrWaveMute[instr][1] = 0;
	}
	
}


//note array sorting
function Comparator(a, b) {
   if (a[1] <= b[1]) return -1;
   if (a[1] > b[1]) return 1;
   return 0;
 }
//score.sort(Comparator);


var audioCtx;


function init() {
	//initialize audio context
	var AudioContext = window.AudioContext || window.webkitAudioContext;
	audioCtx = new AudioContext();
	nextNotetime = audioCtx.currentTime;
}
		


var isPlaying = 0;

function starting(){
	//start the scheduler
	score.sort(Comparator);//not needed?
	isPlaying = 1;
	scheduler();
}


function stopping(){
	//stop the scheduler
	isPlaying = 0;
	document.getElementById("pfs").style.backgroundColor="";
	document.getElementById("pfh").style.backgroundColor="";
	document.getElementById("plw").style.backgroundColor="";
	ctx_ts.clearRect(0, 0, c_ts.width, c_ts.height);
}




var counter = 0;
var lookAhead = 0.025;//fraction of bpm
var srcIdx = 0;//actual index to read the score
var staIdx = 0;//start index to read the score
var endLoop = 0;
var loopIng = 0;


function find_srcIdx(){
	staIdx = 0;
	//search notes 
	for (var nnn = 0; nnn < score.length; nnn++){	
		if (score[nnn][1] < (firstBeat)) {//firstBeat is defined and managed in graphics.js
			staIdx +=1;
		} else {
			break;
		}
	}
	counter = firstBeat - lookAhead;// - 1;
	srcIdx = staIdx;
}





function scheduler() {
	var bpm = document.getElementById('bpm').value;
	if (isPlaying == 1){
		if (loopIng == 0){
			//Single shot play
			while (srcIdx <= score.length) {
				if (srcIdx == score.length){
					srcIdx = staIdx;
					counter = firstBeat - 0.01;
					//counter = firstBeat + 0.01;
					stopping();
					break;
				} else {
					if (score[srcIdx][1] < (counter + lookAhead)) {
						var inst = score[srcIdx][0];
						//console.log(score[srcIdx][1] + " actual " + counter)
						if (instrWaveMute[inst][1] == 0) {// if not muted
							var ct = score[srcIdx][1] - counter;
							var et = ct + (score[srcIdx][2] - score[srcIdx][1]) * 60.0 / bpm;
							var vl = score[srcIdx][3];
							var fr = score[srcIdx][4];
							var wav = instrWaveMute[inst][0];
							if (et > 0 && ct >= 0){
								playNota(ct, et, vl, fr, wav);
							}
						}
						srcIdx +=1;
					} else {
						break;
						stopping();
					}
				}
			}
		} else if (loopIng == 1){
			//loop window play
			if (counter >= beatN + firstBeat) {
				score.sort(Comparator);
				find_srcIdx();
			} else {
				//play notes
				while (srcIdx < score.length){
					if (score[srcIdx][1] <= (counter + lookAhead)) {
						var inst = score[srcIdx][0];
						if (instrWaveMute[inst][1] == 0) {// if not muted
							var ct = score[srcIdx][1] - counter;
							var et = ct + (score[srcIdx][2] - score[srcIdx][1]) * 60.0 / bpm;
							var vl = score[srcIdx][3];
							var fr = score[srcIdx][4];
							var wav = instrWaveMute[inst][0];
							if (et > 0 && ct >= 0){
								playNota(ct, et, vl, fr, wav);
							}
						}
						srcIdx +=1;
					} else {
						break;
						stopping();
					}
				}
			}
		}
		
		drawScroller(counter);
		//Forward view
		if (counter > firstBeat + beatN){
			fwdBwdBeat(beatN);
		}
		//update and call again
		counter += lookAhead; 
		window.setTimeout(scheduler, lookAhead * 1000 * 60.0 / bpm);		
	}
}






var attackTime = 0.02
var releaseTime = 0.02

function playNota(ct, et, vl, fr, wav) {
    let osc = audioCtx.createOscillator();
    osc.type = wav;
    osc.frequency.value = fr;//frequency set here

    let sweepEnv = audioCtx.createGain();
    //sweepEnv.gain.cancelScheduledValues(audioCtx.currentTime);
    sweepEnv.gain.value= 0;
    sweepEnv.gain.linearRampToValueAtTime(0, audioCtx.currentTime + ct);//volume set here instead of 1
    //attack
    sweepEnv.gain.linearRampToValueAtTime(vl * 0.1, audioCtx.currentTime + ct + attackTime);//volume set here instead of 1
    //release
    sweepEnv.gain.linearRampToValueAtTime(0, audioCtx.currentTime + ct + et - releaseTime - attackTime);
    //connection
	osc.connect(sweepEnv).connect(audioCtx.destination);
    osc.start(ct);//set start here
    osc.stop(audioCtx.currentTime + ct + et);//duration set here instead of sweepLength
	window.setTimeout(function(){
		osc.disconnect();
		sweepEnv.disconnect();
	}, 1000 * (ct + et));
}





//https://developers.google.com/web/updates/2017/09/autoplay-policy-changes#webaudio
window.addEventListener("load", init );

//play from beginning
document.getElementById("pfs").addEventListener('click', function() {
	audioCtx.resume().then(() => {
		counter =  -0.001;
		srcIdx = 0;
		staIdx = 0;
		endLoop = 0;
		loopIng = 0;
		firstBeat = 0;
		fwdBwdBeat(-1 * firstBeat);
		//find_srcIdx();
		starting();
		document.getElementById("pfs").style.backgroundColor="#ff0000";
		console.log(audioCtx.state);
	});
});

//play from window beginning
document.getElementById("pfh").addEventListener('click', function() {
	audioCtx.resume().then(() => {
		loopIng = 0;
		find_srcIdx();
		starting();
		document.getElementById("pfh").style.backgroundColor="#ff0000";
	});
});

//play loop window
document.getElementById("plw").addEventListener('click', function() {
	audioCtx.resume().then(() => {
		loopIng = 1;
		find_srcIdx();
		starting();
		document.getElementById("plw").style.backgroundColor="#ff0000";
	});
});



document.getElementById("pss").addEventListener('click', function() {
	stopping();
});
