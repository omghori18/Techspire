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

function setupEventListeners() {
  // Navigation
  const loginBtn = document.getElementById("loginBtn")
  const registerBtn = document.getElementById("registerBtn")
  const logoutBtn = document.getElementById("logoutBtn")
  const notificationBell = document.getElementById("notificationBell")

  if (loginBtn) loginBtn.addEventListener("click", showLoginModal)
  if (registerBtn) registerBtn.addEventListener("click", showRegisterModal)
  if (logoutBtn) logoutBtn.addEventListener("click", logout)
  if (notificationBell) notificationBell.addEventListener("click", toggleNotifications)

  // Modals
  const loginModal = document.getElementById("loginModal")
  const registerModal = document.getElementById("registerModal")
  const closeLogin = document.getElementById("closeLogin")
  const closeRegister = document.getElementById("closeRegister")

  if (closeLogin) closeLogin.addEventListener("click", () => hideModal(loginModal))
  if (closeRegister) closeRegister.addEventListener("click", () => hideModal(registerModal))

  // Forms
  const loginForm = document.getElementById("loginForm")
  const registerForm = document.getElementById("registerForm")

  if (loginForm) loginForm.addEventListener("submit", handleLogin)
  if (registerForm) registerForm.addEventListener("submit", handleRegister)

  // Tag filters
  const tagFilters = document.querySelectorAll(".tag-filter")
  tagFilters.forEach((filter) => {
    filter.addEventListener("click", () => filterQuestions(filter.dataset.tag))
  })

  // Popular tags
  const popularTags = document.querySelectorAll(".popular-tag")
  popularTags.forEach((tag) => {
    tag.addEventListener("click", () => addTag(tag.dataset.tag))
  })

  // Question form
  const questionForm = document.getElementById("questionForm")
  if (questionForm) {
    questionForm.addEventListener("submit", handleQuestionSubmit)
    setupTagInput()
  }

  // Close modals when clicking outside
  window.addEventListener("click", (event) => {
    const modals = document.querySelectorAll(".modal")
    modals.forEach((modal) => {
      if (event.target === modal) {
        hideModal(modal)
      }
    })

    // Close notification dropdown when clicking outside
    const notificationDropdown = document.getElementById("notificationDropdown")
    if (notificationDropdown && notificationBell && !notificationBell.contains(event.target)) {
      notificationDropdown.classList.remove("show")
    }
  })

  // Search functionality
  const searchInput = document.getElementById("searchInput")
  const searchBtn = document.getElementById("searchBtn")

  if (searchInput) {
    searchInput.addEventListener("input", handleSearch)
    searchInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        event.preventDefault()
        handleSearch()
      }
    })
  }

  if (searchBtn) {
    searchBtn.addEventListener("click", handleSearch)
  }
}

function updateUI() {
  updateUserInterface()
  updateNotificationCount()

  // Load questions on home page
  if (document.getElementById("questionsList")) {
    displayQuestions()
  }
}

function updateUserInterface() {
  const loginBtn = document.getElementById("loginBtn")
  const registerBtn = document.getElementById("registerBtn")
  const userProfile = document.getElementById("userProfile")
  const userName = document.getElementById("userName")

  if (currentUser) {
    if (loginBtn) loginBtn.style.display = "none"
    if (registerBtn) registerBtn.style.display = "none"
    if (userProfile) userProfile.classList.remove("hidden")
    if (userName) userName.textContent = currentUser.name
  } else {
    if (loginBtn) loginBtn.style.display = "inline-block"
    if (registerBtn) registerBtn.style.display = "inline-block"
    if (userProfile) userProfile.classList.add("hidden")
  }
}

function updateNotificationCount() {
  const notificationCount = document.getElementById("notificationCount")
  if (notificationCount) {
    const unreadCount = notifications.filter((n) => !n.read).length
    notificationCount.textContent = unreadCount
    notificationCount.style.display = unreadCount > 0 ? "flex" : "none"
  }
}

// Authentication functions
function showLoginModal() {
  const modal = document.getElementById("loginModal")
  if (modal) modal.classList.add("show")
}

function showRegisterModal() {
  const modal = document.getElementById("registerModal")
  if (modal) modal.classList.add("show")
}

function hideModal(modal) {
  if (modal) modal.classList.remove("show")
}

function handleLogin(event) {
  event.preventDefault()
  const email = document.getElementById("loginEmail").value
  const password = document.getElementById("loginPassword").value

  // Simple mock authentication
  if (email && password) {
    currentUser = {
      id: "user_" + Date.now(),
      name: email.split("@")[0],
      email: email,
    }

    localStorage.setItem("currentUser", JSON.stringify(currentUser))
    hideModal(document.getElementById("loginModal"))
    updateUI()
    showNotification("Successfully logged in!", "success")

    // Clear form
    document.getElementById("loginEmail").value = ""
    document.getElementById("loginPassword").value = ""
  }
}

