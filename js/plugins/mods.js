class mapSprite extends PIXI.Sprite {

    constructor(name, texture) {
        super(texture);
        this.name = name;
    }

    updatePosition() {
        this.x = -($gameMap._displayX * $gameMap.tileWidth()) + this.realX;
        this.y = -($gameMap._displayY * $gameMap.tileHeight()) + this.realY;
    }

    update() {
        this.updatePosition();

    }

    fade(alpha = 1, speed = 0.5) {
        if (this.alpha === alpha) {
            return
        }

        TweenMax.to(this, speed,
            {
                alpha: alpha,
                onStart: () => {
                    this.visible = true;
                },
                onComplete: () => {
                    if (alpha === 0) {
                        this.visible = false;
                    }
                }
            })
    }
}

class mapParticleContainer extends PIXI.particles.ParticleContainer {
    constructor(name, ...args) {
        super(...args);
        this.name = name;
    }

    updatePosition() {
        this.x = -($gameMap._displayX * $gameMap.tileWidth()) + this.realX;
        this.y = -($gameMap._displayY * $gameMap.tileHeight()) + this.realY;
    }

    update() {
        this.updatePosition();
    }
}

class mapMatrixSprite extends mapSprite {
    constructor(name, texture, matrix) {
        super(name);
        this.generateMatrixTexture(texture, matrix);
    }

    generateMatrixTexture(texture, matrix) {
        //Draw tiles by matrix to render texture
        let tileWidth = $gameMap.tileWidth();
        let tileHeight = $gameMap.tileHeight();
        let textureWidth = matrix[0].length * tileWidth;
        let textureHeight = matrix.length * tileHeight;
        let renderTexture = PIXI.RenderTexture.create(textureWidth, textureHeight);
        let renderer = Graphics._renderer;

        matrix.forEach((row, matrY) => {
            row.forEach((col, matrX) => {
                if (col === 0) {
                    return
                }

                let tileSprite = new PIXI.Sprite(texture);

                tileSprite.x = matrX * tileWidth;
                tileSprite.y = matrY * tileHeight;
                tileSprite.alpha = col;


                renderer.render(tileSprite, renderTexture, false)
            })
        });

        this.texture = renderTexture;
    }
}

class mapScript {
    constructor(scene) {
        //Object maked right after map display objects
        this._isReady = false;
        this.map = scene;
        this.tilemap = this.map._spriteset._tilemap;
        this.sprites = {};

        this.resources = [];
        this.res = PIXI.loader.resources;
        this.loadResources()

    }

    setup(ready = true) {
        this.createRoofs();
        this.createExitZones();

        $gameSystem.disableMenu();

        this._isReady = ready;
    }

    loadResources() {
        this.resources.push("img/pictures/roofs/TentRoof_L.png");
        this.resources.push("img/pictures/roofs/TentRoof_S.png");
        this.resources.push("img/pictures/roofs/KB_roof.png");
        this.resources.push("img/pictures/roofs/KB_roof2.png");

        PIXI.loader.add(this.resources);
        PIXI.loader.load(this.setup.bind(this))
    }

