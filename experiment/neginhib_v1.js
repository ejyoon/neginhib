// Simple study demonstrating the use of a tablet-designed webpage. 
// Study is designed using simple JS/HTML/CSS, with data saves to a server
// controlled by call to a short php script. 

// Overview: (i) Parameters (ii) Helper Functions (iii) Control Flow

// ---------------- PARAMETERS ------------------

var numTrials = 6;

//amount of white space between trials
var normalpause = 500;

//pause after picture chosen, to display red border around picture selected
var timeafterClick = 500;

//length of filler (every time fill2 comes up, add 1sec of time)
var fillerpause = 0;

//******for handling sound; see helper function playPrompt(word)
var audioSprite = $("#sound_player")[0];
var handler;

// ---------------- HELPER ------------------

// show slide function
function showSlide(id) {
  $(".slide").hide(); //jquery - all elements with class of slide - hide
  $("#"+id).show(); //jquery - element with given id - show
}

//array shuffle function
shuffle = function (o) { //v1.0
    for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

getCurrentDate = function() {
	var currentDate = new Date();
	var day = currentDate.getDate();
	var month = currentDate.getMonth() + 1;
	var year = currentDate.getFullYear();
	return (month + "/" + day + "/" + year);
}

getCurrentTime = function() {
	var currentTime = new Date();
	var hours = currentTime.getHours();
	var minutes = currentTime.getMinutes();

	if (minutes < 10) minutes = "0" + minutes;
	return (hours + ":" + minutes);
}

// FIXME: should there be 2 lists? 1? more?
// FIXME: returns the word array
// should this be a fixed list, or a randomized one? probably pseudo-random list?
// something like: var wordList = ["cat", "cat", "cat", "dog", "carrot", "carrot", "carrot", "carrot", "banana" ... ]
// or maybe use a function that puts a random number of items into the list?
// FIXME: sounds should be single word (?)
makeWordList = function(order) {
	var wordList = ["cow", "monkey", "carrot", "carrot", "carrot", "banana"];
	if (order === 2) {
		var wordList = ["lion", "rabbit", "orange", "orange", "orange", "apple"];
		var wordList = ["lion", "rabbit", "orange", "orange", "orange", "apple"];

	}
	return wordList;
}

// returns the image array
makeImageArray = function(order) {
    if (order === 1) {
	var toSlice = allimages1.length;
	var imageArray = allimages1.slice(0, toSlice);
    }
	else if (order === 2) {
	var toSlice = allimages2.length;
	var imageArray = allimages2.slice(0, toSlice);
	}
	return imageArray;
}

// get trial type
// FIXME: add order randomizer here (by list) 
getTrialType = function(counter) {
   	var trialtype;
   	if (counter === 1 || counter === 2) {
  		trialtype = "practice";
    } else if (counter === 3 || counter === 4 || counter === 5) {
  		trialtype = "control";
   	} else if (counter === 6) {
   		trialtype = "inhibition";
   	} 
    // FIXME: add other trial types
   	return trialtype;  
}

// get phase
// FIXME: add order randomizer here (by list) 
getPhase = function(counter) {
   	var phase;
   	if (counter === 1 || counter === 2) {
  		phase = "practice";
    } else if (counter === 3 || counter === 4 || counter === 5 || counter === 6) {
  		phase = "inhibitionPhase";
   	} else if (counter === 7 || counter === 8 || counter === 9 || counter === 10) {
   		phase = "negationPhase";
   	} else {
   		phase = "implicaturePhase";
   	}
   	return phase;  
}

// dots for practice task
createDot = function(dotx, doty, i, tag) {
	var dots;
	if (tag === "smiley") {
		dots = ["smiley1", "smiley2", "smiley3", "smiley4", "smiley5"];
	} else {
		dots = [1, 2, 3, 4, 5];
	}

	var dot = document.createElement("img");
	dot.setAttribute("class", "dot");
	dot.id = "dot_" + dots[i];
	if (tag === "smiley") {
		dot.src = "dots/dot_" + "smiley" + ".jpg";
	} else {
		dot.src = "dots/dot_" + dots[i] + ".jpg";
	}

    var x = Math.floor(Math.random()*950);
    var y = Math.floor(Math.random()*540);

    var invalid = "true";

    //make sure dots do not overlap
    while (true) {
    	invalid = "true";
	   	for (j = 0; j < dotx.length ; j++) {
    		if (Math.abs(dotx[j] - x) + Math.abs(doty[j] - y) < 250) {
    			var invalid = "false";
    			break; 
    		}
		}
		if (invalid === "true") {
 			dotx.push(x);
  		  	doty.push(y);
  		  	break;	
  	 	}
  	 	x = Math.floor(Math.random()*400);
   		y = Math.floor(Math.random()*400);
	}

    dot.setAttribute("style","position:absolute;left:"+x+"px;top:"+y+"px;");
   	training.appendChild(dot);
}

//Handles audio; indexes into the sprite to play the prompt associated with a critical word 
playPrompt = function(word) {
	audioSprite.removeEventListener('timeupdate',handler);
	audioSprite.currentTime = spriteData[word].start;
	audioSprite.play();

	handler = function() {
	    if (this.currentTime >= spriteData[word].start + spriteData[word].length) {
	        this.pause();
	    }
	};
	audioSprite.addEventListener('timeupdate', handler, false);
}

//CONTROL FLOW

//PRELOAD ALL IMAGES//---------------------------
// FIXME: create pictures of 'cat', 'dog', etc.
// FIXME: new images
var allimages1 = ["practice1_cow", "practice1_lion", "practice2_rabbit", "practice2_monkey", "banana", "carrot", "carrot", "banana", "carrot", "banana", "banana", "carrot", "grover_car", "grover_bicycle", "ernie_apple", "ernie_orange", "bert_cat", "bert_dog", "bert_ball", "bert_truck", "bert_flower", "bert_teddybear", "elmo_ball", "elmo_truck", "bert_car", "bert_bicycle", "bert_banana", "bert_carrot", "ernie_car", "ernie_bicycle", "grover_apple", "grover_orange", "ernie_flower", "ernie_teddybear", "grover_ball", "grover_truck"];
                     
var allimages2 = ["practice1_cow", "practice1_lion", "practice2_rabbit", "practice2_monkey", "apple", "orange", "orange", "apple", "orange", "apple", "apple", "orange", "grover_ball2", "grover_truck2", "elmo_dog2", "elmo_cat2", "grover_car2", "grover_bicycle2", "grover_banana2", "grover_carrot2", "ernie_apple2", "ernie_orange2", "bert_banana2", "bert_carrot2", "bert_ball2", "bert_truck2", "grover_teddybear2", "grover_flower2", "ernie_flower2", "ernie_teddybear2",  "ernie_cat2", "ernie_dog2", "ernie_car2", "ernie_bicycle2", "elmo_apple2", "elmo_orange2"];


//for critical trials and fillers
var images = new Array();
for (i = 0; i<allimages1.length; i++) {
	images[i] = new Image();
	images[i].src = "neginhib_objects/" + allimages1[i] + ".png";
    images[i] = new Image();
	images[i].src = "neginhib_objects/" + allimages2[i] + ".png";
}

//for dot game
var dots = ["dot_1", "dot_2", "dot_3", "dot_4", "dot_5", "x", "dot_smiley"];
for (i = 0; i<dots.length; i++) {
	images[i] = new Image();
	images[i].src = "dots/" + dots[i] + ".jpg";
}
//-----------------------------------------------


showSlide("instructions");

// MAIN EXPERIMENT
// FIXME: set up three phases (i) inhibition (ii) negation (iii) implicature, and randomize the presentation order of the phase 
// or should these just be encoded in 'trialtype's?
var experiment = {

	subid: "",
		//inputed at beginning of experiment
	trialnum: 0,
		//trial number
	order: 1,
		//whether child received list 1 or list 2
	word: "",
		//word that child is queried on
	pic1: "",
		//the name of the picture on the left
	pic2: "",
		//the name of the picture on the right
	pic1type: "",
		//whether the picture on the left is target or distractor
	pic2type: "",
		//whether the picture on the right is target or distractor
	side: "",
		//whether the child picked the left (L) or the right (R) picture
	chosenpic: "",
		//the name of the picture the child picked
	response: "",
		//whether the response was the correct response (Y) or the incorrect response (N)
	phase: "",
    //FIXME: phases: (i) inhibition (ii) negation (iii) implicature  
    trialtype: "",
        // FIXME: trialtype -- (i) inhibition phase: baseline vs. inhibitory (ii) negation phase: pos vs. neg (iii) implicature phase: control vs. inference
	date: getCurrentDate(),
		//the date of the experiment
	timestamp: getCurrentTime(),
		//the time that the trial was completed at 
	reactiontime: 0,

	preStudy: function() {
		document.body.style.background = "black";
		$("#prestudy").hide();
		setTimeout(function () {
			experiment.next();
		}, normalpause);
	},

	//sets up and allows participants to play "the dot game"
	training: function(dotgame) {
		var allDots = ["dot_1", "dot_2", "dot_3", "dot_4", "dot_5", 
						"dot_smiley1", "dot_smiley2", "dot_smiley3", 
						"dot_smiley4", "dot_smiley5"];
		var xcounter = 0;
		var dotCount = 5;

		//preload sound
		if (dotgame === 0) {
			audioSprite.play();
			audioSprite.pause();
		}

		var dotx = [];
		var doty = [];

		if (dotgame === 0) {
			for (i = 0; i < dotCount; i++) {
				createDot(dotx, doty, i, "");
			}
		} else {
			for (i = 0; i < dotCount; i++) {
				createDot(dotx, doty, i, "smiley");
			}
		}
		showSlide("training");
		$('.dot').bind('click touchstart', function(event) {
	    	var dotID = $(event.currentTarget).attr('id');

	    	//only count towards completion clicks on dots that have not yet been clicked
	    	if (allDots.indexOf(dotID) === -1) {
	    		return;
	    	}
	    	allDots.splice(allDots.indexOf(dotID), 1);
	    	document.getElementById(dotID).src = "dots/x.jpg";
	    	xcounter++
	    	if (xcounter === dotCount) {
	    		setTimeout(function () {
	    			$("#training").hide();
	    			if (dotgame === 0) {		
	    				//hide old x marks before game begins again
	    				var dotID;
	    				for (i = 1; i <= dotCount; i++) {
	    					dotID = "dot_" + i;
	    					training.removeChild(document.getElementById(dotID));
	    				}
						experiment.training();
						dotgame++; 
					} else {
						//document.body.style.background = "black";
						setTimeout(function() {
							showSlide("prestudy");
							//experiment.next();
						}, normalpause);
					}
				}, normalpause);
			}
	    });	   
	},


	//Checks to see whether the experimenter inputted appropriate values before moving on with the experiment
	checkInput: function() {
		//subject ID
  		if (document.getElementById("subjectID").value.length < 1) {
			$("#checkMessage").html('<font color="red">You must input a subject ID</font>');
			return;
		}
  		experiment.subid = document.getElementById("subjectID").value;

		//list
		if (document.getElementById("order").value !== "1" && document.getElementById("order").value !== "2") { //|| document.getElementById("order").value !== "2") {
			$("#checkMessage").html('<font color="red">For list, you must choose either a 1 or 2</font>');
			return;
		}
		experiment.order = parseInt(document.getElementById("order").value);
		experiment.training(0);
	},

	//the end of the experiment, where the background becomes completely black
    end: function () {
    	setTimeout(function () {
    		$("#stage").fadeOut();
    	}, normalpause);
    	showSlide("finish");
    	document.body.style.background = "black";
    },

	//concatenates all experimental variables into a string which represents one "row" of data in the eventual csv, to live in the server
	processOneRow: function() {
		var dataforRound = experiment.subid; 
		dataforRound += "," + experiment.order + "," + experiment.trialnum + "," + experiment.word;
		dataforRound += "," + experiment.pic1 + "," + experiment.pic2;
        dataforRound += "," + experiment.trialtype + "," + experiment.pic1type + "," + experiment.pic2type;
		dataforRound += "," + experiment.side + "," + experiment.chosenpic + "," + experiment.response;
		dataforRound += "," + experiment.date + "," + experiment.timestamp + "," + experiment.reactiontime + "\n";
        $.post("https://stanford.edu/group/langcog/cgi-bin/EJY/neginhib/neginhibstudysave.php", {postresult_string : dataforRound});	
	},

	// MAIN DISPLAY FUNCTION
  	next: function() {

		//returns the list of all words to use in the study - list dependent
  		var wordList = makeWordList(experiment.order);
  		//returns the list of all images to use in the study - list dependent
		var imageArray = makeImageArray(experiment.order);

		var objects_html = "";
		var counter = 1;
 			
   		// Create the object table (tr=table row; td= table data)
	    
	   	//HTML for the first object on the left
		leftname = "neginhib_objects/" + imageArray[0] + ".png";
		objects_html += '<table align = "center" cellpadding="30"><tr></tr><tr><td align="center"><img class="pic" src="' + leftname +  '"alt="' + leftname + '" id= "leftPic"/></td>';
	
		//HTML for the first object on the right
		rightname = "neginhib_objects/" + imageArray[1] + ".png";
	   	objects_html += '<td align="center"><img class="pic" src="' + rightname +  '"alt="' + rightname + '" id= "rightPic"/></td>';
		
    	objects_html += '</tr></table>';
	    $("#objects").html(objects_html); 

	    $("#stage").fadeIn();

	    var startTime = (new Date()).getTime();
	    playPrompt(wordList[0]);
		
		//click disable for the first slide
		var clickDisabled = true;
		setTimeout(function() {clickDisabled = false;}, (spriteData[wordList[0]].onset - spriteData[wordList[0]].start)*1000 + 300);

	    $('.pic').bind('click touchstart', function(event) {

	    	if (clickDisabled) return;
	    	
	    	//disable subsequent clicks once the participant has made their choice
			clickDisabled = true; 

	    	//time the participant clicked - the time the audio began - the amount of time between the beginning of the audio and the 
	    	//onset of the word 
	    	experiment.reactiontime = (new Date()).getTime() - startTime - (spriteData[wordList[0]].onset-spriteData[wordList[0]].start)*1000; 

	    	experiment.trialnum = counter;
	    	experiment.word = wordList[0];
	    	experiment.pic1 = imageArray[0];
	    	experiment.pic2 = imageArray[1];

            //get whether left or right pictures were target or distractor
            if (experiment.pic1 === experiment.word) {
	    		experiment.pic1type = "target";
	    	} else {
	    		experiment.pic1type = "distractor";
	    	}
	    	if (experiment.pic2 === experiment.word) {
	    		experiment.pic2type = "target";
	    	} else {
	    		experiment.pic2type = "distractor";
	    	}

	    	//Was the picture clicked on the right or the left?
	    	var picID = $(event.currentTarget).attr('id');
	    	if (picID === "leftPic") {
				experiment.side = "L";
				experiment.chosenpic = imageArray[0];
	    	} else {
				experiment.side = "R";
				experiment.chosenpic = imageArray[1];
			}
			
			// Whether the response was correct
			if (experiment.chosenpic === experiment.word) {
				experiment.response = "Y";
			} else {
				experiment.response = "N"
			}

			//what kind of trial was this?
            experiment.trialtype = getTrialType(experiment.trialnum);
            experiment.phase = getPhase(experiment.trialnum);

			//Add one to the counter and process the data to be saved; the child completed another "round" of the experiment
			experiment.processOneRow();
	    	counter++;

	    	$(document.getElementById(picID)).css('margin', "-8px");
			$(document.getElementById(picID)).css('border', "solid 8px green");

			//remove the pictures from the image array that have been used, and the word from the wordList that has been used
			imageArray.splice(0, 2);
			wordList.splice(0, 1);

		
			setTimeout(function() {
				$("#stage").fadeOut();

				//there are no more trials for the experiment to run
				if (counter === numTrials + 1) {
					experiment.end();
					return;
				}	

				//move on to the next round after either the normal amount of time between critical rounds, or after 
				//the filler has occurred
				setTimeout(function() {			
						document.getElementById("leftPic").src = "neginhib_objects/" + imageArray[0] + ".png";
						document.getElementById("rightPic").src = "neginhib_objects/" + imageArray[1] + ".png";

						//to make word display visible (as an alternative to sound), uncomment just change background of display to white
						$(document.getElementById(picID)).css('border', "none"); 
						$(document.getElementById(picID)).css('margin', "0px");

						$("#stage").fadeIn();

						//reactivate clicks only after a little bit after the prompt's word
						setTimeout(function() {clickDisabled = false;}, (spriteData[wordList[0]].onset-spriteData[wordList[0]].start)*1000 + 300);

						startTime = (new Date()).getTime();
						playPrompt(wordList[0]);
				}, normalpause);
			}, timeafterClick);
	    });
    },
}
		