"use strict";

document.addEventListener("DOMContentLoaded", async () => {
    const publicKeyDisplay = document.getElementById("public-key-display");
    const privateKeyDisplay = document.getElementById("private-key-display");
    const messageInput = document.getElementById("message-input");
    const encryptButton = document.getElementById("encrypt-button");
    const decryptButton = document.getElementById("decrypt-button");
    const resultDisplay = document.getElementById("result-display");

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

    async function exportKeyPair() {
        const publicKey = await window.crypto.subtle.exportKey(
            "spki",
            keyPair.publicKey
        );
        const publicKeyString = btoa(
            String.fromCharCode(...new Uint8Array(publicKey))
        );
        const privateKey = await window.crypto.subtle.exportKey(
            "pkcs8",
            keyPair.privateKey
        );
        const privateKeyString = btoa(
            String.fromCharCode(...new Uint8Array(privateKey))
        );
        return [publicKeyString, privateKeyString];
    }

    async function importPublicKey(publicKeyString) {
        const publicKeyBuffer = Uint8Array.from(
            atob(publicKeyString),
            (c) => c.charCodeAt(0)
        );
        const publicKey = await window.crypto.subtle.importKey(
            "spki",
            publicKeyBuffer,
            {
                name: "RSA-OAEP",
                hash: { name: "SHA-256" },
            },
            true,
            ["encrypt"]
        );
        return publicKey;
    }

    async function importPrivateKey(privateKeyString) {
        const privateKeyBuffer = Uint8Array.from(
            atob(privateKeyString),
            (c) => c.charCodeAt(0)
        );
        const privateKey = await window.crypto.subtle.importKey(
            "pkcs8",
            privateKeyBuffer,
            {
                name: "RSA-OAEP",
                hash: { name: "SHA-256" },
            },
            true,
            ["decrypt"]
        );
        return privateKey;
    }

    async function encryptMessage(publicKey) {
        const message = messageInput.value;
        const messageBuffer = new TextEncoder().encode(message);
        const encryptedBuffer = await window.crypto.subtle.encrypt(
            { name: "RSA-OAEP" },
            publicKey,
            messageBuffer
        );
        const encryptedData = btoa(
            String.fromCharCode(...new Uint8Array(encryptedBuffer))
        );
        return encryptedData;
    }

    async function decryptMessage(privateKey, encryptedData) {
        const encryptedBuffer = Uint8Array.from(
            atob(encryptedData),
            (c) => c.charCodeAt(0)
        );
        const decryptedBuffer = await window.crypto.subtle.decrypt(
            { name: "RSA-OAEP" },
            privateKey,
            encryptedBuffer
        );
        const decryptedMessage = new TextDecoder().decode(decryptedBuffer);
        return decryptedMessage;
    }

    generateKeyPair().then(async () => {
        const [publicKeyString, privateKeyString] = await exportKeyPair();
        publicKeyDisplay.textContent = publicKeyString;
        privateKeyDisplay.textContent = privateKeyString;
    });

    encryptButton.addEventListener("click", async () => {
        try {
            const publicKeyString = publicKeyDisplay.textContent;
            const publicKey = await importPublicKey(publicKeyString);
            const encryptedData = await encryptMessage(publicKey);
            resultDisplay.textContent = `Encrypted message: ${encryptedData}`;
        } catch (error) {
            console.error(error);
            resultDisplay.textContent = "Encryption failed.";
        }
    });

    decryptButton.addEventListener("click", async () => {
        try {
            const privateKeyString = privateKeyDisplay.textContent;
            const privateKey = await importPrivateKey(privateKeyString);
            const encryptedData = resultDisplay.textContent.slice(18); // Slice to remove "Encrypted message: " from the beginning
            const decryptedMessage = await decryptMessage(privateKey, encryptedData);
            resultDisplay.textContent = `Decrypted message: ${decryptedMessage}`;
        } catch (error) {
            console.error(error);
            resultDisplay.textContent = "Decryption failed.";
        }
    });
});