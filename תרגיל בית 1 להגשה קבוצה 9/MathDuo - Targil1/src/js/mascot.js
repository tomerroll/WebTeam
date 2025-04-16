class MathMascot {
    constructor(options = {}) {
        this.element = this.createMascot();
        this.currentState = 'neutral';
        this.hints = [];
        this.theory = '';
        this.sound = options.sound !== false;
        this.theme = options.theme || 'standard';
        this.symbol = options.symbol || 'π';
        this.messages = {
            correct: options.correctMessage || 'נכון מאוד! כל הכבוד! 🎉',
            incorrect: options.incorrectMessage || 'לא נורא, ננסה שוב! 💪',
            hint: options.hintPrefix || 'רמז: '
        };
        
        this.initEventListeners();
        this.applyTheme(this.theme);
    }

    createMascot() {
        const mascot = document.createElement('div');
        mascot.className = 'math-mascot';
        mascot.innerHTML = `
            <div class="mascot-container">
                <div class="mascot-body">
                    <div class="mascot-antenna">
                        <div class="antenna-ball"></div>
                    </div>
                    <div class="mascot-head">
                        <div class="mascot-eyes">
                            <div class="eye left">
                                <div class="pupil"></div>
                                <div class="eye-light"></div>
                            </div>
                            <div class="eye right">
                                <div class="pupil"></div>
                                <div class="eye-light"></div>
                            </div>
                        </div>
                        <div class="mascot-expression">
                            <div class="mouth"></div>
                        </div>
                    </div>
                    <div class="mascot-symbol"></div>
                    <div class="mascot-arms">
                        <div class="arm left">
                            <div class="arm-joint"></div>
                            <div class="arm-segment"></div>
                            <div class="hand">
                                <div class="finger"></div>
                                <div class="finger"></div>
                                <div class="finger"></div>
                            </div>
                        </div>
                        <div class="arm right">
                            <div class="arm-joint"></div>
                            <div class="arm-segment"></div>
                            <div class="hand">
                                <div class="finger"></div>
                                <div class="finger"></div>
                                <div class="finger"></div>
                            </div>
                        </div>
                    </div>
                    <div class="mascot-legs">
                        <div class="leg left">
                            <div class="leg-joint"></div>
                            <div class="leg-segment"></div>
                            <div class="foot"></div>
                        </div>
                        <div class="leg right">
                            <div class="leg-joint"></div>
                            <div class="leg-segment"></div>
                            <div class="foot"></div>
                        </div>
                    </div>
                </div>
                <div class="mascot-speech-bubble hidden">
                    <p></p>
                    <div class="speech-buttons">
                        <button class="hint-button">הצג רמז</button>
                        <button class="theory-button">הצג תיאוריה</button>
                    </div>
                </div>
                <div class="confetti-container"></div>
                <div class="mascot-control-panel hidden">
                    <div class="panel-header">
                        <h3>הגדרות מסקוט</h3>
                        <button class="close-panel">×</button>
                    </div>
                    <div class="panel-body">
                        <div class="control-group">
                            <label>סימן מתמטי:</label>
                            <select class="symbol-selector">
                                <option value="π">π (פאי)</option>
                                <option value="∑">∑ (סיגמא)</option>
                                <option value="√">√ (שורש)</option>
                                <option value="∞">∞ (אינסוף)</option>
                                <option value="±">± (פלוס-מינוס)</option>
                                <option value="∫">∫ (אינטגרל)</option>
                                <option value="≠">≠ (לא שווה)</option>
                            </select>
                        </div>
                        <div class="control-group">
                            <label>ערכת צבעים:</label>
                            <select class="theme-selector">
                                <option value="standard">סטנדרטי</option>
                                <option value="dark">כהה</option>
                                <option value="pastel">פסטל</option>
                                <option value="neon">ניאון</option>
                                <option value="retro">רטרו</option>
                            </select>
                        </div>
                        <div class="control-group">
                            <label>
                                <input type="checkbox" class="sound-toggle" checked>
                                הפעל צלילים
                            </label>
                        </div>
                        <div class="control-group">
                            <label>גודל:</label>
                            <input type="range" class="size-slider" min="50" max="150" value="100">
                        </div>
                    </div>
                </div>
            </div>
        `;
        return mascot;
    }

    initEventListeners() {
        // Add to DOM before adding event listeners
        setTimeout(() => {
            // Mascot click to toggle speech bubble
            this.element.querySelector('.mascot-body').addEventListener('click', () => {
                const bubble = this.element.querySelector('.mascot-speech-bubble');
                if (bubble.classList.contains('hidden')) {
                    bubble.classList.remove('hidden');
                } else {
                    bubble.classList.add('hidden');
                }
            });

            // Double click to show control panel
            this.element.querySelector('.mascot-body').addEventListener('dblclick', (e) => {
                e.preventDefault();
                this.element.querySelector('.mascot-control-panel').classList.toggle('hidden');
            });

            // Close panel button
            this.element.querySelector('.close-panel').addEventListener('click', () => {
                this.element.querySelector('.mascot-control-panel').classList.add('hidden');
            });

            // Hint button
            this.element.querySelector('.hint-button').addEventListener('click', () => {
                this.showHint();
            });

            // Theory button
            this.element.querySelector('.theory-button').addEventListener('click', () => {
                this.showTheory();
            });

            // Symbol selector
            this.element.querySelector('.symbol-selector').addEventListener('change', (e) => {
                this.setSymbol(e.target.value);
            });

            // Theme selector
            this.element.querySelector('.theme-selector').addEventListener('change', (e) => {
                this.applyTheme(e.target.value);
            });

            // Sound toggle
            this.element.querySelector('.sound-toggle').addEventListener('change', (e) => {
                this.sound = e.target.checked;
            });

            // Size slider
            this.element.querySelector('.size-slider').addEventListener('input', (e) => {
                const size = e.target.value;
                this.element.querySelector('.mascot-container').style.transform = `scale(${size/100})`;
            });

            // Set initial symbol
            this.setSymbol(this.symbol);
            
            // Initialize the select values
            this.element.querySelector('.symbol-selector').value = this.symbol;
            this.element.querySelector('.theme-selector').value = this.theme;
        }, 0);
    }

    setSymbol(symbol) {
        this.symbol = symbol;
        this.element.querySelector('.mascot-symbol').textContent = symbol;
    }

    applyTheme(theme) {
        this.theme = theme;
        this.element.querySelectorAll('.theme-standard, .theme-dark, .theme-pastel, .theme-neon, .theme-retro')
            .forEach(el => el.classList.remove('theme-standard', 'theme-dark', 'theme-pastel', 'theme-neon', 'theme-retro'));
        
        this.element.querySelector('.mascot-container').classList.add(`theme-${theme}`);
        
        // Update dropdown if it exists
        const themeSelector = this.element.querySelector('.theme-selector');
        if (themeSelector) {
            themeSelector.value = theme;
        }
    }

    setState(state) {
        this.currentState = state;
        const container = this.element.querySelector('.mascot-container');
        
        // Remove all state classes
        container.classList.remove('state-happy', 'state-sad', 'state-neutral', 'state-thinking');
        
        // Add the new state class
        container.classList.add(`state-${state}`);
        
        // Update mouth expression
        const mouth = this.element.querySelector('.mouth');
        mouth.className = 'mouth'; // Reset mouth class
        mouth.classList.add(`mouth-${state}`);
        
        // Handle specific state behaviors
        switch(state) {
            case 'happy':
                this.startDancing();
                this.showMessage(this.messages.correct);
                this.showConfetti();
                if (this.sound) this.playSound('success');
                break;
            case 'sad':
                this.stopDancing();
                this.showMessage(this.messages.incorrect);
                if (this.sound) this.playSound('fail');
                break;
            case 'thinking':
                this.stopDancing();
                this.showMessage('חושב...');
                break;
            case 'neutral':
                this.stopDancing();
                this.hideSpeechBubble();
                break;
        }
    }

    startDancing() {
        this.element.querySelector('.mascot-body').classList.add('dancing');
    }

    stopDancing() {
        this.element.querySelector('.mascot-body').classList.remove('dancing');
    }

    showHint() {
        if (this.hints.length > 0) {
            const randomHint = this.hints[Math.floor(Math.random() * this.hints.length)];
            this.showMessage(`${this.messages.hint} ${randomHint} 💡`);
            if (this.sound) this.playSound('hint');
        } else {
            this.showMessage('אין רמזים זמינים כרגע 🤔');
        }
    }

    showTheory() {
        if (this.theory) {
            this.showMessage(this.theory);
            if (this.sound) this.playSound('theory');
        } else {
            this.showMessage('אין מידע תיאורטי זמין כרגע 📚');
        }
    }

    showMessage(text, duration = 5000) {
        const bubble = this.element.querySelector('.mascot-speech-bubble');
        bubble.querySelector('p').textContent = text;
        bubble.classList.remove('hidden');
        
        // Clear existing timeout
        if (this.messageTimeout) {
            clearTimeout(this.messageTimeout);
        }
        
        // Auto-hide message after duration (if not 0)
        if (duration) {
            this.messageTimeout = setTimeout(() => {
                this.hideSpeechBubble();
            }, duration);
        }
    }

    hideSpeechBubble() {
        this.element.querySelector('.mascot-speech-bubble').classList.add('hidden');
        if (this.messageTimeout) {
            clearTimeout(this.messageTimeout);
        }
    }

    setHints(hints) {
        this.hints = Array.isArray(hints) ? hints : [hints];
    }

    setTheory(theory) {
        this.theory = theory;
    }

    showConfetti() {
        const confettiContainer = this.element.querySelector('.confetti-container');
        confettiContainer.innerHTML = '';
        
        // Create confetti pieces with more variety
        const colors = ['#FF5252', '#FFEB3B', '#4CAF50', '#2196F3', '#9C27B0', '#FF9800'];
        const shapes = ['circle', 'square', 'triangle', 'star'];
        
        for (let i = 0; i < 80; i++) {
            const confetti = document.createElement('div');
            confetti.className = `confetti ${shapes[Math.floor(Math.random() * shapes.length)]}`;
            confetti.style.setProperty('--delay', `${Math.random() * 3}s`);
            confetti.style.setProperty('--x', `${Math.random() * 300 - 150}px`);
            confetti.style.setProperty('--rotate', `${Math.random() * 360}deg`);
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confettiContainer.appendChild(confetti);
        }

        // Remove confetti after animation
        setTimeout(() => {
            confettiContainer.innerHTML = '';
        }, 3000);
    }

    playSound(type) {
        if (!this.sound) return;
        
        const sounds = {
            success: [600, 800],
            fail: [300, 200],
            hint: [400, 500],
            theory: [500, 300, 600]
        };
        
        if (!sounds[type]) return;
        
        // Create audio context if it doesn't exist
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        // Play the sequence of notes
        sounds[type].forEach((freq, index) => {
            setTimeout(() => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.type = 'sine';
                oscillator.frequency.value = freq;
                gainNode.gain.value = 0.2;
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.start();
                gainNode.gain.exponentialRampToValueAtTime(0.00001, this.audioContext.currentTime + 0.5);
                
                setTimeout(() => {
                    oscillator.stop();
                }, 500);
            }, index * 200);
        });
    }

    // Methods to position the mascot
    moveTo(position) {
        const positions = {
            'top-right': { top: '20px', right: '20px', bottom: 'auto', left: 'auto' },
            'top-left': { top: '20px', right: 'auto', bottom: 'auto', left: '20px' },
            'bottom-right': { top: 'auto', right: '20px', bottom: '20px', left: 'auto' },
            'bottom-left': { top: 'auto', right: 'auto', bottom: '20px', left: '20px' },
            'center-right': { top: '50%', right: '20px', bottom: 'auto', left: 'auto', transform: 'translateY(-50%)' },
            'center-left': { top: '50%', right: 'auto', bottom: 'auto', left: '20px', transform: 'translateY(-50%)' }
        };
        
        if (positions[position]) {
            Object.entries(positions[position]).forEach(([prop, value]) => {
                this.element.style[prop] = value;
            });
        }
    }

    // New method to show thinking animation
    think() {
        this.setState('thinking');
        return new Promise(resolve => {
            // Simulate thinking process for 2 seconds
            setTimeout(() => {
                resolve();
            }, 2000);
        });
    }

    // Add a method to check an answer
    checkAnswer(userAnswer, correctAnswer, options = {}) {
        this.think().then(() => {
            // Allow for flexible comparison options
            let isCorrect;
            
            if (options.type === 'number') {
                // For numerical answers, check if close enough
                const tolerance = options.tolerance || 0.001;
                isCorrect = Math.abs(parseFloat(userAnswer) - parseFloat(correctAnswer)) <= tolerance;
            } else if (options.type === 'text-insensitive') {
                // Case insensitive text comparison
                isCorrect = userAnswer.toLowerCase() === correctAnswer.toLowerCase();
            } else if (options.type === 'array') {
                // Check if array contents match (order doesn't matter)
                const userArray = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
                const correctArray = Array.isArray(correctAnswer) ? correctAnswer : [correctAnswer];
                isCorrect = userArray.length === correctArray.length && 
                            userArray.every(item => correctArray.includes(item));
            } else {
                // Default strict equality
                isCorrect = userAnswer === correctAnswer;
            }
            
            if (isCorrect) {
                this.setState('happy');
                if (options.onCorrect) options.onCorrect();
            } else {
                this.setState('sad');
                if (options.onIncorrect) options.onIncorrect();
            }
            
            return isCorrect;
        });
    }
}

