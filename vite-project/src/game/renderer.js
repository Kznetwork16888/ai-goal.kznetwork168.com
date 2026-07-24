import { gameState, translations } from '../data.js';
import * as engine from './engine.js';
import { SoccerScene } from './SoccerScene.js';
import { animate as anime } from 'animejs';

let soccerSceneInstance = null;

export function hideAllScreens() {
    const screens = document.querySelectorAll('[id$="-screen"]');
    screens.forEach(screen => {
        screen.style.display = 'none';
    });
    const langModal = document.getElementById('lang-modal-overlay');
    if (langModal) langModal.style.display = 'none';
    const transitionScreen = document.getElementById('transition-screen');
    if (transitionScreen) transitionScreen.style.display = 'none';
}

export function showScreen(screenId) {
    hideAllScreens();
    const screen = document.getElementById(screenId);
    if (screen) screen.style.display = 'block';
}

export function updateLanguage() {
    const t = translations[gameState.language];
    if (!t) return;
    
    const title = document.querySelector('.header-title');
    if (title) title.textContent = t['第一關：練習場選拔'];
    const sub = document.querySelector('.header-sub');
    if (sub) sub.textContent = t['8 球定生死，踢進才能晉身世界盃！'];
}

export function selectLang(lang) {
    gameState.language = lang;
    const btns = document.querySelectorAll('.lm-btn');
    btns.forEach(btn => {
        if (btn.onclick && btn.onclick.toString().includes("\"" + lang + "\"")) {
            btn.classList.add('active');
            const check = btn.querySelector('.lm-check');
            if (check) check.style.opacity = '1';
        } else {
            btn.classList.remove('active');
            const check = btn.querySelector('.lm-check');
            if (check) check.style.opacity = '0';
        }
    });
}

export function confirmLang() {
    const langModal = document.getElementById('lang-modal-overlay');
    if (langModal) langModal.style.display = 'none';
    updateLanguage();
    engine.startGame();
}

