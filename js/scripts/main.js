define(["classes","jquery","map","itemList"],function (classes,jQuery,map,itemsList) {
    let func = {};
    //Load
    func.load = function(vars){
        vars.canvas = document.getElementById('canvas');
        vars.ctx = canvas.getContext('2d');
    };

    //Run includes create & update & render
    func.run = function(vars,maint) {
        vars.now = Date.now();
        vars.dt = (vars.now - vars.lastTime) / 1000.0;
        if (vars.createRuned === false){func.create(vars,maint);}else{}
        func.update(vars.dt,vars,maint);
        func.render(vars,maint);
        vars.lastTime = vars.now;
        vars.gameTime += vars.dt;
    };


    //Create & update & render
    func.create = function(vars,maint){
        //Camera
        vars.camera = new classes.Camera(0,0,canvas.width,canvas.height,3200,3200);

        //Load game
        maint.loadGame(vars.camera,vars);
        vars.menu = {
            "x":100,
            "y":100,
            "isOpen":false,
            "menuOpen":true,
            "mainSprite": new classes.Sprite([{"px":0,"py":0,"pw":250,"ph":160,"w":250,"h":160}],vars.menuSprite),
            "configSprite": new classes.Sprite([{"px":0,"py":0,"pw":250,"ph":160,"w":250,"h":160}],vars.configsSprite),
            "radioOff": new classes.Sprite([{"px":0,"py":0,"pw":21,"ph":21,"w":21,"h":21}],vars.radiosSprite),
            "radioOn": new classes.Sprite([{"px":0,"py":21,"pw":23,"ph":23,"w":23,"h":23}],vars.radiosSprite),
            "render":function () {
                if(this.isOpen){
                    if(this.menuOpen){
                        this.mainSprite.draw(vars.gameTime,vars.ctx,this.x,this.y);
                        maint.wrapText(vars.ctx,"Save",this.x + 40,this.y + 37,100,0);
                        maint.wrapText(vars.ctx,"Load",this.x + 130,this.y + 37,100,0);
                        maint.wrapText(vars.ctx,"Options",this.x + 35,this.y + 85,100,0);
                        maint.wrapText(vars.ctx,"Exit",this.x + 85,this.y + 130,100,0);
                        maint.wrapText(vars.ctx,"Clear Load",this.x + 110,this.y + 87,100,0);

                    }else{
                        this.configSprite.draw(vars.gameTime,vars.ctx,this.x,this.y);
                        maint.wrapText(vars.ctx,"Auto pickup",this.x + 22,this.y + 34,1000,0);
                        this[vars.config.isAutoPickup ? "radioOn" : "radioOff"].draw(vars.gameTime,vars.ctx,this.x + 150,this.y + 18);
                        maint.wrapText(vars.ctx,"Floating numbers",this.x + 22,this.y + 65,1000,0);
                        this[vars.config.isFloatingNumbers ? "radioOn" : "radioOff"].draw(vars.gameTime,vars.ctx,this.x + 150,this.y + 48);
                        maint.wrapText(vars.ctx,"Alerts",this.x + 22,this.y + 96,1000,0);
                        this[vars.config.alerts ? "radioOn" : "radioOff"].draw(vars.gameTime,vars.ctx,this.x + 150,this.y + 78);
                        maint.wrapText(vars.ctx,"Version: " + vars.version,this.x + 32,this.y + 120,100000,0);
                    }
                }
            },
            "update":function () {
                if(this.isOpen){
                    if(this.menuOpen){
                        if(vars.events.isLeftMouseReleased){
                            if(vars.mouseX > this.x + 16 && vars.mouseX < this.x + 101 && vars.mouseY > this.y + 16 && vars.mouseY < this.y + 59){
                                maint.saveGame(vars);
                            }
                            if(vars.mouseX > this.x + 104 && vars.mouseX < this.x + 189 && vars.mouseY > this.y + 16 && vars.mouseY < this.y + 59){
                                maint.loadGame(vars.camera,vars);
                            }
                            if(vars.mouseX > this.x + 16 && vars.mouseX < this.x + 101 && vars.mouseY > this.y + 61 && vars.mouseY < this.y + 104){
                                this.menuOpen = !this.menuOpen;
                            }
                            if(vars.mouseX > this.x + 59 && vars.mouseX < this.x + 144 && vars.mouseY > this.y + 105 && vars.mouseY < this.y + 147){
                                window.close();
                            }
                            if(vars.mouseX > this.x + 207 && vars.mouseX < this.x + 250 && vars.mouseY > this.y && vars.mouseY < this.y + 43){
                                this.isOpen = false;
                            }
                            if(vars.mouseX > this.x + 104 && vars.mouseX < this.x + 189 && vars.mouseY > this.y + 61 && vars.mouseY < this.y + 104){
                                maint.clearLoad();
                            }
                        }
                    }else{
                        if(vars.events.isLeftMouseReleased){
                            if(vars.mouseX > this.x + 150 && vars.mouseX < this.x + 171 && vars.mouseY > this.y + 18 && vars.mouseY < this.y + 39){
                                vars.config.isAutoPickup = !vars.config.isAutoPickup;
                            }if(vars.mouseX > this.x + 150 && vars.mouseX < this.x + 171 && vars.mouseY > this.y + 48 && vars.mouseY < this.y + 69){
                                vars.config.isFloatingNumbers = !vars.config.isFloatingNumbers;
                            }if(vars.mouseX > this.x + 150 && vars.mouseX < this.x + 171 && vars.mouseY > this.y + 78 && vars.mouseY < this.y + 99){
                                vars.config.alerts = !vars.config.alerts;
                            }
                            if(vars.mouseX > this.x + 207 && vars.mouseX < this.x + 250 && vars.mouseY > this.y && vars.mouseY < this.y + 43){
                                this.menuOpen = !this.menuOpen;
                            }
                        }
                    }
                }
            }
        };

        //Config
        if(!vars.isLoadedFromSaveGame){
            vars.config = {
            "isFloatingNumbers":true,
            "alerts":true,
            "isAutoPickup":false
        };
        }

        //Other handlers
        vars.canvas.onmousedown = function (e) {
            if(e.button === 0){
                vars.events.isLeftMousePressed = true;
            }if(e.button === 2){
                vars.events.isRightMousePressed = true;
            }

        };
        vars.canvas.onmouseup = function (e) {
            if(e.button === 0){
                vars.events.isLeftMousePressed = false;
                vars.events.isLeftMouseReleased = true;
            }if(e.button === 2){
                vars.events.isRightMousePressed = false;
                vars.events.isRightMouseReleased = true;
            }
        };

        //Player
        if(!vars.isLoadedFromSaveGame){
            vars.player = new classes.Player("Romko",vars.players.length);
        }

        //Player attack box
        vars.playerAttackBox = {
            "x":0,
            "y":0,
            "w":0,
            "h":0
        };
        vars.playerHotbar = {
            "x":vars.canvas.width / 2  - 350 / 2,
            "y":vars.canvas.height - 49,
            "w":288,
            "h":40,
        };

        vars.camera.follow(vars.player,vars.canvas.width/2,vars.canvas.height/2);

        //Creating player skills menu UI
        vars.skillsMenu = {
            "sprite":new classes.Sprite([{"px":0,"py":0,"pw":vars.skillsMenuSprite.width,
                "ph":vars.skillsMenuSprite.height,
                "w":vars.skillsMenuSprite.width,
                "h":vars.skillsMenuSprite.height
            }],vars.skillsMenuSprite),
            "x":40,
            "y":120,
            "w":480,
            "h":224,
            "pos":0,
            "chosen":null,
            "drawSkills":function () {
                if(vars.player.skills.length > 0){
                    for (let y = 0;y < 3;y++){
                        for(let x = 0;x < 3;x++){
                            if(maint.isReachable(vars.player.skills[((y * 3) + x) + this.pos])){
                                maint.getSkill(vars.player.skills[((y * 3) + x) + this.pos].id,vars.skillTypes).sprite.drawWH(vars.gameTime,vars.ctx,this.x + (x * 67) + (x === 0 ? 9 : 15),this.y + (y * 67) + (y === 0 ? 9 : 17),60,60);
                            }
                        }
                    }
                    if(maint.isReachable(this.chosen)){
                        vars.ctx.fillStyle = "rgba(255,255,255,1.0)";
                        vars.ctx.font = "15px Arial";
                        maint.wrapText(vars.ctx,this.chosen.description,this.x + 260,this.y + 25,90,14)
                    }
                }

            },
            "updateMenu":function () {
                //Mouse wheel rotation
                if(vars.events.isWheel && vars.mouseX > this.x && vars.mouseX < this.x + this.w && vars.mouseY > this.y && vars.mouseY < this.y + this.h){
                    if(vars.events.deltaY > 0 && this.pos + 3 <= vars.player.skills.length){
                        this.pos += 3;
                    }else if(vars.events.deltaY < 0 && this.pos - 3 >= 0){
                        this.pos -= 3;
                    }else{

                    }
                }
                var count = 0;
                for (var y = 0;y < 3;y++){
                    for(var x = 0;x < 3;x++){
                        if(vars.mouseX > this.x + x * 67 + 14 && this.x + x * 67 + 81 > vars.mouseX && vars.mouseY > this.y + y * 67 + 14 && this.x + y * 67 + 81 > vars.mouseX){
                            if(maint.isReachable(vars.player.skills[count]) && maint.isReachable(maint.getClickedNumber(vars.numbers,vars))){
                                vars.player.hotbar.items[maint.getClickedNumber(vars.numbers,vars) - 1] = vars.player.skills[((y * 3) + x) + this.pos];
                            }if(maint.isReachable(vars.player.skills[count]) && vars.events.isLeftMouseReleased){
                                this.chosen = vars.player.skills[((y * 3) + x) + this.pos];
                            }
                        }
                        count++;
                    }
                }
                if(vars.events.isLeftMouseReleased && vars.mouseX > this.x + 448 && vars.mouseX < this.x + 479 && vars.mouseY > this.y && vars.mouseY < this.y + 31){
                    vars.events.isSkillsOpen = false;
                }
            }

        };
        //Upgrade menu UI
        vars.upgradeMenu = {"isOpened":false,"menu":new classes.UpgradeMenu(vars)};





        //Enemy moving functions

        //Creating all typed objects

        //Projectiles

        //Tiles


        //Skills


        //Enemies

        //Setting ids:

        //For items
        for(let i = 0; i < vars.itemTypes.length;i++){
            vars.itemTypes[i].id = i;
        }
        //Tiles
        for(let i = 0; i < itemsList.tileTypes.length;i++){
            itemsList.tileTypes[i].id = i;
        }
        //Enemies
        for(let i = 0; i < itemsList.enemyTypes.length;i++){
            itemsList.enemyTypes[i].id = i;
        }
        //Projectiles
        for(let i = 0; i < vars.projectileTypes.length;i++){
            vars.projectileTypes[i].id = i;
        }
        //Skills
        for(let i = 0; i < itemsList.skillTypes.length;i++){
            itemsList.skillTypes[i].id = i;
        }
        //Staff skills
        for(let i = 0; i < vars.staffSkills.length;i++){
            vars.staffSkills[i].id = i;
        }

        //Works if no loaded game
        if(!vars.isLoadedFromSaveGame) {
            //Map
            let data = map;
            let temp = [];
            let count = 0;
            vars.map = new classes.Map(31, 31);

            for (let y = 0; y < 100; y++) {
                for (let x = 0; x < 100; x++) {
                    temp.push({"x": x, "y": y, "id": data[count]});
                    count++;
                }

            }
            vars.map.build(temp, 100, 100);
        }




        //Other objects
        vars.playerUI = {
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

        /*Making preset items*/
        vars.sScroll = {
            "sprite":new classes.Sprite([{"w":32,"h":32, "pw":32,"ph":32,"px":0,"py":0,"x":0,"y":0,}],vars.scrollSprite),
            "isQuest":true,
            "type":"quest",
            "treasure":null
        };
        vars.sSpawner = {
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
        vars.sExp = {
            "sprite":new classes.Sprite([{"w":32,"h":32,"pw":32,"ph":32,"px":0,"py":0}],vars.expSprite),
            "x":0,
            "y":0,
            "name":"exp",
            "type":"exp",
            "count":0,
            "id":9
        };
        vars.sMoney = {
            "sprite":new classes.Sprite([{"w":32,
                "h":32,
                "pw":32,
                "ph":32,
                "px":0,
                "py":0}],vars.money[2].img),
            "x":0,
            "y":0,
            "name":"money",
            "type":"money",
            "count":0,
            "id":10
        };


        vars.createRuned = true;
        vars.isDebug = false;
        maint.createInTheWorld(10,50,vars.itemTypes[7].id,vars);
        vars.map.items[0].x = 100;
        vars.map.items[0].y = 200;
        //Players array for NPC
        jQuery.each(vars.players,function (index,value) {
            vars.npcPlayers[index] = {
                "id":value.id,
                "canGiveQuest":true,
                "lastQuest":0
            };
        });

        //Making presetted NPCs
        vars.questGiver = {
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
                "img":vars.swords[5].img,
                "px":vars.swords[5].px,
                "py":vars.swords[5].py,
                "pw":vars.swords[5].pw,
                "ph":vars.swords[5].ph,
                "x":20,
                "y":100,
                "w":vars.swords[5].pw / 2,
                "h":vars.swords[5].ph / 2,
                "type":"weapon",
                "cooldown":0.2,
                "dmg":10,
                "dmgType":"area",
                "isMelee":true,
                "cost":100
            },
            "armor":{
                "name": "Knight's Armor",
                "img":vars.chestplates[3].img,
                "px":vars.chestplates[3].px,
                "py":vars.chestplates[3].py,
                "pw":vars.chestplates[3].pw,
                "ph":vars.chestplates[3].ph,
                "x":0,
                "y":0,
                "w":vars.chestplates[3].pw,
                "h":vars.chestplates[3].ph,
                "def":13,
                "type":"armor",
                "cost":200
            },
            "helmet":{
                "name": "Knight's helmet",
                "img":vars.helmets[4].img,
                "px":vars.helmets[4].px,
                "py":vars.helmets[4].py,
                "pw":vars.helmets[4].pw,
                "ph":vars.helmets[4].ph,
                "x":0,
                "y":0,
                "w":vars.helmets[4].pw,
                "h":vars.helmets[4].ph,
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
            "players":vars.npcPlayers,
        };
        vars.sTrader = {
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
                "img":vars.swords[5].img,
                "px":vars.swords[5].px,
                "py":vars.swords[5].py,
                "pw":vars.swords[5].pw,
                "ph":vars.swords[5].ph,
                "x":20,
                "y":100,
                "w":vars.swords[5].pw / 2,
                "h":vars.swords[5].ph / 2,
                "type":"weapon",
                "cooldown":0.2,
                "dmg":10,
                "dmgType":"area",
                "isMelee":true,
                "cost":100
            },
            "armor":{
                "name": "Knight's Armor",
                "img":vars.chestplates[3].img,
                "px":vars.chestplates[3].px,
                "py":vars.chestplates[3].py,
                "pw":vars.chestplates[3].pw,
                "ph":vars.chestplates[3].ph,
                "x":0,
                "y":0,
                "w":vars.chestplates[3].pw,
                "h":vars.chestplates[3].ph,
                "def":13,
                "type":"armor",
                "cost":200
            },
            "helmet":{
                "name": "Knight's helmet",
                "img":vars.helmets[4].img,
                "px":vars.helmets[4].px,
                "py":vars.helmets[4].py,
                "pw":vars.helmets[4].pw,
                "ph":vars.helmets[4].ph,
                "x":0,
                "y":0,
                "w":vars.helmets[4].pw,
                "h":vars.helmets[4].ph,
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
            "items":[vars.itemTypes[8],vars.itemTypes[0],vars.itemTypes[1],vars.itemTypes[2]]
        };
        vars.weaponTrader = jQuery.extend(true,{},vars.sTrader);
        vars.weaponTrader.items = [vars.itemTypes[5],vars.itemTypes[12],vars.itemTypes[13],vars.itemTypes[14]];
        vars.weaponTrader.shopType = "weapon";
        vars.weaponTrader.x = 1300;

        //Other actions
        //Creatin new traders from preset
        vars.npcs[0] = vars.sTrader;
        vars.npcs[1] = vars.weaponTrader;

        //Spawners
        if(!vars.isLoadedFromSaveGame) {
            vars.map.spawners[0] = jQuery.extend(true, {}, vars.sSpawner);
            vars.map.spawners[0].enemy = jQuery.extend(true, {}, itemsList.enemyTypes[1]);
            vars.map.spawners[0].x = 1000;
            vars.map.spawners[0].y = 1000;

            vars.map.spawners[1] = jQuery.extend(true, {}, vars.sSpawner);
            vars.map.spawners[1].enemy = jQuery.extend(true, {}, itemsList.enemyTypes[0]);
            vars.map.spawners[1].x = 1500;
            vars.map.spawners[1].y = 1500;
            vars.map.spawners[1].rate = 5;
            vars.map.spawners[1].maxSpawned = 5;
        }
        console.log("created");

    };

    func.update = function(dt,vars,maint){
        vars.events.isWheel = vars.events.deltaY > 0 || vars.events.deltaY < 0;

        func.uiActions(dt,vars,maint);
        if(vars.events.isPaused === false){
            func.gameActions(dt,vars,maint);
        }


        vars.events.deltaY = 0;
        vars.events.isWheel = false;
        //Resetting all RELEASED buttons
        for(let obj in vars.events.keys){
            if(obj.endsWith("Released")){
                vars.events.keys[obj] = false;
            }
        }
        vars.events.isLeftMouseReleased = false;
        vars.events.isRightMouseReleased = false;
        vars.events.keys.isEscReleased = false;
    };

    func.render = function(vars,maint){
        vars.ctx.clearRect(0,0,vars.canvas.width,vars.canvas.height);

        //Tiles
        let count = 0;
        for(let y = 0;y < vars.map.h;y++){
            for(let x = 0;x < vars.map.w;x++) {
                if(maint.isTileInRange(vars.map.map[maint.toIndex(x, y, vars.map)],vars.camera,vars.map.tileW,vars.map.tileH)){
                    itemsList.tileTypes[vars.map.map[maint.toIndex(x, y, vars.map)].id].sprite.draw(vars.gameTime, vars.ctx, x * vars.map.tileW - vars.camera.xView, y * vars.map.tileH - vars.camera.yView);
                    count++;
                }
            }
        }

        //Objects
        for(let i = 0;i < vars.map.objects.length;i++){

        }

        //Items
        for(let i = 0;i < vars.map.items.length;i++) {
            if (maint.isReachable(vars.map.items[i]) && maint.isReachable(itemsList.getItem(vars.map.items[i].id)) && itemsList.isItemInRange(vars.map.items[i],itemsList.getItem(vars.map.items[i].id).sprite.w,itemsList.getItem(vars.map.items[i].id).sprite.h,vars.camera)){
                //console.log(map.items[i]);
                itemsList.getItem(vars.map.items[i].id).sprite.draw(vars.gameTime,vars.ctx, vars.map.items[i].x - vars.camera.xView, vars.map.items[i].y - vars.camera.yView/*,map.items[i].sprite.w,map.items[i].sprite.h*/);
            }
        }

        //Deployables
        for(let i = 0;i < vars.map.delpoyables.length;i++){
            //map.delpoyables[i].sprite.draw(gameTime,map.delpoyables[i].x - camera.xView,map.delpoyables[i].y - camera.yView,map.delpoyables[i].sprite.w,map.delpoyables[i].sprite.h);
            if(maint.getProjectile(vars.map.delpoyables[i].id,itemsList.projectileTypes).type === "circle"){
                vars.ctx.fillStyle = maint.getProjectile(vars.map.delpoyables[i].id,itemsList.projectileTypes).color;
                vars.ctx.beginPath();
                vars.ctx.arc(vars.map.delpoyables[i].x - vars.camera.xView,vars.map.delpoyables[i].y - vars.camera.yView,maint.getProjectile(vars.map.delpoyables[i].id,itemsList.projectileTypes).size,0,360,false);
                vars.ctx.closePath();
                vars.ctx.fill();
            }
        }



        //Draw player
        vars.ctx.beginPath();
        vars.ctx.fillStyle = vars.player.color;
        vars.ctx.srtokeStyle = "rgba(0,0,0,1.0)";
        vars.ctx.arc(vars.player.x - vars.camera.xView,vars.player.y - vars.camera.yView,vars.player.size,0,360,false);
        vars.ctx.fill();
        vars.ctx.stroke();
        vars.ctx.closePath();

        //Draw spawners
        if(vars.isDebug) {
            jQuery.each(vars.map.spawners, function (index, value) {
                vars.ctx.fillStyle = "rgba(0,0,0,1.0)";
                vars.ctx.beginPath();
                vars.ctx.arc(value.x - vars.camera.xView, value.y - vars.camera.yView, value.size, 0, 360, false);
                vars.ctx.closePath();
                vars.ctx.fill();
            });
        }

        //Draw enemies
        jQuery.each(vars.map.enemies,function (index,value) {
            if(value.isDead === false /*&& maint.isEnemInRange(value,vars.camera)*/){
                vars.ctx.strokeStyle = "rgba(0,0,0,1.0)";
                vars.ctx.fillStyle = maint.getEnemy(value.id,itemsList.enemyTypes).color;
                vars.ctx.beginPath();
                vars.ctx.arc(value.x - vars.camera.xView,value.y - vars.camera.yView,maint.getEnemy(value.id,itemsList.enemyTypes).size,0,360,false);
                vars.ctx.stroke();
                vars.ctx.fill();
                vars.ctx.closePath();

            }
        });

        //Drawing NPCs
        jQuery.each(vars.npcs,function (index,value) {
            if(value.isDead && value.keepCorpse === false || !value.isDead){
                vars.ctx.fillStyle = value.color;
                vars.ctx.strokeStyle = value.color;
                vars.ctx.beginPath();
                vars.ctx.arc(value.x - vars.camera.xView,value.y - vars.camera.yView,value.size,0,360,false);
                vars.ctx.fill();
                vars.ctx.stroke();
                vars.ctx.closePath();
            }
        });

        //Showing enemy names and health
        jQuery.each(vars.map.enemies,function (index,value) {
            if(Math.sqrt(Math.pow(value.x - vars.player.x,2) + Math.pow(value.y - vars.player.y,2)) <= vars.player.vision){
                vars.ctx.fillStyle = "rgba(255,255,255,1.0)";
                vars.ctx.font = "10px Arial";
                vars.ctx.beginPath();
                vars.ctx.fillText(maint.getEnemy(value.id,itemsList.enemyTypes).name,value.x - maint.getEnemy(value.id,itemsList.enemyTypes).size - vars.camera.xView,value.y - maint.getEnemy(value.id,itemsList.enemyTypes).size - 20 - vars.camera.yView);
                vars.ctx.fillStyle = "rgba(155,10,10,1.0)";
                vars.ctx.fillRect(value.x - maint.getEnemy(value.id,itemsList.enemyTypes).size - 1 - vars.camera.xView,value.y - maint.getEnemy(value.id,itemsList.enemyTypes).size - 15 - vars.camera.yView,maint.getEnemy(value.id,itemsList.enemyTypes).size * 2.2,10);
                vars.ctx.fillStyle = "rgba(255,10,10,1.0)";
                vars.ctx.fillRect(value.x - maint.getEnemy(value.id,itemsList.enemyTypes).size - 1 - vars.camera.xView,value.y - maint.getEnemy(value.id,itemsList.enemyTypes).size - 15 - vars.camera.yView,maint.getEnemy(value.id,itemsList.enemyTypes).size * 2.2 * (value.hp / value.maxHp),10);
                vars.ctx.closePath();
            }
        });

        //Showing NPCs names and health and press E button
        jQuery.each(vars.npcs,function (index,value) {
            if(value.isDead === false){
                if(Math.sqrt(Math.pow(value.x - vars.player.x,2) + Math.pow(value.y - vars.player.y,2)) <= vars.player.vision){
                    if(value.behavior === "neutral"){
                        vars.ctx.fillStyle = "rgba(255,255,255,1.0)";
                    }else if(value.behavior === "peaceful"){
                        vars.ctx.fillStyle = "rgba(0,255,0,1.0)";
                    }else if(value.behavior === "aggressive"){
                        vars.ctx.fillStyle = "rgba(255,0,0,1.0)";
                    }
                    vars.ctx.font = "13px Arial";
                    vars.ctx.beginPath();
                    //Text
                    vars.ctx.fillText(value.name,value.x - value.size - vars.camera.xView,value.y - value.size - 20 - vars.camera.yView);
                    //Health bar
                    vars.ctx.fillStyle = "rgba(155,10,10,1.0)";
                    vars.ctx.fillRect(value.x - value.size - 1 - vars.camera.xView,value.y - value.size - 15 - vars.camera.yView,value.size * 2,10);
                    vars.ctx.fillStyle = "rgba(255,10,10,1.0)";
                    vars.ctx.fillRect(value.x - value.size - 1 - vars.camera.xView,value.y - value.size - 15 - vars.camera.yView,value.size * 2 * (value.hp / value.maxHp),10);
                    vars.ctx.closePath();
                    if(value.behavior === "peaceful" || value.behavior === "neutral" && value.isInteractive === true){
                        vars.ctx.strokeStyle = "rgba(0,0,0,1.0)";
                        vars.ctx.fillStyle = "rgba(255,255,255,1.0)";
                        vars.ctx.font = "16px Arial";
                        vars.ctx.beginPath();
                        vars.ctx.strokeText("Press F to interact",value.x + value.size + 5 - vars.camera.xView,value.y - vars.camera.yView);
                        vars.ctx.fillText("Press F to interact",value.x + value.size + 5 - vars.camera.xView,value.y - vars.camera.yView);
                        vars.ctx.closePath();
                        vars.ctx.fill();
                        vars.ctx.stroke();
                    }

                }
            }


        });

        //Draw player attack box
        vars.ctx.strokeStyle = "black";
        vars.ctx.fillStyle = "red";
        vars.ctx.beginPath();
        vars.ctx.rect(vars.playerAttackBox.x - vars.camera.xView, vars.playerAttackBox.y - vars.camera.yView, vars.playerAttackBox.w, vars.playerAttackBox.h);

        if(vars.player.isAttackDrawn === true) {
            vars.ctx.fill();
            vars.player.isAttackDrawn = false;
        }
        vars.ctx.stroke();
        vars.ctx.closePath();




        //Floating numbers
        if(vars.config.isFloatingNumbers){

            jQuery.each(vars.flotNumb,function (index,value) {
                vars.ctx.fillStyle = value.color;
                vars.ctx.srtokeStyle = value.color;
                vars.ctx.font = value.size + "px Arial";
                vars.ctx.beginPath();
                vars.ctx.fillText(value.number + "",value.x - vars.camera.xView,value.y - vars.camera.yView);
                vars.ctx.closePath();
                vars.ctx.fill();
                vars.ctx.stroke();
            });
        }


        //Drawing UI

        //Drawing text alerts if it's turned on in configuration
        if(vars.config.alerts === true){
            maint.operateTextAlerts(vars);
        }

        //Drawing paused text
        if(vars.events.isPaused === true) {
            vars.ctx.font = "30px Arial";
            vars.ctx.fillStyle = "rgba(255,255,255,1.0)";
            vars.ctx.fillText("Game Paused", 50, 250);
        }

        //Drawing inventory and its contains
        if(vars.events.isInventoryOpen === true){
            vars.player.inventory.render();
        }

        //Drawing skills menu
        if(vars.events.isSkillsOpen === true){
            vars.skillsMenu.sprite.draw(vars.gameTime,vars.ctx,vars.skillsMenu.x,vars.skillsMenu.y);
            vars.skillsMenu.drawSkills();
        }

        //Drawing player options UI
        vars.ctx.drawImage(vars.playerUISprite,10,5);


        //Drawing health bar
        vars.ctx.fillStyle = "rgba(255,0,0,0.7)";
        //ctx.strokeStyle = "rgba(255,0,0,0.7)";
        vars.ctx.beginPath();
        vars.ctx.fillRect(vars.playerUI.x + vars.playerUI.healtX,vars.playerUI.y + vars.playerUI.healtY,vars.playerUI.barW * (vars.player.hp / vars.player.maxHp),vars.playerUI.barH);
        vars.ctx.closePath();
        vars.ctx.fill();

        vars.ctx.fillStyle = "rgba(0,0,255,0.7)";
        //ctx.strokeStyle = "rgba(255,0,0,0.7)";
        vars.ctx.beginPath();
        vars.ctx.fillRect(vars.playerUI.x + vars.playerUI.manaX,vars.playerUI.y + vars.playerUI.manaY,vars.playerUI.barW * (vars.player.mana / vars.player.maxMana),vars.playerUI.barH);
        vars.ctx.closePath();
        vars.ctx.fill();

        vars.ctx.fillStyle = "rgba(0,255,0,0.7)";
        //ctx.strokeStyle = "rgba(255,0,0,0.7)";
        vars.ctx.beginPath();
        vars.ctx.fillRect(vars.playerUI.x + vars.playerUI.staminaX,vars.playerUI.y + vars.playerUI.staminaY,vars.playerUI.barW * (vars.player.stamina / vars.player.maxStamina),vars.playerUI.barH);
        vars.ctx.closePath();
        vars.ctx.fill();

        //Draw player hotbar
        vars.ctx.drawImage(vars.playerHotbarSprite,vars.playerHotbar.x,vars.playerHotbar.y);
        for(let i = 0;i < 6;i++){
            if(maint.isReachable(vars.player.hotbar.items[i]) && i < 6) {
                maint.getSkill(vars.player.hotbar.items[i].id,itemsList.skillTypes).sprite.drawWH(vars.gameTime,vars.ctx,vars.playerHotbar.x + i * 54 + 21, vars.playerHotbar.y + 4, 41, 41);
            }
        }


        //Drawing hotkeys
        vars.ctx.font = "15px Arial";
        vars.ctx.fillStyle = "rgba(255,255,255,1.0)";
        vars.ctx.fillText("1",55 + vars.playerHotbar.x,44 + vars.playerHotbar.y);

        for(let i = 1;i < 6;i++){
            vars.ctx.fillText("" + (i + 1),vars.playerHotbar.x + 53 * (i + 1),vars.playerHotbar.y + 44);
        }

        //Drawing menus
        jQuery.each(vars.menues,function (index,value) {
            if(maint.isReachable(value.menu.drawShop) && value.menu.type === "shop"){
                value.menu.drawShop(vars);
            }/*else if(value.menu.type === "upgrade" && isReachable(value.menu.drawUpgrades())){
            value.menu.drawUpgrades();
        }*/
        });
        //Drawing upgrade menu
        if(vars.upgradeMenu.isOpened === true){
            vars.upgradeMenu.menu.drawUpgrades(vars);
        }

        vars.menu.render();
    };

    //Game and UI actions
    func.gameActions = function(dt,vars,maint){
        //Event on collision with tiles
        jQuery.each(vars.map.map,function (index,value) {
            if(maint.circleToRectIntersection(vars.player.x,vars.player.y,vars.player.size,value.x * vars.map.tileW,value.y * vars.map.tileH,vars.map.tileW,vars.map.tileW )){
                itemsList.tileTypes[value.id].action(vars.player,value.x,value.y);
            }
        });

        //Inventory
        if(vars.events.keys.isInventoryReleased){
            vars.events.isInventoryOpen = !vars.events.isInventoryOpen;
        }

        //Magic menu toggle
        if (vars.events.keys.isMagicReleased) {
            vars.events.isSkillsOpen = !vars.events.isSkillsOpen;
            vars.upgradeMenu.isOpened = false;
        }

        //Skills upgrade menu toggle
        if (vars.events.keys.isSkillsReleased) {
            vars.upgradeMenu.isOpened = !vars.upgradeMenu.isOpened;
            vars.events.isSkillsOpen = false;

        }

        //Main actions of player like movement, attacking, interacting
        vars.player.mainActions(vars);
        //Collision with objects
        jQuery.each(vars.map.object,function (index,value) {
            if(value.type.floor === itemsList.floorTypes.solid){
                if(maint.circleToRectIntersection(vars.player.x,vars.player.y,vars.player.size - 5,value.col.x,value.col.y,value.col.w,value.col.h)){
                    if(vars.player.x + vars.player.size - 5 > value.col.x || vars.player.x - vars.player.size - 5 < value.col.x + value.col.w) {
                        vars.player.x += -(vars.player.velX * dt);
                    }if(vars.player.y + vars.player.size - 5 > value.col.y || vars.player.y - vars.player.size - 5 < value.col.y + value.col.h) {
                        vars.player.y += -(vars.player.velY * dt);
                    }
                }
            }
        });



        //Camera
        vars.camera.update();

        //Checking if player going out of bounds
        if(vars.player.x + vars.player.size >= 3100){
            vars.player.x = -vars.player.velX * maint.getSpeed(vars.player) * vars.dt + vars.player.x;
        }if(vars.player.x - vars.player.size <= 0){
            vars.player.x = -vars.player.velX * maint.getSpeed(vars.player) * vars.dt + vars.player.x;
        }if(vars.player.y + vars.player.size >= 3100){
            vars.player.y = -vars.player.velY * maint.getSpeed(vars.player) * vars.dt + vars.player.y;
        }if(vars.player.y - vars.player.size <= 0){
            vars.player.y = -vars.player.velY * maint.getSpeed(vars.player) * vars.dt + vars.player.y;
        }

        //Direction and actions with player attack box
        maint.getCordsOfPlayerAttackBox(vars.player,vars);
        vars.player.rangedAttackBox = maint.setPlayerRangedAttackBox(vars.player);

        //Constructing and saving attack box
        let count = 0;
        for (let i = 0; i < 3; i++) {
            for (let u = 0; u < 3; u++) {
                if (count === vars.player.attackBox){
                    vars.ctx.rect(vars.player.x - vars.player.size * 3 + u * vars.player.size * 3 / 2, vars.player.y - vars.player.size * 3 + i * vars.player.size * 3 / 2, vars.player.size * 3, vars.player.size * 3);

                    vars.playerAttackBox.x = vars.player.x - vars.player.size * 3 + u * vars.player.size * 3 / 2;
                    vars.playerAttackBox.y = vars.player.y - vars.player.size * 3 + i * vars.player.size * 3 / 2;
                    vars.playerAttackBox.w = vars.player.size * 3;
                    vars.playerAttackBox.h = vars.player.size * 3;
                }
                count++;
            }
        }

        //Checking player to items collision
        //Checking if player pressed pickup button or if is it turned on in config
        if(vars.events.keys.isInteractPressed || vars.config.isAutoPickup) {
            if (vars.map.items.length > 0 && vars.player.isDead === false) {
                for(let index = 0;index < vars.map.items.length;index++){
                    let value = vars.map.items[index];

                    if (maint.isReachable(value) && (maint.isReachable(itemsList.getItem(value.id).sprite)) && maint.isItemInRange(value, itemsList.getItem(value.id).sprite.w, itemsList.getItem(value.id).sprite.h, vars.camera) && maint.circleToRectIntersection(vars.player.x, vars.player.y, vars.player.size, value.x, value.y, itemsList.getItem(value.id).sprite.w, itemsList.getItem(value.id).sprite.h)) {
                        if (itemsList.getItem(value.id).type === "exp") {
                            vars.player.exp += value.count;
                            vars.map.items.splice(index, 1);
                            index--;
                        } else if (itemsList.getItem(value.id).type === "money") {
                            vars.player.money += value.count;
                            vars.map.items.splice(index, 1);
                            index--;
                        }else {
                            vars.player.inventory.addItem(value);
                            vars.map.items.splice(index,1);
                            index--;
                        }
                    }
                }
            }
        }

        //Deployables update
        for(let i = 0;i < vars.map.delpoyables.length;i++) {
            let value = vars.map.delpoyables[i];
            if(maint.isReachable(value.isMovingTowards) && value.isMovingTowards === true){
                value.x += Math.abs(value.vx) * maint.getVelocityTo(value.lastDest,value).x * dt;
                value.y += Math.abs(value.vy) * maint.getVelocityTo(value.lastDest,value).y * dt;
            }else{
                value.x += value.vx * dt;
                value.y += value.vy * dt;
            }

            if(maint.isReachable(maint.getProjectile(value.id,itemsList.projectileTypes).action)){
                itemsList.projectileTypes[value.id].action(value);
            }
            value.living += dt;

            if(value.living >= value.time){
                vars.map.delpoyables.splice(i,1);
                i--;
            }
        }

        //Checking if player dead first and then for interactions with NPCs
        if(vars.player.isDead === false) {
            let isChecked = false;
            jQuery.each(vars.npcs, function (ind, npc) {
                if (maint.isReachable(npc.players) && npc.players[vars.player.id].canGiveQuest === false && npc.players[vars.player.id].lastQuest + 600000 < vars.lastTime) {
                    npc.players[vars.player.id].canGiveQuest = true;
                    npc.players[vars.player.id].lastQuest = 0;
                }
                if (Math.sqrt(Math.pow(npc.x - vars.player.x, 2) + Math.pow(npc.y - vars.player.y, 2)) <= vars.player.vision && vars.events.keys.isInteractReleased) {
                    if (npc.npcType === "quest") {
                        //Checking if player have completed quests
                        jQuery.each(vars.player.inventory, function (index, value) {
                            if (maint.isReachable(value.object) && value.object.type === "quest" && maint.isReachable(value.object.item) && value.object.item !== undefined) {
                                jQuery.each(vars.player.inventory, function (index1, value1) {
                                    if (maint.isReachable(value1.object) && value1.object !== undefined && value.object.item.itemId === value1.object.itemId && value.object.item.name === value1.object.name) {
                                        //dropTreasure(value.object, player.x, player.y);
                                        maint.removeQuestItem(value1);
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
                            maint.genRandomQuest(npc, ind, (vars.player.x + npc.x) / 2, (vars.player.y + npc.y) / 2);
                            npc.players[player.id].canGiveQuest = false;
                            npc.players[player.id].lastQuest = lastTime;
                        }
                    } else if (npc.npcType === "shop" && !classes.isShopOpened(vars.menues)) {
                        jQuery.each(vars.menues,function (index,value) {
                            if(value.type === "shop"){
                                menues.splice(index,1);
                                index--;
                            }
                        });
                        vars.menues[vars.menues.length] = { "id":ind,"menu":new classes.Shop(npc.items,50,100,npc.shopType,npc.money,npc)};
                    }else if(classes.isShopOpened(vars.menues) && vars.events.keys.isInteractReleased){
                        jQuery.each(vars.menues,function (index,value) {
                            if(ind === value.id){
                                vars.menues.splice(index,1);
                                return true;
                            }
                        });
                    }
                }if(Math.sqrt(Math.pow(npc.x - vars.player.x, 2) + Math.pow(npc.y - vars.player.y, 2)) >= vars.player.vision){
                    if(npc.npcType === "shop"){
                        jQuery.each(vars.menues,function (index,value) {
                            if(ind === value.id){
                                vars.menues.splice(index,1);
                                return true;
                            }
                        });
                    }
                }
            });
        }

        //Spawners interaction and update
        jQuery.each(vars.map.spawners,function (index,value) {
            if(value.lastSpawned >= value.rate){
                let enemInRange = 0;
                jQuery.each(vars.map.enemies,function (indexE,valueE) {
                    if(value.enemy.id === valueE.id && Math.sqrt(Math.pow(valueE.x - value.x,2) + Math.pow(valueE.y - value.y,2)) <= value.range){
                        enemInRange++;
                    }
                });
                if(enemInRange < value.maxSpawned){
                    maint.genEnemy(value.enemy.id,Math.random() * value.range * maint.isIncOrDecr() + value.x,Math.random() * value.range * maint.isIncOrDecr() + value.y,vars);
                }
                value.lastSpawned = 0;
            }
            value.lastSpawned += dt;
        });

        //Enemy moving and collision with player
        jQuery.each(vars.map.enemies,function (index,value) {
            //value.move(dt);
            maint.getEnemy(value.id,itemsList.enemyTypes).move(dt,value);


            if(maint.cirToCirCol(value.x,value.y,maint.getEnemy(value.id,itemsList.enemyTypes).size,vars.player.x,vars.player.y,vars.player.size)){
                let midpoint = {"x":0,"y":0};
                let dist;

                dist = Math.sqrt(Math.pow((vars.player.x - value.x),2) + Math.pow((vars.player.y - value.y),2));

                midpoint.x = (value.x + vars.player.x) / 2;
                midpoint.y = (value.y + vars.player.y) / 2;

                value.x = midpoint.x + maint.getEnemy(value.id,itemsList.enemyTypes).size * (value.x - vars.player.x) / dist;
                value.y = midpoint.y + maint.getEnemy(value.id,itemsList.enemyTypes).size * (value.y - vars.player.y) / dist;


            }
            if(index < vars.map.enemies.length - 1){
                if(maint.cirToCirCol(value.x,value.y,value.size,vars.map.enemies[index + 1].x,vars.map.enemies[index + 1].y,vars.map.enemies[index + 1].size)) {
                    let value2 = vars.map.enemies[index + 1];
                    let midpoint = {"x":0,"y":0};
                    let dist;

                    dist = Math.sqrt(Math.pow((value2.x - value.x),2) + Math.pow((value2.y - value.y),2));

                    midpoint.x = (value.x + value2.x) / 2;
                    midpoint.y = (value.y + value2.y) / 2;

                    value.x = midpoint.x + maint.getEnemy(value.id,itemsList.enemyTypes).size * (value.x - value2.x) / dist;
                    value.y = midpoint.y + maint.getEnemy(value.id,itemsList.enemyTypes).size * (value.y - value2.y) / dist;

                    value2.x = midpoint.x + maint.getEnemy(value2.id,itemsList.enemyTypes).size * (value2.x - value.x) / dist;
                    value2.y = midpoint.y + maint.getEnemy(value2.id,itemsList.enemyTypes).size * (value2.y - value.y) / dist;
                }
            }

        });

        //Enemy attacking
        if(vars.player.isDead === false) {
            jQuery.each(vars.map.enemies, function (index, value) {
                value.timeFromLastAttack += dt;
                let enemyT = maint.getEnemy(value.id,itemsList.enemyTypes);
                if(value.timeFromLastAttack >= enemyT.cooldown && (Math.sqrt(Math.pow(vars.player.x - value.x, 2) + Math.pow(vars.player.y - value.y, 2)) <= enemyT.range)){
                if (maint.circleToRectIntersection(value.x, value.y, enemyT.size, vars.playerAttackBox.x, vars.playerAttackBox.y, vars.playerAttackBox.w, vars.playerAttackBox.h)) {
                        if (enemyT.dmg * 10 < maint.getFullDef(vars.player,vars)) {
                            maint.genFloatingNumber(vars.player.x, vars.player.y, "0", "rgba(255,0,0,1.0)", 15,vars);
                        }else if (enemyT.dmg > maint.getFullDef(vars.player,vars)) {
                            vars.player.hp -= (enemyT.dmg - maint.getFullDef(vars.player,vars));
                            maint.genFloatingNumber(vars.player.x, vars.player.y, (enemyT.dmg - maint.getFullDef(vars.player,vars)), "rgba(255,0,0,1.0)", 15,vars);
                        } else {
                            vars.player.hp -= 1;
                            maint.genFloatingNumber(vars.player.x, vars.player.y, 1, "rgba(255,0,0,1.0)", 15,vars);
                        }
                        value.timeFromLastAttack = 0;
                }else{
                    if (enemyT.dmg * 10 < maint.getDef(vars.player,vars)) {
                        maint.genFloatingNumber(vars.player.x, vars.player.y, "0", "rgba(255,0,0,1.0)", 15,vars);
                    }else if (enemyT.dmg > maint.getDef(vars.player,vars)) {
                        vars.player.hp -= (enemyT.dmg - maint.getDef(vars.player,vars));
                        maint.genFloatingNumber(vars.player.x, vars.player.y, (enemyT.dmg - maint.getDef(vars.player,vars)), "rgba(255,0,0,1.0)", 15,vars);
                    } else {
                        vars.player.hp -= 1;
                        maint.genFloatingNumber(vars.player.x, vars.player.y, 1, "rgba(255,0,0,1.0)", 15,vars);
                    }
                    value.timeFromLastAttack = 0;
                }
                }


            });
        }

        //Manipulations with floating numbers
        if(vars.config.isFloatingNumbers === true){
            for(let i = 0;i < vars.flotNumb.length;i++) {
                if(vars.flotNumb[i].deployed + 1000 <= vars.now){
                    vars.flotNumb.splice(i,i + 1);
                    i--;
                }else{
                    vars.flotNumb[i].y -= 100 * dt;
                    vars.flotNumb[i].x += 10 * Math.sin(2 * vars.flotNumb[i].y);
                }
            }
        }

    };

    func.uiActions = function(dt,vars,maint){
        if(vars.events.keys.isPauseReleased){
            vars.events.isPaused = !vars.events.isPaused;
        }
        if(vars.events.keys.isEscReleased) {
                vars.menu.isOpen = !vars.menu.isOpen;
            }

        let isChecked = false;
        let chosenSlot;
        //Working with inventory
        if(vars.events.isInventoryOpen){
            //Searching for pulled with mouse inventory or player equipment and shop interaction
            for(let index in vars.player.inventory.slots){
                index = parseInt(index);
                let value = vars.player.inventory.getSlot(index);
                //Checking if mouse pos is on some slot
                if(
                    maint.isReachable(value.object) &&
                    (vars.mouseX > value.x && vars.mouseX < value.x + vars.player.inventory.w &&
                    (vars.mouseY > value.y && vars.mouseY < value.y + vars.player.inventory.h))
                ){
                    let originalItem = itemsList.getItem(value.object);
                    if(vars.events.isLeftMousePressed && !vars.events.isMouseWithInv){
                        vars.player.inventory.chosen = value;
                        vars.events.isMouseWithInv = true;
                        vars.isChecked = true;
                        break
                    }/* checking if right mouse released and if shopkeeper accept that types if items*/else if(
                        vars.events.isRightMouseReleased && !vars.events.isMouseWithInv &&
                        classes.isShopOpened(vars.menues) &&
                        classes.findShop(vars.menues).menu.shopType.includes(originalItem.type,0)
                    ){
                        //Checking if trader can afford this
                        if(classes.findNpcByShopId(classes.findShop(vars.menues).id,vars.npcs).money - originalItem.cost >= 0) {
                            vars.player.money += itemsList.getItem(value.object.id).cost;
                            classes.findNpcByShopId(classes.findShop(vars.menues).id,vars.npcs).money -= originalItem.cost;
                            value.object = null;
                            return true;
                        }else{
                            maint.genTextAlert("This shopkeeper can't afford this","rgba(255,240,240,1.0)",vars);
                            return true;
                        }
                    }
                }
            }

            //If not found in inventory, than searching in equipment
            if(isChecked === false){
                for(let index in vars.player.inventory.equipment){
                    let value = vars.player.inventory.equipment[index];
                    if(maint.isReachable(value.object) &&
                        (vars.mouseX > value.object.x && vars.mouseX < value.object.x + itemsList.getItem(value.object.id).sprite.w) &&
                        (vars.mouseY > value.object.y &&
                            vars.mouseY < value.object.y + itemsList.getItem(value.object.id).sprite.h)
                        && vars.events.isMouseWithInv === false && vars.events.isLeftMousePressed === true
                    ){
                        vars.player.inventory.chosen = value.object;
                        vars.events.isMouseWithInv = true;
                        break
                    }
                }
            }
            isChecked = false;

            //Interacting if user already clicked on some item
            if(vars.events.isMouseWithInv && maint.isReachable(vars.player.inventory.chosen)){
                //Making buffer value of pulled object
                chosenSlot = vars.player.inventory.chosen;


                //Manipulations if mouse clicked up
                if(vars.events.isLeftMouseReleased || vars.events.isInventoryOpen === false){
                    //Trying to find another inventory or equipment tile to put the object
                    if(vars.events.isMouseWithInv) {
                        for(let index in vars.player.inventory.slots){
                            let value = vars.player.inventory.slots[index];

                            if (
                                (vars.mouseX > value.x && vars.mouseX < value.x + vars.player.inventory.w) &&
                                (vars.mouseY > value.y && vars.mouseY < value.y + vars.player.inventory.h)
                            ) {
                                vars.player.inventory.swapItems(value.inventoryID, chosenSlot.inventoryID);

                                vars.events.isMouseWithInv = false;
                                isChecked = true;
                                break
                            }
                        }
                        if(isChecked === false){
                            for(let index in vars.player.inventory.equipment){
                                let value = vars.player.inventory.equipment;

                                if(
                                    (vars.mouseX > value.x && vars.mouseX < value.x + vars.player.inventory.w) &&
                                    (vars.mouseY > value.y && vars.mouseY < value.y + vars.player.inventory.h)
                                ){
                                    vars.player.inventory.swapItems(value.inventoryID,chosenSlot.inventoryID);
                                    vars.events.isMouseWithInv = false;
                                    isChecked = true;
                                    break
                                }
                            }
                        }
                    }
                }

            }

            //Putting back the object if wrong pos
            if(isChecked === false && vars.events.isLeftMouseReleased && vars.events.isMouseWithInv === true){
                vars.events.isMouseWithInv = false;
            }

            //Checking if some interaction buttons pressed(works only when there is a chosen item)
            if(maint.isReachable(vars.player.inventory.chosen)) {
                //Checking if drop button clicked
                if (
                    vars.events.isLeftMouseReleased &&
                    ((vars.mouseX > vars.player.inventory.x + 216 && vars.mouseX < vars.player.inventory.x + 216 + 63) &&
                        (vars.mouseY > vars.player.inventory.y + 345 && vars.mouseY < vars.player.inventory.y + 345 + 30))
                ) {
                    if (maint.isReachable(vars.player.inventory.chosen)) {
                        vars.isChecked = false;
                        //By mathimethic(lul) getting cords for dropped item
                        let x2 = vars.player.x + Math.cos((-45 + (-vars.player.rangedAttackBox) * 45) * (Math.PI / 180)) * (vars.player.size - 40);
                        let y2 = vars.player.y - Math.sin((-45 + (-vars.player.rangedAttackBox) * 45) * (Math.PI / 180)) * (vars.player.size - 40);
                        let item = {
                            "w": itemsList.getItem(vars.player.inventory.chosen.object.id).sprite.w,
                            "h": itemsList.getItem(vars.player.inventory.chosen.object.id).sprite.h
                        };
                        //Creating("dropping item")
                        maint.createInTheWorld(x2 - item.w / 1.8, y2 - item.h / 1.8, vars.player.inventory.chosen.object.id, vars, {"amount": vars.player.inventory.chosen.object.amount});

                        //Removing it from inventory
                        vars.player.inventory.removeItem(vars.player.inventory.chosen.inventoryID);
                    }
                }

                //Checking if use button clicked
                if (
                    vars.events.isLeftMouseReleased &&
                    (vars.mouseX > vars.player.inventory.x + 216 && vars.mouseX < vars.player.inventory.x + 216 + 63 &&
                        vars.mouseY > vars.player.inventory.y + 312 && vars.mouseY < vars.player.inventory.y + 312 + 30)
                ) {
                    //Checking if item is consumable and if it have one time actions or duration effect
                    if (maint.isReachable(vars.player.inventory.chosen) &&
                        itemsList.getItem(vars.player.inventory.chosen.object.id).type === "consumable" &&
                        maint.isReachable(itemsList.getItem(vars.player.inventory.chosen.object.id).action)
                    ) {
                        let originalItem = itemsList.getItem(vars.player.chosen.object.id);
                        if (
                            originalItem.isTemp === true) {
                            vars.player.actions[vars.player.actions.length] = {
                                "action": originalItem.action,
                                "time": originalItem.time,
                                "deployed": vars.lastTime
                            };
                        } else {
                            originalItem.action(vars.player);
                        }
                        //Removing item
                        vars.player.inventory.removeItem(vars.player,inventory.chosen.inventoryID);
                    } /*Checking if item is book for learning skills and applying learn function*/else if (
                        maint.isReachable(vars.player.inventory.chosen) &&
                        itemsList.getItem(vars.player.inventory.chosen.object.id).type === "skillBook" &&
                        maint.isReachable(itemsList.getItem(vars.player.inventory.chosen.object.id).train(vars.player))
                    ){
                        itemsList.getItem(vars.player.inventory.chosen.object.id).train(player);
                    }
                }

            }

            //Checking if close button pressed
            if (
                vars.events.isLeftMouseReleased === true &&
                vars.mouseX > vars.player.inventory.x + 288 && vars.mouseX < vars.player.inventory.x + 288 + 60 &&
                vars.mouseY > vars.player.inventory.y + 12 && vars.mouseY < vars.player.inventory.y + 12 + 72
            ) {
                vars.events.isInventoryOpen = false;
            }

            //Checking for inventory moving //TODO: just. make. this.

        }

        //Menus updates
        jQuery.each(vars.menues,function (index,value) {
            if(value.menu.type === "shop"){
                value.menu.updateShop(vars);
            }
        });

        vars.menu.update();

        if(vars.events.isSkillsOpen){
            vars.skillsMenu.updateMenu();
        }

        //Checking for choosing items in hotbar
        if(maint.isReachable(maint.getClickedNumber(vars.numbers,vars)) && maint.getClickedNumber(vars.numbers,vars) > 0 && maint.getClickedNumber(vars.numbers,vars) < 7){
            if(maint.isReachable(maint.getClickedNumber(vars.numbers,vars)) && maint.getClickedNumber(vars.numbers,vars) === vars.player.hotbar.activeId){
                vars.player.hotbar.activeId = null;
            }
            vars.player.hotbar.activeId = maint.getClickedNumber(vars.numbers,vars) - 1;
        }

        //Checking for using active item in hotbar
        if(maint.isReachable(vars.player.hotbar.activeId) && maint.isReachable(vars.player.hotbar.items[vars.player.hotbar.activeId])){
            if(vars.player.hotbar.items[vars.player.hotbar.activeId].type === "skill" && maint.isReachable(maint.getSkill(vars.player.hotbar.items[vars.player.hotbar.activeId].id,itemsList.skillTypes).use)){
                maint.getSkill(vars.player.hotbar.items[vars.player.hotbar.activeId].id,itemsList.skillTypes).use(vars.player);
            }
        }


        //Interactions with menus

        //Player leveling
        if(vars.player.exp >= vars.player.expToNextLevel){
            vars.player.level++;
            vars.player.exp -= vars.player.expToNextLevel;
            vars.player.nextLevel();
            vars.player.upgradePoints++;
        }

        if(vars.upgradeMenu.isOpened){
            vars.upgradeMenu.menu.updateUpgradeMenu(vars);
        }



    };

    return func;
});