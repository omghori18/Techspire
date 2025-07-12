// Global variables
let currentUser = null
let questions = []
let notifications = []

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
  loadMockData()
  setupEventListeners()
  updateUI()
})

function initializeApp() {
  // Check if user is logged in
  const savedUser = localStorage.getItem("currentUser")
  if (savedUser) {
    currentUser = JSON.parse(savedUser)
  }

  // Load saved data
  const savedQuestions = localStorage.getItem("questions")
  if (savedQuestions) {
    questions = JSON.parse(savedQuestions)
  }

  const savedNotifications = localStorage.getItem("notifications")
  if (savedNotifications) {
    notifications = JSON.parse(savedNotifications)
  }
}

function loadMockData() {
  // Load mock data if no questions exist
  if (questions.length === 0) {
    questions = [
      {
        id: 1,
        title: "How to center a div in CSS?",
        description:
          "I'm trying to center a div both horizontally and vertically. I've tried various methods but none seem to work properly. Can someone help me with the best approach?",
        author: "john_doe",
        authorId: "user1",
        tags: ["css", "html"],
        votes: 5,
        answers: 3,
        views: 127,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        accepted: false,
      },
      {
        id: 2,
        title: "JavaScript async/await vs Promises",
        description:
          "What's the difference between using async/await and traditional Promises in JavaScript? When should I use one over the other?",
        author: "jane_smith",
        authorId: "user2",
        tags: ["javascript", "async"],
        votes: 12,
        answers: 7,
        views: 234,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        accepted: true,
      },
      {
        id: 3,
        title: "React useState not updating immediately",
        description:
          "I'm having trouble with React useState. The state doesn't seem to update immediately after I call the setter function. Is this normal behavior?",
        author: "react_dev",
        authorId: "user3",
        tags: ["react", "javascript"],
        votes: 8,
        answers: 4,
        views: 89,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        accepted: false,
      },
    ]
    localStorage.setItem("questions", JSON.stringify(questions))
  }
}
