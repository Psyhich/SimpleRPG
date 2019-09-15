    /*Variables*/
    //Main
    let canvas, ctx;
    //Debugging
    let isDebug;
    //Time
    let now;
    let gameTime = 0;

    //For loading
    let loaded = 0;
    const shouldLoad = 13;

    //Event and configuration system
    let events = {
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
    let config = {};
    let createRuned = false;
    let Game = {};

    //Viewport
    let camera = {};
    let sWidth = screen.width;

    //Mouse
    let mouseX, mouseY;
    let invShouldFollow = null;

    //For game play
    let isPhone = false;
    //Save games
    let isLoadedFromSaveGame = false;

    //Time
    let lastTime = 0;

    //Sprites
    let acceptButtonSprite,shopSprite,alertSprite,tilesSprite,bookSprites,skillsSprite,expSprite,moneySprites,
        consumablesSprite,swordsSpriteSheet,inventorySprite,armorSprites,playerUISprite, shieldsSpite,questItemsSprite,
        scrollSprite,playerHotbarSprite,skillsMenuSprite,upgradeMenuSprite;
    //Buttons
    let inventoryButtonSprite,attackButtonSprite,controllerSprite,pauseButtonSprite,interactButtonSprite;
    //Map
    let map;

    //Input
    let isWPressed = false;
    let isSPressed = false;
    let isDPressed = false;
    let isSpacePressed = false;
    let isPPressed = false;
    let isAPressed = false;
    let isITogled = false;
    let isFPressed = false;
    let isYPressed = false;
    let isEPressed = false;
    let isUPressed = false;
    let numbers = [];
    //Touch input
    let touchCache = [];
    //Phone and others input buttons
    let inventoryButton,attackButton,controllerButton,pauseButton,interactButton;

    //Other for input
    let lookForF = false;
    //let lookForY = false;

    //Player
    let player = {};
    let playerInventory = {};
    let inventoryLength = 9;
    let playerAttackBox = {};
    let playerHotbar = {};
    let players = [];

    //Enemies

    let spawners = [];

    //NPC
    let npcs = [];
    let npcPlayers = [];
    let questGiver;

    //Item sprites arrays
    let items = [];
    let chestPlates = [];
    let helmets = [];
    let swords = [];
    let shields = [];
    let cQuestItems = [];
    let consumables = [];
    let money = [];

    //Samples
    let sScroll = {};
    let sSpawner = {};
    let sExp = {};
    let sMoney = {};
    let sTrader = {};

    //uni Drops
    let uniCommonDrops = [];
    let uniRareDrops = [];
    let uniEpicDrops = [];
    let uniLegendaryDrops = [];

    //Objects
    let inventory = {};
    let playerUI = {};
    let floorTypes = {};
    let tileTypes = [];
    let shop = {};
    let skillsMenu = {};
    let upgradeMenu;

    //Arrays of typed objects
    let flotNumb = [];
    let itemTypes = [];
    let enemyTypes = [];
    let skillTypes = [];

    //Other arrays
    let inGameAlerts = [];
    let menues = [];


//Main
$(function () {
    if (loaded === shouldLoad){console.log("Loaded");}else{loaded = 0;load();}
    if(!isPhone) {
        canvas.addEventListener('mousemove', function (e) {
            let v2 = getMousePos(e);
            mouseX = v2.x;
            mouseY = v2.y;
        });
    }else{
        canvas.ontouchstart = startTouch(e);
        canvas.ontouchmove = moveTouch(e);

        canvas.ontouchend = endTouch(e);
        canvas.ontouchcancel = endTouch(e);
    }
    canvas.onmousewheel =  function(e) {
        events.deltaY = e.deltaY;
    };
    $(window).keydown(function(e) {
        if (e.keyCode === 87) {
            isWPressed = true;
        }
        if (e.keyCode === 83) {
            isSPressed = true;
        }
        if (e.keyCode === 65) {
            isAPressed = true;
        }
        if (e.keyCode === 68) {
            isDPressed = true;
        }
        if (e.keyCode === 32) {
            isSpacePressed = true;
        }
        if(e.keyCode === 70){
            isFPressed = true;
        }
        if(e.keyCode === 89){
            isYPressed = true;
        }
        if(e.keyCode >= 48 && e.keyCode <= 57){
            numbers[e.keyCode - 48] = true;
        }
        if(e.keyCode === 69){
            isEPressed = true;
        }
        if(e.keyCode === 85){
            isUPressed = true;
        }
       /* if (e.keyCode === 80) {
            isPPressed = true;
        }*/
    });
    $(window).keyup(function(e) {
        if(e.keyCode === 87){
            isWPressed = false;
        }
        if(e.keyCode === 83){
            isSPressed = false;
        }
        if(e.keyCode === 65){
            isAPressed = false;
        }
        if(e.keyCode === 68){
            isDPressed = false;
        }
        if(e.keyCode === 32){
            isSpacePressed = false;
        }
        if(e.keyCode === 80){
            isPPressed = !isPPressed;
        }
        if(e.keyCode === 73){
            isITogled = !isITogled;
        }
        if(e.keyCode === 70){
            isFPressed = false;
        }
        if(e.keyCode === 89){
            isYPressed = false;
        }
        if(e.keyCode >= 48 && e.keyCode <= 57){
            numbers[e.keyCode - 48] = false;
        }
        if(e.keyCode === 69){
            isEPressed = false;
        }
        if(e.keyCode === 85){
            isUPressed = false;
        }
    });
    $(window).bind('beforeunload', function(e){
        e.preventDefault();
        alert("Wait");
        let temp = confirm("Save the game?");
        if(temp){
            saveGame();
            window.close();
        }else{
            window.close();
        }
        e.returnValue = "Hey";
        //return "Hey yup";
    });
        setInterval(run,60);
});


//Load
function load() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    loaded++;

    swordsSpriteSheet = new Image();
    swordsSpriteSheet.src = "assets/swords.png";
    swordsSpriteSheet.onload = function () {
        loaded++;
    };

    inventorySprite = new Image();
    inventorySprite.src = "assets/inventory.png";
    inventorySprite.onload = function () {
       loaded++;
    };

    armorSprites = new Image();
    armorSprites.src = "assets/armors.png";
    armorSprites.onload = function () {
        loaded++;
    };

    playerUISprite = new Image();
    playerUISprite.src = "assets/playerUI.png";
    playerUISprite.onload = function () {
        loaded++;
    };

    shieldsSpite = new Image();
    shieldsSpite.src = "assets/shields.png";
    shieldsSpite.onload = function () {
        loaded++;
    };

    questItemsSprite = new Image();
    questItemsSprite.src = "assets/questItems.png";
    questItemsSprite.onload = function () {
        loaded++;
    };

    scrollSprite = new Image();
    scrollSprite.src = "assets/scroll.png";
    scrollSprite.onload = function () {
        loaded++;
    };

    playerHotbarSprite = new Image();
    playerHotbarSprite.src = "assets/hotbar.png";
    playerHotbarSprite.onload = function () {
        loaded++;
    };

    consumablesSprite = new Image();
    consumablesSprite.src = "assets/consumables.png";
    consumablesSprite.onload = function () {
        loaded++;
    };

    expSprite = new Image();
    expSprite.src = "assets/exp.png";
    expSprite.onload = function () {
        loaded++;
    };

    moneySprites = new Image();
    moneySprites.src = "assets/money.png";
    moneySprites.onload = function () {
        loaded++;
    };

    tilesSprite = new Image();
    tilesSprite.src = "assets/tiles.png";
    tilesSprite.onload = function(){
        loaded++;
    };

    skillsSprite = new Image();
    skillsSprite.src = "assets/skills.png";
    skillsSprite.onload = function(){
        loaded++;
    };

    bookSprites = new Image();
    bookSprites.src = "assets/books.png";
    bookSprites.onload = function(){
        loaded++;
    };

    alertSprite = new Image();
    alertSprite.src = "assets/alert.png";
    alertSprite.onload = function(){
        loaded++;
    };

    shopSprite = new Image();
    shopSprite.src = "assets/shop.png";
    shopSprite.onload = function(){
        loaded++;
    };

    acceptButtonSprite = new Image();
    acceptButtonSprite.src = "assets/acceptButton.png";
    acceptButtonSprite.onload = function(){
        loaded++;
    };

    skillsMenuSprite = new Image();
    skillsMenuSprite.src = "assets/skillsMenu.png";
    skillsMenuSprite.onload = function () {
        loaded++;
    };

    upgradeMenuSprite = new Image();
    upgradeMenuSprite.src = "assets/upgrade.png";
    upgradeMenuSprite.onload = function () {
        loaded++;
    };

    controllerSprite = new Image();
    controllerSprite.src = "assets/controler.png";
    controllerSprite.onload = function () {
        loaded++;
    };

    attackButtonSprite = new Image();
    attackButtonSprite.src = "assets/attack.png";
    attackButtonSprite.onload = function () {
        loaded++;
    };

    interactButtonSprite = new Image();
    interactButtonSprite.src = "assets/interact.png";
    interactButtonSprite.onload = function () {
        loaded++;
    };

    pauseButtonSprite = new Image();
    pauseButtonSprite.src = "assets/pause.png";
    pauseButtonSprite.onload = function () {
        loaded++;
    };

    inventoryButtonSprite = new Image();
    inventoryButtonSprite.src = "assets/inventoryButton.png";
    inventoryButtonSprite.onload = function () {
        loaded++;
    };
}

//Run includes create & update & render
function run() {
    now = Date.now();
    let dt = (now - lastTime) / 1000.0;
    if (createRuned === false){create();}else{}
    update(dt);
    render();
    lastTime = now;
    gameTime += dt;
}


