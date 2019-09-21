define([],function () {
    var maint = {};
    //General func
    maint.isReachable = function(item) {
        if(item !== null && item !== undefined){
            return true
        }else if(item === null && item === undefined){
            return false;
        }else{
            //console.log("What a fuck are you doing???");
        }
    };

    //Other functions
    maint.getMousePos =  function(e,vars){
        var rect = vars.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        }
    };

    maint.getCordsOfPlayerAttackBox =  function(player,vars){
        if(vars.player.velX > 0){
            vars.player.directionx = 1;
        }else if(vars.player.velX < 0) {
            vars.player.directionx = -1;
        }else if(vars.player.velX === 0){
            vars.player.directionx = 0;
        }if(vars.player.velY < 0) {
            vars.player.directiony = -1;
        }else if(vars.player.velY > 0) {
            vars.player.directiony = 1;
        }else if(vars.player.velY === 0){
            vars.player.directiony = 0;
        }

        if(vars.player.directionx === 0 && vars.player.directiony === 1){
            vars.player.attackBox = 7;
        }else if(vars.player.directionx === 1 && vars.player.directiony === 1){
            vars.player.attackBox = 8;
        }else if(vars.player.directionx === 1 && vars.player.directiony === 0){
            vars.player.attackBox = 5;
        }else if(vars.player.directionx === 1 && vars.player.directiony === -1){
            vars.player.attackBox = 2;
        }else if(vars.player.directionx === 0 && vars.player.directiony === -1){
            vars.player.attackBox = 1;
        }else if(vars.player.directionx === -1 && vars.player.directiony === -1){
            vars.player.attackBox = 0;
        }else if(vars.player.directionx === -1 && vars.player.directiony === 0){
            vars.player.attackBox = 3;
        }else if(vars.player.directionx === -1 && vars.player.directiony === 1){
            vars.player.attackBox = 6;
        }
    };
    maint.setPlayerRangedAttackBox = function(player){
        var ranged = player.attackBox;
        switch (ranged) {
            case 3:{
                ranged = 7;
                break;
            }
            case 5:{
                ranged = 3;
                break;
            }
            case 7:{
                ranged = 5;
                break;
            }
            case 8:{
                ranged = 4;
                break;
            }
        }
        return ranged;
    };
    //Player attacking
    maint.checkPlayerThanPointAttack = function(vars){
        var minHp = 0;
        var indexOfEnemy = null;

        jQuery.each(vars.map.enemies,function (index,value) {
            if(value.isDead === false && maint.circleToRectIntersection(value.x,value.y,maint.getEnemy(value.id,vars.enemyTypes).size,vars.playerAttackBox.x,vars.playerAttackBox.y,vars.playerAttackBox.w,vars.playerAttackBox.h)){
                if(value.hp <= minHp){
                    minHp = value.hp;
                    indexOfEnemy = index;

                }
                indexOfEnemy = index;

            }
        });

        if(maint.isReachable(indexOfEnemy) ){
            if(maint.getDef(vars.map.enemies[indexOfEnemy]) < vars.player.weapon.dmg){
                vars.map.enemies[indexOfEnemy].hp -= (vars.player.weapon.dmg - maint.getDef(vars.map.enemies[indexOfEnemy]));
                maint.genFloatingNumber(vars.map.enemies[indexOfEnemy].x,vars.map.enemies[indexOfEnemy].y,(vars.player.weapon.dmg - maint.getDef(vars.map.enemies[indexOfEnemy])),"rgba(0,0,0,1.0)",15,vars)
            }else if(maint.getDef(vars.map.enemies[indexOfEnemy]) >= vars.player.weapon.dmg){
                vars.map.enemies[indexOfEnemy].hp -= 1;
                maint.genFloatingNumber(vars.map.enemies[indexOfEnemy].x,vars.map.enemies[indexOfEnemy].y,1,"rgba(0,0,0,1.0)",15)
            }
            if(vars.map.enemies[indexOfEnemy].hp <= 0){vars.map.enemies[indexOfEnemy].isDead = true;}
        }

    };
    maint.checkPlayerThanAreaAttack = function(vars){
        jQuery.each(vars.map.enemies,function (index,value) {
            if(!value.isDead && maint.circleToRectIntersection(value.x,value.y,maint.getEnemy(value.id,vars.enemyTypes).size,vars.playerAttackBox.x,vars.playerAttackBox.y,vars.playerAttackBox.w,vars.playerAttackBox.h)){
                if(maint.getDef(value) < maint.getItem(vars.player.weapon.id,vars).dmg){
                    value.hp -= maint.getItem(vars.player.weapon.id,vars).dmg - maint.getDef(value);
                    maint.genFloatingNumber(value.x,value.y,(maint.getItem(vars.player.weapon.id,vars).dmg - maint.getDef(value)),"rgba(0,0,0,1.0)",15,vars);
                }else if(maint.getDef(value) >= maint.getItem(vars.player.weapon.id,vars).dmg){
                    value.hp -= 1;
                    maint.genFloatingNumber(value.x,value.y,1,"rgba(0,0,0,1.0)",15)
                }
            }
            if(value.hp <= 0){value.isDead = true;}
        });
    };

    //Input
    maint.getClickedNumber =  function(numbers,vars) {
        for(let numberToUse = 0;numberToUse < 10;numberToUse++){
            if (vars.events.keys["is" + numberToUse + "Released"]){
                return numberToUse;
            }
        }
    };

    maint.makeSpriteSheetArayInLine = function(count,img) {
        var buffMass = [];
        var h = img.height;
        var w = img.width;
        var pw = w / count;
        for(var i = 0;i < count;i++){
            buffMass[i] = {"px":i*pw,"py":0,"pw":pw,"ph":h,"w":pw,"h":h,"img":img};
        }

        return buffMass;

    };

    maint.getRandomTOrF = function () {
        return Math.random() < 0.5
    };

    maint.copy = function(value){
        return jQuery.extend(true,{},value);
    };

    //Getters for enemies items projectiles
    //Items
    maint.getItem = function(id,vars){return maint.isReachable(vars.itemTypes[id]) ? vars.itemTypes[id] : null;};
    maint.createInTheWorld = function(x,y,id,vars,other){
        var temp = {"x":x,"y":y,"id":id};
        if(maint.getItem(id,vars).meta){
            var meta = maint.getItem(id,vars).meta;
            for(var i in meta){
                temp[i] = meta[i];
            }
        }
        vars.map.items[vars.map.items.length] = temp;
        if(maint.isReachable(other)){
            for(var i in other){
                temp[i] = other[i];
            }
        }
    };
    //Enemies
    maint.getEnemy = function(id,enemyTypes){return enemyTypes[id];};
    maint.genEnemy = function(id,x,y,vars) {
        var temp = maint.getEnemy(id,vars.enemyTypes);
        vars.map.enemies[vars.map.enemies.length] = {
            "x": x,
            "y": y,
            "velocity": temp.randomSpeed ? Math.random() * (temp.rndSpdFinish - temp.rndSpdStart) + temp.rndSpdStart : temp.velocity,
            "id": temp.id,
            "hp": temp.hp,
            "maxHp": temp.maxHp,
            "mana": maint.isReachable(temp.mana) ? temp.mana : undefined,
            "stamina": maint.isReachable(temp.stamina) ? temp.stamina : undefined,
            "equipment":[
                {"type":"helmet","object": maint.isReachable(temp.helmet) ? temp.helmet : null},
                {"type":"armor","object": maint.isReachable(temp.armor) ? temp.armor : null},
                {"type":"weapon","object": maint.isReachable(temp.weapon) ? temp.weapon : null},
                {"type":"ring","object": maint.isReachable(temp.ring) ? temp.ring : null}],
            "isDead": false,
            "timeFromLastAttack": 0,
        };
    };
    //Projectiles
    maint.getProjectile = function(id,projectileTypes){return projectileTypes[id];};
    //Skills
    maint.getSkill = function(id,skillTypes){return skillTypes[id];};
    //Quests
    maint.getQuest = function(id,questTypes){return questTypes[id];};


    //Map and tiles
    maint.toIndex = function(x,y,map){
        return((y * map.w) + x);
    };

    //Inventory functions
    maint.getPosById = function(id,vars) {
        var v = {
            "x":0,
            "y":0
        };
        if((id >= 0 && id < 9) && !isNaN(id)){

            var count = 0;
            for(var x = 0;x < 3;x++){
                for(var y = 0;y < 3;y++){
                    if(id === count){
                        v.x = vars.inventory.x + 28 + x * vars.inventory.w;
                        v.y = vars.inventory.y + 127 + y * vars.inventory.h;
                        return v;
                    }
                    count++;
                }
            }
        }else if(isNaN(id)){
            jQuery.each(vars.player.equipment,function (index,value){
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
    };

    //Monster drops
    maint.dropRandom = function(enemy,vars) {
        var drop = maint.chooseDrops(enemy,vars);
        if(maint.isReachable(drop)){
            maint.createInTheWorld(enemy.x,enemy.y,drop.id,vars);
        }
        if(maint.isReachable(maint.getEnemy(enemy.id,vars.enemyTypes).exp)){
            var temp = jQuery.extend(true,{},vars.sExp);
            temp.x = enemy.x;
            temp.y = enemy.y;
            temp.count = maint.getEnemy(enemy.id,vars.enemyTypes).exp;
            maint.createInTheWorld(temp.x - 3,temp.y,temp.id,vars);
            vars.map.items[vars.map.items.length - 1].count = temp.count;
        }if(maint.isReachable(maint.getEnemy(enemy.id,vars.enemyTypes).money)){
            var temp = jQuery.extend(true,{},vars.sMoney);
            temp.type = "money";
            temp.x = enemy.x;
            temp.y = enemy.y;
            temp.count = maint.getEnemy(enemy.id,vars.enemyTypes).money;
            maint.createInTheWorld(temp.x + 3,temp.y,temp.id,vars);
            vars.map.items[vars.map.items.length - 1].count = temp.count;
        }
    };
    maint.chooseDrops = function(enemy,vars) {
        var rand = Math.floor(Math.random() * 100) + 1;
        var drop;
        var enemyT = maint.getEnemy(enemy.id,vars.enemyTypes);
        if(rand > 50 && rand <= 70){
            drop = maint.getRandomDrop(enemyT.commonDrops.concat(vars.uniCommonDrops));
        }else if(rand > 70 && rand <= 85){
            drop = maint.getRandomDrop(enemyT.rareDrops.concat(vars.uniRareDrops));
        }else if(rand > 85 && rand <= 98){
            drop = maint.getRandomDrop(enemyT.epicDrops.concat(vars.uniEpicDrops));
        }else if(rand > 98 && rand <= 100){
            drop = maint.getRandomDrop(enemyT.legendaryDrops.concat(vars.uniLegendaryDrops));
        }else{
            drop = null;
        }
        return drop;

    };
    maint.getRandomDrop = function(dropArr) {
        var randDrop = Math.round(Math.random() * dropArr.length);
        return dropArr[randDrop];

    };

    //Save games
    maint.loadGame = function(camera,vars) {
        var temp = JSON.parse(localStorage.getItem("saveGame"));
        if(maint.isReachable(temp) && maint.isReachable(temp.player) && maint.isReachable(temp.map) && maint.isReachable(temp.config)){
            vars.player = temp.player;
            vars.map = temp.map;
            vars.isLoadedFromSaveGame = true;
            vars.config = temp.config;
            vars.camera.follow(vars.player,vars.canvas.width/2,vars.canvas.height/2);
        }

    };
    maint.saveGame = function(vars){
        var temp = {"player":vars.player,"map":vars.map,"config":vars.config};
        delete localStorage["saveGame"];
        localStorage.setItem("saveGame",JSON.stringify(temp));

    };
    maint.clearLoad = function() {
        delete localStorage["saveGame"];
    };

    //In game things
    //Floating numbers
    maint.genFloatingNumber = function(x,y,number,color,size,vars){
        if(maint.isReachable(x) && maint.isReachable(y) && maint.isReachable(number) && maint.isReachable(color)){
            vars.flotNumb[vars.flotNumb.length] = {
                "x":x,
                "y":y,
                "number":number,
                "color":color,
                "size":size,
                "deployed":vars.now
            }
        }else{
            console.log("There is null number");
        }
    };

    //Text alerts
    maint.genTextAlert = function(text,color,vars) {
        if(maint.isReachable(text) && maint.isReachable(color) && vars.config.alerts){
            vars.inGameAlerts[vars.inGameAlerts.length] = {
                "text":text,
                "time":0,
                "color":color,
            };
        }else{
            return false;
        }
    };
    maint.operateTextAlerts = function(vars) {
        if(vars.inGameAlerts.length >= 1 && vars.config.alerts){
            if(maint.isReachable(vars.inGameAlerts[0])){
                vars.ctx.drawImage(vars.alertSprite,canvas.width/2 - vars.alertSprite.width - 100,10,200,50);
                vars.ctx.font = "13px san-serif";
                vars.ctx.fillStyle = vars.inGameAlerts[0].color;
                vars.ctx.fillText(vars.inGameAlerts[0].text,canvas.width/2 - vars.alertSprite.width - 90,40);
                vars.inGameAlerts[0].time += (vars.now - vars.lastTime) / 1000;
            }if(vars.inGameAlerts[0].time >= 1.5){
                vars.inGameAlerts.shift();
            }

        }

    };

    //Geters for player or entity stats
    //Defence
    maint.getDef = function(user,vars){
        var def = 0;
        for(var i = 0;i < user.equipment.length;i++){
            if(maint.isReachable(user.equipment[i]) && maint.isReachable(user.equipment[i].object) && user.equipment[i].type !== "shield"){
                def += maint.isReachable(maint.getItem(user.equipment[i].object.id,vars).def) ? maint.getItem(user.equipment[i].object.id,vars).def : 0;
            }
        }
        def += maint.isReachable(user.def) ? user.def : 0;
        /*if(maint.isReachable(user.armor) && maint.isReachable(maint.getItem(user.armor.id,vars).def)){
            def += maint.getItem(user.armor.id,vars).def;
        }if(maint.isReachable(user.helmet) && maint.isReachable(user.helmet.id)){
            def += maint.getItem(user.helmet.id,vars).def;
        }if(maint.isReachable(user.skillDef)){
            def += user.skillDef;
        }if(maint.isReachable(user.ring) && maint.isReachable(user.ring.id)){
            def += maint.getItem(user.armor.id,vars).def;
        }if(maint.isReachable(user.weapon) && maint.isReachable(user.weapon.id)){
            def += maint.getItem(user.armor.id,vars).def;
        }if(maint.isReachable(user.def)){
            def += user.def;
        }*/
        return def;
    };
    maint.getFullDef = function(user,vars) {
        var def = 0;
        for(var i = 0;i < user.equipment.length;i++){
            if(maint.isReachable(user.equipment[i]) && maint.isReachable(user.equipment[i].object) && maint.isReachable(user.equipment[i].object)){
                def += maint.isReachable(maint.getItem(user.equipment[i].object.id,vars).def) ? maint.getItem(user.equipment[i].object.id,vars).def : 0;
            }
        }
        def += maint.isReachable(user.def) ? user.def : 0;
        /*if(maint.isReachable(user.armor) && maint.isReachable(maint.getItem(user.armor.id,vars).def)){
            def += maint.getItem(user.armor.id,vars).def;
        }if(maint.isReachable(user.helmet) && maint.isReachable(user.helmet.id)){
            def += maint.getItem(user.helmet.id,vars).def;
        }if(maint.isReachable(user.skillDef)){
            def += user.skillDef;
        }if(maint.isReachable(user.ring) && maint.isReachable(user.ring.id)){
            def += maint.getItem(user.armor.id,vars).def;
        }if(maint.isReachable(user.weapon) && maint.isReachable(user.weapon.id)){
            def += maint.getItem(user.armor.id,vars).def;
        }if(maint.isReachable(user.def)){
            def += user.def;
        }if(maint.isReachable(user.shield) && maint.isReachable(user.shield.id)){
            def += maint.getItem(user.shield.id).def;
        }*/
        return def;
    };
    //Attack
    maint.getAttack = function(user) {
        var attack = 0;
        if(maint.isReachable(user.armor) && maint.isReachable(user.armor.dmg)){
            attack += user.armor.dmg;
        }if(maint.isReachable(user.helmet) && maint.isReachable(user.helmet.dmg)){
            attack += user.helmet.dmg;
        }if(maint.isReachable(user.skillAttack)){
            attack += user.skillAttack;
        }if(maint.isReachable(user.ring) && maint.isReachable(user.ring.dmg)){
            attack += user.ring.dmg;
        }if(maint.isReachable(user.weapon) && maint.isReachable(user.weapon.dmg)){
            attack += user.weapon.dmg;
        }if(maint.isReachable(user.shield) && maint.isReachable(user.shield.dmg)){
            attack += user.shield.dmg;
        }
        return attack;
    };
    //Resist
    maint.getResist = function(user,resist) {
        var resistNum = 0;
        var resistance = resist + "Resist"
        if(maint.isReachable(user.armor) && maint.isReachable(user.armor[resistance])){
            resistNum += user.armor[resistance];
        }if(maint.isReachable(user.helmet) && maint.isReachable(user.helmet[resistance])){
            resistNum += user.helmet[resistance];
        }if(maint.isReachable(user[resistance])){
            resistNum += user[resistance];
        }if(maint.isReachable(user.ring) && maint.isReachable(user.ring[resistance])){
            resistNum += user.ring[resistance];
        }if(maint.isReachable(user.weapon) && maint.isReachable(user.weapon[resistance])){
            resistNum += user.weapon[resistance];
        }if(maint.isReachable(user.shield) && maint.isReachable(user.shield[resistance])){
            resistNum += user.shield[resistance];
        }
        return resistNum;
    };
    //Speed
    maint.getSpeed = function(user){
        var speed = 0;
        for(var i = 0;i < user.equipment.length;i++){
            if(maint.isReachable(user.equipment[i]) && maint.isReachable(user.equipment[i].object)){
                speed += maint.isReachable(maint.getItem(user.equipment[i].object.id,vars).spd) ? maint.getItem(user.equipment[i].object.id,vars).spd : 0;
            }
        }
        if(maint.isReachable(user.speed)){
            speed += user.speed;
        }
        return speed;
    };
    maint.minusSpeed = function(user,value){
        if(maint.isReachable(user.speed) && user.speed - value < 0){
            user.speed -= value
        }
    };

    //Levels
    maint.nextLevel = function(level){
        return 100 * (level * level) - (100 * level)
    };

    //Quests
    maint.genRandomQuest = function(npc,id,x,y,map,vars) {
        var rarity = genRarity();
        var treasure = [];
        if(rarity === "common"){
            treasure[treasure.length] = vars.sMoney;
            treasure[treasure.length - 1].count = 100;

            treasure[treasure.length] = vars.sExp;
            treasure[treasure.length - 1].count = 100;
        }else if(rarity === "rare"){
            treasure[treasure.length] = vars.sMoney;
            treasure[treasure.length - 1].count = 300;

            treasure[treasure.length] = vars.sExp;
            treasure[treasure.length - 1].count = 300;
        }else if(rarity === "epic"){
            treasure[treasure.length] = vars.sMoney;
            treasure[treasure.length - 1].count = 1000;

            treasure[treasure.length] = vars.sExp;
            treasure[treasure.length - 1].count = 1000;
        }else if(rarity === "legendary"){
            treasure[treasure.length] = vars.sMoney;
            treasure[treasure.length - 1].count = 2000;

            treasure[treasure.length] = vars.sExp;
            treasure[treasure.length - 1].count = 2000;
        }

        vars.map.items[vars.map.items.length] = jQuery.extend(true,{},vars.sScroll);
        vars.map.items[vars.map.items.length - 1].x = x;
        vars.map.items[vars.map.items.length - 1].y = y;
        vars.map.items[vars.map.items.length - 1].item = maint.genRanQuestItem(rarity,npc.givenQuests);
        vars.map.items[vars.map.items.length - 1].playerID = vars.player.id;
        vars.map.items[vars.map.items.length - 1].name = "Quest for " + vars.player.name;
        vars.map.items[vars.map.items.length - 1].itemId = npc.givenQuests;
        vars.map.items[vars.map.items.length - 1].type = "quest";
        vars.map.items[vars.map.items.length - 1].treasure = treasure;
        npc.givenQuests++;



    };
    maint.genRarity = function() {
        var rand = Math.floor(Math.random() * 100) + 1;
        var rarity;
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
    };
    maint.genRanQuestItem = function(rarity,id,cQuestItems,vars) {
        var rand = Math.floor(Math.random() * cQuestItems.length);
        var item = {
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
            vars.uniCommonDrops[vars.uniCommonDrops.length] = item;
        }else if(rarity === "rare"){
            vars.uniRareDrops[vars.uniRareDrops.length] = item;
        }else if(rarity === "epic"){
            vars.uniEpicDrops[vars.uniEpicDrops.length] = item;
        }else if(rarity === "legendary"){
            vars.uniLegendaryDrops[vars.uniLegendaryDrops.length] = item;
        }
        return item;
    };
    maint.dropTreasure = function(item,x,y,map,vars) {
        jQuery.each(item.treasure,function(index,value) {
            maint.createInTheWorld(x,y,value.id,map,vars);
        });
    };
    maint.removeQuestItem = function(item,uniCommonDrops,uniRareDrops,uniEpicDrops,uniLegendaryDrops) {
        var isChecked = false;
        jQuery.each(uniCommonDrops,function(index,value) {
            if(isReachable(value.id) && value.id === item.id){
                uniCommonDrops.splice(index,1);
                index--;
                isChecked = true;
            }
        });
        if(isChecked){
            jQuery.each(uniRareDrops,function(index,value) {
                if(isReachable(value.id) && value.id === item.id){
                    uniRareDrops.splice(index,1);
                    index--;
                    isChecked = true;
                }
            });
        }if(isChecked){
            jQuery.each(uniEpicDrops,function(index,value) {
                if(isReachable(value.id)  && value.id === item.id){
                    uniEpicDrops.splice(index,1);
                    index--;
                    isChecked = true;
                }
            });
        }if(isChecked){
            jQuery.each(uniLegendaryDrops,function(index,value) {
                if(isReachable(value.id) && value.id === item.id){
                    uniLegendaryDrops.splice(index,1);
                    index--;
                    isChecked = true;
                }
            });
        }
    };

    //Random functions))
    maint.isIncOrDecr = function() {
        var a = Math.random();
        if(a > 0.5){
            return -1;
        }else{
            return 1;
        }
    };

    //Collisions
    maint.cirToCirCol = function(x1,y1,r1,x2,y2,r2) {
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)) <= r1 + r2;
    };
    maint.circleToRectIntersection = function(circleX,circleY,circleR,rectX,rectY,rectW,rectH){
        var DeltaX = circleX - Math.max(rectX, Math.min(circleX, rectX + rectW));
        var DeltaY = circleY - Math.max(rectY, Math.min(circleY, rectY + rectH));
        return (DeltaX * DeltaX + DeltaY * DeltaY) < (circleR * circleR);
    };
    maint.rectToRectColl = function(rect1x,rect1y,rect1w,rect1h,rect2x,rect2y,rect2w,rect2h){
        return (rect1x < rect2x + rect2w && rect1x + rect1w > rect2x && rect1y < rect2y + rect2h && rect1y + rect1h > rect2y);
    };

    //Math))
    maint.getVelocityTo = function(obj1,obj2) {
        var dx = obj1.x - obj2.x;
        var dy = obj1.y - obj2.y;

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
        return {"x":dx,"y":dy};


    };

    //Other
    maint.restoreHealth = function(entity,value){
        entity.hp += value;
        if(entity.hp > entity.maxHp){
            entity.hp = entity.maxHp;
        }
    };
    maint.wrapText = function(context, text, x, y, maxWidth, lineHeight){
        var a = text + "";
        var words = a.split(' ');
        var line = '';
        var lineCount = 0;
        var i;
        var test;
        var metrics;

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
    };

    //For weapons interactions
    maint.isThereAmmo = function(player,vars){
        var weapon = maint.getItem(player.weapon.id,vars);
        for(var i = 0;i < 8;i++){
            var temp = maint.isReachable(player.inventory[i].object) ? maint.getItem(player.inventory[i].object.id,vars) : null;
            if(maint.isReachable(temp)
                && maint.isReachable(player.inventory[i].object.amount)
                && temp.ammoFor === weapon.id
                && player.inventory[i].object.amount > 0){
                player.inventory[i].object.amount--;
                return true;
            }
        }
        return false;
    };

    //For drawing
    maint.isEnemInRange = function (item,camera) {
        return maint.isReachable(item) && maint.circleToRectIntersection(item.x, item.y, item.size, camera.xView, camera.yView, camera.wView, camera.hView);
    };
    maint.isTileInRange = function (tile,camera,tileW,tileH) {
        return (maint.isReachable(tile) && maint.rectToRectColl(tile.x * tileW,tile.y * tileH,tileW,tileH,camera.xView,camera.yView,camera.wView,camera.hView));
    };
    maint.isItemInRange = function (item,itemW,itemH,camera) {
        return (maint.isReachable(item) && (maint.rectToRectColl(item.x,item.y,itemW,itemH,camera.xView,camera.yView,camera.wView,camera.hView)));
    };
    //Also load image


    return maint;
});