export function selectStartLang(lang) {
    gameState.language = lang;
    const btns = document.querySelectorAll('.start-lang-btn');
    btns.forEach(btn => {
        if (btn.onclick && btn.onclick.toString().includes("\"" + lang + "\"")) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Update Start Screen DOM
    const t = translations[lang] || translations['zh-TW'];
    if(t) {
        const title = document.getElementById('st-title-zh');
        if(title && t['世界盃 AI 戰隊']) title.textContent = t['世界盃 AI 戰隊'];
        
        const tagline = document.getElementById('st-tagline');
        if(tagline && t['🏆 第一關：練習場選拔 → 🏟️ 第二關：AI 道館對決 → 🎙️ 第三關：賽後專訪']) tagline.textContent = t['🏆 第一關：練習場選拔 → 🏟️ 第二關：AI 道館對決 → 🎙️ 第三關：賽後專訪'];
        
        const btn = document.getElementById('st-btn');
        if(btn && t['接受邀請，開始選拔 ⚽']) btn.textContent = t['接受邀請，開始選拔 ⚽'];
        
        const sub = document.getElementById('st-sub');
        if(sub && t['约 5 分钟完成 · 三关共 14 题']) sub.textContent = t['约 5 分钟完成 · 三关共 14 题'];
        
        const footer = document.getElementById('st-footer');
        if(footer && t['本活动由 Kznetwork168 Corporate Training 主办']) footer.textContent = t['本活动由 Kznetwork168 Corporate Training 主办'];
    }
}

export function renderPracticeQuestion() {
    const q = gameState.questions[gameState.currentQuestion];
    
    const sbarScore = document.querySelector('.sbar-score');
    if(sbarScore) sbarScore.textContent = `${gameState.score} : ${gameState.maxScore}`;
    
    const pips = document.querySelectorAll('.pip');
    pips.forEach((pip, index) => {
        pip.className = 'pip';
        if (index < gameState.currentQuestion) {
            pip.classList.add(gameState.questionStatuses[index] === 'correct' ? 'ok' : 'ko');
        } else if (index === gameState.currentQuestion) {
            pip.classList.add('cur');
        }
    });
    
    const qCat = document.querySelector('.q-cat');
    if(qCat) qCat.textContent = q.category;
    const qText = document.querySelector('.q-text');
    if(qText) qText.textContent = q.text;
    const qPrompt = document.querySelector('.q-prompt');
    if(qPrompt) qPrompt.textContent = q.prompt;
    
    const choices = document.querySelectorAll('.cb');
    choices.forEach((choice, index) => {
        choice.textContent = q.choices[index];
        choice.className = 'cb';
        choice.disabled = false;
    });
    
    const fb = document.querySelector('.fb');
    if(fb) fb.style.display = 'none';
    const nextBtn = document.querySelector('.next-btn');
    if(nextBtn) nextBtn.style.display = 'none';
    
    if (gameState.showGoal) {
        const goalText = document.querySelector('.goal-text');
        if(goalText) {
            goalText.textContent = gameState.goalEmoji;
            goalText.className = 'goal-text ' + (gameState.goalEmoji === '⚽' ? 'zh-font' : '') + ' show';
        }
    }
    
    if (gameState.isAnswered && nextBtn) {
        nextBtn.style.display = 'block';
    }
}

export function updateAfterAnswer(index, correct, q) {
    const choices = document.querySelectorAll('.cb');
    choices[index].classList.add(correct ? 'correct' : 'wrong');
    
    if (q.correct !== index) {
        choices[q.correct].classList.add('correct');
    }
    
    const fb = document.querySelector('.fb');
    if(fb) {
        if (correct) {
            fb.textContent = '正確！';
            fb.className = 'fb ok';
            showGoalAnimation(q.emoji, true);
        } else {
            fb.textContent = `錯誤，答案是：${q.choices[q.correct]}`;
            fb.className = 'fb ko';
            showGoalAnimation('❌', false);
        }
        fb.style.display = 'block';
    }
    
    const nextBtn = document.querySelector('.next-btn');
    if(nextBtn) nextBtn.style.display = 'block';
}

export function showGoalAnimation(emoji, isCorrect) {
    gameState.showGoal = true;
    gameState.goalEmoji = emoji;
    
    const goalText = document.querySelector('.goal-text');
    if(goalText) {
        goalText.textContent = emoji;
        goalText.className = 'goal-text ' + (emoji === 's' ? 'zh-font' : '') + ' show';
    }
    
    if (!soccerSceneInstance) {
        soccerSceneInstance = new SoccerScene();
    }
    
    soccerSceneInstance.playShootoutAnimation(isCorrect).then(() => {
        setTimeout(() => {
            gameState.showGoal = false;
        }, 300); // slight buffer before next question
    });
}

export function renderAIDojoMatch() {
    gameState.selectedTools = [];
    gameState.gameOver = false;
    engine.startCountdown();
    gameState.revealedTools = new Set();
    
    gameState.tools.sort(() => Math.random() - 0.5);
    
    const toolsGrid = document.querySelector('.tools-grid2');
    if(toolsGrid) {
        toolsGrid.innerHTML = '';
        
        gameState.tools.forEach((tool, index) => {
            const toolCard = document.createElement('div');
            toolCard.className = 'tool-card2';
            
            toolCard.addEventListener('mousemove', (e) => {
                const rect = toolCard.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -15; 
                const rotateY = ((x - centerX) / centerX) * 15;
                
                toolCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
                
                const glare = toolCard.querySelector('.glare');
                if (glare) {
                    glare.style.opacity = '1';
                    glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.4), transparent 50%)`;
                }
            });
            
            toolCard.addEventListener('mouseleave', () => {
                toolCard.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
                const glare = toolCard.querySelector('.glare');
                if (glare) {
                    glare.style.opacity = '0';
                }
            });
            
            toolCard.onclick = () => {
                const rect = toolCard.getBoundingClientRect();
                const clone = toolCard.cloneNode(true);
                clone.style.position = 'fixed';
                clone.style.top = rect.top + 'px';
                clone.style.left = rect.left + 'px';
                clone.style.width = rect.width + 'px';
                clone.style.height = rect.height + 'px';
                clone.style.zIndex = '9999';
                clone.style.margin = '0';
                clone.style.pointerEvents = 'none';
                document.body.appendChild(clone);
                
                toolCard.style.opacity = '0';
                
                anime({
                    targets: clone,
                    left: '50%',
                    top: '50%',
                    translateX: '-50%',
                    translateY: '-50%',
                    scale: 1.5,
                    rotateY: 360,
                    opacity: [1, 0],
                    easing: 'easeInQuad',
                    duration: 500,
                    complete: () => {
                        clone.remove();
                        engine.selectTool(index);
                        toolCard.style.opacity = '1';
                    }
                });
            };
            
            const difficultyColor = {
                'high': '#e53935',
                'mid': '#fb8c00',
                'low': '#43a047'
            }[tool.difficulty] || '#43a047';
            
            toolCard.innerHTML = `
                <div class="glare"></div>
                <div class="tool-icon2" style="background:${difficultyColor};color:#fff">${tool.icon}</div>
                <div>
                    <div class="tool-rank2">${tool.category === 'attack' ? '攻擊型' : tool.category === 'midfield' ? '中場型' : '防禦型'}</div>
                    <div class="tool-name2">${tool.name}</div>
                    <div class="tool-tag2">${tool.description}</div>
                    <div class="tool-desc2">HP: ${tool.hp} ${tool.difficulty === 'high' ? '(高難度)' : ''}</div>
                </div>
            `;
            
            toolsGrid.appendChild(toolCard);
        });
    }
    
    const r2Cta = document.querySelector('.r2-cta');
    if(r2Cta) {
        r2Cta.disabled = true;
        r2Cta.onclick = engine.revealAllTools;
    }
}

export function updateSelectedToolsUI() {
    const remaining = 4 - gameState.selectedTools.length;
    const remainingTools = document.getElementById('remaining-tools');
    if(remainingTools) remainingTools.textContent = remaining;
    
    const r2Cta = document.querySelector('.r2-cta');
    if (r2Cta && remaining === 0) {
        r2Cta.disabled = false;
    }
}

export function renderSelectedToolsList() {
    const list = document.getElementById('selected-tools-list');
    if(!list) return;
    list.innerHTML = '';
    
    gameState.selectedTools.forEach((index, i) => {
        const tool = gameState.tools[index];
        const tag = document.createElement('div');
        tag.style.cssText = 'background:#e8f5f1;border:1px solid #a8dcc8;border-radius:20px;padding:4px 12px;font-size:11px;color:#0F6E56;display:flex;align-items:center;gap:6px';
        tag.innerHTML = `
            <span>${tool.name} ${tool.icon}</span>
            <span onclick="window.removeTool(${i})" style="cursor:pointer;color:#aaa;font-weight:bold">×</span>
        `;
        list.appendChild(tag);
    });
    
    prepareToolChoices();
}

export function prepareToolChoices() {
    const remaining = 4 - gameState.selectedTools.length;
    const availableTools = gameState.tools.filter((tool, index) => !gameState.selectedTools.includes(index));
    
    const choicesContainer = document.querySelector('.tool-choices');
    if(!choicesContainer) return;
    choicesContainer.innerHTML = '';
    
    if (remaining > 0 && availableTools.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableTools.length);
        const tool = availableTools[randomIndex];
        const toolIndex = gameState.tools.indexOf(tool);
        
        const choiceBtn = document.createElement('button');
        choiceBtn.className = 'tcb';
        choiceBtn.innerHTML = `
            <span class="tick">✓</span>
            <span class="tcb-name">${tool.name}</span>
            <span class="tcb-tag">${tool.category === 'attack' ? '攻擊型' : tool.category === 'midfield' ? '中場型' : '防禦型'} • HP: ${tool.hp}</span>
        `;
        choiceBtn.onclick = () => engine.selectToolChoice(toolIndex);
        choicesContainer.appendChild(choiceBtn);
        
        gameState.toolChoices[toolIndex] = true;
    } else {
        choicesContainer.innerHTML = '<div style="padding:1rem;text-align:center;color:#888">您已選滿 4 個工具</div>';
    }
    
    const nextBtn = document.querySelector('.r2-next-btn');
    if(nextBtn) {
        if (remaining === 0) {
            nextBtn.disabled = false;
            nextBtn.onclick = engine.proceedToRound3;
        } else {
            nextBtn.disabled = true;
        }
    }
}

export function focusStep(step) {
    const field = document.querySelectorAll('.r3-sv-field')[step - 1];
    if(field) {
        field.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}


export function showTransitionScreen(score) {
    hideAllScreens();
    const screen = document.getElementById('transition-screen');
    if (screen) screen.style.display = 'flex';
    
    // Update score text
    const scoreEl = document.querySelector('.ts-score');
    if (scoreEl) scoreEl.textContent = `最終得分：${score} 分 / Final Score: ${score}`;
    
    // Show best score from history
    import('./engine.js').then(engine => {
        const history = engine.loadHistory();
        let bestScore = score;
        if (history && history.length > 0) {
            bestScore = Math.max(...history.map(h => h.score));
        }
        const bestScoreEl = document.getElementById('best-score-display');
        if (bestScoreEl) {
            bestScoreEl.textContent = `最佳得分 / Best Score: ${bestScore} 分`;
        }
    });

    // Draw Radar Chart
    // Categories: Gen AI, Agent, Automation, RAG, Multimodal, Security
    // We'll generate random but reasonable data based on the score
    const baseVal = Math.min(score / 150, 1.0) * 0.5 + 0.3; // 0.3 to 0.8
    const radarData = [
        { axis: 'Gen AI', value: Math.min(baseVal + Math.random()*0.3, 1) },
        { axis: 'Agent', value: Math.min(baseVal + Math.random()*0.3, 1) },
        { axis: 'Automation', value: Math.min(baseVal + Math.random()*0.3, 1) },
        { axis: 'RAG', value: Math.min(baseVal + Math.random()*0.3, 1) },
        { axis: 'Multimodal', value: Math.min(baseVal + Math.random()*0.3, 1) },
        { axis: 'Security', value: Math.min(baseVal + Math.random()*0.3, 1) }
    ];
    
    if (window.drawRadarChart) {
        window.drawRadarChart('radar-chart-container', radarData);
    }
    
    // Animate elements
    setTimeout(() => {
        const btn = document.querySelector('.ts-continue-btn');
        if (btn) btn.style.display = 'inline-block';
        
        const shareBtn = document.getElementById('share-btn');
        if (shareBtn) shareBtn.style.display = 'inline-block';
    }, 2500);
}
