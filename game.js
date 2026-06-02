// ==========================================
// КОСМИЧЕСКИЙ РЫВОК (Space Dash) v2.0
// HTML5 Canvas Game for Yandex Games
// ==========================================

// ===== КОНФИГУРАЦИЯ =====
const CONFIG = {
    // Корабль
    shipWidth: 36,
    shipHeight: 46,
    shipBaseSpeed: 6,

    // Баланс сложности (ИСПРАВЛЕНО — плавное нарастание)
    baseScrollSpeed: 2.5,
    maxScrollSpeed: 6.0,
    speedRampTime: 300000, // 5 минут до макс скорости (было слишком быстро)

    // Астероиды
    asteroidMinSize: 28,
    asteroidMaxSize: 55,
    asteroidBaseInterval: 1400,
    asteroidMinInterval: 500,

    // Кристаллы
    crystalSize: 22,
    crystalBaseInterval: 1800,
    crystalValue: 5,

    // Бонусы
    powerupSize: 28,
    powerupInterval: 12000,
    shieldDuration: 6000,
    magnetDuration: 8000,
    slowmoDuration: 5000,

    // Локации (каждые 50 м)
    locationChangeEvery: 50,

    // Звёзды
    starCount: 120,

    // Реклама
    adCooldown: 180000,
    reviveCostCoins: 50,
    maxAdUpgrades: 2,
};

// ===== ДАННЫЕ ЛОКАЦИЙ =====
const LOCATIONS = [
    {
        id: 'earth',
        name: 'Земля — Старт',
        bgGradient: ['#1a2a4a', '#2a4a6a', '#4a7a9a'],
        obstacles: 'birds',
        isTutorial: true,
        range: [0, 50]
    },
    {
        id: 'orbit',
        name: 'Орбита Земли',
        bgGradient: ['#0a0a2e', '#0d1040', '#1a2050'],
        obstacles: 'debris',
        range: [50, 100]
    },
    {
        id: 'space',
        name: 'Открытый космос',
        bgGradient: ['#0a0020', '#150030', '#0a0a2e'],
        obstacles: 'asteroids',
        range: [100, 150]
    },
    {
        id: 'nebula',
        name: 'Туманность',
        bgGradient: ['#1a0030', '#2a0050', '#0a0020'],
        obstacles: 'asteroids',
        range: [150, 200]
    },
    {
        id: 'boss_chase',
        name: 'Погоня!',
        bgGradient: ['#200000', '#0a0020', '#1a0030'],
        obstacles: 'enemy_fire',
        isBoss: true,
        range: [200, 250]
    },
    {
        id: 'deep_space',
        name: 'Глубокий космос',
        bgGradient: ['#000010', '#050520', '#0a0a30'],
        obstacles: 'asteroids',
        range: [250, 9999]
    }
];

// ===== КАТ-СЦЕНЫ =====
const CUTSCENES = {
    intro: [
        { speaker: 'Диспетчер', text: 'На краю обитаемого космоса обнаружен неизвестный сигнал...' },
        { speaker: 'Диспетчер', text: 'Земля направляет экспедиционный корабль "Стрела" для исследования.' },
        { speaker: 'Капитан', text: 'Экипаж, приготовиться к старту. Курс задан.' },
        { speaker: 'Капитан', text: 'Взлетаем!' },
    ],
    boss_intro: [
        { speaker: 'Капитан', text: 'Что... Похоже, за нами хвост!' },
        { speaker: 'Бортовой ИИ', text: 'Обнаружена группа неопознанных кораблей. Они приближаются!' },
        { speaker: 'Капитан', text: 'Уклоняемся от огня! Полная мощность на двигатели!' },
    ]
};

// ===== УЛУЧШЕНИЯ =====
const UPGRADES_DATA = [
    { id: 'speed', name: 'Скорость', icon: '⚡', maxLevel: 5, baseCost: 30, costMult: 1.8, desc: 'Скорость манёвра' },
    { id: 'shield', name: 'Прочность щита', icon: '🛡', maxLevel: 5, baseCost: 50, costMult: 2.0, desc: 'Длительность щита' },
    { id: 'magnet', name: 'Магнит', icon: '🧲', maxLevel: 5, baseCost: 40, costMult: 1.8, desc: 'Радиус притяжения' },
    { id: 'luck', name: 'Удача', icon: '🍀', maxLevel: 5, baseCost: 60, costMult: 2.0, desc: 'Шанс бонусов' },
    { id: 'armor', name: 'Броня', icon: '🔰', maxLevel: 3, baseCost: 100, costMult: 2.5, desc: 'Доп. жизнь' },
];

// ===== СКИНЫ =====
const SKINS_DATA = [
    { id: 'default', name: 'Стрела', icon: '🚀', cost: 0, colors: ['#64c8ff', '#4a90d9', '#2a5080'] },
    { id: 'fire', name: 'Феникс', icon: '🔥', cost: 100, colors: ['#ff6644', '#ff3300', '#aa2200'] },
    { id: 'gold', name: 'Золотой', icon: '⭐', cost: 200, colors: ['#ffd700', '#daa520', '#b8860b'] },
    { id: 'phantom', name: 'Фантом', icon: '👻', cost: 300, colors: ['#aa66ff', '#7733cc', '#4400aa'] },
    { id: 'emerald', name: 'Изумруд', icon: '💚', cost: 250, colors: ['#00ff88', '#00cc66', '#008844'] },
    { id: 'ice', name: 'Ледяной', icon: '❄️', cost: 150, colors: ['#aaeeff', '#66ccff', '#3399cc'] },
];

// ===== ГЛОБАЛЬНОЕ СОСТОЯНИЕ =====
let canvas, ctx;
let ysdk = null;
let player = null;

