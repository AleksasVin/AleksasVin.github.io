// Custom JavaScript for Contact Form Handling

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.custom-contact-form');
    const submitButton = form.querySelector('button[type="submit"]');
    const formContainer = document.querySelector('.col-lg-8');

    // Initially disable submit button
    submitButton.disabled = true;
    submitButton.style.opacity = '0.6';
    submitButton.style.cursor = 'not-allowed';

    // Data is stored in localStorage only, not displayed on page

    // Update slider values in real-time
    const sliders = ['klausimas1', 'klausimas2', 'klausimas3'];
    sliders.forEach(sliderId => {
        const slider = document.getElementById(sliderId);
        const valueDisplay = document.getElementById(sliderId + '-value');

        slider.addEventListener('input', function() {
            valueDisplay.textContent = this.value;
        });
    });

    // Create container for displaying submitted data
    const displayContainer = document.createElement('div');
    displayContainer.id = 'form-display';
    displayContainer.style.marginTop = '2rem';
    displayContainer.style.padding = '1.5rem';
    displayContainer.style.backgroundColor = '#f8f9fa';
    displayContainer.style.borderRadius = '8px';
    displayContainer.style.border = '1px solid #dee2e6';
    displayContainer.style.display = 'none';
    formContainer.appendChild(displayContainer);

    // Create success message popup
    const successPopup = document.createElement('div');
    successPopup.id = 'success-popup';
    successPopup.style.position = 'fixed';
    successPopup.style.top = '20px';
    successPopup.style.right = '20px';
    successPopup.style.backgroundColor = '#28a745';
    successPopup.style.color = 'white';
    successPopup.style.padding = '1rem 1.5rem';
    successPopup.style.borderRadius = '8px';
    successPopup.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    successPopup.style.zIndex = '1000';
    successPopup.style.display = 'none';
    successPopup.style.fontWeight = '600';
    document.body.appendChild(successPopup);

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        // Collect form data
        const formData = {
            vardas: document.getElementById('vardas').value,
            pavarde: document.getElementById('pavarde').value,
            email: document.getElementById('email').value,
            telefonas: document.getElementById('telefonas').value,
            adresas: document.getElementById('adresas').value,
            klausimas1: parseInt(document.getElementById('klausimas1').value),
            klausimas2: parseInt(document.getElementById('klausimas2').value),
            klausimas3: parseInt(document.getElementById('klausimas3').value)
        };

        // Log to console 
        console.log('Form Data:', formData);

        // Calculate average rating
        const average = ((formData.klausimas1 + formData.klausimas2 + formData.klausimas3) / 3).toFixed(1);

        // Display data below the form
        displayContainer.innerHTML = `
            <h4 style="color: #3700ff; margin-bottom: 1rem;">Pateikti duomenys:</h4>
            <p><strong>Vardas:</strong> ${formData.vardas}</p>
            <p><strong>Pavardė:</strong> ${formData.pavarde}</p>
            <p><strong>El. paštas:</strong> ${formData.email}</p>
            <p><strong>Tel. Numeris:</strong> ${formData.telefonas}</p>
            <p><strong>Adresas:</strong> ${formData.adresas}</p>
            <p><strong>Klausimas 1:</strong> ${formData.klausimas1}/10</p>
            <p><strong>Klausimas 2:</strong> ${formData.klausimas2}/10</p>
            <p><strong>Klausimas 3:</strong> ${formData.klausimas3}/10</p>
            <p style="color: #003cff; font-weight: bold;"><strong>${formData.vardas} ${formData.pavarde}:</strong> ${average}</p>
        `;
        displayContainer.style.display = 'block';

        // Show success message
        successPopup.textContent = 'Duomenys pateikti sėkmingai!';
        successPopup.style.display = 'block';

        // Hide success message after 3 seconds
        setTimeout(function() {
            successPopup.style.display = 'none';
        }, 3000);

        // Save data to localStorage
        saveSubmittedData(formData);

        // Reset form and slider values
        form.reset();
        sliders.forEach(sliderId => {
            const slider = document.getElementById(sliderId);
            const valueDisplay = document.getElementById(sliderId + '-value');
            slider.value = 5;
            valueDisplay.textContent = '5';
        });
    });
});