    createRoofs() {
        this.addSprite({
            name: "khanBaseBigTentOneRoof",
            texture: this.res["img/pictures/roofs/TentRoof_L.png"].texture,
            x: 10,
            y: 21
        });

        this.addSprite({
            name: "khanBaseBigTentTwoRoof",
            texture: this.res["img/pictures/roofs/TentRoof_L.png"].texture,
            x: 24,
            y: 40
        });

        this.addSprite({
            name: "khanBaseSmallTentOneRoof",
            texture: this.res["img/pictures/roofs/TentRoof_S.png"].texture,
            x: 13,
            y: 34
        });

        this.addSprite({
            name: "khanBaseSmallTentTwoRoof",
            texture: this.res["img/pictures/roofs/TentRoof_S.png"].texture,
            x: 44,
            y: 30
        });

        this.addSprite({
            name: "khanBaseMainBuildingRoof",
            texture: this.res["img/pictures/roofs/KB_roof.png"].texture,
            x: 21,
            y: 17,
            z: 5.1
        });

        //***
        //Zones
        //***

        this.addSprite({
            name: "khanBaseMainBuildingInnerCorridorRoof",
            texture: this.res["img/pictures/roofs/KB_roof2.png"].texture,
            x: 22,
            y: 18,
            matrix: [
                [1, 1, 1, 0, 1, 1],
                [1, 1, 1, 0, 1, 1],
                [1, 1, 1, 0, 1, 1],
                [1, 1, 1, 0, 1, 1],
                [0, 1, 0, 0, 1, 1],
                [1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1],
                [0, 1, 0, 0, 1, 1],
                [1, 1, 1, 0, 1, 1],
                [1, 1, 1, 0, 1, 1],
                [1, 1, 1, 0, 1, 1],
                [1, 1, 1, 0, 1, 1],
            ]
        });

        this.addSprite({
            name: "khanBaseMainBuildingInnerBackRoomRoof",
            texture: this.res["img/pictures/roofs/KB_roof2.png"].texture,
            x: 29,
            y: 17,
            matrix: [
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 0, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1],
            ]
        });

        this.addSprite({
            name: "khanBaseMainBuildingInnerFrontRoomRoof",
            texture: this.res["img/pictures/roofs/KB_roof2.png"].texture,
            x: 33,
            y: 32,
            matrix: [
                [1, 1, 1, 0, 1],
                [1, 1, 1, 0, 1],
                [1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1],
                [0, 1, 0, 0, 0],
            ]

        });

        this.addSprite({
            name: "khanBaseMainBuildingInnerMainRoomRoof",
            texture: this.res["img/pictures/roofs/KB_roof2.png"].texture,
            x: 29,
            y: 23,
            matrix: [
                [1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1],
                [0, 0, 0, 0, 0, 0, 0, 1, 0],
            ]
        });

        //***
        //Doors
        //***

        this.addSprite({
            name: "khanBaseMainBuildingInnerBackCorridorDoor",
            texture: this.res["img/pictures/roofs/KB_roof2.png"].texture,
            x: 28,
            y: 20,
            matrix: [
                [1],
                [1],
            ]
        });

        this.addSprite({
            name: "khanBaseMainBuildingInnerMainCorridorDoor",
            texture: this.res["img/pictures/roofs/KB_roof2.png"].texture,
            x: 28,
            y: 28,
            matrix: [
                [1],
                [1],
            ]
        });

        this.addSprite({
            name: "khanBaseMainBuildingInnerMainFrontDoor",
            texture: this.res["img/pictures/roofs/KB_roof2.png"].texture,
            x: 36,
            y: 32,
            matrix: [
                [1],
                [1],
            ]
        });

