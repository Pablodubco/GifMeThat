// ______________________Initial values_________________________________________
// HTML sections-------------------------------------------------
// For jquery DOM manipulation
var colDivSearchButtons = $("#colDivSearchButtons");    // Column that will hold the search buttons
var gifViewingArea = $("#gifViewingArea");              // Area that will hold gif cards

// Catalogs------------------------------------------------------
// Initial collections of classes
var initialButtons = [                                                      // Initial buttons collection for search
    "person", "cat", "dog", "hamster", "parrot",
    "star wars", "anakin", "obi wan", "leia", "yoda",
    "spongebob", "ren & stimpy", "simpsons", "archer", "rick and morty",
    "holiday", "halloween", "christmas", "easter", "birthday", "party"
];
var btnColorClasses = [                                                     // Color classes for styling search buttons
    "btn-red","btn-green","btn-blue"
];
var bgColorClasses = [                                                      // Color classes for styling display gif cards
    "bg-red","bg-green","bg-blue"
];
// API Controls------------------------------------------------------
// For using the giphy api
var apiKey = "zF1H1U4DC1CpWy812SnG2QwIUgQR51g5";
var baseurl = "http://api.giphy.com/v1/gifs/search?";

// Dynamic variables-------------------------------------------------
// Modified on each call
var gifArray = [];      // Stores gif object data

// Constructs query for api ajax call
var makeQuery = function(searchTerm = ""){
    var url = baseurl;
    var limit = 0;
    var search = "";
    var rating = "";
    var theme = "";
// Takes the value from the selected buttons
    var btnTheme = $(".active[udgiftheme]");
    var btnRating = $(".active[udgifrating]");
    var btnNumber = $(".active[udgifnumber]");
    theme = btnTheme.attr("data-value");
    rating = btnRating.attr("data-value");
    limit = btnNumber.attr("data-value");
// Defines what to search for
    search = searchTerm.replace(/ /g,"+"); // Replace spaces with "+"
    if (theme !== "any") search = `${search}+${theme}`;
// Constructs query
    url += `api_key=${apiKey}&q=${search}&limit=${limit}`
    if (rating !== "any") url += `&rating=${rating}`;
// Calls API
    callGiphy(url);
}

// Calls giphy api
var callGiphy = function(url){
    console.log(`beginning ajax call: ${url}`);
    $.ajax({
        url: url,
        method: 'GET',
    }).done(function(res) {
        console.log(res);
        gifArray = []; // Clears gif array
        gifViewingArea.empty(); // Clears gif viewing area
        for (var i = 0; i < res.data.length;i++){
            var gifData = res.data[i];
            var gifObject = {
                title: gifData.title,
                rating: gifData.rating,
                srcStill: gifData.images.fixed_height_still.url,
                srcMoving: gifData.images.fixed_height.url,
                srcOriginal: gifData.images.original.url,
                imgState: "static"
            }
            gifArray.push(gifObject);
            displayGif(gifObject,i);
        }
    }).fail(function(err) {
        throw err;
    });
}

