// neginhib: study looking at children's inhibition and negation/implicature processing
// Overview: (i) Parameters (ii) Helper Functions (iii) Control Flow

// ---------------- PARAMETERS ------------------

//disable the spacebar (prevents it from activating browser shortcuts e.g. "scroll down")
window.onkeydown = function(e) {
	return !(e.keyCode == 32);
}

window.onkeydown = function(e) {
	return !(e.keyCode == 191);
}


var gameCounter = 0;
var numGames = 2; //3 games (javascript indexing starts at 0)

//Number of trials per game
var numInhibTrials = 12;
var numNegTrials = 60;
var numImplicTrials = 60;

//For inhibition game, number of "control" trials before inhibition trial
var minInhib = 4;
var maxInhib = 7;

//amount of white space between trials
var normalPause = 0; //Value was changed from 500 to 0 to remove delay between presentations

//pause after picture chosen, to display red border around picture selected
var timeafterClick = 0; //Value was changed from 500 to 0 to remove delay after choice

//length of filler (every time fill2 comes up, add 1sec of time)
var fillerpause = 0;

//******for handling sound; see helper function playPrompt(word)
var audioSprite = $("#sound_player")[0];
var handler;

// preload
var allimages = ["practice1_cow.png", "practice1_lion.png", "practice2_monkey.png", "practice2_rabbit.png", "apple_control.png", "apple_foil.png", "apple_implic.png", "apple_inhib.png", "apple_neg.png", "apple_pos.png", "banana_control.png", "banana_foil.png", "banana_implic.png", "banana_inhib.png", "banana_neg.png", "banana_pos.png", "bicycle_control.png", "bicycle_foil.png", "bicycle_implic.png", "bicycle_inhib.png", "bicycle_neg.png", "bicycle_pos.png", "bird_control.png", "bird_foil.png", "bird_implic.png", "bird_inhib.png", "bird_neg.png", "bird_pos.png", "car_control.png", "car_foil.png", "car_implic.png", "car_inhib.png", "car_neg.png", "car_pos.png", "cat_control.png", "cat_foil.png", "cat_implic.png", "cat_inhib.png", "cat_neg.png", "cat_pos.png", "cookie_control.png", "cookie_foil.png", "cookie_implic.png", "cookie_inhib.png", "cookie_neg.png", "cookie_pos.png", "cup_control.png", "cup_foil.png", "cup_implic.png", "cup_inhib.png", "cup_neg.png", "cup_pos.png", "dog_control.png", "dog_foil.png", "dog_implic.png", "dog_inhib.png", "dog_neg.png", "dog_pos.png", "flower_control.png", "flower_foil.png", "flower_implic.png", "flower_inhib.png", "flower_neg.png", "flower_pos.png", "lamp_control.png", "lamp_foil.png", "lamp_implic.png", "lamp_inhib.png", "lamp_neg.png", "lamp_pos.png", "teddybear_control.png", "teddybear_foil.png", "teddybear_implic.png", "teddybear_inhib.png", "teddybear_neg.png", "teddybear_pos.png"];
//for critical trials and fillers
var images = new Array();
for (i = 0; i < allimages.length; i++) {
	images[i] = new Image();
	images[i].src = "neginhib_objects/" + allimages[i];
}


// FIXME after pictures are done & trial numbers are adjusted, change to:
// var items = ["apple", "car", "dog", "carrot", "teddybear", "truck", ...
// should this be selected based on where the inhibition trials are? (because inhibition trials get 10 items, whereas the other two get 10 x 6 repetitions)
// FIXME list 2: 
// var items = // opposite of list 1 items -- thus, if list 1 had apple, list 2 would have orange.

