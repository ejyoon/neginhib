// Simple study demonstrating the use of a tablet-designed webpage. 
// Study is designed using simple JS/HTML/CSS, with data saves to a server
// controlled by call to a short php script. 

// Overview: (i) Parameters (ii) Helper Functions (iii) Control Flow

// ---------------- PARAMETERS ------------------

var trainingNum = 0;
var gameCounter = 0;
var numGames = 3;

//Number of trials per game
var numPracticeTrials = 2;
var numInhibTrials = 2;
var numNegTrials = 2;
var numImplicTrials = 2;

//For inhibition game, number of "control" trials before inhibition trial
var minInhib = 4;
var maxInhib = 7;

//amount of white space between trials
var normalpause = 500;

//pause after picture chosen, to display red border around picture selected
var timeafterClick = 500;

//length of filler (every time fill2 comes up, add 1sec of time)
var fillerpause = 0;

//******for handling sound; see helper function playPrompt(word)
var audioSprite = $("#sound_player")[0];
var handler;

///items (trial items are shuffled)
var practiceItems = shuffle(["lion", "rabbit"]);
var items = shuffle(["apple", "apple", "car", "car", "dog", "dog"]);
var allItems = practiceItems.concat(items);


//CONTROL FLOW

//PRELOAD ALL IMAGES//---------------------------
// FIXME: create pictures of 'cat', 'dog', etc.
// FIXME: new images
//var allimages1 = ["practice1_cow", "practice1_lion", "practice2_rabbit", "practice2_monkey", "banana", "carrot", "carrot", "banana", "carrot", "banana", "banana", "carrot", "apple", "orange", "no_apple", "no_orange", "apple", "orange", "no_apple", "no_orange", "grover_car", "grover_bicycle", "ernie_apple", "ernie_orange", "bert_cat", "bert_dog", "bert_ball", "bert_truck"];

//var allimages2 = ["practice1_cow", "practice1_lion", "practice2_rabbit", "practice2_monkey", "apple", "orange", "orange", "apple", "orange", "apple", "apple", "orange", "banana", "carrot", "no_banana", "no_carrot", "banana", "carrot", "no_banana", "no_carrot", "grover_ball2", "grover_truck2", "elmo_dog2", "elmo_cat2", "grover_car2", "grover_bicycle2", "grover_banana2", "grover_carrot2"];

//FixME: Do preloading with new item names

//for critical trials and fillers
// var images = new Array();
// for (i = 0; i < allimages1.length; i++) {
// 	images[i] = new Image();
// 	images[i].src = "neginhib_objects/" + allimages1[i] + ".png";
// 	images[i] = new Image();
// 	images[i].src = "neginhib_objects/" + allimages2[i] + ".png";
// }

