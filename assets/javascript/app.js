
//these are the global varaibles for timers

var intervalId;
var timerInt;
var counter;
var counterR;

//this is the Game Object

var myGame = {
	Items : [], //this Array will contain all the questions from API
	currentQuestion : {}, //this object will contain the currentQuestion
	correct: 0, //counter for number of correct answers
	incorrect: 0, //counter for number of incorrect answers
	answered : false, //this bolean will used for avoiding uninteded clicks and operations

	starter : function(){}, //this Method is used to create the Start button and reset the values
	retriever : function(){}, //this Method will retrieve the data from the API and run the loader function at the begining of a new game
	loader : function(){}, //this Method loads the question and answers to their elements and launch the In Method
						   //and set the timer for each question
	checkAnswer : function(){}, //this Method will check whether the answer was correct or whether the time is out
	timerQ : function(){}, //this timer is for questions
	timerR : function(){}, //this timer is for gif and result of each question part
	ender : function(){}, //this Method is only for when the questions are finished and we want to show the results
	In : function(){}, //this Method brings in the elements in
	Out : function(){}, //this Method takes out the elements after answering or time up
	mixUp : function(){}, //this Method is used to mix up the answers because the API gives correct answer separatly
						  //from the incorrect answers. I wanted to avoid having it always at one place
	fixSentence : function(){}, //This Method will fix the sentences from API. They appeared to have some problems
}

myGame.starter = function(){

	this.correct = 0;
	this.incorrect = 0;
	var startBtn = $("<button>");
	startBtn.text("Start");
	startBtn.attr("id" , "startBtn");
	$(".Start-Reset").append(startBtn);
}

myGame.ender = function(){

	var List = $("<p>");
	List.html("<h3>Correct Answers : " + this.correct + "</h3><br><h3>Incorrect Answers : " + this.incorrect);
	$(".Message").empty();
	$(".Message").append(List);

	var startBtn = $("<button>");
	startBtn.text("Start");
	startBtn.attr("id" , "startBtn");
	$(".Start-Reset").append(startBtn);

	$(".timer-container").css({opacity: 0});
}

myGame.retriever = function(){

	queryURL = "https://opentdb.com/api.php?amount=10&difficulty=easy&type=multiple";

	$.ajax({
		url : queryURL,
		method : "GET"
	}).done( function(response){
		response.results.forEach( function(element){
			myGame.Items.push(element);
		});
		myGame.loader();
	})
}

myGame.loader = function(){

	currentQuestion = this.Items.pop();

	console.log(currentQuestion);

	var questionText = currentQuestion.question;
	questionText = this.fixSentence(questionText);
	$(".question").text(questionText);

	var arr = currentQuestion.incorrect_answers;
	arr.push(currentQuestion.correct_answer);

	var arrFinal = this.mixUp(arr);

	for(var i=0;i<arrFinal.length;i++){

		if(arrFinal[i] === arr[3]){
			$(".answer" + i).attr("data-correct" , "true");
		}else{
			$(".answer" + i).attr("data-correct" , "false");
		}
	}

	var ans0 = arrFinal[0];
	ans0 = this.fixSentence(ans0);
	$(".answer0 > p").text(ans0);

	var ans1 = arrFinal[1];
	ans1 = this.fixSentence(ans1);
	$(".answer1 > p").text(ans1);

	var ans2 = arrFinal[2];
	ans2 = this.fixSentence(ans2);
	$(".answer2 > p").text(ans2);

	var ans3 = arrFinal[3];
	ans3 = this.fixSentence(ans3);
	$(".answer3 > p").text(ans3);

	$(".Start-Reset").empty();

	this.answered = false;

	this.In();
	this.timerQ(25);
}

