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


var createWorld = function (config) {
    var world = new _entities_World__WEBPACK_IMPORTED_MODULE_0__.default(config.windowWidth, config.windowHeight);
    var n = config.amountOfBoids;
    var pad = 20;
    for (var i = 0; i < n; i++) {
        world.addBoid(__assign(__assign({}, (config.boidProperties || {})), { pos: (0,_utils_random__WEBPACK_IMPORTED_MODULE_1__.randomPosition)({ maxX: world.width - pad, minX: pad, maxY: world.height - pad, minY: pad }), color: (0,_utils_random__WEBPACK_IMPORTED_MODULE_1__.randomColor)(240, 'lightness', { minLightness: 20, maxLightness: 70 }), direction: (0,_utils_random__WEBPACK_IMPORTED_MODULE_1__.randomDirection)() }));
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
play();

}();
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9ib2lkcy8uL3NyYy9lbnRpdGllcy9Cb2lkLnRzIiwid2VicGFjazovL2JvaWRzLy4vc3JjL2VudGl0aWVzL1dvcmxkLnRzIiwid2VicGFjazovL2JvaWRzLy4vc3JjL2VudGl0aWVzL2dlb21ldHJ5LnRzIiwid2VicGFjazovL2JvaWRzLy4vc3JjL3V0aWxzL3JhbmRvbS50cyIsIndlYnBhY2s6Ly9ib2lkcy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9ib2lkcy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYm9pZHMvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9ib2lkcy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JvaWRzLy4vc3JjL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ29JO0FBQzdGO0FBY3ZDO0lBV0ksY0FBWSxLQUFZLEVBQUUsVUFBMkI7UUFDakQsSUFBSSxDQUFDLElBQUksR0FBRyxXQUFVLGFBQVYsVUFBVSx1QkFBVixVQUFVLENBQUUsSUFBSSxLQUFJLENBQUMsQ0FBQztRQUNsQyxJQUFJLENBQUMsS0FBSyxHQUFHLFdBQVUsYUFBVixVQUFVLHVCQUFWLFVBQVUsQ0FBRSxLQUFLLEtBQUksR0FBRyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxTQUFTLEdBQUcsV0FBVSxhQUFWLFVBQVUsdUJBQVYsVUFBVSxDQUFFLFNBQVMsS0FBSSxJQUFJLENBQUM7UUFDL0MsSUFBSSxDQUFDLFNBQVMsR0FBRyxXQUFVLGFBQVYsVUFBVSx1QkFBVixVQUFVLENBQUUsU0FBUyxLQUFJLElBQUksc0RBQWUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDcEUsSUFBSSxDQUFDLEdBQUcsR0FBRyxXQUFVLGFBQVYsVUFB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QUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN2RSxDQUFDO0lBRU8sMEJBQVcsR0FBbkIsVUFBb0IsU0FBMEI7UUFDMUMsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN4QyxJQUFNLFVBQVUsR0FBRyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDckMsSUFBTSxRQUFRLEdBQUcsOENBQUcsQ0FBQyxRQUFRLEdBQUcsVUFBVSxFQUFFLElBQUksQ0FBQyxFQUFFLEdBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkQsSUFBTSxTQUFTLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsUUFBUSxDQUFDLENBQUM7UUFDakQsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3JFLENBQUM7SUFFTSxtQkFBSSxHQUFYLFVBQVksR0FBNkI7UUFDckMsSUFBTSxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDeEIsSUFBTSxJQUFJLEdBQUcsd0RBQWEsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2hFLElBQU0sS0FBSyxHQUFHLHdEQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekUsSUFBTSxLQUFLLEdBQUcsd0RBQWEsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFF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QyxDQUFDO0FBQ3ZCLElBQU0sSUFBSSxHQUFHO0lBQ1QsSUFBTSxHQUFHLEdBQUcsTUFBTSxhQUFOLE1BQU0sdUJBQU4sTUFBTSxDQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNyQyxJQUFJLENBQUMsR0FBRyxFQUFFO1FBQ04sT0FBTyxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1FBQ3RDLE9BQU87S0FDVjtJQUNELElBQUksUUFBUSxHQUFHLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUNqQyxJQUFNLFVBQVUsR0FBRyxVQUFDLFNBQWlCO1FBQ2pDLElBQU0sTUFBTSxHQUFHLFNBQVMsR0FBRyxRQUFRLENBQUM7UUFDcEMsUUFBUSxHQUFHLFNBQVMsQ0FBQztRQUNyQixLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzVCLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3hCLGNBQWMsR0FBRyxxQkFBcUIsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN2RCxDQUFDLENBQUM7SUFDRixVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDekIsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLFFBQVEsR0FBRztJQUM5QixLQUFLLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQztJQUNoRCxLQUFLLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQztBQUN2RCxDQUFDLENBQUM7QUFFRixJQUFJLEVBQUUsQ0FBQyIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuaW1wb3J0IHsgUG9pbnQsIHBvaW50T25DaXJjbGUsIERpcmVjdGlvblZlY3RvciwgYW5nbGVCZXR3ZWVuLCBtb2QsIGNlbnRlck9mTWFzcywgYXZlcmFnZU9mRGlyZWN0aW9ucywgZGlzdGFuY2UyIH0gZnJvbSAnLi9nZW9tZXRyeSc7XHJcbmltcG9ydCBXb3JsZCwgeyB3YWxscyB9IGZyb20gJy4vV29ybGQnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBCb2lkUHJvcGVydGllcyB7XHJcbiAgICBzaXplPzogbnVtYmVyO1xyXG4gICAgc3BlZWQ/OiBudW1iZXI7XHJcbiAgICB0dXJuU3BlZWQ/OiBudW1iZXI7XHJcbiAgICBkaXJlY3Rpb24/OiBEaXJlY3Rpb25WZWN0b3I7XHJcbiAgICBwb3M/OiBQb2ludDtcclxuICAgIHdvcmxkPzogV29ybGQ7XHJcbiAgICB2aXNpb25SYWRpdXM/OiBudW1iZXI7XHJcbiAgICBjb2xvcj86IHN0cmluZztcclxuICAgIGNyb3dkaW5nRGlzdGFuY2U/OiBudW1iZXI7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJvaWQge1xyXG4gICAgcHVibGljIHNpemU6IG51bWJlcjtcclxuICAgIHB1YmxpYyBzcGVlZDogbnVtYmVyO1xyXG4gICAgcHVibGljIHR1cm5TcGVlZDogbnVtYmVyO1xyXG4gICAgcHVibGljIGRpcmVjdGlvbjogRGlyZWN0aW9uVmVjdG9yO1xyXG4gICAgcHVibGljIHBvczogUG9pbnQ7XHJcbiAgICBwcml2YXRlIHdvcmxkOiBXb3JsZDtcclxuICAgIHB1YmxpYyB2aXNpb25SYWRpdXM6IG51bWJlcjtcclxuICAgIHByaXZhdGUgY29sb3I6IHN0cmluZztcclxuICAgIHByaXZhdGUgY3Jvd2RpbmdEaXN0YW5jZTogbnVtYmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHdvcmxkOiBXb3JsZCwgcHJvcGVydGllcz86IEJvaWRQcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgdGhpcy5zaXplID0gcHJvcGVydGllcz8uc2l6ZSB8fCA1O1xyXG4gICAgICAgIHRoaXMuc3BlZWQgPSBwcm9wZXJ0aWVzPy5zcGVlZCB8fCAwLjE7XHJcbiAgICAgICAgdGhpcy50dXJuU3BlZWQgPSBwcm9wZXJ0aWVzPy50dXJuU3BlZWQgfHwgMC4wNTtcclxuICAgICAgICB0aGlzLmRpcmVjdGlvbiA9IHByb3BlcnRpZXM/LmRpcmVjdGlvbiB8fCBuZXcgRGlyZWN0aW9uVmVjdG9yKDEsIDApO1xyXG4gICAgICAgIHRoaXMucG9zID0gcHJvcGVydGllcz8ucG9zIHx8IHsgeDogMTAwLCB5OiAxMDAgfTtcclxuICAgICAgICB0aGlzLndvcmxkID0gd29ybGQ7XHJcbiAgICAgICAgdGhpcy52aXNpb25SYWRpdXMgPSBwcm9wZXJ0aWVzPy52aXNpb25SYWRpdXMgfHwgdGhpcy5zaXplICogMjA7XHJcbiAgICAgICAgdGhpcy5jcm93ZGluZ0Rpc3RhbmNlID0gcHJvcGVydGllcz8uY3Jvd2RpbmdEaXN0YW5jZSB8fCB0aGlzLnNpemUgKiA1O1xyXG4gICAgICAgIHRoaXMuY29sb3IgPSBwcm9wZXJ0aWVzPy5jb2xvciB8fCAnYmxhY2snO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGFpKCkge1xyXG4gICAgICAgIGNvbnN0IGJvaWRzV2l0aGluVmlzaW9uID0gdGhpcy53b3JsZC5ib2lkc1dpdGhpblZpc2lvbih0aGlzKTtcclxuICAgICAgICBjb25zdCB0YXJnZXRzOiBEaXJlY3Rpb25WZWN0b3JbXSA9IFtdO1xyXG4gICAgICAgIGNvbnN0IGFkZFRhcmdldCA9ICh0Z3RGOiAoYm9pZHM6IEJvaWRbXSkgPT4gRGlyZWN0aW9uVmVjdG9yIHwgbnVsbCwgd2VpZ2h0OiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdGd0ID0gdGd0Rihib2lkc1dpdGhpblZpc2lvbik7XHJcbiAgICAgICAgICAgIGlmICh0Z3QpIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGk9MDsgaTx3ZWlnaHQ7IGkrKykgdGFyZ2V0cy5wdXNoKHRndCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGJvaWRzV2l0aGluVmlzaW9uLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgLy8gYm9pZCBhY3Rpb25zXHJcbiAgICAgICAgICAgIGFkZFRhcmdldCh0aGlzLnNlcGFyYXRlLmJpbmQodGhpcyksIDIpO1xyXG4gICAgICAgICAgICBhZGRUYXJnZXQodGhpcy5hbGlnbi5iaW5kKHRoaXMpLCAxKTtcclxuICAgICAgICAgICAgYWRkVGFyZ2V0KHRoaXMuY29oZXJlLmJpbmQodGhpcyksIDEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gYWRkVGFyZ2V0KHRoaXMuYXZvaWRXYWxsLmJpbmQodGhpcyksIDIpO1xyXG5cclxuICAgICAgICBpZiAodGFyZ2V0cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RlZXJUb3dhcmQoYXZlcmFnZU9mRGlyZWN0aW9ucyh0YXJnZXRzKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYXZvaWRXYWxsKCkge1xyXG4gICAgICAgIGNvbnN0IFt3YWxsLCBkXSA9IHRoaXMud29ybGQubmVhcmVzdFdhbGwodGhpcyk7XHJcbiAgICAgICAgaWYgKGQgPD0gdGhpcy52aXNpb25SYWRpdXMpIHtcclxuICAgICAgICAgICAgaWYgKGFuZ2xlQmV0d2Vlbih3YWxsc1t3YWxsXSwgdGhpcy5kaXJlY3Rpb24pIDwgTWF0aC5QSSAvIDIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB3YWxsc1t3YWxsXS5vcHBvc2l0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLmRpcmVjdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNlcGFyYXRlKG90aGVyQm9pZHM6IEJvaWRbXSk6IERpcmVjdGlvblZlY3RvciB8IG51bGwge1xyXG4gICAgICAgIGNvbnN0IG90aGVycyA9IG90aGVyQm9pZHMuZmlsdGVyKGIgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gZGlzdGFuY2UyKGIucG9zLCB0aGlzLnBvcykgPCB0aGlzLmNyb3dkaW5nRGlzdGFuY2UqdGhpcy5jcm93ZGluZ0Rpc3RhbmNlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmIChvdGhlcnMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgY2xvc2VzdCA9IG90aGVyc1swXTtcclxuICAgICAgICBsZXQgZDIgPSB0aGlzLndvcmxkLndpZHRoICogMTA7XHJcbiAgICAgICAgb3RoZXJzLmZvckVhY2goYiA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5kID0gZGlzdGFuY2UyKHRoaXMucG9zLCBiLnBvcylcclxuICAgICAgICAgICAgaWYgKG5kIDwgZDIpIHtcclxuICAgICAgICAgICAgICAgIGQyID0gbmQ7XHJcbiAgICAgICAgICAgICAgICBjbG9zZXN0ID0gYjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBuZXcgRGlyZWN0aW9uVmVjdG9yKFxyXG4gICAgICAgICAgICB0aGlzLnBvcy54IC0gY2xvc2VzdC5wb3MueCxcclxuICAgICAgICAgICAgdGhpcy5wb3MueSAtIGNsb3Nlc3QucG9zLnlcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYWxpZ24ob3RoZXJCb2lkczogQm9pZFtdKTogRGlyZWN0aW9uVmVjdG9yIHtcclxuICAgICAgICBjb25zdCBib2lkcyA9IFt0aGlzLCAuLi5vdGhlckJvaWRzXVxyXG4gICAgICAgIHJldHVybiBhdmVyYWdlT2ZEaXJlY3Rpb25zKGJvaWRzLm1hcChiID0+IGIuZGlyZWN0aW9uKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjb2hlcmUob3RoZXJCb2lkczogQm9pZFtdKTogRGlyZWN0aW9uVmVjdG9yIHtcclxuICAgICAgICBjb25zdCBib2lkcyA9IFt0aGlzLCAuLi5vdGhlckJvaWRzXTtcclxuICAgICAgICBjb25zdCBjb20gPSBjZW50ZXJPZk1hc3MoYm9pZHMubWFwKGIgPT4gYi5wb3MpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBEaXJlY3Rpb25WZWN0b3IoY29tLnggLSB0aGlzLnBvcy54LCBjb20ueSAtIHRoaXMucG9zLnkpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcml2YXRlIHN0ZWVyVG93YXJkKGRpcmVjdGlvbjogRGlyZWN0aW9uVmVjdG9yKSB7XHJcbiAgICAgICAgY29uc3Qgb3duQW5nbGUgPSB0aGlzLmRpcmVjdGlvbi5hbmdsZSgpO1xyXG4gICAgICAgIGNvbnN0IG90aGVyQW5nbGUgPSBkaXJlY3Rpb24uYW5nbGUoKTtcclxuICAgICAgICBjb25zdCByZWZBbmdsZSA9IG1vZChvd25BbmdsZSAtIG90aGVyQW5nbGUsIE1hdGguUEkqMik7XHJcbiAgICAgICAgY29uc3QgY2xvY2t3aXNlID0gLU1hdGguc2lnbihNYXRoLlBJIC0gcmVmQW5nbGUpO1xyXG4gICAgICAgIHRoaXMuZGlyZWN0aW9uID0gdGhpcy5kaXJlY3Rpb24udHVybihjbG9ja3dpc2UgKiB0aGlzLnR1cm5TcGVlZCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1YmxpYyBkcmF3KGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKSB7XHJcbiAgICAgICAgY29uc3QgYSA9IDAuOCAqIE1hdGguUEk7XHJcbiAgICAgICAgY29uc3Qgbm9zZSA9IHBvaW50T25DaXJjbGUodGhpcy5wb3MsIHRoaXMuc2l6ZSwgdGhpcy5kaXJlY3Rpb24pO1xyXG4gICAgICAgIGNvbnN0IHRhaWwxID0gcG9pbnRPbkNpcmNsZSh0aGlzLnBvcywgdGhpcy5zaXplLCB0aGlzLmRpcmVjdGlvbi50dXJuKGEpKTtcclxuICAgICAgICBjb25zdCB0YWlsMiA9IHBvaW50T25DaXJjbGUodGhpcy5wb3MsIHRoaXMuc2l6ZSwgdGhpcy5kaXJlY3Rpb24udHVybigtYSkpO1xyXG4gICAgICAgIGNvbnN0IGJhY2sgPSBwb2ludE9uQ2lyY2xlKHRoaXMucG9zLCAwLjUqdGhpcy5zaXplLCB0aGlzLmRpcmVjdGlvbi5vcHBvc2l0ZSgpKTtcclxuXHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLmNvbG9yO1xyXG4gICAgICAgIGN0eC5tb3ZlVG8obm9zZS54LCBub3NlLnkpO1xyXG4gICAgICAgIGN0eC5saW5lVG8odGFpbDEueCwgdGFpbDEueSk7XHJcbiAgICAgICAgY3R4LmxpbmVUbyhiYWNrLngsIGJhY2sueSk7XHJcbiAgICAgICAgY3R4LmxpbmVUbyh0YWlsMi54LCB0YWlsMi55KTtcclxuICAgICAgICBjdHgubGluZVRvKG5vc2UueCwgbm9zZS55KTtcclxuICAgICAgICBjdHguZmlsbCgpO1xyXG5cclxuICAgIH07XHJcbn07XHJcbiIsImltcG9ydCB7IGRpc3RhbmNlMiwgRGlyZWN0aW9uVmVjdG9yLCBtb2QsIGNlbnRlck9mTWFzcyB9IGZyb20gJy4vZ2VvbWV0cnknO1xyXG5pbXBvcnQgQm9pZCwgeyBCb2lkUHJvcGVydGllcyB9IGZyb20gJy4vQm9pZCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXb3JsZCB7XHJcbiAgICBwdWJsaWMgd2lkdGg6IG51bWJlcjtcclxuICAgIHB1YmxpYyBoZWlnaHQ6IG51bWJlcjtcclxuICAgIHByaXZhdGUgYm9pZHM6IEJvaWRbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih3aWR0aD86IG51bWJlciwgaGVpZ2h0PzogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy53aWR0aCA9IHdpZHRoIHx8IDUwMDtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IGhlaWdodCB8fCA0MDA7XHJcbiAgICAgICAgdGhpcy5ib2lkcyA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRCb2lkKHByb3BlcnRpZXM6IEJvaWRQcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgdGhpcy5ib2lkcy5wdXNoKG5ldyBCb2lkKHRoaXMsIHByb3BlcnRpZXMpKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVtb3ZlQm9pZCgpIHtcclxuICAgICAgICB0aGlzLmJvaWRzID0gdGhpcy5ib2lkcy5zbGljZSgwLCB0aGlzLmJvaWRzLmxlbmd0aC0xKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYW1vdW50T2ZCb2lkcygpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmJvaWRzLmxlbmd0aDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYm9pZHNXaXRoaW5WaXNpb24oYm9pZDogQm9pZCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmJvaWRzLmZpbHRlcihiID0+IHtcclxuICAgICAgICAgICAgaWYgKGIgPT09IGJvaWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZGlzdGFuY2UyKGJvaWQucG9zLCBiLnBvcykgPD0gYm9pZC52aXNpb25SYWRpdXMqYm9pZC52aXNpb25SYWRpdXM7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNpbXVsYXRlV29ybGQgPSAoZGVsdGFUOiBudW1iZXIpID0+IHtcclxuICAgICAgICB0aGlzLmJvaWRzLmZvckVhY2goYm9pZCA9PiB7XHJcbiAgICAgICAgICAgIGJvaWQuYWkoKTtcclxuXHJcbiAgICAgICAgICAgIGJvaWQucG9zLnggKz0gZGVsdGFUICogYm9pZC5zcGVlZCAqIGJvaWQuZGlyZWN0aW9uLng7XHJcbiAgICAgICAgICAgIGJvaWQucG9zLnkgKz0gZGVsdGFUICogYm9pZC5zcGVlZCAqIGJvaWQuZGlyZWN0aW9uLnk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnNpbXVsYXRlUG9ydGFsV2FsbHMoYm9pZCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICBwcml2YXRlIHNpbXVsYXRlUG9ydGFsV2FsbHMoYm9pZDogQm9pZCkge1xyXG4gICAgICAgIGJvaWQucG9zLnggPSBtb2QoYm9pZC5wb3MueCwgdGhpcy53aWR0aCk7XHJcbiAgICAgICAgYm9pZC5wb3MueSA9IG1vZChib2lkLnBvcy55LCB0aGlzLmhlaWdodCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByaXZhdGUgc2ltdWxhdGVTb2xpZFdhbGxzKGJvaWQ6IEJvaWQpIHtcclxuICAgICAgICBib2lkLnBvcy54ID0gTWF0aC5taW4oTWF0aC5tYXgoYm9pZC5wb3MueCwgMCksIHRoaXMud2lkdGgpOyBcclxuICAgICAgICBib2lkLnBvcy55ID0gTWF0aC5taW4oTWF0aC5tYXgoYm9pZC5wb3MueSwgMCksIHRoaXMuaGVpZ2h0KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaGlsaWdodEdyb3VwID0gKGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBib2lkOiBCb2lkKSA9PiB7XHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSAnYWxpY2VibHVlJztcclxuICAgICAgICBjdHgubW92ZVRvKGJvaWQucG9zLngrYm9pZC52aXNpb25SYWRpdXMvMiwgYm9pZC5wb3MueSk7XHJcbiAgICAgICAgY3R4LmFyYyhib2lkLnBvcy54LCBib2lkLnBvcy55LCBib2lkLnZpc2lvblJhZGl1cy8yLCAwLCBNYXRoLlBJKjIpO1xyXG4gICAgICAgIGN0eC5maWxsKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGhpbGlnaHRWaXNpb24gPSAoY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpID0+IHtcclxuICAgICAgICBpZiAodGhpcy5ib2lkcy5sZW5ndGggPCAxKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgbWFpbiA9IHRoaXMuYm9pZHNbMF07XHJcbiAgICAgICAgY29uc3QgaW5WaXNpb24gPSB0aGlzLmJvaWRzV2l0aGluVmlzaW9uKG1haW4pO1xyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSAnZ29sZCc7XHJcbiAgICAgICAgY3R4LmFyYyhtYWluLnBvcy54LCBtYWluLnBvcy55LCBtYWluLnZpc2lvblJhZGl1cywgMCwgTWF0aC5QSSAqIDIpO1xyXG4gICAgICAgIGN0eC5tb3ZlVG8obWFpbi5wb3MueCArIDUsIG1haW4ucG9zLnkpO1xyXG4gICAgICAgIGN0eC5hcmMobWFpbi5wb3MueCwgbWFpbi5wb3MueSwgNSwgMCwgTWF0aC5QSSAqIDIpO1xyXG4gICAgICAgIGN0eC5zdHJva2UoKTtcclxuXHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICdncmVlbic7XHJcbiAgICAgICAgaW5WaXNpb24uZm9yRWFjaChvdGhlciA9PiB7XHJcbiAgICAgICAgICAgIGN0eC5tb3ZlVG8ob3RoZXIucG9zLnggKyA1LCBvdGhlci5wb3MueSk7XHJcbiAgICAgICAgICAgIGN0eC5hcmMob3RoZXIucG9zLngsIG90aGVyLnBvcy55LCA1LCAwLCBNYXRoLlBJICogMik7XHJcbiAgICAgICAgfSlcclxuICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGhpbGlnaHROZWFyZXN0V2FsbCA9IChjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCkgPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLmJvaWRzLmxlbmd0aCA8IDEpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCB3YWxsID0gdGhpcy5uZWFyZXN0V2FsbCh0aGlzLmJvaWRzWzBdKVswXTtcclxuICAgICAgICBjb25zdCBiZWdpbiA9ICh3YWxsID09PSAnbm9ydGgnIHx8IHdhbGwgPT09ICd3ZXN0JylcclxuICAgICAgICAgICAgPyB7IHg6IDAsIHk6IDAgfVxyXG4gICAgICAgICAgICA6IHsgeDogdGhpcy53aWR0aCwgeTogdGhpcy5oZWlnaHQgfTtcclxuICAgICAgICBjb25zdCBlbmQgPSAod2FsbCA9PT0gJ3dlc3QnIHx8IHdhbGwgPT09ICdlYXN0JylcclxuICAgICAgICAgICAgPyB7IHg6IGJlZ2luLngsIHk6IHRoaXMuaGVpZ2h0IC0gYmVnaW4ueSB9IC8vIHZlcnRpY2FsXHJcbiAgICAgICAgICAgIDogeyB4OiB0aGlzLndpZHRoIC0gYmVnaW4ueCwgeTogYmVnaW4ueSB9O1xyXG5cclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJ3JlZCc7XHJcbiAgICAgICAgY3R4Lm1vdmVUbyhiZWdpbi54LCBiZWdpbi55KTtcclxuICAgICAgICBjdHgubGluZVRvKGVuZC54LCBlbmQueSk7XHJcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICdibGFjayc7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBoaWxpZ2h0Qm9pZENlbnRlck9mTWFzcyhjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCkge1xyXG4gICAgICAgIGNvbnN0IGNvbSA9IGNlbnRlck9mTWFzcyh0aGlzLmJvaWRzLm1hcChiID0+IGIucG9zKSk7XHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5hcmMoY29tLngsIGNvbS55LCA1LCAwLCBNYXRoLlBJICogMik7XHJcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaGlsaWdodEFuZ2xlcyhjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCkge1xyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjb25zdCByID0gMjA7IFxyXG4gICAgICAgIHRoaXMuYm9pZHMuZm9yRWFjaCgoeyBwb3M6eyB4LCB5IH0sIGRpcmVjdGlvbiB9KSA9PiB7XHJcbiAgICAgICAgICAgIGN0eC5tb3ZlVG8oeCArIHIsIHkpO1xyXG4gICAgICAgICAgICBjdHguYXJjKHgsIHksIHIsIDAsIGRpcmVjdGlvbi5hbmdsZSgpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkcmF3ID0gKGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBjb25maWc6IERyYXdpbmdDb25maWcpID0+IHtcclxuICAgICAgICBjdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gJ3doaXRlJztcclxuICAgICAgICBjdHguZmlsbFJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSAnYmxhY2snO1xyXG5cclxuICAgICAgICBpZiAoY29uZmlnLnNob3dHcm91cCkge1xyXG4gICAgICAgICAgICB0aGlzLmJvaWRzLmZvckVhY2goYm9pZCA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhpbGlnaHRHcm91cChjdHgsIGJvaWQpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5ib2lkcy5mb3JFYWNoKGJvaWQgPT4ge1xyXG4gICAgICAgICAgICBib2lkLmRyYXcoY3R4KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgICAgICBpZiAoY29uZmlnLnNob3dWaXNpb24pIHtcclxuICAgICAgICAgICAgdGhpcy5oaWxpZ2h0VmlzaW9uKGN0eCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjb25maWcuc2hvd0NlbnRlck9mTWFzcykge1xyXG4gICAgICAgICAgICB0aGlzLmhpbGlnaHRCb2lkQ2VudGVyT2ZNYXNzKGN0eCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwdWJsaWMgbmVhcmVzdFdhbGwgPSAoYm9pZDogQm9pZCk6IFtXYWxsLCBudW1iZXJdID0+IHtcclxuICAgICAgICBjb25zdCB7IHgsIHkgfSA9IGJvaWQucG9zO1xyXG4gICAgICAgIGxldCBkID0geTtcclxuICAgICAgICBsZXQgd2FsbDogV2FsbCA9ICdub3J0aCc7XHJcbiAgICAgICAgaWYgKHggPCBkKSB7XHJcbiAgICAgICAgICAgIGQgPSB4OyB3YWxsID0gJ3dlc3QnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy53aWR0aCAtIHggPCBkKSB7XHJcbiAgICAgICAgICAgIGQgPSB0aGlzLndpZHRoIC0geDsgd2FsbCA9ICdlYXN0JztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuaGVpZ2h0IC0geSA8IGQpIHtcclxuICAgICAgICAgICAgZCA9IHRoaXMuaGVpZ2h0IC0geTsgd2FsbCA9ICdzb3V0aCc7XHJcbiAgICAgICAgfVxyXG4gICAgXHJcbiAgICAgICAgcmV0dXJuIFt3YWxsLCBkXTtcclxuICAgIH07XHJcblxyXG4gICAgcHVibGljIGNoYW5nZUJvaWRTaXplKHNpemU6IG51bWJlcikge1xyXG4gICAgICAgIGlmIChzaXplIDwgMSB8fCAwLjUqdGhpcy5oZWlnaHQgPCBzaXplKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5ib2lkcy5mb3JFYWNoKGIgPT4ge1xyXG4gICAgICAgICAgICBiLnNpemUgPSBzaXplO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBEcmF3aW5nQ29uZmlnIHtcclxuICAgIHNob3dHcm91cD86IGJvb2xlYW47XHJcbiAgICBzaG93Q2VudGVyT2ZNYXNzPzogYm9vbGVhbjtcclxuICAgIHNob3dWaXNpb24/OiBib29sZWFuO1xyXG59XHJcblxyXG4vLyB3YWxsc1xyXG5cclxuZXhwb3J0IGNvbnN0IHdhbGxzID0ge1xyXG4gICAgbm9ydGg6IG5ldyBEaXJlY3Rpb25WZWN0b3IoMCwgLTEpLFxyXG4gICAgc291dGg6IG5ldyBEaXJlY3Rpb25WZWN0b3IoMCwgMSksXHJcbiAgICBlYXN0OiBuZXcgRGlyZWN0aW9uVmVjdG9yKDEsIDApLFxyXG4gICAgd2VzdDogbmV3IERpcmVjdGlvblZlY3RvcigtMSwgMCksXHJcbn07XHJcblxyXG5leHBvcnQgdHlwZSBXYWxsID0ga2V5b2YgdHlwZW9mIHdhbGxzO1xyXG4iLCJcclxuZXhwb3J0IGludGVyZmFjZSBQb2ludCB7XHJcbiAgICB4OiBudW1iZXI7XHJcbiAgICB5OiBudW1iZXI7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBEaXJlY3Rpb25WZWN0b3Ige1xyXG4gICAgcHVibGljIHg6IG51bWJlcjtcclxuICAgIHB1YmxpYyB5OiBudW1iZXI7XHJcbiAgICBjb25zdHJ1Y3Rvcih4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMueCA9IHggLyBNYXRoLmh5cG90KHgsIHkpO1xyXG4gICAgICAgIHRoaXMueSA9IHkgLyBNYXRoLmh5cG90KHgsIHkpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHR1cm4oYTogbnVtYmVyKTogRGlyZWN0aW9uVmVjdG9yIHtcclxuICAgICAgICByZXR1cm4gbmV3IERpcmVjdGlvblZlY3RvcihcclxuICAgICAgICAgICAgdGhpcy54ICogTWF0aC5jb3MoYSkgLSB0aGlzLnkgKiBNYXRoLnNpbihhKSxcclxuICAgICAgICAgICAgdGhpcy54ICogTWF0aC5zaW4oYSkgKyB0aGlzLnkgKiBNYXRoLmNvcyhhKVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgb3Bwb3NpdGUoKTogRGlyZWN0aW9uVmVjdG9yIHtcclxuICAgICAgICByZXR1cm4gbmV3IERpcmVjdGlvblZlY3RvcigtdGhpcy54LCAtdGhpcy55KTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBhbmdsZSgpOiBudW1iZXIge1xyXG4gICAgICAgIGlmICh0aGlzLnkgPCAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAtTWF0aC5hY29zKHRoaXMueCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBNYXRoLmFjb3ModGhpcy54KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGFuZ2xlQmV0d2VlbiA9IChhOiBEaXJlY3Rpb25WZWN0b3IsIGI6IERpcmVjdGlvblZlY3RvcikgPT4ge1xyXG4gICAgcmV0dXJuIE1hdGguYWNvcyhhLngqYi54ICsgYS55KmIueSk7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBkaXJlY3Rpb25Gcm9tQW5nbGUgPSAoYTogbnVtYmVyKTogRGlyZWN0aW9uVmVjdG9yID0+IHtcclxuICAgIHJldHVybiBuZXcgRGlyZWN0aW9uVmVjdG9yKE1hdGguY29zKGEpLCBNYXRoLnNpbihhKSk7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgcG9pbnRPbkNpcmNsZSA9IChcclxuICAgIG9yaWdpbjogUG9pbnQsXHJcbiAgICByYWRpdXM6IG51bWJlcixcclxuICAgIGRpcmVjdGlvbjogRGlyZWN0aW9uVmVjdG9yXHJcbik6IFBvaW50ID0+ICh7XHJcbiAgICB4OiBvcmlnaW4ueCArIHJhZGl1cyAqIGRpcmVjdGlvbi54LFxyXG4gICAgeTogb3JpZ2luLnkgKyByYWRpdXMgKiBkaXJlY3Rpb24ueSxcclxufSk7XHJcblxyXG5leHBvcnQgY29uc3QgZEFuZ2xlID0gKGExOiBudW1iZXIsIGEyOiBudW1iZXIpID0+IHtcclxuICAgIGNvbnN0IGRlbHRhID0gbW9kKGExIC0gYTIsIE1hdGguUEkqMik7XHJcbiAgICByZXR1cm4gTWF0aC5taW4oZGVsdGEsIE1hdGguUEkqMiAtIGRlbHRhKTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IG1vZCA9IChhOiBudW1iZXIsIG06IG51bWJlcikgPT4ge1xyXG4gICAgcmV0dXJuICgoYSAlIG0pICsgbSkgJSBtO1xyXG59XHJcblxyXG5jb25zdCBkaXN0YW5jZSA9IChwMTogUG9pbnQsIHAyOiBQb2ludCkgPT4ge1xyXG4gICAgY29uc3QgZHggPSBNYXRoLmFicyhwMS54IC0gcDIueCk7XHJcbiAgICBjb25zdCBkeSA9IE1hdGguYWJzKHAxLnkgLSBwMi55KTtcclxuICAgIHJldHVybiBNYXRoLmh5cG90KGR4LCBkeSk7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBkaXN0YW5jZTIgPSAocDE6IFBvaW50LCBwMjogUG9pbnQpID0+IHtcclxuICAgIGNvbnN0IGR4ID0gcDEueCAtIHAyLng7XHJcbiAgICBjb25zdCBkeSA9IHAxLnkgLSBwMi55O1xyXG4gICAgcmV0dXJuIGR4KmR4ICsgZHkqZHk7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBjZW50ZXJPZk1hc3MgPSAocG9pbnRzOiBQb2ludFtdKTogUG9pbnQgPT4gKHtcclxuICAgIHg6IHBvaW50cy5tYXAocCA9PiBwLngpLnJlZHVjZShhZGQpIC8gcG9pbnRzLmxlbmd0aCxcclxuICAgIHk6IHBvaW50cy5tYXAocCA9PiBwLnkpLnJlZHVjZShhZGQpIC8gcG9pbnRzLmxlbmd0aCxcclxufSk7XHJcblxyXG5leHBvcnQgY29uc3QgYXZlcmFnZU9mRGlyZWN0aW9ucyA9IChkczogRGlyZWN0aW9uVmVjdG9yW10pOiBEaXJlY3Rpb25WZWN0b3IgPT4ge1xyXG4gICAgY29uc3QgeyB4LCB5IH0gPSBjZW50ZXJPZk1hc3MoZHMpO1xyXG4gICAgaWYgKHggPT09IDAgJiYgeSA9PT0gMCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgRGlyZWN0aW9uVmVjdG9yKDEsIDApO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5ldyBEaXJlY3Rpb25WZWN0b3IoeCwgeSk7XHJcbn07XHJcblxyXG5jb25zdCBhZGQgPSAoYTogbnVtYmVyLCBiOiBudW1iZXIpID0+IGEgKyBiO1xyXG4iLCJpbXBvcnQgeyBEaXJlY3Rpb25WZWN0b3IsIGRpcmVjdGlvbkZyb21BbmdsZSwgUG9pbnQgfSBmcm9tIFwiLi4vZW50aXRpZXMvZ2VvbWV0cnlcIjtcclxuXHJcbmV4cG9ydCBjb25zdCByYW5kb21CZXR3ZWVuID0gKGE6IG51bWJlciwgYjogbnVtYmVyKTpudW1iZXIgPT4ge1xyXG4gICAgcmV0dXJuIE1hdGgucmFuZG9tKCkgKiBNYXRoLmFicyhhLWIpICsgTWF0aC5taW4oYSwgYik7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgcmFuZG9tQ29sb3JDb25maWcge1xyXG4gICAgbWluTGlnaHRuZXNzPzogbnVtYmVyO1xyXG4gICAgbWF4TGlnaHRuZXNzPzogbnVtYmVyO1xyXG4gICAgbWluU2F0dXJhdGlvbj86IG51bWJlcjtcclxuICAgIG1heFNhdHVyYXRpb24/OiBudW1iZXI7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCByYW5kb21Db2xvciA9IChcclxuICAgIGh1ZTogbnVtYmVyLFxyXG4gICAgbW9kZTogJ3NhdHVyYXRpb24nIHwgJ2xpZ2h0bmVzcycgfCAnYm90aCcsXHJcbiAgICBjb25maWc/OiByYW5kb21Db2xvckNvbmZpZ1xyXG4pOiBzdHJpbmcgPT4ge1xyXG4gICAgbGV0IHNhdHVyYXRpb24gPSA5MCwgbGlnaHRuZXNzID0gNTA7XHJcbiAgICBpZiAobW9kZSA9PT0gJ3NhdHVyYXRpb24nIHx8IG1vZGUgPT09ICdib3RoJykge1xyXG4gICAgICAgIHNhdHVyYXRpb24gPSByYW5kb21CZXR3ZWVuKGNvbmZpZz8ubWluU2F0dXJhdGlvbiB8fCAwLCBjb25maWc/Lm1heFNhdHVyYXRpb24gfHwgMTAwKTtcclxuICAgIH1cclxuICAgIGlmIChtb2RlID09PSAnbGlnaHRuZXNzJyB8fCBtb2RlID09PSAnYm90aCcpIHtcclxuICAgICAgICBsaWdodG5lc3MgPSByYW5kb21CZXR3ZWVuKGNvbmZpZz8ubWluTGlnaHRuZXNzIHx8IDAsIGNvbmZpZz8ubWF4TGlnaHRuZXNzIHx8IDEwMCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYGhzbCgke2h1ZX0sICR7c2F0dXJhdGlvbn0lLCAke2xpZ2h0bmVzc30lKWA7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCByYW5kb21EaXJlY3Rpb24gPSAoKTogRGlyZWN0aW9uVmVjdG9yID0+IGRpcmVjdGlvbkZyb21BbmdsZShNYXRoLnJhbmRvbSgpICogTWF0aC5QSSAqIDIpO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBSYW5kb21Qb3NpdGlvbkNvbmZpZyB7XHJcbiAgICBtYXhYOiBudW1iZXI7XHJcbiAgICBtaW5YOiBudW1iZXI7XHJcbiAgICBtYXhZOiBudW1iZXI7XHJcbiAgICBtaW5ZOiBudW1iZXI7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCByYW5kb21Qb3NpdGlvbiA9IChjb25maWc6IFJhbmRvbVBvc2l0aW9uQ29uZmlnKTogUG9pbnQgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB4OiByYW5kb21CZXR3ZWVuKGNvbmZpZy5tYXhYLCBjb25maWcubWluWCksXHJcbiAgICAgICAgeTogcmFuZG9tQmV0d2Vlbihjb25maWcubWF4WSwgY29uZmlnLm1pblkpLFxyXG4gICAgfTtcclxufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdGlmKF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0pIHtcblx0XHRyZXR1cm4gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgZGVmaW5pdGlvbikge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmosIHByb3ApIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApOyB9IiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgV29ybGQsIHsgRHJhd2luZ0NvbmZpZyB9IGZyb20gJy4vZW50aXRpZXMvV29ybGQnO1xyXG5pbXBvcnQgeyBCb2lkUHJvcGVydGllcyB9IGZyb20gJy4vZW50aXRpZXMvQm9pZCc7XHJcbmltcG9ydCB7IHJhbmRvbVBvc2l0aW9uLCByYW5kb21Db2xvciwgcmFuZG9tRGlyZWN0aW9uIH0gZnJvbSAnLi91dGlscy9yYW5kb20nO1xyXG5cclxuaW50ZXJmYWNlIFNpbXVsYXRpb25Db25maWcgZXh0ZW5kcyBEcmF3aW5nQ29uZmlnIHtcclxuICAgIGJvaWRQcm9wZXJ0aWVzOiBCb2lkUHJvcGVydGllcztcclxuICAgIGFtb3VudE9mQm9pZHM6IG51bWJlcjtcclxuICAgIHdpbmRvd1dpZHRoPzogbnVtYmVyO1xyXG4gICAgd2luZG93SGVpZ2h0PzogbnVtYmVyO1xyXG59XHJcblxyXG5cclxuY29uc3QgY3JlYXRlV29ybGQgPSAoY29uZmlnOiBTaW11bGF0aW9uQ29uZmlnKSA9PiB7XHJcbiAgICBjb25zdCB3b3JsZCA9IG5ldyBXb3JsZChjb25maWcud2luZG93V2lkdGgsIGNvbmZpZy53aW5kb3dIZWlnaHQpO1xyXG4gICAgY29uc3QgbiA9IGNvbmZpZy5hbW91bnRPZkJvaWRzO1xyXG4gICAgY29uc3QgcGFkID0gMjA7XHJcbiAgICBmb3IgKGxldCBpPTA7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICB3b3JsZC5hZGRCb2lkKHtcclxuICAgICAgICAgICAgLi4uKGNvbmZpZy5ib2lkUHJvcGVydGllc3x8IHt9KSxcclxuICAgICAgICAgICAgcG9zOiByYW5kb21Qb3NpdGlvbih7IG1heFg6IHdvcmxkLndpZHRoIC0gcGFkLCBtaW5YOiBwYWQsIG1heFk6IHdvcmxkLmhlaWdodCAtIHBhZCwgbWluWTogcGFkIH0pLFxyXG4gICAgICAgICAgICBjb2xvcjogcmFuZG9tQ29sb3IoMjQwLCAnbGlnaHRuZXNzJywgeyBtaW5MaWdodG5lc3M6IDIwLCBtYXhMaWdodG5lc3M6IDcwIH0pLFxyXG4gICAgICAgICAgICBkaXJlY3Rpb246IHJhbmRvbURpcmVjdGlvbigpLFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHdvcmxkO1xyXG59XHJcbmNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3b3JsZCcpIGFzIEhUTUxDYW52YXNFbGVtZW50O1xyXG5jb25zdCBjb25maWc6IFNpbXVsYXRpb25Db25maWcgPSB7XHJcbiAgICBhbW91bnRPZkJvaWRzOiA4MCxcclxuICAgIGJvaWRQcm9wZXJ0aWVzOiB7XHJcblxyXG4gICAgfSxcclxuICAgIHdpbmRvd1dpZHRoOiBjYW52YXMub2Zmc2V0V2lkdGgsXHJcbiAgICB3aW5kb3dIZWlnaHQ6IGNhbnZhcy5vZmZzZXRIZWlnaHQsXHJcbn07XHJcbmNvbnN0IHdvcmxkID0gY3JlYXRlV29ybGQoY29uZmlnKTtcclxuaWYgKCFjYW52YXMpIHtcclxuICAgIGNvbnNvbGUud2FybignQ291bGQgbm90IGZpbmQgdGhlIGNhbnZhcyEnKTtcclxufVxyXG5sZXQgYW5pbWF0aW9uRnJhbWUgPSAwO1xyXG5jb25zdCBwbGF5ID0gKCkgPT4ge1xyXG4gICAgY29uc3QgY3R4ID0gY2FudmFzPy5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgaWYgKCFjdHgpIHtcclxuICAgICAgICBjb25zb2xlLndhcm4oJ0ZhaWxlZCB0byBnZXQgY29udGV4dCcpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGxldCBsYXN0VGljayA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG4gICAgY29uc3QgcmVuZGVyTG9vcCA9ICh0aW1lc3RhbXA6IG51bWJlcikgPT4ge1xyXG4gICAgICAgIGNvbnN0IGRlbHRhVCA9IHRpbWVzdGFtcCAtIGxhc3RUaWNrO1xyXG4gICAgICAgIGxhc3RUaWNrID0gdGltZXN0YW1wO1xyXG4gICAgICAgIHdvcmxkLnNpbXVsYXRlV29ybGQoZGVsdGFUKTtcclxuICAgICAgICB3b3JsZC5kcmF3KGN0eCwgY29uZmlnKTtcclxuICAgICAgICBhbmltYXRpb25GcmFtZSA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShyZW5kZXJMb29wKTtcclxuICAgIH07XHJcbiAgICByZW5kZXJMb29wKGxhc3RUaWNrKTtcclxufVxyXG5cclxud2luZG93Lm9ubG9hZCA9IHdpbmRvdy5vbnJlc2l6ZSA9ICgpID0+IHtcclxuICAgIHdvcmxkLndpZHRoID0gY2FudmFzLndpZHRoID0gY2FudmFzLm9mZnNldFdpZHRoO1xyXG4gICAgd29ybGQuaGVpZ2h0ID0gY2FudmFzLmhlaWdodCA9IGNhbnZhcy5vZmZzZXRIZWlnaHQ7XHJcbn07XHJcblxyXG5wbGF5KCk7Il0sInNvdXJjZVJvb3QiOiIifQ==