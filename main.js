
/*----------  Tweet Tweet Project  DOM Selection  ----------*/

let formEl = document.querySelector('form');
let tweetText = document.querySelector('.tweet-text');
let submitBtn = document.querySelector('.tweet-submit');
let tweetList = document.querySelector('.list-group');
let tweetItem = document.querySelector('.list-item');
let tweetTitle = document.querySelector('.tweet-title');
let tweetTime = document.querySelector('.tweet-time');
let updateTweet = document.querySelector('.tweet-update');
let deleteTweet = document.querySelector('.tweet-delete');
let errMsg = document.querySelector('.err-msg');
let tweetCurrLength = document.querySelector('.current-text');
let filterEl = document.querySelector('#filter');

let tweets = [];

formEl.addEventListener('submit', function(e){
    e.preventDefault();

    let tweetInputVal = tweetText.value;
    let isError = validateInput(tweetInputVal);
    let serialNo = tweets.length + 1;

    if(!isError){
        let id = uuidv4();

        let tweet = {
            id: id,
            sl: serialNo,
            tweet: tweetInputVal,
            time: postTime(),
        }
        tweets.push(tweet);
        addTweetToUI(tweets);
        addTweetToLocalStorage(tweet);
        resetInput();
    }
    
})
function resetInput(){
    tweetText.value = '';
    tweetCurrLength.innerHTML = '0';
}
/*----------  Limit Tweets Input Text In Words  ----------*/
// function countTweetLength(e){
    tweetText.addEventListener('keyup', function(){
        /*----------  Words Count  ----------*/
        let spaces = this.value.match(/\S+/gi); 
        // let spaces = e.value.split(' '); 
        let words = spaces ? spaces.length : 0;
        tweetCurrLength.innerHTML = words;
        
        /*----------  Character Count  ----------*/
        // {    inputLength = tweetText.value.length; 
        //     tweetCurrLength.innerHTML = inputLength;}

        if(words >= 250){
        let maxLength = tweetText.value.split(' ').splice(0, 250).join(' ').length;
            tweetText.value = tweetText.value.split(' ').splice(0, 250).join(' ');
            errMsg.innerHTML = 'Please Write Something Within 250 Words.';
            tweetText.setAttribute('maxlength', maxLength );
        }else{
            errMsg.innerHTML = '';
            tweetText.removeAttribute('maxlength');
        }
    })
// }

/*----------  Validate Tweet Input Value  ----------*/
function validateInput(tweetInputVal){
    let isError = false;
    if(!tweetInputVal || tweetInputVal.length <= 0){
        isError = true;
        errMsg.innerText = 'Please Write Something...';
    }else{
        isError = false;
        errMsg.innerHTML = "";
    }
    // else if(tweetInputVal.length > 250){
    //     isError = true;
    //     errMsg.innerText = 'Please Write Something Within 250 Words.';
    // }
    return isError;
}
/*----------  Generate Tweets Unique ID ----------*/
function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

/*----------  Tweet Post Time ----------*/
function postTime(){
    return moment().format("ddd, MMMM Do YY, h:mm:ss a"); 
}

/*----------  Add Tweets To The UI  ----------*/
function addTweetToUI(items){
    tweetList.innerHTML = "";
    items.forEach(item => {
        let tweetItem = `<li class="list-group-item list-item id-${item.id}">
                            <div class="tweet-content">
                            <div class="tweet">
                                <span class="sl-no">${item.sl}.</span>
                                <p class="tweet-title">${item.tweet}</p>
                            </div>
                            <p class="tweet-time">${item.time}</p>
                            </div>
                            <div class="tweet-delete-update">
                                <i class="bi bi-pencil-square tweet-update btn btn-primary"></i>
                                <button type="button" class="float-right tweet-delete btn btn-primary">Delete</buttom>
                            </div>
                        </li>`;
        tweetList.insertAdjacentHTML('afterbegin', tweetItem);
    })
}


