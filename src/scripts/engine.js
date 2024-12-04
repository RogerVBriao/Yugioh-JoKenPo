const state = {
    score:{
        playerScore: 0,
        computerScore: 0,
        socreBox: document.getElementById('score_points'),
    },
    cardSprites:{
        avatar: document.getElementById('card-image'),
        name: document.getElementById('card-name'),
        type: document.getElementById('card-type'),
    },
    fieldCards:{
        player: document.getElementById('player-field-card'),
        computer: document.getElementById('computer-field-card'),
    },
    playerSides: {
        player1: "player-cards",
        playerBox: document.getElementById('player-cards'),
        computer: "computer-cards",
        computerBox: document.getElementById('computer-cards'),
    },
    actions: {
        button: document.getElementById('next-duel'),
    },
}


const pathImages = './src/assets/icons/';
const cardData = [
    {
        id: 0,
        name: "Blue-Eyes White Dragon",
        type: "Paper",
        image: `${pathImages}dragon.png`,
        WinOf: [1],
        LoseOf: [2],
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        image: `${pathImages}magician.png`,
        WinOf: [2],
        LoseOf: [0],
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        image: `${pathImages}exodia.png`,
        WinOf: [0],
        LoseOf: [1],
    },
]


async function playAudio(status){
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.play();
}
async function resetDuel(){
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = " Select a card ";
    state.cardSprites.type.innerText = "Atribute: ";
    state.actions.button.style.display = "none";

    state.fieldCards.player.style.display = "none"; 
    state.fieldCards.computer.style.display = "none";

    main();
}

async function getRamdomCardId(){
    return cardData[Math.floor(Math.random() * cardData.length)].id;
}

async function createCardImage(cardId, fieldSide){
    const cardImage = document.createElement('img');
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", cardId);
    cardImage.classList.add('card');

    if(fieldSide === state.playerSides.player1){
        cardImage.addEventListener('click', () => {
            setCardsField(cardImage.getAttribute('data-id'));
        });

        cardImage.addEventListener('mouseover', () => {
            drawSelectCard(cardId);
        });
    }

    

    return cardImage;
}

async function setCardsField(cardId){
    //remove as cartas antes da comparação para que não aja intenreação do usuário.
    await removeAllCardsImages();

    let computerCardId = await getRamdomCardId();

    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";

    state.fieldCards.player.src = cardData[cardId].image;
    state.fieldCards.computer.src = cardData[computerCardId].image;
    
    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);
} 

async function updateScore(){
    state.score.socreBox.innerText = `Win: ${state.score.playerScore} 
    | Lose: ${state.score.computerScore}`;
}

async function drawButton(duelResults){
    state.actions.button.style.display = "block";
    state.actions.button.innerText = duelResults;
}

async function checkDuelResults(playerCardId, computerCardId){
    let duelResults = "Empate";
    let playerCard = cardData[playerCardId];

    if(playerCard.WinOf.includes(computerCardId)){
        duelResults = "Vitória";
        await playAudio('win');
        state.score.playerScore++;
    } 

    if(cardData[playerCardId].LoseOf.includes(computerCardId)){
        duelResults = "Derrota";
        await playAudio('lose');
        state.score.computerScore++;
    }
    return duelResults;
}
async function removeAllCardsImages(){

    let {computerBox, playerBox} = state.playerSides;
    let imgElements = computerBox.querySelectorAll('img');
    imgElements.forEach(img => img.remove());

    imgElements = playerBox.querySelectorAll('img');
    imgElements.forEach(img => img.remove());
    
    
}

async function drawSelectCard(cardId){
    state.cardSprites.avatar.src= cardData[cardId].image;
    state.cardSprites.name.innerText = cardData[cardId].name;
    state.cardSprites.type.innerText = "Atribute: " + cardData[cardId].type;

}

async function drawCards(cardNumbers, fieldSide){
    for(let i = 0; i < cardNumbers; i++){
        const ramdomIdCard = await getRamdomCardId();
        const cardImage = await createCardImage(ramdomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    }
}
    

function main(){
    drawCards(5, state.playerSides.player1);
    drawCards(5, state.playerSides.computer);


    const bgm = document.getElementById('bgm');
    //bgm.play();
    bgm.volume = 0.1;
    
}

main();