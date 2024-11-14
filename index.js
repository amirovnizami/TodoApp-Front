
const registerEmail = document.getElementById("registerEmail")
const registerName = document.getElementById("registerName")
const registerPass = document.getElementById("registerPass")

const loginEmail = document.getElementById("loginEmail")
const loginPass = document.getElementById("loginPass")

const btnLogin = document.getElementById("loginBtn")
const btnRegister = document.getElementById("registerBtn")

const todoInput = document.getElementById("todoInput")
const containerTodo = document.getElementById("containerTodo")
const addBtn = document.getElementById("addBtn")

const deleteButon = document.getElementsByClassName("iconDel")
let accessToken = null;
let isEditMode = false;
let isEditButton = false
if (addBtn) {
    addBtn.addEventListener("click", async () => {
        const inputValue = todoInput.value.trim();
        todoInput.value = " "
        if (!isEditMode) {
            await createTodoItems(inputValue);
        } else {
            await editTodo(editTodoId, inputValue);
        }
        location.reload()
    });
}
if (btnLogin) {
    btnLogin.addEventListener("click", () => {
        const email = loginEmail.value;
        const pass = loginPass.value;
        Login(email, pass);
    });
}

if (btnRegister) {
    btnRegister.addEventListener("click", () => {
        const name = registerName.value;
        const email = registerEmail.value;
        const pass = registerPass.value;
        Register(name, email, pass);
    });
}



async function createTodoItems (todo)  {
    const accessToken = localStorage.getItem('accessToken');
    const response = await fetch("http://localhost:5001/api/todos/", {
        method: "POST",
        body: JSON.stringify({
            title: todo
        }),
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": 'application/json'
        }
    })

    const data = await response.json()
    // console.log(data)
    addTodoToUi(todo, accessToken)
}


async function addTodoToUi (value, id) {

    const tagP = document.createElement("p")
    const deleteBtn = document.createElement("a")
    const editBtn = document.createElement("a")
    const divIcon = document.createElement("div")

    editBtn.innerHTML = "<img src = \'images/edit.png\'>"
    deleteBtn.innerHTML = "<img src=\'images/delete.png\'>";
    editBtn.classList.add("iconEdit")
    deleteBtn.classList.add("iconDel")

    divIcon.appendChild(editBtn)
    divIcon.appendChild(deleteBtn)
    const div = document.createElement("div")
    tagP.innerText = value
    tagP.classList.add("todoCard")
    tagP.appendChild(divIcon)
    div.appendChild(tagP)
    containerTodo.appendChild(div)
    editBtn.addEventListener("click", () => {
        todoInput.value = value;
        addBtn.innerText = "Edit";
        isEditMode = true;
        editTodoId = id;
    });

    deleteBtn.addEventListener("click", async () => {

        await deleteTodo(id)
        div.remove()
    });
}

async function Login  (email, pass) {
    const response = await fetch("http://localhost:5001/users/login", {
        method: "POST",
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: pass
        })
    })

    if (response.ok) {
        alert("Successfuly login!")
        const data = await response.json()
        accessToken = data.token;
        localStorage.setItem('accessToken', accessToken)
        console.log("Access token saved")
        window.location.href = "todos.html"

    }
    else {
        alert("Invalid email address or password!")
    }


}

 async function Register (name, email, pass)  {
    const response = await fetch("http://localhost:5001/users/register", {
        method: "POST",
        body: JSON.stringify({
            username: name,
            email: email,
            password: pass
        }),
        headers: {
            "Content-Type": 'application/json'
        }
    })

    if (!response.ok) {
        alert("Occured an error.Try again later!")
    }
    else {
        alert("Registration is successfuly!")


    }

}

async function getTodos() {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        console.log("Access token not found, please login.");
        return;
    }

    const response = await fetch("http://localhost:5001/todos/", {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });

    if (response.ok) {
        const data = await response.json();
        // console.log("Todos:", data);

        data.map(item => {
            addTodoToUi(item.title, item._id)
        })
        return data
    }
    else {
        console.log("Failed to fetch todos.");
    }
}
async function deleteTodo(id) {

    const token = localStorage.getItem('accessToken');
    const response = await fetch(`http://localhost:5001/todos/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    const data = response.json()
    console.log(data);
}

async function editTodo(id, value) {

    const token = localStorage.getItem('accessToken')
    const response = await fetch(`http://localhost:5001/todos/${id}`,
        {
            method: "PUT",
            body: JSON.stringify({
                title: value
            }),
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": 'application/json'
            }
        }

    )
    if (response.ok) {
        const updatedTodo = await response.json();
        console.log("Todo successfuly updated")

        return updatedTodo.title;
    } else {
        console.log("Failed to edit todo");
        return null;
    }
}

