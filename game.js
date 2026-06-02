// ==========================================
// КОСМИЧЕСКИЙ РЫВОК (Space Dash)
// HTML5 Canvas Game for Yandex Games
// ==========================================

// --- Локализация ---
const LANG = {
    ru: {
        title: 'Космический Рывок',
        subtitle: 'Уклоняйся от астероидов и собирай кристаллы!',
        play: 'Играть',
        leaderboard: 'Рекорды',
        controlsDesktop: 'Управление: ← → или A/D',
        controlsMobile: 'Управление: свайп или касание',
        bestScore: 'Лучший результат:',
        pause: 'Пауза',
        resume: 'Продолжить',
        quit: 'В меню',
        gameOver: 'Игра окончена!',
        score: 'Счёт:',
        best: 'Лучший:',
        distance: 'Дистанция:',
        revive: 'Возродиться (реклама)',
        restart: 'Заново',
        menu: 'В меню',
        lbTitle: 'Таблица рекордов',
        back: 'Назад',
        meters: 'м',
        loading: 'Загрузка...',
        noEntries: 'Пока нет записей'
    },
    en: {
        title: 'Space Dash',
        subtitle: 'Dodge asteroids and collect crystals!',
        play: 'Play',
        leaderboard: 'Leaderboard',
        controlsDesktop: 'Controls: ← → or A/D',
        controlsMobile: 'Controls: swipe or tap',
        bestScore: 'Best score:',
        pause: 'Pause',
        resume: 'Resume',
        quit: 'Menu',
        gameOver: 'Game Over!',
        score: 'Score:',
        best: 'Best:',
        distance: 'Distance:',
        revive: 'Revive (watch ad)',
        restart: 'Restart',
        menu: 'Menu',
        lbTitle: 'Leaderboard',
        back: 'Back',
        meters: 'm',
        loading: 'Loading...',
        noEntries: 'No entries yet'
    }
};

// --- Конфигурация игры ---
const CONFIG = {
    // Корабль
    shipWidth: 40,
    shipHeight: 50,
    shipSpeed: 8,
    shipLanes: 5,

    // Астероиды
    asteroidMinSize: 30,
    asteroidMaxSize: 60,
    asteroidBaseSpeed: 3,
    asteroidSpawnInterval: 800,
    asteroidSpeedIncrease: 0.0005,

    // Кристаллы
    crystalSize: 25,
    crystalSpawnInterval: 2000,
    crystalValue: 10,

    // Бонусы
    powerupSize: 30,
    powerupSpawnInterval: 15000,
    shieldDuration: 5000,
    magnetDuration: 8000,
    slowmoDuration: 4000,

    // Звёзды (фон)
    starCount: 150,
    starSpeed: 2,

    // Игра
    distanceMultiplier: 0.01,
    difficultyInterval: 10000,
    maxRevives: 1,

    // Реклама
    adIntervalMs: 180000, // 3 минуты между fullscreen рекламой
};

// --- Глобальные переменные ---
let canvas, ctx;
let gameState = 'menu'; // menu, playing, paused, gameover
let ysdk = null;
let player = null;
let currentLang = 'ru';
let bestScore = 0;
let canRevive = true;
let lastAdTime = 0;
let gameStartTime = 0;
let animFrameId = null;

// Игровые объекты
let ship = null;
let asteroids = [];
let crystals = [];
let powerups = [];
let particles = [];
let stars = [];

// Игровые параметры
let score = 0;
let distance = 0;
let gameSpeed = 1;
let spawnTimers = {};
let activeEffects = {};

// Ввод
let keys = {};
let touchStartX = 0;
let touchCurrentX = 0;
let isTouching = false;
let targetX = 0;

// --- Инициализация SDK ---
function initSDK() {
    YaGames.init().then(sdk => {
        ysdk = sdk;
        console.log('Yandex SDK initialized');

        // Определение языка
        const env = ysdk.environment;
        if (env && env.i18n && env.i18n.lang) {
            currentLang = LANG[env.i18n.lang] ? env.i18n.lang : 'en';
        }

        // Применить локализацию
        applyLocalization();

        // Загрузить сохранения
        loadProgress();

        // Сообщить SDK что игра готова
        ysdk.features.LoadingAPI.ready();

        // Обработка паузы/возобновления от SDK
        ysdk.on('game_api_pause', () => {
            if (gameState === 'playing') {
                pauseGame();
            }
        });
        ysdk.on('game_api_resume', () => {
            // Не возобновляем автоматически, ждём действия игрока
        });

    }).catch(err => {
        console.error('SDK init error:', err);
        // Работаем без SDK (для локального тестирования)
        applyLocalization();
        loadProgress();
    });
}