//Create & update & render
function create(){



    //Events
    config = {
        "isFloatingNumbers":true,
        "alerts":true
    };
    canvas.onmousedown = function (e) {
        if(e.button === 0){
            events.isLeftMouthClicked = true;
        }if(e.button === 2){
            events.isRightMouthClicked = true;
        }

    };
    canvas.onmouseup = function (e) {
        if(e.button === 0){
            events.isLeftMouthClicked = false;
        }if(e.button === 2){
            events.isRightMouthClicked = false;
        }
    };

    inventoryButton = {
        "sprite":new Sprite([{"px":0,"py":0,"pw":inventoryButtonSprite.width,"ph":inventoryButtonSprite.height,"w":inventoryButtonSprite.width,"h":inventoryButtonSprite.height}],inventoryButtonSprite),
        "isOpened":false,
        "x":canvas.width - 60,
        "y":10
    };
    controllerButton = {
        "sprite":new Sprite([{"px":0,"py":0,"pw":controllerSprite.width,"ph":controllerSprite.height,"w":controllerSprite.width,"h":controllerSprite.height}],controllerSprite),
        "isUpPressed":false,
        "isDownPressed":false,
        "isLeftPressed":false,
        "isRightPressed":false,
        "x":200,
        "y":canvas.height - 200
    };
    pauseButton = {
        "sprite":new Sprite([{"px":0,"py":0,"pw":pauseButtonSprite.width,"ph":pauseButtonSprite.height,"w":pauseButtonSprite.width,"h":pauseButtonSprite.height}],pauseButtonSprite),
        "x":canvas.width - 150,
        "y":10,
        "isPause":false
    };
    interactButton = {
        "sprite":new Sprite([{"px":0,"py":0,"pw":interactButtonSprite.width,"ph":interactButtonSprite.height,"w":interactButtonSprite.width,"h":interactButtonSprite.height}],interactButtonSprite),
        "x":canvas.width - 120,
        "y":canvas.height - 200,
        "isInteract":false
    };
    attackButton = {
        "sprite":new Sprite([{"px":0,"py":0,"pw":attackButtonSprite.width,"ph":attackButtonSprite.height,"w":attackButtonSprite.width,"h":attackButtonSprite.height}],attackButtonSprite),
        "x":canvas.width - 250,
        "y":canvas.height - 100,
        "isAttacking":false
    };

    if(sWidth <= 1024){
        isPhone = true;
    }

    //Camera
    camera = new Game.camera(0,0,canvas.width,canvas.height,3200,3200);

    //Load game
    loadGame();

    //Player
    if(!isLoadedFromSaveGame){
        player = {
        "name":"Roma",
        "id":0,
        "x":790,
        "y":390,
        "velX":0,
        "velY":0,
        "hp":100,
        "maxHp":100,
        "mana":10,
        "maxMana":10,
        "stamina":10,
        "maxStamina":10,
        "money":0,
        "directionx":0,
        "directiony":1,
        "size":12,
        "attackBox":null,
        "weapon":null,
        "armor":null,
        "helmet":null,
        "ring":null,
        "shield":null,
        "attack":false,
        "timeFromLastAttack":0,
        "isMotionChecked":true,
        "equipment":null,
        "isAttackDrawn":false,
        "vision":200,
        "defSkill":0,
        "exp":0,
        "level":1,
        "expToNextLevel":0,
        "skills":[],
        "magicSkill":0,
        "fightingSkill":0,
        "actions":[],
        "lastInjury":0,
        "isDead":false,
        "deathTime":0,
        "color":"rgba(255,255,255,1.0)",
        "mount":{},
        "speed":1,
        "hotbar":{"activeId":null,"items":[]},
        "lastMana":0,
        "upgradePoints":0
    };
        player.expToNextLevel += nextLevel(player.level + 1);
    }

    //Player attack box
    playerAttackBox = {
        "x":0,
        "y":0,
        "w":0,
        "h":0
    };
    playerHotbar = {
        "x":canvas.width / 2  - 350 / 2,
        "y":canvas.height - 49,
        "w":288,
        "h":40,
    };

    player.id = players.length;
    players[players.length] = player.id;
    camera.follow(player,canvas.width/2,canvas.height/2);

    //Creating player skills menu
    skillsMenu = {
        "sprite":new Sprite([{"px":0,"py":0,"pw":skillsMenuSprite.width,
            "ph":skillsMenuSprite.height,
            "w":skillsMenuSprite.width,
            "h":skillsMenuSprite.height
        }],skillsMenuSprite),
        "x":40,
        "y":120,
        "pos":0,
        "chosen":null,
        "drawSkills":function () {
            if(player.skills.length > 0){
                for (let y = 0;y < 3;y++){
                    for(let x = 0;x < 3;x++){
                        if(isReachable(player.skills[((y * 3) + x) + this.pos])){
                            player.skills[((y * 3) + x) + this.pos].sprite.draw(gameTime,this.x + x * 67 + 14,this.y + y * 68 + 14);
                        }
                    }
                }
                if(isReachable(this.chosen)){
                    ctx.fillStyle = "rgba(255,255,255,1.0)";
                    ctx.font = "15px Arial";
                    wrapText(ctx,this.chosen.description,this.x + 260,this.y + 25,90,14)
                }
            }

        },
        "updateMenu":function () {
            if(events.isWheel && mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h){
                    if(events.deltaY > 0 && this.pos + 1 <= this.items.length){
                        this.pos += 3;
                    }else if(events.deltaY < 0 && this.pos - 1 >= 0){
                        this.pos -= 1;
                    }else{

                    }
                }
                let count = 0;
                for (let y = 0;y < 3;y++){
                    for(let x = 0;x < 3;x++){
                        if(mouseX > this.x + x * 67 + 14 && this.x + x * 67 + 81 > mouseX && mouseY > this.y + y * 67 + 14 && this.x + y * 67 + 81 > mouseX){
                            if(isReachable(player.skills[count]) && isReachable(getClickedNumber())){
                                player.hotbar.items[getClickedNumber() - 1] = player.skills[((y * 3) + x) + this.pos];
                            }if(isReachable(player.skills[count]) && events.isLeftMouthClicked){
                                this.chosen = player.skills[((y * 3) + x) + this.pos];
                            }
                        }
                        count++;
                    }
            }
        }

    };

    upgradeMenu = {"isOpened":false,"menu":new UpgradeMenu()};

    //Creating arrays and objects
    let itemArea;
    itemArea = makeSpriteSheetArayInLine(6,swordsSpriteSheet);

    //Swords array
    for(let i = 0;i < 6;i++){
        swords[i] = {
            "x":i * itemArea[i].w,
            "y":0,"dmg":i * 4,
            "isMelee":true,
            "px":i*itemArea[i].pw,
            "py":0,"pw":itemArea[i].pw,
            "ph":itemArea[i].h,
            "w":itemArea[i].pw/2,
            "h":itemArea[i].h/2,
            "img":swordsSpriteSheet,
            "type":"weapon"
        };
    }

    //Making armors
    itemArea = makeSpriteSheetArayInLine(10,armorSprites);

    //Helmets array
    for(let i = 0;i < 5;i++){
        helmets[i] = {
            "img":armorSprites,
            "px":itemArea[i].px,
            "py":itemArea[i].py,
            "pw":itemArea[i].pw,
            "ph":itemArea[i].ph,
            "type":"helmet"
        };
    }

    //Chestplates array
    for(let i = 5;i < 9;i++){
        chestPlates[i - 5] = {
            "img":itemArea[i].img,
            "px":itemArea[i].px,
            "py":itemArea[i].py,
            "pw":itemArea[i].pw,
            "ph":itemArea[i].ph,
            "type":"armor"
        };
    }

    //Shields array
    itemArea = makeSpriteSheetArayInLine(10,shieldsSpite);
    for(let i = 0;i < itemArea.length;i++){
        shields[i] = {
            "img":shieldsSpite,
            "px":itemArea[i].px,
            "py":itemArea[i].py,
            "pw":itemArea[i].pw,
            "ph":itemArea[i].ph,
            "type":"shield"
        };
    }

    //Quest items array
    itemArea = makeSpriteSheetArayInLine(6,questItemsSprite);
    for(let i = 0;i < 6;i++){
        cQuestItems[i] = {
            "img":itemArea[i].img,
            "px":itemArea[i].px,
            "py":itemArea[i].py,
            "pw":itemArea[i].pw,
            "ph":itemArea[i].ph,
            "w":itemArea[i].pw,
            "h":itemArea[i].ph,
            "type":"questItem"
        };
    }

    //Consumables array
    itemArea = makeSpriteSheetArayInLine(32,consumablesSprite);
    for(let i = 0;i < 32;i++){
        consumables[i] = {
            "img":itemArea[i].img,
            "px":itemArea[i].px,
            "py":itemArea[i].py,
            "pw":itemArea[i].pw,
            "ph":itemArea[i].ph,
            "w":itemArea[i].pw,
            "h":itemArea[i].ph,
            "type":"consumable"
        };
    }

    //Money array))
    itemArea = makeSpriteSheetArayInLine(25,moneySprites);
    for(let i = 0;i < itemArea.length;i++){
        money[i] = {
            "img":itemArea[i].img,
            "px":itemArea[i].px,
            "py":itemArea[i].py,
            "pw":itemArea[i].pw,
            "ph":itemArea[i].ph,
            "w":itemArea[i].pw,
            "h":itemArea[i].ph,
            "type":"money",
            "count":0
        };
    }


    //Enemies
    let zombieMoving = function (dt,zombie) {
        //if(events.isPlayerMoving || events.isShouldMoveEnemies || !events.isPlayerStopped){

        zombie.velX = 0;
        zombie.velY = 0;
        if(player.isDead === false && Math.sqrt(Math.pow(player.x - zombie.x,2) + Math.pow(player.y - zombie.y,2)) <= this.vision && zombie.hp > 0){

            zombie.velX = getVelocityTo(player,zombie).x * zombie.velocity;
            zombie.velY = getVelocityTo(player,zombie).y * zombie.velocity;

            zombie.x += zombie.velX * dt;
            zombie.y += zombie.velY * dt;
            events.isShouldMoveEnemies = true;
        }else{
            zombie.velX = 0;
            zombie.velY = 0;
            /*if(events.isShouldMoveEnemies !== true){
                events.isShouldMoveEnemies = false;
            }*/
        }


        //}
    };

    let knightMoving = function(dt,knight){
        //if(events.isPlayerMoving || events.isShouldMoveEnemies || !events.isPlayerStopped){

        knight.velX = 0;
        knight.velY = 0;
        if(player.isDead === false && Math.sqrt(Math.pow(player.x - knight.x,2) + Math.pow(player.y - knight.y,2)) <= this.vision && knight.hp > 0){

            knight.velX = getVelocityTo(player,knight).x * knight.velocity;
            knight.velY = getVelocityTo(player,knight).y * knight.velocity;

            knight.x += knight.velX * dt;
            knight.y += knight.velY * dt;
            //events.isShouldMoveEnemies = true;
        }else{
            if(knight.startX === null && knight.startY === null){

                knight.startX = this.x;
                knight.startY = this.y;
                knight.isMoving = getRandomTOrF() === true ? 1 : 2;
            }else if(knight.isMoving === 1){
                if(knight.x > this.startX - 100){
                    knight.velX = -100;
                }else if(this.x <= this.startX - 100){
                    knight.isMoving = 2;
                }
            }else if(knight.isMoving === 2){
                if(knight.x < this.startX + 100){
                    knight.velX = 100;
                }else if(this.x >= this.startX + 100){
                    knight.isMoving = 1;
                }
            }
            knight.x += knight.velX * dt;
            knight.y += knight.velY * dt;
        }


        //}
    };

    floorTypes = {
        solid	   : 0,
        path	   : 1,
        water	   : 2,
        ground     : 3,
        forest     : 4,
        bricksPath : 5,
        ice        : 6,
        portal     : 7,
        bushes     : 8,
        hills      : 9
    };
    skillTypes = [
        new Skill("Firebolt","Fires a firebolt in your mouse pos.Cost 5 mana",0.5,function (user) {
                if(events.isLeftMouthClicked === true){
                    if(this.lastUsed + this.cooldown * 1000 < lastTime && user.mana - 5 >= 0){
                    let v = {"x":mouseX + camera.xView,"y":mouseY + camera.yView};
                    map.delpoyables[map.delpoyables.length] = new Delpoyable(user.x,user.y,getVelocityTo(v,user).x * 50,getVelocityTo(v,user).y * 50,null,"circle",5,10,function () {
                        let temp = false;
                        let delp = this;
                        jQuery.each(map.enemies,function (index,value) {
                            if(cirToCirCol(delp.x,delp.y,delp.size,value.x,value.y,value.size)){
                                value.hp -= 10;
                                if(value.hp <= 0){value.isDead = true;}
                                temp = true;
                                return false;
                            }
                        });
                        if (temp){
                            this.living = this.time;
                        }
                    });
                    map.delpoyables[map.delpoyables.length - 1].moveTowards(mouseX + camera.xView,mouseY + camera.yView);
                    user.mana -= 5;
                    }else{
                        if(this.lastUsed + this.cooldown * 1000 < lastTime){
                            genTextAlert("Wait some time to use this ability again","rgba(200,0,0,1.0)");
                        }if(user.mana - 5 >= 0){
                            genTextAlert("You don't have enough mana","rgba(200,0,0,1.0)");
                        }
                    }
                    this.lastUsed = lastTime;
                }

        },new Sprite([{"px":46,"py":0,"pw":46,"ph":46,"w":67,"h":67}],skillsSprite))
    ];

    itemTypes = [
        /*0*/{
            "name": "Leather armor",
            "sprite":new Sprite([{"px":chestPlates[0].px,"py":chestPlates[0].py,"pw":chestPlates[0].pw,"ph":chestPlates[0].ph,"w":chestPlates[0].pw,"h":chestPlates[0].ph}],chestPlates[0].img),
            "x":0,
            "y":0,
            "type":"armor",
            "def":1,
            "cost":3,
            "description":"A simple leather armor, it has 1 defence and cost 3 coins.",
            "id":0
        },
        /*1*/{
            "name": "Leather armor+",
            "sprite":new Sprite([{"px":chestPlates[0].px,"py":chestPlates[0].py,"pw":chestPlates[0].pw,"ph":chestPlates[0].ph,"w":chestPlates[0].pw,"h":chestPlates[0].ph}],chestPlates[0].img),
            "x":0,
            "y":0,
            "def":2,
            "type":"armor",
            "cost":4,
            "description":"A simple leather armor, it has 2 defence and cost 4 coins.",
            "id":1
        },
        /*2*/{
            "name": "Leather armor++",
            "sprite":new Sprite([{"px":chestPlates[0].px,"py":chestPlates[0].py,"pw":chestPlates[0].pw,"ph":chestPlates[0].ph,"w":chestPlates[0].pw, "h":chestPlates[0].ph}],chestPlates[0].img),
            "x":0,
            "y":0,
            "def":3,
            "type":"armor",
            "cost":8,
            "description":"A simple leather armor, it has 3 defence and cost 8 coins.",
            "id":2
        },
        /*3*/{
            "name": "Simple Heal potion",
            "sprite":new Sprite([{"px":consumables[0].px,"py":consumables[0].py,"pw":consumables[0].pw,"ph":consumables[0].ph,"w":consumables[0].pw, "h":consumables[0].ph,}],consumables[0].img),
            "x":0,
            "y":0,
            "type":"consumable",
            "action":function (user) {
                restoreHealth(user,20)
            },
            "actions":"Restores health by 20 points",
            "cost":5,
            "description":"Simple heal potion, it heals for 20 point and cost 5 coins.",
            "id":3
        },
        /*4*/{
            "name": "Simple Health regen potion",
            "sprite":new Sprite([{"px":consumables[8].px,"py":consumables[8].py,"pw":consumables[8].pw,"ph":consumables[8].ph,"w":consumables[8].pw,"h":consumables[8].ph}],consumables[8].img),
            "x":0,
            "y":0,
            "type":"consumable",
            "action":function (user) {
                restoreHealth(user,4)
            },
            "actions":"Regen health by 40 points for 10 sec",
            "cost":10,
            "time":5000,
            "isTemp":true,
            "description":"Simple regen potion, it heals for 40 point for 10 sec and cost 10 coins."
            ,
            "id":4
        },
        /*5*/{
            "name": "Wrath bringer",
            "sprite":new Sprite([{"px":swords[5].px,"py":swords[5].py,"pw":swords[5].pw, "ph":swords[5].ph,"w":swords[5].pw / 2, "h":swords[5].ph / 2,}],swords[5].img),
            "x":0,
            "y":0,
            "type":"weapon",
            "cooldown":0.4,
            "dmg":4,
            "dmgType":"area",
            "isMelee":true,
            "cost":10,
            "description":"Thats wrath bringer, it has 4 area damage and cost 10 coins.",
            "id":5

        },
        /*6*/{
            "name": "Wrath bringer",
            "sprite":new Sprite([{"px":swords[5].px,"py":swords[5].py,"pw":swords[5].pw,"ph":swords[5].ph,"w":swords[5].pw / 2,"h":swords[5].ph / 2,}],swords[5].img),
            "x":20,
            "y":100,
            "type":"weapon",
            "cooldown":0.01,
            "dmg":9999,
            "dmgType":"area",
            "isMelee":true,
            "cost":10,
            "description":"Where did you find it?",
            "id":6
        },
        /*7*/{
            "name":"Book of firebolt",
            "type":"skillBook",
            "train":function (user) {
                if(isReachable(user.magicSkill) && user.magicSkill >= 1){
                    if(this.skill.learn(user)){
                        user.skills[user.skills.length] = this.skill;
                        genTextAlert("Learned firebolt","rgba(255,200,200,1.0)");
                    }
                }else{
                    genTextAlert("Your magic skill is too low","rgba(255,200,200,1.0)");
                }
            },
            "skill":skillTypes[0],
            "sprite":new Sprite([{"px":36,"py":64,"pw":24,"ph":32,"w":24,"h":32}],bookSprites),
            "x":0,
            "y":0,
            "cost":100,
            "description":"Its book of fire.Its cost 100 coins.",
            "id":7
        },
        /*8*/{
            "name": "Chainmall armor",
            "sprite":new Sprite([{"px":chestPlates[1].px,"py":chestPlates[1].py,"pw":chestPlates[1].pw,"ph":chestPlates[1].ph,"w":chestPlates[1].pw, "h":chestPlates[1].ph}],chestPlates[1].img),
            "x":0,
            "y":0,
            "def":5,
            "type":"armor",
            "cost":25,
            "description":'Its chainmall armor,it has 5 defence and cost 5 coins.',
            "id":8
        },
        /*9*/{"sprite":new Sprite([{"w":32,"h":32,"pw":32,"ph":32,"px":0,"py":0}],expSprite),
        "x":0,
        "y":0,
        "name":"exp",
        "type":"exp",
        "count":0,
        "id":9
        },
        /*10*/{
            "sprite":new Sprite([{"w":32,
                "h":32,
                "pw":32,
                "ph":32,
                "px":0,
                "py":0}],money[2].img),
            "x":0,
            "y":0,
            "name":"money",
            "type":"money",
            "count":0,
            "id":10
        },
        /*11*/{
            "dmg": 4,
            "cooldown": 0.5,
            "dmgType":"point",
            "name":"hands",
            "type":"weapon"
        }


    ];
    //Seting ids
    for(let i = 0; i < itemTypes.length;i++){
        itemTypes[i].id = i;
    }

    tileTypes = [
        {},
        { "id":1,"colour":"#1da413", "floor":floorTypes.ground,"sprite":new Sprite([{"px":0,"py":0,"pw":16,"ph":16,"w":32,"h":32}],tilesSprite),"action":function (user,x,y) {
                user.speed = 0.8;
            }},
        { "id":2,"colour":"#d6d117", "floor":floorTypes.ground,"sprite":new Sprite([{"px":16,"py":0,"pw":16,"ph":16,"w":32,"h":32}],tilesSprite),"action":function (user,x,y) {
                user.speed = 0.8;
            }},
        { "id":3,"colour":"#d6d117", "floor":floorTypes.path,"sprite":new Sprite([{"px":32,"py":0,"pw":16,"ph":16,"w":32,"h":32}],tilesSprite),"action":function (user,x,y) {
                user.speed = 1.3;
            }},
        { "id":4,"colour":"#d6d117", "floor":floorTypes.path,"sprite":new Sprite([{"px":48,"py":0,"pw":16,"ph":16,"w":32,"h":32}],tilesSprite),"action":function (user,x,y) {
                user.speed = 1.3;
            }},
        { "id":5,"colour":"#d6d117", "floor":floorTypes.path,"sprite":new Sprite([{"px":0,"py":16,"pw":16,"ph":16,"w":32,"h":32}],tilesSprite),"action":function (user,x,y) {
                user.speed = 1.3;
            }},
        { "id":6,"colour":"#d6d117", "floor":floorTypes.path,"sprite":new Sprite([{"px":16,"py":16,"pw":16,"ph":16,"w":32,"h":32}],tilesSprite),"action":function (user,x,y) {
                user.speed = 0.6;
            }},
        { "id":7,"colour":"#d6d117", "floor":floorTypes.path,"sprite":new Sprite([{"px":32,"py":16,"pw":16,"ph":16,"w":32,"h":32}],tilesSprite),"action":function (user,x,y) {
                user.speed = 1.3;
            }},
        { "id":8,"colour":"#d6d117", "floor":floorTypes.path,"sprite":new Sprite([{"px":48,"py":16,"pw":16,"ph":16,"w":32,"h":32}],tilesSprite),"action":function (user,x,y) {
                user.speed = 1.3;
            }},
        { "id":9,"colour":"#d6d117", "floor":floorTypes.bricksPath,"sprite":new Sprite([{"px":0,"py":32,"pw":16,"ph":16,"w":32,"h":32}],tilesSprite),"action":function (user,x,y) {
                user.speed = 1.6;
            }},
        { "id":10,"colour":"#d6d117", "floor":floorTypes.ice,"sprite":new Sprite([{"px":16,"py":32,"pw":16,"ph":16,"w":32,"h":32}],tilesSprite),"action":function (user,x,y) {
                user.speed = 1.1;
                if(user.velX > 0){
                    user.velX = 40;
                }else if(user.velX < 0){
                    user.velX = -40;
                }
                if(user.velY > 0){
                    user.velY = 40;
                }else if(user.velY < 0){
                    user.velY = -40;
                }
            }},
        { "id":11,"colour":"#d6d117", "floor":floorTypes.ground,"sprite":new Sprite([{"px":32,"py":32,"pw":16,"ph":16,"w":32,"h":32}],tilesSprite),"action":function (user,x,y) {
                user.speed = 0.7;
            }},
        { "id":12,"colour":"#d6d117", "floor":floorTypes.portal,"sprite":new Sprite([{"px":48,"py":32,"pw":16,"ph":16,"w":32,"h":32}],tilesSprite),"action":function (user,x,y) {
                user.speed = 1;
            }},
        { "id":13,"colour":"#d6d117", "floor":floorTypes.bushes,"sprite":new Sprite([{"px":0,"py":48,"pw":16,"ph":16,"w":32,"h":32}],tilesSprite),"action":function (user,x,y) {
                user.speed = 1.2;
            }},
        { "id":14,"colour":"#d6d117", "floor":floorTypes.solid,"sprite":new Sprite([{"px":16,"py":48,"pw":16,"ph":16,"w":32,"h":32}],tilesSprite),"action":function (user,x,y) {
                if(user.x + user.size > x * map.tileW  || user.x - user.size < x * map.tileW + map.tileW) {
                    user.x += -(user.velX * ((now - lastTime) / 1000)) * user.speed;
                }if(user.y + user.size > y * map.tileH || user.y - user.size < y * map.tileH + map.tileH) {
                    user.y += -(user.velY * ((now - lastTime) / 1000)) * user.speed;
                }
            }},
        { "id":15,"colour":"#d6d117", "floor":floorTypes.forest,"sprite":new Sprite([{"px":32,"py":48,"pw":16,"ph":16,"w":32,"h":32}],tilesSprite),"action":function (user,x,y) {
                if(isReachable(user.mount) && user.mount.type === "fly"){
                    player.speed = 1;
                }else{
                    if(user.x + user.size > x * map.tileW || user.x - user.size < x * map.tileW - map.tileW) {
                        user.x += -(user.velX * ((now - lastTime) / 1000) * user.speed);
                    }if(user.y + user.size > y * map.tileH || user.y - user.size < y * map.tileH - map.tileH) {
                        user.y += -(user.velY * ((now - lastTime) / 1000) * user.speed);
                    }
                }
            }},
        { "id":16,"colour":"#d6d117", "floor":floorTypes.ground,"sprite":new Sprite([{"px":48,"py":48,"pw":16,"ph":16,"w":32,"h":32}],tilesSprite),"action":function (user,x,y) {
                user.speed = 0.6;
            }},
        { "id":17,"colour":"#d6d117", "floor":floorTypes.hills,"sprite":new Sprite([{"px":0,"py":64,"pw":16,"ph":16,"w":32,"h":32}],tilesSprite),"action":function (user,x,y) {
                if(isReachable(user.mount) && user.mount.type === "fly"){
                    user.speed = 1;
                }else{
                    user.speed = 0.3;
                }
            }},
        { "id":18,"colour":"#d6d117", "floor":floorTypes.water,"sprite":new Sprite([{"px":16,"py":64,"pw":16,"ph":16,"w":32,"h":32}],tilesSprite),"action":function (user,x,y) {
                if(isReachable(user.mount) && user.mount.type === "fly"){
                    user.speed = 1;
                }else if(isReachable(user.mount) && user.mount.type === "swim"){
                    user.speed = 0.8;
                }else{
                    user.speed = 0.2;
                }
            }},
    ];

    enemyTypes = [
        /*0*/{
            "name":"Knight",
            "id":0,
            "hp":100,
            "maxHp":100,
            "dmg":30,
            "def":10,
            "cooldown":2,
            "timeFromLastAttack":0,
            "vision":100,
            "range":30,
            "size":13,
            "x":0,
            "y":0,
            "startX":null,
            "startY":null,
            "velX":0,
            "velY":0,
            "velocity": 150,
            "isDead":false,
            "move":knightMoving,
            "money":1,
            "commonDrops":[],
            "rareDrops":[],
            "epicDrops":[],
            "legendaryDrops":[],
            "color":"rgba(30,30,30,1.0)",
            "exp":100,
            "randomSpeed":true,
            "rndSpdStart":10,
            "rndSpdFinish":200,
        },
        /*1*/{
            "name":"Zombie",
            "id":1,
            "hp":5,
            "maxHp":5,
            "dmg":1,
            "def":3,
            "cooldown":1.2,
            "timeFromLastAttack":0,
            "vision":100,
            "range":45,
            "size":13,
            "x":0,
            "y":0,
            "velX":0,
            "velY":0,
            "velocity": 50,
            "isDead":false,
            "move":zombieMoving,
            "money":1,
            "commonDrops":[
                jQuery.extend(true,{},itemTypes[0])
            ],
            "rareDrops":[
                itemTypes[1],
                itemTypes[3]
            ],
            "epicDrops":[
                itemTypes[2],
                itemTypes[4],
            ],
            "legendaryDrops":[
                itemTypes[5]
            ],
            "color":"rgba(0,255,0,1.0)",
            "exp":10,
            "randomSpeed":true,
            "rndSpdStart":10,
            "rndSpdFinish":100,
        }
    ];

    if(!isLoadedFromSaveGame) {
        //Map
        let data = [2,
            2, 2, 2, 2, 2, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 17, 17, 17, 17, 17, 17, 17, 14, 14, 14, 14, 14, 14, 14, 2, 2, 2, 2, 2, 2, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 17, 17, 17, 17, 17, 17, 17, 14, 14, 14, 14, 14, 14, 14, 2, 2, 2, 2, 2, 2, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 17, 17, 17, 17, 17, 17, 17, 17, 14, 14, 14, 14, 14, 14, 2, 2, 2, 2, 2, 2, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 17, 17, 17, 17, 17, 17, 17, 14, 14, 14, 14, 14, 14, 2, 2, 2, 2, 2, 2, 7, 6, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 17, 17, 17, 17, 17, 17, 17, 14, 14, 14, 14, 14, 14, 2, 2, 2, 2, 2, 2, 2, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 17, 17, 17, 17, 17, 17, 17, 14, 14, 14, 14, 14, 2, 2, 2, 2, 2, 2, 2, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 2, 2, 2, 2, 2, 2, 2, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 2, 2, 2, 2, 2, 2, 2, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 17, 17, 17, 17, 17, 17, 17, 17, 2, 2, 2, 2, 2, 2, 2, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 17, 17, 17, 17, 17, 2, 2, 2, 2, 2, 2, 2, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 17, 17, 2, 2, 2, 2, 2, 2, 2, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 7, 6, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 4, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 4, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7, 6, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7, 3, 3, 3, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7, 3, 3, 3, 3, 3, 3, 3, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7, 3, 3, 3, 3, 3, 3, 3, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7, 3, 3, 3, 3, 3, 3, 3, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7, 3, 3, 3, 3, 3, 3, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7, 3, 3, 3, 3, 3, 3, 3, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7, 3, 3, 3, 3, 3, 3, 3, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7, 3, 3, 3, 3, 3, 3, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7, 3, 3, 3, 3, 3, 3, 3, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7, 3, 3, 3, 3, 3, 3, 3, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 7, 3, 3, 3, 3, 3, 3, 3, 6, 1, 1, 1, 1, 15, 15, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7, 3, 3, 3, 3, 15, 15, 15, 15, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 15, 15, 15, 15, 15, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 15, 15, 15, 15, 15, 15, 15, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 15, 15, 15, 15, 15, 15, 15, 15, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 18, 18, 18, 18, 18, 18, 4, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 1, 1, 1, 1, 1, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 18, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 18, 1, 1, 1, 1, 1, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 18, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 18, 1, 1, 1, 1, 1, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 18, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 18, 1, 1, 1, 1, 1, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 18, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 18, 1, 1, 1, 1, 1, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 18, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 18, 1, 1, 1, 1, 1, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 18, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 18, 1, 1, 1, 1, 1, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 18, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 18, 1, 1, 1, 1, 1, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 18, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 18, 1, 1, 1, 1, 1, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 18, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 18, 1, 1, 1, 1, 1, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 18, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 18, 1, 1, 1, 1, 1, 12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 13, 13, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 18, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 18, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 13, 13, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 18, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 12, 18, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 13, 13, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 13, 13, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 13, 13, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        let temp = [];
        let count = 0;
        map = new Map(31, 31);

        for (let y = 0; y < 100; y++) {
            for (let x = 0; x < 100; x++) {
                /*let a = jQuery.extend(true,{},tileTypes[data[count]]);
                a.x = x;
                a.y = y;*/
                temp.push({"x": x, "y": y, "id": data[count]});
                count++;
            }

        }
        map.build(temp, 100, 100);
    }




    //Other objects
    playerUI = {
        "x":10,
        "y":5,
        "healtX":84,
        "healtY":4,
        "staminaX":84,
        "manaY":24,
        "manaX":84,
        "staminaY":44,
        "barW":135,
        "barH":16
    };
    //Inventory
    //Inventory sprite object
    inventory = {
        "x":850,
        "y":10,
        "w":48,
        "h":48,
        "chosen":null


    };
    player.equipment = [{
            "x":27 + inventory.x,
            "y":445 + inventory.y,
            "w":inventory.w,
            "h":inventory.h,
            "object":null,
            "type":"weapon",
            "isEmpty":true
    },{
            "x":129 + inventory.x,
            "y":445 + inventory.y,
            "w":inventory.w,
            "h":inventory.h,
            "object":null,
            "type":"armor",
            "isEmpty":true
    },{
            "x":180 + inventory.x,
            "y":445 + inventory.y,
            "w":inventory.w,
            "h":inventory.h,
            "object":null,
            "type":"helmet",
            "isEmpty":true
    },{
            "x":231 + inventory.x,
            "y":445 + inventory.y,
            "w":inventory.w,
            "h":inventory.h,
            "object":null,
            "type":"ring",
            "isEmpty":true
    },{
            "x":78 + inventory.x,
            "y":445 + inventory.y,
            "w":inventory.w,
            "h":inventory.h,
            "object":null,
            "type":"shield",
            "isEmpty":true
    }];
    sScroll = {
        "sprite":new Sprite([{"w":32,"h":32, "pw":32,"ph":32,"px":0,"py":0,"x":0,"y":0,}],scrollSprite),
        "isQuest":true,
        "type":"quest",
        "treasure":null
    };
    sSpawner = {
        "name":"Zombie spawner",
        "x":0,
        "y":10,
        "size":10,
        "enemy":null,
        "rate":1,
        "lastSpawned":0,
        "maxSpawned":20,
        "id":0,
        "range":300
    };
    sExp = {
        "sprite":new Sprite([{"w":32,"h":32,"pw":32,"ph":32,"px":0,"py":0}],expSprite),
        "x":0,
        "y":0,
        "name":"exp",
        "type":"exp",
        "count":0,
        "id":9
    };
    sMoney = {
        "sprite":new Sprite([{"w":32,
        "h":32,
        "pw":32,
        "ph":32,
        "px":0,
        "py":0}],money[2].img),
        "x":0,
        "y":0,
        "name":"money",
        "type":"money",
        "count":0,
        "id":10
    };
    //Creating inventory slots
    for(let i = 0;i < 9;i++){
            playerInventory[i] = {
                "isEmpty":true,
                "object":null,
                "x":getPosById(i).x,
                "y":getPosById(i).y,
                "w":inventory.w,
                "h":inventory.h,
                "id":i
            };

    }


    createRuned = true;
    isDebug = false;
    createInTheWorld(10,50,itemTypes[7].id);
    map.items[0].x = 100;
    map.items[0].y = 200;
    //Players array for NPC
    jQuery.each(players,function (index,value) {
        npcPlayers[index] = {
            "id":value.id,
            "canGiveQuest":true,
            "lastQuest":0
        };
    });

    //NPCs
    questGiver = {
        "name":"Ronan",
        "x":500,
        "y":50,
        "isInteractive":true,
        "vision":70,
        "size":20,
        "color":"rgba(255,255,255)",
        "npcType":"quest",
        "hp":250,
        "maxHp":250,
        "weapon":{
            "name": "Ronan's sword",
            "img":swords[5].img,
            "px":swords[5].px,
            "py":swords[5].py,
            "pw":swords[5].pw,
            "ph":swords[5].ph,
            "x":20,
            "y":100,
            "w":swords[5].pw / 2,
            "h":swords[5].ph / 2,
            "type":"weapon",
            "cooldown":0.2,
            "dmg":10,
            "dmgType":"area",
            "isMelee":true,
            "cost":100
        },
        "armor":{
            "name": "Knight's Armor",
            "img":chestPlates[3].img,
            "px":chestPlates[3].px,
            "py":chestPlates[3].py,
            "pw":chestPlates[3].pw,
            "ph":chestPlates[3].ph,
            "x":0,
            "y":0,
            "w":chestPlates[3].pw,
            "h":chestPlates[3].ph,
            "def":13,
            "type":"armor",
            "cost":200
        },
        "helmet":{
            "name": "Knight's helmet",
            "img":helmets[4].img,
            "px":helmets[4].px,
            "py":helmets[4].py,
            "pw":helmets[4].pw,
            "ph":helmets[4].ph,
            "x":0,
            "y":0,
            "w":helmets[4].pw,
            "h":helmets[4].ph,
            "def":8,
            "type":"helmet",
            "cost":150
        },
        "ring":null,
        "shield":null,
        "attack":false,
        "behavior":"neutral",
        "timeFromLastAttack":0,
        "isDead":false,
        "givenQuests":0,
        "players":npcPlayers,
    };
    sTrader = {
        "name":"Eric",
        "x":1000,
        "y":400,
        "isInteractive":true,
        "vision":100,
        "size":20,
        "color":"rgba(255,255,126,1.0)",
        "npcType":"shop",
        "shopType":"armor",
        "hp":250,
        "maxHp":250,
        "weapon":{
            "name": "Ronan's sword",
            "img":swords[5].img,
            "px":swords[5].px,
            "py":swords[5].py,
            "pw":swords[5].pw,
            "ph":swords[5].ph,
            "x":20,
            "y":100,
            "w":swords[5].pw / 2,
            "h":swords[5].ph / 2,
            "type":"weapon",
            "cooldown":0.2,
            "dmg":10,
            "dmgType":"area",
            "isMelee":true,
            "cost":100
        },
        "armor":{
            "name": "Knight's Armor",
            "img":chestPlates[3].img,
            "px":chestPlates[3].px,
            "py":chestPlates[3].py,
            "pw":chestPlates[3].pw,
            "ph":chestPlates[3].ph,
            "x":0,
            "y":0,
            "w":chestPlates[3].pw,
            "h":chestPlates[3].ph,
            "def":13,
            "type":"armor",
            "cost":200
        },
        "helmet":{
            "name": "Knight's helmet",
            "img":helmets[4].img,
            "px":helmets[4].px,
            "py":helmets[4].py,
            "pw":helmets[4].pw,
            "ph":helmets[4].ph,
            "x":0,
            "y":0,
            "w":helmets[4].pw,
            "h":helmets[4].ph,
            "def":8,
            "type":"helmet",
            "cost":150
        },
        "ring":null,
        "shield":null,
        "attack":false,
        "behavior":"neutral",
        "timeFromLastAttack":0,
        "isDead":false,
        "isInvOpen":false,
        "money":100,
        "items":[itemTypes[8],itemTypes[0],itemTypes[1],itemTypes[2],itemTypes[8],itemTypes[0],itemTypes[1],itemTypes[2],itemTypes[8],itemTypes[0],itemTypes[1],itemTypes[2]]
    };

    //Other actions
    /*enemies[enemies.length] = {
        "name":"Ultra Zombie",
        "hp":20,
        "maxHp":20,
        "dmg":6,
        "def":3,
        "cooldown":1.2,
        "timeFromLastAttack":0,
        "vision":100,
        "range":45,
        "size":40,
        "x":50,
        "y":400,
        "velX":0,
        "velY":0,
        "velocity": Math.random() / 1000,
        "isDead":false,
        "move":zombieMoving,
        "money":1,
        "commonDrops":[],
        "rareDrops":[],
        "epicDrops":[],
        "legendaryDrops":[],
        "color":"rgba(40,255,0,1.0)"
    }*/
    //npcs[0] = questGiver;
    npcs[0] = sTrader;


    //Spawners
    if(!isLoadedFromSaveGame) {
        spawners[0] = jQuery.extend(true, {}, sSpawner);
        spawners[0].enemy = jQuery.extend(true, {}, enemyTypes[1]);
        spawners[0].x = 1000;
        spawners[0].y = 1000;

        spawners[1] = jQuery.extend(true, {}, sSpawner);
        spawners[1].enemy = jQuery.extend(true, {}, enemyTypes[0]);
        spawners[1].x = 1500;
        spawners[1].y = 1500;
        spawners[1].rate = 5;
        spawners[1].maxSpawned = 5;
    }
    console.log("create");

}

function update(dt){
    events.isWheel = events.deltaY > 0 || events.deltaY < 0;

    uiActions(dt);
    if(events.isPaused === false){
        gameActions(dt);
    }


    events.isInventoryOpen = isITogled;
    events.deltaY = 0;
    events.isWheel = false;

    /*console.log(mouseX);
    console.log(mouseY);*/
    /*console.log("isStopped:" +  events.isPlayerStopped);
    console.log("isMoving:" +  events.isPlayerMoving);*/
}

function render(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    //ctx.drawImage(map,camera.xView,camera.yView,canvas.width,canvas.height,0,0,1600,1600);

    //Tiles
    let count = 0;
    for(let y = 0;y < map.h;y++){
        for(let x = 0;x < map.w;x++){
            tileTypes[map.map[toIndex(x,y)].id].sprite.draw(gameTime,x * map.tileW - camera.xView,y * map.tileH - camera.yView/*,map.tileW,map.tileH*/);
            count++;
        }
    }

    //Objects
    for(let i = 0;i < map.objects.length;i++){

    }

    //Items
    for(let i = 0;i < map.items.length;i++) {
        if (isReachable(map.items[i]) && isReachable(getItem(map.items[i].id).sprite)){
            //console.log(map.items[i]);
            getItem(map.items[i].id).sprite.draw(gameTime, map.items[i].x - camera.xView, map.items[i].y - camera.yView/*,map.items[i].sprite.w,map.items[i].sprite.h*/);
        }
    }

    //Delpoyables
    for(let i = 0;i < map.delpoyables.length;i++){
        //map.delpoyables[i].sprite.draw(gameTime,map.delpoyables[i].x - camera.xView,map.delpoyables[i].y - camera.yView,map.delpoyables[i].sprite.w,map.delpoyables[i].sprite.h);
        if(map.delpoyables[i].type === "circle"){
            ctx.fillStyle = "rgba(255,0,0,0.8)";
            ctx.beginPath();
            ctx.arc(map.delpoyables[i].x - camera.xView,map.delpoyables[i].y - camera.yView,map.delpoyables[i].size,0,360,false);
            ctx.closePath();
            ctx.fill();
        }
    }



    //Draw player
    ctx.beginPath();
    ctx.fillStyle = player.color;
    ctx.srtokeStyle = "rgba(0,0,0,1.0)";
    ctx.arc(player.x - camera.xView,player.y - camera.yView,player.size,0,360,false);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    //Draw spawners
    jQuery.each(spawners,function (index,value) {
        ctx.fillStyle = "rgba(0,0,0,0.0)";
        ctx.beginPath();
        ctx.arc(value.x - camera.xView,value.y - camera.yView,value.size,0,360,false);
        ctx.closePath();
        ctx.fill();
    });

    //Draw enemies
    jQuery.each(map.enemies,function (index,value) {
        if(value.isDead === false){
            ctx.strokeStyle = "rgba(0,0,0,1.0)";
            ctx.fillStyle = getEnemy(value.id).color;
            ctx.beginPath();
            ctx.arc(value.x - camera.xView,value.y - camera.yView,value.size,0,360,false);
            ctx.stroke();
            ctx.fill();
            ctx.closePath();

        }
    });

    //Drawing NPCs
    jQuery.each(npcs,function (index,value) {
        if(value.isDead && value.keepCorpse === false || !value.isDead){
            ctx.fillStyle = value.color;
            ctx.strokeStyle = value.color;
            ctx.beginPath();
            ctx.arc(value.x - camera.xView,value.y - camera.yView,value.size,0,360,false);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
        }
    });

    //Showing enemy names and health
    jQuery.each(map.enemies,function (index,value) {
        if(Math.sqrt(Math.pow(value.x - player.x,2) + Math.pow(value.y - player.y,2)) <= player.vision){
            ctx.fillStyle = "rgba(255,255,255,1.0)";
            ctx.font = "10px Arial";
            ctx.beginPath();
            ctx.fillText(getEnemy(value.id).name,value.x - value.size - camera.xView,value.y - value.size - 20 - camera.yView);
            ctx.fillStyle = "rgba(155,10,10,1.0)";
            ctx.fillRect(value.x - value.size - 1 - camera.xView,value.y - value.size - 15 - camera.yView,value.size * 2.2,10);
            ctx.fillStyle = "rgba(255,10,10,1.0)";
            ctx.fillRect(value.x - value.size - 1 - camera.xView,value.y - value.size - 15 - camera.yView,value.size * 2.2 * (value.hp / value.maxHp),10);
            ctx.closePath();
        }
    });

    //Showing NPCs names and health and press E button
    jQuery.each(npcs,function (index,value) {
        if(value.isDead === false){
            if(Math.sqrt(Math.pow(value.x - player.x,2) + Math.pow(value.y - player.y,2)) <= player.vision){
                if(value.behavior === "neutral"){
                    ctx.fillStyle = "rgba(255,255,255,1.0)";
                }else if(value.behavior === "peaceful"){
                    ctx.fillStyle = "rgba(0,255,0,1.0)";
                }else if(value.behavior === "aggressive"){
                    ctx.fillStyle = "rgba(255,0,0,1.0)";
                }
                ctx.font = "13px Arial";
                ctx.beginPath();
                //Text
                ctx.fillText(value.name,value.x - value.size - camera.xView,value.y - value.size - 20 - camera.yView);
                //Health bar
                ctx.fillStyle = "rgba(155,10,10,1.0)";
                ctx.fillRect(value.x - value.size - 1 - camera.xView,value.y - value.size - 15 - camera.yView,value.size * 2,10);
                ctx.fillStyle = "rgba(255,10,10,1.0)";
                ctx.fillRect(value.x - value.size - 1 - camera.xView,value.y - value.size - 15 - camera.yView,value.size * 2 * (value.hp / value.maxHp),10);
                ctx.closePath();
                if(value.behavior === "peaceful" || value.behavior === "neutral" && value.isInteractive === true){
                    ctx.strokeStyle = "rgba(0,0,0,1.0)";
                    ctx.fillStyle = "rgba(255,255,255,1.0)";
                    ctx.font = "16px Arial";
                    ctx.beginPath();
                    ctx.strokeText("Press F to interact",value.x + value.size + 5 - camera.xView,value.y - camera.yView);
                    ctx.fillText("Press F to interact",value.x + value.size + 5 - camera.xView,value.y - camera.yView);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();




                }

            }
        }


    });

    //Draw player attack box
    ctx.strokeStyle = "black";
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.rect(playerAttackBox.x - camera.xView, playerAttackBox.y - camera.yView, playerAttackBox.w, playerAttackBox.h);

    if(player.isAttackDrawn === true) {
        ctx.fill();
        player.isAttackDrawn = false;
    }
        ctx.stroke();
        ctx.closePath();

    //Drawing items on the floor


    //Floating numbers
    if(config.isFloatingNumbers){

        jQuery.each(flotNumb,function (index,value) {
            ctx.fillStyle = value.color;
            ctx.srtokeStyle = value.color;
            ctx.font = value.size + "px Arial";
            ctx.beginPath();
            ctx.fillText(value.number + "",value.x - camera.xView,value.y - camera.yView);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        });
    }


    //Drawing UI
    if(config.alerts === true){
        operateTextAlerts();
    }
    if(events.isPaused === true) {
        ctx.font = "30px Arial";
        ctx.fillStyle = "rgba(255,255,255,1.0)";
        //ctx.fillStyle = "red";
        //ctx.strokeStyle = "red";
        //ctx.textAlign = "center";
        //ctx.beginPath();
        ctx.fillText("Game Paused", 50, 50);
        /*ctx.fill();
        ctx.stroke();*/
        //ctx.closePath();
        //console.log("Pause");


    }else{}
    if(events.isInventoryOpen === true){
        ctx.drawImage(inventorySprite,inventory.x,inventory.y);
        for(let i = 0;i < inventoryLength;i++) {
            let item = playerInventory[i].object;
            if(isReachable(item)) {
                let w = getItem(item.id).sprite.w;
                let h = getItem(item.id).sprite.h;
                let tw = w > inventory.w ? inventory.w - w + 5 : 0;
                let th = h > inventory.h ? inventory.h - h + 5 : 0;
                if(w > inventory.w){
                    w = inventory.w;
                }if(h > inventory.h){
                    h = inventory.h;
                }

                getItem(item.id).sprite.drawWH(gameTime,item.x - tw,item.y - th,w,h);
            }
        }
        jQuery.each(player.equipment,function (index,value) {
            let item = value.object;
            if(isReachable(item)) {
                let w = getItem(item.id).sprite.w;
                let h = getItem(item.id).sprite.h;
                let tw = w > inventory.w ? inventory.w - w + 5 : 0;
                let th = h > inventory.h ? inventory.h - h + 5 : 0;
                if(w > inventory.w){
                    w = inventory.w;
                }if(h > inventory.h){
                    h = inventory.h;
                }

                getItem(item.id).sprite.drawWH(gameTime,item.x - tw,item.y - th,w,h);
            }
        });
        if(isReachable(inventory.chosen)){
            let object = inventory.chosen;
            ctx.srtokeStyle = "rgba(255,255,255,1.0)";
            ctx.fillStyle = "rgba(255,255,255,1.0)";
            ctx.font = "15px Arial";
            ctx.beginPath();
            if(getItem(object.id).type === "weapon"){
                ctx.font = "12px Arial";
                if(getItem(object.id).isMelee){
                    ctx.fillText(getItem(object.id).name,inventory.x + 30,inventory.y + 314);
                    ctx.fillText("Has: " + getItem(object.id).dmg + " damage",inventory.x + 30,inventory.y + 326);
                    ctx.fillText("Has: " + getItem(object.id).dmgType + " attack",inventory.x + 30,inventory.y + 338);
                    ctx.fillText("Is melee: " + getItem(object.id).isMelee,inventory.x + 30,inventory.y + 350);
                    ctx.fillText("It's cost: " + getItem(object.id).cost + " coins",inventory.x + 30,inventory.y + 362);
                    ctx.fillText("It's attack speed: " + getItem(object.id).cooldown * 10,inventory.x + 30,inventory.y + 374);
                }
                ctx.font = "15px Arial";
            }else if(getItem(object.id).type === "armor"){
                ctx.fillText(getItem(object.id).name,inventory.x + 30,inventory.y + 320);
                ctx.fillText("Has: " + getItem(object.id).def + " defence",inventory.x + 30,inventory.y + 335);
                ctx.fillText("It's: " + getItem(object.id).type,inventory.x + 30,inventory.y + 350);
                ctx.fillText("It's cost: " + getItem(object.id).cost + " coins",inventory.x + 30,inventory.y + 365);
            }else if(getItem(object.id).type === "helmet"){
                ctx.fillText(getItem(object.id).name,inventory.x + 30,inventory.y + 320);
                ctx.fillText("Has: " + getItem(object.id).def + " defence",inventory.x + 30,inventory.y + 335);
                ctx.fillText("It's: " + getItem(object.id).type,inventory.x + 30,inventory.y + 350);
                ctx.fillText("It's cost: " + getItem(object.id).cost + " coins",inventory.x + 30,inventory.y + 365);
            }else if(getItem(object.id).type === "shield"){
                ctx.fillText(getItem(object.id).name,inventory.x + 30,inventory.y + 320);
                ctx.fillText("It protect from " + getItem(object.id).def + " points of damage",inventory.x + 30,inventory.y + 335);
                ctx.fillText("It's: " + getItem(object.id).type,inventory.x + 30,inventory.y + 350);
                ctx.fillText("It's cost: " + getItem(object.id).cost + " coins",inventory.x + 30,inventory.y + 365);
            }else if(getItem(object.id).type === "ring"){
                ctx.fillText(getItem(object.id).name,inventory.x + 30,inventory.y + 320);
                ctx.fillText("It buffs " + getItem(object.id).buff + " stats",inventory.x + 30,inventory.y + 335);
                ctx.fillText("It's value: " + getItem(object.id).buffValue,inventory.x + 30,inventory.y + 350);
                ctx.fillText("It's cost: " + getItem(object.id).cost + " coins",inventory.x + 30,inventory.y + 365);
            }else if(getItem(object.id).type === "quest"){
                ctx.fillText(getItem(object.id).name,inventory.x + 30,inventory.y + 320);
                ctx.fillText("You need to find \n" + getItem(object.id).item.name,inventory.x + 30,inventory.y + 335);
            }else if(getItem(object.id).type === "consumable"){
                ctx.fillText(getItem(object.id).name,inventory.x + 30,inventory.y + 320);
                ctx.fillText("When consumed: ",inventory.x + 30,inventory.y + 335);
                ctx.fillText("" + getItem(object.id).actions,inventory.x + 30,inventory.y + 350);
                ctx.fillText("It's cost: " + getItem(object.id).cost + " coins",inventory.x + 30,inventory.y + 365);
                if(isReachable(getItem(object.id).type.consumes)){
                    ctx.fillText("It's cost: " + getItem(object.id).cost + " coins",inventory.x + 30,inventory.y + 380);
                }
            }else if(getItem(object.id).type === "questItem"){
                ctx.fillText(getItem(object.id).name,inventory.x + 30,inventory.y + 320);
                ctx.fillText("When consumed: ",inventory.x + 30,inventory.y + 335);
                ctx.fillText("It's quest item",inventory.x + 30,inventory.y + 350);
            }else if(getItem(object.id).type === "skillBook"){
                ctx.fillText(getItem(object.id).name,inventory.x + 30,inventory.y + 320);
                ctx.fillText("Use it to learn: ",inventory.x + 30,inventory.y + 335);
                ctx.fillText(getItem(object.id).skill.name + "",inventory.x + 30,inventory.y + 350);
            }
            //ctx.stroke();
            ctx.fill();
            ctx.closePath();

        }

        ctx.font = "12px Arial";
        ctx.fillStyle = "rgba(0,0,0,1.0)";
        ctx.fillText("Money: " + player.money,inventory.x + 185,inventory.y + 135)

        //Draw level
        ctx.fillStyle = "rgba(200,200,200,1.0)";
        ctx.beginPath();
        ctx.rect(inventory.x + 185,inventory.y + 165,95,10);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "rgba(100,100,100,1.0)";
        ctx.beginPath();
        ctx.rect(inventory.x + 185,inventory.y + 165,95 * player.exp / player.expToNextLevel,10);
        ctx.closePath();
        ctx.fill();

    }
    if(events.isSkillsOpen === true){
        skillsMenu.sprite.draw(gameTime,skillsMenu.x,skillsMenu.y);
        skillsMenu.drawSkills();
    }

    //Drawing player options UI
    ctx.drawImage(playerUISprite,10,5);


    //Drawing health bar
    ctx.fillStyle = "rgba(255,0,0,0.7)";
    //ctx.strokeStyle = "rgba(255,0,0,0.7)";
    ctx.beginPath();
    ctx.fillRect(playerUI.x + playerUI.healtX,playerUI.y + playerUI.healtY,playerUI.barW * (player.hp / player.maxHp),playerUI.barH);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgba(0,0,255,0.7)";
    //ctx.strokeStyle = "rgba(255,0,0,0.7)";
    ctx.beginPath();
    ctx.fillRect(playerUI.x + playerUI.manaX,playerUI.y + playerUI.manaY,playerUI.barW * (player.mana / player.maxMana),playerUI.barH);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgba(0,255,0,0.7)";
    //ctx.strokeStyle = "rgba(255,0,0,0.7)";
    ctx.beginPath();
    ctx.fillRect(playerUI.x + playerUI.staminaX,playerUI.y + playerUI.staminaY,playerUI.barW * (player.stamina / player.maxStamina),playerUI.barH);
    ctx.closePath();
    ctx.fill();

    //Draw player hotbar
    ctx.drawImage(playerHotbarSprite,playerHotbar.x,playerHotbar.y);
    for(let i = 0;i < 6;i++){
        if(isReachable(player.hotbar.items[i]) && i < 6) {
            player.hotbar.items[i].sprite.drawWH(gameTime, playerHotbar.x + i * 54 + 21, playerHotbar.y + 4, 41, 41);
        }
    }


    //Drawing hotkeys
    ctx.font = "15px Arial";
    ctx.fillStyle = "rgba(255,255,255,1.0)";
    ctx.fillText("1",55 + playerHotbar.x,44 + playerHotbar.y);

    for(let i = 1;i < 6;i++){
        ctx.fillText("" + (i + 1),playerHotbar.x + 53 * (i + 1),playerHotbar.y + 44);
    }

    //Drawing menus
    jQuery.each(menues,function (index,value) {
        if(isReachable(value.menu.drawShop) && value.menu.type === "shop"){
            value.menu.drawShop();
        }/*else if(value.menu.type === "upgrade" && isReachable(value.menu.drawUpgrades())){
            value.menu.drawUpgrades();
        }*/
    });
    if(upgradeMenu.isOpened === true){
        upgradeMenu.menu.drawUpgrades();
    }



    //Draw buttons
    if(isPhone){
        controllerButton.sprite.draw(gameTime,controllerButton.x,controllerButton.y);
        interactButton.sprite.draw(gameTime,interactButton.x,interactButton.y);
        pauseButton.sprite.draw(gameTime,pauseButton.x,pauseButton.y);
        attackButton.sprite.draw(gameTime,attackButton.x,attackButton.y);
        inventoryButton.sprite.draw(gameTime,inventoryButton.x,inventoryButton.y);
    }

}

//Game and UI actions
function gameActions(dt){
    //Event on collision with tiles
    jQuery.each(map.map,function (index,value) {
        if(circleToRectIntersection(player.x,player.y,player.size,value.x * map.tileW,value.y * map.tileH,map.tileW,map.tileW )){
            tileTypes[value.id].action(player,value.x,value.y);
        }
    });
    //Controls
    if(!isPhone){
        if(isWPressed === true){
            player.velY = -80;
        }if(isSPressed === true){
            player.velY = 80;
        }else if(!isWPressed && !isSPressed){
            player.velY = 0;
        }
        if(isAPressed === true){
            player.velX = -80;

        }if(isDPressed === true){
            player.velX = 80;
        }else if(!isDPressed && !isAPressed){
            player.velX = 0;
        }
        if(isFPressed === true){
            lookForF = true;
        }else if(isFPressed === false && lookForF === false){
            events.isFReleased = false;
        }
        if(isFPressed === false && lookForF === true){
            events.isFReleased = true;
            lookForF = false;
        }
        player.attack = isSpacePressed;
    }else{
        if(controllerButton.isUpPressed === true){
            player.velY = -80;
        }else if(controllerButton.isDownPressed === true){
            player.velY = 80;
        }else if(!controllerButton.isUpPressed && !controllerButton.isDownPressed){
            player.velY = 0;
        }
        if(controllerButton.isLeftPressed === true){
            player.velX = -80;

        }if(controllerButton.isRightPressed === true){
            player.velX = 80;
        }else if(!controllerButton.isRightPressed && !controllerButton.isLeftPressed){
            player.velX = 0;
        }
    }






    //Moving
    player.x += player.velX * dt * player.speed;
    player.y += player.velY * dt * player.speed;

    //Collision with objects
    jQuery.each(map.object,function (index,value) {
        if(value.type.floor === floorTypes.solid){
            if(circleToRectIntersection(player.x,player.y,player.size - 5,value.col.x,value.col.y,value.col.w,value.col.h)){
                if(player.x + player.size - 5 > value.col.x || player.x - player.size - 5 < value.col.x + value.col.w) {
                    player.x += -(player.velX * dt);
                }if(player.y + player.size - 5 > value.col.y || player.y - player.size - 5 < value.col.y + value.col.h) {
                    player.y += -(player.velY * dt);
                }
            }
        }
    });



    //Camera
    camera.update();

    if(player.x + player.size >= 3100){
        player.x = -player.velX * dt + player.x;
    }if(player.x - player.size <= 0){
        player.x = -player.velX * dt + player.x;
    }if(player.y + player.size >= 3100){
        player.y = -player.velY * dt + player.y;
    }if(player.y - player.size <= 0){
        player.y = -player.velY * dt + player.y;
    }

    //Player actions
    if(player.actions.length > 0){
        for(let i = 0;i < player.actions.length;i++) {
            if(player.actions[i].deployed + player.actions[i].time < lastTime){
                player.actions.splice(i,1);
                i--;
            }else{
                player.actions[i].action(player);
            }
        }
    }

    if(player.lastInjury + 20000 < lastTime && player.hp < 50){
        restoreHealth(player,0.1);
    }

    if(player.hp <= 0){
        player.isDead = true;
        player.color = "rgba(255,255,255,0.4)";
        player.deathTime = lastTime;
        player.hp = player.maxHp;

        jQuery.each(playerInventory,function (index,value) {
            if(isReachable(value.object) && value.object !== undefined){
                createInTheWorld(player.x,player.y,value.object.id);
                value.isEmpty = true;
                value.object = null;
            }
        });
    }

    if(player.isDead === true){
        if(player.deathTime + 10000 < lastTime){
            player.isDead = false;
            player.color = "rgba(255,255,255,1.0)";
        }
    }

    //Player mana
    if(player.lastMana === player.mana){
        if(player.lastManaLoose + 3000 < lastTime){
            if(player.mana + 0.2 < player.maxMana){
                player.mana += 0.2;
            }

        }
    }else {
        player.lastManaLoose = lastTime;
        player.lastMana = player.mana;
    }


    //Direction
    getCordsOfPlayerAttackBox();

    //Items manipulation
    player.weapon = player.equipment[0].object;
    if(player.weapon === null){
        player.weapon = itemTypes[11];
    }

    //Constructing and saving attack box
    let count = 0;
    for (let i = 0; i < 3; i++) {
        for (let u = 0; u < 3; u++) {
            if (count === player.attackBox) {
                ctx.rect(player.x - player.size * 3 + u * player.size * 3 / 2, player.y - player.size * 3 + i * player.size * 3 / 2, player.size * 3, player.size * 3);

                playerAttackBox.x = player.x - player.size * 3 + u * player.size * 3 / 2;
                playerAttackBox.y = player.y - player.size * 3 + i * player.size * 3 / 2;
                playerAttackBox.w = player.size * 3;
                playerAttackBox.h = player.size * 3;
            }
            count++;
        }
    }

    //Checking player to items collision
    if(map.items.length > 0 && player.isDead === false){
        //Money processing
        /*jQuery.each(items,function (index, value) {
            if(value.type === "money"){
                let temp = value.count;
            }
        });*/

        jQuery.each(map.items, function (index, value) {
            if (value !== undefined && isReachable(value) && (isReachable(getItem(value.id).sprite)) && circleToRectIntersection(player.x, player.y, player.size, value.x, value.y, getItem(value.id).sprite.w, getItem(value.id).sprite.h)) {
                if (getItem(value.id).type === "exp") {
                    player.exp += getItem(value.id).count;
                    map.items.splice(index, 1);
                    index--;
                }else if (getItem(value.id).type === "money") {
                    player.money += getItem(value.id).count;
                    map.items.splice(index, 1);
                    index--;
                }else {
                    for (let i = 0; i < 9; i++) {
                        if (playerInventory[i].isEmpty === true && value != null) {
                            playerInventory[i].isEmpty = false;
                            playerInventory[i].object = value;
                            playerInventory[i].object.inventoryId = i;
                            map.items.splice(index, 1);
                            break;
                        }

                    }
                }

            }

        });
    }

    //Delpoyables update
    for(let i = 0;i < map.delpoyables.length;i++) {
        if(map.delpoyables.length >= 1){
            map.delpoyables[i].update(dt);
        }

        if(map.delpoyables[i].living >= map.delpoyables[i].time){
            map.delpoyables.splice(i,1);
            i--;
        }
    }
    
    //Interactions with NPCs
    if(player.isDead === false) {
        let isChecked = false;
        jQuery.each(npcs, function (ind, npc) {
            if (isReachable(npc.players) && npc.players[player.id].canGiveQuest === false && npc.players[player.id].lastQuest + 600000 < lastTime) {
                npc.players[player.id].canGiveQuest = true;
                npc.players[player.id].lastQuest = 0;
            }
            if (Math.sqrt(Math.pow(npc.x - player.x, 2) + Math.pow(npc.y - player.y, 2)) <= player.vision && events.isFReleased) {
                if (npc.npcType === "quest") {
                    //Checking if player have completed quests
                    jQuery.each(playerInventory, function (index, value) {
                        if (isReachable(value.object) && value.object.type === "quest" && isReachable(value.object.item) && value.object.item !== undefined) {
                            jQuery.each(playerInventory, function (index1, value1) {
                                if (isReachable(value1.object) && value1.object !== undefined && value.object.item.itemId === value1.object.itemId && value.object.item.name === value1.object.name) {
                                    //dropTreasure(value.object, player.x, player.y);
                                    removeQuestItem(value1);
                                    value.isEmpty = true;
                                    value.object = null;
                                    value1.isEmpty = true;
                                    value1.object = null;
                                    isChecked = true;
                                    index--;
                                }
                            });
                        }
                    });
                    if (isChecked === false && npc.players[player.id].canGiveQuest === true) {
                        genRandomQuest(npc, ind, (player.x + npc.x) / 2, (player.y + npc.y) / 2);
                        npc.players[player.id].canGiveQuest = false;
                        npc.players[player.id].lastQuest = lastTime;
                    }
                } else if (npc.npcType === "shop" && !isShopOpened()) {
                    jQuery.each(menues,function (index,value) {
                        if(value.type === "shop"){
                            menues.splice(index,1);
                            index--;
                        }
                    });
                    menues[menues.length] = { "id":ind,"menu":new Shop(npc.items,50,100,npc.shopType,npc.money,npc)};
                }else if(isShopOpened() && events.isFReleased){
                    jQuery.each(menues,function (index,value) {
                        if(ind === value.id){
                            menues.splice(index,1);
                            return true;
                        }
                    });
                }
            }if(Math.sqrt(Math.pow(npc.x - player.x, 2) + Math.pow(npc.y - player.y, 2)) >= player.vision){
                if(npc.npcType === "shop"){
                    jQuery.each(menues,function (index,value) {
                        if(ind === value.id){
                            menues.splice(index,1);
                            return true;
                        }
                    });
                }
            }
        });
    }

    //Player levels






    //Spawners
    jQuery.each(spawners,function (index,value) {
        if(value.lastSpawned >= value.rate){
            let enemInRange = 0;
            jQuery.each(map.enemies,function (indexE,valueE) {
                if(value.enemy.id === valueE.id && Math.sqrt(Math.pow(valueE.x - value.x,2) + Math.pow(valueE.y - value.y,2)) <= value.range){
                    enemInRange++;
                }
                //console.log(enemInRange);
            });
            if(enemInRange < value.maxSpawned){
                genEnemy(value.enemy.id,Math.random() * value.range * isIncOrDecr() + value.x,Math.random() * value.range * isIncOrDecr() + value.y);
            }
            value.lastSpawned = 0;
        }
        value.lastSpawned += dt;
    });

    //Enemy moving and collision with player and other enemies
    jQuery.each(map.enemies,function (index,value) {
            //value.move(dt);
            getEnemy(value.id).move(dt,value);


            if(cirToCirCol(value.x,value.y,value.size,player.x,player.y,player.size)){
                let midpoint = {"x":0,"y":0};
                let dist;

                dist = Math.sqrt(Math.pow((player.x - value.x),2) + Math.pow((player.y - value.y),2));

                midpoint.x = (value.x + player.x) / 2;
                midpoint.y = (value.y + player.y) / 2;

                value.x = midpoint.x + value.size * (value.x - player.x) / dist;
                value.y = midpoint.y + value.size * (value.y - player.y) / dist;


            }
            if(index < map.enemies.length - 1){
                if(cirToCirCol(value.x,value.y,value.size,map.enemies[index + 1].x,map.enemies[index + 1].y,map.enemies[index + 1].size)) {
                    let value2 = map.enemies[index + 1];
                    let midpoint = {"x":0,"y":0};
                    let dist;

                    dist = Math.sqrt(Math.pow((value2.x - value.x),2) + Math.pow((value2.y - value.y),2));

                    midpoint.x = (value.x + value2.x) / 2;
                    midpoint.y = (value.y + value2.y) / 2;

                    value.x = midpoint.x + value.size * (value.x - value2.x) / dist;
                    value.y = midpoint.y + value.size * (value.y - value2.y) / dist;

                    value2.x = midpoint.x + value2.size * (value2.x - value.x) / dist;
                    value2.y = midpoint.y + value2.size * (value2.y - value.y) / dist;
                }
            }

        });

    //Enemy attacking
    if(player.isDead === false) {
        jQuery.each(map.enemies, function (index, value) {
            value.timeFromLastAttack += dt;
            if (circleToRectIntersection(value.x, value.y, value.size, playerAttackBox.x, playerAttackBox.y, playerAttackBox.w, playerAttackBox.h)) {
                if (value.timeFromLastAttack >= getEnemy(value.id).cooldown && (Math.sqrt(Math.pow(player.x - value.x, 2) + Math.pow(player.y - value.y, 2)) <= getEnemy(value.id).range)) {
                    if (value.dmg * 10 < getFullDef(player)) {
                        genFloatingNumber(player.x, player.y, "0", "rgba(255,0,0,1.0)", 15)
                    } else if (value.dmg * 10 < getDef(player)) {
                        genFloatingNumber(player.x, player.y, "0", "rgba(255,0,0,1.0)", 15)
                    } else if (value.dmg > getFullDef(player)) {
                        player.hp -= getEnemy(value.id).dmg - getFullDef(player);
                        player.lastInjury = lastTime;
                        genFloatingNumber(player.x, player.y, (getEnemy(value.id).dmg - getFullDef(player)), "rgba(255,0,0,1.0)", 15)
                    } else {
                        player.hp -= 1;
                        player.lastInjury = lastTime;
                        genFloatingNumber(player.x, player.y, 1, "rgba(255,0,0,1.0)", 15)
                    }
                    value.timeFromLastAttack = 0;
                }
            }
            if (value.timeFromLastAttack >= value.cooldown && (Math.sqrt(Math.pow(player.x - value.x, 2) + Math.pow(player.y - value.y, 2)) <= value.range)) {
                if (value.dmg > getDef()) {
                    player.hp -= value.dmg - getDef();
                    player.lastInjury = lastTime;
                    genFloatingNumber(player.x, player.y, (value.dmg - getDef()), "rgba(255,0,0,1.0)", 15)
                } else {
                    player.hp -= 1;
                    player.lastInjury = lastTime;
                    genFloatingNumber(player.x, player.y, 1, "rgba(255,0,0,1.0)", 15)
                }
                value.timeFromLastAttack = 0;
            }


        });
    }

    //Attacking
    player.timeFromLastAttack += dt;
    if(player.isDead === false) {
        if (player.timeFromLastAttack >= getItem(player.weapon.id).cooldown && player.attack === true) {
            if (getItem(player.weapon.id).dmgType === "point") {
                checkPlayerThanPointAttack();
            } else if (getItem(player.weapon.id).dmgType === "area") {
                checkPlayerThanAreaAttack();
            }
            player.isAttackDrawn = true;
            player.timeFromLastAttack = 0;
        }
        for (let i = 0; i < map.enemies.length; i++){
            if (map.enemies[i].isDead === true) {
                dropRandom(map.enemies[i]);
                map.enemies.splice(i, 1);
                i--;
            }
        }
    }
    //Manipulations with floating numbers
    if(config.isFloatingNumbers === true){
        for(let i = 0;i < flotNumb.length;i++) {
            if(flotNumb[i].deployed + 1000 <= now){
                flotNumb.splice(i,i + 1);
                i--;
            }else{
                flotNumb[i].y -= 100 * dt;
                flotNumb[i].x += 10 * Math.sin(2 * flotNumb[i].y) * 1;
            }
        }
    }
}

function uiActions(dt){
    if(!isPhone){
        events.isPaused = isPPressed;
        if(isYPressed === true){
            events.isSkillsOpen = !events.isSkillsOpen;
        }
        if(isUPressed === true){
            upgradeMenu.isOpened = !upgradeMenu.isOpened;
        }
    }
    let isChecked = false;
    let buff;
    if(events.isInventoryOpen === true){
        //Puting x and y and making optimized for inventory tiles width and height
        jQuery.each(playerInventory,function (index,value) {
                if(isReachable(value.object) && value.isEmpty === false) {
                    value.object.x = getPosById(value.object.inventoryId).x - getItem(value.object.id).sprite.w/2 + inventory.w/2;
                    value.object.y = getPosById(value.object.inventoryId).y - getItem(value.object.id).sprite.h/2 + inventory.h/2;
                }
        });
        jQuery.each(player.equipment,function (index,value) {
            if(isReachable(value.object) && value.object.id !== 11) {
                value.object.x = getPosById(value.object.inventoryId).x - getItem(value.object.id).sprite.w/2 + inventory.w/2;
                value.object.y = getPosById(value.object.inventoryId).y - getItem(value.object.id).sprite.h/2 + inventory.h/2;
            }
        });
        //Searching for pulled with mouse inventory or player equipment and shop interaction
        jQuery.each(playerInventory,function (index,value) {
            if(value.isEmpty === false && isReachable(value.object.id) && (mouseX > value.object.x && mouseX < value.object.x + getItem(value.object.id).sprite.w) && (mouseY > value.object.y && mouseY < value.object.y + getItem(value.object.id).sprite.h)){
                if(events.isLeftMouthClicked && !events.isMouthWithInv){
                invShouldFollow = index;
                inventory.chosen = value.object;
                events.isMouthWithInv = true;
                isChecked = true;
                return false;//Breaking each
                }else if(events.isRightMouthClicked && !events.isMouthWithInv && isShopOpened() && findShop().menu.shopType === getItem(value.object.id).type){
                    if(findNpcByShopId(findShop().id).money - getItem(value.object.id).cost >= 0) {
                        player.money += getItem(value.object.id).cost;
                        findNpcByShopId(findShop().id).money -= getItem(value.object.id).cost;
                        value.object = null;
                        value.isEmpty = true;
                    }else{
                        genTextAlert("This shopkeeper cann't afford this","rgba(255,240,240,1.0)");
                        return false;
                    }
                }
            }
        });
        if(isChecked === false){
            jQuery.each(player.equipment,function (index, value) {
                if(isReachable(value.object) && isReachable(value.object.id) && (mouseX > value.object.x && mouseX < value.object.x + getItem(value.object.id).sprite.w) && (mouseY > getItem(value.object.id).y && mouseY < value.object.y + getItem(value.object.id).sprite.h) && events.isMouthWithInv === false && events.isLeftMouthClicked === true){
                    invShouldFollow = value.type;
                    inventory.chosen = value.object;
                    events.isMouthWithInv = true;
                    return false;
                }
            });
        }

        isChecked = false;

        if(isReachable(invShouldFollow) && events.isMouthWithInv){
            //Making bufer value of pulled object
            if((invShouldFollow >= 0 && invShouldFollow < 9) && !isNaN(invShouldFollow)){
                buff = playerInventory[invShouldFollow];
            }else if(isNaN(invShouldFollow)){
                jQuery.each(player.equipment,function (index,value) {
                    if(value.type === invShouldFollow){
                        buff = value;
                        return false;
                    }
                });
            }
            //Making x and y of the object with x and y of mouse minus object width and height(if the mouse is clicked down)
            if(events.isLeftMouthClicked === true){
                buff.object.x = mouseX - getItem(buff.object.id).sprite.w/2;
                buff.object.y = mouseY - getItem(buff.object.id).sprite.h/2;
            }
            //Manipulations if mouse clicked up
            else if(events.isLeftMouthClicked  === false || events.isInventoryOpen === false){
                //Trying to find another inventory or equipment tile to put the object
                jQuery.each(playerInventory,function (index,value){
                            if((mouseX > value.x && mouseX < value.x + value.w) && (mouseY > value.y && mouseY < value.y + value.h)){
                                if(value.isEmpty && buff.isEmpty === false){
                                    value.object = [buff.object, buff.object=value.object][0];
                                    value.isEmpty = false;
                                    buff.isEmpty = true;
                                    buff.object = null;
                                    value.object.inventoryId = value.id;
                                }else if(value.isEmpty === false && buff.isEmpty === false){
                                    let tempID = buff.object.inventoryId;
                                    buff.object = [value.object, value.object=buff.object][0];
                                    value.isEmpty = false;
                                    buff.isEmpty = false;
                                    value.object.inventoryId = value.id;
                                    buff.object.inventoryId = tempID;
                                }



                                invShouldFollow = null;
                                events.isMouthWithInv = false;
                                isChecked = true;
                                return false;
                            }
                    });
                if(isChecked === false){
                    jQuery.each(player.equipment,function (index,value) {
                        if((mouseX > value.x && mouseX < value.x + value.w) && (mouseY > value.y && mouseY < value.y + value.h) && value.type === getItem(buff.object.id).type){
                                if(value.isEmpty === true) {
                                    value.object = buff.object;
                                    value.object.inventoryId = value.type;
                                    value.isEmpty = false;
                                    buff.object = null;
                                    buff.isEmpty = true;
                                    isChecked = true;
                                    events.isMouthWithInv = false;
                                    return false;
                                }else if(value.isEmpty === false){
                                    let tempID = buff.object.inventoryId;
                                    value.object = [buff.object, buff.object=value.object][0];
                                    value.object.inventoryId = value.type;
                                    buff.object.inventoryId = tempID;
                                    value.isEmpty = false;
                                    isChecked = true;
                                    events.isMouthWithInv = false;
                                    return false;
                                }
                        }
                    });
                }
            }

            }

        //Putting back the object if wrong pos
        if(isChecked === false && events.isLeftMouthClicked  === false && events.isMouthWithInv === true){
                buff.object.x = getPosById(buff.object.inventoryId).x;
                buff.object.y = getPosById(buff.object.inventoryId).y;

                invShouldFollow = null;
                events.isMouthWithInv = false;

            }

        //Checking if drop button clicked
        if(events.isLeftMouthClicked && ((mouseX > inventory.x + 216 && mouseX < inventory.x + 216 + 63) && (mouseY > inventory.y + 345 && mouseY < inventory.y + 345 + 30))){
            if(isReachable(inventory.chosen)){
                isChecked = false;
                createInTheWorld(playerAttackBox.x - playerAttackBox.w / 1.5,playerAttackBox.y - playerAttackBox.h / 1.5,inventory.chosen.id);
                jQuery.each(playerInventory,function (index,value) {
                    if(inventory.chosen === value.object){
                        value.isEmpty = true;
                        value.object = null;
                        inventory.chosen = null;
                        isChecked = true;
                        return false;
                    }
                });
                if(!isChecked){
                    jQuery.each(player.equipment,function (index,value) {
                        if(inventory.chosen === value.object){
                            value.isEmpty = true;
                            value.object = null;
                            inventory.chosen = null;
                            isChecked = true;
                            return false;
                        }
                    });
                }
            }
        }

        //Checking if use button clicked
        if(events.isLeftMouthClicked && (mouseX > inventory.x + 216 && mouseX < inventory.x + 216 + 63 && mouseY > inventory.y + 312 && mouseY < inventory.y + 312 + 30)){
            if(isReachable(inventory.chosen) && getItem(inventory.chosen.id).type === "consumable" && isReachable(getItem(inventory.chosen.id).action)){
                if(getItem(inventory.chosen.id).isTemp === true){
                    player.actions[player.actions.length] = {"action":getItem(inventory.chosen.id).action,"time":getItem(inventory.chosen.id).time,"deployed":lastTime};
                }else{
                    getItem(inventory.chosen.id).action(player);
                }
                jQuery.each(playerInventory,function (index,value) {
                    if(inventory.chosen === value.object){
                        value.isEmpty = true;
                        value.object = null;
                        inventory.chosen = null;
                        return false;
                    }
                });
            }else if(isReachable(inventory.chosen) && getItem(inventory.chosen.id).type === "skillBook" && isReachable(getItem(inventory.chosen.id).train)){
                getItem(inventory.chosen.id).train(player);
            }
        }

        //Checking if close button pressed
        if(events.isLeftMouthClicked === true && mouseX > inventory.x + 288 && mouseX < inventory.x + 288 + 60 && mouseY > inventory.y + 12 && mouseY < inventory.y + 12 + 72){
            events.isInventoryOpen = false;
            isITogled = !isITogled;
        }

        //Checking for inventory moving
        /*if(events.isLeftMouthClicked === true && (mouseX > inventory.x && mouseX < inventory.x + 285 && mouseY > inventory.y && mouseY < inventory.y + 90)){
            events.isInvBarWithMouse = true;

        }else if(events.isInvBarWithMouse && events.isLeftMouthClicked === false && (mouseX > inventory.x && mouseX < inventory.x + 285 && mouseY > inventory.y && mouseY < inventory.y + 90)){
            events.isInvBarWithMouse = false;
        }
        if(events.isInvBarWithMouse){
            inventory.x = mouseX + (inventory.x - mouseX )/2;
            inventory.y = mouseY + (inventory.y - mouseY)/2;
        }*/
    }
    
    jQuery.each(player.equipment,function (index,value) {
        player[value.type] = value.object;
    });

    //Menus updates
    jQuery.each(menues,function (index,value) {
        if(value.menu.type === "shop"){
            value.menu.updateShop();
        }
    });

    if(events.isSkillsOpen){
        skillsMenu.updateMenu();
    }

    //Checking for choosing items in hotbar
    if(isReachable(getClickedNumber()) && getClickedNumber() > 0 && getClickedNumber() < 7){
        player.hotbar.activeId = getClickedNumber() - 1;
    }

    //Checking for using active item in hotbar
    if(isReachable(player.hotbar.activeId) && isReachable(player.hotbar.items[player.hotbar.activeId])){
        if(player.hotbar.items[player.hotbar.activeId].type === "skill" && isReachable(player.hotbar.items[player.hotbar.activeId].use)){
            player.hotbar.items[player.hotbar.activeId].use(player);
        }
    }


    //Interactions with menus

    //Player leveling
    if(player.exp >= player.expToNextLevel){
        player.level++;
        player.exp -= player.expToNextLevel;
        player.expToNextLevel = nextLevel(player.level);
        player.upgradePoints++;
    }

    if(upgradeMenu.isOpened){
        upgradeMenu.menu.updateUpgradeMenu();
    }



}



//General func
function isReachable(item) {
    if(item !== null && item !== undefined){
        return true
    }else if(item === null && item === undefined){
        return false;
    }else{
      //  console.log("What a fuck are you doing???");
    }
}

//Other functions
function getMousePos(e) {
    let rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    }
}

