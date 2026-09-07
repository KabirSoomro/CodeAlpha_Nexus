// I am declaring a variable to store the currently active project ID.
let activeProjectId = null;
// I am declaring a variable to store all tasks in the current project for search filtering.
let currentTasks = [];

// I am defining an asynchronous function to fetch and display the user's projects.
async function fetchProjects() {
    // I am starting a try-catch block for the network request.
    try {
        // I am making a GET request to the projects endpoint.
        const response = await fetch(`${API_BASE_URL}/projects`, {
            // I am including the JWT token in the Authorization header.
            headers: { 'Authorization': `Bearer ${getToken()}` }
        // I am closing the fetch call.
        });
        
        // I am checking if the response is successful.
        if (response.ok) {
            // I am parsing the JSON array of projects.
            const projects = await response.json();
            // I am getting the project list element from the DOM.
            const projectList = document.getElementById('project-list');
            // I am clearing any existing content in the project list.
            projectList.innerHTML = '';
            
            // I am iterating over each project in the array.
            projects.forEach(project => {
                // I am creating a new list item element for the project.
                const li = document.createElement('li');
                // I am adding a class to the list item.
                li.className = 'project-item';
                
                // I am creating a span for the project name.
                const span = document.createElement('span');
                // I am setting the text content to the project name.
                span.textContent = project.name;
                // I am appending the span to the list item.
                li.appendChild(span);

                // I am creating a delete button for the project.
                const delBtn = document.createElement('button');
                // I am setting the class for the delete button.
                delBtn.className = 'delete-project-btn';
                // I am setting the inner HTML to a trash icon.
                delBtn.innerHTML = '<i class="fa-solid fa-trash-alt"></i>';
                
                // I am adding a click event listener to the delete button.
                delBtn.addEventListener('click', async (e) => {
                    // I am stopping the click from bubbling up to the project item.
                    e.stopPropagation();
                    // I am asking for confirmation before deleting.
                    if (confirm(`Are you sure you want to delete the workspace "${project.name}"?`)) {
                        // I am calling the deleteProject function.
                        await deleteProject(project._id);
                    // I am closing the if statement.
                    }
                // I am closing the event listener.
                });

                // I am appending the delete button to the list item.
                li.appendChild(delBtn);

                // I am adding a click event listener to select the project.
                li.addEventListener('click', () => {
                    // I am removing the active class from all project items.
                    document.querySelectorAll('.project-item').forEach(item => item.classList.remove('active'));
                    // I am adding the active class to the clicked item.
                    li.classList.add('active');
                    // I am calling the selectProject function with the project ID and name.
                    selectProject(project._id, project.name);
                // I am closing the click listener.
                });
                // I am appending the list item to the project list.
                projectList.appendChild(li);
            // I am closing the forEach loop.
            });
        // I am closing the if statement.
        }
    // I am catching any errors during the fetch.
    } catch (error) {
        // I am logging the error to the console.
        console.error('Error fetching projects:', error);
    // I am closing the try-catch block.
    }
// I am closing the fetchProjects function.
}

// I am defining a function to delete a project.
async function deleteProject(projectId) {
    // I am starting a try-catch block.
    try {
        // I am making a DELETE request.
        const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
            // I am setting the method to DELETE.
            method: 'DELETE',
            // I am sending the auth token.
            headers: { 'Authorization': `Bearer ${getToken()}` }
        // I am closing the fetch call.
        });
        
        // I am checking if successful.
        if (response.ok) {
            // I am checking if the deleted project was the active one.
            if (activeProjectId === projectId) {
                // I am resetting the active project.
                activeProjectId = null;
                // I am hiding the board area.
                document.getElementById('kanban-board').style.display = 'none';
                // I am updating the header.
                document.getElementById('active-project-title').textContent = 'Select a Workspace';
                // I am hiding the add task button.
                document.getElementById('add-task-btn').style.display = 'none';
            // I am closing the if statement.
            }
            // I am re-fetching the projects.
            fetchProjects();
        // I am closing the if statement.
        }
    // I am catching errors.
    } catch (error) {
        // I am logging the error.
        console.error('Error deleting project', error);
    // I am closing the try-catch block.
    }