// --- Локализация ---
function applyLocalization() {
    const t = LANG[currentLang] || LANG.ru;

    document.getElementById('game-title').textContent = t.title;
    document.getElementById('game-subtitle').textContent = t.subtitle;
    document.getElementById('btn-play').textContent = t.play;
    document.getElementById('btn-leaderboard').textContent = t.leaderboard;
    document.getElementById('controls-desktop').textContent = t.controlsDesktop;
    document.getElementById('controls-mobile').textContent = t.controlsMobile;
    document.getElementById('pause-title').textContent = t.pause;
    document.getElementById('btn-resume').textContent = t.resume;
    document.getElementById('btn-quit').textContent = t.quit;
    document.getElementById('gameover-title').textContent = t.gameOver;
    document.getElementById('btn-revive').textContent = t.revive;
    document.getElementById('btn-restart').textContent = t.restart;
    document.getElementById('btn-menu').textContent = t.menu;
    document.getElementById('lb-title').textContent = t.lbTitle;
    document.getElementById('btn-lb-back').textContent = t.back;
}

// --- Сохранение/Загрузка ---
function loadProgress() {
    if (ysdk) {
        ysdk.getPlayer({ scopes: false }).then(p => {
            player = p;
            return p.getData(['bestScore']);
        }).then(data => {
            if (data.bestScore) {
                bestScore = data.bestScore;
            }
            updateBestScoreDisplay();
        }).catch(() => {
            // Загрузить из localStorage как fallback
            bestScore = parseInt(localStorage.getItem('spacedash_best') || '0');
            updateBestScoreDisplay();
        });
    } else {
        bestScore = parseInt(localStorage.getItem('spacedash_best') || '0');
        updateBestScoreDisplay();
    }
}

function saveProgress() {
    if (score > bestScore) {
        bestScore = score;
        if (ysdk && player) {
            player.setData({ bestScore: bestScore });
        }
        localStorage.setItem('spacedash_best', bestScore.toString());
    }
    updateBestScoreDisplay();
}

function updateBestScoreDisplay() {
    const t = LANG[currentLang] || LANG.ru;
    document.getElementById('best-score').textContent = bestScore;
    document.getElementById('best-score-display').textContent = t.bestScore + ' ' + bestScore;
}

// --- Лидерборд ---
function showLeaderboard() {
    if (ysdk) {
        ysdk.getLeaderboards().then(lb => {
            return lb.getLeaderboardEntries('score', { quantityTop: 10, includeUser: true });
        }).then(result => {
            renderLeaderboard(result.entries);
        }).catch(() => {
            renderLeaderboard([]);
        });
    } else {
        renderLeaderboard([]);
    }
    showScreen('leaderboard-screen');
}

function renderLeaderboard(entries) {
    const list = document.getElementById('leaderboard-list');
    const t = LANG[currentLang] || LANG.ru;

    if (!entries || entries.length === 0) {
        list.innerHTML = `<p style="color: #8ab4d8;">${t.noEntries}</p>`;
        return;
    }

    list.innerHTML = entries.map(entry => {
        const isSelf = entry.player && player && entry.player.uniqueID === player.getUniqueID();
        return `<div class="lb-entry ${isSelf ? 'self' : ''}">
            <span class="lb-rank">#${entry.rank}</span>
            <span class="lb-name">${entry.player ? entry.player.publicName || 'Player' : 'Player'}</span>
            <span class="lb-score">${entry.score}</span>
        </div>`;
    }).join('');
}

function submitScore() {
    if (ysdk) {
        ysdk.getLeaderboards().then(lb => {
            lb.setLeaderboardScore('score', score);
        }).catch(err => console.log('Leaderboard error:', err));
    }
}