// Состояние игры
let gameState = 'loading'; // loading, cutscene, menu, playing, paused, gameover
let currentCutscene = null;
let cutsceneIndex = 0;

// Игровые данные (сохраняемые)
let saveData = {
    coins: 0,
    bestDistance: 0,
    upgrades: { speed: 0, shield: 0, magnet: 0, luck: 0, armor: 0 },
    skins: ['default'],
    activeSkin: 'default',
    adUpgradesUsed: 0,
    hasSeenIntro: false,
    records: []
};

// Текущая сессия
let session = {
    distance: 0,
    coins: 0,
    speed: CONFIG.baseScrollSpeed,
    currentLocation: null,
    locationIndex: 0,
    startTime: 0,
    canRevive: true,
    tutorialStep: 0,
    tutorialDone: false,
    bossActive: false,
    bossShips: [],
    bossBullets: [],
    lives: 1
};

// Игровые объекты
let ship = null;
let obstacles = [];
let crystals = [];
let powerups = [];
let particles = [];
let stars = [];

// Эффекты
let activeEffects = {};

// Ввод
let keys = {};
let touchX = null;
let isTouching = false;

// Таймеры
let spawnTimers = {};
let lastAdTime = 0;
let animFrameId = null;

// ===== ИНИЦИАЛИЗАЦИЯ =====
function init() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    createStars();
    setupInput();
    setupUI();
    gameLoop();
    initSDK();
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (stars.length > 0) createStars();
}

function createStars() {
    stars = [];
    for (let i = 0; i < CONFIG.starCount; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 0.5,
            speed: Math.random() * 1.5 + 0.5,
            brightness: Math.random()
        });
    }
}

// ===== YANDEX SDK =====
function initSDK() {
    if (typeof YaGames === 'undefined') {
        console.log('SDK not available, running locally');
        loadSaveData();
        onReady();
        return;
    }

    YaGames.init().then(sdk => {
        ysdk = sdk;
        console.log('Yandex SDK initialized');

        ysdk.features.LoadingAPI.ready();

        ysdk.on('game_api_pause', () => {
            if (gameState === 'playing') pauseGame();
        });

        loadSaveData();
        onReady();
    }).catch(err => {
        console.error('SDK error:', err);
        loadSaveData();
        onReady();
    });
}

function onReady() {
    gameState = 'menu';
    if (!saveData.hasSeenIntro) {
        startCutscene('intro', () => {
            saveData.hasSeenIntro = true;
            saveSaveData();
            showOverlay('main-menu');
        });
    } else {
        showOverlay('main-menu');
    }
}

// ===== СОХРАНЕНИЕ =====
function loadSaveData() {
    try {
        const stored = localStorage.getItem('spacedash_save');
        if (stored) {
            const parsed = JSON.parse(stored);
            saveData = { ...saveData, ...parsed };
        }
    } catch (e) { console.log('Load error:', e); }

    if (ysdk) {
        ysdk.getPlayer({ scopes: false }).then(p => {
            player = p;
            return p.getData(['saveData']);
        }).then(data => {
            if (data.saveData) {
                saveData = { ...saveData, ...data.saveData };
            }
            updateAllUI();
        }).catch(() => {});
    }
    updateAllUI();
}

function saveSaveData() {
    try {
        localStorage.setItem('spacedash_save', JSON.stringify(saveData));
    } catch (e) {}

    if (ysdk && player) {
        try { player.setData({ saveData: saveData }); } catch (e) {}
    }
}

// ===== КАТ-СЦЕНЫ =====
function startCutscene(id, onComplete) {
    const scenes = CUTSCENES[id];
    if (!scenes) { if (onComplete) onComplete(); return; }

    gameState = 'cutscene';
    currentCutscene = { scenes, onComplete };
    cutsceneIndex = 0;
    showOverlay('cutscene-overlay');
    showCutsceneLine();
}

function showCutsceneLine() {
    const scene = currentCutscene.scenes[cutsceneIndex];
    document.getElementById('cutscene-speaker').textContent = scene.speaker;

    // Эффект печатания
    const textEl = document.getElementById('cutscene-text');
    textEl.textContent = '';
    let charIndex = 0;
    const typeInterval = setInterval(() => {
        if (charIndex < scene.text.length) {
            textEl.textContent += scene.text[charIndex];
            charIndex++;
        } else {
            clearInterval(typeInterval);
        }
    }, 30);
}

function advanceCutscene() {
    cutsceneIndex++;
    if (cutsceneIndex >= currentCutscene.scenes.length) {
        const cb = currentCutscene.onComplete;
        currentCutscene = null;
        hideAllOverlays();
        if (cb) cb();
    } else {
        showCutsceneLine();
    }
}

// ===== ЭКРАНЫ =====
function showOverlay(id) {
    hideAllOverlays();
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
}

function hideAllOverlays() {
    document.querySelectorAll('.overlay').forEach(o => o.classList.remove('active'));
}

// ===== ОБНОВЛЕНИЕ UI =====
function updateAllUI() {
    // Баланс в меню
    document.getElementById('menu-coins').textContent = saveData.coins;
    document.getElementById('upgrades-coins').textContent = saveData.coins;
    document.getElementById('skins-coins').textContent = saveData.coins;

    renderUpgrades();
    renderSkins();
    renderRecords();
}

