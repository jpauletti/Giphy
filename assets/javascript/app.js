var app = {
    $btnContainer: $("#btn-container"),
    $gifSection: $(".gif-section"),
    $gifContainer: $("#gif-container"),
    $form: $(".form-inline"),
    $input: $("#add-category"),
    $submitBtn: $("#submit"),
    $viewMoreBtn: $("#view-more-btn"),
    $viewMoreSection: $(".view-more-section"),
    $favsSection: $(".favorites-section"),
    $favsContainer: $("#favorites-container"),
    gifNumPosition: 0,
    topics: ["music", "guitar", "bass guitar", "banjo", "ukulele", "piano", "singing", "live performance"],

    selectedTopic: "",
    $selectedTopic: "",
    queryURL: "",

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

        var newFavBtn = $("<button>").text("favorites");
        newFavBtn.addClass("favorites");
        app.$btnContainer.append(newFavBtn);
    },

    displayGifs: function () {
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
    },

    getGifsFromGiphy: function () {
        // api
        $.ajax({
            url: app.queryURL,
            method: "GET"
        }).then(function (response) {

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

                var favIcon = $("<i>").addClass("far fa-heart fav-icon opacity-0");

                // add image to div
                newDiv.append(favIcon, img);

                // add rating to div
                var rating = $("<p>").text("Rating: " + data[i].rating);
                newDiv.append(rating);

                // add image and rating to div on page
                app.$gifContainer.append(newDiv);

            })

        });

    }
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


$(document).ready(function() {
    // generate btns
    app.generateBtns();


    // click event for category buttons
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

        // show gif container
        app.$gifSection.removeClass("hide");

        // hide favorites section
        app.$favsSection.addClass("hide");

        app.queryURL = "https://api.giphy.com/v1/gifs/search?q=" + app.selectedTopic + "&limit=10&rating=pg&api_key=wmZbNV9tWBsVSS7H3gucE8MjqoeEUrkj";
        
        // empty gif container
        app.$gifContainer.empty();

        app.getGifsFromGiphy();

        // display "view more" button
        app.$viewMoreSection.removeClass("hide");

        // set position for how many gifs have been loaded
        app.gifNumPosition = 10;
 

    }) // end of button click event




    // click event for FAV button
    $(document).on("click", ".favorites", function (event) {
        $(this).addClass("selected");

        // remove selected class from previous selection
        if (app.$selectedTopic !== "") {
            app.$selectedTopic.removeClass("selected");
        }

        // update saved selected item
        app.$selectedTopic = $(this);
        // // save selected topic for api use
        // app.selectedTopic = $(this).text();
        // console.log(app.selectedTopic);

        // app.queryURL = "https://api.giphy.com/v1/gifs/search?q=" + app.selectedTopic + "&limit=10&rating=pg&api_key=wmZbNV9tWBsVSS7H3gucE8MjqoeEUrkj";

        // hide gif container
        app.$gifSection.addClass("hide");

        //show favorites section
        app.$favsSection.removeClass("hide");

        // display "view more" button
        app.$viewMoreSection.removeClass("hide");



    }) // end of fav button click event




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





    app.$form.on("submit", function(event) {
        event.preventDefault();

        // add value to array
        var newCategory = app.$input.val().trim();
        app.topics.push(newCategory);
        console.log(newCategory);

        // clear input
        app.$input.val("");

        // re-generate btns
        app.generateBtns();


    }) // end of submit btn click event






    app.$viewMoreBtn.on("click", function(event) {
        event.preventDefault();

        // new query URL with offset
        app.queryURL = "https://api.giphy.com/v1/gifs/search?q=" + app.selectedTopic + "&limit=10&offset=" + app.gifNumPosition + "&rating=pg&api_key=wmZbNV9tWBsVSS7H3gucE8MjqoeEUrkj";

        app.getGifsFromGiphy();

        // set position for how many gifs have been loaded
        app.gifNumPosition += 10;
    })




    // hover on images - show fav icon
    $(document).on("mouseenter mouseleave", ".result", function(){
        console.log("test hover");
        // toggle heart icon
        var icon = $(this).children(".fav-icon");
        icon.toggleClass("opacity-0");
    });


    // click fav icon - add to favorites
    $(document).on("click", ".fav-icon", function() {
        // fill in heart
        $(this).removeClass("far");
        $(this).addClass("fas");

        // copy results div to favorites section ,which is hidden
        var copy = $(this).parent().clone();
        copy.appendTo(app.$favsContainer);
    })




}) // end of document.ready