// --- Реклама ---
function showInterstitialAd(callback) {
    const now = Date.now();
    if (ysdk && (now - lastAdTime > CONFIG.adIntervalMs)) {
        ysdk.adv.showFullscreenAdv({
            callbacks: {
                onOpen: () => { pauseAudio(); },
                onClose: (wasShown) => {
                    lastAdTime = Date.now();
                    resumeAudio();
                    if (callback) callback();
                },
                onError: (err) => {
                    console.log('Ad error:', err);
                    resumeAudio();
                    if (callback) callback();
                }
            }
        });
    } else {
        if (callback) callback();
    }
}

function showRewardedAd(callback) {
    if (ysdk) {
        ysdk.adv.showRewardedVideo({
            callbacks: {
                onOpen: () => { pauseAudio(); },
                onRewarded: () => {
                    if (callback) callback();
                },
                onClose: () => { resumeAudio(); },
                onError: (err) => {
                    console.log('Rewarded ad error:', err);
                    resumeAudio();
                }
            }
        });
    } else {
        // Для тестирования без SDK
        if (callback) callback();
    }
}

function pauseAudio() {
    // Пауза звуков при рекламе
}

function resumeAudio() {
    // Возобновление звуков после рекламы
}

// --- Управление экранами ---
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    if (screenId) {
        document.getElementById(screenId).classList.add('active');
    }
    document.getElementById('ui-overlay').style.pointerEvents = screenId ? 'all' : 'none';
}