        this.addSprite({
            name: "khanBaseMainBuildingInnerBackDoor",
            texture: this.res["img/pictures/roofs/KB_roof2.png"].texture,
            x: 35,
            y: 17,
            matrix: [
                [1],
                [1],
            ]
        });

    }

    createExitZones() {
        this.drawSquares({
            name: "exitZones",
            number: 5,
            color: 0x9b0000
        })
    }

    isReady() {
        return this._isReady;
    }

    addSprite(params = {}) {
        if (!params.name) {
            log.error("mapScript: addSprite: no name")();
            return
        }

        let realX;
        let realY;

        if (params.x !== undefined && params.y !== undefined) {
            realX = $gameMap.tileWidth() * params.x;
            realY = $gameMap.tileHeight() * params.y;
        } else if (params.realX !== undefined && params.realY !== undefined) {
            realX = params.realX;
            realY = params.realY;
        } else {
            return
        }

        let sprite;
        if (params.matrix && params.texture) {
            sprite = new mapMatrixSprite(params.name, params.texture, params.matrix);
        } else {
            sprite = new mapSprite(params.name, params.texture);
        }

        sprite.z = params.z === undefined ? 5 : params.z;

        sprite.realX = realX;
        sprite.realY = realY;
        this.tilemap.addChild(sprite);
        this.sprites[params.name] = sprite;

        return sprite
    }

    drawSquares(config = {}) {
        if (!config.number) {
            return
        }

        if (!config.name) {
            return
        }

        config.alpha = config.alpha !== undefined ? config.alpha : .5;
        config.color = config.color !== undefined ? config.color : 0xffffff;

        let tileWidth = $gameMap.tileWidth();
        let tileHeight = $gameMap.tileHeight();
        let mapWidth = $gameMap.width();
        let mapHeight = $gameMap.height();

        let renderer = Graphics._renderer;
        //Create map special particle container
        let particleContainer = new mapParticleContainer(config.name, 1500, {
            position: true
        });

        particleContainer.realX = 0;
        particleContainer.realY = 0;
        particleContainer.z = 3;

        //Create one texture for all child sprites
        let graphics = new PIXI.Graphics;
        graphics.beginFill(config.color, config.alpha);

        graphics.drawCircle(tileWidth / 2, tileHeight / 2, tileWidth / 4);

        graphics.endFill();

        //one baseTexture is shared between particle container children
        let texture = renderer.generateTexture(graphics);

        for (let xpos = 0; xpos < mapWidth; xpos++) {
            for (let ypos = 0; ypos < mapHeight; ypos++) {
                if ($gameMap.regionId(xpos, ypos) === config.number) {
                    let xdest = xpos * tileWidth;
                    let ydest = ypos * tileHeight;

                    let sprite = new PIXI.Sprite(texture);
                    // sprite.position.set(xdest, ydest);
                    sprite.position.set(xdest + sprite.width / 2, ydest + sprite.height / 2);
                    particleContainer.addChild(sprite);
                }
            }
        }

        this.tilemap.addChild(particleContainer)
    }

}

$mapScript = null;