// Add enhanced styles
const style = document.createElement('style');
style.textContent = `
    .math-mascot {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        font-family: Arial, sans-serif;
        direction: rtl;
    }

    .mascot-container {
        position: relative;
        width: 80px;
        height: 90px;
        cursor: pointer;
        transition: transform 0.3s ease, filter 0.3s ease;
    }

    .math-mascot *,
    .math-mascot *::before,
    .math-mascot *::after {
        box-sizing: border-box;
    }

    .mascot-body {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        transform-origin: bottom center;
        border: 2px solid;
        box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        background-color: #E6B17A;
    }

    .mascot-antenna {
        position: absolute;
        top: -22px;
        width: 4px;
        height: 25px;
        z-index: -1;
    }

    .antenna-ball {
        position: absolute;
        top: -8px;
        left: -4px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        animation: glow 2s infinite;
    }

    .mascot-head {
        width: 90%;
        height: 60%;
        position: relative;
        border-radius: 50%;
        margin-top: -2px;
        border: 2px solid #B88B4A;
        overflow: hidden;
        transition: all 0.3s ease;
        background-color: #E6B17A;
        transform: scale(1.05);
    }

    .mascot-eyes {
        display: flex;
        justify-content: space-around;
        padding-top: 12px;
        width: 85%;
        margin: 0 auto;
        gap: 4px;
    }

    .eye {
        width: 16px;
        height: 20px;
        position: relative;
        border-radius: 45% 45% 50% 50%;
        overflow: hidden;
        transition: all 0.3s ease;
        background-color: #FFFFFF;
        border: 2px solid #B88B4A;
        transform: scale(0.95);
    }

    .pupil {
        position: absolute;
        width: 8px;
        height: 10px;
        border-radius: 50%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        transition: all 0.2s ease;
        background-color: #2C3E50;
    }

    .eye-light {
        position: absolute;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        top: 25%;
        left: 65%;
        background-color: white;
        opacity: 0.9;
    }

    .mouth {
        width: 20px;
        height: 8px;
        margin: 6px auto 0;
        position: relative;
        transition: all 0.3s ease;
        border-radius: 6px;
    }

    .mouth-happy {
        border-radius: 0 0 20px 20px;
        height: 10px;
        transform: scale(0.8);
    }

    .mouth-sad {
        border-radius: 20px 20px 0 0;
        height: 10px;
        transform: translateY(3px) scale(0.8);
    }

    .mouth-neutral {
        border-radius: 2px;
        height: 4px;
    }

    .mouth-thinking {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        animation: thinking 1s infinite;
    }

    .mascot-symbol {
        font-size: 1.5em;
        font-weight: bold;
        margin: 4px 0;
        color: #B88B4A;
        text-shadow: 1px 1px 0 #8B6B3A;
        position: relative;
        z-index: 2;
    }

    .mascot-arms {
        position: absolute;
        width: 100%;
        height: 40px;
        display: flex;
        justify-content: space-between;
        top: 45%;
        z-index: 1;
    }

    .arm {
        width: 25px;
        height: 35px;
        position: relative;
        transform-origin: top center;
        transition: all 0.3s ease;
    }

    .arm-joint {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        border: 2px solid;
    }

    .arm-segment {
        width: 8px;
        height: 25px;
        position: absolute;
        top: 8px;
        left: 50%;
        transform: translateX(-50%);
        border-radius: 4px;
        background-color: #3B9A8F;
    }

    .hand {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        background-color: #3B9A8F;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .finger {
        width: 4px;
        height: 8px;
        border-radius: 2px;
    }

    .arm.left {
        transform: rotate(-15deg);
        left: -5px;
    }

    .arm.right {
        transform: rotate(15deg);
        right: -5px;
    }

    .mascot-legs {
        position: absolute;
        bottom: -15px;
        width: 70%;
        display: flex;
        justify-content: space-between;
    }

    .leg {
        width: 20px;
        height: 30px;
        position: relative;
        transform-origin: top center;
        transition: all 0.3s ease;
    }

    .leg-joint {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        border: 2px solid;
    }

    .leg-segment {
        width: 8px;
        height: 20px;
        position: absolute;
        top: 8px;
        left: 50%;
        transform: translateX(-50%);
        border-radius: 4px;
        background-color: #3B9A8F;
    }

    .foot {
        width: 18px;
        height: 8px;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        border-radius: 6px;
        background-color: #3B9A8F;
    }

    .leg.left {
        transform: rotate(-5deg);
    }

    .leg.right {
        transform: rotate(5deg);
    }

    .mascot-speech-bubble {
        position: absolute;
        border-radius: 10px;
        padding: 10px 15px;
        bottom: 140%;
        right: 0;
        min-width: 200px;
        max-width: 300px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        z-index: 10;
        transition: all 0.3s ease;
    }

    .mascot-speech-bubble:after {
        content: '';
        position: absolute;
        bottom: -10px;
        right: 40px;
        border-width: 10px 10px 0;
        border-style: solid;
    }

    .mascot-speech-bubble p {
        margin: 0 0 10px 0;
        font-size: 14px;
        line-height: 1.4;
    }

    .mascot-speech-bubble.hidden {
        opacity: 0;
        visibility: hidden;
        transform: translateY(10px);
    }

    .speech-buttons {
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
    }

    .speech-buttons button {
        padding: 5px 10px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 12px;
        transition: all 0.2s;
    }

    .speech-buttons button:hover {
        transform: translateY(-2px);
    }

    .speech-buttons button:active {
        transform: translateY(0);
    }

    .confetti-container {
        position: absolute;
        width: 300px;
        height: 300px;
        top: -50px;
        left: -90px;
        pointer-events: none;
        z-index: 2;
    }

    .confetti {
        position: absolute;
        width: 10px;
        height: 10px;
        animation: confetti-fall 3s ease-out forwards;
        animation-delay: var(--delay);
        transform: translateX(var(--x)) rotate(var(--rotate));
        opacity: 0.8;
    }

    .confetti.circle {
        border-radius: 50%;
    }

    .confetti.square {
        border-radius: 2px;
    }

    .confetti.triangle {
        clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
    }

    .confetti.star {
        clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
    }

    .mascot-control-panel {
        position: absolute;
        background-color: white;
        width: 220px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        bottom: 140%;
        left: 50%;
        transform: translateX(-50%);
        z-index: 5;
        overflow: hidden;
        transition: all 0.3s ease;
    }

    .mascot-control-panel.hidden {
        opacity: 0;
        visibility: hidden;
        transform: translateX(-50%) translateY(10px);
    }

    .panel-header {
        padding: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #eee;
    }

    .panel-header h3 {
        margin: 0;
        font-size: 16px;
    }

    .close-panel {
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        line-height: 1;
        padding: 2px 8px;
        border-radius: 50%;
    }

    .panel-body {
        padding: 10px;
    }

    .control-group {
        margin-bottom: 10px;
    }

    .control-group label {
        display: block;
        margin-bottom: 5px;
        font-size: 14px;
    }

    .control-group select,
    .control-group input[type="range"] {
        width: 100%;
        padding: 5px;
        border-radius: 5px;
        border: 1px solid #ccc;
    }

    /* Animations */
    @keyframes dance {
        0%, 100% { 
            transform: translateY(0) rotate(0) scale(1); 
        }
        25% { 
            transform: translateY(-5px) rotate(-3deg) scale(1.02);
        }
        75% { 
            transform: translateY(-5px) rotate(3deg) scale(1.02);
        }
    }

    @keyframes thinking {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.5); }
    }

    .dancing {
        animation: dance 1s infinite;
    }

    .dancing .arm.left {
        animation: robot-wave-left 1s infinite;
    }

    .dancing .arm.right {
        animation: robot-wave-right 1s infinite;
    }

    .dancing .leg.left {
        animation: robot-step-left 1s infinite;
    }

    .dancing .leg.right {
        animation: robot-step-right 1s infinite;
    }

    @keyframes glow {
        0%, 100% { box-shadow: 0 0 5px; }
        50% { box-shadow: 0 0 15px; }
    }

    @keyframes blink {
        0%, 48%, 52%, 100% { opacity: 1; }
        50% { opacity: 0; }
    }

    @keyframes robot-wave-left {
        0%, 100% { transform: rotate(-10deg); }
        50% { transform: rotate(-30deg) translateY(-2px); }
    }

    @keyframes robot-wave-right {
        0%, 100% { transform: rotate(10deg); }
        50% { transform: rotate(30deg) translateY(-2px); }
    }

    @keyframes robot-step-left {
        0%, 100% { transform: rotate(-5deg); }
        50% { transform: rotate(-15deg); }
    }

    @keyframes robot-step-right {
        0%, 100% { transform: rotate(5deg); }
        50% { transform: rotate(15deg); }
    }

    @keyframes confetti-fall {
        0% {
            transform: translateY(0) rotate(0) translateX(var(--x));
            opacity: 1;
        }
        100% {
            transform: translateY(300px) rotate(720deg) translateX(var(--x));
            opacity: 0;
            }
    }

    /* Themes */
    .theme-standard .mascot-body {
        background-color: #4FD1C5;
        border-color: #3B9A8F;
    }

    .theme-standard .mascot-head {
        background-color: #4FD1C5;
        border-color: #3B9A8F;
    }

    .theme-standard .eye {
        background-color: #000000;
        border-color: #3B9A8F;
    }

    .theme-standard .pupil {
        background-color: #48BB78;
    }

    .theme-standard .eye-light {
        background-color: #48BB78;
    }

    .theme-standard .mascot-antenna {
        background-color: #3B9A8F;
    }

    .theme-standard .antenna-ball {
        background-color: #FFD700;
        box-shadow: 0 0 5px #FFD700;
    }

    .theme-standard .arm-segment,
    .theme-standard .leg-segment {
        background-color: #3B9A8F;
    }

    .theme-standard .arm-joint,
    .theme-standard .leg-joint {
        background-color: #2D3748;
    }

    .theme-standard .finger {
        background-color: #3B9A8F;
    }

    .theme-standard .mascot-symbol {
        color: white;
        text-shadow: 2px 2px 0 #3B9A8F;
    }

    .theme-standard .mouth {
        background-color: #2D3748;
    }

    .theme-standard .mascot-speech-bubble {
        background-color: white;
        color: #2D3748;
    }

    .theme-standard .mascot-speech-bubble:after {
        border-color: white transparent;
    }

    .theme-standard .speech-buttons button {
        background-color: #4FD1C5;
        color: white;
    }

    .theme-standard .close-panel {
        color: #3B9A8F;
    }

    .theme-standard .close-panel:hover {
        background-color: #f0f0f0;
    }

    /* Dark theme */
    .theme-dark .mascot-body {
        background-color: #2D3748;
        border-color: #1A202C;
    }

    .theme-dark .mascot-head,
    .theme-dark .hand,
    .theme-dark .foot {
        background-color: #1A202C;
    }

    .theme-dark .eye {
        background-color: #A0AEC0;
    }

    .theme-dark .pupil {
        background-color: #000000;
    }

    .theme-dark .eye-light {
        background-color: #EDF2F7;
    }

    .theme-dark .mascot-antenna {
        background-color: #4A5568;
    }

    .theme-dark .antenna-ball {
        background-color: #F56565;
        box-shadow: 0 0 5px #F56565;
    }

    .theme-dark .arm-segment,
    .theme-dark .leg-segment {
        background-color: #4A5568;
    }

    .theme-dark .arm-joint,
    .theme-dark .leg-joint {
        background-color: #1A202C;
    }

    .theme-dark .finger {
        background-color: #4A5568;
    }

    .theme-dark .mascot-symbol {
        color: #F7FAFC;
        text-shadow: 2px 2px 0 #000;
    }

    .theme-dark .mouth {
        background-color: #F7FAFC;
    }

    .theme-dark .mascot-speech-bubble {
        background-color: #1A202C;
        color: #F7FAFC;
    }

    .theme-dark .mascot-speech-bubble:after {
        border-color: #1A202C transparent;
    }

    .theme-dark .speech-buttons button {
        background-color: #4A5568;
        color: #F7FAFC;
    }

    .theme-dark .mascot-control-panel {
        background-color: #2D3748;
        color: #F7FAFC;
    }

    .theme-dark .panel-header {
        border-color: #4A5568;
    }

    .theme-dark .close-panel {
        color: #F7FAFC;
    }

    .theme-dark .close-panel:hover {
        background-color: #4A5568;
    }

    .theme-dark .control-group select,
    .theme-dark .control-group input[type="range"] {
        background-color: #4A5568;
        color: #F7FAFC;
        border-color: #1A202C;
    }

    /* Pastel theme */
    .theme-pastel .mascot-body {
        background-color: #FCD5CE;
        border-color: #F8EDEB;
    }

    .theme-pastel .mascot-head,
    .theme-pastel .hand,
    .theme-pastel .foot {
        background-color: #F9DCC4;
    }

    .theme-pastel .eye {
        background-color: #FFFFFF;
    }

    .theme-pastel .pupil {
        background-color: #9D8189;
    }

    .theme-pastel .eye-light {
        background-color: #FFE5D9;
    }

    .theme-pastel .mascot-antenna {
        background-color: #F9DCC4;
    }

    .theme-pastel .antenna-ball {
        background-color: #FEC89A;
        box-shadow: 0 0 5px #FEC89A;
    }

    .theme-pastel .arm-segment,
    .theme-pastel .leg-segment {
        background-color: #F9DCC4;
    }

    .theme-pastel .arm-joint,
    .theme-pastel .leg-joint {
        background-color: #9D8189;
    }

    .theme-pastel .finger {
        background-color: #F9DCC4;
    }

    .theme-pastel .mascot-symbol {
        color: #9D8189;
        text-shadow: 2px 2px 0 #FFE5D9;
    }

    .theme-pastel .mouth {
        background-color: #9D8189;
    }

    .theme-pastel .mascot-speech-bubble {
        background-color: #F8EDEB;
        color: #9D8189;
    }

    .theme-pastel .mascot-speech-bubble:after {
        border-color: #F8EDEB transparent;
    }

    .theme-pastel .speech-buttons button {
        background-color: #FCD5CE;
        color: #9D8189;
    }

    /* Neon theme */
    .theme-neon .mascot-body {
        background-color: #000;
        border-color: #00FFFF;
        box-shadow: 0 0 10px #00FFFF, 0 0 20px #00FFFF;
    }

    .theme-neon .mascot-head,
    .theme-neon .hand,
    .theme-neon .foot {
        background-color: #000;
        border-color: #FF00FF;
        box-shadow: 0 0 5px #FF00FF;
    }

    .theme-neon .eye {
        background-color: #000;
        border: 2px solid #00FFFF;
        box-shadow: 0 0 5px #00FFFF;
    }

    .theme-neon .pupil {
        background-color: #00FFFF;
        box-shadow: 0 0 5px #00FFFF;
    }

    .theme-neon .eye-light {
        background-color: #FFFFFF;
        box-shadow: 0 0 5px #FFFFFF;
    }

    .theme-neon .mascot-antenna {
        background-color: #FF00FF;
        box-shadow: 0 0 5px #FF00FF;
    }

    .theme-neon .antenna-ball {
        background-color: #FFFF00;
        box-shadow: 0 0 10px #FFFF00;
    }

    .theme-neon .arm-segment,
    .theme-neon .leg-segment {
        background-color: #FF00FF;
        box-shadow: 0 0 5px #FF00FF;
    }

    .theme-neon .arm-joint,
    .theme-neon .leg-joint {
        background-color: #000;
        border-color: #00FFFF;
        box-shadow: 0 0 5px #00FFFF;
    }

    .theme-neon .finger {
        background-color: #00FFFF;
        box-shadow: 0 0 5px #00FFFF;
    }

    .theme-neon .mascot-symbol {
        color: #00FFFF;
        text-shadow: 0 0 5px #00FFFF, 0 0 10px #00FFFF;
    }

    .theme-neon .mouth {
        background-color: #FF00FF;
        box-shadow: 0 0 5px #FF00FF;
    }

    .theme-neon .mascot-speech-bubble {
        background-color: rgba(0, 0, 0, 0.8);
        color: #00FFFF;
        border: 2px solid #00FFFF;
        box-shadow: 0 0 10px #00FFFF;
    }

    .theme-neon .mascot-speech-bubble:after {
        border-color: #00FFFF transparent;
    }

    .theme-neon .speech-buttons button {
        background-color: #000;
        color: #00FFFF;
        border: 1px solid #00FFFF;
        box-shadow: 0 0 5px #00FFFF;
    }

    .theme-neon .speech-buttons button:hover {
        box-shadow: 0 0 10px #00FFFF;
    }

    /* Retro theme */
    .theme-retro .mascot-body {
        background-color: #3498db;
        border-color: #2980b9;
        box-shadow: 4px 4px 0 rgba(0,0,0,0.2);
    }

    .theme-retro .mascot-head,
    .theme-retro .hand,
    .theme-retro .foot {
        background-color: #2980b9;
        box-shadow: 2px 2px 0 rgba(0,0,0,0.2);
    }

    .theme-retro .eye {
        background-color: #FFFFFF;
        border: 2px solid #2c3e50;
    }

    .theme-retro .pupil {
        background-color: #2c3e50;
    }

    .theme-retro .eye-light {
        background-color: #FFFFFF;
    }

    .theme-retro .mascot-antenna {
        background-color: #2c3e50;
    }

    .theme-retro .antenna-ball {
        background-color: #e74c3c;
        box-shadow: 0 0 5px #c0392b;
    }

    .theme-retro .arm-segment,
    .theme-retro .leg-segment {
        background-color: #2980b9;
    }

    .theme-retro .arm-joint,
    .theme-retro .leg-joint {
        background-color: #2c3e50;
    }

    .theme-retro .finger {
        background-color: #2980b9;
    }

    .theme-retro .mascot-symbol {
        color: white;
        text-shadow: 2px 2px 0 #2c3e50, 4px 4px 0 rgba(0,0,0,0.1);
        font-family: 'Courier New', monospace;
    }

    .theme-retro .mouth {
        background-color: #2c3e50;
    }

    .theme-retro .mascot-speech-bubble {
        background-color: white;
        color: #2c3e50;
        border: 2px solid #2c3e50;
        box-shadow: 4px 4px 0 rgba(0,0,0,0.2);
    }

    .theme-retro .mascot-speech-bubble:after {
        border-color: white transparent;
    }

    .theme-retro .speech-buttons button {
        background-color: #e74c3c;
        color: white;
        border: none;
        box-shadow: 2px 2px 0 #c0392b;
    }

    .theme-retro .speech-buttons button:hover {
        transform: translateY(-2px);
        box-shadow: 2px 4px 0 #c0392b;
    }

    .theme-retro .speech-buttons button:active {
        transform: translateY(0);
        box-shadow: 0px 0px 0 #c0392b;
    }

    /* State styles */
    .state-happy .mascot-body {
        transform: scale(1.05);
    }

    .state-sad .mascot-body {
        transform: scale(0.95);
    }

    .state-thinking .antenna-ball {
        animation: thinking-antenna 1s infinite;
    }

    @keyframes thinking-antenna {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.3); }
    }

    .state-happy .eye {
        transform: scaleY(0.7) scale(0.9);
    }

    .state-sad .eye {
        transform: scaleY(1.1) translateY(1px) scale(0.9);
    }

    .state-thinking .pupil {
        animation: thinking-pupils 2s infinite;
    }

    @keyframes thinking-pupils {
        0%, 100% { transform: translate(-50%, -50%); }
        25% { transform: translate(-70%, -50%); }
        50% { transform: translate(-50%, -70%); }
        75% { transform: translate(-30%, -50%); }
    }

    /* Make responsive */
    @media (max-width: 768px) {
        .mascot-container {
            width: 100px;
            height: 140px;
        }

        .mascot-speech-bubble {
            min-width: 150px;
            max-width: 250px;
            font-size: 12px;
        }

        .mascot-symbol {
            font-size: 2em;
        }
    }

    @media (max-width: 480px) {
        .mascot-container {
            width: 80px;
            height: 120px;
        }

        .mascot-speech-bubble {
            min-width: 120px;
            max-width: 200px;
            font-size: 10px;
        }

        .mascot-symbol {
            font-size: 1.5em;
        }
    }
`;

document.head.appendChild(style);

// Export the class
window.MathMascot = MathMascot;