// I am closing the deleteProject function.
}

// I am defining a function to handle selecting a project from the sidebar.
function selectProject(projectId, projectName) {
    // I am updating the active project ID variable.
    activeProjectId = projectId;
    // I am updating the board header to show the selected project's name.
    document.getElementById('active-project-title').textContent = projectName;
    // I am displaying the kanban board container.
    document.getElementById('kanban-board').style.display = 'flex';
    // I am displaying the add task button.
    document.getElementById('add-task-btn').style.display = 'block';
    
    // I am joining the specific Socket.io room for this project.
    joinProjectRoom(projectId);
    // I am fetching the tasks for the selected project.
    fetchTasks(projectId);
// I am closing the selectProject function.
}

// I am defining an asynchronous function to fetch tasks for a project.
async function fetchTasks(projectId) {
    // I am starting a try-catch block for the network request.
    try {
        // I am making a GET request to the tasks endpoint for the specific project.
        const response = await fetch(`${API_BASE_URL}/tasks/project/${projectId}`, {
            // I am including the JWT token for authorization.
            headers: { 'Authorization': `Bearer ${getToken()}` }
        // I am closing the fetch call.
        });
        
        // I am checking if the response is successful.
        if (response.ok) {
            // I am parsing the JSON array of tasks.
            const tasks = await response.json();
            // I am storing tasks in the global array for search filtering.
            currentTasks = tasks;
            // I am calling the renderTasks function to update the UI.
            renderTasks(tasks);
        // I am closing the if statement.
        }
    // I am catching any errors during the fetch.
    } catch (error) {
        // I am logging the error to the console.
        console.error('Error fetching tasks:', error);
    // I am closing the try-catch block.
    }
// I am closing the fetchTasks function.
}

// I am defining a function to clear the Kanban columns and render the tasks.
function renderTasks(tasksToRender) {
    // I am clearing the To-Do list container.
    document.getElementById('list-todo').innerHTML = '';
    // I am clearing the In Progress list container.
    document.getElementById('list-in-progress').innerHTML = '';
    // I am clearing the Done list container.
    document.getElementById('list-done').innerHTML = '';
    
    // I am iterating over each task.
    tasksToRender.forEach(task => {
        // I am calling the createTaskCard function to generate the DOM element.
        const taskCard = createTaskCard(task);
        // I am finding the appropriate column based on the task's status.
        let targetListId;
        // I am checking if the status is 'To-Do'.
        if (task.status === 'To-Do') targetListId = 'list-todo';
        // I am checking if the status is 'In Progress'.
        else if (task.status === 'In Progress') targetListId = 'list-in-progress';
        // I am checking if the status is 'Done'.
        else if (task.status === 'Done') targetListId = 'list-done';
        
        // I am appending the task card to the appropriate column.
        if (targetListId) {
            // I am appending the child element.
            document.getElementById(targetListId).appendChild(taskCard);
        // I am closing the if statement.
        }
    // I am closing the forEach loop.
    });
// I am closing the renderTasks function.
}

