let chordProgressions = {
    C: ["C", "Dm", "Em", "F", "G", "Am", "Bdim"],
    G: ["G", "Am", "Bm", "C", "D", "Em", "F#dim"],
    D: ["D", "Em", "F#m", "G", "A", "Bm", "C#dim"],
    A: ["A", "Bm", "C#m", "D", "E", "F#m", "G#dim"],
    F: ["F", "Gm", "Am", "Bb", "C", "Dm", "Edim"],
    Bb: ["Bb", "Cm", "Dm", "Eb", "F", "Gm", "Adim"],
    E: ["E", "F#m", "G#m", "A", "B", "C#m", "D#dim"],
};

let chordNotes = {
    C: ["C", "E", "G"],
    Dm: ["D", "F", "A"],
    Em: ["E", "G", "B"],
    F: ["F", "A", "C"],
    G: ["G", "B", "D"],
    Am: ["A", "C", "E"],
    Bdim: ["B", "D", "F"],
    Bm: ["B", "D", "F#"],
    "F#dim": ["F#", "A", "C"],
    "F#m": ["F#", "A", "C#"],
    "C#dim": ["C#", "E", "G"],
    A: ["A", "C#", "E"],
    "C#m": ["C#", "E", "G#"],
    E: ["E", "G#", "B"],
    B: ["B", "D#", "F#"],
    "D#dim": ["D#", "F#", "A"],
    "G#dim": ["G#", "B", "D"],
    Gm: ["G", "Bb", "D"],
    Bb: ["Bb", "D", "F"],
    Edim: ["E", "G", "Bb"],
    Cm: ["C", "Eb", "G"],
    Eb: ["Eb", "G", "Bb"],
    Adim: ["A", "C", "Eb"],
    D: ["D", "F#", "A"],
};

let romanNumerals = ["I", "ii", "iii", "IV", "V", "vi", "vii°"];
let chordFunctions = ["Tonic", "Predominant", "Tonic-related", "Predominant", "Dominant", "Tonic", "Dominant"];
let functionDescriptions = [
    "Feels like home or rest.",
    "Moves away from home and often prepares for the Dominant.",
    "Creates tension and often wants to return to the Tonic.",
    "Moves away from home and often prepares for the Dominant.",
    "Creates tension and often wants to return to the Tonic.",
    "Feels related to the Tonic and can sound like a softer alternative to home.",
    "Creates strong tension and often leads to the Tonic." ];
let commonDestinations = ["I", "V", "vi", "V", "I", "IV", "I"];

let chordDisplay = document.getElementById("chordDisplay");
let keySelect = document.getElementById("keySelect");
let selectedChord = document.getElementById("selectedChord");
let selectedChordName = document.getElementById("selectedChordName");
let selectedRomanNumeral = document.getElementById("selectedRomanNumeral");
let chordQualityDisplay = document.getElementById("chordQuality");
let chordPositionDisplay = document.getElementById("chordPosition");
let chordExplanation = document.getElementById("chordExplanation");
let chordFunctionDisplay = document.getElementById("chordFunction");
let commonDestinationDisplay = document.getElementById("commonDestination");
let copyButton = document.getElementById("copyButton");
let chordNotesDisplay = document.getElementById("chordNotesDisplay");
let saveButton = document.getElementById("saveButton");
let favoritesList = document.getElementById("favoritesList");

function getChordFromRoman(romanNumeral, selectedChords) {
    let index = romanNumerals.indexOf(romanNumeral);
    return selectedChords[index];
}

function displayFavorites() {
    let savedKeysText = localStorage.getItem("favoriteKeys");
    let savedKeys;

    if (savedKeysText) {
        savedKeys = JSON.parse(savedKeysText);
    } else {
        savedKeys = [];
    }

    if (savedKeys.length === 0) {
        favoritesList.textContent = "No saved keys yet.";
        return;
    }

    favoritesList.textContent = "⭐ Saved keys: " + savedKeys.join(", ");
}

