/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/entities/Boid.ts":
/*!******************************!*\
  !*** ./src/entities/Boid.ts ***!
  \******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _geometry__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./geometry */ "./src/entities/geometry.ts");
/* harmony import */ var _World__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./World */ "./src/entities/World.ts");
var __spreadArrays = (undefined && undefined.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};


var Boid = /** @class */ (function () {
    function Boid(world, properties) {
        this.size = (properties === null || properties === void 0 ? void 0 : properties.size) || 5;
        this.speed = (properties === null || properties === void 0 ? void 0 : properties.speed) || 0.1;
        this.turnSpeed = (properties === null || properties === void 0 ? void 0 : properties.turnSpeed) || 0.05;
        this.direction = (properties === null || properties === void 0 ? void 0 : properties.direction) || new _geometry__WEBPACK_IMPORTED_MODULE_0__.DirectionVector(1, 0);
        this.pos = (properties === null || properties === void 0 ? void 0 : properties.pos) || { x: 100, y: 100 };
        this.world = world;
        this.visionRadius = (properties === null || properties === void 0 ? void 0 : properties.visionRadius) || this.size * 20;
        this.crowdingDistance = (properties === null || properties === void 0 ? void 0 : properties.crowdingDistance) || this.size * 5;
        this.color = (properties === null || properties === void 0 ? void 0 : properties.color) || 'black';
    }
    Boid.prototype.ai = function () {
        var boidsWithinVision = this.world.boidsWithinVision(this);
        var targets = [];
        var addTarget = function (tgtF, weight) {
            var tgt = tgtF(boidsWithinVision);
            if (tgt) {
                for (var i = 0; i < weight; i++)
                    targets.push(tgt);
            }
        };
        if (boidsWithinVision.length > 0) {
            // boid actions
            addTarget(this.separate.bind(this), 2);
            addTarget(this.align.bind(this), 1);
            addTarget(this.cohere.bind(this), 1);
        }
        // addTarget(this.avoidWall.bind(this), 2);
        if (targets.length > 0) {
            this.steerToward((0,_geometry__WEBPACK_IMPORTED_MODULE_0__.averageOfDirections)(targets));
        }
    };
    Boid.prototype.avoidWall = function () {
        var _a = this.world.nearestWall(this), wall = _a[0], d = _a[1];
        if (d <= this.visionRadius) {
            if ((0,_geometry__WEBPACK_IMPORTED_MODULE_0__.angleBetween)(_World__WEBPACK_IMPORTED_MODULE_1__.walls[wall], this.direction) < Math.PI / 2) {
                return _World__WEBPACK_IMPORTED_MODULE_1__.walls[wall].opposite();
            }
        }
        return this.direction;
    };
    Boid.prototype.separate = function (otherBoids) {
        var _this = this;
        var others = otherBoids.filter(function (b) {
            return (0,_geometry__WEBPACK_IMPORTED_MODULE_0__.distance2)(b.pos, _this.pos) < _this.crowdingDistance * _this.crowdingDistance;
        });
        if (others.length === 0) {
            return null;
        }
        var closest = others[0];
        var d2 = this.world.width * 10;
        others.forEach(function (b) {
            var nd = (0,_geometry__WEBPACK_IMPORTED_MODULE_0__.distance2)(_this.pos, b.pos);
            if (nd < d2) {
                d2 = nd;
                closest = b;
            }
        });
        return new _geometry__WEBPACK_IMPORTED_MODULE_0__.DirectionVector(this.pos.x - closest.pos.x, this.pos.y - closest.pos.y);
    };
    Boid.prototype.align = function (otherBoids) {
        var boids = __spreadArrays([this], otherBoids);
        return (0,_geometry__WEBPACK_IMPORTED_MODULE_0__.averageOfDirections)(boids.map(function (b) { return b.direction; }));
    };
    Boid.prototype.cohere = function (otherBoids) {
        var boids = __spreadArrays([this], otherBoids);
        var com = (0,_geometry__WEBPACK_IMPORTED_MODULE_0__.centerOfMass)(boids.map(function (b) { return b.pos; }));
        return new _geometry__WEBPACK_IMPORTED_MODULE_0__.DirectionVector(com.x - this.pos.x, com.y - this.pos.y);
    };
    Boid.prototype.steerToward = function (direction) {
        var ownAngle = this.direction.angle();
        var otherAngle = direction.angle();
        var refAngle = (0,_geometry__WEBPACK_IMPORTED_MODULE_0__.mod)(ownAngle - otherAngle, Math.PI * 2);
        var clockwise = -Math.sign(Math.PI - refAngle);
        this.direction = this.direction.turn(clockwise * this.turnSpeed);
    };
    Boid.prototype.draw = function (ctx) {
        var a = 0.8 * Math.PI;
        var nose = (0,_geometry__WEBPACK_IMPORTED_MODULE_0__.pointOnCircle)(this.pos, this.size, this.direction);
        var tail1 = (0,_geometry__WEBPACK_IMPORTED_MODULE_0__.pointOnCircle)(this.pos, this.size, this.direction.turn(a));
        var tail2 = (0,_geometry__WEBPACK_IMPORTED_MODULE_0__.pointOnCircle)(this.pos, this.size, this.direction.turn(-a));
        var back = (0,_geometry__WEBPACK_IMPORTED_MODULE_0__.pointOnCircle)(this.pos, 0.5 * this.size, this.direction.opposite());
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.moveTo(nose.x, nose.y);
        ctx.lineTo(tail1.x, tail1.y);
        ctx.lineTo(back.x, back.y);
        ctx.lineTo(tail2.x, tail2.y);
        ctx.lineTo(nose.x, nose.y);
        ctx.fill();
    };
    ;
    return Boid;
}());
/* harmony default export */ __webpack_exports__["default"] = (Boid);
;


/***/ }),

/***/ "./src/entities/World.ts":
/*!*******************************!*\
  !*** ./src/entities/World.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "walls": function() { return /* binding */ walls; }
/* harmony export */ });
/* harmony import */ var _geometry__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./geometry */ "./src/entities/geometry.ts");
/* harmony import */ var _Boid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Boid */ "./src/entities/Boid.ts");