// I am defining a function to create a DOM element for a task card.
function createTaskCard(task) {
    // I am creating a new division element for the card.
    const card = document.createElement('div');
    // I am adding the 'task-card' class for styling.
    card.classList.add('task-card', 'task');
    // I am making the card draggable for drag-and-drop functionality.
    card.setAttribute('draggable', 'true');
    // I am storing the task ID as a data attribute on the card.
    card.dataset.id = task._id;
    // I am storing the current status as a data attribute.
    card.dataset.status = task.status;
    
    // I am creating a wrapper for the content.
    const contentWrapper = document.createElement('div');
    // I am assigning the class.
    contentWrapper.className = 'task-content-wrapper';

    // I am creating the priority badge.
    const badge = document.createElement('span');
    // I am mapping priority to CSS classes.
    const priorityClass = task.priority ? `priority-${task.priority.toLowerCase()}` : 'priority-medium';
    // I am assigning classes to the badge.
    badge.className = `priority-badge ${priorityClass}`;
    // I am setting the badge text.
    badge.textContent = task.priority || 'Medium';
    // I am appending the badge.
    contentWrapper.appendChild(badge);
    
    // I am creating an h4 element for the task title.
    const title = document.createElement('h4');
    // I am setting the title text.
    title.textContent = task.title;
    // I am appending the title to the wrapper.
    contentWrapper.appendChild(title);
    
    // I am checking if there is a due date.
    if (task.dueDate) {
        // I am creating a span for the due date.
        const dueBadge = document.createElement('span');
        // I am formatting the date.
        const dateObj = new Date(task.dueDate);
        // I am adding styling.
        dueBadge.style.fontSize = '0.7rem';
        dueBadge.style.color = '#ef476f';
        dueBadge.style.marginLeft = '10px';
        dueBadge.innerHTML = `<i class="fa-regular fa-clock"></i> ${dateObj.toLocaleDateString()}`;
        // I am appending to the wrapper.
        contentWrapper.appendChild(dueBadge);
    }
    
    // I am appending the wrapper to the card.
    card.appendChild(contentWrapper);

    // I am creating the delete task button.
    const delBtn = document.createElement('button');
    // I am setting the class.
    delBtn.className = 'delete-task-btn';
    // I am setting the inner HTML icon.
    delBtn.innerHTML = '<i class="fa-solid fa-trash-alt"></i>';
    // I am adding a click event to delete the task.
    delBtn.addEventListener('click', async (e) => {
        // I am stopping event bubbling so it doesn't trigger modal.
        e.stopPropagation();
        // I am checking confirmation.
        if (confirm('Delete this task?')) {
            // I am making the DELETE request.
            const response = await fetch(`${API_BASE_URL}/tasks/${task._id}`, {
                // I am setting method.
                method: 'DELETE',
                // I am setting headers.
                headers: { 'Authorization': `Bearer ${getToken()}` }
            // I am closing fetch.
            });
            // I am checking if successful.
            if (response.ok) {
                // I am removing the card from the DOM.
                card.remove();
                // I am removing it from the currentTasks array.
                currentTasks = currentTasks.filter(t => t._id !== task._id);
            // I am closing if statement.
            }
        // I am closing confirmation if.
        }
    // I am closing event listener.
    });
    // I am appending delete button.
    card.appendChild(delBtn);

    // I am adding a click event to open the task details modal.
    card.addEventListener('click', () => {
        // I am populating the modal title.
        document.getElementById('details-title').textContent = task.title;
        // I am populating the modal description.
        document.getElementById('details-desc').textContent = task.description || 'No description provided.';
        // I am populating the date.
        document.getElementById('details-date').textContent = `Created: ${new Date(task.createdAt).toLocaleString()}`;
        // I am populating the due date.
        document.getElementById('details-due').textContent = task.dueDate ? `Due: ${new Date(task.dueDate).toLocaleDateString()}` : 'No due date set.';
        
        // I am storing the current task data on the edit button for later use.
        const editBtn = document.getElementById('edit-task-btn');
        editBtn.onclick = () => {
            // I am hiding details modal and showing edit modal.
            document.getElementById('task-details-modal').style.display = 'none';
            document.getElementById('edit-task-modal').style.display = 'flex';
            // I am pre-filling the edit form.
            document.getElementById('edit-task-id').value = task._id;
            document.getElementById('edit-task-title').value = task.title;
            document.getElementById('edit-task-desc').value = task.description || '';
            const editPrioritySelect = document.getElementById('edit-task-priority');
            editPrioritySelect.value = task.priority || 'Medium';
            // Trigger color update manually since value changed programmatically
            editPrioritySelect.dispatchEvent(new Event('change'));
            // I am formatting the date for the input (YYYY-MM-DD).
            if (task.dueDate) {
                document.getElementById('edit-task-due-date').value = new Date(task.dueDate).toISOString().split('T')[0];
            } else {
                document.getElementById('edit-task-due-date').value = '';
            }
        };
        
        // I am updating the modal priority badge.
        const modalBadge = document.getElementById('details-priority-badge');
        // I am setting the text.
        modalBadge.textContent = task.priority || 'Medium';
        // I am setting the classes.
        modalBadge.className = `priority-badge ${priorityClass}`;
        
        // I am showing the modal.
        document.getElementById('task-details-modal').style.display = 'flex';
    // I am closing the click listener.
    });
    
    // I am adding a dragstart event listener to handle dragging.
    card.addEventListener('dragstart', (e) => {
        // I am adding a 'dragging' class for visual feedback.
        card.classList.add('dragging');
        // I am setting the task ID in the dataTransfer object.
        e.dataTransfer.setData('text/plain', task._id);
    // I am closing the dragstart listener.
    });
    
    // I am adding a dragend event listener to handle dropping.
    card.addEventListener('dragend', () => {
        // I am removing the 'dragging' class when the drag ends.
        card.classList.remove('dragging');
    // I am closing the dragend listener.
    });
    
    // I am returning the constructed card element.
    return card;
// I am closing the createTaskCard function.
}