function renderUpgrades() {
    const container = document.getElementById('upgrades-list');
    container.innerHTML = UPGRADES_DATA.map(up => {
        const level = saveData.upgrades[up.id] || 0;
        const isMaxed = level >= up.maxLevel;
        const cost = Math.floor(up.baseCost * Math.pow(up.costMult, level));
        const canAfford = saveData.coins >= cost;

        return `<div class="upgrade-card ${isMaxed ? 'maxed' : ''}">
            <div class="upgrade-icon">${up.icon}</div>
            <div class="upgrade-name">${up.name}</div>
            <div class="upgrade-level">Ур. ${level}/${up.maxLevel}</div>
            <div style="color:#8ab4d8;font-size:11px;margin-bottom:6px">${up.desc}</div>
            ${isMaxed
                ? '<div style="color:#00ff88;font-size:12px">МАКС</div>'
                : `<div class="upgrade-cost">💎 ${cost}</div>
                   <button class="upgrade-btn" ${canAfford ? '' : 'disabled'}
                     onclick="buyUpgrade('${up.id}')">Улучшить</button>`
            }
        </div>`;
    }).join('');

    document.getElementById('ad-upgrades-left').textContent = CONFIG.maxAdUpgrades - saveData.adUpgradesUsed;
    document.getElementById('btn-ad-upgrade').disabled = saveData.adUpgradesUsed >= CONFIG.maxAdUpgrades;
}

function renderSkins() {
    const container = document.getElementById('skins-list');
    container.innerHTML = SKINS_DATA.map(skin => {
        const owned = saveData.skins.includes(skin.id);
        const selected = saveData.activeSkin === skin.id;

        return `<div class="skin-card ${selected ? 'selected' : ''} ${!owned ? 'locked' : ''}"
                     onclick="selectSkin('${skin.id}')">
            <div class="skin-preview">${skin.icon}</div>
            <div class="skin-name">${skin.name}</div>
            ${!owned ? `<div class="skin-cost">💎 ${skin.cost}</div>` : ''}
            ${selected ? '<div style="color:#64c8ff;font-size:10px;margin-top:4px">✓ Выбран</div>' : ''}
        </div>`;
    }).join('');
}

function renderRecords() {
    const container = document.getElementById('records-list');
    const records = saveData.records.slice(0, 10);

    if (records.length === 0) {
        container.innerHTML = '<p style="color:#8ab4d8;text-align:center;padding:20px">Пока нет записей. Играй!</p>';
        return;
    }

    container.innerHTML = records.map((r, i) => `
        <div class="record-entry ${i === 0 ? 'highlight' : ''}">
            <span>#${i + 1}</span>
            <span>${r.distance} м</span>
            <span>💎 ${r.coins}</span>
        </div>
    `).join('');
}

// ===== ПОКУПКИ =====
function buyUpgrade(id) {
    const up = UPGRADES_DATA.find(u => u.id === id);
    if (!up) return;
    const level = saveData.upgrades[id] || 0;
    if (level >= up.maxLevel) return;
    const cost = Math.floor(up.baseCost * Math.pow(up.costMult, level));
    if (saveData.coins < cost) return;

    saveData.coins -= cost;
    saveData.upgrades[id] = level + 1;
    saveSaveData();
    updateAllUI();
}

function selectSkin(id) {
    const skin = SKINS_DATA.find(s => s.id === id);
    if (!skin) return;

    if (saveData.skins.includes(id)) {
        saveData.activeSkin = id;
        saveSaveData();
        updateAllUI();
    } else {
        if (saveData.coins >= skin.cost) {
            saveData.coins -= skin.cost;
            saveData.skins.push(id);
            saveData.activeSkin = id;
            saveSaveData();
            updateAllUI();
        }
    }
}

function adUpgrade() {
    if (saveData.adUpgradesUsed >= CONFIG.maxAdUpgrades) return;

    showRewardedAd(() => {
        // Даём бесплатное улучшение — самое дешёвое доступное
        const available = UPGRADES_DATA.filter(u => (saveData.upgrades[u.id] || 0) < u.maxLevel);
        if (available.length > 0) {
            const cheapest = available.sort((a, b) => {
                const costA = Math.floor(a.baseCost * Math.pow(a.costMult, saveData.upgrades[a.id] || 0));
                const costB = Math.floor(b.baseCost * Math.pow(b.costMult, saveData.upgrades[b.id] || 0));
                return costA - costB;
            })[0];
            saveData.upgrades[cheapest.id] = (saveData.upgrades[cheapest.id] || 0) + 1;
        }
        saveData.adUpgradesUsed++;
        saveSaveData();
        updateAllUI();
    });
}

// ===== РЕКЛАМА =====
function showInterstitialAd(callback) {
    if (!ysdk || Date.now() - lastAdTime < CONFIG.adCooldown) {
        if (callback) callback();
        return;
    }
    ysdk.adv.showFullscreenAdv({
        callbacks: {
            onClose: () => { lastAdTime = Date.now(); if (callback) callback(); },
            onError: () => { if (callback) callback(); }
        }
    });
}

function showRewardedAd(onReward) {
    if (!ysdk) { if (onReward) onReward(); return; }
    ysdk.adv.showRewardedVideo({
        callbacks: {
            onRewarded: () => { if (onReward) onReward(); },
            onClose: () => {},
            onError: () => {}
        }
    });
}

// ===== СТАРТ ИГРЫ =====
function startGame() {
    gameState = 'playing';
    hideAllOverlays();
    document.getElementById('hud').classList.add('active');

    // Сброс сессии
    session = {
        distance: 0,
        coins: 0,
        speed: CONFIG.baseScrollSpeed,
        currentLocation: LOCATIONS[0],
        locationIndex: 0,
        startTime: Date.now(),
        canRevive: true,
        tutorialStep: 0,
        tutorialDone: saveData.bestDistance > 0,
        bossActive: false,
        bossShips: [],
        bossBullets: [],
        lives: 1 + (saveData.upgrades.armor || 0)
    };

    // Объекты
    obstacles = [];
    crystals = [];
    powerups = [];
    particles = [];
    activeEffects = {};

    // Корабль
    ship = {
        x: canvas.width / 2,
        y: canvas.height * 0.75,
        targetX: canvas.width / 2,
        width: CONFIG.shipWidth,
        height: CONFIG.shipHeight,
        hasShield: false,
        shieldTimer: 0,
        invincible: false,
        invincibleTimer: 0,
        trail: []
    };

    // Спавн
    clearTimers();
    scheduleSpawn('obstacle', 1500);
    scheduleSpawn('crystal', 2000);
    scheduleSpawn('powerup', CONFIG.powerupInterval);

    // Обучение
    if (!session.tutorialDone) {
        showTutorial('Уклоняйся от препятствий!\nДвигай корабль ← → или касанием');
    }

    if (ysdk) { try { ysdk.features.GameplayAPI.start(); } catch(e) {} }
}

