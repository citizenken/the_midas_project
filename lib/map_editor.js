(function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = typeof require == "function" && require;
                if (!u && a) return a(o, !0);
                if (i) return i(o, !0);
                throw new Error("Cannot find module '" + o + "'");
            }
            var f = n[o] = {
                exports: {}
            };
            t[o][0].call(f.exports, function(e) {
                var n = t[o][1][e];
                return s(n ? n : e);
            }, f, f.exports, e, t, n, r);
        }
        return n[o].exports;
    }
    var i = typeof require == "function" && require;
    for (var o = 0; o < r.length; o++) s(r[o]);
    return s;
})({
    1: [ function(require, module, exports) {
        var Crafty = require("./core.js"), document = window.document, HashMap = require("./HashMap.js");
        Crafty._rectPool = function() {
            var pool = [], pointer = 0;
            return {
                get: function(x, y, w, h) {
                    if (pool.length <= pointer) pool.push({});
                    var r = pool[pointer++];
                    r._x = x;
                    r._y = y;
                    r._w = w;
                    r._h = h;
                    return r;
                },
                copy: function(o) {
                    if (pool.length <= pointer) pool.push({});
                    var r = pool[pointer++];
                    r._x = o._x;
                    r._y = o._y;
                    r._w = o._w;
                    r._h = o._h;
                    return r;
                },
                recycle: function(o) {
                    pointer--;
                }
            };
        }();
        Crafty.map = new HashMap();
        var M = Math, Mc = M.cos, Ms = M.sin, PI = M.PI, DEG_TO_RAD = PI / 180;
        Crafty.extend({
            zeroFill: function(number, width) {
                width -= number.toString().length;
                if (width > 0) return new Array(width + (/\./.test(number) ? 2 : 1)).join("0") + number;
                return number.toString();
            }
        });
        Crafty.c("2D", {
            _x: 0,
            _y: 0,
            _w: 0,
            _h: 0,
            _z: 0,
            _rotation: 0,
            _alpha: 1,
            _visible: true,
            _globalZ: null,
            _origin: null,
            _mbr: null,
            _entry: null,
            _children: null,
            _parent: null,
            _changed: false,
            _defineGetterSetter_setter: function() {
                this.__defineSetter__("x", function(v) {
                    this._attr("_x", v);
                });
                this.__defineSetter__("y", function(v) {
                    this._attr("_y", v);
                });
                this.__defineSetter__("w", function(v) {
                    this._attr("_w", v);
                });
                this.__defineSetter__("h", function(v) {
                    this._attr("_h", v);
                });
                this.__defineSetter__("z", function(v) {
                    this._attr("_z", v);
                });
                this.__defineSetter__("rotation", function(v) {
                    this._attr("_rotation", v);
                });
                this.__defineSetter__("alpha", function(v) {
                    this._attr("_alpha", v);
                });
                this.__defineSetter__("visible", function(v) {
                    this._attr("_visible", v);
                });
                this.__defineGetter__("x", function() {
                    return this._x;
                });
                this.__defineGetter__("y", function() {
                    return this._y;
                });
                this.__defineGetter__("w", function() {
                    return this._w;
                });
                this.__defineGetter__("h", function() {
                    return this._h;
                });
                this.__defineGetter__("z", function() {
                    return this._z;
                });
                this.__defineGetter__("rotation", function() {
                    return this._rotation;
                });
                this.__defineGetter__("alpha", function() {
                    return this._alpha;
                });
                this.__defineGetter__("visible", function() {
                    return this._visible;
                });
                this.__defineGetter__("parent", function() {
                    return this._parent;
                });
                this.__defineGetter__("numChildren", function() {
                    return this._children.length;
                });
            },
            _defineGetterSetter_defineProperty: function() {
                Object.defineProperty(this, "x", {
                    set: function(v) {
                        this._attr("_x", v);
                    },
                    get: function() {
                        return this._x;
                    },
                    configurable: true
                });
                Object.defineProperty(this, "y", {
                    set: function(v) {
                        this._attr("_y", v);
                    },
                    get: function() {
                        return this._y;
                    },
                    configurable: true
                });
                Object.defineProperty(this, "w", {
                    set: function(v) {
                        this._attr("_w", v);
                    },
                    get: function() {
                        return this._w;
                    },
                    configurable: true
                });
                Object.defineProperty(this, "h", {
                    set: function(v) {
                        this._attr("_h", v);
                    },
                    get: function() {
                        return this._h;
                    },
                    configurable: true
                });
                Object.defineProperty(this, "z", {
                    set: function(v) {
                        this._attr("_z", v);
                    },
                    get: function() {
                        return this._z;
                    },
                    configurable: true
                });
                Object.defineProperty(this, "rotation", {
                    set: function(v) {
                        this._attr("_rotation", v);
                    },
                    get: function() {
                        return this._rotation;
                    },
                    configurable: true
                });
                Object.defineProperty(this, "alpha", {
                    set: function(v) {
                        this._attr("_alpha", v);
                    },
                    get: function() {
                        return this._alpha;
                    },
                    configurable: true
                });
                Object.defineProperty(this, "visible", {
                    set: function(v) {
                        this._attr("_visible", v);
                    },
                    get: function() {
                        return this._visible;
                    },
                    configurable: true
                });
            },
            init: function() {
                this._globalZ = this[0];
                this._origin = {
                    x: 0,
                    y: 0
                };
                this._bx1 = 0;
                this._bx2 = 0;
                this._by1 = 0;
                this._by2 = 0;
                this._children = [];
                if (Crafty.support.setter) {
                    this._defineGetterSetter_setter();
                } else if (Crafty.support.defineProperty) {
                    this._defineGetterSetter_defineProperty();
                }
                this._entry = Crafty.map.insert(this);
                this.bind("Move", function(e) {
                    var area = this._cbr || this._mbr || this;
                    this._entry.update(area);
                    if (this._children.length > 0) {
                        this._cascade(e);
                    }
                });
                this.bind("Rotate", function(e) {
                    var old = this._cbr || this._mbr || this;
                    this._entry.update(old);
                    if (this._children.length > 0) {
                        this._cascade(e);
                    }
                });
                this.bind("Remove", function() {
                    if (this._children) {
                        for (var i = 0; i < this._children.length; i++) {
                            delete this._children[i]._parent;
                            if (this._children[i].destroy) {
                                this._children[i].destroy();
                            }
                        }
                        this._children = [];
                    }
                    if (this._parent) {
                        this._parent.detach(this);
                    }
                    Crafty.map.remove(this);
                    this.detach();
                });
            },
            offsetBoundary: function(x1, y1, x2, y2) {
                if (arguments.length === 1) y1 = x2 = y2 = x1;
                this._bx1 = x1;
                this._bx2 = x2;
                this._by1 = y1;
                this._by2 = y2;
                this.trigger("BoundaryOffset");
                this._calculateMBR();
                return this;
            },
            _calculateMBR: function() {
                var ox = this._origin.x + this._x, oy = this._origin.y + this._y, rad = -this._rotation * DEG_TO_RAD;
                var dx1 = this._x - this._bx1 - ox, dx2 = this._x + this._w + this._bx2 - ox, dy1 = this._y - this._by1 - oy, dy2 = this._y + this._h + this._by2 - oy;
                var ct = Math.cos(rad), st = Math.sin(rad);
                ct = ct < 1e-10 && ct > -1e-10 ? 0 : ct;
                st = st < 1e-10 && st > -1e-10 ? 0 : st;
                var x0 = dx1 * ct + dy1 * st, y0 = -dx1 * st + dy1 * ct, x1 = dx2 * ct + dy1 * st, y1 = -dx2 * st + dy1 * ct, x2 = dx2 * ct + dy2 * st, y2 = -dx2 * st + dy2 * ct, x3 = dx1 * ct + dy2 * st, y3 = -dx1 * st + dy2 * ct, minx = Math.floor(Math.min(x0, x1, x2, x3) + ox), miny = Math.floor(Math.min(y0, y1, y2, y3) + oy), maxx = Math.ceil(Math.max(x0, x1, x2, x3) + ox), maxy = Math.ceil(Math.max(y0, y1, y2, y3) + oy);
                if (!this._mbr) {
                    this._mbr = {
                        _x: minx,
                        _y: miny,
                        _w: maxx - minx,
                        _h: maxy - miny
                    };
                } else {
                    this._mbr._x = minx;
                    this._mbr._y = miny;
                    this._mbr._w = maxx - minx;
                    this._mbr._h = maxy - miny;
                }
                if (this._cbr) {
                    var cbr = this._cbr;
                    var cx = cbr.cx, cy = cbr.cy, r = cbr.r;
                    var cx2 = ox + (cx + this._x - ox) * ct + (cy + this._y - oy) * st;
                    var cy2 = oy - (cx + this._x - ox) * st + (cy + this._y - oy) * ct;
                    cbr._x = Math.min(cx2 - r, minx);
                    cbr._y = Math.min(cy2 - r, miny);
                    cbr._w = Math.max(cx2 + r, maxx) - cbr._x;
                    cbr._h = Math.max(cy2 + r, maxy) - cbr._y;
                }
            },
            _rotate: function(v) {
                var theta = -1 * (v % 360);
                var difference = this._rotation - v;
                if (difference === 0) return; else this._rotation = v;
                var rad = theta * DEG_TO_RAD, o = {
                    x: this._origin.x + this._x,
                    y: this._origin.y + this._y
                };
                this._calculateMBR();
                var drad = difference * DEG_TO_RAD, ct = Math.cos(rad), st = Math.sin(rad);
                this.trigger("Rotate", {
                    cos: Math.cos(drad),
                    sin: Math.sin(drad),
                    deg: difference,
                    rad: drad,
                    o: o
                });
            },
            area: function() {
                return this._w * this._h;
            },
            intersect: function(x, y, w, h) {
                var rect, mbr = this._mbr || this;
                if (typeof x === "object") {
                    rect = x;
                } else {
                    rect = {
                        x: x,
                        y: y,
                        w: w,
                        h: h
                    };
                }
                return mbr._x < rect.x + rect.w && mbr._x + mbr._w > rect.x && mbr._y < rect.y + rect.h && mbr._h + mbr._y > rect.y;
            },
            within: function(x, y, w, h) {
                var rect, mbr = this._mbr || this;
                if (typeof x === "object") {
                    rect = x;
                } else {
                    rect = {
                        _x: x,
                        _y: y,
                        _w: w,
                        _h: h
                    };
                }
                return rect._x <= mbr._x && rect._x + rect._w >= mbr._x + mbr._w && rect._y <= mbr._y && rect._y + rect._h >= mbr._y + mbr._h;
            },
            contains: function(x, y, w, h) {
                var rect, mbr = this._mbr || this;
                if (typeof x === "object") {
                    rect = x;
                } else {
                    rect = {
                        _x: x,
                        _y: y,
                        _w: w,
                        _h: h
                    };
                }
                return rect._x >= mbr._x && rect._x + rect._w <= mbr._x + mbr._w && rect._y >= mbr._y && rect._y + rect._h <= mbr._y + mbr._h;
            },
            pos: function() {
                return {
                    _x: this._x,
                    _y: this._y,
                    _w: this._w,
                    _h: this._h
                };
            },
            mbr: function() {
                if (!this._mbr) return this.pos();
                return {
                    _x: this._mbr._x,
                    _y: this._mbr._y,
                    _w: this._mbr._w,
                    _h: this._mbr._h
                };
            },
            isAt: function(x, y) {
                if (this.mapArea) {
                    return this.mapArea.containsPoint(x, y);
                } else if (this.map) {
                    return this.map.containsPoint(x, y);
                }
                var mbr = this._mbr || this;
                return mbr._x <= x && mbr._x + mbr._w >= x && mbr._y <= y && mbr._y + mbr._h >= y;
            },
            move: function(dir, by) {
                if (dir.charAt(0) === "n") this.y -= by;
                if (dir.charAt(0) === "s") this.y += by;
                if (dir === "e" || dir.charAt(1) === "e") this.x += by;
                if (dir === "w" || dir.charAt(1) === "w") this.x -= by;
                return this;
            },
            shift: function(x, y, w, h) {
                if (x) this.x += x;
                if (y) this.y += y;
                if (w) this.w += w;
                if (h) this.h += h;
                return this;
            },
            _cascade: function(e) {
                if (!e) return;
                var i = 0, children = this._children, l = children.length, obj;
                if (e.cos) {
                    for (;i < l; ++i) {
                        obj = children[i];
                        if ("rotate" in obj) obj.rotate(e);
                    }
                } else {
                    var dx = this._x - e._x, dy = this._y - e._y, dw = this._w - e._w, dh = this._h - e._h;
                    for (;i < l; ++i) {
                        obj = children[i];
                        obj.shift(dx, dy, dw, dh);
                    }
                }
            },
            attach: function() {
                var i = 0, arg = arguments, l = arguments.length, obj;
                for (;i < l; ++i) {
                    obj = arg[i];
                    if (obj._parent) {
                        obj._parent.detach(obj);
                    }
                    obj._parent = this;
                    this._children.push(obj);
                }
                return this;
            },
            detach: function(obj) {
                var i;
                if (!obj) {
                    for (i = 0; i < this._children.length; i++) {
                        this._children[i]._parent = null;
                    }
                    this._children = [];
                    return this;
                }
                for (i = 0; i < this._children.length; i++) {
                    if (this._children[i] == obj) {
                        this._children.splice(i, 1);
                    }
                }
                obj._parent = null;
                return this;
            },
            origin: function(x, y) {
                if (typeof x === "string") {
                    if (x === "centre" || x === "center" || x.indexOf(" ") === -1) {
                        x = this._w / 2;
                        y = this._h / 2;
                    } else {
                        var cmd = x.split(" ");
                        if (cmd[0] === "top") y = 0; else if (cmd[0] === "bottom") y = this._h; else if (cmd[0] === "middle" || cmd[1] === "center" || cmd[1] === "centre") y = this._h / 2;
                        if (cmd[1] === "center" || cmd[1] === "centre" || cmd[1] === "middle") x = this._w / 2; else if (cmd[1] === "left") x = 0; else if (cmd[1] === "right") x = this._w;
                    }
                }
                this._origin.x = x;
                this._origin.y = y;
                return this;
            },
            flip: function(dir) {
                dir = dir || "X";
                if (!this["_flip" + dir]) {
                    this["_flip" + dir] = true;
                    this.trigger("Invalidate");
                }
                return this;
            },
            unflip: function(dir) {
                dir = dir || "X";
                if (this["_flip" + dir]) {
                    this["_flip" + dir] = false;
                    this.trigger("Invalidate");
                }
                return this;
            },
            rotate: function(e) {
                var x2, y2;
                x2 = (this._x + this._origin.x - e.o.x) * e.cos + (this._y + this._origin.y - e.o.y) * e.sin + (e.o.x - this._origin.x);
                y2 = (this._y + this._origin.y - e.o.y) * e.cos - (this._x + this._origin.x - e.o.x) * e.sin + (e.o.y - this._origin.y);
                this._attr("_rotation", this._rotation - e.deg);
                this._attr("_x", x2);
                this._attr("_y", y2);
            },
            _attr: function(name, value) {
                if (this[name] === value) {
                    return;
                }
                var old = Crafty._rectPool.copy(this);
                var mbr;
                if (name === "_rotation") {
                    this._rotate(value);
                } else if (name === "_z") {
                    this._globalZ = parseInt(value + Crafty.zeroFill(this[0], 5), 10);
                    this.trigger("reorder");
                } else if (name === "_x" || name === "_y") {
                    mbr = this._mbr;
                    if (mbr) {
                        mbr[name] -= this[name] - value;
                        if (this._cbr) {
                            this._cbr[name] -= this[name] - value;
                        }
                    }
                    this[name] = value;
                    this.trigger("Move", old);
                } else if (name === "_h" || name === "_w") {
                    mbr = this._mbr;
                    var oldValue = this[name];
                    this[name] = value;
                    if (mbr) {
                        this._calculateMBR();
                    }
                    if (name === "_w") {
                        this.trigger("Resize", {
                            axis: "w",
                            amount: value - oldValue
                        });
                    } else if (name === "_h") {
                        this.trigger("Resize", {
                            axis: "h",
                            amount: value - oldValue
                        });
                    }
                    this.trigger("Move", old);
                }
                this[name] = value;
                this.trigger("Invalidate");
                Crafty._rectPool.recycle(old);
            }
        });
        Crafty.c("Gravity", {
            _gravityConst: .2,
            _gy: 0,
            _falling: true,
            _anti: null,
            init: function() {
                this.requires("2D");
            },
            gravity: function(comp) {
                if (comp) this._anti = comp;
                if (isNaN(this._jumpSpeed)) this._jumpSpeed = 0;
                this.bind("EnterFrame", this._enterFrame);
                return this;
            },
            gravityConst: function(g) {
                this._gravityConst = g;
                return this;
            },
            _enterFrame: function() {
                if (this._falling) {
                    this._gy += this._gravityConst;
                    this.y += this._gy;
                    this.trigger("Moved", {
                        x: this._x,
                        y: this._y - this._gy
                    });
                } else {
                    this._gy = 0;
                }
                var obj, hit = false, pos = this.pos(), q, i = 0, l;
                pos._y++;
                pos.x = pos._x;
                pos.y = pos._y;
                pos.w = pos._w;
                pos.h = pos._h;
                q = Crafty.map.search(pos);
                l = q.length;
                for (;i < l; ++i) {
                    obj = q[i];
                    if (obj !== this && obj.has(this._anti) && obj.intersect(pos)) {
                        hit = obj;
                        break;
                    }
                }
                if (hit) {
                    if (this._falling && (this._gy > this._jumpSpeed || !this._up)) {
                        this.stopFalling(hit);
                    }
                } else {
                    this._falling = true;
                }
            },
            stopFalling: function(e) {
                if (e) this.y = e._y - this._h;
                this._falling = false;
                if (this._up) this._up = false;
                this.trigger("hit");
            },
            antigravity: function() {
                this.unbind("EnterFrame", this._enterFrame);
            }
        });
        Crafty.polygon = function(poly) {
            if (arguments.length > 1) {
                poly = Array.prototype.slice.call(arguments, 0);
            }
            this.points = poly;
        };
        Crafty.polygon.prototype = {
            containsPoint: function(x, y) {
                var p = this.points, i, j, c = false;
                for (i = 0, j = p.length - 1; i < p.length; j = i++) {
                    if (p[i][1] > y != p[j][1] > y && x < (p[j][0] - p[i][0]) * (y - p[i][1]) / (p[j][1] - p[i][1]) + p[i][0]) {
                        c = !c;
                    }
                }
                return c;
            },
            shift: function(x, y) {
                var i = 0, l = this.points.length, current;
                for (;i < l; i++) {
                    current = this.points[i];
                    current[0] += x;
                    current[1] += y;
                }
            },
            rotate: function(e) {
                var i = 0, l = this.points.length, current, x, y;
                for (;i < l; i++) {
                    current = this.points[i];
                    x = e.o.x + (current[0] - e.o.x) * e.cos + (current[1] - e.o.y) * e.sin;
                    y = e.o.y - (current[0] - e.o.x) * e.sin + (current[1] - e.o.y) * e.cos;
                    current[0] = x;
                    current[1] = y;
                }
            }
        };
        Crafty.circle = function(x, y, radius) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.points = [];
            var theta;
            for (var i = 0; i < 8; i++) {
                theta = i * Math.PI / 4;
                this.points[i] = [ this.x + Math.sin(theta) * radius, this.y + Math.cos(theta) * radius ];
            }
        };
        Crafty.circle.prototype = {
            containsPoint: function(x, y) {
                var radius = this.radius, sqrt = Math.sqrt, deltaX = this.x - x, deltaY = this.y - y;
                return deltaX * deltaX + deltaY * deltaY < radius * radius;
            },
            shift: function(x, y) {
                this.x += x;
                this.y += y;
                var i = 0, l = this.points.length, current;
                for (;i < l; i++) {
                    current = this.points[i];
                    current[0] += x;
                    current[1] += y;
                }
            },
            rotate: function() {}
        };
        Crafty.matrix = function(m) {
            this.mtx = m;
            this.width = m[0].length;
            this.height = m.length;
        };
        Crafty.matrix.prototype = {
            x: function(other) {
                if (this.width != other.height) {
                    return;
                }
                var result = [];
                for (var i = 0; i < this.height; i++) {
                    result[i] = [];
                    for (var j = 0; j < other.width; j++) {
                        var sum = 0;
                        for (var k = 0; k < this.width; k++) {
                            sum += this.mtx[i][k] * other.mtx[k][j];
                        }
                        result[i][j] = sum;
                    }
                }
                return new Crafty.matrix(result);
            },
            e: function(row, col) {
                if (row < 1 || row > this.mtx.length || col < 1 || col > this.mtx[0].length) return null;
                return this.mtx[row - 1][col - 1];
            }
        };
    }, {
        "./HashMap.js": 4,
        "./core.js": 9
    } ],
    2: [ function(require, module, exports) {
        var Crafty = require("./core.js"), document = window.document;
        Crafty.c("DOM", {
            _element: null,
            _cssStyles: null,
            avoidCss3dTransforms: false,
            init: function() {
                this._cssStyles = {
                    visibility: "",
                    left: "",
                    top: "",
                    width: "",
                    height: "",
                    zIndex: "",
                    opacity: "",
                    transformOrigin: "",
                    transform: ""
                };
                this._element = document.createElement("div");
                Crafty.stage.inner.appendChild(this._element);
                this._element.style.position = "absolute";
                this._element.id = "ent" + this[0];
                this.bind("Invalidate", function() {
                    if (!this._changed) {
                        this._changed = true;
                        Crafty.DrawManager.addDom(this);
                    }
                });
                function updateClass() {
                    var i = 0, c = this.__c, str = "";
                    for (i in c) {
                        str += " " + i;
                    }
                    str = str.substr(1);
                    this._element.className = str;
                }
                function removeClass(removedComponent) {
                    var i = 0, c = this.__c, str = "";
                    for (i in c) {
                        if (i != removedComponent) {
                            str += " " + i;
                        }
                    }
                    str = str.substr(1);
                    this._element.className = str;
                }
                this.bind("NewComponent", updateClass).bind("RemoveComponent", removeClass);
                this.bind("Remove", this.undraw);
                this.bind("RemoveComponent", function(compName) {
                    if (compName === "DOM") this.undraw();
                });
            },
            getDomId: function() {
                return this._element.id;
            },
            DOM: function(elem) {
                if (elem && elem.nodeType) {
                    this.undraw();
                    this._element = elem;
                    this._element.style.position = "absolute";
                }
                return this;
            },
            draw: function() {
                var style = this._element.style, coord = this.__coord || [ 0, 0, 0, 0 ], co = {
                    x: coord[0],
                    y: coord[1],
                    w: coord[2],
                    h: coord[3]
                }, prefix = Crafty.support.prefix, trans = [];
                if (this._cssStyles.visibility !== this._visible) {
                    this._cssStyles.visibility = this._visible;
                    if (!this._visible) {
                        style.visibility = "hidden";
                    } else {
                        style.visibility = "visible";
                    }
                }
                if (Crafty.support.css3dtransform && !this.avoidCss3dTransforms) {
                    trans.push("translate3d(" + ~~this._x + "px," + ~~this._y + "px,0)");
                } else {
                    if (this._cssStyles.left !== this._x) {
                        this._cssStyles.left = this._x;
                        style.left = ~~this._x + "px";
                    }
                    if (this._cssStyles.top !== this._y) {
                        this._cssStyles.top = this._y;
                        style.top = ~~this._y + "px";
                    }
                }
                if (this._cssStyles.width !== this._w) {
                    this._cssStyles.width = this._w;
                    style.width = ~~this._w + "px";
                }
                if (this._cssStyles.height !== this._h) {
                    this._cssStyles.height = this._h;
                    style.height = ~~this._h + "px";
                }
                if (this._cssStyles.zIndex !== this._z) {
                    this._cssStyles.zIndex = this._z;
                    style.zIndex = this._z;
                }
                if (this._cssStyles.opacity !== this._alpha) {
                    this._cssStyles.opacity = this._alpha;
                    style.opacity = this._alpha;
                    style[prefix + "Opacity"] = this._alpha;
                }
                if (this._mbr) {
                    var origin = this._origin.x + "px " + this._origin.y + "px";
                    style.transformOrigin = origin;
                    style[prefix + "TransformOrigin"] = origin;
                    if (Crafty.support.css3dtransform) trans.push("rotateZ(" + this._rotation + "deg)"); else trans.push("rotate(" + this._rotation + "deg)");
                }
                if (this._flipX) {
                    trans.push("scaleX(-1)");
                }
                if (this._flipY) {
                    trans.push("scaleY(-1)");
                }
                if (this._cssStyles.transform != trans.join(" ")) {
                    this._cssStyles.transform = trans.join(" ");
                    style.transform = this._cssStyles.transform;
                    style[prefix + "Transform"] = this._cssStyles.transform;
                }
                this.trigger("Draw", {
                    style: style,
                    type: "DOM",
                    co: co
                });
                return this;
            },
            undraw: function() {
                if (this._element) {
                    Crafty.stage.inner.removeChild(this._element);
                }
                return this;
            },
            css: function(obj, value) {
                var key, elem = this._element, val, style = elem.style;
                if (typeof obj === "object") {
                    for (key in obj) {
                        if (!obj.hasOwnProperty(key)) continue;
                        val = obj[key];
                        if (typeof val === "number") val += "px";
                        style[Crafty.DOM.camelize(key)] = val;
                    }
                } else {
                    if (value) {
                        if (typeof value === "number") value += "px";
                        style[Crafty.DOM.camelize(obj)] = value;
                    } else {
                        return Crafty.DOM.getStyle(elem, obj);
                    }
                }
                this.trigger("Invalidate");
                return this;
            }
        });
        Crafty.extend({
            DOM: {
                window: {
                    init: function() {
                        this.width = window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth);
                        this.height = window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight);
                        Crafty.uniqueBind("RenderScene", Crafty.DrawManager.renderDOM);
                        Crafty.uniqueBind("ViewportResize", this._resize);
                    },
                    _resize: function() {
                        Crafty.stage.elem.style.width = Crafty.viewport.width + "px";
                        Crafty.stage.elem.style.height = Crafty.viewport.height + "px";
                    },
                    width: 0,
                    height: 0
                },
                inner: function(obj) {
                    var rect = obj.getBoundingClientRect(), x = rect.left + (window.pageXOffset ? window.pageXOffset : document.body.scrollLeft), y = rect.top + (window.pageYOffset ? window.pageYOffset : document.body.scrollTop), borderX = parseInt(this.getStyle(obj, "border-left-width") || 0, 10) || parseInt(this.getStyle(obj, "borderLeftWidth") || 0, 10) || 0, borderY = parseInt(this.getStyle(obj, "border-top-width") || 0, 10) || parseInt(this.getStyle(obj, "borderTopWidth") || 0, 10) || 0;
                    x += borderX;
                    y += borderY;
                    return {
                        x: x,
                        y: y
                    };
                },
                getStyle: function(obj, prop) {
                    var result;
                    if (obj.currentStyle) result = obj.currentStyle[this.camelize(prop)]; else if (window.getComputedStyle) result = document.defaultView.getComputedStyle(obj, null).getPropertyValue(this.csselize(prop));
                    return result;
                },
                camelize: function(str) {
                    return str.replace(/-+(.)?/g, function(match, chr) {
                        return chr ? chr.toUpperCase() : "";
                    });
                },
                csselize: function(str) {
                    return str.replace(/[A-Z]/g, function(chr) {
                        return chr ? "-" + chr.toLowerCase() : "";
                    });
                },
                translate: function(clientX, clientY) {
                    var doc = document.documentElement;
                    var body = document.body;
                    return {
                        x: (clientX - Crafty.stage.x + (doc && doc.scrollLeft || body && body.scrollLeft || 0)) / Crafty.viewport._scale - Crafty.viewport._x,
                        y: (clientY - Crafty.stage.y + (doc && doc.scrollTop || body && body.scrollTop || 0)) / Crafty.viewport._scale - Crafty.viewport._y
                    };
                }
            }
        });
    }, {
        "./core.js": 9
    } ],
    3: [ function(require, module, exports) {
        var Crafty = require("./core.js"), document = window.document;
        Crafty.c("DebugCanvas", {
            init: function() {
                this.requires("2D");
                if (!Crafty.DebugCanvas.context) Crafty.DebugCanvas.init();
                Crafty.DebugCanvas.add(this);
                this._debug = {
                    alpha: 1,
                    lineWidth: 1
                };
                this.bind("RemoveComponent", this.onDebugRemove);
                this.bind("Remove", this.onDebugDestroy);
            },
            onDebugRemove: function(id) {
                if (id === "DebugCanvas") {
                    Crafty.DebugCanvas.remove(this);
                }
            },
            onDebugDestroy: function(id) {
                Crafty.DebugCanvas.remove(this);
            },
            debugAlpha: function(alpha) {
                this._debug.alpha = alpha;
                return this;
            },
            debugFill: function(fillStyle) {
                if (typeof fillStyle === "undefined") fillStyle = "red";
                this._debug.fillStyle = fillStyle;
                return this;
            },
            debugStroke: function(strokeStyle) {
                if (typeof strokeStyle === "undefined") strokeStyle = "red";
                this._debug.strokeStyle = strokeStyle;
                return this;
            },
            debugDraw: function(ctx) {
                var ga = ctx.globalAlpha;
                var props = this._debug;
                if (props.alpha) ctx.globalAlpha = this._debug.alpha;
                if (props.strokeStyle) ctx.strokeStyle = props.strokeStyle;
                if (props.lineWidth) ctx.lineWidth = props.lineWidth;
                if (props.fillStyle) ctx.fillStyle = props.fillStyle;
                this.trigger("DebugDraw");
                ctx.globalAlpha = ga;
            }
        });
        Crafty.c("DebugRectangle", {
            init: function() {
                this.requires("2D, DebugCanvas");
            },
            debugRectangle: function(rect) {
                this.debugRect = rect;
                this.unbind("DebugDraw", this.drawDebugRect);
                this.bind("DebugDraw", this.drawDebugRect);
                return this;
            },
            drawDebugRect: function() {
                ctx = Crafty.DebugCanvas.context;
                var rect = this.debugRect;
                if (rect === null || rect === undefined) return;
                if (rect._h && rect._w) {
                    if (this._debug.fillStyle) ctx.fillRect(rect._x, rect._y, rect._w, rect._h);
                    if (this._debug.strokeStyle) ctx.strokeRect(rect._x, rect._y, rect._w, rect._h);
                }
            }
        });
        Crafty.c("VisibleMBR", {
            init: function() {
                this.requires("DebugRectangle").debugFill("purple").bind("EnterFrame", this._assignRect);
            },
            _assignRect: function() {
                if (this._mbr) this.debugRectangle(this._mbr); else this.debugRectangle(this);
            }
        });
        Crafty.c("DebugPolygon", {
            init: function() {
                this.requires("2D, DebugCanvas");
            },
            debugPolygon: function(poly) {
                this.polygon = poly;
                this.unbind("DebugDraw", this.drawDebugPolygon);
                this.bind("DebugDraw", this.drawDebugPolygon);
                return this;
            },
            drawDebugPolygon: function() {
                if (typeof this.polygon === "undefined") return;
                ctx = Crafty.DebugCanvas.context;
                ctx.beginPath();
                for (var p in this.polygon.points) {
                    ctx.lineTo(this.polygon.points[p][0], this.polygon.points[p][1]);
                }
                ctx.closePath();
                if (this._debug.fillStyle) ctx.fill();
                if (this._debug.strokeStyle) ctx.stroke();
            }
        });
        Crafty.c("WiredHitBox", {
            init: function() {
                this.requires("DebugPolygon").debugStroke("red").matchHitBox();
                this.bind("NewHitbox", this.matchHitBox);
            },
            matchHitBox: function() {
                this.debugPolygon(this.map);
            }
        });
        Crafty.c("SolidHitBox", {
            init: function() {
                this.requires("Collision, DebugPolygon").debugFill("orange").debugAlpha(.7).matchHitBox();
                this.bind("NewHitbox", this.matchHitBox);
            },
            matchHitBox: function() {
                this.debugPolygon(this.map);
            }
        });
        Crafty.DebugCanvas = {
            context: null,
            entities: [],
            onetimeEntities: [],
            add: function(ent) {
                this.entities.push(ent);
            },
            remove: function(ent) {
                var list = this.entities;
                for (var i = list.length - 1; i >= 0; i--) if (list[i] == ent) list.splice(i, 1);
            },
            init: function() {
                if (!Crafty.DebugCanvas.context) {
                    if (!Crafty.support.canvas) {
                        Crafty.trigger("NoCanvas");
                        Crafty.stop();
                        return;
                    }
                    var c;
                    c = document.createElement("canvas");
                    c.width = Crafty.viewport.width;
                    c.height = Crafty.viewport.height;
                    c.style.position = "absolute";
                    c.style.left = "0px";
                    c.style.top = "0px";
                    c.id = "debug-canvas";
                    c.style.zIndex = 1e5;
                    Crafty.stage.elem.appendChild(c);
                    Crafty.DebugCanvas.context = c.getContext("2d");
                    Crafty.DebugCanvas._canvas = c;
                }
                Crafty.unbind("RenderScene", Crafty.DebugCanvas.renderScene);
                Crafty.bind("RenderScene", Crafty.DebugCanvas.renderScene);
            },
            renderScene: function(rect) {
                rect = rect || Crafty.viewport.rect();
                var q = Crafty.DebugCanvas.entities, i = 0, l = q.length, ctx = Crafty.DebugCanvas.context, current;
                var view = Crafty.viewport;
                ctx.setTransform(view._scale, 0, 0, view._scale, view._x, view._y);
                ctx.clearRect(rect._x, rect._y, rect._w, rect._h);
                for (;i < l; i++) {
                    current = q[i];
                    current.debugDraw(ctx);
                }
            }
        };
    }, {
        "./core.js": 9
    } ],
    4: [ function(require, module, exports) {
        var Crafty = require("./core.js"), document = window.document;
        var cellsize, HashMap = function(cell) {
            cellsize = cell || 64;
            this.map = {};
        }, SPACE = " ", keyHolder = {};
        HashMap.prototype = {
            insert: function(obj) {
                var keys = HashMap.key(obj), entry = new Entry(keys, obj, this), i = 0, j, hash;
                for (i = keys.x1; i <= keys.x2; i++) {
                    for (j = keys.y1; j <= keys.y2; j++) {
                        hash = i << 16 ^ j;
                        if (!this.map[hash]) this.map[hash] = [];
                        this.map[hash].push(obj);
                    }
                }
                return entry;
            },
            search: function(rect, filter) {
                var keys = HashMap.key(rect, keyHolder), i, j, k, results = [];
                if (filter === undefined) filter = true;
                for (i = keys.x1; i <= keys.x2; i++) {
                    for (j = keys.y1; j <= keys.y2; j++) {
                        cell = this.map[i << 16 ^ j];
                        if (cell) {
                            for (k = 0; k < cell.length; k++) results.push(cell[k]);
                        }
                    }
                }
                if (filter) {
                    var obj, id, finalresult = [], found = {};
                    for (i = 0, l = results.length; i < l; i++) {
                        obj = results[i];
                        if (!obj) continue;
                        id = obj[0];
                        obj = obj._mbr || obj;
                        if (!found[id] && obj._x < rect._x + rect._w && obj._x + obj._w > rect._x && obj._y < rect._y + rect._h && obj._h + obj._y > rect._y) found[id] = results[i];
                    }
                    for (obj in found) finalresult.push(found[obj]);
                    return finalresult;
                } else {
                    return results;
                }
            },
            remove: function(keys, obj) {
                var i = 0, j, hash;
                if (arguments.length == 1) {
                    obj = keys;
                    keys = HashMap.key(obj, keyHolder);
                }
                for (i = keys.x1; i <= keys.x2; i++) {
                    for (j = keys.y1; j <= keys.y2; j++) {
                        hash = i << 16 ^ j;
                        if (this.map[hash]) {
                            var cell = this.map[hash], m, n = cell.length;
                            for (m = 0; m < n; m++) if (cell[m] && cell[m][0] === obj[0]) cell.splice(m, 1);
                        }
                    }
                }
            },
            refresh: function(entry) {
                var keys = entry.keys;
                var obj = entry.obj;
                var cell, i, j, m, n;
                for (i = keys.x1; i <= keys.x2; i++) {
                    for (j = keys.y1; j <= keys.y2; j++) {
                        cell = this.map[i << 16 ^ j];
                        if (cell) {
                            n = cell.length;
                            for (m = 0; m < n; m++) if (cell[m] && cell[m][0] === obj[0]) cell.splice(m, 1);
                        }
                    }
                }
                HashMap.key(obj, keys);
                for (i = keys.x1; i <= keys.x2; i++) {
                    for (j = keys.y1; j <= keys.y2; j++) {
                        cell = this.map[i << 16 ^ j];
                        if (!cell) cell = this.map[i << 16 ^ j] = [];
                        cell.push(obj);
                    }
                }
                return entry;
            },
            boundaries: function() {
                var k, ent, hash = {
                    max: {
                        x: -Infinity,
                        y: -Infinity
                    },
                    min: {
                        x: Infinity,
                        y: Infinity
                    }
                }, coords = {
                    max: {
                        x: -Infinity,
                        y: -Infinity
                    },
                    min: {
                        x: Infinity,
                        y: Infinity
                    }
                };
                for (var h in this.map) {
                    if (!this.map[h].length) continue;
                    var i = h >> 16, j = h << 16 >> 16;
                    if (j < 0) {
                        i = i ^ -1;
                    }
                    if (i >= hash.max.x) {
                        hash.max.x = i;
                        for (k in this.map[h]) {
                            ent = this.map[h][k];
                            if (typeof ent == "object" && "requires" in ent) {
                                coords.max.x = Math.max(coords.max.x, ent.x + ent.w);
                            }
                        }
                    }
                    if (i <= hash.min.x) {
                        hash.min.x = i;
                        for (k in this.map[h]) {
                            ent = this.map[h][k];
                            if (typeof ent == "object" && "requires" in ent) {
                                coords.min.x = Math.min(coords.min.x, ent.x);
                            }
                        }
                    }
                    if (j >= hash.max.y) {
                        hash.max.y = j;
                        for (k in this.map[h]) {
                            ent = this.map[h][k];
                            if (typeof ent == "object" && "requires" in ent) {
                                coords.max.y = Math.max(coords.max.y, ent.y + ent.h);
                            }
                        }
                    }
                    if (j <= hash.min.y) {
                        hash.min.y = j;
                        for (k in this.map[h]) {
                            ent = this.map[h][k];
                            if (typeof ent == "object" && "requires" in ent) {
                                coords.min.y = Math.min(coords.min.y, ent.y);
                            }
                        }
                    }
                }
                return coords;
            }
        };
        HashMap.key = function(obj, keys) {
            if (obj._mbr) {
                obj = obj._mbr;
            }
            if (!keys) {
                keys = {};
            }
            keys.x1 = Math.floor(obj._x / cellsize);
            keys.y1 = Math.floor(obj._y / cellsize);
            keys.x2 = Math.floor((obj._w + obj._x) / cellsize);
            keys.y2 = Math.floor((obj._h + obj._y) / cellsize);
            return keys;
        };
        HashMap.hash = function(keys) {
            return keys.x1 + SPACE + keys.y1 + SPACE + keys.x2 + SPACE + keys.y2;
        };
        function Entry(keys, obj, map) {
            this.keys = keys;
            this.map = map;
            this.obj = obj;
        }
        Entry.prototype = {
            update: function(rect) {
                if (HashMap.hash(HashMap.key(rect, keyHolder)) != HashMap.hash(this.keys)) {
                    this.map.refresh(this);
                }
            }
        };
        module.exports = HashMap;
    }, {
        "./core.js": 9
    } ],
    5: [ function(require, module, exports) {
        var Crafty = require("./core.js"), document = window.document;
        Crafty.easing = function(duration) {
            this.timePerFrame = 1e3 / Crafty.timer.FPS();
            this.duration = duration;
            this.reset();
        };
        Crafty.easing.prototype = {
            duration: 0,
            clock: 0,
            steps: null,
            complete: false,
            paused: false,
            reset: function() {
                this.loops = 1;
                this.clock = 0;
                this.complete = false;
                this.paused = false;
            },
            repeat: function(loopCount) {
                this.loops = loopCount;
            },
            setProgress: function(progress, loopCount) {
                this.clock = this.duration * progress;
                if (typeof loopCount !== "undefined") this.loops = loopCount;
            },
            pause: function() {
                this.paused = true;
            },
            resume: function() {
                this.paused = false;
                this.complete = false;
            },
            tick: function(dt) {
                if (this.paused || this.complete) return;
                this.clock += dt;
                this.frames = Math.floor(this.clock / this.timePerFrame);
                while (this.clock >= this.duration && this.complete === false) {
                    this.loops--;
                    if (this.loops > 0) this.clock -= this.duration; else this.complete = true;
                }
            },
            time: function() {
                return Math.min(this.clock / this.duration, 1);
            },
            value: function() {
                return this.time();
            }
        };
        Crafty.c("Tween", {
            init: function() {
                this.tweenGroup = {};
                this.tweenStart = {};
                this.tweens = [];
                this.bind("EnterFrame", this._tweenTick);
            },
            _tweenTick: function(frameData) {
                var tween, v, i;
                for (i = this.tweens.length - 1; i >= 0; i--) {
                    tween = this.tweens[i];
                    tween.easing.tick(frameData.dt);
                    v = tween.easing.value();
                    this._doTween(tween.props, v);
                    if (tween.easing.complete) {
                        this.tweens.splice(i, 1);
                        this._endTween(tween.props);
                    }
                }
            },
            _doTween: function(props, v) {
                for (var name in props) this[name] = (1 - v) * this.tweenStart[name] + v * props[name];
            },
            tween: function(props, duration) {
                var tween = {
                    props: props,
                    easing: new Crafty.easing(duration)
                };
                for (var propname in props) {
                    if (typeof this.tweenGroup[propname] !== "undefined") this.cancelTween(propname);
                    this.tweenStart[propname] = this[propname];
                    this.tweenGroup[propname] = props;
                }
                this.tweens.push(tween);
                return this;
            },
            cancelTween: function(target) {
                if (typeof target === "string") {
                    if (typeof this.tweenGroup[target] == "object") delete this.tweenGroup[target][target];
                } else if (typeof target === "object") {
                    for (var propname in target) this.cancelTween(propname);
                }
                return this;
            },
            _endTween: function(properties) {
                for (var propname in properties) {
                    delete this.tweenGroup[propname];
                }
                this.trigger("TweenEnd", properties);
            }
        });
    }, {
        "./core.js": 9
    } ],
    6: [ function(require, module, exports) {
        var Crafty = require("./core.js"), document = window.document;
        Crafty.c("Canvas", {
            init: function() {
                if (!Crafty.canvas.context) {
                    Crafty.canvas.init();
                }
                Crafty.DrawManager.total2D++;
                this.currentRect = {};
                this._changed = true;
                Crafty.DrawManager.addCanvas(this);
                this.bind("Invalidate", function(e) {
                    if (this._changed === false) {
                        this._changed = true;
                        Crafty.DrawManager.addCanvas(this);
                    }
                });
                this.bind("Remove", function() {
                    Crafty.DrawManager.total2D--;
                    this._changed = true;
                    Crafty.DrawManager.addCanvas(this);
                });
            },
            drawVars: {
                type: "canvas",
                pos: {},
                ctx: null,
                coord: [ 0, 0, 0, 0 ],
                co: {
                    x: 0,
                    y: 0,
                    w: 0,
                    h: 0
                }
            },
            draw: function(ctx, x, y, w, h) {
                if (!this.ready) return;
                if (arguments.length === 4) {
                    h = w;
                    w = y;
                    y = x;
                    x = ctx;
                    ctx = Crafty.canvas.context;
                }
                var pos = this.drawVars.pos;
                pos._x = this._x + (x || 0);
                pos._y = this._y + (y || 0);
                pos._w = w || this._w;
                pos._h = h || this._h;
                context = ctx || Crafty.canvas.context;
                coord = this.__coord || [ 0, 0, 0, 0 ];
                var co = this.drawVars.co;
                co.x = coord[0] + (x || 0);
                co.y = coord[1] + (y || 0);
                co.w = w || coord[2];
                co.h = h || coord[3];
                if (this._rotation !== 0) {
                    context.save();
                    context.translate(this._origin.x + this._x, this._origin.y + this._y);
                    pos._x = -this._origin.x;
                    pos._y = -this._origin.y;
                    context.rotate(this._rotation % 360 * (Math.PI / 180));
                }
                if (this._flipX || this._flipY) {
                    context.save();
                    context.scale(this._flipX ? -1 : 1, this._flipY ? -1 : 1);
                    if (this._flipX) {
                        pos._x = -(pos._x + pos._w);
                    }
                    if (this._flipY) {
                        pos._y = -(pos._y + pos._h);
                    }
                }
                var globalpha;
                if (this._alpha < 1) {
                    globalpha = context.globalAlpha;
                    context.globalAlpha = this._alpha;
                }
                this.drawVars.ctx = context;
                this.trigger("Draw", this.drawVars);
                if (this._rotation !== 0 || (this._flipX || this._flipY)) {
                    context.restore();
                }
                if (globalpha) {
                    context.globalAlpha = globalpha;
                }
                return this;
            }
        });
        Crafty.extend({
            canvas: {
                context: null,
                init: function() {
                    if (!Crafty.support.canvas) {
                        Crafty.trigger("NoCanvas");
                        Crafty.stop();
                        return;
                    }
                    var c;
                    c = document.createElement("canvas");
                    c.width = Crafty.viewport.width;
                    c.height = Crafty.viewport.height;
                    c.style.position = "absolute";
                    c.style.left = "0px";
                    c.style.top = "0px";
                    Crafty.stage.elem.appendChild(c);
                    Crafty.canvas.context = c.getContext("2d");
                    Crafty.canvas._canvas = c;
                    var zoom = Crafty.viewport._scale;
                    if (zoom != 1) Crafty.canvas.context.scale(zoom, zoom);
                    Crafty.uniqueBind("RenderScene", Crafty.DrawManager.renderCanvas);
                    Crafty.uniqueBind("ViewportResize", this._resize);
                },
                _resize: function() {
                    var c = Crafty.canvas._canvas;
                    c.width = Crafty.viewport.width;
                    c.height = Crafty.viewport.height;
                }
            }
        });
    }, {
        "./core.js": 9
    } ],
    7: [ function(require, module, exports) {
        var Crafty = require("./core.js"), document = window.document, DEG_TO_RAD = Math.PI / 180;
        Crafty.c("Collision", {
            init: function() {
                this.requires("2D");
                this.collision();
            },
            remove: function() {
                this._cbr = null;
                this.unbind("Resize", this._resizeMap);
                this.unbind("Resize", this._checkBounds);
            },
            collision: function(poly) {
                this.unbind("Resize", this._resizeMap);
                this.unbind("Resize", this._checkBounds);
                if (!poly) {
                    poly = new Crafty.polygon([ 0, 0 ], [ this._w, 0 ], [ this._w, this._h ], [ 0, this._h ]);
                    this.bind("Resize", this._resizeMap);
                    this._cbr = null;
                } else {
                    if (arguments.length > 1) {
                        var args = Array.prototype.slice.call(arguments, 0);
                        poly = new Crafty.polygon(args);
                    }
                    this._findBounds(poly.points);
                }
                if (this.rotation) {
                    poly.rotate({
                        cos: Math.cos(-this.rotation * DEG_TO_RAD),
                        sin: Math.sin(-this.rotation * DEG_TO_RAD),
                        o: {
                            x: this._origin.x,
                            y: this._origin.y
                        }
                    });
                }
                this.map = poly;
                this.attach(this.map);
                this.map.shift(this._x, this._y);
                this.trigger("NewHitbox", poly);
                return this;
            },
            _findBounds: function(points) {
                var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
                var p;
                for (var i = 0; i < points.length; ++i) {
                    p = points[i];
                    if (p[0] < minX) minX = p[0];
                    if (p[0] > maxX) maxX = p[0];
                    if (p[1] < minY) minY = p[1];
                    if (p[1] > maxY) maxY = p[1];
                }
                var cbr = {
                    cx: (minX + maxX) / 2,
                    cy: (minY + maxY) / 2,
                    r: Math.sqrt((maxX - minX) * (maxX - minX) + (maxY - minY) * (maxY - minY)) / 2
                };
                if (minX >= 0 && minY >= 0) {
                    this._checkBounds = function() {
                        if (this._cbr === null && this._w < maxX || this._h < maxY) {
                            this._cbr = cbr;
                            this._calculateMBR();
                        } else if (this._cbr) {
                            this._cbr = null;
                            this._calculateMBR();
                        }
                    };
                    this.bind("Resize", this._checkBounds);
                }
                if (minX >= 0 && minY >= 0 && maxX <= this._w && maxY <= this._h) {
                    this._cbr = null;
                    return false;
                } else {
                    this._cbr = cbr;
                    this._calculateMBR();
                    return true;
                }
            },
            _resizeMap: function(e) {
                var dx, dy, rot = this.rotation * DEG_TO_RAD, points = this.map.points;
                if (e.axis === "w") {
                    if (rot) {
                        dx = e.amount * Math.cos(rot);
                        dy = e.amount * Math.sin(rot);
                    } else {
                        dx = e.amount;
                        dy = 0;
                    }
                    points[1][0] += dx;
                    points[1][1] += dy;
                } else {
                    if (rot) {
                        dy = e.amount * Math.cos(rot);
                        dx = -e.amount * Math.sin(rot);
                    } else {
                        dx = 0;
                        dy = e.amount;
                    }
                    points[3][0] += dx;
                    points[3][1] += dy;
                }
                points[2][0] += dx;
                points[2][1] += dy;
            },
            hit: function(comp) {
                var area = this._cbr || this._mbr || this, results = Crafty.map.search(area, false), i = 0, l = results.length, dupes = {}, id, obj, oarea, key, hasMap = "map" in this && "containsPoint" in this.map, finalresult = [];
                if (!l) {
                    return false;
                }
                for (;i < l; ++i) {
                    obj = results[i];
                    oarea = obj._cbr || obj._mbr || obj;
                    if (!obj) continue;
                    id = obj[0];
                    if (!dupes[id] && this[0] !== id && obj.__c[comp] && oarea._x < area._x + area._w && oarea._x + oarea._w > area._x && oarea._y < area._y + area._h && oarea._h + oarea._y > area._y) dupes[id] = obj;
                }
                for (key in dupes) {
                    obj = dupes[key];
                    if (hasMap && "map" in obj) {
                        var SAT = this._SAT(this.map, obj.map);
                        SAT.obj = obj;
                        SAT.type = "SAT";
                        if (SAT) finalresult.push(SAT);
                    } else {
                        finalresult.push({
                            obj: obj,
                            type: "MBR"
                        });
                    }
                }
                if (!finalresult.length) {
                    return false;
                }
                return finalresult;
            },
            onHit: function(comp, callback, callbackOff) {
                var justHit = false;
                this.bind("EnterFrame", function() {
                    var hitdata = this.hit(comp);
                    if (hitdata) {
                        justHit = true;
                        callback.call(this, hitdata);
                    } else if (justHit) {
                        if (typeof callbackOff == "function") {
                            callbackOff.call(this);
                        }
                        justHit = false;
                    }
                });
                return this;
            },
            _SAT: function(poly1, poly2) {
                var points1 = poly1.points, points2 = poly2.points, i = 0, l = points1.length, j, k = points2.length, normal = {
                    x: 0,
                    y: 0
                }, length, min1, min2, max1, max2, interval, MTV = null, MTV2 = null, MN = null, dot, nextPoint, currentPoint;
                for (;i < l; i++) {
                    nextPoint = points1[i == l - 1 ? 0 : i + 1];
                    currentPoint = points1[i];
                    normal.x = -(nextPoint[1] - currentPoint[1]);
                    normal.y = nextPoint[0] - currentPoint[0];
                    length = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
                    normal.x /= length;
                    normal.y /= length;
                    min1 = min2 = -1;
                    max1 = max2 = -1;
                    for (j = 0; j < l; ++j) {
                        dot = points1[j][0] * normal.x + points1[j][1] * normal.y;
                        if (dot > max1 || max1 === -1) max1 = dot;
                        if (dot < min1 || min1 === -1) min1 = dot;
                    }
                    for (j = 0; j < k; ++j) {
                        dot = points2[j][0] * normal.x + points2[j][1] * normal.y;
                        if (dot > max2 || max2 === -1) max2 = dot;
                        if (dot < min2 || min2 === -1) min2 = dot;
                    }
                    if (min1 < min2) {
                        interval = min2 - max1;
                        normal.x = -normal.x;
                        normal.y = -normal.y;
                    } else {
                        interval = min1 - max2;
                    }
                    if (interval >= 0) {
                        return false;
                    }
                    if (MTV === null || interval > MTV) {
                        MTV = interval;
                        MN = {
                            x: normal.x,
                            y: normal.y
                        };
                    }
                }
                for (i = 0; i < k; i++) {
                    nextPoint = points2[i == k - 1 ? 0 : i + 1];
                    currentPoint = points2[i];
                    normal.x = -(nextPoint[1] - currentPoint[1]);
                    normal.y = nextPoint[0] - currentPoint[0];
                    length = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
                    normal.x /= length;
                    normal.y /= length;
                    min1 = min2 = -1;
                    max1 = max2 = -1;
                    for (j = 0; j < l; ++j) {
                        dot = points1[j][0] * normal.x + points1[j][1] * normal.y;
                        if (dot > max1 || max1 === -1) max1 = dot;
                        if (dot < min1 || min1 === -1) min1 = dot;
                    }
                    for (j = 0; j < k; ++j) {
                        dot = points2[j][0] * normal.x + points2[j][1] * normal.y;
                        if (dot > max2 || max2 === -1) max2 = dot;
                        if (dot < min2 || min2 === -1) min2 = dot;
                    }
                    if (min1 < min2) {
                        interval = min2 - max1;
                        normal.x = -normal.x;
                        normal.y = -normal.y;
                    } else {
                        interval = min1 - max2;
                    }
                    if (interval >= 0) {
                        return false;
                    }
                    if (MTV === null || interval > MTV) MTV = interval;
                    if (interval > MTV2 || MTV2 === null) {
                        MTV2 = interval;
                        MN = {
                            x: normal.x,
                            y: normal.y
                        };
                    }
                }
                return {
                    overlap: MTV2,
                    normal: MN
                };
            }
        });
    }, {
        "./core.js": 9
    } ],
    8: [ function(require, module, exports) {
        var Crafty = require("./core.js"), document = window.document;
        Crafty.extend({
            over: null,
            mouseObjs: 0,
            mousePos: {},
            lastEvent: null,
            keydown: {},
            lastKeyDownEvent: null,
            selected: false,
            detectBlur: function(e) {
                var selected = e.clientX > Crafty.stage.x && e.clientX < Crafty.stage.x + Crafty.viewport.width && (e.clientY > Crafty.stage.y && e.clientY < Crafty.stage.y + Crafty.viewport.height);
                if (!Crafty.selected && selected) Crafty.trigger("CraftyFocus");
                if (Crafty.selected && !selected) Crafty.trigger("CraftyBlur");
                Crafty.selected = selected;
            },
            mouseDispatch: function(e) {
                if (!Crafty.mouseObjs) return;
                Crafty.lastEvent = e;
                var maxz = -1, closest, q, i = 0, l, pos = Crafty.DOM.translate(e.clientX, e.clientY), x, y, dupes = {}, tar = e.target ? e.target : e.srcElement, type = e.type;
                if (typeof e.which === "undefined") {
                    e.mouseButton = e.button < 2 ? Crafty.mouseButtons.LEFT : e.button == 4 ? Crafty.mouseButtons.MIDDLE : Crafty.mouseButtons.RIGHT;
                } else {
                    e.mouseButton = e.which < 2 ? Crafty.mouseButtons.LEFT : e.which == 2 ? Crafty.mouseButtons.MIDDLE : Crafty.mouseButtons.RIGHT;
                }
                e.realX = x = Crafty.mousePos.x = pos.x;
                e.realY = y = Crafty.mousePos.y = pos.y;
                if (tar.nodeName != "CANVAS") {
                    while (typeof tar.id != "string" && tar.id.indexOf("ent") == -1) {
                        tar = tar.parentNode;
                    }
                    ent = Crafty(parseInt(tar.id.replace("ent", ""), 10));
                    if (ent.has("Mouse") && ent.isAt(x, y)) closest = ent;
                }
                if (!closest) {
                    q = Crafty.map.search({
                        _x: x,
                        _y: y,
                        _w: 1,
                        _h: 1
                    }, false);
                    for (l = q.length; i < l; ++i) {
                        if (!q[i].__c.Mouse || !q[i]._visible) continue;
                        var current = q[i], flag = false;
                        if (dupes[current[0]]) continue; else dupes[current[0]] = true;
                        if (current.mapArea) {
                            if (current.mapArea.containsPoint(x, y)) {
                                flag = true;
                            }
                        } else if (current.isAt(x, y)) flag = true;
                        if (flag && (current._z >= maxz || maxz === -1)) {
                            if (current._z === maxz && current[0] < closest[0]) {
                                continue;
                            }
                            maxz = current._z;
                            closest = current;
                        }
                    }
                }
                if (closest) {
                    if (type === "mousedown") {
                        closest.trigger("MouseDown", e);
                    } else if (type === "mouseup") {
                        closest.trigger("MouseUp", e);
                    } else if (type == "dblclick") {
                        closest.trigger("DoubleClick", e);
                    } else if (type == "click") {
                        closest.trigger("Click", e);
                    } else if (type === "mousemove") {
                        closest.trigger("MouseMove", e);
                        if (this.over !== closest) {
                            if (this.over) {
                                this.over.trigger("MouseOut", e);
                                this.over = null;
                            }
                            this.over = closest;
                            closest.trigger("MouseOver", e);
                        }
                    } else if (type === "mousedown2") {
                        closest.trigger("MouseDownTP2", e);
                    } else if (type === "mouseup2") {
                        closest.trigger("MouseUpTP2", e);
                    } else if (type == "dblclick2") {
                        closest.trigger("DoubleClickTP2", e);
                    } else if (type == "click2") {
                        closest.trigger("ClickTP2", e);
                    } else if (type === "mousemove2") {
                        closest.trigger("MouseMoveTP2", e);
                        if (this.over !== closest) {
                            if (this.over) {
                                this.over.trigger("MouseOutTP2", e);
                                this.over = null;
                            }
                            this.over = closest;
                            closest.trigger("MouseOverTP2", e);
                        }
                    } else closest.trigger(type, e);
                } else {
                    if (type === "mousemove" && this.over) {
                        this.over.trigger("MouseOut", e);
                        this.over = null;
                    }
                    if (type === "mousedown") {
                        Crafty.viewport.mouselook("start", e);
                    } else if (type === "mousemove") {
                        Crafty.viewport.mouselook("drag", e);
                    } else if (type == "mouseup") {
                        Crafty.viewport.mouselook("stop");
                    }
                }
                if (type === "mousemove") {
                    this.lastEvent = e;
                }
            },
            touchDispatch: function(e) {
                var type, type2, lastEvent = Crafty.lastEvent;
                if (e.type === "touchstart") type = "mousedown"; else if (e.type === "touchmove") type = "mousemove"; else if (e.type === "touchend") type = "mouseup"; else if (e.type === "touchcancel") type = "mouseup"; else if (e.type === "touchleave") type = "mouseup";
                if (e.touches && e.touches.length && Crafty.touches.first) {
                    for (var i = e.touches; i < e.touches.length; i++) {
                        if (e.touches[i].identifier === Crafty.touches.first) {
                            first = e.touches[i];
                        } else if (e.touches[i].identifier === Crafty.touches.second) {
                            second = e.touches[i];
                        }
                    }
                    if (!first) {
                        Crafty.touches.first = e.touches[0].identifier;
                        first = e.touches[0];
                        if (e.touches.length > 1) {
                            Crafty.touches.second = e.touches[1].identifier;
                            second = e.touches[1];
                        }
                    }
                } else if (e.touches && e.touches.length && !Crafty.touches.first) {
                    Crafty.touches.first = e.touches[0].identifier;
                    first = e.touches[0];
                    if (e.touches.length > 1 && !Crafty.touches.second) {
                        Crafty.touches.second = e.touches[1].identifier;
                        second = e.touches[1];
                    }
                }
                console.log("first", first, Crafty.touches.first);
                console.log("second", second, Crafty.touches.second);
            },
            keyboardDispatch: function(e) {
                var original = e, evnt = {}, props = "char charCode keyCode type shiftKey ctrlKey metaKey timeStamp".split(" ");
                for (var i = props.length; i; ) {
                    var prop = props[--i];
                    evnt[prop] = original[prop];
                }
                evnt.which = original.charCode !== null ? original.charCode : original.keyCode;
                evnt.key = original.keyCode || original.which;
                evnt.originalEvent = original;
                e = evnt;
                if (e.type === "keydown") {
                    if (Crafty.lastKeyDownEvent && Crafty.lastKeyDownEvent.keyCode === e.keyCode) {
                        var timeDiff = Math.abs(e.timeStamp - Crafty.lastKeyDownEvent.timeStamp);
                        Crafty.lastKeyDownEvent = e;
                    }
                    if (Crafty.keydown[e.key] !== true) {
                        Crafty.keydown[e.key] = true;
                        Crafty.lastKeyDownEvent = e;
                        Crafty.trigger("KeyDown", e);
                    } else if (timeDiff < 200) {
                        Crafty.trigger("KeyHold", e);
                    }
                } else if (e.type === "keyup") {
                    delete Crafty.keydown[e.key];
                    Crafty.trigger("KeyUp", e);
                }
                if (Crafty.selected && !(e.key == 8 || e.key >= 112 && e.key <= 135)) {
                    if (e.stopPropagation) e.stopPropagation(); else e.cancelBubble = true;
                    if (e.target && e.target.nodeName !== "INPUT" && e.target.nodeName !== "TEXTAREA") {
                        if (e.preventDefault) {
                            e.preventDefault();
                        } else {
                            e.returnValue = false;
                        }
                    }
                    return false;
                }
            }
        });
        Crafty.bind("Load", function() {
            Crafty.addEvent(this, "keydown", Crafty.keyboardDispatch);
            Crafty.addEvent(this, "keyhold", Crafty.keyboardDispatch);
            Crafty.addEvent(this, "keyup", Crafty.keyboardDispatch);
            Crafty.addEvent(this, Crafty.stage.elem, "mousedown", Crafty.mouseDispatch);
            Crafty.addEvent(this, Crafty.stage.elem, "mouseup", Crafty.mouseDispatch);
            Crafty.addEvent(this, document.body, "mouseup", Crafty.detectBlur);
            Crafty.addEvent(this, Crafty.stage.elem, "mousemove", Crafty.mouseDispatch);
            Crafty.addEvent(this, Crafty.stage.elem, "click", Crafty.mouseDispatch);
            Crafty.addEvent(this, Crafty.stage.elem, "dblclick", Crafty.mouseDispatch);
            Crafty.addEvent(this, Crafty.stage.elem, "mousedown2", Crafty.mouseDispatch);
            Crafty.addEvent(this, Crafty.stage.elem, "mouseup2", Crafty.mouseDispatch);
            Crafty.addEvent(this, document.body, "mouseup2", Crafty.detectBlur);
            Crafty.addEvent(this, Crafty.stage.elem, "mousemove2", Crafty.mouseDispatch);
            Crafty.addEvent(this, Crafty.stage.elem, "click2", Crafty.mouseDispatch);
            Crafty.addEvent(this, Crafty.stage.elem, "dblclick2", Crafty.mouseDispatch);
            Crafty.addEvent(this, Crafty.stage.elem, "touchstart", Crafty.touchDispatch);
            Crafty.addEvent(this, Crafty.stage.elem, "touchmove", Crafty.touchDispatch);
            Crafty.addEvent(this, Crafty.stage.elem, "touchend", Crafty.touchDispatch);
            Crafty.addEvent(this, Crafty.stage.elem, "touchcancel", Crafty.touchDispatch);
            Crafty.addEvent(this, Crafty.stage.elem, "touchleave", Crafty.touchDispatch);
        });
        Crafty.bind("CraftyStop", function() {
            Crafty.removeEvent(this, "keydown", Crafty.keyboardDispatch);
            Crafty.removeEvent(this, "keyhold", Crafty.keyboardDispatch);
            Crafty.removeEvent(this, "keyup", Crafty.keyboardDispatch);
            if (Crafty.stage) {
                Crafty.removeEvent(this, Crafty.stage.elem, "mousedown", Crafty.mouseDispatch);
                Crafty.removeEvent(this, Crafty.stage.elem, "mouseup", Crafty.mouseDispatch);
                Crafty.removeEvent(this, Crafty.stage.elem, "mousemove", Crafty.mouseDispatch);
                Crafty.removeEvent(this, Crafty.stage.elem, "click", Crafty.mouseDispatch);
                Crafty.removeEvent(this, Crafty.stage.elem, "dblclick", Crafty.mouseDispatch);
                Crafty.addEvent(this, Crafty.stage.elem, "mousedown0", Crafty.mouseDispatch);
                Crafty.addEvent(this, Crafty.stage.elem, "mouseup0", Crafty.mouseDispatch);
                Crafty.addEvent(this, document.body, "mouseup0", Crafty.detectBlur);
                Crafty.addEvent(this, Crafty.stage.elem, "mousemove0", Crafty.mouseDispatch);
                Crafty.addEvent(this, Crafty.stage.elem, "click0", Crafty.mouseDispatch);
                Crafty.addEvent(this, Crafty.stage.elem, "dblclick0", Crafty.mouseDispatch);
                Crafty.removeEvent(this, Crafty.stage.elem, "touchstart", Crafty.touchDispatch);
                Crafty.removeEvent(this, Crafty.stage.elem, "touchmove", Crafty.touchDispatch);
                Crafty.removeEvent(this, Crafty.stage.elem, "touchend", Crafty.touchDispatch);
                Crafty.removeEvent(this, Crafty.stage.elem, "touchcancel", Crafty.touchDispatch);
                Crafty.removeEvent(this, Crafty.stage.elem, "touchleave", Crafty.touchDispatch);
            }
            Crafty.removeEvent(this, document.body, "mouseup", Crafty.detectBlur);
        });
        Crafty.c("Mouse", {
            init: function() {
                Crafty.mouseObjs++;
                this.bind("Remove", function() {
                    Crafty.mouseObjs--;
                });
            },
            areaMap: function(poly) {
                if (arguments.length > 1) {
                    var args = Array.prototype.slice.call(arguments, 0);
                    poly = new Crafty.polygon(args);
                }
                poly.shift(this._x, this._y);
                this.mapArea = poly;
                this.attach(this.mapArea);
                return this;
            }
        });
        Crafty.c("Draggable", {
            _origMouseDOMPos: null,
            _oldX: null,
            _oldY: null,
            _dragging: false,
            _dir: null,
            init: function() {
                this.requires("Mouse");
                this.enableDrag();
            },
            _ondrag: function(e) {
                var pos = Crafty.DOM.translate(e.clientX, e.clientY);
                if (pos.x === 0 || pos.y === 0) {
                    return false;
                }
                if (this._dir) {
                    var len = (pos.x - this._origMouseDOMPos.x) * this._dir.x + (pos.y - this._origMouseDOMPos.y) * this._dir.y;
                    this.x = this._oldX + len * this._dir.x;
                    this.y = this._oldY + len * this._dir.y;
                } else {
                    this.x = this._oldX + (pos.x - this._origMouseDOMPos.x);
                    this.y = this._oldY + (pos.y - this._origMouseDOMPos.y);
                }
                this.trigger("Dragging", e);
            },
            _ondown: function(e) {
                if (e.mouseButton !== Crafty.mouseButtons.LEFT) return;
                this._startDrag(e);
            },
            _onup: function(e) {
                if (this._dragging === true) {
                    Crafty.removeEvent(this, Crafty.stage.elem, "mousemove", this._ondrag);
                    Crafty.removeEvent(this, Crafty.stage.elem, "mouseup", this._onup);
                    this._dragging = false;
                    this.trigger("StopDrag", e);
                }
            },
            dragDirection: function(dir) {
                if (typeof dir === "undefined") {
                    this._dir = null;
                } else if ("" + parseInt(dir, 10) == dir) {
                    this._dir = {
                        x: Math.cos(dir / 180 * Math.PI),
                        y: Math.sin(dir / 180 * Math.PI)
                    };
                } else {
                    var r = Math.sqrt(dir.x * dir.x + dir.y * dir.y);
                    this._dir = {
                        x: dir.x / r,
                        y: dir.y / r
                    };
                }
            },
            _startDrag: function(e) {
                this._origMouseDOMPos = Crafty.DOM.translate(e.clientX, e.clientY);
                this._oldX = this._x;
                this._oldY = this._y;
                this._dragging = true;
                Crafty.addEvent(this, Crafty.stage.elem, "mousemove", this._ondrag);
                Crafty.addEvent(this, Crafty.stage.elem, "mouseup", this._onup);
                this.trigger("StartDrag", e);
            },
            stopDrag: function() {
                Crafty.removeEvent(this, Crafty.stage.elem, "mousemove", this._ondrag);
                Crafty.removeEvent(this, Crafty.stage.elem, "mouseup", this._onup);
                this._dragging = false;
                this.trigger("StopDrag");
                return this;
            },
            startDrag: function() {
                if (!this._dragging) {
                    this._startDrag(Crafty.lastEvent);
                }
                return this;
            },
            enableDrag: function() {
                this.bind("MouseDown", this._ondown);
                Crafty.addEvent(this, Crafty.stage.elem, "mouseup", this._onup);
                return this;
            },
            disableDrag: function() {
                this.unbind("MouseDown", this._ondown);
                if (this._dragging) {
                    this.stopDrag();
                }
                return this;
            }
        });
        Crafty.c("Keyboard", {
            isDown: function(key) {
                if (typeof key === "string") {
                    key = Crafty.keys[key];
                }
                return !!Crafty.keydown[key];
            }
        });
        Crafty.c("Multiway", {
            _speed: 3,
            _keydown: function(e) {
                if (this._keys[e.key]) {
                    this._movement.x = Math.round((this._movement.x + this._keys[e.key].x) * 1e3) / 1e3;
                    this._movement.y = Math.round((this._movement.y + this._keys[e.key].y) * 1e3) / 1e3;
                    this.trigger("NewDirection", this._movement);
                }
            },
            _keyup: function(e) {
                if (this._keys[e.key]) {
                    this._movement.x = Math.round((this._movement.x - this._keys[e.key].x) * 1e3) / 1e3;
                    this._movement.y = Math.round((this._movement.y - this._keys[e.key].y) * 1e3) / 1e3;
                    this.trigger("NewDirection", this._movement);
                }
            },
            _enterframe: function() {
                if (this.disableControls) return;
                if (this._movement.x !== 0) {
                    this.x += this._movement.x;
                    this.trigger("Moved", {
                        x: this.x - this._movement.x,
                        y: this.y
                    });
                }
                if (this._movement.y !== 0) {
                    this.y += this._movement.y;
                    this.trigger("Moved", {
                        x: this.x,
                        y: this.y - this._movement.y
                    });
                }
            },
            _initializeControl: function() {
                return this.unbind("KeyDown", this._keydown).unbind("KeyUp", this._keyup).unbind("EnterFrame", this._enterframe).bind("KeyDown", this._keydown).bind("KeyUp", this._keyup).bind("EnterFrame", this._enterframe);
            },
            multiway: function(speed, keys) {
                this._keyDirection = {};
                this._keys = {};
                this._movement = {
                    x: 0,
                    y: 0
                };
                this._speed = {
                    x: 3,
                    y: 3
                };
                if (keys) {
                    if (speed.x !== undefined && speed.y !== undefined) {
                        this._speed.x = speed.x;
                        this._speed.y = speed.y;
                    } else {
                        this._speed.x = speed;
                        this._speed.y = speed;
                    }
                } else {
                    keys = speed;
                }
                this._keyDirection = keys;
                this.speed(this._speed);
                this._initializeControl();
                for (var k in keys) {
                    if (Crafty.keydown[Crafty.keys[k]]) {
                        this.trigger("KeyDown", {
                            key: Crafty.keys[k]
                        });
                    }
                }
                return this;
            },
            enableControl: function() {
                this.disableControls = false;
                return this;
            },
            disableControl: function() {
                this.disableControls = true;
                return this;
            },
            speed: function(speed) {
                for (var k in this._keyDirection) {
                    var keyCode = Crafty.keys[k] || k;
                    this._keys[keyCode] = {
                        x: Math.round(Math.cos(this._keyDirection[k] * (Math.PI / 180)) * 1e3 * speed.x) / 1e3,
                        y: Math.round(Math.sin(this._keyDirection[k] * (Math.PI / 180)) * 1e3 * speed.y) / 1e3
                    };
                }
                return this;
            }
        });
        Crafty.c("Fourway", {
            init: function() {
                this.requires("Multiway");
            },
            fourway: function(speed) {
                this.multiway(speed, {
                    UP_ARROW: -90,
                    DOWN_ARROW: 90,
                    RIGHT_ARROW: 0,
                    LEFT_ARROW: 180,
                    W: -90,
                    S: 90,
                    D: 0,
                    A: 180,
                    Z: -90,
                    Q: 180
                });
                return this;
            }
        });
        Crafty.c("Twoway", {
            _speed: 3,
            _up: false,
            init: function() {
                this.requires("Fourway, Keyboard, Gravity");
            },
            twoway: function(speed, jump) {
                this.multiway(speed, {
                    RIGHT_ARROW: 0,
                    LEFT_ARROW: 180,
                    D: 0,
                    A: 180,
                    Q: 180
                });
                if (speed) this._speed = speed;
                if (arguments.length < 2) {
                    this._jumpSpeed = this._speed * 2;
                } else {
                    this._jumpSpeed = jump;
                }
                this.bind("EnterFrame", function() {
                    if (this.disableControls) return;
                    if (this._up) {
                        this.y -= this._jumpSpeed;
                        this._falling = true;
                        this.trigger("Moved", {
                            x: this._x,
                            y: this._y + this._jumpSpeed
                        });
                    }
                }).bind("KeyDown", function(e) {
                    if (!this._falling && (e.key === Crafty.keys.UP_ARROW || e.key === Crafty.keys.W || e.key === Crafty.keys.Z)) this._up = true;
                });
                return this;
            }
        });
    }, {
        "./core.js": 9
    } ],
    9: [ function(require, module, exports) {
        var version = require("./version");
        var Crafty = function(selector) {
            return new Crafty.fn.init(selector);
        }, GUID, frame, components, entities, handlers, onloads, slice, rlist, rspace, milliSecPerFrame;
        initState = function() {
            GUID = 1, frame = 0;
            components = {};
            entities = {};
            handlers = {};
            onloads = [];
            slice = Array.prototype.slice;
            rlist = /\s*,\s*/;
            rspace = /\s+/;
        };
        initState();
        Crafty.fn = Crafty.prototype = {
            init: function(selector) {
                if (typeof selector === "string") {
                    var elem = 0, e, current, and = false, or = false, del, comps, score, i, l;
                    if (selector === "*") {
                        i = 0;
                        for (e in entities) {
                            this[i] = +e;
                            i++;
                        }
                        this.length = i;
                        if (i === 1) {
                            return entities[this[0]];
                        }
                        return this;
                    }
                    if (selector.indexOf(",") !== -1) {
                        or = true;
                        del = rlist;
                    } else if (selector.indexOf(" ") !== -1) {
                        and = true;
                        del = rspace;
                    }
                    for (e in entities) {
                        if (!entities.hasOwnProperty(e)) continue;
                        current = entities[e];
                        if (and || or) {
                            comps = selector.split(del);
                            i = 0;
                            l = comps.length;
                            score = 0;
                            for (;i < l; i++) if (current.__c[comps[i]]) score++;
                            if (and && score === l || or && score > 0) this[elem++] = +e;
                        } else if (current.__c[selector]) this[elem++] = +e;
                    }
                    if (elem > 0 && !and && !or) this.extend(components[selector]);
                    if (comps && and) for (i = 0; i < l; i++) this.extend(components[comps[i]]);
                    this.length = elem;
                    if (elem === 1) {
                        return entities[this[elem - 1]];
                    }
                } else {
                    if (!selector) {
                        selector = 0;
                        if (!(selector in entities)) entities[selector] = this;
                    }
                    if (!(selector in entities)) {
                        this.length = 0;
                        return this;
                    }
                    this[0] = selector;
                    this.length = 1;
                    if (!this.__c) this.__c = {};
                    if (!entities[selector]) entities[selector] = this;
                    return entities[selector];
                }
                return this;
            },
            setName: function(name) {
                var entityName = String(name);
                this._entityName = entityName;
                this.trigger("NewEntityName", entityName);
                return this;
            },
            addComponent: function(id) {
                var uninit = [], c = 0, ul, i = 0, l, comps, comp;
                if (arguments.length > 1) {
                    l = arguments.length;
                    for (;i < l; i++) {
                        uninit.push(arguments[i]);
                    }
                } else if (id.indexOf(",") !== -1) {
                    comps = id.split(rlist);
                    l = comps.length;
                    for (;i < l; i++) {
                        uninit.push(comps[i]);
                    }
                } else {
                    uninit.push(id);
                }
                ul = uninit.length;
                for (;c < ul; c++) {
                    if (this.__c[uninit[c]] === true) continue;
                    this.__c[uninit[c]] = true;
                    comp = components[uninit[c]];
                    this.extend(comp);
                    if (comp && "init" in comp) {
                        comp.init.call(this);
                    }
                }
                this.trigger("NewComponent", uninit);
                return this;
            },
            toggleComponent: function(toggle) {
                var i = 0, l, comps;
                if (arguments.length > 1) {
                    l = arguments.length;
                    for (;i < l; i++) {
                        if (this.has(arguments[i])) {
                            this.removeComponent(arguments[i]);
                        } else {
                            this.addComponent(arguments[i]);
                        }
                    }
                } else if (toggle.indexOf(",") !== -1) {
                    comps = toggle.split(rlist);
                    l = comps.length;
                    for (;i < l; i++) {
                        if (this.has(comps[i])) {
                            this.removeComponent(comps[i]);
                        } else {
                            this.addComponent(comps[i]);
                        }
                    }
                } else {
                    if (this.has(toggle)) {
                        this.removeComponent(toggle);
                    } else {
                        this.addComponent(toggle);
                    }
                }
                return this;
            },
            requires: function(list) {
                return this.addComponent(list);
            },
            removeComponent: function(id, soft) {
                var comp = components[id];
                this.trigger("RemoveComponent", id);
                if (comp && "remove" in comp) {
                    comp.remove.call(this, false);
                }
                if (soft === false && comp) {
                    for (var prop in comp) {
                        delete this[prop];
                    }
                }
                delete this.__c[id];
                return this;
            },
            getId: function() {
                return this[0];
            },
            has: function(id) {
                return !!this.__c[id];
            },
            attr: function(key, value) {
                if (arguments.length === 1) {
                    if (typeof key === "string") {
                        return this[key];
                    }
                    this.extend(key);
                    this.trigger("Change", key);
                    return this;
                }
                this[key] = value;
                var change = {};
                change[key] = value;
                this.trigger("Change", change);
                return this;
            },
            toArray: function() {
                return slice.call(this, 0);
            },
            timeout: function(callback, duration) {
                this.each(function() {
                    var self = this;
                    setTimeout(function() {
                        callback.call(self);
                    }, duration);
                });
                return this;
            },
            bind: function(event, callback) {
                if (this.length === 1) {
                    if (!handlers[event]) handlers[event] = {};
                    var h = handlers[event];
                    if (!h[this[0]]) h[this[0]] = [];
                    h[this[0]].push(callback);
                    return this;
                }
                this.each(function() {
                    if (!handlers[event]) handlers[event] = {};
                    var h = handlers[event];
                    if (!h[this[0]]) h[this[0]] = [];
                    h[this[0]].push(callback);
                });
                return this;
            },
            uniqueBind: function(event, callback) {
                this.unbind(event, callback);
                this.bind(event, callback);
            },
            one: function(event, callback) {
                var self = this;
                var oneHandler = function(data) {
                    callback.call(self, data);
                    self.unbind(event, oneHandler);
                };
                return self.bind(event, oneHandler);
            },
            unbind: function(event, callback) {
                this.each(function() {
                    var hdl = handlers[event], i = 0, l, current;
                    if (hdl && hdl[this[0]]) l = hdl[this[0]].length; else return this;
                    if (!callback) {
                        delete hdl[this[0]];
                        return this;
                    }
                    for (;i < l; i++) {
                        current = hdl[this[0]];
                        if (current[i] == callback) {
                            delete current[i];
                        }
                    }
                });
                return this;
            },
            trigger: function(event, data) {
                if (this.length === 1) {
                    if (handlers[event] && handlers[event][this[0]]) {
                        var callbacks = handlers[event][this[0]], i;
                        for (i = 0; i < callbacks.length; i++) {
                            if (typeof callbacks[i] === "undefined") {
                                callbacks.splice(i, 1);
                                i--;
                            } else {
                                callbacks[i].call(this, data);
                            }
                        }
                    }
                    return this;
                }
                this.each(function() {
                    if (handlers[event] && handlers[event][this[0]]) {
                        var callbacks = handlers[event][this[0]], i;
                        for (i = 0; i < callbacks.length; i++) {
                            if (typeof callbacks[i] === "undefined") {
                                callbacks.splice(i, 1);
                                i--;
                            } else {
                                callbacks[i].call(this, data);
                            }
                        }
                    }
                });
                return this;
            },
            each: function(func) {
                var i = 0, l = this.length;
                for (;i < l; i++) {
                    if (!entities[this[i]]) continue;
                    func.call(entities[this[i]], i);
                }
                return this;
            },
            get: function(index) {
                var l = this.length;
                if (typeof index !== "undefined") {
                    if (index >= l || index + l < 0) return undefined;
                    if (index >= 0) return entities[this[index]]; else return entities[this[index + l]];
                } else {
                    var i = 0, result = [];
                    for (;i < l; i++) {
                        if (!entities[this[i]]) continue;
                        result.push(entities[this[i]]);
                    }
                    return result;
                }
            },
            clone: function() {
                var comps = this.__c, comp, prop, clone = Crafty.e();
                for (comp in comps) {
                    clone.addComponent(comp);
                }
                for (prop in this) {
                    if (prop != "0" && prop != "_global" && prop != "_changed" && typeof this[prop] != "function" && typeof this[prop] != "object") {
                        clone[prop] = this[prop];
                    }
                }
                return clone;
            },
            setter: function(prop, callback) {
                if (Crafty.support.setter) {
                    this.__defineSetter__(prop, callback);
                } else if (Crafty.support.defineProperty) {
                    Object.defineProperty(this, prop, {
                        set: callback,
                        configurable: true
                    });
                }
                return this;
            },
            destroy: function() {
                this.each(function() {
                    var comp;
                    this.trigger("Remove");
                    for (var compName in this.__c) {
                        comp = components[compName];
                        if (comp && "remove" in comp) comp.remove.call(this, true);
                    }
                    for (var e in handlers) {
                        this.unbind(e);
                    }
                    delete entities[this[0]];
                });
            }
        };
        Crafty.fn.init.prototype = Crafty.fn;
        Crafty.extend = Crafty.fn.extend = function(obj) {
            var target = this, key;
            if (!obj) return target;
            for (key in obj) {
                if (target === obj[key]) continue;
                target[key] = obj[key];
            }
            return target;
        };
        Crafty.extend({
            init: function(w, h, stage_elem) {
                Crafty.viewport.init(w, h, stage_elem);
                this.trigger("Load");
                this.timer.init();
                return this;
            },
            getVersion: function() {
                return version;
            },
            stop: function(clearState) {
                this.timer.stop();
                if (clearState) {
                    Crafty.audio.remove();
                    if (Crafty.stage && Crafty.stage.elem.parentNode) {
                        var newCrStage = document.createElement("div");
                        newCrStage.id = Crafty.stage.elem.id;
                        Crafty.stage.elem.parentNode.replaceChild(newCrStage, Crafty.stage.elem);
                    }
                    initState();
                }
                Crafty.trigger("CraftyStop");
                return this;
            },
            pause: function(toggle) {
                if (arguments.length === 1 ? toggle : !this._paused) {
                    this.trigger("Pause");
                    this._paused = true;
                    setTimeout(function() {
                        Crafty.timer.stop();
                    }, 0);
                    Crafty.keydown = {};
                } else {
                    this.trigger("Unpause");
                    this._paused = false;
                    setTimeout(function() {
                        Crafty.timer.init();
                    }, 0);
                }
                return this;
            },
            isPaused: function() {
                return this._paused;
            },
            timer: function() {
                var tick, requestID;
                var mode = "fixed", maxFramesPerStep = 5, maxTimestep = 40;
                var endTime = 0, timeSlip = 0, gameTime;
                var FPS = 50, milliSecPerFrame = 1e3 / FPS;
                return {
                    init: function() {
                        if (typeof gameTime === "undefined") gameTime = new Date().getTime() - milliSecPerFrame;
                        var onFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || null;
                        if (onFrame) {
                            tick = function() {
                                Crafty.timer.step();
                                requestID = onFrame(tick);
                            };
                            tick();
                        } else {
                            tick = setInterval(function() {
                                Crafty.timer.step();
                            }, 1e3 / FPS);
                        }
                    },
                    stop: function() {
                        Crafty.trigger("CraftyStopTimer");
                        if (typeof tick === "number") clearInterval(tick);
                        var onFrame = window.cancelRequestAnimationFrame || window.webkitCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame || window.oCancelRequestAnimationFrame || window.msCancelRequestAnimationFrame || null;
                        if (onFrame) onFrame(requestID);
                        tick = null;
                    },
                    steptype: function(newmode, option) {
                        if (newmode === "variable" || newmode === "semifixed") {
                            mode = newmode;
                            if (option) maxTimestep = option;
                        } else if (newmode === "fixed") {
                            mode = "fixed";
                            if (option) maxFramesPerStep = option;
                        } else {
                            throw "Invalid step type specified";
                        }
                    },
                    step: function() {
                        var drawTimeStart, dt, lastFrameTime, loops = 0;
                        currentTime = new Date().getTime();
                        if (endTime > 0) Crafty.trigger("MeasureWaitTime", currentTime - endTime);
                        if (gameTime + timeSlip >= currentTime) {
                            endTime = currentTime;
                            return;
                        }
                        var netTimeStep = currentTime - (gameTime + timeSlip);
                        if (netTimeStep > milliSecPerFrame * 20) {
                            timeSlip += netTimeStep - milliSecPerFrame;
                            netTimeStep = milliSecPerFrame;
                        }
                        if (mode === "fixed") {
                            loops = Math.ceil(netTimeStep / milliSecPerFrame);
                            loops = Math.min(loops, maxFramesPerStep);
                            dt = milliSecPerFrame;
                        } else if (mode === "variable") {
                            loops = 1;
                            dt = netTimeStep;
                            dt = Math.min(dt, maxTimestep);
                        } else if (mode === "semifixed") {
                            loops = Math.ceil(netTimeStep / maxTimestep);
                            dt = netTimeStep / loops;
                        }
                        for (var i = 0; i < loops; i++) {
                            lastFrameTime = currentTime;
                            Crafty.trigger("EnterFrame", {
                                frame: frame++,
                                dt: dt,
                                gameTime: gameTime
                            });
                            gameTime += dt;
                            currentTime = new Date().getTime();
                            Crafty.trigger("MeasureFrameTime", currentTime - lastFrameTime);
                        }
                        if (loops > 0) {
                            drawTimeStart = currentTime;
                            Crafty.trigger("RenderScene");
                            Crafty.trigger("PostRender");
                            currentTime = new Date().getTime();
                            Crafty.trigger("MeasureRenderTime", currentTime - drawTimeStart);
                        }
                        endTime = currentTime;
                    },
                    FPS: function(value) {
                        if (typeof value == "undefined") return FPS; else {
                            FPS = value;
                            milliSecPerFrame = 1e3 / FPS;
                        }
                    },
                    simulateFrames: function(frames, timestep) {
                        if (typeof timestep === "undefined") timestep = milliSecPerFrame;
                        while (frames-- > 0) {
                            Crafty.trigger("EnterFrame", {
                                frame: frame++,
                                dt: timestep
                            });
                        }
                        Crafty.trigger("RenderScene");
                    }
                };
            }(),
            e: function() {
                var id = UID(), craft;
                entities[id] = null;
                entities[id] = craft = Crafty(id);
                if (arguments.length > 0) {
                    craft.addComponent.apply(craft, arguments);
                }
                craft.setName("Entity #" + id);
                craft.addComponent("obj");
                Crafty.trigger("NewEntity", {
                    id: id
                });
                return craft;
            },
            c: function(compName, component) {
                components[compName] = component;
            },
            trigger: function(event, data) {
                var hdl = handlers[event], h, i, l, callbacks, context;
                for (h in hdl) {
                    if (!hdl.hasOwnProperty(h)) continue;
                    callbacks = hdl[h];
                    if (!callbacks || callbacks.length === 0) continue;
                    if (entities[h]) context = Crafty(+h); else context = Crafty;
                    for (i = 0; i < callbacks.length; i++) {
                        if (typeof callbacks[i] === "undefined") {
                            callbacks.splice(i, 1);
                            i--;
                        } else callbacks[i].call(context, data);
                    }
                }
            },
            bind: function(event, callback) {
                if (!handlers[event]) handlers[event] = {};
                var hdl = handlers[event];
                if (!hdl.global) hdl.global = [];
                hdl.global.push(callback);
                return callback;
            },
            uniqueBind: function(event, callback) {
                this.unbind(event, callback);
                return this.bind(event, callback);
            },
            one: function(event, callback) {
                var self = this;
                var oneHandler = function(data) {
                    callback.call(self, data);
                    self.unbind(event, oneHandler);
                };
                return self.bind(event, oneHandler);
            },
            unbind: function(event, callback) {
                var hdl = handlers[event], i, l, global_callbacks, found_match;
                if (hdl === undefined || hdl.global === undefined || hdl.global.length === 0) {
                    return false;
                }
                if (arguments.length === 1) {
                    delete hdl.global;
                    return true;
                }
                global_callbacks = hdl.global;
                found_match = false;
                for (i = 0, l = global_callbacks.length; i < l; i++) {
                    if (global_callbacks[i] === callback) {
                        found_match = true;
                        delete global_callbacks[i];
                    }
                }
                return found_match;
            },
            frame: function() {
                return frame;
            },
            components: function() {
                return components;
            },
            isComp: function(comp) {
                return comp in components;
            },
            debug: function(str) {
                if (str === "handlers") {
                    return handlers;
                }
                return entities;
            },
            settings: function() {
                var states = {}, callbacks = {};
                return {
                    register: function(setting, callback) {
                        callbacks[setting] = callback;
                    },
                    modify: function(setting, value) {
                        if (!callbacks[setting]) return;
                        callbacks[setting].call(states[setting], value);
                        states[setting] = value;
                    },
                    get: function(setting) {
                        return states[setting];
                    }
                };
            }(),
            clone: clone
        });
        function UID() {
            var id = GUID++;
            if (id in entities) {
                return UID();
            }
            return id;
        }
        function clone(obj) {
            if (obj === null || typeof obj != "object") return obj;
            var temp = obj.constructor();
            for (var key in obj) temp[key] = clone(obj[key]);
            return temp;
        }
        if (typeof define === "function") {
            define("crafty", [], function() {
                return Crafty;
            });
        }
        module.exports = Crafty;
        window.Crafty = Crafty;
    }, {
        "./version": 28
    } ],
    10: [ function(require, module, exports) {
        var Crafty = require("./core.js"), document = window.document;
        Crafty.extend({
            device: {
                _deviceOrientationCallback: false,
                _deviceMotionCallback: false,
                _normalizeDeviceOrientation: function(eventData) {
                    var data;
                    if (window.DeviceOrientationEvent) {
                        data = {
                            tiltLR: eventData.gamma,
                            tiltFB: eventData.beta,
                            dir: eventData.alpha,
                            motUD: null
                        };
                    } else if (window.OrientationEvent) {
                        data = {
                            tiltLR: eventData.x * 90,
                            tiltFB: eventData.y * -90,
                            dir: null,
                            motUD: eventData.z
                        };
                    }
                    Crafty.device._deviceOrientationCallback(data);
                },
                _normalizeDeviceMotion: function(eventData) {
                    var acceleration = eventData.accelerationIncludingGravity, facingUp = acceleration.z > 0 ? +1 : -1;
                    var data = {
                        acceleration: acceleration,
                        rawAcceleration: "[" + Math.round(acceleration.x) + ", " + Math.round(acceleration.y) + ", " + Math.round(acceleration.z) + "]",
                        facingUp: facingUp,
                        tiltLR: Math.round(acceleration.x / 9.81 * -90),
                        tiltFB: Math.round((acceleration.y + 9.81) / 9.81 * 90 * facingUp)
                    };
                    Crafty.device._deviceMotionCallback(data);
                },
                deviceOrientation: function(func) {
                    this._deviceOrientationCallback = func;
                    if (Crafty.support.deviceorientation) {
                        if (window.DeviceOrientationEvent) {
                            Crafty.addEvent(this, window, "deviceorientation", this._normalizeDeviceOrientation);
                        } else if (window.OrientationEvent) {
                            Crafty.addEvent(this, window, "MozOrientation", this._normalizeDeviceOrientation);
                        }
                    }
                },
                deviceMotion: function(func) {
                    this._deviceMotionCallback = func;
                    if (Crafty.support.devicemotion) {
                        if (window.DeviceMotionEvent) {
                            Crafty.addEvent(this, window, "devicemotion", this._normalizeDeviceMotion);
                        }
                    }
                }
            }
        });
    }, {
        "./core.js": 9
    } ],
    11: [ function(require, module, exports) {
        var Crafty = require("./core.js"), document = window.document;
        Crafty.extend({
            diamondIso: {
                _tile: {
                    width: 0,
                    height: 0,
                    r: 0
                },
                _map: {
                    width: 0,
                    height: 0,
                    x: 0,
                    y: 0
                },
                _origin: {
                    x: 0,
                    y: 0
                },
                init: function(tw, th, mw, mh) {
                    this._tile.width = parseInt(tw, 10);
                    this._tile.height = parseInt(th, 10) || parseInt(tw, 10) / 2;
                    this._tile.r = this._tile.width / this._tile.height;
                    this._map.width = parseInt(mw, 10);
                    this._map.height = parseInt(mh, 10) || parseInt(mw, 10);
                    this._origin.x = this._map.height * this._tile.width / 2;
                    return this;
                },
                place: function(obj, x, y, layer) {
                    var pos = this.pos2px(x, y);
                    if (!layer) layer = 1;
                    var marginX = 0, marginY = 0;
                    if (obj.__margin !== undefined) {
                        marginX = obj.__margin[0];
                        marginY = obj.__margin[1];
                    }
                    obj.x = pos.left + marginX;
                    obj.y = pos.top + marginY - obj.h;
                    obj.z = pos.top * layer;
                },
                centerAt: function(x, y) {
                    var pos = this.pos2px(x, y);
                    Crafty.viewport.x = -pos.left + Crafty.viewport.width / 2 - this._tile.width;
                    Crafty.viewport.y = -pos.top + Crafty.viewport.height / 2;
                },
                area: function(offset) {
                    if (!offset) offset = 0;
                    var vp = Crafty.viewport.rect(), x = vp._x, y = vp._y, w = vp._w, h = vp._h;
                    var ow = offset * this._tile.width;
                    var oh = offset * this._tile.height;
                    x -= this._tile.width / 2 + ow;
                    y -= this._tile.height / 2 + oh;
                    w += this._tile.width / 2 + ow;
                    h += this._tile.height / 2 + oh;
                    var grid = [];
                    for (yl = y + h; y < yl; y += this._tile.height / 2) {
                        for (xl = x + w; x < xl; x += this._tile.width / 2) {
                            var row = this.px2pos(x, y);
                            grid.push([ ~~row.x, ~~row.y ]);
                        }
                    }
                    return grid;
                },
                pos2px: function(x, y) {
                    return {
                        left: (x - y) * this._tile.width / 2 + this._origin.x,
                        top: (x + y) * this._tile.height / 2
                    };
                },
                px2pos: function(left, top) {
                    var x = (left - this._origin.x) / this._tile.r;
                    return {
                        x: (top + x) / this._tile.height,
                        y: (top - x) / this._tile.height
                    };
                },
                polygon: function(obj) {
                    obj.requires("Collision");
                    var marginX = 0, marginY = 0;
                    if (obj.__margin !== undefined) {
                        marginX = obj.__margin[0];
                        marginY = obj.__margin[1];
                    }
                    var points = [ [ marginX - 0, obj.h - marginY - this._tile.height / 2 ], [ marginX - this._tile.width / 2, obj.h - marginY - 0 ], [ marginX - this._tile.width, obj.h - marginY - this._tile.height / 2 ], [ marginX - this._tile.width / 2, obj.h - marginY - this._tile.height ] ];
                    var poly = new Crafty.polygon(points);
                    return poly;
                }
            }
        });
    }, {
        "./core.js": 9
    } ],
    12: [ function(require, module, exports) {
        var Crafty = require("./core.js"), document = window.document;
        Crafty.c("Color", {
            _color: "",
            ready: true,
            init: function() {
                this.bind("Draw", function(e) {
                    if (e.type === "DOM") {
                        e.style.backgroundColor = this._color;
                        e.style.lineHeight = 0;
                    } else if (e.type === "canvas") {
                        if (this._color) e.ctx.fillStyle = this._color;
                        e.ctx.fillRect(e.pos._x, e.pos._y, e.pos._w, e.pos._h);
                    }
                });
            },
            color: function(color) {
                if (!color) return this._color;
                this._color = color;
                this.trigger("Invalidate");
                return this;
            }
        });
        Crafty.c("Tint", {
            _color: null,
            _strength: 1,
            init: function() {
                var draw = function d(e) {
                    var context = e.ctx || Crafty.canvas.context;
                    context.fillStyle = this._color || "rgba(0,0,0, 0)";
                    context.fillRect(e.pos._x, e.pos._y, e.pos._w, e.pos._h);
                };
                this.bind("Draw", draw).bind("RemoveComponent", function(id) {
                    if (id === "Tint") this.unbind("Draw", draw);
                });
            },
            tint: function(color, strength) {
                this._strength = strength;
                this._color = Crafty.toRGB(color, this._strength);
                this.trigger("Invalidate");
                return this;
            }
        });
        Crafty.c("Image", {
            _repeat: "repeat",
            ready: false,
            init: function() {
                var draw = function(e) {
                    if (e.type === "canvas") {
                        if (!this.ready || !this._pattern) return;
                        var context = e.ctx;
                        context.fillStyle = this._pattern;
                        context.save();
                        context.translate(e.pos._x, e.pos._y);
                        context.fillRect(0, 0, this._w, this._h);
                        context.restore();
                    } else if (e.type === "DOM") {
                        if (this.__image) {
                            e.style.backgroundImage = "url(" + this.__image + ")";
                            e.style.backgroundRepeat = this._repeat;
                        }
                    }
                };
                this.bind("Draw", draw).bind("RemoveComponent", function(id) {
                    if (id === "Image") this.unbind("Draw", draw);
                });
            },
            image: function(url, repeat) {
                this.__image = url;
                this._repeat = repeat || "no-repeat";
                this.img = Crafty.asset(url);
                if (!this.img) {
                    this.img = new Image();
                    Crafty.asset(url, this.img);
                    this.img.src = url;
                    var self = this;
                    this.img.onload = function() {
                        if (self.has("Canvas")) self._pattern = Crafty.canvas.context.createPattern(self.img, self._repeat);
                        self.ready = true;
                        if (self._repeat === "no-repeat") {
                            self.w = self.img.width;
                            self.h = self.img.height;
                        }
                        self.trigger("Invalidate");
                    };
                    return this;
                } else {
                    this.ready = true;
                    if (this.has("Canvas")) this._pattern = Crafty.canvas.context.createPattern(this.img, this._repeat);
                    if (this._repeat === "no-repeat") {
                        this.w = this.img.width;
                        this.h = this.img.height;
                    }
                }
                this.trigger("Invalidate");
                return this;
            }
        });
        Crafty.extend({
            toRGB: function(hex, alpha) {
                hex = hex.charAt(0) === "#" ? hex.substr(1) : hex;
                var c = [], result;
                c[0] = parseInt(hex.substr(0, 2), 16);
                c[1] = parseInt(hex.substr(2, 2), 16);
                c[2] = parseInt(hex.substr(4, 2), 16);
                result = alpha === undefined ? "rgb(" + c.join(",") + ")" : "rgba(" + c.join(",") + "," + alpha + ")";
                return result;
            }
        });
        Crafty.DrawManager = function() {
            function zsort(a, b) {
                return a._globalZ - b._globalZ;
            }
            var dirty_rects = [], changed_objs = [], dom = [], dirtyViewport = false, rectManager = {
                merge: function(a, b, target) {
                    if (typeof target === "undefined") target = {};
                    target._h = Math.max(a._y + a._h, b._y + b._h);
                    target._w = Math.max(a._x + a._w, b._x + b._w);
                    target._x = Math.min(a._x, b._x);
                    target._y = Math.min(a._y, b._y);
                    target._w -= target._x;
                    target._h -= target._y;
                    return target;
                },
                clean: function() {
                    var rect, obj, i;
                    for (i = 0, l = changed_objs.length; i < l; i++) {
                        obj = changed_objs[i];
                        rect = obj._mbr || obj;
                        if (typeof obj.staleRect === "undefined") obj.staleRect = {};
                        obj.staleRect._x = rect._x;
                        obj.staleRect._y = rect._y;
                        obj.staleRect._w = rect._w;
                        obj.staleRect._h = rect._h;
                        obj._changed = false;
                    }
                    changed_objs.length = 0;
                    dirty_rects.length = 0;
                },
                createDirty: function(obj) {
                    var rect = obj._mbr || obj;
                    if (obj.staleRect) {
                        if (rectManager.overlap(obj.staleRect, rect)) {
                            rectManager.merge(obj.staleRect, rect, obj.staleRect);
                            dirty_rects.push(obj.staleRect);
                            return;
                        } else {
                            dirty_rects.push(obj.staleRect);
                        }
                    }
                    obj.currentRect._x = rect._x;
                    obj.currentRect._y = rect._y;
                    obj.currentRect._w = rect._w;
                    obj.currentRect._h = rect._h;
                    dirty_rects.push(obj.currentRect);
                },
                overlap: function(a, b) {
                    return a._x < b._x + b._w && a._y < b._y + b._h && a._x + a._w > b._x && a._y + a._h > b._y;
                }
            };
            Crafty.bind("InvalidateViewport", function() {
                dirtyViewport = true;
            });
            Crafty.bind("PostRender", function() {
                dirtyViewport = false;
            });
            return {
                total2D: Crafty("2D").length,
                onScreen: function(rect) {
                    return Crafty.viewport._x + rect._x + rect._w > 0 && Crafty.viewport._y + rect._y + rect._h > 0 && Crafty.viewport._x + rect._x < Crafty.viewport.width && Crafty.viewport._y + rect._y < Crafty.viewport.height;
                },
                mergeSet: function(set) {
                    var i = 0;
                    while (i < set.length - 1) {
                        if (rectManager.overlap(set[i], set[i + 1])) {
                            rectManager.merge(set[i], set[i + 1], set[i]);
                            set.splice(i + 1, 1);
                            if (i > 0) i--;
                        } else i++;
                    }
                    return set;
                },
                addCanvas: function addCanvas(ent) {
                    changed_objs.push(ent);
                },
                addDom: function addDom(ent) {
                    dom.push(ent);
                },
                debug: function() {
                    console.log(changed_objs, dom);
                },
                drawAll: function(rect) {
                    rect = rect || Crafty.viewport.rect();
                    var q = Crafty.map.search(rect), i = 0, l = q.length, ctx = Crafty.canvas.context, current;
                    ctx.clearRect(rect._x, rect._y, rect._w, rect._h);
                    q.sort(zsort);
                    for (;i < l; i++) {
                        current = q[i];
                        if (current._visible && current.__c.Canvas) {
                            current.draw();
                            current._changed = false;
                        }
                    }
                },
                boundingRect: function(set) {
                    if (!set || !set.length) return;
                    var newset = [], i = 1, l = set.length, current, master = set[0], tmp;
                    master = [ master._x, master._y, master._x + master._w, master._y + master._h ];
                    while (i < l) {
                        current = set[i];
                        tmp = [ current._x, current._y, current._x + current._w, current._y + current._h ];
                        if (tmp[0] < master[0]) master[0] = tmp[0];
                        if (tmp[1] < master[1]) master[1] = tmp[1];
                        if (tmp[2] > master[2]) master[2] = tmp[2];
                        if (tmp[3] > master[3]) master[3] = tmp[3];
                        i++;
                    }
                    tmp = master;
                    master = {
                        _x: tmp[0],
                        _y: tmp[1],
                        _w: tmp[2] - tmp[0],
                        _h: tmp[3] - tmp[1]
                    };
                    return master;
                },
                renderCanvas: function() {
                    var l = changed_objs.length;
                    if (!l && !dirtyViewport) {
                        return;
                    }
                    var i = 0, rect, q, j, len, obj, ent, ctx = Crafty.canvas.context, DM = Crafty.DrawManager;
                    if (dirtyViewport) {
                        var view = Crafty.viewport;
                        ctx.setTransform(view._scale, 0, 0, view._scale, view._x * view._scale, view._y * view._scale);
                    }
                    if (l / DM.total2D > .6 || dirtyViewport) {
                        DM.drawAll();
                        rectManager.clean();
                        return;
                    }
                    for (i = 0; i < l; i++) {
                        rectManager.createDirty(changed_objs[i]);
                    }
                    dirty_rects = DM.mergeSet(dirty_rects);
                    l = dirty_rects.length;
                    var dupes = [], objs = [];
                    for (i = 0; i < l; ++i) {
                        rect = dirty_rects[i];
                        dupes.length = 0;
                        objs.length = 0;
                        if (!rect) continue;
                        rect._w = rect._x + rect._w;
                        rect._h = rect._y + rect._h;
                        rect._x = rect._x > 0 ? rect._x | 0 : (rect._x | 0) - 1;
                        rect._y = rect._y > 0 ? rect._y | 0 : (rect._y | 0) - 1;
                        rect._w -= rect._x;
                        rect._h -= rect._y;
                        rect._w = rect._w === (rect._w | 0) ? rect._w : (rect._w | 0) + 1;
                        rect._h = rect._h === (rect._h | 0) ? rect._h : (rect._h | 0) + 1;
                        q = Crafty.map.search(rect, false);
                        ctx.clearRect(rect._x, rect._y, rect._w, rect._h);
                        ctx.save();
                        ctx.beginPath();
                        ctx.rect(rect._x, rect._y, rect._w, rect._h);
                        ctx.clip();
                        for (j = 0, len = q.length; j < len; ++j) {
                            obj = q[j];
                            if (dupes[obj[0]] || !obj._visible || !obj.__c.Canvas) continue;
                            dupes[obj[0]] = true;
                            objs.push(obj);
                        }
                        objs.sort(zsort);
                        for (j = 0, len = objs.length; j < len; ++j) {
                            obj = objs[j];
                            var area = obj._mbr || obj;
                            if (rectManager.overlap(area, rect)) obj.draw();
                            obj._changed = false;
                        }
                        ctx.closePath();
                        ctx.restore();
                    }
                    if (Crafty.DrawManager.debugDirty === true) {
                        ctx.strokeStyle = "red";
                        for (i = 0, l = dirty_rects.length; i < l; ++i) {
                            rect = dirty_rects[i];
                            ctx.strokeRect(rect._x, rect._y, rect._w, rect._h);
                        }
                    }
                    rectManager.clean();
                },
                renderDOM: function() {
                    if (dirtyViewport) {
                        var style = Crafty.stage.inner.style, view = Crafty.viewport;
                        style.transform = style[Crafty.support.prefix + "Transform"] = "scale(" + view._scale + ", " + view._scale + ")";
                        style.left = view.x * view._scale + "px";
                        style.top = view.y * view._scale + "px";
                        style.zIndex = 10;
                    }
                    if (!dom.length) return;
                    var i = 0, k = dom.length;
                    for (;i < k; ++i) {
                        dom[i].draw()._changed = false;
                    }
                    dom.length = 0;
                }
            };
        }();
        Crafty.extend({
            pixelart: function(enabled) {
                var context = Crafty.canvas.context;
                if (context) {
                    context.imageSmoothingEnabled = !enabled;
                    context.mozImageSmoothingEnabled = !enabled;
                    context.webkitImageSmoothingEnabled = !enabled;
                    context.oImageSmoothingEnabled = !enabled;
                    context.msImageSmoothingEnabled = !enabled;
                }
                var style = Crafty.stage.inner.style;
                if (enabled) {
                    style[Crafty.DOM.camelize("image-rendering")] = "optimizeSpeed";
                    style[Crafty.DOM.camelize("image-rendering")] = "-moz-crisp-edges";
                    style[Crafty.DOM.camelize("image-rendering")] = "-o-crisp-edges";
                    style[Crafty.DOM.camelize("image-rendering")] = "-webkit-optimize-contrast";
                    style[Crafty.DOM.camelize("-ms-interpolation-mode")] = "nearest-neighbor";
                    style[Crafty.DOM.camelize("image-rendering")] = "optimize-contrast";
                    style[Crafty.DOM.camelize("image-rendering")] = "pixelated";
                    style[Crafty.DOM.camelize("image-rendering")] = "crisp-edges";
                } else {
                    style[Crafty.DOM.camelize("image-rendering")] = "optimizeQuality";
                    style[Crafty.DOM.camelize("-ms-interpolation-mode")] = "bicubic";
                    style[Crafty.DOM.camelize("image-rendering")] = "auto";
                }
            }
        });
    }, {
        "./core.js": 9
    } ],
    13: [ function(require, module, exports) {
        var Crafty = require("./core.js"), document = window.document;
        (function testSupport() {
            var support = Crafty.support = {}, ua = navigator.userAgent.toLowerCase(), match = /(webkit)[ \/]([\w.]+)/.exec(ua) || /(o)pera(?:.*version)?[ \/]([\w.]+)/.exec(ua) || /(ms)ie ([\w.]+)/.exec(ua) || /(moz)illa(?:.*? rv:([\w.]+))?/.exec(ua) || [], mobile = /iPad|iPod|iPhone|Android|webOS|IEMobile/i.exec(ua);
            if (mobile) Crafty.mobile = mobile[0];
            support.setter = "__defineSetter__" in this && "__defineGetter__" in this;
            support.defineProperty = function() {
                if (!("defineProperty" in Object)) return false;
                try {
                    Object.defineProperty({}, "x", {});
                } catch (e) {
                    return false;
                }
                return true;
            }();
            support.audio = "Audio" in window;
            support.prefix = match[1] || match[0];
            if (support.prefix === "moz") support.prefix = "Moz";
            if (support.prefix === "o") support.prefix = "O";
            if (match[2]) {
                support.versionName = match[2];
                support.version = +match[2].split(".")[0];
            }
            support.canvas = "getContext" in document.createElement("canvas");
            if (support.canvas) {
                var gl;
                try {
                    gl = document.createElement("canvas").getContext("experimental-webgl");
                    gl.viewportWidth = support.canvas.width;
                    gl.viewportHeight = support.canvas.height;
                } catch (e) {}
                support.webgl = !!gl;
            } else {
                support.webgl = false;
            }
            support.css3dtransform = typeof document.createElement("div").style.Perspective !== "undefined" || typeof document.createElement("div").style[support.prefix + "Perspective"] !== "undefined";
            support.deviceorientation = typeof window.DeviceOrientationEvent !== "undefined" || typeof window.OrientationEvent !== "undefined";
            support.devicemotion = typeof window.DeviceMotionEvent !== "undefined";
        })();
        Crafty.extend({
            _events: {},
            addEvent: function(ctx, obj, type, callback) {
                if (arguments.length === 3) {
                    callback = type;
                    type = obj;
                    obj = window.document;
                }
                var afn = function(e) {
                    e = e || window.event;
                    if (typeof callback === "function") {
                        callback.call(ctx, e);
                    }
                }, id = ctx[0] || "";
                if (!this._events[id + obj + type + callback]) this._events[id + obj + type + callback] = afn; else return;
                if (obj.attachEvent) {
                    obj.attachEvent("on" + type, afn);
                } else {
                    obj.addEventListener(type, afn, false);
                }
            },
            removeEvent: function(ctx, obj, type, callback) {
                if (arguments.length === 3) {
                    callback = type;
                    type = obj;
                    obj = window.document;
                }
                var id = ctx[0] || "", afn = this._events[id + obj + type + callback];
                if (afn) {
                    if (obj.detachEvent) {
                        obj.detachEvent("on" + type, afn);
                    } else obj.removeEventListener(type, afn, false);
                    delete this._events[id + obj + type + callback];
                }
            },
            background: function(style) {
                Crafty.stage.elem.style.background = style;
            }
        });
    }, {
        "./core.js": 9
    } ],
    14: [ function(require, module, exports) {
        var Crafty = require("./core.js"), document = window.document;
        Crafty.c("HTML", {
            inner: "",
            init: function() {
                this.requires("2D, DOM");
            },
            replace: function(new_html) {
                this.inner = new_html;
                this._element.innerHTML = new_html;
                return this;
            },
            append: function(new_html) {
                this.inner += new_html;
                this._element.innerHTML += new_html;
                return this;
            },
            prepend: function(new_html) {
                this.inner = new_html + this.inner;
                this._element.innerHTML = new_html + this.inner;
                return this;
            }
        });
    }, {
        "./core.js": 9
    } ],
    15: [ function(require, module, exports) {
        var Crafty = require("./core.js"), document = window.document;
        Crafty["import"] = function(obj, scene) {
            if (typeof obj === "string") {
                if (levelData) {
                    if (scene) Crafty.import(levelData[scene]); else Crafty.import(levelData);
                } else {
                    var elem;
                    elem = document.createElement("script");
                    elem.onload = function() {
                        if (scene) Crafty.import(levelData[scene]); else Crafty.import(levelData);
                    };
                    elem.src = obj;
                }
                return;
            }
            var key, i = 0, l, current, ent;
            if (obj.n && typeof obj.n === "object") {
                for (l = obj.n.length; i < l; ++i) {
                    current = obj.n[i];
                    ent = Crafty.e(current.c);
                    delete current.c;
                    ent.attr(current);
                }
            }
            for (key in obj) {
                ent = Crafty(key);
                ent.attr(obj[key]);
            }
        };
    }, {
        "./core.js": 9
    } ],
    16: [ function(require, module, exports) {
        var Crafty = require("./core.js"), document = window.document;
        Crafty.extend({
            isometric: {
                _tile: {
                    width: 0,
                    height: 0
                },
                _elements: {},
                _pos: {
                    x: 0,
                    y: 0
                },
                _z: 0,
                size: function(width, height) {
                    this._tile.width = width;
                    this._tile.height = height > 0 ? height : width / 2;
                    return this;
                },
                place: function(x, y, z, obj) {
                    var pos = this.pos2px(x, y);
                    pos.top -= z * (this._tile.height / 2);
                    obj.attr({
                        x: pos.left + Crafty.viewport._x,
                        y: pos.top + Crafty.viewport._y
                    }).z += z;
                    return this;
                },
                pos2px: function(x, y) {
                    return {
                        left: x * this._tile.width + (y & 1) * (this._tile.width / 2),
                        top: y * this._tile.height / 2
                    };
                },
                px2pos: function(left, top) {
                    return {
                        x: -Math.ceil(-left / this._tile.width - (top & 1) * .5),
                        y: top / this._tile.height * 2
                    };
                },
                centerAt: function(x, y) {
                    if (typeof x == "number" && typeof y == "number") {
                        var center = this.pos2px(x, y);
                        Crafty.viewport._x = -center.left + Crafty.viewport.width / 2 - this._tile.width / 2;
                        Crafty.viewport._y = -center.top + Crafty.viewport.height / 2 - this._tile.height / 2;
                        return this;
                    } else {
                        return {
                            top: -Crafty.viewport._y + Crafty.viewport.height / 2 - this._tile.height / 2,
                            left: -Crafty.viewport._x + Crafty.viewport.width / 2 - this._tile.width / 2
                        };
                    }
                },
                area: function() {
                    var center = this.centerAt();
                    var start = this.px2pos(-center.left + Crafty.viewport.width / 2, -center.top + Crafty.viewport.height / 2);
                    var end = this.px2pos(-center.left - Crafty.viewport.width / 2, -center.top - Crafty.viewport.height / 2);
                    return {
                        x: {
                            start: start.x,
                            end: end.x
                        },
                        y: {
                            start: start.y,
                            end: end.y
                        }
                    };
                }
            }
        });
    }, {
        "./core.js": 9
    } ],
    17: [ function(require, module, exports) {
        var Crafty = require("./core.js"), document = window.document;
        Crafty.extend({
            keys: {
                BACKSPACE: 8,
                TAB: 9,
                ENTER: 13,
                PAUSE: 19,
                CAPS: 20,
                ESC: 27,
                SPACE: 32,
                PAGE_UP: 33,
                PAGE_DOWN: 34,
                END: 35,
                HOME: 36,
                LEFT_ARROW: 37,
                UP_ARROW: 38,
                RIGHT_ARROW: 39,
                DOWN_ARROW: 40,
                INSERT: 45,
                DELETE: 46,
                "0": 48,
                "1": 49,
                "2": 50,
                "3": 51,
                "4": 52,
                "5": 53,
                "6": 54,
                "7": 55,
                "8": 56,
                "9": 57,
                A: 65,
                B: 66,
                C: 67,
                D: 68,
                E: 69,
                F: 70,
                G: 71,
                H: 72,
                I: 73,
                J: 74,
                K: 75,
                L: 76,
                M: 77,
                N: 78,
                O: 79,
                P: 80,
                Q: 81,
                R: 82,
                S: 83,
                T: 84,
                U: 85,
                V: 86,
                W: 87,
                X: 88,
                Y: 89,
                Z: 90,
                NUMPAD_0: 96,
                NUMPAD_1: 97,
                NUMPAD_2: 98,
                NUMPAD_3: 99,
                NUMPAD_4: 100,
                NUMPAD_5: 101,
                NUMPAD_6: 102,
                NUMPAD_7: 103,
                NUMPAD_8: 104,
                NUMPAD_9: 105,
                MULTIPLY: 106,
                ADD: 107,
                SUBSTRACT: 109,
                DECIMAL: 110,
                DIVIDE: 111,
                F1: 112,
                F2: 113,
                F3: 114,
                F4: 115,
                F5: 116,
                F6: 117,
                F7: 118,
                F8: 119,
                F9: 120,
                F10: 121,
                F11: 122,
                F12: 123,
                SHIFT: 16,
                CTRL: 17,
                ALT: 18,
                PLUS: 187,
                COMMA: 188,
                MINUS: 189,
                PERIOD: 190,
                PULT_UP: 29460,
                PULT_DOWN: 29461,
                PULT_LEFT: 4,
                PULT_RIGHT: 5
            },
            mouseButtons: {
                LEFT: 0,
                MIDDLE: 1,
                RIGHT: 2
            }
        });
    }, {
        "./core.js": 9
    } ],
    18: [ function(require, module, exports) {
        var Crafty = require("./core.js"), document = window.document;
        Crafty.extend({
            assets: {},
            asset: function(key, value) {
                if (arguments.length === 1) {
                    return Crafty.assets[key];
                }
                if (!Crafty.assets[key]) {
                    Crafty.assets[key] = value;
                    this.trigger("NewAsset", {
                        key: key,
                        value: value
                    });
                    return value;
                }
            },
            image_whitelist: [ "jpg", "jpeg", "gif", "png", "svg" ],
            load: function(data, oncomplete, onprogress, onerror) {
                var i = 0, l = data.length, current, obj, total = l, j = 0, ext = "";
                function pro() {
                    var src = this.src;
                    if (this.removeEventListener) {
                        this.removeEventListener("canplaythrough", pro, false);
                    }
                    ++j;
                    if (onprogress) onprogress({
                        loaded: j,
                        total: total,
                        percent: j / total * 100,
                        src: src
                    });
                    if (j === total && oncomplete) oncomplete();
                }
                function err() {
                    var src = this.src;
                    if (onerror) onerror({
                        loaded: j,
                        total: total,
                        percent: j / total * 100,
                        src: src
                    });
                    j++;
                    if (j === total && oncomplete) oncomplete();
                }
                for (;i < l; ++i) {
                    current = data[i];
                    ext = current.substr(current.lastIndexOf(".") + 1, 3).toLowerCase();
                    obj = Crafty.asset(current) || null;
                    if (Crafty.audio.supports(ext)) {
                        if (!obj) {
                            var name = current.substr(current.lastIndexOf("/") + 1).toLowerCase();
                            obj = Crafty.audio.create(name, current).obj;
                        }
                        if (obj.addEventListener) {
                            obj.addEventListener("canplaythrough", pro, false);
                        }
                    } else if (Crafty.image_whitelist.indexOf(ext) >= 0) {
                        if (!obj) {
                            obj = new Image();
                            Crafty.asset(current, obj);
                        }
                        obj.onload = pro;
                        if (Crafty.support.prefix === "webkit") {
                            obj.src = "";
                        }
                        obj.src = current;
                    } else {
                        total--;
                        continue;
                    }
                    obj.onerror = err;
                }
                if (total === 0) oncomplete();
            },
            modules: function(modulesRepository, moduleMap, oncomplete) {
                if (arguments.length === 2 && typeof modulesRepository === "object") {
                    oncomplete = moduleMap;
                    moduleMap = modulesRepository;
                    modulesRepository = "http://cdn.craftycomponents.com";
                }
                var $script = function() {
                    var win = this, doc = document, head = doc.getElementsByTagName("head")[0], validBase = /^https?:\/\//, old = win.$script, list = {}, ids = {}, delay = {}, scriptpath, scripts = {}, s = "string", f = false, push = "push", domContentLoaded = "DOMContentLoaded", readyState = "readyState", addEventListener = "addEventListener", onreadystatechange = "onreadystatechange";
                    function every(ar, fn, i) {
                        for (i = 0, j = ar.length; i < j; ++i) if (!fn(ar[i])) return f;
                        return 1;
                    }
                    function each(ar, fn) {
                        every(ar, function(el) {
                            return !fn(el);
                        });
                    }
                    if (!doc[readyState] && doc[addEventListener]) {
                        doc[addEventListener](domContentLoaded, function fn() {
                            doc.removeEventListener(domContentLoaded, fn, f);
                            doc[readyState] = "complete";
                        }, f);
                        doc[readyState] = "loading";
                    }
                    function $script(paths, idOrDone, optDone) {
                        paths = paths[push] ? paths : [ paths ];
                        var idOrDoneIsDone = idOrDone && idOrDone.call, done = idOrDoneIsDone ? idOrDone : optDone, id = idOrDoneIsDone ? paths.join("") : idOrDone, queue = paths.length;
                        function loopFn(item) {
                            return item.call ? item() : list[item];
                        }
                        function callback() {
                            if (!--queue) {
                                list[id] = 1;
                                if (done) done();
                                for (var dset in delay) {
                                    if (every(dset.split("|"), loopFn) && !each(delay[dset], loopFn)) delay[dset] = [];
                                }
                            }
                        }
                        setTimeout(function() {
                            each(paths, function(path) {
                                if (scripts[path]) {
                                    if (id) ids[id] = 1;
                                    return scripts[path] == 2 && callback();
                                }
                                scripts[path] = 1;
                                if (id) ids[id] = 1;
                                create(!validBase.test(path) && scriptpath ? scriptpath + path + ".js" : path, callback);
                            });
                        }, 0);
                        return $script;
                    }
                    function create(path, fn) {
                        var el = doc.createElement("script"), loaded = f;
                        el.onload = el.onerror = el[onreadystatechange] = function() {
                            if (el[readyState] && !/^c|loade/.test(el[readyState]) || loaded) return;
                            el.onload = el[onreadystatechange] = null;
                            loaded = 1;
                            scripts[path] = 2;
                            fn();
                        };
                        el.async = 1;
                        el.src = path;
                        head.insertBefore(el, head.firstChild);
                    }
                    $script.get = create;
                    $script.order = function(scripts, id, done) {
                        (function callback(s) {
                            s = scripts.shift();
                            if (!scripts.length) $script(s, id, done); else $script(s, callback);
                        })();
                    };
                    $script.path = function(p) {
                        scriptpath = p;
                    };
                    $script.ready = function(deps, ready, req) {
                        deps = deps[push] ? deps : [ deps ];
                        var missing = [];
                        !each(deps, function(dep) {
                            list[dep] || missing[push](dep);
                        }) && every(deps, function(dep) {
                            return list[dep];
                        }) ? ready() : !function(key) {
                            delay[key] = delay[key] || [];
                            delay[key][push](ready);
                            req && req(missing);
                        }(deps.join("|"));
                        return $script;
                    };
                    $script.noConflict = function() {
                        win.$script = old;
                        return this;
                    };
                    return $script;
                }();
                var modules = [];
                var validBase = /^(https?|file):\/\//;
                for (var i in moduleMap) {
                    if (validBase.test(i)) modules.push(i); else modules.push(modulesRepository + "/" + i.toLowerCase() + "-" + moduleMap[i].toLowerCase() + ".js");
                }
                $script(modules, function() {
                    if (oncomplete) oncomplete();
                });
            }
        });
    }, {
        "./core.js": 9
    } ],
    19: [ function(require, module, exports) {
        var Crafty = require("./core.js"), document = window.document;
        Crafty.math = {
            abs: function(x) {
                return x < 0 ? -x : x;
            },
            amountOf: function(checkValue, minValue, maxValue) {
                if (minValue < maxValue) return (checkValue - minValue) / (maxValue - minValue); else return (checkValue - maxValue) / (minValue - maxValue);
            },
            clamp: function(value, min, max) {
                if (value > max) return max; else if (value < min) return min; else return value;
            },
            degToRad: function(angleInDeg) {
                return angleInDeg * Math.PI / 180;
            },
            distance: function(x1, y1, x2, y2) {
                var squaredDistance = Crafty.math.squaredDistance(x1, y1, x2, y2);
                return Math.sqrt(parseFloat(squaredDistance));
            },
            lerp: function(value1, value2, amount) {
                return value1 + (value2 - value1) * amount;
            },
            negate: function(percent) {
                if (Math.random() < percent) return -1; else return 1;
            },
            radToDeg: function(angleInRad) {
                return angleInRad * 180 / Math.PI;
            },
            randomElementOfArray: function(array) {
                return array[Math.floor(array.length * Math.random())];
            },
            randomInt: function(start, end) {
                return start + Math.floor((1 + end - start) * Math.random());
            },
            randomNumber: function(start, end) {
                return start + (end - start) * Math.random();
            },
            squaredDistance: function(x1, y1, x2, y2) {
                return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
            },
            withinRange: function(value, min, max) {
                return value >= min && value <= max;
            }
        };
        Crafty.math.Vector2D = function() {
            function Vector2D(x, y) {
                if (x instanceof Vector2D) {
                    this.x = x.x;
                    this.y = x.y;
                } else if (arguments.length === 2) {
                    this.x = x;
                    this.y = y;
                } else if (arguments.length > 0) throw "Unexpected number of arguments for Vector2D()";
            }
            Vector2D.prototype.x = 0;
            Vector2D.prototype.y = 0;
            Vector2D.prototype.add = function(vecRH) {
                this.x += vecRH.x;
                this.y += vecRH.y;
                return this;
            };
            Vector2D.prototype.angleBetween = function(vecRH) {
                return Math.atan2(this.x * vecRH.y - this.y * vecRH.x, this.x * vecRH.x + this.y * vecRH.y);
            };
            Vector2D.prototype.angleTo = function(vecRH) {
                return Math.atan2(vecRH.y - this.y, vecRH.x - this.x);
            };
            Vector2D.prototype.clone = function() {
                return new Vector2D(this);
            };
            Vector2D.prototype.distance = function(vecRH) {
                return Math.sqrt((vecRH.x - this.x) * (vecRH.x - this.x) + (vecRH.y - this.y) * (vecRH.y - this.y));
            };
            Vector2D.prototype.distanceSq = function(vecRH) {
                return (vecRH.x - this.x) * (vecRH.x - this.x) + (vecRH.y - this.y) * (vecRH.y - this.y);
            };
            Vector2D.prototype.divide = function(vecRH) {
                this.x /= vecRH.x;
                this.y /= vecRH.y;
                return this;
            };
            Vector2D.prototype.dotProduct = function(vecRH) {
                return this.x * vecRH.x + this.y * vecRH.y;
            };
            Vector2D.prototype.equals = function(vecRH) {
                return vecRH instanceof Vector2D && this.x == vecRH.x && this.y == vecRH.y;
            };
            Vector2D.prototype.getNormal = function(vecRH) {
                if (vecRH === undefined) return new Vector2D(-this.y, this.x);
                return new Vector2D(vecRH.y - this.y, this.x - vecRH.x).normalize();
            };
            Vector2D.prototype.isZero = function() {
                return this.x === 0 && this.y === 0;
            };
            Vector2D.prototype.magnitude = function() {
                return Math.sqrt(this.x * this.x + this.y * this.y);
            };
            Vector2D.prototype.magnitudeSq = function() {
                return this.x * this.x + this.y * this.y;
            };
            Vector2D.prototype.multiply = function(vecRH) {
                this.x *= vecRH.x;
                this.y *= vecRH.y;
                return this;
            };
            Vector2D.prototype.negate = function() {
                this.x = -this.x;
                this.y = -this.y;
                return this;
            };
            Vector2D.prototype.normalize = function() {
                var lng = Math.sqrt(this.x * this.x + this.y * this.y);
                if (lng === 0) {
                    this.x = 1;
                    this.y = 0;
                } else {
                    this.x /= lng;
                    this.y /= lng;
                }
                return this;
            };
            Vector2D.prototype.scale = function(scalarX, scalarY) {
                if (scalarY === undefined) scalarY = scalarX;
                this.x *= scalarX;
                this.y *= scalarY;
                return this;
            };
            Vector2D.prototype.scaleToMagnitude = function(mag) {
                var k = mag / this.magnitude();
                this.x *= k;
                this.y *= k;
                return this;
            };
            Vector2D.prototype.setValues = function(x, y) {
                if (x instanceof Vector2D) {
                    this.x = x.x;
                    this.y = x.y;
                } else {
                    this.x = x;
                    this.y = y;
                }
                return this;
            };
            Vector2D.prototype.subtract = function(vecRH) {
                this.x -= vecRH.x;
                this.y -= vecRH.y;
                return this;
            };
            Vector2D.prototype.toString = function() {
                return "Vector2D(" + this.x + ", " + this.y + ")";
            };
            Vector2D.prototype.translate = function(dx, dy) {
                if (dy === undefined) dy = dx;
                this.x += dx;
                this.y += dy;
                return this;
            };
            Vector2D.tripleProduct = function(a, b, c) {
                var ac = a.dotProduct(c);
                var bc = b.dotProduct(c);
                return new Crafty.math.Vector2D(b.x * ac - a.x * bc, b.y * ac - a.y * bc);
            };
            return Vector2D;
        }();
        Crafty.math.Matrix2D = function() {
            Matrix2D = function(a, b, c, d, e, f) {
                if (a instanceof Matrix2D) {
                    this.a = a.a;
                    this.b = a.b;
                    this.c = a.c;
                    this.d = a.d;
                    this.e = a.e;
                    this.f = a.f;
                } else if (arguments.length === 6) {
                    this.a = a;
                    this.b = b;
                    this.c = c;
                    this.d = d;
                    this.e = e;
                    this.f = f;
                } else if (arguments.length > 0) throw "Unexpected number of arguments for Matrix2D()";
            };
            Matrix2D.prototype.a = 1;
            Matrix2D.prototype.b = 0;
            Matrix2D.prototype.c = 0;
            Matrix2D.prototype.d = 1;
            Matrix2D.prototype.e = 0;
            Matrix2D.prototype.f = 0;
            Matrix2D.prototype.apply = function(vecRH) {
                var tmpX = vecRH.x;
                vecRH.x = tmpX * this.a + vecRH.y * this.c + this.e;
                vecRH.y = tmpX * this.b + vecRH.y * this.d + this.f;
                return vecRH;
            };
            Matrix2D.prototype.clone = function() {
                return new Matrix2D(this);
            };
            Matrix2D.prototype.combine = function(mtrxRH) {
                var tmp = this.a;
                this.a = tmp * mtrxRH.a + this.b * mtrxRH.c;
                this.b = tmp * mtrxRH.b + this.b * mtrxRH.d;
                tmp = this.c;
                this.c = tmp * mtrxRH.a + this.d * mtrxRH.c;
                this.d = tmp * mtrxRH.b + this.d * mtrxRH.d;
                tmp = this.e;
                this.e = tmp * mtrxRH.a + this.f * mtrxRH.c + mtrxRH.e;
                this.f = tmp * mtrxRH.b + this.f * mtrxRH.d + mtrxRH.f;
                return this;
            };
            Matrix2D.prototype.equals = function(mtrxRH) {
                return mtrxRH instanceof Matrix2D && this.a == mtrxRH.a && this.b == mtrxRH.b && this.c == mtrxRH.c && this.d == mtrxRH.d && this.e == mtrxRH.e && this.f == mtrxRH.f;
            };
            Matrix2D.prototype.determinant = function() {
                return this.a * this.d - this.b * this.c;
            };
            Matrix2D.prototype.invert = function() {
                var det = this.determinant();
                if (det !== 0) {
                    var old = {
                        a: this.a,
                        b: this.b,
                        c: this.c,
                        d: this.d,
                        e: this.e,
                        f: this.f
                    };
                    this.a = old.d / det;
                    this.b = -old.b / det;
                    this.c = -old.c / det;
                    this.d = old.a / det;
                    this.e = (old.c * old.f - old.e * old.d) / det;
                    this.f = (old.e * old.b - old.a * old.f) / det;
                }
                return this;
            };
            Matrix2D.prototype.isIdentity = function() {
                return this.a === 1 && this.b === 0 && this.c === 0 && this.d === 1 && this.e === 0 && this.f === 0;
            };
            Matrix2D.prototype.isInvertible = function() {
                return this.determinant() !== 0;
            };
            Matrix2D.prototype.preRotate = function(rads) {
                var nCos = Math.cos(rads);
                var nSin = Math.sin(rads);
                var tmp = this.a;
                this.a = nCos * tmp - nSin * this.b;
                this.b = nSin * tmp + nCos * this.b;
                tmp = this.c;
                this.c = nCos * tmp - nSin * this.d;
                this.d = nSin * tmp + nCos * this.d;
                return this;
            };
            Matrix2D.prototype.preScale = function(scalarX, scalarY) {
                if (scalarY === undefined) scalarY = scalarX;
                this.a *= scalarX;
                this.b *= scalarY;
                this.c *= scalarX;
                this.d *= scalarY;
                return this;
            };
            Matrix2D.prototype.preTranslate = function(dx, dy) {
                if (typeof dx === "number") {
                    this.e += dx;
                    this.f += dy;
                } else {
                    this.e += dx.x;
                    this.f += dx.y;
                }
                return this;
            };
            Matrix2D.prototype.rotate = function(rads) {
                var nCos = Math.cos(rads);
                var nSin = Math.sin(rads);
                var tmp = this.a;
                this.a = nCos * tmp - nSin * this.b;
                this.b = nSin * tmp + nCos * this.b;
                tmp = this.c;
                this.c = nCos * tmp - nSin * this.d;
                this.d = nSin * tmp + nCos * this.d;
                tmp = this.e;
                this.e = nCos * tmp - nSin * this.f;
                this.f = nSin * tmp + nCos * this.f;
                return this;
            };
            Matrix2D.prototype.scale = function(scalarX, scalarY) {
                if (scalarY === undefined) scalarY = scalarX;
                this.a *= scalarX;
                this.b *= scalarY;
                this.c *= scalarX;
                this.d *= scalarY;
                this.e *= scalarX;
                this.f *= scalarY;
                return this;
            };
            Matrix2D.prototype.setValues = function(a, b, c, d, e, f) {
                if (a instanceof Matrix2D) {
                    this.a = a.a;
                    this.b = a.b;
                    this.c = a.c;
                    this.d = a.d;
                    this.e = a.e;
                    this.f = a.f;
                } else {
                    this.a = a;
                    this.b = b;
                    this.c = c;
                    this.d = d;
                    this.e = e;
                    this.f = f;
                }
                return this;
            };
            Matrix2D.prototype.toString = function() {
                return "Matrix2D([" + this.a + ", " + this.c + ", " + this.e + "] [" + this.b + ", " + this.d + ", " + this.f + "] [0, 0, 1])";
            };
            Matrix2D.prototype.translate = function(dx, dy) {
                if (typeof dx === "number") {
                    this.e += this.a * dx + this.c * dy;
                    this.f += this.b * dx + this.d * dy;
                } else {
                    this.e += this.a * dx.x + this.c * dx.y;
                    this.f += this.b * dx.x + this.d * dx.y;
                }
                return this;
            };
            return Matrix2D;
        }();
    }, {
        "./core.js": 9
    } ],
    20: [ function(require, module, exports) {
        var Crafty = require("./core.js"), document = window.document;
        Crafty.c("Particles", {
            init: function() {
                this._Particles = Crafty.clone(this._Particles);
                this._Particles.parentEntity = this;
            },
            particles: function(options) {
                if (!Crafty.support.canvas || Crafty.deactivateParticles) return this;
                var c, ctx, relativeX, relativeY, bounding;
                c = document.createElement("canvas");
                c.width = Crafty.viewport.width;
                c.height = Crafty.viewport.height;
                c.style.position = "absolute";
                c.style.left = "0px";
                c.style.top = "0px";
                Crafty.stage.elem.appendChild(c);
                ctx = c.getContext("2d");
                this._Particles.init(options);
                this.bind("Remove", function() {
                    Crafty.stage.elem.removeChild(c);
                }).bind("RemoveComponent", function(id) {
                    if (id === "particles") Crafty.stage.elem.removeChild(c);
                });
                relativeX = this.x + Crafty.viewport.x;
                relativeY = this.y + Crafty.viewport.y;
                this._Particles.position = this._Particles.vectorHelpers.create(relativeX, relativeY);
                var oldViewport = {
                    x: Crafty.viewport.x,
                    y: Crafty.viewport.y
                };
                this.bind("EnterFrame", function() {
                    relativeX = this.x + Crafty.viewport.x;
                    relativeY = this.y + Crafty.viewport.y;
                    this._Particles.viewportDelta = {
                        x: Crafty.viewport.x - oldViewport.x,
                        y: Crafty.viewport.y - oldViewport.y
                    };
                    oldViewport = {
                        x: Crafty.viewport.x,
                        y: Crafty.viewport.y
                    };
                    this._Particles.position = this._Particles.vectorHelpers.create(relativeX, relativeY);
                    if (typeof Crafty.DrawManager.boundingRect == "function") {
                        bounding = Crafty.DrawManager.boundingRect(this._Particles.register);
                        if (bounding) ctx.clearRect(bounding._x, bounding._y, bounding._w, bounding._h);
                    } else {
                        ctx.clearRect(0, 0, Crafty.viewport.width, Crafty.viewport.height);
                    }
                    this._Particles.update();
                    this._Particles.render(ctx);
                });
                return this;
            },
            _Particles: {
                presets: {
                    maxParticles: 150,
                    size: 18,
                    sizeRandom: 4,
                    speed: 1,
                    speedRandom: 1.2,
                    lifeSpan: 29,
                    lifeSpanRandom: 7,
                    angle: 65,
                    angleRandom: 34,
                    startColour: [ 255, 131, 0, 1 ],
                    startColourRandom: [ 48, 50, 45, 0 ],
                    endColour: [ 245, 35, 0, 0 ],
                    endColourRandom: [ 60, 60, 60, 0 ],
                    sharpness: 20,
                    sharpnessRandom: 10,
                    spread: 10,
                    duration: -1,
                    fastMode: false,
                    gravity: {
                        x: 0,
                        y: .1
                    },
                    jitter: 0,
                    particles: [],
                    active: true,
                    particleCount: 0,
                    elapsedFrames: 0,
                    emissionRate: 0,
                    emitCounter: 0,
                    particleIndex: 0
                },
                init: function(options) {
                    this.position = this.vectorHelpers.create(0, 0);
                    if (typeof options == "undefined") options = {};
                    for (var key in this.presets) {
                        if (typeof options[key] != "undefined") this[key] = options[key]; else this[key] = this.presets[key];
                    }
                    this.emissionRate = this.maxParticles / this.lifeSpan;
                    this.positionRandom = this.vectorHelpers.create(this.spread, this.spread);
                },
                addParticle: function() {
                    if (this.particleCount == this.maxParticles) {
                        return false;
                    }
                    var particle = new this.particle(this.vectorHelpers);
                    this.initParticle(particle);
                    this.particles[this.particleCount] = particle;
                    this.particleCount++;
                    return true;
                },
                RANDM1TO1: function() {
                    return Math.random() * 2 - 1;
                },
                initParticle: function(particle) {
                    particle.position.x = this.position.x + this.positionRandom.x * this.RANDM1TO1();
                    particle.position.y = this.position.y + this.positionRandom.y * this.RANDM1TO1();
                    var newAngle = (this.angle + this.angleRandom * this.RANDM1TO1()) * (Math.PI / 180);
                    var vector = this.vectorHelpers.create(Math.sin(newAngle), -Math.cos(newAngle));
                    var vectorSpeed = this.speed + this.speedRandom * this.RANDM1TO1();
                    particle.direction = this.vectorHelpers.multiply(vector, vectorSpeed);
                    particle.size = this.size + this.sizeRandom * this.RANDM1TO1();
                    particle.size = particle.size < 0 ? 0 : ~~particle.size;
                    particle.timeToLive = this.lifeSpan + this.lifeSpanRandom * this.RANDM1TO1();
                    particle.sharpness = this.sharpness + this.sharpnessRandom * this.RANDM1TO1();
                    particle.sharpness = particle.sharpness > 100 ? 100 : particle.sharpness < 0 ? 0 : particle.sharpness;
                    particle.sizeSmall = ~~(particle.size / 200 * particle.sharpness);
                    var start = [ this.startColour[0] + this.startColourRandom[0] * this.RANDM1TO1(), this.startColour[1] + this.startColourRandom[1] * this.RANDM1TO1(), this.startColour[2] + this.startColourRandom[2] * this.RANDM1TO1(), this.startColour[3] + this.startColourRandom[3] * this.RANDM1TO1() ];
                    var end = [ this.endColour[0] + this.endColourRandom[0] * this.RANDM1TO1(), this.endColour[1] + this.endColourRandom[1] * this.RANDM1TO1(), this.endColour[2] + this.endColourRandom[2] * this.RANDM1TO1(), this.endColour[3] + this.endColourRandom[3] * this.RANDM1TO1() ];
                    particle.colour = start;
                    particle.deltaColour[0] = (end[0] - start[0]) / particle.timeToLive;
                    particle.deltaColour[1] = (end[1] - start[1]) / particle.timeToLive;
                    particle.deltaColour[2] = (end[2] - start[2]) / particle.timeToLive;
                    particle.deltaColour[3] = (end[3] - start[3]) / particle.timeToLive;
                },
                update: function() {
                    if (this.active && this.emissionRate > 0) {
                        var rate = 1 / this.emissionRate;
                        this.emitCounter++;
                        while (this.particleCount < this.maxParticles && this.emitCounter > rate) {
                            this.addParticle();
                            this.emitCounter -= rate;
                        }
                        this.elapsedFrames++;
                        if (this.duration != -1 && this.duration < this.elapsedFrames) {
                            this.stop();
                        }
                    }
                    this.particleIndex = 0;
                    this.register = [];
                    var draw;
                    while (this.particleIndex < this.particleCount) {
                        var currentParticle = this.particles[this.particleIndex];
                        if (currentParticle.timeToLive > 0) {
                            currentParticle.direction = this.vectorHelpers.add(currentParticle.direction, this.gravity);
                            currentParticle.position = this.vectorHelpers.add(currentParticle.position, currentParticle.direction);
                            currentParticle.position = this.vectorHelpers.add(currentParticle.position, this.viewportDelta);
                            if (this.jitter) {
                                currentParticle.position.x += this.jitter * this.RANDM1TO1();
                                currentParticle.position.y += this.jitter * this.RANDM1TO1();
                            }
                            currentParticle.timeToLive--;
                            var r = currentParticle.colour[0] += currentParticle.deltaColour[0];
                            var g = currentParticle.colour[1] += currentParticle.deltaColour[1];
                            var b = currentParticle.colour[2] += currentParticle.deltaColour[2];
                            var a = currentParticle.colour[3] += currentParticle.deltaColour[3];
                            draw = [];
                            draw.push("rgba(" + (r > 255 ? 255 : r < 0 ? 0 : ~~r));
                            draw.push(g > 255 ? 255 : g < 0 ? 0 : ~~g);
                            draw.push(b > 255 ? 255 : b < 0 ? 0 : ~~b);
                            draw.push((a > 1 ? 1 : a < 0 ? 0 : a.toFixed(2)) + ")");
                            currentParticle.drawColour = draw.join(",");
                            if (!this.fastMode) {
                                draw[3] = "0)";
                                currentParticle.drawColourEnd = draw.join(",");
                            }
                            this.particleIndex++;
                        } else {
                            if (this.particleIndex != this.particleCount - 1) {
                                this.particles[this.particleIndex] = this.particles[this.particleCount - 1];
                            }
                            this.particleCount--;
                        }
                        var rect = {};
                        rect._x = ~~currentParticle.position.x;
                        rect._y = ~~currentParticle.position.y;
                        rect._w = currentParticle.size;
                        rect._h = currentParticle.size;
                        this.register.push(rect);
                    }
                },
                stop: function() {
                    this.active = false;
                    this.elapsedFrames = 0;
                    this.emitCounter = 0;
                    this.parentEntity.trigger("ParticleEnd");
                },
                render: function(context) {
                    for (var i = 0, j = this.particleCount; i < j; i++) {
                        var particle = this.particles[i];
                        var size = particle.size;
                        var halfSize = size >> 1;
                        if (particle.position.x + size < 0 || particle.position.y + size < 0 || particle.position.x - size > Crafty.viewport.width || particle.position.y - size > Crafty.viewport.height) {
                            continue;
                        }
                        var x = ~~particle.position.x;
                        var y = ~~particle.position.y;
                        if (this.fastMode) {
                            context.fillStyle = particle.drawColour;
                        } else {
                            var radgrad = context.createRadialGradient(x + halfSize, y + halfSize, particle.sizeSmall, x + halfSize, y + halfSize, halfSize);
                            radgrad.addColorStop(0, particle.drawColour);
                            radgrad.addColorStop(.9, particle.drawColourEnd);
                            context.fillStyle = radgrad;
                        }
                        context.fillRect(x, y, size, size);
                    }
                },
                particle: function(vectorHelpers) {
                    this.position = vectorHelpers.create(0, 0);
                    this.direction = vectorHelpers.create(0, 0);
                    this.size = 0;
                    this.sizeSmall = 0;
                    this.timeToLive = 0;
                    this.colour = [];
                    this.drawColour = "";
                    this.deltaColour = [];
                    this.sharpness = 0;
                },
                vectorHelpers: {
                    create: function(x, y) {
                        return {
                            x: x,
                            y: y
                        };
                    },
                    multiply: function(vector, scaleFactor) {
                        vector.x *= scaleFactor;
                        vector.y *= scaleFactor;
                        return vector;
                    },
                    add: function(vector1, vector2) {
                        vector1.x += vector2.x;
                        vector1.y += vector2.y;
                        return vector1;
                    }
                }
            }
        });
    }, {
        "./core.js": 9
    } ],
    21: [ function(require, module, exports) {
        var Crafty = require("./core.js"), document = window.document;
        Crafty.extend({
            _scenes: {},
            _current: null,
            scene: function(name, intro, outro) {
                if (arguments.length === 1 || typeof arguments[1] !== "function") {
                    Crafty.enterScene(name, arguments[1]);
                    return;
                }
                Crafty.defineScene(name, intro, outro);
            },
            defineScene: function(name, init, uninit) {
                if (typeof init !== "function") throw "Init function is the wrong type.";
                this._scenes[name] = {};
                this._scenes[name].initialize = init;
                if (typeof uninit !== "undefined") {
                    this._scenes[name].uninitialize = uninit;
                }
                return;
            },
            enterScene: function(name, data) {
                if (typeof data === "function") throw "Scene data cannot be a function";
                Crafty.trigger("SceneDestroy", {
                    newScene: name
                });
                Crafty.viewport.reset();
                Crafty("2D").each(function() {
                    if (!this.has("Persist")) this.destroy();
                });
                if (this._current !== null && "uninitialize" in this._scenes[this._current]) {
                    this._scenes[this._current].uninitialize.call(this);
                }
                var oldScene = this._current;
                this._current = name;
                Crafty.trigger("SceneChange", {
                    oldScene: oldScene,
                    newScene: name
                });
                this._scenes[name].initialize.call(this, data);
                return;
            }
        });
    }, {
        "./core.js": 9
    } ],
    22: [ function(require, module, exports) {
        var Crafty = require("./core.js"), document = window.document;
        Crafty.extend({
            audio: {
                sounds: {},
                supported: null,
                codecs: {
                    ogg: 'audio/ogg; codecs="vorbis"',
                    wav: 'audio/wav; codecs="1"',
                    webma: 'audio/webm; codecs="vorbis"',
                    mp3: 'audio/mpeg; codecs="mp3"',
                    m4a: 'audio/mp4; codecs="mp4a.40.2"'
                },
                volume: 1,
                muted: false,
                paused: false,
                playCheck: null,
                _canPlay: function() {
                    this.supported = {};
                    if (!Crafty.support.audio) return;
                    var audio = this.audioElement(), canplay;
                    for (var i in this.codecs) {
                        canplay = audio.canPlayType(this.codecs[i]);
                        if (canplay !== "" && canplay !== "no") {
                            this.supported[i] = true;
                        } else {
                            this.supported[i] = false;
                        }
                    }
                },
                supports: function(extension) {
                    if (this.supported === null) this._canPlay();
                    if (this.supported[extension]) return true; else return false;
                },
                audioElement: function() {
                    return typeof Audio !== "undefined" ? new Audio("") : document.createElement("audio");
                },
                create: function(id, path) {
                    var ext = path.substr(path.lastIndexOf(".") + 1).toLowerCase();
                    if (!this.supports(ext)) return false;
                    var audio = this.audioElement();
                    audio.id = id;
                    audio.preload = "auto";
                    audio.volume = Crafty.audio.volume;
                    audio.src = path;
                    Crafty.asset(path, audio);
                    this.sounds[id] = {
                        obj: audio,
                        played: 0,
                        volume: Crafty.audio.volume
                    };
                    return this.sounds[id];
                },
                add: function(id, url) {
                    if (!Crafty.support.audio) return;
                    var src;
                    if (arguments.length === 1 && typeof id === "object") {
                        for (var i in id) {
                            for (src in id[i]) {
                                if (Crafty.audio.create(i, id[i][src])) break;
                            }
                        }
                    }
                    if (typeof id === "string") {
                        if (typeof url === "string") {
                            Crafty.audio.create(id, url);
                        }
                        if (typeof url === "object") {
                            for (src in url) {
                                if (Crafty.audio.create(id, url[src])) break;
                            }
                        }
                    }
                },
                play: function(id, repeat, volume) {
                    if (repeat === 0 || !Crafty.support.audio || !this.sounds[id]) return;
                    var s = this.sounds[id];
                    var c = this.getOpenChannel();
                    if (!c) return null;
                    c.id = id;
                    c.repeat = repeat;
                    var a = c.obj;
                    c.volume = s.volume = s.obj.volume = volume || Crafty.audio.volume;
                    a.volume = s.volume;
                    a.src = s.obj.src;
                    if (this.muted) a.volume = 0;
                    a.play();
                    s.played++;
                    c.onEnd = function() {
                        if (s.played < c.repeat || repeat == -1) {
                            if (this.currentTime) this.currentTime = 0;
                            this.play();
                            s.played++;
                        } else {
                            c.active = false;
                            this.pause();
                            this.removeEventListener("ended", c.onEnd, true);
                            this.currentTime = 0;
                            Crafty.trigger("SoundComplete", {
                                id: c.id
                            });
                        }
                    };
                    a.addEventListener("ended", c.onEnd, true);
                    return a;
                },
                maxChannels: 7,
                setChannels: function(n) {
                    this.maxChannels = n;
                    if (n < this.channels.length) this.channels.length = n;
                },
                channels: [],
                getOpenChannel: function() {
                    for (var i = 0; i < this.channels.length; i++) {
                        var chan = this.channels[i];
                        if (chan.active === false || chan.obj.ended && chan.repeat <= this.sounds[chan.id].played) {
                            chan.active = true;
                            return chan;
                        }
                    }
                    if (i < this.maxChannels) {
                        var c = {
                            obj: this.audioElement(),
                            active: true,
                            _is: function(id) {
                                return this.id === id && this.active;
                            }
                        };
                        this.channels.push(c);
                        return c;
                    }
                    return null;
                },
                remove: function(id) {
                    if (!Crafty.support.audio) return;
                    var s;
                    if (!id) {
                        for (var i in this.sounds) {
                            s = this.sounds[i];
                            Crafty.audio.stop(id);
                            delete Crafty.assets[s.obj.src];
                            delete Crafty.audio.sounds[id];
                        }
                        return;
                    }
                    if (!this.sounds[id]) return;
                    s = this.sounds[id];
                    Crafty.audio.stop(id);
                    delete Crafty.assets[s.obj.src];
                    delete Crafty.audio.sounds[id];
                },
                stop: function(id) {
                    if (!Crafty.support.audio) return;
                    for (var i in this.channels) {
                        c = this.channels[i];
                        if (!id && c.active || c._is(id)) {
                            c.active = false;
                            c.obj.pause();
                        }
                    }
                    return;
                },
                _mute: function(mute) {
                    if (!Crafty.support.audio) return;
                    var c;
                    for (var i in this.channels) {
                        c = this.channels[i];
                        c.obj.volume = mute ? 0 : c.volume;
                    }
                    this.muted = mute;
                },
                toggleMute: function() {
                    if (!this.muted) {
                        this._mute(true);
                    } else {
                        this._mute(false);
                    }
                },
                mute: function() {
                    this._mute(true);
                },
                unmute: function() {
                    this._mute(false);
                },
                pause: function(id) {
                    if (!Crafty.support.audio || !id || !this.sounds[id]) return;
                    var c;
                    for (var i in this.channels) {
                        c = this.channels[i];
                        if (c._is(id) && !c.obj.paused) c.obj.pause();
                    }
                },
                unpause: function(id) {
                    if (!Crafty.support.audio || !id || !this.sounds[id]) return;
                    var c;
                    for (var i in this.channels) {
                        c = this.channels[i];
                        if (c._is(id) && c.obj.paused) c.obj.play();
                    }
                },
                togglePause: function(id) {
                    if (!Crafty.support.audio || !id || !this.sounds[id]) return;
                    var c;
                    for (var i in this.channels) {
                        c = this.channels[i];
                        if (c._is(id)) {
                            if (c.obj.paused) {
                                c.obj.play();
                            } else {
                                c.obj.pause();
                            }
                        }
                    }
                }
            }
        });
    }, {
        "./core.js": 9
    } ],
    23: [ function(require, module, exports) {
        var Crafty = require("./core.js"), Animation = require("./animation.js"), document = window.document;
        Crafty.c("SpriteAnimation", {
            _reels: null,
            _currentReelId: null,
            _currentReel: null,
            _isPlaying: false,
            animationSpeed: 1,
            init: function() {
                this._reels = {};
            },
            reel: function(reelId, duration, fromX, fromY, frameCount) {
                if (arguments.length === 0) return this._currentReelId;
                if (arguments.length === 1 && typeof reelId === "string") {
                    if (typeof this._reels[reelId] === "undefined") throw "The specified reel " + reelId + " is undefined.";
                    this.pauseAnimation();
                    if (this._currentReelId !== reelId) {
                        this._currentReelId = reelId;
                        this._currentReel = this._reels[reelId];
                        this._updateSprite();
                        this.trigger("ReelChange", this._currentReel);
                    }
                    return this;
                }
                var reel, i;
                reel = {
                    id: reelId,
                    frames: [],
                    currentFrame: 0,
                    easing: new Crafty.easing(duration),
                    defaultLoops: 1
                };
                reel.duration = reel.easing.duration;
                if (typeof fromX === "number") {
                    i = fromX;
                    y = fromY;
                    if (frameCount >= 0) {
                        for (;i < fromX + frameCount; i++) {
                            reel.frames.push([ i, y ]);
                        }
                    } else {
                        for (;i > fromX + frameCount; i--) {
                            reel.frames.push([ i, y ]);
                        }
                    }
                } else if (arguments.length === 3 && typeof fromX === "object") {
                    reel.frames = fromX;
                } else {
                    throw "Urecognized arguments. Please see the documentation for 'reel(...)'.";
                }
                this._reels[reelId] = reel;
                return this;
            },
            animate: function(reelId, loopCount) {
                var pos;
                if (typeof reelId === "string") this.reel(reelId);
                var currentReel = this._currentReel;
                if (typeof currentReel === "undefined" || currentReel === null) throw "No reel is specified, and there is no currently active reel.";
                this.pauseAnimation();
                if (typeof loopCount === "undefined") if (typeof reelId === "number") loopCount = reelId; else loopCount = 1;
                currentReel.easing.reset();
                this.loops(loopCount);
                this._setFrame(0);
                this.bind("EnterFrame", this._animationTick);
                this._isPlaying = true;
                this.trigger("StartAnimation", currentReel);
                return this;
            },
            resumeAnimation: function() {
                if (this._isPlaying === false && this._currentReel !== null) {
                    this.bind("EnterFrame", this._animationTick);
                    this._isPlaying = true;
                    this._currentReel.easing.resume();
                    this.trigger("StartAnimation", this._currentReel);
                }
                return this;
            },
            pauseAnimation: function() {
                if (this._isPlaying === true) {
                    this.unbind("EnterFrame", this._animationTick);
                    this._isPlaying = false;
                    this._reels[this._currentReelId].easing.pause();
                }
                return this;
            },
            resetAnimation: function() {
                var currentReel = this._currentReel;
                if (currentReel === null) throw "No active reel to reset.";
                this.reelPosition(0);
                currentReel.easing.repeat(currentReel.defaultLoops);
                return this;
            },
            loops: function(loopCount) {
                if (arguments.length === 0) {
                    if (this._currentReel !== null) return this._currentReel.easing.loops; else return 0;
                }
                if (this._currentReel !== null) {
                    if (loopCount < 0) loopCount = Infinity;
                    this._currentReel.easing.repeat(loopCount);
                    this._currentReel.defaultLoops = loopCount;
                }
                return this;
            },
            reelPosition: function(position) {
                if (this._currentReel === null) throw "No active reel.";
                if (arguments.length === 0) return this._currentReel.currentFrame;
                var progress, l = this._currentReel.frames.length;
                if (position === "end") position = l - 1;
                if (position < 1 && position > 0) {
                    progress = position;
                    position = Math.floor(l * progress);
                } else {
                    if (position !== Math.floor(position)) throw "Position " + position + " is invalid.";
                    if (position < 0) position = l - 1 + position;
                    progress = position / l;
                }
                position = Math.min(position, l - 1);
                position = Math.max(position, 0);
                this._setProgress(progress);
                this._setFrame(position);
                return this;
            },
            _animationTick: function(frameData) {
                var currentReel = this._reels[this._currentReelId];
                currentReel.easing.tick(frameData.dt * this.animationSpeed);
                var progress = currentReel.easing.value();
                var frameNumber = Math.min(Math.floor(currentReel.frames.length * progress), currentReel.frames.length - 1);
                this._setFrame(frameNumber);
                if (currentReel.easing.complete === true) {
                    this.trigger("AnimationEnd", this._currentReel);
                    this.pauseAnimation();
                }
            },
            _setFrame: function(frameNumber) {
                var currentReel = this._currentReel;
                if (frameNumber === currentReel.currentFrame) return;
                currentReel.currentFrame = frameNumber;
                this._updateSprite();
                this.trigger("FrameChange", currentReel);
            },
            _updateSprite: function() {
                var currentReel = this._currentReel;
                var pos = currentReel.frames[currentReel.currentFrame];
                this.sprite(pos[0], pos[1]);
            },
            _setProgress: function(progress, repeats) {
                this._currentReel.easing.setProgress(progress, repeats);
            },
            isPlaying: function(reelId) {
                if (!this._isPlaying) return false;
                if (!reelId) return !!this._currentReelId;
                return this._currentReelId === reelId;
            },
            getReel: function(reelId) {
                if (arguments.length === 0) {
                    if (!this._currentReelId) return null;
                    reelId = this._currentReelId;
                }
                return this._reels[reelId];
            }
        });
    }, {
        "./animation.js": 5,
        "./core.js": 9
    } ],
    24: [ function(require, module, exports) {
        var Crafty = require("./core.js"), document = window.document;
        Crafty.extend({
            sprite: function(tile, tileh, url, map, paddingX, paddingY, paddingAroundBorder) {
                var spriteName, temp, x, y, w, h, img;
                if (typeof tile === "string") {
                    paddingY = paddingX;
                    paddingX = map;
                    map = tileh;
                    url = tile;
                    tile = 1;
                    tileh = 1;
                }
                if (typeof tileh == "string") {
                    paddingY = paddingX;
                    paddingX = map;
                    map = url;
                    url = tileh;
                    tileh = tile;
                }
                if (!paddingY && paddingX) paddingY = paddingX;
                paddingX = parseInt(paddingX || 0, 10);
                paddingY = parseInt(paddingY || 0, 10);
                var markSpritesReady = function() {
                    this.ready = true;
                    this.trigger("Invalidate");
                };
                img = Crafty.asset(url);
                if (!img) {
                    img = new Image();
                    img.src = url;
                    Crafty.asset(url, img);
                    img.onload = function() {
                        for (var spriteName in map) {
                            Crafty(spriteName).each(markSpritesReady);
                        }
                    };
                }
                var sharedSpriteInit = function() {
                    this.requires("2D, Sprite");
                    this.__trim = [ 0, 0, 0, 0 ];
                    this.__image = url;
                    this.__coord = [ this.__coord[0], this.__coord[1], this.__coord[2], this.__coord[3] ];
                    this.__tile = tile;
                    this.__tileh = tileh;
                    this.__padding = [ paddingX, paddingY ];
                    this.__padBorder = paddingAroundBorder;
                    this.sprite(this.__coord[0], this.__coord[1], this.__coord[2], this.__coord[3]);
                    this.img = img;
                    if (this.img.complete && this.img.width > 0) {
                        this.ready = true;
                        this.trigger("Invalidate");
                    }
                    this.w = this.__coord[2];
                    this.h = this.__coord[3];
                };
                for (spriteName in map) {
                    if (!map.hasOwnProperty(spriteName)) continue;
                    temp = map[spriteName];
                    Crafty.c(spriteName, {
                        ready: false,
                        __coord: [ temp[0], temp[1], temp[2] || 1, temp[3] || 1 ],
                        init: sharedSpriteInit
                    });
                }
                return this;
            }
        });
        Crafty.c("Sprite", {
            __image: "",
            __tile: 0,
            __tileh: 0,
            __padding: null,
            __trim: null,
            img: null,
            ready: false,
            init: function() {
                this.__trim = [ 0, 0, 0, 0 ];
                var draw = function(e) {
                    var co = e.co, pos = e.pos, context = e.ctx;
                    if (e.type === "canvas") {
                        context.drawImage(this.img, co.x, co.y, co.w, co.h, pos._x, pos._y, pos._w, pos._h);
                    } else if (e.type === "DOM") {
                        var vscale = this._h / co.h, hscale = this._w / co.w, style = this._element.style;
                        style.background = style.backgroundColor + " url('" + this.__image + "') no-repeat";
                        style.backgroundPosition = "-" + co.x * hscale + "px -" + co.y * vscale + "px";
                        if (vscale != 1 || hscale != 1) {
                            style.backgroundSize = this.img.width * hscale + "px" + " " + this.img.height * vscale + "px";
                        }
                    }
                };
                this.bind("Draw", draw).bind("RemoveComponent", function(id) {
                    if (id === "Sprite") this.unbind("Draw", draw);
                });
            },
            sprite: function(x, y, w, h) {
                this.__coord = this.__coord || [ 0, 0, 0, 0 ];
                this.__coord[0] = x * (this.__tile + this.__padding[0]) + (this.__padBorder ? this.__padding[0] : 0) + this.__trim[0];
                this.__coord[1] = y * (this.__tileh + this.__padding[1]) + (this.__padBorder ? this.__padding[1] : 0) + this.__trim[1];
                if (typeof w !== "undefined" && typeof h !== "undefined") {
                    this.__coord[2] = this.__trim[2] || w * this.__tile || this.__tile;
                    this.__coord[3] = this.__trim[3] || h * this.__tileh || this.__tileh;
                }
                this.trigger("Invalidate");
                return this;
            },
            crop: function(x, y, w, h) {
                var old = this._mbr || this.pos();
                this.__trim = [];
                this.__trim[0] = x;
                this.__trim[1] = y;
                this.__trim[2] = w;
                this.__trim[3] = h;
                this.__coord[0] += x;
                this.__coord[1] += y;
                this.__coord[2] = w;
                this.__coord[3] = h;
                this._w = w;
                this._h = h;
                this.trigger("Invalidate", old);
                return this;
            }
        });
    }, {
        "./core.js": 9
    } ],
    25: [ function(require, module, exports) {
        var Crafty = require("./core.js"), document = window.document;
        Crafty.storage = function(key, value) {
            var storage = window.localStorage, _value = value;
            if (!storage) {
                return false;
            }
            if (arguments.length === 1) {
                try {
                    return JSON.parse(storage.getItem(key));
                } catch (e) {
                    return storage.getItem(key);
                }
            } else {
                if (typeof value === "object") {
                    _value = JSON.stringify(value);
                }
                storage.setItem(key, _value);
            }
        };
        Crafty.storage.remove = function(key) {
            window.localStorage.removeItem(key);
        };
    }, {
        "./core.js": 9
    } ],
    26: [ function(require, module, exports) {
        var Crafty = require("./core.js"), document = window.document;
        Crafty.c("Text", {
            _text: "",
            defaultSize: "10px",
            defaultFamily: "sans-serif",
            defaultVariant: "normal",
            defaultLineHeight: "normal",
            ready: true,
            init: function() {
                this.requires("2D");
                this._textFont = {
                    type: "",
                    weight: "",
                    size: this.defaultSize,
                    lineHeight: this.defaultLineHeight,
                    family: this.defaultFamily,
                    variant: this.defaultVariant
                };
                this.bind("Draw", function(e) {
                    var font = this._fontString();
                    if (e.type === "DOM") {
                        var el = this._element, style = el.style;
                        style.color = this._textColor;
                        style.font = font;
                        el.innerHTML = this._text;
                    } else if (e.type === "canvas") {
                        var context = e.ctx;
                        context.save();
                        context.textBaseline = "top";
                        context.fillStyle = this._textColor || "rgb(0,0,0)";
                        context.font = font;
                        context.fillText(this._text, this._x, this._y);
                        context.restore();
                    }
                });
            },
            _getFontHeight: function() {
                var re = /([a-zA-Z]+)\b/;
                var multipliers = {
                    px: 1,
                    pt: 4 / 3,
                    pc: 16,
                    cm: 96 / 2.54,
                    mm: 96 / 25.4,
                    "in": 96,
                    em: undefined,
                    ex: undefined
                };
                return function(font) {
                    var number = parseFloat(font);
                    var match = re.exec(font);
                    var unit = match ? match[1] : "px";
                    if (multipliers[unit] !== undefined) return Math.ceil(number * multipliers[unit]); else return Math.ceil(number);
                };
            }(),
            text: function(text) {
                if (!(typeof text !== "undefined" && text !== null)) return this._text;
                if (typeof text == "function") this._text = text.call(this); else this._text = text;
                if (this.has("Canvas")) this._resizeForCanvas();
                this.trigger("Invalidate");
                return this;
            },
            _resizeForCanvas: function() {
                var ctx = Crafty.canvas.context;
                ctx.font = this._fontString();
                this.w = ctx.measureText(this._text).width;
                var size = this._textFont.size || this.defaultSize;
                this.h = 1.1 * this._getFontHeight(size);
            },
            _fontString: function() {
                return this._textFont.type + " " + this._textFont.variant + " " + this._textFont.weight + " " + this._textFont.size + " / " + this._textFont.lineHeight + " " + this._textFont.family;
            },
            textColor: function(color, strength) {
                this._strength = strength;
                this._textColor = Crafty.toRGB(color, this._strength);
                this.trigger("Invalidate");
                return this;
            },
            textFont: function(key, value) {
                if (arguments.length === 1) {
                    if (typeof key === "string") {
                        return this._textFont[key];
                    }
                    if (typeof key === "object") {
                        for (var propertyKey in key) {
                            if (propertyKey == "family") {
                                this._textFont[propertyKey] = "'" + key[propertyKey] + "'";
                            } else {
                                this._textFont[propertyKey] = key[propertyKey];
                            }
                        }
                    }
                } else {
                    this._textFont[key] = value;
                }
                if (this.has("Canvas")) this._resizeForCanvas();
                this.trigger("Invalidate");
                return this;
            },
            unselectable: function() {
                if (this.has("DOM")) {
                    this.css({
                        "-webkit-touch-callout": "none",
                        "-webkit-user-select": "none",
                        "-khtml-user-select": "none",
                        "-moz-user-select": "none",
                        "-ms-user-select": "none",
                        "user-select": "none"
                    });
                    this.trigger("Invalidate");
                }
                return this;
            }
        });
    }, {
        "./core.js": 9
    } ],
    27: [ function(require, module, exports) {
        var Crafty = require("./core.js"), document = window.document;
        Crafty.c("Delay", {
            init: function() {
                this._delays = [];
                this.bind("EnterFrame", function() {
                    var now = new Date().getTime();
                    var index = this._delays.length;
                    while (--index >= 0) {
                        var item = this._delays[index];
                        if (item.start + item.delay + item.pause < now) {
                            item.func.call(this);
                            if (item.repeat > 0) {
                                item.start = now;
                                item.pause = 0;
                                item.pauseBuffer = 0;
                                item.repeat--;
                            } else if (item.repeat <= 0) {
                                this._delays.splice(index, 1);
                            }
                        }
                    }
                });
                this.bind("Pause", function() {
                    var now = new Date().getTime();
                    for (var index in this._delays) {
                        this._delays[index].pauseBuffer = now;
                    }
                });
                this.bind("Unpause", function() {
                    var now = new Date().getTime();
                    for (var index in this._delays) {
                        var item = this._delays[index];
                        item.pause += now - item.pauseBuffer;
                    }
                });
            },
            delay: function(func, delay, repeat) {
                this._delays.push({
                    start: new Date().getTime(),
                    func: func,
                    delay: delay,
                    repeat: (repeat < 0 ? Infinity : repeat) || 0,
                    pauseBuffer: 0,
                    pause: 0
                });
                return this;
            }
        });
    }, {
        "./core.js": 9
    } ],
    28: [ function(require, module, exports) {
        module.exports = "0.6.2";
    }, {} ],
    29: [ function(require, module, exports) {
        var Crafty = require("./core.js"), document = window.document;
        Crafty.extend({
            viewport: {
                clampToEntities: true,
                _width: 0,
                _height: 0,
                _x: 0,
                _y: 0,
                _scale: 1,
                bounds: null,
                scroll: function(axis, val) {
                    this[axis] = val;
                    Crafty.trigger("ViewportScroll");
                    Crafty.trigger("InvalidateViewport");
                },
                rect_object: {
                    _x: 0,
                    _y: 0,
                    _w: 0,
                    _h: 0
                },
                rect: function() {
                    this.rect_object._x = -this._x;
                    this.rect_object._y = -this._y;
                    this.rect_object._w = this._width / this._scale;
                    this.rect_object._h = this._height / this._scale;
                    return this.rect_object;
                },
                pan: function() {
                    var tweens = {}, i, bound = false;
                    var targetX, targetY, startingX, startingY, easing;
                    function enterFrame(e) {
                        easing.tick(e.dt);
                        var v = easing.value();
                        Crafty.viewport.x = (1 - v) * startingX + v * targetX;
                        Crafty.viewport.y = (1 - v) * startingY + v * targetY;
                        Crafty.viewport._clamp();
                        if (easing.complete) {
                            stopPan();
                            Crafty.trigger("CameraAnimationDone");
                        }
                    }
                    function stopPan() {
                        Crafty.unbind("EnterFrame", enterFrame);
                    }
                    Crafty.bind("StopCamera", stopPan);
                    return function(dx, dy, time) {
                        Crafty.trigger("StopCamera");
                        if (dx == "reset") {
                            return;
                        }
                        startingX = Crafty.viewport._x;
                        startingY = Crafty.viewport._y;
                        targetX = startingX - dx;
                        targetY = startingY - dy;
                        easing = new Crafty.easing(time);
                        Crafty.uniqueBind("EnterFrame", enterFrame);
                    };
                }(),
                follow: function() {
                    var oldTarget, offx, offy;
                    function change() {
                        Crafty.viewport.scroll("_x", -(this.x + this.w / 2 - Crafty.viewport.width / 2 - offx));
                        Crafty.viewport.scroll("_y", -(this.y + this.h / 2 - Crafty.viewport.height / 2 - offy));
                        Crafty.viewport._clamp();
                    }
                    function stopFollow() {
                        if (oldTarget) oldTarget.unbind("Move", change);
                    }
                    Crafty.bind("StopCamera", stopFollow);
                    return function(target, offsetx, offsety) {
                        if (!target || !target.has("2D")) return;
                        Crafty.trigger("StopCamera");
                        oldTarget = target;
                        offx = typeof offsetx != "undefined" ? offsetx : 0;
                        offy = typeof offsety != "undefined" ? offsety : 0;
                        target.bind("Move", change);
                        change.call(target);
                    };
                }(),
                centerOn: function(targ, time) {
                    var x = targ.x + Crafty.viewport.x, y = targ.y + Crafty.viewport.y, mid_x = targ.w / 2, mid_y = targ.h / 2, cent_x = Crafty.viewport.width / 2, cent_y = Crafty.viewport.height / 2, new_x = x + mid_x - cent_x, new_y = y + mid_y - cent_y;
                    Crafty.viewport.pan(new_x, new_y, time);
                },
                zoom: function() {
                    function stopZoom() {
                        Crafty.unbind("EnterFrame", enterFrame);
                    }
                    Crafty.bind("StopCamera", stopZoom);
                    var startingZoom, finalZoom, finalAmount, startingX, finalX, startingY, finalY, easing;
                    function enterFrame(e) {
                        var amount, v;
                        easing.tick(e.dt);
                        amount = Math.pow(finalAmount, easing.value());
                        if (finalAmount === 1) v = easing.value(); else v = (1 / amount - 1) / (1 / finalAmount - 1);
                        Crafty.viewport.scale(amount * startingZoom);
                        Crafty.viewport.scroll("_x", startingX * (1 - v) + finalX * v);
                        Crafty.viewport.scroll("_y", startingY * (1 - v) + finalY * v);
                        Crafty.viewport._clamp();
                        if (easing.complete) {
                            stopZoom();
                            Crafty.trigger("CameraAnimationDone");
                        }
                    }
                    return function(amt, cent_x, cent_y, time) {
                        if (!amt) {
                            Crafty.viewport.scale(1);
                            return;
                        }
                        if (arguments.length <= 2) {
                            time = cent_x;
                            cent_x = Crafty.viewport.x - Crafty.viewport.width;
                            cent_y = Crafty.viewport.y - Crafty.viewport.height;
                        }
                        Crafty.trigger("StopCamera");
                        startingZoom = Crafty.viewport._scale;
                        finalAmount = amt;
                        finalZoom = startingZoom * finalAmount;
                        startingX = Crafty.viewport.x;
                        startingY = Crafty.viewport.y;
                        finalX = -(cent_x - Crafty.viewport.width / (2 * finalZoom));
                        finalY = -(cent_y - Crafty.viewport.height / (2 * finalZoom));
                        easing = new Crafty.easing(time);
                        Crafty.uniqueBind("EnterFrame", enterFrame);
                    };
                }(),
                scale: function() {
                    return function(amt) {
                        this._scale = amt ? amt : 1;
                        Crafty.trigger("InvalidateViewport");
                        Crafty.trigger("ViewportScale");
                    };
                }(),
                mouselook: function() {
                    var active = false, dragging = false, lastMouse = {};
                    old = {};
                    function stopLook() {
                        dragging = false;
                    }
                    return function(op, arg) {
                        if (typeof op == "boolean") {
                            active = op;
                            if (active) {
                                Crafty.mouseObjs++;
                            } else {
                                Crafty.mouseObjs = Math.max(0, Crafty.mouseObjs - 1);
                            }
                            return;
                        }
                        if (!active) return;
                        switch (op) {
                          case "move":
                          case "drag":
                            if (!dragging) return;
                            diff = {
                                x: arg.clientX - lastMouse.x,
                                y: arg.clientY - lastMouse.y
                            };
                            lastMouse.x = arg.clientX;
                            lastMouse.y = arg.clientY;
                            Crafty.viewport.x += diff.x;
                            Crafty.viewport.y += diff.y;
                            Crafty.viewport._clamp();
                            break;

                          case "start":
                            Crafty.trigger("StopCamera");
                            lastMouse.x = arg.clientX;
                            lastMouse.y = arg.clientY;
                            dragging = true;
                            break;

                          case "stop":
                            dragging = false;
                            break;
                        }
                    };
                }(),
                _clamp: function() {
                    if (!this.clampToEntities) return;
                    var bound = this.bounds || Crafty.map.boundaries();
                    bound.max.x *= this._scale;
                    bound.min.x *= this._scale;
                    bound.max.y *= this._scale;
                    bound.min.y *= this._scale;
                    if (bound.max.x - bound.min.x > Crafty.viewport.width) {
                        if (Crafty.viewport.x < -bound.max.x + Crafty.viewport.width) {
                            Crafty.viewport.x = -bound.max.x + Crafty.viewport.width;
                        } else if (Crafty.viewport.x > -bound.min.x) {
                            Crafty.viewport.x = -bound.min.x;
                        }
                    } else {
                        Crafty.viewport.x = -1 * (bound.min.x + (bound.max.x - bound.min.x) / 2 - Crafty.viewport.width / 2);
                    }
                    if (bound.max.y - bound.min.y > Crafty.viewport.height) {
                        if (Crafty.viewport.y < -bound.max.y + Crafty.viewport.height) {
                            Crafty.viewport.y = -bound.max.y + Crafty.viewport.height;
                        } else if (Crafty.viewport.y > -bound.min.y) {
                            Crafty.viewport.y = -bound.min.y;
                        }
                    } else {
                        Crafty.viewport.y = -1 * (bound.min.y + (bound.max.y - bound.min.y) / 2 - Crafty.viewport.height / 2);
                    }
                },
                init: function(w, h, stage_elem) {
                    Crafty.DOM.window.init();
                    this._defineViewportProperties();
                    this._width = !w ? Crafty.DOM.window.width : w;
                    this._height = !h ? Crafty.DOM.window.height : h;
                    if (typeof stage_elem === "undefined") stage_elem = "cr-stage";
                    var crstage;
                    if (typeof stage_elem === "string") crstage = document.getElementById(stage_elem); else if (typeof HTMLElement !== "undefined" ? stage_elem instanceof HTMLElement : stage_elem instanceof Element) crstage = stage_elem; else throw new TypeError("stage_elem must be a string or an HTMLElement");
                    Crafty.stage = {
                        x: 0,
                        y: 0,
                        fullscreen: false,
                        elem: crstage ? crstage : document.createElement("div"),
                        inner: document.createElement("div")
                    };
                    if (!w && !h) {
                        document.body.style.overflow = "hidden";
                        Crafty.stage.fullscreen = true;
                    }
                    Crafty.addEvent(this, window, "resize", Crafty.viewport.reload);
                    Crafty.addEvent(this, window, "blur", function() {
                        if (Crafty.settings.get("autoPause")) {
                            if (!Crafty._paused) Crafty.pause();
                        }
                    });
                    Crafty.addEvent(this, window, "focus", function() {
                        if (Crafty._paused && Crafty.settings.get("autoPause")) {
                            Crafty.pause();
                        }
                    });
                    Crafty.settings.register("stageSelectable", function(v) {
                        Crafty.stage.elem.onselectstart = v ? function() {
                            return true;
                        } : function() {
                            return false;
                        };
                    });
                    Crafty.settings.modify("stageSelectable", false);
                    Crafty.settings.register("stageContextMenu", function(v) {
                        Crafty.stage.elem.oncontextmenu = v ? function() {
                            return true;
                        } : function() {
                            return false;
                        };
                    });
                    Crafty.settings.modify("stageContextMenu", false);
                    Crafty.settings.register("autoPause", function() {});
                    Crafty.settings.modify("autoPause", false);
                    if (!crstage) {
                        document.body.appendChild(Crafty.stage.elem);
                        Crafty.stage.elem.id = stage_elem;
                    }
                    var elem = Crafty.stage.elem.style, offset;
                    Crafty.stage.elem.appendChild(Crafty.stage.inner);
                    Crafty.stage.inner.style.position = "absolute";
                    Crafty.stage.inner.style.zIndex = "1";
                    Crafty.stage.inner.style.transformStyle = "preserve-3d";
                    elem.width = this.width + "px";
                    elem.height = this.height + "px";
                    elem.overflow = "hidden";
                    Crafty.bind("ViewportResize", function() {
                        Crafty.trigger("InvalidateViewport");
                    });
                    if (Crafty.mobile) {
                        if (typeof elem.webkitTapHighlightColor !== undefined) {
                            elem.webkitTapHighlightColor = "rgba(0,0,0,0)";
                        }
                        var meta = document.createElement("meta"), head = document.getElementsByTagName("HEAD")[0];
                        meta = document.createElement("meta");
                        meta.setAttribute("name", "apple-mobile-web-app-capable");
                        meta.setAttribute("content", "yes");
                        head.appendChild(meta);
                        Crafty.addEvent(this, Crafty.stage.elem, "touchmove", function(e) {
                            e.preventDefault();
                        });
                    } else {
                        elem.position = "relative";
                        offset = Crafty.DOM.inner(Crafty.stage.elem);
                        Crafty.stage.x = offset.x;
                        Crafty.stage.y = offset.y;
                    }
                },
                _defineViewportProperties: function() {
                    if (Crafty.support.setter) {
                        this.__defineSetter__("x", function(v) {
                            this.scroll("_x", v);
                        });
                        this.__defineSetter__("y", function(v) {
                            this.scroll("_y", v);
                        });
                        this.__defineSetter__("width", function(v) {
                            this._width = v;
                            Crafty.trigger("ViewportResize");
                        });
                        this.__defineSetter__("height", function(v) {
                            this._height = v;
                            Crafty.trigger("ViewportResize");
                        });
                        this.__defineGetter__("x", function() {
                            return this._x;
                        });
                        this.__defineGetter__("y", function() {
                            return this._y;
                        });
                        this.__defineGetter__("width", function() {
                            return this._width;
                        });
                        this.__defineGetter__("height", function() {
                            return this._height;
                        });
                    } else if (Crafty.support.defineProperty) {
                        Object.defineProperty(this, "x", {
                            set: function(v) {
                                this.scroll("_x", v);
                            },
                            get: function() {
                                return this._x;
                            },
                            configurable: true
                        });
                        Object.defineProperty(this, "y", {
                            set: function(v) {
                                this.scroll("_y", v);
                            },
                            get: function() {
                                return this._y;
                            },
                            configurable: true
                        });
                        Object.defineProperty(this, "width", {
                            set: function(v) {
                                this._width = v;
                                Crafty.trigger("ViewportResize");
                            },
                            get: function() {
                                return this._width;
                            },
                            configurable: true
                        });
                        Object.defineProperty(this, "height", {
                            set: function(v) {
                                this._height = v;
                                Crafty.trigger("ViewportResize");
                            },
                            get: function() {
                                return this._height;
                            },
                            configurable: true
                        });
                    }
                },
                reload: function() {
                    Crafty.DOM.window.init();
                    var w = Crafty.DOM.window.width, h = Crafty.DOM.window.height, offset;
                    if (Crafty.stage.fullscreen) {
                        this._width = w;
                        this._height = h;
                        Crafty.trigger("ViewportResize");
                    }
                    offset = Crafty.DOM.inner(Crafty.stage.elem);
                    Crafty.stage.x = offset.x;
                    Crafty.stage.y = offset.y;
                },
                reset: function() {
                    Crafty.viewport.mouselook("stop");
                    Crafty.trigger("StopCamera");
                    Crafty.viewport.scale(1);
                }
            }
        });
    }, {
        "./core.js": 9
    } ],
    30: [ function(require, module, exports) {
        var Crafty = require("./core.js"), document = window.document;
        var FRAGMENT_SHADER_SRC = "precision mediump float;" + "void main(void) {" + "gl_FragColor = vec4(0.0, 1.0, 1.0, 0.5);" + "}";
        var FRAGMENT_SHADER_SRC_2 = "precision mediump float;" + "void main(void) {" + "gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);" + "}";
        var VERTEX_SHADER_SRC_OLD = "attribute vec2 aVertexPosition;" + "uniform mat2 uGlobalScaleMatrix;" + "void main(void) {" + " gl_Position = vec4(aVertexPosition, 0, 1);" + "}";
        glHelpers = {
            writeVec2: function(data, offset, stride, x, y) {
                if (arguments.length == 5) {
                    for (var i = 0; i < 4; i++) {
                        data[offset + stride * i] = x;
                        data[offset + stride * i + 1] = y;
                    }
                } else {
                    for (var i = 0; i < 4; i++) {
                        data[offset + stride * i] = arguments[3 + i * 2];
                        data[offset + stride * i + 1] = arguments[4 + i * 2];
                    }
                }
            },
            writeVec4: function(data, offset, stride, x, y, z, w) {
                if (arguments.length == 7) {
                    for (var i = 0; i < 4; i++) {
                        data[offset + stride * i] = x;
                        data[offset + stride * i + 1] = y;
                        data[offset + stride * i + 2] = z;
                        data[offset + stride * i + 3] = w;
                    }
                } else {
                    for (var i = 0; i < 4; i++) {
                        data[offset + stride * i] = arguments[3 + i * 4];
                        data[offset + stride * i + 1] = arguments[4 + i * 4];
                        data[offset + stride * i + 2] = arguments[5 + i * 4];
                        data[offset + stride * i + 3] = arguments[6 + i * 4];
                    }
                }
            },
            makeProgram: function(gl, fragment_src, vertex_src) {
                var gl = this.context;
                var fragment_shader = this.compileShader(gl, fragment_src, gl.FRAGMENT_SHADER);
                var vertex_shader = this.compileShader(gl, vertex_src, gl.VERTEX_SHADER);
                var shaderProgram = gl.createProgram();
                gl.attachShader(shaderProgram, vertex_shader);
                gl.attachShader(shaderProgram, fragment_shader);
                gl.linkProgram(shaderProgram);
                if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
                    throw "Could not initialise shaders";
                }
                shaderProgram.viewport = gl.getUniformLocation(shaderProgram, "uViewport");
                return shaderProgram;
            },
            compileShader: function(gl, src, type) {
                var shader = gl.createShader(type);
                gl.shaderSource(shader, src);
                gl.compileShader(shader);
                if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                    throw gl.getShaderInfoLog(shader);
                }
                return shader;
            }
        };
        var TEXTURE_FRAGMENT_SHADER_SRC = "varying highp vec2 vTextureCoord;\r\n      \r\nuniform sampler2D uSampler;\r\nuniform highp vec2 uTextureDimensions;\r\nuniform highp vec4 uSpriteCoords;\r\n\r\nvoid main(void) {\r\n  highp vec2 coord =  ( uSpriteCoords.zw * vTextureCoord + uSpriteCoords.xy) / uTextureDimensions;\r\n  gl_FragColor = texture2D(uSampler, coord);\r\n}";
        var VERTEX_SHADER_SRC = "attribute vec2 a_position;\r\nuniform  vec4 uViewport;\r\nuniform  vec4 uEntityPos;\r\nuniform  vec4 uEntityExtra;\r\n\r\n\r\nvarying highp vec2 vTextureCoord;\r\n\r\nmat4 viewportScale = mat4(2.0 / uViewport.z, 0, 0, 0,    0, -2.0 / uViewport.w, 0,0,    0, 0,1,0,    -1,+1,0,1);\r\nvec4 viewportTranslation = vec4(uViewport.xy, 0, 0);\r\n\r\nvec2 entityScale = uEntityPos.zw;\r\nvec2 entityTranslation = uEntityPos.xy;\r\nvec2 entityOrigin = uEntityExtra.xy;\r\nmat2 entityRotationMatrix = mat2(cos(uEntityExtra.w), sin(uEntityExtra.w), -sin(uEntityExtra.w), cos(uEntityExtra.w));\r\n\r\nvoid main() {\r\n  vec2 pos = entityScale * a_position;\r\n  pos = entityRotationMatrix * (pos - entityOrigin) + entityOrigin + entityTranslation;\r\n  gl_Position = viewportScale * (viewportTranslation + vec4(pos, uEntityExtra.z, 1) );\r\n  vTextureCoord = a_position;\r\n}";
        var COLOR_VERTEX_SHADER = "attribute vec2 aPosition;\r\nattribute vec4 aExtras;\r\nattribute vec4 aColor;\r\n\r\nvarying lowp vec4 vColor;\r\n\r\nuniform  vec4 uViewport;\r\n\r\nmat4 viewportScale = mat4(2.0 / uViewport.z, 0, 0, 0,    0, -2.0 / uViewport.w, 0,0,    0, 0,1,0,    -1,+1,0,1);\r\nvec4 viewportTranslation = vec4(uViewport.xy, 0, 0);\r\n\r\nvec2 entityOrigin = aExtras.xy;\r\nmat2 entityRotationMatrix = mat2(cos(aExtras.w), sin(aExtras.w), -sin(aExtras.w), cos(aExtras.w));\r\n\r\nvoid main() {\r\n  vec2 pos = aPosition;\r\n  pos = entityRotationMatrix * (pos - entityOrigin) + entityOrigin ;\r\n  gl_Position = viewportScale * (viewportTranslation + vec4(pos, 1.0/(1.0+exp(aExtras.z) ), 1) );\r\n  vColor = aColor;\r\n}";
        var COLOR_FRAGMENT_SHADER = "";
        var SPRITE_VERTEX_SHADER = "attribute vec2 aPosition;\r\nattribute vec4 aExtras;\r\nattribute vec2 aTextureCoord;\r\n\r\nvarying mediump vec2 vTextureCoord;\r\n\r\nuniform vec4 uViewport;\r\nuniform mediump vec2 uTextureDimensions;\r\n\r\nmat4 viewportScale = mat4(2.0 / uViewport.z, 0, 0, 0,    0, -2.0 / uViewport.w, 0,0,    0, 0,1,0,    -1,+1,0,1);\r\nvec4 viewportTranslation = vec4(uViewport.xy, 0, 0);\r\n\r\nvec2 entityOrigin = aExtras.xy;\r\nmat2 entityRotationMatrix = mat2(cos(aExtras.w), sin(aExtras.w), -sin(aExtras.w), cos(aExtras.w));\r\n\r\nvoid main() {\r\n  vec2 pos = aPosition;\r\n  pos = entityRotationMatrix * (pos - entityOrigin) + entityOrigin ;\r\n  gl_Position = viewportScale * (viewportTranslation + vec4(pos, 1.0/(1.0+exp(aExtras.z) ), 1) );\r\n  vTextureCoord = aTextureCoord;\r\n}\r\n";
        var SPRITE_FRAGMENT_SHADER = "    varying mediump vec2 vTextureCoord;\r\n      \r\n    uniform sampler2D uSampler;\r\n    uniform mediump vec2 uTextureDimensions;\r\n\r\n    void main(void) {\r\n      highp vec2 coord =   vTextureCoord / uTextureDimensions;\r\n      gl_FragColor = texture2D(uSampler, coord);\r\n    }";
        Crafty.c("TestSquare", {
            init: function() {
                if (this.has("WebGL")) {
                    this._establishShader("TestSquare", this._fragmentShader);
                }
            },
            _fragmentShader: FRAGMENT_SHADER_SRC
        });
        Crafty.c("TestSquareWhite", {
            init: function() {
                if (this.has("WebGL")) {
                    this._establishShader("TestSquareWhite", this._fragmentShader);
                }
            },
            _fragmentShader: FRAGMENT_SHADER_SRC_2
        });
        Crafty.c("TestColor", {
            init: function() {
                if (this.has("WebGL")) {
                    var gl = this.webgl.context;
                    this._establishShader("TestColor", this._fragmentShader, this._vertexShader);
                    if (typeof this._shaderProgram.posLocation === "undefined") {
                        this._specializeProgram();
                    }
                    this._glNum = this._shaderProgram._elementCount++;
                }
                this._red = this._blue = this._green = 1;
                this.bind("Draw", this._drawColor);
            },
            _specializeProgram: function() {
                var gl = this.webgl.context;
                console.log("setting positions");
                var prog = this._shaderProgram;
                prog._bufferArray = new Float32Array(4e3);
                prog._kingBuffer = gl.createBuffer();
                prog.index = new Uint16Array(600);
                prog._indexBuffer = gl.createBuffer();
                prog.posLocation = gl.getAttribLocation(prog, "aPosition");
                gl.enableVertexAttribArray(prog.posLocation);
                prog.extrasLocation = gl.getAttribLocation(prog, "aExtras");
                gl.enableVertexAttribArray(prog.extrasLocation);
                prog.colLocation = gl.getAttribLocation(prog, "aColor");
                gl.enableVertexAttribArray(prog.colLocation);
                prog._elementCount = 0;
                var size = Float32Array.BYTES_PER_ELEMENT;
                var stride = (2 + 4 + 4) * size;
                prog.stride = stride;
                prog.switchTo = function() {
                    gl.useProgram(prog);
                    gl.bindBuffer(gl.ARRAY_BUFFER, prog._kingBuffer);
                    gl.vertexAttribPointer(prog.posLocation, 2, gl.FLOAT, false, stride, 0);
                    gl.vertexAttribPointer(prog.extrasLocation, 4, gl.FLOAT, false, stride, 2 * size);
                    gl.vertexAttribPointer(prog.colLocation, 4, gl.FLOAT, false, stride, (2 + 4) * size);
                };
                prog.renderBatch = function() {
                    gl.bindBuffer(gl.ARRAY_BUFFER, prog._kingBuffer);
                    gl.bufferData(gl.ARRAY_BUFFER, prog._bufferArray, gl.STATIC_DRAW);
                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, prog._indexBuffer);
                    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, prog.index, gl.STATIC_DRAW);
                    gl.drawElements(gl.TRIANGLES, prog.pointer, gl.UNSIGNED_SHORT, 0);
                };
            },
            _fragmentShader: "precision mediump float;" + "varying lowp vec4 vColor;" + "void main(void) {" + "  gl_FragColor = vColor;" + "}",
            _vertexShader: COLOR_VERTEX_SHADER,
            _drawColor: function(drawVars) {
                var gl = drawVars.gl, prog = drawVars.program;
                this._writeToArray(prog._bufferArray);
                var offset = this._glNum * 4;
                var index = prog.index;
                var l = prog.pointer;
                index[0 + l] = 0 + offset;
                index[1 + l] = 1 + offset;
                index[2 + l] = 2 + offset;
                index[3 + l] = 1 + offset;
                index[4 + l] = 2 + offset;
                index[5 + l] = 3 + offset;
                prog.pointer += 6;
            },
            _writeToArray: function(data) {
                var width = 2 + 4 + 4;
                var offset = width * 4 * this._glNum;
                glHelpers.writeVec2(data, offset, width, this._x, this._y, this._x, this._y + this._h, this._x + this._w, this._y, this._x + this._w, this._y + this._h);
                glHelpers.writeVec4(data, offset + 2, width, this._origin.x + this._x, this._origin.y + this._y, this._z, this._rotation);
                glHelpers.writeVec4(data, offset + 6, width, this._red, this._green, this._blue, 1);
            },
            color: function(r, g, b) {
                this._red = r;
                this._green = g;
                this._blue = b;
                return this;
            }
        });
        Crafty.c("GLSprite", {
            init: function() {
                if (this.has("WebGL")) {
                    var gl = this.webgl.context;
                    this._establishShader(this.__image, this._fragmentShader, this._vertexShader);
                    if (typeof this._shaderProgram.posLocation === "undefined") {
                        this._specializeProgram();
                    }
                    this._glNum = this._shaderProgram._elementCount++;
                }
                this.bind("Draw", this._drawSprite);
            },
            _specializeProgram: function() {
                var gl = this.webgl.context;
                var webgl = this.webgl;
                console.log("setting sprite positions");
                var prog = this._shaderProgram;
                prog.__texture = webgl.makeTexture(this.__image, this.img);
                webgl.bindTexture(this._shaderProgram, prog.__texture);
                prog._bufferArray = new Float32Array(4e3);
                prog._kingBuffer = gl.createBuffer();
                prog.index = new Uint16Array(600);
                prog._indexBuffer = gl.createBuffer();
                prog.posLocation = gl.getAttribLocation(prog, "aPosition");
                gl.enableVertexAttribArray(prog.posLocation);
                prog.extrasLocation = gl.getAttribLocation(prog, "aExtras");
                gl.enableVertexAttribArray(prog.extrasLocation);
                prog.textureLocation = gl.getAttribLocation(prog, "aTextureCoord");
                gl.enableVertexAttribArray(prog.textureLocation);
                prog._elementCount = 0;
                var size = Float32Array.BYTES_PER_ELEMENT;
                var stride = (2 + 4 + 2) * size;
                prog.stride = stride;
                prog.switchTo = function() {
                    gl.useProgram(prog);
                    gl.bindBuffer(gl.ARRAY_BUFFER, prog._kingBuffer);
                    gl.vertexAttribPointer(prog.posLocation, 2, gl.FLOAT, false, stride, 0);
                    gl.vertexAttribPointer(prog.extrasLocation, 4, gl.FLOAT, false, stride, 2 * size);
                    gl.vertexAttribPointer(prog.colLocation, 4, gl.FLOAT, false, stride, (2 + 4) * size);
                };
                prog.renderBatch = function() {
                    gl.bindBuffer(gl.ARRAY_BUFFER, prog._kingBuffer);
                    gl.bufferData(gl.ARRAY_BUFFER, prog._bufferArray, gl.STATIC_DRAW);
                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, prog._indexBuffer);
                    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, prog.index, gl.STATIC_DRAW);
                    gl.drawElements(gl.TRIANGLES, prog.pointer, gl.UNSIGNED_SHORT, 0);
                };
            },
            _fragmentShader: SPRITE_FRAGMENT_SHADER,
            _vertexShader: SPRITE_VERTEX_SHADER,
            _drawSprite: function(drawVars) {
                var gl = drawVars.gl, prog = drawVars.program;
                this._writeToArray(prog._bufferArray, drawVars.co);
                var offset = this._glNum * 4;
                var index = prog.index;
                var l = prog.pointer;
                index[0 + l] = 0 + offset;
                index[1 + l] = 1 + offset;
                index[2 + l] = 2 + offset;
                index[3 + l] = 1 + offset;
                index[4 + l] = 2 + offset;
                index[5 + l] = 3 + offset;
                prog.pointer += 6;
            },
            _writeToArray: function(data, co) {
                var width = 2 + 4 + 2;
                var offset = width * 4 * this._glNum;
                glHelpers.writeVec2(data, offset, width, this._x, this._y, this._x, this._y + this._h, this._x + this._w, this._y, this._x + this._w, this._y + this._h);
                glHelpers.writeVec4(data, offset + 2, width, this._origin.x + this._x, this._origin.y + this._y, this._z, this._rotation);
                glHelpers.writeVec2(data, offset + 6, width, co.x, co.y, co.x, co.y + co.h, co.x + co.w, co.y, co.x + co.w, co.y + co.h);
            }
        });
        Crafty.c("WebGL", {
            init: function() {
                if (!Crafty.webgl.context) {
                    Crafty.webgl.init();
                }
                var webgl = this.webgl = Crafty.webgl;
                var gl = webgl.context;
                webgl.entities++;
                this._changed = true;
                webgl.add(this);
                this.bind("Change", function(e) {
                    if (this._changed === false) {
                        this._changed = true;
                        webgl.add(this);
                    }
                });
                this.bind("Remove", function() {
                    webgl.entities--;
                    this._changed = true;
                    webgl.add(this);
                });
            },
            drawVars: {
                type: "webgl",
                pos: {},
                ctx: null,
                coord: [ 0, 0, 0, 0 ],
                co: {
                    x: 0,
                    y: 0,
                    w: 0,
                    h: 0
                }
            },
            draw: function(ctx, x, y, w, h) {
                if (!this.ready) return;
                if (arguments.length === 4) {
                    h = w;
                    w = y;
                    y = x;
                    x = ctx;
                    ctx = this.webgl.context;
                }
                var pos = this.drawVars.pos;
                pos._x = this._x + (x || 0);
                pos._y = this._y + (y || 0);
                pos._w = w || this._w;
                pos._h = h || this._h;
                var coord = this.__coord || [ 0, 0, 0, 0 ];
                var co = this.drawVars.co;
                co.x = coord[0] + (x || 0);
                co.y = coord[1] + (y || 0);
                co.w = w || coord[2];
                co.h = h || coord[3];
                if (this._flipX || this._flipY) {}
                if (this._alpha < 1) {}
                var gl = this.webgl.context;
                this.drawVars.gl = gl;
                this.drawVars.program = this._shaderProgram;
                this.trigger("Draw", this.drawVars);
                return this;
            },
            _establishShader: function(compName, f_src, v_src) {
                console.log("Establishing shader");
                var wgl = this.webgl;
                if (typeof wgl.programs[compName] === "undefined") {
                    wgl.programs[compName] = glHelpers.makeProgram(gl, f_src, v_src);
                }
                this._shaderProgram = wgl.programs[compName];
                this.ready = true;
            }
        });
        Crafty.extend({
            webgl: {
                context: null,
                entities: 0,
                changed_objects: [],
                add: function(e) {
                    this.changed_objects.push(e);
                },
                programs: {},
                compileShader: function(src, type) {
                    var gl = this.context;
                    var shader = gl.createShader(type);
                    gl.shaderSource(shader, src);
                    gl.compileShader(shader);
                    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                        throw gl.getShaderInfoLog(shader);
                    }
                    return shader;
                },
                makeProgram: function(fragment_src, vertex_src) {
                    console.log("Making program");
                    console.log(fragment_src);
                    var gl = this.context;
                    var fragment_shader = this.compileShader(fragment_src, gl.FRAGMENT_SHADER);
                    var vertex_shader = vertex_src ? this.compileShader(vertex_src, gl.VERTEX_SHADER) : this.defaultVertexShader;
                    var shaderProgram = gl.createProgram();
                    gl.attachShader(shaderProgram, vertex_shader);
                    gl.attachShader(shaderProgram, fragment_shader);
                    gl.linkProgram(shaderProgram);
                    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
                        throw "Could not initialise shaders";
                    }
                    shaderProgram.viewport = gl.getUniformLocation(shaderProgram, "uViewport");
                    return shaderProgram;
                },
                textures: {},
                textureCount: 0,
                makeTexture: function(url, image) {
                    var webgl = this;
                    if (typeof webgl.textures[url] !== "undefined") return webgl.textures[url];
                    var gl = webgl.context;
                    var texture = gl.createTexture();
                    gl.bindTexture(gl.TEXTURE_2D, texture);
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                    gl.bindTexture(gl.TEXTURE_2D, null);
                    gl.activeTexture(gl["TEXTURE" + webgl.textureCount]);
                    gl.bindTexture(gl.TEXTURE_2D, texture);
                    webgl.textures[url] = {
                        t: texture,
                        sampler: webgl.textureCount,
                        key: "TEXTURE" + webgl.textureCount,
                        width: image.width,
                        height: image.height,
                        url: url
                    };
                    webgl.textureCount++;
                    gl.activeTexture(gl["TEXTURE" + webgl.textureCount]);
                    return webgl.textures[url];
                },
                bindTexture: function(program, texture_obj) {
                    if (typeof program.texture_obj !== "undefined") return;
                    this.context;
                    var webgl = this;
                    gl.useProgram(program);
                    gl.uniform1i(gl.getUniformLocation(program, "uSampler"), texture_obj.sampler);
                    gl.uniform2f(gl.getUniformLocation(program, "uTextureDimensions"), texture_obj.width, texture_obj.height);
                    program.texture_obj = texture_obj;
                },
                init: function() {
                    if (!Crafty.support.webgl) {
                        Crafty.trigger("NoWebGL");
                        Crafty.stop();
                        return;
                    }
                    var c;
                    c = document.createElement("canvas");
                    c.width = Crafty.viewport.width;
                    c.height = Crafty.viewport.height;
                    c.style.position = "absolute";
                    c.style.left = "0px";
                    c.style.top = "0px";
                    Crafty.stage.elem.appendChild(c);
                    var gl;
                    try {
                        gl = c.getContext("webgl") || c.getContext("experimental-webgl");
                        gl.viewportWidth = c.width;
                        gl.viewportHeight = c.height;
                    } catch (e) {}
                    if (!gl) {
                        Crafty.trigger("NoWebGL");
                        return;
                    }
                    this.context = gl;
                    this._canvas = c;
                    gl.clearColor(0, 0, 0, 0);
                    gl.enable(gl.DEPTH_TEST);
                    var webgl = this;
                    Crafty.uniqueBind("RenderScene", webgl.render);
                    Crafty.uniqueBind("ViewportResize", webgl._resize);
                    Crafty.uniqueBind("InvalidateViewport", function() {
                        webgl.dirtyViewport = true;
                    });
                    this.dirtyViewport = true;
                    console.log("webgl inited");
                },
                _resize: function() {
                    var c = Crafty.webgl._canvas;
                    c.width = Crafty.viewport.width;
                    c.height = Crafty.viewport.height;
                    gl.viewportWidth = c.widtxh;
                    gl.viewportHeight = c.height;
                },
                setViewportUniforms: function(shaderProgram) {
                    gl = this.webgl.context;
                    gl.useProgram(shaderProgram);
                    var viewport = Crafty.viewport;
                    gl.uniform4f(shaderProgram.viewport, viewport._x, viewport._y, viewport._width, viewport._height);
                },
                render: function(rect) {
                    rect = rect || Crafty.viewport.rect();
                    var q = Crafty.map.search(rect), i = 0, l = q.length, webgl = Crafty.webgl, gl = webgl.context, current;
                    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
                    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                    var shaderProgram;
                    var programs = webgl.programs;
                    if (webgl.dirtyViewport) {
                        for (var comp in programs) {
                            webgl.setViewportUniforms(programs[comp]);
                        }
                        webgl.dirtyViewport = false;
                    }
                    var batchCount = 0;
                    shaderProgram = null;
                    for (;i < l; i++) {
                        current = q[i];
                        if (current._visible && current.__c.WebGL) {
                            if (shaderProgram !== current._shaderProgram) {
                                if (shaderProgram !== null) {
                                    shaderProgram.renderBatch();
                                    batchCount++;
                                }
                                shaderProgram = current._shaderProgram;
                                shaderProgram.pointer = 0;
                                shaderProgram.switchTo();
                            }
                            current.draw();
                            current._changed = false;
                        }
                    }
                    if (shaderProgram !== null) {
                        shaderProgram.renderBatch();
                        batchCount++;
                    }
                    console.log("Batches: " + batchCount);
                }
            }
        });
    }, {
        "./core.js": 9
    } ]
}, {}, [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30 ]);

