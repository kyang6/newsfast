// spritz.js

/*
Generate a spritz
*/
function create_spritz(){
    var spritzContainer = document.getElementById("spritz_container");

    clearTimeouts();
    
    // Selection- want to make this array of objects later
    var selection = " pewter teapot (a rarity nowadays) is not so bad. Thirdly, the pot should be warmed beforehand. This is better done by placing it on the hob than by the usual method of swilling it out with hot water. Fo"
    
    var news_container = [];
    var news_obj = {title:"This is the title",summary:selection,link:"http://google.com"};
    var news_obj_2 = {title:"Second title this is the title",summary:selection,link:"http://yahoo.com"};

    news_container.push(news_obj);
    news_container.push(news_obj_2);
    
    
    spritzify(selection);
}


function spritzify(input){

    // Pass in an array of objects 

    var all_words = preprocess(input);

    var currentWord = 0;
    var running = false;
    var spritz_timers = new Array();


    /*
    Event Listeners
    */
    document.getElementById("spritz_toggle").addEventListener("click", function() {
        if(running) {
            stopSpritz();
        } else {
            startSpritz();
        }
    });


    window.addEventListener("keydown", function (event) {
        if (event.defaultPrevented) {
            return; // Should do nothing if the key event was already consumed.
        }

        switch (event.key) {
            case "ArrowDown":
                console.log("Summary");
                break;
            case "ArrowUp":
                console.log("exit summary");
                break;
            case "ArrowLeft":
                console.log("back");
                break;
            case "ArrowRight":
                console.log("forward");
                break;
            case "Enter":
                if(running) {
                    stopSpritz();
                } else {
                    startSpritz();
                }
                break;
            case "Escape":
                console.log("restart");
                break;
            default:
                return; 
        }
        event.preventDefault();
    }, true);

    /*
    Prints the word to the element spritz_result
    */
    function updateValues(i) {
        var p = pivot(all_words[i]);
        document.getElementById("spritz_result").innerHTML = p;
    }

    /*
    Start spritzing
    */
    function startSpritz() {


        var wpm = parseInt(document.getElementById("spritz_selector").value, 10);
        if(wpm == 0) return;
        var ms_per_word = 60000/wpm;
        document.getElementById("spritz_toggle").textContent = "Pause";

        running = true;

        spritz_timers.push(setInterval(function() {
            updateValues(currentWord);
            currentWord++;
            if(currentWord >= all_words.length) {
                currentWord = 0;
                stopSpritz();
            }
        }, ms_per_word));
    }

    /*
    Pause
    */
    function stopSpritz() {
        for(var i = 0; i < spritz_timers.length; i++) {
            clearInterval(spritz_timers[i]);
        }
        document.getElementById("spritz_toggle").textContent = "Play";
        running = false;
    }

}

// Find the red-character of the current word.
function pivot(word){
    var length = word.length;

    var bestLetter = 1;
    switch (length) {
        case 1:
            bestLetter = 1; // first
            break;
        case 2:
        case 3:
        case 4:
        case 5:
            bestLetter = 2; // second
            break;
        case 6:
        case 7:
        case 8:
        case 9:
            bestLetter = 3; // third
            break;
        case 10:
        case 11:
        case 12:
        case 13:
            bestLetter = 4; // fourth
            break;
        default:
            bestLetter = 5; // fifth
    };

    word = decodeEntities(word);
    var start = '.'.repeat((11-bestLetter)) + word.slice(0, bestLetter-1).replace('.', '&#8226;');
    var middle = word.slice(bestLetter-1,bestLetter).replace('.', '&#8226;');
    var end = word.slice(bestLetter, length).replace('.', '&#8226;') + '.'.repeat((11-(word.length-bestLetter)));

    var result;
    if(middle===" ") middle = ".";
    if(middle==="—") middle = "-";
    if(start.includes('(')) {
        start = start.slice(1);
    }
    result = "<span class='spritz_start'>" + start;
    result = result + "</span><span class='spritz_pivot'>";
    result = result + middle;
    result = result + "</span><span class='spritz_end'>";
    result = result + end;
    result = result + "</span>";

    result = result.replace(/\./g, "<span class='invisible'>.</span>");

    return result;
}

/*
helper function preprocess
---------------------------
takes in a string and returns an array of the words preprocessed
*/
function preprocess(input) {
    var all_words = input.split(/\s+/);

    // The reader won't stop if the selection starts or ends with spaces
    if (all_words[0] == "")
    {
        all_words = all_words.slice(1, all_words.length);
    }

    if (all_words[all_words.length - 1] == "")
    {
        all_words = all_words.slice(0, all_words.length - 1);
    }

    var word = '';
    var result = '';

    // Preprocess words
    var temp_words = all_words.slice(0); // copy Array
    var t = 0;

    for (var i=0; i<all_words.length; i++){

        if(all_words[i].indexOf('.') != -1){
            temp_words[t] = all_words[i].replace('.', '&#8226;');
        }

        // Double up on long words and words with commas.
        if((all_words[i].indexOf(',') != -1 || all_words[i].indexOf(':') != -1 || all_words[i].indexOf('-') != -1) && all_words[i].indexOf('.') == -1){
            temp_words.splice(t+1, 0, all_words[i]);
            temp_words.splice(t+1, 0, all_words[i]);
            t++;
            t++;
        }

        // Add an additional space after punctuation.
        if(all_words[i].indexOf('.') != -1 || all_words[i].indexOf('!') != -1 || all_words[i].indexOf('?') != -1 || all_words[i].indexOf(':') != -1 || all_words[i].indexOf(';') != -1|| all_words[i].indexOf(')') != -1){
            temp_words.splice(t+1, 0, " ");
            temp_words.splice(t+1, 0, " ");
            temp_words.splice(t+1, 0, " ");
            t++;
            t++;
            t++;
        }

        t++;

    }

    return temp_words.slice(0);
};

// This is a hack using the fact that browers sequentially id the timers.
function clearTimeouts(){
    var id = window.setTimeout(function() {}, 0);

    while (id--) {
        window.clearTimeout(id);
    }
}

// Let strings repeat themselves,
// because JavaScript isn't as awesome as Python.
String.prototype.repeat = function( num ){
    if(num < 1){
        return new Array( Math.abs(num) + 1 ).join( this );
    }
    return new Array( num + 1 ).join( this );
};

// Changes the hex to characters
function decodeEntities(s){
    var str, temp= document.createElement('p');
    temp.innerHTML= s;
    str= temp.textContent || temp.innerText;
    temp=null;
    return str;
}