// ===== ОБУЧЕНИЕ =====
function showTutorial(text) {
    const overlay = document.getElementById('tutorial-overlay');
    const box = document.getElementById('tutorial-hint');
    document.getElementById('tutorial-text').textContent = text;
    overlay.classList.add('active');
    box.style.top = '40%';
    box.style.left = '50%';
    box.style.transform = 'translate(-50%, -50%)';

    setTimeout(() => {
        overlay.classList.remove('active');
    }, 4000);
}

// ===== СПАВН =====
function scheduleSpawn(type, delay) {
    if (gameState !== 'playing') return;
    spawnTimers[type] = setTimeout(() => {
        if (gameState !== 'playing') return;
        spawnObject(type);
        // Следующий спавн
        const elapsed = Date.now() - session.startTime;
        let nextDelay;
        switch (type) {
            case 'obstacle':
                nextDelay = Math.max(CONFIG.asteroidMinInterval,
                    CONFIG.asteroidBaseInterval - elapsed * 0.003);
                break;
            case 'crystal':
                nextDelay = Math.max(1000, CONFIG.crystalBaseInterval - elapsed * 0.002);
                break;
            case 'powerup':
                const luckBonus = (saveData.upgrades.luck || 0) * 1500;
                nextDelay = CONFIG.powerupInterval - luckBonus + Math.random() * 3000;
                break;
        }
        scheduleSpawn(type, nextDelay);
    }, delay);
}

function spawnObject(type) {
    const loc = session.currentLocation;
    if (!loc) return;

    if (session.bossActive && type === 'obstacle') return; // Босс спавнит свои снаряды

    switch (type) {
        case 'obstacle':
            spawnObstacle(loc);
            break;
        case 'crystal':
            crystals.push(createCrystal());
            break;
        case 'powerup':
            powerups.push(createPowerup());
            break;
    }
}

function spawnObstacle(loc) {
    const x = Math.random() * (canvas.width - 80) + 40;
    let obs;

    switch (loc.obstacles) {
        case 'birds':
            obs = createBird(x);
            break;
        case 'debris':
            obs = createDebris(x);
            break;
        case 'enemy_fire':
            return; // Босс обрабатывается отдельно
        default:
            obs = createAsteroid(x);
    }
    if (obs) obstacles.push(obs);
}

function createAsteroid(x) {
    const size = CONFIG.asteroidMinSize + Math.random() * (CONFIG.asteroidMaxSize - CONFIG.asteroidMinSize);
    const verts = [];
    const count = 7 + Math.floor(Math.random() * 4);
    for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const r = size / 2 * (0.7 + Math.random() * 0.3);
        verts.push({ x: Math.cos(angle) * r, y: Math.sin(angle) * r });
    }
    return {
        type: 'asteroid', x, y: -size,
        size, verts,
        speed: session.speed * (0.8 + Math.random() * 0.4),
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.03
    };
}

function createBird(x) {
    const fromLeft = Math.random() > 0.5;
    return {
        type: 'bird',
        x: fromLeft ? -30 : canvas.width + 30,
        y: Math.random() * canvas.height * 0.6 + 50,
        size: 25,
        speed: (3 + Math.random() * 2) * (fromLeft ? 1 : -1),
        wingPhase: Math.random() * Math.PI * 2,
        horizontal: true
    };
}

function createDebris(x) {
    return {
        type: 'debris', x, y: -30,
        size: 15 + Math.random() * 20,
        speed: session.speed * (0.9 + Math.random() * 0.3),
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.05
    };
}

function createCrystal() {
    return {
        type: 'crystal',
        x: Math.random() * (canvas.width - 60) + 30,
        y: -CONFIG.crystalSize,
        size: CONFIG.crystalSize,
        speed: session.speed * 0.7,
        angle: 0,
        glow: 0
    };
}

function createPowerup() {
    const types = ['shield', 'magnet', 'slowmo'];
    return {
        type: 'powerup',
        powerType: types[Math.floor(Math.random() * types.length)],
        x: Math.random() * (canvas.width - 60) + 30,
        y: -CONFIG.powerupSize,
        size: CONFIG.powerupSize,
        speed: session.speed * 0.6,
        pulse: 0
    };
}

// ===== БОСС =====
function startBossPhase() {
    session.bossActive = true;
    session.bossShips = [];
    session.bossBullets = [];

    // Создать вражеские корабли
    for (let i = 0; i < 3; i++) {
        session.bossShips.push({
            x: canvas.width * (0.25 + i * 0.25),
            y: -60 - i * 40,
            targetY: 60 + Math.random() * 30,
            size: 35,
            shootTimer: 2000 + Math.random() * 1000,
            phase: Math.random() * Math.PI * 2,
            alive: true
        });
    }
}

