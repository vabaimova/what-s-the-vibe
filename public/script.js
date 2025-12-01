// --- CONFIGURATION ---
const IMAGES_TO_FETCH = 12; // How many images to display in the moodboard

// --- DOM ELEMENTS ---
const vibeForm = document.getElementById('vibe-form');
const vibeInput = document.getElementById('vibe-input');
const moodboard = document.getElementById('moodboard');
const loader = document.getElementById('loader');
const sourcesSection = document.getElementById('sources-section');
const sourceList = document.getElementById('source-list');

// --- EVENT LISTENERS ---
vibeForm.addEventListener('submit', handleFormSubmit);

// --- FUNCTIONS ---

/**
 * Handles the form submission event.
 * @param {Event} event - The submit event object.
 */
async function handleFormSubmit(event) {
    event.preventDefault(); // Prevent the form from reloading the page
    
    // Will need to do additional input validation here
    // the API has a character limit for the query
    const query = vibeInput.value.trim();
    if (!query) {
        alert('Please enter a vibe!');
        return;
    }

    clearResults();
    showLoader(true);

    try {
        const images = await fetchImages(query);
        if (images.length === 0) {
            moodboard.innerHTML = `<p>Couldn't find any images for that vibe. Try something else!</p>`;
            document.body.classList.add('moodboard-loaded');
        } else {
            displayImages(images);
            displaySources(images);
        }
    } catch (error) {
        console.error('Error fetching images:', error);
        moodboard.innerHTML = `<p>Sorry, something went wrong while fetching images. Please try again later.</p>`;
        document.body.classList.add('moodboard-loaded');
    } finally {
        showLoader(false);
    }
}

/**
 * Fetches images from the Pixabay API based on a search query.
 * @param {string} query - The search term for the images.
 * @returns {Promise<Array>} A promise that resolves to an array of image objects.
 */
async function fetchImages(query) {
    const url = `/api/images?q=${encodeURIComponent(query)}&per_page=${IMAGES_TO_FETCH}`;
    
    const response = await fetch(url);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.hits;
}

/**
 * Displays the fetched images in the moodboard grid.
 * @param {Array} images - An array of image objects from the API.
 */
function displayImages(images) {
    document.body.classList.add('moodboard-loaded');
    images.forEach(image => {
        const imgElement = document.createElement('img');
        imgElement.src = image.webformatURL;
        imgElement.alt = image.tags;
        moodboard.appendChild(imgElement);
    });
}

/**
 * Displays the source links for the images.
 * @param {Array} images - An array of image objects from the API.
 */
function displaySources(images) {
    sourcesSection.classList.remove('hidden');
    images.forEach(image => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = image.pageURL;
        link.textContent = `Photo by ${image.user} on Pixabay`;
        link.target = '_blank'; // Open link in a new tab
        link.rel = 'noopener noreferrer';
        
        listItem.appendChild(link);
        sourceList.appendChild(listItem);
    });
}

/**
 * Clears previous results from the moodboard and source list.
 */
function clearResults() {
    moodboard.innerHTML = '';
    document.body.classList.remove('moodboard-loaded');
    sourceList.innerHTML = '';
    sourcesSection.classList.add('hidden');
}

/**
 * Shows or hides the loading spinner.
 * @param {boolean} isVisible - True to show the loader, false to hide it.
 */
function showLoader(isVisible) {
    if (isVisible) {
        loader.classList.remove('hidden');
    } else {
        loader.classList.add('hidden');
    }
}