function displayChords() {
    let selectedKey = keySelect.value;
    let selectedChords = chordProgressions[selectedKey];
    let output = "";

    for (let i = 0; i < selectedChords.length; i++) {
        output = output + `<div class="chord-row soft-shadow" data-index="${i}"><span>${romanNumerals[i]}</span> <span>${selectedChords[i]}</span></div>`;
    }

    chordDisplay.innerHTML = output;

    let chordRows = document.querySelectorAll(".chord-row");

    for (let i = 0; i < chordRows.length; i++) {
        chordRows[i].addEventListener("click", function() {
            for (let j = 0; j < chordRows.length; j++) {
                chordRows[j].classList.remove("selected");
            }
            this.classList.add("selected");
            selectedChordName.textContent = selectedChords[this.dataset.index];
            let currentChord = selectedChords[this.dataset.index];
            selectedRomanNumeral.textContent = romanNumerals[this.dataset.index];
            let notes = chordNotes[currentChord];
            chordNotesDisplay.textContent = `Notes: ${notes.join(", ")}`;

            let chordNumber = Number(this.dataset.index) + 1;
            let chordQuality = "Major";
            let chordFunction = chordFunctions[this.dataset.index];
            chordFunctionDisplay.textContent = `🎼 ${chordFunction}`;
            let destinationRoman = commonDestinations[this.dataset.index];
            let destinationChord = getChordFromRoman(destinationRoman, selectedChords);
            let destinationText = document.getElementById("destinationText");
            destinationText.innerHTML = `${currentChord} (${romanNumerals[this.dataset.index]}) often moves to <span class="destination-chord">${destinationChord} (${destinationRoman})</span>.`;
            let destinationElement = document.querySelector(".destination-chord");
            
            destinationElement.addEventListener("click", function() {
                let destinationIndex = romanNumerals.indexOf(destinationRoman);
                chordRows[destinationIndex].click();

                let destinationRow = chordRows[destinationIndex];
                destinationRow.classList.add("flash");

                setTimeout(function() {
                    destinationRow.classList.remove("flash");
                }, 600);
            });

            let functionDescription = functionDescriptions[this.dataset.index];

            if (chordNumber === 2 || chordNumber === 3 || chordNumber === 6) {
                chordQuality = "Minor";
            }

            if (chordNumber === 7) {
                chordQuality = "Diminished";
            }

            chordQualityDisplay.textContent = chordQuality;

            let suffix = "th";

            if (chordNumber === 1) {
                suffix = "st";
            }

            if (chordNumber === 2) {
                suffix = "nd";
            }

            if (chordNumber === 3) {
                suffix = "rd";
            }

            chordPositionDisplay.textContent = `${chordNumber}${suffix} chord`;

            chordExplanation.textContent = functionDescription;
        });
    }
}

displayChords();

function displayFavorites() {
    let savedKeysText = localStorage.getItem("favoriteKeys");
    let savedKeys;

    if (savedKeysText) {
        savedKeys = JSON.parse(savedKeysText);
    } else {
        savedKeys = [];
    }

    if (savedKeys.length === 0) {
        favoritesList.textContent = "No saved keys yet.";
        return;
    }

    let output = "⭐ Saved keys: ";

    for (let i = 0; i < savedKeys.length; i++) {
        output = output + `<span class="favorite-key" data-key="${savedKeys[i]}">${savedKeys[i]}</span><span class="remove-key" data-key="${savedKeys[i]}">✕</span> `;
    }

    favoritesList.innerHTML = output;

    let favoriteKeyElements = document.querySelectorAll(".favorite-key");

    for (let i = 0; i < favoriteKeyElements.length; i++) {
        favoriteKeyElements[i].addEventListener("click", function() {
            let clickedKey = this.dataset.key;
            keySelect.value = clickedKey;
            displayChords();
        });
    }

    // NEW: make each ✕ delete its key
    let removeButtons = document.querySelectorAll(".remove-key");

    for (let i = 0; i < removeButtons.length; i++) {
        removeButtons[i].addEventListener("click", function() {
            let keyToRemove = this.dataset.key;

            savedKeys = savedKeys.filter(function(key) {
                return key !== keyToRemove;
            });

            localStorage.setItem("favoriteKeys", JSON.stringify(savedKeys));
            displayFavorites();
        });
    }
}

keySelect.addEventListener("change", function() {
    displayChords();
});

copyButton.addEventListener("click", function() {
    let selectedKey = keySelect.value;
    let selectedChords = chordProgressions[selectedKey];
    let progressionText = selectedChords.join(" - ");

    navigator.clipboard.writeText(progressionText);

    copyButton.textContent = "Copied! ✓";

    setTimeout(function() {
        copyButton.textContent = "Copy Chord Progression";
    }, 1500);
});

saveButton.addEventListener("click", function() {
    let selectedKey = keySelect.value;

    let savedKeysText = localStorage.getItem("favoriteKeys");
    let savedKeys;

    if (savedKeysText) {
    savedKeys = JSON.parse(savedKeysText);
} else {
    savedKeys = [];
}

if (!savedKeys.includes(selectedKey)) {
    savedKeys.push(selectedKey);
    localStorage.setItem("favoriteKeys", JSON.stringify(savedKeys));
}

displayFavorites();
});