function handleRegister(event) {
  event.preventDefault()
  const name = document.getElementById("registerName").value
  const email = document.getElementById("registerEmail").value
  const password = document.getElementById("registerPassword").value

  if (name && email && password) {
    currentUser = {
      id: "user_" + Date.now(),
      name: name,
      email: email,
    }

    localStorage.setItem("currentUser", JSON.stringify(currentUser))
    hideModal(document.getElementById("registerModal"))
    updateUI()
    showNotification("Successfully registered and logged in!", "success")

    // Clear form
    document.getElementById("registerName").value = ""
    document.getElementById("registerEmail").value = ""
    document.getElementById("registerPassword").value = ""
  }
}

function logout() {
  currentUser = null
  localStorage.removeItem("currentUser")
  updateUI()
  showNotification("Successfully logged out!", "info")
}

// Notification functions
function toggleNotifications() {
  const dropdown = document.getElementById("notificationDropdown")
  if (dropdown) {
    dropdown.classList.toggle("show")
    if (dropdown.classList.contains("show")) {
      displayNotifications()
    }
  }
}

function displayNotifications() {
  const notificationList = document.getElementById("notificationList")
  if (!notificationList) return

  if (notifications.length === 0) {
    notificationList.innerHTML = '<div class="no-notifications">No new notifications</div>'
    return
  }

  notificationList.innerHTML = notifications
    .slice(0, 10)
    .map(
      (notification) => `
        <div class="notification-item ${notification.read ? "" : "unread"}" onclick="markNotificationAsRead('${notification.id}')">
            <div class="notification-content">
                ${notification.message}
            </div>
            <div class="notification-time">
                ${formatTimeAgo(notification.createdAt)}
            </div>
        </div>
    `,
    )
    .join("")
}

function addNotification(message, type = "info") {
  const notification = {
    id: "notif_" + Date.now(),
    message: message,
    type: type,
    read: false,
    createdAt: new Date().toISOString(),
  }

  notifications.unshift(notification)
  localStorage.setItem("notifications", JSON.stringify(notifications))
  updateNotificationCount()
}

function markNotificationAsRead(notificationId) {
  const notification = notifications.find((n) => n.id === notificationId)
  if (notification) {
    notification.read = true
    localStorage.setItem("notifications", JSON.stringify(notifications))
    updateNotificationCount()
  }
}

// Question functions
function displayQuestions(filteredQuestions = null) {
  const questionsList = document.getElementById("questionsList")
  if (!questionsList) return

  const questionsToShow = filteredQuestions || questions

  if (questionsToShow.length === 0) {
    questionsList.innerHTML = '<div class="no-questions">No questions found.</div>'
    return
  }

  questionsList.innerHTML = questionsToShow
    .map(
      (question) => `
        <div class="question-card" onclick="viewQuestion(${question.id})">
            <div class="question-header">
                <h3 class="question-title">${question.title}</h3>
                <div class="question-stats">
                    <div class="stat-item">
                        <span class="stat-number">${question.votes}</span>
                        <span>votes</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${question.answers}</span>
                        <span>answers</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${question.views}</span>
                        <span>views</span>
                    </div>
                </div>
            </div>
            <div class="question-description">
                ${question.description.substring(0, 200)}${question.description.length > 200 ? "..." : ""}
            </div>
            <div class="question-footer">
                <div class="question-tags">
                    ${question.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
                </div>
                <div class="question-meta">
                    asked ${formatTimeAgo(question.createdAt)} by 
                    <span class="question-author">${question.author}</span>
                </div>
            </div>
        </div>
    `,
    )
    .join("")
}

function filterQuestions(tag) {
  // Update active filter
  document.querySelectorAll(".tag-filter").forEach((filter) => {
    filter.classList.remove("active")
  })
  document.querySelector(`[data-tag="${tag}"]`).classList.add("active")

  // Clear search when filtering by tag
  const searchInput = document.getElementById("searchInput")
  if (searchInput) {
    searchInput.value = ""
  }
  currentSearchTerm = ""
  hideSearchResults()

  if (tag === "all") {
    displayQuestions()
  } else {
    const filtered = questions.filter((q) => q.tags.includes(tag))
    displayQuestions(filtered)
  }
}

function viewQuestion(questionId) {
  localStorage.setItem("currentQuestionId", questionId)
  window.location.href = "question-detail.html"
}

function handleQuestionSubmit(event) {
  event.preventDefault()

  if (!currentUser) {
    showNotification("Please log in to ask a question.", "error")
    return
  }

  const title = document.getElementById("questionTitle").value
  const description = document.getElementById("questionDescription").innerHTML
  const tags = Array.from(document.querySelectorAll(".selected-tag")).map((tag) =>
    tag.textContent.replace("×", "").trim(),
  )

  if (!title || !description || tags.length === 0) {
    showNotification("Please fill in all required fields.", "error")
    return
  }

  const newQuestion = {
    id: Date.now(),
    title: title,
    description: description,
    author: currentUser.name,
    authorId: currentUser.id,
    tags: tags,
    votes: 0,
    answers: 0,
    views: 0,
    createdAt: new Date().toISOString(),
    accepted: false,
  }

  questions.unshift(newQuestion)
  localStorage.setItem("questions", JSON.stringify(questions))

  showNotification("Question posted successfully!", "success")
  setTimeout(() => {
    window.location.href = "index.html"
  }, 1000)
}