showSlide("instructions");
// MAIN EXPERIMENT
var experiment = {

	subid: "",
	//inputed at beginning of experiment
	trialnum: 0,
	//trial number
	order: "",
	//order (0, 1, 2, 3, 4, or 5; refer to neginhib_utils.js)
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
	practice: "",
	//"practice" for the practice trials (the first two for each game), "test" for test trials
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
		if (document.getElementById("list").value !== "1" && document.getElementById("list").value !== "2") { //|| document.getElementById("list").value !== "2") {
			$("#checkMessage").html('<font color="red">For list, you must choose either a 1 or 2</font>');
			return;
		}
		experiment.list = parseInt(document.getElementById("list").value);

		//order
		experiment.order = random(6) + 1;
		//experiment.order = 1; //testing

		gameList = makeGameList(experiment.order);
		items = makeSetList(experiment.list);
		//Note: I moved the audio "preloading" here; we shoudld double-check that it still works
		audioSprite.play();
		audioSprite.pause();
		experiment.preTraining();
	},

	//We start with a training game to make sure children know how to use the iPad
	// training: function() {
	// 	var allDots = ["dot_1", "dot_2", "dot_3", "dot_4", "dot_5"];

	// 	var xcounter = 0;
	// 	var dotCount = 5;

	// 	var dotx = [];
	// 	var doty = [];

	// 	for (i = 0; i < dotCount; i++) {
	// 		createDot(dotx, doty, i, "");
	// 	}

	// 	showSlide("training");
	// 	$('.dot').bind('click touchstart', function(event) {

	// 		var dotID = $(event.currentTarget).attr('id');

	// 		//only count towards completion clicks on dots that have not yet been clicked
	// 		if (allDots.indexOf(dotID) === -1) {
	// 			return;
	// 		}
	// 		allDots.splice(allDots.indexOf(dotID), 1);
	// 		document.getElementById(dotID).src = "dots/x.jpg";
	// 		xcounter++
	// 		if (xcounter === dotCount) {
	// 			training.removeChild(dot_1);
	// 			training.removeChild(dot_2);
	// 			training.removeChild(dot_3);
	// 			training.removeChild(dot_4);
	// 			training.removeChild(dot_5);

	// 			setTimeout(function() {
	// 				$("#training").hide();
	// 				setTimeout(function() {
	// 					showSlide("dotGame");
	// 				}, normalPause);
	// 			}, normalPause);
	// 		}
	// 	});
	// },

	preTraining: function() {
		$("#stage").hide();
		showSlide("prestudy");

		//$("#prestudy").hide();
		$('#gameTitle').html("Practice")

		var clickDisabled = 0;
		$(document).keydown(function(event) {
			if (event.which == 32 & !clickDisabled) {
				$("#prestudy").hide();
				clickDisabled = 1;
				setTimeout(function() {
					experiment.practice_keyLeft();
				}, 500);
			}
		})
	},

	practice_keyLeft: function() {
		document.body.style.background = "LightGray";

		showSlide("stage");

		playPrompt("lion");

		//Set up experiment parameters before starting games
		var objects_html = "";
		var leftname = "";
		var rightname = "";

		//HTML for the first object on the left
		leftname = "neginhib_objects/practice1_lion.png";
		objects_html += '<table align = "center" cellpadding="30"><tr></tr><tr><td align="center"><img class="pic" src="' + leftname + '"alt="' + leftname + '" id= "leftPic"/></td>';

		//HTML for the first object on the right
		rightname = "neginhib_objects/practice1_cow.png";
		objects_html += '<td align="center"><img class="pic" src="' + rightname + '"alt="' + rightname + '" id= "rightPic"/></td>';

		objects_html += '</tr></table>';
		$("#objects").html(objects_html);

		var clickDisabled = 0;
		$(document).keydown(function(event) {
			if (event.which == 90 & !clickDisabled) {
				clickDisabled = 1;
				$("#stage").hide();
				setTimeout(function() {
					experiment.practice_keyRight();
				}, 500);
			}
		})
	},

	practice_keyRight: function() {
		document.body.style.background = "LightGray";

		showSlide("stage");

		playPrompt("monkey");

		//Set up experiment parameters before starting games
		var objects_html = "";
		var leftname = "";
		var rightname = "";

		//HTML for the first object on the left
		leftname = "neginhib_objects/practice2_rabbit.png";
		objects_html += '<table align = "center" cellpadding="30"><tr></tr><tr><td align="center"><img class="pic" src="' + leftname + '"alt="' + leftname + '" id= "leftPic"/></td>';

		//HTML for the first object on the right
		rightname = "neginhib_objects/practice2_monkey.png";
		objects_html += '<td align="center"><img class="pic" src="' + rightname + '"alt="' + rightname + '" id= "rightPic"/></td>';

		objects_html += '</tr></table>';
		$("#objects").html(objects_html);

		var clickDisabled = 0;
		$(document).keydown(function(event) {
			if (event.which == 191 & !clickDisabled) {
				clickDisabled = 1;
				$("#stage").hide();
				setTimeout(function() {
					experiment.preStudy();
				}, 500);
			}
		})
	},


	preStudy: function() {
		document.body.style.background = "White";

		$("#stage").hide();
		showSlide("prestudy");

		$('#gameTitle').html(gameList[gameCounter])

		var clickDisabled = 0;
		$(document).keydown(function(event) {
			if (event.which == 32 & !clickDisabled) {
				$("#prestudy").hide();
				clickDisabled = 1;
				setTimeout(function() {
					experiment.next(gameList[gameCounter]);
				}, 500);
			}
		})
	},

	// MAIN DISPLAY FUNCTION
	next: function(game) {

		document.body.style.background = "LightGray";

		var gameItems = makeItemList(game);
		var wordsAndImages = makeWordsAndImages(game, gameItems);
		var trialTypes = wordsAndImages[3];

		var wordList = wordsAndImages[0];
		var imageArray = wordsAndImages[1];

		var objects_html = "";
		var leftname = "";
		var rightname = "";

		var counter = 1;
		var numTrials = "";
		if (game == "inhibition") {
			numTrials = wordsAndImages[2]; //the function makeWordsAndImages updates the number of inhib trials
		} else if (game == "negation") {
			numTrials = numNegTrials;
		} else if (game == "implicature") {
			numTrials = numImplicTrials;
		}

		// Create the object table (tr=table row; td= table data)

		//Counterbalance which side the image appears on
		var reverse = random(2);
		experiment.pic1 = imageArray[0];
		experiment.pic2 = imageArray[1];
		if (reverse == 1) {
			experiment.pic1 = imageArray[1];
			experiment.pic2 = imageArray[0];
		}

		//HTML for the first object on the left
		leftname = "neginhib_objects/" + experiment.pic1 + ".png";
		objects_html += '<table align = "center" cellpadding="30"><tr></tr><tr><td align="center"><img class="pic" src="' + leftname + '"alt="' + leftname + '" id= "leftPic"/></td>';

		//HTML for the first object on the right
		rightname = "neginhib_objects/" + experiment.pic2 + ".png";
		objects_html += '<td align="center"><img class="pic" src="' + rightname + '"alt="' + rightname + '" id= "rightPic"/></td>';

		objects_html += '</tr></table>';
		$("#objects").html(objects_html);

		showSlide("stage")

		var startTime = (new Date()).getTime();
		playPrompt(wordList[0]);

		//click disabled for the first slide
		var clickDisabled = true;
		setTimeout(function() {
				clickDisabled = false;
			}, (spriteData[wordList[0]].onset - spriteData[wordList[0]].start) * 1000
			// + 300
		);

		// keydown event
		$(document).keydown(function(event) {
			if (clickDisabled) return;

			var keyCode = event.which
			if (keyCode == 90 || keyCode == 191) {
				// $(document).unbind("keydown")
				var endTime = (new Date()).getTime()

				//disable subsequent clicks once the participant has made their choice
				clickDisabled = true;

				//time the participant clicked - the time the audio began - the amount of time between the beginning of the audio and the 
				//onset of the word 
				experiment.reactiontime = (new Date()).getTime() - startTime - (spriteData[wordList[0]].onset - spriteData[wordList[0]].start) * 1000;

				experiment.trialnum = counter;
				experiment.word = wordList[0];

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


				// figure out if they chose left or right
				experiment.key = (keyCode == 191) ? "P" : "Q"
				experiment.chosenpic = (keyCode == 191) ? experiment.pic2 : experiment.pic1
				experiment.side = (keyCode == 191) ? "R" : "L"

				if (experiment.side === "L") {
					var picID = "leftPic";
				} else if (experiment.side === "R") {
					var picID = "rightPic";
				}

				// whether participant chose the correct target
				if (experiment.chosenpic === experiment.word) {
					experiment.response = "Y";
				} else {
					experiment.response = "N"
				}

				//Was this a practice or a test trial?
				if (counter < 3) {
					experiment.practice = "practice"
				} else {
					experiment.practice = "test"
				}

				//what kind of trial was this?
				experiment.phase = game;
				experiment.trialtype = trialTypes[counter - 1];

				//Add one to the counter and process the data to be saved; the child completed another "round" of the experiment
				experiment.processOneRow();
				counter++;

				// $(document.getElementById(picID)).css('margin', "-8px");
				// $(document.getElementById(picID)).css('border', "solid 8px green");

				//remove the pictures from the image array that have been used, and the word from the wordList that has been used
				imageArray.splice(0, 2);
				wordList.splice(0, 1);

				var reverse = random(2);
				experiment.pic1 = imageArray[0];
				experiment.pic2 = imageArray[1];
				if (reverse == 1) {
					experiment.pic1 = imageArray[1];
					experiment.pic2 = imageArray[0];
				}

				setTimeout(function() {
					$("#stage").hide();
					//there are no more trials for the experiment to run
					if (counter === numTrials + 1) {
						if (gameCounter === numGames) {
							experiment.end();
						} else {
							gameCounter++;
							document.body.style.background = "white";
							experiment.preStudy();
						}
					} else {

						//move on to the next round after either the normal amount of time between critical rounds, or after 
						//the filler has occurred
						setTimeout(function() {
							document.getElementById("leftPic").src = "neginhib_objects/" + experiment.pic1 + ".png";
							document.getElementById("rightPic").src = "neginhib_objects/" + experiment.pic2 + ".png";

							//to make word display visible (as an alternative to sound), uncomment just change background of display to white
							$(document.getElementById(picID)).css('border', "none");
							$(document.getElementById(picID)).css('margin', "0px");

							$("#stage").show();

							//reactivate clicks only after a little bit after the prompt's word
							setTimeout(function() {
									clickDisabled = false;
								}, (spriteData[wordList[0]].onset - spriteData[wordList[0]].start) * 1000
								// + 300
							);

							startTime = (new Date()).getTime();
							playPrompt(wordList[0]);
						}, 200);
					}
				}, timeafterClick);
			};

		})
	},

	//concatenates all experimental variables into a string which represents one "row" of data in the eventual csv, to live in the server
	processOneRow: function() {
		var dataforRound = experiment.subid;
		dataforRound += "," + experiment.list
		dataforRound += "," + experiment.order
		dataforRound += "," + experiment.trialnum + "," + experiment.word;
		dataforRound += "," + experiment.pic1 + "," + experiment.pic2;
		dataforRound += "," + experiment.phase + "," + experiment.trialtype;
		dataforRound += "," + experiment.pic1type + "," + experiment.pic2type;
		dataforRound += "," + experiment.side + "," + experiment.chosenpic + "," + experiment.response;
		dataforRound += "," + experiment.date + "," + experiment.timestamp + "," + experiment.reactiontime + "\n";
		$.post("https://langcog.stanford.edu/cgi-bin/EJY/neginhib/neginhibstudysave.php", {
			postresult_string: dataforRound
		});
	},

	//the end of the experiment, where the background becomes completely black
	end: function() {
		setTimeout(function() {
			$("#stage").fadeOut();
		}, normalPause);
		showSlide("finish");
		document.body.style.background = "black";
	},
}