// Function to save submitted data to localStorage
function saveSubmittedData(formData) {
    let submissions = JSON.parse(localStorage.getItem('contactFormSubmissions')) || [];
    const submissionWithTimestamp = {
        ...formData,
        timestamp: new Date().toISOString(),
        average: ((formData.klausimas1 + formData.klausimas2 + formData.klausimas3) / 3).toFixed(1)
    };
    submissions.push(submissionWithTimestamp);
    localStorage.setItem('contactFormSubmissions', JSON.stringify(submissions));
}



// Real-time validation functions
function setupRealTimeValidation() {
    const fields = ['vardas', 'pavarde', 'email', 'adresas'];

    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        field.addEventListener('input', function() {
            validateField(fieldId);
            updateSubmitButton();
        });
        field.addEventListener('blur', function() {
            validateField(fieldId);
            updateSubmitButton();
        });
    });

    // Phone number formatting
    const phoneField = document.getElementById('telefonas');
    phoneField.dataset.rawDigits = '';
    phoneField.addEventListener('input', function(e) {
        formatPhoneNumber(e);
        updateSubmitButton();
    });
    phoneField.addEventListener('blur', function() {
        validatePhoneNumber();
        updateSubmitButton();
    });
}

function validateField(fieldId) {
    const field = document.getElementById(fieldId);
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Remove existing error styling
    field.classList.remove('error-field');

    switch(fieldId) {
        case 'vardas':
        case 'pavarde':
            if (value === '') {
                isValid = false;
                errorMessage = 'Šis laukas yra privalomas';
            } else if (!/^[a-zA-ZąčęėįšųūžĄČĘĖĮŠŲŪŽ\s]+$/.test(value)) {
                isValid = false;
                errorMessage = 'Vardas ir pavardė turi būti sudaryti tik iš raidžių';
            }
            break;
        case 'email':
            if (value === '') {
                isValid = false;
                errorMessage = 'Šis laukas yra privalomas';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                isValid = false;
                errorMessage = 'Neteisingas el. pašto formatas';
            }
            break;
        case 'adresas':
            if (value === '') {
                isValid = false;
                errorMessage = 'Šis laukas yra privalomas';
            }
            break;
    }

    if (!isValid) {
        field.classList.add('error-field');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = errorMessage;
        errorDiv.style.color = '#dc3545';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.25rem';
        field.parentNode.appendChild(errorDiv);
    }

    return isValid;
}

function formatPhoneNumber(event) {
    const input = event.target;
    const currentValue = input.value;
    const previousValue = input.dataset.previousValue || '';

    // Determine if this is a deletion or addition
    let rawDigits = input.dataset.rawDigits || '';

    if (currentValue.length > previousValue.length) {
        // Addition: extract new digits
        const newChars = currentValue.substring(previousValue.length);
        const newDigits = newChars.replace(/\D/g, '');
        rawDigits += newDigits;
    } else if (currentValue.length < previousValue.length) {
        // Deletion: remove from end
        const deletedChars = previousValue.substring(currentValue.length);
        const deletedDigits = deletedChars.replace(/\D/g, '');
        rawDigits = rawDigits.substring(0, rawDigits.length - deletedDigits.length);
    }

    // Limit to 7 digits
    rawDigits = rawDigits.substring(0, 7);

    // Store raw digits
    input.dataset.rawDigits = rawDigits;

    // Format the number
    let formatted = '+370 6';
    if (rawDigits.length >= 2) {
        formatted += rawDigits.substring(0, 2);
        if (rawDigits.length > 2) {
            formatted += ' ' + rawDigits.substring(2);
        }
    } else {
        formatted += rawDigits;
    }

    // Update the input value if different
    if (formatted !== currentValue) {
        input.value = formatted;
    }

    // Store current value for next comparison
    input.dataset.previousValue = input.value;
}