function getCordsOfPlayerAttackBox(){
    if(player.velX > 0){
        player.directionx = 1;
    }else if(player.velX < 0) {
        player.directionx = -1;
    }else if(player.velX === 0){
        player.directionx = 0;
    }if(player.velY < 0) {
        player.directiony = -1;
    }else if(player.velY > 0) {
        player.directiony = 1;
    }else if(player.velY === 0){
        player.directiony = 0;
    }

    if(player.directionx === 0 && player.directiony === 1){
        player.attackBox = 7;
    }else if(player.directionx === 1 && player.directiony === 1){
        player.attackBox = 8;
    }else if(player.directionx === 1 && player.directiony === 0){
        player.attackBox = 5;
    }else if(player.directionx === 1 && player.directiony === -1){
        player.attackBox = 2;
    }else if(player.directionx === 0 && player.directiony === -1){
        player.attackBox = 1;
    }else if(player.directionx === -1 && player.directiony === -1){
        player.attackBox = 0;
    }else if(player.directionx === -1 && player.directiony === 0){
        player.attackBox = 3;
    }else if(player.directionx === -1 && player.directiony === 1){
        player.attackBox = 6;
    }
}

//Player attacking
function checkPlayerThanPointAttack(){
    let minHp = 0;
    let indexOfEnemy = null;

        jQuery.each(map.enemies,function (index,value) {
            if(value.isDead === false && circleToRectIntersection(value.x,value.y,value.size,playerAttackBox.x,playerAttackBox.y,playerAttackBox.w,playerAttackBox.h)){
                if(value.hp <= minHp){
                    minHp = value.hp;
                    indexOfEnemy = index;

                }
                indexOfEnemy = index;

            }
        });

        if(isReachable(indexOfEnemy) ){
            if(getDef(map.enemies[indexOfEnemy]) < player.weapon.dmg){
                map.enemies[indexOfEnemy].hp -= (player.weapon.dmg - getDef(map.enemies[indexOfEnemy]));
                genFloatingNumber(map.enemies[indexOfEnemy].x,map.enemies[indexOfEnemy].y,(player.weapon.dmg - getDef(map.enemies[indexOfEnemy])),"rgba(0,0,0,1.0)",15)
            }else if(getDef(map.enemies[indexOfEnemy]) >= player.weapon.dmg){
                map.enemies[indexOfEnemy].hp -= 1;
                genFloatingNumber(map.enemies[indexOfEnemy].x,map.enemies[indexOfEnemy].y,1,"rgba(0,0,0,1.0)",15)
            }
            if(map.enemies[indexOfEnemy].hp <= 0){map.enemies[indexOfEnemy].isDead = true;}
        }

}
function checkPlayerThanAreaAttack(){
        jQuery.each(map.enemies,function (index,value) {
            if(!value.isDead && circleToRectIntersection(value.x,value.y,value.size,playerAttackBox.x,playerAttackBox.y,playerAttackBox.w,playerAttackBox.h)){
                if(getDef(value) < getItem(player.weapon.id).dmg){
                    value.hp -= getItem(player.weapon.id).dmg - getDef(value);
                    genFloatingNumber(value.x,value.y,(getItem(player.weapon.id).dmg - getDef(value)),"rgba(0,0,0,1.0)",15)
                }else if(getDef(value) >= getItem(player.weapon.id).dmg){
                    value.hp -= 1;
                    genFloatingNumber(value.x,value.y,1,"rgba(0,0,0,1.0)",15)
                }
            }
            if(value.hp <= 0){value.isDead = true;}
        });
    }

