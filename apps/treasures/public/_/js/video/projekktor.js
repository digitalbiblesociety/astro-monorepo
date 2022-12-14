/*!
 * projekktor zwei V 1.0.00 (r106) 
 * http://www.projekktor.com
 * Copyright 2010, 2011, Sascha Kluger, Spinning Airwhale Media, http://www.spinningairwhale.com
 * under GNU General Public License
 * http://www.projekktor.com/license/
 *
 * You can use, modify and distribute the software, but do so in the spirit of Open Source.
 * You need to leave the copyright notices intact.
 * You need to be able to share any modifications you make to the Projekktor source (not the software Projekktor is integrated to).
 * Give credit where credit is due, spread the word, link to us if you can.
 */
jQuery(function ($) {
    if ($.browser.msie) {
        (function () {
            if (! /*@cc_on!@*/
            0) {
                return
            }
            var e = "div,audio,video,source".split(",");
            for (var i = 0; i < e.length; i++) {
                document.createElement(e[i])
            }
        })();
        if (!Array.prototype.indexOf) {
            Array.prototype.indexOf = function (obj, start) {
                for (var i = (start || 0), j = this.length; i < j; i++) {
                    if (this[i] == obj) {
                        return i
                    }
                }
                return -1
            }
        }
    }
    var projekktors = [];

    function Iterator(arr) {
        this.length = arr.length;
        this.each = function (fn) {
            $.each(arr, fn)
        };
        this.size = function () {
            return arr.length
        }
    }
    if ($.prop == undefined || $().jquery < "1.6") {
        $.fn.prop = function (arga, argb) {
            return $(this).attr(arga, argb)
        }
    }
    projekktor = $p = function () {
        var arg = arguments[0],
            instances = [],
            plugins = [];
        if (!arguments.length) {
            return projekktors[0] || null
        }
        if (typeof arg == "number") {
            return projekktors[arg]
        }
        if (typeof arg == "string") {
            if (arg == "*") {
                return new Iterator(projekktors)
            }
            for (var i = 0; i < projekktors.length; i++) {
                try {
                    if (projekktors[i].getId() == arg.id) {
                        instances.push(projekktors[i]);
                        continue
                    }
                } catch (e) {}
                try {
                    for (var j = 0; j < $(arg).length; j++) {
                        if (projekktors[i].env.playerDom.get(0) == $(arg).get(j)) {
                            instances.push(projekktors[i]);
                            continue
                        }
                    }
                } catch (e) {}
                try {
                    if (projekktors[i].getParent() == arg) {
                        instances.push(projekktors[i]);
                        continue
                    }
                } catch (e) {}
                try {
                    if (projekktors[i].getId() == arg) {
                        instances.push(projekktors[i]);
                        continue
                    }
                } catch (e) {}
            }
            if (instances.length > 0) {
                return (instances.length == 1) ? instances[0] : new Iterator(instances)
            }
        }
        if (instances.length == 0) {
            var cfg = arguments[1] || {};
            var callback = arguments[2] || {};
            if (typeof arg == "string") {
                var count = 0,
                    playerA;
                $.each($(arg), function () {
                    playerA = new PPlayer($(this), cfg, callback);
                    projekktors.push(playerA);
                    count++
                });
                return (count > 1) ? new Iterator(projekktors) : playerA
            } else {
                if (arg) {
                    projekktors.push(new PPlayer(arg, cfg, callback));
                    return new Iterator(projekktors)
                }
            }
        }
        return null;

        function PPlayer(srcNode, cfg, onReady) {
            this.config = new projekktorConfig("1.0.00");
            this._persCfg = ["enableNativePlayback", "enableFlashFallback", "volume"];
            this.env = {
                muted: false,
                inFullscreen: false,
                playerStyle: null,
                scrollTop: null,
                scrollLeft: null,
                bodyOverflow: null,
                playerDom: null,
                mediaContainer: null,
                agent: "standard",
                mouseIsOver: false,
                loading: false,
                autoSize: false,
                className: "",
                onReady: onReady
            };
            this.media = [null];
            this._plugins = [];
            this._queue = [];
            this._cuePoints = {};
            this.listeners = [];
            this.playerModel = {};
            this._isReady = false;
            this._compTableCache = false;
            this._currentItem = 0;
            this._playlistServer = "";
            this._id = "";
            this._reelUpdate = function (obj) {
                this.env.loading = true;
                switch (typeof obj) {
                default:
                    obj = [{
                        file: "",
                        type: "",
                        errorCode: 98
                    }];
                    break;
                case "object":
                    if (obj.length == 0) {
                        obj = [{
                            file: "",
                            type: "",
                            errorCode: 97
                        }]
                    }
                    break;
                case "undefined":
                    obj = [{
                        file: "",
                        type: "",
                        errorCode: 97
                    }];
                    break
                }
                var ref = this,
                    data = obj;
                this.media = [];
                try {
                    var changes = false;
                    for (var props in data.config) {
                        if (typeof data.config[props].indexOf("objectfunction") > -1) {
                            continue
                        }
                        this.config[props] = eval(data.config[props]);
                        changes = true
                    }
                    delete(data.config);
                    if (changes === true) {
                        this._debug("Updated config var: " + props + " to " + this.config[props]);
                        this._promote("configModified")
                    }
                } catch (e) {}
                var files = data.playlist || data;
                for (var item in files) {
                    if (typeof files[item] == "function") {
                        continue
                    }
                    if (typeof files[item] == undefined) {
                        continue
                    }
                    if (files[item]) {
                        this._addItem(this._prepareMedia({
                            file: files[item],
                            config: files[item].config || {},
                            errorCode: files[item].errorCode
                        }))
                    }
                }
                this.env.loading = false;
                this._promote("scheduled", this.getItemCount());
                this._syncPlugins(function () {
                    ref.setActiveItem(0)
                })
            };
            this._addItem = function (data, idx, replace) {
                var resultIdx = 0;
                if (this.media.length === 1 && this.media[0].mediaModel == "NA") {
                    this._detachplayerModel();
                    this.media = []
                }
                if (idx === undefined || idx < 0 || idx > this.media.length - 1) {
                    this.media.push(data);
                    resultIdx = this.media.length - 1
                } else {
                    this.media.splice(idx, (replace === true) ? 1 : 0, data);
                    resultIdx = idx
                }
                if (this.env.loading === false) {
                    this._promote("scheduleModified", this.getItemCount())
                }
                return resultIdx
            };
            this._removeItem = function (idx) {
                var resultIdx = 0;
                if (this.media.length === 1) {
                    if (this.media[0].mediaModel == "NA") {
                        return 0
                    } else {
                        this.media[0] = this._prepareMedia({
                            file: ""
                        });
                        return 0
                    }
                }
                if (idx === undefined || idx < 0 || idx > this.media.length - 1) {
                    this.media.pop();
                    resultIdx = this.media.length
                } else {
                    this.media.splice(idx, 1);
                    resultIdx = idx
                }
                if (this.env.loading === false) {
                    this._promote("scheduleModified", this.getItemCount())
                }
                return resultIdx
            };
            this._prepareMedia = function (data) {
                var mediaFile = "",
                    extTypes = {},
                    typesModels = {},
                    errorCode = data.errorCode || 7,
                    priority = [],
                    modelSets = [];
                result = {};
                var extRegEx = [];
                for (var i in $p.mmap) {
                    if ($p.mmap[i].platform && $p.mmap[i].platform.toUpperCase() == "FLASH") {
                        if (!this.getFlashVersion() > 0) {
                            continue
                        }
                        if (this.getConfig("enableFlashFallback") == false) {
                            continue
                        }
                    }
                    if ($p.mmap[i].platform && $p.mmap[i].platform.toUpperCase() == "NATIVE") {
                        if (!this.getCanPlayNatively($p.mmap[i].type)) {
                            continue
                        }
                        if (this.getConfig("enableNativePlayback") == false) {
                            continue
                        }
                        if (data.config && data.config.flashStreamType == "rtmp") {
                            continue
                        }
                    }
                    $p.mmap[i].level = this.config._platformPriority.indexOf($p.mmap[i].platform);
                    $p.mmap[i].level = ($p.mmap[i].level < 0) ? 100 : $p.mmap[i].level;
                    extRegEx.push("." + $p.mmap[i].ext);
                    if (!extTypes[$p.mmap[i].ext]) {
                        extTypes[$p.mmap[i].ext] = new Array()
                    }
                    extTypes[$p.mmap[i].ext].push($p.mmap[i]);
                    if (!typesModels[$p.mmap[i].type]) {
                        typesModels[$p.mmap[i].type] = new Array()
                    }
                    typesModels[$p.mmap[i].type].push($p.mmap[i])
                }
                extRegEx = "^.*.(" + extRegEx.join("|") + ")$";
                if (typeof data.file == "string") {
                    data.file = [{
                        src: data.file
                    }];
                    if (typeof data.type == "string") {
                        data.file = [{
                            src: data.file,
                            type: data.type
                        }]
                    }
                }
                if (data.file === false) {
                    data.file = [{
                        src: ""
                    }]
                }
                for (var index in data.file) {
                    if (index == "config") {
                        continue
                    }
                    if (typeof data.file[index] == "string") {
                        data.file[index] = {
                            src: data.file[index]
                        }
                    }
                    if (data.file[index].src == undefined) {
                        continue
                    }
                    try {
                        data.file[index].ext = data.file[index].src.match(new RegExp(extRegEx))[1];
                        data.file[index].ext = (!data.file[index].ext) ? "NaN" : data.file[index].ext.replace(".", "")
                    } catch (e) {
                        data.file[index].ext = "NaN"
                    }
                    if (data.file[index].type !== undefined && data.file[index].type !== "") {
                        try {
                            var codecMatch = data.file[index].type.split(" ").join("").split(/[\;]codecs=.([a-zA-Z0-9\,]*)[\'|\"]/i);
                            if (codecMatch[1] !== undefined) {
                                data.file[index].codec = codecMatch[1];
                                data.file[index].type = codecMatch[0]
                            }
                        } catch (e) {}
                        if (typesModels[data.file[index].type]) {
                            modelSets = $.merge(modelSets, typesModels[data.file[index].type])
                        }
                    } else {
                        if (extTypes[data.file[index].ext]) {
                            modelSets = $.merge(modelSets, extTypes[data.file[index].ext])
                        }
                    }
                }
                if (modelSets.length == 0) {
                    modelSets = typesModels["none/none"]
                } else {
                    modelSets.sort(function (a, b) {
                        return a.level - b.level
                    })
                }
                for (var index in data.file) {
                    if (data.file[index].type == modelSets[0].type || modelSets[0].type == "none/none") {
                        result = {
                            setup: data.file,
                            ID: $p.utils.randomId(8),
                            type: data.file[index].type,
                            ext: data.file[index].ext,
                            file: (data.config.flashStreamType != "rtmp") ? $p.utils.toAbsoluteURL(data.file[index].src) : data.file[index].src,
                            mediaModel: modelSets[0].model || "NA",
                            errorCode: errorCode,
                            config: data.config || {}
                        };
                        break
                    }
                }
                return result
            };
            this._modelUpdateListener = function (type, value) {
                var ref = this;
                if (!this.playerModel.init) {
                    return
                }
                if (type != "time" && type != "progress") {
                    this._debug("Received model Update: '" + type + "' (" + value + ") while handling '" + this.playerModel.getFile() + "' using '" + this.playerModel.getModelName() + "'")
                }
                switch (type) {
                case "state":
                    this._promote("state", value);
                    switch (value) {
                    case "IDLE":
                    case "AWAKENING":
                    case "BUFFERING":
                    case "PLAYING":
                        break;
                    case "ERROR":
                        this._addGUIListeners();
                        this._promote("error", {});
                        break;
                    case "STOPPED":
                        this._promote("stopped", {});
                        break;
                    case "PAUSED":
                        if (this.getConfig("disablePause") === true) {
                            this.playerModel.applyCommand("play", 0)
                        }
                        break;
                    case "COMPLETED":
                        if (this._currentItem + 1 >= this.media.length) {
                            if (this.getInFullscreen() === true) {
                                this.setFullscreen(false)
                            }
                            this._promote("done", {})
                        }
                        this.setActiveItem("next");
                        break
                    }
                    break;
                case "buffer":
                    this._promote("buffer", value);
                    break;
                case "modelReady":
                    this._promote("item", ref._currentItem);
                    break;
                case "displayReady":
                    this._promote("displayReady", true);
                    this._addGUIListeners();
                    this._syncPlugins();
                    break;
                case "FFreinit":
                    break;
                case "seek":
                    this._promote("seek", {
                        dest: value
                    });
                    break;
                case "volume":
                    this.setConfig({
                        volume: value
                    });
                    this._promote("volume", value);
                    if (value <= 0) {
                        this.env.muted = true;
                        this._promote("mute", value)
                    } else {
                        if (this.env.muted == true) {
                            this.env.muted = false;
                            this._promote("unmute", value)
                        }
                    }
                    break;
                case "resume":
                case "progress":
                case "time":
                case "fullscreen":
                case "resize":
                case "start":
                    this._promote(type, value);
                    break;
                case "playlist":
                    this.setFile(value, true);
                    break;
                case "config":
                    this.setConfig(value);
                    break;
                case "scaled":
                    if (this.env.autoSize === true) {
                        this.env.playerDom.css({
                            height: value.realHeight + "px",
                            width: value.realWidth + "px"
                        });
                        this._promote("resize", value);
                        this.env.autoSize = false;
                        break
                    }
                    this._promote("scaled", value);
                    break
                }
            };
            this._syncPlugins = function (callback) {
                var ref = this;
                this.env.loading = true;
                (function () {
                    try {
                        if (ref._plugins.length > 0) {
                            for (var i = 0; i < ref._plugins.length; i++) {
                                if (ref._plugins[i].pluginReady !== true) {
                                    setTimeout(arguments.callee, 50);
                                    return
                                }
                            }
                        }
                        ref.env.loading = false;
                        ref._promote("pluginsReady", {});
                        if (ref._isReady === true) {
                            ref._promote("ready", ref.getItemIdx());
                            ref._enqueue(function () {
                                try {
                                    ref._applyCuePoints()
                                } catch (e) {}
                            })
                        }
                        try {
                            callback()
                        } catch (e) {}
                    } catch (e) {}
                })()
            };
            this._MD = function (event) {
                projekktor("#" + event.currentTarget.id.replace("_media", ""))._displayMousedownListener(event)
            };
            this._addGUIListeners = function () {
                var ref = this;
                this._removeGUIListeners();
                if (this.getDC().get(0).addEventListener) {
                    this.getDC().get(0).addEventListener("mousedown", this._MD, true)
                } else {
                    this.getDC().mousedown(function (event) {
                        ref._displayMousedownListener(event)
                    })
                }
                this.getDC().mousemove(function (event) {
                    ref._displayMousemoveListener(event)
                }).mouseenter(function (event) {
                    ref._displayMouseEnterListener(event)
                }).mouseleave(function (event) {
                    ref._displayMouseLeaveListener(event)
                });
                $(window).bind("resize.projekktor" + this.getId(), function () {
                    ref.playerModel.applyCommand("resize")
                });
                if (this.config.enableKeyboard === true) {
                    if (!$.browser.mozilla) {
                        $(document.documentElement).unbind("keydown.pp" + this._id);
                        $(document.documentElement).bind("keydown.pp" + this._id, function (evt) {
                            ref._keyListener(evt)
                        })
                    } else {
                        $(document.documentElement).unbind("keypress.pp" + this._id);
                        $(document.documentElement).bind("keypress.pp" + this._id, function (evt) {
                            ref._keyListener(evt)
                        })
                    }
                }
            };
            this._removeGUIListeners = function () {
                $("#" + this.getId()).unbind();
                this.getDC().unbind();
                if (this.getDC().get(0).removeEventListener) {
                    this.getDC().get(0).removeEventListener("mousedown", this._MD, true)
                } else {
                    this.getDC().get(0).detachEvent("onmousedown", this._MD)
                }
                $(window).unbind("resize.projekktor" + this.getId())
            };
            this._registerPlugins = function () {
                var plugins = $.merge($.merge([], this.config._plugins), this.config._addplugins);
                if (this._plugins.length > 0) {
                    return
                }
                if (plugins.length == 0) {
                    return
                }
                for (var i = 0; i < plugins.length; i++) {
                    var pluginName = "projekktor" + plugins[i].charAt(0).toUpperCase() + plugins[i].slice(1);
                    try {
                        typeof eval(pluginName)
                    } catch (e) {
                        continue
                    }
                    var pluginObj = $.extend(true, {}, new projekktorPluginInterface(), eval(pluginName).prototype);
                    pluginObj.name = plugins[i].toLowerCase();
                    pluginObj.pp = this;
                    pluginObj.playerDom = this.env.playerDom;
                    pluginObj._init(this.config["plugin_" + plugins[i].toLowerCase()] || {});
                    this._plugins.push(pluginObj)
                }
            };
            this.removePlugin = function (rmvPl) {
                if (this._plugins.length == 0) {
                    return
                }
                var pluginsToRemove = rmvPl || $.merge($.merge([], this.config._plugins), this.config._addplugins),
                    pluginsRegistered = this._plugins.length;
                for (var j = 0; j < pluginsToRemove.length; j++) {
                    for (var k = 0; k < pluginsRegistered; k++) {
                        if (this._plugins[k] != undefined) {
                            if (this._plugins[k].name == pluginsToRemove[j].toLowerCase()) {
                                this._plugins[k].deconstruct();
                                this._plugins.splice(k, 1)
                            }
                        }
                    }
                }
            };
            this._promote = function (evt, value) {
                var event = evt,
                    pluginData = {};
                if (typeof event == "object") {
                    if (!event._plugin) {
                        return
                    }
                    value.PLUGIN = event._plugin + "";
                    value.EVENT = event._event + "";
                    event = "pluginevent"
                }
                if (event != "time" && event != "progress" && event != "mousemove") {
                    this._debug("Fireing :" + event)
                }
                if (this._plugins.length > 0) {
                    for (var i in this._plugins) {
                        try {
                            this._plugins[i][event + "Handler"](value, this)
                        } catch (e) {}
                    }
                }
                if (this.listeners.length > 0) {
                    for (var i in this.listeners) {
                        try {
                            if (this.listeners[i]["event"] == event || this.listeners[i]["event"] == "*") {
                                this.listeners[i]["callback"](value, this)
                            }
                        } catch (e) {}
                    }
                }
            };
            this._detachplayerModel = function () {
                this._removeGUIListeners();
                try {
                    this.playerModel.destroy()
                } catch (e) {}
                this._promote("detach", {})
            };
            this._displayMousedownListener = function (evt) {
                if (!this.env.mouseIsOver) {
                    return false
                }
                switch (evt.which) {
                case 1:
                    this._promote("leftclick", evt);
                    break;
                case 2:
                    this._promote("middleclick", evt);
                    break;
                case 3:
                    evt.stopPropagation();
                    evt.preventDefault();
                    $(document).bind("contextmenu", function (evt) {
                        $(document).unbind("contextmenu");
                        return false
                    });
                    this._promote("rightclick", evt);
                    break
                }
                return false
            };
            this._displayMousemoveListener = function (evt) {
                if ("TEXTAREA|INPUT".indexOf(evt.target.tagName.toUpperCase()) > -1) {
                    this.env.mouseIsOver = false
                }
                this._promote("mousemove", {});
                evt.stopPropagation()
            };
            this._displayMouseEnterListener = function (evt) {
                this._promote("mouseenter", {});
                this.env.mouseIsOver = true;
                evt.stopPropagation()
            };
            this._displayMouseLeaveListener = function (evt) {
                this._promote("mouseleave", {});
                this.env.mouseIsOver = false;
                evt.stopPropagation()
            };
            this._keyListener = function (evt) {
                if (!this.env.mouseIsOver) {
                    return
                }
                evt.stopPropagation();
                evt.preventDefault();
                this._debug("Keypress: " + evt.keyCode);
                this._promote("key", evt.keyCode);
                switch (evt.keyCode) {
                case 27:
                    this.setFullscreen(false);
                    break;
                case 13:
                    this.setFullscreen(true);
                    break;
                case 39:
                    this.setActiveItem("next");
                    break;
                case 37:
                    this.setActiveItem("previous");
                    break;
                case 123:
                    break;
                default:
                    this.setPlayPause();
                    break
                }
                return false
            };
            this._enterFullViewport = function () {
                if (this.env.inFullscreen === true) {
                    return
                }
                this.env.scrollTop = $(window).scrollTop();
                this.env.scrollLeft = $(window).scrollLeft();
                this.env.playerStyle = this.getDC().attr("style");
                this.env.bodyOverflow = $("body").css("overflow");
                $(window).scrollTop(0).scrollLeft(0);
                $("body").css("overflow", "hidden");
                this.env.playerDom.css({
                    position: "fixed",
                    display: "block",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    margin: 0,
                    padding: 0,
                    zIndex: 99997
                });
                this.env.inFullscreen = true
            };
            this._exitFullViewport = function () {
                if (this.env.inFullscreen === false) {
                    return
                }
                this.getDC().attr("style", this.env.playerStyle);
                $("body").css("overflow", this.env.bodyOverflow);
                $(window).scrollTop(this.env.scrollTop);
                $(window).scrollLeft(this.env.scrollLef);
                if (this.getDC().width() != this.config._width || this.getDC().height() != this.config._height) {
                    this.getDC().css({
                        width: this.config._width + "px",
                        height: this.config._height + "px"
                    })
                }
                this._modelUpdateListener("resize");
                this.env.inFullscreen = false
            };
            this._enterIframeFullViewport = function () {
                if (this.env.inFullscreen === true) {
                    return
                }
                var win = this.getIframeWindow(),
                    iframe = this.getIframe();
                if (!win || !iframe) {
                    return
                }
                this.env.scrollTop = win.scrollTop();
                this.env.scrollLeft = win.scrollLeft();
                this.env.playerStyle = iframe.attr("style");
                this.env.iframeWidth = iframe.attr("width");
                this.env.iframeHeight = iframe.attr("height");
                this.env.bodyOverflow = $(win[0].document.body).css("overflow");
                win.scrollTop(0);
                win.scrollLeft(0);
                $(win[0].document.body).css("overflow", "hidden");
                iframe.css({
                    position: "fixed",
                    display: "block",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: 9999,
                    margin: 0,
                    padding: 0
                });
                this.env.inFullscreen = true
            };
            this._exitIframeFullViewport = function () {
                if (this.env.inFullscreen === false) {
                    return
                }
                var win = this.getIframeWindow();
                var iframe = this.getIframe();
                if (!win || !iframe) {
                    return
                }
                win.scrollTop(this.env.scrollTop);
                win.scrollLeft(this.env.scrollLef);
                $(win[0].document.body).css("overflow", this.env.bodyOverflow);
                iframe.attr("width", this.env.iframeWidth + "px");
                iframe.attr("height", this.env.iframeHeight + "px");
                iframe.attr("style", (this.env.playerStyle == undefined) ? "" : this.env.playerStyle);
                this.env.inFullscreen = false
            };
            this.getItemConfig = function (name, itemIdx) {
                return this.getConfig(name, itemIdx)
            };
            this.getConfig = function (name, itemIdx) {
                var idx = itemIdx || this._currentItem,
                    result = undefined,
                    playerCfg = (this.config["_" + name]) ? this.config["_" + name] : this.config[name];
                if (playerCfg !== undefined) {
                    result = playerCfg;
                    if ($.inArray(name, this._persCfg) > -1) {
                        if (this._cookie(name) !== null) {
                            result = this._cookie(name)
                        }
                    }
                    if (this.config["_" + name] == undefined) {
                        try {
                            if (this.media[idx]["config"][name] !== undefined) {
                                result = this.media[idx]["config"][name]
                            }
                        } catch (e) {}
                    }
                } else {
                    if (name.indexOf("plugin_") > -1) {
                        try {
                            if (this.media[idx]["config"][name]) {
                                result = this.media[idx]["config"][name]
                            }
                        } catch (e) {}
                    }
                }
                return result
            };
            this.getItemCount = function () {
                return this.media.length
            };
            this.getDC = function () {
                return this.env.playerDom
            };
            this.getState = function (isThis) {
                var result = null;
                try {
                    result = this.playerModel.getState()
                } catch (e) {
                    result = "IDLE"
                }
                if (isThis != null) {
                    return (result == isThis.toUpperCase())
                }
                return result
            };
            this.getLoadProgress = function () {
                try {
                    return this.playerModel.getLoadProgress()
                } catch (e) {
                    return 0
                }
            };
            this.getKbPerSec = function () {
                try {
                    return this.playerModel.getKbPerSec()
                } catch (e) {
                    return 0
                }
            };
            this.getItemId = function (idx) {
                if (idx == undefined) {
                    return this.media[this._currentItem].ID
                }
                return this.media[idx].ID
            };
            this.getItemIdx = function () {
                return this._currentItem
            };
            this.getItem = function () {
                arg = arguments[0] || "current";
                switch (arg) {
                case "next":
                    return $.extend(true, [], this.media[this._currentItem + 1]);
                case "prev":
                    return $.extend(true, [], this.media[this._currentItem - 1]);
                case "current":
                    return $.extend(true, [], this.media[this._currentItem]);
                case "*":
                    return $.extend(true, [], this.media);
                default:
                    return $.extend(true, [], this.media[arg])
                }
            };
            this.getVolume = function () {
                return (this.getConfig("fixedVolume") === true) ? this.config.volume : this.getConfig("volume")
            };
            this.getTrackId = function () {
                if (this.getConfig("trackId")) {
                    return this.config.trackId
                }
                if (this._playlistServer != null) {
                    return "pl" + this._currentItem
                }
                return null
            };
            this.getLoadPlaybackProgress = function () {
                try {
                    return this.playerModel.getLoadPlaybackProgress()
                } catch (e) {
                    return 0
                }
            };
            this.getDuration = function () {
                try {
                    return this.playerModel.getDuration()
                } catch (e) {
                    return 0
                }
            };
            this.getPosition = function () {
                try {
                    return this.playerModel.getPosition() || 0
                } catch (e) {
                    return 0
                }
            };
            this.getTimeLeft = function () {
                try {
                    return this.playerModel.getDuration() - this.playerModel.getPosition()
                } catch (e) {
                    return this.media[this._currentItem].duration
                }
            };
            this.getInFullscreen = function () {
                return this.env.inFullscreen
            };
            this.getMediaContainer = function () {
                if (this.env.mediaContainer == null) {
                    this.env.mediaContainer = $("#" + this.getMediaId())
                }
                if (this.env.mediaContainer.length == 0) {
                    if (this.env.playerDom.find("." + this.config._cssClassPrefix + "display").length > 0) {
                        this.env.mediaContainer = $(document.createElement("div")).attr({
                            id: this.getId() + "_media"
                        }).css({
                            overflow: "hidden",
                            height: "100%",
                            width: "100%",
                            top: 0,
                            left: 0,
                            padding: 0,
                            margin: 0,
                            display: "block"
                        }).appendTo(this.env.playerDom.find("." + this.config._cssClassPrefix + "display"))
                    } else {
                        this.env.mediaContainer = $(document.createElement("div")).attr({
                            id: this.getMediaId()
                        }).css({
                            width: "1px",
                            height: "1px"
                        }).appendTo($(document.body))
                    }
                }
                return this.env.mediaContainer
            };
            this.getMediaId = function () {
                return this.getId() + "_media"
            };
            this.getMediaType = function () {
                return this.media[this._currentItem].type
            };
            this.getUsesFlash = function () {
                return (this.playerModel.requiresFlash !== false)
            };
            this.getModel = function () {
                try {
                    return this.media[this._currentItem].mediaModel.toUpperCase()
                } catch (e) {
                    return "NA"
                }
            };
            this.getIframeWindow = function () {
                try {
                    return $(parent.window)
                } catch (e) {
                    return false
                }
            };
            this.getIframe = function () {
                try {
                    return window.$(frameElement)
                } catch (e) {
                    return false
                }
            };
            this.getPlaylist = function () {
                return this.getItem("*")
            };
            this.getFlashVersion = function () {
                try {
                    try {
                        var axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
                        try {
                            axo.AllowScriptAccess = "always"
                        } catch (e) {
                            return "6,0,0"
                        }
                    } catch (e) {}
                    return new ActiveXObject("ShockwaveFlash.ShockwaveFlash").GetVariable("$version").replace(/\D+/g, ",").match(/^,?(.+),?$/)[1].match(/\d+/g)[0]
                } catch (e) {
                    try {
                        if (navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin) {
                            return (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]).description.replace(/\D+/g, ",").match(/^,?(.+),?$/)[1].match(/\d+/g)[0]
                        }
                    } catch (e) {}
                }
                return "0,0,0".match(/\d+/g)[0]
            };
            this.getCanPlayNatively = function (type) {
                var checkFor = [];
                if (this._compTableCache == false) {
                    this._compTableCache = this._testMediaSupport()
                }
                switch (typeof type) {
                case "undefined":
                    if (this._compTableCache.media.length > 0) {
                        return true
                    }
                case "string":
                    checkFor.push(type);
                    break;
                case "array":
                    checkFor = type;
                    break
                }
                for (var i in checkFor) {
                    if ($.inArray(checkFor[i], this._compTableCache.all) > -1) {
                        return true
                    }
                }
                return false
            };
            this.getNativeFullscreenSupport = function () {
                if (this.getConfig("enableNativeFullscreen") == false) {
                    return false
                }
                var ref = this,
                    fullScreenApi = {
                        supportsFullScreen: false,
                        isFullScreen: function () {
                            return false
                        },
                        requestFullScreen: function () {},
                        cancelFullScreen: function () {},
                        fullScreenEventName: "",
                        prefix: ""
                    },
                    browserPrefixes = "webkit moz o ms khtml".split(" ");
                if (typeof document.cancelFullScreen != "undefined") {
                    fullScreenApi.supportsFullScreen = true
                } else {
                    for (var i = 0, il = browserPrefixes.length; i < il; i++) {
                        fullScreenApi.prefix = browserPrefixes[i];
                        if (typeof document[fullScreenApi.prefix + "CancelFullScreen"] != "undefined") {
                            fullScreenApi.supportsFullScreen = true;
                            break
                        }
                    }
                }
                if (!fullScreenApi.supportsFullScreen) {
                    return false
                }
                fullScreenApi.fullScreenEventName = fullScreenApi.prefix + "fullscreenchange";
                fullScreenApi.isFullScreen = function () {
                    var dest = (ref.config._iframe) ? parent.window.document : document;
                    switch (this.prefix) {
                    case "":
                        return dest.fullScreen;
                    case "webkit":
                        return dest.webkitIsFullScreen;
                    default:
                        return dest[this.prefix + "FullScreen"]
                    }
                };
                fullScreenApi.requestFullScreen = function (el) {
                    return (this.prefix === "") ? el.requestFullScreen() : el[this.prefix + "RequestFullScreen"]()
                };
                fullScreenApi.cancelFullScreen = function (el) {
                    var dest = (ref.config._iframe) ? parent.window.document : document;
                    return (this.prefix === "") ? dest.cancelFullScreen() : dest[this.prefix + "CancelFullScreen"]()
                };
                return fullScreenApi
            };
            this.getId = function () {
                return this._id
            };
            this.getHasGUI = function () {
                try {
                    return this.playerModel.getHasGUI()
                } catch (e) {
                    return false
                }
            };
            this.getCssPrefix = function () {
                return this.config._cssClassPrefix
            };
            this.getPlayerDimensions = function () {
                return {
                    width: this.config._width,
                    height: this.config._height
                }
            };
            this.getMediaDimensions = function () {
                return {
                    width: this.config._width,
                    height: this.config._height
                }
            };
            this.getFromUrl = function (url, dest, callback, customParser, dataType) {
                var data = null,
                    ref = this;
                if (dest == ref && callback == "_reelUpdate") {
                    this._promote("scheduleLoading", 1 + this.getItemCount())
                }
                if (callback.substr(0, 1) != "_") {
                    window[callback] = function (data) {
                        try {
                            delete window[callback]
                        } catch (e) {}
                        dest[callback](data)
                    }
                } else {
                    this["_jsonp" + callback] = function (data) {
                        dest[callback](data)
                    }
                }
                if (dataType) {
                    if ($.parseJSON == undefined && dataType.indexOf("json") > -1) {
                        this._raiseError("Projekktor requires jQuery 1.4.2 in order to handle JSON playlists.");
                        return this
                    }
                    dataType = (dataType.indexOf("/") > -1) ? dataType.split("/")[1] : dataType
                }
                $.ajax({
                    url: url,
                    complete: function (xhr, status) {
                        if (dataType == undefined) {
                            try {
                                if (xhr.getResponseHeader("Content-Type").indexOf("xml") > -1) {
                                    dataType = "xml"
                                }
                                if (xhr.getResponseHeader("Content-Type").indexOf("json") > -1) {
                                    dataType = "json"
                                }
                                if (xhr.getResponseHeader("Content-Type").indexOf("html") > -1) {
                                    dataType = "html"
                                }
                            } catch (e) {}
                        }
                        switch (dataType) {
                        case "html":
                        case "xml":
                            if (window.DOMParser) {
                                data = new DOMParser();
                                data = data.parseFromString(xhr.responseText, "text/xml")
                            } else {
                                data = new ActiveXObject("Microsoft.XMLDOM");
                                data.async = "false";
                                data.loadXML(xhr.responseText)
                            }
                            break;
                        case "json":
                            data = xhr.responseText;
                            if (typeof data == "string") {
                                data = $.parseJSON(data)
                            }
                            break;
                        case "jsonp":
                            break;
                        default:
                            data = xhr.responseText;
                            break
                        }
                        try {
                            data = customParser(data, xhr.responseText)
                        } catch (e) {}
                        if (status != "error" && dataType != "jsonp") {
                            dest[callback](data)
                        }
                    },
                    error: function (data) {
                        if (dataType != "jsonp") {
                            dest[callback](false)
                        }
                    },
                    cache: true,
                    dataType: dataType,
                    jsonpCallback: (callback.substr(0, 1) != "_") ? false : "projekktor('" + this.getId() + "')._jsonp" + callback,
                    jsonp: (callback.substr(0, 1) != "_") ? false : "callback"
                });
                return this
            };
            this.setActiveItem = function (mixedData) {
                var newItem = 0;
                var lastItem = this._currentItem;
                if (this.env.loading === true) {
                    return this
                }
                if (typeof mixedData == "string") {
                    switch (mixedData) {
                    case "previous":
                        if (this.getConfig("disallowSkip") == true && !this.getState("COMPLETED")) {
                            return this
                        }
                        newItem = this._currentItem - 1;
                        break;
                    case "next":
                        if (this.getConfig("disallowSkip") == true && !this.getState("COMPLETED")) {
                            return this
                        }
                        newItem = this._currentItem + 1;
                        break;
                    default:
                    case "poster":
                        result = 0;
                        break
                    }
                } else {
                    if (typeof mixedData == "number") {
                        newItem = parseInt(mixedData)
                    } else {
                        newItem = 0
                    }
                }
                if (newItem != this._currentItem) {
                    if (this.getConfig("disallowSkip") == true && !this.getState("COMPLETED")) {
                        return this
                    }
                }
                this._detachplayerModel();
                var ap = false;
                if (newItem === 0 && lastItem == 0 && (this.config._autoplay === true || this.getState().indexOf("IDLE|STOPPED") > -1)) {
                    ap = true
                } else {
                    if (this.getItemCount() > 1 && newItem != lastItem && this.config._continuous === true && newItem < this.getItemCount()) {
                        ap = true
                    }
                }
                if (newItem >= this.getItemCount() || newItem < 0) {
                    ap = this.config._loop;
                    newItem = 0
                }
                this._currentItem = newItem;
                this.getDC().attr("class", this.env.className);
                var newModel = this.media[this._currentItem].mediaModel.toUpperCase();
                if (!$p.models[newModel]) {
                    newModel = "NA";
                    this.media[this._currentItem].mediaModel = newModel;
                    this.media[this._currentItem].errorCode = 8
                } else {
                    if (this.getConfig("className") !== false) {
                        this.getDC().addClass(this.getConfig("className"))
                    }
                }
                this.playerModel = new playerModel();
                $.extend(this.playerModel, $p.models[newModel].prototype);
                this.playerModel._init({
                    media: $.extend(true, {}, this.media[this._currentItem]),
                    model: newModel,
                    pp: this,
                    environment: $.extend(true, {}, this.env),
                    autoplay: ap
                });
                return this
            };
            this.getIsLastItem = function () {
                return ((this._currentItem == this.media.length - 1) && this.config._loop !== true)
            };
            this.getIsFirstItem = function () {
                return ((this._currentItem == 0) && this.config._loop !== true)
            };
            this.getIsMobileClient = function () {
                var uagent = navigator.userAgent.toLowerCase();
                var mobileAgents = ["android", "windows ce", "blackberry", "palm", "mobile"];
                for (var i = 0; i < mobileAgents.length; i++) {
                    if (uagent.indexOf(mobileAgents[i]) > -1) {
                        return true
                    }
                }
                return false
            };
            this.setPlay = function () {
                this._enqueue("play", false);
                return this
            };
            this.setPause = function () {
                this._enqueue("pause", false);
                return this
            };
            this.setStop = function (toZero) {
                var ref = this;
                if (toZero) {
                    this._enqueue(function () {
                        ref._currentItem = 0;
                        ref.setActiveItem(0)
                    })
                } else {
                    this._enqueue("stop", false)
                }
                return this
            };
            this.setPlayPause = function () {
                if (!this.getState("PLAYING")) {
                    this.setPlay()
                } else {
                    this.setPause()
                }
                return this
            };
            this.setVolume = function (vol, fadeDelay) {
                if (this.getConfig("fixedVolume") == true) {
                    return this
                }
                var initalVolume = this.getVolume();
                if (typeof vol == "string") {
                    var dir = vol.substr(0, 1);
                    vol = parseFloat(vol.substr(1));
                    vol = (vol > 1) ? vol / 100 : vol;
                    if (dir == "+") {
                        vol = this.getVolume() + vol
                    } else {
                        if (dir == "-") {
                            vol = this.getVolume() - vol
                        } else {
                            vol = this.getVolume()
                        }
                    }
                }
                if (typeof vol == "number") {
                    vol = (vol > 1) ? 1 : vol;
                    vol = (vol < 0) ? 0 : vol
                } else {
                    return this
                }
                if (vol > initalVolume && fadeDelay) {
                    if (vol - initalVolume > 0.03) {
                        for (var i = initalVolume; i <= vol; i = i + 0.03) {
                            this._enqueue("volume", i, fadeDelay)
                        }
                        this._enqueue("volume", vol, fadeDelay);
                        return this
                    }
                } else {
                    if (vol < initalVolume && fadeDelay) {
                        if (initalVolume - vol > 0.03) {
                            for (var i = initalVolume; i >= vol; i = i - 0.03) {
                                this._enqueue("volume", i, fadeDelay)
                            }
                            this._enqueue("volume", vol, fadeDelay);
                            return this
                        }
                    }
                }
                this._enqueue("volume", vol);
                return this
            };
            this.setPlayhead = function (position) {
                if (this.getConfig("disallowSkip") == true) {
                    return this
                }
                if (typeof position == "string") {
                    var dir = position.substr(0, 1);
                    position = parseFloat(position.substr(1));
                    if (dir == "+") {
                        position = this.getPosition() + position
                    } else {
                        if (dir == "-") {
                            position = this.getPosition() - position
                        } else {
                            position = this.getPosition()
                        }
                    }
                }
                if (typeof position == "number") {
                    this._enqueue("seek", position)
                }
                return this
            };
            this.setPlayerPoster = function (url) {
                var ref = this;
                this._enqueue(function () {
                    ref.setConfig({
                        poster: url
                    }, 0)
                });
                this._enqueue(function () {
                    ref.playerModel.setPosterLive()
                });
                return this
            };
            this.setItemConfig = function () {
                var ref = this,
                    args = arguments;
                this._enqueue(function () {
                    ref._setConfig(args[0] || null, args[1] || null)
                });
                return this
            };
            this.setConfig = function () {
                var ref = this,
                    args = arguments;
                this._enqueue(function () {
                    ref._setConfig(args[0] || null, args[1] || null)
                });
                return this
            };
            this._setConfig = function () {
                if (!arguments.length) {
                    return result
                }
                var confObj = arguments[0],
                    dest = "*",
                    value = false;
                if (typeof confObj != "object") {
                    return this
                }
                if (arguments[1] == "string" || arguments[1] == "number") {
                    dest = arguments[1]
                } else {
                    dest = this._currentItem
                }
                for (var i in confObj) {
                    if ($.inArray(i, this._persCfg) > -1) {
                        this._cookie(i, eval(confObj[i]))
                    }
                    if (this.config["_" + i] != undefined) {
                        continue
                    }
                    try {
                        value = eval(confObj[i])
                    } catch (e) {
                        value = confObj[i]
                    }
                    if (dest == "*") {
                        $.each(this.media, function () {
                            if (this.config == undefined) {
                                this.config = {}
                            }
                            this.config[i] = value
                        });
                        continue
                    }
                    if (this.media[dest] == undefined) {
                        return this
                    }
                    if (this.media[dest]["config"] == undefined) {
                        this.media[dest]["config"] = {}
                    }
                    this.media[dest]["config"][i] = value
                }
                return this
            };
            this.setFullscreen = function (full) {
                full = (full == null) ? !this.getInFullscreen() : full;
                if (full == this.getInFullscreen() || !this.config.enableFullscreen || this.getIsMobileClient()) {
                    return this
                }
                var nativeFullscreen = this.getNativeFullscreenSupport(),
                    ref = this;
                switch (full) {
                case true:
                    if (this.config._iframe === true) {
                        if (nativeFullscreen) {
                            this.env.inFullscreen = true;
                            nativeFullscreen.requestFullScreen(this.getIframe()[0])
                        } else {
                            this._enterIframeFullViewport()
                        }
                    } else {
                        if (nativeFullscreen) {
                            nativeFullscreen.requestFullScreen(this.getDC()[0])
                        }
                        this._enterFullViewport()
                    }
                    break;
                case false:
                    if (this.config._iframe === true) {
                        if (nativeFullscreen) {
                            this.env.inFullscreen = false;
                            nativeFullscreen.cancelFullScreen()
                        } else {
                            this._exitIframeFullViewport()
                        }
                    } else {
                        if (nativeFullscreen) {
                            nativeFullscreen.cancelFullScreen()
                        }
                        this._exitFullViewport()
                    }
                    break
                }
                this.playerModel.applyCommand("fullscreen", full);
                return this
            };
            this.setResize = function () {
                this._modelUpdateListener("resize");
                return this
            };
            this.setSize = function (data) {
                this.config._width = data.width || this.config._width;
                this.config._height = data.height || this.config._height;
                if (this.getInFullscreen() === true) {
                    return
                }
                this.getDC().css({
                    width: data.width + "px",
                    height: data.height + "px"
                });
                this._modelUpdateListener("resize")
            };
            this.addListener = function (evt, callback) {
                var ref = this;
                this._enqueue(function () {
                    ref._addListener(evt, callback)
                });
                return this
            };
            this._addListener = function (evt, callback) {
                var listenerObj = {
                    event: evt,
                    callback: callback
                };
                this.listeners.push(listenerObj);
                return this
            };
            this.removeListener = function (evt, callback) {
                var len = this.listeners.length;
                for (var i = 0; i < len; i++) {
                    if (this.listeners[i] == undefined) {
                        continue
                    }
                    if (this.listeners[i].event != evt && evt !== "*") {
                        continue
                    }
                    if (this.listeners[i].callback != callback && callback != null) {
                        continue
                    }
                    this.listeners.splice(i, 1)
                }
                return this
            };
            this.setItem = function () {
                var itemData = arguments[0];
                var affectedIdx = 0;
                this._clearqueue();
                if (this.env.loading === true) {
                    return this
                }
                if (itemData == null) {
                    affectedIdx = this._removeItem(arguments[1]);
                    if (affectedIdx === this._currentItem) {
                        this.setActiveItem("previous")
                    }
                } else {
                    affectedIdx = this._addItem(this._prepareMedia({
                        file: itemData,
                        config: itemData.config || {}
                    }), arguments[1], arguments[2]);
                    if (affectedIdx === this._currentItem) {
                        this.setActiveItem(this._currentItem)
                    }
                }
                return this
            };
            this.setFile = function (arg, ext, dataType) {
                var data = arg || {},
                    result = {},
                    externalData = ext || false;
                this._clearqueue();
                if (this.env.loading === true) {
                    return this
                }
                if (typeof data == "object" && data.length == 0) {
                    return false
                }
                this.env.loading = true;
                this._detachplayerModel();
                if (typeof data == "object") {
                    if (data.length == 0) {
                        this._reelUpdate({});
                        return false
                    }
                    this._debug("Applying incoming JS Object", data);
                    this._reelUpdate(data);
                    return this
                }
                if (typeof data == "string") {
                    var splt = [];
                    splt[0] = data;
                    if (data.indexOf(this.config._FilePosterSeparator) > -1) {
                        splt = data.split(this.config._FilePosterSeparator);
                        data.config = {
                            poster: splt[1]
                        }
                    } else {
                        result[0] = {};
                        result[0].file = data
                    }
                    if (externalData === false) {
                        this._debug("Applying incoming single file:" + result[0]["file"], data);
                        this._reelUpdate(result)
                    } else {
                        this._debug("Loading external data from " + splt[0] + " supposed to be " + dataType);
                        this._playlistServer = splt[0];
                        this.getFromUrl(splt[0], this, "_reelUpdate", this.config._reelParser, dataType)
                    }
                }
                return this
            };
            this.openUrl = function (cfg) {
                cfg = cfg || {
                    url: "",
                    target: "",
                    pause: false
                };
                window.open(cfg.url, cfg.target).focus();
                if (cfg.pause === true) {
                    this.setPause()
                }
                return this
            };
            this.selfDestruct = function () {
                var ref = this;
                this._enqueue(function () {
                    ref._selfDestruct()
                });
                return this
            }, this._selfDestruct = function () {
                var ref = this;
                $(this).unbind();
                this.removePlugin();
                this._removeGUIListeners();
                this.env.playerDom.replaceWith($(this.env.srcNode).clone());
                $.each(projekktors, function (idx) {
                    try {
                        if (this.getId() == ref.getId() || this.getId() == ref.getId() || this.getParent() == ref.getId()) {
                            projekktors.splice(idx, 1);
                            return
                        }
                    } catch (e) {}
                });
                return this
            };
            this.reset = function () {
                var ref = this;
                this._clearqueue();
                this._enqueue(function () {
                    ref._reset()
                });
                return this
            }, this._reset = function () {
                var cleanConfig = {},
                    ref = this;
                $(this).unbind();
                this.setFullscreen(false);
                this.removePlugin();
                this._removeGUIListeners();
                this.env.mediaContainer = null;
                for (var i in this.config) {
                    cleanConfig[(i.substr(0, 1) == "_") ? i.substr(1) : i] = this.config[i]
                }
                if (typeof this.env.onReady === "function") {
                    this._enqueue(ref.env.onReady(ref))
                }
                this._init(this.env.playerDom, cleanConfig);
                return this
            }, this.setCuePoint = function (obj) {
                var item = obj.item || this.getItemIdx(),
                    ref = this,
                    cuePoint = {
                        id: obj.id || $p.utils.randomId(8),
                        group: obj.group || $p.utils.randomId(8),
                        item: item,
                        on: $p.utils.toSeconds(obj.on) || 0,
                        off: $p.utils.toSeconds(obj.off) || 86400,
                        value: obj.value || null,
                        callback: obj.callback ||
                        function () {},
                        _active: false,
                        _lastTime: 0,
                        _stateListener: function (state, player) {
                            if (state == "STOPPED") {
                                if (this._active) {
                                    this.callback(false, this, player)
                                }
                                this._active = false
                            }
                        },
                        _timeListener: function (time, player) {
                            var timeIdx = $p.utils.roundNumber(time, 2);
                            if (this._lastTime == timeIdx) {
                                return
                            }
                            var nat = !(timeIdx <= this._lastTime + 1);
                            if ((timeIdx >= this.on && timeIdx < this.off) && !this._active) {
                                this._active = true;
                                try {
                                    this.callback(true, this.value, nat, player)
                                } catch (e) {}
                            } else {
                                if ((timeIdx < this.on || timeIdx > this.off) && this._active) {
                                    if (this._active == true) {
                                        this._active = false;
                                        try {
                                            this.callback(false, this.value, nat, player)
                                        } catch (e) {}
                                    }
                                }
                            }
                            this._lastTime = timeIdx
                        }
                    };
                if (this._cuePoints[item] == null) {
                    this._cuePoints[item] = []
                }
                this._cuePoints[item].push(cuePoint);
                return this
            }, this.getCuePoints = function (idx) {
                return this._cuePoints[idx || this._currentItem]
            }, this.removeCuePoint = function (group, idx) {
                var cuePoints = this.getCuePoints(idx) || [];
                if (cuePoints.length == 0) {
                    return
                }
                for (var j = 0; j < cuePoints.length; j++) {
                    if (cuePoints[j].group === group) {
                        this.removeListener("time", cuePoints[j].timeEventHandler);
                        this.removeListener("state", cuePoints[j].stateEventHandler);
                        cuePoints.splice(j, 1)
                    }
                }
            }, this._applyCuePoints = function () {
                var ref = this;
                if (this._cuePoints[this._currentItem] == null && this._cuePoints["*"] == null) {
                    return
                }
                $.each($.merge(this._cuePoints[this._currentItem] || [], this._cuePoints["*"] || []), function (key, cuePointObj) {
                    cuePointObj.timeEventHandler = function (time, player) {
                        try {
                            cuePointObj._timeListener(time, player)
                        } catch (e) {}
                    }, cuePointObj.stateEventHandler = function (state, player) {
                        try {
                            cuePointObj._stateListener(state, player)
                        } catch (e) {}
                    }, ref.addListener("time", cuePointObj.timeEventHandler);
                    ref.addListener("state", cuePointObj.stateEventHandler);
                    ref.addListener("item", function () {
                        ref.removeListener("time", cuePointObj.timeEventHandler);
                        ref.removeListener("state", cuePointObj.stateEventHandler)
                    })
                })
            }, this._enqueue = function (command, params, delay) {
                this._queue.push({
                    command: command,
                    params: params,
                    delay: delay
                });
                this._processQueue()
            };
            this._clearqueue = function (command, params) {
                if (this._isReady !== true) {
                    return
                }
                this._queue = []
            };
            this._processQueue = function () {
                var ref = this,
                    modelReady = false;
                if (this._processing === true) {
                    return
                }
                if (this.env.loading === true) {
                    return
                }
                this._processing = true;
                (function () {
                    modelReady = false;
                    try {
                        modelReady = ref.playerModel.getIsReady()
                    } catch (e) {}
                    if (ref.env.loading !== true && modelReady) {
                        var msg = ref._queue.shift();
                        if (!msg) {
                            ref._processing = false;
                            if (ref._isReady === false) {
                                ref._promote("ready", ref.getItemIdx());
                                ref._isReady = true
                            }
                            return
                        }
                        if (typeof msg.command == "string") {
                            if (msg.delay > 0) {
                                setTimeout(function () {
                                    ref.playerModel.applyCommand(msg.command, msg.params)
                                }, msg.delay)
                            } else {
                                ref.playerModel.applyCommand(msg.command, msg.params)
                            }
                        } else {
                            msg.command(ref)
                        }
                        arguments.callee();
                        return
                    }
                    setTimeout(arguments.callee, 100)
                })()
            };
            this._cookie = function (key, value) {
                if (document.cookie === undefined) {
                    return null
                }
                if (document.cookie === false) {
                    return null
                }
                if (key == null) {
                    return null
                }
                if (arguments.length > 1 && (value === null || typeof value !== "object")) {
                    var t = new Date();
                    t.setDate(t.getDate() + this.config._cookieExpiry);
                    return (document.cookie = encodeURIComponent(this.config._cookieName + "_" + key) + "=" + encodeURIComponent(value) + "; expires=" + t.toUTCString() + "; path=/")
                }
                var result, returnthis = (result = new RegExp("(?:^|; )" + encodeURIComponent(this.config._cookieName + "_" + key) + "=([^;]*)").exec(document.cookie)) ? decodeURIComponent(result[1]) : null;
                return eval(returnthis)
            };
            this._getTypeFromFileExtension = function (url) {
                var fileExt = "",
                    extRegEx = [],
                    extTypes = {},
                    extRegEx = [];
                for (var i in $p.mmap) {
                    extRegEx.push("." + $p.mmap[i].ext);
                    extTypes[$p.mmap[i].ext] = $p.mmap[i]
                }
                extRegEx = "^.*.(" + extRegEx.join("|") + ")";
                try {
                    fileExt = url.match(new RegExp(extRegEx))[1];
                    fileExt = (!fileExt) ? "NaN" : fileExt.replace(".", "")
                } catch (e) {
                    fileExt = "NaN"
                }
                return extTypes[fileExt].type
            };
            this._testMediaSupport = function () {
                var nativeElementType = "",
                    result = {
                        all: [],
                        media: []
                    };
                for (var i = 0; i < $p.mmap.length; i++) {
                    if ($.inArray($p.mmap[i]["type"], result.all) > -1) {
                        continue
                    }
                    if ("all|internal".indexOf($p.mmap[i]["platform"]) > -1) {
                        result.all.push($p.mmap[i]["type"]);
                        continue
                    }
                    if ($p.mmap[i]["fixed"] !== true) {
                        if (($p.mmap[i]["type"].indexOf("video") > -1 || $p.mmap[i]["type"].indexOf("audio") > -1)) {
                            try {
                                nativeElementType = ($p.mmap[i]["type"].indexOf("video") > -1) ? "video" : "audio";
                                var testObject = document.createElement(nativeElementType);
                                if (testObject.canPlayType != false) {
                                    switch (testObject.canPlayType($p.mmap[i]["type"])) {
                                    case "no":
                                    case "":
                                        break;
                                    case "maybe":
                                        if ($.browser.opera) {
                                            if ($.browser.version.slice(0, 2) < 11) {
                                                break
                                            }
                                        }
                                    case "probably":
                                    default:
                                        result.all.push($p.mmap[i]["type"]);
                                        result.media.push($p.mmap[i]["type"])
                                    }
                                }
                            } catch (e) {}
                        }
                    }
                }
                return result
            };
            this._debug = function (desc, data) {
                if (this.config._debug === false) {
                    return
                }
                if (this.config._debug == "console") {
                    try {
                        if (desc) {
                            console.log(desc)
                        }
                        if (data) {
                            console.log(data)
                        }
                    } catch (e) {}
                    return
                }
                var result = "<pre><b>" + desc + "</b>\n";
                if (data && this.config.debugLevel > 1) {
                    switch (typeof data) {
                    case "undefined":
                        break;
                    case "object":
                        var temp = "";
                        if (temp == "") {
                            temp = "";
                            for (var i in data) {
                                temp += i + " : " + data[i] + "\n"
                            }
                        }
                        result += temp;
                        break;
                    case "string":
                        result += data
                    }
                    result += "</pre>"
                }
                try {
                    $("#" + this.config._debug).prepend(result)
                } catch (e) {}
            };
            this._raiseError = function (txt) {
                this.env.playerDom.html(txt).css({
                    color: "#fdfdfd",
                    backgroundColor: "#333",
                    lineHeight: this.config.height + "px",
                    textAlign: "center",
                    display: "block"
                });
                this._promote("error")
            };
            this._readMediaTag = function (domNode) {
                var result = {},
                    htmlTag = "",
                    attr = [],
                    ref = this;
                if (domNode[0].tagName.toUpperCase() != "VIDEO" && domNode[0].tagName.toUpperCase() != "AUDIO") {
                    return false
                }
                result = {
                    autoplay: (domNode.prop("autoplay") !== undefined && domNode.prop("autoplay") !== false) ? true : false,
                    controls: (domNode.prop("controls") !== undefined && domNode.prop("controls") !== false) ? true : false,
                    loop: (domNode.prop("loop") !== undefined && domNode.prop("loop") !== false) ? true : false,
                    title: (domNode.attr("title") !== undefined && domNode.attr("title") !== false) ? domNode.attr("title") : "",
                    poster: (domNode.attr("poster") !== undefined && domNode.attr("poster") !== false) ? domNode.attr("poster") : "",
                    width: (domNode.attr("width") !== undefined && domNode.attr("width") !== false) ? domNode.attr("width") : false,
                    height: (domNode.attr("height") !== undefined && domNode.attr("height") !== false) ? domNode.attr("height") : false
                };
                if ($.browser.msie) {
                    htmlTag = $($("<div></div>").html($(domNode).clone())).html();
                    attr = ["autoplay", "controls", "loop"];
                    for (var i = 0; i < attr.length; i++) {
                        if (htmlTag.indexOf(attr[i]) == -1) {
                            continue
                        }
                        result[attr[i]] = true
                    }
                }
                domNode.prop("autoplay", false);
                result.playlist = [];
                result.playlist[0] = [];
                if (srcNode.attr("src")) {
                    result.playlist[0].push({
                        src: srcNode.attr("src"),
                        type: srcNode.attr("type") || this._getTypeFromFileExtension(srcNode.attr("src"))
                    })
                }
                if ($.browser.msie && $.browser.version < 9) {
                    var childNode = srcNode;
                    do {
                        childNode = childNode.next("source");
                        if (childNode.attr("src")) {
                            result.playlist[0].push({
                                src: childNode.attr("src"),
                                type: childNode.attr("type") || this._getTypeFromFileExtension(childNode.attr("src"))
                            })
                        }
                    } while (childNode.attr("src"))
                } else {
                    srcNode.children("source").each(function () {
                        if ($(this).attr("src")) {
                            result.playlist[0].push({
                                src: $(this).attr("src"),
                                type: $(this).attr("type") || ref._getTypeFromFileExtension($(this).attr("src"))
                            })
                        }
                    })
                }
                try {
                    domNode[0].pause();
                    domNode.find("source").remove();
                    domNode.prop("src", "");
                    domNode[0].load()
                } catch (e) {}
                return result
            };
            this._applyDimensions = function () {
                if (this.config._height !== false && this.config._width !== false) {
                    if (this.config._width <= this.config._minWidth) {
                        this.config._width = this.config._minWidth;
                        this.env.autoSize = true
                    }
                    if (this.config._height <= this.config._minHeight) {
                        this.config._height = this.config._minHeight;
                        this.env.autoSize = true
                    }
                }
                this.env.playerDom.css({
                    overflow: "hidden",
                    width: this.config._width + "px",
                    height: this.config._height + "px",
                    "max-width": "100%"
                })
            };
            this._init = function (customNode, customCfg) {
                var theNode = customNode || srcNode,
                    theCfg = customCfg || cfg,
                    cfgBySource = this._readMediaTag(theNode);
                this.env.srcNode = $.extend(true, {}, theNode);
                this.env.className = theNode.attr("class");
                if (cfgBySource !== false) {
                    this.env.playerDom = $(document.createElement("div")).attr({
                        "class": theNode[0].className,
                        style: theNode.attr("style")
                    });
                    theNode.replaceWith(this.env.playerDom)
                } else {
                    cfgBySource = {
                        width: (theNode.attr("width")) ? theNode.attr("width") : theNode.width(),
                        height: (theNode.attr("height")) ? theNode.attr("height") : theNode.height()
                    };
                    this.env.playerDom = theNode
                }
                theCfg = $.extend(true, {}, cfgBySource, theCfg);
                for (var i in theCfg) {
                    if (this.config["_" + i] != undefined) {
                        this.config["_" + i] = theCfg[i]
                    } else {
                        this.config[i] = theCfg[i]
                    }
                }
                if (this.getIsMobileClient()) {
                    this.config._autoplay = false
                }
                this._id = theNode[0].id || $p.utils.randomId(8);
                this.env.playerDom.attr("id", this._id);
                if (this.config._theme) {
                    switch (typeof this.config._theme) {
                    case "string":
                        break;
                    case "object":
                        this._applyTheme(this.config._theme)
                    }
                } else {
                    this._start(false)
                }
                return this
            };
            this._start = function (data) {
                var ref = this,
                    files = [];
                this._applyDimensions();
                try {
                    $("#projekktorver").html("V" + this.config._version)
                } catch (e) {}
                this._registerPlugins();
                if (this.config._iframe === true) {
                    if (this.getIframeWindow()) {
                        this.getIframeWindow().ready(function () {
                            ref._enterFullViewport();
                            ref.env.inFullscreen = false
                        })
                    } else {
                        ref._enterFullViewport();
                        ref.env.inFullscreen = false;
                        this.config.disableFullscreen = true
                    }
                }
                var nativeFullscreen = this.getNativeFullscreenSupport();
                if (nativeFullscreen !== false) {
                    var dest = (this.config._iframe === true) ? this.getIframe()[0] : this.getDC()[0];
                    dest.addEventListener(nativeFullscreen.fullScreenEventName, function () {
                        ref.setFullscreen(nativeFullscreen.isFullScreen())
                    }, true)
                }
                if (typeof onReady === "function") {
                    this._enqueue(function () {
                        onReady(ref)
                    })
                }
                for (var i in this.config._playlist[0]) {
                    if (this.config._playlist[0][i].type) {
                        if (this.config._playlist[0][i].type.indexOf("/json") > -1 || this.config._playlist[0][i].type.indexOf("/xml") > -1) {
                            this.setFile(this.config._playlist[0][i].src, true, this.config._playlist[0][i].type);
                            return this
                        }
                    }
                }
                this.setFile(this.config._playlist);
                return this
            };
            this._applyTheme = function (data) {
                var ref = this;
                if (data === false) {
                    this._raiseError("The Projekktor theme-set specified could not be loaded.");
                    return false
                }
                if (typeof data.config.plugins == "object") {
                    for (var i = 0; i < data.config.plugins.length; i++) {
                        try {
                            typeof eval("projekktor" + data.config.plugins[i])
                        } catch (e) {
                            this._raiseError("The applied theme requires the following Projekktor plugin(s): <b>" + data.config.plugins.join(", ") + "</b>");
                            return false
                        }
                    }
                }
                if (typeof data.css == "string") {
                    $("head").append('<style type="text/css">' + $p.utils.parseTemplate(data.css, {
                        rp: data.baseURL
                    }) + "</style>")
                }
                if (typeof data.html == "string") {
                    this.env.playerDom.html($p.utils.parseTemplate(data.html, {
                        p: this.config._cssClassPrefix
                    }))
                }
                this.env.playerDom.addClass(data.id).addClass(data.variation);
                if (typeof data.config == "object") {
                    for (var i in data.config) {
                        if (this.config["_" + i] != undefined) {
                            this.config["_" + i] = data.config[i]
                        } else {
                            this.config[i] = data.config[i]
                        }
                    }
                }
                if (data.onReady) {
                    this._enqueue(function (player) {
                        eval(data.onReady)
                    })
                }
                return this._start()
            };
            return this._init()
        }
    };
    $p.mmap = [];
    $p.models = {};
    $p.newModel = function (obj, ext) {
        var result = false,
            extend = ($p.models[ext] && ext != undefined) ? $p.models[ext].prototype : {};
        if (typeof obj != "object") {
            return result
        }
        if (!obj.modelId) {
            return result
        }
        if ($p.models[obj.modelId]) {
            return result
        }
        $p.models[obj.modelId] = function () {};
        $p.models[obj.modelId].prototype = $.extend({}, extend, obj);
        for (var i = 0; i < obj.iLove.length; i++) {
            obj.iLove[i].model = obj.modelId.toLowerCase();
            $p.mmap.push(obj.iLove[i])
        }
        return true
    }
});
var projekktorConfig = function (a) {
        this._version = a
    };
jQuery(function (a) {
    $p.utils = {
        roundNumber: function (b, c) {
            if (b <= 0 || isNaN(b)) {
                return 0
            }
            return Math.round(b * Math.pow(10, c)) / Math.pow(10, c)
        },
        randomId: function (b) {
            var e = "abcdefghiklmnopqrstuvwxyz",
                f = "";
            for (var d = 0; d < b; d++) {
                var c = Math.floor(Math.random() * e.length);
                f += e.substring(c, c + 1)
            }
            return f
        },
        toAbsoluteURL: function (e) {
            var b = location,
                d, j, g, c;
            if (e == null || e == "") {
                return ""
            }
            if (/^\w+:/.test(e)) {
                return e
            }
            d = b.protocol + "//" + b.host;
            if (e.indexOf("/") == 0) {
                return d + e
            }
            j = b.pathname.replace(/\/[^\/]*$/, "");
            g = e.match(/\.\.\//g);
            if (g) {
                e = e.substring(g.length * 3);
                for (c = g.length; c--;) {
                    j = j.substring(0, j.lastIndexOf("/"))
                }
            }
            return d + j + "/" + e
        },
        strip: function (b) {
            return b.replace(/^\s+|\s+$/g, "")
        },
        toSeconds: function (b) {
            var c = 0;
            if (typeof b != "string") {
                return b
            }
            if (b) {
                var d = b.split(":");
                for (i = 0; i < d.length; i++) {
                    c = c * 60 + parseFloat(d[i].replace(",", "."))
                }
            }
            return parseFloat(c)
        },
        embeddFlash: function (f, e) {
            var d = e.FlashVars || {},
                h = "",
                g = "",
                j = "",
                c = "",
                k = f,
                b = "";
            e.src += "?";
            for (var l in d) {
                if (typeof d[l] != "function") {
                    c = d[l];
                    e.src += l + "=" + encodeURIComponent(c) + "&"
                }
            }
            e.src.replace(/&$/, "");
            if (a.browser.msie) {
                b = ' id="' + e.id + '" '
            }
            g = "<object" + b + ' codebase="https://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0"  name="' + e.name + '" width="' + e.width + '" height="' + e.height + '" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"><param name="movie" value="' + e.src + '"></param><param name="allowScriptAccess" value="' + e.allowScriptAccess + '"></param><param name="allowFullScreen" value="' + e.allowFullScreen + '"></param><param name="wmode" value="' + e.wmode + '"></param>';
            j = "<embed ";
            for (var l in e) {
                if (l.toUpperCase() === "FLASHVARS") {
                    continue
                }
                if (typeof e[l] != "function") {
                    j += l + '="' + e[l] + '" '
                }
            }
            j += ' pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash"></embed>';
            h = g + j;
            h += "</object>";
            if (a.browser.mozilla) {
                h = j
            }
            if (k === null) {
                return h
            }
            k.get(0).innerHTML = h;
            return a("#" + e.id)[0]
        },
        parseTemplate: function (b, d) {
            if (d === undefined || d.length == 0 || typeof d != "object") {
                return b
            }
            for (var c in d) {
                b = b.replace(new RegExp("%{" + c + "}", "gi"), d[c])
            }
            b = b.replace(/%{(.*?)}/gi, "");
            return b
        }
    }
});
var projekktorPluginInterface = function () {};
jQuery(function (a) {
    projekktorPluginInterface.prototype = {
        pluginReady: false,
        name: "",
        pp: {},
        config: {},
        playerDom: null,
        canvas: {
            media: null,
            projekktor: null
        },
        _appliedDOMObj: [],
        _init: function (b) {
            this.config = a.extend(true, this.config, b);
            this.initialize()
        },
        getConfig: function (b, c) {
            var d = null;
            if (this.pp.getConfig("plugin_" + this.name) != null) {
                d = this.pp.getConfig("plugin_" + this.name)[b]
            }
            if (d == null) {
                d = this.pp.getConfig(b)
            }
            if (d == null) {
                d = (this.config[b] || c)
            }
            if (typeof d == "object") {
                d = a.extend(true, {}, d, this.config[b])
            }
            return d
        },
        sendEvent: function (b, c) {
            this.pp._promote({
                _plugin: this.name,
                _event: b
            }, c)
        },
        deconstruct: function () {
            this.pluginReady = false;
            a.each(this._appliedDOMObj, function () {
                a(this).remove()
            })
        },
        blockSelection: function (b) {
            if (!b) {
                return
            }
            if (a.browser.mozilla) {
                b.css("MozUserSelect", "none")
            } else {
                if (a.browser.msie) {
                    b.bind("selectstart", function () {
                        return false
                    })
                } else {
                    b.mousedown(function () {
                        return false
                    })
                }
            }
        },
        applyToPlayer: function (c, d) {
            var e = this.getConfig("cssClassPrefix");
            if (!c) {
                return null
            }
            if (this.playerDom.find("." + e + c.attr("class")).length == 0) {
                var b = c.attr("class");
                c.removeClass(b);
                c.addClass(e + b);
                if (d === true) {
                    c.prependTo(this.playerDom)
                } else {
                    c.appendTo(this.playerDom)
                }
                this._appliedDOMObj.push(c);
                return c
            }
            var b = c.attr("class");
            c = this.playerDom.find("." + e + c.attr("class"));
            c.removeClass(b);
            c.addClass(e + b);
            return c
        },
        initialize: function () {}
    }
});
var playerModel = function () {};
jQuery(function (a) {
    playerModel.prototype = {
        modelId: "player",
        iLove: [],
        _currentState: null,
        _currentBufferState: null,
        _volume: 0,
        _KbPerSec: 0,
        _bandWidthTimer: null,
        _isPoster: false,
        modelReady: true,
        requiresFlash: false,
        hasGUI: false,
        allowRandomSeek: false,
        flashVerifyMethod: "api_get",
        elementReady: false,
        mediaElement: null,
        pp: {},
        media: {
            duration: 0,
            position: 0,
            startOffset: 0,
            file: false,
            poster: "",
            ended: false,
            message: "",
            error: null,
            loadProgress: 0,
            errorCode: 0,
            message: "",
            type: "NA"
        },
        _init: function (b) {
            this.pp = b.pp || null;
            this.media = b.media || this.media;
            this._ap = b.autoplay;
            this._volume = this.pp.getVolume("volume");
            this.init()
        },
        init: function (b) {
            this.ready()
        },
        ready: function () {
            this.sendUpdate("modelReady");
            this.displayItem(this._ap)
        },
        displayItem: function (b) {
            if (b !== true || this.getState("STOPPED")) {
                this._setState("idle");
                this.applyImage(this.getPoster(), this.pp.getMediaContainer().html(""));
                this._isPoster = true;
                this.elementReady = true
            } else {
                if (this.hasGUI) {
                    this.pp.env.playerDom.children().not(".ppdisplay").addClass("inactive").removeClass("active")
                }
                if (this.requiresFlash !== false) {
                    if (this.requiresFlash > this.pp.getFlashVersion()) {
                        this.setTestcard(6);
                        return
                    }
                }
                this._setState("awakening");
                this.elementReady = false;
                this._isPoster = false;
                this.applyMedia(this.pp.getMediaContainer().html("").show())
            }
            this.waitTillReady(b)
        },
        applyMedia: function () {},
        sendUpdate: function (b, c) {
            this.pp._modelUpdateListener(b, c)
        },
        waitTillReady: function (c) {
            var b = this;
            (function () {
                try {
                    if (b.elementReady !== true) {
                        setTimeout(arguments.callee, 70);
                        return
                    }
                } catch (d) {}
                if (!b.getState("STOPPED") || c === true) {
                    try {
                        b.addListeners()
                    } catch (d) {}
                }
                b.pp._modelUpdateListener("displayReady");
                if (c === true) {
                    if (b.pp.getIsMobileClient()) {
                        setTimeout(function () {
                            b.setPlay()
                        }, 500)
                    }
                    b.setPlay()
                }
            })()
        },
        addListeners: function () {},
        removeListeners: function () {
            try {
                this.mediaElement.unbind()
            } catch (b) {}
        },
        detachMedia: function () {},
        destroy: function () {
            this.setPause();
            this.removeListeners();
            this.detachMedia();
            try {
                a("#" + this.mediaElement.id).empty()
            } catch (b) {}
            try {
                a("#" + this.mediaElement.id).remove()
            } catch (b) {}
            try {
                this.mediaElement.remove()
            } catch (b) {}
            this.pp.getMediaContainer().html("");
            this.mediaElement = null;
            this.media.loadProgress = 0;
            this.media.playProgress = 0;
            this.media.position = 0;
            this.media.duration = 0;
            this._setState("stopped")
        },
        reInit: function () {
            if (this.requiresFlash === false || !(a.browser.mozilla) || this.getState("ERROR") || this.pp.getConfig("bypassFlashFFFix") === true) {
                return
            }
            this.sendUpdate("FFreinit");
            this.removeListeners();
            this.displayItem((!this.getState("IDLE")))
        },
        applyCommand: function (c, b) {
            switch (c) {
            case "play":
                if (this.getState("ERROR")) {
                    break
                }
                if (this.getState("IDLE")) {
                    this._setState("awakening");
                    this.displayItem(true);
                    break
                }
                this.setPlay();
                break;
            case "pause":
                if (this.getState("ERROR")) {
                    break
                }
                this.setPause();
                break;
            case "volume":
                if (this.getState("ERROR")) {
                    break
                }
                if (!this.setVolume(b)) {
                    this._volume = b;
                    this.sendUpdate("volume", b)
                }
                break;
            case "stop":
                this.setStop();
                break;
            case "seek":
                if (this.getState("ERROR")) {
                    break
                }
                if (this.media.loadProgress == -1) {
                    break
                }
                this.setSeek(b);
                this.sendUpdate("seek", b);
                break;
            case "fullscreen":
                this.sendUpdate("fullscreen", b);
                this.setFullscreen(b);
                this.reInit();
                break;
            case "resize":
                this.setResize();
                this.sendUpdate("resize", b);
                break
            }
        },
        setSeek: function (b) {},
        setPlay: function () {},
        setPause: function () {},
        setStop: function () {
            this.detachMedia();
            this.destroy();
            this.displayItem(false)
        },
        setVolume: function (b) {},
        setFullscreen: function (b) {},
        setResize: function () {},
        setPosterLive: function () {},
        getVolume: function () {
            if (this.mediaElement == null) {
                return this._volume
            }
            return (this.mediaElement.prop("muted") == true) ? 0 : this.mediaElement.prop("volume")
        },
        getLoadProgress: function () {
            return this.media.loadProgress || 0
        },
        getLoadPlaybackProgress: function () {
            return this.media.playProgress || 0
        },
        getPosition: function () {
            return this.media.position || 0
        },
        getDuration: function () {
            return this.media.duration || 0
        },
        getInFullscreen: function () {
            return this.pp.getInFullscreen()
        },
        getKbPerSec: function () {
            return this._KbPerSec
        },
        getState: function (b) {
            var c = (this._currentState == null) ? "IDLE" : this._currentState;
            if (b != null) {
                return (c == b.toUpperCase())
            }
            return c
        },
        getFile: function () {
            return this.media.file || null
        },
        getModelName: function () {
            return this.modelId || null
        },
        getHasGUI: function () {
            return (this.hasGUI && !this._isPoster)
        },
        getIsReady: function () {
            return this.elementReady
        },
        getPoster: function () {
            return this.pp.getConfig("poster")
        },
        timeListener: function (e) {
            if (e == undefined) {
                return
            }
            var d = (e.position != undefined) ? e.position : e.currentTime,
                c = e.duration,
                b = (d > 0 && c > 0) ? d * 100 / c : 0;
            this.media.duration = c;
            this.media.position = d;
            this.media.playProgress = b;
            this.sendUpdate("time", this.media.position);
            this.loadProgressUpdate()
        },
        loadProgressUpdate: function () {
            try {
                var d = this.mediaElement[0];
                if (typeof d.buffered !== "object") {
                    return
                }
                if (typeof d.buffered.length <= 0) {
                    return
                }
                var b = Math.round(d.buffered.end(d.buffered.length - 1) * 100) / 100,
                    c = b * 100 / this.media.duration;
                if (c == this.media.loadProgress) {
                    return
                }
                this.media.loadProgress = (this.allowRandomSeek === true) ? 100 : -1;
                this.media.loadProgress = (this.media.loadProgress < 100 || this.media.loadProgress == undefined) ? c : 100;
                this.sendUpdate("progress", this.media.loadProgress)
            } catch (f) {}
        },
        progressListener: function (c, h) {
            try {
                if (typeof this.mediaElement[0].buffered == "object") {
                    if (this.mediaElement[0].buffered.length > 0) {
                        this.mediaElement.unbind("progress");
                        return
                    }
                }
            } catch (g) {}
            if (this._bandWidthTimer == null) {
                this._bandWidthTimer = (new Date()).getTime()
            }
            var f = 0,
                d = 0;
            if (!isNaN(c.loaded / c.total)) {
                f = c.loaded;
                d = c.total
            } else {
                if (c.originalEvent && !isNaN(c.originalEvent.loaded / c.originalEvent.total)) {
                    f = c.originalEvent.loaded;
                    d = c.originalEvent.total
                } else {
                    if (h && !isNaN(h.loaded / h.total)) {
                        f = h.loaded;
                        d = h.total
                    }
                }
            }
            var b = (f > 0 && d > 0) ? f * 100 / d : 0;
            if (Math.round(b) > Math.round(this.media.loadProgress)) {
                this._KbPerSec = ((f / 1024) / (((new Date()).getTime() - this._bandWidthTimer) / 1000))
            }
            b = (this.media.loadProgress !== 100) ? b : 100;
            b = (this.allowRandomSeek === true) ? 100 : b;
            if (this.media.loadProgress != b) {
                this.media.loadProgress = b;
                this.sendUpdate("progress", b)
            }
            if (this.media.loadProgress >= 100 && this.allowRandomSeek == false) {
                this._setBufferState("full")
            }
        },
        endedListener: function (b) {
            if (this.mediaElement === null) {
                return
            }
            this._setState("completed")
        },
        waitingListener: function (b) {
            this._setBufferState("empty")
        },
        canplayListener: function (b) {
            this._setBufferState("full")
        },
        canplaythroughListener: function (b) {
            this._setBufferState("full")
        },
        suspendListener: function (b) {
            this._setBufferState("full")
        },
        playingListener: function (b) {
            this._setState("playing")
        },
        startListener: function (b) {
            this.applyCommand("volume", this.pp.getConfig("volume"));
            this._setState("playing")
        },
        pauseListener: function (b) {
            this._setState("paused")
        },
        volumeListener: function (b) {
            this.sendUpdate("volume", this.getVolume())
        },
        flashReadyListener: function () {
            this.elementReady = true
        },
        errorListener: function (b, d) {
            try {
                switch (b.target.error.code) {
                case b.target.error.MEDIA_ERR_ABORTED:
                    this.setTestcard(1);
                    break;
                case b.target.error.MEDIA_ERR_NETWORK:
                    this.setTestcard(2);
                    break;
                case b.target.error.MEDIA_ERR_DECODE:
                    this.setTestcard(3);
                    break;
                case b.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                    this.setTestcard(4);
                    break;
                default:
                    this.setTestcard(5);
                    break
                }
            } catch (c) {}
        },
        metaDataListener: function (c) {
            try {
                this.videoWidth = c.videoWidth;
                this.videoHeight = c.videoHeight
            } catch (b) {}
            this._scaleVideo()
        },
        setTestcard: function (f, b) {
            var e = this.pp.getMediaContainer(),
                d = this.pp.getConfig("messages"),
                c = (d[f] != undefined) ? d[f] : d[0];
            c = (b != undefined && b != "") ? b : c;
            if (this.pp.getItemCount() > 1) {
                c += d[99]
            }
            if (c.length < 3) {
                c = "ERROR"
            }
            if (f == 100) {
                c = ""
            }
            c = $p.utils.parseTemplate(c, a.extend({}, this.media, {
                flashver: this.requiresFlash
            }));
            e.css({
                width: "100%",
                height: "100%"
            }).html("");
            this.mediaElement = a(document.createElement("div")).addClass("pptestcard").attr("id", this.pp.getId() + "_testcard_media").appendTo(e);
            if (c.length > 0) {
                a(document.createElement("p")).appendTo(this.mediaElement).html(c)
            }
            this._setState("error")
        },
        applyImage: function (e, c) {
            var g = a(document.createElement("img")).hide(),
                f = this;
            if (e == "" || e == undefined) {
                g = a(document.createElement("span")).attr({
                    id: this.pp.getMediaId() + "_image"
                }).appendTo(c);
                return g
            }
            g.appendTo(c).attr({
                id: this.pp.getMediaId() + "_image",
                src: e
            }).css({
                position: "absolute"
            });
            g.error(function (h) {
                a(this).remove()
            });
            var b = function (h) {
                    h.realWidth = h.prop("width");
                    h.realHeight = h.prop("height");
                    h.width = function () {
                        return h.realWidth
                    };
                    h.height = function () {
                        return h.realHeight
                    }
                };
            if (a.browser.msie) {
                (function () {
                    try {
                        if (g[0].complete == true) {
                            g.show();
                            b(g);
                            f.stretch(f.pp.getConfig("imageScaling"), g, c.width(), c.height());
                            return
                        }
                        setTimeout(arguments.callee, 100)
                    } catch (h) {
                        setTimeout(arguments.callee, 100)
                    }
                })()
            } else {
                g.load(function (h) {
                    a(this).show();
                    b(g);
                    f.stretch(f.pp.getConfig("imageScaling"), a(this), c.width(), c.height())
                })
            }
            var d = function (j, h) {
                    if (h.is(":visible") === false) {
                        f.pp.removeListener("fullscreen", arguments.callee)
                    }
                    f.stretch(f.pp.getConfig("imageScaling"), j, h.width(), h.height())
                };
            this.pp.addListener("fullscreen", function () {
                d(g, c)
            });
            this.pp.addListener("resize", function () {
                d(g, c)
            });
            return g
        },
        stretch: function (b, d, n, l, f, h) {
            if (d == undefined || d == null) {
                return false
            }
            if (d._originalDimensions === undefined) {
                d._originalDimensions = {};
                d._originalDimensions = {
                    width: d.width(),
                    height: d.height()
                }
            }
            var g = (f !== undefined) ? f : d._originalDimensions.width;
            var c = (h !== undefined) ? h : d._originalDimensions.height;
            var j = (n / g);
            var m = (l / c);
            var e = n;
            var k = l;
            switch (b) {
            case "fill":
                if (j > m) {
                    e = g * j;
                    k = c * j
                } else {
                    if (j < m) {
                        e = g * m;
                        k = c * m
                    }
                }
                break;
            case "aspectratio":
            default:
                if (j > m) {
                    e = g * m;
                    k = c * m
                } else {
                    if (j < m) {
                        e = g * j;
                        k = c * j
                    }
                }
                break
            }
            n = $p.utils.roundNumber((e / n) * 100, 0);
            l = $p.utils.roundNumber((k / l) * 100, 0);
            if (n == 0 || l == 0) {
                return false
            }
            d.css({
                margin: 0,
                padding: 0,
                width: n + "%",
                height: l + "%",
                left: (100 - n) / 2 + "%",
                top: (100 - l) / 2 + "%"
            });
            if (d._originalDimensions.width != d.width() || d._originalDimensions.height != d.height()) {
                return true
            }
            return false
        },
        createFlash: function (c, b) {
            this.mediaElement = $p.utils.embeddFlash(b, c);
            this._waitforPlayer()
        },
        _waitforPlayer: function () {
            if (this.elementReady == true) {
                return
            }
            var b = this;
            this._setBufferState("empty");
            (function () {
                try {
                    if (b.mediaElement == undefined) {
                        setTimeout(arguments.callee, 100)
                    } else {
                        if (b.mediaElement[b.flashVerifyMethod] == undefined) {
                            setTimeout(arguments.callee, 100)
                        } else {
                            b._setBufferState("full");
                            b.flashReadyListener()
                        }
                    }
                } catch (c) {
                    setTimeout(arguments.callee, 100)
                }
            })()
        },
        _setState: function (c) {
            var b = this;
            c = c.toUpperCase();
            if (this._currentState != c) {
                if (this._currentState == "PAUSED" && c == "PLAYING") {
                    this.sendUpdate("resume", this.media)
                }
                if ((this._currentState == "IDLE" || this._currentState == "AWAKENING") && c == "PLAYING") {
                    this.sendUpdate("start", this.media)
                }
                if (c == "ERROR") {
                    this.modelReady = true;
                    this.setPlay = function () {
                        b.sendUpdate("start")
                    }
                }
                this._currentState = c.toUpperCase();
                this.sendUpdate("state", this._currentState)
            }
        },
        _setBufferState: function (b) {
            if (this._currentBufferState != b) {
                this._currentBufferState = b.toUpperCase();
                this.sendUpdate("buffer", this._currentBufferState)
            }
        },
        _scaleVideo: function (h) {
            var d = this.pp.getMediaContainer();
            if (this.pp.getIsMobileClient()) {
                return
            }
            try {
                var f = d.width(),
                    j = d.height(),
                    b = this.videoWidth,
                    c = this.videoHeight;
                if (this.stretch(this.pp.getConfig("videoScaling"), this.mediaElement, f, j, b, c)) {
                    this.sendUpdate("scaled", {
                        realWidth: b,
                        realHeight: c,
                        displayWidth: f,
                        displayHeight: j
                    })
                }
            } catch (g) {}
        }
    }
});
jQuery(function (a) {
    $p.newModel({
        modelId: "NA",
        iLove: [{
            ext: "NaN",
            type: "none/none",
            platform: "all"
        }],
        hasGUI: true,
        applyMedia: function (b) {
            if (this.pp.getConfig("enableTestcard") && !this.pp.getIsMobileClient()) {
                this.setTestcard((this.media.file !== "" && this.media.errorCode === 7) ? 5 : this.media.errorCode);
                this.elementReady = true
            } else {
                this.elementReady = true;
                this.applyCommand("stop");
                window.location.href = this.media.file
            }
        },
        setPlay: function () {
            this.sendUpdate("start")
        },
        setPause: function () {
            if (this._hasEnded == false) {
                this._hasEnded = true;
                this.sendUpdate("ended")
            }
        }
    })
});
jQuery(function (a) {
    $p.newModel({
        modelId: "PLAYLIST",
        iLove: [{
            ext: "json",
            type: "text/json",
            platform: "internal"
        }, {
            ext: "jsonp",
            type: "text/jsonp",
            platform: "internal"
        }, {
            ext: "xml",
            type: "text/xml",
            platform: "internal"
        }, {
            ext: "json",
            type: "application/json",
            platform: "internal"
        }, {
            ext: "jsonp",
            type: "application/jsonp",
            platform: "internal"
        }, {
            ext: "xml",
            type: "application/xml",
            platform: "internal"
        }],
        applyMedia: function (b) {
            this.elementReady = true
        },
        setPlay: function () {
            this.sendUpdate("playlist", this.media.file)
        }
    })
});
jQuery(function (a) {
    $p.newModel({
        modelId: "VIDEOFLASH",
        iLove: [{
            ext: "flv",
            type: "video/x-flv",
            platform: "flash",
            fixed: true
        }, {
            ext: "flv",
            type: "video/flv",
            platform: "flash",
            fixed: true
        }, {
            ext: "mp4",
            type: "video/mp4",
            platform: "flash",
            fixed: "maybe"
        }, {
            ext: "mov",
            type: "video/quicktime",
            platform: "flash"
        }, {
            ext: "m4v",
            type: "video/mp4",
            platform: "flash",
            fixed: "maybe"
        }],
        requiresFlash: 9,
        allowRandomSeek: false,
        flashVerifyMethod: "api_get",
        _jarisVolume: 0,
        applyMedia: function (b) {
            var c = {
                id: this.pp.getMediaId() + "_flash",
                name: this.pp.getMediaId() + "_flash",
                src: this.pp.getConfig("playerFlashMP4"),
                width: "100%",
                height: "100%",
                allowScriptAccess: "always",
                allowFullScreen: "true",
                allowNetworking: "all",
                wmode: "transparent",
                bgcolor: "#000000",
                FlashVars: {
                    source: this.media.file,
                    type: "video",
                    streamtype: this.pp.getConfig("flashStreamType"),
                    server: (this.pp.getConfig("flashStreamType") == "rtmp") ? this.pp.getConfig("flashRTMPServer") : "",
                    autostart: "false",
                    hardwarescaling: "true",
                    controls: "false",
                    jsapi: "true",
                    aspectratio: this.pp.getConfig("videoScaling")
                }
            };
            switch (this.pp.getConfig("flashStreamType")) {
            case "rtmp":
            case "http":
                this.allowRandomSeek = true;
                this.media.loadProgress = 100;
                break
            }
            this.createFlash(c, b)
        },
        addListeners: function () {
            if (this.mediaElement == null) {
                return
            }
            this.mediaElement.api_addlistener("onprogress", "projekktor('" + this.pp.getId() + "').playerModel.progressListener");
            this.mediaElement.api_addlistener("ontimeupdate", "projekktor('" + this.pp.getId() + "').playerModel.timeListener");
            if (this.getModelName().indexOf("VIDEO") > -1) {
                this.mediaElement.api_addlistener("ondatainitialized", "projekktor('" + this.pp.getId() + "').playerModel.metaDataListener")
            }
            if (this.getModelName().indexOf("AUDIO") > -1) {
                this.mediaElement.api_addlistener("onconnectionsuccess", "projekktor('" + this.pp.getId() + "').playerModel.startListener")
            }
            this.mediaElement.api_addlistener("onplaypause", "projekktor('" + this.pp.getId() + "').playerModel._playpauseListener");
            this.mediaElement.api_addlistener("onplaybackfinished", "projekktor('" + this.pp.getId() + "').playerModel.endedListener");
            this.mediaElement.api_addlistener("onmute", "projekktor('" + this.pp.getId() + "').playerModel.volumeListener");
            this.mediaElement.api_addlistener("onvolumechange", "projekktor('" + this.pp.getId() + "').playerModel.volumeListener");
            this.mediaElement.api_addlistener("onbuffering", "projekktor('" + this.pp.getId() + "').playerModel.waitingListener");
            this.mediaElement.api_addlistener("onnotbuffering", "projekktor('" + this.pp.getId() + "').playerModel.canplayListener");
            this.mediaElement.api_addlistener("onconnectionfailed", "projekktor('" + this.pp.getId() + "').playerModel.errorListener")
        },
        removeListeners: function () {
            try {
                this.mediaElement.api_removelistener("*")
            } catch (b) {}
        },
        _playpauseListener: function (b) {
            if (b.isplaying) {
                this.playingListener()
            } else {
                this.pauseListener()
            }
        },
        metaDataListener: function (c) {
            this.startListener(c);
            try {
                this.videoWidth = c.width;
                this.videoHeight = c.height;
                this.sendUpdate("scaled", {
                    width: this.videoWidth,
                    height: this.videoHeight
                })
            } catch (b) {}
        },
        setSeek: function (c) {
            try {
                this.mediaElement.api_seek(c)
            } catch (b) {}
            this.timeListener({
                position: c,
                duration: this.media.duration
            })
        },
        setVolume: function (b) {
            this._volume = b;
            try {
                this.mediaElement.api_volume(b)
            } catch (c) {
                return false
            }
            return b
        },
        setPause: function (b) {
            try {
                this.mediaElement.api_pause()
            } catch (c) {}
        },
        setPlay: function (b) {
            try {
                this.mediaElement.api_play()
            } catch (c) {}
        },
        getVolume: function () {
            return this._jarisVolume
        },
        errorListener: function (b) {
            this.setTestcard(4)
        },
        volumeListener: function (b) {
            if (this._jarisVolume != b.volume) {
                this._jarisVolume = b.volume;
                this.sendUpdate("volume", b.volume)
            }
        },
        detachMedia: function () {
            try {
                a(this.mediaElement).remove()
            } catch (b) {}
        }
    });
    $p.newModel({
        modelId: "AUDIOFLASH",
        iLove: [{
            ext: "mp3",
            type: "audio/mp3",
            platform: "flash"
        }, {
            ext: "mp3",
            type: "audio/mpeg",
            platform: "flash"
        }, {
            ext: "m4a",
            type: "audio/mp4",
            platform: "flash"
        }],
        applyMedia: function (b) {
            this.imageElement = this.applyImage(this.pp.getConfig("cover") || this.pp.getConfig("poster"), b);
            var c = a("#" + this.pp.getMediaId() + "_flash_container");
            if (c.length == 0) {
                c = a(document.createElement("div")).css({
                    width: "1px",
                    height: "1px"
                }).attr("id", this.pp.getMediaId() + "_flash_container").appendTo(b)
            }
            var d = {
                id: this.pp.getMediaId() + "_flash",
                name: this.pp.getMediaId() + "_flash",
                src: this.pp.getConfig("playerFlashMP3"),
                width: "1px",
                height: "1px",
                allowScriptAccess: "always",
                allowFullScreen: "true",
                allowNetworking: "all",
                wmode: "transparent",
                bgcolor: "#000000",
                FlashVars: {
                    source: this.media.file,
                    type: "audio",
                    streamtype: this.pp.getConfig("flashStreamType"),
                    server: (this.pp.getConfig("flashStreamType") == "rtmp") ? this.pp.getConfig("flashRTMPServer") : "",
                    autostart: "false",
                    hardwarescaling: "false",
                    controls: "false",
                    jsapi: "true"
                }
            };
            this.createFlash(d, c)
        }
    }, "VIDEOFLASH")
});
jQuery(function (a) {
    $p.newModel({
        modelId: "VIDEO",
        iLove: [{
            ext: "ogv",
            type: "video/ogg",
            platform: "native"
        }, {
            ext: "webm",
            type: "video/webm",
            platform: "native"
        }, {
            ext: "ogg",
            type: "video/ogg",
            platform: "native"
        }, {
            ext: "anx",
            type: "video/ogg",
            platform: "native"
        }, {
            ext: "mp4",
            type: "video/mp4",
            platform: "native",
            fixed: "maybe"
        }],
        allowRandomSeek: false,
        videoWidth: 0,
        videoHeight: 0,
        element: "video",
        init: function (b) {
            if (this.pp.getIsMobileClient() && this.element == "video") {
                this.hasGUI = true
            }
            this.ready()
        },
        applyMedia: function (c) {
            this.elementReady = false;
            if (this.media.type.indexOf("/ogg") > -1 || this.media.type.indexOf("/webm") > -1) {
                this.allowRandomSeek = true
            }
            if (this.element == "audio") {
                this.imageElement = this.applyImage(this.pp.getConfig("cover") || this.pp.getConfig("poster"), c)
            }
            c.append(a(document.createElement(this.element)).attr({
                id: this.pp.getMediaId() + "_html",
                poster: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABBJREFUeNpi/v//PwNAgAEACQsDAUdpTjcAAAAASUVORK5CYII=",
                loop: false,
                autoplay: false,
                "x-webkit-airplay": "allow"
            }).prop({
                controls: (this.hasGUI && this.element == "video"),
                volume: this.getVolume()
            }).css({
                width: ((this.element == "video") ? "100%" : "1px"),
                height: ((this.element == "video") ? "100%" : "1px"),
                position: "absolute",
                top: 0,
                left: 0
            }));
            this.mediaElement = a("#" + this.pp.getMediaId() + "_html");
            for (var b in this.media.setup) {
                if (this.media.setup[b].src) {
                    a(document.createElement("source")).appendTo(this.mediaElement).attr({
                        src: this.media.setup[b].src,
                        type: this.media.setup[b].type
                    })
                }
            }
            this.waitforPlayer()
        },
        waitforPlayer: function () {
            if (this.elementReady == true) {
                return
            }
            var d = this,
                c = a("#" + this.pp.getMediaId() + "_html");
            try {
                if (c == undefined) {
                    setTimeout(function () {
                        d.waitforPlayer()
                    }, 200);
                    return
                }
                if (c[0].networkState == undefined) {
                    setTimeout(function () {
                        d.waitforPlayer()
                    }, 200);
                    return
                }
                this.elementReady = true
            } catch (b) {
                setTimeout(function () {
                    d.waitforPlayer()
                }, 200);
                return
            }
        },
        addListeners: function () {
            var b = this;
            if (this.element == "video") {
                this.mediaElement.bind("loadedmetadata", function () {
                    b.metaDataListener(this)
                })
            }
            this.mediaElement.bind("pause", function () {
                b.pauseListener(this)
            });
            this.mediaElement.bind("play", function () {
                b.playingListener(this)
            });
            this.mediaElement.bind("volumechange", function () {
                b.volumeListener(this)
            });
            this.mediaElement.bind("progress", function (c) {
                b.progressListener(c, this)
            });
            this.mediaElement.bind("timeupdate", function () {
                b.timeListener(this)
            });
            this.mediaElement.bind("ended", function () {
                b.endedListener(this)
            });
            this.mediaElement.bind("waiting", function () {
                b.waitingListener(this)
            });
            this.mediaElement.bind("canplaythrough", function () {
                b.canplayListener(this)
            });
            this.mediaElement.bind("canplay", function () {
                b.canplayListener(this)
            });
            this.mediaElement.bind("error", function (c) {
                b.errorListener(c, this)
            });
            this.mediaElement.bind("suspend", function () {
                b.suspendListener(this)
            })
        },
        updatePlayerInfo: function () {
            if (this.mediaElement == null) {
                return
            }
            var b = this,
                c = this.mediaElement[0];
            if (this.getState() == "PLAYING") {
                switch (c.networkState) {
                case c.NETWORK_EMPTY:
                    break;
                case c.NETWORK_IDLE:
                    break;
                case c.NETWORK_LOADING:
                    break;
                case c.NETWORK_NO_SOURCE:
                    this.setTestcard(4);
                    break
                }
            }
            if ("PAUSED|ERROR".indexOf(this.getState()) == -1) {
                setTimeout(function () {
                    b.updatePlayerInfo()
                }, 500)
            }
        },
        detachMedia: function () {
            try {
                this.mediaElement[0].pause();
                a(this.mediaElement[0]).prop("src", "");
                this.mediaElement[0].load()
            } catch (b) {}
        },
        setPlay: function () {
            try {
                this.mediaElement[0].play()
            } catch (b) {}
            this.updatePlayerInfo()
        },
        setPause: function () {
            try {
                this.mediaElement[0].pause()
            } catch (b) {}
        },
        setVolume: function (b) {
            this._volume = b;
            try {
                this.mediaElement.prop("volume", b)
            } catch (c) {
                return false
            }
            return b
        },
        setSeek: function (c) {
            try {
                this.mediaElement.prop("currentTime", c)
            } catch (b) {}
        },
        setFullscreen: function (b) {
            if (this.element == "audio") {
                return
            }
            this._scaleVideo()
        },
        setResize: function () {
            if (this.element == "audio") {
                return
            }
            this._scaleVideo(false)
        }
    });
    $p.newModel({
        modelId: "AUDIO",
        iLove: [{
            ext: "ogg",
            type: "audio/ogg",
            platform: "native"
        }, {
            ext: "oga",
            type: "audio/ogg",
            platform: "native"
        }, {
            ext: "mp3",
            type: "audio/mp3",
            platform: "native"
        }],
        imageElement: {},
        element: "audio",
        setPosterLive: function () {
            if (this.imageElement.parent) {
                var b = this.imageElement.parent(),
                    c = this;
                if (this.imageElement.attr("src") == c.pp.getConfig("poster")) {
                    return
                }
                this.imageElement.fadeOut("fast", function () {
                    a(this).remove();
                    c.imageElement = c.applyImage(c.pp.getConfig("poster"), b)
                })
            }
        }
    }, "VIDEO")
});
jQuery(function (a) {
    $p.newModel({
        modelId: "IMAGE",
        iLove: [{
            ext: "jpg",
            type: "image/jpeg",
            platform: "all"
        }, {
            ext: "gif",
            type: "image/gif",
            platform: "all"
        }, {
            ext: "png",
            type: "image/png",
            platform: "all"
        }],
        allowRandomSeek: true,
        _interval: null,
        _position: 0,
        _duration: 0,
        applyMedia: function (b) {
            this.mediaElement = this.applyImage(this.media.file, b);
            this.elementReady = true;
            this._duration = this.pp.getConfig("duration")
        },
        setPlay: function () {
            var b = this;
            this._setBufferState("full");
            this.progressListener(100);
            this.playingListener();
            if (this._duration > 0) {
                this._interval = setInterval(function () {
                    b._position = b._position + 0.5;
                    if (b._position > b._duration) {
                        clearInterval(b._interval);
                        b._setState("completed")
                    }
                    b.timeListener({
                        duration: b._duration,
                        position: b._position
                    })
                }, 500)
            } else {
                b._setState("completed")
            }
        },
        detachMedia: function () {
            this._position = 0;
            clearInterval(this._interval);
            this.mediaElement.remove()
        },
        setPause: function () {
            this.pauseListener();
            clearInterval(this._interval)
        },
        setSeek: function (b) {
            if (b < this._duration) {
                this._position = b
            }
        }
    });
    $p.newModel({
        modelId: "HTML",
        iLove: [{
            ext: "html",
            type: "text/html",
            platform: "all"
        }],
        applyMedia: function (c) {
            var b = this;
            this.mediaElement = a(document.createElement("iframe")).attr({
                id: this.pp.getMediaId() + "_iframe",
                name: this.pp.getMediaId() + "_iframe",
                src: this.media.file,
                scrolling: "no",
                frameborder: "0",
                width: "100%",
                height: "100%"
            }).css({
                overflow: "hidden",
                border: "0px",
                width: "100%",
                height: "100%"
            }).appendTo(c);
            this.mediaElement.load(function (d) {
                b.success()
            });
            this.mediaElement.error(function (d) {
                b.remove()
            });
            this._duration = this.pp.getConfig("duration")
        },
        success: function () {
            this.elementReady = true
        },
        remove: function () {
            this.mediaElement.remove();
            this.elementReady = true
        }
    }, "IMAGE")
});
jQuery(function (a) {
    $p.newModel({
        modelId: "YTVIDEO",
        iLove: [{
            ext: "youtube.com",
            type: "video/youtube",
            platform: "flash",
            fixed: true
        }],
        modelReady: false,
        allowRandomSeek: true,
        useIframeAPI: true,
        _updateTimer: null,
        init: function (c) {
            var b = this;
            this.useIframeAPI = this.pp.getConfig("useYTIframeAPI") || this.pp.getIsMobileClient();
            if (this.useIframeAPI !== true) {
                this.requiresFlash = 8;
                this.flashVerifyMethod = "cueVideoById";
                this.ready();
                return
            }
            var d = this.pp.getId();
            if (window.ProjekktorYoutubePlayerAPIReady !== true) {
                a.getScript("http://www.youtube.com/player_api");
                (function () {
                    try {
                        if (window.ProjekktorYoutubePlayerAPIReady == true) {
                            b.ready();
                            return
                        }
                        setTimeout(arguments.callee, 50)
                    } catch (f) {
                        setTimeout(arguments.callee, 50)
                    }
                })()
            } else {
                this.ready()
            }
            window.onYouTubePlayerAPIReady = function () {
                window.ProjekktorYoutubePlayerAPIReady = true
            }
        },
        applyMedia: function (c) {
            this._setBufferState("empty");
            var b = this;
            if (this.useIframeAPI) {
                this.mediaElement = new YT.Player(this.pp.getId() + "_media", {
                    width: (this.pp.getIsMobileClient()) ? this.pp.config._width : "100%",
                    height: (this.pp.getIsMobileClient()) ? this.pp.config._height : "100%",
                    playerVars: {
                        autoplay: 0,
                        disablekb: 1,
                        version: 3,
                        start: 0,
                        controls: 0,
                        enablejsapi: 1,
                        wmode: "opaque",
                        modestbranding: 1
                    },
                    videoId: this.youtubeGetId(),
                    events: {
                        onReady: function (e) {
                            b.onReady(e)
                        },
                        onStateChange: function (e) {
                            b.stateChange(e)
                        },
                        onError: function (e) {
                            b.errorListener(e)
                        }
                    }
                });
                a(this.mediaElement.b).attr("ALLOWTRANSPARENCY", true).attr({
                    scrolling: "no",
                    frameborder: 0
                }).css({
                    overflow: "hidden",
                    border: "0px",
                    display: "block"
                });
                if (a.browser.mozilla) {
                    this.requiresFlash = 8
                }
            } else {
                var d = {
                    id: this.pp.getId() + "_media_youtube",
                    name: this.pp.getId() + "_media_youtube",
                    src: "http://www.youtube.com/apiplayer",
                    width: "100%",
                    height: "100%",
                    bgcolor: "#000000",
                    allowScriptAccess: "always",
                    wmode: "transparent",
                    FlashVars: {
                        enablejsapi: 1,
                        autoplay: 1,
                        version: 3,
                        modestbranding: 1
                    }
                };
                this.createFlash(d, c)
            }
        },
        flashReadyListener: function () {
            this._youtubeResizeFix();
            this.addListeners();
            this.mediaElement.cueVideoById(this.youtubeGetId())
        },
        flashReinitListener: function () {
            this._youtubeResizeFix();
            this.addListeners();
            if (a.browser.mozilla) {
                this.mediaElement.cueVideoById(this.youtubeGetId());
                if (this.getState() === "PLAYING") {
                    this.setPlay()
                }
            }
            this.elementReady = true
        },
        _youtubeResizeFix: function () {
            this.applyCommand("volume", this.pp.getConfig("volume"))
        },
        addListeners: function () {
            if (this.useIframeAPI === true) {
                return
            }
            this.mediaElement.addEventListener("onStateChange", "projekktor('" + this.pp.getId() + "').playerModel.stateChange");
            this.mediaElement.addEventListener("onError", "projekktor('" + this.pp.getId() + "').playerModel.errorListener")
        },
        setSeek: function (c) {
            try {
                this.mediaElement.seekTo(c, true);
                this.timeListener({
                    position: this.mediaElement.getCurrentTime(),
                    duration: this.mediaElement.getDuration()
                })
            } catch (b) {}
        },
        setVolume: function (b) {
            try {
                this.mediaElement.setVolume(b * 100)
            } catch (c) {}
        },
        setPause: function (b) {
            try {
                this.mediaElement.pauseVideo()
            } catch (c) {}
        },
        setPlay: function (b) {
            try {
                this.mediaElement.playVideo()
            } catch (c) {}
        },
        getVolume: function () {
            try {
                return this.mediaElement.getVolume()
            } catch (b) {}
            return 0
        },
        getPoster: function () {
            return this.media.config["poster"] || this.pp.config.poster || "http://img.youtube.com/vi/" + this.youtubeGetId() + "/0.jpg"
        },
        errorListener: function (b) {
            switch ((b.data == undefined) ? b : b.data) {
            case 100:
                this.setTestcard(500);
                break;
            case 101:
            case 150:
                this.setTestcard(501);
                break;
            case 2:
                this.setTestcard(502);
                break
            }
        },
        stateChange: function (b) {
            clearTimeout(this._updateTimer);
            if (this.mediaElement === null) {
                return
            }
            switch ((b.data == undefined) ? b : b.data) {
            case -1:
                this.setPlay();
                break;
            case 0:
                this.endedListener({});
                break;
            case 1:
                this._setBufferState("full");
                this.playingListener({});
                this.canplayListener({});
                this.updateInfo();
                break;
            case 2:
                this.pauseListener({});
                break;
            case 3:
                this.waitingListener({});
                break;
            case 5:
                if (this.useIframeAPI !== true) {
                    this.onReady()
                }
                break
            }
        },
        onReady: function () {
            this.setVolume(this.pp.getVolume());
            this.elementReady = true;
            if (this.media.title || this.pp.config.title || this.elementReady) {
                return
            }
            var b = this;
            a.ajax({
                url: "http://gdata.youtube.com/feeds/api/videos/" + this.youtubeGetId() + "?v=2&alt=jsonc",
                complete: function (f, c) {
                    try {
                        data = f.responseText;
                        if (typeof data == "string") {
                            data = a.parseJSON(data)
                        }
                        if (data.data.title) {
                            b.sendUpdate("config", {
                                title: data.data.title + " (" + data.data.uploader + ")"
                            })
                        }
                    } catch (d) {}
                    b.elementReady = true
                }
            })
        },
        youtubeGetId: function () {
            return encodeURIComponent(this.media.file.replace(/^[^v]+v.(.{11}).*/, "$1"))
        },
        updateInfo: function () {
            var b = this;
            clearTimeout(this._updateTimer);
            (function () {
                if (b.mediaElement == null) {
                    clearTimeout(b._updateTimer);
                    return
                }
                try {
                    if (b.getState() !== "IDLE" && b.getState() !== "COMPLETED") {
                        b.timeListener({
                            position: b.mediaElement.getCurrentTime(),
                            duration: b.mediaElement.getDuration()
                        });
                        b.progressListener({
                            loaded: b.mediaElement.getVideoBytesLoaded(),
                            total: b.mediaElement.getVideoBytesTotal()
                        })
                    }
                } catch (c) {}
                b._updateTimer = setTimeout(arguments.callee, 500)
            })()
        }
    });
    $p.newModel({
        modelId: "YTAUDIO",
        iLove: [{
            ext: "youtube.com",
            type: "audio/youtube",
            platform: "flash",
            fixed: "maybe"
        }],
        applyMedia: function (b) {
            this.imageElement = this.applyImage(this.pp.getConfig("cover") || this.pp.getConfig("poster"), b);
            this._setBufferState("empty");
            this.mediaElement = new YT.Player(this.pp.getId() + "_media", {
                width: "100px",
                height: "100px",
                playerVars: {
                    autoplay: 10,
                    disablekb: 1,
                    start: 0,
                    controls: 0,
                    enablejsapi: 1,
                    playerapiid: this.pp.getId(),
                    origin: location.host
                },
                videoId: this.youtubeGetId(),
                events: {
                    onReady: "onReady" + this.pp.getId(),
                    onStateChange: "onStateChange" + this.pp.getId(),
                    onError: "onError" + this.pp.getId()
                }
            })
        }
    }, "YTVIDEO")
});
var projekktorControlbar = function () {};
jQuery(function (a) {
    projekktorControlbar.prototype = {
        _cTimer: null,
        _noCHide: false,
        _cFading: false,
        _vSliderAct: false,
        _storeVol: 0,
        _timeTags: {},
        cb: null,
        cbFS: null,
        _pos: {
            left: 0,
            right: 0
        },
        controlElements: {},
        controlElementsConfig: {
            cb: null,
            playhead: {
                on: null,
                call: null
            },
            loaded: {
                on: "click",
                call: "scrubberClk"
            },
            scrubber: {
                on: "click",
                call: "scrubberClk"
            },
            play: {
                on: "click",
                call: "playClk"
            },
            pause: {
                on: "click",
                call: "pauseClk"
            },
            stop: {
                on: "click",
                call: "stopClk"
            },
            prev: {
                on: "click",
                call: "prevClk"
            },
            next: {
                on: "click",
                call: "nextClk"
            },
            rewind: {
                on: "click",
                call: "rewindClk"
            },
            forward: {
                on: "click",
                call: "forwardClk"
            },
            fsexit: {
                on: "click",
                call: "exitFullscreenClk"
            },
            fsenter: {
                on: "click",
                call: "enterFullscreenClk"
            },
            vslider: {
                on: "click",
                call: "vsliderClk"
            },
            vmarker: {
                on: "click",
                call: "vsliderClk"
            },
            vknob: {
                on: "mousedown",
                call: "vknobStartDragListener"
            },
            mute: {
                on: "click",
                call: "muteClk"
            },
            unmute: {
                on: "click",
                call: "unmuteClk"
            },
            vmax: {
                on: "click",
                call: "vmaxClk"
            },
            open: {
                on: "click",
                call: "openCloseClk"
            },
            close: {
                on: "click",
                call: "openCloseClk"
            },
            loopon: {
                on: "click",
                call: "loopClk"
            },
            loopoff: {
                on: "click",
                call: "loopClk"
            },
            draghandle: {
                on: "mousedown",
                call: "handleStartDragListener"
            },
            controls: {
                on: null,
                call: null
            },
            title: null,
            sec_dur: null,
            min_dur: null,
            hr_dur: null,
            sec_elp: null,
            min_elp: null,
            hr_elp: null,
            sec_rem: null,
            min_rem: null,
            hr_rem: null
        },
        config: {
            disableFade: false,
            fadeDelay: 2500,
            showOnStart: false,
            controlsTemplate: "<div %{fsexit}></div><div %{fsenter}></div><div %{play}></div><div %{pause}></div><div %{prev}></div><div %{next}></div><div %{title}></div><div %{timeleft}>%{hr_elp}:%{min_elp}:%{sec_elp} | %{hr_dur}:%{min_dur}:%{sec_dur}</div><div %{scrubber}><div %{loaded}></div><div %{playhead}></div></div><div %{vslider}><div %{vmarker}></div><div %{vknob}></div></div><div %{mute}></div><div %{vmax}></div>",
            controlsTemplateFull: null,
            toggleMute: false
        },
        initialize: function () {
            var e = this,
                d = this.playerDom.html(),
                c = true,
                f = this.getConfig("cssClassPrefix");
            for (var b in this.controlElementsConfig) {
                if (d.match(new RegExp(f + b, "gi"))) {
                    c = false;
                    break
                }
            }
            if (c) {
                this.cb = this.applyToPlayer(a(document.createElement("div")).addClass("controls"));
                this.cbFS = this.applyToPlayer(a(document.createElement("div")).addClass("controls").addClass("fullscreen").removeClass("active").addClass("inactive"));
                this.applyTemplate(this.cb, this.getConfig("controlsTemplate"));
                this.applyTemplate(this.cbFS, this.getConfig("controlsTemplateFull") || this.getConfig("controlsTemplate"))
            } else {
                this.cb = this.playerDom.find("." + f + "controls:not(.fullscreen)");
                this.cbFS = this.playerDom.children("." + f + "controls.fullscreen");
                if (this.cbFS.length == 0) {
                    this.cbFS = this.cb
                }
            }
            for (var b in this.controlElementsConfig) {
                this.controlElements[b] = a(this.playerDom).find("." + f + b);
                this.blockSelection(this.controlElements[b])
            }
            this.addGuiListeners();
            this._storeVol = this.getConfig("volume");
            this.drawUpdateControls();
            this.hidecb(true);
            this.pluginReady = true
        },
        applyTemplate: function (d, c) {
            var e = this,
                f = this.getConfig("cssClassPrefix");
            if (c) {
                var b = c.match(/\%{[a-zA-Z_]*\}/gi);
                if (b != null) {
                    a.each(b, function (g, h) {
                        var j = h.replace(/\%{|}/gi, "");
                        if (h.match(/\_/gi)) {
                            c = c.replace(h, '<span class="' + f + j + '"></span>')
                        } else {
                            c = c.replace(h, 'class="' + f + j + '"')
                        }
                    })
                }
                d.html(c)
            }
        },
        itemHandler: function (b) {
            this.pluginReady = true;
            this.hidecb(true)
        },
        startHandler: function () {
            if (this.getConfig("showOnStart") == true) {
                this.showcb(true)
            } else {
                this.hidecb(true)
            }
        },
        readyHandler: function (b) {
            clearTimeout(this._cTimer);
            this.cb.removeClass("fade");
            this.cbFS.removeClass("fade");
            if (this.getConfig("disableFade") != true) {
                this.cb.addClass("fade");
                this.cbFS.addClass("fade")
            }
            this.pluginReady = true
        },
        drawUpdateControls: function () {
            var b = this,
                c = this.pp.getState();
            clearTimeout(this._cTimer);
            if (this.pp.getHasGUI()) {
                return
            }
            if (this.getConfig("controls") == false) {
                this.hidecb(true);
                return
            }
            var d = (this.pp.getItemCount() < 2 || this.getConfig("disallowSkip"));
            if (!d) {
                this.controlElements.prev.removeClass("inactive").addClass("active");
                this.controlElements.next.removeClass("inactive").addClass("active")
            } else {
                this.controlElements.prev.removeClass("active").addClass("inactive");
                this.controlElements.next.removeClass("active").addClass("inactive")
            }
            if (this.pp.getItemIdx() < 1) {
                this.controlElements.prev.removeClass("active").addClass("inactive")
            }
            if (this.pp.getItemIdx() >= this.pp.getItemCount() - 1) {
                this.controlElements.next.removeClass("active").addClass("inactive")
            }
            if (this.getConfig("disablePause")) {
                this.controlElements.pause.removeClass("active").addClass("inactive");
                this.controlElements.play.removeClass("active").addClass("inactive")
            } else {
                if (c === "PLAYING") {
                    this.drawPauseButton()
                }
                if (c === "PAUSED") {
                    this.drawPlayButton()
                }
                if (c === "IDLE") {
                    this.drawPlayButton()
                }
            }
            if (c == "IDLE") {
                this.controlElements.stop.removeClass("active").addClass("inactive")
            } else {
                this.controlElements.stop.removeClass("inactive").addClass("active")
            }
            if (c == "IDLE") {
                this.controlElements.forward.removeClass("active").addClass("inactive");
                this.controlElements.rewind.removeClass("active").addClass("inactive")
            } else {
                this.controlElements.forward.removeClass("inactive").addClass("active");
                this.controlElements.rewind.removeClass("inactive").addClass("active")
            }
            if (this.pp.getInFullscreen() === true) {
                this.drawExitFullscreenButton()
            } else {
                this.drawEnterFullscreenButton()
            }
            if (!this.getConfig("enableFullscreen")) {
                this.controlElements.fsexit.removeClass("active").addClass("inactive");
                this.controlElements.fsenter.removeClass("active").addClass("inactive")
            }
            if (this.pp.config._loop != true) {
                this.controlElements.loopoff.removeClass("active").addClass("inactive");
                this.controlElements.loopon.removeClass("inactive").addClass("active")
            } else {
                this.controlElements.loopoff.removeClass("inactive").addClass("active");
                this.controlElements.loopon.removeClass("active").addClass("inactive")
            }
            this.drawTitle();
            this.drawUpdateTimeDisplay();
            this.drawUpdateVolumeDisplay(this.pp.getVolume() || this._storeVol)
        },
        stateHandler: function (b) {
            this.drawUpdateControls();
            if ("STOPPED|DONE|IDLE|".indexOf(b) > -1) {
                this._noCHide = false;
                this.hidecb(true);
                return
            }
            if ("STOPPED|AWAKENING|IDLE|DONE".indexOf(b) > -1) {
                this.drawUpdateTimeDisplay(0, 0, 0);
                this.drawUpdateProgressDisplay(0)
            } else {
                this.drawUpdateProgressDisplay()
            }
        },
        scheduleModifiedHandler: function () {
            if (this.pp.getState() === "IDLE") {
                return
            }
            this.drawUpdateControls();
            this.drawUpdateTimeDisplay();
            this.drawUpdateProgressDisplay()
        },
        volumeHandler: function (b) {
            this.drawUpdateVolumeDisplay(b)
        },
        progressHandler: function (b) {
            this.drawUpdateProgressDisplay()
        },
        timeHandler: function (b) {
            this.drawUpdateTimeDisplay();
            this.drawUpdateProgressDisplay()
        },
        fullscreenHandler: function (d) {
            var b = this,
                c = this.getConfig("cssClassPrefix");
            this._noCHide = false;
            this._cFading = false;
            this._vSliderAct = false;
            clearTimeout(this._cTimer);
            if (!this.getConfig("controls")) {
                return
            }
            if (!this.getConfig("enableFullscreen")) {
                return
            }
            if (this.pp.getInFullscreen() === true) {
                this.playerDom.children("." + c + "controls:not(.fullscreen)").stop(true, true).removeClass("active").addClass("inactive").css("display", "");
                this.playerDom.children("." + c + "controls.fullscreen").stop(true, true).removeClass("inactive").addClass("active").css("display", "")
            } else {
                this.playerDom.children("." + c + "controls:not(.fullscreen)").stop(true, true).removeClass("inactive").addClass("active").css("display", "");
                this.playerDom.children("." + c + "controls.fullscreen").stop(true, true).removeClass("active").addClass("inactive").css("display", "")
            }
            this.drawUpdateControls();
            if (this.pp.getState() == "IDLE") {
                this.hidecb(true)
            } else {
                this._cTimer = setTimeout(function () {
                    b.hidecb()
                }, this.getConfig("fadeDelay"))
            }
        },
        addGuiListeners: function () {
            var b = this;
            a.each(this.controlElementsConfig, function (c, d) {
                if (!d) {
                    return
                }
                if (d.on != null) {
                    b.controlElements[c][d.on](function (e) {
                        b.clickCatcher(e, d.call, b.controlElements[c])
                    })
                }
            });
            this.cbFS.mouseenter(function (c) {
                b.controlsMouseEnterListener(c)
            });
            this.cbFS.mouseleave(function (c) {
                b.controlsMouseLeaveListener(c)
            });
            this.cb.mouseenter(function (c) {
                b.controlsMouseEnterListener(c)
            });
            this.cb.mouseleave(function (c) {
                b.controlsMouseLeaveListener(c)
            })
        },
        clickCatcher: function (b, d, c) {
            if (a.browser.msie) {
                b.cancelBubble = true
            } else {
                b.stopPropagation()
            }
            if (!c.hasClass("inactive")) {
                this[d](b, c)
            }
            return false
        },
        drawTitle: function () {
            this.controlElements.title.html(this.getConfig("title", ""))
        },
        hidecb: function (c) {
            clearTimeout(this._cTimer);
            var e = this.getConfig("cssClassPrefix"),
                b = (this.pp.getInFullscreen() === true) ? this.cbFS : this.cb,
                d = this;
            if (b == null) {
                return
            }
            b.stop(true, true);
            if (this._noCHide == true) {
                return
            }
            if (!b.is(":visible")) {
                return
            }
            if (c === true) {
                this._cFading = false;
                b.removeClass("active").addClass("inactive").css("display", "");
                return
            }
            if (this.getConfig("controls") == false || this.pp.getHasGUI() || !b.hasClass("fade")) {
                b.removeClass("active").addClass("inactive");
                return
            }
            b.fadeOut("slow", function () {
                a(this).removeClass("active").addClass("inactive").css("display", "");
                d._cFading = false
            })
        },
        showcb: function (c) {
            clearTimeout(this._cTimer);
            if (this.pp.getHasGUI() || this.getConfig("controls") == false) {
                b.removeClass("active").addClass("inactive").css("display", "");
                return
            }
            var d = this,
                b = (this.pp.getInFullscreen() === true) ? this.cbFS : this.cb,
                e = this.getConfig("cssClassPrefix");
            if (b == null) {
                return
            }
            if ("IDLE|AWAKENING|ERROR".indexOf(this.pp.getState()) > -1 && c != true) {
                return
            }
            b.stop(true, true);
            if ((!b.hasClass("fade") || c == true)) {
                b.removeClass("inactive").addClass("active").css("display", "");
                return
            }
            if (b.is(":visible") || this._cFading == true) {
                this._cTimer = setTimeout(function () {
                    d.hidecb()
                }, this.getConfig("fadeDelay"));
                return
            }
            this._cFading = true;
            b.fadeIn("slow", function () {
                d._cFading = false;
                a(this).removeClass("inactive").addClass("active").css("display", "")
            })
        },
        drawUpdateTimeDisplay: function (f, d, k) {
            if (this.pp.getHasGUI()) {
                return
            }
            try {
                var c = (f != undefined) ? f : this.pp.getLoadPlaybackProgress(),
                    j = (d != undefined) ? d : this.pp.getDuration(),
                    b = (k != undefined) ? k : this.pp.getPosition()
            } catch (g) {
                var c = f || 0,
                    j = d || 0,
                    b = k || 0
            }
            this.controlElements.playhead.css("width", c + "%");
            var h = a.extend({}, this._clockDigits(j, "dur"), this._clockDigits(b, "elp"), this._clockDigits(j - b, "rem"));
            a.each(this.controlElements, function (e, l) {
                if (h[e]) {
                    a.each(l, function () {
                        a(this).html(h[e])
                    })
                }
            })
        },
        drawUpdateProgressDisplay: function () {
            this.controlElements.loaded.css("width", this.pp.getLoadProgress() + "%")
        },
        drawUpdateVolumeDisplay: function (b) {
            if (this._vSliderAct == true) {
                return
            }
            if (b == undefined) {
                return
            }
            clearTimeout(this._cTimer);
            var d = (this.pp.getInFullscreen() === true) ? this.cbFS : this.cb,
                f = d.is(":visible"),
                e = this,
                c = (this.controlElements.mute.hasClass("toggle") || this.controlElements.unmute.hasClass("toggle") || this.getConfig("toggleMute"));
            vknob = d.find("." + this.getConfig("cssClassPrefix") + "vknob"), vslider = d.find("." + this.getConfig("cssClassPrefix") + "vslider");
            d.stop(true, true).show();
            switch (parseFloat(b)) {
            case 0:
                vknob.css("left", 0);
                if (c) {
                    this.controlElements.mute.removeClass("active").addClass("inactive");
                    this.controlElements.unmute.removeClass("inactive").addClass("active");
                    this.controlElements.vmax.removeClass("inactive").addClass("active")
                }
                break;
            default:
                if (c) {
                    this.controlElements.mute.removeClass("inactive").addClass("active");
                    this.controlElements.unmute.removeClass("active").addClass("inactive")
                }
                break
            }
            if (!c) {
                this.controlElements.vmax.removeClass("inactive").addClass("active");
                this.controlElements.unmute.removeClass("inactive").addClass("active");
                this.controlElements.mute.removeClass("inactive").addClass("active")
            }
            this.controlElements.vknob.css("left", b * (vslider.width() - (vknob.width() / 2)) + "px");
            this.controlElements.vmarker.css("width", b * 100 + "%");
            this._cTimer = setTimeout(function () {
                e.hidecb()
            }, this.getConfig("fadeDelay"));
            if (!f) {
                d.hide()
            }
        },
        drawPauseButton: function (b) {
            this.controlElements.pause.removeClass("inactive").addClass("active");
            this.controlElements.play.removeClass("active").addClass("inactive")
        },
        drawPlayButton: function (b) {
            this.controlElements.pause.removeClass("active").addClass("inactive");
            this.controlElements.play.removeClass("inactive").addClass("active")
        },
        drawEnterFullscreenButton: function (b) {
            this.controlElements.fsexit.removeClass("active").addClass("inactive");
            this.controlElements.fsenter.removeClass("inactive").addClass("active")
        },
        drawExitFullscreenButton: function (b) {
            this.controlElements.fsexit.removeClass("inactive").addClass("active");
            this.controlElements.fsenter.removeClass("active").addClass("inactive")
        },
        playClk: function (b) {
            this.pp.setPlay()
        },
        pauseClk: function (b) {
            this.pp.setPause()
        },
        stopClk: function (b) {
            this.pp.setStop()
        },
        controlsMouseEnterListener: function (b) {
            this._noCHide = true
        },
        controlsMouseLeaveListener: function (b) {
            this._noCHide = false
        },
        controlsClk: function (b) {},
        mousemoveHandler: function (b) {
            this.showcb()
        },
        prevClk: function (b) {
            this.pp.setActiveItem("previous")
        },
        nextClk: function (b) {
            this.pp.setActiveItem("next")
        },
        forwardClk: function (b) {
            this.pp.setPlayhead("+10")
        },
        rewindClk: function (b) {
            this.pp.setPlayhead("-10")
        },
        muteClk: function (b) {
            this._storeVol = (this.pp.getVolume() == 0) ? this.getConfig("volume") : this.pp.getVolume();
            this.pp.setVolume(0)
        },
        unmuteClk: function (b) {
            if (this._storeVol <= 0) {
                this._storeVol = 1
            }
            this.pp.setVolume(this._storeVol)
        },
        vmaxClk: function (b) {
            this.pp.setVolume(1)
        },
        enterFullscreenClk: function (b) {
            this.pp.setFullscreen(true)
        },
        exitFullscreenClk: function (b) {
            this.pp.setFullscreen(false)
        },
        openCloseClk: function (b) {
            var c = this;
            a(a(b.currentTarget).attr("class").split(/\s+/)).each(function (d, e) {
                if (e.indexOf("toggle") == -1) {
                    return
                }
                c.playerDom.find("." + e.substring(6)).slideToggle("slow", function () {
                    c.pp.setResize()
                });
                c.controlElements.open.toggle();
                c.controlElements.close.toggle()
            })
        },
        loopClk: function (b) {
            if (a.inArray(this.getConfig("cssClassPrefix") + "loopon", a(b.currentTarget).attr("class").split(/\s+/)) > -1) {
                this.pp.config._loop = true
            } else {
                this.pp.config._loop = false
            }
            this.drawUpdateControls()
        },
        startClk: function (b) {
            this.pp.setPlay()
        },
        scrubberClk: function (b) {
            var e = 0;
            if (this.getConfig("disallowSkip") == true) {
                return
            }
            var g = (this.pp.getInFullscreen() === true && this.controlElements.vslider.length > 1) ? 1 : 0,
                d = a(this.controlElements.scrubber[g]).width(),
                c = a(this.controlElements.loaded[g]).width(),
                f = b.pageX - a(this.controlElements.scrubber[g]).offset().left;
            if (f < 0 || f == "NaN" || f == undefined) {
                e = 0
            } else {
                if (c != undefined) {
                    if (f > c) {
                        f = c - 1
                    }
                    e = ((f * 100 / d) * this.pp.getDuration() / 100) * 1
                }
            }
            this.pp.setPlayhead(e)
        },
        vmarkerClk: function (b) {
            vsliderClk(b)
        },
        vsliderClk: function (c) {
            if (this._vSliderAct == true) {
                return
            }
            var f = (this.pp.getInFullscreen() === true && this.controlElements.vslider.length > 1) ? 1 : 0,
                b = a(this.controlElements.vslider[f]),
                d = b.width(),
                e = c.pageX - b.offset().left;
            if (e < 0 || e == "NaN" || e == undefined) {
                result = 0
            } else {
                result = (e / d)
            }
            this.pp.setVolume(result);
            this._storeVol = result
        },
        vknobStartDragListener: function (b, j) {
            this._vSliderAct = true;
            var d = this,
                f = (this.pp.getInFullscreen() === true && this.controlElements.vslider.length > 1) ? 1 : 0,
                c = a(j[f]),
                h = a(this.controlElements.vslider[f]),
                l = Math.abs(parseInt(c.position().left) - b.clientX),
                e = 0,
                g = function (m) {
                    if (a.browser.msie) {
                        m.cancelBubble = true
                    } else {
                        m.stopPropagation()
                    }
                    d.playerDom.unbind("mouseup", g);
                    h.unbind("mousemove", k);
                    h.unbind("mouseup", g);
                    c.unbind("mousemove", k);
                    c.unbind("mouseup", g);
                    d._vSliderAct = false;
                    return false
                },
                k = function (m) {
                    clearTimeout(d._cTimer);
                    if (a.browser.msie) {
                        m.cancelBubble = true
                    } else {
                        m.stopPropagation()
                    }
                    var n = (m.clientX - l);
                    n = (n > h.width() - c.width() / 2) ? h.width() - (c.width() / 2) : n;
                    n = (n < 0) ? 0 : n;
                    c.css("left", n + "px");
                    e = Math.abs(n / (h.width() - (c.width() / 2)));
                    d.pp.setVolume(e);
                    d._storeVol = e;
                    a(d.controlElements.vmarker[f]).css("width", e * 100 + "%");
                    return false
                };
            this.playerDom.mouseup(g);
            h.mousemove(k);
            h.mouseup(g);
            c.mousemove(k);
            c.mouseup(g)
        },
        handleStartDragListener: function (d, g) {
            var h = this;
            var f = Math.abs(parseInt(this.cb.position().left) - d.clientX);
            var c = Math.abs(parseInt(this.cb.position().top) - d.clientY);
            var b = function (j) {
                    if (a.browser.msie) {
                        j.cancelBubble = true
                    } else {
                        j.stopPropagation()
                    }
                    h.playerDom.unbind("mouseup", b);
                    h.playerDom.unbind("mouseout", b);
                    h.playerDom.unbind("mousemove", e);
                    return false
                };
            var e = function (k) {
                    if (a.browser.msie) {
                        k.cancelBubble = true
                    } else {
                        k.stopPropagation()
                    }
                    clearTimeout(h._cTimer);
                    var l = (k.clientX - f);
                    l = (l > h.playerDom.width() - h.cb.width()) ? h.playerDom.width() - h.cb.width() : l;
                    l = (l < 0) ? 0 : l;
                    h.cb.css("left", l + "px");
                    var j = (k.clientY - c);
                    j = (j > h.playerDom.height() - h.cb.height()) ? h.playerDom.height() - h.cb.height() : j;
                    j = (j < 0) ? 0 : j;
                    h.cb.css("top", j + "px");
                    return false
                };
            this.playerDom.mousemove(e);
            this.playerDom.mouseup(b)
        },
        errorHandler: function (b) {
            this.hidecb(true)
        },
        _clockDigits: function (d, j) {
            if (d < 0 || isNaN(d) || d == undefined) {
                d = 0
            }
            var f = Math.floor(d / (60 * 60));
            var g = d % (60 * 60);
            var c = Math.floor(g / 60);
            var b = g % 60;
            var e = Math.floor(b);
            var h = {};
            h["min_" + j] = (c < 10) ? "0" + c : c;
            h["sec_" + j] = (e < 10) ? "0" + e : e;
            h["hr_" + j] = (f < 10) ? "0" + f : f;
            return h
        }
    }
});
var projekktorDisplay = function () {};
jQuery(function (a) {
    projekktorDisplay.prototype = {
        logo: null,
        logoIsFading: false,
        display: null,
        displayClicks: 0,
        buffIcn: null,
        buffIcnSprite: null,
        bufferDelayTimer: null,
        bufferIconDelay: 1,
        config: {
            onclick: {
                callback: "setPlayPause",
                value: null
            },
            onclick_playing: {
                callback: "setPlayPause",
                value: null
            },
            ondblclick: {
                callback: "setFullscreen",
                value: null
            },
            bufferIconDelay: 200,
            spriteUrl: "",
            spriteWidth: 50,
            spriteHeight: 50,
            spriteTiles: 25,
            spriteOffset: 1,
            spriteCountUp: false,
            logoImage: "",
            logoDelay: 0,
			logoPosition: "tr",
			onlogoclick: {
                callback: "",
                value: {
                    url: "",
                    target: "_blank",
                    pause: true
                }
            }
        },
        initialize: function () {
            var c = this;
            var b = {
                position: "absolute",
                overflow: "hidden",
                height: "100%",
                width: "100%",
                top: 0,
                left: 0,
                padding: 0,
                margin: 0,
                display: "block"
            };
            this.startButton = this.applyToPlayer(a(document.createElement("div")).addClass("start")).addClass("inactive");
            this.buffIcn = this.applyToPlayer(a(document.createElement("div")).addClass("buffering")).addClass("inactive");
            if (this.config.spriteUrl != "") {
                this.buffIcnSprite = a(document.createElement("div")).appendTo(this.buffIcn).css({
                    width: this.config.spriteWidth,
                    height: this.config.spriteHeight,
                    marginLeft: ((this.buffIcn.width() - this.config.spriteWidth) / 2) + "px",
                    marginTop: ((this.buffIcn.height() - this.config.spriteHeight) / 2) + "px",
                    backgroundColor: "transparent",
                    backgroundImage: "url(" + this.config.spriteUrl + ")",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "0 0"
                }).addClass("inactive")
            }
            this.display = this.applyToPlayer(a(document.createElement("div")).addClass("display").css(b));
            this.pp.getMediaContainer();
            this.logo = this.applyToPlayer(a(document.createElement("img")).addClass("logo").addClass("inactive").attr("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABBJREFUeNpi/v//PwNAgAEACQsDAUdpTjcAAAAASUVORK5CYII=").css("position", "absolute").css(((this.getConfig("logoPosition").indexOf("r") > -1) ? "right" : "left"), "2%").css(((this.getConfig("logoPosition").indexOf("t") > -1) ? "top" : "bottom"), "2%"));
            this.pluginReady = true
        },
        displayReadyHandler: function () {
            var b = this;
            this.startButton.unbind();
            this.startButton.click(function () {
                b.pp.setPlay()
            })
        },
        bufferHandler: function (b) {
            if (!this.pp.getState("PLAYING") && !this.pp.getState("AWAKENING")) {
                return
            }
            if (b == "EMPTY") {
                this.showBufferIcon()
            } else {
                this.hideBufferIcon()
            }
        },
        stateHandler: function (b) {
            if (b === "IDLE") {
                this.startButton.addClass("active").removeClass("inactive")
            } else {
                this.startButton.addClass("inactive").removeClass("active")
            }
            if (b == "AWAKENING" || b == "COMPLETED" || b == "ERROR") {
                this.hideBufferIcon()
            }
            if (b == "ERROR" || b === "STOPPED") {
                this.logo.addClass("inactive").removeClass("active")
            }
        },
        stoppedHandler: function () {
            this.hideBufferIcon()
        },
        scheduleLoadingHandler: function () {
            this.startButton.addClass("inactive").removeClass("active");
            this.showBufferIcon()
        },
        scheduledHandler: function () {
            if (!this.getConfig("autoplay")) {
                this.startButton.addClass("active").removeClass("inactive")
            }
            this.hideBufferIcon()
        },
        itemHandler: function () {
            var b = this;
            this.hideBufferIcon();
            this.logoIsFading = false;
            this.logo.stop(true, true).addClass("inactive").removeClass("active").unbind();
            if (this.getConfig("logoImage") != null) {
                this.logo.attr("src", this.getConfig("logoImage")).css({
                    cursor: (this.getConfig("logoURL") != "") ? "pointer" : "normal"
                }).click(function () {
                    try {
                        b.pp[b.getConfig("onlogoclick").callback](b.getConfig("onlogoclick").value)
                    } catch (c) {}
                    return false
                }).removeClass("inactive").hide()
            } else {
                this.logo.attr("src", "").addClass("inactive").removeClass("active")
            }
        },
        timeHandler: function () {
            if (this.getConfig("logoImage") == false) {
                return
            }
            if (this.pp.getIsMobileClient()) {
                return
            }
            var b = this.pp.getPosition(),
                d = this.pp.getDuration(),
                c = this;
            if (!this.logo.hasClass("inactive") && !this.logoIsFading && b + this.config.logoDelay < d) {
                if (b > this.config.logoDelay && d > (this.config.logoDelay * 2)) {
                    this.logoIsFading = true;
                    this.logo.fadeIn("slow", function () {
                        c.logoIsFading = false;
                        a(this).addClass("active").removeClass("inactive").css("display", "")
                    })
                }
            }
            if (this.logo.hasClass("active") && !this.logoIsFading) {
                if (b + this.config.logoDelay < d) {
                    this.logoIsFading = true;
                    this.logo.fadeOut(5000, function () {
                        a(this).addClass("inactive").removeClass("active").css("display", "");
                        c.logoIsFading = false
                    })
                }
            }
        },
        leftclickHandler: function (b) {
            var c = this;
            if (a(b.target).attr("id").indexOf("_media") == -1) {
                return
            }
            switch (this.pp.getState()) {
            case "ERROR":
                this.pp.setActiveItem("next");
                return;
            case "IDLE":
                this.pp.setPlay();
                return
            }
            if (this.pp.getHasGUI() == true) {
                return
            }
            this.displayClicks++;
            if (this.displayClicks > 0) {
                setTimeout(function () {
                    if (c.displayClicks == 1) {
                        if (c.pp.getState() == "PLAYING") {
                            try {
                                c.pp[c.getConfig("onclick_playing").callback](c.getConfig("onclick_playing").value)
                            } catch (d) {}
                        } else {
                            try {
                                c.pp[c.getConfig("onclick").callback](c.getConfig("onclick").value)
                            } catch (d) {}
                        }
                    } else {
                        if (c.displayClicks == 2) {
                            try {
                                c.pp[c.getConfig("ondblclick").callback](c.getConfig("ondblclick").value)
                            } catch (d) {}
                        }
                    }
                    c.displayClicks = 0
                }, 250)
            }
            return
        },
        hideBufferIcon: function () {
            var b = this;
            clearTimeout(this.bufferDelayTimer);
            this.buffIcn.stop(true, true);
            this.buffIcn.fadeOut("fast", function () {
                a(this).addClass("inactive").removeClass("active").css("display", "")
            })
        },
        showBufferIcon: function (b) {
            var c = this;
            clearTimeout(this.bufferDelayTimer);
            if (this.pp.getHasGUI()) {
                return
            }
            if (this.pp.getModel() === "YTAUDIO" || this.pp.getModel() === "YTVIDEO") {
                b = true
            }
            if (b != true && this.config.bufferIconDelay > 0) {
                this.bufferDelayTimer = setTimeout(function () {
                    c.showBufferIcon(true)
                }, c.config.bufferIconDelay);
                return
            }
            this.buffIcn.stop(true, true);
            if (this.buffIcn.hasClass("active")) {
                return
            }
            this.buffIcn.fadeIn("fast", function () {
                if (c.buffIcnSprite == null) {
                    return
                }
                var d = (c.config.spriteCountUp == true) ? 0 : (c.config.spriteHeight + c.config.spriteOffset) * c.config.spriteTiles;
                c.buffIcnSprite.addClass("active").removeClass("inactive").css("display", "");
                (function () {
                    if (!c.buffIcn.is(":visible")) {
                        return
                    }
                    c.buffIcnSprite.css("backgroundPosition", "0px -" + d + "px");
                    if (c.config.spriteCountUp == true) {
                        d += c.config.spriteHeight + c.config.spriteOffset
                    } else {
                        d -= c.config.spriteHeight + c.config.spriteOffset
                    }
                    if (d >= c.config.spriteHeight * c.config.spriteTiles) {
                        d = 0
                    }
                    setTimeout(arguments.callee, 60)
                })()
            })
        }
    }
});
projekktorConfig.prototype = {
    _cookieName: "qwprojaaekktor",
    _cookieExpiry: 356,
    _plugins: ["display", "controlbar"],
    _addplugins: [],
    _reelParser: function (a) {
        return a
    },
    _cssClassPrefix: "pp",
    _platformPriority: ["native", "flash"],
    _bypassFlashFFFix: false,
    _iframe: false,
    _loop: false,
    _autoplay: false,
    _continuous: true,
    _playlist: [],
    _theme: false,
    _themeRepo: "http://www.projekktorxl.com/themegen/api/themes/live/format/jsonp/id/%{id}/version/%{ver}",
    _messages: {
        0: "An error occurred.",
        1: "You aborted the media playback. ",
        2: "A network error caused the media download to fail part-way. ",
        3: "The media playback was aborted due to a corruption problem. ",
        4: "The media (%{file}) could not be loaded because the server or network failed.",
        5: "Sorry, your browser does not support the media format of the requested file (%{type}).",
        6: "Your client is in lack of the Flash Plugin V%{flashver} or higher.",
        7: "No media scheduled.",
        8: "! Invalid media model configured !",
        9: "File (%{file}) not found.",
        97: "No media scheduled.",
        98: "Invalid or malformed playlist data!",
        99: "Click display to proceed. ",
        500: "This Youtube video has been removed or set to private",
        501: "The Youtube user owning this video disabled embedding.",
        502: "Invalid Youtube Video-Id specified."
    },
    _debug: false,
    _width: 0,
    _height: 0,
    _minHeight: 40,
    _minWidth: 40,
    ID: 0,
    title: null,
    poster: false,
    controls: false,
    start: false,
    stop: false,
    volume: 0.5,
    cover: "",
    disablePause: false,
    disallowSkip: false,
    fixedVolume: false,
    imageScaling: "aspectratio",
    videoScaling: "aspectratio",
    playerFlashMP4: "jarisplayer.swf",
    playerFlashMP3: "jarisplayer.swf",
    flashStreamType: "file",
    flashRTMPServer: "",
    useYTIframeAPI: false,
    enableFlashFallback: true,
    enableNativePlayback: true,
    enableKeyboard: true,
    enableFullscreen: true,
    enableNativeFullscreen: true,
    enableTestcard: true,
    duration: 0,
    className: ""
};