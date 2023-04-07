"use strict";

document.addEventListener("DOMContentLoaded", async () => {

    const keyDisplay = document.getElementById("key-display");
    const messageInput = document.getElementById("message-input");
    const statusDisplay = document.getElementById("status");
    const sendDataButton = document.getElementById("send-data");

    let keyPair;

    async function generateKeyPair() {
        const algorithm = {
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: { name: "SHA-256" },
        };
        keyPair = await window.crypto.subtle.generateKey(
            algorithm,
            true,
            ["encrypt", "decrypt"]
        );
    }

    async function exportPublicKey() {
        const publicKey = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
        const publicKeyString = btoa(String.fromCharCode(...new Uint8Array(publicKey)));
        return publicKeyString;
    }

    function displayPublicKey(key) {
        const textarea = document.createElement("textarea");
        textarea.setAttribute("readonly", "");
        textarea.setAttribute("cols", "60");
        textarea.setAttribute("rows", "10");
        textarea.style.fontFamily = "monospace";
        textarea.value = key;
        keyDisplay.innerHTML = "";
        keyDisplay.appendChild(textarea);
    }

    async function sendEncryptedData(publicKeyString) {
        const message = messageInput.value;
        const data = { message };
        const url = `https://${window.location.hostname}:8443/encrypt-data?publicKey=${encodeURIComponent(publicKeyString)}`;
        try {
            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify({ data }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const json = await response.json();
            if (json.status === "valid") {
                const encryptedData = json.data;
                const encryptedBuffer = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
                const decrypted = await window.crypto.subtle.decrypt(
                    { name: "RSA-OAEP" },
                    keyPair.privateKey,
                    encryptedBuffer
                );
                const decryptedData = JSON.parse(new TextDecoder().decode(decrypted));
                statusDisplay.innerHTML = decryptedData.message;
            } else {
                throw new Error(`Server error: ${json.message}`);
            }
        } catch (error) {
            statusDisplay.innerHTML = `Error: ${error.message}`;
        }
    }

    async function init() {
        try {
            await generateKeyPair();
            const publicKeyString = await exportPublicKey();
            displayPublicKey(publicKeyString);
            sendDataButton.addEventListener("click", async () => {
                await sendEncryptedData(publicKeyString);
            });
        } catch (error) {
            statusDisplay.innerHTML = `Error: ${error.message}`;
        }
    }

    init();

});