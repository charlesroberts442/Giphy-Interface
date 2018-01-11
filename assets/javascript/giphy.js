/***********************************************************************
 * Copyright (c) 2018 Charles W. Roberts
 * All Rights Reserved
 *
 * No portion of this code may be copied or modified without the
 * prior written permission of Charles Roberts.
 *
 ***********************************************************************/

/**
 * animalArray is the initial array of subjects for querying Giphy
 * @type {Array}
 */
let animalArray = ["cat", "obama", "nadia comaneci", "mae west"];

/******************* Event Handlers ************************************/
/**
 * processAjaxResponse is a callback function that is called when the
 * giphy site responds to the ajax request
 * @param  {Object} response The response from giphy
 */
let processAjaxResponse = function(response)
{
	console.log("I'm in processAjaxResponse()");
	console.log(response);

	let results = response.data;
	$("#gif-display").empty();
	for (var i=0; i<results.length; ++i)
	{
		let animalDiv = $("<div>");
		let p = $("<p>").text("Rating: " + results[i].rating);
		let animalImage = $("<img>");
		animalImage.attr("src", results[i].images.fixed_height_still.url);
		animalImage.attr("data-moving", results[i].images.fixed_height.url);
		animalImage.attr("data-still", results[i].images.fixed_height_still.url);
		animalImage.attr("data-state", "still");
		animalImage.addClass("giphy-gif");
		animalImage.attr("id", "image_" + i);

		animalDiv.append(p);
        animalDiv.append(animalImage);
             $("#gif-display").prepend(animalDiv);
	} // End of for (var i=0; i<results.length; ++i)

}; // End of processAjaxResponse()

/**
 * gifClickHandler is the callback for clicks on gifs
 * @param  {Object} event the click event
 */
let gifClickHandler = function(event)
{
	console.log("A gif was clicked.");
	// Get the data-state associated with the clicked button 
	let imgID = event.target.id;
	let imgElement = document.getElementById(imgID);
	let state = imgElement.getAttribute("data-state");
	console.log("state is " + state);
	if(state ==="still")
	{
		imgElement.setAttribute("src",imgElement.getAttribute("data-moving"));
		imgElement.setAttribute("data-state", "moving");
	}
	else
	{
		imgElement.setAttribute("src",imgElement.getAttribute("data-still"));
		imgElement.setAttribute("data-state", "still");
	}
}; // End of gifClickHandler()

/**
 * animalBtnClickHandler is the click handler for button clicks on the added 
 * buttons
 * @param  {Object} event - The click event
 */
let animalBtnClickHandler = function(event)
{
	// Get the data-name associated with the clicked button 
	let btnID = event.target.id;
	let btnElement = document.getElementById(btnID);
	let name = btnElement.getAttribute("data-name");
	
	// Send an AJAX GET request
	let queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
        name + "&api_key=dc6zaTOxFJmzC&limit=10&rating=pg";
    $.ajax(

    {
    	url: queryURL,
          method: "GET"
    })
    .done (processAjaxResponse);
	
}; // End of animalBtnClickHandler()

/**
 * addAnimalClick is the click handler for the "Add" button
 * @param {Object} event - The click event
 */
let addAnimalClick = function(event)
{
	console.log("The Add button was clicked.");
	console.log("The new-animal is " + $("#new-subject").val());
	animalArray.push($("#new-subject").val());
	showArrayButtons();

}; // End of addAnimalClick()

/**
 * clearClick is the click handler for the "Clear Buttons" button
 * @param  {Object} event - The click event
 */
let clearClick = function(event)
{

	console.log("The clear button was clicked.");
	$('.button-area').empty();
	while(animalArray.length > 0) 
	{
    	animalArray.pop();
	}
	
}; // End of clearClick()

/**
 * clearGifsClick is the click handler for the "Clear Gifs" button
 * @param  {Object} event - The click event
 */
let clearGifsClick = function(event)
{
	$("#gif-display").empty();
};

/**
 * showArrayButtons is the method that reads the array of subjects 
 * and creates the buttons for getting gif images
 */
let showArrayButtons = function()
{
	let i=0;

	$('.button-area').empty();

	for(i=0; i<animalArray.length; ++i)
	{
		let newBtn = $("<button>"); 
		newBtn.attr("id", animalArray[i]);
		newBtn.attr("data-name", animalArray[i]);
		newBtn.text(animalArray[i]);
		newBtn.addClass("animalBtn");
		$(".button-area").append(newBtn);
	}

}; // End of initArrayButtons()

/**
 * ready is the function that is called initially when the page is ready
 */
$(document).ready(function(){

   // The "Add" button click handler
   $('#add-animal-btn').click(addAnimalClick);

   // The "Clear" button click handler
   $('#clear-btn').click(clearClick);

   // Initialize the beginning animal buttons
   showArrayButtons();

   // Adding click event listeners to all elements with a class of "movie"
   $(document).on("click", ".animalBtn", animalBtnClickHandler);

   // Adding click event listeners to all elements with a class of "movie"
   $(document).on("click", ".giphy-gif", gifClickHandler);

   // The "Clear Gifs" button click handler
   $('#clear-gifs-btn').click(clearGifsClick);

}); // End of $(document).ready function()