define(["main","maintenance","classes","vars","jquery"],function (main, maint, classes, vars,jquery) {
    jquery(function () {
        let variables = vars;
        let jQuery = jquery;
        let mainMeth = main;
        let maintMeth = maint;
        let allClasses = classes;

        mainMeth.load(vars);

        window.vars = vars;

        var checkExis = setInterval(function() {
            if (vars.events.isLoaded) {
                console.log("Exists!");
                clearInterval(checkExis);

                canvas.onmousewheel = function (e) {
                    variables.events.deltaY = e.deltaY;
                };
                jQuery(window).keydown(function (e) {
                    switch (e.keyCode) {
                        case vars.events.keys.upButton:
                            vars.events.keys.isUpPressed = true;
                        break;
                        case vars.events.keys.downButton:
                            vars.events.keys.isDownPressed = true;
                        break;
                        case vars.events.keys.leftButton:
                            vars.events.keys.isLeftPressed = true;
                        break;
                        case vars.events.keys.rightButton:
                            vars.events.keys.isRightPressed = true;
                        break;
                        case vars.events.keys.inventoryButton:
                            vars.events.keys.isInventoryPressed = true;
                        break;
                        case vars.events.keys.skillsButton:
                            vars.events.keys.isSkillsPressed = true;
                        break;
                        case vars.events.keys.interactButton:
                            vars.events.keys.isInteractPressed = true;
                        break;
                        case vars.events.keys.magicButton:
                            vars.events.keys.isMagicPressed = true;
                        break;
                        case vars.events.keys.runButton:
                            vars.events.keys.isRunPressed = true;
                        break;
                        case vars.events.keys.attackButton:
                            vars.events.keys.isAttackPressed = true;
                        break;
                        case vars.events.keys.pauseButton:
                            vars.events.keys.isPausePressed = true;
                        break;
                    }

                    //Numbers check
                    for(let numberToUse = 0; numberToUse < 10;numberToUse++){
                        if(e.keyCode - 48 === numberToUse && !vars.events.keys.isNumLockUsed){
                            vars.events.keys["is" + numberToUse + "Pressed"] = true;
                        }else if(e.keyCode - 96 === numberToUse && vars.events.keys.isNumLockUsed){
                            vars.events.keys["is" + numberToUse + "Pressed"] = true;
                        }
                    }
                    //Escape check
                    if (e.keyCode === 27) {
                        vars.events.keys.isEscPressed = true;
                    }
                });
                jQuery(window).keyup(function (e) {
                    //Checking for buttons
                    switch (e.keyCode) {
                        case vars.events.keys.upButton:
                            vars.events.keys.isUpPressed = false;
                            vars.events.keys.isUpReleased = true;
                        break;
                        case vars.events.keys.downButton:
                            vars.events.keys.isDownPressed = false;
                            vars.events.keys.isDownReleased = true;
                        break;
                        case vars.events.keys.leftButton:
                            vars.events.keys.isLeftPressed = false;
                            vars.events.keys.isLeftReleased = true;
                        break;
                        case vars.events.keys.rightButton:
                            vars.events.keys.isRightPressed = false;
                            vars.events.keys.isRightReleased = true;
                        break;
                        case vars.events.keys.inventoryButton:
                            vars.events.keys.isInventoryPressed = false;
                            vars.events.keys.isInventoryReleased = true;
                        break;
                        case vars.events.keys.skillsButton:
                            vars.events.keys.isSkillsPressed = false;
                            vars.events.keys.isSkillsReleased = true;
                        break;
                        case vars.events.keys.interactButton:
                            vars.events.keys.isInteractPressed = false;
                            vars.events.keys.isInteractReleased = true;
                        break;
                        case vars.events.keys.magicButton:
                            vars.events.keys.isMagicPressed = false;
                            vars.events.keys.isMagicReleased = true;
                        break;
                        case vars.events.keys.runButton:
                            vars.events.keys.isRunPressed = false;
                            vars.events.keys.isRunReleased = true;
                        break;
                        case vars.events.keys.attackButton:
                            vars.events.keys.isAttackPressed = false;
                            vars.events.keys.isAttackReleased = true;
                        break;
                        case vars.events.keys.pauseButton:
                            vars.events.keys.isPausePressed = false;
                            vars.events.keys.isPauseReleased = true;
                        break;
                    }

                    //Numbers check
                    for(let numberToUse = 0; numberToUse < 10;numberToUse++){
                        if(e.keyCode - 48 === numberToUse && !vars.events.keys.isNumLockUsed){
                            vars.events.keys["is" + numberToUse + "Released"] = true;
                            vars.events.keys["is" + numberToUse + "Pressed"] = false;
                        }else if(e.keyCode - 96 === numberToUse && vars.events.keys.isNumLockUsed){
                            vars.events.keys["is" + numberToUse + "Released"] = true;
                            vars.events.keys["is" + numberToUse + "Pressed"] = false;
                        }
                    }

                    if (e.keyCode === 27) {
                        vars.events.keys.isEscPressed = false;
                        vars.events.keys.isEscReleased = true;
                    }
                });
                canvas.addEventListener('mousemove', function (e) {
                    let v2 = maintMeth.getMousePos(e, variables);
                    variables.mouseX = v2.x;
                    variables.mouseY = v2.y;
                });


                //Assigning global variables for debug
                window.vars = variables;
                window.maint = maintMeth;
                window.main = mainMeth;

                setInterval(mainMeth.run, 60, variables, maint);

            }
        }, 100);
    });
});