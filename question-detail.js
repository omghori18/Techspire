document.addEventListener("DOMContentLoaded", () => {
  loadQuestionDetail()
  setupAnswerForm()
})

let currentQuestion = null
let answers = []

function getCurrentUser() {
  const savedUser = localStorage.getItem("currentUser")
  return savedUser ? JSON.parse(savedUser) : null
}

function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `
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

function addNotification(message, type = "info") {
  const notification = {
    id: "notif_" + Date.now(),
    message: message,
    type: type,
    read: false,
    createdAt: new Date().toISOString(),
  }

  const savedNotifications = localStorage.getItem("notifications")
  const notifications = savedNotifications ? JSON.parse(savedNotifications) : []
  notifications.unshift(notification)
  localStorage.setItem("notifications", JSON.stringify(notifications))
}

function loadQuestionDetail() {
  const questionId = localStorage.getItem("currentQuestionId")
  if (!questionId) {
    window.location.href = "index.html"
    return
  }
  const savedQuestions = localStorage.getItem("questions")
  const questions = savedQuestions ? JSON.parse(savedQuestions) : []

  currentQuestion = questions.find((q) => q.id == questionId)
  if (!currentQuestion) {
    window.location.href = "index.html"
    return
  }
  currentQuestion.views++
  const questionIndex = questions.findIndex((q) => q.id === currentQuestion.id)
  if (questionIndex !== -1) {
    questions[questionIndex] = currentQuestion
    localStorage.setItem("questions", JSON.stringify(questions))
  }
  loadAnswers()
  displayQuestionDetail()
  displayAnswers()
}

function loadAnswers() {
  const savedAnswers = localStorage.getItem("answers")
  const allAnswers = savedAnswers ? JSON.parse(savedAnswers) : []
  answers = allAnswers.filter((a) => a.questionId == currentQuestion.id)

  if (answers.length === 0 && currentQuestion.id === 1) {
    answers = generateMockAnswers()
    const updatedAnswers = allAnswers.concat(answers)
    localStorage.setItem("answers", JSON.stringify(updatedAnswers))
  }
}

function generateMockAnswers() {
  const mockAnswers = []

  mockAnswers.push({
    id: 1,
    questionId: 1,
    content: `<p>You can center a div using Flexbox, which is the modern and most reliable method:</p>
                   <pre><code>.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}</code></pre>
                   <p>This will center the div both horizontally and vertically.</p>`,
    author: "css_expert",
    authorId: "user4",
    votes: 8,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    accepted: true,
  })

  mockAnswers.push({
    id: 2,
    questionId: 1,
    content: `<p>Another approach is using CSS Grid:</p>
                   <pre><code>.container {
  display: grid;
  place-items: center;
  height: 100vh;
}</code></pre>
                   <p>This is even more concise than Flexbox!</p>`,
    author: "grid_master",
    authorId: "user5",
    votes: 5,
    createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    accepted: false,
  })

  return mockAnswers
}

function displayQuestionDetail() {
  const questionDetail = document.getElementById("questionDetail")
  if (!questionDetail) return

  const currentUser = getCurrentUser()

  questionDetail.innerHTML = `
        <div class="question-detail-header">
            <h1 class="question-detail-title">${currentQuestion.title}</h1>
            <div class="question-detail-meta">
                <span>Asked ${formatTimeAgo(currentQuestion.createdAt)}</span>
                <span>Viewed ${currentQuestion.views} times</span>
                <span>Active today</span>
            </div>
        </div>
        
        <div class="question-detail-content">
            ${currentQuestion.description}
        </div>
        
        <div class="question-detail-footer">
            <div class="question-actions">
                <div class="vote-buttons">
                    <button class="vote-btn ${hasUserVoted(currentQuestion.id, "question", "up") ? "active" : ""}" onclick="voteQuestion('up')">
                        <i class="fas fa-chevron-up"></i>
                    </button>
                    <span class="vote-count">${currentQuestion.votes}</span>
                    <button class="vote-btn ${hasUserVoted(currentQuestion.id, "question", "down") ? "active" : ""}" onclick="voteQuestion('down')">
                        <i class="fas fa-chevron-down"></i>
                    </button>
                </div>
            </div>
            <div class="question-tags">
                ${currentQuestion.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
            </div>
            <div class="question-meta">
                asked by <span class="question-author">${currentQuestion.author}</span>
            </div>
        </div>
    `
}

function displayAnswers() {
  const answersList = document.getElementById("answersList")
  if (!answersList) return

  if (answers.length === 0) {
    answersList.innerHTML = '<p class="no-answers">No answers yet. Be the first to answer!</p>'
    return
  }
  const sortedAnswers = [...answers].sort((a, b) => {
    if (a.accepted && !b.accepted) return -1
    if (!a.accepted && b.accepted) return 1
    return b.votes - a.votes
  })

  answersList.innerHTML = sortedAnswers
    .map(
      (answer) => `
        <div class="answer-item ${answer.accepted ? "accepted-answer" : ""}">
            <div class="answer-header">
                <div class="answer-meta">
                    answered ${formatTimeAgo(answer.createdAt)} by 
                    <span class="question-author">${answer.author}</span>
                    ${answer.accepted ? '<span class="accepted-badge">✓ Accepted</span>' : ""}
                </div>
            </div>
            
            <div class="answer-content">
                ${answer.content}
            </div>
            
            <div class="answer-actions">
                <div class="vote-buttons">
                    <button class="vote-btn ${hasUserVoted(answer.id, "answer", "up") ? "active" : ""}" onclick="voteAnswer(${answer.id}, 'up')">
                        <i class="fas fa-chevron-up"></i>
                    </button>
                    <span class="vote-count">${answer.votes}</span>
                    <button class="vote-btn ${hasUserVoted(answer.id, "answer", "down") ? "active" : ""}" onclick="voteAnswer(${answer.id}, 'down')">
                        <i class="fas fa-chevron-down"></i>
                    </button>
                </div>
                ${
                  canAcceptAnswer(answer)
                    ? `
        <button class="accept-btn" onclick="acceptAnswer(${answer.id})">
            Accept Answer
        </button>
    `
                    : ""
                }
            </div>
        </div>
    `,
    )
    .join("")
}

function setupAnswerForm() {
  const submitAnswerBtn = document.getElementById("submitAnswer")
  if (submitAnswerBtn) {
    submitAnswerBtn.addEventListener("click", submitAnswer)
  }
}

function submitAnswer() {
  const currentUser = getCurrentUser()

  if (!currentUser) {
    showNotification("Please log in to post an answer.", "error")
    return
  }

  const answerContent = document.getElementById("answerContent")
  const content = answerContent.innerHTML.trim()

  if (!content || content === "<br>" || content === "<div><br></div>") {
    showNotification("Please write an answer before submitting.", "error")
    return
  }

  const newAnswer = {
    id: Date.now(),
    questionId: currentQuestion.id,
    content: content,
    author: currentUser.name,
    authorId: currentUser.id,
    votes: 0,
    createdAt: new Date().toISOString(),
    accepted: false,
  }
  answers.push(newAnswer)
  const savedAnswers = localStorage.getItem("answers")
  const allAnswers = savedAnswers ? JSON.parse(savedAnswers) : []
  allAnswers.push(newAnswer)
  localStorage.setItem("answers", JSON.stringify(allAnswers))

  currentQuestion.answers++
  const savedQuestions = localStorage.getItem("questions")
  const questions = savedQuestions ? JSON.parse(savedQuestions) : []
  const questionIndex = questions.findIndex((q) => q.id === currentQuestion.id)
  if (questionIndex !== -1) {
    questions[questionIndex] = currentQuestion
    localStorage.setItem("questions", JSON.stringify(questions))
  }

  answerContent.innerHTML = ""

  displayAnswers()

  if (currentQuestion.authorId !== currentUser.id) {
    addNotification(`${currentUser.name} answered your question: "${currentQuestion.title}"`)
  }

  showNotification("Answer posted successfully!", "success")
}

function voteQuestion(direction) {
  const currentUser = getCurrentUser()

  if (!currentUser) {
    showNotification("Please log in to vote.", "error")
    return
  }

  const previousVote = recordUserVote(currentQuestion.id, "question", direction)

  if (previousVote === "removed") {

    if (direction === "up") {
      currentQuestion.votes--
    } else {
      currentQuestion.votes++
    }
  } else if (previousVote === "new") {
  
    if (direction === "up") {
      currentQuestion.votes++
    } else {
      currentQuestion.votes--
    }
  } else {
    if (direction === "up") {
      currentQuestion.votes += 2
    } else {
      currentQuestion.votes -= 2
    }
  }

  const savedQuestions = localStorage.getItem("questions")
  const questions = savedQuestions ? JSON.parse(savedQuestions) : []
  const questionIndex = questions.findIndex((q) => q.id === currentQuestion.id)
  if (questionIndex !== -1) {
    questions[questionIndex] = currentQuestion
    localStorage.setItem("questions", JSON.stringify(questions))
  }

  displayQuestionDetail()
  showNotification(`Question ${direction}voted!`, "success")
}

function voteAnswer(answerId, direction) {
  const currentUser = getCurrentUser()

  if (!currentUser) {
    showNotification("Please log in to vote.", "error")
    return
  }

  const answer = answers.find((a) => a.id === answerId)
  if (!answer) return

  const previousVote = recordUserVote(answerId, "answer", direction)

  if (previousVote === "removed") {
    if (direction === "up") {
      answer.votes--
    } else {
      answer.votes++
    }
  } else if (previousVote === "new") {
 
    if (direction === "up") {
      answer.votes++
    } else {
      answer.votes--
    }
  } else {
    if (direction === "up") {
      answer.votes += 2
    } else {
      answer.votes -= 2
    }
  }

  const savedAnswers = localStorage.getItem("answers")
  const allAnswers = savedAnswers ? JSON.parse(savedAnswers) : []
  const answerIndex = allAnswers.findIndex((a) => a.id === answerId)
  if (answerIndex !== -1) {
    allAnswers[answerIndex] = answer
    localStorage.setItem("answers", JSON.stringify(allAnswers))
  }

  displayAnswers()
  showNotification(`Answer ${direction}voted!`, "success")
}

function acceptAnswer(answerId) {
  const currentUser = getCurrentUser()

  if (!currentUser || currentUser.id !== currentQuestion.authorId) {
    showNotification("Only the question author can accept answers.", "error")
    return
  }

  const alreadyAccepted = answers.find((a) => a.accepted)
  if (alreadyAccepted && alreadyAccepted.id !== answerId) {
    showNotification("You can only accept one answer per question.", "error")
    return
  }

  answers.forEach((answer) => {
    answer.accepted = false
  })

  const answer = answers.find((a) => a.id === answerId)
  if (answer) {
    answer.accepted = true
    currentQuestion.accepted = true

    const savedAnswers = localStorage.getItem("answers")
    const allAnswers = savedAnswers ? JSON.parse(savedAnswers) : []
    answers.forEach((updatedAnswer) => {
      const index = allAnswers.findIndex((a) => a.id === updatedAnswer.id)
      if (index !== -1) {
        allAnswers[index] = updatedAnswer
      }
    })
    localStorage.setItem("answers", JSON.stringify(allAnswers))

    const savedQuestions = localStorage.getItem("questions")
    const questions = savedQuestions ? JSON.parse(savedQuestions) : []
    const questionIndex = questions.findIndex((q) => q.id === currentQuestion.id)
    if (questionIndex !== -1) {
      questions[questionIndex] = currentQuestion
      localStorage.setItem("questions", JSON.stringify(questions))
    }
    if (answer.authorId !== currentUser.id) {
      addNotification(`Your answer to "${currentQuestion.title}" was accepted!`)
    }

    displayAnswers()
    showNotification("Answer accepted!", "success")
  }
}

function canAcceptAnswer(answer) {
  const currentUser = getCurrentUser()
  return (
    currentUser && currentUser.id === currentQuestion.authorId && !answer.accepted && !answers.some((a) => a.accepted)
  )
}

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

function hasUserVoted(itemId, itemType, voteType) {
  const currentUser = getCurrentUser()
  if (!currentUser) return false

  const votes = JSON.parse(localStorage.getItem("userVotes") || "{}")
  const userVotes = votes[currentUser.id] || {}
  const itemVotes = userVotes[`${itemType}_${itemId}`]

  return itemVotes === voteType
}

function recordUserVote(itemId, itemType, voteType) {
  const currentUser = getCurrentUser()
  if (!currentUser) return

  const votes = JSON.parse(localStorage.getItem("userVotes") || "{}")
  if (!votes[currentUser.id]) {
    votes[currentUser.id] = {}
  }

  const voteKey = `${itemType}_${itemId}`
  const previousVote = votes[currentUser.id][voteKey]

  if (previousVote === voteType) {
    delete votes[currentUser.id][voteKey]
    localStorage.setItem("userVotes", JSON.stringify(votes))
    return "removed"
  }

  votes[currentUser.id][voteKey] = voteType
  localStorage.setItem("userVotes", JSON.stringify(votes))
  return previousVote || "new"
}
