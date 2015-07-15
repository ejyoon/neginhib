// ---------------- HELPER ------------------

// show slide function
function showSlide(id) {
	$(".slide").hide(); //jquery - all elements with class of slide - hide
	$("#" + id).show(); //jquery - element with given id - show
}

//array shuffle function
shuffle = function(o) { //v1.0
	for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
}

// random function
function random(a,b) {
  if (typeof b == "undefined") {
    a = a || 2;
    return Math.floor(Math.random()*a);
  } else {
    return Math.floor(Math.random()*(b-a+1)) + a;
  }
}

getRandomInt = function(x, y) { 
	var randInt = Math.floor(Math.random() * (x - y + 1)) + y;
	return randInt
}

repeat = function(pattern, count) {
    if (count < 1) return '';
    var result = '';
    while (count > 1) {
        if (count & 1) result += pattern;
        count >>= 1, pattern += pattern;
    }
    str = result + pattern;
    str = str.split(" ");
    return str.slice(0, -1);
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

makeGameList = function(order) {
    if (order === 1) {
	   var gameList = ["inhibition", "negation", "implicature"];
    } else if (order === 2) {
		var gameList = ["inhibition", "implicature", "negation"];
	} else if (order === 3) {
        var gameList = ["negation", "inhibition", "implicature"];
    } else if (order === 4) {
        var gameList = ["implicature", "inhibition", "negation"];
    } else if (order === 5) {
        var gameList = ["implicature", "negation", "inhibition"];
    } else if (order === 6) {
        var gameList = ["negation", "implicature", "inhibition"];
    }
	return gameList;
}

// items
makeSetList = function(list) {
    if (list === 1) {
        var items_inhibition = ["apple",	"car",	"dog",	"teddybear",	"banana",	"bicycle",	"cat",	"flower",	"cookie",	"lamp",	"bird",	"cup"
                               ]; 
        var items_negation = ["dog",	"cat",	"teddybear",	"cookie",	"car",	"cup",	"bicycle",	"lamp",	"apple",	"bird",	"flower",	"banana",	"flower",	"bicycle",	"cookie",	"cat",	"lamp",	"apple",	"bird",	"cup",	"teddybear",	"dog",	"banana",	"car",	"car",	"banana",	"cat",	"bird",	"teddybear",	"cookie",	"apple",	"cup",	"dog",	"bicycle",	"flower",	"lamp",	"teddybear",	"flower",	"cat",	"car",	"lamp",	"cup",	"bicycle",	"bird",	"dog",	"banana",	"cookie",	"apple",	"cup",	"teddybear",	"car",	"apple",	"dog",	"banana",	"bird",	"lamp",	"bicycle",	"cat",	"flower",	"cookie"
                             ];
        var items_implicature = ["banana",	"cup",	"apple",	"cat",	"cookie",	"teddybear",	"dog",	"bicycle",	"lamp",	"car",	"flower",	"bird",	"bicycle",	"dog",	"flower",	"bird",	"cat",	"cookie",	"apple",	"lamp",	"banana",	"car",	"cup",	"teddybear",	"bird",	"banana",	"apple",	"cat",	"flower",	"teddybear",	"bicycle",	"cup",	"car",	"cookie",	"lamp",	"dog",	"cookie",	"bird",	"banana",	"lamp",	"car",	"cat",	"flower",	"bicycle",	"teddybear",	"cup",	"dog",	"apple",	"lamp",	"car",	"flower",	"banana",	"cookie",	"dog",	"apple",	"bird",	"teddybear",	"cup",	"bicycle",	"cat"
                                ];
    } else if (list === 2) {
        var items_inhibition = ["cup",	"bird",	"lamp",	"cookie",	"flower",	"cat",	"bicycle",	"banana",	"teddybear",	"dog",	"car",	"apple"
                               ];
        var items_negation = ["cookie",	"flower",	"cat",	"bicycle",	"lamp",	"bird",	"banana",	"dog",	"apple",	"car",	"teddybear",	"cup",	"apple",	"cookie",	"banana",	"dog",	"bird",	"bicycle",	"cup",	"lamp",	"car",	"cat",	"flower",	"teddybear",	"lamp",	"flower",	"bicycle",	"dog",	"cup",	"apple",	"cookie",	"teddybear",	"bird",	"cat",	"banana",	"car",	"car",	"banana",	"dog",	"teddybear",	"cup",	"bird",	"apple",	"lamp",	"cat",	"cookie",	"bicycle",	"flower",	"banana",	"flower",	"bird",	"apple",	"lamp",	"bicycle",	"cup",	"car",	"cookie",	"teddybear",	"cat",	"dog"
                             ];
        var items_implicature = ["cat",	"bicycle",	"cup",	"teddybear",	"bird",	"apple",	"dog",	"cookie",	"banana",	"flower",	"car",	"lamp",	"apple",	"dog",	"cup",	"teddybear",	"bicycle",	"flower",	"cat",	"car",	"lamp",	"banana",	"bird",	"cookie",	"dog",	"lamp",	"cookie",	"car",	"cup",	"bicycle",	"teddybear",	"flower",	"cat",	"apple",	"banana",	"bird",	"teddybear",	"cup",	"car",	"banana",	"lamp",	"apple",	"cookie",	"cat",	"bird",	"flower",	"dog",	"bicycle",	"bird",	"flower",	"car",	"lamp",	"bicycle",	"dog",	"teddybear",	"cookie",	"cat",	"apple",	"cup",	"banana"
                                ];
    } 
    var items = items_inhibition.concat(items_negation, items_implicature);
    return items;
}


makeItemList = function(game) {
	if (game == "inhibition") {
		var startSlice = 0
		var endSlice = numInhibTrials;
		var itemList = items.slice(startSlice, endSlice);
	} else if (game == "negation") {
		var startSlice = numInhibTrials;
		var endSlice = numInhibTrials + numNegTrials;
		var itemList = items.slice(startSlice, endSlice);
	} else if (game == "implicature") {
		var startSlice = numInhibTrials + numNegTrials;
		var endSlice = numInhibTrials + numNegTrials + numImplicTrials;
		var itemList = items.slice(startSlice, endSlice);
	}
	return itemList;
}

makeTrialTypes = function(game) {
	if (game == "negation") {
		var posType = repeat("positive ", numNegTrials/2);
		var negType = repeat("negative ", numNegTrials/2);
		var trialTypes = shuffle(posType.concat(negType));
	} else if (game == "implicature") {
		var implicType = repeat("implicature ", numImplicTrials/2);
		var controlType = repeat("unambiguous ", numImplicTrials/2);
		var trialTypes = shuffle(implicType.concat(controlType));
	}
	return trialTypes;
}

makeWordsAndImages = function(game, items) { //input itemList from makeItemList
	var wordList = [];
	var imageArray = [];
	var numInhibTrials = 0;

	if (game == "negation" || game == "implicature") {
		var trialTypes = makeTrialTypes(game);
	}

	for (i = 0; i < items.length; i++) {
		if (game == "inhibition") {
			var numStay = getRandomInt(minInhib, maxInhib); // how many times should the control be repeated?
			numInhibTrials = numInhibTrials + numStay + 1;
			//words:
			var controlString = items[i] + "_pos "; //what is the control word?
			var posArray = repeat(controlString, numStay); //repeat the control string
			wordList = wordList.concat(posArray); 
			wordList.push(items[i] + "_inhib"); //inhib word
			//images: 
			var imString = items[i] + "_pos " + items[i] + "_inhib ";
			var thisImList = repeat(imString, numStay + 1);
			imageArray = imageArray.concat(thisImList); 
		} else if (game == "negation") {
			//words: 
			if (trialTypes[i] == "positive") {
				wordList.push(items[i] + "_pos");
			} else if (trialTypes[i] == "negative"){
				wordList.push(items[i] + "_neg");
			}
			//images:
			var thisImList = [items[i] + "_pos", items[i] + "_neg"];
			imageArray = imageArray.concat(thisImList);

		} else if (game == "implicature") {
			//words: 
			if (trialTypes[i] == "implicature") {
				wordList.push(items[i] + "_implic");
			} else if (trialTypes[i] == "unambiguous"){
				wordList.push(items[i] + "_control");
			}
			//images:
			if (trialTypes[i] == "implicature") {
				var thisImList = [items[i] + "_implic", items[i] + "_control", ];
				imageArray = imageArray.concat(thisImList);
			} else if (trialTypes[i] == "unambiguous") {
				var thisImList = [items[i] + "_foil", items[i] + "_control", ];
				imageArray = imageArray.concat(thisImList);
			}
		}
	}

	return [wordList, imageArray, numInhibTrials];
}


//For training:
function createDot(dotx, doty, i) {
	var dots = [1, 2, 3, 4, 5];

	var dot = document.createElement("img");
	dot.setAttribute("class", "dot");
	dot.id = "dot_" + dots[i];
	dot.src = "dots/dot_" + dots[i] + ".jpg";

	var x = Math.floor(Math.random() * 950);
	var y = Math.floor(Math.random() * 550);

	var invalid = "true";
	//make sure dots do not overlap
	while (true) {
		invalid = "true";
		for (j = 0; j < dotx.length; j++) {
			if (Math.abs(dotx[j] - x) + Math.abs(doty[j] - y) < 200) {
				var invalid = "false";
				break;
			}
		}
		if (invalid === "true") {
			dotx.push(x);
			doty.push(y);
			break;
		}
		x = Math.floor(Math.random() * 400);
		y = Math.floor(Math.random() * 400);
	}

	dot.setAttribute("style", "position:absolute;left:" + x + "px;top:" + y + "px;");

	training.appendChild(dot);
}

//Handles audio; indexes into the sprite to play the prompt associated with a critical word 
playPrompt = function(word) {
	audioSprite.removeEventListener('timeupdate', handler);
	audioSprite.currentTime = spriteData[word].start;
	audioSprite.play();

	handler = function() {
		if (this.currentTime >= spriteData[word].start + spriteData[word].length) {
			this.pause();
		}
	};
	audioSprite.addEventListener('timeupdate', handler, false);
}