// --- Классы игровых объектов ---
class Ship {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = CONFIG.shipWidth;
        this.height = CONFIG.shipHeight;
        this.targetX = x;
        this.hasShield = false;
        this.shieldTimer = 0;
        this.invincible = false;
        this.invincibleTimer = 0;
        this.trail = [];
    }

    update(dt) {
        // Плавное движение к цели
        const dx = this.targetX - this.x;
        this.x += dx * 0.12;

        // Ограничение по краям
        this.x = Math.max(this.width / 2, Math.min(canvas.width - this.width / 2, this.x));

        // Обновление щита
        if (this.hasShield) {
            this.shieldTimer -= dt;
            if (this.shieldTimer <= 0) this.hasShield = false;
        }

        // Обновление неуязвимости
        if (this.invincible) {
            this.invincibleTimer -= dt;
            if (this.invincibleTimer <= 0) this.invincible = false;
        }

        // След
        this.trail.push({ x: this.x, y: this.y + this.height / 2, alpha: 1 });
        if (this.trail.length > 15) this.trail.shift();
        this.trail.forEach(t => t.alpha -= 0.07);
    }

    draw() {
        // Рисуем след двигателя
        this.trail.forEach(t => {
            if (t.alpha > 0) {
                ctx.beginPath();
                ctx.arc(t.x, t.y, 4 * t.alpha, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(100, 200, 255, ${t.alpha * 0.5})`;
                ctx.fill();
            }
        });

        ctx.save();
        ctx.translate(this.x, this.y);

        // Корпус корабля
        ctx.beginPath();
        ctx.moveTo(0, -this.height / 2);
        ctx.lineTo(-this.width / 2, this.height / 2);
        ctx.lineTo(-this.width / 4, this.height / 3);
        ctx.lineTo(0, this.height / 2.5);
        ctx.lineTo(this.width / 4, this.height / 3);
        ctx.lineTo(this.width / 2, this.height / 2);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, -this.height / 2, 0, this.height / 2);
        grad.addColorStop(0, '#64c8ff');
        grad.addColorStop(0.5, '#4a90d9');
        grad.addColorStop(1, '#2a5080');
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.strokeStyle = '#8ae0ff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Кабина
        ctx.beginPath();
        ctx.ellipse(0, -this.height / 6, 6, 10, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#aaeeff';
        ctx.fill();

        // Двигатель (огонь)
        const flameSize = 8 + Math.random() * 5;
        ctx.beginPath();
        ctx.moveTo(-8, this.height / 3);
        ctx.lineTo(0, this.height / 3 + flameSize);
        ctx.lineTo(8, this.height / 3);
        ctx.fillStyle = `rgba(255, ${150 + Math.random() * 100}, 50, 0.8)`;
        ctx.fill();

        ctx.restore();

        // Щит
        if (this.hasShield) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.width * 0.8, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(100, 255, 200, ${0.4 + Math.sin(Date.now() * 0.005) * 0.2})`;
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.fillStyle = `rgba(100, 255, 200, 0.08)`;
            ctx.fill();
        }

        // Мигание при неуязвимости
        if (this.invincible && Math.floor(Date.now() / 100) % 2 === 0) {
            ctx.globalAlpha = 0.3;
        }
    }

    getBounds() {
        return {
            x: this.x - this.width / 3,
            y: this.y - this.height / 3,
            width: this.width * 0.66,
            height: this.height * 0.66
        };
    }
}

class Asteroid {
    constructor() {
        this.size = CONFIG.asteroidMinSize + Math.random() * (CONFIG.asteroidMaxSize - CONFIG.asteroidMinSize);
        this.x = Math.random() * (canvas.width - this.size * 2) + this.size;
        this.y = -this.size;
        this.speed = (CONFIG.asteroidBaseSpeed + Math.random() * 2) * gameSpeed;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.03;
        this.vertices = this.generateVertices();
        this.color = this.getRandomColor();
    }

    generateVertices() {
        const count = 7 + Math.floor(Math.random() * 4);
        const verts = [];
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const r = this.size / 2 * (0.7 + Math.random() * 0.3);
            verts.push({ x: Math.cos(angle) * r, y: Math.sin(angle) * r });
        }
        return verts;
    }

    getRandomColor() {
        const colors = ['#8b6914', '#6b4423', '#7a5230', '#5c3d1e', '#4a3520'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update(dt) {
        this.y += this.speed;
        this.rotation += this.rotSpeed;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        ctx.beginPath();
        ctx.moveTo(this.vertices[0].x, this.vertices[0].y);
        for (let i = 1; i < this.vertices.length; i++) {
            ctx.lineTo(this.vertices[i].x, this.vertices[i].y);
        }
        ctx.closePath();

        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size / 2);
        grad.addColorStop(0, '#a0784c');
        grad.addColorStop(1, this.color);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.strokeStyle = '#3d2810';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Кратеры
        ctx.beginPath();
        ctx.arc(this.size * 0.1, -this.size * 0.1, this.size * 0.12, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fill();

        ctx.restore();
    }

    getBounds() {
        return {
            x: this.x - this.size / 3,
            y: this.y - this.size / 3,
            width: this.size * 0.66,
            height: this.size * 0.66
        };
    }

    isOffScreen() {
        return this.y > canvas.height + this.size;
    }
}

class Crystal {
    constructor() {
        this.size = CONFIG.crystalSize;
        this.x = Math.random() * (canvas.width - this.size * 2) + this.size;
        this.y = -this.size;
        this.speed = 2.5 * gameSpeed;
        this.angle = 0;
        this.glow = 0;
    }

    update(dt) {
        this.y += this.speed;
        this.angle += 0.05;
        this.glow = Math.sin(Date.now() * 0.005) * 0.3 + 0.7;

        // Магнит
        if (activeEffects.magnet) {
            const dx = ship.x - this.x;
            const dy = ship.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 200) {
                this.x += dx * 0.05;
                this.y += dy * 0.05;
            }
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        // Свечение
        ctx.shadowColor = '#00ffaa';
        ctx.shadowBlur = 15 * this.glow;

        // Кристалл (ромб)
        ctx.beginPath();
        ctx.moveTo(0, -this.size / 2);
        ctx.lineTo(this.size / 3, 0);
        ctx.lineTo(0, this.size / 2);
        ctx.lineTo(-this.size / 3, 0);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, -this.size / 2, 0, this.size / 2);
        grad.addColorStop(0, '#00ffaa');
        grad.addColorStop(0.5, '#00cc88');
        grad.addColorStop(1, '#008866');
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.strokeStyle = '#66ffcc';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.shadowBlur = 0;
        ctx.restore();
    }

    getBounds() {
        return {
            x: this.x - this.size / 3,
            y: this.y - this.size / 3,
            width: this.size * 0.66,
            height: this.size * 0.66
        };
    }

    isOffScreen() {
        return this.y > canvas.height + this.size;
    }
}

class Powerup {
    constructor(type) {
        this.type = type; // 'shield', 'magnet', 'slowmo'
        this.size = CONFIG.powerupSize;
        this.x = Math.random() * (canvas.width - this.size * 2) + this.size;
        this.y = -this.size;
        this.speed = 2 * gameSpeed;
        this.pulse = 0;
    }

    update(dt) {
        this.y += this.speed;
        this.pulse = Math.sin(Date.now() * 0.004) * 0.2 + 1;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(this.pulse, this.pulse);

        const colors = {
            shield: { fill: '#00ff88', stroke: '#66ffbb', icon: '🛡' },
            magnet: { fill: '#ff66aa', stroke: '#ff99cc', icon: '🧲' },
            slowmo: { fill: '#aa66ff', stroke: '#cc99ff', icon: '⏳' }
        };

        const c = colors[this.type];

        // Круг
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        ctx.fillStyle = c.fill + '33';
        ctx.fill();
        ctx.strokeStyle = c.stroke;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Иконка
        ctx.font = `${this.size * 0.6}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(c.icon, 0, 0);

        ctx.restore();
    }

    getBounds() {
        return {
            x: this.x - this.size / 2,
            y: this.y - this.size / 2,
            width: this.size,
            height: this.size
        };
    }

    isOffScreen() {
        return this.y > canvas.height + this.size;
    }
}

class Particle {
    constructor(x, y, color, speed, size, life) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.vx = (Math.random() - 0.5) * speed;
        this.vy = (Math.random() - 0.5) * speed;
        this.size = size || 3;
        this.life = life || 1;
        this.maxLife = this.life;
    }

    update(dt) {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= 0.02;
        this.size *= 0.97;
    }

    draw() {
        if (this.life <= 0) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * (this.life / this.maxLife), 0, Math.PI * 2);
        ctx.fillStyle = this.color.replace('1)', `${this.life})`);
        ctx.fill();
    }

    isDead() {
        return this.life <= 0;
    }
}

class Star {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speed = this.size * CONFIG.starSpeed;
        this.brightness = Math.random();
    }

    update() {
        this.y += this.speed * gameSpeed;
        if (this.y > canvas.height) {
            this.y = 0;
            this.x = Math.random() * canvas.width;
        }
        this.brightness = 0.5 + Math.sin(Date.now() * 0.002 + this.x) * 0.3;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 220, 255, ${this.brightness})`;
        ctx.fill();
    }
}

// --- Функции спавна ---
function spawnAsteroid() {
    if (gameState !== 'playing') return;
    asteroids.push(new Asteroid());

    // Увеличение сложности
    const elapsed = Date.now() - gameStartTime;
    const interval = Math.max(300, CONFIG.asteroidSpawnInterval - elapsed * 0.02);
    spawnTimers.asteroid = setTimeout(spawnAsteroid, interval);
}

function spawnCrystal() {
    if (gameState !== 'playing') return;
    crystals.push(new Crystal());

    const interval = CONFIG.crystalSpawnInterval - Math.min(800, (Date.now() - gameStartTime) * 0.01);
    spawnTimers.crystal = setTimeout(spawnCrystal, Math.max(800, interval));
}

function spawnPowerup() {
    if (gameState !== 'playing') return;
    const types = ['shield', 'magnet', 'slowmo'];
    const type = types[Math.floor(Math.random() * types.length)];
    powerups.push(new Powerup(type));

    spawnTimers.powerup = setTimeout(spawnPowerup, CONFIG.powerupSpawnInterval + Math.random() * 5000);
}

// --- Эффекты частиц ---
function createExplosion(x, y, color, count) {
    for (let i = 0; i < count; i++) {
        particles.push(new Particle(x, y, color, 8, 4 + Math.random() * 3, 1));
    }
}

function createCollectEffect(x, y) {
    for (let i = 0; i < 8; i++) {
        particles.push(new Particle(x, y, 'rgba(0, 255, 170, 1)', 5, 3, 0.8));
    }
}

// --- Коллизии ---
function checkCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

// --- Основной игровой цикл ---
function gameLoop(timestamp) {
    animFrameId = requestAnimationFrame(gameLoop);

    if (gameState !== 'playing') {
        // Рисуем фон даже в меню
        drawBackground();
        return;
    }

    const dt = 16; // ~60fps

    // Обновление скорости игры
    const elapsed = Date.now() - gameStartTime;
    gameSpeed = 1 + elapsed * CONFIG.asteroidSpeedIncrease;
    if (activeEffects.slowmo) {
        gameSpeed *= 0.5;
        activeEffects.slowmoTimer -= dt;
        if (activeEffects.slowmoTimer <= 0) {
            activeEffects.slowmo = false;
        }
    }

    // Обновление магнита
    if (activeEffects.magnet) {
        activeEffects.magnetTimer -= dt;
        if (activeEffects.magnetTimer <= 0) {
            activeEffects.magnet = false;
        }
    }

    // Обновление дистанции
    distance += gameSpeed * CONFIG.distanceMultiplier;

    // Обновление корабля
    updateShipPosition();
    ship.update(dt);

    // Обновление астероидов
    asteroids.forEach(a => a.update(dt));
    asteroids = asteroids.filter(a => !a.isOffScreen());

    // Обновление кристаллов
    crystals.forEach(c => c.update(dt));
    crystals = crystals.filter(c => !c.isOffScreen());

    // Обновление бонусов
    powerups.forEach(p => p.update(dt));
    powerups = powerups.filter(p => !p.isOffScreen());

    // Обновление частиц
    particles.forEach(p => p.update(dt));
    particles = particles.filter(p => !p.isDead());

    // Проверка коллизий с астероидами
    const shipBounds = ship.getBounds();
    for (let i = asteroids.length - 1; i >= 0; i--) {
        const aBounds = asteroids[i].getBounds();
        if (checkCollision(shipBounds, aBounds)) {
            if (ship.hasShield) {
                ship.hasShield = false;
                createExplosion(asteroids[i].x, asteroids[i].y, 'rgba(100, 255, 200, 1)', 15);
                asteroids.splice(i, 1);
                score += 5;
            } else if (!ship.invincible) {
                createExplosion(ship.x, ship.y, 'rgba(255, 100, 50, 1)', 25);
                gameOver();
                return;
            }
        }
    }

    // Проверка коллизий с кристаллами
    for (let i = crystals.length - 1; i >= 0; i--) {
        const cBounds = crystals[i].getBounds();
        if (checkCollision(shipBounds, cBounds)) {
            createCollectEffect(crystals[i].x, crystals[i].y);
            score += CONFIG.crystalValue;
            crystals.splice(i, 1);
        }
    }

    // Проверка коллизий с бонусами
    for (let i = powerups.length - 1; i >= 0; i--) {
        const pBounds = powerups[i].getBounds();
        if (checkCollision(shipBounds, pBounds)) {
            applyPowerup(powerups[i].type);
            createCollectEffect(powerups[i].x, powerups[i].y);
            powerups.splice(i, 1);
        }
    }

    // Рисование
    draw();

    // Обновление HUD
    document.getElementById('hud-score').textContent = score;
    const t = LANG[currentLang] || LANG.ru;
    document.getElementById('hud-distance').textContent = Math.floor(distance) + ' ' + t.meters;
}

function updateShipPosition() {
    if (isTouching) {
        ship.targetX = touchCurrentX;
    } else {
        let moveDir = 0;
        if (keys['ArrowLeft'] || keys['KeyA']) moveDir = -1;
        if (keys['ArrowRight'] || keys['KeyD']) moveDir = 1;
        ship.targetX += moveDir * CONFIG.shipSpeed;
    }
    ship.targetX = Math.max(ship.width / 2, Math.min(canvas.width - ship.width / 2, ship.targetX));
}

function applyPowerup(type) {
    switch (type) {
        case 'shield':
            ship.hasShield = true;
            ship.shieldTimer = CONFIG.shieldDuration;
            break;
        case 'magnet':
            activeEffects.magnet = true;
            activeEffects.magnetTimer = CONFIG.magnetDuration;
            break;
        case 'slowmo':
            activeEffects.slowmo = true;
            activeEffects.slowmoTimer = CONFIG.slowmoDuration;
            break;
    }
}

// --- Рисование ---
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Фон
    drawBackground();

    // Астероиды
    asteroids.forEach(a => a.draw());

    // Кристаллы
    crystals.forEach(c => c.draw());

    // Бонусы
    powerups.forEach(p => p.draw());

    // Корабль
    ship.draw();

    // Частицы
    particles.forEach(p => p.draw());

    // Индикаторы эффектов
    drawEffectIndicators();
}