function updateBoss(dt) {
    // Двигаем вражеские корабли
    session.bossShips.forEach(bs => {
        if (!bs.alive) return;
        // Плавно опускаются
        if (bs.y < bs.targetY) bs.y += 1;
        // Покачиваются
        bs.phase += 0.02;
        bs.x += Math.sin(bs.phase) * 1.5;

        // Стрельба
        bs.shootTimer -= dt;
        if (bs.shootTimer <= 0) {
            bs.shootTimer = 1500 + Math.random() * 1000;
            session.bossBullets.push({
                x: bs.x,
                y: bs.y + bs.size / 2,
                speed: 4 + Math.random() * 2,
                size: 8
            });
        }
    });

    // Двигаем пули
    session.bossBullets.forEach(b => b.y += b.speed);
    session.bossBullets = session.bossBullets.filter(b => b.y < canvas.height + 20);
}

// ===== ОСНОВНОЙ ЦИКЛ =====
function gameLoop() {
    animFrameId = requestAnimationFrame(gameLoop);

    // Рисуем фон всегда
    drawBackground();

    if (gameState !== 'playing') return;

    const dt = 16;
    const elapsed = Date.now() - session.startTime;

    // Скорость нарастает ПЛАВНО
    const speedProgress = Math.min(1, elapsed / CONFIG.speedRampTime);
    session.speed = CONFIG.baseScrollSpeed + (CONFIG.maxScrollSpeed - CONFIG.baseScrollSpeed) * speedProgress;

    if (activeEffects.slowmo) {
        session.speed *= 0.5;
        activeEffects.slowmoTimer -= dt;
        if (activeEffects.slowmoTimer <= 0) activeEffects.slowmo = false;
    }

    // Обновление дистанции
    session.distance += session.speed * 0.02;

    // Проверка смены локации
    checkLocationChange();

    // Обновление корабля
    updateShip(dt);

    // Обновление объектов
    updateObstacles(dt);
    updateCrystals(dt);
    updatePowerups(dt);
    updateParticles(dt);

    // Босс
    if (session.bossActive) updateBoss(dt);

    // Коллизии
    checkCollisions();

    // Рисование
    drawGame();

    // HUD
    updateHUD();
}

function checkLocationChange() {
    const dist = Math.floor(session.distance);
    const newLoc = LOCATIONS.find(l => dist >= l.range[0] && dist < l.range[1]);

    if (newLoc && newLoc !== session.currentLocation) {
        const prevLoc = session.currentLocation;
        session.currentLocation = newLoc;

        // Кат-сцена перед боссом
        if (newLoc.isBoss && !session.bossActive) {
            gameState = 'cutscene';
            startCutscene('boss_intro', () => {
                gameState = 'playing';
                startBossPhase();
            });
        }
    }
}

function updateShip(dt) {
    // Управление
    const speedBonus = 1 + (saveData.upgrades.speed || 0) * 0.2;
    const moveSpeed = CONFIG.shipBaseSpeed * speedBonus;

    if (isTouching && touchX !== null) {
        ship.targetX = touchX;
    } else {
        if (keys['ArrowLeft'] || keys['KeyA']) ship.targetX -= moveSpeed;
        if (keys['ArrowRight'] || keys['KeyD']) ship.targetX += moveSpeed;
    }

    ship.targetX = Math.max(ship.width / 2 + 5, Math.min(canvas.width - ship.width / 2 - 5, ship.targetX));
    ship.x += (ship.targetX - ship.x) * 0.12;

    // Щит
    if (ship.hasShield) {
        ship.shieldTimer -= dt;
        const shieldBonus = 1 + (saveData.upgrades.shield || 0) * 0.3;
        if (ship.shieldTimer <= 0) ship.hasShield = false;
    }

    // Неуязвимость
    if (ship.invincible) {
        ship.invincibleTimer -= dt;
        if (ship.invincibleTimer <= 0) ship.invincible = false;
    }

    // След
    ship.trail.push({ x: ship.x, y: ship.y + ship.height / 2, alpha: 1 });
    if (ship.trail.length > 12) ship.trail.shift();
    ship.trail.forEach(t => t.alpha -= 0.08);
}

function updateObstacles(dt) {
    obstacles.forEach(o => {
        if (o.horizontal) {
            o.x += o.speed;
            o.wingPhase += 0.1;
        } else {
            o.y += o.speed || session.speed;
            if (o.rotation !== undefined) o.rotation += o.rotSpeed || 0;
        }
    });
    obstacles = obstacles.filter(o => {
        if (o.horizontal) return o.x > -50 && o.x < canvas.width + 50;
        return o.y < canvas.height + 80;
    });
}

function updateCrystals(dt) {
    const magnetRadius = 120 + (saveData.upgrades.magnet || 0) * 40;

    crystals.forEach(c => {
        c.y += c.speed || session.speed * 0.7;
        c.angle += 0.04;
        c.glow = Math.sin(Date.now() * 0.005) * 0.3 + 0.7;

        if (activeEffects.magnet) {
            const dx = ship.x - c.x;
            const dy = ship.y - c.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < magnetRadius) {
                c.x += dx * 0.06;
                c.y += dy * 0.06;
            }
        }
    });
    crystals = crystals.filter(c => c.y < canvas.height + 40);
}

function updatePowerups(dt) {
    powerups.forEach(p => {
        p.y += p.speed || session.speed * 0.6;
        p.pulse = Math.sin(Date.now() * 0.004) * 0.15 + 1;
    });
    powerups = powerups.filter(p => p.y < canvas.height + 40);
}

function updateParticles(dt) {
    particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.025;
        p.size *= 0.97;
    });
    particles = particles.filter(p => p.life > 0);
}