var displayGif = function(gifObject = new Object,gifIndex = 0){
// Creating DOM elements for gif card
    var randomIndex = Math.floor(Math.random()*bgColorClasses.length);
    var bgColorClass = bgColorClasses[randomIndex];
    var gifCard = $("<div>",{class:"card py-1 px-1 mx-1 my-1 bounceIn "+bgColorClass});
    var gifImg = $("<img>",{
        class:"card-img-top",
        src:gifObject.srcStill,
        alt:gifObject.title,
        udIndex:gifIndex
    });
    var gifCardBody = $("<div>",{class:"card-body py-0 px-0 my-0 mx-1"});
    var gifCardTitle = $("<div>",{
        class:"card-title text-white card-img-overlay py-0 px-0 my-1 mx-1",
        style:"height:1px;font-size:12px"
    }).append(
        $("<span>",{style:"background-color:rgb(0,0,0,0.5)",text:gifObject.title})
    );
    var gifShareContainer = $("<div>",{class:"row mx-0 my-1 px-1 justify-content-around"});
    var gifShareFaceBook = $("<div>",{class:"col-3 px-0 py-0 text-center"}).append(
        $("<a>",{
            class:"btn btn-facebook text-white px-1 py-1",
            href:"https://facebook.com/sharer/sharer.php?u="+gifObject.srcOriginal,
            target:"_blank"
        }).append(
            $("<i>",{class:"fa fa-facebook"})
        )
    );
    var gifShareTwitter = $("<div>",{class:"col-3 px-0 py-0 text-center"}).append(
        $("<a>",{
            class:"btn btn-twitter text-white px-1 py-1",
            href:"https://twitter.com/intent/tweet/?text=&hithere&url="+gifObject.srcOriginal,
            target:"_blank"
        }).append(
            $("<i>",{class:"fa fa-twitter"})
        )
    );
    var gifShareWhatsapp = $("<div>",{class:"col-3 px-0 py-0 text-center"}).append(
        $("<a>",{
            class:"btn btn-whatsapp text-white px-1 py-1",
            href:"whatsapp://send?text=%20"+gifObject.srcOriginal,
            target:"_blank"
        }).append(
            $("<i>",{class:"fa fa-whatsapp"})
        )
    );
    var gifShareDownload = $("<div>",{class:"col-3 px-0 py-0 text-center"}).append(
        $("<a>",{
            class:"btn btn-download text-white px-1 py-1",
            href:gifObject.srcOriginal,
            target:"_blank",
            download:"",
        }).append(
            $("<i>",{class:"fa fa-download"})
        )
    );
// Appending DOM elements
    gifShareContainer.append(gifShareFaceBook,gifShareTwitter,gifShareWhatsapp,gifShareDownload);
    gifCardBody.append(gifCardTitle,gifShareContainer);
    gifCard.append(gifImg,gifCardBody);
    gifViewingArea.append(gifCard);
// Adding on-click event to gif image
    gifImg.on("click",function(){
        var img = $(this);
        var index = img.attr("udindex");
        if (gifArray[index].imgState === "static"){
            gifArray[index].imgState = "active";
            img.attr("src",gifObject.srcMoving);
        }
        else if(gifArray[index].imgState === "active"){
            gifArray[index].imgState = "static";
            img.attr("src",gifObject.srcStill);
        }
    });
}

window.onload = function(){
// Prepare search section buttons
    colDivSearchButtons.empty();  // Clears buttons
    var colorIndex = 0;           // Dynamic variable for index of rotating color scheme for buttons
    console.log(`----- Adding ${initialButtons.length} buttons ------`);
    for (var i = 0;i<initialButtons.length;i++){
        var colorClass = btnColorClasses[colorIndex];   // Set color class
        var text = initialButtons[i];                  // Set text
        console.log(`Button ${i+1}: ${text} `);
        var searchBtn = $("<button>",{class:"btn my-1 mx-1 udResizeText "+colorClass,udSearch:text,text:text}); // Create DOM element
        searchBtn.appendTo(colDivSearchButtons); // Add button to search button area
        if (colorIndex+1 >= btnColorClasses.length) colorIndex = 0;
        else colorIndex++
        searchBtn.on("click",function(){ // Adding on-click event to button
            var btn = $(this);
            var searchTerm = btn.text();
            makeQuery(searchTerm);
        });
    }
// On click event for "add category" button
    $("#btnAdd").on("click",function(){
        var inputElement = $("#inputCategory");
        var input = inputElement.val().trim();          // Clear input
        if (input !== "" && input !== " " && input !== undefined){ // Input check
            var colorClass = btnColorClasses[colorIndex];   // Set color class
            var btn = $("<button>",{class:"btn my-1 mx-1 udResizeText bounceIn "+colorClass,udSearch:input,text:input});
            btn.appendTo(colDivSearchButtons); // Add button to search button area
            if (colorIndex+1 >= btnColorClasses.length) colorIndex = 0;
            else colorIndex++
            btn.on("click",function(){ // Adding on-click event to button
                var searchTerm = $(this).text();
                makeQuery(searchTerm);
            });
        }
    });
}