function drawBackground() {
    // Градиент космоса
    const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bgGrad.addColorStop(0, '#0a0a2e');
    bgGrad.addColorStop(0.5, '#0d1040');
    bgGrad.addColorStop(1, '#1a0a30');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Звёзды
    stars.forEach(s => {
        s.update();
        s.draw();
    });
}

function drawEffectIndicators() {
    let y = 60;
    const x = 15;

    if (ship && ship.hasShield) {
        ctx.font = '14px Arial';
        ctx.fillStyle = '#00ff88';
        ctx.textAlign = 'left';
        ctx.fillText('🛡 Shield', x, y);
        y += 20;
    }
    if (activeEffects.magnet) {
        ctx.font = '14px Arial';
        ctx.fillStyle = '#ff66aa';
        ctx.textAlign = 'left';
        ctx.fillText('🧲 Magnet', x, y);
        y += 20;
    }
    if (activeEffects.slowmo) {
        ctx.font = '14px Arial';
        ctx.fillStyle = '#aa66ff';
        ctx.textAlign = 'left';
        ctx.fillText('⏳ Slow-Mo', x, y);
        y += 20;
    }
}

// --- Управление игрой ---
function startGame() {
    gameState = 'playing';
    score = 0;
    distance = 0;
    gameSpeed = 1;
    canRevive = true;
    asteroids = [];
    crystals = [];
    powerups = [];
    particles = [];
    activeEffects = {};
    gameStartTime = Date.now();

    // Создать корабль
    ship = new Ship(canvas.width / 2, canvas.height * 0.8);
    ship.targetX = canvas.width / 2;
    targetX = canvas.width / 2;

    // Показать HUD
    document.getElementById('hud').classList.add('active');
    showScreen(null);

    // Запустить спавн
    clearAllTimers();
    spawnTimers.asteroid = setTimeout(spawnAsteroid, 1000);
    spawnTimers.crystal = setTimeout(spawnCrystal, 2000);
    spawnTimers.powerup = setTimeout(spawnPowerup, CONFIG.powerupSpawnInterval);

    // Уведомить SDK о начале геймплея
    if (ysdk) {
        try { ysdk.features.GameplayAPI.start(); } catch(e) {}
    }
}

