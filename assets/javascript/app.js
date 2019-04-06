var app = {
    $btnContainer: $("#btn-container"),
    $gifContainer: $("#gif-container"),
    topics: ["music", "guitar", "bass guitar", "banjo", "ukulele", "piano", "singing", "music production", "live performance"],

    selectedTopic: "",
    $selectedTopic: ""
}


$(document).ready(function() {
    $.each(app.topics, function(index, value) {
        // make new button
        var newBtn = $("<button>").text(value);
        // add it to page
        app.$btnContainer.append(newBtn);

    })


    // click event for buttons
    $(document).on("click", "button", function (event) {
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


        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + app.selectedTopic + "&limit=10&api_key=wmZbNV9tWBsVSS7H3gucE8MjqoeEUrkj";
        console.log(queryURL);

        // api
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            // empty gif container
            app.$gifContainer.empty();

            var data = response.data;

        

            // display each gif
            $.each(data, function(i, value){
                // create div for each gif
                var newDiv = $("<div>").addClass("result");

                // set it to static
                var img = $("<img>").attr("src", data[i].images.fixed_height_still.url);
                // save static url
                img.attr("data-static", data[i].images.fixed_height_still.url);
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
 

    }) // end of button click event

    $(document).on("click", "img", function (event) {
        // if static, make animated
        // if animated, make static
        // change state
    })





}) // end of document.ready