document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("input");
    const buttons = document.querySelectorAll("button");

    let currentInput = "";
    input.value = "0";

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const buttonText = button.innerText;
            const sanitizedText = buttonText.replace("x", "*").replace("÷", "/");
            if (input.value === "0") {
                input.value = "";
            }
            if (sanitizedText === "=") {
                try {
                   // Replace "X" with "*" and "/" with "÷" before adding to the current input
                   currentInput = currentInput.replace(/x/g, '*').replace(/÷/g, '/');
                    
                    currentInput = evaluateExpression(currentInput);
                    input.value = currentInput;
                } catch (error) {
                    input.value = "Error";
                }
            } else if (sanitizedText === "AC") {
                currentInput = "";
                input.value = "";
            } else if (sanitizedText === "%") {
                // Calculate the percentage of the current input
                currentInput = (parseFloat(currentInput) / 100).toString();
                input.value = currentInput;
            } else if (sanitizedText === "+/-") {
                // Toggle the sign of the current input
                if (currentInput.charAt(0) === '-') {
                    currentInput = currentInput.slice(1);
                } else {
                    currentInput = '-' + currentInput;
                }
                input.value = currentInput;
            } else {
                if (
                    (sanitizedText.match(/[+\/*]/) && currentInput.match(/[+\/*]$/)) &&
                    !(sanitizedText === '-' && /[+\/*-]$/.test(currentInput))  
                ) {
                    
                    return;
                }

                currentInput += sanitizedText;
                input.value = currentInput;
            }
        });
    });

    function evaluateExpression(expression) {
        // Split the expression into operands and operator
        const regex = /([+\-*/])/g;;
        const tokens = expression.split(regex).filter(token => token.trim() !== '');

        // Handle unary minus (negation) for the first token
        if (tokens.length > 0 && tokens[0] === '-') {
            tokens[0] = '-' + tokens[1];
            tokens.splice(1, 1);
        }
        
        else if (tokens.length > 2 && tokens[1] === '*' && tokens[2] === '-') {
            // Handle subtraction following multiplication for cases like 5*-8
            tokens.splice(0, 3, (parseFloat(tokens[0]) * -parseFloat(tokens[3])).toString());
        }
      
        // Perform the calculation based on BODMAS rules
        while (tokens.includes('*') || tokens.includes('/')) {
            const index = tokens.findIndex(token => token === '*' || token === '/');
            const operator = tokens[index];
            const leftOperand = parseFloat(tokens[index - 1]);
            const rightOperand = parseFloat(tokens[index + 1]);

            let result;
            switch (operator) {
                case '*':
                    result = leftOperand * rightOperand
                    break;
                case '/':
                    if (rightOperand === 0) {
                        throw new Error("Division by zero");
                    }
                    result = leftOperand / rightOperand;
                    break;
            }

            tokens.splice(index - 1, 3, result.toString());
        }

        while (tokens.includes('+') || tokens.includes('-')) {
            const index = tokens.findIndex(token => token === '+' || token === '-');
            const operator = tokens[index];
            const leftOperand = parseFloat(tokens[index - 1]);
            const rightOperand = parseFloat(tokens[index + 1]);

            let result;
            switch (operator) {
                case '+':
                    result = leftOperand + rightOperand;
                    break;
                case '-':
                    result = leftOperand - rightOperand;
                    break;
            }

            tokens.splice(index - 1, 3, result.toString());
        }

        return parseFloat(tokens[0]).toString();
    }
   
});