//Input
function getInputNumbers() {
    let temp = [false,false,false,false,false,false,false,false,false,false];
    for(let i = 0;i < 10;i++){
        if(numbers[i] === true){
            temp[i] = true;
        }else if(numbers[i] === false){
            temp[i] = false;
        }
    }
    if(temp.length === 0){
        temp = null;
    }
    return temp;
}
function getClickedNumber() {
    let temp = getInputNumbers();
    if(isReachable(temp)){
        for (let i = 0;i < temp.length;i++){
            if(temp[i] === true){
                return i;
            }
        }
    }else{
        return null;
    }
}

function makeSpriteSheetArayInLine(count,img) {
    let buffMass = [];
    let h = img.height;
    let w = img.width;
    let pw = w / count;
    for(let i = 0;i < count;i++){
        buffMass[i] = {"px":i*pw,"py":0,"pw":pw,"ph":h,"w":pw,"h":h,"img":img};
    }

        return buffMass;

}

function getRandomTOrF() {
    return Math.random() < 0.5
}

// function pointOrArea() {
//     if(getRandomTOrF()){
//         return "area";
//     }else{
//         return "point";
//     }
// }

function copy(value){
    return jQuery.extend(true,{},value);
}

//Items
function getItem(id){
        return itemTypes[id];

}
function createInTheWorld(x,y,id){
        map.items[map.items.length] = {"x":x,"y":y,"id":id};
}

