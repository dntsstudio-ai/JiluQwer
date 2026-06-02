// ==========================================
// КОСМИЧЕСКИЙ РЫВОК (Space Dash) v4.0
// Visual Novel Cutscenes + Improved Gameplay
// ==========================================

// ===== КОНФИГУРАЦИЯ =====
const CONFIG = {
    shipWidth: 80,
    shipHeight: 96,
    shipBaseSpeed: 5.5,
    baseScrollSpeed: 2.2,
    maxScrollSpeed: 6.0,
    speedRampDistance: 2000,
    asteroidMinSize: 28,
    asteroidMaxSize: 55,
    asteroidBaseInterval: 1400,
    asteroidMinInterval: 500,
    crystalSize: 24,
    crystalBaseInterval: 1200,
    crystalValue: 5,
    powerupSize: 30,
    powerupInterval: 10000,
    shieldDuration: 6000,
    magnetDuration: 8000,
    slowmoDuration: 5000,
    shootCost: 10,
    bulletSpeed: 11,
    bulletSize: 6,
    reviveCostCoins: 50,
    maxAdUpgrades: 2,
    bossDistance: 700,
    finalDistance: 1200,
    starCount: 80,
};

// ===== ЛОКАЦИИ =====
const LOCATIONS = [
    { name: 'Земля — Старт', bg: 'bg_earth', dist: 0 },
    { name: 'Орбита Земли', bg: 'bg_orbit', dist: 100 },
    { name: 'Открытый космос', bg: 'bg_deepspace', dist: 250 },
    { name: 'Туманность', bg: 'bg_nebula', dist: 450 },
    { name: 'Зона боя', bg: 'bg_chase', dist: 700 },
];

// ===== СКИНЫ =====
const SKINS = [
    { id: 'arrow', name: 'Стрела', price: 0, img: 'ship_arrow' },
    { id: 'phoenix', name: 'Феникс', price: 120, img: 'ship_phoenix' },
    { id: 'golden', name: 'Золотой', price: 200, img: 'ship_golden' },
    { id: 'phantom', name: 'Фантом', price: 300, img: 'ship_phantom' },
    { id: 'emerald', name: 'Изумруд', price: 250, img: 'ship_emerald' },
    { id: 'ice', name: 'Ледяной', price: 150, img: 'ship_ice' },
];

// ===== УЛУЧШЕНИЯ =====
const UPGRADES = [
    { id: 'speed', name: 'Скорость', icon: '⚡', maxLevel: 5, baseCost: 30, desc: 'Скорость манёвра' },
    { id: 'shield', name: 'Щит', icon: '🛡', maxLevel: 5, baseCost: 50, desc: 'Длительность щита' },
    { id: 'magnet', name: 'Магнит', icon: '🧲', maxLevel: 5, baseCost: 40, desc: 'Радиус притяжения' },
    { id: 'luck', name: 'Удача', icon: '🍀', maxLevel: 5, baseCost: 60, desc: 'Шанс бонусов' },
    { id: 'armor', name: 'Броня', icon: '🔰', maxLevel: 3, baseCost: 100, desc: 'Доп. жизнь' },
];

// ===== КАТ-СЦЕНЫ (Visual Novel) =====
const CUTSCENES = {
    intro: [
        { speaker: 'Диспетчер', text: 'Капитан, на краю обитаемого космоса обнаружен неизвестный сигнал. Источник — система Кеплер-442.', charLeft: 'dispatcher', charRight: null, bg: 'scene_launch', speakerSide: 'left' },
        { speaker: 'Капитан', text: 'Принято. Экипаж на борту, системы в норме. Мы готовы к старту.', charLeft: 'dispatcher', charRight: 'captain', bg: 'scene_launch', speakerSide: 'right' },
        { speaker: 'Инженер', text: 'Двигатели прогреты, топливо под завязку! Всё готово, кэп!', charLeft: 'engineer', charRight: 'captain', bg: 'scene_launch', speakerSide: 'left' },
        { speaker: 'Капитан', text: 'Тогда начинаем обратный отсчёт. Экспедиция «Рывок» — старт!', charLeft: 'engineer', charRight: 'captain', bg: 'scene_launch', speakerSide: 'right' },
    ],
    boss: [
        { speaker: 'АВРОРА (ИИ)', text: 'Внимание! Обнаружены неопознанные объекты на радаре. Классификация: враждебные.', charLeft: 'ai_hologram', charRight: 'captain', bg: 'scene_attack', speakerSide: 'left' },
        { speaker: 'Капитан', text: 'Что?! Откуда они здесь? Всем боевая готовность!', charLeft: 'ai_hologram', charRight: 'captain', bg: 'scene_attack', speakerSide: 'right' },
        { speaker: 'АВРОРА (ИИ)', text: 'Группа из 5 кораблей приближается. Рекомендую уклонение и ответный огонь!', charLeft: 'ai_hologram', charRight: 'captain', bg: 'scene_attack', speakerSide: 'left' },
    ],
    retreat:[{ speaker:'Помощник-инопланетянин', text:'Нам нужно возвращаться на родную планету — там проблемы, всё серьёзно.'},{ speaker:'Главный злодей', text:'Что ж, капитан, тебе повезло… Но мы ещё встретимся!'}],
    landing: [
        { speaker: 'АВРОРА (ИИ)', text: 'Капитан, мы достигли системы Кеплер-442. Планета прямо по курсу!', charLeft: 'ai_hologram', charRight: 'captain', bg: 'scene_landing', speakerSide: 'left' },
        { speaker: 'Капитан', text: 'Невероятно... Мы сделали это. Начинаем посадку!', charLeft: 'ai_hologram', charRight: 'captain', bg: 'scene_landing', speakerSide: 'right' },
        { speaker: 'Инженер', text: 'Поверхность стабильна! Идеальное место для базы!', charLeft: 'engineer', charRight: 'captain', bg: 'scene_base', speakerSide: 'left' },
        { speaker: 'Капитан', text: 'Разворачиваем лагерь. База «Рассвет-1» установлена!', charLeft: 'engineer', charRight: 'captain', bg: 'scene_base', speakerSide: 'right' },
    ],
    attack: [
        { speaker: 'АВРОРА (ИИ)', text: 'ТРЕВОГА! Множественные контакты на орбите! Они атакуют базу!', charLeft: 'ai_hologram', charRight: 'captain', bg: 'scene_attack', speakerSide: 'left' },
        { speaker: 'Командир Захватчиков', text: 'Жалкие существа... Эта планета принадлежит НАМ. Уничтожить их!', charLeft: 'alien_commander', charRight: 'captain', bg: 'scene_attack', speakerSide: 'left' },
        { speaker: 'Капитан', text: 'Нет! Мы не отступим! Все к оружию!', charLeft: 'alien_commander', charRight: 'captain', bg: 'scene_attack', speakerSide: 'right' },
        { speaker: 'Диспетчер (Земля)', text: 'Капитан, мы засекли их базу! Координаты отправлены. Уничтожьте источник!', charLeft: 'dispatcher', charRight: 'captain', bg: 'scene_mission', speakerSide: 'left' },
        { speaker: 'Капитан', text: 'Понял, Земля. Мы летим к ним. Пора положить этому конец!', charLeft: 'dispatcher', charRight: 'captain', bg: 'scene_mission', speakerSide: 'right' },
    ],
};

