function sendToTelegram(event) {
    event.preventDefault();

    const botToken = "7522747677:AAFf5uSN3ULEK24c_870o9G-mVLBuZbS_R8";
    const chatId = "1543040976";

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;
    const submitBtn = document.getElementById("submitBtn");

    // We don't need the text status message anymore since we have the modal
    // const statusMessage = document.getElementById("statusMessage"); 

    // Date Logic
    const now = new Date();
    const month = now.toLocaleString('en-US', { month: 'short' });
    const day = String(now.getDate()).padStart(2, '0');
    const year = now.getFullYear();
    const time = now.toLocaleTimeString('en-US');
    const date = `${month}/${day}/${year}, ${time}`;

    const text = `
*Subject: New Inquiry via Learnify Website*

*From:* ${name}
*Email:* \`${email}\`
*Date:* ${date}

----------------------------------------

*Message:*

${message}

----------------------------------------
_This is an automated notification sent from your website contact form._
    `;

    // Disable button
    submitBtn.disabled = true;
    submitBtn.innerHTML = "Sending... <i class='fa-solid fa-spinner fa-spin'></i>";

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            text: text,
            parse_mode: 'Markdown'
        })
    })
        .then(response => {
            if (response.ok) {
                // --- SUCCESS: OPEN MODAL ---
                const modal = document.getElementById('successModal');
                modal.classList.remove('hidden');

                // Clear form
                document.getElementById("telegramForm").reset();
            } else {
                throw new Error("Telegram API Error");
            }
        })
        .catch(error => {
            alert("Failed to send message. Please check your internet connection.");
            console.error(error);
        })
        .finally(() => {
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = "Send Message <i class='fa-solid fa-paper-plane'></i>";
            }, 1000);
        });
}

// Function to Close Modal
function closeModal() {
    const modal = document.getElementById('successModal');
    modal.classList.add('hidden');
}