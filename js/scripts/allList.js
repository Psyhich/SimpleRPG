define(["classes","vars","maintenance"],function (classes,vars,maint) {
    let outLists = {};

    function loadImages(names,callback,vars) {

        let name,
            count  = names.length,
            onload = function() { if(--count === 0) {callback()} };

        for(let n = 0;n < names.length;n++) {
            name = names[n];
            vars[name] = new Image();
            vars[name].addEventListener('load', onload);
            vars[name].src = "assets/" + name + ".png";
        }

    }

    function choseSprite(type,id){
        return new classes.Sprite([{
            "px": vars[type][id].px,
            "py": vars[type][id].py,
            "pw": vars[type][id].pw,
            "ph": vars[type][id].ph,
            "w": vars[type][id].pw,
            "h": vars[type][id].ph
        }], vars[type][id].img);
    }

    //Load all files
    let isLoaded = false;

    //Image loader
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
        isLoaded = true;
    },vars);
    let checkExist = setInterval(function() {
        if (isLoaded) {
            clearInterval(checkExist);
        }
    }, 100);

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
        vars.chestplates[i - 5] = {
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

    //Books
    itemArea = maint.makeSpriteSheetArayInLine(51,vars.bookSprites);
    for(let i = 0;i < itemArea.length;i++){
        vars.books[i] = {
            "img":itemArea[i].img,
            "px":itemArea[i].px,
            "py":itemArea[i].py,
            "pw":itemArea[i].pw,
            "ph":itemArea[i].ph,
            "w":itemArea[i].pw,
            "h":itemArea[i].ph,
        };
    }

    this.staffSkills = [
        new classes.Skill(
            "Firebolt",
            "Fires a firebolt in your mouse pos.Cost 5 mana",
            0.5,
            function (user) {
                if(vars.events.isLeftMouseReleased === true){
                    classes.genProjectile(vars,0,user.x,user.y,100,100,true,vars.mouseX + vars.camera.xView,vars.mouseY + vars.camera.yView,true,vars.mouseX,vars.mouseY);
                    return true;
                }

            },
            new classes.Sprite([{"px":46,"py":0,"pw":46,"ph":46,"w":67,"h":67}],vars.skillsSprite))
    ];

    this.items = [
        new classes.Armor(
            "Light leather armor",
            choseSprite("chestplates", 0),
            "A simple leather armor, it has 1 defence and cost 3 coins.",
            3,
            null,
            null,
            null
        ),
        new classes.Armor(
            "Medium leather armor",
            choseSprite("chestplates", 0) ,
            "Medium defence armor that has 2 defence and cost 4 coins",
            4,
            null,
            null,
            null
        ),
        new classes.Armor(
            "Heavy leather armor",
            choseSprite("chestplates", 0) ,
            "Heavy leather armor that has 3 defence and cost 8 coins",
            8,
            null,
            null,
            null
        ),
        new classes.Item(
            "Simple heal potion",
            choseSprite("consumables",0),
            "Heals for 20 points and cost 5 coins",
            5,
            {"isStackable":true},
            function (user) {maint.restoreHealth(user, 20)},
            "consumables"
        ),
        new classes.Item(
            "Regen potion",
            choseSprite("consumables",8),
            "Regens health for 40 points for 5 seconds",
            10,
            {"isTemp": true, "time": 5000},
            function (user) {maint.restoreHealth(user, 0.04)},
            "consumable"
        ),
        new classes.Weapon("Wrath bringer",
            choseSprite("swords",5),
            "He just brings the wrath",
            10,
            null,
            null,
            {"weaponType": "melee", "cooldown": 0.4,"dmg":4,"dmgType":"area"}

        ),
        new classes.Item(
            "Book of firebolts",
            choseSprite("books",17),
            "This book is used to learn firebolt",
            100,
            null,
            function (user) {
                if (maint.isReachable(user.magicSkill) && user.magicSkill >= 1) {
                    if (this.skill.learn(user)) {
                        user.skills[user.skills.length] = this.skill;
                        maint.genTextAlert("Learned firebolt", "rgba(255,200,200,1.0)", vars);
                    }
                } else {
                    maint.genTextAlert("Your magic skill is too low", "rgba(255,200,200,1.0)", vars);
                }
            },
            "skillBook"
        ),
        new classes.Armor(
            "Chainmall armor",
            choseSprite("chestplates", 1),
            "It's a strong chainmall armor",
            50,
            null,
            null,
            {"def":5}
        ),
        {
            "sprite": new classes.Sprite([
                {
                    "w": 32,
                    "h": 32,
                    "pw": 32,
                    "ph": 32,
                    "px": 0,
                    "py": 0
                }], vars.expSprite),
            "x": 0,
            "y": 0,
            "name": "exp",
            "type": "exp",
            "count": 0
        },//EXP
        {
            "sprite":choseSprite("money",2),
            "x": 0,
            "y": 0,
            "name": "money",
            "type": "money",
            "count": 0,
        },//MONEY
        new classes.Weapon(
            "hands",
            null,
            "You look at your hands... and what??",
            0,
            null,
            null,
            {"dmg":4, "cooldown": 0.5, "dmgType": "point","weaponType":"melee"}
        ),//HANDS
        new classes.Weapon(
            "Elven bow",
            choseSprite("bows",0),
            "A simple but really good looking bow",
            20,
            null,
            null,
            {"dmg":15, "cooldown":1.4, "dmgType":"point", "weaponType":"ranged"}
        ),
        new classes.Ammo(
            "Arrow",
            choseSprite("arrows",0),
            "A simple arrow. It obviously looks sharp",
            15,
            {"isStackable": true, "amount": 1},
            null,
            {"dmg":5, "ammoFor": 12}
        ),
        new classes.Shield(
            "Righteous shield",
            choseSprite("shields",0),
            "A real shield for real paladin",
            75,
            null,
            null,
            {"spd": -0.3,"def":10}
        ),
        new classes.Weapon(
            "Staff of firebolts",
            choseSprite("staffs",0),
            "A really hot theme",
            110,
            {"charge":20},
            vars.staffSkills[0].action,
            {"spd":0.2,"cooldown": 2, "weaponType": "staff"}
        )
    ];

    this.projectileTypes = [
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

    this.floorTypes = {
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

    this.tileTypes = [
        {},
        { "id":1,"colour":"#1da413", "floor":this.floorTypes.ground,"sprite":new classes.Sprite([{"px":0,"py":0,"pw":16,"ph":16,"w":32,"h":32}],vars.tilesSprite),"action":function (user,x,y) {
                maint.minusSpeed(user,0.4);
            }},
        { "id":2,"colour":"#d6d117", "floor":this.floorTypes.ground,"sprite":new classes.Sprite([{"px":16,"py":0,"pw":16,"ph":16,"w":32,"h":32}],vars.tilesSprite),"action":function (user,x,y) {
                maint.minusSpeed(user,0.4);
            }},
        { "id":3,"colour":"#d6d117", "floor":this.floorTypes.path,"sprite":new classes.Sprite([{"px":32,"py":0,"pw":16,"ph":16,"w":32,"h":32}],vars.tilesSprite),"action":function (user,x,y) {
                user.speed += 0.4;
            }},
        { "id":4,"colour":"#d6d117", "floor":this.floorTypes.path,"sprite":new classes.Sprite([{"px":48,"py":0,"pw":16,"ph":16,"w":32,"h":32}],vars.tilesSprite),"action":function (user,x,y) {
                user.speed += 0.4;
            }},
        { "id":5,"colour":"#d6d117", "floor":this.floorTypes.path,"sprite":new classes.Sprite([{"px":0,"py":16,"pw":16,"ph":16,"w":32,"h":32}],vars.tilesSprite),"action":function (user,x,y) {
                user.speed += 0.4;
            }},
        { "id":6,"colour":"#d6d117", "floor":this.floorTypes.path,"sprite":new classes.Sprite([{"px":16,"py":16,"pw":16,"ph":16,"w":32,"h":32}],vars.tilesSprite),"action":function (user,x,y) {
                user.speed += 0.4;
            }},
        { "id":7,"colour":"#d6d117", "floor":this.floorTypes.path,"sprite":new classes.Sprite([{"px":32,"py":16,"pw":16,"ph":16,"w":32,"h":32}],vars.tilesSprite),"action":function (user,x,y) {
                user.speed += 0.4;
            }},
        { "id":8,"colour":"#d6d117", "floor":this.floorTypes.path,"sprite":new classes.Sprite([{"px":48,"py":16,"pw":16,"ph":16,"w":32,"h":32}],vars.tilesSprite),"action":function (user,x,y) {
                user.speed += 0.4;
            }},
        { "id":9,"colour":"#d6d117", "floor":this.floorTypes.bricksPath,"sprite":new classes.Sprite([{"px":0,"py":32,"pw":16,"ph":16,"w":32,"h":32}],vars.tilesSprite),"action":function (user,x,y) {
                user.speed += 0.8;
            }},
        { "id":10,"colour":"#d6d117", "floor":this.floorTypes.ice,"sprite":new classes.Sprite([{"px":16,"py":32,"pw":16,"ph":16,"w":32,"h":32}],vars.tilesSprite),"action":function (user,x,y) {
                user.speed += 0.1;
                /*if(user.x + user.size > x * vars.map.tileW  || user.x - user.size < x * vars.map.tileW + vars.map.tileW) {
                    user.x += -(user.velX * ((vars.now - vars.lastTime) / 1000)) * maint.getSpeed(user);
                }if(user.y + user.size > y * vars.map.tileH || user.y - user.size < y * vars.map.tileH + vars.map.tileH) {
                    user.y += -(user.velY * ((vars.now - vars.lastTime) / 1000)) * maint.getSpeed(user);
                }*/
            }},
        { "id":11,"colour":"#d6d117", "floor":this.floorTypes.ground,"sprite":new classes.Sprite([{"px":32,"py":32,"pw":16,"ph":16,"w":32,"h":32}],vars.tilesSprite),"action":function (user,x,y) {
                user.speed += 0.7;
            }},
        { "id":12,"colour":"#d6d117", "floor":this.floorTypes.portal,"sprite":new classes.Sprite([{"px":48,"py":32,"pw":16,"ph":16,"w":32,"h":32}],vars.tilesSprite),"action":function (user,x,y) {

            }},
        { "id":13,"colour":"#d6d117", "floor":this.floorTypes.bushes,"sprite":new classes.Sprite([{"px":0,"py":48,"pw":16,"ph":16,"w":32,"h":32}],vars.tilesSprite),"action":function (user,x,y) {
                maint.minusSpeed(user,0.2);
            }},
        { "id":14,"colour":"#d6d117", "floor":this.floorTypes.solid,"sprite":new classes.Sprite([{"px":16,"py":48,"pw":16,"ph":16,"w":32,"h":32}],vars.tilesSprite),"action":function (user,x,y) {
                if(user.x + user.size > x * vars.map.tileW  || user.x - user.size < x * vars.map.tileW + vars.map.tileW) {
                    user.x += -(user.velX * ((vars.now - vars.lastTime) / 1000)) * maint.getSpeed(user);
                }if(user.y + user.size > y * vars.map.tileH || user.y - user.size < y * vars.map.tileH + vars.map.tileH) {
                    user.y += -(user.velY * ((vars.now - vars.lastTime) / 1000)) * maint.getSpeed(user);
                }
            }},
        { "id":15,"colour":"#d6d117", "floor":this.floorTypes.forest,"sprite":new classes.Sprite([{"px":32,"py":48,"pw":16,"ph":16,"w":32,"h":32}],vars.tilesSprite),"action":function (user,x,y) {
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
        { "id":16,"colour":"#d6d117", "floor":this.floorTypes.ground,"sprite":new classes.Sprite([{"px":48,"py":48,"pw":16,"ph":16,"w":32,"h":32}],vars.tilesSprite),"action":function (user,x,y) {
                user.speed += 0.7;
            }},
        { "id":17,"colour":"#d6d117", "floor":this.floorTypes.hills,"sprite":new classes.Sprite([{"px":0,"py":64,"pw":16,"ph":16,"w":32,"h":32}],vars.tilesSprite),"action":function (user,x,y) {
                if(maint.isReachable(user.mount) && user.mount.type === "fly"){
                    user.speed += 0;
                }else{
                    maint.minusSpeed(user,0.3);
                }
            }},
        { "id":18,"colour":"#d6d117", "floor":this.floorTypes.water,"sprite":new classes.Sprite([{"px":16,"py":64,"pw":16,"ph":16,"w":32,"h":32}],vars.tilesSprite),"action":function (user,x,y) {
                if(maint.isReachable(user.mount) && user.mount.type === "fly"){
                }else if(maint.isReachable(user.mount) && user.mount.type === "swim"){
                    user.speed -= 0.8;
                }else{
                    user.speed -= 0.2;
                }
            }},
    ];

    this.skillTypes = [
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

    this.enemyTypes = [
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
            "move":function(dt,knight){
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
            },
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
            "move":function (dt,zombie) {
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
            },
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




    //Setting IDs for items automatically
    for(let i = 0;i < this.items.length;i++){
        items[i].id = i;
    }

    //Getters
    outLists.getItem = function(id){return this.items[id];};
    outLists.getEnemy = function(id) {return this.enemyTypes[id];};
    outLists.getSkill = function(id){return this.skillTypes[id]};
    outLists.getProjectile = function(id){return this.projectileTypes[id]};



    return outLists;


});


