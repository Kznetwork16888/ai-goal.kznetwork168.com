import { gameData, gameState } from '../data.js';
import * as renderer from './renderer.js';
import { submitToBackend } from '../services/api.js';
import { aiService } from '../services/ai-feedback.js';

export function saveHistory(score) {
    let history = loadHistory();
    history.push({ score, date: new Date().toISOString() });
    localStorage.setItem('ai-game-history', JSON.stringify(history));
}

export function loadHistory() {
    try {
        return JSON.parse(localStorage.getItem('ai-game-history')) || [];
    } catch(e) {
        return [];
    }
}


let countdownInterval;

export function initGame() {
    gameState.questions = [...gameData.questions];
    gameState.tools = [...gameData.tools];
    gameState.filteredTools = [...gameState.tools];
    renderer.showScreen('start-screen');
}

export function startGame() {
    const shuffledQuestions = [...gameData.questions].sort(() => Math.random() - 0.5);
    
    Object.assign(gameState, {
        round: 1,
        score: 0,
        streak: 0,
        maxScore: 8,
        selectedTools: [],
        interviewData: null,
        currentQuestion: 0,
        questions: shuffledQuestions,
        questionStatuses: Array(shuffledQuestions.length).fill('pending'),
        showGoal: false,
        ballX: 0,
        goalEmoji: '',
        selectedAnswer: null,
        isAnswered: false,
        isCorrect: false,
        email: '',
        starAnswers: { situation: '', task: '', action: '', result: '' },
        selectedToolIndex: null,
        toolChoices: {},
        countdown: 85,
        timer: null,
        gameOver: false,
        showCelebration: false,
        revealedTools: new Set(),
        filteredTools: [...gameData.tools]
    });
    
    renderer.hideAllScreens();
    renderer.showScreen('r1-screen');
    renderer.renderPracticeQuestion();
}

export function selectAnswer(index) {
    if (gameState.isAnswered) return;
    
    const q = gameState.questions[gameState.currentQuestion];
    const correct = index === q.correct;
    
    gameState.selectedAnswer = index;
    gameState.isAnswered = true;
    gameState.isCorrect = correct;
    
    if (correct) {
        gameState.streak++;
        gameState.score += gameState.streak;
    } else {
        gameState.streak = 0;
    }
    
    gameState.questionStatuses[gameState.currentQuestion] = correct ? 'correct' : 'wrong';
    
    renderer.updateAfterAnswer(index, correct, q);
}

export function nextQuestion() {
    if (gameState.currentQuestion < gameState.questions.length - 1) {
        gameState.currentQuestion++;
        gameState.isAnswered = false;
        gameState.selectedAnswer = null;
        renderer.renderPracticeQuestion();
    } else {
        renderer.showScreen('r1-screen');
        document.querySelector('.result-wrap').style.display = 'block';
        document.querySelector('.next-btn').textContent = '進入 AI 道館對決';
        document.querySelector('.next-btn').onclick = proceedToRound2;
        
        document.querySelector('.stat-num').textContent = gameState.score;
        document.querySelectorAll('.stat-num')[1].textContent = gameState.streak;
    }
}

export function proceedToRound2() {
    renderer.hideAllScreens();
    renderer.showScreen('r2-screen');
    renderer.renderAIDojoMatch();
}

export function selectTool(index) {
    if (gameState.selectedTools.length >= 4) return;
    if (gameState.selectedTools.includes(index)) return;
    
    gameState.selectedTools.push(index);
    gameState.selectedToolIndex = index;
    
    const toolCards = document.querySelectorAll('.tool-card2');
    toolCards[index].classList.add('selected');
    
    renderer.updateSelectedToolsUI();
}