// ===== ЗАГРУЗЧИК АССЕТОВ =====
class AssetLoader {
    constructor() { this.images = {}; this.audio = {}; this.loaded = 0; this.total = 0; }
    loadImage(key, src) {
        this.total++;
        return new Promise(r => { const img = new Image(); img.onload = () => { this.images[key] = img; this.loaded++; r(); }; img.onerror = () => { this.loaded++; r(); }; img.src = src; });
    }
    loadAudio(key, src, loop = false) {
        this.total++;
        return new Promise(r => { const a = new Audio(); a.loop = loop; a.preload = 'auto'; a.oncanplaythrough = () => { this.audio[key] = a; this.loaded++; r(); }; a.onerror = () => { this.loaded++; r(); }; a.src = src; });
    }
    getProgress() { return this.total > 0 ? this.loaded / this.total : 0; }
    async loadAll() {
        const p = [];
        SKINS.forEach(s => p.push(this.loadImage(s.img, `assets/ships/${s.img}.png`)));
        p.push(this.loadImage('enemy_fighter', 'assets/enemies/enemy_fighter.png'));
        p.push(this.loadImage('enemy_boss', 'assets/enemies/enemy_boss.png'));
        p.push(this.loadImage('asteroid', 'assets/effects/asteroid.png'));
        p.push(this.loadImage('crystal', 'assets/effects/crystal.png'));
        p.push(this.loadImage('bg_earth', 'assets/backgrounds/bg_earth.png'));
        p.push(this.loadImage('bg_orbit', 'assets/backgrounds/bg_orbit.png'));
        p.push(this.loadImage('bg_deepspace', 'assets/backgrounds/bg_deepspace.png'));
        p.push(this.loadImage('bg_nebula', 'assets/backgrounds/bg_nebula.png'));
        p.push(this.loadImage('bg_chase', 'assets/backgrounds/bg_chase.png'));
        p.push(this.loadImage('scene_launch', 'assets/cutscenes/scene_launch.png'));
        p.push(this.loadImage('scene_landing', 'assets/cutscenes/scene_landing.png'));
        p.push(this.loadImage('scene_base', 'assets/cutscenes/scene_base.png'));
        p.push(this.loadImage('scene_attack', 'assets/cutscenes/scene_attack.png'));
        p.push(this.loadImage('scene_mission', 'assets/cutscenes/scene_mission.png'));
        // Characters
        p.push(this.loadImage('char_dispatcher', 'assets/characters/dispatcher.png'));
        p.push(this.loadImage('char_captain', 'assets/characters/captain.png'));
        p.push(this.loadImage('char_ai_hologram', 'assets/characters/ai_hologram.png'));
        p.push(this.loadImage('char_alien_commander', 'assets/characters/alien_commander.png'));
        p.push(this.loadImage('char_engineer', 'assets/characters/engineer.png'));
        // Audio
        p.push(this.loadAudio('music_main', 'audio/music_main.mp3', true));
        p.push(this.loadAudio('music_boss', 'audio/music_boss.mp3', true));
        p.push(this.loadAudio('music_menu', 'audio/music_menu.mp3', true));
        p.push(this.loadAudio('sfx_shoot', 'audio/sfx_shoot.mp3'));
        p.push(this.loadAudio('sfx_explosion', 'audio/sfx_explosion.mp3'));
        p.push(this.loadAudio('sfx_collect', 'audio/sfx_collect.mp3'));
        p.push(this.loadAudio('sfx_hit', 'audio/sfx_hit.mp3'));
        p.push(this.loadAudio('sfx_powerup', 'audio/sfx_powerup.mp3'));
        p.push(this.loadAudio('sfx_click', 'audio/sfx_click.mp3'));
        await Promise.all(p);
    }
}

// ===== АУДИО МЕНЕДЖЕР =====
class AudioManager {
    constructor(assets) { this.assets = assets; this.current = null; this.musicVol = 0.4; this.sfxVol = 0.6; this.musicOn = true; this.sfxOn = true; }
    playMusic(key) {
        if (!this.musicOn) return;
        if (this.current) { this.current.pause(); this.current.currentTime = 0; }
        const a = this.assets.audio[key];
        if (a) { a.volume = this.musicVol; a.currentTime = 0; a.play().catch(()=>{}); this.current = a; }
    }
    stopMusic() { if (this.current) { this.current.pause(); this.current.currentTime = 0; this.current = null; } }
    playSFX(key) { if (!this.sfxOn) return; const s = this.assets.audio[key]; if (s) { const c = s.cloneNode(); c.volume = this.sfxVol; c.play().catch(()=>{}); } }
    toggleMusic() { this.musicOn = !this.musicOn; if (!this.musicOn) this.stopMusic(); return this.musicOn; }
    toggleSFX() { this.sfxOn = !this.sfxOn; return this.sfxOn; }
}

// ===== СОХРАНЕНИЕ =====
class SaveSystem {
    constructor() { this.data = this.load(); }
    getDefault() { return { coins: 0, highScore: 0, ownedSkins: ['arrow'], activeSkin: 'arrow', upgrades: { speed:0, shield:0, magnet:0, luck:0, armor:0 }, adUpgradesUsed: 0, cutsceneSeen: {}, records: [], totalGames: 0, storyPhase: 0 }; }
    load() { try { const s = localStorage.getItem('spaceDash_v4'); if (s) return {...this.getDefault(), ...JSON.parse(s)}; } catch(e){} return this.getDefault(); }
    save() { try { localStorage.setItem('spaceDash_v4', JSON.stringify(this.data)); } catch(e){} if (window.ysdk) { try { window.ysdk.getPlayer().then(p => p.setData(this.data)).catch(()=>{}); } catch(e){} } }
    addCoins(n) { this.data.coins += n; this.save(); }
    spendCoins(n) { if (this.data.coins >= n) { this.data.coins -= n; this.save(); return true; } return false; }
    updateHighScore(s) { this.data.records.push({score:s, date:Date.now()}); this.data.records.sort((a,b)=>b.score-a.score); this.data.records = this.data.records.slice(0,10); if (s > this.data.highScore) this.data.highScore = s; this.save(); }
}

