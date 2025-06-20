
// Get DOM elements
const chatBox = document.getElementById('chat-box');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');

// Function to display messages in the chat box
function displayMessage(sender, message) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', `${sender}-message`);
  messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatBox.appendChild(messageElement);
  // Scroll to the bottom of the chat box
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Event listener for form submission
chatForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent default form submission

  const userMessage = userInput.value.trim(); // Get user input and trim whitespace

  if (!userMessage) {
    return; // Don't send empty messages
  }

  // Display user message in the chat box
  displayMessage('You', userMessage);

  // Clear the input field
  userInput.value = '';

  try {
    // Send message to backend
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: { userMessage: userMessage } }), // Match backend expectation
    });

    if (!response.ok) {
      // Handle non-2xx responses
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json(); // Parse the JSON response
    const botReply = data.reply; // Extract the reply

    // Display bot reply in the chat box
    displayMessage('Gemini', botReply);

  } catch (error) {
    console.error('Error sending message:', error);
    // Display an error message in the chat box
    displayMessage('System', `Error: ${error.message}`);
  }
});

// Optional: Add an initial message from the bot
displayMessage('Gemini', 'Hello! How can I help you today?');