(function () {
    let isReady = Scene_Map.prototype.isReady;
    Scene_Map.prototype.isReady = function () {
        return isReady.call(this) && ($mapScript && $mapScript.isReady())
    };

    Scene_Map.prototype.createDisplayObjects = function() {
        this.createSpriteset();
        $mapScript = new mapScript(this);

        //Prevent _mapNameWindow errors
        this._mapNameWindow = {
            open: () => {},
            close: () => {},
            hide: () => {},
        }

        //Do not create windows

        // this.createMapNameWindow();
        // this.createWindowLayer();
        // this.createAllWindows();
    };

    //Disable unused resources
    Sprite_Actor.prototype.createShadowSprite = function() {};

    Sprite_Actor.prototype.updateShadow = function() {};

    Spriteset_Map.prototype.createShadow = function() {};

    Spriteset_Map.prototype.updateShadow = function() {};

    Scene_Boot.prototype.loadSystemWindowImage = function() {
        // ImageManager.reserveSystem('Window');
    };

    Scene_Boot.loadSystemImages = function() {
        // ImageManager.reserveSystem('IconSet');
        // ImageManager.reserveSystem('Balloon');
        // ImageManager.reserveSystem('Shadow1');
        // ImageManager.reserveSystem('Shadow2');
        // ImageManager.reserveSystem('Damage');
        // ImageManager.reserveSystem('States');
        // ImageManager.reserveSystem('Weapons1');
        // ImageManager.reserveSystem('Weapons2');
        // ImageManager.reserveSystem('Weapons3');
        // ImageManager.reserveSystem('ButtonSet');
    };

    //Import interpreter special calls
    Game_Interpreter.prototype.sprite = function (name) {
        return $mapScript.sprites[name];
    };

    Game_Interpreter.prototype.zoom = function (zoom, speed = 10) {
        this.setWaitMode("zoom");
        $gameMap.setZoom(zoom, zoom, speed);
    };

    Game_Interpreter.prototype.zoomDefault = function (speed = 10) {
        let zoom = ConfigManager.mapZoom ? 2 : 1;

        this.setWaitMode("zoom");
        $gameMap.setZoom(zoom, zoom, speed);
    };

    //Wait mode for zooming
    let updateWaitMode = Game_Interpreter.prototype.updateWaitMode;
    Game_Interpreter.prototype.updateWaitMode = function () {
        if (this._waitMode === "zoom") {
            if ($gameMap._zoomDuration > 0) {
                return true;
            } else {
                this._waitMode = "";
            }
        } else {
            return updateWaitMode.call(this);
        }
    };

    //Terrain id passage options for player
    let canPass = Game_Player.prototype.canPass;
    Game_Player.prototype.canPass = function (x, y, d) {
        let x2 = $gameMap.roundXWithDirection(x, d);
        let y2 = $gameMap.roundYWithDirection(y, d);

        if (this._through) {
            return true
        }

        if (this.regionId() === 1 && $gameMap.regionId(x2, y2) === 1) {
            return true
        } else if (this.regionId() === 2 && $gameMap.regionId(x2, y2) === 1) {
            return true
        } else if ($gameMap.regionId(x2, y2) === 4) {
            return false
        }
        {
            return canPass.apply(this, arguments)
        }
    };

    //Hotkey map
    Input.keyMapper = {
        9: 'tab', // tab
        13: 'ok', // enter
        16: 'shift', // shift
        17: 'control', // control
        18: 'alt', // alt
        27: 'escape', // escape
        32: 'ok', // space
        33: 'pageup', // pageup
        34: 'pagedown', // pagedown
        65: 'left', // A
        37: 'left', // left arrow
        87: 'up', // W
        38: 'up', // up arrow
        68: 'right', // D
        39: 'right', // right arrow
        83: 'down', // S
        40: 'down', // down arrow
        45: 'escape', // insert
        81: 'pageup', // Q----
        82: 'pagedown', // W
        88: 'escape', // X
        90: 'ok', // Z
        96: 'escape', // numpad 0
        98: 'down', // numpad 2
        100: 'left', // numpad 4
        102: 'right', // numpad 6
        104: 'up', // numpad 8
        120: 'debug', // F9
        192: 'tilde',
        49: 'one',
        50: 'two',
        51: 'three',
        52: 'four',
        53: 'five',
        54: 'six',
        55: 'seven',
        56: 'eight',
        57: 'nine',
        48: 'zero',
        70: 'f'
    };

    //Some RAF loop changes
    SceneManager.fps = 60;
    SceneManager.then = performance.now();
    SceneManager.interval = 1000 / SceneManager.fps;
    SceneManager.tolerance = 1.5;
    SceneManager.frameDroppedCount = 0;

    SceneManager.updateMain = function () {

        this.requestUpdate();

        this.now = performance.now();
        this.delta = this.now - this.then;

        if (this.delta >= this.interval - this.tolerance) {
            this.then = this.now - (this.delta % this.interval);
            this.tickStart();

            this.updateInputData();
            this.changeScene();
            this.updateScene();
            this.renderScene();

            this.tickEnd();
        } else {
            SceneManager.frameDroppedCount++;
            // console.log('frame dropped! (count: ' + SceneManager.frameDroppedCount + ') ' + this.delta + " " + (this.interval - this.tolerance) + " " + new Date());
        }
    };

})();

//=============================================================================
// KODERA_optimization.js
//=============================================================================

//ForEach loops replacement

