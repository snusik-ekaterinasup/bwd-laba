/** @format */

document.addEventListener('DOMContentLoaded', function () {
	const storageName = 'tasksData'
	let tasks = JSON.parse(localStorage.getItem(storageName)) || {
		upcoming: [],
		inProgress: [],
		completed: [],
	}

	const upcomingList = document.getElementById('upcomingList')
	const inProgressList = document.getElementById('inProgressList')
	const completedList = document.getElementById('completedList')
	const taskInput = document.getElementById('taskName')
	const taskDialog = document.getElementById('taskDialog')
	const taskStatusCheckbox = document.getElementById('taskStatus')

	// Сохранение задач в localStorage
	function saveTasks() {
		localStorage.setItem(storageName, JSON.stringify(tasks))
	}

	//  Function to get or create comment storage for a task
	function getTaskComments(taskText) {
		let comments =
			JSON.parse(localStorage.getItem(`comments-${taskText}`)) || []
		return comments
	}

	function saveTaskComments(taskText, comments) {
		localStorage.setItem(`comments-${taskText}`, JSON.stringify(comments))
	}

	// Создание элемента DOM для задачи
	function createTaskElement(taskText, status, checkboxChecked = false) {
		const listItem = document.createElement('li')
		listItem.className = 'tasks__item'

		const checkbox = document.createElement('input')
		checkbox.type = 'checkbox'
		checkbox.className = 'tasks__item-checkbox'
		checkbox.checked = checkboxChecked

		const span = document.createElement('span')
		span.className = 'tasks__item-text'
		span.textContent = taskText

		const deleteBtn = document.createElement('a')
		deleteBtn.href = 'javascript:void(0)'
		deleteBtn.className = 'tasks__item-close'
		deleteBtn.textContent = 'XX'

		const commentBtn = document.createElement('button')
		commentBtn.className = 'tasks__comment-button'
		commentBtn.textContent = 'Прокомментировать'

		const commentsContainer = document.createElement('div')
		commentsContainer.className = 'tasks__comments'
		listItem.appendChild(commentsContainer) // Add comments container

		// Добавление обработчика события для кнопки комментария
		commentBtn.addEventListener('click', function () {
			const comments = getTaskComments(taskText)
			let newComment = prompt(`Добавьте комментарий для задачи: ${taskText}`)
			if (newComment && newComment.trim() !== '') {
				comments.push(newComment)
				saveTaskComments(taskText, comments)
				renderComments(commentsContainer, comments) // Update comments display
			}
		})

		listItem.appendChild(checkbox)
		listItem.appendChild(span)
		listItem.appendChild(deleteBtn)
		listItem.appendChild(commentBtn)

		// Initial comment rendering
		renderComments(commentsContainer, getTaskComments(taskText))

		checkbox.addEventListener('change', function () {
			if (status === 'completed' && !checkbox.checked) {
				moveTask(taskText, status, 'inProgress', listItem)
			} else {
				moveTask(taskText, status, null, listItem)
			}
		})

		deleteBtn.addEventListener('click', function () {
			deleteTask(taskText, status)
		})

		return listItem
	}

	// Function to render comments
	function renderComments(container, comments) {
		container.innerHTML = '' // Clear existing comments
		comments.forEach((comment) => {
			const commentElement = document.createElement('p')
			commentElement.textContent = comment
			container.appendChild(commentElement)
		})
	}

	// Рендеринг списка задач
	function renderTasks() {
		upcomingList.innerHTML = ''
		inProgressList.innerHTML = ''
		completedList.innerHTML = ''

		tasks.upcoming.forEach((task) =>
			upcomingList.appendChild(createTaskElement(task, 'upcoming'))
		)
		tasks.inProgress.forEach((task) =>
			inProgressList.appendChild(createTaskElement(task, 'inProgress'))
		)
		tasks.completed.forEach((task) =>
			completedList.appendChild(createTaskElement(task, 'completed', true))
		)
	}

	// Добавление задачи
	function addTask(taskText, toCompleted = false) {
		if (!taskText.trim()) return

		if (toCompleted) {
			tasks.completed.push(taskText)
		} else {
			tasks.upcoming.push(taskText)
		}
		saveTasks()
		renderTasks()
		taskInput.value = ''
		taskStatusCheckbox.checked = false
		taskDialog.close()
	}

	// Удаление задачи
	function deleteTask(taskText, status) {
		tasks[status] = tasks[status].filter((task) => task !== taskText)
		localStorage.removeItem(`comments-${taskText}`) // Remove comments when task is deleted
		saveTasks()
		renderTasks()
	}

	// Перемещение задачи
	function moveTask(taskText, currentStatus, nextStatus = null, listItem) {
		const statusOrder = ['upcoming', 'inProgress', 'completed']

		if (!nextStatus) {
			const currentIndex = statusOrder.indexOf(currentStatus)
			const nextIndex = currentIndex + 1

			if (nextIndex < statusOrder.length) {
				nextStatus = statusOrder[nextIndex]
			}
		}

		if (nextStatus) {
			deleteTask(taskText, currentStatus)
			tasks[nextStatus].push(taskText)
			saveTasks()
			renderTasks()
		}
	}

	// Обработчик отправки формы
	document
		.querySelector('.tasks__form')
		.addEventListener('submit', function (e) {
			e.preventDefault()
			const toCompleted = taskStatusCheckbox.checked
			addTask(taskInput.value, toCompleted)
		})

	// Инициализация приложения
	renderTasks()
})
