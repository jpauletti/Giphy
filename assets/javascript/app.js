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

    favsArray: [],
    gifNumPosition: 0,
    // topics: ["ariana grande", "billie eilish", "camila cabello", "ed sheeran", "maren morris", "one direction", "taylor swift"],
    topics: ["happy", "sad", "angry", "tired", "done", "awkward", "bored", "mind blown"],

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
        var newFavIcon = $("<i>").addClass("fas fa-heart favBtn");
        newFavBtn.prepend(newFavIcon);
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

                var isAfav = false; // is this image favorited?
                $.each(app.favsArray, function(i, value) {
                    // data-static value in favs array
                    var getStatic1 = app.favsArray[i].image.split("data-static="); // trim begginning
                    var getStatic2 = getStatic1[1].split('"'); // trim all quotes
                    var getStatic = getStatic2[1]; // second trimmed section = static url

                    // if this image's static url matches one in the favs array
                    if (getStatic === img.attr("data-static")) {
                        isAfav = true;
                    }
                });

                // if in favs array, show filled in heart
                if (isAfav) {
                    var favIcon = $("<i>").addClass("fas fa-heart fav-icon opacity-0");
                } else {
                    var favIcon = $("<i>").addClass("far fa-heart fav-icon opacity-0");
                }

                // add image to div
                newDiv.append(favIcon, img);

                // add rating to div
                var rating = $("<p>").text("Rating: " + data[i].rating);
                newDiv.append(rating);

                // add image and rating to div on page
                app.$gifContainer.append(newDiv);

            })

        });

    },

    clickCategory: function () {
        // show gif container
        app.$gifSection.removeClass("hide");

        // show "view more"
        app.$viewMoreBtn.removeClass("hide");

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
    },

    loadFavorites: function () {
        // on page load - load saved favorites
        app.favsArray = JSON.parse(localStorage.getItem("favorites"));

        if (app.favsArray !== null) {
            for (var i = 0; i < app.favsArray.length; i++) {
                var theImage = app.favsArray[i].image;
                var theRating = app.favsArray[i].rating;

                // create parent div and fav icon
                var mainDiv = $("<div>").addClass("result");
                var icon = $("<i>").addClass("fa-heart fav-icon fas opacity-0");
                var rating = $("<p>").text(theRating);
                // add image and icon to parent div
                mainDiv.append(icon, theImage, rating);
                // add parent div to favorites container
                app.$favsContainer.append(mainDiv);

            }
        } else {
            app.favsArray = [];
        }
    }
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


$(document).ready(function() {

    // load favorites, if any
    app.loadFavorites();

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

        app.clickCategory();

        
 

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

        // hide gif container
        app.$gifSection.addClass("hide");

        // hide "view more" btn
        app.$viewMoreBtn.addClass("hide");

        //show favorites section
        app.$favsSection.removeClass("hide");

        // display "view more" button
        app.$viewMoreSection.removeClass("hide");



    }) // end of fav button click event



    // click event for gifs - to animate
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




    // hit submit - add category
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





    // view more btn click event
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
        // toggle heart icon
        var icon = $(this).children(".fav-icon");
        icon.toggleClass("opacity-0");
    });




    // click fav icon - add to favorites
    $(document).on("click", ".fav-icon", function() {
        // fill in heart or vice versa
        $(this).toggleClass("far");
        $(this).toggleClass("fas");

        var theImage = $(this).parent().children("img");

        var isInFavsAlready = false;

        $.each(app.favsArray, function(i, value) {

            var getStatic1 = app.favsArray[i].image.split("data-static="); // trim begginning
            var getStatic2 = getStatic1[1].split('"'); // trim all quotes
            var getStatic = getStatic2[1]; // second trimmed section = static url

            if (getStatic === theImage.attr("data-static")) {
                //remove from favs array
                app.favsArray.splice(i, 1);
                isInFavsAlready = true;

                // remove from storage by updating it
                localStorage.setItem("favorites", JSON.stringify(app.favsArray));

                // remove from favorites part of page
                var favoriteSelector = '#favorites-container img[data-static="' + theImage.attr("data-static") + '"';
                $(favoriteSelector).parent().remove();

                return false;
            }
        });

        // if not already favorited, add to array and favs section
        if (!isInFavsAlready) {
            // add to favorites array
            var newItem = {
                image: $(this).parent().children("img")[0].outerHTML,
                rating: $(this).parent().children("p").text()
            }
            app.favsArray.push(newItem);

            // copy results div to favorites section, which is hidden
            var copy = $(this).parent().clone();
            copy.appendTo(app.$favsContainer);

            // save to local storage by updating array saved
            localStorage.setItem("favorites", JSON.stringify(app.favsArray));
            // start fav icon at opacity 0
            $("#favorites-container > .result > i").addClass("opacity-0");
        }

    })


    
    




}) // end of document.ready