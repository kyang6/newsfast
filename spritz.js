// spritz.js
/*
Enter to start and stop
escape to go to link
while running
    during title left rereads the title unless in the first three words, then go to the previous object
    during title right skips to the next valid object
    down during title goes to summary
    down during summary does not do anything
    up during summary goes back to the first word of the title
    up during title does not do anything
    in summary left rereads the summary
    in summary right does not do anything

*/

// news_obj
// {title:"this is the title",summary:"This is the summary",link:"www.link.com"};
/*
Generate a spritz
*/
function create_spritz(){
    var spritzContainer = document.getElementById("spritz_container");

    clearTimeouts();

    // Selection- want to make this array of objects later
    // var selection = " pewter teapot (a rarity nowadays) is not so bad. Thirdly, the pot should be warmed beforehand. This is better done by placing it on the hob than by the usual method of swilling it out with hot water. Fo"
    
    var news_container = [];
    var base_obj = {title:"Start",color:"#ffffff",summary:null,link:null};
    // var news_obj = {title:"First firstss firstee firstww",summary:"FIRRST FIRST FIRRSST FIIIRST FIRRRTTS",link:"http://first.com"};
    // var news_obj_2 = {title:"Second secondd seoncid secondd secondd",summary:"SECOND SECOFF SECONN SECCNDN SECOON",link:"http://second.com"};
    // var news_obj_3 = {title:"Third thirdd thieii thiiidf third",summary:"HIIDD THIIRRDDD THIRDDDD THIRDD",link:"http://third.com"};
    var news_obj = {title:"Democratic National Convention: Clinton makes history by becoming the nominee", color:"#eefaf7", summary:"Clinton \u2014 who could soon become the country\u2019s first \u201cfirst man\u201d \u2014 has been a Democratic convention staple for more 40 years., uMarcia Fudge (D-Ohio) announced that Hillary Clinton is officially the Democratic nominee for president., uThe former president is poised to address a Democratic convention as a political spouse for the first time., uBernie Sanders (I-Vt.), asking that Clinton be declared the nominee by acclamation, a move that prompted resounding cheers., uThe former secretary of state formally secured the nomination during the roll call of states at the Democratic National Convention, which ended with a symbolic gesture: Her primary rival, Sen.", link:"https://www.washingtonpost.com/politics/democratic-national-convention-supporters-hope-to-reintroduce-clinton-to-skeptical-voters/2016/07/26/6e8d244a-52ec-11e6-88eb-7dda4e2f2aec_story.html"};
    var news_obj_2 = {title:"French church attack a very sad attack this one is bad horrid",color:"#f7eefa", summary:"France has again been stunned by a jihadist attack, after knife-wielding men burst in to a church, slit an elderly priests throat and took hostages.", link:"http://www.bbc.com/news/world-europe-36900761"};
    var news_obj_3 = {title:"Former Virginia Tech students indicted in slaying of 13 year old Nicole Lovell",color:"#faf7ee", summary:"Tech student who\u2019s accused of plotting the murder with Eisenhauer, was also indicted Tuesday on counts of concealing a body and accessory before the fact in the murder., uInvestigators later testified at a May preliminary hearing that Keepers told them she was not present at the time of the slaying., uShe did tell police she helped Eisenhauer move the body from where he initially left it along Craig Creek Road, according to testimony., u The logs showed his car travel near Lovell\u2019s apartment on Fairfax Road in Blacksburg and then to Craig Creek Road around 2 a.m. on Jan. 27.",link:"http://www.richmond.com/news/virginia/ap/article_c7c3ff5e-b476-52cc-bf3b-5f3eeab46b0f.html"};
    news_container.push(base_obj);
    news_container.push(news_obj);
    news_container.push(news_obj_2);
    news_container.push(news_obj_3);    
    news_container = preprocess(news_container);
    // console.log(news_container);
    spritzify(news_container);
}