//Enemies
function getEnemy(id){
    return enemyTypes[id];
}
function genEnemy(id,x,y) {
    let temp = getEnemy(id);
    let enemy = {
        "x":x,
        "y":y,
        "velocity": temp.randomSpeed ? Math.random() * (temp.rndSpdFinish - temp.rndSpdStart) + temp.rndSpdStart : temp.velocity,
        "id":temp.id,
        "hp":temp.hp,
        "maxHp":temp.maxHp,
        "mana":isReachable(temp.mana) ? temp.mana : undefined,
        "stamina":isReachable(temp.stamina) ? temp.stamina : undefined,
        "helmet":isReachable(temp.helmet) ? temp.helmet : undefined,
        "armor":isReachable(temp.armor) ? temp.armor : undefined,
        "weapon":isReachable(temp.weapon) ? temp.weapon : undefined,
        "ring":isReachable(temp.ring) ? temp.ring : undefined,
        "isDead":false,
        "money":temp.money,
        "commonDrops":temp.commonDrops,
        "rareDrops":temp.rareDrops,
        "epicDrops":temp.epicDrops,
        "legendaryDrops":temp.legendaryDrops,
        "color":temp.color,
        "exp":temp.exp,
        "timeFromLastAttack":0,
        "size":temp.size
    };
    map.enemies[map.enemies.length] = enemy;
}



