// Variable state
let askPassword = true;
const protectedChannels = ['channel-id-1', 'channel-id-2']; // List protected channels

// Get active channel id 
function getActiveChannelId() {
    // Search for the currently active channel id element
    // Search for <a> elements that have an id with the prefix `siderItem_` inside an <li> element with class active.
    const activeChannelElement = document.querySelector('li.SidebarChannel.active a[id^="sidebarItem_"]');
    
    // console.log(activeChannelElement.id); // debug

    if (activeChannelElement) {
        return activeChannelElement.id.replace('sidebarItem_', '');
    }

    return null;
}

// Reset variable state
function resetAskPassword() {
    const channelId = getActiveChannelId();

    // If the user is on other than protected channels or refreshed the page, reset askPassword.
    if (!protectedChannels.includes(channelId) || !document.hidden) {  // `document.hidden` indicates whether the tab is active or not
        askPassword = true;
    }
}

// Check access channel
function checkChannelAccess() {
    const channelId = getActiveChannelId();
    
    // console.log(askPassword) // debug

    if (protectedChannels.includes(channelId) && askPassword) {
        const password = prompt("Enter the password to access this channel:");

        if (password !== 'your-password') {
            alert("Incorrect password!");
        } else {
            askPassword = false;  // After the user enters the password correctly, set askPassword to false
        }
    } else if (!protectedChannels.includes(channelId)) {
        resetAskPassword();
    }
}

// DOM Change Observation
// Whenever there is a change to the DOM, the `checkChannelAccess` function will be executed.
const observer = new MutationObserver(checkChannelAccess);
observer.observe(document.body, { childList: true, subtree: true });

// Event listener to detect when the user refreshes the page or switches tab
window.addEventListener('visibilitychange', resetAskPassword);