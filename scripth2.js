const SPREADSHEET_ID = '1zKveXKoxYhx09GEC8dBB_J3W8wamuoBl7ihffGZriKs'; // Replace with your actual Spreadsheet ID
const API_KEY = 'AIzaSyADN4_k5AalrLi8mxUBnilqy4uxfJnWjPc'; // Replace with your actual API Key
const RANGE = 'Sheet2!A1:T6'; // Adjust this range based on your data

const STARTING_WEEK = 11; // Specify the starting week (e.g., Week 5)
const TOTAL_WEEKS = 20; // Total number of weeks

async function fetchData() {
  try {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`);
    const data = await response.json();
    return data.values || [];
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

function createCard(weekNumber, data) {
  const card = document.createElement('div');
  card.className = 'carousel-card';

  // Add Week Number
  const weekNumberDiv = document.createElement('div');
  weekNumberDiv.className = 'week-number';
  weekNumberDiv.textContent = `WEEK ${weekNumber}`;
  card.appendChild(weekNumberDiv);

  // Add Week Days Container
  const weekDaysContainer = document.createElement('div');
  weekDaysContainer.className = 'week-days-container';

  // Calculate the start index for the current week
  const columnIndex = weekNumber - 1; // Column index from 0 to 19
  const weekData = data.map(row => row[columnIndex] || '');

  // Ensure there is data for this week
  if (weekData.length === 6) {
    for (let i = 0; i < 5; i++) { // Monday to Friday
      const textarea = document.createElement('textarea');
      textarea.className = 'weekday';
      textarea.value = weekData[i] || ''; // Fetching Monday to Friday data
      weekDaysContainer.appendChild(textarea);
    }

    // Add Saturday
    const saturdayContainer = document.createElement('div');
    saturdayContainer.className = 'saturday-container';

    const saturday = document.createElement('textarea');
    saturday.className = 'saturday';
    saturday.value = weekData[5] || ''; // Fetching Saturday data
    saturdayContainer.appendChild(saturday);

    card.appendChild(weekDaysContainer);
    card.appendChild(saturdayContainer);
  } else {
    console.warn(`Insufficient data for Week ${weekNumber}`);
  }

  return card;
}

async function initializeCarousel() {
  const data = await fetchData();
  const carousel = document.getElementById('carousel');

  // Clear existing cards
  carousel.innerHTML = '';

  // Create and append cards for all 20 weeks
  for (let weekNumber = 1; weekNumber <= 20; weekNumber++) {
    const card = createCard(weekNumber, data);
    carousel.appendChild(card);


        const carouselWidth = carousel.offsetWidth;
        const cardWidth = document.querySelector('.carousel-card').offsetWidth;
        const startIndex = (STARTING_WEEK - 1) * cardWidth;

        // Use scrollLeft or translateX to position the carousel
        carousel.style.transform = `translateX(-${startIndex}px)`;
    
  }
}

// Initialize the carousel on page load
document.addEventListener('DOMContentLoaded', initializeCarousel);

// Carousel Navigation
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let currentIndex = 0;

function updateCarousel() {
  const totalCards = document.querySelectorAll('.carousel-card').length;
  const offset = -currentIndex * 100;
  document.getElementById('carousel').style.transform = `translateX(${offset}%)`;
}

prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex > 0) ? currentIndex - 1 : 19;
  updateCarousel();
});

nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex < 19) ? currentIndex + 1 : 0;
  updateCarousel();
});