function pauseGame() {
    if (gameState !== 'playing') return;
    gameState = 'paused';
    showScreen('pause-screen');
    clearAllTimers();

    if (ysdk) {
        try { ysdk.features.GameplayAPI.stop(); } catch(e) {}
    }
}

function resumeGame() {
    if (gameState !== 'paused') return;
    gameState = 'playing';
    showScreen(null);
    gameStartTime = Date.now() - (distance / CONFIG.distanceMultiplier / gameSpeed);

    // Возобновить спавн
    spawnTimers.asteroid = setTimeout(spawnAsteroid, CONFIG.asteroidSpawnInterval);
    spawnTimers.crystal = setTimeout(spawnCrystal, CONFIG.crystalSpawnInterval);
    spawnTimers.powerup = setTimeout(spawnPowerup, CONFIG.powerupSpawnInterval);

    if (ysdk) {
        try { ysdk.features.GameplayAPI.start(); } catch(e) {}
    }
}

function gameOver() {
    gameState = 'gameover';
    clearAllTimers();

    saveProgress();
    submitScore();

    if (ysdk) {
        try { ysdk.features.GameplayAPI.stop(); } catch(e) {}
    }

    const t = LANG[currentLang] || LANG.ru;
    document.getElementById('final-score').textContent = score;
    document.getElementById('final-best').textContent = bestScore;
    document.getElementById('final-distance').textContent = Math.floor(distance);
    document.getElementById('gameover-score-text').textContent = t.score + ' ' + score;
    document.getElementById('gameover-best-text').textContent = t.best + ' ' + bestScore;
    document.getElementById('gameover-distance-text').textContent = t.distance + ' ' + Math.floor(distance) + ' ' + t.meters;

    // Показать/скрыть кнопку возрождения
    document.getElementById('btn-revive').style.display = canRevive ? 'block' : 'none';

    document.getElementById('hud').classList.remove('active');

    // Показать рекламу перед экраном Game Over
    showInterstitialAd(() => {
        showScreen('gameover-screen');
    });
}