function validatePhoneNumber() {
    const phoneField = document.getElementById('telefonas');
    const value = phoneField.value;
    let isValid = true;
    let errorMessage = '';

    // Remove existing error message
    const existingError = phoneField.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Remove existing error styling
    phoneField.classList.remove('error-field');

    // Check if phone number matches Lithuanian format +370 6xx xxxxx
    const phoneRegex = /^\+370\s6\d{2}\s\d{5}$/;
    if (!phoneRegex.test(value) && value !== '') {
        isValid = false;
        errorMessage = 'Telefono numeris turi būti formato +370 6xx xxxxx';
    }

    if (!isValid) {
        phoneField.classList.add('error-field');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = errorMessage;
        errorDiv.style.color = '#dc3545';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.25rem';
        phoneField.parentNode.appendChild(errorDiv);
    }

    return isValid;
}

function updateSubmitButton() {
    const submitButton = document.querySelector('.custom-contact-form button[type="submit"]');
    const fields = ['vardas', 'pavarde', 'email', 'adresas'];
    let allValid = true;

    // Check all text fields validation
    fields.forEach(fieldId => {
        if (!validateField(fieldId)) {
            allValid = false;
        }
    });

    // Check phone number validation
    if (!validatePhoneNumber()) {
        allValid = false;
    }

    // Enable/disable submit button
    submitButton.disabled = !allValid;
    submitButton.style.opacity = allValid ? '1' : '0.6';
    submitButton.style.cursor = allValid ? 'pointer' : 'not-allowed';
}

// Initialize validation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupRealTimeValidation();
    initializeMemoryGame();
});

// ============================================
// MEMORY GAME LOGIC
// ============================================

// Game state variables
let gameCards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let gameStarted = false;
let difficulty = 'easy'; // 'easy' or 'hard'
let timerInterval = null;
let startTime = null;
let elapsedTime = 0;

// Game data - 6 unique elements (emojis)
const gameSymbols = ['🎮', '🚀', '🎯', '🎲', '🎪', '🎨'];

// Best scores storage
const BEST_SCORES_KEY = 'memoryGameBestScores';
let bestScores = {
    easy: null, // Will store the lowest moves count for easy difficulty
    hard: null  // Will store the lowest moves count for hard difficulty
};

function initializeMemoryGame() {
    // Load best scores from localStorage
    loadBestScores();

    // Difficulty buttons
    document.getElementById('easy-btn').addEventListener('click', () => setDifficulty('easy'));
    document.getElementById('hard-btn').addEventListener('click', () => setDifficulty('hard'));

    // Game control buttons
    document.getElementById('start-btn').addEventListener('click', startGame);
    document.getElementById('reset-btn').addEventListener('click', resetGame);

    // Initialize with easy difficulty
    setDifficulty('easy');
}

function setDifficulty(newDifficulty) {
    difficulty = newDifficulty;

    // Update button states
    document.getElementById('easy-btn').classList.toggle('active', difficulty === 'easy');
    document.getElementById('hard-btn').classList.toggle('active', difficulty === 'hard');

    // Update game board class
    const gameBoard = document.getElementById('game-board');
    gameBoard.className = `game-board ${difficulty}`;

    // Reset game if it's currently running
    if (gameStarted) {
        resetGame();
    }
}

function startGame() {
    if (gameStarted) return;

    gameStarted = true;
    generateCards();
    shuffleCards();
    renderCards();
    resetStats();
    hideWinMessage();
    startTimer();
}

function resetGame() {
    gameStarted = false;
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    gameCards = [];

    resetStats();
    hideWinMessage();
    clearGameBoard();

    // Generate new shuffled cards
    if (difficulty) {
        generateCards();
        shuffleCards();
        renderCards();
    }
}