// //for dot game
// var dots = ["dot_1", "dot_2", "dot_3", "dot_4", "dot_5", "x", "dot_smiley"];
// for (i = 0; i < dots.length; i++) {
// 	images[i] = new Image();
// 	images[i].src = "dots/" + dots[i] + ".jpg";
// }

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
		gameList = makeGameList(experiment.order);
		experiment.preStudy();
	},

	preStudy: function() {
		$("#stage").fadeOut();
		showSlide("prestudy");

		//$("#prestudy").hide();
		$('#startButton').html(gameList[gameCounter])
		$('#startButton').bind('click touchstart', function(event) {
			setTimeout(function() {
				experiment.training(trainingNum); //FIXME: Make 3 versions of dot game (dots, smiley, stars?)
			}, normalpause);
		})
	},

	//sets up and allows participants to play "the dot game"
	training: function(dotgame) {

		//preload sound
		if (dotgame === 0) {
			audioSprite.play();
			audioSprite.pause();
		} else {
			training.removeChild(dot_1);
			training.removeChild(dot_2);
			training.removeChild(dot_3);
			training.removeChild(dot_4);
			training.removeChild(dot_5);
		}

		var xcounter = 0;
		var dotCount = 5;

		var dotx = [];
		var doty = [];

		for (i = 0; i < dotCount; i++) {
			createDot(dotx, doty, i);
		}
		showSlide("training")
		$('.dot').one('click touchstart', function(event) {
			var dotID = $(event.currentTarget).attr('id');
			document.getElementById(dotID).src = "dots/x.jpg";
			xcounter++;
			if (xcounter === dotCount) {
				setTimeout(function() {
					$("#training").hide();
					setTimeout(function() {
						document.body.style.background = "black";
						experiment.next(gameList[gameCounter]);
					}, normalpause)
				}, normalpause)
			}
		})
	},
	// training: function(dotgame) {
	// 	var allDots = ["dot_1", "dot_2", "dot_3", "dot_4", "dot_5", 
	// 					"dot_smiley1", "dot_smiley2", "dot_smiley3", 
	// 					"dot_smiley4", "dot_smiley5"];
	// 	var xcounter = 0;
	// 	var dotCount = 5;

	// 	//preload sound
	// 	if (dotgame === 0) {
	// 		audioSprite.play();
	// 		audioSprite.pause();
	// 	}

	// 	var dotx = [];
	// 	var doty = [];

	// 	if (dotgame === 0) {
	// 		for (i = 0; i < dotCount; i++) {
	// 			createDot(dotx, doty, i, "");
	// 		}
	// 	} else {
	// 		for (i = 0; i < dotCount; i++) {
	// 			createDot(dotx, doty, i, "smiley");
	// 		}
	// 	}
	// 	showSlide("training");
	// 	$('.dot').bind('click touchstart', function(event) {
	//     	var dotID = $(event.currentTarget).attr('id');

	//     	//only count towards completion clicks on dots that have not yet been clicked
	//     	if (allDots.indexOf(dotID) === -1) {
	//     		return;
	//     	}
	//     	allDots.splice(allDots.indexOf(dotID), 1);
	//     	document.getElementById(dotID).src = "dots/x.jpg";
	//     	xcounter++
	//     	if (xcounter === dotCount) {
	//     		setTimeout(function () {
	//     			$("#training").hide();
	//     			if (dotgame === 0) {		
	//     				//hide old x marks before game begins again
	//     				var dotID;
	//     				for (i = 1; i <= dotCount; i++) {
	//     					dotID = "dot_" + i;
	//     					training.removeChild(document.getElementById(dotID));
	//     				}
	// 					experiment.training();
	// 					dotgame++; 
	// 				} else {
	// 					//document.body.style.background = "black";
	// 					setTimeout(function() {
	// 						showSlide("prestudy");
	// 						//experiment.next();
	// 					}, normalpause);
	// 				}
	// 			}, normalpause);
	// 		}
	//     });	   
	// },

	// MAIN DISPLAY FUNCTION
	next: function(game) {

		var gameItems = makeItemList(game);
		var trialTypes = makeTrialTypes(game);
		var wordsAndImages = makeWordsAndImages(game, gameItems);

		var wordList = wordsAndImages[0];
		var imageArray = wordsAndImages[1];

		var objects_html = "";
		var counter = 1;
		var numTrials = "";
		if (game == "practice") {
			numTrials = numPracticeTrials;
		} else if (game == "inhibition") {
			numTrials = wordsAndImages[2]; //the function makeWordsAndImages updates the number of inhib trials
		} else if (game == "negation") {
			numTrials = numNegTrials;
		} else if (game == "implicature") {
			numTrials = numImplicTrials;
		}

		// Create the object table (tr=table row; td= table data)

		//FIXME: Counterbalance which side the image appears on
		//HTML for the first object on the left
		leftname = "neginhib_objects/" + imageArray[0] + ".png";
		objects_html += '<table align = "center" cellpadding="30"><tr></tr><tr><td align="center"><img class="pic" src="' + leftname + '"alt="' + leftname + '" id= "leftPic"/></td>';

		//HTML for the first object on the right
		rightname = "neginhib_objects/" + imageArray[1] + ".png";
		objects_html += '<td align="center"><img class="pic" src="' + rightname + '"alt="' + rightname + '" id= "rightPic"/></td>';

		objects_html += '</tr></table>';
		$("#objects").html(objects_html);

		$("#stage").fadeIn();

		var startTime = (new Date()).getTime();
		playPrompt(wordList[0]);

		//click disable for the first slide
		var clickDisabled = true;
		setTimeout(function() {
			clickDisabled = false;
		}, (spriteData[wordList[0]].onset - spriteData[wordList[0]].start) * 1000 + 300);

		$('.pic').bind('click touchstart', function(event) {

			if (clickDisabled) return;

			//disable subsequent clicks once the participant has made their choice
			clickDisabled = true;

			//time the participant clicked - the time the audio began - the amount of time between the beginning of the audio and the 
			//onset of the word 
			experiment.reactiontime = (new Date()).getTime() - startTime - (spriteData[wordList[0]].onset - spriteData[wordList[0]].start) * 1000;

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

			//FIXME: Get this info
			//what kind of trial was this?
			//experiment.trialtype = getTrialType(experiment.trialnum);
			//experiment.phase = getPhase(experiment.trialnum);

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
					if (gameCounter === numGames) {
						experiment.end();
					} else {
						gameCounter++;
						trainingNum++;
						document.body.style.background = "white";
						experiment.preStudy();
					}
				} else {

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
						setTimeout(function() {
							clickDisabled = false;
						}, (spriteData[wordList[0]].onset - spriteData[wordList[0]].start) * 1000 + 300);

						startTime = (new Date()).getTime();
						playPrompt(wordList[0]);
					}, normalpause);
				}
			}, timeafterClick);
		});
	},

	//concatenates all experimental variables into a string which represents one "row" of data in the eventual csv, to live in the server
	processOneRow: function() {
		var dataforRound = experiment.subid;
		dataforRound += "," + experiment.order + "," + experiment.trialnum + "," + experiment.word;
		dataforRound += "," + experiment.pic1 + "," + experiment.pic2;
		dataforRound += "," + experiment.trialtype + "," + experiment.pic1type + "," + experiment.pic2type;
		dataforRound += "," + experiment.side + "," + experiment.chosenpic + "," + experiment.response;
		dataforRound += "," + experiment.date + "," + experiment.timestamp + "," + experiment.reactiontime + "\n";
		$.post("https://stanford.edu/group/langcog/cgi-bin/EJY/neginhib/neginhibstudysave.php", {
			postresult_string: dataforRound
		});
	},

	//the end of the experiment, where the background becomes completely black
	end: function() {
		setTimeout(function() {
			$("#stage").fadeOut();
		}, normalpause);
		showSlide("finish");
		document.body.style.background = "black";
	},
}