/*----------  Add Tweets To The Local Storage  ----------*/
function addTweetToLocalStorage(tweet){
    if(localStorage.getItem('localTweet')){
       let tweets = JSON.parse(localStorage.getItem('localTweet'));
       tweets.push(tweet);
       localStorage.setItem('localTweet', JSON.stringify(tweets))
    }else{
        let tweets = [];
        tweets.push(tweet);
        localStorage.setItem('localTweet', JSON.stringify(tweets));
    }
}

filterEl.addEventListener('keyup', function(e){
    let filterValue = e.target.value;
    let filteResult = tweets.filter(tweet => tweet.tweet.toLowerCase().includes(filterValue.toLowerCase()));
    addTweetToUI(filteResult);
});

/*----------  Load Tweets From Local Storage To Display In UI  ----------*/
document.addEventListener('DOMContentLoaded', function(){
    if(localStorage.getItem('localTweet')){
        tweets = JSON.parse(localStorage.getItem('localTweet'));
        addTweetToUI(tweets);
    }
})


/*----------  Delete item From Tweet List  ----------*/
let updatedID;
tweetList.addEventListener('click', function(e){
    let currentDeleteItem = e.target.classList.contains('tweet-delete');
    let currentUpdateItem = e.target.classList.contains('tweet-update');

    if(currentDeleteItem){
        updatedID = getItemID(e.target);
        removeItemFromUI(updatedID);
        removeItemFromDataStore(updatedID);
        removeItemFromLocalStorage(updatedID);
    }else if(currentUpdateItem){
        updatedID = getItemID(e.target);
        let foundTweet = tweets.find(tweet => tweet.id === updatedID);
        populateUIInEditeState(foundTweet);
        if(!document.querySelector('.update-tweet')){
            showUpdateBtn();
        }
    }

})
/*----------  Populate Update Tween Text Item Form UI  ----------*/
function populateUIInEditeState(foundTweet){
    tweetText.value = foundTweet.tweet;
    tweetCurrLength.innerHTML = foundTweet.tweet.split(' ').length;
}
/*----------  Show Update Button In UI  ----------*/
function showUpdateBtn(){
    let updateBtn = `<button class="btn mt-3 btn-block btn-primary update-tweet">Update Tweet</button>`;
    submitBtn.style.display = 'none';
    formEl.insertAdjacentHTML('beforeend', updateBtn);
}

/*----------  Remove Item Form UI  ----------*/
function removeItemFromUI(updatedID){
    document.querySelector(`.id-${updatedID}`).remove();
}

/*----------  Remove Item Form Data Store  ----------*/
function removeItemFromDataStore(updatedID){
    tweets = tweets.filter(tweet => tweet.id !== updatedID);
}

/*----------  Remove Item Form Local Storage  ----------*/
function removeItemFromLocalStorage(updatedID){
    let tweets = JSON.parse(localStorage.getItem('localTweet'));
    let tweetsAfterFilter = tweets.filter(tweet => tweet.id !== updatedID);
    localStorage.setItem('localTweet', JSON.stringify(tweetsAfterFilter));
}

function getItemID(event){
    return event.parentElement.parentElement.classList[2].split('-').splice(1).join('-');
}

/*----------  Update Tweet  ----------*/

formEl.addEventListener('click', function(e){
    if(e.target.classList.contains('update-tweet')){
        let tweetInputVal = tweetText.value;
        let isError = validateInput(tweetInputVal);
        if(!isError){
            tweets = tweets.map(tweet => {
                if(tweet.id === updatedID){
                    return {
                        id: tweet.id,
                        sl: tweet.sl,
                        tweet: tweetInputVal,
                        time: tweet.time,
                    }
                }else{
                    return tweet;
                }
            })
            addTweetToUI(tweets);
            submitBtn.style.display = 'block';
            document.querySelector('.update-tweet').remove();
            addUpdatedTweetToLocalStorage(tweets);
            resetInput();
        }
    }
})

function addUpdatedTweetToLocalStorage(tweets){
    if(localStorage.getItem('localTweet')){
        localStorage.setItem('localTweet', JSON.stringify(tweets))
    }
}