// ===== КОЛЛИЗИИ =====
function checkCollisions() {
    const sx = ship.x - ship.width / 3;
    const sy = ship.y - ship.height / 3;
    const sw = ship.width * 0.66;
    const sh = ship.height * 0.66;

    // Препятствия
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const o = obstacles[i];
        const ox = o.x - o.size / 3;
        const oy = o.y - o.size / 3;
        const ow = o.size * 0.66;
        const oh = o.size * 0.66;

        if (rectsOverlap(sx, sy, sw, sh, ox, oy, ow, oh)) {
            if (ship.hasShield) {
                ship.hasShield = false;
                createParticles(o.x, o.y, 'rgba(100,255,200,1)', 12);
                obstacles.splice(i, 1);
            } else if (!ship.invincible) {
                hitShip();
                return;
            }
        }
    }

    // Пули босса
    for (let i = session.bossBullets.length - 1; i >= 0; i--) {
        const b = session.bossBullets[i];
        if (rectsOverlap(sx, sy, sw, sh, b.x - b.size/2, b.y - b.size/2, b.size, b.size)) {
            if (ship.hasShield) {
                ship.hasShield = false;
                createParticles(b.x, b.y, 'rgba(100,255,200,1)', 8);
                session.bossBullets.splice(i, 1);
            } else if (!ship.invincible) {
                hitShip();
                return;
            }
        }
    }

    // Кристаллы
    for (let i = crystals.length - 1; i >= 0; i--) {
        const c = crystals[i];
        if (rectsOverlap(sx, sy, sw, sh, c.x - c.size/2, c.y - c.size/2, c.size, c.size)) {
            session.coins += CONFIG.crystalValue;
            createParticles(c.x, c.y, 'rgba(0,255,170,1)', 8);
            crystals.splice(i, 1);
        }
    }

    // Бонусы
    for (let i = powerups.length - 1; i >= 0; i--) {
        const p = powerups[i];
        if (rectsOverlap(sx, sy, sw, sh, p.x - p.size/2, p.y - p.size/2, p.size, p.size)) {
            applyPowerup(p.powerType);
            createParticles(p.x, p.y, 'rgba(100,200,255,1)', 10);
            powerups.splice(i, 1);
        }
    }
}

function rectsOverlap(x1, y1, w1, h1, x2, y2, w2, h2) {
    return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
}

function hitShip() {
    session.lives--;
    if (session.lives > 0) {
        ship.invincible = true;
        ship.invincibleTimer = 2000;
        createParticles(ship.x, ship.y, 'rgba(255,200,50,1)', 15);
    } else {
        createParticles(ship.x, ship.y, 'rgba(255,100,50,1)', 25);
        gameOver();
    }
}

