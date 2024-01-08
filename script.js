const characterList = document.getElementById('characterList');
const searchButton = document.getElementById('searchButton');
const showAllButton = document.getElementById('showAllButton');
const showFavoritesButton = document.getElementById('showFavoritesButton');

const INDEXDB_NAME = 'favoritesDB';
const INDEXDB_VERSION = 1;
const STORE_NAME = 'favoritesStore';

let db = null;

// Opens favorites IndexedDB
function openFavoritesDB() {
    return new Promise((resolve, reject) => {
        let request = indexedDB.open(INDEXDB_NAME, INDEXDB_VERSION);

        request.onsuccess = event => {
            db = event.target.result;
            resolve();
        };

        request.onerror = event => {
            reject(event.target.error);
        };

        request.onupgradeneeded = event => {
            db = event.target.result;

            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: '_id' });
            }
        };
    });
}

// Adds a character to favorites
function addToFavorites(character) {
    openFavoritesDB()
        .then(() => {
            addCharacterToFavorites(character)
                .then(() => {
                    console.log('Character added to Favorites.')
                })
                .catch(error => {
                    console.error('Error adding to favorites:', error);
                });
        })
        .catch(error => {
            console.error('Error opening favorites database:', error);
        });
}

// Adds characters to favorites using promises
function addCharacterToFavorites(character) {
    if (!db) {
        throw new Error('Favorites database is not open.');
    }

    return new Promise((resolve, reject) => {
        let transaction = db.transaction([STORE_NAME], 'readwrite');
        let objectStore = transaction.objectStore(STORE_NAME);
        let request = objectStore.add(character);

        request.onsuccess = event => {
            resolve(event.target.result);
        };

        request.onerror = event => {
            reject(event.target.error);
        };
    });
}

// Removes a character from favorites
function removeCharacterFromFavorites(characterId) {
    if (!db) {
        throw new Error('Favorites database is not open.');
    }

    return new Promise((resolve, reject) => {
        let transaction = db.transaction([STORE_NAME], 'readwrite');
        let objectStore = transaction.objectStore(STORE_NAME);
        let request = objectStore.delete(characterId);

        request.onsuccess = () => {
            resolve();
        };

        request.onerror = event => {
            reject(event.target.error);
        };
    });
}

// Updates the icon on hover for a button
function updateIconOnHover(button, filledIcon, outlineIcon) {
    button.addEventListener('mouseenter', () => {
        button.innerHTML = filledIcon;
    });

    button.addEventListener('mouseleave', () => {
        button.innerHTML = outlineIcon;
    });
}

// Updates the "Add to Favorites" button icon
function updateAddToFavoritesIcon(button) {
    updateIconOnHover(
        button,
        `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path>
            </svg>
        `,
        `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star" viewBox="0 0 16 16">
                <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"></path>
            </svg>
        `
    );
}

// Updates the "Remove from Favorites" button icon
function updateRemoveFromFavoritesIcon(button) {
    updateIconOnHover(
        button,
        `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star" viewBox="0 0 16 16">
                <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"></path>
            </svg>
        `,
        `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path>
            </svg>
        `
    );
}