function generateCards() {
    const numCards = difficulty === 'easy' ? 12 : 24; // 4x3 = 12, 6x4 = 24
    const numUniqueSymbols = difficulty === 'easy' ? 6 : 12; // Half the cards for pairs

    gameCards = [];

    // Create pairs of symbols
    for (let i = 0; i < numUniqueSymbols; i++) {
        const symbol = gameSymbols[i % gameSymbols.length];
        gameCards.push({
            id: i * 2,
            symbol: symbol,
            isFlipped: false,
            isMatched: false
        });
        gameCards.push({
            id: i * 2 + 1,
            symbol: symbol,
            isFlipped: false,
            isMatched: false
        });
    }
}

function shuffleCards() {
    // Fisher-Yates shuffle algorithm
    for (let i = gameCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]];
    }
}

function renderCards() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';

    gameCards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = `game-card ${card.isFlipped ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`;
        cardElement.dataset.index = index;
        cardElement.textContent = card.isFlipped || card.isMatched ? card.symbol : '';
        cardElement.addEventListener('click', () => flipCard(index));
        gameBoard.appendChild(cardElement);
    });
}

function flipCard(index) {
    if (!gameStarted) return;

    const card = gameCards[index];

    // Don't flip if already flipped, matched, or if two cards are already flipped
    if (card.isFlipped || card.isMatched || flippedCards.length >= 2) return;

    // Flip the card
    card.isFlipped = true;
    flippedCards.push(index);
    renderCards();

    // Check for match when two cards are flipped
    if (flippedCards.length === 2) {
        moves++;
        updateMovesDisplay();

        const [firstIndex, secondIndex] = flippedCards;
        const firstCard = gameCards[firstIndex];
        const secondCard = gameCards[secondIndex];

        if (firstCard.symbol === secondCard.symbol) {
            // Match found
            firstCard.isMatched = true;
            secondCard.isMatched = true;
            matchedPairs++;
            updatePairsDisplay();

            // Check for win condition
            const totalPairs = difficulty === 'easy' ? 6 : 12;
            if (matchedPairs === totalPairs) {
                setTimeout(() => {
                    showWinMessage();
                }, 500);
            }

            flippedCards = [];
        } else {
            // No match - flip cards back after delay
            setTimeout(() => {
                firstCard.isFlipped = false;
                secondCard.isFlipped = false;
                flippedCards = [];
                renderCards();
            }, 1000);
        }
    }
}

function clearGameBoard() {
    document.getElementById('game-board').innerHTML = '';
}

function resetStats() {
    moves = 0;
    matchedPairs = 0;
    resetTimer();
    updateMovesDisplay();
    updatePairsDisplay();
}

function updateMovesDisplay() {
    document.getElementById('moves-count').textContent = moves;
}

function updatePairsDisplay() {
    document.getElementById('pairs-count').textContent = matchedPairs;
}

function showWinMessage() {
    const winMessage = document.getElementById('win-message');
    winMessage.style.display = 'block';
    gameStarted = false;
}

function hideWinMessage() {
    document.getElementById('win-message').style.display = 'none';
}

// ============================================
// TIMER AND BEST SCORES FUNCTIONS
// ============================================

function loadBestScores() {
    const savedScores = localStorage.getItem(BEST_SCORES_KEY);
    if (savedScores) {
        bestScores = JSON.parse(savedScores);
    }
    updateBestScoresDisplay();
}

function saveBestScores() {
    localStorage.setItem(BEST_SCORES_KEY, JSON.stringify(bestScores));
}

function updateBestScoresDisplay() {
    document.getElementById('best-score-easy').textContent = bestScores.easy !== null ? bestScores.easy : '-';
    document.getElementById('best-score-hard').textContent = bestScores.hard !== null ? bestScores.hard : '-';
}

function checkAndUpdateBestScore() {
    const currentScore = moves;
    const currentBest = bestScores[difficulty];

    if (currentBest === null || currentScore < currentBest) {
        bestScores[difficulty] = currentScore;
        saveBestScores();
        updateBestScoresDisplay();
    }
}

function startTimer() {
    startTime = Date.now();
    elapsedTime = 0;
    updateTimerDisplay();

    timerInterval = setInterval(() => {
        elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        updateTimerDisplay();
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function resetTimer() {
    stopTimer();
    elapsedTime = 0;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('timer-display').textContent = timeString;
}
