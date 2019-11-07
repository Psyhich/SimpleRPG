define([],function () {
     let vars = {};

    /*Variables*/
    //Main
    vars.canvas;
    vars.ctx = null;
    vars.dt = 0;
    vars.version = "Alpha 0.23";
    //Debugging
    vars.isDebug = null;
    //Time
    vars.now;
    vars.gameTime = 0;

    //For loading
    vars.loaded = 0;
    vars.shouldLoad = 16;

    //Event and configuration system
    vars.events = {
        "isLoaded":false,
        "isShouldMoveEnemies":false,
        "isPaused":false,
        //Menus
        "isMenuOpen":false,
        "isInventoryOpen":false,
        "isSkillsOpen":false,
        //Mouse
        "isLeftMousePressed":false,
        "isLeftMouseReleased":false,
        "isRightMousePressed":false,
        "isRightMouseReleased":false,
        "isMouseWithInv":false,
        "isInvBarWithMouse":false,
        "isWheel":false,
        "keys":{
            "isNumLockUsed":false,
            "isEscPressed":false,
            "isEscReleased":false,
            //Direction buttons
            "upButton":87,
            "isUpPressed":false,
            "isUpReleased":false,
            "downButton":83,
            "isDownPressed":false,
            "isDownReleased":false,
            "rightButton":65,
            "isRightPressed":false,
            "isRightReleased":false,
            "leftButton":68,
            "isLeftPressed":false,
            "isLeftReleased":false,
            //Other
            //Run
            "runButton":16,
            "isRunPressed":false,
            "isRunReleased":false,
            //Inventory
            "inventoryButton":73,
            "isInventoryPressed":false,
            "isInventoryReleased":false,
            //Interact
            "interactButton":69,
            "isInteractPressed":false,
            "isInteractReleased":false,
            //Skills
            "skillsButton":84,
            "isSkillsPressed":false,
            "isSkillsReleased":false,
            //Magic
            "magicButton":77,
            "isMagicPressed":false,
            "isMagicReleased":false,
            //Attack
            "attackButton":32,
            "isAttackPressed":false,
            "isAttackReleased":false,
            //Pause
            "pauseButton":80,
            "isPausePressed":false,
            "isPauseReleased":false
        }
    };
    //Adding numbers
    for(let numberToUse = 0; numberToUse < 10;numberToUse++){
        vars.events.keys["is" + numberToUse + "Pressed"] = false;
        vars.events.keys["is" + numberToUse + "Released"] = false;
    }

    vars.config = {};
    vars.createRuned = false;
    vars.Game = {};

    //Viewport
    vars.camera = {};
    vars.sWidth = screen.width;

    //Mouse
    vars.mouseX = null;
    vars.mouseY = null;

    //For game play
    vars.isPhone = false;
    //Save games
    vars.isLoadedFromSaveGame = false;

    //Time
    vars.lastTime = 0;

    //Sprites
    vars.assets = {
        //GUI
        "acceptButtonSprite": null,
        "shopSprite": null,
        "alertSprite": null,
        "inventorySprite": null,
        "playerUISprite": null,
        "playerHotbarSprite": null,
        "upgradeMenuSprite": null,
        "radiosSprite": null,
        "configsSprite": null,
        "menuSprite": null,

        //Gameplay
        "skillsMenuSprite": null,
        "manyItemsSprite": null,
        "manyItemsSpriteData": null,
        //Tiles
        "tilesSprite": null,
        //Skill previews
        "skillsSprite": null,
        //Exp
        "expSprite": null
    };

    //Splited sprite arrays
    vars.armors = [];
    vars.weapons = [];
    vars.shields = [];
    vars.consumables = [];
    vars.arrows = [];
    vars.books = [];
    vars.money = [];
    vars.tiles = [];
    vars.skills = [];

    //Buttons //TODO implement and adapt them for phone use
    /*vars.inventoryButtonSprite = null;
    vars.attackButtonSprite = null;
    vars.controllerSprite = null;
    vars.pauseButtonSprite = null;
    vars.interactButtonSprite = null;*/

    //Map
    vars.map;

    //Touch input(not realised) //TODO implement
    vars.touchCache = [];
    //Phone and others input buttons(not realised)
    /*vars.inventoryButton = null;
    vars.attackButton = null;
    vars.controllerButton = null;
    vars.pauseButton = null;
    vars.interactButton = null;*/

    //Player
    vars.player = {};
    vars.playerAttackBox = {};
    vars.playerHotbar = {};
    vars.players = [];

    //Enemies
    vars.spawners = [];

    //NPC
    vars.npcs = [];
    vars.npcPlayers = [];
    vars.questGiver = null;

    //Item
    vars.items = [];


    //Samples
    vars.sScroll = {};
    vars.sSpawner = {};
    vars.sExp = {};
    vars.sMoney = {};
    vars.sTrader = {};

    //uni Drops //TODO reassign this values to player
    vars.uniCommonDrops = [];
    vars.uniRareDrops = [];
    vars.uniEpicDrops = [];
    vars.uniLegendaryDrops = [];

    //Objects
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