Crafty.c("Grid", {
    init: function() {
        this.requires("Mouse").bind("MouseOver", function() {
            if (MapEditor.paintMode && MapEditor.selectedEntity !== "Player") {
                this.addEntity(this, MapEditor.selectedEntity);
            } else if (MapEditor.eraseMode && MapEditor.selectedEntity) {
                if (this.has(MapEditor.selectedEntity)) {
                    this.removeEntity(this, MapEditor.selectedEntity);
                }
            } else if (!Crafty.bind("MouseDown")) {
                Crafty.bind("MouseDown");
            }
        }).bind("MouseDown", function(data) {
            console.log(this);
            if (data.button === 0) {
                if (MapEditor.fillMode) {
                    this.calculateAreaToFill(this);
                } else if (this.has("EmptySpace") && MapEditor.selectedEntity) {
                    this.addEntity(this, MapEditor.selectedEntity);
                }
            } else if (data.button === 2) {
                if (this.has(MapEditor.selectedEntity)) {
                    this.removeEntity(this, MapEditor.selectedEntity);
                }
            }
        });
        this.attr({
            w: MapEditor.map_grid.tile.width,
            h: MapEditor.map_grid.tile.height
        });
    },
    addEntity: function(entity, selectedEntity) {
        if (selectedEntity === "Player" && !MapEditor.playerPlaced) {
            MapEditor.playerPlaced = true;
            entity.addComponent(selectedEntity);
        } else if (selectedEntity === "Player" && MapEditor.playerPlaced) {
            window.alert("Player is already placed. Only one is allowed per map");
        } else if (entity.has("EmptySpace") && selectedEntity) {
            entity.addComponent(selectedEntity);
            console.log("test");
        }
        entity.removeComponent("EmptySpace");
    },
    removeEntity: function(entity, selectedEntity) {
        if (selectedEntity === "Player" && MapEditor.playerPlaced) {
            MapEditor.playerPlaced = false;
            entity.removeComponent(selectedEntity);
        } else {
            entity.removeComponent(selectedEntity);
        }
        if (entity.has("Sprite")) {
            entity.removeComponent("Sprite");
        }
        entity.addComponent("EmptySpace");
    },
    calculateAreaToFill: function(clickedEntity) {
        var startingLocation = clickedEntity.at();
        var entitiesToFill = [];
        var y = this[0];
        while (Crafty(y).has("EmptySpace") && Crafty(y).at().x === startingLocation.x) {
            var x = Crafty(y)[0];
            while (Crafty(x).has("EmptySpace") && Crafty(x).at().y === Crafty(y).at().y) {
                entitiesToFill.push(Crafty(x)[0]);
                x--;
            }
            x = Crafty(y)[0];
            while (Crafty(x).has("EmptySpace") && Crafty(x).at().y === Crafty(y).at().y) {
                entitiesToFill.push(Crafty(x)[0]);
                x++;
            }
            entitiesToFill.push(Crafty(y)[0]);
            y = y + 30;
        }
        y = this[0];
        while (Crafty(y).has("EmptySpace") && Crafty(y).at().x === startingLocation.x) {
            var x = Crafty(y)[0];
            while (Crafty(x).has("EmptySpace") && Crafty(x).at().y === Crafty(y).at().y) {
                entitiesToFill.push(Crafty(x)[0]);
                x--;
            }
            x = Crafty(y)[0];
            while (Crafty(x).has("EmptySpace") && Crafty(x).at().y === Crafty(y).at().y) {
                entitiesToFill.push(Crafty(x)[0]);
                x++;
            }
            entitiesToFill.push(Crafty(y)[0]);
            y = y - 30;
        }
        for (var i = 0; i < entitiesToFill.length; i++) {
            var entity = Crafty(entitiesToFill[i]);
            this.addEntity(entity, MapEditor.selectedEntity);
        }
    },
    at: function(x, y) {
        if (x === undefined && y === undefined) {
            return {
                x: this.x / MapEditor.map_grid.tile.width,
                y: this.y / MapEditor.map_grid.tile.height
            };
        } else {
            this.attr({
                x: x * MapEditor.map_grid.tile.width,
                y: y * MapEditor.map_grid.tile.height
            });
            return this;
        }
    }
});

