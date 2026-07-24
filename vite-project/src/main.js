import './style.css';
import config from './data/config.json';

const gameData = {
    questions: config.questions,
    tools: config.tools
};

const gameState = {
    round: 0,
    score: 0,
    streak: 0,
    maxScore: 8,
    selectedTools: [],
    interviewData: null,
    currentQuestion: 0,
    questions: [],
    questionStatuses: [],
    showGoal: false,
    ballX: 0,
    goalEmoji: '',
    selectedAnswer: null,
    isAnswered: false,
    isCorrect: false,
    email: '',
    starAnswers: {
        situation: '',
        task: '',
        action: '',
        result: ''
    },
    selectedToolIndex: null,
    toolChoices: {},
    countdown: 85,
    timer: null,
    gameOver: false,
    showCelebration: false,
    revealedTools: new Set(),
    filteredTools: [],
    language: 'zh-TW'
};

const translations = {
    'zh-TW': {
        'TPV Group × AI World Cup': 'Kznetwork168 × AI 世界盃',
        '第一關：練習場選拔': '🏆 第一關：練習場選拔',
        '8 球定生死，踢進才能晉身世界盃！': '8 球定生死，踢進才能晉身世界盃！',
        '你的隊伍': '你的隊伍',
        '恭喜通過!': '恭喜通過！',
        '你通過了練習場選拔測試': '你通過了練習場選拔測試',
        '得分': '得分',
        '連續 goals': '連續 goals',
        '進入 AI 道館對決': '進入 AI 道館對決',
        '第二關：AI 道館對決': '第二關：AI 道館對決',
        '任務': '任務',
        '85 秒內選擇 4 個 AI 工具完成任務': '85 秒內選擇 4 個 AI 工具完成任務',
        '揭開結果': '揭開結果',
        '抽獎資格': '抽獎資格',
        '第三關：賽後專訪': '第三關：賽後專訪',
        '請用 STAR 框架分享一個你打算用 AI 工具改善工作的場景': '請用 STAR 框架分享一個你打算用 AI 工具改善工作的場景',
        '情境（Situation）': '情境（Situation）',
        '任務（Task）': '任務（Task）',
        '行動（Action）': '行動（Action）',
        '成果（Result）': '成果（Result）',
        '每格至少填 5 個字，4 格都完成即可解鎖抽獎': '每格至少填 5 個字，4 格都完成即可解鎖抽獎',
        '恭喜通過！': '恭喜通過！',
        '你的 AI 技能一流！': '你的 AI 技能一流！',
        '世界盃 AI 戰隊總教練': '世界盃 AI 戰隊總教練',
        '最終得分': '最終得分',
        '再來一次': '再來一次',
        '🎉 中獎了！': '🎉 中獎了！',
        '恭喜您獲得 USD 50 獎金！': '恭喜您獲得 USD 50 獎金！'
    },
    'en': {
        'TPV Group × AI World Cup': 'Kznetwork168 × AI World Cup',
        '第一關：練習場選拔': '🏆 Round 1: Practice Field Selection',
        '8 球定生死，踢進才能晉身世界盃！': '8 goals decide life and death, score to advance to World Cup!',
        '你的隊伍': 'Your Team',
        '恭喜通過!': 'Congratulations!',
        '你通過了練習場選拔測試': 'You have passed the Practice Field Selection test',
        '得分': 'Score',
        '連續 goals': 'Streak',
        '進入 AI 道館對決': 'Enter AI Dojo Match',
        '第二關：AI 道館對決': 'Second Round: AI Dojo Match',
        '任務': 'Mission',
        '85 秒內選擇 4 個 AI 工具完成任務': 'Select 4 AI tools within 85 seconds to complete the mission',
        '揭開結果': 'Reveal Results',
        '抽獎資格': 'Prize Draw Entry',
        '第三關：賽後專訪': 'Third Round: Post-Match Interview',
        '請用 STAR 框架分享一個你打算用 AI 工具改善工作的場景': 'Please share a scenario where you plan to use AI tools to improve your work using the STAR framework',
        '情境（Situation）': 'Situation',
        '任務（Task）': 'Task',
        '行動（Action）': 'Action',
        '成果（Result）': 'Result',
        '每格至少填 5 個字，4 格都完成即可解鎖抽獎': 'Each field requires at least 5 characters, complete all 4 fields to unlock the prize draw',
        '恭喜通過！': 'Congratulations!',
        '你的 AI 技能一流！': 'Your AI skills are excellent!',
        '世界盃 AI 戰隊總教練': 'AI World Cup Team Coach',
        '最終得分': 'Final Score',
        '再來一次': 'Try Again',
        '🎉 中獎了！': '🎉 Won!',
        '恭喜您獲得 USD 50 獎金！': 'Congratulations! You won USD 50!'
    }
};

document.addEventListener('DOMContentLoaded', function() {
    initGame();
});

window.selectLang = function(lang) {
    gameState.language = lang;
    const btns = document.querySelectorAll('.lm-btn');
    btns.forEach(btn => {
        const text = btn.textContent.trim().toLowerCase();
        const isTarget = (lang === 'en' && text.includes('english')) || (lang === 'zh-TW' && (text.includes('繁體') || text.includes('中文')));
        if (isTarget) {
            btn.classList.add('active');
            const check = btn.querySelector('.lm-check');
            if (check) check.style.opacity = '1';
        } else {
            btn.classList.remove('active');
            const check = btn.querySelector('.lm-check');
            if (check) check.style.opacity = '0';
        }
    });
    updateLanguage();
};

window.confirmLang = function() {
    document.getElementById('lang-modal-overlay').style.display = 'none';
    updateLanguage();
    startGame();
};