function applyPowerup(type) {
    const shieldBonus = 1 + (saveData.upgrades.shield || 0) * 0.3;
    switch (type) {
        case 'shield':
            ship.hasShield = true;
            ship.shieldTimer = CONFIG.shieldDuration * shieldBonus;
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

// ===== GAME OVER =====
function gameOver() {
    gameState = 'gameover';
    clearTimers();

    // Начислить монеты
    saveData.coins += session.coins;

    // Обновить рекорд
    const dist = Math.floor(session.distance);
    if (dist > saveData.bestDistance) {
        saveData.bestDistance = dist;
    }

    // Добавить в рекорды
    saveData.records.push({ distance: dist, coins: session.coins, date: Date.now() });
    saveData.records.sort((a, b) => b.distance - a.distance);
    saveData.records = saveData.records.slice(0, 20);

    saveSaveData();

    // UI
    document.getElementById('go-distance').textContent = dist;
    document.getElementById('go-crystals').textContent = session.coins;
    document.getElementById('go-best').textContent = saveData.bestDistance;
    document.getElementById('btn-revive-ad').style.display = session.canRevive ? 'block' : 'none';
    document.getElementById('btn-revive-coins').style.display =
        (session.canRevive && saveData.coins >= CONFIG.reviveCostCoins) ? 'block' : 'none';

    document.getElementById('hud').classList.remove('active');

    if (ysdk) { try { ysdk.features.GameplayAPI.stop(); } catch(e) {} }

    showInterstitialAd(() => {
        showOverlay('gameover-screen');
    });
}

function reviveAd() {
    if (!session.canRevive) return;
    showRewardedAd(() => {
        revivePlayer();
    });
}

function reviveCoins() {
    if (!session.canRevive || saveData.coins < CONFIG.reviveCostCoins) return;
    saveData.coins -= CONFIG.reviveCostCoins;
    saveSaveData();
    revivePlayer();
}

function revivePlayer() {
    session.canRevive = false;
    gameState = 'playing';
    ship.invincible = true;
    ship.invincibleTimer = 3000;
    hideAllOverlays();
    document.getElementById('hud').classList.add('active');

    // Убрать ближайшие объекты
    obstacles = obstacles.filter(o => o.y < canvas.height * 0.4);
    session.bossBullets = [];

    // Возобновить спавн
    scheduleSpawn('obstacle', 2000);
    scheduleSpawn('crystal', 1500);
    scheduleSpawn('powerup', CONFIG.powerupInterval);

    if (ysdk) { try { ysdk.features.GameplayAPI.start(); } catch(e) {} }
}

// ===== ПАУЗА =====
function pauseGame() {
    if (gameState !== 'playing') return;
    gameState = 'paused';
    clearTimers();
    showOverlay('pause-screen');
    if (ysdk) { try { ysdk.features.GameplayAPI.stop(); } catch(e) {} }
}

function resumeGame() {
    if (gameState !== 'paused') return;
    gameState = 'playing';
    hideAllOverlays();
    scheduleSpawn('obstacle', 1000);
    scheduleSpawn('crystal', 1500);
    scheduleSpawn('powerup', CONFIG.powerupInterval);
    if (ysdk) { try { ysdk.features.GameplayAPI.start(); } catch(e) {} }
}

function goToMenu() {
    gameState = 'menu';
    clearTimers();
    document.getElementById('hud').classList.remove('active');
    hideAllOverlays();
    updateAllUI();
    showOverlay('main-menu');
}

function clearTimers() {
    Object.values(spawnTimers).forEach(t => clearTimeout(t));
    spawnTimers = {};
}

// ===== РИСОВАНИЕ =====
function drawBackground() {
    const loc = session.currentLocation || LOCATIONS[0];
    const colors = loc.bgGradient;
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, colors[0]);
    grad.addColorStop(0.5, colors[1]);
    grad.addColorStop(1, colors[2]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Звёзды
    stars.forEach(s => {
        if (gameState === 'playing') {
            s.y += s.speed * (session.speed / CONFIG.baseScrollSpeed);
            if (s.y > canvas.height) { s.y = 0; s.x = Math.random() * canvas.width; }
        }
        s.brightness = 0.4 + Math.sin(Date.now() * 0.002 + s.x) * 0.3;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,220,255,${s.brightness})`;
        ctx.fill();
    });

    // Земля (для первой локации)
    if (loc.id === 'earth' && gameState === 'playing') {
        drawEarthGround();
    }
}

function drawEarthGround() {
    const groundY = canvas.height - 40;
    const progress = Math.min(1, session.distance / 50);

    if (progress < 1) {
        ctx.fillStyle = `rgba(30, 60, 30, ${1 - progress})`;
        ctx.fillRect(0, groundY, canvas.width, 40);

        // Здания на горизонте
        ctx.fillStyle = `rgba(40, 40, 60, ${(1 - progress) * 0.5})`;
        for (let i = 0; i < 8; i++) {
            const bx = i * (canvas.width / 8);
            const bh = 20 + Math.sin(i * 1.5) * 15;
            ctx.fillRect(bx, groundY - bh * (1 - progress), canvas.width / 10, bh);
        }
    }
}

function drawGame() {
    // Препятствия
    obstacles.forEach(o => drawObstacle(o));

    // Кристаллы
    crystals.forEach(c => drawCrystal(c));

    // Бонусы
    powerups.forEach(p => drawPowerup(p));

    // Пули босса
    session.bossBullets.forEach(b => {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
        ctx.fillStyle = '#ff4444';
        ctx.shadowColor = '#ff0000';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
    });

    // Вражеские корабли
    session.bossShips.forEach(bs => {
        if (!bs.alive) return;
        drawEnemyShip(bs);
    });

    // Корабль игрока
    drawShip();

    // Частицы
    particles.forEach(p => {
        if (p.life <= 0) return;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace('1)', `${p.life})`);
        ctx.fill();
    });
}

function drawShip() {
    if (!ship) return;
    if (ship.invincible && Math.floor(Date.now() / 100) % 2 === 0) return;

    const skin = SKINS_DATA.find(s => s.id === saveData.activeSkin) || SKINS_DATA[0];
    const colors = skin.colors;

    // След
    ship.trail.forEach(t => {
        if (t.alpha > 0) {
            ctx.beginPath();
            ctx.arc(t.x, t.y, 3 * t.alpha, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(100,200,255,${t.alpha * 0.4})`;
            ctx.fill();
        }
    });

    ctx.save();
    ctx.translate(ship.x, ship.y);

    // Корпус
    ctx.beginPath();
    ctx.moveTo(0, -ship.height / 2);
    ctx.lineTo(-ship.width / 2, ship.height / 2);
    ctx.lineTo(-ship.width / 4, ship.height / 3);
    ctx.lineTo(0, ship.height / 2.5);
    ctx.lineTo(ship.width / 4, ship.height / 3);
    ctx.lineTo(ship.width / 2, ship.height / 2);
    ctx.closePath();

    const grad = ctx.createLinearGradient(0, -ship.height / 2, 0, ship.height / 2);
    grad.addColorStop(0, colors[0]);
    grad.addColorStop(0.5, colors[1]);
    grad.addColorStop(1, colors[2]);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = colors[0] + '88';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Кабина
    ctx.beginPath();
    ctx.ellipse(0, -ship.height / 6, 5, 8, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff44';
    ctx.fill();

    // Двигатель
    const flameH = 6 + Math.random() * 5;
    ctx.beginPath();
    ctx.moveTo(-7, ship.height / 3);
    ctx.lineTo(0, ship.height / 3 + flameH);
    ctx.lineTo(7, ship.height / 3);
    ctx.fillStyle = `rgba(255,${150 + Math.random() * 100},50,0.8)`;
    ctx.fill();

    ctx.restore();

    // Щит
    if (ship.hasShield) {
        ctx.beginPath();
        ctx.arc(ship.x, ship.y, ship.width * 0.8, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(100,255,200,${0.4 + Math.sin(Date.now() * 0.005) * 0.2})`;
        ctx.lineWidth = 3;
        ctx.stroke();
    }
}

function drawObstacle(o) {
    ctx.save();
    ctx.translate(o.x, o.y);
    if (o.rotation !== undefined) ctx.rotate(o.rotation);

    switch (o.type) {
        case 'asteroid':
            ctx.beginPath();
            ctx.moveTo(o.verts[0].x, o.verts[0].y);
            for (let i = 1; i < o.verts.length; i++) ctx.lineTo(o.verts[i].x, o.verts[i].y);
            ctx.closePath();
            const ag = ctx.createRadialGradient(0, 0, 0, 0, 0, o.size / 2);
            ag.addColorStop(0, '#a0784c');
            ag.addColorStop(1, '#4a3520');
            ctx.fillStyle = ag;
            ctx.fill();
            ctx.strokeStyle = '#3d2810';
            ctx.lineWidth = 2;
            ctx.stroke();
            break;

        case 'bird':
            // Птица (простая анимация крыльев)
            const wing = Math.sin(o.wingPhase) * 10;
            ctx.fillStyle = '#333';
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(-12, wing);
            ctx.lineTo(-8, 0);
            ctx.lineTo(0, 2);
            ctx.lineTo(8, 0);
            ctx.lineTo(12, wing);
            ctx.lineTo(0, 0);
            ctx.fill();
            break;

        case 'debris':
            ctx.fillStyle = '#667788';
            ctx.fillRect(-o.size / 2, -o.size / 4, o.size, o.size / 2);
            ctx.fillStyle = '#445566';
            ctx.fillRect(-o.size / 3, -o.size / 3, o.size / 3, o.size / 3);
            break;
    }

    ctx.restore();
}

function drawCrystal(c) {
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.rotate(c.angle);
    ctx.shadowColor = '#00ffaa';
    ctx.shadowBlur = 12 * c.glow;

    ctx.beginPath();
    ctx.moveTo(0, -c.size / 2);
    ctx.lineTo(c.size / 3, 0);
    ctx.lineTo(0, c.size / 2);
    ctx.lineTo(-c.size / 3, 0);
    ctx.closePath();

    const cg = ctx.createLinearGradient(0, -c.size / 2, 0, c.size / 2);
    cg.addColorStop(0, '#00ffaa');
    cg.addColorStop(1, '#008866');
    ctx.fillStyle = cg;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();
}

function drawPowerup(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.scale(p.pulse, p.pulse);

    const colors = { shield: '#00ff88', magnet: '#ff66aa', slowmo: '#aa66ff' };
    const icons = { shield: '🛡', magnet: '🧲', slowmo: '⏳' };

    ctx.beginPath();
    ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
    ctx.fillStyle = (colors[p.powerType] || '#fff') + '33';
    ctx.fill();
    ctx.strokeStyle = colors[p.powerType] || '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = `${p.size * 0.55}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(icons[p.powerType] || '?', 0, 0);

    ctx.restore();
}

function drawEnemyShip(bs) {
    ctx.save();
    ctx.translate(bs.x, bs.y);

    // Вражеский корабль (перевёрнутый треугольник)
    ctx.beginPath();
    ctx.moveTo(0, bs.size / 2);
    ctx.lineTo(-bs.size / 2, -bs.size / 2);
    ctx.lineTo(bs.size / 2, -bs.size / 2);
    ctx.closePath();

    ctx.fillStyle = '#cc2222';
    ctx.fill();
    ctx.strokeStyle = '#ff4444';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Глаз
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffff00';
    ctx.fill();

    ctx.restore();
}

// ===== ЧАСТИЦЫ =====
function createParticles(x, y, color, count) {
    for (let i = 0; i < count; i++) {
        particles.push({
            x, y, color,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            size: 3 + Math.random() * 3,
            life: 1
        });
    }
}

// ===== HUD =====
function updateHUD() {
    document.getElementById('hud-distance').textContent = Math.floor(session.distance) + ' м';
    document.getElementById('hud-coins').textContent = '💎 ' + session.coins;
    document.getElementById('hud-location').textContent = session.currentLocation ? session.currentLocation.name : '';
}

// ===== ВВОД =====
function setupInput() {
    document.addEventListener('keydown', e => {
        keys[e.code] = true;
        if (e.code === 'Escape' || e.code === 'KeyP') {
            if (gameState === 'playing') pauseGame();
            else if (gameState === 'paused') resumeGame();
        }
    });
    document.addEventListener('keyup', e => { keys[e.code] = false; });

    canvas.addEventListener('touchstart', e => {
        e.preventDefault();
        touchX = e.touches[0].clientX;
        isTouching = true;
    }, { passive: false });

    canvas.addEventListener('touchmove', e => {
        e.preventDefault();
        touchX = e.touches[0].clientX;
    }, { passive: false });

    canvas.addEventListener('touchend', e => {
        e.preventDefault();
        isTouching = false;
    }, { passive: false });

    canvas.addEventListener('mousedown', e => {
        if (gameState === 'playing') { touchX = e.clientX; isTouching = true; }
    });
    canvas.addEventListener('mousemove', e => {
        if (gameState === 'playing' && isTouching) touchX = e.clientX;
    });
    canvas.addEventListener('mouseup', () => { isTouching = false; });

    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && gameState === 'playing') pauseGame();
    });
}