// ===== ИГРОВЫЕ ОБЪЕКТЫ =====
class Particle { constructor(x,y,color,vx,vy,life){this.x=x;this.y=y;this.color=color;this.vx=vx;this.vy=vy;this.life=life;this.maxLife=life;this.size=1+Math.random()*3;} update(dt){this.x+=this.vx*dt;this.y+=this.vy*dt;this.life-=dt;} get alpha(){return Math.max(0,this.life/this.maxLife);} get dead(){return this.life<=0;} }
class Bullet { constructor(x,y,isPlayer=true){this.x=x;this.y=y;this.isPlayer=isPlayer;this.speed=isPlayer?-CONFIG.bulletSpeed:CONFIG.bulletSpeed*0.5;this.size=CONFIG.bulletSize;this.dead=false;} update(dt){this.y+=this.speed*dt*60;if(this.y<-20||this.y>window.innerHeight+20)this.dead=true;} }
class Asteroid { constructor(cw,sp){this.size=CONFIG.asteroidMinSize+Math.random()*(CONFIG.asteroidMaxSize-CONFIG.asteroidMinSize);this.x=Math.random()*(cw-this.size*2)+this.size;this.y=-this.size;this.speed=sp*(0.7+Math.random()*0.4);this.rotation=Math.random()*Math.PI*2;this.rotSpeed=(Math.random()-0.5)*0.03;this.hp=1;this.dead=false;} update(dt){this.y+=this.speed*dt*60;this.rotation+=this.rotSpeed;} }
class Crystal { constructor(cw,sp){this.x=Math.random()*(cw-40)+20;this.y=-CONFIG.crystalSize;this.speed=sp*0.85;this.size=CONFIG.crystalSize;this.bob=Math.random()*Math.PI*2;this.dead=false;} update(dt){this.y+=this.speed*dt*60;this.bob+=0.05;} }
class PowerUp { constructor(cw,sp,type){this.x=Math.random()*(cw-50)+25;this.y=-CONFIG.powerupSize;this.speed=sp*0.75;this.type=type;this.size=CONFIG.powerupSize;this.dead=false;} update(dt){this.y+=this.speed*dt*60;} }
class EnemyShip { constructor(cw,isBoss=false){this.isBoss=isBoss;this.size=isBoss?80:48;this.x=Math.random()*(cw-this.size*2)+this.size;this.y=-this.size;this.speed=isBoss?1.0:1.5+Math.random();this.hp=isBoss?15:2;this.maxHp=this.hp;this.shootTimer=0;this.shootInterval=isBoss?800:1500+Math.random()*1000;this.moveDir=Math.random()>0.5?1:-1;this.moveTimer=0;this.dead=false;this.targetY=isBoss?80:60+Math.random()*100;} update(dt,cw){if(this.y<this.targetY)this.y+=this.speed*dt*60;this.moveTimer+=dt*1000;if(this.moveTimer>2000){this.moveDir*=-1;this.moveTimer=0;}this.x+=this.moveDir*(this.isBoss?1.5:2)*dt*60;if(this.x<this.size){this.x=this.size;this.moveDir=1;}if(this.x>cw-this.size){this.x=cw-this.size;this.moveDir=-1;}} }