window.selectStartLang = function(lang) {
    gameState.language = lang;
    const btns = document.querySelectorAll('.start-lang-btn');
    btns.forEach(btn => {
        const text = btn.textContent.trim().toLowerCase();
        const isTarget = (lang === 'en' && text.includes('english')) || (lang === 'zh-TW' && (text.includes('繁體') || text.includes('中文')));
        if (isTarget) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    updateLanguage();
};

window.startGame = startGame;
window.restartRound1 = function() {
    startGame();
};

function startGame() {
    Object.assign(gameState, {
        round: 1,
        score: 0,
        correctCount: 0,
        streak: 0,
        maxScore: 8,
        selectedTools: [],
        interviewData: null,
        currentQuestion: 0,
        questions: [...gameData.questions].sort(() => Math.random() - 0.5).slice(0, 8),
        questionStatuses: Array(8).fill('pending'),
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

    const pitchOverlay = document.getElementById('pitch-score-overlay');
    if (pitchOverlay) pitchOverlay.style.display = 'none';

    const resultWrap = document.querySelector('.result-wrap');
    if (resultWrap) resultWrap.style.display = 'none';

    const qaBox = document.querySelector('.qa');
    if (qaBox) qaBox.style.display = 'block';
    
    hideAllScreens();
    showScreen('r1-screen');
    renderPracticeQuestion();
}

function initGame() {
    gameState.questions = [...gameData.questions];
    gameState.tools = [...gameData.tools];
    gameState.filteredTools = [...gameState.tools];
    showScreen('start-screen');
}

function hideAllScreens() {
    const screens = document.querySelectorAll('[id$="-screen"]');
    screens.forEach(screen => {
        screen.style.display = 'none';
    });
    document.getElementById('lang-modal-overlay').style.display = 'none';
    document.getElementById('transition-screen').style.display = 'none';
}

function showScreen(screenId) {
    hideAllScreens();
    const screenEl = document.getElementById(screenId);
    if (screenEl) {
        screenEl.style.display = 'block';
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
}

function updateLanguage() {
    const isEn = gameState.language === 'en';

    // Modal Overlay
    const lmSub = document.querySelector('.lm-sub');
    if (lmSub) lmSub.textContent = isEn ? 'Select your preferred language to continue' : '請選擇或點擊您喜歡的語言繼續體驗遊戲';
    const lmConfirm = document.querySelector('.lm-confirm');
    if (lmConfirm) lmConfirm.textContent = isEn ? 'Confirm' : '確認';
    const lmHint = document.querySelector('.lm-hint');
    if (lmHint) lmHint.textContent = isEn ? 'You can change your choice anytime' : '您可以隨時更改選擇';

    // Start Screen
    const logoEl = document.querySelector('.start-logo');
    if (logoEl) logoEl.textContent = 'Kznetwork168 × AI World Cup';

    const titleEls = document.querySelectorAll('.start-title');
    if (titleEls.length >= 2) {
        titleEls[0].textContent = isEn ? 'AI World Cup Team' : '世界盃 AI 戰隊';
        titleEls[1].innerHTML = isEn 
            ? 'Kznetwork168 AI World Cup <span style="color:#5DCAA5">AI Team</span>'
            : 'Kznetwork168 AI World Cup <span style="color:#5DCAA5">AI Team</span>';
    }

    const taglineEl = document.querySelector('.start-tagline');
    if (taglineEl) {
        taglineEl.textContent = isEn
            ? '🏆 Round 1: Selection → 🏟️ Round 2: Dojo Battle → 🎙️ Round 3: Interview'
            : '🏆 第一關：練習場選拔 → 🏟️ 第二關：AI 道館對決 → 🎙️ 第三關：賽後專訪';
    }

    const cardLabels = document.querySelectorAll('.start-card-label');
    if (cardLabels.length >= 3) {
        cardLabels[0].textContent = isEn ? 'AI Quiz' : 'AI 知識測驗';
        cardLabels[1].textContent = isEn ? 'Challenge Mode' : '挑戰賽制';
        cardLabels[2].textContent = isEn ? 'Prize Draw' : '抽獎體驗';
    }

    const startCta = document.querySelector('.start-cta');
    if (startCta) {
        startCta.textContent = isEn ? 'Accept Invitation & Start ⚽' : '接受邀請，開始選拔 ⚽';
    }

    const startCtaSub = document.querySelector('.start-cta-sub');
    if (startCtaSub) {
        startCtaSub.textContent = isEn ? '~5 mins · 14 questions in total' : '约 5 分钟完成 · 三关共 14 题';
    }

    const startFooter = document.querySelector('.start-footer');
    if (startFooter) {
        startFooter.textContent = isEn ? 'Hosted by Kznetwork168' : '本活動由 Kznetwork168 主辦';
    }

    // Round 1 Header & Scoreboard
    const hLogo = document.querySelector('#r1-screen .header-logo');
    if (hLogo) hLogo.textContent = 'Kznetwork168 × AI World Cup';

    const hTitle = document.querySelector('#r1-screen .header-title');
    if (hTitle) hTitle.textContent = isEn ? '🏆 Round 1: Practice Field Selection' : '🏆 第一關：練習場選拔';

    const hSub = document.querySelector('#r1-screen .header-sub');
    if (hSub) hSub.textContent = isEn 
        ? '8 goals decide your fate! Score to qualify for the World Cup!' 
        : '8 球定生死，踢進才能晉身世界盃！';

    const sbarTeam = document.querySelector('.sbar-team');
    if (sbarTeam) sbarTeam.textContent = isEn ? 'Your Team' : '你的隊伍';

    const restartBtn = document.querySelector('.restart-r1-btn');
    if (restartBtn) restartBtn.textContent = isEn ? '🔄 Play Again' : '🔄 再重玩一次';

    const proceedR2Btn = document.querySelector('.proceed-r2-btn');
    if (proceedR2Btn) proceedR2Btn.textContent = isEn ? 'Proceed to AI Dojo Match ➔' : '進入 AI 道館對決 ➔';

    const statLabels = document.querySelectorAll('.stat-label');
    if (statLabels.length >= 2) {
        statLabels[0].textContent = isEn ? 'Score (100 pts)' : '得分 (100分制)';
        statLabels[1].textContent = isEn ? 'Goals Scored' : '進球數';
    }

    // Round 2 Prep & Battle Headers
    const r2BadgePill = document.querySelector('#r2-prep-section .r2-badge-pill');
    if (r2BadgePill) r2BadgePill.textContent = isEn ? 'MISSION' : '任務';

    const r2Title = document.querySelector('#r2-prep-section .r2-title');
    if (r2Title) r2Title.textContent = isEn ? '🏟️ Round 2: AI Dojo Match' : '🏟️ 第二關：AI 道館對決';

    const r2Sub = document.querySelector('#r2-prep-section .r2-sub');
    if (r2Sub) r2Sub.textContent = isEn
        ? 'Select 4 AI cards to build your tactical lineup (Click to toggle)'
        : '請點選下方卡牌構建你的 4 個 AI 戰術陣容 (可再點擊取消更換)';

    const r2Source = document.querySelector('#r2-prep-section .r2-source');
    if (r2Source) r2Source.textContent = isEn
        ? 'Data Source: Hugging Face, GitHub & Enterprise AI Case Studies'
        : '資料來源：Hugging Face、GitHub 和企業 AI 實戰案例庫';

    updateRound2UI();

    // Round 3
    const stepTxts = document.querySelectorAll('#r3-screen .r3-step-txt');
    if (stepTxts.length >= 3) {
        stepTxts[0].textContent = isEn ? 'Practice Selection' : '練習場選拔';
        stepTxts[1].textContent = isEn ? 'AI Dojo Battle' : 'AI 道館對決';
        stepTxts[2].textContent = isEn ? 'Post-Match Interview' : '賽後專訪';
    }

    const starLabel = document.querySelector('.r3-qcard-label');
    if (starLabel) starLabel.textContent = isEn ? 'STAR Framework' : 'STAR 訪談框架';

    const starQ = document.querySelector('.r3-qcard-question');
    if (starQ) starQ.textContent = isEn
        ? 'Please share a scenario where you plan to use AI tools to improve work using the STAR framework.'
        : '請用 STAR 框架分享一個你打算用 AI 工具改善工作的場景';

    const sTitle = document.querySelector('.r3-sv-field:nth-child(1) .r3-sv-title');
    if (sTitle) sTitle.textContent = isEn ? 'Situation' : '情境（Situation）';
    const sHint = document.querySelector('.r3-sv-field:nth-child(1) .r3-sv-hint');
    if (sHint) sHint.textContent = isEn 
        ? 'Which part of your current work takes the most time or is repetitive?' 
        : '你現在工作中哪個環節最花時間、最重複、最讓你覺得「這個不應該這麼麻煩」？';
    const sArea = document.querySelector('.r3-sv-field:nth-child(1) textarea');
    if (sArea) sArea.placeholder = isEn ? 'Please describe your work situation...' : '請描述你的工作情境...';

    const tTitle = document.querySelector('.r3-sv-field:nth-child(2) .r3-sv-title');
    if (tTitle) tTitle.textContent = isEn ? 'Task' : '任務（Task）';
    const tHint = document.querySelector('.r3-sv-field:nth-child(2) .r3-sv-hint');
    if (tHint) tHint.textContent = isEn 
        ? 'What is the goal of this task? What do you or your manager expect?' 
        : '這件事的目標是什麼？主管或自己期待什麼結果？';
    const tArea = document.querySelector('.r3-sv-field:nth-child(2) textarea');
    if (tArea) tArea.placeholder = isEn ? 'Please describe your task goal...' : '請描述你的任務目標...';

    const aTitle = document.querySelector('.r3-sv-field:nth-child(3) .r3-sv-title');
    if (aTitle) aTitle.textContent = isEn ? 'Action' : '行動（Action）';
    const aHint = document.querySelector('.r3-sv-field:nth-child(3) .r3-sv-hint');
    if (aHint) aHint.textContent = isEn 
        ? 'Which AI tool do you plan to use and how? State clearly in one sentence.' 
        : '你打算用哪個 AI 工具、怎麼用？一句話說清楚具體做法。';
    const aArea = document.querySelector('.r3-sv-field:nth-child(3) textarea');
    if (aArea) aArea.placeholder = isEn ? 'Please describe your AI tool action...' : '請描述你的 AI 工具應用...';

    const rTitle = document.querySelector('.r3-sv-field:nth-child(4) .r3-sv-title');
    if (rTitle) rTitle.textContent = isEn ? 'Result' : '成果（Result）';
    const rHint = document.querySelector('.r3-sv-field:nth-child(4) .r3-sv-hint');
    if (rHint) rHint.textContent = isEn 
        ? 'If successful, how much time or efficiency do you expect to save?' 
        : '如果成功，你期待節省多少時間、提升多少效率、或達成什麼具體改變？';
    const rArea = document.querySelector('.r3-sv-field:nth-child(4) textarea');
    if (rArea) rArea.placeholder = isEn ? 'Please describe your expected result...' : '請描述你預期的成果...';

    const r3Hint = document.querySelector('.r3-step1-hint');
    if (r3Hint) r3Hint.textContent = isEn 
        ? 'Fill at least 5 characters per box, complete all 4 to unlock prize draw' 
        : '每格至少填 5 個字，4 格都完成即可解鎖抽獎';

    const drawTitle = document.querySelector('#r3-draw-section div:nth-child(1)');
    if (drawTitle) drawTitle.textContent = isEn ? '🎁 AI Interview Prize Draw' : '🎁 AI 專訪抽獎解鎖';

    const drawSub = document.querySelector('#r3-draw-section div:nth-child(2)');
    if (drawSub) drawSub.textContent = isEn 
        ? 'After completing the STAR framework, you will enter the USD 50 prize draw! Lucky winners receive USD 50 from Kznetwork168.' 
        : '完成 STAR 框架填答後，您將有機會獲得 USD 50 抽獎資格！每名幸運得獎者，Kznetwork168 送出 USD 50 獎金。';

    const emailLabel = document.querySelector('#r3-draw-section span');
    if (emailLabel) emailLabel.textContent = isEn ? 'Enter Email to join draw:' : '輸入 Email 參加抽獎：';

    const emailError = document.getElementById('email-error');
    if (emailError) emailError.textContent = isEn ? 'Please enter a valid email address' : '請輸入有效的 Email 地址';

    updateStarSubmitButton();

    // Draw Result Screen
    renderDrawResultScreen();
}

function renderDrawResultScreen() {
    const isEn = gameState.language === 'en';
    const container = document.querySelector('#draw-result-screen > div');
    if (!container) return;

    const children = container.children;
    if (children.length >= 5) {
        children[0].textContent = isEn ? '🎉 Entry Confirmed!' : '🎉 中獎了！';
        children[1].textContent = isEn ? 'Congratulations on entering the USD 50 prize draw!' : '恭喜您獲得 USD 50 獎金！';
        children[2].textContent = isEn 
            ? 'You have successfully passed the Kznetwork168 AI World Cup test and qualified for the lucky draw.' 
            : '您已成功通過 Kznetwork168 AI 世界盃測試，獲得抽獎資格';
        
        const emailDiv = children[3].querySelector('div');
        if (emailDiv && gameState.email) {
            emailDiv.textContent = gameState.email;
        }

        children[4].textContent = isEn ? 'Event deadline subject to official announcement' : '活動截止日期以官方公告為準';
    }

    const resetBtn = document.querySelector('#draw-result-screen button');
    if (resetBtn) {
        resetBtn.textContent = isEn ? 'Play Again' : '再來一次';
    }
}

function renderPracticeQuestion() {
    const isEn = gameState.language === 'en';
    const q = gameState.questions[gameState.currentQuestion];
    
    const liveScore = Math.round(((gameState.correctCount || 0) / gameState.maxScore) * 100);
    const scoreText = isEn 
        ? `${gameState.correctCount || 0} / ${gameState.maxScore} Goals (${liveScore} pts)` 
        : `${gameState.correctCount || 0} / ${gameState.maxScore} 進球 (${liveScore}分)`;
    document.querySelector('.sbar-score').textContent = scoreText;
    
    const pips = document.querySelectorAll('.pip');
    pips.forEach((pip, index) => {
        pip.className = 'pip';
        if (index < gameState.currentQuestion) {
            pip.classList.add(gameState.questionStatuses[index] === 'correct' ? 'ok' : 'ko');
        } else if (index === gameState.currentQuestion) {
            pip.classList.add('cur');
        }
    });
    
    document.querySelector('.q-cat').textContent = q.category || '';
    document.querySelector('.q-text').textContent = (isEn && q.textEn) ? q.textEn : (q.text || '');
    document.querySelector('.q-prompt').textContent = (isEn && q.promptEn) ? q.promptEn : (q.prompt || '');
    
    const choices = document.querySelectorAll('.cb');
    const currentChoices = (isEn && q.choicesEn) ? q.choicesEn : q.choices;
    choices.forEach((choice, index) => {
        if (currentChoices && currentChoices[index]) {
            choice.textContent = currentChoices[index];
            choice.style.display = 'block';
        } else {
            choice.style.display = 'none';
        }
        choice.className = 'cb';
        choice.disabled = false;
    });
    
    gameState.selectedAnswer = null;
    gameState.isAnswered = false;
    gameState.isCorrect = false;
    document.querySelector('.fb').style.display = 'none';
    
    const expContainer = document.querySelector('.q-explanation');
    if (expContainer) {
        expContainer.style.display = 'none';
        expContainer.classList.remove('wrong-exp');
    }

    const nextBtn = document.querySelector('.next-btn');
    if (nextBtn) {
        nextBtn.style.display = 'none';
        nextBtn.disabled = false;
        nextBtn.textContent = isEn ? 'Next Question ➔' : '下一題 ➔';
    }

    const pitchOverlay = document.getElementById('pitch-score-overlay');
    if (pitchOverlay) pitchOverlay.style.display = 'none';
    
    // 重置球場動畫狀態
    const ball = document.getElementById('scene-ball');
    const gk = document.getElementById('scene-goalkeeper');
    const kicker = document.getElementById('scene-kicker');
    const goalText = document.getElementById('goal-text');

    if (ball) ball.className = 'scene-ball';
    if (gk) gk.className = 'scene-goalkeeper';
    if (kicker) kicker.className = 'scene-kicker';
    if (goalText) goalText.className = 'goal-text';

    if (gameState.isAnswered && nextBtn) {
        nextBtn.style.display = 'block';
    }
}

let nextBtnTimer = null;

window.selectAnswer = function(index) {
    if (gameState.isAnswered) return;
    
    const isEn = gameState.language === 'en';
    const q = gameState.questions[gameState.currentQuestion];
    const correct = index === q.correct;
    
    gameState.selectedAnswer = index;
    gameState.isAnswered = true;
    gameState.isCorrect = correct;
    
    const choices = document.querySelectorAll('.cb');
    choices[index].classList.add(correct ? 'correct' : 'wrong');
    
    if (q.correct !== index && choices[q.correct]) {
        choices[q.correct].classList.add('correct');
    }
    
    gameState.questionStatuses[gameState.currentQuestion] = correct ? 'correct' : 'wrong';
    
    // 1. 顯示答題反饋與說明
    const fbEl = document.querySelector('.fb');
    const expEl = document.querySelector('.q-explanation');
    const expTextEl = document.querySelector('.exp-text');
    const expTitleEl = document.querySelector('.exp-title');
    const nextBtn = document.querySelector('.next-btn');

    const currentChoices = (isEn && q.choicesEn) ? q.choicesEn : q.choices;

    if (correct) {
        gameState.correctCount = (gameState.correctCount || 0) + 1;
        gameState.streak++;
        const liveScore = Math.round((gameState.correctCount / gameState.maxScore) * 100);
        document.querySelector('.sbar-score').textContent = isEn 
            ? `${gameState.correctCount} / ${gameState.maxScore} Goals (${liveScore} pts)` 
            : `${gameState.correctCount} / ${gameState.maxScore} 進球 (${liveScore}分)`;
        fbEl.textContent = isEn ? '✅ Correct! Scored in top corner!' : '✅ 正確！球踢進了死角！';
        fbEl.className = 'fb ok';
        if (expEl) expEl.classList.remove('wrong-exp');
        showGoalAnimation(q.emoji || '⚽', true);
    } else {
        gameState.streak = 0;
        const liveScore = Math.round(((gameState.correctCount || 0) / gameState.maxScore) * 100);
        document.querySelector('.sbar-score').textContent = isEn 
            ? `${gameState.correctCount || 0} / ${gameState.maxScore} Goals (${liveScore} pts)` 
            : `${gameState.correctCount || 0} / ${gameState.maxScore} 進球 (${liveScore}分)`;
        fbEl.textContent = isEn ? `❌ Wrong! Correct answer: ${currentChoices[q.correct]}` : `❌ 錯誤！正確答案是：${q.choices[q.correct]}`;
        fbEl.className = 'fb ko';
        if (expEl) expEl.classList.add('wrong-exp');
        showGoalAnimation('❌', false);
    }
    
    // 顯示解答說明
    if (expEl && expTextEl) {
        if (expTitleEl) {
            expTitleEl.textContent = isEn ? '💡 Concept Explanation & Solution:' : '💡 觀念解析與解答說明：';
        }
        expTextEl.textContent = (isEn && q.explanationEn) ? q.explanationEn : (q.explanation || '理解此題觀念能幫助您掌握關鍵 AI 能力。');
        expEl.style.display = 'block';
    }

    fbEl.style.display = 'block';
    nextBtn.style.display = 'block';

    // 2. 停留時間機制：若回答錯誤，停留顯示解答說明的時間加倍（倒數 3 秒強迫閱讀說明）
    if (!correct) {
        let remainingSeconds = 3;
        nextBtn.disabled = true;
        nextBtn.textContent = isEn ? `Please read explanation (${remainingSeconds}s...)` : `請閱讀解答說明 (${remainingSeconds}s...)`;

        if (nextBtnTimer) clearInterval(nextBtnTimer);
        nextBtnTimer = setInterval(() => {
            remainingSeconds--;
            if (remainingSeconds > 0) {
                nextBtn.textContent = isEn ? `Please read explanation (${remainingSeconds}s...)` : `請閱讀解答說明 (${remainingSeconds}s...)`;
            } else {
                clearInterval(nextBtnTimer);
                nextBtn.disabled = false;
                nextBtn.textContent = isEn ? 'Next Question ➔' : '下一題 ➔';
            }
        }, 1000);
    } else {
        nextBtn.disabled = false;
        nextBtn.textContent = isEn ? 'Next Question ➔' : '下一題 ➔';
    }
};

function showGoalAnimation(emoji, isCorrect) {
    gameState.showGoal = true;
    gameState.goalEmoji = emoji;
    
    const ball = document.getElementById('scene-ball');
    const gk = document.getElementById('scene-goalkeeper');
    const kicker = document.getElementById('scene-kicker');
    const goalText = document.getElementById('goal-text');

    if (!ball || !gk || !kicker || !goalText) return;

    // 重置動畫類別
    ball.className = 'scene-ball';
    gk.className = 'scene-goalkeeper';
    kicker.className = 'scene-kicker';
    goalText.className = 'goal-text';

    // 觸發重新繪製
    void ball.offsetWidth;

    // 1. 踢球員踢球動畫
    kicker.classList.add('kick-anim');

    setTimeout(() => {
        if (isCorrect) {
            // 答對：足球飛入右上角死角，守門員向左撲空！
            ball.classList.add('shoot-goal');
            gk.classList.add('dive-miss');
            setTimeout(() => {
                goalText.textContent = 'GOAL! ⚽ 成功進球！';
                goalText.className = 'goal-text show-goal';
            }, 300);
        } else {
            // 答錯：足球飛向中央，守門員跳起精準攔截！停留時間加倍
            ball.classList.add('shoot-blocked');
            gk.classList.add('dive-save');
            setTimeout(() => {
                goalText.textContent = 'SAVED! ❌ 守門員攔截！';
                goalText.className = 'goal-text show-blocked';
            }, 300);
        }
    }, 150);
}

window.nextQuestion = function() {
    if (gameState.currentQuestion < gameState.questions.length - 1) {
        gameState.currentQuestion++;
        renderPracticeQuestion();
    } else {
        // 第一關結束，依百分制計算最終分數與評等
        const isEn = gameState.language === 'en';
        const finalScore = Math.round(((gameState.correctCount || 0) / gameState.maxScore) * 100);
        gameState.score = finalScore;

        let badgeIcon = '⚽️⚡';
        let badgeTitle = isEn ? 'Below 60 pts (Fail, practice needed)' : '60分以下 (不及格，需多努力學習)';
        let badgeDesc = isEn 
            ? 'Needs more practice 😢 Click "Play Again" below to review concepts!' 
            : '不及格，需多努力學習 😢 建議點擊下方「再重玩一次」練習觀念與能力！';
        let badgeBg = 'linear-gradient(135deg, #fcebeb, #fff5f5)';
        let borderColor = '#e74c3c';
        let textColor = '#c53030';

        if (finalScore >= 81) {
            badgeIcon = '⚽️🔥👑';
            badgeTitle = isEn ? '81~100 pts (AI Master, unstoppable)' : '81~100分 (大神降臨，難不倒你)';
            badgeDesc = isEn 
                ? 'AI Master! 🔥👑 Outstanding performance with strong tactical AI skills!' 
                : '大神降臨，難不倒你 🔥👑 極致完美的表現！你已具備強大的 AI 戰術運用能力！';
            badgeBg = 'linear-gradient(135deg, #fffbea, #fff8e1)';
            borderColor = '#f1c40f';
            textColor = '#b7791f';
        } else if (finalScore >= 61) {
            badgeIcon = '⚽️✨';
            badgeTitle = isEn ? '61~80 pts (Getting Better, good application)' : '61~80分 (漸入佳境，懂得運用)';
            badgeDesc = isEn 
                ? 'Good progress! ⚽ Solid AI concepts, proceed to Round 2 or aim for 100!' 
                : '漸入佳境，懂得運用 ⚽ 已經具備不錯的 AI 觀念，可直接晉級第二關或挑戰滿分！';
            badgeBg = 'linear-gradient(135deg, #ebf8ff, #f0f9ff)';
            borderColor = '#3182ce';
            textColor = '#2b6cb0';
        }

        // 更新球場上方的分數足球圖形徽章 (Pitch Score Overlay)
        const pitchOverlay = document.getElementById('pitch-score-overlay');
        const pitchBallIcon = document.getElementById('pitch-ball-icon');
        const pitchScoreVal = document.getElementById('pitch-score-val');
        const pitchScoreEval = document.getElementById('pitch-score-eval');

        if (pitchOverlay) {
            pitchOverlay.style.borderColor = borderColor;
            pitchOverlay.style.display = 'flex';
        }
        if (pitchBallIcon) pitchBallIcon.textContent = badgeIcon;
        if (pitchScoreVal) pitchScoreVal.textContent = isEn ? `${finalScore} pts` : `${finalScore} 分`;
        if (pitchScoreEval) {
            pitchScoreEval.textContent = badgeTitle;
            pitchScoreEval.style.color = textColor;
        }

        // 更新結算卡片資訊
        const resultBadgeBox = document.getElementById('result-badge-box');
        const resultBadgeIcon = document.getElementById('result-badge-icon');
        const resultBadgeTitle = document.getElementById('result-badge-title');
        const resultBadgeDesc = document.getElementById('result-badge-desc');

        if (resultBadgeBox) {
            resultBadgeBox.style.background = badgeBg;
            resultBadgeBox.style.borderColor = borderColor;
        }
        if (resultBadgeIcon) resultBadgeIcon.textContent = badgeIcon;
        if (resultBadgeTitle) {
            resultBadgeTitle.textContent = badgeTitle;
            resultBadgeTitle.style.color = textColor;
        }
        if (resultBadgeDesc) resultBadgeDesc.textContent = badgeDesc;

        document.getElementById('result-stat-score').textContent = isEn ? `${finalScore} pts` : `${finalScore} 分`;
        document.getElementById('result-stat-correct').textContent = `${gameState.correctCount || 0} / ${gameState.maxScore}`;

        showScreen('r1-screen');
        document.querySelector('.result-wrap').style.display = 'block';
        document.querySelector('.qa').style.display = 'none';
    }
};

window.proceedToRound2 = proceedToRound2;
function proceedToRound2() {
    hideAllScreens();
    showScreen('r2-screen');
    renderAIDojoMatch();
}

function renderAIDojoMatch() {
    const isEn = gameState.language === 'en';
    gameState.selectedTools = [];
    gameState.gameOver = false;
    
    // 隨機排序 8 個工具卡
    gameState.tools.sort(() => Math.random() - 0.5);
    
    const toolsGrid = document.querySelector('.tools-grid2');
    toolsGrid.innerHTML = '';
    
    gameState.tools.forEach((tool, index) => {
        const toolCard = document.createElement('div');
        toolCard.className = 'tool-card2';
        toolCard.id = `tool-card-${index}`;
        toolCard.onclick = () => toggleToolSelection(index);
        
        const difficultyColor = {
            'high': '#e53935',
            'mid': '#fb8c00',
            'low': '#43a047'
        }[tool.difficulty] || '#fb8c00';
        
        const categoryLabel = isEn 
            ? (tool.category === 'agent' ? 'AGENT' : tool.category === 'rag' ? 'RAG' : tool.category === 'gen' ? 'GEN AI' : tool.category === 'ml' ? 'ML' : tool.category === 'auto' ? 'AUTO' : 'SAFETY')
            : (tool.category === 'attack' ? '攻擊型' : tool.category === 'midfield' ? '中場型' : '防禦型');
            
        const descText = (isEn && tool.descriptionEn) ? tool.descriptionEn : tool.description;
        const diffText = isEn
            ? (tool.difficulty === 'high' ? '(Hard)' : '')
            : (tool.difficulty === 'high' ? '(高難度)' : '');

        toolCard.innerHTML = `
            <div class="tool-card2-badge" id="tool-badge-${index}">✓ #1</div>
            <div class="tool-icon2" style="background:${difficultyColor};color:#fff">${tool.icon || '🛠️'}</div>
            <div>
                <div class="tool-rank2">${categoryLabel}</div>
                <div class="tool-name2">${tool.name}</div>
                <div class="tool-tag2">${descText}</div>
                <div class="tool-desc2">HP: ${tool.hp} ${diffText}</div>
            </div>
        `;
        
        toolsGrid.appendChild(toolCard);
    });
    
    updateRound2UI();
}

window.toggleToolSelection = function(index) {
    const selectedIndex = gameState.selectedTools.indexOf(index);
    
    if (selectedIndex !== -1) {
        gameState.selectedTools.splice(selectedIndex, 1);
    } else {
        if (gameState.selectedTools.length >= 4) {
            return;
        }
        gameState.selectedTools.push(index);
    }
    
    updateRound2UI();
};

function updateRound2UI() {
    const isEn = gameState.language === 'en';
    const selectedCount = gameState.selectedTools.length;
    const counterEl = document.getElementById('r2-selected-counter');
    if (counterEl) counterEl.textContent = selectedCount;

    const counterBox = document.querySelector('#r2-prep-section div[style*="border-radius:20px"]');
    if (counterBox) {
        counterBox.innerHTML = isEn 
            ? `Selected <span id="r2-selected-counter">${selectedCount}</span> / 4 AI Tools` 
            : `已選擇 <span id="r2-selected-counter">${selectedCount}</span> / 4 個 AI 工具`;
    }

    gameState.tools.forEach((_, index) => {
        const card = document.getElementById(`tool-card-${index}`);
        const badge = document.getElementById(`tool-badge-${index}`);
        const orderInSelection = gameState.selectedTools.indexOf(index);

        if (card && badge) {
            if (orderInSelection !== -1) {
                card.classList.add('selected');
                badge.textContent = `✓ #${orderInSelection + 1}`;
            } else {
                card.classList.remove('selected');
            }
        }
    });

    const submitBtn = document.getElementById('r2-submit-btn');
    if (submitBtn) {
        if (selectedCount === 4) {
            submitBtn.disabled = false;
            submitBtn.textContent = isEn ? 'Start AI Dojo Match, Face Boss ➔' : '開啟 AI 卡牌道館對戰，迎戰 Boss ➔';
        } else {
            submitBtn.disabled = true;
            submitBtn.textContent = isEn ? `Please select 4 AI tools (${selectedCount}/4 selected)` : `請點選 4 個 AI 工具 (已選 ${selectedCount}/4)`;
        }
    }
}
const dojoBosses = [
    {
        stage: 1,
        name: "混沌文字獸",
        nameEn: "Chaos Text Beast",
        category: "GENERATIVE AI",
        hp: 200,
        maxHp: 200,
        icon: "📑",
        scenario: "主管丟給你 50 頁的會議逐字稿，要你 1 小時內整理成 5 點摘要 + 行動清單。",
        scenarioEn: "Manager hands you a 50-page transcript and demands a 5-point summary + action list within 1 hour.",
        problem: "50 頁逐字稿塞滿了流水帳，重點全埋在雜訊裡——主管要的，是 5 個字就能說清楚的那種答案。",
        problemEn: "50 pages of rambling transcript full of noise—manager wants an answer concise enough in 5 words.",
        handCards: [
            { name: "報告/信件草稿", nameEn: "Draft Report/Email", sub: "生成式 AI 的日常用途", subEn: "Daily GenAI use", icon: "✍️", isCorrect: false },
            { name: "問答對話", nameEn: "Q&A Conversation", sub: "生成式 AI 的基礎形態", subEn: "Basic GenAI form", icon: "💬", isCorrect: false },
            { name: "自主瀏覽", nameEn: "Autonomous Browsing", sub: "AI Agent 的核心能力", subEn: "Core AI Agent skill", icon: "🌐", isCorrect: false },
            { name: "結構化摘要", nameEn: "Structured Summary", sub: "生成式 AI 最基本的技能", subEn: "Fundamental GenAI skill", icon: "📋", isCorrect: true },
            { name: "多語翻譯", nameEn: "Multilingual Translation", sub: "生成式 AI 的語言能力", subEn: "GenAI language skill", icon: "🌐", isCorrect: false },
            { name: "生成圖像", nameEn: "Image Generation", sub: "多模態 AI 的視覺能力", subEn: "Multimodal visual skill", icon: "🖼️", isCorrect: false }
        ],
        explanation: "生成式 AI 的強大之處在於處理海量文本。使用「結構化摘要」能強迫 AI 將抓取到的重點，精準填入指定的框架格式中。",
        explanationEn: "Generative AI excels at handling large text. Using 'Structured Summary' forces AI to extract key points into your required framework format."
    },
    {
        stage: 2,
        name: "多步驟迷宮獸",
        nameEn: "Multi-step Labyrinth Beast",
        category: "AI AGENT",
        hp: 240,
        maxHp: 240,
        icon: "🧩",
        scenario: "老闆要你研究 10 家競品、上他們官網抓價格、整理成比較表，並且每週自動更新。",
        scenarioEn: "Boss wants you to research 10 competitors, scrape prices from websites, format comparison table, auto-update weekly.",
        problem: "10 家競品、10 個官網、10 份價格表，每週都要更新——靠人工複製貼上，光這件事就能把人榨乾。",
        problemEn: "10 competitors, 10 websites, 10 price sheets updated weekly—doing this manually by copying & pasting will burn you out.",
        handCards: [
            { name: "自主瀏覽", nameEn: "Autonomous Browsing", sub: "AI Agent 的核心能力", subEn: "Core AI Agent skill", icon: "🌐", isCorrect: false },
            { name: "結構化摘要", nameEn: "Structured Summary", sub: "生成式 AI 最基本的技能", subEn: "Fundamental GenAI skill", icon: "📋", isCorrect: false },
            { name: "規劃執行 (AI Agent)", nameEn: "Planning & Execution (AI Agent)", sub: "AI Agent 最強大的類別", subEn: "Most powerful AI Agent class", icon: "🎯", isCorrect: true },
            { name: "引用回答", nameEn: "Cited Answers", sub: "RAG 最強大的特點", subEn: "Strongest feature of RAG", icon: "🔍", isCorrect: false },
            { name: "問答對話", nameEn: "Q&A Conversation", sub: "生成式 AI 的基礎形態", subEn: "Basic GenAI form", icon: "💬", isCorrect: false },
            { name: "寫程式執行", nameEn: "Code Execution", sub: "AI Agent 的工程能力", subEn: "Engineering skill of AI Agent", icon: "💻", isCorrect: false }
        ],
        explanation: "AI Agent 具備「任務拆解規劃」與「調用外部工具」的能力，能處理這類多步驟且需自主執行的複雜自動化任務。",
        explanationEn: "AI Agents possess task decomposition planning and external tool orchestration capabilities to handle multi-step automated tasks."
    },
    {
        stage: 3,
        name: "重複勞動獸",
        nameEn: "Repetitive Labor Beast",
        category: "AUTOMATION",
        hp: 220,
        maxHp: 220,
        icon: "🔄",
        scenario: "你每週要手動把表單資料複製到 Excel，再寄 Email 通知給三個人，重複做 50 次。",
        scenarioEn: "Every week you manually copy form data to Excel, then email 3 people, repeating 50 times.",
        problem: "同一件事做了 50 次，每次都靠手動完成——問題不是你不夠勤快，而是這件事根本不應該由人來做。",
        problemEn: "Doing the exact same task 50 times manually—the issue isn't diligence, but that humans shouldn't do this.",
        handCards: [
            { name: "問答對話", nameEn: "Q&A Conversation", sub: "生成式 AI 的基礎形態", subEn: "Basic GenAI form", icon: "💬", isCorrect: false },
            { name: "自主瀏覽", nameEn: "Autonomous Browsing", sub: "AI Agent 的核心能力", subEn: "Core AI Agent skill", icon: "🌐", isCorrect: false },
            { name: "系統串接", nameEn: "System Integration", sub: "自動化工具的核心技能", subEn: "Core skill of automation tools", icon: "🔗", isCorrect: true },
            { name: "結構化摘要", nameEn: "Structured Summary", sub: "生成式 AI 最基本的技能", subEn: "Fundamental GenAI skill", icon: "📋", isCorrect: false },
            { name: "觸發自動化", nameEn: "Trigger Automation", sub: "自動化工具的魔法", subEn: "Magic of automation tools", icon: "⚡", isCorrect: false },
            { name: "定時排程", nameEn: "Scheduled Jobs", sub: "自動化工具的時間維度", subEn: "Time dimension of automation", icon: "📅", isCorrect: false }
        ],
        explanation: "透過系統串接（如 API 連接器），能讓彼此獨立的平台自動化交換數據，徹底消除人工複製貼上的低價值重複勞動。",
        explanationEn: "System integration (like API connectors) enables independent platforms to automatically exchange data, eliminating manual copy-paste low-value labor."
    },
    {
        stage: 4,
        name: "幻覺資訊獸",
        nameEn: "Hallucination Info Beast",
        category: "KNOWLEDGE BASE / RAG",
        hp: 200,
        maxHp: 200,
        icon: "👾",
        scenario: "客戶問你公司 200 頁的產品手冊裡有沒有保固條款，你需要快速找到原文並引用回答。",
        scenarioEn: "A customer asks if there's a warranty clause in a 200-page product manual, requiring exact quotes.",
        problem: "客戶等著你的回答，但 200 頁手冊你不可能全部背起來——亂猜有風險，說錯了比說不知道還糟糕。",
        problemEn: "Customer is waiting, but memorizing a 200-page manual is impossible—guessing wrong is worse than saying don't know.",
        handCards: [
            { name: "報告/信件草稿", nameEn: "Draft Report/Email", sub: "生成式 AI 的日常用途", subEn: "Daily GenAI use", icon: "✍️", isCorrect: false },
            { name: "文件問答", nameEn: "Document Q&A", sub: "RAG 的日常應用", subEn: "Everyday RAG application", icon: "📁", isCorrect: false },
            { name: "引用回答 (RAG)", nameEn: "Cited Answers (RAG)", sub: "RAG 最強大的特點", subEn: "Strongest feature of RAG", icon: "🔍", isCorrect: true },
            { name: "多語翻譯", nameEn: "Multilingual Translation", sub: "生成式 AI 的語言能力", subEn: "GenAI language skill", icon: "🌐", isCorrect: false },
            { name: "結構化摘要", nameEn: "Structured Summary", sub: "生成式 AI 最基本的技能", subEn: "Fundamental GenAI skill", icon: "📋", isCorrect: false },
            { name: "無源回答", nameEn: "Unsourced Answer", sub: "沒有 RAG 的 AI 弱點", subEn: "Weakness of AI without RAG", icon: "🎲", isCorrect: false }
        ],
        explanation: "RAG（檢索增強生成）技術能強制 AI 基於檢索到的企業內部文件生成答案，並標示資料來源，杜絕幻覺以確保商業回覆的可信度。",
        explanationEn: "RAG (Retrieval-Augmented Generation) forces AI to generate answers based on retrieved enterprise documents with citations, preventing hallucinations."
    },
    {
        stage: 5,
        name: "純文字防禦獸",
        nameEn: "Plain Text Defense Beast",
        category: "MULTIMODAL AI",
        hp: 260,
        maxHp: 260,
        icon: "🏰",
        scenario: "行銷要你在 3 天內生出 10 張產品宣傳圖、30 秒影片廣告，還要配音。",
        scenarioEn: "Marketing asks for 10 product promo images, a 30s video ad, and voiceover in 3 days.",
        problem: "3 天、10 張宣傳圖、1 支廣告影片、還要配上旁白——靠文字打不出這場仗。",
        problemEn: "3 days, 10 promo images, 1 video ad, plus voiceover—text alone cannot win this battle.",
        handCards: [
            { name: "生成影片", nameEn: "Video Generation", sub: "多模態 AI 的影片能力", subEn: "Multimodal video skill", icon: "🎬", isCorrect: false },
            { name: "生成圖像", nameEn: "Image Generation", sub: "多模態 AI 的視覺能力", subEn: "Multimodal visual skill", icon: "🖼️", isCorrect: false },
            { name: "純文字輸出", nameEn: "Plain Text Output", sub: "文字技能的局限", subEn: "Limitation of text skill", icon: "📝", isCorrect: false },
            { name: "聲音生成", nameEn: "Voice Generation", sub: "多模態 AI 的音頻能力", subEn: "Multimodal audio skill", icon: "🎙️", isCorrect: false },
            { name: "結構化摘要", nameEn: "Structured Summary", sub: "生成式 AI 最基本的技能", subEn: "Fundamental GenAI skill", icon: "📋", isCorrect: false },
            { name: "綜合多模態生成 (圖/影/音)", nameEn: "Comprehensive Multimodal (Image/Video/Audio)", sub: "多模態 AI 的全能突破", subEn: "All-in-one Multimodal breakthrough", icon: "⚡", isCorrect: true }
        ],
        explanation: "多模態 AI (Multimodal AI) 能跨越單一資料型態的限制，同時支援文生圖、文生影片與語音生成，一人即可抵上整個製作團隊。",
        explanationEn: "Multimodal AI breaks single data format limits, supporting text-to-image, text-to-video, and voice generation simultaneously."
    },
    {
        stage: 6,
        name: "數據竊影獸",
        nameEn: "Data Shadow Beast",
        category: "AI SECURITY & ETHICS",
        hp: 250,
        maxHp: 250,
        icon: "🥷",
        scenario: "各部門開始自求快：有人把客戶報價單直貼免費 AI，有人私自掛全自動 Agent 撈檔。要確保資安，哪種才是安全合規的做法？",
        scenarioEn: "Departments paste quote sheets into free AI or run unauthorized Agents. Which is the secure compliant approach?",
        problem: "方便與安全每天在拉扯，必須避免機密外洩的紅線行為。",
        problemEn: "Convenience vs Security pulling every day; red line leak behaviors must be prevented.",
        handCards: [
            { name: "直接貼機密問 AI", nameEn: "Paste Confidential directly to AI", sub: "資安外洩的高風險行為", subEn: "High-risk data leak behavior", icon: "❌", isCorrect: false },
            { name: "正規 RAG + 去識別化", nameEn: "Standard RAG + Anonymization", sub: "安全合規的防禦鐵則", subEn: "Compliant security defense rule", icon: "🛡️", isCorrect: true },
            { name: "機密灌進公有雲 API", nameEn: "Feed Confidential into Public API", sub: "未經過濾的資料外洩", subEn: "Unfiltered data leak", icon: "⚠️", isCorrect: false },
            { name: "掛全自動 Agent 撈檔", nameEn: "Run Unauthorized Agent to Fetch Files", sub: "未被授權的權限冒用", subEn: "Unapproved privilege abuse", icon: "🚨", isCorrect: false }
        ],
        explanation: "防止影子 IT 與資料外洩的防禦鐵則，是將資料透過標準化的 RAG 架構送出，並搭配去識別化處理，從源頭阻斷機敏外洩風險。",
        explanationEn: "Standardized RAG architecture with data anonymization is the golden rule against shadow IT and data leaks."
    }
];



window.startDojoBattle = function() {
    if (gameState.selectedTools.length !== 4) return;

    document.getElementById('r2-prep-section').style.display = 'none';
    document.getElementById('r2-battle-section').style.display = 'block';

    gameState.currentBossIndex = 0;
    gameState.playerHp = 100;

    renderBossStage(0);
};

function renderBossStage(index) {
    const isEn = gameState.language === 'en';
    const boss = dojoBosses[index];
    if (!boss) return;

    gameState.bossCurrentHp = boss.hp;
    gameState.bossAttacked = false;

    // 1. 頂部標題與進度條
    document.getElementById('boss-stage-num').textContent = index + 1;
    const headerTxt = document.querySelector('#r2-battle-section .r3-step-txt');
    if (headerTxt) {
        headerTxt.innerHTML = isEn 
            ? `Round 2: AI Dojo Battle (Stage <span id="boss-stage-num">${index + 1}</span>/6)`
            : `第二關：AI 卡牌道館對決 (道館戰 <span id="boss-stage-num">${index + 1}</span>/6)`;
    }
    
    const pips = document.querySelectorAll('#boss-pips .pip');
    pips.forEach((pip, pIndex) => {
        pip.className = 'pip';
        if (pIndex < index) pip.classList.add('ok');
        else if (pIndex === index) pip.classList.add('cur');
    });

    // 2. Boss 卡片內容
    document.getElementById('boss-cat-tag').textContent = `■ ${boss.category}`;
    document.getElementById('boss-name-text').textContent = (isEn && boss.nameEn) ? boss.nameEn : boss.name;
    document.getElementById('boss-hp-num').textContent = `${boss.hp} / ${boss.maxHp}`;
    document.getElementById('boss-hp-bar-fill').style.width = '100%';
    document.getElementById('boss-avatar-icon').textContent = boss.icon;

    // 情境與難題標題與內容
    const scTitle = document.querySelector('#boss-card-box > div:nth-child(3) > div:first-child');
    if (scTitle) scTitle.textContent = isEn ? '📋 Scenario' : '📋 情境';
    document.getElementById('boss-scenario-text').textContent = (isEn && boss.scenarioEn) ? boss.scenarioEn : boss.scenario;
    
    const prTitle = document.querySelector('#boss-card-box > div:nth-child(4) > div:first-child');
    if (prTitle) prTitle.textContent = isEn ? '😩 Your Problem' : '😩 你的難題';
    document.getElementById('boss-problem-text').textContent = (isEn && boss.problemEn) ? boss.problemEn : boss.problem;

    const taskBanner = document.querySelector('#boss-card-box > div:nth-child(5) > div');
    if (taskBanner) {
        taskBanner.textContent = isEn 
            ? '🎯 Your Task: Which AI capability resolves this problem? Select the corresponding skill card below'
            : '🎯 你的任務：這個問題，該用哪一種 AI 能力來解決？從下方手牌選出最對應的技能卡出擊';
    }

    const hpLabel = document.querySelector('#boss-card-box > div:nth-child(6) > div:nth-child(2)');
    if (hpLabel) {
        hpLabel.innerHTML = isEn 
            ? `Your HP: <span id="player-hp-num">${gameState.playerHp}</span> / 100`
            : `你的血量: <span id="player-hp-num">${gameState.playerHp}</span> / 100`;
    }

    const handHeader = document.querySelector('.hand-label span');
    if (handHeader) {
        handHeader.textContent = isEn ? '🃏 Your Hand Cards (Select skill to defeat BOSS):' : '🃏 你的手牌（從中選出能打敗 BOSS 的技能）：';
    }

    document.getElementById('player-hp-num').textContent = gameState.playerHp;
    document.getElementById('player-hp-bar-fill').style.width = `${gameState.playerHp}%`;

    // 渲染手牌
    const handCardsContainer = document.getElementById('boss-hand-cards');
    handCardsContainer.innerHTML = '';

    boss.handCards.forEach((card, cIndex) => {
        const handCard = document.createElement('div');
        handCard.className = 'hand-card';
        handCard.onclick = () => attackBoss(cIndex);

        const cardName = (isEn && card.nameEn) ? card.nameEn : card.name;
        const cardSub = (isEn && card.subEn) ? card.subEn : card.sub;

        handCard.innerHTML = `
            <div class="hc-icon">${card.icon}</div>
            <div class="hc-name">${cardName}</div>
            <div class="hc-skill">${cardSub}</div>
        `;
        handCardsContainer.appendChild(handCard);
    });

    // 重置反饋與按鈕
    document.getElementById('boss-fb').style.display = 'none';
    const expEl = document.getElementById('boss-explanation');
    if (expEl) expEl.style.display = 'none';

    const nextBtn = document.getElementById('boss-next-btn');
    if (nextBtn) {
        nextBtn.style.display = 'none';
        nextBtn.disabled = false;
    }
}

let bossTimer = null;

window.attackBoss = function(cIndex) {
    if (gameState.bossAttacked) return;

    const isEn = gameState.language === 'en';
    const boss = dojoBosses[gameState.currentBossIndex];
    if (!boss) return;

    const selectedCard = boss.handCards[cIndex];
    if (!selectedCard) return;

    gameState.bossAttacked = true;

    const fbEl = document.getElementById('boss-fb');
    const expEl = document.getElementById('boss-explanation');
    const expTextEl = document.getElementById('boss-exp-text');
    const nextBtn = document.getElementById('boss-next-btn');
    const bHpFill = document.getElementById('boss-hp-bar-fill');
    const bHpNum = document.getElementById('boss-hp-num');
    const pHpFill = document.getElementById('player-hp-bar-fill');
    const pHpNum = document.getElementById('player-hp-num');

    const bName = (isEn && boss.nameEn) ? boss.nameEn : boss.name;
    const bExp = (isEn && boss.explanationEn) ? boss.explanationEn : boss.explanation;

    // 高亮被點擊的手牌
    const cards = document.querySelectorAll('#boss-hand-cards .hand-card');
    if (cards[cIndex]) cards[cIndex].classList.add('in-play');

    if (selectedCard.isCorrect) {
        // 答對：造成爆擊，Boss HP 扣至 0
        bHpFill.style.width = '0%';
        bHpNum.textContent = `0 / ${boss.maxHp}`;

        fbEl.textContent = isEn ? `💥 Critical Hit! Correct skill! Defeated ${bName}!` : `💥 技能正確！造成爆擊！成功擊敗 ${boss.name}！`;
        fbEl.className = 'fb ok';
        if (expEl) expEl.classList.remove('wrong-exp');

        const expTitleEl = document.querySelector('#boss-explanation .exp-title');
        if (expTitleEl) expTitleEl.textContent = isEn ? '💡 Concept Explanation & Solution:' : '💡 觀念解析與解答說明：';

        if (expEl && expTextEl) {
            expTextEl.textContent = bExp;
            expEl.style.display = 'block';
        }

        fbEl.style.display = 'block';
        nextBtn.style.display = 'block';
        nextBtn.disabled = false;

        if (gameState.currentBossIndex < 5) {
            nextBtn.textContent = isEn ? 'BOSS Defeated! Enter Next Stage ➔' : '擊敗 Boss！進入下一場道館戰 ➔';
        } else {
            nextBtn.textContent = isEn ? '🎉 All Dojo Bosses Cleared! Proceed to Interview ➔' : '🎉 通關全部道館戰！進入賽後專訪 ➔';
        }
    } else {
        // 答錯：攻擊被抵擋，玩家受到反擊扣血，且開啟 3 秒強迫閱讀倒數
        gameState.playerHp = Math.max(10, gameState.playerHp - 20);
        pHpFill.style.width = `${gameState.playerHp}%`;
        pHpNum.textContent = gameState.playerHp;

        fbEl.textContent = isEn ? `❌ Incorrect skill! Attack deflected by ${bName}!` : `❌ 技能不符！攻擊被 ${boss.name} 抵擋！`;
        fbEl.className = 'fb ko';
        if (expEl) expEl.classList.add('wrong-exp');

        const expTitleEl = document.querySelector('#boss-explanation .exp-title');
        if (expTitleEl) expTitleEl.textContent = isEn ? '💡 Concept Explanation & Solution:' : '💡 觀念解析與解答說明：';

        if (expEl && expTextEl) {
            expTextEl.textContent = bExp;
            expEl.style.display = 'block';
        }

        fbEl.style.display = 'block';
        nextBtn.style.display = 'block';
        nextBtn.disabled = true;

        let remainingSeconds = 3;
        nextBtn.textContent = isEn ? `Please read explanation (${remainingSeconds}s...)` : `請閱讀解答說明 (${remainingSeconds}s...)`;

        if (bossTimer) clearInterval(bossTimer);
        bossTimer = setInterval(() => {
            remainingSeconds--;
            if (remainingSeconds > 0) {
                nextBtn.textContent = isEn ? `Please read explanation (${remainingSeconds}s...)` : `請閱讀解答說明 (${remainingSeconds}s...)`;
            } else {
                clearInterval(bossTimer);
                nextBtn.disabled = false;
                if (gameState.currentBossIndex < 5) {
                    nextBtn.textContent = isEn ? 'Continue to Next Stage ➔' : '繼續挑戰下一場道館戰 ➔';
                } else {
                    nextBtn.textContent = isEn ? 'Proceed to Interview ➔' : '進入賽後專訪 ➔';
                }
            }
        }, 1000);
    }
};

window.nextBossStage = function() {
    if (gameState.currentBossIndex < 5) {
        gameState.currentBossIndex++;
        renderBossStage(gameState.currentBossIndex);
    } else {
        proceedToRound3();
    }
};

function showGameOver() {
    alert('時間到！遊戲結束。');
    resetGame();
}

window.proceedToRound3 = proceedToRound3;
function proceedToRound3() {
    if (typeof countdownInterval !== 'undefined') clearInterval(countdownInterval);
    if (typeof bossTimer !== 'undefined') clearInterval(bossTimer);
    
    gameState.round = 3;
    hideAllScreens();
    showScreen('r3-screen');
    
    const step3 = document.querySelector('#r3-screen .r3-step-item:nth-child(3)');
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

    window.scrollTo(0, 0);
}

window.focusStep = function(step) {
    const field = document.querySelectorAll('.r3-sv-field')[step - 1];
    if(field) field.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

window.updateStarAnswer = function(field, value) {
    gameState.starAnswers[field] = value;
    
    const isEn = gameState.language === 'en';
    const fieldIndex = field === 'situation' ? 1 : field === 'task' ? 2 : field === 'action' ? 3 : 4;
    const charCount = document.querySelector(`.r3-sv-field:nth-child(${fieldIndex}) .r3-sv-char`);
    if (charCount) {
        charCount.textContent = `${value.length}/5`;
        if (value.length >= 5) {
            charCount.style.color = '#43a047';
            charCount.style.fontWeight = 'bold';
        } else {
            charCount.style.color = '#e53935';
            charCount.style.fontWeight = 'normal';
        }
    }
    
    const f = document.querySelector(`.r3-sv-field:nth-child(${fieldIndex})`);
    if (f) {
        if (value.length >= 5) {
            f.style.borderColor = '#43a047';
        } else {
            f.style.borderColor = '#ececec';
        }
    }
    
    updateStarSubmitButton();
};

window.validateEmail = function(email) {
    const isEn = gameState.language === 'en';
    const regex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    const errorDiv = document.getElementById('email-error');
    
    const trimmed = email.trim();
    if (regex.test(trimmed)) {
        if (errorDiv) errorDiv.style.display = 'none';
        gameState.email = trimmed;
    } else {
        if (errorDiv) {
            if (trimmed.length > 0) {
                errorDiv.style.display = 'block';
                errorDiv.textContent = isEn ? 'Please enter a valid email address' : '請輸入有效的 Email 地址';
            } else {
                errorDiv.style.display = 'none';
            }
        }
        gameState.email = '';
    }
    
    updateStarSubmitButton();
};

function updateStarSubmitButton() {
    const isEn = gameState.language === 'en';
    const submitBtn = document.querySelector('#r3-draw-section button');
    if (!submitBtn) return;

    if (canSubmit()) {
        submitBtn.disabled = false;
        submitBtn.style.cursor = 'pointer';
        submitBtn.style.background = 'linear-gradient(90deg, #f0b429, #f39c12)';
        submitBtn.style.boxShadow = '0 4px 15px rgba(240,180,41,0.4)';
        submitBtn.style.color = '#7a5000';
        submitBtn.textContent = isEn ? 'Submit Email for Prize Draw ➔' : '填寫 Email 送出抽獎 ➔';
    } else {
        submitBtn.disabled = true;
        submitBtn.style.cursor = 'not-allowed';
        submitBtn.style.background = '#d0d0d0';
        submitBtn.style.boxShadow = 'none';
        submitBtn.style.color = '#666';
        
        const sLen = gameState.starAnswers.situation.length;
        const tLen = gameState.starAnswers.task.length;
        const aLen = gameState.starAnswers.action.length;
        const rLen = gameState.starAnswers.result.length;
        const validEmail = gameState.email && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(gameState.email);

        if (sLen < 5 || tLen < 5 || aLen < 5 || rLen < 5) {
            submitBtn.textContent = isEn ? 'Please fill at least 5 chars per box' : '請填寫 4 個欄位 (每格至少5字)';
        } else if (!validEmail) {
            submitBtn.textContent = isEn ? 'Please enter a valid Email' : '請輸入有效的 Email 參加抽獎';
        } else {
            submitBtn.textContent = isEn ? 'Submit Email for Prize Draw' : '填寫 Email 送出抽獎';
        }
    }
}

window.submitInterview = async function() {
    if (!canSubmit()) return;
    
    const isEn = gameState.language === 'en';
    gameState.interviewData = {
        starAnswers: gameState.starAnswers,
        email: gameState.email,
        score: Math.round(((gameState.correctCount || 0) / gameState.maxScore) * 100),
        timestamp: new Date().toLocaleString()
    };

    // 寫入 CSV 檔案與 Server 端存檔
    try {
        await fetch('/api/save-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(gameState.interviewData)
        });
    } catch (e) {
        console.log('API save email error:', e);
    }
    
    // 備份存至 LocalStorage
    try {
        const existing = JSON.parse(localStorage.getItem('kz_submissions') || '[]');
        existing.push(gameState.interviewData);
        localStorage.setItem('kz_submissions', JSON.stringify(existing));
    } catch (e) {}

    renderDrawResultScreen();
    showScreen('draw-result-screen');
};

window.resetGame = resetGame;
function resetGame() {
    startGame();
}

function canSubmit() {
    return (
        gameState.starAnswers.situation.length >= 5 &&
        gameState.starAnswers.task.length >= 5 &&
        gameState.starAnswers.action.length >= 5 &&
        gameState.starAnswers.result.length >= 5 &&
        gameState.email &&
        /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(gameState.email)
    );
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
