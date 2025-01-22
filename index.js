const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const buttonContainer = document.getElementById("buttonContainer");

const timerDisplay = document.getElementById("timer");
const timerWindow = document.getElementById("timerWindow");
const pageDisplay = document.querySelector("body");
const title = document.querySelector("title");
const motivationalText = document.getElementById("motivationalText");
const sessionDisplay = document.getElementById("session");

let minutes = 25;
let seconds = 0;
let timer;
let isBreak = false;
let session = 1;

displayVisibility(pauseBtn, false);
displayVisibility(resetBtn, false);


if (Notification.permission === 'default'){
    Notification.requestPermission();
}


startBtn.addEventListener("click", event => {
    timer = setInterval(timing, 1000);

    if(startBtn.textContent === "Resume"){
        startBtn.textContent = "Start";
    }

    displayVisibility(startBtn, false);
    displayVisibility(pauseBtn, true);
    displayVisibility(resetBtn, true);
});

pauseBtn.addEventListener("click", event => {
   clearInterval(timer);

   displayVisibility(pauseBtn, false);
   displayVisibility(startBtn, true);
   displayVisibility(resetBtn, true);

   startBtn.textContent = "Resume";
});

resetBtn.addEventListener("click", event => {
    clearInterval(timer);

    if(isBreak){
        minutes = 5;
        seconds = 0; 
    } else {
        minutes = 25;
        seconds = 0;
    }

    displayTime();
    displayPhase();

    startBtn.textContent = "Start";

    displayVisibility(startBtn, true);
    displayVisibility(pauseBtn, false);
    displayVisibility(resetBtn, false);
});

function timing(){
    if (seconds > 0){
        seconds--;
    } else if(minutes > 0){
        seconds = 59;
        minutes--;
    } else {
        const alarmSound = new Audio('resources/clock-alarm.mp3');
        alarmSound.play();

        showNotification();
        
        clearInterval(timer);
        isBreak = !isBreak;


        if(isBreak){
            minutes = 5;
            seconds = 0; 
        } else {
            minutes = 25;
            seconds = 0;

            session++;
        }

        displayVisibility(startBtn, true);
        displayVisibility(pauseBtn, false);
        displayVisibility(resetBtn, false);



        displayPhase();
    }

   displayTime();
}

function displayTime(){
    const timerText= String(minutes).padStart(2,"0") + ":" + String(seconds).padStart(2, "0");
    timerDisplay.textContent = timerText;
    title.textContent = timerText;

    if(isBreak){
        title.textContent += " Let's rest!";
    } else {
        title.textContent += " Let's work!";
    }
}

function displayVisibility(element, shouldShow){
    element.style.display = shouldShow ? 'inline' : 'none';
}

function displayPhase(){
     if(isBreak){
        pageDisplay.style.backgroundColor = "aqua";
        timerWindow.style.setProperty('--background-image', "url('resources/sloth.png')");
        timerDisplay.style.textShadow = "3px 3px 3px hsla(180, 100%, 50%, 0.5)";
        buttonContainer.style.marginBottom = "40px";

        for(let button of buttonContainer.children){
            button.style.backgroundColor = "aqua";
            button.style.boxShadow = "3px 3px 3px hsl(180, 100%, 39%, 0.5)";
        }
    
        motivationalText.textContent = " Time to rest a little!";


    } else {
        pageDisplay.style.backgroundColor = "tomato";
        timerWindow.style.setProperty('--background-image', "url('resources/tomato.png')");
        timerDisplay.style.textShadow = "3px 3px 3px tomato";
        buttonContainer.style.marginBottom = "0";

        for(let button of buttonContainer.children){
            button.style.backgroundColor = "tomato";
            button.style.boxShadow = "3px 3px 3px hsl(9, 85%, 39%)";
        }

        motivationalText.textContent = " Time to work!"

        sessionDisplay.textContent = "Session " + String(session);
    }
}


function showNotification(){
    if (Notification.permission === 'granted' && document.hidden) {
      new Notification("Time's up!", {
        body: isBreak ? "5 minutes have passed. Time to get back to work!" :"25 minutes have passed. Take a break!",
        icon: "resources/tomato.png",
      });
    }
}

//reloading the page

window.addEventListener('beforeunload', (event) => {
    event.preventDefault(); 
    event.returnValue = '';
  });