Crafty.c("Actor", {
    init: function() {
        this.requires("2D, Canvas, Grid, Collision, WiredHitBox");
    }
});

Crafty.c("MapText", {
    init: function() {
        this.requires("2D, DOM, Text").css($text_css);
    }
});

Crafty.c("EmptySpace", {
    _mapChar: "#",
    init: function() {
        this.requires("Actor, Mouse, Color").color("gray");
    }
});

Crafty.c("Floor", {
    _mapChar: "f",
    init: function() {
        this.requires("Actor, Mouse, Color").color("blue");
    }
});

Crafty.c("Tent", {
    _mapChar: "t",
    init: function() {
        this.requires("Actor, Mouse, Color").color("black");
    }
});

Crafty.c("Player", {
    _mapChar: "@",
    init: function() {
        this.requires("Actor, Mouse, Color").color("black");
    }
});

Crafty.c("FillBucket", {
    _mapChar: "@",
    init: function() {
        this.requires("Actor, Mouse, Tint");
        this.tint("#969696", .3);
    }
});

var MapEditor = {
    map_grid: {
        width: 80,
        height: 10,
        tile: {
            width: 32,
            height: 32
        }
    },
    width: function() {
        return MapEditor.map_grid.width * this.map_grid.tile.width;
    },
    height: function() {
        return MapEditor.map_grid.height * this.map_grid.tile.height;
    },
    paintMode: false,
    eraseMode: false,
    fillMode: false,
    selectedEntity: null,
    playerPlaced: null,
    start: function() {
        Crafty.init(MapEditor.width(), MapEditor.height());
        Crafty.background("gray");
        Crafty.scene("EditMap");
    }
};