var World = /** @class */ (function () {
    function World(width, height) {
        var _this = this;
        this.simulateWorld = function (deltaT) {
            _this.boids.forEach(function (boid) {
                boid.ai();
                boid.pos.x += deltaT * boid.speed * boid.direction.x;
                boid.pos.y += deltaT * boid.speed * boid.direction.y;
                _this.simulatePortalWalls(boid);
            });
        };
        this.hilightGroup = function (ctx, boid) {
            ctx.beginPath();
            ctx.fillStyle = 'aliceblue';
            ctx.moveTo(boid.pos.x + boid.visionRadius / 2, boid.pos.y);
            ctx.arc(boid.pos.x, boid.pos.y, boid.visionRadius / 2, 0, Math.PI * 2);
            ctx.fill();
        };
        this.hilightVision = function (ctx) {
            if (_this.boids.length < 1) {
                return;
            }
            var main = _this.boids[0];
            var inVision = _this.boidsWithinVision(main);
            ctx.beginPath();
            ctx.strokeStyle = 'gold';
            ctx.arc(main.pos.x, main.pos.y, main.visionRadius, 0, Math.PI * 2);
            ctx.moveTo(main.pos.x + 5, main.pos.y);
            ctx.arc(main.pos.x, main.pos.y, 5, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.strokeStyle = 'green';
            inVision.forEach(function (other) {
                ctx.moveTo(other.pos.x + 5, other.pos.y);
                ctx.arc(other.pos.x, other.pos.y, 5, 0, Math.PI * 2);
            });
            ctx.stroke();
        };
        this.hilightNearestWall = function (ctx) {
            if (_this.boids.length < 1) {
                return;
            }
            var wall = _this.nearestWall(_this.boids[0])[0];
            var begin = (wall === 'north' || wall === 'west')
                ? { x: 0, y: 0 }
                : { x: _this.width, y: _this.height };
            var end = (wall === 'west' || wall === 'east')
                ? { x: begin.x, y: _this.height - begin.y } // vertical
                : { x: _this.width - begin.x, y: begin.y };
            ctx.beginPath();
            ctx.strokeStyle = 'red';
            ctx.moveTo(begin.x, begin.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
            ctx.strokeStyle = 'black';
        };
        this.draw = function (ctx, config) {
            ctx.clearRect(0, 0, _this.width, _this.height);
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, _this.width, _this.height);
            ctx.fillStyle = 'black';
            if (config.showGroup) {
                _this.boids.forEach(function (boid) {
                    _this.hilightGroup(ctx, boid);
                });
            }
            _this.boids.forEach(function (boid) {
                boid.draw(ctx);
            });
            if (config.showVision) {
                _this.hilightVision(ctx);
            }
            if (config.showCenterOfMass) {
                _this.hilightBoidCenterOfMass(ctx);
            }
        };
        this.nearestWall = function (boid) {
            var _a = boid.pos, x = _a.x, y = _a.y;
            var d = y;
            var wall = 'north';
            if (x < d) {
                d = x;
                wall = 'west';
            }
            if (_this.width - x < d) {
                d = _this.width - x;
                wall = 'east';
            }
            if (_this.height - y < d) {
                d = _this.height - y;
                wall = 'south';
            }
            return [wall, d];
        };
        this.width = width || 500;
        this.height = height || 400;
        this.boids = [];
    }
    World.prototype.addBoid = function (properties) {
        this.boids.push(new _Boid__WEBPACK_IMPORTED_MODULE_1__.default(this, properties));
    };
    World.prototype.removeBoid = function () {
        this.boids = this.boids.slice(0, this.boids.length - 1);
    };
    World.prototype.amountOfBoids = function () {
        return this.boids.length;
    };
    World.prototype.boidsWithinVision = function (boid) {
        return this.boids.filter(function (b) {
            if (b === boid) {
                return false;
            }
            return (0,_geometry__WEBPACK_IMPORTED_MODULE_0__.distance2)(boid.pos, b.pos) <= boid.visionRadius * boid.visionRadius;
        });
    };
    World.prototype.simulatePortalWalls = function (boid) {
        boid.pos.x = (0,_geometry__WEBPACK_IMPORTED_MODULE_0__.mod)(boid.pos.x, this.width);
        boid.pos.y = (0,_geometry__WEBPACK_IMPORTED_MODULE_0__.mod)(boid.pos.y, this.height);
    };
    World.prototype.simulateSolidWalls = function (boid) {
        boid.pos.x = Math.min(Math.max(boid.pos.x, 0), this.width);
        boid.pos.y = Math.min(Math.max(boid.pos.y, 0), this.height);
    };
    World.prototype.hilightBoidCenterOfMass = function (ctx) {
        var com = (0,_geometry__WEBPACK_IMPORTED_MODULE_0__.centerOfMass)(this.boids.map(function (b) { return b.pos; }));
        ctx.beginPath();
        ctx.arc(com.x, com.y, 5, 0, Math.PI * 2);
        ctx.stroke();
    };
    World.prototype.hilightAngles = function (ctx) {
        ctx.beginPath();
        var r = 20;
        this.boids.forEach(function (_a) {
            var _b = _a.pos, x = _b.x, y = _b.y, direction = _a.direction;
            ctx.moveTo(x + r, y);
            ctx.arc(x, y, r, 0, direction.angle());
        });
        ctx.stroke();
    };
    World.prototype.changeBoidSize = function (size) {
        if (size < 1 || 0.5 * this.height < size) {
            return;
        }
        this.boids.forEach(function (b) {
            b.size = size;
        });
    };
    return World;
}());
/* harmony default export */ __webpack_exports__["default"] = (World);
;
// walls
var walls = {
    north: new _geometry__WEBPACK_IMPORTED_MODULE_0__.DirectionVector(0, -1),
    south: new _geometry__WEBPACK_IMPORTED_MODULE_0__.DirectionVector(0, 1),
    east: new _geometry__WEBPACK_IMPORTED_MODULE_0__.DirectionVector(1, 0),
    west: new _geometry__WEBPACK_IMPORTED_MODULE_0__.DirectionVector(-1, 0),
};


/***/ }),

/***/ "./src/entities/geometry.ts":
/*!**********************************!*\
  !*** ./src/entities/geometry.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DirectionVector": function() { return /* binding */ DirectionVector; },
/* harmony export */   "angleBetween": function() { return /* binding */ angleBetween; },
/* harmony export */   "directionFromAngle": function() { return /* binding */ directionFromAngle; },
/* harmony export */   "pointOnCircle": function() { return /* binding */ pointOnCircle; },
/* harmony export */   "dAngle": function() { return /* binding */ dAngle; },
/* harmony export */   "mod": function() { return /* binding */ mod; },
/* harmony export */   "distance2": function() { return /* binding */ distance2; },
/* harmony export */   "centerOfMass": function() { return /* binding */ centerOfMass; },
/* harmony export */   "averageOfDirections": function() { return /* binding */ averageOfDirections; }
/* harmony export */ });
var DirectionVector = /** @class */ (function () {
    function DirectionVector(x, y) {
        this.x = x / Math.hypot(x, y);
        this.y = y / Math.hypot(x, y);
    }
    DirectionVector.prototype.turn = function (a) {
        return new DirectionVector(this.x * Math.cos(a) - this.y * Math.sin(a), this.x * Math.sin(a) + this.y * Math.cos(a));
    };
    DirectionVector.prototype.opposite = function () {
        return new DirectionVector(-this.x, -this.y);
    };
    DirectionVector.prototype.angle = function () {
        if (this.y < 0) {
            return -Math.acos(this.x);
        }
        return Math.acos(this.x);
    };
    return DirectionVector;
}());

var angleBetween = function (a, b) {
    return Math.acos(a.x * b.x + a.y * b.y);
};
var directionFromAngle = function (a) {
    return new DirectionVector(Math.cos(a), Math.sin(a));
};
var pointOnCircle = function (origin, radius, direction) { return ({
    x: origin.x + radius * direction.x,
    y: origin.y + radius * direction.y,
}); };
var dAngle = function (a1, a2) {
    var delta = mod(a1 - a2, Math.PI * 2);
    return Math.min(delta, Math.PI * 2 - delta);
};
var mod = function (a, m) {
    return ((a % m) + m) % m;
};
var distance = function (p1, p2) {
    var dx = Math.abs(p1.x - p2.x);
    var dy = Math.abs(p1.y - p2.y);
    return Math.hypot(dx, dy);
};
var distance2 = function (p1, p2) {
    var dx = p1.x - p2.x;
    var dy = p1.y - p2.y;
    return dx * dx + dy * dy;
};
var centerOfMass = function (points) { return ({
    x: points.map(function (p) { return p.x; }).reduce(add) / points.length,
    y: points.map(function (p) { return p.y; }).reduce(add) / points.length,
}); };
var averageOfDirections = function (ds) {
    var _a = centerOfMass(ds), x = _a.x, y = _a.y;
    if (x === 0 && y === 0) {
        return new DirectionVector(1, 0);
    }
    return new DirectionVector(x, y);
};
var add = function (a, b) { return a + b; };


/***/ }),

/***/ "./src/utils/random.ts":
/*!*****************************!*\
  !*** ./src/utils/random.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "randomBetween": function() { return /* binding */ randomBetween; },
/* harmony export */   "randomColor": function() { return /* binding */ randomColor; },
/* harmony export */   "randomDirection": function() { return /* binding */ randomDirection; },
/* harmony export */   "randomPosition": function() { return /* binding */ randomPosition; }
/* harmony export */ });
/* harmony import */ var _entities_geometry__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../entities/geometry */ "./src/entities/geometry.ts");

var randomBetween = function (a, b) {
    return Math.random() * Math.abs(a - b) + Math.min(a, b);
};
var randomColor = function (hue, mode, config) {
    var saturation = 90, lightness = 50;
    if (mode === 'saturation' || mode === 'both') {
        saturation = randomBetween((config === null || config === void 0 ? void 0 : config.minSaturation) || 0, (config === null || config === void 0 ? void 0 : config.maxSaturation) || 100);
    }
    if (mode === 'lightness' || mode === 'both') {
        lightness = randomBetween((config === null || config === void 0 ? void 0 : config.minLightness) || 0, (config === null || config === void 0 ? void 0 : config.maxLightness) || 100);
    }
    return "hsl(" + hue + ", " + saturation + "%, " + lightness + "%)";
};
var randomDirection = function () { return (0,_entities_geometry__WEBPACK_IMPORTED_MODULE_0__.directionFromAngle)(Math.random() * Math.PI * 2); };
var randomPosition = function (config) {
    return {
        x: randomBetween(config.maxX, config.minX),
        y: randomBetween(config.maxY, config.minY),
    };
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _entities_World__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./entities/World */ "./src/entities/World.ts");
/* harmony import */ var _utils_random__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/random */ "./src/utils/random.ts");
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};


