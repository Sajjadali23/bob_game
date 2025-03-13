const socket = io();

const seatsContainer = document.getElementById("seats");
const statusText = document.getElementById("status");
const playerNameInput = document.getElementById("playerName");
const passBombButton = document.getElementById("passBomb");
const kickPlayerButton = document.getElementById("kickPlayer");

let mySeat = null;
let bombHolder = null;
let myName = "";

// استقبال بيانات اللاعبين
socket.on("updateSeats", (players) => {
    updateSeats(players);
});

// الانضمام إلى اللعبة
function joinGame() {
    myName = playerNameInput.value.trim();
    if (myName === "") {
        alert("يرجى إدخال اسمك للانضمام إلى اللعبة");
        return;
    }
    socket.emit("joinGame", myName);
}

// تحديث المقاعد
function updateSeats(players) {
    seatsContainer.innerHTML = "";
    players.forEach((player, index) => {
        let seat = document.createElement("div");
        seat.classList.add("seat");
        seat.innerText = player.name;
        seat.onclick = () => passBomb(index);
        if (player.hasBomb) {
            seat.classList.add("bomb");
            bombHolder = index;
        }
        seatsContainer.appendChild(seat);
    });

    if (bombHolder === mySeat) {
        passBombButton.classList.remove("hidden");
        kickPlayerButton.classList.remove("hidden");
    } else {
        passBombButton.classList.add("hidden");
        kickPlayerButton.classList.add("hidden");
    }
}

// تمرير القنبلة
function passBomb(targetIndex) {
    if (bombHolder === mySeat && targetIndex !== mySeat) {
        socket.emit("passBomb", targetIndex);
    }
}

// إقصاء لاعب
function kickNeighbor() {
    socket.emit("kickPlayer");
}