// Tag input functions
function setupTagInput() {
  const tagInput = document.getElementById("tagInput")
  if (!tagInput) return

  tagInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault()
      const tag = this.value.trim().toLowerCase()
      if (tag) {
        addTag(tag)
        this.value = ""
      }
    }
  })
}

function addTag(tagName) {
  const selectedTags = document.getElementById("selectedTags")
  const tagInput = document.getElementById("tagInput")

  if (!selectedTags) return

  // Check if tag already exists
  const existingTags = Array.from(selectedTags.querySelectorAll(".selected-tag"))
  if (existingTags.some((tag) => tag.textContent.replace("×", "").trim() === tagName)) {
    return
  }

  // Limit to 5 tags
  if (existingTags.length >= 5) {
    showNotification("Maximum 5 tags allowed.", "warning")
    return
  }

  const tagElement = document.createElement("span")
  tagElement.className = "selected-tag"
  tagElement.innerHTML = `${tagName} <span class="remove-tag" onclick="removeTag(this)">×</span>`

  selectedTags.appendChild(tagElement)

  if (tagInput) tagInput.value = ""
}

function removeTag(element) {
  element.parentElement.remove()
}

// Utility functions
function formatTimeAgo(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)

  if (diffInSeconds < 60) {
    return "just now"
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} hour${hours > 1 ? "s" : ""} ago`
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} day${days > 1 ? "s" : ""} ago`
  } else {
    return date.toLocaleDateString()
  }
}

function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `

  // Add styles for notification
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border: 1px solid #dee2e6;
        border-radius: 8px;
        padding: 15px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 3000;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `

  document.body.appendChild(notification)

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove()
    }
  }, 5000)
}

function getNotificationIcon(type) {
  switch (type) {
    case "success":
      return "check-circle"
    case "error":
      return "exclamation-circle"
    case "warning":
      return "exclamation-triangle"
    default:
      return "info-circle"
  }
}

// Add CSS for notifications
const notificationStyles = document.createElement("style")
notificationStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification-close {
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        color: #6c757d;
        padding: 0;
        margin-left: 10px;
    }
    
    .notification-close:hover {
        color: #343a40;
    }
    
    .notification-success .notification-content i {
        color: #28a745;
    }
    
    .notification-error .notification-content i {
        color: #dc3545;
    }
    
    .notification-warning .notification-content i {
        color: #ffc107;
    }
    
    .notification-info .notification-content i {
        color: #17a2b8;
    }
`
document.head.appendChild(notificationStyles)

// Search functionality
let currentSearchTerm = ""

function handleSearch() {
  const searchInput = document.getElementById("searchInput")
  if (!searchInput) return

  const searchTerm = searchInput.value.trim().toLowerCase()
  currentSearchTerm = searchTerm

  if (searchTerm === "") {
    displayQuestions()
    hideSearchResults()
    return
  }

  const filteredQuestions = questions.filter((question) => {
    return (
      question.title.toLowerCase().includes(searchTerm) ||
      question.description.toLowerCase().includes(searchTerm) ||
      question.tags.some((tag) => tag.toLowerCase().includes(searchTerm)) ||
      question.author.toLowerCase().includes(searchTerm)
    )
  })

  displayQuestions(filteredQuestions)
  showSearchResults(searchTerm, filteredQuestions.length)
}

function showSearchResults(searchTerm, resultCount) {
  const questionsList = document.getElementById("questionsList")
  if (!questionsList) return

  // Remove existing search results info
  const existingSearchResults = document.querySelector(".search-results")
  if (existingSearchResults) {
    existingSearchResults.remove()
  }

  // Create search results info
  const searchResults = document.createElement("div")
  searchResults.className = "search-results"
  searchResults.innerHTML = `
    <div class="search-info">
      Found ${resultCount} result${resultCount !== 1 ? "s" : ""} for "${searchTerm}"
      <button class="clear-search" onclick="clearSearch()">Clear search</button>
    </div>
  `

  questionsList.parentNode.insertBefore(searchResults, questionsList)
}

function hideSearchResults() {
  const searchResults = document.querySelector(".search-results")
  if (searchResults) {
    searchResults.remove()
  }
}

function clearSearch() {
  const searchInput = document.getElementById("searchInput")
  if (searchInput) {
    searchInput.value = ""
  }
  currentSearchTerm = ""
  displayQuestions()
  hideSearchResults()

  // Reset active filter
  document.querySelectorAll(".tag-filter").forEach((filter) => {
    filter.classList.remove("active")
  })
  document.querySelector('[data-tag="all"]').classList.add("active")
}