myGame.checkAnswer = function(response){

	this.Out();
	clearInterval(intervalId);

	console.log(currentQuestion.correct_answer);

	if(response === "true"){

		this.correct ++;

		var newGif = $("<img>");
		newGif.attr("src" , "assets/images/Trump-Correct.gif");
		$(".gif").append(newGif);

		var newMessage = $("<p>");
		newMessage.html("You answered Correctly : <br><h3>" + currentQuestion.correct_answer + "</h3>");
		$(".Message").append(newMessage);

	}else if(response === "false"){

		this.incorrect ++;

		var newGif = $("<img>");
		newGif.attr("src" , "assets/images/Trump-Wrong.gif");
		$(".gif").append(newGif);

		var newMessage = $("<p>");
		newMessage.html("No! The Correct Answer Was : <br><h3>" + currentQuestion.correct_answer + "</h3>");
		$(".Message").append(newMessage);
	}

	if(response === "timeUp"){

		this.incorrect ++;

		var newGif = $("<img>");
		newGif.attr("src" , "assets/images/Trump-timeUp.gif");
		$(".gif").append(newGif);

		var newMessage = $("<p>");
		newMessage.html("You Ran Out of Time. The Correct Answer Was : <br><h3>" + currentQuestion.correct_answer + "</h3>");
		$(".Message").append(newMessage);
	}

	this.timerR(7);
	

}

myGame.timerQ = function(time){

	counter = time;
	$(".timer-container").animate({opacity: 1});
	$(".timer").text(counter);

	intervalId = setInterval(decrement, 1000);
	
	function decrement(){

		counter --;

		$(".timer").text(counter);

		if(counter === 0){
			clearInterval(intervalId);
			if(myGame.answered === false){
				myGame.Out();
				myGame.checkAnswer("timeUp");
			}
		}
	}
}

myGame.timerR = function(time){

	counterR = time;

	clearInterval(timerInt);
	timerInt = setInterval(decrement2, 1000);
	
	function decrement2(){

		counterR --;

		if(counterR === 0){
			clearInterval(timerInt);
			$(".gif").empty();

			if(myGame.Items.length !== 0){
				myGame.loader();
			}else {
				myGame.ender();
			}
		}
	}
}


myGame.In = function(){

	$(".gif").empty();
	$(".Message").empty();
	$(".answer0").animate({left: "0" , opacity: 1} , "normal");
	$(".answer1").animate({right: "0" , opacity: 1} , "normal");
	$(".answer2").animate({left: "0" , opacity: 1} , "normal");
	$(".answer3").animate({right: "0" , opacity: 1} , "normal");
	$(".main-panel").animate({top: "0", opacity: 1} , "normal");

}

myGame.Out = function(){

	$(".answer0").animate({left: "-100%" , opacity: 0} , "normal");
	$(".answer1").animate({right: "-100%" , opacity: 0} , "normal");
	$(".answer2").animate({left: "-100%" , opacity: 0} , "normal");
	$(".answer3").animate({right: "-100%" , opacity: 0} , "normal");
	$(".main-panel").animate({top: "-100" , opacity: 0} , "normal");

}

myGame.mixUp = function(arr){

	var Array = [];
	arr2 = [];
	arr.forEach( function(element){
		arr2.push(element)
	})

	var length = arr2.length;

	for(var i=0;i<length;i++){
		var rand = Math.floor(Math.random()*arr2.length);
		Array.push(arr2[rand]);
		arr2.splice(rand, 1);
	}

	return Array;
}

myGame.fixSentence = function(sent){

	var sentence = sent;
	sentence = sentence.replace(/&quot;/g , '"');
	sentence = sentence.replace(/&amp;/g , '&');
	sentence = sentence.replace(/&#039;/g , "'");

	return sentence;
}

myGame.starter();

$(".answer-container").on('click' , '.answer', function(){

	if(myGame.answered === false){
		var response = $(this).attr("data-correct");
		console.log(response);
		myGame.answered = true;
		myGame.checkAnswer(response);
	}
})

$(".Start-Reset").on('click' , '#startBtn' , function(){
	myGame.retriever();
})
