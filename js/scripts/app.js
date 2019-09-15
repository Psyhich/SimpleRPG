define(["main","maintenance","classes","vars","jquery"],function (main, maint, classes, vars,jquery) {
    jquery(function () {
        var variables = vars;
        var jQuery = jquery;
        var mainMeth = main;
        var maintMeth = maint;
        var allClasses = classes;
        mainMeth.load(vars);

        //console.log("Loaded");
        var checkExis = setInterval(function() {
            if (vars.isLoaded) {
                console.log("Exists!");
                clearInterval(checkExis);


                if (!variables.isPhone) {
                    canvas.addEventListener('mousemove', function (e) {
                        var v2 = maintMeth.getMousePos(e, variables);
                        variables.mouseX = v2.x;
                        variables.mouseY = v2.y;
                    });
                } else {
                    /*vars.canvas.ontouchstart = maintMeth.startTouch(e);
                    vars.canvas.ontouchmove = maintMeth.moveTouch(e);

                    vars.canvas.ontouchend = maintMeth.endTouch(e);
                    vars.canvas.ontouchcancel = maintMeth.endTouch(e);*/
                }
                canvas.onmousewheel = function (e) {
                    variables.events.deltaY = e.deltaY;
                };
                jQuery(window).keydown(function (e) {
                    if (e.keyCode === 87) {
                        variables.isWPressed = true;
                    }
                    if (e.keyCode === 83) {
                        variables.isSPressed = true;
                    }
                    if (e.keyCode === 65) {
                        variables.isAPressed = true;
                    }
                    if (e.keyCode === 68) {
                        variables.isDPressed = true;
                    }
                    if (e.keyCode === 32) {
                        variables.isSpacePressed = true;
                    }
                    if (e.keyCode === 70) {
                        variables.isFPressed = true;
                    }
                    if (e.keyCode === 89) {
                        variables.isYPressed = true;
                    }
                    if (e.keyCode >= 48 && e.keyCode <= 57) {
                        variables.numbers[e.keyCode - 48] = true;
                    }
                    if (e.keyCode === 69) {
                        variables.isEPressed = true;
                    }
                    if (e.keyCode === 85) {
                        variables.isUPressed = true;
                    }
                    if (e.keyCode === 84) {
                        variables.isTPressed = true;
                    }
                    if (e.keyCode === 27) {
                        variables.isEscPressed = true;
                    }
                });
                jQuery(window).keyup(function (e) {
                    if (e.keyCode === 87) {
                        variables.isWPressed = false;
                    }
                    if (e.keyCode === 83) {
                        variables.isSPressed = false;
                    }
                    if (e.keyCode === 65) {
                        variables.isAPressed = false;
                    }
                    if (e.keyCode === 68) {
                        variables.isDPressed = false;
                    }
                    if (e.keyCode === 32) {
                        variables.isSpacePressed = false;
                    }
                    if (e.keyCode === 80) {
                        variables.isPPressed = !variables.isPPressed;
                    }
                    if (e.keyCode === 73) {
                        variables.isITogled = !variables.isITogled;
                    }
                    if (e.keyCode === 70) {
                        variables.isFPressed = false;
                    }
                    if (e.keyCode === 89) {
                        variables.isYPressed = false;
                    }
                    if (e.keyCode >= 48 && e.keyCode <= 57) {
                        variables.numbers[e.keyCode - 48] = false;
                    }
                    if (e.keyCode === 69) {
                        variables.isEPressed = false;
                    }
                    if (e.keyCode === 85) {
                        variables.isUPressed = false;
                    }
                    if (e.keyCode === 84) {
                        variables.isTPressed = false;
                    }
                    if (e.keyCode === 27) {
                        variables.isEscPressed = false;
                    }
                });
                /*window.onbeforeunload = function (e){
                    //maintMeth.saveGame(variables);
                    //e.returnValue = "Save Game?";
                    return "Save Game?";
                };*/
                window.vars = variables;
                window.maint = maintMeth;
                window.main = mainMeth;

                setInterval(mainMeth.run, 60, variables, maint);

            }
        }, 100);
    });
});