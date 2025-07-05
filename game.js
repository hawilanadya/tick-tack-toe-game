window.addEventListener("DOMContentLoaded", () => {
  const player1 = localStorage.getItem("player1") || "Player 1";
  const player2 = localStorage.getItem("player2") || "Player 2";

  document.getElementById("player1-name").textContent = player1;
  document.getElementById("player2-name").textContent = player2;
  document.getElementById("player1-img").src = `assets/${player1}.png`;
  document.getElementById("player2-img").src = `assets/${player2}.png`;

  const mainTitle = document.getElementById("main-title");
  const vsText = document.getElementById("vs-text");
  const middleArea = document.getElementById("middle-area");
  const spinResult = document.getElementById("spin-result");
  const replayBtn = document.getElementById("replayBtn");

  const boardState = Array(9).fill("");
  let currentPlayer = null;
  let currentPlayerSymbol = null;
  let gameOver = false;

  const board = document.createElement("div");
  board.className = "board";

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.index = i;
    board.appendChild(cell);
  }

  const turnText = document.createElement("p");
  turnText.id = "turn-text";
  turnText.className = "turn-indicator";

  const boardContainer = document.createElement("div");
  boardContainer.classList.add("board-container", "fade-in");
  boardContainer.appendChild(turnText);
  boardContainer.appendChild(board);

  // --- ANIMASI SPIN ---
  setTimeout(() => {
    vsText.classList.add("fade-out");

    setTimeout(() => {
      vsText.remove();

      const spinNames = shuffleArray([
        player1,
        player2,
        player1,
        player2,
        player1,
        player2,
      ]);
      let index = 0;

      const interval = setInterval(() => {
        spinResult.textContent = spinNames[index];
        spinResult.classList.add("flip");

        setTimeout(() => {
          spinResult.classList.remove("flip");
        }, 300);

        index++;
        if (index >= spinNames.length) {
          clearInterval(interval);
          const firstPlayer = spinNames[spinNames.length - 1];
          currentPlayer = firstPlayer;
          currentPlayerSymbol = firstPlayer === player1 ? "X" : "O";
          spinResult.textContent = `Giliran pertama: ${firstPlayer}`;
          mainTitle.textContent = "Play Game";

          turnText.textContent = `Giliran: ${currentPlayer}`;
          updateHighlight();
          middleArea.innerHTML = ""; // Kosongkan middle area
          middleArea.appendChild(boardContainer);
        }
      }, 400);
    }, 500);
  }, 2000);

  board.addEventListener("click", (e) => {
    if (gameOver) return;

    const cell = e.target;
    const index = cell.dataset.index;

    if (!index || cell.textContent !== "" || !currentPlayer) return;

    const symbol = currentPlayerSymbol;
    cell.textContent = symbol;
    boardState[index] = symbol;

    const winCombo = checkWin(symbol);
    if (winCombo) {
      turnText.textContent = `Pemenang: ${currentPlayer}`;
      showWinnerEffect(currentPlayer, winCombo);
      gameOver = true;
      replayBtn.classList.remove("hidden");
      return;
    }

    if (boardState.every((cell) => cell !== "")) {
      turnText.textContent = `Hasil: Seri!`;
      gameOver = true;
      replayBtn.classList.remove("hidden");
      return;
    }

    if (currentPlayer === player1) {
      currentPlayer = player2;
      currentPlayerSymbol = "O";
    } else {
      currentPlayer = player1;
      currentPlayerSymbol = "X";
    }

    turnText.textContent = "Giliran: " + currentPlayer;
    updateHighlight();
  });

  function updateHighlight() {
    const player1Card = document.getElementById("player1-card");
    const player2Card = document.getElementById("player2-card");

    player1Card.classList.remove("active-turn", "zoom");
    player2Card.classList.remove("active-turn", "zoom");

    if (currentPlayer === player1) {
      player1Card.classList.add("active-turn", "zoom");
    } else {
      player2Card.classList.add("active-turn", "zoom");
    }
  }

  function checkWin(symbol) {
    const winCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (const combo of winCombos) {
      const [a, b, c] = combo;
      if (
        boardState[a] === symbol &&
        boardState[b] === symbol &&
        boardState[c] === symbol
      ) {
        return combo; // kirim array kombinasi menang
      }
    }
    return null;
  }

  function showWinnerEffect(winner, winCombo) {
    const winnerCard =
      winner === player1
        ? document.getElementById("player1-card")
        : document.getElementById("player2-card");
    const stars = document.createElement("div");
    stars.className = "winner-stars";
    stars.innerHTML = "⭐️⭐️⭐️";
    winnerCard.appendChild(stars);

    // ---Buat win line---//
    drawWinLine(winCombo);
  }
  function drawWinLine(combo) {
    const board = document.querySelector(".board");
    const boardRect = board.getBoundingClientRect();

    const cell = board.querySelector(".cell");
    const cellRect = cell.getBoundingClientRect();
    const cellSize = cellRect.width;
    const gap = 8; // sesuai CSS .board gap

    // Hitung center setiap cell
    const getCellCenter = (index) => {
      const row = Math.floor(index / 3);
      const col = index % 3;
      return {
        x: col * (cellSize + gap) + cellSize / 2,
        y: row * (cellSize + gap) + cellSize / 2,
      };
    };

    const start = getCellCenter(combo[0]);
    const end = getCellCenter(combo[2]);

    // Hitung panjang garis
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.sqrt(dx * dx + dy * dy);

    // Hitung angle dalam derajat
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    const line = document.createElement("div");
    line.className = "win-line";

    line.style.width = `${length}px`;
    line.style.transform = `translate(${start.x}px, ${start.y}px) rotate(${angle}deg)`;
    board.appendChild(line);
  }

  replayBtn.classList.add("hidden");
  replayBtn.addEventListener("click", () => {
    location.reload();
  });

  function shuffleArray(array) {
    let currentIndex = array.length;
    while (currentIndex !== 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
  }
});