export function revealAllTools() {
    if (gameState.selectedTools.length !== 4) return;
    
    gameState.revealedTools = new Set(gameState.selectedTools);
    gameState.gameOver = true;
    
    const toolCards = document.querySelectorAll('.tool-card2');
    gameState.selectedTools.forEach(index => {
        toolCards[index].classList.add('selected');
    });
    
    setTimeout(() => {
        const r2qa = document.getElementById('r2-qa');
        r2qa.style.display = 'block';
        r2qa.style.animation = 'popUpFromBottom 0.4s ease-out forwards';
        setTimeout(() => r2qa.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
        
        renderer.renderSelectedToolsList();
        startCountdown();
    }, 500);
}

export function removeTool(index) {
    const toolIndex = gameState.selectedTools[index];
    gameState.selectedTools.splice(index, 1);
    
    const toolCards = document.querySelectorAll('.tool-card2');
    if (toolCards[toolIndex]) {
        toolCards[toolIndex].classList.remove('selected');
    }
    
    renderer.updateSelectedToolsUI();
    renderer.renderSelectedToolsList();
    renderer.prepareToolChoices();
}

export function selectToolChoice(index) {
    if (gameState.selectedTools.length >= 4) return;
    if (gameState.selectedTools.includes(index)) return;
    
    gameState.selectedTools.push(index);
    delete gameState.toolChoices[index];
    
    const toolCards = document.querySelectorAll('.tool-card2');
    if(toolCards[index]) toolCards[index].classList.add('selected');
    
    renderer.updateSelectedToolsUI();
    renderer.renderSelectedToolsList();
    renderer.prepareToolChoices();
}

export function filterTools(searchTerm) {
    if (!searchTerm) {
        gameState.filteredTools = [...gameState.tools];
        return;
    }
    
    gameState.filteredTools = gameState.tools.filter(tool => 
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
}

export function startCountdown() {
    gameState.countdown = 85;
    if (countdownInterval) clearInterval(countdownInterval);
    
    countdownInterval = setInterval(() => {
        gameState.countdown--;
        
        if (gameState.countdown <= 0) {
            clearInterval(countdownInterval);
            gameState.gameOver = true;
            showGameOver();
        }
    }, 1000);
}

export function showGameOver() {
    alert('時間到！遊戲結束。');
    resetGame();
}


export function proceedToRound3() {
    if (countdownInterval) clearInterval(countdownInterval);
    
    // Calculate total score based on selected tools HP + round 1 score
    let totalScore = gameState.score; // round 1
    const r2Score = gameState.selectedTools.reduce((acc, idx) => {
        return acc + parseInt(gameState.tools[idx].description.replace(/[^0-9]/g, '') || 0);
    }, 0);
    totalScore += Math.floor(r2Score / 10);
    
    saveHistory(totalScore);
    
    renderer.showTransitionScreen(totalScore);
}



export function goToInterview() {
    gameState.round = 3;
    renderer.hideAllScreens();
    renderer.showScreen('r3-screen');
    
    const step3 = document.querySelector('.r3-step-item:nth-child(3)');
    if (step3) {
        step3.classList.add('r3-step-done');
        const num = step3.querySelector('.r3-step-num');
        if (num) num.innerHTML = '✓';
        const txt = step3.querySelector('.r3-step-txt');
        if (txt) txt.style.color = '#fff';
    }
    
    const drawSection = document.getElementById('r3-draw-section');
    if (drawSection) {
        drawSection.className = 'r3-draw-section';
        drawSection.style.display = 'block';
    }
}


export function updateStarAnswer(field, value) {
    gameState.starAnswers[field] = value;
    
    const fieldIndex = field === 'situation' ? 1 : field === 'task' ? 2 : field === 'action' ? 3 : 4;
    const charCount = document.querySelector(`.r3-sv-field:nth-child(${fieldIndex}) .r3-sv-char`);
    if (charCount) {
        charCount.textContent = `${value.length}/5`;
    }
    
    if (value.length >= 5) {
        document.querySelector(`.r3-sv-field:nth-child(${fieldIndex})`).style.borderColor = '#43a047';
    }
}

export function validateEmail(email) {
    const regex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    const errorDiv = document.getElementById('email-error');
    const submitBtn = document.querySelector('#r3-draw-section button');
    
    if (regex.test(email)) {
        if(errorDiv) errorDiv.style.display = 'none';
        if(submitBtn) submitBtn.disabled = false;
        gameState.email = email;
    } else {
        if(errorDiv) errorDiv.style.display = 'block';
        if(submitBtn) submitBtn.disabled = true;
        gameState.email = '';
    }
}

export function canSubmit() {
    return !!(gameState.starAnswers.situation &&
        gameState.starAnswers.task &&
        gameState.starAnswers.action &&
        gameState.starAnswers.result &&
        gameState.email &&
        /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(gameState.email));
}

export async function submitInterview() {
    if (!canSubmit()) return;
    
    gameState.interviewData = {
        starAnswers: gameState.starAnswers,
        email: gameState.email,
        timestamp: new Date().toISOString()
    };
    
    // Calculate total score based on selected tools HP + round 1 score
    let totalScore = gameState.score;
    const r2Score = gameState.selectedTools.reduce((acc, idx) => {
        return acc + parseInt(gameState.tools[idx].description.replace(/[^0-9]/g, '') || 0);
    }, 0);
    totalScore += Math.floor(r2Score / 10);

    const dataToSubmit = {
        email: gameState.email,
        score: totalScore,
        starAnswers: gameState.starAnswers,
        radarData: gameState.selectedTools
    };

    try {
        await submitToBackend(dataToSubmit);
    } catch(e) {
        console.error('Submit failed', e);
    }
    
    renderer.showScreen('draw-result-screen');
    const drawResultDiv = document.querySelector('#draw-result-screen > div');
    if(drawResultDiv) {
        drawResultDiv.innerHTML = `
            <div style="font-size:28px;margin-bottom:.35rem">🎉 中獎了！</div>
            <div style="font-size:15px;font-weight:700;color:#fff;margin-bottom:.3rem">恭喜您獲得 USD 50 獎金！</div>
            <div style="font-size:12.5px;color:rgba(255,255,255,0.85);line-height:1.6;margin-bottom:.6rem">您已成功通過 TPV AI 世界盃測試，獲得抽獎資格</div>
            <div style="background:rgba(255,255,255,0.15);border-radius:8px;padding:.45rem .75rem;display:inline-block;margin-bottom:.4rem">
                <div style="font-size:13.5px;font-weight:700;color:#fff;word-break:break-all">${gameState.email}</div>
            </div>
            <div style="font-size:11px;color:rgba(255,255,255,0.6)">活動截止日期以官方公告為準</div>
            <div id="ai-feedback-container" style="margin-top:1rem;padding:1rem;background:rgba(0,0,0,0.2);border-radius:8px;font-size:13px;color:#e8f5f1;text-align:left;">
                ⏳ AI 教練正在生成回饋...
            </div>
        `;
    }

    try {
        const feedback = await aiService.generateInterviewFeedback(gameState.starAnswers);
        const fbContainer = document.getElementById('ai-feedback-container');
        if (fbContainer) {
            fbContainer.style.fontFamily = "'Courier New', monospace";
            fbContainer.style.color = "#0f0";
            fbContainer.innerHTML = `<strong style="color:#0f0; text-shadow: 0 0 5px #0f0;">[INCOMING AI TRANSMISSION...]</strong><br><br><span id="typewriter-text"></span><span class="typewriter-cursor"></span>`;
            
            const textElement = document.getElementById('typewriter-text');
            const formattedText = feedback.replace(/\n/g, '<br>');
            
            let i = 0;
            let isTag = false;
            let currentText = "";
            
            function typeNext() {
                if (i < formattedText.length) {
                    let char = formattedText.charAt(i);
                    currentText += char;
                    textElement.innerHTML = currentText;
                    
                    if (char === '<') isTag = true;
                    if (char === '>') isTag = false;
                    
                    i++;
                    if (isTag) {
                        typeNext();
                    } else {
                        setTimeout(typeNext, 15);
                    }
                }
            }
            typeNext();
        }
    } catch(err) {
        console.error('AI feedback error:', err);
        const fbContainer = document.getElementById('ai-feedback-container');
        if (fbContainer) fbContainer.innerHTML = '<span style="color:red">[ERROR] AI TRANSMISSION FAILED.</span>';
    }
}

export function resetGame() {
    startGame();
}
