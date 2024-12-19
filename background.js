chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
        case "getCookie":
            chrome.cookies.get({
                url: message.url,
                name: message.name 
            }, (cookie) => {
                if (chrome.runtime.lastError) { return console.error(chrome.runtime.lastError) }
                sendResponse(cookie.value || null)
            })
            break;
            
        case "setCookie":
            chrome.cookies.set({
                domain: message.domain,
                url: message.url,
                name: message.name,
                value: message.value,
                path: "/"
            }, (cookie) => {
                if (chrome.runtime.lastError) { return console.error(chrome.runtime.lastError) }
                sendResponse(cookie)
            })
        break;

        case "removeCookie":
            chrome.cookies.remove({
                name: message.name,
                url: message.url
            }, (cookie) => {
                if (chrome.runtime.lastError) { return console.error(chrome.runtime.lastError) }
                sendResponse(cookie)
            })
	}
    return true // prevent message port close
})
