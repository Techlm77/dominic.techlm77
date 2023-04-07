const commandLine = document.getElementById('command');
        const commandLineDiv = document.querySelector('.command-line');

        commandLine.addEventListener('input', function (event) {
            const value = event.target.value;
            const placeholder = commandLineDiv.getAttribute('data-placeholder');
            if (value === '') {
                commandLineDiv.setAttribute('data-placeholder', '');
            } else {
                const matchingCommands = commands.filter((command) => command.startsWith(value));
                if (matchingCommands.length > 0) {
                    const commonPart = getCommonPart(matchingCommands);
                    commandLineDiv.setAttribute('data-placeholder', commonPart);
                } else {
                    commandLineDiv.setAttribute('data-placeholder', value);
                }
            }
        });

        const commandHistory = [];
        let historyIndex = 0;
        let currentDirectory = '/';
        const commands = ['help', 'clear', 'date', 'echo', 'pwd', 'ls', 'cd'];

        commandLine.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                const command = commandLine.value.trim();
                if (command !== '') {
                    processCommand(command);
                    commandHistory.push(command);
                    historyIndex = commandHistory.length;
                    commandLine.value = '';
                    commandLineDiv.setAttribute('data-placeholder', '');
                }
            } else if (event.key === 'ArrowUp') {
                if (historyIndex > 0) {
                    historyIndex--;
                    commandLine.value = commandHistory[historyIndex];
                }
            } else if (event.key === 'ArrowDown') {
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    commandLine.value = commandHistory[historyIndex];
                } else {
                    historyIndex++;
                    commandLine.value = '';
                }
            } else if (event.key === 'Tab') {
                event.preventDefault();
                const currentInput = commandLine.value;
                const matchingCommands = commands.filter((command) =>
                    command.startsWith(currentInput)
                );
                if (matchingCommands.length === 1) {
                    commandLine.value = matchingCommands[0];
                } else if (matchingCommands.length > 1) {
                    const commonPart = getCommonPart(matchingCommands);
                    commandLine.value = commonPart;
                }
            }
        });


        function getCommonPart(arr) {
            let A = arr.concat().sort();
            let a1 = A[0];
            let a2 = A[A.length - 1];
            let L = a1.length;
            let i = 0;
            while (i < L && a1.charAt(i) === a2.charAt(i)) i++;
            return a1.substring(0, i);
        }

        function processCommand(command) {
            const args = command.split(' ');
            const commandName = args[0];
            const commandArgs = args.slice(1);
            switch (commandName) {
                case 'help':
                    printOutput('You can use shortcuts keys such as Tab to autocomplete and up/down arrow keys for previous commands.');
                    printOutput('List of available commands:');
                    printOutput(commands.join(', '));
                    break;
                case 'clear':
                    clearOutput();
                    break;
                case 'date':
                    printOutput(new Date().toLocaleString());
                    break;
                case 'echo':
                    printOutput(commandArgs.join(' '));
                    break;
                case 'pwd':
                    printOutput(currentDirectory);
                    break;
                case 'ls':
                    printOutput('List of files and directories:');
                    const files = ['index.html', 'index.php', 'encrypt.html', 'terminal.html'];
                    const directories = ['public/', 'windows/', 'add/'];
                    for (let i = 0; i < files.length; i++) {
                        const fileLink = document.createElement('a');
                        fileLink.textContent = files[i];
                        fileLink.href = currentDirectory + files[i];
                        fileLink.target = '_blank';
                        const fileContainer = document.createElement('div');
                        fileContainer.appendChild(fileLink);
                        document.querySelector('.terminal').appendChild(fileContainer);
                    }
                    for (let i = 0; i < directories.length; i++) {
                        const directoryLink = document.createElement('a');
                        directoryLink.textContent = directories[i];
                        directoryLink.href = currentDirectory + directories[i];
                        directoryLink.target = '_blank';
                        const directoryContainer = document.createElement('div');
                        directoryContainer.appendChild(directoryLink);
                        document.querySelector('.terminal').appendChild(directoryContainer);
                    }
                    break;
                case 'cd':
                    const directory = command.substring(3);
                    try {
                        window.location.pathname = directory;
                    } catch {
                        output(`cd: no such file or directory: ${ directory }`, 'error');
                    }
                    break;
                default:
                    printOutput(`Command "${commandName}" not found`);
            }
        }

        function printOutput(output) {
            const outputContainer = document.createElement('div');
            outputContainer.classList.add('output');
            outputContainer.textContent = output;
            document.querySelector('.terminal').appendChild(outputContainer);
        }

        function clearOutput() {
            const terminal = document.querySelector('.terminal');
            const outputs = document.querySelectorAll('.output');
            outputs.forEach(output => terminal.removeChild(output));
        }