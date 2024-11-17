/** @format */

const showModelBtn = document.querySelector('.todo__add')
const moduleDialog = document.getElementById('ModuleDialog')
const closeModuleDialog = document.getElementById('closeModuleDialog')

showModelBtn.addEventListener('click', () => {
	moduleDialog.showModal()
})

closeModuleDialog.addEventListener('click', () => {
	moduleDialog.close()
})

// Проверка, была ли кликнута область вне модального окна
moduleDialog.addEventListener('click', (event) => {
	if (event.target === moduleDialog) {
		moduleDialog.close()
	}
})