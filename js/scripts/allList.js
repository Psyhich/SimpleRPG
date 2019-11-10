define(["classes","vars","maintenance"],function (classes,vars,maint) {
    let outLists = {};

    function loadImages(names,callback,vars){

        let name,
            count  = names.length,
            onload = function() { if(--count === 0) {callback()} };

        for(let n = 0;n < names.length;n++) {
            name = names[n];
            vars["assets"][name] = new Image();
            vars["assets"][name].addEventListener('load', onload);
            vars["assets"][name].src = "assets/sprites/images/" + name + ".png";
        }

    }

    function loadFiles(names,callback,vars){

        let name,
            count  = names.length,
            onload = function() { if(--count === 0) {callback()} };

        for(let n = 0;n < names.length;n++) {
            //Extracting name from file
            let path = names[n];
            name = names[n].split("/");
            name = name[name.length - 1].split(".");
            if(name[1] === "json"){
                let xobj = new XMLHttpRequest();
                xobj.overrideMimeType("text/json");
                xobj.open('GET', path, true);
                xobj.onreadystatechange = function() {
                    if (xobj.readyState === 4 && xobj.status == "200"){

                        // .open will NOT return a value but simply returns undefined in async mode so use a callback
                        vars.assets[name[0]] = JSON.parse(xobj.responseText);
                        onload();

                    }
                };
                xobj.send(null);
                break;
            }


            


                





        }

    }

    function choseSprite(type,id){
        return new classes.Sprite([{
            "px": vars[type][id].px,
            "py": vars[type][id].py,
            "pw": vars[type][id].pw,
            "ph": vars[type][id].ph,
            "w": vars[type][id].w,
            "h": vars[type][id].h
        }], vars[type][id].img);
    }
    
    //Image loader
    outLists.load = function(){

        loadImages([
            "acceptButtonSprite",
            "shopSprite",
            "alertSprite",
            "tilesSprite",
            "manyItemsSprite",
            "skillsSprite",
            "expSprite",
            "inventorySprite",
            "playerUISprite",
            "playerHotbarSprite",
            "skillsMenuSprite",
            "upgradeMenuSprite",
            "UIPieces",
            "configsSprite",
            "menuSprite",
            "hotbarChosenSprite"
        ],function () {
            vars.loaded = vars.loaded + 15;
        },vars);

        loadFiles([
            "assets/sprites/jsons/manyItemsSpriteData.json"
        ],function () {
            vars.loaded = vars.loaded + 1;
        },vars);

        let checkExist = setInterval(function() {
            if (vars.loaded === vars.shouldLoad) {
                vars.events.isLoaded = true;
                clearInterval(checkExist);
            }
        }, 100);
    };

    outLists.ini = function(){
        if(vars.events.isLoaded) {
            //Creating arrays and objects
            //Getting all items spritesheet
            let itemArea = [];
            for(let index in vars.assets.manyItemsSpriteData.frames){
                let value = vars.assets.manyItemsSpriteData.frames[index];

                itemArea[parseInt(index)] = {
                    "px": value.frame.x,
                    "py": value.frame.y,
                    "pw": value.frame.w,
                    "ph": value.frame.h,
                    "w": value.frame.w,
                    "h": value.frame.h,
                    "img": vars.assets.manyItemsSprite
                };
            }


            //Consumables array
            for (let i = 0; i <= 69; i++) {
                vars.consumables[i] = itemArea[i];
            }

            //Weapons array(swords + bows + staffs and any other weapons)
            for (let i = 0; i <= 97; i++) {
                vars.weapons[i] = itemArea[i + 70];
            }

            //Shields array
            for (let i = 0; i <= 13; i++) {
                vars.shields[i] = itemArea[i + 168];
            }

            //Making armors(helmets + chestplates )
            for (let i = 0; i <= 20; i++) {
                vars.armors[i] = itemArea[i + 182];
            }

            //Money array))
            for (let i = 0; i <= 2; i++) {
                vars.money[i] = itemArea[i + 220];
            }

            //Arrows array
            vars.arrows[0] = itemArea[388];

            //Books
            for (let i = 0; i <= 6; i++) {
                vars.books[i] = itemArea[i + 406];
            }

            //Creating skills array
            for(let i = 280; i <= 405;i++){
                vars.skills[i - 280] = itemArea[i];
            }

            //Creating tiles array
            itemArea = maint.makeSpriteSheetArray(4,5,vars.assets.tilesSprite);
            for(let i = 0; i < itemArea.length;i++){
                vars.tiles[i] = itemArea[i];
            }

            vars.assets.hotbarChosenSprite = new classes.Sprite([{"px": 0, "py": 0, "pw": 48, "ph": 48, "w": 48, "h": 48}],vars.assets.hotbarChosenSprite)

            this.staffSkills = [
                new classes.Skill(
                    "Firebolt",
                    "Fires a firebolt in your mouse pos.Cost 5 mana",
                    0.5,
                    function (user) {
                        if (vars.events.isLeftMouseReleased === true) {
                            classes.genProjectile(
                                vars,
                                0,
                                user.x,
                                user.y,
                                100,
                                100,
                                true,
                                vars.mouseX + vars.camera.xView,
                                vars.mouseY + vars.camera.yView,
                                true,
                                vars.mouseX,
                                vars.mouseY
                            );
                            return true;
                        }
                    },
                    new classes.Sprite([{"px": 46, "py": 0, "pw": 46, "ph": 46, "w": 67, "h": 67}], vars.skillsSprite))
            ];

            this.skillTypes = [
                new classes.Skill(
                    "Firebolt",
                    "Fires a firebolt in your mouse pos.Cost 5 mana",
                    0.5,
                    (user) => {
                        if (vars.events.isLeftMouseReleased === true) {
                        if (
                            outLists.skillTypes[0].lastUsed + outLists.skillTypes[0].cooldown * 1000 < vars.lastTime &&
                            user.mana - 5 >= 0
                        ) {
                            classes.genProjectile(
                                vars,
                                0,
                                user.x,
                                user.y,
                                50,
                                50,
                                true,
                                vars.mouseX + vars.camera.xView,
                                vars.mouseY + vars.camera.yView
                            );
                            user.mana -= 5;
                        } else {
                            if (outLists.skillTypes[0].lastUsed + outLists.skillTypes[0].cooldown * 1000 < vars.lastTime) {
                                maint.genTextAlert("Wait some time to use this ability again", "rgba(200,0,0,1.0)", vars);
                            }
                            if (user.mana - 5 >= 0) {
                                maint.genTextAlert("You don't have enough mana", "rgba(200,0,0,1.0)", vars);
                            }
                        }
                        this.lastUsed = vars.lastTime;
                    }
                    },
                    (user) =>{
                        if(user.magicSkill >= 1){
                            return true;
                        }else{
                            maint.genTextAlert("Your magic skill is too low", "rgba(255,200,200,1.0)", vars);
                            return false;
                        }
                    },
                    choseSprite("skills",4)
                )
            ];

            this.items = [
                new classes.Armor(
                    "Light leather armor",
                    choseSprite("armors", 0),
                    "A simple leather armor, it has 1 defence and cost 3 coins.",
                    3,
                    null,
                    null,
                    {
                        "def":1
                    }
                ),
                new classes.Armor(
                    "Medium leather armor",
                    choseSprite("armors", 1),
                    "Medium defence armor that has 2 defence and cost 4 coins",
                    4,
                    null,
                    null,
                    {
                        "def":2
                    }
                ),
                new classes.Armor(
                    "Heavy leather armor",
                    choseSprite("armors", 2),
                    "Heavy leather armor that has 3 defence and cost 8 coins",
                    8,
                    null,
                    null,
                    {
                        "def":3
                    }
                ),
                new classes.Item(
                    "Simple heal potion",
                    choseSprite("consumables", 42),
                    "Heals for 20 points and cost 5 coins",
                    5,
                    {"isStackable": true},
                    function (user) {
                        maint.restoreHealth(user, 20)
                    },
                    "consumables"
                ),
                new classes.Item(
                    "Regen potion",
                    choseSprite("consumables", 35),
                    "Regens health for 40 points for 5 seconds",
                    10,
                    null,
                    function (user) {
                        user.actions[user.actions.length] = new classes.Effect(
                            "Regen",
                            "You are regenerating",
                            10000,
                            (user) => {maint.restoreHealth(user, 0.24)},
                            false,
                            1,
                            user

                        );
                    },
                    "consumable",
                    {"isOneUse":true}
                ),
                new classes.Weapon(
                    "Wrath bringer",
                    choseSprite("weapons", 6),
                    "He just brings the wrath",
                    10,
                    null,
                    null,
                    {"weaponType": "melee", "cooldown": 0.4, "dmg": 4, "dmgType": "area"}
                ),
                new classes.Item(
                    "Book of firebolts",
                    choseSprite("books", 6),
                    "this book is used to learn firebolt",
                    100,
                    null,
                    function (user) {
                        if (maint.isReachable(user.magicSkill) && user.magicSkill >= 1) {
                            if (this.effects.skillToLearn.learn(user)) {

                            }
                        }
                    },
                    "skillBook",
                    {
                        "skillToLearn": outLists.skillTypes[0]
                    }
                ),
                new classes.Armor(
                    "Chainmall armor",
                    choseSprite("armors", 3),
                    "It's a strong chainmall armor",
                    50,
                    null,
                    null,
                    {
                        "def": 5
                    }
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
                        }], vars.assets.expSprite),
                    "x": 0,
                    "y": 0,
                    "name": "exp",
                    "type": "exp",
                    "meta": {"count":0}
                },//EXP
                {
                    "sprite": choseSprite("money", 2),
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
                    {"dmg": 4, "cooldown": 0.5, "dmgType": "point", "weaponType": "melee"}
                ),//HANDS
                new classes.Weapon(
                    "Elven bow",
                    choseSprite("weapons", 85),
                    "A simple but really good looking bow",
                    20,
                    null,
                    null,
                    {"dmg": 15, "cooldown": 1.4, "dmgType": "point", "weaponType": "ranged"}
                ),
                new classes.Ammo(
                    "Arrow",
                    choseSprite("arrows", 0),
                    "A simple arrow. It obviously looks sharp",
                    15,
                    {"isStackable": true, "amount": 1},
                    null,
                    {"dmg": 5, "ammoFor": 12}
                ),
                new classes.Shield(
                    "Righteous shield",
                    choseSprite("shields", 12),
                    "A real shield for real paladin",
                    75,
                    null,
                    null,
                    {"spd": -0.3, "def": 10}
                ),
                new classes.Weapon(
                    "Staff of firebolts",
                    choseSprite("weapons", 63),
                    "A really hot theme",
                    110,
                    {"charge": 20},
                    this.staffSkills[0].action,
                    {"spd": 0.2, "cooldown": 2, "weaponType": "staff"}
                )
            ];

            this.projectileTypes = [
                {
                    "action": function (delp) {
                        jQuery.each(vars.map.enemies, function (index, value) {
                            if (
                                maint.cirToCirCol(
                                    delp.x,
                                    delp.y,
                                    outLists.getProjectile(delp.id, vars.projectileTypes).size,
                                    value.x,
                                    value.y,
                                    outLists.getEnemy(value.id, vars.enemyTypes).size)
                            ) {
                                value.hp -= 10;
                                if (value.hp <= 0) {
                                    value.isDead = true;
                                }
                                delp.living = delp.time;
                                return false;
                            }
                        });
                    },
                    "type": "circle",
                    "size": 10,
                    "time": 5,
                    "color": "rgba(0,255,0,1.0)"
                },
                {
                    "action": function (delp) {
                        jQuery.each(vars.map.enemies, function (index, value) {
                            if (maint.cirToCirCol(delp.x, delp.y, maint.getProjectile(delp.id, vars.projectileTypes).size, value.x, value.y, maint.getEnemy(value.id, vars.enemyTypes).size)) {
                                value.hp -= 20;
                                if (value.hp <= 0) {
                                    value.isDead = true;
                                }
                                delp.living = delp.time;
                                return false;
                            }
                        });
                    },
                    "type": "circle",
                    "size": 5,
                    "time": 10,
                    "color": "rgba(0,255,0,1.0)"
                }
            ];

            this.floorTypes = {
                solid: 0,
                path: 1,
                water: 2,
                ground: 3,
                forest: 4,
                bricksPath: 5,
                ice: 6,
                portal: 7,
                bushes: 8,
                hills: 9
            };

            this.tileTypes = [
                {},
                {
                    "colour": "#1da413",
                    "floor": this.floorTypes.ground,
                    "sprite": choseSprite("tiles", 1),
                    "action": function (user, x, y) {
                        maint.minusSpeed(user, 0.4);
                    }
                },
                {
                    "colour": "#d6d117",
                    "floor": this.floorTypes.ground,
                    "sprite": choseSprite("tiles", 13),
                    "action": function (user, x, y) {
                        maint.minusSpeed(user, 0.4);
                    }
                },
                {
                    "colour": "#d6d117",
                    "floor": this.floorTypes.path,
                    "sprite": choseSprite("tiles", 15),
                    "action": function (user, x, y) {
                        user.speed += 0.4;
                    }
                },
                {
                    "colour": "#d6d117",
                    "floor": this.floorTypes.path,
                    "sprite": choseSprite("tiles", 16),
                    "action": function (user, x, y) {
                        user.speed += 0.4;
                    }
                },
                {
                    "colour": "#d6d117",
                    "floor": this.floorTypes.path,
                    "sprite": choseSprite("tiles", 4),//TODO
                    "action": function (user, x, y) {
                        user.speed += 0.4;
                    }
                },
                {
                    "colour": "#d6d117",
                    "floor": this.floorTypes.path,
                    "sprite": choseSprite("tiles", 18),
                    "action": function (user, x, y) {
                        user.speed += 0.4;
                    }
                },
                {
                    "colour": "#d6d117",//////
                    "floor": this.floorTypes.path,
                    "sprite": choseSprite("tiles", 4),
                    "action": function (user, x, y) {
                        user.speed += 0.4;
                    }
                },
                {
                    "colour": "#d6d117",
                    "floor": this.floorTypes.path,
                    "sprite": choseSprite("tiles", 7),
                    "action": function (user, x, y) {
                        user.speed += 0.4;
                    }
                },
                {
                    "colour": "#d6d117",
                    "floor": this.floorTypes.bricksPath,
                    "sprite": choseSprite("tiles", 14),
                    "action": function (user, x, y) {
                        user.speed += 0.8;
                    }
                },
                {
                    "colour": "#d6d117",
                    "floor": this.floorTypes.ice,
                    "sprite": choseSprite("tiles", 3),
                    "action": function (user, x, y) {
                        user.speed += 0.1;
                        /*if(user.x + user.size > x * vars.map.tileW  || user.x - user.size < x * vars.map.tileW + vars.map.tileW) {
                            user.x += -(user.velX * ((vars.now - vars.lastTime) / 1000)) * maint.getSpeed(user);
                        }if(user.y + user.size > y * vars.map.tileH || user.y - user.size < y * vars.map.tileH + vars.map.tileH) {
                            user.y += -(user.velY * ((vars.now - vars.lastTime) / 1000)) * maint.getSpeed(user);
                        }*/
                    }
                },
                {
                    "colour": "#d6d117",
                    "floor": this.floorTypes.ground,
                    "sprite": choseSprite("tiles", 10),
                    "action": function (user, x, y) {
                        user.speed += 0.7;
                    }
                },
                {
                    "colour": "#d6d117",
                    "floor": this.floorTypes.portal,
                    "sprite": choseSprite("tiles", 6),
                    "action": function (user, x, y) {

                    }
                },
                {
                    "colour": "#d6d117",
                    "floor": this.floorTypes.bushes,
                    "sprite": choseSprite("tiles", 2),
                    "action": function (user, x, y) {
                        maint.minusSpeed(user, 0.2);
                    }
                },
                {
                    "colour": "#d6d117",
                    "floor": this.floorTypes.solid,
                    "sprite": choseSprite("tiles", 7),
                    "action": function (user, x, y) {
                        if (user.x + user.size > x * vars.map.tileW || user.x - user.size < x * vars.map.tileW + vars.map.tileW) {
                            user.x += -(user.velX * ((vars.now - vars.lastTime) / 1000)) * maint.getSpeed(user);
                        }
                        if (user.y + user.size > y * vars.map.tileH || user.y - user.size < y * vars.map.tileH + vars.map.tileH) {
                            user.y += -(user.velY * ((vars.now - vars.lastTime) / 1000)) * maint.getSpeed(user);
                        }
                    }
                },
                {
                    "colour": "#d6d117",
                    "floor": this.floorTypes.forest,
                    "sprite": choseSprite("tiles", 10),
                    "action": function (user, x, y) {
                        if (maint.isReachable(user.mount) && user.mount.type === "fly") {
                            user.speed += 0;
                        } else {
                            if (user.x + user.size > x * vars.map.tileW || user.x - user.size < x * vars.map.tileW - vars.map.tileW) {
                                user.x += -(user.velX * ((vars.now - vars.lastTime) / 1000) * maint.getSpeed(user));
                            }
                            if (user.y + user.size > y * vars.map.tileH || user.y - user.size < y * vars.map.tileH - vars.map.tileH) {
                                user.y += -(user.velY * ((vars.now - vars.lastTime) / 1000) * maint.getSpeed(user));
                            }
                        }
                    }
                },
                {
                    "colour": "#d6d117",
                    "floor": this.floorTypes.ground,
                    "sprite": choseSprite("tiles", 15),
                    "action": function (user, x, y) {
                        user.speed += 0.7;
                    }
                },
                {
                    "colour": "#d6d117",
                    "floor": this.floorTypes.hills,
                    "sprite": choseSprite("tiles", 12),
                    "action": function (user, x, y) {
                        if (maint.isReachable(user.mount) && user.mount.type === "fly") {
                            user.speed += 0;
                        } else {
                            maint.minusSpeed(user, 0.3);
                        }
                    }
                },
                {
                    "colour": "#d6d117",
                    "floor": this.floorTypes.water,
                    "sprite": choseSprite("tiles", 0),
                    "action": function (user, x, y) {
                        if (maint.isReachable(user.mount) && user.mount.type === "fly") {
                        } else if (maint.isReachable(user.mount) && user.mount.type === "swim") {
                            user.speed -= 0.8;
                        } else {
                            user.speed -= 0.2;
                        }
                    }
                },
            ];



            this.enemyTypes = [
                /*0*/{
                    "name": "knight",
                    "id": 0,
                    "hp": 100,
                    "maxHp": 100,
                    "dmg": 30,
                    "def": 10,
                    "cooldown": 2,
                    "timeFromLastAttack": 0,
                    "vision": 100,
                    "range": 30,
                    "size": 13,
                    "x": 0,
                    "y": 0,
                    "startX": null,
                    "startY": null,
                    "velX": 0,
                    "velY": 0,
                    "velocity": 150,
                    "isDead": false,
                    "move": function (dt, knight) {
                        //if(events.isPlayerMoving || events.isShouldMoveEnemies || !events.isPlayerStopped){

                        knight.velX = 0;
                        knight.velY = 0;
                        if (vars.player.isDead === false && Math.sqrt(Math.pow(vars.player.x - knight.x, 2) + Math.pow(vars.player.y - knight.y, 2)) <= this.vision && knight.hp > 0) {

                            knight.velX = maint.getVelocityTo(vars.player, knight).x * knight.velocity;
                            knight.velY = maint.getVelocityTo(vars.player, knight).y * knight.velocity;

                            knight.x += knight.velX * dt;
                            knight.y += knight.velY * dt;
                            //events.isShouldMoveEnemies = true;
                        } else {
                            if (knight.startX === null && knight.startY === null) {

                                knight.startX = this.x;
                                knight.startY = this.y;
                                knight.isMoving = maint.getRandomTOrF() === true ? 1 : 2;
                            } else if (knight.isMoving === 1) {
                                if (knight.x > this.startX - 100) {
                                    knight.velX = -100;
                                } else if (this.x <= this.startX - 100) {
                                    knight.isMoving = 2;
                                }
                            } else if (knight.isMoving === 2) {
                                if (knight.x < this.startX + 100) {
                                    knight.velX = 100;
                                } else if (this.x >= this.startX + 100) {
                                    knight.isMoving = 1;
                                }
                            }
                            knight.x += knight.velX * dt;
                            knight.y += knight.velY * dt;
                        }


                        //}
                    },
                    "money": 1,
                    "commonDrops": [
                        vars.itemTypes[14]
                    ],
                    "rareDrops": [
                        vars.itemTypes[14]
                    ],
                    "epicDrops": [
                        vars.itemTypes[14]
                    ],
                    "legendaryDrops": [
                        vars.itemTypes[14]
                    ],
                    "color": "rgba(30,30,30,1.0)",
                    "exp": 100,
                    "randomSpeed": true,
                    "rndSpdStart": 10,
                    "rndSpdFinish": 200,
                    "equipment": []
                },
                /*1*/{
                    "name": "zombie",
                    "id": 1,
                    "hp": 5,
                    "maxHp": 5,
                    "dmg": 1,
                    "def": 3,
                    "cooldown": 1.2,
                    "timeFromLastAttack": 0,
                    "vision": 100,
                    "range": 45,
                    "size": 13,
                    "x": 0,
                    "y": 0,
                    "velX": 0,
                    "velY": 0,
                    "velocity": 50,
                    "isDead": false,
                    "move": function (dt, zombie) {
                        //if(events.isPlayerMoving || events.isShouldMoveEnemies || !events.isPlayerStopped){

                        zombie.velX = 0;
                        zombie.velY = 0;
                        if (vars.player.isDead === false && Math.sqrt(Math.pow(vars.player.x - zombie.x, 2) + Math.pow(vars.player.y - zombie.y, 2)) <= this.vision && zombie.hp > 0) {

                            zombie.velX = maint.getVelocityTo(vars.player, zombie).x * zombie.velocity;
                            zombie.velY = maint.getVelocityTo(vars.player, zombie).y * zombie.velocity;

                            zombie.x += zombie.velX * dt;
                            zombie.y += zombie.velY * dt;
                            vars.events.isShouldMoveEnemies = true;
                        } else {
                            zombie.velX = 0;
                            zombie.velY = 0;
                            /*if(events.isShouldMoveEnemies !== true){
                                events.isShouldMoveEnemies = false;
                            }*/
                        }


                        //}
                    },
                    "money": 1,
                    "commonDrops": [
                        vars.itemTypes[0],
                        vars.itemTypes[12]

                    ],
                    "rareDrops": [
                        vars.itemTypes[1],
                        vars.itemTypes[3],
                        vars.itemTypes[12],
                        vars.itemTypes[13]
                    ],
                    "epicDrops": [
                        vars.itemTypes[2],
                        vars.itemTypes[4],
                        vars.itemTypes[12],
                        vars.itemTypes[13]
                    ],
                    "legendaryDrops": [
                        vars.itemTypes[5],
                        vars.itemTypes[13]
                    ],
                    "color": "rgba(0,255,0,1.0)",
                    "exp": 15,
                    "randomSpeed": true,
                    "rndSpdStart": 10,
                    "rndSpdFinish": 100,
                    "equipment": []
                }
            ];


            //Setting IDs for items automatically
            //Items
            for (let i = 0; i < this.items.length; i++) {
                this.items[i].id = i;
            }
            //Tiles
            for (let i = 0; i < this.tileTypes.length; i++) {
                this.tileTypes[i].id = i;
            }
            //Enemies
            for (let i = 0; i < this.enemyTypes.length; i++) {
                this.enemyTypes[i].id = i;
            }
            //Projectiles
            for (let i = 0; i < this.projectileTypes.length; i++) {
                this.projectileTypes[i].id = i;
            }
            //Skills
            for (let i = 0; i < this.skillTypes.length; i++) {
                this.skillTypes[i].id = i;
            }
            //Staff skills
            for (let i = 0; i < this.staffSkills.length; i++) {
                this.staffSkills[i].id = i;
            }


            //Getters
            outLists.getItem = function (id) {
                return this.items[id];
            };
            outLists.getEnemy = function (id) {
                return this.enemyTypes[id];
            };
            outLists.getSkill = function (id) {
                return this.skillTypes[id]
            };
            outLists.getProjectile = function (id) {
                return this.projectileTypes[id]
            };
            outLists.getTile = function (id) {
                return this.tileTypes[id]
            };
        }


    };



    return outLists;


});