// I am defining a function to setup drag-and-drop drop zones on the columns.
function setupDragAndDrop() {
    // I am selecting all column elements.
    const columns = document.querySelectorAll('.column');
    
    // I am iterating over each column.
    columns.forEach(column => {
        // I am adding a dragover event listener to allow dropping.
        column.addEventListener('dragover', (e) => {
            // I am preventing the default behavior to enable drop.
            e.preventDefault();
            // I am adding the hover effect class.
            column.classList.add('drag-over');
        // I am closing the dragover listener.
        });

        // I am adding a dragleave event listener to remove hover effect.
        column.addEventListener('dragleave', () => {
            // I am removing the class.
            column.classList.remove('drag-over');
        // I am closing the dragleave listener.
        });
        
        // I am adding a drop event listener to handle when a card is dropped.
        column.addEventListener('drop', async (e) => {
            // I am preventing default behavior.
            e.preventDefault();
            // I am removing the hover effect class.
            column.classList.remove('drag-over');
            
            // I am extracting the task ID from the dataTransfer object.
            const taskId = e.dataTransfer.getData('text/plain');
            // I am getting the new status from the column's data attribute.
            const newStatus = column.dataset.status;
            // I am getting the element of the dragged task card.
            const taskCard = document.querySelector(`.task-card[data-id="${taskId}"]`);
            
            // I am checking if the task card exists and the status actually changed.
            if (taskCard && taskCard.dataset.status !== newStatus) {
                // I am finding the inner task-list container of the column.
                const taskList = column.querySelector('.task-list');
                // I am appending the task card to the new column in the UI.
                taskList.appendChild(taskCard);
                // I am updating the status data attribute on the card.
                taskCard.dataset.status = newStatus;
                
                // I am updating the currentTasks array in memory.
                const taskObj = currentTasks.find(t => t._id === taskId);
                // I am checking if task exists in memory.
                if (taskObj) taskObj.status = newStatus;
                
                // I am calling a function to update the backend.
                updateTaskStatusInDB(taskId, newStatus);
                // I am emitting a socket event so other clients see the move.
                emitTaskMoved(activeProjectId, taskId, newStatus);
            // I am closing the if statement.
            }
        // I am closing the drop listener.
        });
    // I am closing the forEach loop.
    });
// I am closing the setupDragAndDrop function.
}

// I am defining an asynchronous function to update the task status in the database.
async function updateTaskStatusInDB(taskId, newStatus) {
    // I am starting a try-catch block for the network request.
    try {
        // I am making a PUT request to update the task status.
        await fetch(`${API_BASE_URL}/tasks/${taskId}/status`, {
            // I am setting the method to PUT.
            method: 'PUT',
            // I am setting headers for JSON and Authorization.
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            // I am stringifying the payload containing the new status.
            body: JSON.stringify({ status: newStatus })
        // I am closing the fetch call.
        });
    // I am catching any errors during the update.
    } catch (error) {
        // I am logging the error to the console.
        console.error('Error updating task status:', error);
    // I am closing the try-catch block.
    }
// I am closing the updateTaskStatusInDB function.
}

