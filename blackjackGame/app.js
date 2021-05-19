let BlackJackGame = {
    'You' : {'scorespan' : '#your-blackjack-result', 'div' : '#Your-box','Score':0},
    'Dealer' : {'scorespan' : '#dealer-blackjack-result', 'div' : '#dealer-box','Score':0},
    'cards' : ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"],
    'cardMap' : {'2': 2 , '3': 3 , '4': 4 , '5': 5 , '6': 6 , '7': 7 , '8':  8 , '9': 9 , '10': 10 , 'J': 10 , 'Q': 10 , 'K': 10 ,'A': [1, 11]},
    'wins' : 0,
    'losses' : 0,
    'draws' : 0,
    'isStand' : false,
    'turnOver'  : false,
}


//access easily You and Dealer

const YOU = BlackJackGame['You'];
const DEALER = BlackJackGame['Dealer'];

//input sounds 
const hitSound = new Audio('/static/sounds/swish.mp3');
const winSound = new Audio('/static/sounds/cash.mp3');
const LossSound = new Audio('/static/sounds/aww.mp3');
//UI Elements
const hit = document.querySelector('#blackjack-hit-button');
const stand = document.querySelector('#blackjack-stand-button');
const deal = document.querySelector('#blackjack-deal-button');


//Add Event Listeners
hit.addEventListener('click',BlackJackHit);

//dealer logic event listener
stand.addEventListener('click',dealerLogic);

//deal button eventListener
deal.addEventListener('click',BlackJackDeal);
//BlackJack Hit function
function BlackJackHit(){
    if(BlackJackGame['isStand'] === false){
        let card = RandomCard();
        console.log(card);

        //showcard function
        showCard(card,YOU);

        //update Score
        UpdateScore(card,YOU);

        //show score
        showScore(YOU)
    }
    
    
}



//create random card function
function RandomCard(){
    let RamdomIndex = Math.floor(Math.random() * 13);

    //set the random index to the blackJack Cards
    return BlackJackGame['cards'][RamdomIndex]

}

//Create showcard function
function showCard(card,activePlayer){
    let cardImage = document.createElement('img');
    //select the image from the static files 
    cardImage.src = `/static/images/${card}.png`;
    //grap the YOU div element and append with image
    document.querySelector(activePlayer['div']).appendChild(cardImage);
    hitSound.play();
}
function BlackJackDeal(){
    if(BlackJackGame['turnOver'] === true){
        //deactivate the stand
        BlackJackGame['isStand'] === false;

        let YourImages = document.querySelector('#Your-box').querySelectorAll('img');
        let DealerImages = document.querySelector('#dealer-box').querySelectorAll('img');
        
        //for loop and delete your images
        for(i = 0;i < YourImages.length;i++){
            YourImages[i].remove();
        }
        //for loop and delete dealer images
        for(i = 0;i < DealerImages.length;i++){
            DealerImages[i].remove();
        }
        //reset the score
        YOU['Score'] = 0;
        DEALER['Score'] = 0;

        document.querySelector('#your-blackjack-result').textContent = 0;
        document.querySelector('#dealer-blackjack-result').textContent = 0;

        document.querySelector('#your-blackjack-result').style.color  = 'white';
        document.querySelector('#dealer-blackjack-result').style.color  = 'white';

        document.querySelector('#blackjack-result').textContent = "Let's play";
        document.querySelector('#blackjack-result').style.color= 'black';

        BlackJackGame['turnOver'] = true;
    }
}
//Update Score Function
function UpdateScore(card,activePlayer){
    if(card === 'A'){
        if(activePlayer['Score'] + BlackJackGame['cardMap'][card][1] <= 21){
            activePlayer['Score'] += BlackJackGame['cardMap'][card][1];
        }else{
            activePlayer['Score'] += BlackJackGame['cardMap'][card][0];
        }
    }else{
        activePlayer['Score'] += BlackJackGame['cardMap'][card];
    }
}

//show  score function
function showScore(activePlayer){
    if(activePlayer['Score'] > 21){
        document.querySelector(activePlayer['scorespan']).textContent = 'BUST';
        document.querySelector(activePlayer['scorespan']).style.color = 'red'; 
    }else{
        document.querySelector(activePlayer['scorespan']).textContent = activePlayer['Score'];
    }
}

//sleep function
function sleep(ms){
    return new Promise(resolve => setTimeout(resolve,ms))
}
//Dealer Logic
async function dealerLogic(){

    BlackJackGame['isStand'] = true;

    while(DEALER['Score'] < 16 && BlackJackGame['isStand'] === true){
        let card = RandomCard();
        //show card in dealer box
        showCard(card,DEALER);
        //Update SCore function
        UpdateScore(card,DEALER);
        //SHOW SCORE
        showScore(DEALER)

        //sleep function
        await sleep(1000);
    }
    

   //make blackjack turn over is true and compute the winner
   BlackJackGame['turnOver'] = true;
   //compute winning
   let Winner = ComputeWinner();

   showResult(Winner);
   BlackJackGame['isStand'] = false;
}

//Compute Winner function
function ComputeWinner(){
    let Winner;
    if(YOU['Score'] < 21){
        if(YOU['Score'] >  DEALER['Score'] || DEALER['Score'] > 21){
            BlackJackGame['wins']++;
            Winner = YOU;
        }else if(YOU['Score'] < DEALER['Score']){
            BlackJackGame['losses']++;
            Winner = DEALER;
        }else if(YOU['Score'] === DEALER['Score']){
            BlackJackGame['draws']++;
        }
    }else if(YOU['Score'] > 21 && DEALER['Score'] <= 21){
        BlackJackGame['losses']++;
        Winner = DEALER;
    }else if(YOU['Score'] > 21 && DEALER['Score'] > 21){
        BlackJackGame['draws']++;
    }

    
    //console.log(BlackJackGame);
    return(Winner)
}

//show result function

function showResult(Winner){
    let massage ,messagecolor;
    if(BlackJackGame['turnOver'] === true){
        if(Winner === YOU){
            document.querySelector('#win').textContent = BlackJackGame['wins'];
            massage = 'You Won!!';
            messagecolor = 'green';
            winSound.play();
        }else if(Winner == DEALER){
            document.querySelector('#losses').textContent = BlackJackGame['losses'];
            massage = 'You Lost!!';
            messagecolor = 'red';
            LossSound.play();
        }else{
            document.querySelector('#draw').textContent = BlackJackGame['draws'];
            massage = 'You Drew';
            messagecolor = 'black';
        }
    }

    document.querySelector('#blackjack-result').textContent = massage;
    document.querySelector('#blackjack-result').style.color = messagecolor;
}