var $text_css = {
    "font-size": "24px",
    "font-family": "Arial",
    color: "black",
    "text-align": "center"
};

window.addEventListener("load", MapEditor.start);

Crafty.scene("EditMap", function() {
    this.unbind("KeyDown");
    this.bind("KeyDown", function(e) {
        switch (e.key) {
          case Crafty.keys.P:
            if (!MapEditor.paintMode && MapEditor.selectedEntity !== "Player") {
                if (MapEditor.eraseMode) {
                    MapEditor.eraseMode = false;
                    $("#erase-mode").hide();
                }
                MapEditor.paintMode = true;
                $("#brush").addClass("selectedTool");
                $("#paint-mode").toggle();
            } else if (Crafty.keys.P && !MapEditor.paintMode && MapEditor.selectedEntity === "Player") {
                window.alert("Paint mode is disabled for the Player entity. Only one is allowed per map");
            } else {
                MapEditor.paintMode = false;
                $("#brush").removeClass("selectedTool");
                $("#paint-mode").toggle();
            }
            break;

          case Crafty.keys.E:
            if (!MapEditor.eraseMode) {
                if (MapEditor.paintMode) {
                    MapEditor.paintMode = false;
                    $("#paint-mode").hide();
                }
                MapEditor.eraseMode = true;
                $("#erase-mode").toggle();
            } else {
                MapEditor.eraseMode = false;
                $("#erase-mode").toggle();
            }
            break;

          case Crafty.keys.F:
            if (!MapEditor.fillMode) {
                if (MapEditor.paintMode) {
                    MapEditor.paintMode = false;
                    $("#paint-mode").hide();
                }
                if (MapEditor.eraseMode) {
                    MapEditor.eraseMode = false;
                    $("#erase-mode").hide();
                }
                MapEditor.fillMode = true;
                $("#fill-mode").toggle();
            } else {
                MapEditor.fillMode = false;
                $("#fill-mode").toggle();
            }
            break;
        }
    });
    this._map = MapEditor.mapToLoad;
    initiateMap(this._map);
    $("#palette").show();
});