//Inventory functions
function getPosById(id) {
    let v = {
        "x":0,
        "y":0
    };
    if((id => 0 && id < 9 || id === 0) && !isNaN(id)){

        let count = 0;
        for(let x = 0;x < 3;x++){
        for(let y = 0;y < 3;y++){
            // console.log(id === count);
            if(id === count){
                v.x = inventory.x + 28 + x * inventory.w;
                v.y = inventory.y + 127 + y * inventory.h;
                return v;break;
            }
            count++;
        }
    }
    }else if(isNaN(id)){
        jQuery.each(player.equipment,function (index,value){
            if(id === value.type){
                v.x = value.x;
                v.y = value.y;
            }
        });
        return v;
    }else{
        console.log("Not an ID");
        return null;
    }
}

//Monster drops
function dropRandom(enemy) {
    let drop = chooseDrops(enemy);
    if(isReachable(drop)){
        createInTheWorld(enemy.x,enemy.y,drop.id);
    }
    if(isReachable(enemy.exp)){
        let temp = jQuery.extend(true,{},sExp);
        temp.x = enemy.x;
        temp.y = enemy.y;
        temp.count = enemy.exp;
        createInTheWorld(temp.x - 3,temp.y,temp.id);
    }if(isReachable(enemy.money)){
        let temp = jQuery.extend(true,{},sMoney);
        temp.type = "money";
        temp.x = enemy.x;
        temp.y = enemy.y;
        temp.count = enemy.money;
        createInTheWorld(temp.x + 3,temp.y,temp.id);
    }
}
function chooseDrops(enemy) {
    let rand = Math.floor(Math.random() * 100) + 1;
    let drop;
    if(rand > 0 && rand <= 70){
        drop = getRandomDrop(enemy.commonDrops.concat(uniCommonDrops));
    }else if(rand > 70 && rand <= 85){
        drop = getRandomDrop(enemy.rareDrops.concat(uniRareDrops));
    }else if(rand > 85 && rand <= 95){
        drop = getRandomDrop(enemy.epicDrops.concat(uniEpicDrops));
    }else if(rand > 95 && rand <= 100){
        drop = getRandomDrop(enemy.legendaryDrops.concat(uniLegendaryDrops));
    }else{
        drop = null;
    }
    return drop;

}
function getRandomDrop(dropArr) {
    let randDrop = Math.floor(Math.random() * dropArr.length);
    return dropArr[randDrop];

}

