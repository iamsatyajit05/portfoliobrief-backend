const SERVER_URL = 'localhost';

async function fetchNews(limit:3) {
  try {
    const response = await fetch(`http://${SERVER_URL}:5000/api/v1/news?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    // Check if the response status is OK (status code 200)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the response as JSON
    const data = await response.json();

    // Log the parsed data
    console.log(data);
  } catch (error) {
    // Handle and log the error
    console.error('Error fetching news:', error);
  }
}

// Example usage
fetchNews(3); // Fetch news with a limit of 10