function revivePlayer() {
    if (!canRevive) return;
    canRevive = false;

    showRewardedAd(() => {
        // Возрождение
        gameState = 'playing';
        ship.invincible = true;
        ship.invincibleTimer = 3000;
        showScreen(null);
        document.getElementById('hud').classList.add('active');

        // Убрать ближайшие астероиды
        asteroids = asteroids.filter(a => a.y < canvas.height * 0.5);

        // Возобновить спавн
        spawnTimers.asteroid = setTimeout(spawnAsteroid, 2000);
        spawnTimers.crystal = setTimeout(spawnCrystal, CONFIG.crystalSpawnInterval);
        spawnTimers.powerup = setTimeout(spawnPowerup, CONFIG.powerupSpawnInterval);

        if (ysdk) {
            try { ysdk.features.GameplayAPI.start(); } catch(e) {}
        }
    });
}

function goToMenu() {
    gameState = 'menu';
    clearAllTimers();
    document.getElementById('hud').classList.remove('active');
    showScreen('main-menu');
    updateBestScoreDisplay();
}

function clearAllTimers() {
    Object.values(spawnTimers).forEach(t => clearTimeout(t));
    spawnTimers = {};
}

// --- Обработка ввода ---
function setupInput() {
    // Клавиатура
    document.addEventListener('keydown', (e) => {
        keys[e.code] = true;
        if (e.code === 'Escape' || e.code === 'KeyP') {
            if (gameState === 'playing') pauseGame();
            else if (gameState === 'paused') resumeGame();
        }
        if (e.code === 'Space' && gameState === 'menu') {
            startGame();
        }
    });

    document.addEventListener('keyup', (e) => {
        keys[e.code] = false;
    });

    // Тач
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchCurrentX = touch.clientX;
        isTouching = true;
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        touchCurrentX = touch.clientX;
    }, { passive: false });

    canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        isTouching = false;
    }, { passive: false });

    // Мышь (для десктопа)
    canvas.addEventListener('mousemove', (e) => {
        if (gameState === 'playing' && e.buttons === 1) {
            touchCurrentX = e.clientX;
            isTouching = true;
        }
    });

    canvas.addEventListener('mousedown', (e) => {
        if (gameState === 'playing') {
            touchCurrentX = e.clientX;
            isTouching = true;
        }
    });

    canvas.addEventListener('mouseup', () => {
        isTouching = false;
    });

    // Предотвращение контекстного меню
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    // Обработка сворачивания (остановка звука)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (gameState === 'playing') pauseGame();
            pauseAudio();
        }
    });
}

