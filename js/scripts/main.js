define(["classes","jquery","map"],function (classes,jQuery,map) {
    let func = {};
    //Load
    func.load = function(vars){
        //vars.loaded = 0;

        vars.canvas = document.getElementById('canvas');
        vars.ctx = canvas.getContext('2d');
        vars.loaded++;
        //Loader
        loadImages([
            "acceptButtonSprite",
            "shopSprite",
            "alertSprite",
            "tilesSprite",
            "bookSprites",
            "skillsSprite",
            "expSprite",
            "moneySprites",
            "consumablesSprite",
            "swordsSpriteSheet",
            "inventorySprite",
            "armorSprites",
            "playerUISprite",
            "shieldsSprite",
            "questItemsSprite",
            "scrollSprite",
            "playerHotbarSprite",
            "skillsMenuSprite",
            "upgradeMenuSprite",
            "bowsSprites",
            "arrowsSprite",
            "radiosSprite",
            "configsSprite",
            "menuSprite",
            "staffsSprite"],function () {
            vars.isLoaded = true;
        },vars);
        let checkExist = setInterval(function() {
            if (vars.isLoaded) {
                clearInterval(checkExist);
            }
        }, 100);
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

        //Creating arrays and objects
        let itemArea;
        itemArea = maint.makeSpriteSheetArayInLine(6,vars.swordsSpriteSheet);
        //Swords array
        for(let i = 0;i < 6;i++){
            vars.swords[i] = {
                "x":i * itemArea[i].w,
                "y":0,
                "dmg":i * 4,
                "isMelee":true,
                "px":i * itemArea[i].pw,
                "py":0,
                "pw":itemArea[i].pw,
                "ph":itemArea[i].h,
                "w":itemArea[i].pw/2,
                "h":itemArea[i].h/2,
                "img":vars.swordsSpriteSheet,
                "type":"weapon"
            };
        }
        //Bows
        itemArea = maint.makeSpriteSheetArayInLine(15,vars.bowsSprites);
        for(let i = 0;i < 5;i++){
            vars.bows[i] = {
                "img":vars.armorSprites,
                "px":itemArea[i].px,
                "py":itemArea[i].py,
                "pw":itemArea[i].pw,
                "ph":itemArea[i].ph,
                "type":"bow"
            };
        }
        //Making armors
        itemArea = maint.makeSpriteSheetArayInLine(10,vars.armorSprites);
        //Helmets array
        for(let i = 0;i < 5;i++){
            vars.helmets[i] = {
                "img":vars.armorSprites,
                "px":itemArea[i].px,
                "py":itemArea[i].py,
                "pw":itemArea[i].pw,
                "ph":itemArea[i].ph,
                "type":"helmet"
            };
        }
        //Chestplates array
        for(let i = 5;i < 9;i++){
            vars.chestPlates[i - 5] = {
                "img":itemArea[i].img,
                "px":itemArea[i].px,
                "py":itemArea[i].py,
                "pw":itemArea[i].pw,
                "ph":itemArea[i].ph,
                "type":"armor"
            };
        }
        //Shields array
        itemArea = maint.makeSpriteSheetArayInLine(10,vars.shieldsSprite);
        for(let i = 0;i < itemArea.length;i++){
            vars.shields[i] = {
                "img":vars.shieldsSprite,
                "px":itemArea[i].px,
                "py":itemArea[i].py,
                "pw":itemArea[i].pw,
                "ph":itemArea[i].ph,
                "type":"shield"
            };
        }
        //Quest items array
        itemArea = maint.makeSpriteSheetArayInLine(6,vars.questItemsSprite);
        for(let i = 0;i < 6;i++){
            vars.cQuestItems[i] = {
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
        itemArea = maint.makeSpriteSheetArayInLine(32,vars.consumablesSprite);
        for(let i = 0;i < 32;i++){
            vars.consumables[i] = {
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
        itemArea = maint.makeSpriteSheetArayInLine(25,vars.moneySprites);
        for(let i = 0;i < itemArea.length;i++){
            vars.money[i] = {
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
        //Arrows array
        itemArea = maint.makeSpriteSheetArayInLine(15,vars.arrowsSprite);
        for(let i = 0;i < itemArea.length;i++){
            vars.arrows[i] = {
                "img":itemArea[i].img,
                "px":itemArea[i].px,
                "py":itemArea[i].py,
                "pw":itemArea[i].pw,
                "ph":itemArea[i].ph,
                "w":itemArea[i].pw,
                "h":itemArea[i].ph,
                "type":"ammo",
                "count":0
            };
        }
        //Staffs
        itemArea = maint.makeSpriteSheetArayInLine(15,vars.staffsSprite);
        for(let i = 0;i < itemArea.length;i++){
            vars.staffs[i] = {
                "img":itemArea[i].img,
                "px":itemArea[i].px,
                "py":itemArea[i].py,
                "pw":itemArea[i].pw,
                "ph":itemArea[i].ph,
                "w":itemArea[i].pw,
                "h":itemArea[i].ph,
                "type":"staff",
                "count":0
            };
        }



        //Enemy moving functions
        let zombieMoving = function (dt,zombie) {
            //if(events.isPlayerMoving || events.isShouldMoveEnemies || !events.isPlayerStopped){

            zombie.velX = 0;
            zombie.velY = 0;
            if(vars.player.isDead === false && Math.sqrt(Math.pow(vars.player.x - zombie.x,2) + Math.pow(vars.player.y - zombie.y,2)) <= this.vision && zombie.hp > 0){

                zombie.velX = maint.getVelocityTo(vars.player,zombie).x * zombie.velocity;
                zombie.velY = maint.getVelocityTo(vars.player,zombie).y * zombie.velocity;

                zombie.x += zombie.velX * dt;
                zombie.y += zombie.velY * dt;
                vars.events.isShouldMoveEnemies = true;
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
            if(vars.player.isDead === false && Math.sqrt(Math.pow(vars.player.x - knight.x,2) + Math.pow(vars.player.y - knight.y,2)) <= this.vision && knight.hp > 0){

                knight.velX = maint.getVelocityTo(vars.player,knight).x * knight.velocity;
                knight.velY = maint.getVelocityTo(vars.player,knight).y * knight.velocity;

                knight.x += knight.velX * dt;
                knight.y += knight.velY * dt;
                //events.isShouldMoveEnemies = true;
            }else{
                if(knight.startX === null && knight.startY === null){

                    knight.startX = this.x;
                    knight.startY = this.y;
                    knight.isMoving = maint.getRandomTOrF() === true ? 1 : 2;
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

        //Creating all typed objects

        //Projectiles
        vars.projectileTypes = [
            {
                "action":function (delp) {
                        jQuery.each(vars.map.enemies,function (index,value) {
                            if(maint.cirToCirCol(delp.x,delp.y,maint.getProjectile(delp.id,vars.projectileTypes).size,value.x,value.y,maint.getEnemy(value.id,vars.enemyTypes).size)){
                                value.hp -= 10;
                                if(value.hp <= 0){value.isDead = true;}
                                delp.living = delp.time;
                                return false;
                            }
                        });
                },
                "type":"circle",
                "size":10,
                "time":5
            },
            {
                "action":function (delp) {
                    jQuery.each(vars.map.enemies,function (index,value) {
                        if(maint.cirToCirCol(delp.x,delp.y,maint.getProjectile(delp.id,vars.projectileTypes).size,value.x,value.y,maint.getEnemy(value.id,vars.enemyTypes).size)){
                            value.hp -= 20;
                            if(value.hp <= 0){value.isDead = true;}
                            delp.living = delp.time;
                            return false;
                        }
                    });
                },
                "type":"circle",
                "size":5,
                "time":10,
                "color":"rgba(0,255,0,1.0)"
            }
        ];
        //Tiles
        vars.floorTypes = {
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
        vars.tileTypes = [
            {},
            { "id":1,"colour":"#1da413", "floor":vars.floorTypes.ground,"sprite":new classes.Sprite([{"px":0,"py":0,"pw":16,"ph":16,"w":32,"h":32}],vars.tilesSprite),"action":function (user,x,y) {
                    maint.minusSpeed(user,0.4);
                }},
            { "id":2,"colour":"#d6d117", "floor":vars.floorTypes.ground,"sprite":new classes.Sprite([{"px":16,"py":0,"pw":16,"ph":16,"w":32,"h":32}],vars.tilesSprite),"action":function (user,x,y) {
                    maint.minusSpeed(user,0.4);
                }},
            { "id":3,"colour":"#d6d117", "floor":vars.floorTypes.path,"sprite":new classes.Sprite([{"px":32,"py":0,"pw":16,"ph":16,"w":32,"h":32}],vars.tilesSprite),"action":function (user,x,y) {
                    user.speed += 0.4;
                }},
            { "id":4,"colour":"#d6d117", "floor":vars.floorTypes.path,"sprite":new classes.Sprite([{"px":48,"py":0,"pw":16,"ph":16,"w":32,"h":32}],vars.tilesSprite),"action":function (user,x,y) {
                    user.speed += 0.4;
                }},
            { "id":5,"colour":"#d6d117", "floor":vars.floorTypes.path,"sprite":new classes.Sprite([{"px":0,"py":16,"pw":16,"ph":16,"w":32,"h":32}],vars.tilesSprite),"action":function (user,x,y) {
                    user.speed += 0.4;
                }},
            { "id":6,"colour":"#d6d117", "floor":vars.floorTypes.path,"sprite":new classes.Sprite([{"px":16,"py":16,"pw":16,"ph":16,"w":32,"h":32}],vars.tilesSprite),"action":function (user,x,y) {
                    user.speed += 0.4;
                }},
            { "id":7,"colour":"#d6d117", "floor":vars.floorTypes.path,"sprite":new classes.Sprite([{"px":32,"py":16,"pw":16,"ph":16,"w":32,"h":32}],vars.tilesSprite),"action":function (user,x,y) {
                    user.speed += 0.4;
                }},
            { "id":8,"colour":"#d6d117", "floor":vars.floorTypes.path,"sprite":new classes.Sprite([{"px":48,"py":16,"pw":16,"ph":16,"w":32,"h":32}],vars.tilesSprite),"action":function (user,x,y) {
                    user.speed += 0.4;
                }},
            { "id":9,"colour":"#d6d117", "floor":vars.floorTypes.bricksPath,"sprite":new classes.Sprite([{"px":0,"py":32,"pw":16,"ph":16,"w":32,"h":32}],vars.tilesSprite),"action":function (user,x,y) {
                    user.speed += 0.8;
                }},
            { "id":10,"colour":"#d6d117", "floor":vars.floorTypes.ice,"sprite":new classes.Sprite([{"px":16,"py":32,"pw":16,"ph":16,"w":32,"h":32}],vars.tilesSprite),"action":function (user,x,y) {
                    user.speed += 0.1;
                    /*if(user.x + user.size > x * vars.map.tileW  || user.x - user.size < x * vars.map.tileW + vars.map.tileW) {
                        user.x += -(user.velX * ((vars.now - vars.lastTime) / 1000)) * maint.getSpeed(user);
                    }if(user.y + user.size > y * vars.map.tileH || user.y - user.size < y * vars.map.tileH + vars.map.tileH) {
                        user.y += -(user.velY * ((vars.now - vars.lastTime) / 1000)) * maint.getSpeed(user);
                    }*/
                }},
            { "id":11,"colour":"#d6d117", "floor":vars.floorTypes.ground,"sprite":new classes.Sprite([{"px":32,"py":32,"pw":16,"ph":16,"w":32,"h":32}],vars.tilesSprite),"action":function (user,x,y) {
                    user.speed += 0.7;
                }},
            { "id":12,"colour":"#d6d117", "floor":vars.floorTypes.portal,"sprite":new classes.Sprite([{"px":48,"py":32,"pw":16,"ph":16,"w":32,"h":32}],vars.tilesSprite),"action":function (user,x,y) {

                }},
            { "id":13,"colour":"#d6d117", "floor":vars.floorTypes.bushes,"sprite":new classes.Sprite([{"px":0,"py":48,"pw":16,"ph":16,"w":32,"h":32}],vars.tilesSprite),"action":function (user,x,y) {
                    maint.minusSpeed(user,0.2);
                }},
            { "id":14,"colour":"#d6d117", "floor":vars.floorTypes.solid,"sprite":new classes.Sprite([{"px":16,"py":48,"pw":16,"ph":16,"w":32,"h":32}],vars.tilesSprite),"action":function (user,x,y) {
                    if(user.x + user.size > x * vars.map.tileW  || user.x - user.size < x * vars.map.tileW + vars.map.tileW) {
                        user.x += -(user.velX * ((vars.now - vars.lastTime) / 1000)) * maint.getSpeed(user);
                    }if(user.y + user.size > y * vars.map.tileH || user.y - user.size < y * vars.map.tileH + vars.map.tileH) {
                        user.y += -(user.velY * ((vars.now - vars.lastTime) / 1000)) * maint.getSpeed(user);
                    }
                }},
            { "id":15,"colour":"#d6d117", "floor":vars.floorTypes.forest,"sprite":new classes.Sprite([{"px":32,"py":48,"pw":16,"ph":16,"w":32,"h":32}],vars.tilesSprite),"action":function (user,x,y) {
                    if(maint.isReachable(user.mount) && user.mount.type === "fly"){
                        user.speed += 0;
                    }else{
                        if(user.x + user.size > x * vars.map.tileW || user.x - user.size < x * vars.map.tileW - vars.map.tileW) {
                            user.x += -(user.velX * ((vars.now - vars.lastTime) / 1000) * maint.getSpeed(user));
                        }if(user.y + user.size > y * vars.map.tileH || user.y - user.size < y * vars.map.tileH - vars.map.tileH) {
                            user.y += -(user.velY * ((vars.now - vars.lastTime) / 1000) * maint.getSpeed(user));
                        }
                    }
                }},
            { "id":16,"colour":"#d6d117", "floor":vars.floorTypes.ground,"sprite":new classes.Sprite([{"px":48,"py":48,"pw":16,"ph":16,"w":32,"h":32}],vars.tilesSprite),"action":function (user,x,y) {
                    user.speed += 0.7;
                }},
            { "id":17,"colour":"#d6d117", "floor":vars.floorTypes.hills,"sprite":new classes.Sprite([{"px":0,"py":64,"pw":16,"ph":16,"w":32,"h":32}],vars.tilesSprite),"action":function (user,x,y) {
                    if(maint.isReachable(user.mount) && user.mount.type === "fly"){
                        user.speed += 0;
                    }else{
                        maint.minusSpeed(user,0.3);
                    }
                }},
            { "id":18,"colour":"#d6d117", "floor":vars.floorTypes.water,"sprite":new classes.Sprite([{"px":16,"py":64,"pw":16,"ph":16,"w":32,"h":32}],vars.tilesSprite),"action":function (user,x,y) {
                    if(maint.isReachable(user.mount) && user.mount.type === "fly"){
                    }else if(maint.isReachable(user.mount) && user.mount.type === "swim"){
                        user.speed -= 0.8;
                    }else{
                        user.speed -= 0.2;
                    }
                }},
        ];
        //Skills
        vars.skillTypes = [
            new classes.Skill("Firebolt","Fires a firebolt in your mouse pos.Cost 5 mana",0.5,function (user) {
                if(vars.events.isLeftMouseReleased === true){
                    if(this.lastUsed + this.cooldown * 1000 < vars.lastTime && user.mana - 5 >= 0){
                        /*var v = {"x":vars.mouseX + vars.camera.xView,"y":vars.mouseY + vars.camera.yView};
                        vars.map.delpoyables[vars.map.delpoyables.length] = new classes.Delpoyable(user.x,user.y,maint.getVelocityTo(v,user).x * 50,maint.getVelocityTo(v,user).y * 50,null,"circle",5,10,function () {
                            var temp = false;
                            var delp = this;
                            jQuery.each(vars.map.enemies,function (index,value) {
                                if(maint.cirToCirCol(delp.x,delp.y,delp.size,value.x,value.y,value.size)){
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
                        vars.map.delpoyables[vars.map.delpoyables.length - 1].moveTowards(vars.mouseX + vars.camera.xView,vars.mouseY + vars.camera.yView);*/
                        classes.genProjectile(vars,0,user.x,user.y,50,50,true,vars.mouseX + vars.camera.xView,vars.mouseY + vars.camera.yView);
                        user.mana -= 5;
                    }else{
                        if(this.lastUsed + this.cooldown * 1000 < vars.lastTime){
                            maint.genTextAlert("Wait some time to use this ability again","rgba(200,0,0,1.0)",vars);
                        }if(user.mana - 5 >= 0){
                            maint.genTextAlert("You don't have enough mana","rgba(200,0,0,1.0)",vars);
                        }
                    }
                    this.lastUsed = vars.lastTime;
                }

            },new classes.Sprite([{"px":46,"py":0,"pw":46,"ph":46,"w":67,"h":67}],vars.skillsSprite))
        ];
        vars.staffSkills = [
            new classes.Skill("Firebolt","Fires a firebolt in your mouse pos.Cost 5 mana",0.5,function (user) {
                if(vars.events.isLeftMouseReleased === true){
                        classes.genProjectile(vars,0,user.x,user.y,100,100,true,vars.mouseX + vars.camera.xView,vars.mouseY + vars.camera.yView,true,vars.mouseX,vars.mouseY);
                        return true;
                }

            },new classes.Sprite([{"px":46,"py":0,"pw":46,"ph":46,"w":67,"h":67}],vars.skillsSprite))
        ];
        //Items
        vars.itemTypes = [
            /*0*/{
                "name": "Leather armor",
                "sprite":new classes.Sprite([{"px":vars.chestPlates[0].px,"py":vars.chestPlates[0].py,"pw":vars.chestPlates[0].pw,"ph":vars.chestPlates[0].ph,"w":vars.chestPlates[0].pw,"h":vars.chestPlates[0].ph}],vars.chestPlates[0].img),
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
                "sprite":new classes.Sprite([{"px":vars.chestPlates[0].px,"py":vars.chestPlates[0].py,"pw":vars.chestPlates[0].pw,"ph":vars.chestPlates[0].ph,"w":vars.chestPlates[0].pw,"h":vars.chestPlates[0].ph}],vars.chestPlates[0].img),
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
                "sprite":new classes.Sprite([{"px":vars.chestPlates[0].px,"py":vars.chestPlates[0].py,"pw":vars.chestPlates[0].pw,"ph":vars.chestPlates[0].ph,"w":vars.chestPlates[0].pw, "h":vars.chestPlates[0].ph}],vars.chestPlates[0].img),
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
                "sprite":new classes.Sprite([{"px":vars.consumables[0].px,"py":vars.consumables[0].py,"pw":vars.consumables[0].pw,"ph":vars.consumables[0].ph,"w":vars.consumables[0].pw, "h":vars.consumables[0].ph,}],vars.consumables[0].img),
                "x":0,
                "y":0,
                "type":"consumable",
                "action":function (user) {
                    maint.restoreHealth(user,20)
                },
                "actions":"Restores health by 20 points",
                "cost":5,
                "description":"Simple heal potion, it heals for 20 point and cost 5 coins.",
                "id":3
            },
            /*4*/{
                "name": "Simple Health regen potion",
                "sprite":new classes.Sprite([{"px":vars.consumables[8].px,"py":vars.consumables[8].py,"pw":vars.consumables[8].pw,"ph":vars.consumables[8].ph,"w":vars.consumables[8].pw,"h":vars.consumables[8].ph}],vars.consumables[8].img),
                "x":0,
                "y":0,
                "type":"consumable",
                "action":function (user) {
                    maint.restoreHealth(user,0.4)
                },
                "actions":"Regen health for 5 sec",
                "cost":10,
                "time":5000,
                "isTemp":true,
                "description":"Simple regen potion, it heals for 40 point for 10 sec and cost 10 coins.",
                "id":4
            },
            /*5*/{
                "name": "Wrath bringer",
                "sprite":new classes.Sprite([{"px":vars.swords[5].px,"py":vars.swords[5].py,"pw":vars.swords[5].pw, "ph":vars.swords[5].ph,"w":vars.swords[5].pw / 2, "h":vars.swords[5].ph / 2,}],vars.swords[5].img),
                "x":0,
                "y":0,
                "type":"weapon",
                "weaponType":"melee",
                "cooldown":0.4,
                "dmg":4,
                "dmgType":"area",
                "isMelee":true,
                "cost":10,
                "description":"Thats wrath bringer, it has 4 area damage and cost 10 coins.",

            },
            /*6*/{
                "name": "Wrath bringer",
                "sprite":new classes.Sprite([{"px":vars.swords[5].px,"py":vars.swords[5].py,"pw":vars.swords[5].pw,"ph":vars.swords[5].ph,"w":vars.swords[5].pw / 2,"h":vars.swords[5].ph / 2,}],vars.swords[5].img),
                "x":20,
                "y":100,
                "type":"weapon",
                "weaponType":"melee",
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
                    if(maint.isReachable(user.magicSkill) && user.magicSkill >= 1){
                        if(this.skill.learn(user)){
                            user.skills[user.skills.length] = this.skill;
                            maint.genTextAlert("Learned firebolt","rgba(255,200,200,1.0)",vars);
                        }
                    }else{
                        maint.genTextAlert("Your magic skill is too low","rgba(255,200,200,1.0)",vars);
                    }
                },
                "skill":vars.skillTypes[0],
                "sprite":new classes.Sprite([{"px":36,"py":64,"pw":24,"ph":32,"w":24,"h":32}],vars.bookSprites),
                "x":0,
                "y":0,
                "cost":100,
                "description":"Its book of fire.Its cost 100 coins."
            },
            /*8*/{
                "name": "Chainmall armor",
                "sprite":new classes.Sprite([{"px":vars.chestPlates[1].px,"py":vars.chestPlates[1].py,"pw":vars.chestPlates[1].pw,"ph":vars.chestPlates[1].ph,"w":vars.chestPlates[1].pw, "h":vars.chestPlates[1].ph}],vars.chestPlates[1].img),
                "x":0,
                "y":0,
                "def":5,
                "type":"armor",
                "cost":25,
                "description":'Its chainmall armor,it has 5 defence and cost 5 coins.'
            },
            /*9*/{"sprite":new classes.Sprite([
                {
                    "w":32,
                    "h":32,
                    "pw":32,
                    "ph":32,
                    "px":0,
                    "py":0
                }],vars.expSprite),
                "x":0,
                "y":0,
                "name":"exp",
                "type":"exp",
                "count":0
            },
            /*10*/{
                "sprite":new classes.Sprite([
                    {
                        "w":32,
                        "h":32,
                        "pw":32,
                        "ph":32,
                        "px":0,
                        "py":0
                    }],vars.money[2].img),
                "x":0,
                "y":0,
                "name":"money",
                "type":"money",
                "count":0,
            },
            /*11*/{
                "dmg": 4,
                "cooldown": 0.5,
                "dmgType":"point",
                "name":"hands",
                "type":"weapon",
                "weaponType":"melee"
            },
            /*12*/{
                "sprite":new classes.Sprite([
                    {
                        "px":vars.bows[0].px,
                        "py":vars.bows[0].py,
                        "pw":vars.bows[0].pw,
                        "ph":vars.bows[0].ph,
                        "w":vars.bows[0].pw,
                        "h":vars.bows[0].ph
                    }],vars.bowsSprites),
                "x":0,
                "y":0,
                "dmg": 20,
                "cooldown": 1.4,
                "dmgType":"point",
                "name":"Elven bow",
                "type":"weapon",
                "weaponType":"ranged",
                "cost":20,
                "description":"It's elven bow it use elven arrows it cost 20 coins and deals 20 damage.It has 1.4 seconds for cooldown."
            },
            /*13*/{
                "sprite":new classes.Sprite([
                    {
                        "px":vars.arrows[0].px,
                        "py":vars.arrows[0].py,
                        "pw":vars.arrows[0].pw,
                        "ph":vars.arrows[0].ph,
                        "w":vars.arrows[0].pw,
                        "h":vars.arrows[0].ph
                    }],vars.arrowsSprite),
                "x":0,
                "y":0,
                "dmg": 20,
                "name":"Elven arrow",
                "type":"ammo",
                "ammoFor":12,
                "meta":{"amount":5},
                "cost":15,
                "description":"It's elven arrow for elven bow it cost 15 coins per 5 arrows and deals 20 damage."
            },
            /*14*/{
                "sprite":new classes.Sprite([
                    {
                        "px":vars.shields[0].px,
                        "py":vars.shields[0].py,
                        "pw":vars.shields[0].pw,
                        "ph":vars.shields[0].ph,
                        "w":vars.shields[0].pw,
                        "h":vars.shields[0].ph
                    }],vars.shieldsSprite),
                "x":0,
                "y":0,
                "def": 10,
                "name":"Righteous shield",
                "type":"shield",
                "cost":50,
                "spd":-0.3,
                "description":"It's righteous shield it decreases your speed by 0.3 cost 50 and has 10 shield damage."
            },
            /*15*/{
                "sprite":new classes.Sprite([
                    {
                        "px":vars.staffs[0].px,
                        "py":vars.staffs[0].py,
                        "pw":vars.staffs[0].pw,
                        "ph":vars.staffs[0].ph,
                        "w":vars.staffs[0].pw,
                        "h":vars.staffs[0].ph
                    }],vars.staffsSprite),
                "x":0,
                "y":0,
                "name":"Staff of fire",
                "weaponType":"staff",
                "type":"weapon",
                "cost":100,
                "spd":0.2,
                "action":vars.staffSkills[0].action,
                "cooldown":2,
                "description":"Staff of fire cost 100 coins it's add 0.2 points to your speed and has 2s for cooldown, it deals 10 damage."



            }
        ];
        //Enemies
        vars.enemyTypes = [
            /*0*/{
                "name":"knight",
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
                "commonDrops":[
                    vars.itemTypes[14]
                ],
                "rareDrops":[
                    vars.itemTypes[14]
                ],
                "epicDrops":[
                    vars.itemTypes[14]
                ],
                "legendaryDrops":[
                    vars.itemTypes[14]
                ],
                "color":"rgba(30,30,30,1.0)",
                "exp":100,
                "randomSpeed":true,
                "rndSpdStart":10,
                "rndSpdFinish":200,
                "equipment":[]
            },
            /*1*/{
                "name":"zombie",
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
                    vars.itemTypes[0],
                    vars.itemTypes[12]

                ],
                "rareDrops":[
                    vars.itemTypes[1],
                    vars.itemTypes[3],
                    vars.itemTypes[12],
                    vars.itemTypes[13]
                ],
                "epicDrops":[
                    vars.itemTypes[2],
                    vars.itemTypes[4],
                    vars.itemTypes[12],
                    vars.itemTypes[13]
                ],
                "legendaryDrops":[
                    vars.itemTypes[5],
                    vars.itemTypes[13]
                ],
                "color":"rgba(0,255,0,1.0)",
                "exp":15,
                "randomSpeed":true,
                "rndSpdStart":10,
                "rndSpdFinish":100,
                "equipment":[]
            }
        ];
        //Quest
        vars.questTypes = [
            new classes.Quest("Killing zombies","Kill 10 zombies and you will earn 50 coins",[{"id":10,"meta":{"count":50}}],function (user) {
                if(!this.isFinished){
                    if(!maint.isReachable(user.zombieCounter)){
                        user.zombieCounter = 0;
                    }
                    if(user.zombieCounter >= 10){
                        user.money += 50;
                        user.zombieCounter = 0;
                        user.zombieCounter = undefined;
                        return true;
                    }
                }
            })
        ];

        //Setting ids:

        //For items
        for(let i = 0; i < vars.itemTypes.length;i++){
            vars.itemTypes[i].id = i;
        }
        //Tiles
        for(let i = 0; i < vars.tileTypes.length;i++){
            vars.tileTypes[i].id = i;
        }
        //Enemies
        for(let i = 0; i < vars.enemyTypes.length;i++){
            vars.enemyTypes[i].id = i;
        }
        //Projectiles
        for(let i = 0; i < vars.projectileTypes.length;i++){
            vars.projectileTypes[i].id = i;
        }
        //Skills
        for(let i = 0; i < vars.skillTypes.length;i++){
            vars.skillTypes[i].id = i;
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
                "img":vars.chestPlates[3].img,
                "px":vars.chestPlates[3].px,
                "py":vars.chestPlates[3].py,
                "pw":vars.chestPlates[3].pw,
                "ph":vars.chestPlates[3].ph,
                "x":0,
                "y":0,
                "w":vars.chestPlates[3].pw,
                "h":vars.chestPlates[3].ph,
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
                "img":vars.chestPlates[3].img,
                "px":vars.chestPlates[3].px,
                "py":vars.chestPlates[3].py,
                "pw":vars.chestPlates[3].pw,
                "ph":vars.chestPlates[3].ph,
                "x":0,
                "y":0,
                "w":vars.chestPlates[3].pw,
                "h":vars.chestPlates[3].ph,
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
            vars.map.spawners[0].enemy = jQuery.extend(true, {}, vars.enemyTypes[1]);
            vars.map.spawners[0].x = 1000;
            vars.map.spawners[0].y = 1000;

            vars.map.spawners[1] = jQuery.extend(true, {}, vars.sSpawner);
            vars.map.spawners[1].enemy = jQuery.extend(true, {}, vars.enemyTypes[0]);
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
            for(var x = 0;x < vars.map.w;x++) {
                if(maint.isTileInRange(vars.map.map[maint.toIndex(x, y, vars.map)],vars.camera,vars.map.tileW,vars.map.tileH)){
                    vars.tileTypes[vars.map.map[maint.toIndex(x, y, vars.map)].id].sprite.draw(vars.gameTime, vars.ctx, x * vars.map.tileW - vars.camera.xView, y * vars.map.tileH - vars.camera.yView);
                    count++;
                }
            }
        }

        //Objects
        for(let i = 0;i < vars.map.objects.length;i++){

        }

        //Items
        for(let i = 0;i < vars.map.items.length;i++) {
            if (maint.isReachable(vars.map.items[i]) && maint.isReachable(maint.getItem(vars.map.items[i].id,vars)) && maint.isItemInRange(vars.map.items[i],maint.getItem(vars.map.items[i].id,vars).sprite.w,maint.getItem(vars.map.items[i].id,vars).sprite.h,vars.camera)){
                //console.log(map.items[i]);
                maint.getItem(vars.map.items[i].id,vars).sprite.draw(vars.gameTime,vars.ctx, vars.map.items[i].x - vars.camera.xView, vars.map.items[i].y - vars.camera.yView/*,map.items[i].sprite.w,map.items[i].sprite.h*/);
            }
        }

        //Deployables
        for(let i = 0;i < vars.map.delpoyables.length;i++){
            //map.delpoyables[i].sprite.draw(gameTime,map.delpoyables[i].x - camera.xView,map.delpoyables[i].y - camera.yView,map.delpoyables[i].sprite.w,map.delpoyables[i].sprite.h);
            if(maint.getProjectile(vars.map.delpoyables[i].id,vars.projectileTypes).type === "circle"){
                vars.ctx.fillStyle = maint.getProjectile(vars.map.delpoyables[i].id,vars.projectileTypes).color;
                vars.ctx.beginPath();
                vars.ctx.arc(vars.map.delpoyables[i].x - vars.camera.xView,vars.map.delpoyables[i].y - vars.camera.yView,maint.getProjectile(vars.map.delpoyables[i].id,vars.projectileTypes).size,0,360,false);
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
                vars.ctx.fillStyle = maint.getEnemy(value.id,vars.enemyTypes).color;
                vars.ctx.beginPath();
                vars.ctx.arc(value.x - vars.camera.xView,value.y - vars.camera.yView,maint.getEnemy(value.id,vars.enemyTypes).size,0,360,false);
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
                vars.ctx.fillText(maint.getEnemy(value.id,vars.enemyTypes).name,value.x - maint.getEnemy(value.id,vars.enemyTypes).size - vars.camera.xView,value.y - maint.getEnemy(value.id,vars.enemyTypes).size - 20 - vars.camera.yView);
                vars.ctx.fillStyle = "rgba(155,10,10,1.0)";
                vars.ctx.fillRect(value.x - maint.getEnemy(value.id,vars.enemyTypes).size - 1 - vars.camera.xView,value.y - maint.getEnemy(value.id,vars.enemyTypes).size - 15 - vars.camera.yView,maint.getEnemy(value.id,vars.enemyTypes).size * 2.2,10);
                vars.ctx.fillStyle = "rgba(255,10,10,1.0)";
                vars.ctx.fillRect(value.x - maint.getEnemy(value.id,vars.enemyTypes).size - 1 - vars.camera.xView,value.y - maint.getEnemy(value.id,vars.enemyTypes).size - 15 - vars.camera.yView,maint.getEnemy(value.id,vars.enemyTypes).size * 2.2 * (value.hp / value.maxHp),10);
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
                maint.getSkill(vars.player.hotbar.items[i].id,vars.skillTypes).sprite.drawWH(vars.gameTime,vars.ctx,vars.playerHotbar.x + i * 54 + 21, vars.playerHotbar.y + 4, 41, 41);
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
                vars.tileTypes[value.id].action(vars.player,value.x,value.y);
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
            if(value.type.floor === vars.floorTypes.solid){
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

                    if (maint.isReachable(value) && (maint.isReachable(maint.getItem(value.id, vars).sprite)) && maint.isItemInRange(value, maint.getItem(value.id, vars).sprite.w, maint.getItem(value.id, vars).sprite.h, vars.camera) && maint.circleToRectIntersection(vars.player.x, vars.player.y, vars.player.size, value.x, value.y, maint.getItem(value.id, vars).sprite.w, maint.getItem(value.id, vars).sprite.h)) {
                        if (maint.getItem(value.id, vars).type === "exp") {
                            vars.player.exp += value.count;
                            vars.map.items.splice(index, 1);
                            index--;
                        } else if (maint.getItem(value.id, vars).type === "money") {
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

            if(maint.isReachable(maint.getProjectile(value.id,vars.projectileTypes).action)){
                vars.projectileTypes[value.id].action(value);
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
            maint.getEnemy(value.id,vars.enemyTypes).move(dt,value);


            if(maint.cirToCirCol(value.x,value.y,maint.getEnemy(value.id,vars.enemyTypes).size,vars.player.x,vars.player.y,vars.player.size)){
                let midpoint = {"x":0,"y":0};
                let dist;

                dist = Math.sqrt(Math.pow((vars.player.x - value.x),2) + Math.pow((vars.player.y - value.y),2));

                midpoint.x = (value.x + vars.player.x) / 2;
                midpoint.y = (value.y + vars.player.y) / 2;

                value.x = midpoint.x + maint.getEnemy(value.id,vars.enemyTypes).size * (value.x - vars.player.x) / dist;
                value.y = midpoint.y + maint.getEnemy(value.id,vars.enemyTypes).size * (value.y - vars.player.y) / dist;


            }
            if(index < vars.map.enemies.length - 1){
                if(maint.cirToCirCol(value.x,value.y,value.size,vars.map.enemies[index + 1].x,vars.map.enemies[index + 1].y,vars.map.enemies[index + 1].size)) {
                    let value2 = vars.map.enemies[index + 1];
                    let midpoint = {"x":0,"y":0};
                    let dist;

                    dist = Math.sqrt(Math.pow((value2.x - value.x),2) + Math.pow((value2.y - value.y),2));

                    midpoint.x = (value.x + value2.x) / 2;
                    midpoint.y = (value.y + value2.y) / 2;

                    value.x = midpoint.x + maint.getEnemy(value.id,vars.enemyTypes).size * (value.x - value2.x) / dist;
                    value.y = midpoint.y + maint.getEnemy(value.id,vars.enemyTypes).size * (value.y - value2.y) / dist;

                    value2.x = midpoint.x + maint.getEnemy(value2.id,vars.enemyTypes).size * (value2.x - value.x) / dist;
                    value2.y = midpoint.y + maint.getEnemy(value2.id,vars.enemyTypes).size * (value2.y - value.y) / dist;
                }
            }

        });

        //Enemy attacking
        if(vars.player.isDead === false) {
            jQuery.each(vars.map.enemies, function (index, value) {
                value.timeFromLastAttack += dt;
                let enemyT = maint.getEnemy(value.id,vars.enemyTypes);
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
                    let originalItem = maint.getItem(value.object,vars);
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
                            vars.player.money += maint.getItem(value.object.id,vars).cost;
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
                        (vars.mouseX > value.object.x && vars.mouseX < value.object.x + maint.getItem(value.object.id,vars).sprite.w) &&
                        (vars.mouseY > value.object.y &&
                            vars.mouseY < value.object.y + maint.getItem(value.object.id,vars).sprite.h)
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
                            "w": maint.getItem(vars.player.inventory.chosen.object.id, vars).sprite.w,
                            "h": maint.getItem(vars.player.inventory.chosen.object.id, vars).sprite.h
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
                        maint.getItem(vars.player.inventory.chosen.object.id, vars).type === "consumable" &&
                        maint.isReachable(maint.getItem(vars.player.inventory.chosen.object.id, vars).action)
                    ) {
                        let originalItem = maint.getItem(vars.player.chosen.object.id,vars);
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
                        maint.getItem(vars.player.inventory.chosen.object.id, vars).type === "skillBook" &&
                        maint.isReachable(maint.getItem(vars.player.inventory.chosen.object.id, vars).train(vars.player))
                    ){
                        maint.getItem(vars.player.inventory.chosen.object.id, vars).train(player);
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
            if(vars.player.hotbar.items[vars.player.hotbar.activeId].type === "skill" && maint.isReachable(maint.getSkill(vars.player.hotbar.items[vars.player.hotbar.activeId].id,vars.skillTypes).use)){
                maint.getSkill(vars.player.hotbar.items[vars.player.hotbar.activeId].id,vars.skillTypes).use(vars.player);
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


    function loadImages(names,callback,vars) {

        let name,
            result = {},
            count  = names.length,
            onload = function() { if(--count === 0) {callback()} };

        for(let n = 0;n < names.length;n++) {
            name = names[n];
            vars[name] = new Image();
            vars[name].addEventListener('load', onload);
            vars[name].src = "assets/" + name + ".png";
        }

    }
    return func;
});