//Save games
function loadGame() {
    let temp = JSON.parse(localStorage.getItem("saveGame"));
    console.log(temp);
    if(isReachable(temp) && isReachable(temp.player) && isReachable(temp.map) && isReachable(temp.config)){
        player = temp.player;
        map = temp.map;
        playerInventory = temp.playerInventory;
        isLoadedFromSaveGame = true;
        config = temp.config;
        camera.follow(player,canvas.width/2,canvas.height/2);
    }else {
        //console.log("Hey");
    }

}

function saveGame() {
    let temp = {"player":player,"map":map,"config":config,"playerInventory":playerInventory};
    delete localStorage["saveGame"];
    localStorage.setItem("saveGame",JSON.stringify(temp));
}

function clearLoad() {
    delete localStorage["saveGame"];
}

//In game things
//Floating numbers
function genFloatingNumber(x,y,number,color,size) {
    if(isReachable(x) && isReachable(y) && isReachable(number) && isReachable(color)){
        flotNumb[flotNumb.length] = {
            "x":x,
            "y":y,
            "number":number,
            "color":color,
            "size":size,
            "deployed":now
        }
    }else{
        console.log("There is null number");
    }
}

//Text alerts
function genTextAlert(text,color) {
    if(isReachable(text) && isReachable(color)){
        inGameAlerts[inGameAlerts.length] = {
            "text":text,
            "time":0,
            "color":color,
        };
    }else{
        return false;
    }
}

function operateTextAlerts() {
        if(inGameAlerts.length >= 1){
            if(isReachable(inGameAlerts[0])){
                ctx.drawImage(alertSprite,canvas.width/2 - alertSprite.width - 100,10,200,50);
                ctx.font = "13px san-serif"
                ctx.fillStyle = inGameAlerts[0].color;
                ctx.fillText(inGameAlerts[0].text,canvas.width/2 - alertSprite.width - 90,40);
                inGameAlerts[0].time += (now - lastTime) / 1000;
            }/*else if(!isReachable(inGameAlerts[0])){
                inGameAlerts.shift();
            }*/
            if(inGameAlerts[0].time >= 1.5){
                inGameAlerts.shift();
            }

        }

}

//Geters for player or entity stats
//Defence
function getDef(user){
    let def = 0;
    if(isReachable(user.armor)){
        def += user.armor.def;
    }if(isReachable(user.helmet)){
        def += user.helmet.def;
    }if(isReachable(user.skillDef)){
        def += user.skillDef;
    }if(isReachable(user.ring) && isReachable(user.ring.def)){
        def += user.ring.def;
    }if(isReachable(user.weapon) && isReachable(user.weapon.def)){
        def += user.weapon.def;
    }if(isReachable(user.def)){
        def += user.def;
    }
    return def;
}
function getFullDef(user) {
    let def = 0;
    if(isReachable(user.armor)){
        def += user.armor.def;
    }if(isReachable(user.helmet)){
        def += user.helmet.def;
    }if(isReachable(user.skillDef)){
        def += user.skillDef;
    }if(isReachable(user.ring) && isReachable(user.ring.def)){
        def += user.ring.def;
    }if(isReachable(user.weapon.def) && isReachable(user.weapon)){
        def += user.weapon.def;
    }if(isReachable(user.shield) && user.shield !== undefined){
        def += user.shield.def;
    }
    return def;
}
//Attack
function getAttack(user) {
    let attack = 0;
    if(isReachable(user.armor) && isReachable(user.armor.dmg)){
        attack += user.armor.dmg;
    }if(isReachable(user.helmet) && isReachable(user.helmet.dmg)){
        attack += user.helmet.dmg;
    }if(isReachable(user.skillAttack)){
        attack += user.skillAttack;
    }if(isReachable(user.ring) && isReachable(user.ring.dmg)){
        attack += user.ring.dmg;
    }if(isReachable(user.weapon) && isReachable(user.weapon.dmg)){
        attack += user.weapon.dmg;
    }if(isReachable(user.shield) && isReachable(user.shield.dmg)){
        attack += user.shield.dmg;
    }
    return attack;
}
//Resist
function getResist(user,resist) {
    let resistNum = 0;
    let resistance = resist + "Resist"
    if(isReachable(user.armor) && isReachable(user.armor[resistance])){
        resistNum += user.armor[resistance];
    }if(isReachable(user.helmet) && isReachable(user.helmet[resistance])){
        resistNum += user.helmet[resistance];
    }if(isReachable(user[resistance])){
        resistNum += user[resistance];
    }if(isReachable(user.ring) && isReachable(user.ring[resistance])){
        resistNum += user.ring[resistance];
    }if(isReachable(user.weapon) && isReachable(user.weapon[resistance])){
        resistNum += user.weapon[resistance];
    }if(isReachable(user.shield) && isReachable(user.shield[resistance])){
        resistNum += user.shield[resistance];
    }
    return resistNum;
}


//Levels
function nextLevel(level){
    return 200 * (level * level) - (200 * level)
}

//Quests
function genRandomQuest(npc,id,x,y) {
    let rarity = genRarity();
    let treasure = [];
    if(rarity === "common"){
        treasure[treasure.length] = sMoney;
        treasure[treasure.length - 1].count = 100;

        treasure[treasure.length] = sExp;
        treasure[treasure.length - 1].count = 100;
    }else if(rarity === "rare"){
        treasure[treasure.length] = sMoney;
        treasure[treasure.length - 1].count = 300;

        treasure[treasure.length] = sExp;
        treasure[treasure.length - 1].count = 300;
    }else if(rarity === "epic"){
        treasure[treasure.length] = sMoney;
        treasure[treasure.length - 1].count = 1000;

        treasure[treasure.length] = sExp;
        treasure[treasure.length - 1].count = 1000;
    }else if(rarity === "legendary"){
        treasure[treasure.length] = sMoney;
        treasure[treasure.length - 1].count = 2000;

        treasure[treasure.length] = sExp;
        treasure[treasure.length - 1].count = 2000;
    }

        map.items[map.items.length] = jQuery.extend(true,{},sScroll);
        map.items[map.items.length - 1].x = x;
        map.items[map.items.length - 1].y = y;
        map.items[map.items.length - 1].item = genRanQuestItem(rarity,npc.givenQuests);
        map.items[map.items.length - 1].playerID = player.id;
        map.items[map.items.length - 1].name = "Quest for " + player.name;
        map.items[map.items.length - 1].itemId = npc.givenQuests;
        map.items[map.items.length - 1].type = "quest";
        map.items[map.items.length - 1].treasure = treasure;
        npc.givenQuests++;



}

function genRarity() {
    let rand = Math.floor(Math.random() * 100) + 1;
    let rarity;
    if(rand > 0 && rand <= 70){
        rarity = "common";
    }else if(rand > 70 && rand <= 85){
        rarity = "rare";
    }else if(rand > 85 && rand <= 95){
        rarity = "epic";
    }else if(rand > 95 && rand <= 100){
        rarity = "legendary";
    }else{
        rarity = null;
    }
    return rarity;
}

function genRanQuestItem(rarity,id) {
    let rand = Math.floor(Math.random() * cQuestItems.length);
    let item = {
        "name":player.name + "'s " + rarity + "" + rand,
        "img":cQuestItems[rand].img,
        "px":cQuestItems[rand].px,
        "py":cQuestItems[rand].py,
        "pw":cQuestItems[rand].pw,
        "ph":cQuestItems[rand].ph,
        "w":cQuestItems[rand].pw,
        "h":cQuestItems[rand].ph,
        "x":0,
        "y":0,
        "itemId":id,
        "type":"questItem"
    };

    if(rarity === "common"){
        uniCommonDrops[length] = item;
    }else if(rarity === "rare"){
        uniRareDrops[length] = item;
    }else if(rarity === "epic"){
        uniEpicDrops[length] = item;
    }else if(rarity === "legendary"){
        uniLegendaryDrops[length] = item;
    }
    return item;
}

function dropTreasure(item,x,y) {
    jQuery.each(item.treasure,function (index,value) {
        createInTheWorld(x,y,value.id);
    });
}

function removeQuestItem(item) {
    let isChecked = false;
    jQuery.each(uniCommonDrops,function (index,value) {
        if(isReachable(value.id) && value.id === item.id){
            uniCommonDrops.splice(index,1);
            index--;
            isChecked = true;
        }
    });
    if(isChecked){
        jQuery.each(uniRareDrops,function (index,value) {
            if(isReachable(value.id) && value.id === item.id){
                uniRareDrops.splice(index,1);
                index--;
                isChecked = true;
            }
        });
    }if(isChecked){
        jQuery.each(uniEpicDrops,function (index,value) {
            if(isReachable(value.id)  && value.id === item.id){
                uniEpicDrops.splice(index,1);
                index--;
                isChecked = true;
            }
        });
    }if(isChecked){
        jQuery.each(uniLegendaryDrops,function (index,value) {
            if(isReachable(value.id) && value.id === item.id){
                uniLegendaryDrops.splice(index,1);
                index--;
                isChecked = true;
            }
        });
    }
}

//Random functions))
function isIncOrDecr() {
    let a = Math.random();
    if(a > 0.5){
        return -1;
    }else{
        return 1;
    }
}

//Collisions
function cirToCirCol(x1,y1,r1,x2,y2,r2) {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)) <= r1 + r2;

}

function circleToRectIntersection(circleX,circleY,circleR,rectX,rectY,rectW,rectH){
        let DeltaX = circleX - Math.max(rectX, Math.min(circleX, rectX + rectW));
        let DeltaY = circleY - Math.max(rectY, Math.min(circleY, rectY + rectH));
        return (DeltaX * DeltaX + DeltaY * DeltaY) < (circleR * circleR);
}

//Math))
function getVelocityTo(obj1,obj2) {
    let dx = obj1.x - obj2.x;
    let dy = obj1.y - obj2.y;

    if(dx > 0){
        dx = 1;
    }else if(dx < 0){
        dx = -1;
    }else{
        dx = 0;
    }
    if(dy > 0){
        dy = 1;
    }else if(dy < 0){
        dy = -1;
    }else{
        dy = 0;
    }
    let v = {"x":dx,"y":dy};
    return v;


}

//Other
function restoreHealth(entity,value) {
    entity.hp += value;
    if(entity.hp > entity.maxHp){
        entity.hp = entity.maxHp;
    }
}

function wrapText (context, text, x, y, maxWidth, lineHeight) {
        let a = text + "";
        let words = a.split(' ');
        let line = '';
        let lineCount = 0;
        let i;
        let test;
        let metrics;

        for (i = 0; i < words.length; i++) {
            test = words[i];
            metrics = context.measureText(test);
            while (metrics.width > maxWidth) {
                // Determine how much of the word will fit
                test = test.substring(0, test.length - 1);
                metrics = context.measureText(test);
            }
            if (words[i] !== test) {
                words.splice(i + 1, 0,  words[i].substr(test.length));
                words[i] = test;
            }

            test = line + words[i] + ' ';
            metrics = context.measureText(test);

            if (metrics.width > maxWidth && i > 0) {
                context.fillText(line, x, y);
                line = words[i] + ' ';
                y += lineHeight;
                lineCount++;
            }
            else {
                line = test;
            }
        }

        context.fillText(line, x, y);
    }

