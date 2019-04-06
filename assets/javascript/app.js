var app = {
    $btnContainer : $("#btn-container"),
    topics: ["music", "guitar", "bass guitar", "banjo", "ukulele", "piano", "singing", "music production", "live performance"],

    selectedTopic: "",
    $selectedTopic: ""
}


$(document).ready(function() {
    $.each(app.topics, function(index, value) {
        // make new button
        var newBtn = $("<button>").text(app.topics[index]);
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
            console.log(response);
        });
        // save animated and static urls as data values as well as its state

    })





}) // end of document.ready