// --- Кнопки UI ---
function setupUI() {
    document.getElementById('btn-play').addEventListener('click', () => {
        showInterstitialAd(() => startGame());
    });
    document.getElementById('btn-leaderboard').addEventListener('click', showLeaderboard);
    document.getElementById('btn-resume').addEventListener('click', resumeGame);
    document.getElementById('btn-quit').addEventListener('click', goToMenu);
    document.getElementById('btn-revive').addEventListener('click', revivePlayer);
    document.getElementById('btn-restart').addEventListener('click', () => {
        showInterstitialAd(() => startGame());
    });
    document.getElementById('btn-menu').addEventListener('click', goToMenu);
    document.getElementById('btn-lb-back').addEventListener('click', () => showScreen('main-menu'));
    document.getElementById('btn-pause').addEventListener('click', pauseGame);
}

// --- Ресайз ---
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Пересоздать звёзды при ресайзе
    if (stars.length === 0 || Math.abs(stars[0].x - canvas.width) > canvas.width) {
        stars = [];
        for (let i = 0; i < CONFIG.starCount; i++) {
            stars.push(new Star());
        }
    }
}

// --- Инициализация ---
function init() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Создать звёзды
    for (let i = 0; i < CONFIG.starCount; i++) {
        stars.push(new Star());
    }

    setupInput();
    setupUI();

    // Запустить игровой цикл
    gameLoop();

    // Инициализация SDK
    initSDK();
}

// Запуск
window.addEventListener('load', init);
