define(["maintenance","vars"],function (maint,vars) {
    let classes = {};

    //Should be initialised before work
    let itemList = null;
    classes.ini = function(receivedItemList){
        itemList = receivedItemList;
    };


    //Sprite
    classes.Sprite = class{
        constructor(data,img) {
            if(img === null || img === undefined){

            }else {
                this.animated = data.length > 1;
                this.frameCount = data.length;
                this.duration = 0;
                this.loop = true;
                this.img = img;
                if (data.length > 1) {
                    for (let i in data) {
                        if (typeof data[i].d === undefined) {
                            data[i].d = 100;
                        }
                        this.duration += data[i].d;
                        if (typeof data[i].loop !== undefined) {
                            this.loop = !!data[i].loop;
                        }
                    }
                }
                this.frames = data;
                this.w = 0;
                this.h = 0;
            }
        };

        drawWH(t,ctx,x,y,w,h) {
            let frameId = 0;
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
            this.w = w;
            this.h = h;
        };

        draw(t,ctx,x,y){
            let frameId = 0;
            if(!this.loop && this.animated && t >= this.duration){
                frameId = (this.frames.length - 1);
            }else if(this.animated){
                t = t % this.duration;
                var totalD = 0;

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
                this.frames[frameId].pw,this.frames[frameId].ph);
            this.w = this.frames[frameId].pw;
            this.h = this.frames[frameId].ph;
        };

        getWidth() {
            let output = 0;
            this.frames.forEach((val) => {output = val.w > output ? val.w : output;});
            return output;
        };
        getHeight() {
            let output = 0;
            this.frames.forEach((val) => {output = val.h > output ? val.h : output;});
            return output;
        };

    };

    //Items classes
    classes.Item = class{
        constructor(name, sprite, description, cost, meta, action, type, effects){
            this.name = name;
            this.sprite = sprite;
            this.description = description;
            this.cost = cost;
            this.meta = maint.isReachable(meta) ? meta : {};
            this.action = maint.isReachable(action) ? action : null;
            this.type = maint.isReachable(type) ? type :"item";
            this.effects = maint.isReachable(effects) ? effects : {};
        };

        //Use item if possible function
        use(user) {
            if(this.action !== null){
                this.action(user);
            }
        };

    };

    /**
     * @inherits Item
     * @param effects is an object that contains all effects such as dmg buffs debuffs and etc.
     * */
    classes.Weapon = class extends classes.Item{
        constructor(name,sprite,description,cost,meta,action,effects){
            super(name,sprite,description,cost,meta,action,"weapon");
            this.effects = effects;
        };

    };

    /**
    * @inherits Item
    */
    classes.Armor = class extends classes.Item{
        constructor(name,sprite,description,cost,meta,action,effects){
            super(name,sprite,description,cost,meta,action,"armor");
            this.effects = effects;
        };
    };

    /**
     * @inherits Item
     */
    classes.Helmet = class extends classes.Item{
        constructor(name,sprite,description,cost,meta,action,effects){
            super(name,sprite,description,cost,meta,action,"helmet");
            this.effects = effects;
        };
    };

    /**
     * @inherits Item
     */
    classes.Ring = class extends classes.Item{
        constructor(name,sprite,description,cost,meta,action,effects){
            super(name,sprite,description,cost,meta,action,"ring");
            this.effects = effects;
        };
    };

    /**
     * @inherits Item
     */
    classes.Shield = class extends classes.Item{
        constructor(name,sprite,description,cost,meta,action,effects){
            super(name,sprite,description,cost,meta,action,"shield");
            this.effects = effects;
        };
    };

    /**
     * @inherits Item
     */
    classes.Ammo = class extends classes.Item{
        constructor(name,sprite,description,cost,meta,action,effects){
            super(name,sprite,description,cost,meta,action,"ammo");
            this.meta = maint.isReachable(meta) ? this.meta : {"isStackable": true, "amount": 1};
            this.effects = effects;
        };
    };

    //Skill
    classes.Skill = class{
        /**
         *   @param name
         *   @param description
         *   @param cooldown
         *   @param action: is for checking before and action of this skill
         *   @param learnChecker: is for checking if user is valid for learning this skill input function should be with only argument (user)
         *   @param sprite
         * */
        constructor(name,description,cooldown,action,learnChecker,sprite) {
            this.name = name;
            this.description = description;
            this.action = action;
            this.learnChecker = learnChecker;
            this.sprite = sprite;
            this.cooldown = cooldown;
            this.lastUsed = 0;
            this.type = "skill";
        };

        use(user) {
            this.action(user);
        };

        learn = function(user) {
            let isAvailableToLearn = false;
            //Checking for duplicates
            if(user.skills.length > 0){
                for(let value of user.skills){
                    if(value === this){
                        maint.genTextAlert("You already learned that skill.","rgba(255,100,100,1.0)",vars);
                        isAvailableToLearn = false;
                        return false;
                    }else if(value !== this){
                        isAvailableToLearn = true;
                    }
                }
            }else{
                isAvailableToLearn = true;
            }
            if(isAvailableToLearn){
                //Using this object method to check if user is valid to learn
                if(this.learnChecker(user)){
                    user.skills[user.skills.length] = this;
                    maint.genTextAlert("Learned: " + this.name, "rgba(255,200,200,1.0)", vars);
                }

            }
            return isAvailableToLearn;
        };
    };

    //Effects
    classes.Effect = class{
        /**
         * @param name name
         * @param description
         * @param time Means the time that should pass to remove effect
         * @param action action that will happen in this effect should be like: action(user){your code}
         * @param isAura if it's true it will ignore repeatTime and do action every iteration
         * @param repeatTime if isAura is false it will repeat action after this time
         * @param user the entity that has its effect
         * */
        constructor(name, description, time, action, isAura,repeatTime,user){
            this.name = name;
            this.description = description;
            this.action = action;
            //Time
            this.delpTime = vars.lastTime;
            this.time = time;
            this.isAura = isAura;
            this.repeatTime = isAura ? null : repeatTime;
            this.lastAction = isAura ? null : 0;
            this.user = user;
        }

        /**
         * If this effect time ends this method will giveout false
         *
         * */
            act(){
            if(this.delpTime + this.time <= vars.lastTime){
                console.log(this.name + " ended");
                return false;
            }else {
                if(this.isAura || this.lastAction + this.repeatTime <= vars.lastTime){
                    this.action(this.user);
                    //console.log(vars.lastTime - this.lastAction + " " + this.repeatTime);
                    this.lastAction = !this.isAura ? vars.lastTime : null;
                    return true;
                }

            }
        }
    };

    //Inventory class
    classes.Inventory = class {
        //Main constructor(seams obvious)
        constructor(){
            this.x = 850;
            this.y = 10;
            this.w = 48;
            this.h = 48;
            this.slots = [];
            this.equipment = {};
            this.verticalPosition = 0;//TODO implement this + make numbers of inventory slots in player class
            this.chosen = null;/** chosen is an copy of slot that contains chosen item*/

            //Making inventory slots
            this.slots.length = 12;
            for(let i = 0;i < this.slots.length;i++){
                this.slots[i] = {
                    "lx":this.getPosByID(i).x - this.x,
                    "ly":this.getPosByID(i).y - this.y,
                    "x":this.getPosByID(i).x,
                    "y":this.getPosByID(i).y,
                    "inventoryID":i,
                    "object":null,
                    "type":"item"
                };
            }

            //Assigning equipment slots
            let equps = ["weapon","shield","armor","helmet","ring"];//Don't change the queue
            for(let index in equps){
                let value = equps[index];
                this.equipment[value] = {
                    "lx": 27 + (index * 48 + (index !== 4 ? (index * 3) : 0)),
                    "ly": 445,
                    "x": 27 + (index * 48 + (index !== 4 ? (index * 3) : 0)),
                    "y": 445,
                    "w": this.w,
                    "h": this.h,
                    "type": value,
                    "object":null,
                    "inventoryID":value
                };
            }

        }

        //Main funcs
        render = function(){
            //Drawing the sprite of inventory
            vars.ctx.drawImage(vars.assets.inventorySprite,this.x,this.y);

            //Drawing all inventory items //TODO implement many slots feature
            for(let value of this.slots) {
                let item = value.object;


                if(
                    maint.isReachable(item) &&
                    ((value.inventoryID >= (this.verticalPosition * 3) &&
                        value.inventoryID <= this.verticalPosition * 3 + 9) ||
                            (vars.events.isMouseWithInv && value === this.chosen)
                    )
                ){
                    value.x = this.getPosByID(value.inventoryID).x;
                    value.y = this.getPosByID(value.inventoryID).y;
                    //Getting orinal item
                    let origin = itemList.getItem(item.id);
                    //Getting width and height of item
                    let w = origin.sprite.getWidth();
                    let h = origin.sprite.getHeight();

                    //Setting it's width and height if it's bigger
                    w = w > this.w ? this.w : w;
                    h = h > this.h ? this.h : h;

                    //Drawing (if it's chosen, drawing on mouse position)
                    if(maint.isReachable(this.chosen) && item === this.chosen.object && vars.events.isMouseWithInv){
                        origin.sprite.drawWH(vars.gameTime, vars.ctx, vars.mouseX - w / 2, vars.mouseY - h / 2, w, h);
                    }else {
                        //Getting stats to center the item in tile of inventory
                        let tw = this.w / 2 - w / 2;
                        let th = this.h / 2 - h / 2;

                        origin.sprite.drawWH(vars.gameTime, vars.ctx, value.x + tw, value.y + th, w, h);
                    }
                }
            }

            //Drawing all equipment items
            for(let index in this.equipment){
                let value = this.equipment[index];

                value.x = this.getPosByID(value.inventoryID).x;
                value.y = this.getPosByID(value.inventoryID).y;
                //Getting item
                let item = this.getSlot(index).object;

                //If it exist draw it
                if(maint.isReachable(item)){
                    //Creating original copy of item
                    let origin = itemList.getItem(item.id);

                    //Getting width and height of item
                    let w = origin.sprite.getWidth();
                    let h = origin.sprite.getHeight();

                    //Setting it's width and height if it's bigger
                    w = w > this.w ? this.w : w;
                    h = h > this.h ? this.h : h;

                    //Drawing item
                    if(item === this.chosen.object && vars.events.isMouseWithInv){
                        origin.sprite.drawWH(
                            vars.gameTime,
                            vars.ctx,
                            vars.mouseX - w / 2,
                            vars.mouseY - h / 2,
                            w,
                            h
                        );
                    }else {
                        //Getting needed distance to reach center of inventory slot
                        let tw = this.w / 2 - w / 2;
                        let th = this.h / 2 - h / 2;

                        origin.sprite.drawWH(
                            vars.gameTime,
                            vars.ctx,
                            value.x + tw,
                            value.y + th,
                            w,
                            h
                        );
                    }
                }

            }

            //If item is chosen draw it's info
            if(maint.isReachable(this.chosen) && maint.isReachable(this.chosen.object)){
                let origin = itemList.getItem(this.chosen.object.id);

                //Setting text colors and font
                vars.ctx.srtokeStyle = "rgba(255,255,255,1.0)";
                vars.ctx.fillStyle = "rgba(255,255,255,1.0)";
                vars.ctx.font = "15px Arial";

                vars.ctx.beginPath();

                //Stating stats //TODO make function stateInfo() for items
                if(origin.type === "weapon"){
                    vars.ctx.font = "12px Arial";
                    if(origin.effects.weaponType === "melee"){
                        vars.ctx.fillText(origin.name,this.x + 30,this.y + 314);
                        vars.ctx.fillText("Has: " + origin.effects.dmg + " damage",this.x + 30,this.y + 326);
                        vars.ctx.fillText("Has: " + origin.effects.dmgType + " attack",this.x + 30,this.y + 338);
                        vars.ctx.fillText("It's: " + origin.effects.weaponType + " weapon",this.x + 30,this.y + 350);
                        vars.ctx.fillText("It's cost: " + origin.cost + " coins",this.x + 30,this.y + 362);
                        vars.ctx.fillText("It's attack speed: " + origin.effects.cooldown * 10,this.x + 30,this.y + 374);
                    }if(origin.effects.weaponType === "ranged"){
                        vars.ctx.fillText(origin.name,this.x + 30,this.y + 314);
                        vars.ctx.fillText("Has: " + origin.effects.dmg + " damage",this.x + 30,this.y + 326);
                        vars.ctx.fillText("Has: " + origin.effects.dmgType + " attack",this.x + 30,this.y + 338);
                        vars.ctx.fillText("It's: " + origin.effects.weaponType + " weapon",this.x + 30,this.y + 350);
                        vars.ctx.fillText("It's cost: " + origin.cost + " coins",this.x + 30,this.y + 362);
                        vars.ctx.fillText("It's attack speed: " + origin.effects.cooldown * 10,this.x + 30,this.y + 374);
                    }if(origin.effects.weaponType === "staff"){
                        vars.ctx.fillText(origin.name,this.x + 30,this.y + 314);
                        maint.wrapText(vars.ctx,origin.description,this.x + 30,this.y + 326,150,13);
                    }
                    vars.ctx.font = "15px Arial";
                }else if(origin.type === "armor"){
                    vars.ctx.fillText(origin.name,this.x + 30,this.y + 320);
                    vars.ctx.fillText("Has: " + origin.effects.def + " defence",this.x + 30,this.y + 335);
                    vars.ctx.fillText("It's cost: " + origin.cost + " coins",this.x + 30,this.y + 365);
                }else if(origin.type === "helmet"){
                    vars.ctx.fillText(origin.name,this.x + 30,this.y + 320);
                    vars.ctx.fillText("Has: " + origin.effects.def + " defence",this.x + 30,this.y + 335);
                    vars.ctx.fillText("It's cost: " + origin.cost + " coins",this.x + 30,this.y + 365);
                }else if(origin.type === "shield"){
                    vars.ctx.fillText(origin.name,this.x + 30,this.y + 320);
                    vars.ctx.fillText("It protect from " + origin.effects.def + " points of damage",this.x + 30,this.y + 335);
                    vars.ctx.fillText("It's cost: " + origin.cost + " coins",this.x + 30,this.y + 365);
                }else if(origin.type === "ring"){
                    vars.ctx.fillText(origin.name,this.x + 30,this.y + 320);
                    vars.ctx.fillText("It buffs " + origin.effects.buff + " stats",this.x + 30,this.y + 335);
                    vars.ctx.fillText("It's value: " + origin.effects.buffValue,this.x + 30,this.y + 350);
                    vars.ctx.fillText("It's cost: " + origin.cost + " coins",this.x + 30,this.y + 365);
                }else if(origin.type === "consumable"){
                    vars.ctx.fillText(origin.name,this.x + 30,this.y + 320);
                    vars.ctx.fillText("When consumed: ",this.x + 30,this.y + 335);
                    //vars.ctx.fillText("" + origin.effects.actions,this.x + 30,this.y + 350);
                    vars.ctx.fillText("It's cost: " + origin.cost + " coins",this.x + 30,this.y + 365);
                }else if(origin.type === "skillBook"){
                    vars.ctx.fillText(origin.name,this.x + 30,this.y + 320);
                }else if(origin.type === "ammo"){
                    vars.ctx.fillText(origin.name,this.x + 30,this.y + 320);
                    vars.ctx.fillText("It's amount: " + this.chosen.object.meta.amount,this.x + 30,this.y + 350);
                    //TODO fix arrows
                }

                vars.ctx.fill();
                vars.ctx.closePath();

            }

            //Draw money count and upgrade points
            vars.ctx.font = "12px Arial";
            vars.ctx.fillStyle = "rgba(0,0,0,1.0)";
            vars.ctx.fillText("Money: " + vars.player.money,this.x + 185,this.y + 135);
            maint.wrapText(vars.ctx,"Available upgrade points: " + vars.player.upgradePoints,this.x + 185,this.y + 195,90,13);


            //Draw level

            //Background
            vars.ctx.fillStyle = "rgba(200,200,200,1.0)";
            vars.ctx.beginPath();
            vars.ctx.rect(this.x + 185,this.y + 165,95,10);
            vars.ctx.closePath();
            vars.ctx.fill();

            //Front
            vars.ctx.fillStyle = "rgba(100,100,100,1.0)";
            vars.ctx.beginPath();
            vars.ctx.rect(this.x + 185,this.y + 165,95 * vars.player.exp / vars.player.expToNextLevel,10);
            vars.ctx.closePath();
            vars.ctx.fill();
        };

        //Inventory functions
        /**
        * Swaps two items by their slot ID's
        */
        swapItems = function(id1,id2){
            if(id1 !== id2){
                let slot1 = this.getSlot(id1);
                let slot2 = this.getSlot(id2);
                let slot1Types = slot1.type.split(","),
                    slot2Types = slot2.type.split(",");

                let item1Types = maint.isReachable(slot1.object) ? itemList.getItem(slot1.object.id).type.split(",") : [],
                    item2Types = maint.isReachable(slot2.object) ? itemList.getItem(slot2.object.id).type.split(",") : [];

                let check1 = false,
                    check2 = false;

                if(maint.isReachable(slot1.object)){
                    item1Types.forEach((value1) =>{
                        slot2Types.forEach((value2) => {
                            check1 = (value1 === value2) || value2 === "item";
                        });
                    });
                }else{
                    slot1Types.forEach((value1) =>{
                        slot2Types.forEach((value2) => {
                            check1 = (value1 === value2) || value2 === "item";
                        });
                    });
                }

                if(maint.isReachable(slot2.object)){
                    item2Types.forEach((value1) =>{
                        slot1Types.forEach((value2) => {
                            check2 = (value1 === value2) || value2 === "item";
                        });
                    });
                }else{
                    slot2Types.forEach((value1) =>{
                        slot1Types.forEach((value2) => {
                            check2 = (value1 === value2) || value2 === "item";
                        });
                    });
                }


                //Swapping items if some check is done
                if(
                    (check1 && check2) ||
                    (check1 && !maint.isReachable(slot2.object)) ||
                    (check2 && !maint.isReachable(slot1.object))
                ){
                    slot1.object = [slot2.object, slot2.object = slot1.object][0];
                    //Checking if neither first or second object is chosen
                    this.chosen = (slot1 === this.chosen || slot2 === this.chosen) ? slot1 : this.chosen;
                }else{
                    maint.genTextAlert("This " + (maint.isReachable(slot1.object) ? itemList.getItem(slot1.object.id).type : itemList.getItem(slot2.object.id).type) + " doesn't fit here", "red", vars);
                }

               // }

            }
        };

        /**
         * Adds item to inventory not to equipment!
         * */
        addItem = function(item){
            //Checking if item is ammo or is stackable

                let originItem = itemList.getItem(item.id);
                if(item.type === "ammo" || item.isStackable) {
                    //Searching if there is an item to stack with
                    for (let value of this.slots) {
                        if (maint.isReachable(value.object)) {
                            let originStoredItem = itemList.getItem(value.object.id);
                            if (originItem === originStoredItem) {
                                if (maint.isReachable(value.object.meta)) {
                                    value.meta.amount = maint.isReachable(value.object.meta.amount) ? value.meta.amount + item.meta.amount : 1 + item.meta.amount;
                                    return true;
                                } else {
                                    value.meta = {"amount": 1 + item.meta.amount};
                                    return true;
                                }
                            }

                        }
                    }
                }
                //If not found than trying to add item
                for(let value of this.slots){
                    if(!maint.isReachable(value.object)){
                        value.object = {"id": item.id,"x":0,"y":0};
                        return true;
                    }
                }

                maint.genTextAlert("You don't have place in your inventory","red",vars);
                return false;

        };

        /**
         * Removes any item both from inventory or equipment(be careful)
         * */
        removeItem = function(ID){
            let item = this.getSlot(ID).object;
            this.chosen.object = item === this.chosen.object ? null : this.chosen.object; //Checking if this item exist in chosen
            item = null;
        };

        //Simple getters
        getPosByID = function(id){
            let pos = {
                "x":-10000,
                "y":0
            };
            //Getting ID of tile in inventory
            if(
                !isNaN(id) &&
                (id >= this.verticalPosition * 3 && id < (this.verticalPosition * 3 + 9))
            ){
                let count = 0;
                for(let y = 0;y < 3;y++){
                    for(let x = 0;x < 3;x++){
                        if(id - this.verticalPosition * 3 === count){
                            pos.x = this.x + 28 + x * this.w;
                            pos.y = this.y + 127 + y * this.h;
                            return pos;
                        }
                        count++;
                    }
                }
            }else if(
                !isNaN(id) &&
                id >= 0 && id <= this.slots.length
            ){
                return pos;
            }else if(
                isNaN(id) &&
                maint.isReachable(this.equipment[id]))
            {
                pos.x = this.equipment[id].lx + this.x;
                pos.y = this.equipment[id].ly + this.y;
                return pos;
            }else{
                console.log("Not an ID");
                return null;
            }
        };

        //Inventory getters
        getSlot = function(id){
            if(!isNaN(id) && id >= 0 && id < this.slots.length){
                return this.slots[id];
            }else if(isNaN(id) && maint.isReachable(this.equipment[id])){
                return this.equipment[id];
            }else{
                console.error("Wrong object ID");
                return null;
            }
        };

        //Equipment getters
        getWeapon = function(){
            return maint.isReachable(this.equipment.weapon) ? itemList.getItem(10) : null; //Getting hands item(yea it's item)
        };
        getArmor = function(){
            return maint.isReachable(this.equipment.armor) ? this.equipment.armor : null;
        };
        getHelmet = function(){
            return maint.isReachable(this.equipment.helmet) ? this.equipment.helmet : null;
        };
        getRing = function(){
            return maint.isReachable(this.equipment.ring) ? this.equipment.ring : null;
        };
        getShield = function(){
            return maint.isReachable(this.equipment.shield) ? this.equipment.shield : null;
        };


    };

    //Player class
    classes.Player = class {
        //Main constructor
        constructor(name,id){
            //Main
            this.name = name;
            this.id = id;

            //Initialising variables
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
            this.inventory = new classes.Inventory();

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

            //Setting exp for next level by algorithm
            this.nextLevel();

        }

        //Main functions
        mainActions = function(vars){
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
                    if (this.attack === true && this.timeFromLastAttack >= itemList.getItem(this.inventory.getWeapon().id).effects.cooldown) {
                        let playerWeapon = this.inventory.getWeapon();
                        let origin = itemList.getItem(playerWeapon.id);
                        if(origin.effects.weaponType === "melee"){
                            if (origin.effects.dmgType === "point") {
                                maint.checkPlayerThanPointAttack(vars);
                            } else if (origin.effects.dmgType === "area") {
                                maint.checkPlayerThanAreaAttack(vars);
                            }
                            this.timeFromLastAttack = 0;
                        }
                        else if(origin.effects.weaponType === "ranged" && maint.isThereAmmo(this, vars)){
                            let x2 = this.x + Math.cos((-45  + (-this.rangedAttackBox) * 45)  * (Math.PI / 180)) * (this.size + 10);    // unchanged
                            let y2 = this.y - Math.sin((-45  + (-this.rangedAttackBox) * 45)  * (Math.PI / 180)) * (this.size + 10);    // minus on the Sin

                            let speedX = maint.getVelocityTo(this,{x:x2,y:y2}).x * 250;
                            let speedY = maint.getVelocityTo(this,{x:x2,y:y2}).y * 250;

                            x2 = this.x + Math.cos((-45  + (-this.rangedAttackBox) * 45)  * (Math.PI / 180)) * (this.size - 40);
                            y2 = this.y - Math.sin((-45  + (-this.rangedAttackBox) * 45)  * (Math.PI / 180)) * (this.size - 40);

                            classes.genProjectile(vars,1,x2,y2,speedX,speedY,false);
                            this.timeFromLastAttack = 0;
                        }
                        else if(origin.effects.weaponType === "staff"){
                            this.timeFromLastAttack = origin.action(this) === true ? 0 : this.timeFromLastAttack;
                        }
                        this.isAttackDrawn = true;

                    }
                    for (let i = 0; i < vars.map.enemies.length; i++){
                        if (vars.map.enemies[i].isDead === true) {
                            maint.dropRandom(vars.map.enemies[i],vars);
                            //For quests
                            let enem = itemList.getEnemy(vars.map.enemies[i].id);
                            if(maint.isReachable(this[enem.name + "Counter"])){
                                this[enem.name + "Counter"]++;
                            }
                            vars.map.enemies.splice(i, 1);
                            i--;

                        }
                    }
                }
                this.attack = false;
            }

            //Buffs, debuffs and other temporary effects
            this.operateActions();

            //Checking for injuries and beginning health regeneration after 9 seconds
            if(this.lastHealth === this.hp) {
                if (this.lastInjury + 9000 < vars.lastTime && this.hp < this.hp / 2) {
                    maint.restoreHealth(this, 0.05);
                }
            }
            //Checking if player mana changed and regenerating it after 4 seconds
            if(this.lastMana === this.mana){
                if(this.lastManaInjury + 4000 < vars.lastTime){
                    maint.restoreMana(this,0.2);
                }
            }else {
                this.lastManaInjury = vars.lastTime;
                this.lastMana = this.mana;
            }

            //Checking for death and dropping all inventory items
            if(this.hp <= 0){
                this.isDead = true;
                this.color = "rgba(255,255,255,0.4)";
                this.deathTime = vars.lastTime;
                this.hp = this.maxHp / 4;

                for(let value of this.inventory.slots){
                    if(maint.isReachable(value.object)){
                        maint.createInTheWorld(this.x,this.y,value.object.id,vars);
                        value.isEmpty = true;
                        value.object = null;
                    }
                }
            }
            //If player dead waiting 15 seconds and then revieving him
            if(this.isDead === true){
                if(this.deathTime + 15000 < vars.lastTime){
                    this.isDead = false;
                    this.color = "rgba(255,255,255,1.0)";
                }
            }

        };
        movement = function(keys,dt){
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
        interactions = function(){

        };

        //Operating with player actions //TODO make actions system
        operateActions = function(){
            for(let i = 0;i < this.actions.length;i++) {
                if(!this.actions[i].act()){
                    this.actions.splice(i,1);
                }
            }
        };
        addAction = function(name, action, fullTime, timeBetweenActions, isRepeated){

        };

        nextLevel = function(){
            let level = this.level + 1;
            this.expToNextLevel = 100 * (level * level) - (100 * level)
        };


    };

    //Like bullet
    classes.Delpoyable = class{
        constructor(x,y,vx,vy,id,time){
            this.x = 0 + x;
            this.y = y;
            this.vx = vx;
            this.vy = vy;
            this.id = id;
            this.time = time;
            this.living = 0;
            this.lastDest = {};
        };

        update = function(dt) {
            if(maint.isReachable(this.isMovingTowards) && this.isMovingTowards === true){
                this.x += Math.abs(this.vx) * maint.getVelocityTo(this.lastDest,this).x * dt;
                this.y += Math.abs(this.vy) * maint.getVelocityTo(this.lastDest,this).y * dt;
            }else{
                this.x += this.vx * dt;
                this.y += this.vy * dt;
            }
            if(maint.isReachable(itemList.getProjectile(this.id))){
                itemList.getProjectile(this.id).action(this);
            }
            this.living += dt;

        };

        moveTowards = function(x,y) {
            this.lastDest = {"x":x,"y":y};
            this.isMovingTowards = true;
        };
    };

    classes.genProjectile = function(vars,id,x,y,vx,vy,moveTowards,destX,destY){
        vars.map.delpoyables[vars.map.delpoyables.length] = new classes.Delpoyable(
            x,
            y,
            vx,
            vy,
            id,
            itemList.getProjectile(id).time
        );
        if(
            maint.isReachable(moveTowards) &&
            moveTowards === true &&
            maint.isReachable(destX) &&
            maint.isReachable(destY)
        ){
            vars.map.delpoyables[vars.map.delpoyables.length - 1].moveTowards(destX,destY);
        }
    };

    //Menus

    //Shop
    classes.Shop = class{
        constructor(items,x,y,type,money,keeper){
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

        drawShop(vars){
            vars.ctx.drawImage(vars.assets.shopSprite,this.x,this.y);
            let count = 0;
            for(let i = this.pos;i < this.pos + 4;i++){
                if(maint.isReachable(this.items[i]) && maint.isReachable(this.items[i].sprite)){
                    if(count === 0){
                        this.items[i].sprite.draw(vars.gameTime,vars.ctx,this.x + 26,this.y + 43);
                        vars.ctx.fillStyle = "rgba(0,0,0,1.0)";
                        vars.ctx.font = "10px Arial";
                        maint.wrapText(vars.ctx,this.items[i].description,this.x + 70,this.y + 60,215,15);
                        maint.wrapText(vars.ctx,this.items[i].cost,this.x + 300,this.y + 60,215,15);
                        vars.ctx.drawImage(vars.assets.acceptButtonSprite,this.buttons[0].x, this.buttons[0].y);

                    }else{
                        this.items[i].sprite.draw(vars.gameTime,vars.ctx,this.x + 26,this.y + (95 * count) + 43);
                        vars.ctx.fillStyle = "rgba(0,0,0,1.0)";
                        maint.wrapText(vars.ctx,this.items[i].description,this.x + 70,this.y + 90 * count + 70,215,15);
                        maint.wrapText(vars.ctx,this.items[i].cost,this.x + 300,this.y + 100 * count + 50,215,15);
                        vars.ctx.drawImage(vars.assets.acceptButtonSprite,this.buttons[count].x, this.buttons[count].y);
                    }
                }
                count++;
            }
            vars.ctx.font = "12px Arial";
            vars.ctx.fillStyle = "rgba(255,255,255,1.0)";
            maint.wrapText(vars.ctx,this.keeper.name + "'s money: " + this.keeper.money,this.x + 20,this.y + 30,100,10);
        };

        updateShop(vars){
            if(vars.events.isWheel === true){
                if( vars.mouseX > this.x && vars.mouseX < this.x + this.w && vars.mouseY > this.y && vars.mouseY < this.y + this.h){
                    if(vars.events.deltaY > 0 && this.pos + 4 + 1 < this.items.length){
                        this.pos += 1;
                    }else if(vars.events.deltaY < 0 && this.pos - 1 >= 0){
                        this.pos -= 1;
                    }else{

                    }
                }
            }
            for(let i = 0;i < 4;i++) {
                if(vars.events.isLeftMouseReleased && vars.mouseX > this.buttons[i].x && vars.mouseX < this.buttons[i].x + 14 && vars.mouseY > this.buttons[i].y && vars.mouseY < this.buttons[i].y + 14){
                    if(vars.player.money >= this.items[i + this.pos].cost){

                        let item = this.items[i + this.pos];

                        let isAdded = vars.player.inventory.addItem(item);
                        if(isAdded) {
                            vars.player.money -= item.cost;
                            this.keeper.money += item.cost;
                        }
                        break;
                    }else{
                        maint.genTextAlert("You can't aford this","rgba(255,200,200,1.0)",vars);
                        break;
                    }

                }
            }
        };
    };
    //Shop getters
    classes.isShopOpened = function(menues) {
        var temp = false;
        jQuery.each(menues,function (index,value) {
            if(maint.isReachable(value) && value.menu.type === "shop"){
                temp = true;
                return true;
            }
        });
        return temp;
    };
    classes.findShop = function(menues) {
        var temp = null;
        jQuery.each(menues,function (index,value) {
            if(value.menu.type === "shop"){
                temp = value;
                return true;
            }
        });
        return temp;
    };
    classes.findShopById = function(id,menues) {
        var temp = null;
        jQuery.each(menues,function (index,value) {
            if(value.id === id){
                temp = value.menu;
                return false;
            }
        });
        return temp;
    };
    classes.findNpcByShopId = function(id,npcs) {
        var temp = null;
        jQuery.each(npcs,function (index,value) {
            if(index === id){
                temp = value;
                return false;
            }
        });
        return temp;
    };

    //Upgrade stats menu
    classes.UpgradeMenu = class{
        constructor(vars) {
            this.sprite = new classes.Sprite([{"px":0,"py":0,"pw":vars.assets.upgradeMenuSprite.width,"ph":vars.assets.upgradeMenuSprite.height,"w":vars.assets.upgradeMenuSprite.width,"h":vars.assets.upgradeMenuSprite.height}],vars.assets.upgradeMenuSprite);
            this.x = 200;
            this.y = 200;
            this.type = "upgrade";
            this.health  = {"x":16,"y":86,"w":50,"h":35};
            this.stamina = {"x":94,"y":88,"w":26,"h":12};
            this.mana    = {"x":154,"y":88,"w":35,"h":12};

        };

        drawUpgrades = function(vars) {
            this.sprite.draw(vars.gameTime,vars.ctx,this.x,this.y);
        };

        updateUpgradeMenu = function(vars) {
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
    };

    //Quests
    classes.Quest = function(name,desc,loot,action){
        this.name = name;
        this.description = desc;
        this.checking = action;
        this.loot = loot;
        this.isFinished = false;
    };

    //Tiles
    classes.Tile = class{
        constructor(tx, ty, tt) {
            this.x = tx;
            this.y = ty;
            this.type = tt;
            this.roof = null;
            this.roofType = 0;
            this.eventEnter = null;
            this.itemStack = null;
        };
    };


    classes.Map = class{
        constructor(tileW,tileH) {
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

        build(data,w,h) {
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
    };

    //Camera functions
    classes.Rectangle = class{
        constructor(left, top, width, height){
            this.left = left || 0;
            this.top = top || 0;
            this.width = width || 0;
            this.height = height || 0;
            this.right = this.left + this.width;
            this.bottom = this.top + this.height;
        };

        set(left, top, /*optional*/width, /*optional*/height){
            this.left = left;
            this.top = top;
            this.width = width || this.width;
            this.height = height || this.height;
            this.right = (this.left + this.width);
            this.bottom = (this.top + this.height);
        };

        within(r) {
            return (r.left <= this.left &&
                r.right >= this.right &&
                r.top <= this.top &&
                r.bottom >= this.bottom);
        };

        overlaps(r) {
            return (this.left < r.right &&
                r.left < this.right &&
                this.top < r.bottom &&
                r.top < this.bottom);
        };
    };

    //Camera
    // Camera constructor
    classes.Camera = class{
        constructor(xView, yView, canvasWidth, canvasHeight, worldWidth, worldHeight){
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
            this.viewportRect = new classes.Rectangle(this.xView, this.yView, this.wView, this.hView);

            // rectangle that represents the world's boundary (room's boundary)
            this.worldRect = new classes.Rectangle(0, 0, worldWidth, worldHeight);

        };

        follow(gameObject, xDeadZone, yDeadZone){
            this.followed = gameObject;
            this.xDeadZone = xDeadZone;
            this.yDeadZone = yDeadZone;
        };

        update(){
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
    };

    return classes;
});
