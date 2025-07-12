document.addEventListener("DOMContentLoaded", () => {
  setupRichEditor()
})

function setupRichEditor() {
  const editorButtons = document.querySelectorAll(".editor-btn")
  const linkBtn = document.getElementById("linkBtn")
  const imageBtn = document.getElementById("imageBtn")
  const emojiBtn = document.getElementById("emojiBtn")

  editorButtons.forEach((button) => {
    const command = button.dataset.command
    if (command) {
      button.addEventListener("click", () => executeCommand(command))
    }
  })

  if (linkBtn) linkBtn.addEventListener("click", insertLink)
  if (imageBtn) imageBtn.addEventListener("click", insertImage)
  if (emojiBtn) emojiBtn.addEventListener("click", showEmojiPicker)

  setupEmojiPicker()

  const editorContents = document.querySelectorAll(".editor-content")
  editorContents.forEach((editor) => {
    editor.addEventListener("keydown", handleEditorKeydown)
    editor.addEventListener("paste", handlePaste)
  })
}

function executeCommand(command) {
  document.execCommand(command, false, null)
  updateToolbarState()
}

function updateToolbarState() {
  const editorButtons = document.querySelectorAll(".editor-btn[data-command]")
  editorButtons.forEach((button) => {
    const command = button.dataset.command
    if (document.queryCommandState(command)) {
      button.classList.add("active")
    } else {
      button.classList.remove("active")
    }
  })
}

function insertLink() {
  const url = prompt("Enter the URL:")
  if (url) {
    const text = window.getSelection().toString() || url
    document.execCommand("insertHTML", false, `<a href="${url}" target="_blank">${text}</a>`)
  }
}

function insertImage() {
  const input = document.createElement("input")
  input.type = "file"
  input.accept = "image/*"

  input.onchange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = `<img src="${e.target.result}" alt="Uploaded image" style="max-width: 100%; height: auto; margin: 10px 0;">`
        document.execCommand("insertHTML", false, img)
      }
      reader.readAsDataURL(file)
    }
  }

  input.click()
}

function showEmojiPicker() {
  const focusedEditor = document.querySelector(".editor-content:focus")
  if (focusedEditor) {
    window.lastActiveEditor = focusedEditor
  }

  const modal = document.getElementById("emojiModal")
  if (modal) {
    modal.classList.add("show")
  }
}

function setupEmojiPicker() {
  const emojiItems = document.querySelectorAll(".emoji-item")
  const closeEmoji = document.getElementById("closeEmoji")
  const emojiModal = document.getElementById("emojiModal")

  emojiItems.forEach((emoji) => {
    emoji.addEventListener("click", () => {
      const activeEditor =
        window.lastActiveEditor ||
        document.getElementById("questionDescription") ||
        document.getElementById("answerContent")

      if (activeEditor) {
        activeEditor.focus()
        const range = document.createRange()
        const selection = window.getSelection()

        range.selectNodeContents(activeEditor)
        range.collapse(false)
        selection.removeAllRanges()
        selection.addRange(range)

        document.execCommand("insertText", false, emoji.textContent)
      }

      if (emojiModal) emojiModal.classList.remove("show")
    })
  })

  if (closeEmoji && emojiModal) {
    closeEmoji.addEventListener("click", () => {
      emojiModal.classList.remove("show")
    })
  }
}

function handleEditorKeydown(event) {
  if (event.ctrlKey || event.metaKey) {
    switch (event.key) {
      case "b":
        event.preventDefault()
        executeCommand("bold")
        break
      case "i":
        event.preventDefault()
        executeCommand("italic")
        break
      case "u":
        event.preventDefault()
        executeCommand("underline")
        break
    }
  }

  setTimeout(updateToolbarState, 10)
}

function handlePaste(event) {
  event.preventDefault()

  const text = (event.clipboardData || window.clipboardData).getData("text/plain")

  document.execCommand("insertText", false, text)
}

function getEditorContent(editorId) {
  const editor = document.getElementById(editorId)
  return editor ? editor.innerHTML : ""
}

function setEditorContent(editorId, content) {
  const editor = document.getElementById(editorId)
  if (editor) {
    editor.innerHTML = content
  }
}