function spritzify(news_container){
    var current_news_object = 0;
    var current_word = 0;
    var title_summary_var = "title";
    var running = false;
    var spritz_timers = new Array();
    var previous_obj_var = 3; // if previous is hit and the current_word is less than this number go to the previous news_obj
    var repeat_count = 0;

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
                openSummary();
                break;
            case "ArrowUp":
                exitSummary();
                break;
            case "ArrowLeft":
                goBack();
                break;
            case "ArrowRight":
                goForward();
                break;
            case "Enter":
                togglePause();
                break;
            case "Escape":
                goToLink();
                break;
            default:
                return; 
        }
        event.preventDefault();
    }, true);

    /*
    Prints the word to the element spritz_result
    */
    function updateValues(cur_word, cur_obj,title_summary) {
        var p = pivot(news_container[cur_obj][title_summary][cur_word]);
        document.getElementById("spritz_result").innerHTML = p;
    }

    /*
    Start spritzing
    */
    function startSpritz(input_wpm) {


        var wpm = input_wpm || parseInt(document.getElementById("spritz_selector").value, 10);
        if(wpm == 0) return;
        var ms_per_word = 60000/wpm;
        document.getElementById("spritz_toggle").textContent = "Pause";

        running = true;

        spritz_timers.push(setInterval(function() {
            console.log("Repeat count" + repeat_count);
            updateValues(current_word,current_news_object,title_summary_var);
            current_word++;
            if(current_word >= news_container[current_news_object][title_summary_var].length) {
                // once the summary is over go back to title
                if(title_summary_var === "summary") {
                    switchToTitle();
                }
                current_word = 0;
                incrementCurObject();
                console.log("current word has overflown");
                
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


    function openSummary() {
        if(running) {
            if(title_summary_var !== "summary") {
                console.log("Summary");
                switchToSummary();
                current_word = 0;
                if(repeat_count != 0) resetSpeed();
            }
        }
    }

    function exitSummary() {
        if(running) {
            if(title_summary_var !== "title") {
                console.log("exit summary");
                switchToTitle();
                goForward();
                if(repeat_count != 0) resetSpeed();
            }
        }
    }

    function goBack() {

        if(running) {
            if(title_summary_var === "title") {
                // If current word is less previous_obj_var then go to the previous news_obj
                if(current_word <= previous_obj_var) {
                    // check if is start
                    if(current_news_object != 0) {
                        console.log("back an object");
                        decrementCurObject();
                        current_word = 0;
                        resetSpeed();
                    } else {
                        console.log("back");
                        // redo the current news_obj
                        current_word = 0;
                        incrementRepeatCount();
                    }
                }else {
                    console.log("back");
                    incrementRepeatCount();
                    // redo the current news_obj
                    current_word = 0;
                }
            } else {
                console.log("back");
                incrementRepeatCount();
                // in summary only allow to start over
                current_word = 0;
            }                    
        }
    }

    function goForward() {
        if(running) {
            if(repeat_count != 0) resetSpeed();
            
            // for summary dont allow to skip
            if(title_summary_var === "title") {
                current_word = 0;
                // only allow skip if not the last or second to last news object
                if(current_news_object < news_container.length) {
                    console.log("forward");
                    incrementCurObject();
                } 
            } else {
                resetSpeed();
            }                    
        }
    }

    function togglePause() {
        if(running) {
            stopSpritz();
        } else {
            startSpritz();
        }
    }

    function goToLink() {
        if(current_news_object != 0) {
            console.log(news_container[current_news_object].link);
            console.log("Go to link");
        }
    }
    function incrementCurObject() {
        resetSpeed();
        current_news_object ++;
        if(current_news_object >= news_container.length){
            console.log("cur greater");
            updateValues(0,0,"title");
            current_news_object = 0;
            current_word = 0;
            switchToTitle();
            stopSpritz();
            current_news_object = 0;
        }
        console.log(news_container[current_news_object]["color"]);
        document.body.style.backgroundColor = news_container[current_news_object]["color"];
    }
    function decrementCurObject() {
        current_news_object--;
        document.body.style.backgroundColor = news_container[current_news_object]["color"];
    }
    function switchToTitle () {
        document.body.style.backgroundColor = news_container[current_news_object]["color"];
        title_summary_var = "title";
    }
    function switchToSummary() {
        document.body.style.backgroundColor = colorLuminance(news_container[current_news_object]["color"],-.15
            );
        title_summary_var = "summary";
    }
    function incrementRepeatCount() {
        if(repeat_count < 1) {
            repeat_count ++;
        }
        slowDown();
    }
    function slowDown() {
        stopSpritz();
        var wpm = parseInt(document.getElementById("spritz_selector").value, 10);
        var wpm_map_slow = {200:180, 300:200, 350:270, 400:330, 450:380, 500:400, 550:460, 600:500, 650:510, 700:500, 750:580, 800:610, 850:640, 900: 690, 950:700};
        var slow_wpm = wpm_map_slow[wpm];
        startSpritz(slow_wpm);
    }
    function resetSpeed() {
        repeat_count = 0;
        stopSpritz();
        startSpritz();
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
takes in an array of news_objects and preprocesses the title and the summary into arrays
*/
function preprocess(news_obj_array) {

    for(var i = 0; i<news_obj_array.length; i++) {
        news_obj_array[i].title = preprocessWords(news_obj_array[i].title);
        news_obj_array[i].summary = preprocessWords(news_obj_array[i].summary);
    }
    return news_obj_array;
};

/*
helper function preprocessWords
--------------------------------
Takes in a string and returns an array of words preprocessed
*/
function preprocessWords(str) {
    if(str==null) return null;
    var all_words = str.split(/\s+/);

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
} 


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

// function that changes the color based on luminance
// .2
function colorLuminance(hex, lum) {

    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
        hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    }
    lum = lum || 0;

    // convert to decimal and change luminosity
    var rgb = "#", c, i;
    for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i*2,2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        rgb += ("00"+c).substr(c.length);
    }

    return rgb;
}



