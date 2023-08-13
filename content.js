// Variable state
let askPassword = true;
const passwordChannel = 'your-password';
const protectedChannels = ['channel-id-1', 'channel-id-2']; // List protected channels
let observer;

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

// Show html password popup
function showPasswordPopup() {

    // ----------------------------------- Start HTML & CSS -----------------------------------
    const popupWrapper = document.createElement('div');
    popupWrapper.id = 'passwordPopupWrapper';
    popupWrapper.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    `;

    const popupContent = document.createElement('div');
    popupContent.style.cssText = `
        width: 300px;
        padding: 20px;
        background: var(--sidebar-bg);
        border-radius: 8px;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
    `;

    const instructionText = document.createElement('div');
    //instructionText.textContent = "Enter your password:";
    instructionText.innerHTML = "<p>Enter your password:</p>";
    instructionText.style.fontWeight = 'bold';
    instructionText.style.marginBottom = '10px';

    const passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.style.cssText = `
        flex-grow: 1;
        margin-right: 20px;
        padding: 8px;
        border-radius: 4px;
        border: 1px solid rgba(220, 221, 222, 0.5);
        background-color: var(--button-color);
        color: var(--sidebar-bg);
        outline: none;
    `;

    const submitButton = document.createElement('button');
    submitButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="18" height="15" viewBox="0 0 24 24" fill="var(--button-color)">
        <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z"></path>
    </svg>`;
    submitButton.style.cssText = `
        background: var(--button-bg);
        padding: 8px 12px;
        border-radius: 4px;
        border: none;
        cursor: pointer;
    `;

    const inputButtonWrapper = document.createElement('div');
    inputButtonWrapper.style.cssText = `
        display: flex;
        align-items: center;
    `;
    // ----------------------------------- End HTML & CSS -----------------------------------

    // Validate password
    function validatePassword() {
        const password = passwordInput.value;
        if (password !== passwordChannel) {
            passwordInput.style.border = '2px solid #fd5c63'; // Tampilkan border merah ketika password salah
            passwordInput.focus(); // Fokus kembali ke input box
        } else {
            document.body.removeChild(popupWrapper);
            askPassword = false;
            startObserving();
        }
    }

    // Click button to validate password
    submitButton.addEventListener('click', validatePassword);
    
    // 'Enter' in the form to validate password
    passwordInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            validatePassword();
        }
    });

    passwordInput.addEventListener('input', () => {
        passwordInput.style.border = '1px solid rgba(220, 221, 222, 0.5)';
    });

    inputButtonWrapper.appendChild(passwordInput);
    inputButtonWrapper.appendChild(submitButton);

    popupContent.appendChild(instructionText);
    popupContent.appendChild(inputButtonWrapper);
    popupWrapper.appendChild(popupContent);
    document.body.appendChild(popupWrapper);
}

// Reset ask password
function resetAskPassword() {
    askPassword = true;
}

// Check access channel
function checkChannelAccess() {
    const channelId = getActiveChannelId();
    
    // console.log(askPassword) // debug

    if (protectedChannels.includes(channelId) && askPassword) {
        stopObserving();
        showPasswordPopup();
    } else if (!protectedChannels.includes(channelId)) {
        resetAskPassword();
    }  
}

function startObserving() {
    if (observer) return;

    // Whenever there is a change to the DOM, the `checkChannelAccess` function will be executed.
    observer = new MutationObserver(checkChannelAccess);
    observer.observe(document.body, { childList: true, subtree: true });
}

// Stop observation
function stopObserving() {
    if (observer) {
        observer.disconnect();
        observer = null;
    }
}

// Start DOM change observation
startObserving();

// Event listener to detect when the user refreshes the page or switches tab
window.addEventListener('visibilitychange', resetAskPassword);