var createRandomizedBoidProperties = function (baseProperties, world, pad) {
    return __assign(__assign({}, baseProperties), { pos: (0,_utils_random__WEBPACK_IMPORTED_MODULE_1__.randomPosition)({ maxX: world.width - pad, minX: pad, maxY: world.height - pad, minY: pad }), color: (0,_utils_random__WEBPACK_IMPORTED_MODULE_1__.randomColor)(240, 'lightness', { minLightness: 20, maxLightness: 70 }), direction: (0,_utils_random__WEBPACK_IMPORTED_MODULE_1__.randomDirection)() });
};
var createWorld = function (config) {
    var world = new _entities_World__WEBPACK_IMPORTED_MODULE_0__.default(config.windowWidth, config.windowHeight);
    var n = config.amountOfBoids;
    var pad = 20;
    for (var i = 0; i < n; i++) {
        world.addBoid(createRandomizedBoidProperties(config.boidProperties, world, pad));
    }
    return world;
};
var canvas = document.getElementById('world');
var config = {
    amountOfBoids: 80,
    boidProperties: {},
    windowWidth: canvas.offsetWidth,
    windowHeight: canvas.offsetHeight,
};
var world = createWorld(config);
if (!canvas) {
    console.warn('Could not find the canvas!');
}
var animationFrame = 0;
var play = function () {
    var ctx = canvas === null || canvas === void 0 ? void 0 : canvas.getContext('2d');
    if (!ctx) {
        console.warn('Failed to get context');
        return;
    }
    var lastTick = performance.now();
    var renderLoop = function (timestamp) {
        var deltaT = timestamp - lastTick;
        lastTick = timestamp;
        world.simulateWorld(deltaT);
        world.draw(ctx, config);
        animationFrame = requestAnimationFrame(renderLoop);
    };
    renderLoop(lastTick);
};
window.onload = window.onresize = function () {
    world.width = canvas.width = canvas.offsetWidth;
    world.height = canvas.height = canvas.offsetHeight;
};
// controls
var boidAmountSlider = document.getElementById('boid-amount-slider');
if (boidAmountSlider !== null) {
    boidAmountSlider.oninput = function (event) {
        var value = event.target.valueAsNumber;
        var diff = world.amountOfBoids() - value;
        for (var i = 0; i < Math.abs(diff); i++) {
            if (diff > 0) {
                world.removeBoid();
            }
            else {
                var properties = createRandomizedBoidProperties(config.boidProperties, world, 20);
                world.addBoid(properties);
            }
        }
    };
    boidAmountSlider.value = '' + config.amountOfBoids;
}
else {
    console.warn("unable to get boid amount slider");
}
var boidSizeSlider = document.getElementById('boid-size-slider');
if (boidSizeSlider !== null) {
    boidSizeSlider.oninput = function (event) {
        var value = event.target.valueAsNumber;
        config.boidProperties.size = value;
        world.changeBoidSize(value);
    };
    boidSizeSlider.value = '' + (config.boidProperties.size || 5);
}
else {
    console.warn("unable to get boid size slider");
}
var showCoM = document.getElementById('show-center-of-mass');
if (showCoM !== null) {
    showCoM.onchange = function (event) {
        config.showCenterOfMass = event.target.checked;
    };
}
else {
    console.warn('unable to get input "show center of mass"');
}
var showBoidVision = document.getElementById('show-vision-of-boids');
if (showBoidVision !== null) {
    showBoidVision.onchange = function (event) {
        config.showVision = event.target.checked;
    };
}
else {
    console.warn('unable to get input show-boid-vision');
}
var showGroups = document.getElementById('show-groups');
if (showGroups !== null) {
    showGroups.onchange = function (event) {
        config.showGroup = event.target.checked;
    };
}
else {
    console.warn('unable to get show-groups');
}
// Start
play();

}();
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9ib2lkcy8uL3NyYy9lbnRpdGllcy9Cb2lkLnRzIiwid2VicGFjazovL2JvaWRzLy4vc3JjL2VudGl0aWVzL1dvcmxkLnRzIiwid2VicGFjazovL2JvaWRzLy4vc3JjL2VudGl0aWVzL2dlb21ldHJ5LnRzIiwid2VicGFjazovL2JvaWRzLy4vc3JjL3V0aWxzL3JhbmRvbS50cyIsIndlYnBhY2s6Ly9ib2lkcy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9ib2lkcy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYm9pZHMvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9ib2lkcy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JvaWRzLy4vc3JjL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ29JO0FBQzdGO0FBY3ZDO0lBV0ksY0FBWSxLQUFZLEVBQUUsVUFBMkI7UUFDakQsSUFBSSxDQUFDLElBQUksR0FBRyxXQUFVLGFBQVYsVUFBVSx1QkFBVixVQUFVLENBQUUsSUFBSSxLQUFJLENBQUMsQ0FBQztRQUNsQyxJQUFJLENBQUMsS0FBSyxHQUFHLFdBQVUsYUFBVixVQUFVLHVCQUFWLFVBQVUsQ0FBRSxLQUFLLEtBQUksR0FBRyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxTQUFTLEdBQUcsV0FBVSxhQUFWLFVBQVUsdUJBQVYsVUFBVSxDQUFFLFNBQVMsS0FBSSxJQUFJLENBQUM7UUFDL0MsSUFBSSxDQUFDLFNBQVMsR0FBRyxXQUFVLGFBQVYsVUFBVSx1QkFBVixVQUFVLENBQUUsU0FBUyxLQUFJLElBQUksc0RBQWUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDcEUsSUFBSSxDQUFDLEdBQUcsR0FBRyxXQUFVLGFBQVYsVUFB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QUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN2RSxDQUFDO0lBRU8sMEJBQVcsR0FBbkIsVUFBb0IsU0FBMEI7UUFDMUMsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN4QyxJQUFNLFVBQVUsR0FBRyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDckMsSUFBTSxRQUFRLEdBQUcsOENBQUcsQ0FBQyxRQUFRLEdBQUcsVUFBVSxFQUFFLElBQUksQ0FBQyxFQUFFLEdBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkQsSUFBTSxTQUFTLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsUUFBUSxDQUFDLENBQUM7UUFDakQsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3JFLENBQUM7SUFFTSxtQkFBSSxHQUFYLFVBQVksR0FBNkI7UUFDckMsSUFBTSxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDeEIsSUFBTSxJQUFJLEdBQUcsd0RBQWEsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2hFLElBQU0sS0FBSyxHQUFHLHdEQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekUsSUFBTSxLQUFLLEdBQUcsd0RBQWEsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFF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O0FBQ1IsSUFBSSxFQUFFLENBQUMiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbmltcG9ydCB7IFBvaW50LCBwb2ludE9uQ2lyY2xlLCBEaXJlY3Rpb25WZWN0b3IsIGFuZ2xlQmV0d2VlbiwgbW9kLCBjZW50ZXJPZk1hc3MsIGF2ZXJhZ2VPZkRpcmVjdGlvbnMsIGRpc3RhbmNlMiB9IGZyb20gJy4vZ2VvbWV0cnknO1xyXG5pbXBvcnQgV29ybGQsIHsgd2FsbHMgfSBmcm9tICcuL1dvcmxkJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQm9pZFByb3BlcnRpZXMge1xyXG4gICAgc2l6ZT86IG51bWJlcjtcclxuICAgIHNwZWVkPzogbnVtYmVyO1xyXG4gICAgdHVyblNwZWVkPzogbnVtYmVyO1xyXG4gICAgZGlyZWN0aW9uPzogRGlyZWN0aW9uVmVjdG9yO1xyXG4gICAgcG9zPzogUG9pbnQ7XHJcbiAgICB3b3JsZD86IFdvcmxkO1xyXG4gICAgdmlzaW9uUmFkaXVzPzogbnVtYmVyO1xyXG4gICAgY29sb3I/OiBzdHJpbmc7XHJcbiAgICBjcm93ZGluZ0Rpc3RhbmNlPzogbnVtYmVyO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCb2lkIHtcclxuICAgIHB1YmxpYyBzaXplOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgc3BlZWQ6IG51bWJlcjtcclxuICAgIHB1YmxpYyB0dXJuU3BlZWQ6IG51bWJlcjtcclxuICAgIHB1YmxpYyBkaXJlY3Rpb246IERpcmVjdGlvblZlY3RvcjtcclxuICAgIHB1YmxpYyBwb3M6IFBvaW50O1xyXG4gICAgcHJpdmF0ZSB3b3JsZDogV29ybGQ7XHJcbiAgICBwdWJsaWMgdmlzaW9uUmFkaXVzOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIGNvbG9yOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIGNyb3dkaW5nRGlzdGFuY2U6IG51bWJlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih3b3JsZDogV29ybGQsIHByb3BlcnRpZXM/OiBCb2lkUHJvcGVydGllcykge1xyXG4gICAgICAgIHRoaXMuc2l6ZSA9IHByb3BlcnRpZXM/LnNpemUgfHwgNTtcclxuICAgICAgICB0aGlzLnNwZWVkID0gcHJvcGVydGllcz8uc3BlZWQgfHwgMC4xO1xyXG4gICAgICAgIHRoaXMudHVyblNwZWVkID0gcHJvcGVydGllcz8udHVyblNwZWVkIHx8IDAuMDU7XHJcbiAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSBwcm9wZXJ0aWVzPy5kaXJlY3Rpb24gfHwgbmV3IERpcmVjdGlvblZlY3RvcigxLCAwKTtcclxuICAgICAgICB0aGlzLnBvcyA9IHByb3BlcnRpZXM/LnBvcyB8fCB7IHg6IDEwMCwgeTogMTAwIH07XHJcbiAgICAgICAgdGhpcy53b3JsZCA9IHdvcmxkO1xyXG4gICAgICAgIHRoaXMudmlzaW9uUmFkaXVzID0gcHJvcGVydGllcz8udmlzaW9uUmFkaXVzIHx8IHRoaXMuc2l6ZSAqIDIwO1xyXG4gICAgICAgIHRoaXMuY3Jvd2RpbmdEaXN0YW5jZSA9IHByb3BlcnRpZXM/LmNyb3dkaW5nRGlzdGFuY2UgfHwgdGhpcy5zaXplICogNTtcclxuICAgICAgICB0aGlzLmNvbG9yID0gcHJvcGVydGllcz8uY29sb3IgfHwgJ2JsYWNrJztcclxuICAgIH1cclxuICAgIHB1YmxpYyBhaSgpIHtcclxuICAgICAgICBjb25zdCBib2lkc1dpdGhpblZpc2lvbiA9IHRoaXMud29ybGQuYm9pZHNXaXRoaW5WaXNpb24odGhpcyk7XHJcbiAgICAgICAgY29uc3QgdGFyZ2V0czogRGlyZWN0aW9uVmVjdG9yW10gPSBbXTtcclxuICAgICAgICBjb25zdCBhZGRUYXJnZXQgPSAodGd0RjogKGJvaWRzOiBCb2lkW10pID0+IERpcmVjdGlvblZlY3RvciB8IG51bGwsIHdlaWdodDogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRndCA9IHRndEYoYm9pZHNXaXRoaW5WaXNpb24pO1xyXG4gICAgICAgICAgICBpZiAodGd0KSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpPTA7IGk8d2VpZ2h0OyBpKyspIHRhcmdldHMucHVzaCh0Z3QpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChib2lkc1dpdGhpblZpc2lvbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIC8vIGJvaWQgYWN0aW9uc1xyXG4gICAgICAgICAgICBhZGRUYXJnZXQodGhpcy5zZXBhcmF0ZS5iaW5kKHRoaXMpLCAyKTtcclxuICAgICAgICAgICAgYWRkVGFyZ2V0KHRoaXMuYWxpZ24uYmluZCh0aGlzKSwgMSk7XHJcbiAgICAgICAgICAgIGFkZFRhcmdldCh0aGlzLmNvaGVyZS5iaW5kKHRoaXMpLCAxKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGFkZFRhcmdldCh0aGlzLmF2b2lkV2FsbC5iaW5kKHRoaXMpLCAyKTtcclxuXHJcbiAgICAgICAgaWYgKHRhcmdldHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICB0aGlzLnN0ZWVyVG93YXJkKGF2ZXJhZ2VPZkRpcmVjdGlvbnModGFyZ2V0cykpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGF2b2lkV2FsbCgpIHtcclxuICAgICAgICBjb25zdCBbd2FsbCwgZF0gPSB0aGlzLndvcmxkLm5lYXJlc3RXYWxsKHRoaXMpO1xyXG4gICAgICAgIGlmIChkIDw9IHRoaXMudmlzaW9uUmFkaXVzKSB7XHJcbiAgICAgICAgICAgIGlmIChhbmdsZUJldHdlZW4od2FsbHNbd2FsbF0sIHRoaXMuZGlyZWN0aW9uKSA8IE1hdGguUEkgLyAyKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gd2FsbHNbd2FsbF0ub3Bwb3NpdGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5kaXJlY3Rpb247XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXBhcmF0ZShvdGhlckJvaWRzOiBCb2lkW10pOiBEaXJlY3Rpb25WZWN0b3IgfCBudWxsIHtcclxuICAgICAgICBjb25zdCBvdGhlcnMgPSBvdGhlckJvaWRzLmZpbHRlcihiID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGRpc3RhbmNlMihiLnBvcywgdGhpcy5wb3MpIDwgdGhpcy5jcm93ZGluZ0Rpc3RhbmNlKnRoaXMuY3Jvd2RpbmdEaXN0YW5jZTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpZiAob3RoZXJzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGNsb3Nlc3QgPSBvdGhlcnNbMF07XHJcbiAgICAgICAgbGV0IGQyID0gdGhpcy53b3JsZC53aWR0aCAqIDEwO1xyXG4gICAgICAgIG90aGVycy5mb3JFYWNoKGIgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBuZCA9IGRpc3RhbmNlMih0aGlzLnBvcywgYi5wb3MpXHJcbiAgICAgICAgICAgIGlmIChuZCA8IGQyKSB7XHJcbiAgICAgICAgICAgICAgICBkMiA9IG5kO1xyXG4gICAgICAgICAgICAgICAgY2xvc2VzdCA9IGI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gbmV3IERpcmVjdGlvblZlY3RvcihcclxuICAgICAgICAgICAgdGhpcy5wb3MueCAtIGNsb3Nlc3QucG9zLngsXHJcbiAgICAgICAgICAgIHRoaXMucG9zLnkgLSBjbG9zZXN0LnBvcy55XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFsaWduKG90aGVyQm9pZHM6IEJvaWRbXSk6IERpcmVjdGlvblZlY3RvciB7XHJcbiAgICAgICAgY29uc3QgYm9pZHMgPSBbdGhpcywgLi4ub3RoZXJCb2lkc11cclxuICAgICAgICByZXR1cm4gYXZlcmFnZU9mRGlyZWN0aW9ucyhib2lkcy5tYXAoYiA9PiBiLmRpcmVjdGlvbikpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY29oZXJlKG90aGVyQm9pZHM6IEJvaWRbXSk6IERpcmVjdGlvblZlY3RvciB7XHJcbiAgICAgICAgY29uc3QgYm9pZHMgPSBbdGhpcywgLi4ub3RoZXJCb2lkc107XHJcbiAgICAgICAgY29uc3QgY29tID0gY2VudGVyT2ZNYXNzKGJvaWRzLm1hcChiID0+IGIucG9zKSk7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgRGlyZWN0aW9uVmVjdG9yKGNvbS54IC0gdGhpcy5wb3MueCwgY29tLnkgLSB0aGlzLnBvcy55KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJpdmF0ZSBzdGVlclRvd2FyZChkaXJlY3Rpb246IERpcmVjdGlvblZlY3Rvcikge1xyXG4gICAgICAgIGNvbnN0IG93bkFuZ2xlID0gdGhpcy5kaXJlY3Rpb24uYW5nbGUoKTtcclxuICAgICAgICBjb25zdCBvdGhlckFuZ2xlID0gZGlyZWN0aW9uLmFuZ2xlKCk7XHJcbiAgICAgICAgY29uc3QgcmVmQW5nbGUgPSBtb2Qob3duQW5nbGUgLSBvdGhlckFuZ2xlLCBNYXRoLlBJKjIpO1xyXG4gICAgICAgIGNvbnN0IGNsb2Nrd2lzZSA9IC1NYXRoLnNpZ24oTWF0aC5QSSAtIHJlZkFuZ2xlKTtcclxuICAgICAgICB0aGlzLmRpcmVjdGlvbiA9IHRoaXMuZGlyZWN0aW9uLnR1cm4oY2xvY2t3aXNlICogdGhpcy50dXJuU3BlZWQpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgZHJhdyhjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCkge1xyXG4gICAgICAgIGNvbnN0IGEgPSAwLjggKiBNYXRoLlBJO1xyXG4gICAgICAgIGNvbnN0IG5vc2UgPSBwb2ludE9uQ2lyY2xlKHRoaXMucG9zLCB0aGlzLnNpemUsIHRoaXMuZGlyZWN0aW9uKTtcclxuICAgICAgICBjb25zdCB0YWlsMSA9IHBvaW50T25DaXJjbGUodGhpcy5wb3MsIHRoaXMuc2l6ZSwgdGhpcy5kaXJlY3Rpb24udHVybihhKSk7XHJcbiAgICAgICAgY29uc3QgdGFpbDIgPSBwb2ludE9uQ2lyY2xlKHRoaXMucG9zLCB0aGlzLnNpemUsIHRoaXMuZGlyZWN0aW9uLnR1cm4oLWEpKTtcclxuICAgICAgICBjb25zdCBiYWNrID0gcG9pbnRPbkNpcmNsZSh0aGlzLnBvcywgMC41KnRoaXMuc2l6ZSwgdGhpcy5kaXJlY3Rpb24ub3Bwb3NpdGUoKSk7XHJcblxyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gdGhpcy5jb2xvcjtcclxuICAgICAgICBjdHgubW92ZVRvKG5vc2UueCwgbm9zZS55KTtcclxuICAgICAgICBjdHgubGluZVRvKHRhaWwxLngsIHRhaWwxLnkpO1xyXG4gICAgICAgIGN0eC5saW5lVG8oYmFjay54LCBiYWNrLnkpO1xyXG4gICAgICAgIGN0eC5saW5lVG8odGFpbDIueCwgdGFpbDIueSk7XHJcbiAgICAgICAgY3R4LmxpbmVUbyhub3NlLngsIG5vc2UueSk7XHJcbiAgICAgICAgY3R4LmZpbGwoKTtcclxuXHJcbiAgICB9O1xyXG59O1xyXG4iLCJpbXBvcnQgeyBkaXN0YW5jZTIsIERpcmVjdGlvblZlY3RvciwgbW9kLCBjZW50ZXJPZk1hc3MgfSBmcm9tICcuL2dlb21ldHJ5JztcclxuaW1wb3J0IEJvaWQsIHsgQm9pZFByb3BlcnRpZXMgfSBmcm9tICcuL0JvaWQnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV29ybGQge1xyXG4gICAgcHVibGljIHdpZHRoOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgaGVpZ2h0OiBudW1iZXI7XHJcbiAgICBwcml2YXRlIGJvaWRzOiBCb2lkW107XHJcblxyXG4gICAgY29uc3RydWN0b3Iod2lkdGg/OiBudW1iZXIsIGhlaWdodD86IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMud2lkdGggPSB3aWR0aCB8fCA1MDA7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQgfHwgNDAwO1xyXG4gICAgICAgIHRoaXMuYm9pZHMgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkQm9pZChwcm9wZXJ0aWVzOiBCb2lkUHJvcGVydGllcykge1xyXG4gICAgICAgIHRoaXMuYm9pZHMucHVzaChuZXcgQm9pZCh0aGlzLCBwcm9wZXJ0aWVzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlbW92ZUJvaWQoKSB7XHJcbiAgICAgICAgdGhpcy5ib2lkcyA9IHRoaXMuYm9pZHMuc2xpY2UoMCwgdGhpcy5ib2lkcy5sZW5ndGgtMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFtb3VudE9mQm9pZHMoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5ib2lkcy5sZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGJvaWRzV2l0aGluVmlzaW9uKGJvaWQ6IEJvaWQpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5ib2lkcy5maWx0ZXIoYiA9PiB7XHJcbiAgICAgICAgICAgIGlmIChiID09PSBib2lkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGRpc3RhbmNlMihib2lkLnBvcywgYi5wb3MpIDw9IGJvaWQudmlzaW9uUmFkaXVzKmJvaWQudmlzaW9uUmFkaXVzO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzaW11bGF0ZVdvcmxkID0gKGRlbHRhVDogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgdGhpcy5ib2lkcy5mb3JFYWNoKGJvaWQgPT4ge1xyXG4gICAgICAgICAgICBib2lkLmFpKCk7XHJcblxyXG4gICAgICAgICAgICBib2lkLnBvcy54ICs9IGRlbHRhVCAqIGJvaWQuc3BlZWQgKiBib2lkLmRpcmVjdGlvbi54O1xyXG4gICAgICAgICAgICBib2lkLnBvcy55ICs9IGRlbHRhVCAqIGJvaWQuc3BlZWQgKiBib2lkLmRpcmVjdGlvbi55O1xyXG5cclxuICAgICAgICAgICAgdGhpcy5zaW11bGF0ZVBvcnRhbFdhbGxzKGJvaWQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIFxyXG4gICAgcHJpdmF0ZSBzaW11bGF0ZVBvcnRhbFdhbGxzKGJvaWQ6IEJvaWQpIHtcclxuICAgICAgICBib2lkLnBvcy54ID0gbW9kKGJvaWQucG9zLngsIHRoaXMud2lkdGgpO1xyXG4gICAgICAgIGJvaWQucG9zLnkgPSBtb2QoYm9pZC5wb3MueSwgdGhpcy5oZWlnaHQpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcml2YXRlIHNpbXVsYXRlU29saWRXYWxscyhib2lkOiBCb2lkKSB7XHJcbiAgICAgICAgYm9pZC5wb3MueCA9IE1hdGgubWluKE1hdGgubWF4KGJvaWQucG9zLngsIDApLCB0aGlzLndpZHRoKTsgXHJcbiAgICAgICAgYm9pZC5wb3MueSA9IE1hdGgubWluKE1hdGgubWF4KGJvaWQucG9zLnksIDApLCB0aGlzLmhlaWdodCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGhpbGlnaHRHcm91cCA9IChjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgYm9pZDogQm9pZCkgPT4ge1xyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gJ2FsaWNlYmx1ZSc7XHJcbiAgICAgICAgY3R4Lm1vdmVUbyhib2lkLnBvcy54K2JvaWQudmlzaW9uUmFkaXVzLzIsIGJvaWQucG9zLnkpO1xyXG4gICAgICAgIGN0eC5hcmMoYm9pZC5wb3MueCwgYm9pZC5wb3MueSwgYm9pZC52aXNpb25SYWRpdXMvMiwgMCwgTWF0aC5QSSoyKTtcclxuICAgICAgICBjdHguZmlsbCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBoaWxpZ2h0VmlzaW9uID0gKGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMuYm9pZHMubGVuZ3RoIDwgMSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IG1haW4gPSB0aGlzLmJvaWRzWzBdO1xyXG4gICAgICAgIGNvbnN0IGluVmlzaW9uID0gdGhpcy5ib2lkc1dpdGhpblZpc2lvbihtYWluKTtcclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJ2dvbGQnO1xyXG4gICAgICAgIGN0eC5hcmMobWFpbi5wb3MueCwgbWFpbi5wb3MueSwgbWFpbi52aXNpb25SYWRpdXMsIDAsIE1hdGguUEkgKiAyKTtcclxuICAgICAgICBjdHgubW92ZVRvKG1haW4ucG9zLnggKyA1LCBtYWluLnBvcy55KTtcclxuICAgICAgICBjdHguYXJjKG1haW4ucG9zLngsIG1haW4ucG9zLnksIDUsIDAsIE1hdGguUEkgKiAyKTtcclxuICAgICAgICBjdHguc3Ryb2tlKCk7XHJcblxyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSAnZ3JlZW4nO1xyXG4gICAgICAgIGluVmlzaW9uLmZvckVhY2gob3RoZXIgPT4ge1xyXG4gICAgICAgICAgICBjdHgubW92ZVRvKG90aGVyLnBvcy54ICsgNSwgb3RoZXIucG9zLnkpO1xyXG4gICAgICAgICAgICBjdHguYXJjKG90aGVyLnBvcy54LCBvdGhlci5wb3MueSwgNSwgMCwgTWF0aC5QSSAqIDIpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBoaWxpZ2h0TmVhcmVzdFdhbGwgPSAoY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpID0+IHtcclxuICAgICAgICBpZiAodGhpcy5ib2lkcy5sZW5ndGggPCAxKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3Qgd2FsbCA9IHRoaXMubmVhcmVzdFdhbGwodGhpcy5ib2lkc1swXSlbMF07XHJcbiAgICAgICAgY29uc3QgYmVnaW4gPSAod2FsbCA9PT0gJ25vcnRoJyB8fCB3YWxsID09PSAnd2VzdCcpXHJcbiAgICAgICAgICAgID8geyB4OiAwLCB5OiAwIH1cclxuICAgICAgICAgICAgOiB7IHg6IHRoaXMud2lkdGgsIHk6IHRoaXMuaGVpZ2h0IH07XHJcbiAgICAgICAgY29uc3QgZW5kID0gKHdhbGwgPT09ICd3ZXN0JyB8fCB3YWxsID09PSAnZWFzdCcpXHJcbiAgICAgICAgICAgID8geyB4OiBiZWdpbi54LCB5OiB0aGlzLmhlaWdodCAtIGJlZ2luLnkgfSAvLyB2ZXJ0aWNhbFxyXG4gICAgICAgICAgICA6IHsgeDogdGhpcy53aWR0aCAtIGJlZ2luLngsIHk6IGJlZ2luLnkgfTtcclxuXHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICdyZWQnO1xyXG4gICAgICAgIGN0eC5tb3ZlVG8oYmVnaW4ueCwgYmVnaW4ueSk7XHJcbiAgICAgICAgY3R4LmxpbmVUbyhlbmQueCwgZW5kLnkpO1xyXG4gICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSAnYmxhY2snO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaGlsaWdodEJvaWRDZW50ZXJPZk1hc3MoY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpIHtcclxuICAgICAgICBjb25zdCBjb20gPSBjZW50ZXJPZk1hc3ModGhpcy5ib2lkcy5tYXAoYiA9PiBiLnBvcykpO1xyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHguYXJjKGNvbS54LCBjb20ueSwgNSwgMCwgTWF0aC5QSSAqIDIpO1xyXG4gICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhpbGlnaHRBbmdsZXMoY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpIHtcclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY29uc3QgciA9IDIwOyBcclxuICAgICAgICB0aGlzLmJvaWRzLmZvckVhY2goKHsgcG9zOnsgeCwgeSB9LCBkaXJlY3Rpb24gfSkgPT4ge1xyXG4gICAgICAgICAgICBjdHgubW92ZVRvKHggKyByLCB5KTtcclxuICAgICAgICAgICAgY3R4LmFyYyh4LCB5LCByLCAwLCBkaXJlY3Rpb24uYW5nbGUoKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGN0eC5zdHJva2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZHJhdyA9IChjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgY29uZmlnOiBEcmF3aW5nQ29uZmlnKSA9PiB7XHJcbiAgICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICd3aGl0ZSc7XHJcbiAgICAgICAgY3R4LmZpbGxSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gJ2JsYWNrJztcclxuXHJcbiAgICAgICAgaWYgKGNvbmZpZy5zaG93R3JvdXApIHtcclxuICAgICAgICAgICAgdGhpcy5ib2lkcy5mb3JFYWNoKGJvaWQgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oaWxpZ2h0R3JvdXAoY3R4LCBib2lkKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuYm9pZHMuZm9yRWFjaChib2lkID0+IHtcclxuICAgICAgICAgICAgYm9pZC5kcmF3KGN0eCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKGNvbmZpZy5zaG93VmlzaW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaGlsaWdodFZpc2lvbihjdHgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY29uZmlnLnNob3dDZW50ZXJPZk1hc3MpIHtcclxuICAgICAgICAgICAgdGhpcy5oaWxpZ2h0Qm9pZENlbnRlck9mTWFzcyhjdHgpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHVibGljIG5lYXJlc3RXYWxsID0gKGJvaWQ6IEJvaWQpOiBbV2FsbCwgbnVtYmVyXSA9PiB7XHJcbiAgICAgICAgY29uc3QgeyB4LCB5IH0gPSBib2lkLnBvcztcclxuICAgICAgICBsZXQgZCA9IHk7XHJcbiAgICAgICAgbGV0IHdhbGw6IFdhbGwgPSAnbm9ydGgnO1xyXG4gICAgICAgIGlmICh4IDwgZCkge1xyXG4gICAgICAgICAgICBkID0geDsgd2FsbCA9ICd3ZXN0JztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMud2lkdGggLSB4IDwgZCkge1xyXG4gICAgICAgICAgICBkID0gdGhpcy53aWR0aCAtIHg7IHdhbGwgPSAnZWFzdCc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmhlaWdodCAtIHkgPCBkKSB7XHJcbiAgICAgICAgICAgIGQgPSB0aGlzLmhlaWdodCAtIHk7IHdhbGwgPSAnc291dGgnO1xyXG4gICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgIHJldHVybiBbd2FsbCwgZF07XHJcbiAgICB9O1xyXG5cclxuICAgIHB1YmxpYyBjaGFuZ2VCb2lkU2l6ZShzaXplOiBudW1iZXIpIHtcclxuICAgICAgICBpZiAoc2l6ZSA8IDEgfHwgMC41KnRoaXMuaGVpZ2h0IDwgc2l6ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuYm9pZHMuZm9yRWFjaChiID0+IHtcclxuICAgICAgICAgICAgYi5zaXplID0gc2l6ZTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgRHJhd2luZ0NvbmZpZyB7XHJcbiAgICBzaG93R3JvdXA/OiBib29sZWFuO1xyXG4gICAgc2hvd0NlbnRlck9mTWFzcz86IGJvb2xlYW47XHJcbiAgICBzaG93VmlzaW9uPzogYm9vbGVhbjtcclxufVxyXG5cclxuLy8gd2FsbHNcclxuXHJcbmV4cG9ydCBjb25zdCB3YWxscyA9IHtcclxuICAgIG5vcnRoOiBuZXcgRGlyZWN0aW9uVmVjdG9yKDAsIC0xKSxcclxuICAgIHNvdXRoOiBuZXcgRGlyZWN0aW9uVmVjdG9yKDAsIDEpLFxyXG4gICAgZWFzdDogbmV3IERpcmVjdGlvblZlY3RvcigxLCAwKSxcclxuICAgIHdlc3Q6IG5ldyBEaXJlY3Rpb25WZWN0b3IoLTEsIDApLFxyXG59O1xyXG5cclxuZXhwb3J0IHR5cGUgV2FsbCA9IGtleW9mIHR5cGVvZiB3YWxscztcclxuIiwiXHJcbmV4cG9ydCBpbnRlcmZhY2UgUG9pbnQge1xyXG4gICAgeDogbnVtYmVyO1xyXG4gICAgeTogbnVtYmVyO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgRGlyZWN0aW9uVmVjdG9yIHtcclxuICAgIHB1YmxpYyB4OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgeTogbnVtYmVyO1xyXG4gICAgY29uc3RydWN0b3IoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnggPSB4IC8gTWF0aC5oeXBvdCh4LCB5KTtcclxuICAgICAgICB0aGlzLnkgPSB5IC8gTWF0aC5oeXBvdCh4LCB5KTtcclxuICAgIH1cclxuICAgIHB1YmxpYyB0dXJuKGE6IG51bWJlcik6IERpcmVjdGlvblZlY3RvciB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBEaXJlY3Rpb25WZWN0b3IoXHJcbiAgICAgICAgICAgIHRoaXMueCAqIE1hdGguY29zKGEpIC0gdGhpcy55ICogTWF0aC5zaW4oYSksXHJcbiAgICAgICAgICAgIHRoaXMueCAqIE1hdGguc2luKGEpICsgdGhpcy55ICogTWF0aC5jb3MoYSlcclxuICAgICAgICApO1xyXG4gICAgfVxyXG4gICAgcHVibGljIG9wcG9zaXRlKCk6IERpcmVjdGlvblZlY3RvciB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBEaXJlY3Rpb25WZWN0b3IoLXRoaXMueCwgLXRoaXMueSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgYW5nbGUoKTogbnVtYmVyIHtcclxuICAgICAgICBpZiAodGhpcy55IDwgMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gLU1hdGguYWNvcyh0aGlzLngpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gTWF0aC5hY29zKHRoaXMueCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBhbmdsZUJldHdlZW4gPSAoYTogRGlyZWN0aW9uVmVjdG9yLCBiOiBEaXJlY3Rpb25WZWN0b3IpID0+IHtcclxuICAgIHJldHVybiBNYXRoLmFjb3MoYS54KmIueCArIGEueSpiLnkpO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZGlyZWN0aW9uRnJvbUFuZ2xlID0gKGE6IG51bWJlcik6IERpcmVjdGlvblZlY3RvciA9PiB7XHJcbiAgICByZXR1cm4gbmV3IERpcmVjdGlvblZlY3RvcihNYXRoLmNvcyhhKSwgTWF0aC5zaW4oYSkpO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IHBvaW50T25DaXJjbGUgPSAoXHJcbiAgICBvcmlnaW46IFBvaW50LFxyXG4gICAgcmFkaXVzOiBudW1iZXIsXHJcbiAgICBkaXJlY3Rpb246IERpcmVjdGlvblZlY3RvclxyXG4pOiBQb2ludCA9PiAoe1xyXG4gICAgeDogb3JpZ2luLnggKyByYWRpdXMgKiBkaXJlY3Rpb24ueCxcclxuICAgIHk6IG9yaWdpbi55ICsgcmFkaXVzICogZGlyZWN0aW9uLnksXHJcbn0pO1xyXG5cclxuZXhwb3J0IGNvbnN0IGRBbmdsZSA9IChhMTogbnVtYmVyLCBhMjogbnVtYmVyKSA9PiB7XHJcbiAgICBjb25zdCBkZWx0YSA9IG1vZChhMSAtIGEyLCBNYXRoLlBJKjIpO1xyXG4gICAgcmV0dXJuIE1hdGgubWluKGRlbHRhLCBNYXRoLlBJKjIgLSBkZWx0YSk7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBtb2QgPSAoYTogbnVtYmVyLCBtOiBudW1iZXIpID0+IHtcclxuICAgIHJldHVybiAoKGEgJSBtKSArIG0pICUgbTtcclxufVxyXG5cclxuY29uc3QgZGlzdGFuY2UgPSAocDE6IFBvaW50LCBwMjogUG9pbnQpID0+IHtcclxuICAgIGNvbnN0IGR4ID0gTWF0aC5hYnMocDEueCAtIHAyLngpO1xyXG4gICAgY29uc3QgZHkgPSBNYXRoLmFicyhwMS55IC0gcDIueSk7XHJcbiAgICByZXR1cm4gTWF0aC5oeXBvdChkeCwgZHkpO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZGlzdGFuY2UyID0gKHAxOiBQb2ludCwgcDI6IFBvaW50KSA9PiB7XHJcbiAgICBjb25zdCBkeCA9IHAxLnggLSBwMi54O1xyXG4gICAgY29uc3QgZHkgPSBwMS55IC0gcDIueTtcclxuICAgIHJldHVybiBkeCpkeCArIGR5KmR5O1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgY2VudGVyT2ZNYXNzID0gKHBvaW50czogUG9pbnRbXSk6IFBvaW50ID0+ICh7XHJcbiAgICB4OiBwb2ludHMubWFwKHAgPT4gcC54KS5yZWR1Y2UoYWRkKSAvIHBvaW50cy5sZW5ndGgsXHJcbiAgICB5OiBwb2ludHMubWFwKHAgPT4gcC55KS5yZWR1Y2UoYWRkKSAvIHBvaW50cy5sZW5ndGgsXHJcbn0pO1xyXG5cclxuZXhwb3J0IGNvbnN0IGF2ZXJhZ2VPZkRpcmVjdGlvbnMgPSAoZHM6IERpcmVjdGlvblZlY3RvcltdKTogRGlyZWN0aW9uVmVjdG9yID0+IHtcclxuICAgIGNvbnN0IHsgeCwgeSB9ID0gY2VudGVyT2ZNYXNzKGRzKTtcclxuICAgIGlmICh4ID09PSAwICYmIHkgPT09IDApIHtcclxuICAgICAgICByZXR1cm4gbmV3IERpcmVjdGlvblZlY3RvcigxLCAwKTtcclxuICAgIH1cclxuICAgIHJldHVybiBuZXcgRGlyZWN0aW9uVmVjdG9yKHgsIHkpO1xyXG59O1xyXG5cclxuY29uc3QgYWRkID0gKGE6IG51bWJlciwgYjogbnVtYmVyKSA9PiBhICsgYjtcclxuIiwiaW1wb3J0IHsgRGlyZWN0aW9uVmVjdG9yLCBkaXJlY3Rpb25Gcm9tQW5nbGUsIFBvaW50IH0gZnJvbSBcIi4uL2VudGl0aWVzL2dlb21ldHJ5XCI7XHJcblxyXG5leHBvcnQgY29uc3QgcmFuZG9tQmV0d2VlbiA9IChhOiBudW1iZXIsIGI6IG51bWJlcik6bnVtYmVyID0+IHtcclxuICAgIHJldHVybiBNYXRoLnJhbmRvbSgpICogTWF0aC5hYnMoYS1iKSArIE1hdGgubWluKGEsIGIpO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIHJhbmRvbUNvbG9yQ29uZmlnIHtcclxuICAgIG1pbkxpZ2h0bmVzcz86IG51bWJlcjtcclxuICAgIG1heExpZ2h0bmVzcz86IG51bWJlcjtcclxuICAgIG1pblNhdHVyYXRpb24/OiBudW1iZXI7XHJcbiAgICBtYXhTYXR1cmF0aW9uPzogbnVtYmVyO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgcmFuZG9tQ29sb3IgPSAoXHJcbiAgICBodWU6IG51bWJlcixcclxuICAgIG1vZGU6ICdzYXR1cmF0aW9uJyB8ICdsaWdodG5lc3MnIHwgJ2JvdGgnLFxyXG4gICAgY29uZmlnPzogcmFuZG9tQ29sb3JDb25maWdcclxuKTogc3RyaW5nID0+IHtcclxuICAgIGxldCBzYXR1cmF0aW9uID0gOTAsIGxpZ2h0bmVzcyA9IDUwO1xyXG4gICAgaWYgKG1vZGUgPT09ICdzYXR1cmF0aW9uJyB8fCBtb2RlID09PSAnYm90aCcpIHtcclxuICAgICAgICBzYXR1cmF0aW9uID0gcmFuZG9tQmV0d2Vlbihjb25maWc/Lm1pblNhdHVyYXRpb24gfHwgMCwgY29uZmlnPy5tYXhTYXR1cmF0aW9uIHx8IDEwMCk7XHJcbiAgICB9XHJcbiAgICBpZiAobW9kZSA9PT0gJ2xpZ2h0bmVzcycgfHwgbW9kZSA9PT0gJ2JvdGgnKSB7XHJcbiAgICAgICAgbGlnaHRuZXNzID0gcmFuZG9tQmV0d2Vlbihjb25maWc/Lm1pbkxpZ2h0bmVzcyB8fCAwLCBjb25maWc/Lm1heExpZ2h0bmVzcyB8fCAxMDApO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGBoc2woJHtodWV9LCAke3NhdHVyYXRpb259JSwgJHtsaWdodG5lc3N9JSlgO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgcmFuZG9tRGlyZWN0aW9uID0gKCk6IERpcmVjdGlvblZlY3RvciA9PiBkaXJlY3Rpb25Gcm9tQW5nbGUoTWF0aC5yYW5kb20oKSAqIE1hdGguUEkgKiAyKTtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUmFuZG9tUG9zaXRpb25Db25maWcge1xyXG4gICAgbWF4WDogbnVtYmVyO1xyXG4gICAgbWluWDogbnVtYmVyO1xyXG4gICAgbWF4WTogbnVtYmVyO1xyXG4gICAgbWluWTogbnVtYmVyO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgcmFuZG9tUG9zaXRpb24gPSAoY29uZmlnOiBSYW5kb21Qb3NpdGlvbkNvbmZpZyk6IFBvaW50ID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgeDogcmFuZG9tQmV0d2Vlbihjb25maWcubWF4WCwgY29uZmlnLm1pblgpLFxyXG4gICAgICAgIHk6IHJhbmRvbUJldHdlZW4oY29uZmlnLm1heFksIGNvbmZpZy5taW5ZKSxcclxuICAgIH07XHJcbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHRpZihfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdKSB7XG5cdFx0cmV0dXJuIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0uZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIGRlZmluaXRpb24pIHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqLCBwcm9wKSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTsgfSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IFdvcmxkLCB7IERyYXdpbmdDb25maWcgfSBmcm9tICcuL2VudGl0aWVzL1dvcmxkJztcclxuaW1wb3J0IHsgQm9pZFByb3BlcnRpZXMgfSBmcm9tICcuL2VudGl0aWVzL0JvaWQnO1xyXG5pbXBvcnQgeyByYW5kb21Qb3NpdGlvbiwgcmFuZG9tQ29sb3IsIHJhbmRvbURpcmVjdGlvbiB9IGZyb20gJy4vdXRpbHMvcmFuZG9tJztcclxuXHJcbmludGVyZmFjZSBTaW11bGF0aW9uQ29uZmlnIGV4dGVuZHMgRHJhd2luZ0NvbmZpZyB7XHJcbiAgICBib2lkUHJvcGVydGllczogQm9pZFByb3BlcnRpZXM7XHJcbiAgICBhbW91bnRPZkJvaWRzOiBudW1iZXI7XHJcbiAgICB3aW5kb3dXaWR0aD86IG51bWJlcjtcclxuICAgIHdpbmRvd0hlaWdodD86IG51bWJlcjtcclxufVxyXG5cclxuY29uc3QgY3JlYXRlUmFuZG9taXplZEJvaWRQcm9wZXJ0aWVzID0gKGJhc2VQcm9wZXJ0aWVzOiBCb2lkUHJvcGVydGllcywgd29ybGQ6IFdvcmxkLCBwYWQ6IG51bWJlcikgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5iYXNlUHJvcGVydGllcyxcclxuICAgICAgICBwb3M6IHJhbmRvbVBvc2l0aW9uKHsgbWF4WDogd29ybGQud2lkdGggLSBwYWQsIG1pblg6IHBhZCwgbWF4WTogd29ybGQuaGVpZ2h0IC0gcGFkLCBtaW5ZOiBwYWQgfSksXHJcbiAgICAgICAgY29sb3I6IHJhbmRvbUNvbG9yKDI0MCwgJ2xpZ2h0bmVzcycsIHsgbWluTGlnaHRuZXNzOiAyMCwgbWF4TGlnaHRuZXNzOiA3MCB9KSxcclxuICAgICAgICBkaXJlY3Rpb246IHJhbmRvbURpcmVjdGlvbigpLFxyXG4gICAgfTtcclxufVxyXG5cclxuY29uc3QgY3JlYXRlV29ybGQgPSAoY29uZmlnOiBTaW11bGF0aW9uQ29uZmlnKSA9PiB7XHJcbiAgICBjb25zdCB3b3JsZCA9IG5ldyBXb3JsZChjb25maWcud2luZG93V2lkdGgsIGNvbmZpZy53aW5kb3dIZWlnaHQpO1xyXG4gICAgY29uc3QgbiA9IGNvbmZpZy5hbW91bnRPZkJvaWRzO1xyXG4gICAgY29uc3QgcGFkID0gMjA7XHJcbiAgICBmb3IgKGxldCBpPTA7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICB3b3JsZC5hZGRCb2lkKFxyXG4gICAgICAgICAgICBjcmVhdGVSYW5kb21pemVkQm9pZFByb3BlcnRpZXMoY29uZmlnLmJvaWRQcm9wZXJ0aWVzLCB3b3JsZCwgcGFkKVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gd29ybGQ7XHJcbn1cclxuY29uc3QgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dvcmxkJykgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XHJcbmNvbnN0IGNvbmZpZzogU2ltdWxhdGlvbkNvbmZpZyA9IHtcclxuICAgIGFtb3VudE9mQm9pZHM6IDgwLFxyXG4gICAgYm9pZFByb3BlcnRpZXM6IHtcclxuXHJcbiAgICB9LFxyXG4gICAgd2luZG93V2lkdGg6IGNhbnZhcy5vZmZzZXRXaWR0aCxcclxuICAgIHdpbmRvd0hlaWdodDogY2FudmFzLm9mZnNldEhlaWdodCxcclxufTtcclxuY29uc3Qgd29ybGQgPSBjcmVhdGVXb3JsZChjb25maWcpO1xyXG5pZiAoIWNhbnZhcykge1xyXG4gICAgY29uc29sZS53YXJuKCdDb3VsZCBub3QgZmluZCB0aGUgY2FudmFzIScpO1xyXG59XHJcbmxldCBhbmltYXRpb25GcmFtZSA9IDA7XHJcbmNvbnN0IHBsYXkgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBjdHggPSBjYW52YXM/LmdldENvbnRleHQoJzJkJyk7XHJcbiAgICBpZiAoIWN0eCkge1xyXG4gICAgICAgIGNvbnNvbGUud2FybignRmFpbGVkIHRvIGdldCBjb250ZXh0Jyk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgbGV0IGxhc3RUaWNrID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcbiAgICBjb25zdCByZW5kZXJMb29wID0gKHRpbWVzdGFtcDogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZGVsdGFUID0gdGltZXN0YW1wIC0gbGFzdFRpY2s7XHJcbiAgICAgICAgbGFzdFRpY2sgPSB0aW1lc3RhbXA7XHJcbiAgICAgICAgd29ybGQuc2ltdWxhdGVXb3JsZChkZWx0YVQpO1xyXG4gICAgICAgIHdvcmxkLmRyYXcoY3R4LCBjb25maWcpO1xyXG4gICAgICAgIGFuaW1hdGlvbkZyYW1lID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlbmRlckxvb3ApO1xyXG4gICAgfTtcclxuICAgIHJlbmRlckxvb3AobGFzdFRpY2spO1xyXG59XHJcblxyXG53aW5kb3cub25sb2FkID0gd2luZG93Lm9ucmVzaXplID0gKCkgPT4ge1xyXG4gICAgd29ybGQud2lkdGggPSBjYW52YXMud2lkdGggPSBjYW52YXMub2Zmc2V0V2lkdGg7XHJcbiAgICB3b3JsZC5oZWlnaHQgPSBjYW52YXMuaGVpZ2h0ID0gY2FudmFzLm9mZnNldEhlaWdodDtcclxufTtcclxuXHJcblxyXG4vLyBjb250cm9sc1xyXG5jb25zdCBib2lkQW1vdW50U2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JvaWQtYW1vdW50LXNsaWRlcicpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbmlmIChib2lkQW1vdW50U2xpZGVyICE9PSBudWxsKSB7XHJcbiAgICBib2lkQW1vdW50U2xpZGVyLm9uaW5wdXQgPSAoZXZlbnQ6IEV2ZW50KSA9PiB7XHJcbiAgICAgICAgY29uc3QgdmFsdWUgPSAoZXZlbnQudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlQXNOdW1iZXI7XHJcbiAgICAgICAgY29uc3QgZGlmZiA9IHdvcmxkLmFtb3VudE9mQm9pZHMoKSAtIHZhbHVlO1xyXG4gICAgICAgIGZvciAobGV0IGk9MDsgaTxNYXRoLmFicyhkaWZmKTsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChkaWZmID4gMCkge1xyXG4gICAgICAgICAgICAgICAgd29ybGQucmVtb3ZlQm9pZCgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcHJvcGVydGllcyA9IGNyZWF0ZVJhbmRvbWl6ZWRCb2lkUHJvcGVydGllcyhjb25maWcuYm9pZFByb3BlcnRpZXMsIHdvcmxkLCAyMCk7IFxyXG4gICAgICAgICAgICAgICAgd29ybGQuYWRkQm9pZChwcm9wZXJ0aWVzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBib2lkQW1vdW50U2xpZGVyLnZhbHVlID0gJycgKyBjb25maWcuYW1vdW50T2ZCb2lkcztcclxufSBlbHNlIHtcclxuICAgIGNvbnNvbGUud2FybihcInVuYWJsZSB0byBnZXQgYm9pZCBhbW91bnQgc2xpZGVyXCIpO1xyXG59XHJcblxyXG5jb25zdCBib2lkU2l6ZVNsaWRlcjogSFRNTElucHV0RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdib2lkLXNpemUtc2xpZGVyJykgYXMgSFRNTElucHV0RWxlbWVudDtcclxuaWYgKGJvaWRTaXplU2xpZGVyICE9PSBudWxsKSB7XHJcbiAgICBib2lkU2l6ZVNsaWRlci5vbmlucHV0ID0gKGV2ZW50OiBFdmVudCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gKGV2ZW50LnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZUFzTnVtYmVyO1xyXG4gICAgICAgIGNvbmZpZy5ib2lkUHJvcGVydGllcy5zaXplID0gdmFsdWU7XHJcbiAgICAgICAgd29ybGQuY2hhbmdlQm9pZFNpemUodmFsdWUpO1xyXG4gICAgfTtcclxuICAgIGJvaWRTaXplU2xpZGVyLnZhbHVlID0gJycgKyAoY29uZmlnLmJvaWRQcm9wZXJ0aWVzLnNpemUgfHwgNSk7XHJcbn0gZWxzZSB7XHJcbiAgICBjb25zb2xlLndhcm4oXCJ1bmFibGUgdG8gZ2V0IGJvaWQgc2l6ZSBzbGlkZXJcIik7XHJcbn1cclxuXHJcbmNvbnN0IHNob3dDb00gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2hvdy1jZW50ZXItb2YtbWFzcycpO1xyXG5pZiAoc2hvd0NvTSAhPT0gbnVsbCkge1xyXG4gICAgc2hvd0NvTS5vbmNoYW5nZSA9IChldmVudDogRXZlbnQpID0+IHtcclxuICAgICAgICBjb25maWcuc2hvd0NlbnRlck9mTWFzcyA9IChldmVudC50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCkuY2hlY2tlZDtcclxuICAgIH07XHJcbn0gZWxzZSB7XHJcbiAgICBjb25zb2xlLndhcm4oJ3VuYWJsZSB0byBnZXQgaW5wdXQgXCJzaG93IGNlbnRlciBvZiBtYXNzXCInKTtcclxufVxyXG5cclxuY29uc3Qgc2hvd0JvaWRWaXNpb24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2hvdy12aXNpb24tb2YtYm9pZHMnKTtcclxuaWYgKHNob3dCb2lkVmlzaW9uICE9PSBudWxsKSB7XHJcbiAgICBzaG93Qm9pZFZpc2lvbi5vbmNoYW5nZSA9IChldmVudDogRXZlbnQpID0+IHtcclxuICAgICAgICBjb25maWcuc2hvd1Zpc2lvbiA9IChldmVudC50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCkuY2hlY2tlZDtcclxuICAgIH07XHJcbn0gZWxzZSB7XHJcbiAgICBjb25zb2xlLndhcm4oJ3VuYWJsZSB0byBnZXQgaW5wdXQgc2hvdy1ib2lkLXZpc2lvbicpO1xyXG59XHJcblxyXG5jb25zdCBzaG93R3JvdXBzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Nob3ctZ3JvdXBzJyk7XHJcbmlmIChzaG93R3JvdXBzICE9PSBudWxsKSB7XHJcbiAgICBzaG93R3JvdXBzLm9uY2hhbmdlID0gKGV2ZW50OiBFdmVudCkgPT4ge1xyXG4gICAgICAgIGNvbmZpZy5zaG93R3JvdXAgPSAoZXZlbnQudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLmNoZWNrZWQ7XHJcbiAgICB9O1xyXG59IGVsc2Uge1xyXG4gICAgY29uc29sZS53YXJuKCd1bmFibGUgdG8gZ2V0IHNob3ctZ3JvdXBzJyk7XHJcbn1cclxuXHJcbi8vIFN0YXJ0XHJcbnBsYXkoKTsiXSwic291cmNlUm9vdCI6IiJ9