(function () {

    Sprite.prototype.update = function () {
        for (let i = 0; i < this.children.length; i++) {
            let child = this.children[i];
            if (child && child.update) {
                child.update();
            }
        }
    };
    Tilemap.prototype.update = function () {
        this.animationCount++;
        this.animationFrame = Math.floor(this.animationCount / 30);
        for (let i = 0; i < this.children.length; i++) {
            let child = this.children[i];
            if (child && child.update) {
                child.update();
            }
        }
        for (let i = 0; i < this.bitmaps.length; i++) {
            if (this.bitmaps[i]) {
                this.bitmaps[i].touch();
            }
        }
    };
    TilingSprite.prototype.update = function () {
        for (let i = 0; i < this.children.length; i++) {
            let child = this.children[i];
            if (child && child.update) {
                child.update();
            }
        }
    };
    Window.prototype.update = function () {
        if (this.active) {
            this._animationCount++;
        }
        for (let i = 0; i < this.children.length; i++) {
            let child = this.children[i];
            if (child && child.update) {
                child.update();
            }
        }
    };
    WindowLayer.prototype.update = function () {
        for (let i = 0; i < this.children.length; i++) {
            let child = this.children[i];
            if (child && child.update) {
                child.update();
            }
        }
    };
    Weather.prototype._updateAllSprites = function () {
        let maxSprites = Math.floor(this.power * 10);

        while (this._sprites.length < maxSprites) {
            this._addSprite();
        }

        while (this._sprites.length > maxSprites) {
            this._removeSprite();
        }

        for (let i = 0; i < this._sprites.length; i++) {
            let sprite = this._sprites[i];
            this._updateSprite(sprite);
            sprite.x = sprite.ax - this.origin.x;
            sprite.y = sprite.ay - this.origin.y;
        }
    };
    Scene_Base.prototype.updateChildren = function () {
        for (let i = 0; i < this.children.length; i++) {
            let child = this.children[i];
            if (child.update) {
                child.update();
            }
        }
    };

    Scene_ItemBase.prototype.applyItem = function () {
        let action = new Game_Action(this.user());
        action.setItemObject(this.item());
        let repeats = action.numRepeats();
        let ita = this.itemTargetActors();
        for (let i = 0; i < ita.length; i++) {
            let target = ita[i];
            for (let ix = 0; ix < repeats; ix++) {
                action.apply(target);
            }
        }
        action.applyGlobal();
    };
    Sprite_Animation.prototype.updateFrame = function () {
        if (this._duration > 0) {
            let frameIndex = this.currentFrameIndex();
            this.updateAllCellSprites(this._animation.frames[frameIndex]);
            for (let i = 0; i < this._animation.timings.length; i++) {
                let timing = this._animation.timings[i];
                if (timing.frame === frameIndex) {
                    this.processTimingData(timing);
                }
            }
        }
    };
    Spriteset_Map.prototype.createCharacters = function () {
        this._characterSprites = [];
        let events = $gameMap.events();
        for (let i = 0; i < events.length; i++) {
            let event = events[i];
            this._characterSprites.push(new Sprite_Character(event));
        }
        // let vehicles = $gameMap.vehicles();
        // for (let i = 0; i < vehicles.length; i++) {
        //     let vehicle = vehicles[i];
        //     this._characterSprites.push(new Sprite_Character(vehicle));
        // }
        let followers = $gamePlayer.followers()._data;
        for (let i = followers.length - 1; i >= 0; i--) {
            let follower = followers[i];
            this._characterSprites.push(new Sprite_Character(follower));
        }
        this._characterSprites.push(new Sprite_Character($gamePlayer));
        for (let i = 0; i < this._characterSprites.length; i++) {
            this._tilemap.addChild(this._characterSprites[i]);
        }
    };

})();

//=============================================================================
// MUE_AntiLag.js
//=============================================================================

//Some replacements for better speed

(function () {

// Replaces the original refreshTileEvents to filter the _events array directly
    Game_Map.prototype.refreshTileEvents = function () {
        this.tileEvents = this._events.filter(function (event) {
            return !!event && event.isTile();
        });
    };

// Replaces the original eventsXy to filter the _events array directly
    Game_Map.prototype.eventsXy = function (x, y) {
        return this._events.filter(function (event) {
            return !!event && event.pos(x, y);
        });
    };

// Replaces the original eventsXyNt to filter the _events array directly
    Game_Map.prototype.eventsXyNt = function (x, y) {
        return this._events.filter(function (event) {
            return !!event && event.posNt(x, y);
        });
    };

})();