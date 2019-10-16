requirejs.config({
    baseUrl:"js",
    paths:{
        vars:"scripts/vars",
        classes:"scripts/classes",
        maintenance:"scripts/maintenance",
        main:"scripts/main",
        jquery:"libs/jquery",
        map:"scripts/map"
    }
});

requirejs(["scripts/app"]);
// requirejs(["libs/jquery"]);