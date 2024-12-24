let page_history = []
let pages = {
    1: document.getElementById("main-page"),
    2: document.getElementById("control-page"),
    3: document.getElementById("user-creation-page")
}

pages["1"].style = "display: none;"
pages["2"].style = "display: none;"
pages["3"].style = "display: none;"

checkSessionIfSaved()
setCurrentUserLabel()

// events
document.getElementById("main-page-button").onclick = () => {
    setPage(3)
}

document.getElementById("user-creation-submit").onclick = () => {
    saveData(document.getElementById("creation-page-name-input").value)
}

document.getElementById("auto-login-button").onclick = async () => {
    await removeCookie("secure_lmssessionkey2")
    // remove first because it doesn't ovverride current cookie for some reason

    await setCookie("secure_lmssessionkey2", localStorage.getItem("eLMS_Session").split(">>>")[1])
    // second item in array is the session key

    alert("Logged in. Please refresh the page to confirm")
}

document.getElementById("remove-data-button").onclick = () => {
    localStorage.removeItem("eLMS_Session")
    setCurrentUserLabel()
    setPage(1)
}

for (let btns of document.getElementsByClassName("back-callback")) {
    btns.onclick = pageBack
}

// functions
function checkSessionIfSaved() {
    if (!localStorage.getItem("eLMS_Session")) {
        localStorage.setItem("eLMS_Session", "")
        setPage(1)
        return;
    }
    setPage(2)
}

function setCurrentUserLabel() {
    document.getElementById("currentuser-p").innerHTML = `Current User: ${
        localStorage.getItem("eLMS_Session") ? 
        localStorage.getItem("eLMS_Session").split(">>>")[0] : "None"}`
}

async function saveData(data) {
    let cookie_val = await getCookie("secure_lmssessionkey2")
    setUser(data, cookie_val)
    setPage(2)
}

function pageBack() {
    page_history.pop()
    setPage(page_history[page_history.length - 1]) // last page
}

function setPage(page_int) {
    for (let p of Object.keys(pages)) {
        if (p == page_int) {
            pages[p].style = "display: block;"
            page_history.push(p)
        } else {
            pages[p].style = "display: none;"
        }
    }
    
    /*
    page int meaning

    1 = main page
    2 = login button page
    3 = user creation page
    */
}

async function getCookie(cookie_name) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({
                action: "getCookie",
                url: "https://elms.sti.edu",
                name: cookie_name
            }, (response) => {
                resolve(response)
            }
        )
    })
}

function setUser(name, key) {
    localStorage.setItem("eLMS_Session", `${name}>>>${key}`)
    setCurrentUserLabel()
}

function getUser() {
    return localStorage.getItem("eLMS_Session")
}

async function setCookie(cookie_name, val) {
    //alert(cookie_name + " : " + val)
    return new Promise((resolve, _reject) => {
        chrome.runtime.sendMessage({
            action: "setCookie",
            url: "https://elms.sti.edu/",
            domain: "elms.sti.edu",
            name: cookie_name,
            value: val,
        }, (response) => {
            resolve(response)
        })
    })
}

async function removeCookie(cookie_name) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({
            action: "removeCookie",
            url: "https://elms.sti.edu/",
            domain: "elms.sti.edu",
            name: cookie_name,
        }, (response) => {
            resolve(response)
        })
    })
}