Crafty.scene("Loading", function() {
    Crafty.e("2D, DOM, Text").text("Loading; please wait...").attr({
        x: 0,
        y: MapEditor.height() / 2 - 24,
        w: MapEditor.width()
    }).css($text_css);
    Crafty.load([ "assets/actors/camel.png", "assets/actors/player_character.png", "assets/actors/lead_camel_white.png", "assets/actors/human_sword.png", "assets/tiles/desert_objects_32.png", "assets/tiles/desert_objects_64.png", "assets/tiles/desert_objects_32x64.png" ], function() {
        Crafty.sprite(32, 32, "assets/actors/camel_32.png", {
            spr_camel: [ 0, 2, 0, 0 ]
        });
        Crafty.sprite(32, 32, "assets/actors/player_character.png", {
            spr_white_player: [ 1, 0, 0, 0 ]
        });
        Crafty.sprite(32, 32, "assets/actors/blue_character.png", {
            spr_blue_player: [ 1, 2, 0, 0 ]
        });
        Crafty.sprite(32, 40, "assets/actors/lead_camel_white.png", {
            spr_lead_camel_white: [ 0, 1, 0, 0 ]
        });
        Crafty.sprite(32, 32, "assets/tiles/desert_objects_32.png", {
            spr_covered_well_32: [ 0, 4 ],
            spr_uncovered_well_32: [ 1, 4 ]
        });
        Crafty.scene("EditMap");
    });
});

