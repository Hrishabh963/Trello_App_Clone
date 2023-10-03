const API = {
    Key: '0648c8af87a39ea309cad118ba96315e',
    Secret: 'f2d93d5139d11f8cd096c64d3c32a56100036d569853385dabbac5328bdc94de',
    Token: 'ATTAa6a3ae4bd4fb3d5ec8982afc7ef2956b4f9f658800bb15abf6497519a174ba4d2E35F80C',
    BoardID: '6517ab992db0de3930ee493d'
}


const addList = async() => {
    try {
        const value = document.getElementById('list_content').value;
        // console.log(`https://api.trello.com/1/boards/${API.BoardID}/lists?name=${value}?key=${API.Key}&token=${API.Token}`);
        const response = await fetch(`https://api.trello.com/1/boards/${API.BoardID}/lists?key=${API.Key}&token=${API.Token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: value,
            }),
        })
        const data = await response.json();
        console.log(data);
        await displayList();

    } catch (error) {
        console.log(error);
    }
}

const updateList = async(event) => {
    const id = event.target.parentElement.parentElement.id;
    const value = document.getElementById('updated_value').value;
    const response = await fetch(`https://api.trello.com/1/lists/${id}?key=${API.Key}&token=${API.Token}`, {
        method: 'PUT',
        body: JSON.stringify({
            name: value
        }),
        headers: {
            'Content-Type': 'application/json',
        }
    })
    const data = await response.json();
    console.log(data);
    displayList();

}

const updateForm = async(event) => {
    const parent = event.target.parentElement;
    event.target.remove();
    const inputElement = document.createElement('input');
    Object.assign(inputElement, {
        type: 'text',
        id: 'updated_value',
        placeholder: 'Enter new name'
    });
    parent.appendChild(inputElement);
    const button = document.createElement('button');
    Object.assign(button, {
        type: 'button',
        id: 'update_button'
    });
    button.innerText = 'Update'
    parent.appendChild(button);
    button.addEventListener('click', updateList);
}

const deleteList = async(event) => {
    try {
        const parent = event.target.parentElement;
        const listId = parent.id;
        // console.log(`https://api.trello.com/1/lists/${listId}?key=${API.Key}&token=${API.Token}&closed=true`);
        const response = await fetch(`https://api.trello.com/1/lists/${listId}/closed?key=${API.Key}&token=${API.Token}&value=true`, { method: 'PUT' });
        const status = await response.json();
        console.log(status);
        displayList();

    } catch (error) {
        console.log(error);
    }
}
const displayList = async() => {
    try {
        const response = await fetch(`https://api.trello.com/1/boards/${API.BoardID}/lists?key=${API.Key}&token=${API.Token}`)
        const data = await response.json();
        const parentDiv = document.querySelector('#list');
        parentDiv.innerHTML = `<div class="list_container add_container">
        <div class="add-list-icon" id="toggleList">
             <i class="fas fa-plus"></i>
        </div>
        <div class="add-list-form" id="listForm">
            <input type="text" name="list_content" placeholder="Enter List Name" id="list_content">
            <button type="button" id="add_list">Add list</button>
        </div>
    </div>
    `;
        data.forEach(list => {
            const div = document.createElement('div');
            div.className = 'list_container'
            div.id = list.id;
            div.innerHTML = `
        <p class='list_item'> ${list.name}</p>
        <div class='update_button_container'>
        <button type='button' onclick = 'updateForm(event)'>Update</button>
        </div>
        <button type='button' onclick = 'deleteList(event)' class='delete_button'>Delete</button>
        `
            parentDiv.appendChild(div);
        });
        const button = document.getElementById('add_list');
        button.addEventListener('click', addList);

        const toggleList = document.getElementById('toggleList');
        const listForm = document.getElementById('listForm');
        const icon = document.querySelector('.fas.fa-plus');

        toggleList.addEventListener('click', () => {
            if (listForm.style.display === 'none' || listForm.style.display === '') {
                listForm.style.display = 'block';
                icon.classList.remove('fa-plus');
                icon.classList.add('fa-times', 'rotate-plus-to-cross');
            } else {
                listForm.style.display = 'none';
                icon.classList.remove('fa-times', 'rotate-plus-to-cross');
                icon.classList.add('fa-plus');
            }
        });

    } catch (error) {
        console.log(error);
    }
}

displayList();