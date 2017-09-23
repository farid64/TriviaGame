//this is the Game Object

var intervalId;
var timerInt;
var counter;
var counterR;

var myGame = {
	Items : [],
	currentQuestion : {},
	correct: 0,
	incorrect: 0,
	answered : false,
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
	questionText = questionText.replace(/&quot;/g , '"');
	questionText = questionText.replace(/&amp;/g , '&');
	questionText = questionText.replace(/&#039;/g , "'");
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
	ans0 = ans0.replace(/&quot;/g , '"');
	ans0 = ans0.replace(/&amp;/g , '&');
	ans0 = ans0.replace(/&#039;/g , "'");
	$(".answer0 > p").text(ans0);

	var ans1 = arrFinal[1];
	ans1 = ans1.replace(/&quot;/g , '"');
	ans1 = ans1.replace(/&amp;/g , '&');
	ans1 = ans1.replace(/&#039;/g , "'");
	$(".answer1 > p").text(ans1);

	var ans2 = arrFinal[2];
	ans2 = ans2.replace(/&quot;/g , '"');
	ans2 = ans2.replace(/&amp;/g , '&');
	ans2 = ans2.replace(/&#039;/g , "'");
	$(".answer2 > p").text(ans2);

	var ans3 = arrFinal[3];
	ans3 = ans3.replace(/&quot;/g , '"');
	ans3 = ans3.replace(/&amp;/g , '&');
	ans3 = ans3.replace(/&#039;/g , "'");
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
		// newGif.css({max-width: "100%", max-height: "100%"});
		$(".gif").append(newGif);

		var newMessage = $("<p>");
		newMessage.html("You answered Correctly : <br><h3>" + currentQuestion.correct_answer + "</h3>");
		$(".Message").append(newMessage);

	}else if(response === "false"){

		this.incorrect ++;

		var newGif = $("<img>");
		newGif.attr("src" , "assets/images/Trump-Wrong.gif");
		// newGif.css({max-width: "100%", max-height: "100%"});
		$(".gif").append(newGif);

		var newMessage = $("<p>");
		newMessage.html("No! The Correct Answer Was : <br><h3>" + currentQuestion.correct_answer + "</h3>");
		$(".Message").append(newMessage);
	}

	if(response === "timeUp"){

		this.incorrect ++;

		var newGif = $("<img>");
		newGif.attr("src" , "assets/images/Trump-timeUp.gif");
		// newGif.css({max-width: "100%", max-height: "100%"});
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

	// clearInterval(Interval);
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