$(document).ready(function() {
    $("a[name=modal]").click(function(e) {
        e.preventDefault();
        var dialogBox = $("#dialog");
        var maskHeight = $(document).height();
        var maskWidth = $(document).width();
        console.log(maskHeight, maskWidth);
        $("#mask").css({
            width: maskWidth,
            height: maskHeight
        });
        $("#mask").fadeIn(1e3);
        $("#mask").fadeTo("slow", .8);
        var winH = $(window).height();
        var winW = $(window).width();
        dialogBox.css("top", winH / 2 - $(id).height() / 2);
        dialogBox.css("left", winW / 2 - $(id).width() / 2);
        $("#cr-stage").toggle();
        dialogBox.toggle();
    });
    $(".window .close").click(function(e) {
        e.preventDefault();
        $("#mask, .window").hide();
        $("#cr-stage").show();
    });
    $("#mask").click(function() {
        $(this).hide();
        $(".window").hide();
        $("#cr-stage").show();
    });
});

var width = MapEditor.map_grid.width;

var height = MapEditor.map_grid.height;

$(document).ready(function() {
    $("#loadmap").on("click", loadMap);
    $("#savemap").on("click", saveMap);
    $("#buildmap").on("click", buildMap);
    $("#clearmap").on("click", clearMap);
    $(".palette-entity").on("click", setSelectedTile);
    function setSelectedTile() {
        $("div").removeClass("selected");
        $(this).addClass("selected");
        var component = $(this).attr("id");
        MapEditor.selectedEntity = component;
        console.log(MapEditor.selectedEntity);
    }
    function loadMap() {
        var loadBox = $("#loadBox");
        var winH = $(window).height();
        var winW = $(window).width();
        loadBox.css("top", winH / 2 - loadBox.height() / 2);
        loadBox.css("left", winW / 2 - loadBox.width() / 2);
        if (!$("#savemap").prop("disabled")) {
            $("#loadmap").val("Hide Load Window");
            $("#savemap").prop("disabled", true);
        } else {
            $("#loadmap").val("Load Map");
            $("#savemap").prop("disabled", false);
        }
        $("#cr-stage").toggle();
        $("#palette").toggle();
        $("#mapToLoad").toggle();
        loadBox.toggle();
    }
});

