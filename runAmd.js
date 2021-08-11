var definitions = [];
var define = function(name, requirements, f) {
    definitions.push({
        name: name,
        requirements: requirements.slice(2),
        execute: f
    });
};
var startApp = function() {
    var registeredModules = {
        'std/CodinGame': {
            readline: readline,
            print: print,
            printErr: printErr
        }
    };
    var canBeRegistered = function(requirements) {
        for (var idx = 0 ; idx !== requirements.length ; ++idx) {
            if (!registeredModules.hasOwnProperty(requirements[idx]))
                return false;
        }
        return true;
    };
    while (true) {
        let registeredOne = false;
        for (var idx = 0 ; idx !== definitions.length ; ++idx) {
            var def = definitions[idx];
            if (registeredModules.hasOwnProperty(def.name)) continue;
            if (!canBeRegistered(def.requirements)) continue;
            registeredOne = true;
            printErr('Registration of ' + def.name);
            var registration = {};
            var params = [null, registration];
            for (var rid = 0 ; rid !== def.requirements.length ; ++rid) {
                params.push(registeredModules[def.requirements[rid]]);
            }
            def.execute.apply(/*this*/null, params);
            registeredModules[def.name] = registration;
            printErr('Registration done');
        }
        if (!registeredOne) {
            printErr('Following modules cannot be registered properly:');
            for (const def of definitions) {
                if (registeredModules.hasOwnProperty(def.name)) continue;
                const missingRequirements = def.requirements.filter(n => !registeredModules.hasOwnProperty(n));
                printErr(`- ${def.name} has missing dependencies ${JSON.stringify(missingRequirements)}`);
            }
            throw 'Unable to register';
        }
    }
};

//CODE//

startApp();