// --- CONFIGURATION ---
// Replace 'YOUR_PIXABAY_API_KEY' with your actual Pixabay API key
const PIXABAY_API_KEY = 'YOUR_PIXABAY_API_KEY';
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
    
    const query = vibeInput.value.trim();
    if (!query) {
        alert('Please enter a vibe!');
        return;
    }

    if (PIXABAY_API_KEY === 'YOUR_PIXABAY_API_KEY') {
        alert('Please replace "YOUR_PIXABAY_API_KEY" in script.js with your actual Pixabay API key.');
        return;
    }

    clearResults();
    showLoader(true);

    try {
        const images = await fetchImages(query);
        if (images.length === 0) {
            moodboard.innerHTML = `<p>Couldn't find any images for that vibe. Try something else!</p>`;
        } else {
            displayImages(images);
            displaySources(images);
        }
    } catch (error) {
        console.error('Error fetching images:', error);
        moodboard.innerHTML = `<p>Sorry, something went wrong while fetching images. Please try again later.</p>`;
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
    const url = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&per_page=${IMAGES_TO_FETCH}&safesearch=true`;
    
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.hits;
}

/**
 * Displays the fetched images in the moodboard grid.
 * @param {Array} images - An array of image objects from the API.
 */
function displayImages(images) {
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