// I am defining a global function to be called by socket-client.js when another user moves a task.
window.moveTaskCardInUI = function(taskId, newStatus) {
    // I am finding the task card element by its ID.
    const taskCard = document.querySelector(`.task-card[data-id="${taskId}"]`);
    // I am determining the target list ID based on the new status.
    let targetListId;
    if (newStatus === 'To-Do') targetListId = 'list-todo';
    else if (newStatus === 'In Progress') targetListId = 'list-in-progress';
    else if (newStatus === 'Done') targetListId = 'list-done';
    
    // I am checking if the task card and target list exist.
    if (taskCard && targetListId) {
        // I am finding the target list element.
        const targetList = document.getElementById(targetListId);
        // I am appending the card to the new list, visually moving it.
        targetList.appendChild(taskCard);
        // I am updating the status data attribute on the card.
        taskCard.dataset.status = newStatus;
    // I am closing the if statement.
    }
// I am closing the moveTaskCardInUI function.
};

// I am setting up an event listener for when the DOM is fully loaded.
document.addEventListener('DOMContentLoaded', () => {
    // I am checking if the project list element exists (i.e., we are on the dashboard).
    if (document.getElementById('project-list')) {
        // I am fetching the projects to populate the sidebar.
        fetchProjects();
        // I am setting up the drag-and-drop event listeners.
        setupDragAndDrop();
        
        // --- Search Functionality ---
        // I am getting the search input.
        const searchInput = document.getElementById('task-search');
        // I am listening for input events.
        searchInput.addEventListener('input', (e) => {
            // I am converting the search query to lowercase.
            const query = e.target.value.toLowerCase();
            // I am filtering the tasks array.
            const filteredTasks = currentTasks.filter(task => 
                // I am checking if the title contains the query.
                task.title.toLowerCase().includes(query)
            );
            // I am rendering only the filtered tasks.
            renderTasks(filteredTasks);
        // I am closing the event listener.
        });

        // --- Create Project Logic ---
        // I am getting the create project button.
        const createProjectBtn = document.getElementById('create-project-btn');
        // I am adding a click event listener to create a new project.
        createProjectBtn.addEventListener('click', async () => {
            // I am extracting the project name from the input field.
            const name = document.getElementById('new-project-name').value;
            // I am checking if a name was provided.
            if (name) {
                // I am starting a try-catch block.
                try {
                    // I am making a POST request to create the project.
                    const response = await fetch(`${API_BASE_URL}/projects`, {
                        // I am setting the method to POST.
                        method: 'POST',
                        // I am setting the headers.
                        headers: { 
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${getToken()}`
                        },
                        // I am stringifying the payload.
                        body: JSON.stringify({ name, description: 'Workspace' })
                    // I am closing the fetch call.
                    });
                    
                    // I am checking if successful.
                    if (response.ok) {
                        // I am clearing the input field.
                        document.getElementById('new-project-name').value = '';
                        // I am re-fetching the projects to update the sidebar.
                        fetchProjects();
                    // I am closing the if statement.
                    }
                // I am catching any errors.
                } catch (error) {
                    // I am logging the error.
                    console.error('Error creating project', error);
                // I am closing the try-catch block.
                }
            // I am closing the if statement.
            }
        // I am closing the click listener.
        });
        
        // --- Modal Logic ---
        // I am getting the task modal element.
        const taskModal = document.getElementById('create-task-modal');
        // I am getting the details modal element.
        const detailsModal = document.getElementById('task-details-modal');
        // I am getting the add task button.
        const addTaskBtn = document.getElementById('add-task-btn');
        
        // I am showing the modal when add task is clicked.
        addTaskBtn.addEventListener('click', () => {
            // I am checking if a project is active.
            if (activeProjectId) {
                // I am showing the modal.
                taskModal.style.display = 'flex';
            // I am closing the if statement.
            }
        // I am closing the listener.
        });
        
        // I am setting up the close button for task modal.
        document.querySelector('.close-modal-btn').addEventListener('click', () => {
            // I am hiding the modal.
            taskModal.style.display = 'none';
        // I am closing the listener.
        });
        
        // I am setting up the close button for details modal.
        document.querySelector('.close-details-btn').addEventListener('click', () => {
            // I am hiding the details modal.
            detailsModal.style.display = 'none';
        // I am closing the listener.
        });

        // I am setting up the close button for edit modal.
        document.querySelector('.close-edit-btn').addEventListener('click', () => {
            // I am hiding the edit modal.
            document.getElementById('edit-task-modal').style.display = 'none';
        });

        // I am handling task form submission.
        const createTaskForm = document.getElementById('create-task-form');
        // I am listening for the submit event.
        createTaskForm.addEventListener('submit', async (e) => {
            // I am preventing page reload.
            e.preventDefault();
            // I am getting values.
            const title = document.getElementById('task-title').value;
            const description = document.getElementById('task-desc').value;
            const priority = document.getElementById('task-priority').value;
            const dueDate = document.getElementById('task-due-date').value;
            
            // I am starting try-catch block.
            try {
                // I am making POST request.
                const response = await fetch(`${API_BASE_URL}/tasks`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getToken()}`
                    },
                    body: JSON.stringify({ projectId: activeProjectId, title, description, priority, dueDate: dueDate || null })
                });
                
                // I am checking if successful.
                if (response.ok) {
                    // I am hiding the modal.
                    taskModal.style.display = 'none';
                    // I am resetting the form.
                    createTaskForm.reset();
                    // I am updating the select color back to default.
                    document.getElementById('task-priority').dispatchEvent(new Event('change'));
                    // I am fetching tasks again to update board.
                    fetchTasks(activeProjectId);
                }
            // I am catching errors.
            } catch (error) {
                // I am logging the error.
                console.error('Error creating task', error);
            // I am closing try-catch.
            }
        // I am closing submit listener.
        });

        // I am handling edit task form submission.
        const editTaskForm = document.getElementById('edit-task-form');
        editTaskForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('edit-task-id').value;
            const title = document.getElementById('edit-task-title').value;
            const description = document.getElementById('edit-task-desc').value;
            const priority = document.getElementById('edit-task-priority').value;
            const dueDate = document.getElementById('edit-task-due-date').value;

            try {
                const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getToken()}`
                    },
                    body: JSON.stringify({ title, description, priority, dueDate: dueDate || null })
                });

                if (response.ok) {
                    document.getElementById('edit-task-modal').style.display = 'none';
                    fetchTasks(activeProjectId);
                }
            } catch (error) {
                console.error('Error editing task', error);
            }
        });

        // I am handling the Clear Done button.
        const clearDoneBtn = document.getElementById('clear-done-btn');
        if (clearDoneBtn) {
            clearDoneBtn.addEventListener('click', async () => {
                if (!activeProjectId) return;
                
                if (confirm('Are you sure you want to permanently delete all completed tasks?')) {
                    try {
                        const response = await fetch(`${API_BASE_URL}/tasks/project/${activeProjectId}/done`, {
                            method: 'DELETE',
                            headers: { 'Authorization': `Bearer ${getToken()}` }
                        });
                        
                        if (response.ok) {
                            fetchTasks(activeProjectId);
                        }
                    } catch (error) {
                        console.error('Error clearing tasks:', error);
                    }
                }
            });
        }

        // I am setting up dynamic color styling for priority selects.
        const updateSelectColor = (selectEl) => {
            if (selectEl.value === 'High') {
                selectEl.style.color = '#ef476f';
            } else if (selectEl.value === 'Medium') {
                selectEl.style.color = '#ffd166';
            } else if (selectEl.value === 'Low') {
                selectEl.style.color = '#118ab2';
            }
        };

        const createPrioritySelect = document.getElementById('task-priority');
        if (createPrioritySelect) {
            updateSelectColor(createPrioritySelect); // Initial color
            createPrioritySelect.addEventListener('change', (e) => updateSelectColor(e.target));
        }

        const editPrioritySelect = document.getElementById('edit-task-priority');
        if (editPrioritySelect) {
            updateSelectColor(editPrioritySelect); // Initial color
            editPrioritySelect.addEventListener('change', (e) => updateSelectColor(e.target));
        }

    // I am closing the if statement.
    }
// I am closing the DOMContentLoaded listener.
});