function initiateMap(map) {
    if (map) {
        map = map.replace(/[\s+\']/g, "");
        var mapArray = map.split(",");
        convertMap(mapArray);
        MapEditor.mapToLoad = null;
    } else {
        map = [];
        for (var y = 0; y < height; y++) {
            map[y] = [];
            for (var x = 0; x < width; x++) {
                map[y][x] = Crafty.e("EmptySpace").at(x, y);
            }
        }
    }
}

function clearMap() {
    Crafty("*").destroy();
    var map = [];
    for (var y = 0; y < height; y++) {
        map[y] = [];
        for (var x = 0; x < width; x++) {
            map[y][x] = Crafty.e("EmptySpace").at(x, y);
        }
    }
    MapEditor.playerPlaced = false;
}

function showMapModel() {
    var saveBox = $("#saveBox");
    var winH = $(window).height();
    var winW = $(window).width();
    saveBox.css("top", winH / 2 - saveBox.height() / 2);
    saveBox.css("left", winW / 2 - saveBox.width() / 2);
    if (!$("#loadmap").prop("disabled")) {
        $("#savemap").val("Hide Save Window");
        $("#loadmap").prop("disabled", true);
    } else {
        $("#savemap").val("Save Map");
        $("#loadmap").prop("disabled", false);
    }
    $("#cr-stage").toggle();
    $("#palette").toggle();
    saveBox.toggle();
}

function saveMap() {
    var entityNumber = 0;
    var map = [];
    var first = Crafty("Actor");
    var i = first[0];
    for (var y = 0; y < height; y++) {
        map[y] = [];
        var rowString = "<br>'";
        for (var x = 0; x < width; x++) {
            var currentEntity = Crafty(i);
            if (currentEntity.at().x === x) {
                rowString += currentEntity._mapChar;
            }
            i++;
        }
        map[y] = rowString + "'";
    }
    map = "var newMap = [" + map + "]";
    $("#saveBox").html("Copy this into src/scenes/maps/ for inclusion in the game.</br></br>" + map);
    showMapModel();
}

function buildMap() {
    var map = $("#mapToLoad").val();
    $("#cr-stage").toggle();
    $("#loadBox").toggle();
    $("#mapToLoad").toggle();
    $("#loadmap").val("Load Map");
    $("#savemap").prop("disabled", false);
    MapEditor.mapToLoad = map;
    Crafty.scene("EditMap");
}

function convertMap(map) {
    var mapArray = [];
    for (var x = 0; x < map.length; x++) {
        mapArray[x] = map[x].split("");
    }
    parsemap(mapArray);
}

function parsemap(mapArray) {
    var map = [];
    var i = 2;
    for (var y = 0; y < height; y++) {
        map[y] = [];
        for (var x = 0; x < width; x++) {
            switch (mapArray[y][x]) {
              case "f":
                map[y][x] = Crafty.e("Floor").at(x, y);
                break;

              case "@":
                map[y][x] = Crafty.e("Player").at(x, y);
                break;

              case "#":
                map[y][x] = Crafty.e("EmptySpace").at(x, y);
                break;
            }
            i++;
        }
    }
}

function initiatePalette() {
    $("td").each(function() {
        var component = $(this).children().attr("id");
        Crafty.e(component);
    });
}