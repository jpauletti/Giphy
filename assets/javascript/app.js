var app = {
    $btnContainer: $("#btn-container"),
    $gifContainer: $("#gif-container"),
    $input: $("#add-category"),
    $submitBtn: $("#submit"),
    topics: ["music", "guitar", "bass guitar", "banjo", "ukulele", "piano", "singing", "live performance"],

    selectedTopic: "",
    $selectedTopic: "",

    generateBtns: function () {
        // first clear out current btns if any
        app.$btnContainer.empty();

        $.each(app.topics, function (index, value) {
            // make new button
            var newBtn = $("<button>").text(value);
            // add class
            newBtn.addClass("categories");
            // add it to page
            app.$btnContainer.append(newBtn);

        })
    },

    getGifs: function () {
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + app.selectedTopic + "&limit=10&rating=pg&api_key=wmZbNV9tWBsVSS7H3gucE8MjqoeEUrkj";
        console.log(queryURL);

        // api
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            // empty gif container
            app.$gifContainer.empty();

            var data = response.data;



            // display each gif
            $.each(data, function (i, value) {
                // create div for each gif
                var newDiv = $("<div>").addClass("result");

                // set it to static
                var img = $("<img>").attr("src", data[i].images.original_still.url);
                // save static url
                img.attr("data-static", data[i].images.original_still.url);
                // save animated url
                img.attr("data-animated", data[i].images.original.url);
                // save its current state
                img.attr("data-state", "static");

                // add image to div
                newDiv.append(img);

                // add rating to div
                var rating = $("<p>").text("Rating: " + data[i].rating);
                newDiv.append(rating);

                // add image and rating to div on page
                app.$gifContainer.append(newDiv);

            })

        });
    }
}


$(document).ready(function() {
    // generate btns
    app.generateBtns();


    // click event for buttons
    $(document).on("click", ".categories", function (event) {
        $(this).addClass("selected");

        // remove selected class from previous selection
        if (app.$selectedTopic !== "") {
            app.$selectedTopic.removeClass("selected");
        }

        // update saved selected item
        app.$selectedTopic = $(this);
        // save selected topic for api use
        app.selectedTopic = $(this).text();
        console.log(app.selectedTopic);

        app.getGifs();
 

    }) // end of button click event

    $(document).on("click", "img", function (event) {
        var dataState = $(this).attr("data-state");
        var dataStatic = $(this).attr("data-static");
        var dataAnimated = $(this).attr("data-animated");
        
        if (dataState === "static") {
            // if static, make animated
            $(this).attr("src", dataAnimated);
            // update state
            $(this).attr("data-state", "animated");
        } else {
            // if animated, make static
            $(this).attr("src", dataStatic);
            // update state
            $(this).attr("data-state", "static");
        }
        
    }) // end of img click event


    app.$submitBtn.on("click", function(event) {
        event.preventDefault();

        // add value to array
        var newCategory = app.$input.val();
        app.topics.push(newCategory);

        // clear input
        app.$input.val("");
        
        // re-generate btns
        app.generateBtns();


    }) // end of submit btn click event





}) // end of document.ready