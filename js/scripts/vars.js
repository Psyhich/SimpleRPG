define([],function () {
     var vars = {};

    /*Variables*/
    //Main
    vars.canvas;
    vars.ctx = null;
    vars.dt = 0;
    //Debugging
    vars.isDebug = null;
    //Time
    vars.now;
    vars.gameTime = 0;

    //For loading
    vars.loaded = 0;
    vars.shouldLoad = 25;

    //Event and configuration system
    vars.events = {
        "isLoaded":true,
        "isShouldMoveEnemies":false,
        "isMenuOpen":false,
        "isPaused":false,
        "isInventoryOpen":false,
        "isLeftMouthClicked":false,
        "isRightMouthClicked":false,
        "isMouthWithInv":false,
        "isInvBarWithMouse":false,
        "isFReleased":false,
        "isWheel":false,
        "isSkillsOpen":false
    };
    vars.config = {};
    vars.createRuned = false;
    vars.Game = {};

    //Viewport
    vars.camera = {};
    vars.sWidth = screen.width;

    //Mouse
    vars.mouseX = null;
    vars.mouseY = null;
    vars.invShouldFollow = null;

    //For game play
    vars.isPhone = false;
    //Save games
    vars.isLoadedFromSaveGame = false;

    //Time
    vars.lastTime = 0;

    //Sprites
    vars.acceptButtonSprite = null;
    vars.shopSprite = null;
    vars.alertSprite = null;
    vars.tilesSprite = null;
    vars.bookSprites = null;
    vars.skillsSprite = null;
    vars.expSprite = null;
    vars.moneySprites = null;
    vars.consumablesSprite = null;
    vars.swordsSpriteSheet = null;
    vars.inventorySprite = null;
    vars.armorSprites = null;
    vars.playerUISprite = null;
    vars.shieldsSprite = null;
    vars.questItemsSprite = null;
    vars.scrollSprite = null;
    vars.playerHotbarSprite = null;
    vars.skillsMenuSprite = null;
    vars.upgradeMenuSprite = null;
    vars.bowsSprites = null;
    vars.arrowsSprite = null;
    vars.radiosSprite = null;
    vars.configsSprite = null;
    vars.menuSprite = null;
    vars.staffsSprite = null;

    //Buttons
    vars.inventoryButtonSprite = null;
    vars.attackButtonSprite = null;
    vars.controllerSprite = null;
    vars.pauseButtonSprite = null;
    vars.interactButtonSprite = null;
    //Map
    vars.map;

    //Input
    vars.isWPressed = false;
    vars.isSPressed = false;
    vars.isDPressed = false;
    vars.isSpacePressed = false;
    vars.isPPressed = false;
    vars.isAPressed = false;
    vars.isITogled = false;
    vars.isFPressed = false;
    vars.isYPressed = false;
    vars.isEPressed = false;
    vars.isUPressed = false;
    vars.isTPressed = false;
    vars.isEscPressed = false;
    vars.lookForEsc = false;
    vars.lookForY = false;
    vars.lookForU = false;
    vars.numbers = [];
    //Touch input
    vars.touchCache = [];
    //Phone and others input buttons
    vars.inventoryButton = null;
    vars.attackButton = null;
    vars.controllerButton = null;
    vars.pauseButton = null;
    vars.interactButton = null;

    //Other for input
    vars.lookForF = false;

    //Player
    vars.player = {};
    vars.playerInventory = {};
    vars.inventoryLength = 9;
    vars.playerAttackBox = {};
    vars.playerHotbar = {};
    vars.players = [];

    //Enemies

    vars.spawners = [];

    //NPC
    vars.npcs = [];
    vars.npcPlayers = [];
    vars.questGiver = null;

    //Item sprites arrays
    vars.items = [];
    vars.chestPlates = [];
    vars.helmets = [];
    vars.swords = [];
    vars.bows = [];
    vars.shields = [];
    vars.cQuestItems = [];
    vars.consumables = [];
    vars.money = [];
    vars.arrows = [];
    vars.staffs = [];

    //Samples
    vars.sScroll = {};
    vars.sSpawner = {};
    vars.sExp = {};
    vars.sMoney = {};
    vars.sTrader = {};

    //uni Drops
    vars.uniCommonDrops = [];
    vars.uniRareDrops = [];
    vars.uniEpicDrops = [];
    vars.uniLegendaryDrops = [];

    //Objects
    vars.inventory = {};
    vars.playerUI = {};
    vars.floorTypes = {};
    vars.shop = {};
    vars.skillsMenu = {};
    vars.menu = {};
    vars.upgradeMenu = null;

    //Arrays of typed objects
    vars.flotNumb = [];
    vars.itemTypes = [];
    vars.enemyTypes = [];
    vars.skillTypes = [];
    vars.projectileTypes = [];
    vars.staffSkills = [];

    //Other arrays
    vars.inGameAlerts = [];
    vars.menues = [];
    return vars;
});