// ===== ГЛАВНЫЙ КЛАСС ИГРЫ =====
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.assets = new AssetLoader();
        this.audio = null;
        this.save = new SaveSystem();
        this.state = 'loading';
        this.ship = { x: 0, y: 0, width: CONFIG.shipWidth, height: CONFIG.shipHeight };
        this.asteroids = []; this.crystals = []; this.powerups = [];
        this.bullets = []; this.enemyBullets = []; this.enemies = []; this.particles = [];
        this.distance = 0; this.coinsCollected = 0; this.scrollSpeed = CONFIG.baseScrollSpeed;
        this.gameTime = 0; this.lastAsteroid = 0; this.lastCrystal = 0; this.lastPowerup = 0;
        this.shieldActive = false; this.shieldTimer = 0;
        this.magnetActive = false; this.magnetTimer = 0;
        this.slowmoActive = false; this.slowmoTimer = 0;
        this.armorHP = 0; this.bossSpawned = false; this.bossDefeated = false;
        this.revived = false; this.shootCooldown = 0;
        this.locationTransition = 1; this.currentLocationIndex = 0; this.prevLocationIndex = -1;
        this.bgScrollY = 0; this.keys = {}; this.touchX = null; this.touching = false;
        // Cutscene
        this.cutsceneData = null; this.cutsceneIndex = 0; this.cutsceneKey = '';
        this.typingText = ''; this.typingIndex = 0; this.typingTimer = 0; this.typingDone = false;
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.setupInput();
        this.init();
    }

    resize() { this.canvas.width = window.innerWidth; this.canvas.height = window.innerHeight; }

    setupInput() {
        document.addEventListener('keydown', e => {
            this.keys[e.code] = true;
            if (e.code === 'Space' && this.state === 'playing') { this.shoot(); e.preventDefault(); }
            if ((e.code === 'Escape' || e.code === 'KeyP') && this.state === 'playing') this.togglePause();
        });
        document.addEventListener('keyup', e => { this.keys[e.code] = false; });
        this.canvas.addEventListener('touchstart', e => { e.preventDefault(); this.touching = true; this.touchX = e.touches[0].clientX; });
        this.canvas.addEventListener('touchmove', e => { e.preventDefault(); this.touchX = e.touches[0].clientX; });
        this.canvas.addEventListener('touchend', e => { e.preventDefault(); this.touching = false; this.touchX = null; });
        // UI
        document.getElementById('dialog-next').addEventListener('click', () => this.nextCutscene());
        document.getElementById('btn-start').addEventListener('click', () => this.startGame());
        document.getElementById('btn-upgrades').addEventListener('click', () => this.showUpgrades());
        document.getElementById('btn-skins').addEventListener('click', () => this.showSkins());
        document.getElementById('btn-records').addEventListener('click', () => this.showRecords());
        document.getElementById('btn-settings').addEventListener('click', () => this.showScreen('screen-settings'));
        document.getElementById('btn-back-upgrades').addEventListener('click', () => this.showMenu());
        document.getElementById('btn-back-skins').addEventListener('click', () => this.showMenu());
        document.getElementById('btn-back-records').addEventListener('click', () => this.showMenu());
        document.getElementById('btn-back-settings').addEventListener('click', () => this.showMenu());
        document.getElementById('btn-pause').addEventListener('click', () => this.togglePause());
        document.getElementById('btn-resume').addEventListener('click', () => this.togglePause());
        document.getElementById('btn-quit').addEventListener('click', () => this.goToMenu());
        document.getElementById('btn-revive-ad').addEventListener('click', () => this.reviveAd());
        document.getElementById('btn-revive-coins').addEventListener('click', () => this.reviveCoins());
        document.getElementById('btn-restart').addEventListener('click', () => this.startGame());
        document.getElementById('btn-death-menu').addEventListener('click', () => this.goToMenu());
        document.getElementById('btn-shoot').addEventListener('click', () => this.shoot());
        document.getElementById('btn-ad-upgrade').addEventListener('click', () => this.adUpgrade());
        document.getElementById('btn-next-chapter').addEventListener('click', () => this.nextChapter());
        document.getElementById('btn-victory-menu').addEventListener('click', () => this.goToMenu());
        document.getElementById('toggle-music').addEventListener('click', e => { const on = this.audio.toggleMusic(); e.target.textContent = on ? 'ВКЛ' : 'ВЫКЛ'; e.target.className = 'btn-toggle ' + (on ? 'on' : 'off'); this.save.data.musicOn = on; this.save.save(); if (on && this.state === 'menu') this.audio.playMusic('music_menu'); });
        document.getElementById('toggle-sfx').addEventListener('click', e => { const on = this.audio.toggleSFX(); e.target.textContent = on ? 'ВКЛ' : 'ВЫКЛ'; e.target.className = 'btn-toggle ' + (on ? 'on' : 'off'); this.save.data.sfxOn = on; this.save.save(); });
        // Mobile arrows
        const btnL = document.getElementById('btn-left');
        const btnR = document.getElementById('btn-right');
        if (btnL) { btnL.addEventListener('touchstart', e => { e.preventDefault(); this.keys['ArrowLeft'] = true; }); btnL.addEventListener('touchend', e => { e.preventDefault(); this.keys['ArrowLeft'] = false; }); }
        if (btnR) { btnR.addEventListener('touchstart', e => { e.preventDefault(); this.keys['ArrowRight'] = true; }); btnR.addEventListener('touchend', e => { e.preventDefault(); this.keys['ArrowRight'] = false; }); }
    }

    async init() {
        this.showScreen('screen-loading');
        const loadInterval = setInterval(() => {
            const pct = Math.round(this.assets.getProgress() * 100);
            const fill = document.getElementById('loading-fill');
            const text = document.getElementById('loading-text');
            if (fill) fill.style.width = pct + '%';
            if (text) text.textContent = 'Загрузка... ' + pct + '%';
        }, 100);
        await this.assets.loadAll();
        clearInterval(loadInterval);
        document.getElementById('loading-fill').style.width = '100%';
        this.audio = new AudioManager(this.assets);
        if (this.save.data.musicOn === false) this.audio.musicOn = false;
        if (this.save.data.sfxOn === false) this.audio.sfxOn = false;
        setTimeout(() => {
            if (!this.save.data.cutsceneSeen['intro']) {
                this.startCutscene('intro');
            } else {
                this.showMenu();
            }
        }, 500);
        this.lastTime = performance.now();
        requestAnimationFrame(t => this.gameLoop(t));
    }

    // ===== ЭКРАНЫ =====
    showScreen(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        const el = document.getElementById(id);
        if (el) el.classList.add('active');
        document.getElementById('game-hud').classList.add('hidden');
    }

    showMenu() {
        this.state = 'menu';
        this.showScreen('screen-menu');
        document.getElementById('menu-coins').textContent = '💎 ' + this.save.data.coins;
        this.audio.playMusic('music_menu');
    }

    // ===== КАТ-СЦЕНЫ (Visual Novel) =====
    startCutscene(key) {
        this.state = 'cutscene';
        this.cutsceneKey = key;
        this.cutsceneData = CUTSCENES[key];
        this.cutsceneIndex = 0;
        this.showScreen('screen-cutscene');
        this.showCutsceneFrame();
    }

    showCutsceneFrame() {
        if (this.cutsceneIndex >= this.cutsceneData.length) {
            this.endCutscene();
            return;
        }
        const frame = this.cutsceneData[this.cutsceneIndex];
        // Background
        const bgEl = document.getElementById('cutscene-bg');
        if (frame.bg && this.assets.images[frame.bg]) {
            bgEl.style.backgroundImage = `url(${this.assets.images[frame.bg].src})`;
            bgEl.style.opacity = '0.8';
        } else {
            bgEl.style.opacity = '0.3';
        }
        // Characters
        const charL = document.getElementById('char-left');
        const charR = document.getElementById('char-right');
        charL.className = 'cutscene-char left';
        charR.className = 'cutscene-char right';
        charL.style.backgroundImage = '';
        charR.style.backgroundImage = '';
        if (frame.charLeft) {
            const img = this.assets.images['char_' + frame.charLeft];
            if (img) { charL.style.backgroundImage = `url(${img.src})`; charL.classList.add('visible'); charL.classList.add(frame.speakerSide === 'left' ? 'speaking' : 'dimmed'); }
        }
        if (frame.charRight) {
            const img = this.assets.images['char_' + frame.charRight];
            if (img) { charR.style.backgroundImage = `url(${img.src})`; charR.classList.add('visible'); charR.classList.add(frame.speakerSide === 'right' ? 'speaking' : 'dimmed'); }
        }
        // Dialog with typing effect
        document.getElementById('dialog-speaker').textContent = frame.speaker;
        this.typingText = frame.text;
        this.typingIndex = 0;
        this.typingDone = false;
        document.getElementById('dialog-text').textContent = '';
    }

    nextCutscene() {
        this.audio.playSFX('sfx_click');
        if (!this.typingDone) {
            // Skip typing — show full text
            document.getElementById('dialog-text').textContent = this.typingText;
            this.typingDone = true;
            return;
        }
        this.cutsceneIndex++;
        this.showCutsceneFrame();
    }

    endCutscene() {
        this.save.data.cutsceneSeen[this.cutsceneKey] = true;
        this.save.save();
        if (this.cutsceneKey === 'intro') { this.showMenu(); }
        else if (this.cutsceneKey === 'boss') { this.state = 'playing'; document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); document.getElementById('game-hud').classList.remove('hidden'); this.spawnBossWave(); }
        else if (this.cutsceneKey === 'landing') { this.startCutscene('attack'); }
        else if (this.cutsceneKey === 'attack') { this.showVictory(); }
    }

    // ===== УЛУЧШЕНИЯ =====
    showUpgrades() {
        this.audio.playSFX('sfx_click');
        this.showScreen('screen-upgrades');
        document.getElementById('upgrades-coins').textContent = '💎 ' + this.save.data.coins;
        const list = document.getElementById('upgrades-list');
        list.innerHTML = '';
        UPGRADES.forEach(upg => {
            const lv = this.save.data.upgrades[upg.id] || 0;
            const cost = upg.baseCost + lv * 25;
            const maxed = lv >= upg.maxLevel;
            const can = this.save.data.coins >= cost && !maxed;
            const div = document.createElement('div');
            div.className = 'upgrade-item';
            div.innerHTML = `<div class="upgrade-icon">${upg.icon}</div><div class="upgrade-info"><div class="upgrade-name">${upg.name} (${lv}/${upg.maxLevel})</div><div class="upgrade-level">${upg.desc}</div></div><button class="upgrade-btn ${maxed?'maxed':''}" ${can?'':'disabled'}>${maxed?'МАКС':cost+'💎'}</button>`;
            if (can) div.querySelector('.upgrade-btn').addEventListener('click', () => { this.save.spendCoins(cost); this.save.data.upgrades[upg.id] = lv + 1; this.save.save(); this.audio.playSFX('sfx_powerup'); this.showUpgrades(); });
            list.appendChild(div);
        });
        document.getElementById('ad-left').textContent = Math.max(0, CONFIG.maxAdUpgrades - (this.save.data.adUpgradesUsed||0));
    }

    // ===== СКИНЫ =====
    showSkins() {
        this.audio.playSFX('sfx_click');
        this.showScreen('screen-skins');
        document.getElementById('skins-coins').textContent = '💎 ' + this.save.data.coins;
        const grid = document.getElementById('skins-grid');
        grid.innerHTML = '';
        SKINS.forEach(skin => {
            const owned = this.save.data.ownedSkins.includes(skin.id);
            const active = this.save.data.activeSkin === skin.id;
            const div = document.createElement('div');
            div.className = `skin-card ${active?'selected':''} ${!owned?'locked':''}`;
            div.innerHTML = `<img class="skin-img" src="assets/ships/${skin.img}.png" alt="${skin.name}"><div class="skin-name">${skin.name}</div><div class="skin-price">${owned?(active?'✓ Выбран':'Выбрать'):skin.price+'💎'}</div>`;
            div.addEventListener('click', () => {
                if (active) return;
                if (owned) { this.save.data.activeSkin = skin.id; this.save.save(); this.audio.playSFX('sfx_click'); this.showSkins(); }
                else if (this.save.data.coins >= skin.price) { this.save.spendCoins(skin.price); this.save.data.ownedSkins.push(skin.id); this.save.data.activeSkin = skin.id; this.save.save(); this.audio.playSFX('sfx_collect'); this.showSkins(); }
            });
            grid.appendChild(div);
        });
    }

    // ===== РЕКОРДЫ =====
    showRecords() {
        this.audio.playSFX('sfx_click');
        this.showScreen('screen-records');
        const list = document.getElementById('records-list');
        const recs = this.save.data.records.slice(0, 10);
        if (recs.length === 0) { list.innerHTML = '<div style="text-align:center;color:#556;padding:2rem;">Пока нет рекордов</div>'; }
        else { list.innerHTML = recs.map((r,i) => `<div class="record-item"><span>#${i+1}</span><span>${r.score} м</span></div>`).join(''); }
    }

    // ===== ГЕЙМПЛЕЙ =====
    startGame() {
        this.state = 'playing';
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById('game-hud').classList.remove('hidden');
        this.distance = 0; this.coinsCollected = 0; this.gameTime = 0;
        this.scrollSpeed = CONFIG.baseScrollSpeed;
        this.asteroids = []; this.crystals = []; this.powerups = [];
        this.bullets = []; this.enemyBullets = []; this.enemies = []; this.particles = [];
        this.shieldActive = false; this.magnetActive = false; this.slowmoActive = false;
        this.bossSpawned = false; this.bossDefeated = false; this.revived = false;
        this.currentLocationIndex = 0; this.prevLocationIndex = -1; this.locationTransition = 1;
        this.bgScrollY = 0; this.armorHP = this.save.data.upgrades.armor || 0;
        this.ship.x = this.canvas.width / 2;
        this.ship.y = this.canvas.height - 100;
        this.audio.playMusic('music_main');
        this.save.data.totalGames++;
        this.save.save();
        this.showFullscreenAd();
    }

    shoot() {
        if (this.state !== 'playing' || this.shootCooldown > 0) return;
        if (this.coinsCollected < CONFIG.shootCost && this.save.data.coins < CONFIG.shootCost) return;
        if (this.coinsCollected >= CONFIG.shootCost) this.coinsCollected -= CONFIG.shootCost;
        else { this.save.spendCoins(CONFIG.shootCost - this.coinsCollected); this.coinsCollected = 0; }
        this.bullets.push(new Bullet(this.ship.x, this.ship.y - this.ship.height/2));
        this.shootCooldown = 200;
        this.audio.playSFX('sfx_shoot');
        for (let i = 0; i < 3; i++) this.particles.push(new Particle(this.ship.x, this.ship.y - this.ship.height/2, '#4af', (Math.random()-0.5)*2, -3-Math.random()*2, 0.3));
    }

    spawnBossWave() {
        this.bossSpawned = true;
        for (let i = 0; i < 4; i++) {
            setTimeout(() => { const e = new EnemyShip(this.canvas.width, false); e.x = (this.canvas.width / 5) * (i + 1); this.enemies.push(e); }, i * 400);
        }
        this.audio.playMusic('music_boss');
    }

    togglePause() {
        if (this.state === 'playing') { this.state = 'paused'; this.showScreen('screen-pause'); if (this.audio.current) this.audio.current.pause(); }
        else if (this.state === 'paused') { this.state = 'playing'; document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); document.getElementById('game-hud').classList.remove('hidden'); if (this.audio.current) this.audio.current.play().catch(()=>{}); }
    }

    goToMenu() { this.state = 'menu'; this.save.addCoins(this.coinsCollected); this.coinsCollected = 0; this.showMenu(); }

    gameOver() {
        this.state = 'gameover';
        this.audio.stopMusic();
        this.audio.playSFX('sfx_explosion');
        const dist = Math.floor(this.distance);
        this.save.updateHighScore(dist);
        this.save.addCoins(this.coinsCollected);
        document.getElementById('death-stat-dist').textContent = 'Дистанция: ' + dist + ' м';
        document.getElementById('death-stat-coins').textContent = 'Кристаллы: +' + this.coinsCollected;
        document.getElementById('death-stat-record').textContent = 'Рекорд: ' + this.save.data.highScore + ' м';
        this.showScreen('screen-death');
        document.getElementById('btn-revive-ad').style.display = this.revived ? 'none' : 'block';
        document.getElementById('btn-revive-coins').style.display = (!this.revived && this.save.data.coins >= CONFIG.reviveCostCoins) ? 'block' : 'none';
        this.showFullscreenAd();
    }

    showVictory() {
        this.state = 'victory';
        this.audio.stopMusic();
        const bonus = 200;
        this.save.addCoins(this.coinsCollected + bonus);
        this.save.updateHighScore(Math.floor(this.distance));
        this.save.data.storyPhase = (this.save.data.storyPhase || 0) + 1;
        this.save.save();
        document.getElementById('victory-dist').textContent = 'Дистанция: ' + Math.floor(this.distance) + ' м';
        document.getElementById('victory-coins').textContent = 'Собрано: ' + this.coinsCollected + ' + ' + bonus + ' бонус';
        this.showScreen('screen-victory');
    }

    nextChapter() { this.audio.playSFX('sfx_click'); this.startGame(); }

    reviveAd() {
        if (window.ysdk) { window.ysdk.adv.showRewardedVideo({ callbacks: { onRewarded: () => this.doRevive(), onClose: ()=>{}, onError: () => this.doRevive() } }); }
        else this.doRevive();
    }
    reviveCoins() { if (this.save.spendCoins(CONFIG.reviveCostCoins)) this.doRevive(); }
    doRevive() { this.revived = true; this.state = 'playing'; document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); document.getElementById('game-hud').classList.remove('hidden'); this.shieldActive = true; this.shieldTimer = 3000; this.enemies = []; this.enemyBullets = []; this.audio.playMusic(this.bossSpawned ? 'music_boss' : 'music_main'); }

    adUpgrade() {
        if ((this.save.data.adUpgradesUsed||0) >= CONFIG.maxAdUpgrades) return;
        if (window.ysdk) { window.ysdk.adv.showRewardedVideo({ callbacks: { onRewarded: () => { this.save.addCoins(50); this.save.data.adUpgradesUsed = (this.save.data.adUpgradesUsed||0)+1; this.save.save(); this.showUpgrades(); } } }); }
        else { this.save.addCoins(50); this.save.data.adUpgradesUsed = (this.save.data.adUpgradesUsed||0)+1; this.save.save(); this.showUpgrades(); }
    }

    showFullscreenAd() { if (window.ysdk) { try { window.ysdk.adv.showFullscreenAdv({ callbacks: { onClose:()=>{}, onError:()=>{} } }); } catch(e){} } }

    // ===== ИГРОВОЙ ЦИКЛ =====
    gameLoop(time) {
        const dt = Math.min((time - this.lastTime) / 1000, 0.05);
        this.lastTime = time;
        if (this.state === 'playing') { this.update(dt); this.render(); }
        else if (this.state === 'menu' || this.state === 'cutscene' || this.state === 'paused') { this.renderMenuBg(dt); }
        // Typing effect for cutscene
        if (this.state === 'cutscene' && !this.typingDone) {
            this.typingTimer += dt;
            if (this.typingTimer > 0.025) {
                this.typingTimer = 0;
                this.typingIndex++;
                if (this.typingIndex >= this.typingText.length) { this.typingDone = true; document.getElementById('dialog-text').textContent = this.typingText; }
                else { document.getElementById('dialog-text').textContent = this.typingText.substring(0, this.typingIndex); }
            }
        }
        requestAnimationFrame(t => this.gameLoop(t));
    }

    update(dt) {
        this.gameTime += dt * 1000;
        this.shootCooldown = Math.max(0, this.shootCooldown - dt * 1000);
        // Speed ramp
        const progress = Math.min(this.distance / CONFIG.speedRampDistance, 1);
        this.scrollSpeed = CONFIG.baseScrollSpeed + (CONFIG.maxScrollSpeed - CONFIG.baseScrollSpeed) * progress;
        const timeScale = this.slowmoActive ? 0.5 : 1.0;
        const eDt = dt * timeScale;
        // Distance
        this.distance += this.scrollSpeed * eDt * 3;
        // Location
        let newLoc = 0;
        for (let i = LOCATIONS.length - 1; i >= 0; i--) { if (this.distance >= LOCATIONS[i].dist) { newLoc = i; break; } }
        if (newLoc !== this.currentLocationIndex) { this.prevLocationIndex = this.currentLocationIndex; this.currentLocationIndex = newLoc; this.locationTransition = 0; this.showLocationTransition(LOCATIONS[newLoc].name); }
        if (this.locationTransition < 1) this.locationTransition = Math.min(1, this.locationTransition + dt * 0.5);
        this.bgScrollY += this.scrollSpeed * eDt * 2;
        // Boss at 700m
        if (this.distance >= CONFIG.bossDistance && !this.bossSpawned && !this.bossDefeated) {
            if (!this.save.data.cutsceneSeen['boss']) { this.state = 'cutscene'; this.startCutscene('boss'); return; }
            else this.spawnBossWave();
        }
        if (this.distance>=80 && this.crystals!==undefined && this.crystals<=0 && !this.retreatTriggered){ this.retreatTriggered=true; this.state='cutscene'; this.startCutscene('retreat'); return; }
        // Final at 1200m
        if (this.distance >= CONFIG.finalDistance && !this.save.data.cutsceneSeen['landing']) { this.startCutscene('landing'); return; }
        // Ship movement
        const shipSpeed = CONFIG.shipBaseSpeed + (this.save.data.upgrades.speed || 0) * 1.2;
        if (this.keys['ArrowLeft'] || this.keys['KeyA']) this.ship.x -= shipSpeed * eDt * 60;
        if (this.keys['ArrowRight'] || this.keys['KeyD']) this.ship.x += shipSpeed * eDt * 60;
        if (this.touching && this.touchX !== null) { this.ship.x += (this.touchX - this.ship.x) * 0.25; }
        this.ship.x = Math.max(this.ship.width/2, Math.min(this.canvas.width - this.ship.width/2, this.ship.x));
        // Spawning
        const spawnMult = 1 + this.distance / 800;
        if (this.gameTime - this.lastAsteroid > CONFIG.asteroidBaseInterval / spawnMult) { this.asteroids.push(new Asteroid(this.canvas.width, this.scrollSpeed)); this.lastAsteroid = this.gameTime; }
        const luckBonus = 1 + (this.save.data.upgrades.luck || 0) * 0.15;
        if (this.gameTime - this.lastCrystal > CONFIG.crystalBaseInterval / luckBonus) { this.crystals.push(new Crystal(this.canvas.width, this.scrollSpeed)); this.lastCrystal = this.gameTime; }
        if (this.gameTime - this.lastPowerup > CONFIG.powerupInterval) { const types = ['shield','magnet','slowmo']; this.powerups.push(new PowerUp(this.canvas.width, this.scrollSpeed, types[Math.floor(Math.random()*3)])); this.lastPowerup = this.gameTime; }
        // Update objects
        this.asteroids.forEach(a => a.update(eDt));
        this.crystals.forEach(c => c.update(eDt));
        this.powerups.forEach(p => p.update(eDt));
        this.bullets.forEach(b => b.update(eDt));
        this.enemyBullets.forEach(b => b.update(eDt));
        this.enemies.forEach(e => e.update(eDt, this.canvas.width));
        this.particles.forEach(p => p.update(eDt));
        // Enemy shooting
        this.enemies.forEach(e => { if (e.dead || e.y < e.targetY) return; e.shootTimer += dt*1000; if (e.shootTimer >= e.shootInterval) { e.shootTimer = 0; this.enemyBullets.push(new Bullet(e.x, e.y + e.size/2, false)); } });
        // Magnet
        if (this.magnetActive) { const mr = 150 + (this.save.data.upgrades.magnet||0)*30; this.crystals.forEach(c => { const dx=this.ship.x-c.x, dy=this.ship.y-c.y, d=Math.hypot(dx,dy); if(d<mr){c.x+=dx/d*4*eDt*60; c.y+=dy/d*4*eDt*60;} }); }
        // Collisions
        this.checkCollisions();
        // Timers
        if (this.shieldActive) { this.shieldTimer -= dt*1000; if (this.shieldTimer<=0) this.shieldActive=false; }
        if (this.magnetActive) { this.magnetTimer -= dt*1000; if (this.magnetTimer<=0) this.magnetActive=false; }
        if (this.slowmoActive) { this.slowmoTimer -= dt*1000; if (this.slowmoTimer<=0) this.slowmoActive=false; }
        // Cleanup
        this.asteroids = this.asteroids.filter(a => !a.dead && a.y < this.canvas.height+100);
        this.crystals = this.crystals.filter(c => !c.dead && c.y < this.canvas.height+50);
        this.powerups = this.powerups.filter(p => !p.dead && p.y < this.canvas.height+50);
        this.bullets = this.bullets.filter(b => !b.dead);
        this.enemyBullets = this.enemyBullets.filter(b => !b.dead);
        this.enemies = this.enemies.filter(e => !e.dead);
        this.particles = this.particles.filter(p => !p.dead);
        // Engine particles
        if (Math.random() < 0.5) this.particles.push(new Particle(this.ship.x+(Math.random()-0.5)*10, this.ship.y+this.ship.height/2, Math.random()>0.5?'#4af':'#88f', (Math.random()-0.5)*1, 2+Math.random()*2, 0.3));
        // HUD
        document.getElementById('hud-distance').textContent = Math.floor(this.distance) + ' м';
        document.getElementById('hud-location').textContent = LOCATIONS[this.currentLocationIndex].name;
        document.getElementById('hud-coins').textContent = '💎 ' + (this.coinsCollected + this.save.data.coins);
    }

    checkCollisions() {
        const sx = this.ship.x, sy = this.ship.y, sw = this.ship.width*0.4;
        // Bullets vs asteroids
        this.bullets.forEach(b => { if (!b.isPlayer) return; this.asteroids.forEach(a => { if (a.dead) return; if (Math.hypot(b.x-a.x, b.y-a.y) < a.size/2+b.size) { b.dead=true; a.hp--; if(a.hp<=0){a.dead=true; this.spawnExplosion(a.x,a.y,'#888'); this.audio.playSFX('sfx_explosion');} } }); });
        // Bullets vs enemies
        this.bullets.forEach(b => { if (!b.isPlayer || b.dead) return; this.enemies.forEach(e => { if (e.dead) return; if (Math.hypot(b.x-e.x, b.y-e.y) < e.size/2+b.size) { b.dead=true; e.hp--; this.audio.playSFX('sfx_hit'); if(e.hp<=0){e.dead=true; this.spawnExplosion(e.x,e.y,'#f44'); this.audio.playSFX('sfx_explosion'); this.coinsCollected+=e.isBoss?50:15; if(this.enemies.filter(x=>!x.dead).length<=1){this.bossDefeated=true; this.audio.playMusic('music_main');}} } }); });
        // Asteroids vs ship
        this.asteroids.forEach(a => { if (a.dead) return; if (Math.hypot(sx-a.x, sy-a.y) < sw+a.size/2) { if(this.shieldActive){a.dead=true; this.spawnExplosion(a.x,a.y,'#4af');} else if(this.armorHP>0){this.armorHP--; a.dead=true; this.spawnExplosion(a.x,a.y,'#ff0'); this.audio.playSFX('sfx_hit');} else this.gameOver(); } });
        // Enemy bullets vs ship
        this.enemyBullets.forEach(b => { if (Math.hypot(sx-b.x, sy-b.y) < sw+b.size) { b.dead=true; if(this.shieldActive){this.spawnExplosion(b.x,b.y,'#4af');} else if(this.armorHP>0){this.armorHP--; this.audio.playSFX('sfx_hit');} else this.gameOver(); } });
        // Crystals vs ship
        this.crystals.forEach(c => { if (c.dead) return; if (Math.hypot(sx-c.x, sy-c.y) < sw+c.size) { c.dead=true; this.coinsCollected+=CONFIG.crystalValue; this.audio.playSFX('sfx_collect'); this.spawnExplosion(c.x,c.y,'#4ff'); } });
        // Powerups vs ship
        this.powerups.forEach(p => { if (p.dead) return; if (Math.hypot(sx-p.x, sy-p.y) < sw+p.size) { p.dead=true; this.audio.playSFX('sfx_powerup'); const sb=(this.save.data.upgrades.shield||0)*1000; if(p.type==='shield'){this.shieldActive=true;this.shieldTimer=CONFIG.shieldDuration+sb;} if(p.type==='magnet'){this.magnetActive=true;this.magnetTimer=CONFIG.magnetDuration;} if(p.type==='slowmo'){this.slowmoActive=true;this.slowmoTimer=CONFIG.slowmoDuration;} } });
    }

    spawnExplosion(x, y, color) { for (let i=0;i<12;i++){const a=(Math.PI*2/12)*i,s=2+Math.random()*3; this.particles.push(new Particle(x,y,color,Math.cos(a)*s,Math.sin(a)*s,0.5+Math.random()*0.3));} }

    showLocationTransition(name) {
        const el = document.getElementById('location-transition');
        document.getElementById('transition-name').textContent = name;
        el.classList.remove('hidden');
        el.classList.remove('show');
        void el.offsetWidth;
        el.classList.add('show');
        setTimeout(() => { el.classList.add('hidden'); el.classList.remove('show'); }, 2600);
    }

    // ===== РЕНДЕРИНГ =====
    render() {
        const ctx = this.ctx, w = this.canvas.width, h = this.canvas.height;
        this.renderBackground(ctx, w, h);
        // Particles (behind)
        this.particles.forEach(p => { ctx.globalAlpha = p.alpha; ctx.fillStyle = p.color; ctx.fillRect(p.x-p.size/2, p.y-p.size/2, p.size, p.size); }); ctx.globalAlpha = 1;
        // Crystals
        this.crystals.forEach(c => { const img = this.assets.images['crystal']; if(img){const bob=Math.sin(c.bob)*3; ctx.drawImage(img, c.x-c.size/2, c.y-c.size/2+bob, c.size, c.size);} else{ctx.fillStyle='#4ff'; ctx.fillRect(c.x-c.size/2,c.y-c.size/2,c.size,c.size);} });
        // Powerups
        this.powerups.forEach(p => { ctx.fillStyle = p.type==='shield'?'#4af':p.type==='magnet'?'#f4a':'#fa4'; ctx.beginPath(); ctx.arc(p.x,p.y,p.size/2,0,Math.PI*2); ctx.fill(); ctx.fillStyle='#fff'; ctx.font='16px Arial'; ctx.textAlign='center'; ctx.fillText(p.type==='shield'?'🛡':p.type==='magnet'?'🧲':'⏳',p.x,p.y+5); });
        // Asteroids
        this.asteroids.forEach(a => { const img=this.assets.images['asteroid']; if(img){ctx.save();ctx.translate(a.x,a.y);ctx.rotate(a.rotation);ctx.drawImage(img,-a.size/2,-a.size/2,a.size,a.size);ctx.restore();} else{ctx.fillStyle='#666';ctx.beginPath();ctx.arc(a.x,a.y,a.size/2,0,Math.PI*2);ctx.fill();} });
        // Enemies
        this.enemies.forEach(e => { const img=this.assets.images[e.isBoss?'enemy_boss':'enemy_fighter']; if(img)ctx.drawImage(img,e.x-e.size/2,e.y-e.size/2,e.size,e.size); else{ctx.fillStyle='#f44';ctx.fillRect(e.x-e.size/2,e.y-e.size/2,e.size,e.size);} if(e.hp<e.maxHp){const bw=e.size*0.8;ctx.fillStyle='#300';ctx.fillRect(e.x-bw/2,e.y-e.size/2-8,bw,4);ctx.fillStyle='#f44';ctx.fillRect(e.x-bw/2,e.y-e.size/2-8,bw*(e.hp/e.maxHp),4);} });
        // Player bullets
        ctx.fillStyle='#4af'; ctx.shadowColor='#4af'; ctx.shadowBlur=8;
        this.bullets.forEach(b => { ctx.fillRect(b.x-2,b.y-8,4,16); }); ctx.shadowBlur=0;
        // Enemy bullets
        ctx.fillStyle='#f44'; ctx.shadowColor='#f44'; ctx.shadowBlur=8;
        this.enemyBullets.forEach(b => { ctx.beginPath(); ctx.arc(b.x,b.y,b.size,0,Math.PI*2); ctx.fill(); }); ctx.shadowBlur=0;
        // Ship
        this.renderShip(ctx);
    }

    renderBackground(ctx, w, h) {
        const loc = LOCATIONS[this.currentLocationIndex];
        const bgImg = this.assets.images[loc.bg];
        if (bgImg) { const scrollY = this.bgScrollY % h; ctx.drawImage(bgImg, 0, scrollY-h, w, h); ctx.drawImage(bgImg, 0, scrollY, w, h); }
        else { ctx.fillStyle = '#0a0a2e'; ctx.fillRect(0,0,w,h); }
        // Transition fade
        if (this.locationTransition < 1 && this.prevLocationIndex >= 0) {
            const prev = this.assets.images[LOCATIONS[this.prevLocationIndex].bg];
            if (prev) { ctx.globalAlpha = 1 - this.locationTransition; const scrollY = this.bgScrollY % h; ctx.drawImage(prev, 0, scrollY-h, w, h); ctx.drawImage(prev, 0, scrollY, w, h); ctx.globalAlpha = 1; }
        }
        // Stars
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        for (let i=0;i<50;i++){const sx=(i*137.5+this.bgScrollY*(0.5+i*0.01))%w, sy=(i*97.3+this.bgScrollY*(0.3+i*0.005))%h; ctx.fillRect(sx,sy,(i%3===0)?2:1,(i%3===0)?2:1);}
    }

    renderShip(ctx) {
        const skin = SKINS.find(s => s.id === this.save.data.activeSkin) || SKINS[0];
        const img = this.assets.images[skin.img];
        ctx.save();
        if (this.shieldActive) { ctx.beginPath(); ctx.arc(this.ship.x, this.ship.y, this.ship.width*0.8, 0, Math.PI*2); ctx.strokeStyle=`rgba(68,170,255,${0.5+Math.sin(this.gameTime/200)*0.3})`; ctx.lineWidth=3; ctx.stroke(); ctx.fillStyle='rgba(68,170,255,0.1)'; ctx.fill(); }
        if (img) ctx.drawImage(img, this.ship.x-this.ship.width/2, this.ship.y-this.ship.height/2, this.ship.width, this.ship.height);
        else { ctx.fillStyle='#4af'; ctx.beginPath(); ctx.moveTo(this.ship.x,this.ship.y-this.ship.height/2); ctx.lineTo(this.ship.x-this.ship.width/2,this.ship.y+this.ship.height/2); ctx.lineTo(this.ship.x+this.ship.width/2,this.ship.y+this.ship.height/2); ctx.closePath(); ctx.fill(); }
        ctx.restore();
    }

    renderMenuBg(dt) {
        const ctx=this.ctx, w=this.canvas.width, h=this.canvas.height;
        this.bgScrollY += 0.8;
        const bgImg = this.assets.images['bg_deepspace'];
        if (bgImg) { const scrollY=this.bgScrollY%h; ctx.drawImage(bgImg,0,scrollY-h,w,h); ctx.drawImage(bgImg,0,scrollY,w,h); }
        else { ctx.fillStyle='#0a0a2a'; ctx.fillRect(0,0,w,h); }
        ctx.fillStyle='rgba(255,255,255,0.5)';
        for(let i=0;i<60;i++){const sx=(i*137.5+this.bgScrollY*0.3)%w, sy=(i*97.3+this.bgScrollY*0.2)%h; ctx.fillRect(sx,sy,1.5,1.5);}
    }
}

// ===== ЗАПУСК =====
window.addEventListener('load', () => {
    if (window.YaGames) { YaGames.init().then(ysdk => { window.ysdk = ysdk; ysdk.features.LoadingAPI?.ready(); new Game(); }); }
    else { new Game(); }
});