// Function to display characters in the UI
function displayCharacters(characterArray) {
    characterList.innerHTML = ''; // Clean the previous content

    const allCardsContainer = document.createElement('div');
    allCardsContainer.classList.add('container', 'row'); 

    // Filters character except 2 of them because there is no image for them
    const filteredCharacters = characterArray.filter(character =>
        character.name.toLowerCase() !== 'arabella' && character.name.toLowerCase() !== 'amelia duckworth'
    );

    filteredCharacters.forEach((character, index) => {
        const characterCard = document.createElement('div');
        characterCard.classList.add('card', 'col-lg-3', 'col-md-6', 'col-sm-12', 'mb-3', 'mr-3', 'ml-3');

        characterCard.innerHTML = `
            <img src="${character.imageUrl}" class="card-img-top" alt="${character.name} character image">
            <div class="card-body">
                <h5 class="card-title">${character.name}</h5>
                <p class="card-text"><strong>Films:</strong> ${character.films.join(', ')}</p>
                <p class="card-text"><strong>TV Shows:</strong> ${character.tvShows.join(', ')}</p>
                <p class="card-text"><strong>Video Games:</strong> ${character.videoGames.join(', ')}</p>
                <p class="card-text"><strong>Learn more:</strong> <a href="${character.sourceUrl}" target="_blank" style="color: #385B6B; text-decoration: none;">${character.sourceUrl}</a></p>
                <button class="addToFavoritesButton btn btn-secondary" data-character='${JSON.stringify(character)}'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star" viewBox="0 0 16 16">
                        <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"></path>
                    </svg>
                </button>
                <button class="removeFromFavoritesButton btn btn-secondary" data-character-id="${character._id}" style="display:none;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star" viewBox="0 0 16 16">
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"></path>
                    </svg>
                </button>
            </div>
        `;

        allCardsContainer.appendChild(characterCard);

        const addToFavoritesButton = characterCard.querySelector('.addToFavoritesButton');
        const removeFromFavoritesButton = characterCard.querySelector('.removeFromFavoritesButton');

        addToFavoritesButton.addEventListener('click', () => {
            addToFavorites(JSON.parse(addToFavoritesButton.getAttribute('data-character')));
            addToFavoritesButton.style.display = 'none';
            removeFromFavoritesButton.style.display = 'inline-block';
            updateRemoveFromFavoritesIcon(removeFromFavoritesButton);
        });

        removeFromFavoritesButton.addEventListener('click', () => {
            const characterId = parseInt(removeFromFavoritesButton.getAttribute('data-character-id'));
            removeCharacterFromFavorites(characterId)
                .then(() => {
                    removeFromFavoritesButton.style.display = 'none';
                    addToFavoritesButton.style.display = 'inline-block';
                    updateAddToFavoritesIcon(addToFavoritesButton);
                })
                .catch(error => {
                    console.error('Error removing from favorites:', error);
                });
        });

        updateAddToFavoritesIcon(addToFavoritesButton);
        updateRemoveFromFavoritesIcon(removeFromFavoritesButton);

        // Verifies if there is a character in the database and shows the correct button
        openFavoritesDB().then(() => {
            const transaction = db.transaction([STORE_NAME], 'readonly');
            const objectStore = transaction.objectStore(STORE_NAME);
            const request = objectStore.get(character._id);

            request.onsuccess = () => {
                if (request.result) {
                    addToFavoritesButton.style.display = 'none';
                    removeFromFavoritesButton.style.display = 'inline-block';
                    updateRemoveFromFavoritesIcon(removeFromFavoritesButton);
                }
            };
        });
    });

    characterList.appendChild(allCardsContainer);
}

// Looks for a character
function searchCharacter() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const filteredCharacters = characters.filter(character =>
        character.name.toLowerCase().includes(searchInput)
    );

    displayCharacters(filteredCharacters);
}

// Shows all the characters
function showAllCharacters() {
    displayCharacters(characters);
}

// Shows the favorites characters
function showFavorites() {
    openFavoritesDB()
        .then(() => {
            getAllFavorites()
                .then(favorites => {
                    if (favorites.length === 0) {
                        // Show a message indicating that there are no favorites
                        characterList.innerHTML = '<p style="font-style: italic; font-size: 20px;">You have no favorites saved.</p>';
                        characterList.style.display = 'flex';
                        characterList.style.alignItems = 'center';
                        characterList.style.justifyContent = 'center';
                    } else {
                        // Show favorite characters
                        displayCharacters(favorites);
                    }
                })
                .catch(error => {
                    console.error('Error getting favorites:', error);
                });
        })
        .catch(error => {
            console.error('Error opening favorites database:', error);
        });
}

// Gets all favorites
function getAllFavorites() {
    if (!db) {
        throw new Error('Favorites database is not open.');
    }

    return new Promise((resolve, reject) => {
        let transaction = db.transaction([STORE_NAME], 'readonly');
        let objectStore = transaction.objectStore(STORE_NAME);
        let request = objectStore.getAll();

        request.onsuccess = event => {
            resolve(event.target.result);
        };

        request.onerror = event => {
            reject(event.target.error);
        };
    });
}


// Fetchs data from disney API
fetch('https://api.disneyapi.dev/character')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        characters = data.data;

        searchButton.addEventListener('click', searchCharacter);
        showAllButton.addEventListener('click', showAllCharacters);
        showFavoritesButton.addEventListener('click', showFavorites);

        displayCharacters(characters);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
