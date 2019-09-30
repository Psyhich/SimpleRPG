define(["maintenance"],function (maint) {
    var funcs = {};
    //Sprite
    funcs.Sprite = function(data,img) {
        if(img === null || img === undefined){
            return false;
        }
        this.animated = data.length > 1;
        this.frameCount = data.length;
        this.duration = 0;
        this.loop = true;
        this.img = img;
        if(data.length > 1){
            for(var i in data){
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
    };
    funcs.Sprite.prototype.drawWH = function (t,ctx,x,y,w,h) {
        var frameId = 0;
        if(!this.loop && this.animated && t >= this.duration){
            frameId = (this.frames.length - 1);
        }else if(this.animated){
            t = t % this.duration;
            var totalD = 0;

            for(var i in this.frames){
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
    funcs.Sprite.prototype.draw = function (t,ctx,x,y){
        var frameId = 0;
        if(!this.loop && this.animated && t >= this.duration){
            frameId = (this.frames.length - 1);
        }else if(this.animated){
            t = t % this.duration;
            var totalD = 0;

            for(var i in this.frames){
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
    funcs.Skill = function(name,description,cooldown,func,sprite) {
        this.name = name;
        this.description = description;
        this.action = func;
        this.sprite = sprite;
        this.cooldown = cooldown;
        this.lastUsed = 0;
        this.type = "skill";
    };
    funcs.Skill.prototype.use = function (user) {
        this.action(user);
    };
    funcs.Skill.prototype.learn = function(user) {
        var a = false;
        if(user.skills.length > 0){
            jQuery.each(user.skills,function (index,value) {
                if(value === this){
                    maint.genTextAlert("You already learned that skill.","rgba(255,100,100,1.0)",vars);
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

    //Player class
    funcs.Player = function(name,id){
        //Main
        this.name = name;
        this.id = id;
    };
    funcs.Player.prototype.initialise = function(){
        //Place, size, color and movement
        this.x = 790;
        this.y = 390;
        this.velX = 0;
        this.velY = 0;
        this.speed = 1;
        this.size = 12;
        this.color = "rgba(255,255,255,1.0)";
        //Basic stats
        this.hp = 10;
        this.stamina = 10;
        this.mana = 10;
        this.maxHp = 10;
        this.maxStamina = 10;
        this.maxMana = 10;
        this.vision = 200;
        //Death and injuries
        this.lastHealth = this.hp;
        this.lastMana = this.mana;
        this.lastStamina = this.stamina;
        this.lastHealthInjury = 0;
        this.lastManaInjury = 0;
        this.lastStaminaInjury = 0;
        this.isDead = false;
        this.deathTime = 0;
        //Skills
        this.level = 1;
        this.exp = 0;
        this.expToNextLevel = 0;
        this.upgradePoints = 0;
        this.defSkill = 0;
        this.magicSkill = 0;
        this.fightingSkill = 0;
        this.skills = [];
        //Items
        this.money = 0;
        this.weapon = null;
        this.armor = null;
        this.helmet = null;
        this.ring = null;
        this.shield = null;
        this.equipment = null;
        this.inventory = [];
        //Attackbox
        this.directionX = 0;
        this.directionY = 1;
        this.attackBox = null;
        //Attacking
        this.timeFromLastAttack = 0;
        this.attack = false;
        this.isAttackDrawn = false;
        this.rangedAttackBox = null;
        //Bools
        this.canMove = true;
        this.canInteract = true;
        this.canAttack = true;
        //Other
        this.quests = [];
        this.actions = [];
        this.mount = {};
        this.hotbar = {"activeId":null,"items":[]};

        this.nextLevel()
    };
    funcs.Player.prototype.nextLevel = function(){
        var level = this.level + 1;
        this.expToNextLevel = 100 * (level * level) - (100 * level)
    };
    funcs.Player.prototype.mainActions = function(vars){
        if(this.canMove){
            this.movement(vars.events.keys,vars.dt);
        }if(this.canInteract){
            this.interactions();
        }if(this.canAttack){
            //Reassigning boolean
            this.attack = vars.events.keys.isAttackPressed;
            //Reassigning time
            this.timeFromLastAttack += vars.dt;
            //Checking, then attacking
            if(!this.isDead){
                if (this.attack === true && this.timeFromLastAttack >= maint.getItem(this.weapon.id,vars).cooldown) {
                    let temp = false;
                    if(maint.getItem(this.weapon.id,vars).weaponType === "melee"){
                        if (maint.getItem(this.weapon.id,vars).dmgType === "point") {
                            maint.checkPlayerThanPointAttack(vars);
                        } else if (maint.getItem(this.weapon.id,vars).dmgType === "area") {
                            maint.checkPlayerThanAreaAttack(vars);
                        }
                        this.timeFromLastAttack = 0;
                    }
                    else if(maint.getItem(this.weapon.id,vars).weaponType === "ranged" && maint.isThereAmmo(this,vars)){
                        let x2 = this.x + Math.cos((-45  + (-this.rangedAttackBox) * 45)  * (Math.PI / 180)) * (this.size + 10);    // unchanged
                        let y2 = this.y - Math.sin((-45  + (-this.rangedAttackBox) * 45)  * (Math.PI / 180)) * (this.size + 10);    // minus on the Sin

                        let speedX = maint.getVelocityTo(this,{x:x2,y:y2}).x * 250;
                        let speedY = maint.getVelocityTo(this,{x:x2,y:y2}).y * 250;

                        x2 = this.x + Math.cos((-45  + (-this.rangedAttackBox) * 45)  * (Math.PI / 180)) * (this.size - 40);
                        y2 = this.y - Math.sin((-45  + (-this.rangedAttackBox) * 45)  * (Math.PI / 180)) * (this.size - 40);

                        funcs.genProjectile(vars,1,x2,y2,speedX,speedY,false);
                        this.timeFromLastAttack = 0;
                    }
                    else if(maint.getItem(this.weapon.id,vars).weaponType === "staff"){
                        this.timeFromLastAttack = maint.getItem(this.weapon.id,vars).action(this) === true ? 0 : this.timeFromLastAttack;
                    }
                    this.isAttackDrawn = true;

                }
                for (let i = 0; i < vars.map.enemies.length; i++){
                    if (vars.map.enemies[i].isDead === true) {
                        maint.dropRandom(vars.map.enemies[i],vars);
                        //For quests
                        var enem = maint.getEnemy(vars.map.enemies[i].id,vars.enemyTypes);
                        if(maint.isReachable(this[enem.name + "Counter"])){
                            this[enem.name + "Counter"]++;
                        }
                        vars.map.enemies.splice(i, 1);
                        i--;

                    }
                }
            }
        }
        /*Buffs, debuffs and other temporary effects*/
        if(this.actions.length > 0){
            for(let i = 0;i < this.actions.length;i++) {
                if(this.actions[i].deployed + this.actions[i].time < vars.lastTime){
                    this.actions.splice(i,1);
                    i--;
                }else{
                    this.actions[i].action(this);
                }
            }
        }

        //Checking for injuries and beginning health regeneration after 9 seconds
        if(this.lastHealth === this.hp) {
            if (this.lastInjury + 9000 < vars.lastTime && this.hp < this.hp / 2) {
                maint.restoreHealth(this, 0.05);
            }
        }
        //Checking if player mana changed and regenerating it after 4 seconds
        if(this.lastMana === this.mana){
            if(this.lastManaLoose + 4000 < vars.lastTime){
                maint.restoreMana(this,0.2);
            }
        }else {
            this.lastManaInjury = vars.lastTime;
            this.lastMana = this.mana;
        }

    };
    funcs.Player.prototype.movement = function(keys,dt){
        //Controls
        //Up and down
        if (keys.isUpPressed === true) {
            this.velY = -80;
        }else if (keys.isDownPressed === true) {
            this.velY = 80;
        } else if (!keys.isUpPressed && !keys.isDownPressed) {
            this.velY = 0;
        }
        //Right and left
        if (keys.isRightPressed === true) {
            this.velX = -80;
        }else if (keys.isLeftPressed === true){
            this.velX = 80;
        } else if (!keys.isRightPressed && !keys.isLeftPressed) {
            this.velX = 0;
        }
        //Applying movement
        this.x += this.velX * dt * maint.getSpeed(this);
        this.y += this.velY * dt * maint.getSpeed(this);
        this.speed = 1;

    };
    funcs.Player.prototype.interactions = function(){

    };
    //Like bullet
    funcs.Delpoyable = function(x,y,vx,vy,id,time) {
        this.x = 0 + x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.id = id;
        this.time = time;
        this.living = 0;
        this.lastDest = {};
    };
    funcs.Delpoyable.prototype.update = function (dt,projectileTypes) {
        if(maint.isReachable(this.isMovingTowards) && this.isMovingTowards === true){
            this.x += Math.abs(this.vx) * maint.getVelocityTo(this.lastDest,this).x * dt;
            this.y += Math.abs(this.vy) * maint.getVelocityTo(this.lastDest,this).y * dt;
        }else{
            this.x += this.vx * dt;
            this.y += this.vy * dt;
        }
        if(maint.isReachable(maint.getProjectile(this.id,projectileTypes))){
            maint.getProjectile(this.id,projectileTypes).action(this);
        }
        this.living += dt;

    };
    funcs.Delpoyable.prototype.moveTowards = function (x,y) {
        this.lastDest = {"x":x,"y":y};
        this.isMovingTowards = true;
    };
    funcs.genProjectile = function(vars,id,x,y,vx,vy,moveTowards,destX,destY){
        vars.map.delpoyables[vars.map.delpoyables.length] = new funcs.Delpoyable(x, y, vx, vy, id, maint.getProjectile(id,vars.projectileTypes).time);
        if(maint.isReachable(moveTowards) && moveTowards === true && maint.isReachable(destX) && maint.isReachable(destY)){
            vars.map.delpoyables[vars.map.delpoyables.length - 1].moveTowards(destX,destY);
        }
    };

    //Menus
    //Shop
    funcs.Shop = function(items,x,y,type,money,keeper){
        this.items = items;
        this.x = x;
        this.y = y;
        this.w = 343;
        this.h = 400;
        this.visible = false;
        this.type = "shop";
        this.pos = 0;
        this.buttons = [];
        for(var i = 0;i < 4;i++){
            this.buttons[i] = {"x":this.x + 280,"y":this.y + 100 * i + 50};
        }
        this.shopType = type;
        this.money = money;
        this.keeper = keeper;
    };
    funcs.Shop.prototype.drawShop = function (vars){
        vars.ctx.drawImage(vars.shopSprite,this.x,this.y);
        var count = 0;
        for(var i = this.pos;i < this.pos + 4;i++){
            if(maint.isReachable(this.items[i]) && maint.isReachable(this.items[i].sprite)){
                if(count === 0){
                    this.items[i].sprite.draw(vars.gameTime,vars.ctx,this.x + 26,this.y + 43);
                    vars.ctx.fillStyle = "rgba(0,0,0,1.0)";
                    vars.ctx.font = "10px Arial";
                    maint.wrapText(vars.ctx,this.items[i].description,this.x + 70,this.y + 60,215,15);
                    maint.wrapText(vars.ctx,this.items[i].cost,this.x + 300,this.y + 60,215,15);
                    vars.ctx.drawImage(vars.acceptButtonSprite,this.buttons[0].x, this.buttons[0].y);

                }else{
                    this.items[i].sprite.draw(vars.gameTime,vars.ctx,this.x + 26,this.y + (95 * count) + 43);
                    vars.ctx.fillStyle = "rgba(0,0,0,1.0)";
                    maint.wrapText(vars.ctx,this.items[i].description,this.x + 70,this.y + 90 * count + 70,215,15);
                    maint.wrapText(vars.ctx,this.items[i].cost,this.x + 300,this.y + 100 * count + 50,215,15);
                    vars.ctx.drawImage(vars.acceptButtonSprite,this.buttons[count].x, this.buttons[count].y);
                }
            }
            count++;
        }
        vars.ctx.font = "12px Arial";
        vars.ctx.fillStyle = "rgba(255,255,255,1.0)";
        maint.wrapText(vars.ctx,this.keeper.name + "'s money: " + this.keeper.money,this.x + 20,this.y + 30,100,10);
    };
    funcs.Shop.prototype.updateShop = function (vars){
        if(vars.events.isWheel === true){
            if( vars.mouseX > this.x && vars.mouseX < this.x + this.w && vars.mouseY > this.y && vars.mouseY < this.y + this.h){
                if(vars.events.deltaY > 0 && this.pos + 1 <= this.items.length){
                    this.pos += 1;
                }else if(vars.events.deltaY < 0 && this.pos - 1 >= 0){
                    this.pos -= 1;
                }else{

                }
            }
        }
        for(var i = 0;i < 4;i++) {
            if(vars.events.isLeftMouseReleased && vars.mouseX > this.buttons[i].x && vars.mouseX < this.buttons[i].x + 14 && vars.mouseY > this.buttons[i].y && vars.mouseY < this.buttons[i].y + 14){
                if(vars.player.money >= this.items[i + this.pos].cost){
                    var isChecked = null;
                    var item = this.items[i + this.pos];
                    jQuery.each(vars.player.inventory,function (index,value) {
                        if(value.isEmpty){
                            isChecked =  + index;
                            return true;
                        }
                    });
                        if(maint.getItem(item.id,vars).type !== "ammo" && maint.isReachable(isChecked)){
                            vars.player.inventory[isChecked].isEmpty = false;
                            vars.player.inventory[isChecked].object = {};
                            vars.player.inventory[isChecked].object.id = item.id;
                            vars.player.inventory[isChecked].object.x = 0;
                            vars.player.inventory[isChecked].object.y = 0;
                            vars.player.inventory[isChecked].object.inventoryId = isChecked;
                            vars.player.money -= item.cost;
                            this.keeper.money += item.cost;
                        }else if(maint.getItem(item.id,vars).type === "ammo"){
                            var ir = true;
                            for (var u = 0; u < 9; u++) {
                                if (vars.player.inventory[u].isEmpty === false && maint.isReachable(maint.getItem(vars.player.inventory[u].object.id,vars).ammoFor) && maint.getItem(vars.player.inventory[u].object.id,vars).ammoFor === item.ammoFor) {
                                    vars.player.inventory[u].object.amount += item.meta.amount;
                                    ir = false;
                                    break;
                                }
                            }
                            if(ir){
                                for (var w = 0; w < 9; w++) {
                                    if (vars.player.inventory[w].isEmpty) {
                                        vars.player.inventory[w].isEmpty = false;
                                        vars.player.inventory[w].object = {"inventoryId":w,"id":item.id,"amount":maint.isReachable(item.amount) ? item.amount : null};
                                        ir = false;
                                        break;
                                    }
                                }
                            }
                            vars.player.money -= item.cost;
                            this.keeper.money += item.cost;
                        }else{
                            maint.genTextAlert("Your inventory is full","rgba(255,200,200,1.0)",vars);
                            break;
                        }


                        break;


                }else{
                    maint.genTextAlert("You can't aford this","rgba(255,200,200,1.0)",vars);
                    break;
                }

            }
        }
    };

    //Upgrade stats
    funcs.UpgradeMenu = function(vars) {
        this.sprite = new funcs.Sprite([{"px":0,"py":0,"pw":vars.upgradeMenuSprite.width,"ph":vars.upgradeMenuSprite.height,"w":vars.upgradeMenuSprite.width,"h":vars.upgradeMenuSprite.height}],vars.upgradeMenuSprite);
        this.x = 200;
        this.y = 200;
        this.type = "upgrade";
        this.health  = {"x":16,"y":86,"w":50,"h":35};
        this.stamina = {"x":94,"y":88,"w":26,"h":12};
        this.mana    = {"x":154,"y":88,"w":35,"h":12};

    };
    funcs.UpgradeMenu.prototype.drawUpgrades = function(vars) {
        this.sprite.draw(vars.gameTime,vars.ctx,this.x,this.y);
    };
    funcs.UpgradeMenu.prototype.updateUpgradeMenu = function(vars) {
        if(vars.events.isLeftMouseReleased){
            if(vars.mouseX > this.x && vars.mouseX < this.x + 204 && vars.mouseY > this.y + 66 && vars.mouseY < this.y + 143) {
                if (vars.player.upgradePoints > 0 && vars.mouseX > this.health.x + this.x && vars.mouseX < this.health.x + this.health.w + this.x && vars.mouseY > this.health.y + this.y && vars.mouseY < this.health.y + this.health.h + this.y) {
                    vars.player.maxHp += 10 * (vars.player.level * 0.2);
                    vars.player.upgradePoints--;
                } else if (vars.player.upgradePoints > 0 && vars.mouseX > this.stamina.x + this.x && vars.mouseX < this.stamina.x + this.stamina.w + this.x && vars.mouseY > this.stamina.y + this.y && vars.mouseY < this.stamina.y + this.stamina.h + this.y) {
                    vars.player.maxStamina += 10 * (vars.player.level * 0.2);
                    vars.player.fightingSkill++;
                    vars.player.defSkill++;
                    vars.player.upgradePoints--;
                } else if (vars.player.upgradePoints > 0 && vars.mouseX > this.mana.x + this.x && vars.mouseX < this.mana.x + this.mana.w + this.x && vars.mouseY > this.mana.y + this.y && vars.mouseY < this.mana.y + this.mana.h + this.y) {
                    vars.player.maxMana += 10 * (vars.player.level * 0.2);
                    vars.player.magicSkill++;
                    vars.player.upgradePoints--;
                    vars.player.lastManaLoose = vars.lastTime;
                } else if (vars.player.upgradePoints < 1) {
                    maint.genTextAlert("You don't have enough upgrade points", "rgba(255,200,200,1.0)", vars);
                }
            }else if(vars.mouseX > this.x + 192 && vars.mouseX < this.x + 231 && vars.mouseY > this.y + 8 && vars.mouseY < this.y + 55){
                vars.upgradeMenu.isOpened = false;
            }
        }
    };


    funcs.isShopOpened = function(menues) {
        var temp = false;
        jQuery.each(menues,function (index,value) {
            if(maint.isReachable(value) && value.menu.type === "shop"){
                temp = true;
                return true;
            }
        });
        return temp;
    };
    funcs.findShop = function(menues) {
        var temp = null;
        jQuery.each(menues,function (index,value) {
            if(value.menu.type === "shop"){
                temp = value;
                return true;
            }
        });
        return temp;
    };
    funcs.findShopById = function(id,menues) {
        var temp = null;
        jQuery.each(menues,function (index,value) {
            if(value.id === id){
                temp = value.menu;
                return false;
            }
        });
        return temp;
    };
    funcs.findNpcByShopId = function(id,npcs) {
        var temp = null;
        jQuery.each(npcs,function (index,value) {
            if(index === id){
                temp = value;
                return false;
            }
        });
        return temp;
    };

    //Quests
    funcs.Quest = function(name,desc,loot,action){
        this.name = name;
        this.description = desc;
        this.checking = action;
        this.loot = loot;
        this.isFinished = false;
    };


    funcs.Tile = function(tx, ty, tt) {
        this.x = tx;
        this.y = ty;
        this.type = tt;
        this.roof = null;
        this.roofType = 0;
        this.eventEnter = null;
        this.itemStack = null;
    };

    funcs.Map = function(tileW,tileH) {
        this.map = [];
        this.w = 0;
        this.h = 0;
        this.tileH = tileW;
        this.tileW = tileH;
        this.objects = [];
        this.items = [];
        this.enemies = [];
        this.delpoyables = [];
        this.spawners = [];
    };
    funcs.Map.prototype.build = function (data,w,h) {
        this.w = w;
        this.h = h;

        if(data.length !== w*h){
            return false;
        }
        this.map.length = 0;
        for(var y = 0;y < this.h;y++){
            for(var x = 0;x < this.w;x++){
                this.map.push(data[maint.toIndex(x,y,this)]);
            }
        }
        return true;
    };

    //Camera functions
    funcs.Rectangle = function(left, top, width, height){
        this.left = left || 0;
        this.top = top || 0;
        this.width = width || 0;
        this.height = height || 0;
        this.right = this.left + this.width;
        this.bottom = this.top + this.height;
    };
    funcs.Rectangle.prototype.set = function(left, top, /*optional*/width, /*optional*/height){
        this.left = left;
        this.top = top;
        this.width = width || this.width;
        this.height = height || this.height;
        this.right = (this.left + this.width);
        this.bottom = (this.top + this.height);
    };
    funcs.Rectangle.prototype.within = function(r) {
        return (r.left <= this.left &&
            r.right >= this.right &&
            r.top <= this.top &&
            r.bottom >= this.bottom);
    };
    funcs.Rectangle.prototype.overlaps = function(r) {
        return (this.left < r.right &&
            r.left < this.right &&
            this.top < r.bottom &&
            r.top < this.bottom);
    };



    //Camera
    // Camera constructor
    funcs.Camera = function(xView, yView, canvasWidth, canvasHeight, worldWidth, worldHeight){
        // possibles axis to move the camera
        this.AXIS = {
            NONE: "none",
            HORIZONTAL: "horizontal",
            VERTICAL: "vertical",
            BOTH: "both"
        };
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
        this.axis = this.AXIS.BOTH;

        // object that should be followed
        this.followed = null;

        // rectangle that represents the viewport
        this.viewportRect = new funcs.Rectangle(this.xView, this.yView, this.wView, this.hView);

        // rectangle that represents the world's boundary (room's boundary)
        this.worldRect = new funcs.Rectangle(0, 0, worldWidth, worldHeight);

    };
    // gameObject needs to have "x" and "y" properties (as world(or room) position)
    funcs.Camera.prototype.follow = function(gameObject, xDeadZone, yDeadZone){
        this.followed = gameObject;
        this.xDeadZone = xDeadZone;
        this.yDeadZone = yDeadZone;
    };
    funcs.Camera.prototype.update = function(){
        // keep following the player (or other desired object)
        if(this.followed != null){
            if(this.axis === this.AXIS.HORIZONTAL || this.axis === this.AXIS.BOTH)
            {
                // moves camera on horizontal axis based on followed object position
                if(this.followed.x - this.xView  + this.xDeadZone > this.wView)
                    this.xView = this.followed.x - (this.wView - this.xDeadZone);
                else if(this.followed.x  - this.xDeadZone < this.xView)
                    this.xView = this.followed.x  - this.xDeadZone;

            }
            if(this.axis === this.AXIS.VERTICAL || this.axis === this.AXIS.BOTH)
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

        // don't var camera leaves the world's boundary
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

    return funcs;
});