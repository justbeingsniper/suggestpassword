const CHAR_SET = Array.from({ length: 94 }, (_, i) => String.fromCharCode(i + 33));

function shuffleArray(arr) {
    return arr.map(value => ({ value, sort: Math.random() }))
              .sort((a, b) => a.sort - b.sort)
              .map(({ value }) => value);
}

class Rotor {
    constructor(wiring, notch) {
        this.wiring = wiring;
        this.notch = notch;
        this.position = 0;
    }

    forward(input) {
        let index = (CHAR_SET.indexOf(input) + this.position) % CHAR_SET.length;
        return this.wiring[index];
    }

    backward(input) {
        let index = (this.wiring.indexOf(input) - this.position + CHAR_SET.length) % CHAR_SET.length;
        return CHAR_SET[index];
    }

    rotate() {
        this.position = (this.position + 1) % CHAR_SET.length;
        return this.position === this.notch;
    }
}

class Plugboard {
    constructor(pairs = []) {
        this.mapping = {};
        for (const [a, b] of pairs) {
            this.mapping[a] = b;
            this.mapping[b] = a;
        }
    }

    swap(input) {
        return this.mapping[input] || input;
    }
}

function createReflector() {
    const shuffled = shuffleArray(CHAR_SET.slice());
    const reflector = {};
    for (let i = 0; i < shuffled.length; i += 2) {
        reflector[shuffled[i]] = shuffled[i + 1] || shuffled[i];
        reflector[shuffled[i + 1]] = shuffled[i] || shuffled[i];
    }
    return reflector;
}

class EnigmaMachine {
    constructor(rotors, plugboard, reflector) {
        this.rotors = rotors;
        this.plugboard = plugboard;
        this.reflector = reflector;
    }

    encryptChar(char) {
        if (!CHAR_SET.includes(char)) return char;
        char = this.plugboard.swap(char);
        for (const rotor of this.rotors) char = rotor.forward(char);
        char = this.reflector[char];
        for (let i = this.rotors.length - 1; i >= 0; i--) char = this.rotors[i].backward(char);
        char = this.plugboard.swap(char);
        for (let i = 0; i < this.rotors.length; i++) {
            const rotateNext = this.rotors[i].rotate();
            if (!rotateNext) break;
        }
        return char;
    }

    encryptText(text) {
        return Array.from(text).map(c => this.encryptChar(c)).join('');
    }
}

// Initialize Enigma Components Globally
const rotor1 = new Rotor(shuffleArray(CHAR_SET.slice()), 17);
const rotor2 = new Rotor(shuffleArray(CHAR_SET.slice()), 53);
const rotor3 = new Rotor(shuffleArray(CHAR_SET.slice()), 88);
const plugboard = new Plugboard([['A', 'M'], ['G', 'T'], ['P', 'Z']]);
const reflector = createReflector();

const enigma = new EnigmaMachine([rotor1, rotor2, rotor3], plugboard, reflector);

// Suggest Password Function
function suggestPassword() {
    const baseInput = CHAR_SET.sort(() => 0.5 - Math.random()).slice(0, 12).join('');
    const suggested = enigma.encryptText(baseInput);

    const passwordInput = document.getElementById("password");
    const generatedSpan = document.getElementById("generated-password");

    passwordInput.value = suggested;
    generatedSpan.innerText = suggested;
}


// // Simulating user registration data
// function getRegisteredUser() {
//     const registeredUsername = localStorage.getItem('registeredUsername');
//     const registeredPassword = localStorage.getItem('registeredPassword');
//     return { username: registeredUsername, password: registeredPassword };
// }

// // Login validation
// function loginUser(event) {
//     event.preventDefault();
//     const enteredUsername = document.getElementById("login-username").value;
//     const enteredPassword = document.getElementById("login-password").value;
//     const registeredUser = getRegisteredUser();

//     if (enteredUsername === registeredUser.username && enteredPassword === registeredUser.password) {
//         alert("Login successful!");
//         window.location.href = "frontend/women.html";
//     } else {
//         alert("Invalid username or password. Please try again.");
//     }
// }

function registerUser(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (password.length < 8) {
        alert("Password must be at least 8 characters!");
        return;
    }

    localStorage.setItem("registeredUsername", username);
    localStorage.setItem("registeredPassword", password);

    alert("Registration successful!");

    // Redirect to login.html after successful registration
    window.location.href = "login.html";
}
document.getElementById("register-form").addEventListener("submit", registerUser);



