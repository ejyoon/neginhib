// neginhib: study looking at children's inhibition and negation/implicature processing
// Overview: (i) Parameters (ii) Helper Functions (iii) Control Flow

// ---------------- PARAMETERS ------------------

var gameCounter = 0;
var numGames = 2; //3 games (javascript indexing starts at 0)

//Number of trials per game
var numInhibTrials = 2;
var numNegTrials = 2;
var numImplicTrials = 2;

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

///items (trial items are shuffled)
var items = shuffle(["apple", "apple", "car", "car", "dog", "dog"]);
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
	order: 0,
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
//		if (document.getElementById("order").value !== "1" && document.getElementById("order").value !== "2") { //|| document.getElementById("order").value !== "2") {
//			$("#checkMessage").html('<font color="red">For list, you must choose either a 1 or 2</font>');
//			return;
//		}
//		experiment.order = parseInt(document.getElementById("order").value);

        //order
        //0,1: inhib first
        //2,3: inhib second
        //4,5: inhib third
        experiment.order = random(6);

		gameList = makeGameList(experiment.order);
//        var gameList = shuffle(["inhibition", "negation", "implicature"]);


		//Note: I moved the audio "preloading" here; we shoudld double-check that it still works
		audioSprite.play();
		audioSprite.pause();
		experiment.training();
	},

	//We start with a training game to make sure children know how to use the iPad
	training: function() {
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
				training.removeChild(dot_1);
				training.removeChild(dot_2);
				training.removeChild(dot_3);
				training.removeChild(dot_4);
				training.removeChild(dot_5);
				setTimeout(function() {
					$("#training").hide();
					showSlide("dotGame");
				}, normalPause)
			}
		})
	},

	preStudy: function() {
		$("#stage").hide();
		showSlide("prestudy");

		//$("#prestudy").hide();
		$('#startButton').html(gameList[gameCounter])
		$('#startButton').bind('click touchstart', function(event) {
			setTimeout(function() {
				experiment.next(gameList[gameCounter]);
			}, normalPause);
		})
	},

	// MAIN DISPLAY FUNCTION
	next: function(game) {

		document.body.style.background = "black";

		var gameItems = makeItemList(game);
		var trialTypes = makeTrialTypes(game);
		var wordsAndImages = makeWordsAndImages(game, gameItems);

		var wordList = wordsAndImages[0];
		var imageArray = wordsAndImages[1];

		var objects_html = "";
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

		//FIXME: Counterbalance which side the image appears on
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
				experiment.chosenpic = experiment.pic1;
			} else {
				experiment.side = "R";
				experiment.chosenpic = experiment.pic2;
			}

			// Whether the response was correct
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

						$("#stage").fadeIn();

						//reactivate clicks only after a little bit after the prompt's word
						setTimeout(function() {
							clickDisabled = false;
						}, (spriteData[wordList[0]].onset - spriteData[wordList[0]].start) * 1000 + 300);

						startTime = (new Date()).getTime();
						playPrompt(wordList[0]);
					}, normalPause);
				}
			}, timeafterClick);
		});
	},

	//concatenates all experimental variables into a string which represents one "row" of data in the eventual csv, to live in the server
	processOneRow: function() {
		var dataforRound = experiment.subid;
		dataforRound += "," + experiment.order 
        dataforRound += "," + experiment.trialnum + "," + experiment.word;
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
		}, normalPause);
		showSlide("finish");
		document.body.style.background = "black";
	},
}