//Touchsreen
function startTouch(e) {
    e.preventDefault();

    if(e.targetTouches.length === 2){
        for(let i = 0;i < e.targetTouches.length;i++){
            touchCache.push(e.targetTouches[i]);
        }
    }

}
function moveTouch(e) {
    e.preventDefault();

    moveDetection(e);
}
function endTouch(e) {
    e.preventDefault();

}
function moveDetection(e){
    if (e.targetTouches.length === 2 && e.changedTouches.length === 2) {
        // Check if the two target touches are the same ones that started
        // the 2-touch
        let point1=-1;
        let point2=-1;
        for (let i=0; i < touchCache.length; i++) {
            if (touchCache[i].identifier === e.targetTouches[0].identifier) point1 = i;
            if (touchCache[i].identifier === e.targetTouches[1].identifier) point2 = i;
        }
        if (point1 >=0 && point2 >= 0) {
            // Calculate the difference between the start and move coordinates
            let diff1x = Math.abs(touchCache[point1].clientX - e.targetTouches[0].clientX);
            let diff2x = Math.abs(touchCache[point2].clientX - e.targetTouches[1].clientX);

            let diff1y = Math.abs(touchCache[point1].clientY - e.targetTouches[0].clientY);
            let diff2y = Math.abs(touchCache[point2].clientY - e.targetTouches[1].clientY);

            /*if(){

            }*/

        }
        else {
            // empty tpCache
            touchCache = [];
        }
    }
}
//Sprite
function Sprite(data,img) {
    if(img === null || img === undefined){
        return false;
    }
    this.animated = data.length > 1;
    this.frameCount = data.length;
    this.duration = 0;
    this.loop = true;
    this.img = img;
    if(data.length > 1){
        for(let i in data){
            if(typeof data[i].d === undefined){
                data[i].d = 100;
            }
            this.duration += data[i].d;
            if(typeof data[i].loop !== undefined){
                this.loop = data[i].loop ? true : false;
            }
        }
    }
    this.frames = data;
    this.w = 0;
    this.h = 0;
}
Sprite.prototype.drawWH = function (t,x,y,w,h) {
    let frameId = 0;
    if(!this.loop && this.animated && t >= this.duration){
        frameId = (this.frames.length - 1);
    }else if(this.animated){
        t = t % this.duration;
        let totalD = 0;

        for(let i in this.frames){
            totalD += this.frames[i].d;
            frameId = i;
            this.frameId = totalD;
            if(t <= totalD){
                break;
            }
        }
    }

    ctx.drawImage(
        this.img,
        this.frames[frameId].px,this.frames[frameId].py,
        this.frames[frameId].pw,this.frames[frameId].ph,
        x,y,
        w,h);
    this.w = this.frames[frameId].w;
     this.h = this.frames[frameId].h;
 };
Sprite.prototype.draw = function (t,x,y) {
        let frameId = 0;
        if(!this.loop && this.animated && t >= this.duration){
            frameId = (this.frames.length - 1);
        }else if(this.animated){
            t = t % this.duration;
            let totalD = 0;

            for(let i in this.frames){
                totalD += this.frames[i].d;
                frameId = i;
                this.frameId = totalD;
                if(t <= totalD){
                    break;
                }
            }
        }

        ctx.drawImage(
            this.img,
            this.frames[frameId].px,this.frames[frameId].py,
            this.frames[frameId].pw,this.frames[frameId].ph,
            x,y,
            this.frames[frameId].w,this.frames[frameId].h);
        this.w = this.frames[frameId].w;
        this.h = this.frames[frameId].h;
    };

//Skill
function Skill(name,description,cooldown,func,sprite) {
    this.name = name;
    this.description = description;
    this.action = func;
    this.sprite = sprite;
    this.cooldown = cooldown;
    this.lastUsed = 0;
    this.type = "skill";
}
Skill.prototype.use = function (user) {
    this.action(user);
};
Skill.prototype.learn = function(user) {
    let a = false;
    if(user.skills.length > 0){
        jQuery.each(user.skills,function (index,value) {
            if(value === this){
                genTextAlert("You already learned that skill.","rgba(255,100,100,1.0)");
                a = false;
                return false;
            }else if(value !== this){

                a = true;
            }
        });
    }else{
        a = true;
    }
    return a;
};

//Like bullet
function Delpoyable(x,y,vx,vy,sprite,type,time,size,func) {
    this.x = 0 + x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.sprite = sprite;
    this.type = type;
    this.time = time;
    this.living = 0;
    this.size = size;
    this.lastDest = {};
    this.action = isReachable(func) ? func : null;
}
Delpoyable.prototype.update = function (dt) {
        if(isReachable(this.isMovingTowards) && this.isMovingTowards === true){
            this.x += Math.abs(this.vx) * getVelocityTo(this.lastDest,this).x * dt;
            this.y += Math.abs(this.vy) * getVelocityTo(this.lastDest,this).y * dt;
        }else{
            this.x += this.vx * dt;
            this.y += this.vy * dt;
        }
        if(isReachable(this.action)){
            this.action();
        }
        this.living += dt;

};
Delpoyable.prototype.moveTowards = function (x,y) {
    this.lastDest = {"x":x,"y":y};
    this.isMovingTowards = true;
};

//Menus
//Shop
function Shop(items,x,y,type,money,keeper) {
    this.items = items;
    this.x = x;
    this.y = y;
    this.w = 343;
    this.h = 400;
    this.visible = false;
    this.type = "shop";
    this.pos = 0;
    this.buttons = [];
    for(let i = 0;i < 4;i++){
        this.buttons[i] = {"x":this.x + 280,"y":this.y + 100 * i + 50};
    }
    this.shopType = type;
    this.money = money;
    this.keeper = keeper;
}
Shop.prototype.drawShop = function (gameTime) {
    ctx.drawImage(shopSprite,this.x,this.y);
    let count = 0;
    for(let i = this.pos;i < this.pos + 4;i++){
        if(isReachable(this.items[i]) && isReachable(this.items[i].sprite)){
            if(count === 0){
                this.items[i].sprite.draw(gameTime,this.x + 26,this.y + 43);
                ctx.fillStyle = "rgba(0,0,0,1.0)";
                ctx.font = "10px Arial";
                wrapText(ctx,this.items[i].description,this.x + 70,this.y + 60,215,15);
                wrapText(ctx,this.items[i].cost,this.x + 300,this.y + 60,215,15);
                ctx.drawImage(acceptButtonSprite,this.buttons[0].x, this.buttons[0].y);

            }else{
                this.items[i].sprite.draw(gameTime,this.x + 26,this.y + (95 * count) + 43);
                ctx.fillStyle = "rgba(0,0,0,1.0)";
                wrapText(ctx,this.items[i].description,this.x + 70,this.y + 90 * count + 70,215,15);
                wrapText(ctx,this.items[i].cost,this.x + 300,this.y + 100 * count + 50,215,15);
                ctx.drawImage(acceptButtonSprite,this.buttons[count].x, this.buttons[count].y);
            }
        }
        count++;
    }
    ctx.font = "12px Arial";
    ctx.fillStyle = "rgba(255,255,255,1.0)"
    wrapText(ctx,this.keeper.name + "'s money: " + this.keeper.money,this.x + 20,this.y + 30,100,10);
};
Shop.prototype.updateShop = function () {
    if(events.isWheel === true){
        if( mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h){
            if(events.deltaY > 0 && this.pos + 1 <= this.items.length){
                this.pos += 1;
            }else if(events.deltaY < 0 && this.pos - 1 >= 0){
                this.pos -= 1;
            }else{

            }
        }
    }
    for(let i = 0;i < 4;i++) {
        if(events.isLeftMouthClicked && mouseX > this.buttons[i].x && mouseX < this.buttons[i].x + 14 && mouseY > this.buttons[i].y && mouseY < this.buttons[i].y + 14){
            if(player.money >= this.items[i + this.pos].cost){
                let isChecked = null;
                jQuery.each(playerInventory,function (index,value) {
                    if(value.isEmpty){
                        isChecked = index;
                        return true;
                    }
                });
                if(isReachable(isChecked)){
                    playerInventory[isChecked].isEmpty = false;
                    playerInventory[isChecked].object = this.items[i + this.pos];
                    playerInventory[isChecked].object.id = parseInt(isChecked,10);
                    player.money -= this.items[i + this.pos].cost;
                    findNpcByShopId(this.id).money += this.items[i + this.pos].cost;
                }else{
                    genTextAlert("Your inventory is full","rgba(255,200,200,1.0)")
                }
            }else{
                genTextAlert("You can't aford this","rgba(255,200,200,1.0)");
            }

        }
    }

};

//Upgrade stats
function UpgradeMenu() {
    this.sprite = new Sprite([{"px":0,"py":0,"pw":upgradeMenuSprite.width,"ph":upgradeMenuSprite.height,"w":upgradeMenuSprite.width,"h":upgradeMenuSprite.height}],upgradeMenuSprite);
    this.x = 200;
    this.y = 200;
    this.type = "upgrade";
    this.health  = {"x":16,"y":86,"w":50,"h":35};
    this.stamina = {"x":94,"y":88,"w":26,"h":12};
    this.mana    = {"x":154,"y":88,"w":35,"h":12};

}
UpgradeMenu.prototype.drawUpgrades = function() {
    this.sprite.draw(gameTime,this.x,this.y);
};
UpgradeMenu.prototype.updateUpgradeMenu = function() {
    if(events.isLeftMouthClicked){
    if(player.upgradePoints > 0 && mouseX > this.health.x + this.x && mouseX < this.health.x + this.health.w + this.x && mouseY > this.health.y + this.y && mouseY < this.health.y + this.health.h + this.y){
        player.maxHp += 10 * (player.level * 0.2);
        player.upgradePoints--;
    }else if(player.upgradePoints > 0 && mouseX > this.stamina.x + this.x && mouseX < this.stamina.x + this.stamina.w + this.x && mouseY > this.stamina.y + this.y && mouseY < this.stamina.y + this.stamina.h + this.y){
        player.maxStamina += 10 * (player.level * 0.2);
        player.fightingSkill++;
        player.defSkill++;
        player.upgradePoints--;
    }else if(player.upgradePoints > 0 && mouseX > this.mana.x + this.x && mouseX < this.mana.x + this.mana.w + this.x && mouseY > this.mana.y + this.y && mouseY < this.mana.y + this.mana.h + this.y){
        player.maxMana += 10 * (player.level * 0.2);
        player.magicSkill++;
        player.upgradePoints--;
        player.lastManaLoose = lastTime;
    }else if(player.upgradePoints < 1){
        genTextAlert("You don't have enough upgrade points","rgba(255,200,200,1.0)");
    }
    }
};


function isShopOpened() {
    let temp = false;
    jQuery.each(menues,function (index,value) {
        if(isReachable(value) && value.menu.type === "shop"){
            temp = true;
            return true;
        }
    });
    return temp;
}
function findShop() {
    let temp = null;
    jQuery.each(menues,function (index,value) {
        if(value.menu.type === "shop"){
            temp = value;
            return true;
        }
    });
    return temp;
}
function findShopById(id) {
    let temp = null;
    jQuery.each(menues,function (index,value) {
        if(value.id === id){
            temp = value.menu;
            return false;
        }
    });
    return temp;
}
function findNpcByShopId(id) {
    let temp = null;
    jQuery.each(npcs,function (index,value) {
        if(index === id){
            temp = value;
            return false;
        }
    });
    return temp;
}

//Map and tiles
function toIndex(x, y){
    return((y * map.w) + x);
}

function Tile(tx, ty, tt) {
    this.x = tx;
    this.y = ty;
    this.type = tt;
    this.roof = null;
    this.roofType = 0;
    this.eventEnter = null;
    this.itemStack = null;
}

function Obj(x,y,type,col) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.col = col;
}

function Map(tileW,tileH) {
    this.map = [];
    this.w = 0;
    this.h = 0;
    this.tileH = tileW;
    this.tileW = tileH;
    this.objects = [];
    this.items = [];
    this.enemies = [];
    this.delpoyables = [];
}
Map.prototype.build = function (data,w,h) {
    this.w = w;
    this.h = h;

    if(data.length !== w*h){
        return false;
    }
    this.map.length = 0;
    for(let y = 0;y < this.h;y++){
        for(let x = 0;x < this.w;x++){
            this.map.push(data[toIndex(x,y)]);
        }
    }
    return true;
};

//Camera functions
(function(){
    function Rectangle(left, top, width, height){
        this.left = left || 0;
        this.top = top || 0;
        this.width = width || 0;
        this.height = height || 0;
        this.right = this.left + this.width;
        this.bottom = this.top + this.height;
    }

    Rectangle.prototype.set = function(left, top, /*optional*/width, /*optional*/height){
        this.left = left;
        this.top = top;
        this.width = width || this.width;
        this.height = height || this.height;
        this.right = (this.left + this.width);
        this.bottom = (this.top + this.height);
    };

    Rectangle.prototype.within = function(r) {
        return (r.left <= this.left &&
            r.right >= this.right &&
            r.top <= this.top &&
            r.bottom >= this.bottom);
    };

    Rectangle.prototype.overlaps = function(r) {
        return (this.left < r.right &&
            r.left < this.right &&
            this.top < r.bottom &&
            r.top < this.bottom);
    };

    // add "class" Rectangle to our Game object
    Game.Rectangle = Rectangle;
})();
//Camera
(function(){

    // possibles axis to move the camera
    let AXIS = {
        NONE: "none",
        HORIZONTAL: "horizontal",
        VERTICAL: "vertical",
        BOTH: "both"
    };

    // Camera constructor
    function Camera(xView, yView, canvasWidth, canvasHeight, worldWidth, worldHeight){
        // position of camera (left-top coordinate)
        this.xView = xView || 0;
        this.yView = yView || 0;

        // distance from followed object to border before camera starts move
        this.xDeadZone = 0; // min distance to horizontal borders
        this.yDeadZone = 0; // min distance to vertical borders

        // viewport dimensions
        this.wView = canvasWidth;
        this.hView = canvasHeight;

        // allow camera to move in vertical and horizontal axis
        this.axis = AXIS.BOTH;

        // object that should be followed
        this.followed = null;

        // rectangle that represents the viewport
        this.viewportRect = new Game.Rectangle(this.xView, this.yView, this.wView, this.hView);

        // rectangle that represents the world's boundary (room's boundary)
        this.worldRect = new Game.Rectangle(0, 0, worldWidth, worldHeight);

    }

    // gameObject needs to have "x" and "y" properties (as world(or room) position)
    Camera.prototype.follow = function(gameObject, xDeadZone, yDeadZone){
        this.followed = gameObject;
        this.xDeadZone = xDeadZone;
        this.yDeadZone = yDeadZone;
    };



    Camera.prototype.update = function(){
        // keep following the player (or other desired object)
        if(this.followed != null){
            if(this.axis === AXIS.HORIZONTAL || this.axis === AXIS.BOTH)
            {
                // moves camera on horizontal axis based on followed object position
                if(this.followed.x - this.xView  + this.xDeadZone > this.wView)
                    this.xView = this.followed.x - (this.wView - this.xDeadZone);
                else if(this.followed.x  - this.xDeadZone < this.xView)
                    this.xView = this.followed.x  - this.xDeadZone;

            }
            if(this.axis === AXIS.VERTICAL || this.axis === AXIS.BOTH)
            {
                // moves camera on vertical axis based on followed object position
                if(this.followed.y - this.yView + this.yDeadZone > this.hView)
                    this.yView = this.followed.y - (this.hView - this.yDeadZone);
                else if(this.followed.y - this.yDeadZone < this.yView)
                    this.yView = this.followed.y - this.yDeadZone;
            }

        }

        // update viewportRect
        this.viewportRect.set(this.xView, this.yView);

        // don't let camera leaves the world's boundary
        if(!this.viewportRect.within(this.worldRect))
        {
            if(this.viewportRect.left < this.worldRect.left)
                this.xView = this.worldRect.left;
            if(this.viewportRect.top < this.worldRect.top)
                this.yView = this.worldRect.top;
            if(this.viewportRect.right > this.worldRect.right)
                this.xView = this.worldRect.right - this.wView;
            if(this.viewportRect.bottom > this.worldRect.bottom)
                this.yView = this.worldRect.bottom - this.hView;
        }

    };

    // add "class" Camera to our Game object
    Game.camera = Camera;
})();