// ===== UI КНОПКИ =====
function setupUI() {
    document.getElementById('btn-start').addEventListener('click', () => {
        showInterstitialAd(() => startGame());
    });
    document.getElementById('btn-upgrades').addEventListener('click', () => {
        updateAllUI();
        showOverlay('upgrades-screen');
    });
    document.getElementById('btn-skins').addEventListener('click', () => {
        updateAllUI();
        showOverlay('skins-screen');
    });
    document.getElementById('btn-records').addEventListener('click', () => {
        updateAllUI();
        showOverlay('records-screen');
    });
    document.getElementById('btn-upgrades-back').addEventListener('click', () => showOverlay('main-menu'));
    document.getElementById('btn-skins-back').addEventListener('click', () => showOverlay('main-menu'));
    document.getElementById('btn-records-back').addEventListener('click', () => showOverlay('main-menu'));

    document.getElementById('btn-pause').addEventListener('click', pauseGame);
    document.getElementById('btn-resume').addEventListener('click', resumeGame);
    document.getElementById('btn-quit').addEventListener('click', goToMenu);

    document.getElementById('btn-revive-ad').addEventListener('click', reviveAd);
    document.getElementById('btn-revive-coins').addEventListener('click', reviveCoins);
    document.getElementById('btn-restart').addEventListener('click', () => {
        hideAllOverlays();
        showInterstitialAd(() => startGame());
    });
    document.getElementById('btn-go-menu').addEventListener('click', goToMenu);

    document.getElementById('btn-ad-upgrade').addEventListener('click', adUpgrade);
    document.getElementById('cutscene-next').addEventListener('click', advanceCutscene);
}

// ===== ЗАПУСК =====
window.addEventListener('load', init);
