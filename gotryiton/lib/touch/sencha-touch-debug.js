/*
    Copyright(c) 2011 Sencha Inc.
    licensing@sencha.com
    http://www.sencha.com/touchlicense
*/

if (typeof Ext === "undefined") {
    Ext = {};
}


Ext.apply = (function() {
    
    for(var key in {valueOf:1}) {
        return function(object, config, defaults) {
            
            if (defaults) {
                Ext.apply(object, defaults);
            }
            if (object && config && typeof config === 'object') {
                for (var key in config) {
                    object[key] = config[key];
                }
            }
            return object;
        };
    }
    return function(object, config, defaults) {
        
        if (defaults) {
            Ext.apply(object, defaults);
        }
        if (object && config && typeof config === 'object') {
            for (var key in config) {
                object[key] = config[key];
            }
            if (config.toString !== Object.prototype.toString) {
                object.toString = config.toString;
            }
            if (config.valueOf !== Object.prototype.valueOf) {
                object.valueOf = config.valueOf;
            }
        }
        return object;
    };
})();

Ext.apply(Ext, {
    platformVersion: '1.0',
    platformVersionDetail: {
        major: 1,
        minor: 0,
        patch: 3
    },
    userAgent: navigator.userAgent.toLowerCase(),
    cache: {},
    idSeed: 1000,
    BLANK_IMAGE_URL : 'data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
    isStrict: document.compatMode == "CSS1Compat",

    windowId: 'ext-window',
    documentId: 'ext-document',

    
    emptyFn : function() {},

    
    isSecure : /^https/i.test(window.location.protocol),

    
    isReady : false,

    
    enableGarbageCollector : true,

    
    enableListenerCollection : true,

    
    applyIf : function(object, config) {
        var property, undefined;

        if (object) {
            for (property in config) {
                if (object[property] === undefined) {
                    object[property] = config[property];
                }
            }
        }

        return object;
    },

    
    repaint : function() {
        var mask = Ext.getBody().createChild({
            cls: 'x-mask x-mask-transparent'
        });
        setTimeout(function() {
            mask.remove();
        }, 0);
    },

    
    id : function(el, prefix) {
        el = Ext.getDom(el) || {};
        if (el === document) {
            el.id = this.documentId;
        }
        else if (el === window) {
            el.id = this.windowId;
        }
        el.id = el.id || ((prefix || 'ext-gen') + (++Ext.idSeed));
        return el.id;
    },

    
    extend : function() {
        
        var inlineOverrides = function(o){
            for (var m in o) {
                if (!o.hasOwnProperty(m)) {
                    continue;
                }
                this[m] = o[m];
            }
        };

        var objectConstructor = Object.prototype.constructor;

        return function(subclass, superclass, overrides){
            
            if (Ext.isObject(superclass)) {
                overrides = superclass;
                superclass = subclass;
                subclass = overrides.constructor != objectConstructor
                    ? overrides.constructor
                    : function(){ superclass.apply(this, arguments); };
            }

            if (!superclass) {
                throw "Attempting to extend from a class which has not been loaded on the page.";
            }

            
            var F = function(){},
                subclassProto,
                superclassProto = superclass.prototype;

            F.prototype = superclassProto;
            subclassProto = subclass.prototype = new F();
            subclassProto.constructor = subclass;
            subclass.superclass = superclassProto;

            if(superclassProto.constructor == objectConstructor){
                superclassProto.constructor = superclass;
            }

            subclass.override = function(overrides){
                Ext.override(subclass, overrides);
            };

            subclassProto.superclass = subclassProto.supr = (function(){
                return superclassProto;
            });

            subclassProto.override = inlineOverrides;
            subclassProto.proto = subclassProto;

            subclass.override(overrides);
            subclass.extend = function(o) {
                return Ext.extend(subclass, o);
            };

            return subclass;
        };
    }(),

    
    override : function(origclass, overrides) {
        Ext.apply(origclass.prototype, overrides);
    },

    
    namespace : function() {
        var ln = arguments.length,
            i, value, split, x, xln, parts, object;

        for (i = 0; i < ln; i++) {
            value = arguments[i];
            parts = value.split(".");
            if (window.Ext) {
                object = window[parts[0]] = Object(window[parts[0]]);
            } else {
                object = arguments.callee.caller.arguments[0];
            }
            for (x = 1, xln = parts.length; x < xln; x++) {
                object = object[parts[x]] = Object(object[parts[x]]);
            }
        }
        return object;
    },

    
    urlEncode : function(o, pre) {
        var empty,
            buf = [],
            e = encodeURIComponent;

        Ext.iterate(o, function(key, item){
            empty = Ext.isEmpty(item);
            Ext.each(empty ? key : item, function(val){
                buf.push('&', e(key), '=', (!Ext.isEmpty(val) && (val != key || !empty)) ? (Ext.isDate(val) ? Ext.encode(val).replace(/"/g, '') : e(val)) : '');
            });
        });

        if(!pre){
            buf.shift();
            pre = '';
        }

        return pre + buf.join('');
    },

    
    urlDecode : function(string, overwrite) {
        if (Ext.isEmpty(string)) {
            return {};
        }

        var obj = {},
            pairs = string.split('&'),
            d = decodeURIComponent,
            name,
            value;

        Ext.each(pairs, function(pair) {
            pair = pair.split('=');
            name = d(pair[0]);
            value = d(pair[1]);
            obj[name] = overwrite || !obj[name] ? value : [].concat(obj[name]).concat(value);
        });

        return obj;
    },

    
    htmlEncode : function(value) {
        return Ext.util.Format.htmlEncode(value);
    },

    
    htmlDecode : function(value) {
         return Ext.util.Format.htmlDecode(value);
    },

    
    urlAppend : function(url, s) {
        if (!Ext.isEmpty(s)) {
            return url + (url.indexOf('?') === -1 ? '?' : '&') + s;
        }
        return url;
    },

    
     toArray : function(array, start, end) {
        return Array.prototype.slice.call(array, start || 0, end || array.length);
     },

     
     each : function(array, fn, scope) {
         if (Ext.isEmpty(array, true)) {
             return 0;
         }
         if (!Ext.isIterable(array) || Ext.isPrimitive(array)) {
             array = [array];
         }
         for (var i = 0, len = array.length; i < len; i++) {
             if (fn.call(scope || array[i], array[i], i, array) === false) {
                 return i;
             }
         }
         return true;
     },

     
     iterate : function(obj, fn, scope) {
         if (Ext.isEmpty(obj)) {
             return;
         }
         if (Ext.isIterable(obj)) {
             Ext.each(obj, fn, scope);
             return;
         }
         else if (Ext.isObject(obj)) {
             for (var prop in obj) {
                 if (obj.hasOwnProperty(prop)) {
                     if (fn.call(scope || obj, prop, obj[prop], obj) === false) {
                         return;
                     }
                 }
             }
         }
     },

    
    pluck : function(arr, prop) {
        var ret = [];
        Ext.each(arr, function(v) {
            ret.push(v[prop]);
        });
        return ret;
    },

    
    getBody : function() {
        return Ext.get(document.body || false);
    },

    
    getHead : function() {
        var head;

        return function() {
            if (head == undefined) {
                head = Ext.get(DOC.getElementsByTagName("head")[0]);
            }

            return head;
        };
    }(),

    
    getDoc : function() {
        return Ext.get(document);
    },

    
    getCmp : function(id) {
        return Ext.ComponentMgr.get(id);
    },

    
    getOrientation: function() {
        return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
    },

    isIterable : function(v) {
        if (!v) {
            return false;
        }
        
        if (Ext.isArray(v) || v.callee) {
            return true;
        }
        
        if (/NodeList|HTMLCollection/.test(Object.prototype.toString.call(v))) {
            return true;
        }

        
        
        return ((typeof v.nextNode != 'undefined' || v.item) && Ext.isNumber(v.length)) || false;
    },

    
    num : function(v, defaultValue) {
        v = Number(Ext.isEmpty(v) || Ext.isArray(v) || typeof v == 'boolean' || (typeof v == 'string' && Ext.util.Format.trim(v).length == 0) ? NaN : v);
        return isNaN(v) ? defaultValue : v;
    },

    
    isEmpty : function(value, allowBlank) {
        var isNull       = value == null,
            emptyArray   = (Ext.isArray(value) && !value.length),
            blankAllowed = !allowBlank ? value === '' : false;

        return isNull || emptyArray || blankAllowed;
    },

    
    isArray : function(v) {
        return Object.prototype.toString.apply(v) === '[object Array]';
    },

    
    isDate : function(v) {
        return Object.prototype.toString.apply(v) === '[object Date]';
    },

    
    isObject : function(v) {
        return !!v && !v.tagName && Object.prototype.toString.call(v) === '[object Object]';
    },

    
    isPrimitive : function(v) {
        return Ext.isString(v) || Ext.isNumber(v) || Ext.isBoolean(v);
    },

    
    isFunction : function(v) {
        return Object.prototype.toString.apply(v) === '[object Function]';
    },

    
    isNumber : function(v) {
        return Object.prototype.toString.apply(v) === '[object Number]' && isFinite(v);
    },

    
    isString : function(v) {
        return typeof v === 'string';
    },

    
    isBoolean : function(v) {
        return Object.prototype.toString.apply(v) === '[object Boolean]';
    },

    
    isElement : function(v) {
        return v ? !!v.tagName : false;
    },

    
    isDefined : function(v){
        return typeof v !== 'undefined';
    },

    
    destroy : function() {
        var ln = arguments.length,
            i, arg;

        for (i = 0; i < ln; i++) {
            arg = arguments[i];
            if (arg) {
                if (Ext.isArray(arg)) {
                    this.destroy.apply(this, arg);
                }
                else if (Ext.isFunction(arg.destroy)) {
                    arg.destroy();
                }
                else if (arg.dom) {
                    arg.remove();
                }
            }
        }
    }
});


Ext.SSL_SECURE_URL = Ext.isSecure && 'about:blank';

Ext.ns = Ext.namespace;

Ext.ns(
    'Ext.util',
    'Ext.data',
    'Ext.list',
    'Ext.form',
    'Ext.menu',
    'Ext.state',
    'Ext.layout',
    'Ext.app',
    'Ext.ux',
    'Ext.plugins',
    'Ext.direct',
    'Ext.lib',
    'Ext.gesture'
);



Ext.util.Observable = Ext.extend(Object, {
    
    
    isObservable: true,

    constructor: function(config) {
        var me = this;

        Ext.apply(me, config);
        if (me.listeners) {
            me.on(me.listeners);
            delete me.listeners;
        }
        me.events = me.events || {};

        if (this.bubbleEvents) {
            this.enableBubble(this.bubbleEvents);
        }
    },

    
    eventOptionsRe : /^(?:scope|delay|buffer|single|stopEvent|preventDefault|stopPropagation|normalized|args|delegate|element|vertical|horizontal)$/,

    
    addManagedListener : function(item, ename, fn, scope, options) {
        var me = this,
            managedListeners = me.managedListeners = me.managedListeners || [],
            config;

        if (Ext.isObject(ename)) {
            options = ename;
            for (ename in options) {
                if (!options.hasOwnProperty(ename)) {
                    continue;
                }
                config = options[ename];
                if (!me.eventOptionsRe.test(ename)) {
                    me.addManagedListener(item, ename, config.fn || config, config.scope || options.scope, config.fn ? config : options);
                }
            }
        }
        else {
            managedListeners.push({
                item: item,
                ename: ename,
                fn: fn,
                scope: scope,
                options: options
            });

            item.on(ename, fn, scope, options);
        }
    },

    
     removeManagedListener : function(item, ename, fn, scope) {
        var me = this,
            o,
            config,
            managedListeners,
            managedListener,
            length,
            i;

        if (Ext.isObject(ename)) {
            o = ename;
            for (ename in o) {
                if (!o.hasOwnProperty(ename)) {
                    continue;
                }
                config = o[ename];
                if (!me.eventOptionsRe.test(ename)) {
                    me.removeManagedListener(item, ename, config.fn || config, config.scope || o.scope);
                }
            }
        }

        managedListeners = this.managedListeners ? this.managedListeners.slice() : [];
        length = managedListeners.length;

        for (i = 0; i < length; i++) {
            managedListener = managedListeners[i];
            if (managedListener.item === item && managedListener.ename === ename && (!fn || managedListener.fn === fn) && (!scope || managedListener.scope === scope)) {
                this.managedListeners.remove(managedListener);
                item.un(managedListener.ename, managedListener.fn, managedListener.scope);
            }
        }
    },

    
    fireEvent: function() {
        var me = this,
            a = Ext.toArray(arguments),
            ename = a[0].toLowerCase(),
            ret = true,
            ev = me.events[ename],
            queue = me.eventQueue,
            parent;

        if (me.eventsSuspended === true) {
            if (queue) {
                queue.push(a);
            }
            return false;
        }
        else if (ev && Ext.isObject(ev) && ev.bubble) {
            if (ev.fire.apply(ev, a.slice(1)) === false) {
                return false;
            }
            parent = me.getBubbleTarget && me.getBubbleTarget();
            if (parent && parent.isObservable) {
                if (!parent.events[ename] || !Ext.isObject(parent.events[ename]) || !parent.events[ename].bubble) {
                    parent.enableBubble(ename);
                }
                return parent.fireEvent.apply(parent, a);
            }
        }
        else if (ev && Ext.isObject(ev)) {
            a.shift();
            ret = ev.fire.apply(ev, a);
        }
        return ret;
    },

    
    addListener: function(ename, fn, scope, o) {
        var me = this,
            config,
            ev;

        if (Ext.isObject(ename)) {
            o = ename;
            for (ename in o) {
                if (!o.hasOwnProperty(ename)) {
                    continue;
                }
                config = o[ename];
                if (!me.eventOptionsRe.test(ename)) {
                    me.addListener(ename, config.fn || config, config.scope || o.scope, config.fn ? config : o);
                }
            }
        }
        else {
            ename = ename.toLowerCase();
            me.events[ename] = me.events[ename] || true;
            ev = me.events[ename] || true;
            if (Ext.isBoolean(ev)) {
                me.events[ename] = ev = new Ext.util.Event(me, ename);
            }
            ev.addListener(fn, scope, Ext.isObject(o) ? o: {});
        }
    },

    
    removeListener: function(ename, fn, scope) {
        var me = this,
            config,
            ev;

        if (Ext.isObject(ename)) {
            var o = ename;
            for (ename in o) {
                if (!o.hasOwnProperty(ename)) {
                    continue;
                }
                config = o[ename];
                if (!me.eventOptionsRe.test(ename)) {
                    me.removeListener(ename, config.fn || config, config.scope || o.scope);
                }
            }
        }
        else {
            ename = ename.toLowerCase();
            ev = me.events[ename];
            if (ev.isEvent) {
                ev.removeListener(fn, scope);
            }
        }
    },

    
    clearListeners: function() {
        var events = this.events,
            ev,
            key;

        for (key in events) {
            if (!events.hasOwnProperty(key)) {
                continue;
            }
            ev = events[key];
            if (ev.isEvent) {
                ev.clearListeners();
            }
        }

        this.clearManagedListeners();
    },

    purgeListeners : function() {
        console.warn('MixedCollection: purgeListeners has been deprecated. Please use clearListeners.');
        return this.clearListeners.apply(this, arguments);
    },

    
    clearManagedListeners : function() {
        var managedListeners = this.managedListeners || [],
            ln = managedListeners.length,
            i, managedListener;

        for (i = 0; i < ln; i++) {
            managedListener = managedListeners[i];
            managedListener.item.un(managedListener.ename, managedListener.fn, managedListener.scope);
        }

        this.managedListener = [];
    },

    purgeManagedListeners : function() {
        console.warn('MixedCollection: purgeManagedListeners has been deprecated. Please use clearManagedListeners.');
        return this.clearManagedListeners.apply(this, arguments);
    },

    
    addEvents: function(o) {
        var me = this;
            me.events = me.events || {};
        if (Ext.isString(o)) {
            var a = arguments,
            i = a.length;
            while (i--) {
                me.events[a[i]] = me.events[a[i]] || true;
            }
        } else {
            Ext.applyIf(me.events, o);
        }
    },

    
    hasListener: function(ename) {
        var e = this.events[ename];
        return e.isEvent === true && e.listeners.length > 0;
    },

    
    suspendEvents: function(queueSuspended) {
        this.eventsSuspended = true;
        if (queueSuspended && !this.eventQueue) {
            this.eventQueue = [];
        }
    },

    
    resumeEvents: function() {
        var me = this,
            queued = me.eventQueue || [];

        me.eventsSuspended = false;
        delete me.eventQueue;

        Ext.each(queued,
        function(e) {
            me.fireEvent.apply(me, e);
        });
    },

    
    relayEvents : function(origin, events, prefix) {
        prefix = prefix || '';
        var me = this,
            len = events.length,
            i, ename;

        function createHandler(ename){
            return function(){
                return me.fireEvent.apply(me, [prefix + ename].concat(Array.prototype.slice.call(arguments, 0, -1)));
            };
        }

        for(i = 0, len = events.length; i < len; i++){
            ename = events[i].substr(prefix.length);
            me.events[ename] = me.events[ename] || true;
            origin.on(ename, createHandler(ename), me);
        }
    },

    
    enableBubble: function(events) {
        var me = this;
        if (!Ext.isEmpty(events)) {
            events = Ext.isArray(events) ? events: Ext.toArray(arguments);
            Ext.each(events,
            function(ename) {
                ename = ename.toLowerCase();
                var ce = me.events[ename] || true;
                if (Ext.isBoolean(ce)) {
                    ce = new Ext.util.Event(me, ename);
                    me.events[ename] = ce;
                }
                ce.bubble = true;
            });
        }
    }
});

Ext.override(Ext.util.Observable, {
    
    on: Ext.util.Observable.prototype.addListener,
    
    un: Ext.util.Observable.prototype.removeListener,

    mon: Ext.util.Observable.prototype.addManagedListener,
    mun: Ext.util.Observable.prototype.removeManagedListener
});


Ext.util.Observable.releaseCapture = function(o) {
    o.fireEvent = Ext.util.Observable.prototype.fireEvent;
};


Ext.util.Observable.capture = function(o, fn, scope) {
    o.fireEvent = Ext.createInterceptor(o.fireEvent, fn, scope);
};


Ext.util.Observable.observe = function(cls, listeners) {
    if (cls) {
        if (!cls.isObservable) {
            Ext.applyIf(cls, new Ext.util.Observable());
            Ext.util.Observable.capture(cls.prototype, cls.fireEvent, cls);
        }
        if (typeof listeners == 'object') {
            cls.on(listeners);
        }
        return cls;
    }
};


Ext.util.Observable.observeClass = Ext.util.Observable.observe;

Ext.util.Event = Ext.extend(Object, (function() {
    function createBuffered(handler, listener, o, scope) {
        listener.task = new Ext.util.DelayedTask();
        return function() {
            listener.task.delay(o.buffer, handler, scope, Ext.toArray(arguments));
        };
    };

    function createDelayed(handler, listener, o, scope) {
        return function() {
            var task = new Ext.util.DelayedTask();
            if (!listener.tasks) {
                listener.tasks = [];
            }
            listener.tasks.push(task);
            task.delay(o.delay || 10, handler, scope, Ext.toArray(arguments));
        };
    };

    function createSingle(handler, listener, o, scope) {
        return function() {
            listener.ev.removeListener(listener.fn, scope);
            return handler.apply(scope, arguments);
        };
    };

    return {
        isEvent: true,

        constructor: function(observable, name) {
            this.name = name;
            this.observable = observable;
            this.listeners = [];
        },

        addListener: function(fn, scope, options) {
            var me = this,
                listener;
                scope = scope || me.observable;

            if (!me.isListening(fn, scope)) {
                listener = me.createListener(fn, scope, options);
                if (me.firing) {
                    
                    me.listeners = me.listeners.slice(0);
                }
                me.listeners.push(listener);
            }
        },

        createListener: function(fn, scope, o) {
            o = o || {};
            scope = scope || this.observable;

            var listener = {
                    fn: fn,
                    scope: scope,
                    o: o,
                    ev: this
                },
                handler = fn;

            if (o.delay) {
                handler = createDelayed(handler, listener, o, scope);
            }
            if (o.buffer) {
                handler = createBuffered(handler, listener, o, scope);
            }
            if (o.single) {
                handler = createSingle(handler, listener, o, scope);
            }

            listener.fireFn = handler;
            return listener;
        },

        findListener: function(fn, scope) {
            var listeners = this.listeners,
            i = listeners.length,
            listener,
            s;

            while (i--) {
                listener = listeners[i];
                if (listener) {
                    s = listener.scope;
                    if (listener.fn == fn && (s == scope || s == this.observable)) {
                        return i;
                    }
                }
            }

            return - 1;
        },

        isListening: function(fn, scope) {
            return this.findListener(fn, scope) !== -1;
        },

        removeListener: function(fn, scope) {
            var me = this,
                index,
                listener,
                k;
            index = me.findListener(fn, scope);
            if (index != -1) {
                listener = me.listeners[index];

                if (me.firing) {
                    me.listeners = me.listeners.slice(0);
                }

                
                if (listener.task) {
                    listener.task.cancel();
                    delete listener.task;
                }

                
                k = listener.tasks && listener.tasks.length;
                if (k) {
                    while (k--) {
                        listener.tasks[k].cancel();
                    }
                    delete listener.tasks;
                }

                
                me.listeners.splice(index, 1);
                return true;
            }

            return false;
        },

        
        clearListeners: function() {
            var listeners = this.listeners,
                i = listeners.length;

            while (i--) {
                this.removeListener(listeners[i].fn, listeners[i].scope);
            }
        },

        fire: function() {
            var me = this,
                listeners = me.listeners,
                count = listeners.length,
                i,
                args,
                listener;

            if (count > 0) {
                me.firing = true;
                for (i = 0; i < count; i++) {
                    listener = listeners[i];
                    args = arguments.length ? Array.prototype.slice.call(arguments, 0) : [];
                    if (listener.o) {
                        args.push(listener.o);
                    }
                    if (listener && listener.fireFn.apply(listener.scope || me.observable, args) === false) {
                        return (me.firing = false);
                    }
                }
            }
            me.firing = false;
            return true;
        }
    };
})());


Ext.util.Stateful = Ext.extend(Ext.util.Observable, {
    
    
    editing : false,
    
    
    dirty : false,
    
    
    persistanceProperty: 'data',
    
    constructor: function(config) {
        Ext.applyIf(this, {
            data: {}
        });        
        
        
        this.modified = {};
        
        this[this.persistanceProperty] = {};
        
        Ext.util.Stateful.superclass.constructor.call(this, config);
    },
    
    
    get: function(field) {
        return this[this.persistanceProperty][field];
    },
    
    
    set: function(fieldName, value) {
        var me = this,
            fields = me.fields,
            modified = me.modified,
            convertFields = [],
            field, key, i;
        
        
        if (arguments.length == 1 && Ext.isObject(fieldName)) {
            for (key in fieldName) {
                if (!fieldName.hasOwnProperty(key)) {
                    continue;
                }
                
                
                
                field = fields.get(key);
                if (field && field.convert !== field.type.convert) {
                    convertFields.push(key);
                    continue;
                }
                
                me.set(key, fieldName[key]);
            }
            
            for (i = 0; i < convertFields.length; i++) {
                field = convertFields[i];
                me.set(field, fieldName[field]);
            }
            
        } else {
            if (fields) {
                field = fields.get(fieldName);
                
                if (field && field.convert) {
                    value = field.convert(value, me);
                }
            }
            
            me[me.persistanceProperty][fieldName] = value;

            if (field && field.persist && !me.isEqual(currentValue, value)) {
                if (me.isModified(fieldName)) {
                    if (me.isEqual(modified[fieldName], value)) {
                        
                        
                        delete modified[fieldName];
                        
                        
                        me.dirty = false;
                        for (key in modified) {
                            if (modified.hasOwnProperty(key)){
                                me.dirty = true;
                                break;
                            }
                        }
                    }
                } else {
                    me.dirty = true;
                    modified[fieldName] = currentValue;
                }
            }

            if (!me.editing) {
                me.afterEdit();
            }
        }
    },
    
    
    getChanges : function(){
        var modified = this.modified,
            changes  = {},
            field;
            
        for (field in modified) {
            if (modified.hasOwnProperty(field)){
                changes[field] = this[this.persistanceProperty][field];
            }
        }
        
        return changes;
    },
    
    
    isModified : function(fieldName) {
        return !!(this.modified && this.modified.hasOwnProperty(fieldName));
    },
    
    
    setDirty : function() {
        this.dirty = true;
        
        if (!this.modified) {
            this.modified = {};
        }
        
        this.fields.each(function(field) {
            this.modified[field.name] = this[this.persistanceProperty][field.name];
        }, this);
    },
    
    markDirty : function() {
        throw new Error("Stateful: markDirty has been deprecated. Please use setDirty.");
    },
    
    
    reject : function(silent) {
        var modified = this.modified,
            field;
            
        for (field in modified) {
            if (!modified.hasOwnProperty(field)) {
                continue;
            }
            if (typeof modified[field] != "function") {
                this[this.persistanceProperty][field] = modified[field];
            }
        }
        
        this.dirty = false;
        this.editing = false;
        delete this.modified;
        
        if (silent !== true) {
            this.afterReject();
        }
    },
    
    
    commit : function(silent) {
        this.dirty = false;
        this.editing = false;
        
        delete this.modified;
        
        if (silent !== true) {
            this.afterCommit();
        }
    },
    
    
    copy : function(newId) {
        return new this.constructor(Ext.apply({}, this[this.persistanceProperty]), newId || this.internalId);
    }
});

Ext.util.HashMap = Ext.extend(Ext.util.Observable, {
    constructor: function(config) {
        this.addEvents(
            
            'add',
            
            'clear',
            
            'remove',
            
            'replace'
        );
        
        Ext.util.HashMap.superclass.constructor.call(this, config);
        
        this.clear(true);
    },

    
    getCount: function() {
        return this.length;
    },
    
    
    getData: function(key, value) {
        
        if (value === undefined) {
            value = key;
            key = this.getKey(value);
        }
        
        return [key, value];
    },
    
    
    getKey: function(o) {
        return o.id;    
    },

    
    add: function(key, value) {
        var me = this,
            data;
            
        if (me.containsKey(key)) {
            throw new Error('This key already exists in the HashMap');
        }
        
        data = this.getData(key, value);
        key = data[0];
        value = data[1];
        me.map[key] = value;
        ++me.length;
        me.fireEvent('add', me, key, value);
        return value;
    },

    
    replace: function(key, value) {
        var me = this,
            map = me.map,
            old;
            
        if (!me.containsKey(key)) {
            me.add(key, value);
        }
        old = map[key];
        map[key] = value;
        me.fireEvent('replace', me, key, value, old);
        return value;
    },

    
    remove: function(o) {
        var key = this.findKey(o);
        if (key !== undefined) {
            return this.removeByKey(key);
        }
        return false;
    },

    
    removeByKey: function(key) {
        var me = this,
            value;
            
        if (me.containsKey(key)) {
            value = me.map[key];
            delete me.map[key];
            --me.length;
            me.fireEvent('remove', me, key, value);
            return true;
        }
        return false;
    },

    
    get: function(key) {
        return this.map[key];
    },

    
    clear: function( initial) {
        var me = this;
        me.map = {};
        me.length = 0;
        if (initial !== true) {
            me.fireEvent('clear', me);
        }
        return me;
    },

    
    containsKey: function(key) {
        return this.map[key] !== undefined;
    },

    
    contains: function(value) {
        return this.containsKey(this.findKey(value));
    },

    
    getKeys: function() {
        return this.getArray(true);
    },

    
    getValues: function() {
        return this.getArray(false);
    },

    
    getArray: function(isKey) {
        var arr = [],
            key,
            map = this.map;
        for (key in map) {
            if (map.hasOwnProperty(key)) {
                arr.push(isKey ? key: map[key]);
            }
        }
        return arr;
    },

    
    each: function(fn, scope) { 
        
        var items = Ext.apply({}, this.map),
            key,
            length = this.length;

        scope = scope || this;
        for (key in items) {
            if (items.hasOwnProperty(key)) {
                if (fn.call(scope, key, items[key], length) === false) {
                    break;
                }
            }
        }
        return this;
    },

    
    clone: function() {
        var hash = new Ext.util.HashMap(),
            map = this.map,
            key;
            
        hash.suspendEvents();
        for (key in map) {
            if (map.hasOwnProperty(key)) {
                hash.add(key, map[key]);
            }
        }
        hash.resumeEvents();
        return hash;
    },

    
    findKey: function(value) {
        var key,
            map = this.map;

        for (key in map) {
            if (map.hasOwnProperty(key) && map[key] === value) {
                return key;
            }
        }
        return undefined;
    }
});

Ext.util.MixedCollection = function(allowFunctions, keyFn) {
    this.items = [];
    this.map = {};
    this.keys = [];
    this.length = 0;
    this.addEvents(
        
        'clear',
        
        'add',
        
        'replace',
        
        'remove',
        'sort'
    );
    this.allowFunctions = allowFunctions === true;
    if (keyFn) {
        this.getKey = keyFn;
    }
    Ext.util.MixedCollection.superclass.constructor.call(this);
};

Ext.extend(Ext.util.MixedCollection, Ext.util.Observable, {

    
    allowFunctions : false,

    
    add : function(key, obj){
        var myObj = obj, myKey = key;
        if(arguments.length == 1){
            myObj = myKey;
            myKey = this.getKey(myObj);
        }
        if(typeof myKey != 'undefined' && myKey !== null){
            var old = this.map[myKey];
            if(typeof old != 'undefined'){
                return this.replace(myKey, myObj);
            }
            this.map[myKey] = myObj;
        }
        this.length++;
        this.items.push(myObj);
        this.keys.push(myKey);
        this.fireEvent('add', this.length-1, myObj, myKey);
        return myObj;
    },

    
    getKey : function(o){
         return o.id;
    },

    
    replace : function(key, o){
        if(arguments.length == 1){
            o = arguments[0];
            key = this.getKey(o);
        }
        var old = this.map[key];
        if(typeof key == 'undefined' || key === null || typeof old == 'undefined'){
             return this.add(key, o);
        }
        var index = this.indexOfKey(key);
        this.items[index] = o;
        this.map[key] = o;
        this.fireEvent('replace', key, old, o);
        return o;
    },

    
    addAll : function(objs){
        if(arguments.length > 1 || Ext.isArray(objs)){
            var args = arguments.length > 1 ? arguments : objs;
            for(var i = 0, len = args.length; i < len; i++){
                this.add(args[i]);
            }
        }else{
            for(var key in objs){
                if (!objs.hasOwnProperty(key)) {
                    continue;
                }
                if(this.allowFunctions || typeof objs[key] != 'function'){
                    this.add(key, objs[key]);
                }
            }
        }
    },

    
    each : function(fn, scope){
        var items = [].concat(this.items); 
        for(var i = 0, len = items.length; i < len; i++){
            if(fn.call(scope || items[i], items[i], i, len) === false){
                break;
            }
        }
    },

    
    eachKey : function(fn, scope){
        for(var i = 0, len = this.keys.length; i < len; i++){
            fn.call(scope || window, this.keys[i], this.items[i], i, len);
        }
    },

    
    findBy : function(fn, scope) {
        for(var i = 0, len = this.items.length; i < len; i++){
            if(fn.call(scope || window, this.items[i], this.keys[i])){
                return this.items[i];
            }
        }
        return null;
    },
    

    
    insert : function(index, key, obj){
        var myKey = key, myObj = obj;
        if(arguments.length == 2){
            myObj = myKey;
            myKey = this.getKey(myObj);
        }
        if(this.containsKey(myKey)){
            this.suspendEvents();
            this.removeByKey(myKey);
            this.resumeEvents();
        }
        if(index >= this.length){
            return this.add(myKey, myObj);
        }
        this.length++;
        this.items.splice(index, 0, myObj);
        if(typeof myKey != 'undefined' && myKey !== null){
            this.map[myKey] = myObj;
        }
        this.keys.splice(index, 0, myKey);
        this.fireEvent('add', index, myObj, myKey);
        return myObj;
    },

    
    remove : function(o){
        return this.removeAt(this.indexOf(o));
    },

    
    removeAll : function(items){
        Ext.each(items || [], function(item) {
            this.remove(item);
        }, this);

        return this;
    },

    
    removeAt : function(index){
        if(index < this.length && index >= 0){
            this.length--;
            var o = this.items[index];
            this.items.splice(index, 1);
            var key = this.keys[index];
            if(typeof key != 'undefined'){
                delete this.map[key];
            }
            this.keys.splice(index, 1);
            this.fireEvent('remove', o, key);
            return o;
        }
        return false;
    },

    
    removeByKey : function(key){
        return this.removeAt(this.indexOfKey(key));
    },
    
    removeKey : function() {
        console.warn('MixedCollection: removeKey has been deprecated. Please use removeByKey.');
        return this.removeByKey.apply(this, arguments);
    },

    
    getCount : function(){
        return this.length;
    },

    
    indexOf : function(o){
        return this.items.indexOf(o);
    },

    
    indexOfKey : function(key){
        return this.keys.indexOf(key);
    },

    
    get : function(key) {
        var mk = this.map[key],
            item = mk !== undefined ? mk : (typeof key == 'number') ? this.items[key] : undefined;
        return typeof item != 'function' || this.allowFunctions ? item : null; 
    },
    
    item : function() {
        console.warn('MixedCollection: item has been deprecated. Please use get.');
        return this.get.apply(this, arguments);
    },

    
    getAt : function(index) {
        return this.items[index];
    },

    itemAt : function() {
        console.warn('MixedCollection: itemAt has been deprecated. Please use getAt.');
        return this.getAt.apply(this, arguments);
    },
    
    
    getByKey : function(key) {
        return this.map[key];
    },

    key : function() {
        console.warn('MixedCollection: key has been deprecated. Please use getByKey.');
        return this.getByKey.apply(this, arguments);
    },
    
    
    contains : function(o){
        return this.indexOf(o) != -1;
    },

    
    containsKey : function(key){
        return typeof this.map[key] != 'undefined';
    },

    
    clear : function(){
        this.length = 0;
        this.items = [];
        this.keys = [];
        this.map = {};
        this.fireEvent('clear');
    },

    
    first : function() {
        return this.items[0];
    },

    
    last : function() {
        return this.items[this.length-1];
    },

    
    _sort : function(property, dir, fn){
        var i, len,
            dsc   = String(dir).toUpperCase() == 'DESC' ? -1 : 1,

            
            c     = [],
            keys  = this.keys,
            items = this.items;

        
        fn = fn || function(a, b) {
            return a - b;
        };

        
        for(i = 0, len = items.length; i < len; i++){
            c[c.length] = {
                key  : keys[i],
                value: items[i],
                index: i
            };
        }

        
        c.sort(function(a, b){
            var v = fn(a[property], b[property]) * dsc;
            if(v === 0){
                v = (a.index < b.index ? -1 : 1);
            }
            return v;
        });

        
        for(i = 0, len = c.length; i < len; i++){
            items[i] = c[i].value;
            keys[i]  = c[i].key;
        }

        this.fireEvent('sort', this);
    },

    
    sort : function(property, direction) {
        
        var sorters = property;
        
        
        if (Ext.isString(property)) {
            sorters = [new Ext.util.Sorter({
                property : property,
                direction: direction || "ASC"
            })];
        } else if (property instanceof Ext.util.Sorter) {
            sorters = [property];
        } else if (Ext.isObject(property)) {
            sorters = [new Ext.util.Sorter(property)];
        }
        
        var length = sorters.length;
        
        if (length == 0) {
            return;
        }
                
        
        var sorterFn = function(r1, r2) {
            var result = sorters[0].sort(r1, r2),
                length = sorters.length,
                i;
            
                
                for (i = 1; i < length; i++) {
                    result = result || sorters[i].sort.call(this, r1, r2);
                }                
           
            return result;
        };
        
        this.sortBy(sorterFn);
    },
    
    
    sortBy: function(sorterFn) {
        var items  = this.items,
            keys   = this.keys,
            length = items.length,
            temp   = [],
            i;
        
        
        for (i = 0; i < length; i++) {
            temp[i] = {
                key  : keys[i],
                value: items[i],
                index: i
            };
        }
        
        temp.sort(function(a, b) {
            var v = sorterFn(a.value, b.value);
            if (v === 0) {
                v = (a.index < b.index ? -1 : 1);
            }
            
            return v;
        });
        
        
        for (i = 0; i < length; i++) {
            items[i] = temp[i].value;
            keys[i]  = temp[i].key;
        }
        
        this.fireEvent('sort', this);
    },

    
    reorder: function(mapping) {
        this.suspendEvents();

        var items = this.items,
            index = 0,
            length = items.length,
            order = [],
            remaining = [],
            oldIndex;

        
        for (oldIndex in mapping) {
            order[mapping[oldIndex]] = items[oldIndex];
        }

        for (index = 0; index < length; index++) {
            if (mapping[index] == undefined) {
                remaining.push(items[index]);
            }
        }

        for (index = 0; index < length; index++) {
            if (order[index] == undefined) {
                order[index] = remaining.shift();
            }
        }

        this.clear();
        this.addAll(order);

        this.resumeEvents();
        this.fireEvent('sort', this);
    },

    
    sortByKey : function(dir, fn){
        this._sort('key', dir, fn || function(a, b){
            var v1 = String(a).toUpperCase(), v2 = String(b).toUpperCase();
            return v1 > v2 ? 1 : (v1 < v2 ? -1 : 0);
        });
    },
    
    keySort : function() {
        console.warn('MixedCollection: keySort has been deprecated. Please use sortByKey.');
        return this.sortByKey.apply(this, arguments);
    },
    

    
    getRange : function(start, end){
        var items = this.items;
        if(items.length < 1){
            return [];
        }
        start = start || 0;
        end = Math.min(typeof end == 'undefined' ? this.length-1 : end, this.length-1);
        var i, r = [];
        if(start <= end){
            for(i = start; i <= end; i++) {
                r[r.length] = items[i];
            }
        }else{
            for(i = start; i >= end; i--) {
                r[r.length] = items[i];
            }
        }
        return r;
    },

    
    filter : function(property, value, anyMatch, caseSensitive) {
        var filters = [];
        
        
        if (Ext.isString(property)) {
            filters.push(new Ext.util.Filter({
                property     : property,
                value        : value,
                anyMatch     : anyMatch,
                caseSensitive: caseSensitive
            }));
        } else if (Ext.isArray(property) || property instanceof Ext.util.Filter) {
            filters = filters.concat(property);
        }
        
        
        
        var filterFn = function(record) {
            var isMatch = true,
                length = filters.length,
                i;

            for (i = 0; i < length; i++) {
                var filter = filters[i],
                    fn     = filter.filterFn,
                    scope  = filter.scope;

                isMatch = isMatch && fn.call(scope, record);
            }

            return isMatch;
        };
        
        return this.filterBy(filterFn);
    },

    
    filterBy : function(fn, scope) {
        var newMC  = new Ext.util.MixedCollection(),
            keys   = this.keys, 
            items  = this.items,
            length = items.length,
            i;
            
        newMC.getKey = this.getKey;
        
        for (i = 0; i < length; i++) {
            if (fn.call(scope||this, items[i], keys[i])) {
                newMC.add(keys[i], items[i]);
            }
        }
        
        return newMC;
    },

    
    findIndex : function(property, value, start, anyMatch, caseSensitive){
        if(Ext.isEmpty(value, false)){
            return -1;
        }
        value = this.createValueMatcher(value, anyMatch, caseSensitive);
        return this.findIndexBy(function(o){
            return o && value.test(o[property]);
        }, null, start);
    },

    
    findIndexBy : function(fn, scope, start){
        var k = this.keys, it = this.items;
        for(var i = (start||0), len = it.length; i < len; i++){
            if(fn.call(scope||this, it[i], k[i])){
                return i;
            }
        }
        return -1;
    },

    
    createValueMatcher : function(value, anyMatch, caseSensitive, exactMatch) {
        if (!value.exec) { 
            var er = Ext.util.Format.escapeRegex;
            value = String(value);

            if (anyMatch === true) {
                value = er(value);
            } else {
                value = '^' + er(value);
                if (exactMatch === true) {
                    value += '$';
                }
            }
            value = new RegExp(value, caseSensitive ? '' : 'i');
         }
         return value;
    },

    
    clone : function(){
        var r = new Ext.util.MixedCollection();
        var k = this.keys, it = this.items;
        for(var i = 0, len = it.length; i < len; i++){
            r.add(k[i], it[i]);
        }
        r.getKey = this.getKey;
        return r;
    }
});




Ext.AbstractManager = Ext.extend(Object, {
    typeName: 'type',

    constructor: function(config) {
        Ext.apply(this, config || {});

        
        this.all = new Ext.util.HashMap();

        this.types = {};
    },

    
    get : function(id) {
        return this.all.get(id);
    },

    
    register: function(item) {
        this.all.add(item);
    },

    
    unregister: function(item) {
        this.all.remove(item);
    },

    
    registerType : function(type, cls) {
        this.types[type] = cls;
        cls[this.typeName] = type;
    },

    
    isRegistered : function(type){
        return this.types[type] !== undefined;
    },

    
    create: function(config, defaultType) {
        var type        = config[this.typeName] || config.type || defaultType,
            Constructor = this.types[type];

        if (Constructor == undefined) {
            throw new Error(Ext.util.Format.format("The '{0}' type has not been registered with this manager", type));
        }

        return new Constructor(config);
    },

    
    onAvailable : function(id, fn, scope){
        var all = this.all;

        all.on("add", function(index, o){
            if (o.id == id) {
                fn.call(scope || o, o);
                all.un("add", fn, scope);
            }
        });
    },
    
    
    each: function(fn, scope){
        this.all.each(fn, scope || this);    
    },
    
    
    getCount: function(){
        return this.all.getCount();
    }
});


Ext.util.DelayedTask = function(fn, scope, args) {
    var me = this,
        id,
        call = function() {
            clearInterval(id);
            id = null;
            fn.apply(scope, args || []);
        };

    
    this.delay = function(delay, newFn, newScope, newArgs) {
        me.cancel();
        fn = newFn || fn;
        scope = newScope || scope;
        args = newArgs || args;
        id = setInterval(call, delay);
    };

    
    this.cancel = function(){
        if (id) {
            clearInterval(id);
            id = null;
        }
    };
};

Ext.util.GeoLocation = Ext.extend(Ext.util.Observable, {
    
    autoUpdate: true,

    
    
    latitude: null,
    
    longitude: null,
    
    accuracy: null,
    
    altitude: null,
    
    altitudeAccuracy: null,
    
    heading: null,
    
    speed: null,
    
    timestamp: null,

    
    
    allowHighAccuracy: false,
    
    
    timeout: Infinity,
    
    maximumAge: 0,
    
    setMaximumAge: function(maximumAge) {
        this.maximumAge = maximumAge;
        this.setAutoUpdate(this.autoUpdate);
    },
    
    setTimeout: function(timeout) {
        this.timeout = timeout;
        this.setAutoUpdate(this.autoUpdate);
    },
    
    setAllowHighAccuracy: function(allowHighAccuracy) {
        this.allowHighAccuracy = allowHighAccuracy;
        this.setAutoUpdate(this.autoUpdate);
    },
    

    
    provider : null,
    
    watchOperation : null,

    constructor : function(config) {
        Ext.apply(this, config);
        

        this.coords = this; //@deprecated


        if (Ext.supports.GeoLocation) {
            this.provider = this.provider || 
                (navigator.geolocation ? navigator.geolocation : 
                (window.google || {}).gears ? google.gears.factory.create('beta.geolocation') : null);           
        }
        
        this.addEvents(
            
            'update',
            
            'locationerror',
            
            'locationupdate'
        );

        Ext.util.GeoLocation.superclass.constructor.call(this);

        if(this.autoUpdate){
            var me = this;
            setTimeout(function(){
                me.setAutoUpdate(me.autoUpdate);
            }, 0);
        }
    },

    
    setAutoUpdate : function(autoUpdate) {
        if (this.watchOperation !== null) {
            this.provider.clearWatch(this.watchOperation);
            this.watchOperation = null;
        }
        if (!autoUpdate) {
            return true;
        }
        if (!Ext.supports.GeoLocation) {
            this.fireEvent('locationerror', this, false, false, true, null);
            return false;
        }
        try{
            this.watchOperation = this.provider.watchPosition(
                Ext.createDelegate(this.fireUpdate, this), 
                Ext.createDelegate(this.fireError, this), 
                this.parseOptions());
        }
        catch(e){
            this.autoUpdate = false;
            this.fireEvent('locationerror', this, false, false, true, e.message);
            return false;
        }
        return true;
    },

    
    updateLocation : function(callback, scope, positionOptions) {
        var me = this;

        var failFunction = function(message, error){
            if(error){
                me.fireError(error);
            }
            else{
                me.fireEvent('locationerror', me, false, false, true, message);
            }
            if(callback){
                callback.call(scope || me, null, me); 
            }
            me.fireEvent('update', false, me); 
        };

        if (!Ext.supports.GeoLocation) {
            setTimeout(function() {
                failFunction(null);
            }, 0);
            return;
        }

        try{
            this.provider.getCurrentPosition(
                
                function(position){
                    me.fireUpdate(position);
                    if(callback){
                        callback.call(scope || me, me, me); 
                    }
                    me.fireEvent('update', me, me); 
                },
                
                function(error){
                    failFunction(null, error);
                },
                positionOptions ? positionOptions : this.parseOptions());
        }
        catch(e){
            setTimeout(function(){
                failFunction(e.message);
            }, 0);
        }
    },

    
    fireUpdate: function(position){
        this.timestamp = position.timestamp;
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.accuracy = position.coords.accuracy;
        this.altitude = position.coords.altitude;
        this.altitudeAccuracy = position.coords.altitudeAccuracy;
        
        
        this.heading = typeof position.coords.heading == 'undefined' ? null : position.coords.heading;
        this.speed = typeof position.coords.speed == 'undefined' ? null : position.coords.speed;
        this.fireEvent('locationupdate', this);
    },
    fireError: function(error){
        this.fireEvent('locationerror', this,
            error.code == error.TIMEOUT, 
            error.code == error.PERMISSION_DENIED, 
            error.code == error.POSITION_UNAVAILABLE,
            error.message == undefined ? null : error.message);
    },
    parseOptions: function(){
        var ret = { 
            maximumAge: this.maximumAge, 
            allowHighAccuracy: this.allowHighAccuracy
        };
        
        if(this.timeout !== Infinity){
            ret.timeout = this.timeout;
        }
        return ret;
    },

    
    getLocation : function(callback, scope) {
        var me = this;
        if(this.latitude !== null){
            callback.call(scope || me, me, me);
        }
        else {
            me.updateLocation(callback, scope);
        }
    }
});

Ext.util.Region = Ext.extend(Object, {
    
    constructor : function(t, r, b, l) {
        var me = this;
        me.top = t;
        me[1] = t;
        me.right = r;
        me.bottom = b;
        me.left = l;
        me[0] = l;
    },

    
    contains : function(region) {
        var me = this;
        return (region.left >= me.left &&
                region.right <= me.right &&
                region.top >= me.top &&
                region.bottom <= me.bottom);

    },

    
    intersect : function(region) {
        var me = this,
            t = Math.max(me.top, region.top),
            r = Math.min(me.right, region.right),
            b = Math.min(me.bottom, region.bottom),
            l = Math.max(me.left, region.left);

        if (b > t && r > l) {
            return new Ext.util.Region(t, r, b, l);
        }
        else {
            return false;
        }
    },

    
    union : function(region) {
        var me = this,
            t = Math.min(me.top, region.top),
            r = Math.max(me.right, region.right),
            b = Math.max(me.bottom, region.bottom),
            l = Math.min(me.left, region.left);

        return new Ext.util.Region(t, r, b, l);
    },

    
    constrainTo : function(r) {
        var me = this,
            constrain = Ext.util.Numbers.constrain;
        me.top = constrain(me.top, r.top, r.bottom);
        me.bottom = constrain(me.bottom, r.top, r.bottom);
        me.left = constrain(me.left, r.left, r.right);
        me.right = constrain(me.right, r.left, r.right);
        return me;
    },

    
    adjust : function(t, r, b, l) {
        var me = this;
        me.top += t;
        me.left += l;
        me.right += r;
        me.bottom += b;
        return me;
    },

    
    getOutOfBoundOffset: function(axis, p) {
        if (!Ext.isObject(axis)) {
            if (axis == 'x') {
                return this.getOutOfBoundOffsetX(p);
            } else {
                return this.getOutOfBoundOffsetY(p);
            }
        } else {
            p = axis;
            var d = new Ext.util.Offset();
                d.x = this.getOutOfBoundOffsetX(p.x);
                d.y = this.getOutOfBoundOffsetY(p.y);
            return d;
        }

    },

    
    getOutOfBoundOffsetX: function(p) {
        if (p <= this.left) {
            return this.left - p;
        } else if (p >= this.right) {
            return this.right - p;
        }

        return 0;
    },

    
    getOutOfBoundOffsetY: function(p) {
        if (p <= this.top) {
            return this.top - p;
        } else if (p >= this.bottom) {
            return this.bottom - p;
        }

        return 0;
    },

    
    isOutOfBound: function(axis, p) {
        if (!Ext.isObject(axis)) {
            if (axis == 'x') {
                return this.isOutOfBoundX(p);
            } else {
                return this.isOutOfBoundY(p);
            }
        } else {
            p = axis;
            return (this.isOutOfBoundX(p.x) || this.isOutOfBoundY(p.y));
        }
    },

    
    isOutOfBoundX: function(p) {
        return (p < this.left || p > this.right);
    },

    
    isOutOfBoundY: function(p) {
        return (p < this.top || p > this.bottom);
    },

    
    restrict: function(axis, p, factor) {
        if (Ext.isObject(axis)) {
            var newP;

            factor = p;
            p = axis;

            if (p.copy) {
                newP = p.copy();
            }
            else {
                newP = {
                    x: p.x,
                    y: p.y
                };
            }

            newP.x = this.restrictX(p.x, factor);
            newP.y = this.restrictY(p.y, factor);
            return newP;
        } else {
            if (axis == 'x') {
                return this.restrictX(p, factor);
            } else {
                return this.restrictY(p, factor);
            }
        }
    },

    
    restrictX : function(p, factor) {
        if (!factor) {
            factor = 1;
        }

        if (p <= this.left) {
            p -= (p - this.left) * factor;
        }
        else if (p >= this.right) {
            p -= (p - this.right) * factor;
        }
        return p;
    },

    
    restrictY : function(p, factor) {
        if (!factor) {
            factor = 1;
        }

        if (p <= this.top) {
            p -= (p - this.top) * factor;
        }
        else if (p >= this.bottom) {
            p -= (p - this.bottom) * factor;
        }
        return p;
    },

    
    getSize: function() {
        return {
            width: this.right - this.left,
            height: this.bottom - this.top
        };
    },

    
    copy: function() {
        return new Ext.util.Region(this.top, this.right, this.bottom, this.left);
    },

    
    toString: function() {
        return "Region[" + this.top + "," + this.right + "," + this.bottom + "," + this.left + "]";
    },


    
    translateBy: function(offset) {
        this.left += offset.x;
        this.right += offset.x;
        this.top += offset.y;
        this.bottom += offset.y;

        return this;
    },

    
    round: function() {
        this.top = Math.round(this.top);
        this.right = Math.round(this.right);
        this.bottom = Math.round(this.bottom);
        this.left = Math.round(this.left);

        return this;
    },

    
    equals: function(region) {
        return (this.top == region.top && this.right == region.right && this.bottom == region.bottom && this.left == region.left)
    }
});


Ext.util.Region.getRegion = function(el) {
    return Ext.fly(el).getPageBox(true);
};


Ext.util.Region.from = function(o) {
    return new Ext.util.Region(o.top, o.right, o.bottom, o.left);
};


Ext.util.Point = Ext.extend(Object, {
    constructor: function(x, y) {
        this.x = (x != null && !isNaN(x)) ? x : 0;
        this.y = (y != null && !isNaN(y)) ? y : 0;

        return this;
    },

    
    copy: function() {
        return new Ext.util.Point(this.x, this.y);
    },

    
    copyFrom: function(p) {
        this.x = p.x;
        this.y = p.y;

        return this;
    },

    
    toString: function() {
        return "Point[" + this.x + "," + this.y + "]";
    },

    
    equals: function(p) {
        return (this.x == p.x && this.y == p.y);
    },

    
    isWithin: function(p, threshold) {
        if (!Ext.isObject(threshold)) {
            threshold = {x: threshold};
            threshold.y = threshold.x;
        }

        return (this.x <= p.x + threshold.x && this.x >= p.x - threshold.x &&
                this.y <= p.y + threshold.y && this.y >= p.y - threshold.y);
    },

    
    translate: function(x, y) {
        if (x != null && !isNaN(x))
            this.x += x;

        if (y != null && !isNaN(y))
            this.y += y;
    },

    
    roundedEquals: function(p) {
        return (Math.round(this.x) == Math.round(p.x) && Math.round(this.y) == Math.round(p.y));
    }
});


Ext.util.Point.fromEvent = function(e) {
    var a = (e.changedTouches && e.changedTouches.length > 0) ? e.changedTouches[0] : e;
    return new Ext.util.Point(a.pageX, a.pageY);
};
Ext.util.Offset = Ext.extend(Object, {
    constructor: function(x, y) {
        this.x = (x != null && !isNaN(x)) ? x : 0;
        this.y = (y != null && !isNaN(y)) ? y : 0;

        return this;
    },

    copy: function() {
        return new Ext.util.Offset(this.x, this.y);
    },

    copyFrom: function(p) {
        this.x = p.x;
        this.y = p.y;
    },

    toString: function() {
        return "Offset[" + this.x + "," + this.y + "]";
    },

    equals: function(offset) {
        if(!(offset instanceof Ext.util.Offset))
            throw new Error('offset must be an instance of Ext.util.Offset');

        return (this.x == offset.x && this.y == offset.y);
    },

    round: function(to) {
        if (!isNaN(to)) {
            var factor = Math.pow(10, to);
            this.x = Math.round(this.x * factor) / factor;
            this.y = Math.round(this.y * factor) / factor;
        } else {
            this.x = Math.round(this.x);
            this.y = Math.round(this.y);
        }
    },

    isZero: function() {
        return this.x == 0 && this.y == 0;
    }
});

Ext.util.Offset.fromObject = function(obj) {
    return new Ext.util.Offset(obj.x, obj.y);
};

Ext.Template = Ext.extend(Object, {
    constructor: function(html) {
        var me = this,
            args = arguments,
            buffer = [],
            value, i, length;
            
        me.initialConfig = {};

        if (Ext.isArray(html)) {
            html = html.join("");
        }
        else if (args.length > 1) {
            for (i = 0, length = args.length; i < length; i++) {
                value = args[i];
                if (typeof value == 'object') {
                    Ext.apply(me.initialConfig, value);
                    Ext.apply(me, value);
                } else {
                    buffer.push(value);
                }
            }
            html = buffer.join('');
        }

        
        me.html = html;
        
        if (me.compiled) {
            me.compile();
        }
    },
    isTemplate: true,  
    
    disableFormats: false,
    
    re: /\{([\w-]+)(?:\:([\w\.]*)(?:\((.*?)?\))?)?\}/g,      
    
    applyTemplate: function(values) {
        var me = this,
            useFormat = me.disableFormats !== true,
            fm = Ext.util.Format,
            tpl = me;

        if (me.compiled) {
            return me.compiled(values);
        }
        function fn(m, name, format, args) {
            if (format && useFormat) {
                if (args) {
                    args = [values[name]].concat(new Function('return ['+ args +'];')());
                } else {
                    args = [values[name]];
                }
                if (format.substr(0, 5) == "this.") {
                    return tpl[format.substr(5)].apply(tpl, args);
                }
                else {
                    return fm[format].apply(fm, args);
                }
            }
            else {
                return values[name] !== undefined ? values[name] : "";
            }
        }
        return me.html.replace(me.re, fn);
    },

    
    set: function(html, compile) {
        var me = this;
        me.html = html;
        me.compiled = null;
        return compile ? me.compile() : me;
    },
    
    compileARe: /\\/g,
    compileBRe: /(\r\n|\n)/g,
    compileCRe: /'/g,
    /**
     * Compiles the template into an internal function, eliminating the RegEx overhead.
     * @return {Ext.Template} this
     * @hide repeat doc
     */
    compile: function() {
        var me = this,
            fm = Ext.util.Format,
            useFormat = me.disableFormats !== true,
            body, bodyReturn;

        function fn(m, name, format, args) {
            if (format && useFormat) {
                args = args ? ',' + args: "";
                if (format.substr(0, 5) != "this.") {
                    format = "fm." + format + '(';
                }
                else {
                    format = 'this.' + format.substr(5) + '(';
                }
            }
            else {
                args = '';
                format = "(values['" + name + "'] == undefined ? '' : ";
            }
            return "'," + format + "values['" + name + "']" + args + ") ,'";
        }

        bodyReturn = me.html.replace(me.compileARe, '\\\\').replace(me.compileBRe, '\\n').replace(me.compileCRe, "\\'").replace(me.re, fn);
        body = "this.compiled = function(values){ return ['" + bodyReturn + "'].join('');};";
        eval(body);
        return me;
    },

    /**
     * Applies the supplied values to the template and inserts the new node(s) as the first child of el.
     * @param {Mixed} el The context element
     * @param {Object/Array} values The template values. Can be an array if your params are numeric (i.e. {0}) or an object (i.e. {foo: 'bar'})
     * @param {Boolean} returnElement (optional) true to return a Ext.Element (defaults to undefined)
     * @return {HTMLElement/Ext.Element} The new node or Element
     */
    insertFirst: function(el, values, returnElement) {
        return this.doInsert('afterBegin', el, values, returnElement);
    },

    /**
     * Applies the supplied values to the template and inserts the new node(s) before el.
     * @param {Mixed} el The context element
     * @param {Object/Array} values The template values. Can be an array if your params are numeric (i.e. {0}) or an object (i.e. {foo: 'bar'})
     * @param {Boolean} returnElement (optional) true to return a Ext.Element (defaults to undefined)
     * @return {HTMLElement/Ext.Element} The new node or Element
     */
    insertBefore: function(el, values, returnElement) {
        return this.doInsert('beforeBegin', el, values, returnElement);
    },

    /**
     * Applies the supplied values to the template and inserts the new node(s) after el.
     * @param {Mixed} el The context element
     * @param {Object/Array} values The template values. Can be an array if your params are numeric (i.e. {0}) or an object (i.e. {foo: 'bar'})
     * @param {Boolean} returnElement (optional) true to return a Ext.Element (defaults to undefined)
     * @return {HTMLElement/Ext.Element} The new node or Element
     */
    insertAfter: function(el, values, returnElement) {
        return this.doInsert('afterEnd', el, values, returnElement);
    },

    /**
     * Applies the supplied <code>values</code> to the template and appends
     * the new node(s) to the specified <code>el</code>.
     * <p>For example usage {@link #Template see the constructor}.</p>
     * @param {Mixed} el The context element
     * @param {Object/Array} values
     * The template values. Can be an array if the params are numeric (i.e. <code>{0}</code>)
     * or an object (i.e. <code>{foo: 'bar'}</code>).
     * @param {Boolean} returnElement (optional) true to return an Ext.Element (defaults to undefined)
     * @return {HTMLElement/Ext.Element} The new node or Element
     */
    append: function(el, values, returnElement) {
        return this.doInsert('beforeEnd', el, values, returnElement);
    },

    doInsert: function(where, el, values, returnEl) {
        el = Ext.getDom(el);
        var newNode = Ext.DomHelper.insertHtml(where, el, this.applyTemplate(values));
        return returnEl ? Ext.get(newNode, true) : newNode;
    },

    /**
     * Applies the supplied values to the template and overwrites the content of el with the new node(s).
     * @param {Mixed} el The context element
     * @param {Object/Array} values The template values. Can be an array if your params are numeric (i.e. {0}) or an object (i.e. {foo: 'bar'})
     * @param {Boolean} returnElement (optional) true to return a Ext.Element (defaults to undefined)
     * @return {HTMLElement/Ext.Element} The new node or Element
     */
    overwrite: function(el, values, returnElement) {
        el = Ext.getDom(el);
        el.innerHTML = this.applyTemplate(values);
        return returnElement ? Ext.get(el.firstChild, true) : el.firstChild;
    }
});
/**
 * Alias for {@link #applyTemplate}
 * Returns an HTML fragment of this template with the specified <code>values</code> applied.
 * @param {Object/Array} values
 * The template values. Can be an array if the params are numeric (i.e. <code>{0}</code>)
 * or an object (i.e. <code>{foo: 'bar'}</code>).
 * @return {String} The HTML fragment
 * @member Ext.Template
 * @method apply
 */
Ext.Template.prototype.apply = Ext.Template.prototype.applyTemplate;

/**
 * Creates a template from the passed element's value (<i>display:none</i> textarea, preferred) or innerHTML.
 * @param {String/HTMLElement} el A DOM element or its id
 * @param {Object} config A configuration object
 * @return {Ext.Template} The created template
 * @static
 */
Ext.Template.from = function(el, config) {
    el = Ext.getDom(el);
    return new Ext.Template(el.value || el.innerHTML, config || '');
};

/**
 * @class Ext.XTemplate
 * @extends Ext.Template
 * <p>A template class that supports advanced functionality like:<div class="mdetail-params"><ul>
 * <li>Autofilling arrays using templates and sub-templates</li>
 * <li>Conditional processing with basic comparison operators</li>
 * <li>Basic math function support</li>
 * <li>Execute arbitrary inline code with special built-in template variables</li>
 * <li>Custom member functions</li>
 * <li>Many special tags and built-in operators that aren't defined as part of
 * the API, but are supported in the templates that can be created</li>
 * </ul></div></p>
 * <p>XTemplate provides the templating mechanism built into:<div class="mdetail-params"><ul>
 * <li>{@link Ext.DataView}</li>
 * </ul></div></p>
 *
 * The {@link Ext.Template} describes
 * the acceptable parameters to pass to the constructor. The following
 * examples demonstrate all of the supported features.</p>
 *
 * <div class="mdetail-params"><ul>
 *
 * <li><b><u>Sample Data</u></b>
 * <div class="sub-desc">
 * <p>This is the data object used for reference in each code example:</p>
 * <pre><code>
var data = {
name: 'Tommy Maintz',
title: 'Lead Developer',
company: 'Ext JS, Inc',
email: 'tommy@extjs.com',
address: '5 Cups Drive',
city: 'Palo Alto',
state: 'CA',
zip: '44102',
drinks: ['Coffee', 'Soda', 'Water'],
kids: [{
        name: 'Joshua',
        age:3
    },{
        name: 'Matthew',
        age:2
    },{
        name: 'Solomon',
        age:0
}]
};
 </code></pre>
 * </div>
 * </li>
 *
 *
 * <li><b><u>Auto filling of arrays</u></b>
 * <div class="sub-desc">
 * <p>The <b><tt>tpl</tt></b> tag and the <b><tt>for</tt></b> operator are used
 * to process the provided data object:
 * <ul>
 * <li>If the value specified in <tt>for</tt> is an array, it will auto-fill,
 * repeating the template block inside the <tt>tpl</tt> tag for each item in the
 * array.</li>
 * <li>If <tt>for="."</tt> is specified, the data object provided is examined.</li>
 * <li>While processing an array, the special variable <tt>{#}</tt>
 * will provide the current array index + 1 (starts at 1, not 0).</li>
 * </ul>
 * </p>
 * <pre><code>
&lt;tpl <b>for</b>=".">...&lt;/tpl>       // loop through array at root node
&lt;tpl <b>for</b>="foo">...&lt;/tpl>     // loop through array at foo node
&lt;tpl <b>for</b>="foo.bar">...&lt;/tpl> // loop through array at foo.bar node
 </code></pre>
 * Using the sample data above:
 * <pre><code>
var tpl = new Ext.XTemplate(
    '&lt;p>Kids: ',
    '&lt;tpl <b>for</b>=".">',       // process the data.kids node
        '&lt;p>{#}. {name}&lt;/p>',  // use current array index to autonumber
    '&lt;/tpl>&lt;/p>'
);
tpl.overwrite(panel.body, data.kids); // pass the kids property of the data object
 </code></pre>
 * <p>An example illustrating how the <b><tt>for</tt></b> property can be leveraged
 * to access specified members of the provided data object to populate the template:</p>
 * <pre><code>
var tpl = new Ext.XTemplate(
    '&lt;p>Name: {name}&lt;/p>',
    '&lt;p>Title: {title}&lt;/p>',
    '&lt;p>Company: {company}&lt;/p>',
    '&lt;p>Kids: ',
    '&lt;tpl <b>for="kids"</b>>',     // interrogate the kids property within the data
        '&lt;p>{name}&lt;/p>',
    '&lt;/tpl>&lt;/p>'
);
tpl.overwrite(panel.body, data);  // pass the root node of the data object
 </code></pre>
 * <p>Flat arrays that contain values (and not objects) can be auto-rendered
 * using the special <b><tt>{.}</tt></b> variable inside a loop.  This variable
 * will represent the value of the array at the current index:</p>
 * <pre><code>
var tpl = new Ext.XTemplate(
    '&lt;p>{name}\&#39;s favorite beverages:&lt;/p>',
    '&lt;tpl for="drinks">',
        '&lt;div> - {.}&lt;/div>',
    '&lt;/tpl>'
);
tpl.overwrite(panel.body, data);
 </code></pre>
 * <p>When processing a sub-template, for example while looping through a child array,
 * you can access the parent object's members via the <b><tt>parent</tt></b> object:</p>
 * <pre><code>
var tpl = new Ext.XTemplate(
    '&lt;p>Name: {name}&lt;/p>',
    '&lt;p>Kids: ',
    '&lt;tpl for="kids">',
        '&lt;tpl if="age &amp;gt; 1">',
            '&lt;p>{name}&lt;/p>',
            '&lt;p>Dad: {<b>parent</b>.name}&lt;/p>',
        '&lt;/tpl>',
    '&lt;/tpl>&lt;/p>'
);
tpl.overwrite(panel.body, data);
 </code></pre>
 * </div>
 * </li>
 *
 *
 * <li><b><u>Conditional processing with basic comparison operators</u></b>
 * <div class="sub-desc">
 * <p>The <b><tt>tpl</tt></b> tag and the <b><tt>if</tt></b> operator are used
 * to provide conditional checks for deciding whether or not to render specific
 * parts of the template. Notes:<div class="sub-desc"><ul>
 * <li>Double quotes must be encoded if used within the conditional</li>
 * <li>There is no <tt>else</tt> operator &mdash; if needed, two opposite
 * <tt>if</tt> statements should be used.</li>
 * </ul></div>
 * <pre><code>
&lt;tpl if="age &gt; 1 &amp;&amp; age &lt; 10">Child&lt;/tpl>
&lt;tpl if="age >= 10 && age < 18">Teenager&lt;/tpl>
&lt;tpl <b>if</b>="this.isGirl(name)">...&lt;/tpl>
&lt;tpl <b>if</b>="id==\'download\'">...&lt;/tpl>
&lt;tpl <b>if</b>="needsIcon">&lt;img src="{icon}" class="{iconCls}"/>&lt;/tpl>
// no good:
&lt;tpl if="name == "Tommy"">Hello&lt;/tpl>
// encode &#34; if it is part of the condition, e.g.
&lt;tpl if="name == &#38;quot;Tommy&#38;quot;">Hello&lt;/tpl>
 * </code></pre>
 * Using the sample data above:
 * <pre><code>
var tpl = new Ext.XTemplate(
    '&lt;p>Name: {name}&lt;/p>',
    '&lt;p>Kids: ',
    '&lt;tpl for="kids">',
        '&lt;tpl if="age &amp;gt; 1">',
            '&lt;p>{name}&lt;/p>',
        '&lt;/tpl>',
    '&lt;/tpl>&lt;/p>'
);
tpl.overwrite(panel.body, data);
 </code></pre>
 * </div>
 * </li>
 *
 *
 * <li><b><u>Basic math support</u></b>
 * <div class="sub-desc">
 * <p>The following basic math operators may be applied directly on numeric
 * data values:</p><pre>
 * + - * /
 * </pre>
 * For example:
 * <pre><code>
var tpl = new Ext.XTemplate(
    '&lt;p>Name: {name}&lt;/p>',
    '&lt;p>Kids: ',
    '&lt;tpl for="kids">',
        '&lt;tpl if="age &amp;gt; 1">',  // <-- Note that the &gt; is encoded
            '&lt;p>{#}: {name}&lt;/p>',  // <-- Auto-number each item
            '&lt;p>In 5 Years: {age+5}&lt;/p>',  // <-- Basic math
            '&lt;p>Dad: {parent.name}&lt;/p>',
        '&lt;/tpl>',
    '&lt;/tpl>&lt;/p>'
);
tpl.overwrite(panel.body, data);
 </code></pre>
 * </div>
 * </li>
 *
 *
 * <li><b><u>Execute arbitrary inline code with special built-in template variables</u></b>
 * <div class="sub-desc">
 * <p>Anything between <code>{[ ... ]}</code> is considered code to be executed
 * in the scope of the template. There are some special variables available in that code:
 * <ul>
 * <li><b><tt>values</tt></b>: The values in the current scope. If you are using
 * scope changing sub-templates, you can change what <tt>values</tt> is.</li>
 * <li><b><tt>parent</tt></b>: The scope (values) of the ancestor template.</li>
 * <li><b><tt>xindex</tt></b>: If you are in a looping template, the index of the
 * loop you are in (1-based).</li>
 * <li><b><tt>xcount</tt></b>: If you are in a looping template, the total length
 * of the array you are looping.</li>
 * </ul>
 * This example demonstrates basic row striping using an inline code block and the
 * <tt>xindex</tt> variable:</p>
 * <pre><code>
var tpl = new Ext.XTemplate(
    '&lt;p>Name: {name}&lt;/p>',
    '&lt;p>Company: {[values.company.toUpperCase() + ", " + values.title]}&lt;/p>',
    '&lt;p>Kids: ',
    '&lt;tpl for="kids">',
        '&lt;div class="{[xindex % 2 === 0 ? "even" : "odd"]}">',
        '{name}',
        '&lt;/div>',
    '&lt;/tpl>&lt;/p>'
 );
tpl.overwrite(panel.body, data);
 </code></pre>
 * </div>
 * </li>
 *
 * <li><b><u>Template member functions</u></b>
 * <div class="sub-desc">
 * <p>One or more member functions can be specified in a configuration
 * object passed into the XTemplate constructor for more complex processing:</p>
 * <pre><code>
var tpl = new Ext.XTemplate(
    '&lt;p>Name: {name}&lt;/p>',
    '&lt;p>Kids: ',
    '&lt;tpl for="kids">',
        '&lt;tpl if="this.isGirl(name)">',
            '&lt;p>Girl: {name} - {age}&lt;/p>',
        '&lt;/tpl>',
         // use opposite if statement to simulate 'else' processing:
        '&lt;tpl if="this.isGirl(name) == false">',
            '&lt;p>Boy: {name} - {age}&lt;/p>',
        '&lt;/tpl>',
        '&lt;tpl if="this.isBaby(age)">',
            '&lt;p>{name} is a baby!&lt;/p>',
        '&lt;/tpl>',
    '&lt;/tpl>&lt;/p>',
    {
        // XTemplate configuration:
        compiled: true,
        // member functions:
        isGirl: function(name){
           return name == 'Sara Grace';
        },
        isBaby: function(age){
           return age < 1;
        }
    }
);
tpl.overwrite(panel.body, data);
 </code></pre>
 * </div>
 * </li>
 *
 * </ul></div>
 *
 * @param {Mixed} config
 */

Ext.XTemplate = Ext.extend(Ext.Template, {
    argsRe: /<tpl\b[^>]*>((?:(?=([^<]+))\2|<(?!tpl\b[^>]*>))*?)<\/tpl>/,
    nameRe: /^<tpl\b[^>]*?for="(.*?)"/,
    ifRe: /^<tpl\b[^>]*?if="(.*?)"/,
    execRe: /^<tpl\b[^>]*?exec="(.*?)"/,
    constructor: function() {
        Ext.XTemplate.superclass.constructor.apply(this, arguments);

        var me = this,
            html = me.html,
            argsRe = me.argsRe,
            nameRe = me.nameRe,
            ifRe = me.ifRe,
            execRe = me.execRe,
            id = 0,
            tpls = [],
            VALUES = 'values',
            PARENT = 'parent',
            XINDEX = 'xindex',
            XCOUNT = 'xcount',
            RETURN = 'return ',
            WITHVALUES = 'with(values){ ',
            m, matchName, matchIf, matchExec, exp, fn, exec, name, i;

        html = ['<tpl>', html, '</tpl>'].join('');

        while ((m = html.match(argsRe))) {
            exp = null;
            fn = null;
            exec = null;
            matchName = m[0].match(nameRe);
            matchIf = m[0].match(ifRe);
            matchExec = m[0].match(execRe);

            exp = matchIf ? matchIf[1] : null;
            if (exp) {
                fn = new Function(VALUES, PARENT, XINDEX, XCOUNT, WITHVALUES + 'try{' + RETURN + Ext.util.Format.htmlDecode(exp) + ';}catch(e){return;}}');
            }

            exp = matchExec ? matchExec[1] : null;
            if (exp) {
                exec = new Function(VALUES, PARENT, XINDEX, XCOUNT, WITHVALUES + Ext.util.Format.htmlDecode(exp) + ';}');
            }
            
            name = matchName ? matchName[1] : null;
            if (name) {
                if (name === '.') {
                    name = VALUES;
                } else if (name === '..') {
                    name = PARENT;
                }
                name = new Function(VALUES, PARENT, 'try{' + WITHVALUES + RETURN + name + ';}}catch(e){return;}');
            }

            tpls.push({
                id: id,
                target: name,
                exec: exec,
                test: fn,
                body: m[1] || ''
            });

            html = html.replace(m[0], '{xtpl' + id + '}');
            id = id + 1;
        }

        for (i = tpls.length - 1; i >= 0; --i) {
            me.compileTpl(tpls[i]);
        }
        me.master = tpls[tpls.length - 1];
        me.tpls = tpls;
    },

    // @private
    applySubTemplate: function(id, values, parent, xindex, xcount) {
        var me = this, t = me.tpls[id];
        return t.compiled.call(me, values, parent, xindex, xcount);
    },
    /**
     * @cfg {RegExp} codeRe The regular expression used to match code variables (default: matches <tt>{[expression]}</tt>).
     */
    codeRe: /\{\[((?:\\\]|.|\n)*?)\]\}/g,

    re: /\{([\w-\.\#]+)(?:\:([\w\.]*)(?:\((.*?)?\))?)?(\s?[\+\-\*\/]\s?[\d\.\+\-\*\/\(\)]+)?\}/g,

    // @private
    compileTpl: function(tpl) {
        var fm = Ext.util.Format,
            me = this,
            useFormat = me.disableFormats !== true,
            body, bodyReturn, evaluatedFn;

        function fn(m, name, format, args, math) {
            var v;
            // name is what is inside the {}
            // Name begins with xtpl, use a Sub Template
            if (name.substr(0, 4) == 'xtpl') {
                return "',this.applySubTemplate(" + name.substr(4) + ", values, parent, xindex, xcount),'";
            }
            // name = "." - Just use the values object.
            if (name == '.') {
                v = 'typeof values == "string" ? values : ""';
            }

            // name = "#" - Use the xindex
            else if (name == '#') {
                v = 'xindex';
            }
            else if (name.substr(0, 7) == "parent.") {
                v = name;
            }
            // name has a . in it - Use object literal notation, starting from values
            else if (name.indexOf('.') != -1) {
                v = "values." + name;
            }

            // name is a property of values
            else {
                v = "values['" + name + "']";
            }
            if (math) {
                v = '(' + v + math + ')';
            }
            if (format && useFormat) {
                args = args ? ',' + args : "";
                if (format.substr(0, 5) != "this.") {
                    format = "fm." + format + '(';
                }
                else {
                    format = 'this.' + format.substr(5) + '(';
                }
            }
            else {
                args = '';
                format = "(" + v + " === undefined ? '' : ";
            }
            return "'," + format + v + args + "),'";
        }

        function codeFn(m, code) {
            // Single quotes get escaped when the template is compiled, however we want to undo this when running code.
            return "',(" + code.replace(me.compileARe, "'") + "),'";
        }
        
        bodyReturn = tpl.body.replace(me.compileBRe, '\\n').replace(me.compileCRe, "\\'").replace(me.re, fn).replace(me.codeRe, codeFn);
        body = "evaluatedFn = function(values, parent, xindex, xcount){return ['" + bodyReturn + "'].join('');};";
        eval(body);
                        
        tpl.compiled = function(values, parent, xindex, xcount) {
            var vs, 
                length,
                buffer,
                i;
                
            if (tpl.test && !tpl.test.call(me, values, parent, xindex, xcount)) {
                return '';
            } 
                           
            vs = tpl.target ? tpl.target.call(me, values, parent) : values;
            if (!vs) {
               return '';
            }
   
            parent = tpl.target ? values : parent;
            if (tpl.target && Ext.isArray(vs)) {
                buffer = [], length = vs.length;
                if (tpl.exec) {
                    for (i = 0; i < length; i++) {
                        buffer[buffer.length] = evaluatedFn.call(me, vs[i], parent, i + 1, length);
                        tpl.exec.call(me, vs[i], parent, i + 1, length);
                    }
                } else {
                    for (i = 0; i < length; i++) {
                        buffer[buffer.length] = evaluatedFn.call(me, vs[i], parent, i + 1, length);
                    }
                }
                return buffer.join('');
            }
                
            if (tpl.exec) {
                tpl.exec.call(me, vs, parent, xindex, xcount);
            }
            return evaluatedFn.call(me, vs, parent, xindex, xcount);
        }
                
        return this;
    },

    /**
     * Returns an HTML fragment of this template with the specified values applied.
     * @param {Object} values The template values. Can be an array if your params are numeric (i.e. {0}) or an object (i.e. {foo: 'bar'})
     * @return {String} The HTML fragment
     */
    applyTemplate: function(values) {
        return this.master.compiled.call(this, values, {}, 1, 1);
    },

    /**
     * Compile the template to a function for optimized performance.  Recommended if the template will be used frequently.
     * @return {Function} The compiled function
     */
    compile: function() {
        return this;
    }
});
/**
 * Alias for {@link #applyTemplate}
 * Returns an HTML fragment of this template with the specified values applied.
 * @param {Object/Array} values The template values. Can be an array if your params are numeric (i.e. {0}) or an object (i.e. {foo: 'bar'})
 * @return {String} The HTML fragment
 * @member Ext.XTemplate
 * @method apply
 */
Ext.XTemplate.prototype.apply = Ext.XTemplate.prototype.applyTemplate;

/**
 * Creates a template from the passed element's value (<i>display:none</i> textarea, preferred) or innerHTML.
 * @param {String/HTMLElement} el A DOM element or its id
 * @return {Ext.Template} The created template
 * @static
 */
Ext.XTemplate.from = function(el, config) {
    el = Ext.getDom(el);
    return new Ext.XTemplate(el.value || el.innerHTML, config || {});
};



Ext.util.Sorter = Ext.extend(Object, {
    
    
    
    
    
    
    
    direction: "ASC",
    
    constructor: function(config) {
        Ext.apply(this, config);
        
        if (this.property == undefined && this.sorterFn == undefined) {
            throw "A Sorter requires either a property or a sorter function";
        }
        
        this.sort = this.createSortFunction(this.sorterFn || this.defaultSorterFn);
    },
    
    
    createSortFunction: function(sorterFn) {
        var me        = this,
            property  = me.property,
            direction = me.direction,
            modifier  = direction.toUpperCase() == "DESC" ? -1 : 1;
        
        
        
        return function(o1, o2) {
            return modifier * sorterFn.call(me, o1, o2);
        };
    },
    
    
    defaultSorterFn: function(o1, o2) {
        var v1 = this.getRoot(o1)[this.property],
            v2 = this.getRoot(o2)[this.property];

        return v1 > v2 ? 1 : (v1 < v2 ? -1 : 0);
    },
    
    
    getRoot: function(item) {
        return this.root == undefined ? item : item[this.root];
    }
});

Ext.util.Filter = Ext.extend(Object, {
    
    
    
    
    
    anyMatch: false,
    
    
    exactMatch: false,
    
    
    caseSensitive: false,
    
    
    
    constructor: function(config) {
        Ext.apply(this, config);
        
        
        
        this.filter = this.filter || this.filterFn;
        
        if (this.filter == undefined) {
            if (this.property == undefined || this.value == undefined) {
                
                
                
                
            } else {
                this.filter = this.createFilterFn();
            }
            
            this.filterFn = this.filter;
        }
    },
    
    
    createFilterFn: function() {
        var me       = this,
            matcher  = me.createValueMatcher(),
            property = me.property;
        
        return function(item) {
            return matcher.test(me.getRoot.call(me, item)[property]);
        };
    },
    
    
    getRoot: function(item) {
        return this.root == undefined ? item : item[this.root];
    },
    
    
    createValueMatcher : function() {
        var me            = this,
            value         = me.value,
            anyMatch      = me.anyMatch,
            exactMatch    = me.exactMatch,
            caseSensitive = me.caseSensitive,
            escapeRe      = Ext.util.Format.escapeRegex;
        
        if (!value.exec) { 
            value = String(value);

            if (anyMatch === true) {
                value = escapeRe(value);
            } else {
                value = '^' + escapeRe(value);
                if (exactMatch === true) {
                    value += '$';
                }
            }
            value = new RegExp(value, caseSensitive ? '' : 'i');
         }
         
         return value;
    }
});

Ext.util.Functions = {
    
    createInterceptor: function(origFn, newFn, scope, returnValue) { 
        var method = origFn;
        if (!Ext.isFunction(newFn)) {
            return origFn;
        }
        else {
            return function() {
                var me = this,
                    args = arguments;
                newFn.target = me;
                newFn.method = origFn;
                return (newFn.apply(scope || me || window, args) !== false) ?
                        origFn.apply(me || window, args) :
                        returnValue || null;
            };
        }
    },

    
    createDelegate: function(fn, obj, args, appendArgs) {
        if (!Ext.isFunction(fn)) {
            return fn;
        }
        return function() {
            var callArgs = args || arguments;
            if (appendArgs === true) {
                callArgs = Array.prototype.slice.call(arguments, 0);
                callArgs = callArgs.concat(args);
            }
            else if (Ext.isNumber(appendArgs)) {
                callArgs = Array.prototype.slice.call(arguments, 0);
                
                var applyArgs = [appendArgs, 0].concat(args);
                
                Array.prototype.splice.apply(callArgs, applyArgs);
                
            }
            return fn.apply(obj || window, callArgs);
        };
    },

    
    defer: function(fn, millis, obj, args, appendArgs) {
        fn = Ext.util.Functions.createDelegate(fn, obj, args, appendArgs);
        if (millis > 0) {
            return setTimeout(fn, millis);
        }
        fn();
        return 0;
    },


    
    createSequence: function(origFn, newFn, scope) {
        if (!Ext.isFunction(newFn)) {
            return origFn;
        }
        else {
            return function() {
                var retval = origFn.apply(this || window, arguments);
                newFn.apply(scope || this || window, arguments);
                return retval;
            };
        }
    }
};



Ext.defer = Ext.util.Functions.defer;



Ext.createInterceptor = Ext.util.Functions.createInterceptor;



Ext.createSequence = Ext.util.Functions.createSequence;


Ext.createDelegate = Ext.util.Functions.createDelegate;



Ext.util.Date = {
    
    getElapsed: function(dateA, dateB) {
        return Math.abs(dateA - (dateB || new Date));
    }
};


Ext.util.Numbers = {
    
    
    toFixedBroken: (0.9).toFixed() != 1,
    
    
    constrain : function(number, min, max) {
        number = parseFloat(number);
        if (!isNaN(min)) {
            number = Math.max(number, min);
        }
        if (!isNaN(max)) {
            number = Math.min(number, max);
        }
        return number;
    },
    
    
    toFixed : function(value, precision) {
        if(Ext.util.Numbers.toFixedBroken) {
            precision = precision || 0;
            var pow = Math.pow(10, precision);
            return Math.round(value * pow) / pow;
        }
        return value.toFixed(precision);
    }
};


Ext.util.Format = {
    defaultDateFormat: 'm/d/Y',
    escapeRe: /('|\\)/g,
    trimRe: /^[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+|[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+$/g,
    formatRe: /\{(\d+)\}/g,
    escapeRegexRe: /([-.*+?^${}()|[\]\/\\])/g,
    
    /**
     * Truncate a string and add an ellipsis ('...') to the end if it exceeds the specified length
     * @param {String} value The string to truncate
     * @param {Number} length The maximum length to allow before truncating
     * @param {Boolean} word True to try to find a common word break
     * @return {String} The converted text
     */
    ellipsis: function(value, len, word) {
        if (value && value.length > len) {
            if (word) {
                var vs = value.substr(0, len - 2),
                index = Math.max(vs.lastIndexOf(' '), vs.lastIndexOf('.'), vs.lastIndexOf('!'), vs.lastIndexOf('?'));
                if (index != -1 && index >= (len - 15)) {
                    return vs.substr(0, index) + "...";
                }
            } 
            return value.substr(0, len - 3) + "...";
        }
        return value;
    },

    /**
     * Escapes the passed string for use in a regular expression
     * @param {String} str
     * @return {String}
     */
    escapeRegex : function(s) {
        return s.replace(Ext.util.Format.escapeRegexRe, "\\$1");
    },

    /**
     * Escapes the passed string for ' and \
     * @param {String} string The string to escape
     * @return {String} The escaped string
     */
    escape : function(string) {
        return string.replace(Ext.util.Format.escapeRe, "\\$1");
    },

    
    toggle : function(string, value, other) {
        return string == value ? other : value;
    },

    
    trim : function(string) {
        return string.replace(Ext.util.Format.trimRe, "");
    },

    
    leftPad : function (val, size, ch) {
        var result = String(val);
        ch = ch || " ";
        while (result.length < size) {
            result = ch + result;
        }
        return result;
    },

    
    format : function (format) {
        var args = Ext.toArray(arguments, 1);
        return format.replace(Ext.util.Format.formatRe, function(m, i) {
            return args[i];
        });
    },

    
    htmlEncode: function(value) {
        return ! value ? value: String(value).replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
    },

    
    htmlDecode: function(value) {
        return ! value ? value: String(value).replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
    },

    
    date: function(v, format) {
        if (!v) {
            return "";
        }
        if (!Ext.isDate(v)) {
            v = new Date(Date.parse(v));
        }
        return v.dateFormat(format || Ext.util.Format.defaultDateFormat);
    }
};


Ext.LoadMask = Ext.extend(Ext.util.Observable, {
    

    
    msg : 'Loading...',
    
    msgCls : 'x-mask-loading',

    
    disabled: false,

    constructor : function(el, config) {
        this.el = Ext.get(el);
        Ext.apply(this, config);

        this.addEvents('show', 'hide');
        if (this.store) {
            this.bindStore(this.store, true);
        }
        Ext.LoadMask.superclass.constructor.call(this);
    },

    
    bindStore : function(store, initial) {
        if (!initial && this.store) {
            this.mun(this.store, {
                scope: this,
                beforeload: this.onBeforeLoad,
                load: this.onLoad,
                exception: this.onLoad
            });
            if(!store) {
                this.store = null;
            }
        }
        if (store) {
            store = Ext.StoreMgr.lookup(store);
            this.mon(store, {
                scope: this,
                beforeload: this.onBeforeLoad,
                load: this.onLoad,
                exception: this.onLoad
            });

        }
        this.store = store;
        if (store && store.isLoading()) {
            this.onBeforeLoad();
        }
    },

    
    disable : function() {
       this.disabled = true;
    },

    
    enable : function() {
        this.disabled = false;
    },

    
    isDisabled : function() {
        return this.disabled;
    },

    
    onLoad : function() {
        this.el.unmask();
        this.fireEvent('hide', this, this.el, this.store);
    },

    
    onBeforeLoad : function() {
        if (!this.disabled) {
            this.el.mask(Ext.LoadingSpinner + '<div class="x-loading-msg">' + this.msg + '</div>', this.msgCls, false);
            this.fireEvent('show', this, this.el, this.store);
        }
    },

    
    show: function() {
        this.onBeforeLoad();
    },

    
    hide: function() {
        this.onLoad();
    },

    
    destroy : function() {
        this.hide();
        this.clearListeners();
    }
});

Ext.LoadingSpinner = '<div class="x-loading-spinner"><span class="x-loading-top"></span><span class="x-loading-right"></span><span class="x-loading-bottom"></span><span class="x-loading-left"></span></div>';



Ext.applyIf(Array.prototype, {
    
    indexOf: function(o, from) {
        var len = this.length;
        from = from || 0;
        from += (from < 0) ? len: 0;
        for (; from < len; ++from) {
            if (this[from] === o) {
                return from;
            }
        }
        return - 1;
    },

    
    remove: function(o) {
        var index = this.indexOf(o);
        if (index != -1) {
            this.splice(index, 1);
        }
        return this;
    },

    contains: function(o) {
        return this.indexOf(o) !== -1;
    }
});


Ext.ComponentMgr = new Ext.AbstractManager({
    typeName: 'xtype',

    
    create : function(config, defaultType){
        if (config.isComponent) {
            return config;
        } else {
            var type = config.xtype || defaultType,
                Class = this.types[type];
            if (!Class) {
                throw "Attempting to create a component with an xtype that has not been registered: " + type
            }
            return new Class(config);
        }
        return config.render ? config : new (config);
    },

    registerType : function(type, cls) {
        this.types[type] = cls;
        cls[this.typeName] = type;
        cls.prototype[this.typeName] = type;
    }
});


Ext.reg = function() {
    return Ext.ComponentMgr.registerType.apply(Ext.ComponentMgr, arguments);
}; 


Ext.create = function() {
    return Ext.ComponentMgr.create.apply(Ext.ComponentMgr, arguments);
};


Ext.ComponentQuery = new function() {
    var cq = this,

        
        
        filterFnPattern = [
            'var r = [],',
                'i = 0,',
                'it = arguments[0],',
                'l = it.length,',
                'c;',
            'for (; i < l; i++) {',
                'c = it[i].{0};',
                'if (c) {',
                   'r.push(c);',
                '}',
            '}',
            'return r;'
        ].join(''),

        filterItems = function(items, operation) {
            
            
            
            return operation.method.apply(this, [ items ].concat(operation.args));
        },

        getItems = function(items, mode) {
            var result = [],
                i,
                ln = items.length,
                candidate,
                deep = mode != '>';
            for (i = 0; i < ln; i++) {
                candidate = items[i];
                if (candidate.getRefItems) {
                    result = result.concat(candidate.getRefItems(deep));
                }
            }
            return result;
        },

        getAncestors = function(items) {
            var result = [],
                i,
                ln = items.length,
                candidate;
            for (i = 0; i < ln; i++) {
                candidate = items[i];
                while (!!(candidate = candidate.ownerCt)) {
                    result.push(candidate);
                }
            }
            return result;
        },

        
        filterByXType = function(items, xtype, shallow) {
            if (xtype == '*') {
                return items.slice();
            }
            else {
                var result = [],
                    i,
                    ln = items.length,
                    candidate;
                for (i = 0; i < ln; i++) {
                    candidate = items[i];
                    if (candidate.isXType(xtype, shallow)) {
                        result.push(candidate);
                    }
                }
                return result;
            }
        },

        
        filterByClassName = function(items, className) {
            var result = [],
                i,
                ln = items.length,
                candidate;
            for (i = 0; i < ln; i++) {
                candidate = items[i];
                if (candidate.el ? candidate.el.hasCls(className) : candidate.initCls().contains(className)) {
                    result.push(candidate);
                }
            }
            return result;
        },

        
        filterByAttribute = function(items, property, operator, value) {
            var result = [],
                i,
                ln = items.length,
                candidate;
            for (i = 0; i < ln; i++) {
                candidate = items[i];
                if ((value === undefined) ? !!candidate[property] : (candidate[property] == value)) {
                    result.push(candidate);
                }
            }
            return result;
        },

        
        filterById = function(items, id) {
            var result = [],
                i,
                ln = items.length,
                candidate;
            for (i = 0; i < ln; i++) {
                candidate = items[i];
                if (candidate.getItemId() == id) {
                    result.push(candidate);
                }
            }
            return result;
        },

        
        filterByPseudo = function(items, name, value) {
            return cq.pseudos[name](items, value);
        },

        
        
        modeRe = /^(\s?([>\^])\s?|\s|$)/,

        
        
        tokenRe = /^(?:(#)?([\w-]+|\*)(?:\((true|false)\))?)|(?:\{([^\}]+)\})/,

        matchers = [{
            
            re: /^\.([\w-]+)(?:\((true|false)\))?/,
            method: filterByXType
        },{
            
            re: /^(?:[\[\{](?:@)?([\w-]+)\s?(?:(=|.=)\s?['"]?(.*?)["']?)?[\]\}])/,
            method: filterByAttribute
        }, {
            
            re: /^#([\w-]+)/,
            method: filterById
        }, {
            re: /^\:([\w-]+)(?:\(((?:[^\s>\/]*|.*?))\))?/,
            method: filterByPseudo
        }];

    
    cq.Query = Ext.extend(Object, {
        constructor: function(cfg) {
            cfg = cfg || {};
            Ext.apply(this, cfg);
        },

        execute : function(root) {
            var operations = this.operations,
                ln = operations.length,
                operation, i,
                workingItems;

            
            if (!root) {
		workingItems = Ext.ComponentMgr.all.getArray();
            }

            
            
            for (i = 0; i < ln; i++) {
                operation = operations[i];

                
                
                
                
                
                
                if (operation.mode == '^') {
                    workingItems = getAncestors(workingItems || [root]);
                }
                else if (operation.mode) {
                    workingItems = getItems(workingItems || [root], operation.mode);
                }
                else {
                    workingItems = filterItems(workingItems || getItems([root]), operation);
                }

                
                
                if (i == ln -1) {
                    return workingItems;
                }
            }
            return [];
        },

        is: function(component) {
            var operations = this.operations,
                ln = operations.length,
                i,
                workingItems = Ext.isArray(component) ? component : [ component ];

            
            
            for (i = 0; i < ln && workingItems.length; i++) {
                workingItems = filterItems(workingItems, operations[i]);
            }
            return workingItems.length != 0;
        }
    });

    Ext.apply(this, {

        
        cache: {},

        
        pseudos: {},

        
        query: function(selector, root) {
            var selectors = selector.split(','),
                ln = selectors.length,
                i, query, results = [],
                noDupResults = [], dupMatcher = {}, resultsLn, cmp;

            for (i = 0; i < ln; i++) {
                selector = Ext.util.Format.trim(selectors[i]);
                query = this.cache[selector];
                if (!query) {
                    this.cache[selector] = query = this.parse(selector);
                }
                results = results.concat(query.execute(root));
            }

            
            
            if (ln > 1) {
                resultsLn = results.length;
                for (i = 0; i < resultsLn; i++) {
                    cmp = results[i];
                    if (!dupMatcher[cmp.id]) {
                        noDupResults.push(cmp);
                        dupMatcher[cmp.id] = true;
                    }
                }
                results = noDupResults;
            }
            return results;
        },

        
        is: function(component, selector) {
            if (!selector) {
                return true;
            }
            var query = this.cache[selector];
            if (!query) {
                this.cache[selector] = query = this.parse(selector);
            }
            return query.is(component);
        },

        parse: function(selector) {
            var operations = [],
                ln = matchers.length,
                lastSelector,
                tokenMatch,
                matchedChar,
                modeMatch,
                selectorMatch,
                args,
                i, matcher;

            
            
            
            while (selector && lastSelector != selector) {
                lastSelector = selector;

                
                tokenMatch = selector.match(tokenRe);

                if (tokenMatch) {
                    matchedChar = tokenMatch[1];

                    
                    if (matchedChar == '#') {
                        operations.push({
                            method: filterById,
                            args: [Ext.util.Format.trim(tokenMatch[2])]
                        });
                    }
                    
                    
                    else if (matchedChar == '.') {
                        operations.push({
                            method: filterByClassName,
                            args: [Ext.util.Format.trim(tokenMatch[2])]
                        });
                    }
                    
                    else if (tokenMatch[4]) {
                        operations.push({
                            method: new Function(Ext.util.Format.format(filterFnPattern, tokenMatch[4])),
                            args: []
                        });
                    }
                    
                    
                    else {
                        operations.push({
                            method: filterByXType,
                            args: [Ext.util.Format.trim(tokenMatch[2]), Boolean(tokenMatch[3])]
                        });
                    }

                    
                    selector = selector.replace(tokenMatch[0], '');
                }

                
                
                
                while (!(modeMatch = selector.match(modeRe))) {
                    
                    
                    for (i = 0; selector && i < ln; i++) {
                        matcher = matchers[i];
                        selectorMatch = selector.match(matcher.re);

                        
                        
                        
                        if (selectorMatch) {
                            operations.push({
                                method: matcher.method,
                                args: selectorMatch.splice(1)
                            });
                            selector = selector.replace(selectorMatch[0], '');
                            break; 
                        }
                        
                        if (i == (ln - 1)) {
                            throw "Invalid ComponentQuery selector: \"" + arguments[0] + "\"";
                        }
                    }
                }

                
                
                
                
                if (modeMatch[1]) { 
                    operations.push({
                        mode: modeMatch[2]||modeMatch[1]
                    });
                    selector = selector.replace(modeMatch[0], '');
                }
            }

            
            
            return new cq.Query({
                operations: operations
            });
        }
    });
};


Ext.PluginMgr = new Ext.AbstractManager({
    typeName: 'ptype',

    
    create : function(config, defaultType){
        var PluginCls = this.types[config.ptype || defaultType];
        if (PluginCls.init) {
            return PluginCls;
        } else {
            return new PluginCls(config);
        }
    },

    
    findByType: function(type, defaultsOnly) {
        var matches = [],
            types   = this.types;

        for (var name in types) {
            if (!types.hasOwnProperty(name)) {
                continue;
            }
            var item = types[name];

            if (item.type == type && (!defaultsOnly || (defaultsOnly === true && item.isDefault))) {
                matches.push(item);
            }
        }

        return matches;
    }
});


Ext.preg = function() {
    return Ext.PluginMgr.registerType.apply(Ext.PluginMgr, arguments);
};


Ext.EventManager = {
    optionsRe: /^(?:capture|scope|delay|buffer|single|stopEvent|disableLocking|preventDefault|stopPropagation|normalized|args|delegate|horizontal|vertical|dragThreshold|holdThreshold|doubleTapThreshold|cancelThreshold|singleTapThreshold|fireClickEvent)$/,
    touchRe: /^(?:pinch|pinchstart|pinchend|tap|singletap|doubletap|swipe|swipeleft|swiperight|drag|dragstart|dragend|touchdown|touchstart|touchmove|touchend|taphold|tapstart|tapcancel)$/i,

    
    addListener : function(element, eventName, fn, scope, o){
        
        if (Ext.isObject(eventName)) {
            this.handleListenerConfig(element, eventName);
            return;
        }

        var dom = Ext.getDom(element);

        
        if (!dom){
            throw "Error listening for \"" + eventName + '\". Element "' + element + '" doesn\'t exist.';
        }

        if (!fn) {
            throw 'Error listening for "' + eventName + '". No handler function specified';
        }

        var touch = this.touchRe.test(eventName);

        
        var wrap = this.createListenerWrap(dom, eventName, fn, scope, o, touch);

        
        this.getEventListenerCache(dom, eventName).push({
            fn: fn,
            wrap: wrap,
            scope: scope
        });

        if (touch) {
            Ext.gesture.Manager.addEventListener(dom, eventName, wrap, o);
        }
        else {
            
            o = o || {};
            dom.addEventListener(eventName, wrap, o.capture || false);
        }
    },

    
    removeListener : function(element, eventName, fn, scope) {
        
        if (Ext.isObject(eventName)) {
            this.handleListenerConfig(element, eventName, true);
            return;
        }

        var dom = Ext.getDom(element),
            cache = this.getEventListenerCache(dom, eventName),
            i = cache.length, j,
            listener, wrap, tasks;

        while (i--) {
            listener = cache[i];

            if (listener && (!fn || listener.fn == fn) && (!scope || listener.scope === scope)) {
                wrap = listener.wrap;

                
                if (wrap.task) {
                    clearTimeout(wrap.task);
                    delete wrap.task;
                }

                
                j = wrap.tasks && wrap.tasks.length;
                if (j) {
                    while (j--) {
                        clearTimeout(wrap.tasks[j]);
                    }
                    delete wrap.tasks;
                }

                if (this.touchRe.test(eventName)) {
                    Ext.gesture.Manager.removeEventListener(dom, eventName, wrap);
                }
                else {
                    
                    dom.removeEventListener(eventName, wrap, false);
                }

                
                cache.splice(i, 1);
            }
        }
    },

    
    removeAll : function(element){
        var dom = Ext.getDom(element),
            cache = this.getElementEventCache(dom),
            ev;

        for (ev in cache) {
            if (!cache.hasOwnProperty(ev)) {
                continue;
            }
            this.removeListener(dom, ev);
        }
        Ext.cache[dom.id].events = {};
    },

    purgeElement : function(element, recurse, eventName) {
        var dom = Ext.getDom(element),
            i = 0, len;

        if(eventName) {
            this.removeListener(dom, eventName);
        }
        else {
            this.removeAll(dom);
        }

        if(recurse && dom && dom.childNodes) {
            for(len = element.childNodes.length; i < len; i++) {
                this.purgeElement(element.childNodes[i], recurse, eventName);
            }
        }
    },

    handleListenerConfig : function(element, config, remove) {
        var key, value;

        
        for (key in config) {
            if (!config.hasOwnProperty(key)) {
                continue;
            }
            
            if (!this.optionsRe.test(key)) {
                value = config[key];
                
                
                if (Ext.isFunction(value)) {
                    
                    this[(remove ? 'remove' : 'add') + 'Listener'](element, key, value, config.scope, config);
                }
                
                else {
                    
                    this[(remove ? 'remove' : 'add') + 'Listener'](element, key, config.fn, config.scope, config);
                }
            }
        }
    },

    getId : function(element) {
        
        
        
        var skip = false,
            id;

        element = Ext.getDom(element);

        if (element === document || element === window) {
            skip = true;
        }

        id = Ext.id(element);

        if (!Ext.cache[id]){
            Ext.Element.addToCache(new Ext.Element(element), id);
            if(skip){
                Ext.cache[id].skipGarbageCollection = true;
            }
        }
        return id;
    },

    
    createListenerWrap : function(dom, ename, fn, scope, o, touch) {
        o = !Ext.isObject(o) ? {} : o;

        var f = ["if(!window.Ext) {return;}"];
        
        if (touch) {
            f.push('e = new Ext.TouchEventObjectImpl(e, args);');
        }
        else {
            if(o.buffer || o.delay) {
                f.push('e = new Ext.EventObjectImpl(e);');
            } else {
                f.push('e = Ext.EventObject.setEvent(e);');
            }
        }

        if (o.delegate) {
            f.push('var t = e.getTarget("' + o.delegate + '", this);');
            f.push('if(!t) {return;}');
        } else {
            f.push('var t = e.target;');
        }

        if (o.target) {
            f.push('if(e.target !== o.target) {return;}');
        }

        if(o.stopEvent) {
            f.push('e.stopEvent();');
        } else {
            if(o.preventDefault) {
                f.push('e.preventDefault();');
            }
            if(o.stopPropagation) {
                f.push('e.stopPropagation();');
            }
        }

        if(o.normalized === false) {
            f.push('e = e.browserEvent;');
        }

        if(o.buffer) {
            f.push('(wrap.task && clearTimeout(wrap.task));');
            f.push('wrap.task = setTimeout(function(){');
        }

        if(o.delay) {
            f.push('wrap.tasks = wrap.tasks || [];');
            f.push('wrap.tasks.push(setTimeout(function(){');
        }

        
        f.push('fn.call(scope || dom, e, t, o);');

        if(o.single) {
            f.push('Ext.EventManager.removeListener(dom, ename, fn, scope);');
        }

        if(o.delay) {
            f.push('}, ' + o.delay + '));');
        }

        if(o.buffer) {
            f.push('}, ' + o.buffer + ');');
        }

        var gen = new Function('e', 'o', 'fn', 'scope', 'ename', 'dom', 'wrap', 'args', f.join("\n"));

        return function(e, args) {
            gen.call(dom, e, o, fn, scope, ename, dom, arguments.callee, args);
        };
    },

    getEventListenerCache : function(element, eventName) {
        var eventCache = this.getElementEventCache(element);
        return eventCache[eventName] || (eventCache[eventName] = []);
    },

    getElementEventCache : function(element) {
        var elementCache = Ext.cache[this.getId(element)];
        return elementCache.events || (elementCache.events = {});
    },

    
    onDocumentReady : function(fn, scope, options){
        var me = this,
            readyEvent = me.readyEvent,
            intervalId;

        if(Ext.isReady){ 
            readyEvent || (readyEvent = new Ext.util.Event());
            readyEvent.addListener(fn, scope, options);
            readyEvent.fire();
            readyEvent.listeners = []; 
        }
        else {
            if(!readyEvent) {
                readyEvent = me.readyEvent = new Ext.util.Event();

                
                var fireReady = function() {
                    Ext.isReady = true;

                    
                    window.removeEventListener('load', arguments.callee, false);

                    
                    if (intervalId) {
                        clearInterval(intervalId);
                    }
                    
                    
                    
                    setTimeout(function() {
                        Ext.supports.init();
                        
                        Ext.gesture.Manager.init();
                        Ext.orientation = Ext.Element.getOrientation();
                                                
                        
                        readyEvent.fire({
                            orientation: Ext.orientation,
                            width: Ext.Element.getViewportWidth(),
                            height: Ext.Element.getViewportHeight()
                        });
                        readyEvent.listeners = [];                        
                    }, 50);
                };

                
                

                
                intervalId = setInterval(function(){
                    if(/loaded|complete/.test(document.readyState)) {
                        clearInterval(intervalId);
                        intervalId = null;
                        fireReady();
                    }
                }, 10);

                
                window.addEventListener('load', fireReady, false);
            }

            options = options || {};
            options.delay = options.delay || 1;
            readyEvent.addListener(fn, scope, options);
        }
    },

    
    onWindowResize : function(fn, scope, options) {
        var me = this,
            resizeEvent = me.resizeEvent;

        if(!resizeEvent){
            me.resizeEvent = resizeEvent = new Ext.util.Event();
            var onResize = function() {
                resizeEvent.fire(Ext.Element.getViewportWidth(), Ext.Element.getViewportHeight());
            };
            this.addListener(window, 'resize', onResize, this);
        }

        resizeEvent.addListener(fn, scope, options);
    },

    onOrientationChange : function(fn, scope, options) {
        var me = this,
            orientationEvent = me.orientationEvent;

        if (!orientationEvent) {
            me.orientationEvent = orientationEvent = new Ext.util.Event();
            
            var onOrientationChange = function(viewport, size) {
                Ext.orientation = Ext.Viewport.getOrientation();

                orientationEvent.fire(Ext.orientation, size.width, size.height);
            };

            Ext.Viewport.on('resize', onOrientationChange, this);
        }

        orientationEvent.addListener(fn, scope, options);
    },
    
    unOrientationChange : function(fn, scope, options) {
        var me = this,
            orientationEvent = me.orientationEvent;
        
        if (orientationEvent) {
            orientationEvent.removeListener(fn, scope, options);
        }
    }
};


Ext.EventManager.on = Ext.EventManager.addListener;


Ext.EventManager.un = Ext.EventManager.removeListener;


Ext.onReady = Ext.EventManager.onDocumentReady;

Ext.EventObjectImpl = Ext.extend(Object, {
    constructor : function(e) {
        if (e) {
            this.setEvent(e.browserEvent || e);
        }
    },

    
    setEvent : function(e){
        var me = this;
        if (e == me || (e && e.browserEvent)){ 
            return e;
        }
        me.browserEvent = e;
        if(e) {
            me.type = e.type;

            
            var node = e.target;
            me.target = node && node.nodeType == 3 ? node.parentNode : node;

            
            me.xy = [e.pageX, e.pageY];
            me.timestamp = e.timeStamp;
        } else {
            me.target = null;
            me.xy = [0, 0];
        }
        return me;
    },

    
    stopEvent : function(){
        this.stopPropagation();
        this.preventDefault();
    },

    
    preventDefault : function(){
        if(this.browserEvent) {
            this.browserEvent.preventDefault();
        }
    },

    
    stopPropagation : function() {
        if(this.browserEvent) {
            this.browserEvent.stopPropagation();
        }
    },

    
    getPageX : function(){
        return this.xy[0];
    },

    
    getPageY : function(){
        return this.xy[1];
    },

    
    getXY : function(){
        return this.xy;
    },

    
    getTarget : function(selector, maxDepth, returnEl) {
        return selector ? Ext.fly(this.target).findParent(selector, maxDepth, returnEl) : (returnEl ? Ext.get(this.target) : this.target);
    },

    getTime : function() {
        return this.timestamp;
    }
});


Ext.EventObject = new Ext.EventObjectImpl();

Ext.is = {

    init: function(navigator) {
        var me = this,
            platforms = me.platforms,
            ln = platforms.length,
            i, platform;

        navigator = navigator || window.navigator;

        for (i = 0; i < ln; i++) {
            platform = platforms[i];
            me[platform.identity] = platform.regex.test(navigator[platform.property]);
        }

        
        me.Desktop = me.Mac || me.Windows || (me.Linux && !me.Android);
        
        me.iOS = me.iPhone || me.iPad || me.iPod;

        
        me.Standalone = !!navigator.standalone;

        
        i = me.Android && (/Android\s(\d+\.\d+)/.exec(navigator.userAgent));
        if (i) {
            me.AndroidVersion = i[1];
            me.AndroidMajorVersion = parseInt(i[1], 10);
        }
        
        me.Tablet = me.iPad || (me.Android && me.AndroidMajorVersion === 3);

        
        me.Phone = !me.Desktop && !me.Tablet;

        
        me.MultiTouch = !me.Blackberry && !me.Desktop && !(me.Android && me.AndroidVersion < 3);
    },

    
    platforms: [{
        property: 'platform',
        regex: /iPhone/i,
        identity: 'iPhone'
    },

    
    {
        property: 'platform',
        regex: /iPod/i,
        identity: 'iPod'
    },

    
    {
        property: 'userAgent',
        regex: /iPad/i,
        identity: 'iPad'
    },

    
    {
        property: 'userAgent',
        regex: /Blackberry/i,
        identity: 'Blackberry'
    },

    
    {
        property: 'userAgent',
        regex: /Android/i,
        identity: 'Android'
    },

    
    {
        property: 'platform',
        regex: /Mac/i,
        identity: 'Mac'
    },

    
    {
        property: 'platform',
        regex: /Win/i,
        identity: 'Windows'
    },

    
    {
        property: 'platform',
        regex: /Linux/i,
        identity: 'Linux'
    }]
};

Ext.is.init();


Ext.supports = {
    init: function() {
        var doc = document,
            div = doc.createElement('div'),
            tests = this.tests,
            ln = tests.length,
            i, test;

        div.innerHTML = ['<div style="height:30px;width:50px;">', '<div style="height:20px;width:20px;"></div>', '</div>', '<div style="float:left; background-color:transparent;"></div>'].join('');

        doc.body.appendChild(div);

        for (i = 0; i < ln; i++) {
            test = tests[i];
            this[test.identity] = test.fn.call(this, doc, div);
        }

        doc.body.removeChild(div);
    },

    
    OrientationChange: ((typeof window.orientation != 'undefined') && ('onorientationchange' in window)),

    
    DeviceMotion: ('ondevicemotion' in window),

    
    
    
    Touch: ('ontouchstart' in window) && (!Ext.is.Desktop),

    tests: [
    
    {
        identity: 'Transitions',
        fn: function(doc, div) {
            var prefix = ['webkit', 'Moz', 'o', 'ms', 'khtml'],
                TE = 'TransitionEnd',
                transitionEndName = [
            prefix[0] + TE, 'transitionend', 
            prefix[2] + TE, prefix[3] + TE, prefix[4] + TE],
                ln = prefix.length,
                i = 0,
                out = false;
            div = Ext.get(div);
            for (; i < ln; i++) {
                if (div.getStyle(prefix[i] + "TransitionProperty")) {
                    Ext.supports.CSS3Prefix = prefix[i];
                    Ext.supports.CSS3TransitionEnd = transitionEndName[i];
                    out = true;
                    break;
                }
            }
            return out;
        }
    },

    
    {
        identity: 'RightMargin',
        fn: function(doc, div, view) {
            view = doc.defaultView;
            return ! (view && view.getComputedStyle(div.firstChild.firstChild, null).marginRight != '0px');
        }
    },

    
    {
        identity: 'TransparentColor',
        fn: function(doc, div, view) {
            view = doc.defaultView;
            return ! (view && view.getComputedStyle(div.lastChild, null).backgroundColor != 'transparent');
        }
    },

    
    {
        identity: 'SVG',
        fn: function(doc) {
            return !!doc.createElementNS && !!doc.createElementNS("http:/" + "/www.w3.org/2000/svg", "svg").createSVGRect;
        }
    },

    
    {
        identity: 'Canvas',
        fn: function(doc) {
            return !!doc.createElement('canvas').getContext;
        }
    },

    
    {
        identity: 'VML',
        fn: function(doc) {
            var d = doc.createElement("div");
            d.innerHTML = "<!--[if vml]><br><br><![endif]-->";
            return (d.childNodes.length == 2);
        }
    },

    
    {
        identity: 'Float',
        fn: function(doc, div) {
            return !!div.lastChild.style.cssFloat;
        }
    },

    
    {
        identity: 'AudioTag',
        fn: function(doc) {
            return !!doc.createElement('audio').canPlayType;
        }
    },

    
    {
        identity: 'History',
        fn: function() {
            return !! (window.history && history.pushState);
        }
    },

    
    {
        identity: 'CSS3DTransform',
        fn: function() {
            return (typeof WebKitCSSMatrix != 'undefined' && new WebKitCSSMatrix().hasOwnProperty('m41'));
        }
    },

    
    {
        identity: 'CSS3LinearGradient',
        fn: function(doc, div) {
            var property = 'background-image:',
                webkit = '-webkit-gradient(linear, left top, right bottom, from(black), to(white))',
                w3c = 'linear-gradient(left top, black, white)',
                moz = '-moz-' + w3c,
                options = [property + webkit, property + w3c, property + moz];

            div.style.cssText = options.join(';');

            return ("" + div.style.backgroundImage).indexOf('gradient') !== -1;
        }
    },

    
    {
        identity: 'CSS3BorderRadius',
        fn: function(doc, div) {
            var domPrefixes = ['borderRadius', 'BorderRadius', 'MozBorderRadius', 'WebkitBorderRadius', 'OBorderRadius', 'KhtmlBorderRadius'],
                pass = false,
                i;

            for (i = 0; i < domPrefixes.length; i++) {
                if (document.body.style[domPrefixes[i]] !== undefined) {
                    return pass = true;
                }
            }

            return pass;
        }
    },

    
    {
        identity: 'GeoLocation',
        fn: function() {
            return (typeof navigator != 'undefined' && typeof navigator.geolocation != 'undefined') || (typeof google != 'undefined' && typeof google.gears != 'undefined');
        }
    }]
};



Ext.data.Batch = Ext.extend(Ext.util.Observable, {
    
    autoStart: false,
    
    
    current: -1,
    
    
    total: 0,
    
    
    isRunning: false,
    
    
    isComplete: false,
    
    
    hasException: false,
    
    
    pauseOnException: true,
    
    constructor: function(config) {                
        this.addEvents(
          
          'complete',
          
          
          'exception',
          
          
          'operationcomplete',
          
          
          'operation-complete'
        );
        
        Ext.data.Batch.superclass.constructor.call(this, config);
        
        
        this.operations = [];
    },
    
    
    add: function(operation) {
        this.total++;
        
        operation.setBatch(this);
        
        this.operations.push(operation);
    },
    
    
    start: function() {
        this.hasException = false;
        this.isRunning = true;
        
        this.runNextOperation();
    },
    
    
    runNextOperation: function() {
        this.runOperation(this.current + 1);
    },
    
    
    pause: function() {
        this.isRunning = false;
    },
    
    
    runOperation: function(index) {
        var operations = this.operations,
            operation  = operations[index];
        
        if (operation == undefined) {
            this.isRunning  = false;
            this.isComplete = true;
            this.fireEvent('complete', this, operations[operations.length - 1]);
        } else {
            this.current = index;
            
            var onProxyReturn = function(operation) {
                var hasException = operation.hasException();
                
                if (hasException) {
                    this.hasException = true;
                    this.fireEvent('exception', this, operation);
                } else {
                    
                    
                    this.fireEvent('operation-complete', this, operation);
                    
                    this.fireEvent('operationcomplete', this, operation);
                }

                if (hasException && this.pauseOnException) {
                    this.pause();
                } else {
                    operation.setCompleted();
                    
                    this.runNextOperation();
                }
            };
            
            operation.setStarted();
            
            this.proxy[operation.action](operation, onProxyReturn, this);
        }
    }
});

Ext.data.Model = Ext.extend(Ext.util.Stateful, {
    evented: false,
    isModel: true,
    
    
    phantom : false,
    
    
    idProperty: 'id',
    
    constructor: function(data, id) {
        data = data || {};
        
        
        this.internalId = (id || id === 0) ? id : Ext.data.Model.id(this);
        
        Ext.data.Model.superclass.constructor.apply(this);
        
        
        var fields = this.fields.items,
            length = fields.length,
            field, name, i;
        
        for (i = 0; i < length; i++) {
            field = fields[i];
            name  = field.name;
            
            if (data[name] == undefined) {
                data[name] = field.defaultValue;
            }
        }
        
        this.set(data);
        this.dirty = false;
        
        if (this.getId()) {
            this.phantom = false;
        }
        
        if (typeof this.init == 'function') {
            this.init();
        }
    },
    
    
    validate: function() {
        var errors      = new Ext.data.Errors(),
            validations = this.validations,
            validators  = Ext.data.validations,
            length, validation, field, valid, type, i;

        if (validations) {
            length = validations.length;
            
            for (i = 0; i < length; i++) {
                validation = validations[i];
                field = validation.field || validation.name;
                type  = validation.type;
                valid = validators[type](validation, this.get(field));
                
                if (!valid) {
                    errors.add({
                        field  : field,
                        message: validation.message || validators[type + 'Message']
                    });
                }
            }
        }
        
        return errors;
    },
    
    
    getProxy: function() {
        return this.constructor.proxy;
    },
    
    
    save: function(options) {
        var me     = this,
            action = me.phantom ? 'create' : 'update';
        
        options = options || {};
        
        Ext.apply(options, {
            records: [me],
            action : action
        });
        
        var operation  = new Ext.data.Operation(options),
            successFn  = options.success,
            failureFn  = options.failure,
            callbackFn = options.callback,
            scope      = options.scope,
            record;
        
        var callback = function(operation) {
            record = operation.getRecords()[0];
            
            if (operation.wasSuccessful()) {
                
                
                me.set(record.data);
                record.dirty = false;

                if (typeof successFn == 'function') {
                    successFn.call(scope, record, operation);
                }
            } else {
                if (typeof failureFn == 'function') {
                    failureFn.call(scope, record, operation);
                }
            }
            
            if (typeof callbackFn == 'function') {
                callbackFn.call(scope, record, operation);
            }
        };
        
        me.getProxy()[action](operation, callback, me);
        
        return me;
    },
    
    
    getId: function() {
        return this.get(this.idProperty);
    },
    
    
    setId: function(id) {
        this.set(this.idProperty, id);
    },
    
    
    join : function(store) {
        
        this.store = store;
    },
    
    
    unjoin: function(store) {
        delete this.store;
    },
    
    
    afterEdit : function() {
        this.callStore('afterEdit');
    },
    
    
    afterReject : function() {
        this.callStore("afterReject");
    },
    
    
    afterCommit: function() {
        this.callStore('afterCommit');
    },
    
    
    callStore: function(fn) {
        var store = this.store;
        
        if (store != undefined && typeof store[fn] == "function") {
            store[fn](this);
        }
    }
});

Ext.apply(Ext.data.Model, {
    
    setProxy: function(proxy) {
        
        proxy = Ext.data.ProxyMgr.create(proxy);
        
        proxy.setModel(this);
        this.proxy = proxy;
        
        return proxy;
    },
    
    
    load: function(id, config) {
        config = Ext.applyIf(config || {}, {
            action: 'read',
            id    : id
        });
        
        var operation  = new Ext.data.Operation(config),
            callbackFn = config.callback,
            successFn  = config.success,
            failureFn  = config.failure,
            scope      = config.scope,
            record, callback;
        
        callback = function(operation) {
            record = operation.getRecords()[0];
            
            if (operation.wasSuccessful()) {
                if (typeof successFn == 'function') {
                    successFn.call(scope, record, operation);
                }
            } else {
                if (typeof failureFn == 'function') {
                    failureFn.call(scope, record, operation);
                }
            }
            
            if (typeof callbackFn == 'function') {
                callbackFn.call(scope, record, operation);
            }
        };
        
        this.proxy.read(operation, callback, this);
    }
});


Ext.data.Model.id = function(rec) {
    rec.phantom = true;
    return [Ext.data.Model.PREFIX, '-', Ext.data.Model.AUTO_ID++].join('');
};



Ext.ns('Ext.data.Record');


Ext.data.Record.id = Ext.data.Model.id;


Ext.data.Model.PREFIX = 'ext-record';
Ext.data.Model.AUTO_ID = 1;
Ext.data.Model.EDIT = 'edit';
Ext.data.Model.REJECT = 'reject';
Ext.data.Model.COMMIT = 'commit';


Ext.data.Association = Ext.extend(Object, {
    
    
    
    
    
    primaryKey: 'id',
    
    constructor: function(config) {
        Ext.apply(this, config);
        
        var types           = Ext.ModelMgr.types,
            ownerName       = config.ownerModel,
            associatedName  = config.associatedModel,
            ownerModel      = types[ownerName],
            associatedModel = types[associatedName],
            ownerProto;
        
        if (ownerModel == undefined) {
            throw new Error("The configured ownerModel was not valid (you tried " + ownerName + ")");
        }
        
        if (associatedModel == undefined) {
            throw new Error("The configured associatedModel was not valid (you tried " + associatedName + ")");
        }
        
        this.ownerModel = ownerModel;
        this.associatedModel = associatedModel;
        
        
        
        
        
        Ext.applyIf(this, {
            ownerName : ownerName,
            associatedName: associatedName
        });
    }
});

Ext.data.HasManyAssociation = Ext.extend(Ext.data.Association, {
    
    
    
    
    
    
    
    
    constructor: function(config) {
        Ext.data.HasManyAssociation.superclass.constructor.apply(this, arguments);
        
        var ownerProto = this.ownerModel.prototype,
            name       = this.name;
        
        Ext.applyIf(this, {
            storeName : name + "Store",
            foreignKey: this.ownerName.toLowerCase() + "_id"
        });
        
        ownerProto[name] = this.createStore();
    },
    
    
    createStore: function() {
        var associatedModel = this.associatedModel,
            storeName       = this.storeName,
            foreignKey      = this.foreignKey,
            primaryKey      = this.primaryKey,
            filterProperty  = this.filterProperty,
            storeConfig     = this.storeConfig || {};
        
        return function() {
            var me = this,
                config, filter,
                modelDefaults = {};
                
            if (me[storeName] == undefined) {
                if (filterProperty) {
                    filter = {
                        property  : filterProperty,
                        value     : me.get(filterProperty),
                        exactMatch: true
                    };
                } else {
                    filter = {
                        property  : foreignKey,
                        value     : me.get(primaryKey),
                        exactMatch: true
                    };
                }
                
                modelDefaults[foreignKey] = me.get(primaryKey);
                
                config = Ext.apply({}, storeConfig, {
                    model        : associatedModel,
                    filters      : [filter],
                    remoteFilter : false,
                    modelDefaults: modelDefaults
                });
                
                me[storeName] = new Ext.data.Store(config);
            }
            
            return me[storeName];
        };
    }
});

Ext.data.BelongsToAssociation = Ext.extend(Ext.data.Association, {
    
    
    

    
    
    constructor: function(config) {
        Ext.data.BelongsToAssociation.superclass.constructor.apply(this, arguments);
        
        var me             = this,
            ownerProto     = me.ownerModel.prototype,
            associatedName = me.associatedName,
            getterName     = me.getterName || 'get' + associatedName,
            setterName     = me.setterName || 'set' + associatedName;

        Ext.applyIf(me, {
            name        : associatedName,
            foreignKey  : associatedName.toLowerCase() + "_id",
            instanceName: associatedName + 'BelongsToInstance'
        });
        
        ownerProto[getterName] = me.createGetter();
        ownerProto[setterName] = me.createSetter();
    },
    
    
    createSetter: function() {
        var me              = this,
            ownerModel      = me.ownerModel,
            associatedModel = me.associatedModel,
            foreignKey      = me.foreignKey,
            primaryKey      = me.primaryKey;
        
        
        return function(value, options, scope) {
            this.set(foreignKey, value);
            
            if (typeof options == 'function') {
                options = {
                    callback: options,
                    scope: scope || this
                };
            }
            
            if (Ext.isObject(options)) {
                return this.save(options);
            }
        };
    },
    
    
    createGetter: function() {
        var me              = this,
            ownerModel      = me.ownerModel,
            associatedName  = me.associatedName,
            associatedModel = me.associatedModel,
            foreignKey      = me.foreignKey,
            primaryKey      = me.primaryKey,
            instanceName    = me.instanceName;
        
        
        return function(options, scope) {
            options = options || {};
            
            var foreignKeyId = this.get(foreignKey),
                instance, callbackFn;
                
            if (this[instanceName] == undefined) {
                instance = Ext.ModelMgr.create({}, associatedName);
                instance.set(primaryKey, foreignKeyId);

                if (typeof options == 'function') {
                    options = {
                        callback: options,
                        scope: scope || this
                    };
                }
                
                associatedModel.load(foreignKeyId, options);
            } else {
                instance = this[instanceName];
                
                
                
                
                if (typeof options == 'function') {
                    options.call(scope || this, instance);
                }
                
                if (options.success) {
                    options.success.call(scope || this, instance);
                }
                
                if (options.callback) {
                    options.callback.call(scope || this, instance);
                }
                
                return instance;
            }
        };
    }
});

Ext.data.PolymorphicAssociation = Ext.extend(Ext.data.Association, {

    constructor: function(config) {
        Ext.data.PolymorphicAssociation.superclass.constructor.call(this, config);
        
        var ownerProto = this.ownerModel.prototype,
            name       = this.name;
        
        Ext.applyIf(this, {
            associationIdField: this.ownerName.toLowerCase() + "_id"
        });
        
        ownerProto[name] = this.createStore();
    },

    
    createStore: function() {
        var association           = this,
            ownerName             = this.ownerName,
            storeName             = this.name + "Store",
            associatedModel       = this.associatedModel,
            primaryKey            = this.primaryKey,
            associationIdField    = 'associated_id',
            associationModelField = 'associated_model';
        
        return function() {
            var me = this,
                modelDefaults = {},
                config, filters;
                
            if (me[storeName] == undefined) {
                filters = [
                    {
                        property  : associationIdField,
                        value     : me.get(primaryKey),
                        exactMatch: true
                    },
                    {
                        property  : associationModelField,
                        value     : ownerName,
                        exactMatch: true
                    }
                ];
                
                modelDefaults[associationIdField] = me.get(primaryKey);
                modelDefaults[associationModelField] = ownerName;
                
                config = Ext.apply({}, association.storeConfig || {}, {
                    model        : associatedModel,
                    filters      : filters,
                    remoteFilter : false,
                    modelDefaults: modelDefaults
                });
                
                me[storeName] = new Ext.data.Store(config);
            }
            
            return me[storeName];
        };
    }
});

Ext.data.validations = {
    
    
    presenceMessage: 'must be present',
    
    
    lengthMessage: 'is the wrong length',
    
    
    formatMessage: 'is the wrong format',
    
    
    inclusionMessage: 'is not included in the list of acceptable values',
    
    
    exclusionMessage: 'is not an acceptable value',
    
    
    presence: function(config, value) {
        if (value == undefined) {
            value = config;
        }
        
        return !!value;
    },
    
    
    length: function(config, value) {
        if (value == undefined) {
            return false;
        }
        
        var length = value.length,
            min    = config.min,
            max    = config.max;
        
        if ((min && length < min) || (max && length > max)) {
            return false;
        } else {
            return true;
        }
    },
    
    
    format: function(config, value) {
        return !!(config.matcher && config.matcher.test(value));
    },
    
    
    inclusion: function(config, value) {
        return config.list && config.list.indexOf(value) != -1;
    },
    
    
    exclusion: function(config, value) {
        return config.list && config.list.indexOf(value) == -1;
    }
};

Ext.data.Errors = Ext.extend(Ext.util.MixedCollection, {
    
    isValid: function() {
        return this.length == 0;
    },
    
    
    getByField: function(fieldName) {
        var errors = [],
            error, field, i;
            
        for (i = 0; i < this.length; i++) {
            error = this.items[i];
            
            if (error.field == fieldName) {
                errors.push(error);
            }
        }
        
        return errors;
    }
});


Ext.data.Field = Ext.extend(Object, {
    
    constructor : function(config) {
        if (Ext.isString(config)) {
            config = {name: config};
        }
        Ext.apply(this, config);
        
        var types = Ext.data.Types,
            st = this.sortType,
            t;

        if (this.type) {
            if (Ext.isString(this.type)) {
                this.type = types[this.type.toUpperCase()] || types.AUTO;
            }
        } else {
            this.type = types.AUTO;
        }

        
        if (Ext.isString(st)) {
            this.sortType = Ext.data.SortTypes[st];
        } else if(Ext.isEmpty(st)) {
            this.sortType = this.type.sortType;
        }

        if (!this.convert) {
            this.convert = this.type.convert;
        }
    },
    
    
    
    
    
    
    
    dateFormat: null,
    
    
    useNull: false,
    
    
    defaultValue: "",
    
    mapping: null,
    
    sortType : null,
    
    sortDir : "ASC",
    
    allowBlank : true
});


Ext.data.SortTypes = {
    
    none : function(s) {
        return s;
    },

    
    stripTagsRE : /<\/?[^>]+>/gi,

    
    asText : function(s) {
        return String(s).replace(this.stripTagsRE, "");
    },

    
    asUCText : function(s) {
        return String(s).toUpperCase().replace(this.stripTagsRE, "");
    },

    
    asUCString : function(s) {
        return String(s).toUpperCase();
    },

    
    asDate : function(s) {
        if(!s){
            return 0;
        }
        if(Ext.isDate(s)){
            return s.getTime();
        }
        return Date.parse(String(s));
    },

    
    asFloat : function(s) {
        var val = parseFloat(String(s).replace(/,/g, ""));
        return isNaN(val) ? 0 : val;
    },

    
    asInt : function(s) {
        var val = parseInt(String(s).replace(/,/g, ""), 10);
        return isNaN(val) ? 0 : val;
    }
};

Ext.data.Types = new function() {
    var st = Ext.data.SortTypes;
    
    Ext.apply(this, {
        
        stripRe: /[\$,%]/g,
        
        
        AUTO: {
            convert: function(v) {
                return v;
            },
            sortType: st.none,
            type: 'auto'
        },

        
        STRING: {
            convert: function(v) {
                return (v === undefined || v === null) ? '' : String(v);
            },
            sortType: st.asUCString,
            type: 'string'
        },

        
        INT: {
            convert: function(v) {
                return v !== undefined && v !== null && v !== '' ?
                    parseInt(String(v).replace(Ext.data.Types.stripRe, ''), 10) : (this.useNull ? null : 0);
            },
            sortType: st.none,
            type: 'int'
        },
        
        
        FLOAT: {
            convert: function(v) {
                return v !== undefined && v !== null && v !== '' ?
                    parseFloat(String(v).replace(Ext.data.Types.stripRe, ''), 10) : (this.useNull ? null : 0);
            },
            sortType: st.none,
            type: 'float'
        },
        
        
        BOOL: {
            convert: function(v) {
                return v === true || v === 'true' || v == 1;
            },
            sortType: st.none,
            type: 'bool'
        },
        
        
        DATE: {
            convert: function(v) {
                var df = this.dateFormat;
                if (!v) {
                    return null;
                }
                if (Ext.isDate(v)) {
                    return v;
                }
                if (df) {
                    if (df == 'timestamp') {
                        return new Date(v*1000);
                    }
                    if (df == 'time') {
                        return new Date(parseInt(v, 10));
                    }
                    return Date.parseDate(v, df);
                }
                
                var parsed = Date.parse(v);
                return parsed ? new Date(parsed) : null;
            },
            sortType: st.asDate,
            type: 'date'
        }
    });
    
    Ext.apply(this, {
        
        BOOLEAN: this.BOOL,
        
        
        INTEGER: this.INT,
        
        
        NUMBER: this.FLOAT    
    });
};

Ext.ModelMgr = new Ext.AbstractManager({
    typeName: 'mtype',
    
    
    defaultProxyType: 'ajax',
    
    
    associationStack: [],
    
    
    registerType: function(name, config) {
        
        
        var PluginMgr    = Ext.PluginMgr,
            plugins      = PluginMgr.findByType('model', true),
            fields       = config.fields || [],
            associations = config.associations || [],
            belongsTo    = config.belongsTo,
            hasMany      = config.hasMany,
            extendName   = config.extend,
            modelPlugins = config.plugins || [],
            association, model, length, i,
            extendModel, extendModelProto, extendValidations, proxy;
        
        
        
        if (belongsTo) {
            if (!Ext.isArray(belongsTo)) {
                belongsTo = [belongsTo];
            }
            
            for (i = 0; i < belongsTo.length; i++) {
                association = belongsTo[i];
                
                if (!Ext.isObject(association)) {
                    association = {model: association};
                }
                Ext.apply(association, {type: 'belongsTo'});
                
                associations.push(association);
            }
            
            delete config.belongsTo;
        }
        
        if (hasMany) {
            if (!Ext.isArray(hasMany)) {
                hasMany = [hasMany];
            }
            
            for (i = 0; i < hasMany.length; i++) {
                association = hasMany[i];
                
                if (!Ext.isObject(association)) {
                    association = {model: association};
                }
                
                Ext.apply(association, {type: 'hasMany'});
                
                associations.push(association);
            }
            
            delete config.hasMany;
        }
        
        
        if (extendName) {
            extendModel       = this.types[extendName];
            extendModelProto  = extendModel.prototype;
            extendValidations = extendModelProto.validations;
            
            proxy              = extendModel.proxy;
            fields             = extendModelProto.fields.items.concat(fields);
            associations       = extendModelProto.associations.items.concat(associations);
            config.validations = extendValidations ? extendValidations.concat(config.validations) : config.validations;
        } else {
            extendModel = Ext.data.Model;
            proxy = config.proxy;
        }
        
        model = Ext.extend(extendModel, config);
        
        for (i = 0, length = modelPlugins.length; i < length; i++) {
            plugins.push(PluginMgr.create(modelPlugins[i]));
        }
        
        this.types[name] = model;
        
        Ext.override(model, {
            plugins     : plugins,
            fields      : this.createFields(fields),
            associations: this.createAssociations(associations, name)
        });
        
        model.modelName = name;
        Ext.data.Model.setProxy.call(model, proxy || this.defaultProxyType);
        model.getProxy = model.prototype.getProxy;
        
        model.load = function() {
            Ext.data.Model.load.apply(this, arguments);
        };
        
        for (i = 0, length = plugins.length; i < length; i++) {
            plugins[i].bootstrap(model, config);
        }
        
        model.defined = true;
        this.onModelDefined(model);
        
        return model;
    },
    
    
    onModelDefined: function(model) {
        var stack  = this.associationStack,
            length = stack.length,
            create = [],
            association, i;
        
        for (i = 0; i < length; i++) {
            association = stack[i];
            
            if (association.associatedModel == model.modelName) {
                create.push(association);
            }
        }
        
        length = create.length;
        for (i = 0; i < length; i++) {
            this.addAssociation(create[i], this.types[create[i].ownerModel].prototype.associations);
            stack.remove(create[i]);
        }
    },
    
    
    createAssociations: function(associations, name) {
        var length = associations.length,
            i, associationsMC, association;
        
        associationsMC = new Ext.util.MixedCollection(false, function(association) {
            return association.name;
        });
        
        for (i = 0; i < length; i++) {
            association = associations[i];
            Ext.apply(association, {
                ownerModel: name,
                associatedModel: association.model
            });
            
            if (this.types[association.model] == undefined) {
                this.associationStack.push(association);
            } else {
                this.addAssociation(association, associationsMC);
            }
        }
        
        return associationsMC;
    },
    
    
    addAssociation: function(association, associationsMC) {
        var type = association.type;
        
        if (type == 'belongsTo') {
            associationsMC.add(new Ext.data.BelongsToAssociation(association));
        }
        
        if (type == 'hasMany') {
            associationsMC.add(new Ext.data.HasManyAssociation(association));
        }
        
        if (type == 'polymorphic') {
            associationsMC.add(new Ext.data.PolymorphicAssociation(association));
        }
    },
    
    
    createFields: function(fields) {
        var length = fields.length,
            i, fieldsMC;
        
        fieldsMC = new Ext.util.MixedCollection(false, function(field) {
            return field.name;
        });
        
        for (i = 0; i < length; i++) {
            fieldsMC.add(new Ext.data.Field(fields[i]));
        }
        
        return fieldsMC;
    },
    
    
    getModel: function(id) {
        var model = id;
        if (typeof model == 'string') {
            model = this.types[model];
        }
        return model;
    },
    
    
    create: function(config, name, id) {
        var con = typeof name == 'function' ? name : this.types[name || config.name];
        
        return new con(config, id);
    }
});


Ext.regModel = function() {
    return Ext.ModelMgr.registerType.apply(Ext.ModelMgr, arguments);
};

Ext.data.Operation = Ext.extend(Object, {
    
    synchronous: true,
    
    
    action: undefined,
    
    
    filters: undefined,
    
    
    sorters: undefined,
    
    
    group: undefined,
    
    
    start: undefined,
    
    
    limit: undefined,
    
    
    batch: undefined,
        
    
    started: false,
    
    
    running: false,
    
    
    complete: false,
    
    
    success: undefined,
    
    
    exception: false,
    
    
    error: undefined,
    
    constructor: function(config) {
        Ext.apply(this, config || {});
    },
    
    
    setStarted: function() {
        this.started = true;
        this.running = true;
    },
    
    
    setCompleted: function() {
        this.complete = true;
        this.running  = false;
    },
    
    
    setSuccessful: function() {
        this.success = true;
    },
    
    
    setException: function(error) {
        this.exception = true;
        this.success = false;
        this.running = false;
        this.error = error;
    },
    
    
    markStarted: function() {
        console.warn("Operation: markStarted has been deprecated. Please use setStarted");
        return this.setStarted();
    },
    
    
    markCompleted: function() {
        console.warn("Operation: markCompleted has been deprecated. Please use setCompleted");
        return this.setCompleted();
    },
    
    
    markSuccessful: function() {
        console.warn("Operation: markSuccessful has been deprecated. Please use setSuccessful");
        return this.setSuccessful();
    },
    
    
    markException: function() {
        console.warn("Operation: markException has been deprecated. Please use setException");
        return this.setException();
    },
    
    
    hasException: function() {
        return this.exception === true;
    },
    
    
    getError: function() {
        return this.error;
    },
    
    
    getRecords: function() {
        var resultSet = this.getResultSet();
        
        return (resultSet == undefined ? this.records : resultSet.records);
    },
    
    
    getResultSet: function() {
        return this.resultSet;
    },
    
    
    isStarted: function() {
        return this.started === true;
    },
    
    
    isRunning: function() {
        return this.running === true;
    },
    
    
    isComplete: function() {
        return this.complete === true;
    },
    
    
    wasSuccessful: function() {
        return this.isComplete() && this.success === true;
    },
    
    
    setBatch: function(batch) {
        this.batch = batch;
    },
    
    
    allowWrite: function() {
        return this.action != 'read';
    }
});

Ext.data.ProxyMgr = new Ext.AbstractManager({
    create: function(config) {
        if (config == undefined || typeof config == 'string') {
            config = {
                type: config
            };
        }

        if (!(config instanceof Ext.data.Proxy)) {
            Ext.applyIf(config, {
                type : this.defaultProxyType,
                model: this.model
            });

            var type = config[this.typeName] || config.type,
                Constructor = this.types[type];

            if (Constructor == undefined) {
                throw new Error(Ext.util.Format.format("The '{0}' type has not been registered with this manager", type));
            }

            return new Constructor(config);
        } else {
            return config;
        }
    }
});

Ext.data.ReaderMgr = new Ext.AbstractManager({
    typeName: 'rtype'
});

Ext.data.Request = Ext.extend(Object, {
    
    action: undefined,
    
    
    params: undefined,
    
    
    method: 'GET',
    
    
    url: undefined,

    constructor: function(config) {
        Ext.apply(this, config);
    }
});

Ext.data.ResultSet = Ext.extend(Object, {
    
    loaded: true,
    
    
    count: 0,
    
    
    total: 0,
    
    
    success: false,
    
    

    constructor: function(config) {
        Ext.apply(this, config);
        
        
        this.totalRecords = this.total;
        
        if (config.count == undefined) {
            this.count = this.records.length;
        }
    }
});

Ext.data.AbstractStore = Ext.extend(Ext.util.Observable, {
    remoteSort  : false,
    remoteFilter: false,

    

    
    autoLoad: false,

    
    autoSave: false,

    
    batchUpdateMode: 'operation',

    
    filterOnLoad: true,

    
    sortOnLoad: true,

    
    defaultSortDirection: "ASC",

    
    implicitModel: false,

    
    defaultProxyType: 'memory',

    
    isDestroyed: false,

    isStore: true,

    

    
    constructor: function(config) {
        this.addEvents(
            
            'add',

            
            'remove',
            
            
            'update',

            
            'datachanged',

            
            'beforeload',

            
            'load',

            
            'beforesync'
        );
        
        Ext.apply(this, config);

        
        this.removed = [];

        
        this.sortToggle = {};

        Ext.data.AbstractStore.superclass.constructor.apply(this, arguments);

        this.model = Ext.ModelMgr.getModel(config.model);
        
        
        Ext.applyIf(this, {
            modelDefaults: {}
        });

        
        if (!this.model && config.fields) {
            this.model = Ext.regModel('ImplicitModel-' + this.storeId || Ext.id(), {
                fields: config.fields
            });

            delete this.fields;

            this.implicitModel = true;
        }

        
        this.setProxy(config.proxy || this.model.proxy);

        if (this.id && !this.storeId) {
            this.storeId = this.id;
            delete this.id;
        }

        if (this.storeId) {
            Ext.StoreMgr.register(this);
        }
        
        
        this.sorters = new Ext.util.MixedCollection();
        this.sorters.addAll(this.decodeSorters(config.sorters));
        
        
        this.filters = new Ext.util.MixedCollection();
        this.filters.addAll(this.decodeFilters(config.filters));
    },


    
    setProxy: function(proxy) {
        if (proxy instanceof Ext.data.Proxy) {
            proxy.setModel(this.model);
        } else {
            Ext.applyIf(proxy, {
                model: this.model
            });
            
            proxy = Ext.data.ProxyMgr.create(proxy);
        }
        
        this.proxy = proxy;
        
        return this.proxy;
    },

    
    getProxy: function() {
        return this.proxy;
    },

    
    create: function(data, options) {
        var instance = Ext.ModelMgr.create(Ext.applyIf(data, this.modelDefaults), this.model.modelName),
            operation;
        
        options = options || {};

        Ext.applyIf(options, {
            action : 'create',
            records: [instance]
        });

        operation = new Ext.data.Operation(options);

        this.proxy.create(operation, this.onProxyWrite, this);
        
        return instance;
    },

    read: function() {
        return this.load.apply(this, arguments);
    },

    onProxyRead: Ext.emptyFn,

    update: function(options) {
        options = options || {};

        Ext.applyIf(options, {
            action : 'update',
            records: this.getUpdatedRecords()
        });

        var operation = new Ext.data.Operation(options);

        return this.proxy.update(operation, this.onProxyWrite, this);
    },

    onProxyWrite: Ext.emptyFn,


    
    destroy: function(options) {
        options = options || {};

        Ext.applyIf(options, {
            action : 'destroy',
            records: this.getRemovedRecords()
        });

        var operation = new Ext.data.Operation(options);

        return this.proxy.destroy(operation, this.onProxyWrite, this);
    },

    
    onBatchOperationComplete: function(batch, operation) {
        return this.onProxyWrite(operation);
    },

    
    onBatchComplete: function(batch, operation) {
        var operations = batch.operations,
            length = operations.length,
            i;

        this.suspendEvents();

        for (i = 0; i < length; i++) {
            this.onProxyWrite(operations[i]);
        }

        this.resumeEvents();

        this.fireEvent('datachanged', this);
    },

    onBatchException: function(batch, operation) {
        
        
        
        
        
    },

    
    filterNew: function(item) {
        return item.phantom == true || item.needsAdd == true;
    },

    
    getNewRecords: function() {
        return [];
    },

    
    getUpdatedRecords: function() {
        return [];
    },

    
    filterDirty: function(item) {
        return item.dirty == true;
    },

    
    getRemovedRecords: function() {
        return this.removed;
    },


    sort: function(sorters, direction) {

    },

    
    decodeSorters: function(sorters) {
        if (!Ext.isArray(sorters)) {
            if (sorters == undefined) {
                sorters = [];
            } else {
                sorters = [sorters];
            }
        }

        var length = sorters.length,
            Sorter = Ext.util.Sorter,
            config, i;

        for (i = 0; i < length; i++) {
            config = sorters[i];

            if (!(config instanceof Sorter)) {
                if (Ext.isString(config)) {
                    config = {
                        property: config
                    };
                }
                
                Ext.applyIf(config, {
                    root     : 'data',
                    direction: "ASC"
                });

                
                if (config.fn) {
                    config.sorterFn = config.fn;
                }

                
                if (typeof config == 'function') {
                    config = {
                        sorterFn: config
                    };
                }

                sorters[i] = new Sorter(config);
            }
        }

        return sorters;
    },

    filter: function(filters, value) {

    },

    
    createSortFunction: function(field, direction) {
        direction = direction || "ASC";
        var directionModifier = direction.toUpperCase() == "DESC" ? -1 : 1;

        var fields   = this.model.prototype.fields,
            sortType = fields.get(field).sortType;

        
        
        return function(r1, r2) {
            var v1 = sortType(r1.data[field]),
                v2 = sortType(r2.data[field]);

            return directionModifier * (v1 > v2 ? 1 : (v1 < v2 ? -1 : 0));
        };
    },

    
    decodeFilters: function(filters) {
        if (!Ext.isArray(filters)) {
            if (filters == undefined) {
                filters = [];
            } else {
                filters = [filters];
            }
        }

        var length = filters.length,
            Filter = Ext.util.Filter,
            config, i;

        for (i = 0; i < length; i++) {
            config = filters[i];

            if (!(config instanceof Filter)) {
                Ext.apply(config, {
                    root: 'data'
                });

                
                if (config.fn) {
                    config.filterFn = config.fn;
                }

                
                if (typeof config == 'function') {
                    config = {
                        filterFn: config
                    };
                }

                filters[i] = new Filter(config);
            }
        }

        return filters;
    },

    clearFilter: function(supressEvent) {

    },

    isFiltered: function() {

    },

    filterBy: function(fn, scope) {

    },


    
    sync: function() {
        var me        = this,
            options   = {},
            toCreate  = me.getNewRecords(),
            toUpdate  = me.getUpdatedRecords(),
            toDestroy = me.getRemovedRecords(),
            needsSync = false;

        if (toCreate.length > 0) {
            options.create = toCreate;
            needsSync = true;
        }

        if (toUpdate.length > 0) {
            options.update = toUpdate;
            needsSync = true;
        }

        if (toDestroy.length > 0) {
            options.destroy = toDestroy;
            needsSync = true;
        }

        if (needsSync && me.fireEvent('beforesync', options) !== false) {
            me.proxy.batch(options, me.getBatchListeners());
        }
    },


    
    getBatchListeners: function() {
        var listeners = {
            scope: this,
            exception: this.onBatchException
        };

        if (this.batchUpdateMode == 'operation') {
            listeners['operationcomplete'] = this.onBatchOperationComplete;
        } else {
            listeners['complete'] = this.onBatchComplete;
        }

        return listeners;
    },

    
    save: function() {
        return this.sync.apply(this, arguments);
    },

    
    load: function(options) {
        var me = this,
            operation;

        options = options || {};

        Ext.applyIf(options, {
            action : 'read',
            filters: me.filters.items,
            sorters: me.sorters.items
        });

        operation = new Ext.data.Operation(options);

        if (me.fireEvent('beforeload', me, operation) !== false) {
            me.loading = true;
            me.proxy.read(operation, me.onProxyLoad, me);
        }
        
        return me;
    },

    
    afterEdit : function(record) {
        this.fireEvent('update', this, record, Ext.data.Model.EDIT);
    },

    
    afterReject : function(record) {
        this.fireEvent('update', this, record, Ext.data.Model.REJECT);
    },

    
    afterCommit : function(record) {
        if (this.autoSave) {
            this.sync();
        }

        this.fireEvent('update', this, record, Ext.data.Model.COMMIT);
    },

    clearData: Ext.emptyFn,

    destroyStore: function() {
        if (!this.isDestroyed) {
            if (this.storeId) {
                Ext.StoreMgr.unregister(this);
            }
            this.clearData();
            this.data = null;
            this.tree = null;
            
            this.reader = this.writer = null;
            this.clearListeners();
            this.isDestroyed = true;

            if (this.implicitModel) {
                Ext.destroy(this.model);
            }
        }
    },

    
    getSortState : function() {
        return this.sortInfo;
    },

    getCount: function() {

    },

    getById: function(id) {

    },

    
    
    removeAll: function() {

    }
});


Ext.data.Store = Ext.extend(Ext.data.AbstractStore, {
    
    remoteSort: false,

    
    remoteFilter: false,

    

    

    
    groupField: undefined,

    
    groupDir: "ASC",

    
    pageSize: 25,

    
    currentPage: 1,
    
    
    clearOnPageLoad: true,

    
    implicitModel: false,

    
    loading: false,
    
    
    sortOnFilter: true,

    isStore: true,

    
    constructor: function(config) {
        config = config || {};
        
        
        this.data = new Ext.util.MixedCollection(false, function(record) {
            return record.internalId;
        });

        if (config.data) {
            this.inlineData = config.data;
            delete config.data;
        }

        Ext.data.Store.superclass.constructor.call(this, config);
        
        var proxy = this.proxy,
            data  = this.inlineData;
            
        if (data) {
            if (proxy instanceof Ext.data.MemoryProxy) {
                proxy.data = data;
                this.read();
            } else {
                this.add.apply(this, data);
            }
            
            this.sort();
            delete this.inlineData;
        } else if (this.autoLoad) {
            Ext.defer(this.load, 10, this, [typeof this.autoLoad == 'object' ? this.autoLoad : undefined]);
            
            
        }
    },

    
    getGroups: function() {
        var records  = this.data.items,
            length   = records.length,
            groups   = [],
            pointers = {},
            record, groupStr, group, i;

        for (i = 0; i < length; i++) {
            record = records[i];
            groupStr = this.getGroupString(record);
            group = pointers[groupStr];

            if (group == undefined) {
                group = {
                    name: groupStr,
                    children: []
                };

                groups.push(group);
                pointers[groupStr] = group;
            }

            group.children.push(record);
        }
        
        return groups;
    },

    
    getGroupString: function(instance) {
        return instance.get(this.groupField);
    },
    
    
    first: function() {
        return this.data.first();
    },
    
    
    last: function() {
        return this.data.last();
    },

    
    insert : function(index, records) {
        var i, record, len;

        records = [].concat(records);
        for (i = 0, len = records.length; i < len; i++) {
            record = this.createModel(records[i]);
            record.set(this.modelDefaults);

            this.data.insert(index + i, record);
            record.join(this);
        }

        if (this.snapshot) {
            this.snapshot.addAll(records);
        }

        this.fireEvent('add', this, records, index);
        this.fireEvent('datachanged', this);
    },

    
    add: function(records) {
        
        if (!Ext.isArray(records)) {
            records = Array.prototype.slice.apply(arguments);
        }
        
        var length  = records.length,
            record, i;

        for (i = 0; i < length; i++) {
            record = this.createModel(records[i]);

            if (record.phantom == false) {
                record.needsAdd = true;
            }
            
            records[i] = record;
        }

        this.insert(this.data.length, records);

        return records;
    },

    
    createModel: function(record) {
        if (!(record instanceof Ext.data.Model)) {
            record = Ext.ModelMgr.create(record, this.model);
        }
        
        return record;
    },

    
    each : function(fn, scope) {
        this.data.each(fn, scope);
    },

    
    remove: function(records) {
        if (!Ext.isArray(records)) {
            records = [records];
        }

        var length = records.length,
            i, index, record;

        for (i = 0; i < length; i++) {
            record = records[i];
            index = this.data.indexOf(record);

            if (index > -1) {
                this.removed.push(record);

                if (this.snapshot) {
                    this.snapshot.remove(record);
                }

                record.unjoin(this);
                this.data.remove(record);

                this.fireEvent('remove', this, record, index);
            }
        }

        this.fireEvent('datachanged', this);
    },

    
    removeAt: function(index) {
        var record = this.getAt(index);

        if (record) {
            this.remove(record);
        }
    },

    
    load: function(options) {
        options = options || {};
        
        if (Ext.isFunction(options)) {
            options = {
                callback: options
            };
        }
        
        Ext.applyIf(options, {
            group : {field: this.groupField, direction: this.groupDir},
            start : 0,
            limit : this.pageSize,
            addRecords: false
        });
        
        return Ext.data.Store.superclass.load.call(this, options);
    },
    
    
    isLoading: function() {
        return this.loading;
    },

    
    onProxyLoad: function(operation) {
        var records = operation.getRecords();
        
        this.loadRecords(records, operation.addRecords);
        this.loading = false;
        this.fireEvent('load', this, records, operation.wasSuccessful());
        
        
        
        this.fireEvent('read', this, records, operation.wasSuccessful());

        
        var callback = operation.callback;
        
        if (typeof callback == 'function') {
            callback.call(operation.scope || this, records, operation, operation.wasSuccessful());
        }
    },

    
    onProxyWrite: function(operation) {
        var data     = this.data,
            action   = operation.action,
            records  = operation.getRecords(),
            length   = records.length,
            callback = operation.callback,
            record, i;

        if (operation.wasSuccessful()) {
            if (action == 'create' || action == 'update') {
                for (i = 0; i < length; i++) {
                    record = records[i];

                    record.phantom = false;
                    record.join(this);
                    data.replace(record);
                }
            }

            else if (action == 'destroy') {
                for (i = 0; i < length; i++) {
                    record = records[i];

                    record.unjoin(this);
                    data.remove(record);
                }

                this.removed = [];
            }

            this.fireEvent('datachanged');
        }

        
        if (typeof callback == 'function') {
            callback.call(operation.scope || this, records, operation, operation.wasSuccessful());
        }
    },

    
    getNewRecords: function() {
        return this.data.filterBy(this.filterNew).items;
    },

    
    getUpdatedRecords: function() {
        return this.data.filterBy(this.filterDirty).items;
    },

    
    sort: function(sorters, direction) {
        if (Ext.isString(sorters)) {
            var property   = sorters,
                sortToggle = this.sortToggle,
                toggle     = Ext.util.Format.toggle;

            if (direction == undefined) {
                sortToggle[property] = toggle(sortToggle[property] || "", "ASC", "DESC");
                direction = sortToggle[property];
            }

            sorters = {
                property : property,
                direction: direction
            };
        }
        
        if (arguments.length != 0) {
            this.sorters.clear();
        }
        
        this.sorters.addAll(this.decodeSorters(sorters));

        if (this.remoteSort) {
            
            this.load();
        } else {
            this.data.sort(this.sorters.items);

            this.fireEvent('datachanged', this);
        }
    },


    
    filter: function(filters, value) {
        if (Ext.isString(filters)) {
            filters = {
                property: filters,
                value   : value
            };
        }
        
        this.filters.addAll(this.decodeFilters(filters));

        if (this.remoteFilter) {
            
            this.load();
        } else {
            
            this.snapshot = this.snapshot || this.data.clone();

            this.data = this.data.filter(this.filters.items);
            
            if (this.sortOnFilter && !this.remoteSort) {
                this.sort();
            } else {
                this.fireEvent('datachanged', this);
            }
        }
    },

    
    clearFilter : function(suppressEvent) {
        this.filters.clear();
        
        if (this.isFiltered()) {
            this.data = this.snapshot.clone();
            delete this.snapshot;

            if (suppressEvent !== true) {
                this.fireEvent('datachanged', this);
            }
        }
    },

    
    isFiltered : function() {
        return !!this.snapshot && this.snapshot != this.data;
    },

    
    filterBy : function(fn, scope) {
        this.snapshot = this.snapshot || this.data.clone();
        this.data = this.queryBy(fn, scope || this);
        this.fireEvent('datachanged', this);
    },

    
    queryBy : function(fn, scope) {
        var data = this.snapshot || this.data;
        return data.filterBy(fn, scope||this);
    },
    
    
    loadData: function(data, append) {
        var model  = this.model,
            length = data.length,
            i, record;

        
        for (i = 0; i < length; i++) {
            record = data[i];

            if (!(record instanceof Ext.data.Model)) {
                data[i] = Ext.ModelMgr.create(record, model);
            }
        }

        this.loadRecords(data, append);
    },

    
    loadRecords: function(records, add) {
        if (!add) {
            this.data.clear();
        }
        
        this.data.addAll(records);
        
        
        for (var i = 0, length = records.length; i < length; i++) {
            records[i].needsAdd = false;
            records[i].join(this);
        }
        
        
        this.suspendEvents();

        if (this.filterOnLoad && !this.remoteFilter) {
            this.filter();
        }

        if (this.sortOnLoad && !this.remoteSort) {
            this.sort();
        }

        this.resumeEvents();
        this.fireEvent('datachanged', this, records);
    },

    

    
    loadPage: function(page) {
        this.currentPage = page;

        this.read({
            page : page,
            start: (page - 1) * this.pageSize,
            limit: this.pageSize,
            addRecords: !this.clearOnPageLoad
        });
    },

    
    nextPage: function() {
        this.loadPage(this.currentPage + 1);
    },

    
    previousPage: function() {
        this.loadPage(this.currentPage - 1);
    },

    
    clearData: function(){
        this.data.each(function(record) {
            record.unjoin();
        });

        this.data.clear();
    },

    
    find : function(property, value, start, anyMatch, caseSensitive, exactMatch) {
        var fn = this.createFilterFn(property, value, anyMatch, caseSensitive, exactMatch);
        return fn ? this.data.findIndexBy(fn, null, start) : -1;
    },

    
    findRecord : function() {
        var index = this.find.apply(this, arguments);
        return index != -1 ? this.getAt(index) : null;
    },

    
    createFilterFn : function(property, value, anyMatch, caseSensitive, exactMatch) {
        if(Ext.isEmpty(value)){
            return false;
        }
        value = this.data.createValueMatcher(value, anyMatch, caseSensitive, exactMatch);
        return function(r) {
            return value.test(r.data[property]);
        };
    },

    
    findExact: function(property, value, start) {
        return this.data.findIndexBy(function(rec){
            return rec.get(property) === value;
        }, this, start);
    },

    
    findBy : function(fn, scope, start) {
        return this.data.findIndexBy(fn, scope, start);
    },

    
    collect : function(dataIndex, allowNull, bypassFilter) {
        var values  = [],
            uniques = {},
            length, value, strValue, data, i;

        if (bypassFilter === true && this.snapshot) {
            data = this.snapshot.items;
        } else {
            data = this.data.items;
        }

        length = data.length;

        for (i = 0; i < length; i++) {
            value = data[i].data[dataIndex];
            strValue = String(value);

            if ((allowNull || !Ext.isEmpty(value)) && !uniques[strValue]) {
                uniques[strValue] = true;
                values[values.length] = value;
            }
        }

        return values;
    },

    
    sum : function(property, start, end) {
        var records = this.data.items,
            value   = 0,
            i;

        start = start || 0;
        end   = (end || end === 0) ? end : records.length - 1;

        for (i = start; i <= end; i++) {
            value += (records[i].data[property] || 0);
        }

        return value;
    },

    
    getCount : function() {
        return this.data.length || 0;
    },

    
    getAt : function(index) {
        return this.data.getAt(index);
    },

    
    getRange : function(start, end) {
        return this.data.getRange(start, end);
    },

    
    getById : function(id) {
        return (this.snapshot || this.data).findBy(function(record) {
            return record.getId() === id;
        });
    },

    
    indexOf : function(record) {
        return this.data.indexOf(record);
    },

    
    indexOfId : function(id) {
        return this.data.indexOfKey(id);
    },

    removeAll: function(silent) {
        var items = [];
        this.each(function(rec){
            items.push(rec);
        });
        this.clearData();
        if(this.snapshot){
            this.snapshot.clear();
        }
        
        
        
        if (silent !== true) {
            this.fireEvent('clear', this, items);
        }
    }
});


Ext.data.TreeStore = Ext.extend(Ext.data.AbstractStore, {
    
    clearOnLoad : true,

    
    nodeParam: 'node',

    
    defaultRootId: 'root',

    constructor: function(config) {
        config = config || {};
        var rootCfg = config.root || {};
        rootCfg.id = rootCfg.id || this.defaultRootId;

        
        var rootNode = new Ext.data.RecordNode(rootCfg);
        this.tree = new Ext.data.Tree(rootNode);
        this.tree.treeStore = this;

        Ext.data.TreeStore.superclass.constructor.call(this, config);
        

        if (config.root) {
            this.read({
                node: rootNode,
                doPreload: true
            });
        }
    },


    
    getRootNode: function() {
        return this.tree.getRootNode();
    },

    
    getNodeById: function(id) {
        return this.tree.getNodeById(id);
    },


    
    
    
    load: function(options) {
        options = options || {};
        options.params = options.params || {};

        var node = options.node || this.tree.getRootNode(),
            records,
            record,
            reader = this.proxy.reader,
            root;

        if (this.clearOnLoad) {
            while (node.firstChild){
                node.removeChild(node.firstChild);
            }
        }

        if (!options.doPreload) {
            Ext.applyIf(options, {
                node: node
            });
            record = node.getRecord();
            options.params[this.nodeParam] = record ? record.getId() : 'root';

            return Ext.data.TreeStore.superclass.load.call(this, options);
        } else {
            root = reader.getRoot(node.isRoot ? node.attributes : node.getRecord().raw);
            records = reader.extractData(root, true);
            this.fillNode(node, records);
            return true;
        }
    },

    
    
    fillNode: function(node, records) {
        node.loaded = true;
        var ln = records.length,
            recordNode,
            i = 0,
            raw,
            subStore = node.subStore;

        for (; i < ln; i++) {
            raw = records[i].raw;
            records[i].data.leaf = raw.leaf;
            recordNode = new Ext.data.RecordNode({
                id: records[i].getId(),
                leaf: raw.leaf,
                record: records[i],
                expanded: raw.expanded
            });
            node.appendChild(recordNode);
            if (records[i].doPreload) {
                this.load({
                    node: recordNode,
                    doPreload: true
                });
            }
        }

        
        if (subStore) {
            if (this.clearOnLoad) {
                subStore.removeAll();
            }
            subStore.add.apply(subStore, records);
        }
    },


    onProxyLoad: function(operation) {
        var records = operation.getRecords();

        this.fillNode(operation.node, records);

        this.fireEvent('read', this, operation.node, records, operation.wasSuccessful());
        
        var callback = operation.callback;
        if (typeof callback == 'function') {
            callback.call(operation.scope || this, records, operation, operation.wasSuccessful());
        }
    },


    
    getSubStore: function(node) {
        
        if (node && node.node) {
            node = node.node;
        }
        return node.getSubStore();
    },


    removeAll: function() {
        var rootNode = this.getRootNode();
        rootNode.destroy();
    }
});


Ext.StoreMgr = Ext.apply(new Ext.util.MixedCollection(), {
    

    
    register : function() {
        for (var i = 0, s; (s = arguments[i]); i++) {
            this.add(s);
        }
    },

    
    unregister : function() {
        for (var i = 0, s; (s = arguments[i]); i++) {
            this.remove(this.lookup(s));
        }
    },

    
    lookup : function(id) {
        if (Ext.isArray(id)) {
            var fields = ['field1'], expand = !Ext.isArray(id[0]);
            if(!expand){
                for(var i = 2, len = id[0].length; i <= len; ++i){
                    fields.push('field' + i);
                }
            }
            return new Ext.data.ArrayStore({
                data  : id,
                fields: fields,
                expandData : expand,
                autoDestroy: true,
                autoCreated: true
            });
        }
        return Ext.isObject(id) ? (id.events ? id : Ext.create(id, 'store')) : this.get(id);
    },

    
    getKey : function(o) {
         return o.storeId;
    }
});


Ext.regStore = function(name, config) {
    var store;

    if (Ext.isObject(name)) {
        config = name;
    } else {
        config.storeId = name;
    }

    if (config instanceof Ext.data.Store) {
        store = config;
    } else {
        store = new Ext.data.Store(config);
    }

    return Ext.StoreMgr.register(store);
};


Ext.getStore = function(name) {
    return Ext.StoreMgr.lookup(name);
};


Ext.data.WriterMgr = new Ext.AbstractManager({
    
});

Ext.data.Tree = Ext.extend(Ext.util.Observable, {
    
    constructor: function(root) {
        this.nodeHash = {};
        
        
        this.root = null;
        
        if (root) {
            this.setRootNode(root);
        }
        
        this.addEvents(
            
            "append",
            
            
            "remove",
            
            
            "move",
            
            
            "insert",
            
            
            "beforeappend",
            
            
            "beforeremove",
            
            
            "beforemove",
            
            
            "beforeinsert"
        );
        
        Ext.data.Tree.superclass.constructor.call(this);        
    },
    
    
    pathSeparator: "/",

    
    proxyNodeEvent : function(){
        return this.fireEvent.apply(this, arguments);
    },

    
    getRootNode : function() {
        return this.root;
    },

    
    setRootNode : function(node) {
        this.root = node;
        node.ownerTree = this;
        node.isRoot = true;
        this.registerNode(node);
        return node;
    },

    
    getNodeById : function(id) {
        return this.nodeHash[id];
    },

    
    registerNode : function(node) {
        this.nodeHash[node.id] = node;
    },

    
    unregisterNode : function(node) {
        delete this.nodeHash[node.id];
    },

    toString : function() {
        return "[Tree"+(this.id?" "+this.id:"")+"]";
    }
});


Ext.data.Node = Ext.extend(Ext.util.Observable, {

    constructor: function(attributes) {
        
        this.attributes = attributes || {};

        this.leaf = !!this.attributes.leaf;

        
        this.id = this.attributes.id;

        if (!this.id) {
            this.id = Ext.id(null, "xnode-");
            this.attributes.id = this.id;
        }
        
        this.childNodes = [];

        
        this.parentNode = null;

        
        this.firstChild = null;

        
        this.lastChild = null;

        
        this.previousSibling = null;

        
        this.nextSibling = null;

        this.addEvents({
            
            "append" : true,

            
            "remove" : true,

            
            "move" : true,

            
            "insert" : true,

            
            "beforeappend" : true,

            
            "beforeremove" : true,

            
            "beforemove" : true,

             
            "beforeinsert" : true
        });

        this.listeners = this.attributes.listeners;
        Ext.data.Node.superclass.constructor.call(this);
    },

    
    fireEvent : function(evtName) {
        
        if (Ext.data.Node.superclass.fireEvent.apply(this, arguments) === false) {
            return false;
        }

        
        var ot = this.getOwnerTree();
        if (ot) {
            if (ot.proxyNodeEvent.apply(ot, arguments) === false) {
                return false;
            }
        }
        return true;
    },
    
    
    isLeaf : function() {
        return this.leaf === true;
    },

    
    setFirstChild : function(node) {
        this.firstChild = node;
    },

    
    setLastChild : function(node) {
        this.lastChild = node;
    },


    
    isLast : function() {
       return (!this.parentNode ? true : this.parentNode.lastChild == this);
    },

    
    isFirst : function() {
       return (!this.parentNode ? true : this.parentNode.firstChild == this);
    },

    
    hasChildNodes : function() {
        return !this.isLeaf() && this.childNodes.length > 0;
    },

    
    isExpandable : function() {
        return this.attributes.expandable || this.hasChildNodes();
    },

    
    appendChild : function(node) {
        var multi = false,
            i, len;

        if (Ext.isArray(node)) {
            multi = node;
        } else if (arguments.length > 1) {
            multi = arguments;
        }

        
        if (multi) {
            len = multi.length;

            for (i = 0; i < len; i++) {
                this.appendChild(multi[i]);
            }
        } else {
            if (this.fireEvent("beforeappend", this.ownerTree, this, node) === false) {
                return false;
            }

            var index = this.childNodes.length;
            var oldParent = node.parentNode;

            
            if (oldParent) {
                if (node.fireEvent("beforemove", node.getOwnerTree(), node, oldParent, this, index) === false) {
                    return false;
                }
                oldParent.removeChild(node);
            }

            index = this.childNodes.length;
            if (index === 0) {
                this.setFirstChild(node);
            }

            this.childNodes.push(node);
            node.parentNode = this;
            var ps = this.childNodes[index-1];
            if (ps) {
                node.previousSibling = ps;
                ps.nextSibling = node;
            } else {
                node.previousSibling = null;
            }

            node.nextSibling = null;
            this.setLastChild(node);
            node.setOwnerTree(this.getOwnerTree());
            this.fireEvent("append", this.ownerTree, this, node, index);

            if (oldParent) {
                node.fireEvent("move", this.ownerTree, node, oldParent, this, index);
            }

            return node;
        }
    },

    
    removeChild : function(node, destroy) {
        var index = this.indexOf(node);

        if (index == -1) {
            return false;
        }
        if (this.fireEvent("beforeremove", this.ownerTree, this, node) === false) {
            return false;
        }

        
        this.childNodes.splice(index, 1);

        
        if (node.previousSibling) {
            node.previousSibling.nextSibling = node.nextSibling;
        }
        if (node.nextSibling) {
            node.nextSibling.previousSibling = node.previousSibling;
        }

        
        if (this.firstChild == node) {
            this.setFirstChild(node.nextSibling);
        }
        if (this.lastChild == node) {
            this.setLastChild(node.previousSibling);
        }

        this.fireEvent("remove", this.ownerTree, this, node);
        if (destroy) {
            node.destroy(true);
        } else {
            node.clear();
        }

        return node;
    },

    
    clear : function(destroy) {
        
        this.setOwnerTree(null, destroy);
        this.parentNode = this.previousSibling = this.nextSibling = null;
        if (destroy) {
            this.firstChild = this.lastChild = null;
        }
    },

    
    destroy : function(silent) {
        
        if (silent === true) {
            this.clearListeners();
            this.clear(true);
            Ext.each(this.childNodes, function(n) {
                n.destroy(true);
            });
            this.childNodes = null;
        } else {
            this.remove(true);
        }
    },

    
    insertBefore : function(node, refNode) {
        if (!refNode) { 
            return this.appendChild(node);
        }
        
        if (node == refNode) {
            return false;
        }

        if (this.fireEvent("beforeinsert", this.ownerTree, this, node, refNode) === false) {
            return false;
        }

        var index     = this.indexOf(refNode),
            oldParent = node.parentNode,
            refIndex  = index;

        
        if (oldParent == this && this.indexOf(node) < index) {
            refIndex--;
        }

        
        if (oldParent) {
            if (node.fireEvent("beforemove", node.getOwnerTree(), node, oldParent, this, index, refNode) === false) {
                return false;
            }
            oldParent.removeChild(node);
        }

        if (refIndex === 0) {
            this.setFirstChild(node);
        }

        this.childNodes.splice(refIndex, 0, node);
        node.parentNode = this;

        var ps = this.childNodes[refIndex-1];

        if (ps) {
            node.previousSibling = ps;
            ps.nextSibling = node;
        } else {
            node.previousSibling = null;
        }

        node.nextSibling = refNode;
        refNode.previousSibling = node;
        node.setOwnerTree(this.getOwnerTree());
        this.fireEvent("insert", this.ownerTree, this, node, refNode);

        if (oldParent) {
            node.fireEvent("move", this.ownerTree, node, oldParent, this, refIndex, refNode);
        }
        return node;
    },

    
    remove : function(destroy) {
        var parentNode = this.parentNode;

        if (parentNode) {
            parentNode.removeChild(this, destroy);
        }
        return this;
    },

    
    removeAll : function(destroy) {
        var cn = this.childNodes,
            n;

        while ((n = cn[0])) {
            this.removeChild(n, destroy);
        }
        return this;
    },

    
    getChildAt : function(index) {
        return this.childNodes[index];
    },

    
    replaceChild : function(newChild, oldChild) {
        var s = oldChild ? oldChild.nextSibling : null;

        this.removeChild(oldChild);
        this.insertBefore(newChild, s);
        return oldChild;
    },

    
    indexOf : function(child) {
        return this.childNodes.indexOf(child);
    },

    
    getOwnerTree : function() {
        
        if (!this.ownerTree) {
            var p = this;

            while (p) {
                if (p.ownerTree) {
                    this.ownerTree = p.ownerTree;
                    break;
                }
                p = p.parentNode;
            }
        }

        return this.ownerTree;
    },

    
    getDepth : function() {
        var depth = 0,
            p     = this;

        while (p.parentNode) {
            ++depth;
            p = p.parentNode;
        }

        return depth;
    },

    
    setOwnerTree : function(tree, destroy) {
        
        if (tree != this.ownerTree) {
            if (this.ownerTree) {
                this.ownerTree.unregisterNode(this);
            }
            this.ownerTree = tree;

            
            if (destroy !== true) {
                Ext.each(this.childNodes, function(n) {
                    n.setOwnerTree(tree);
                });
            }
            if (tree) {
                tree.registerNode(this);
            }
        }
    },

    
    setId: function(id) {
        if (id !== this.id) {
            var t = this.ownerTree;
            if (t) {
                t.unregisterNode(this);
            }
            this.id = this.attributes.id = id;
            if (t) {
                t.registerNode(this);
            }
            this.onIdChange(id);
        }
    },

    
    onIdChange: Ext.emptyFn,

    
    getPath : function(attr) {
        attr = attr || "id";
        var p = this.parentNode,
            b = [this.attributes[attr]];

        while (p) {
            b.unshift(p.attributes[attr]);
            p = p.parentNode;
        }

        var sep = this.getOwnerTree().pathSeparator;
        return sep + b.join(sep);
    },

    
    bubble : function(fn, scope, args) {
        var p = this;
        while (p) {
            if (fn.apply(scope || p, args || [p]) === false) {
                break;
            }
            p = p.parentNode;
        }
    },
    

    
    cascadeBy : function(fn, scope, args) {
        if (fn.apply(scope || this, args || [this]) !== false) {
            var childNodes = this.childNodes,
                length     = childNodes.length,
                i;

            for (i = 0; i < length; i++) {
                childNodes[i].cascadeBy(fn, scope, args);
            }
        }
    },

    
    eachChild : function(fn, scope, args) {
        var childNodes = this.childNodes,
            length     = childNodes.length,
            i;

        for (i = 0; i < length; i++) {
            if (fn.apply(scope || this, args || [childNodes[i]]) === false) {
                break;
            }
        }
    },

    
    findChild : function(attribute, value, deep) {
        return this.findChildBy(function(){
            return this.attributes[attribute] == value;
        }, null, deep);
    },

    
    findChildBy : function(fn, scope, deep) {
        var cs = this.childNodes,
            len = cs.length,
            i = 0,
            n,
            res;

        for(; i < len; i++){
            n = cs[i];
            if(fn.call(scope || n, n) === true){
                return n;
            }else if (deep){
                res = n.findChildBy(fn, scope, deep);
                if(res != null){
                    return res;
                }
            }

        }

        return null;
    },

    
    sort : function(fn, scope) {
        var cs  = this.childNodes,
            len = cs.length,
            i, n;

        if (len > 0) {
            var sortFn = scope ? function(){return fn.apply(scope, arguments);} : fn;
            cs.sort(sortFn);
            for (i = 0; i < len; i++) {
                n = cs[i];
                n.previousSibling = cs[i-1];
                n.nextSibling = cs[i+1];

                if (i === 0){
                    this.setFirstChild(n);
                }
                if (i == len - 1) {
                    this.setLastChild(n);
                }
            }
        }
    },

    
    contains : function(node) {
        return node.isAncestor(this);
    },

    
    isAncestor : function(node) {
        var p = this.parentNode;
        while (p) {
            if (p == node) {
                return true;
            }
            p = p.parentNode;
        }
        return false;
    },

    toString : function() {
        return "[Node" + (this.id ? " " + this.id : "") + "]";
    }
});


Ext.data.RecordNode = Ext.extend(Ext.data.Node, {
    constructor: function(config) {
        config = config || {};
        if (config.record) {
            
            config.record.node = this;
        }
        Ext.data.RecordNode.superclass.constructor.call(this, config);
    },

    getChildRecords: function() {
        var cn = this.childNodes,
            ln = cn.length,
            i = 0,
            rs = [],
            r;

        for (; i < ln; i++) {
            r = cn[i].attributes.record;
            
            
            
            
            r.data.leaf = cn[i].leaf;
            rs.push(r);
        }
        return rs;
    },

    getRecord: function() {
        return this.attributes.record;
    },


    getSubStore: function() {

        
        if (this.isLeaf()) {
            throw "Attempted to get a substore of a leaf node.";
        }
        

        var treeStore = this.getOwnerTree().treeStore;
        if (!this.subStore) {
            this.subStore = new Ext.data.Store({
                model: treeStore.model
            });
            
            
            
            var children = this.getChildRecords();
            this.subStore.add.apply(this.subStore, children);
        }

        if (!this.loaded) {
            treeStore.load({
                node: this
            });
        }
        return this.subStore;
    },

    destroy : function(silent) {
        if (this.subStore) {
            this.subStore.destroyStore();
        }
        var attr = this.attributes;
        if (attr.record) {
            delete attr.record.node;
            delete attr.record;
        }

        return Ext.data.RecordNode.superclass.destroy.call(this, silent);
    }
});

Ext.data.Proxy = Ext.extend(Ext.util.Observable, {
    
    batchOrder: 'create,update,destroy',
    
    
    defaultReaderType: 'json',
    
    
    defaultWriterType: 'json',
    
    
    
    constructor: function(config) {
        config = config || {};
        
        if (config.model == undefined) {
            delete config.model;
        }

        Ext.data.Proxy.superclass.constructor.call(this, config);
        
        if (this.model != undefined && !(this.model instanceof Ext.data.Model)) {
            this.setModel(this.model);
        }
    },
    
    
    setModel: function(model, setOnStore) {
        this.model = Ext.ModelMgr.getModel(model);
        
        var reader = this.reader,
            writer = this.writer;
        
        this.setReader(reader);
        this.setWriter(writer);
        
        if (setOnStore && this.store) {
            this.store.setModel(this.model);
        }
    },
    
    
    getModel: function() {
        return this.model;
    },
    
    
    setReader: function(reader) {
        if (reader == undefined || typeof reader == 'string') {
            reader = {
                type: reader
            };
        }

        if (reader instanceof Ext.data.Reader) {
            reader.setModel(this.model);
        } else {
            Ext.applyIf(reader, {
                proxy: this,
                model: this.model,
                type : this.defaultReaderType
            });

            reader = Ext.data.ReaderMgr.create(reader);
        }
        
        this.reader = reader;
        
        return this.reader;
    },
    
    
    getReader: function() {
        return this.reader;
    },
    
    
    setWriter: function(writer) {
        if (writer == undefined || typeof writer == 'string') {
            writer = {
                type: writer
            };
        }

        if (!(writer instanceof Ext.data.Writer)) {
            Ext.applyIf(writer, {
                model: this.model,
                type : this.defaultWriterType
            });

            writer = Ext.data.WriterMgr.create(writer);
        }
        
        this.writer = writer;
        
        return this.writer;
    },
    
    
    getWriter: function() {
        return this.writer;
    },
    
    
    create: Ext.emptyFn,
    
    
    read: Ext.emptyFn,
    
    
    update: Ext.emptyFn,
    
    
    destroy: Ext.emptyFn,
    
    
    batch: function(operations, listeners) {
        var batch = new Ext.data.Batch({
            proxy: this,
            listeners: listeners || {}
        });
        
        Ext.each(this.batchOrder.split(','), function(action) {
            if (operations[action]) {
                batch.add(new Ext.data.Operation({
                    action : action, 
                    records: operations[action]
                }));
            }
        }, this);
        
        batch.start();
        
        return batch;
    }
});


Ext.data.DataProxy = Ext.data.Proxy;

Ext.data.ProxyMgr.registerType('proxy', Ext.data.Proxy);

Ext.data.ServerProxy = Ext.extend(Ext.data.Proxy, {
    
    
    
    
    
    
    
    pageParam: 'page',
    
    
    startParam: 'start',

    
    limitParam: 'limit',
    
    
    groupParam: 'group',
    
    
    sortParam: 'sort',
    
    
    filterParam: 'filter',
    
    
    noCache : true,
    
    
    cacheString: "_dc",
    
    
    timeout : 30000,
    
    
    constructor: function(config) {
        config = config || {};
        
        Ext.data.ServerProxy.superclass.constructor.call(this, config);
        
        
        this.extraParams = config.extraParams || {};
        
        
        this.nocache = this.noCache;
    },
    
    
    create: function() {
        return this.doRequest.apply(this, arguments);
    },
    
    read: function() {
        return this.doRequest.apply(this, arguments);
    },
    
    update: function() {
        return this.doRequest.apply(this, arguments);
    },
    
    destroy: function() {
        return this.doRequest.apply(this, arguments);
    },
    
    
    buildRequest: function(operation) {
        var params = Ext.applyIf(operation.params || {}, this.extraParams || {});
        
        
        params = Ext.applyIf(params, this.getParams(params, operation));
        
        var request = new Ext.data.Request({
            params   : params,
            action   : operation.action,
            records  : operation.records,
            operation: operation
        });
        
        request.url = this.buildUrl(request);
        
        
        operation.request = request;
        
        return request;
    },
    
    
    encodeSorters: function(sorters) {
        var min = [],
            length = sorters.length,
            i;
        
        for (i = 0; i < length; i++) {
            min[i] = {
                property : sorters[i].property,
                direction: sorters[i].direction
            };
        }
        
        return Ext.encode(min);
    },
    
    
    encodeFilters: function(filters) {
        var min = [],
            length = filters.length,
            i;
        
        for (i = 0; i < length; i++) {
            min[i] = {
                property: filters[i].property,
                value   : filters[i].value
            };
        }
        
        return Ext.encode(min);
    },
    
    
    encodeGroupers: function(group) {
        return Ext.encode(group);
    },
    
    
    getParams: function(params, operation) {
        params = params || {};
        
        var group       = operation.group,
            sorters     = operation.sorters,
            filters     = operation.filters,
            page        = operation.page,
            start       = operation.start,
            limit       = operation.limit,
            
            pageParam   = this.pageParam,
            startParam  = this.startParam,
            limitParam  = this.limitParam,
            groupParam  = this.groupParam,
            sortParam   = this.sortParam,
            filterParam = this.filterParam;
        
        if (pageParam && page) {
            params[pageParam] = page;
        }
        
        if (startParam && start) {
            params[startParam] = start;
        }
        
        if (limitParam && limit) {
            params[limitParam] = limit;
        }
        
        if (groupParam && group && group.field) {
            params[groupParam] = this.encodeGroupers(group);
        }
        
        if (sortParam && sorters && sorters.length > 0) {
            params[sortParam] = this.encodeSorters(sorters);
        }
        
        if (filterParam && filters && filters.length > 0) {
            params[filterParam] = this.encodeFilters(filters);
        }
        
        return params;
    },
    
    
    buildUrl: function(request) {
        var url = request.url || this.url;
        
        if (!url) {
            throw new Error("You are using a ServerProxy but have not supplied it with a url.");
        }
        
        if (this.noCache) {
            url = Ext.urlAppend(url, Ext.util.Format.format("{0}={1}", this.cacheString, (new Date().getTime())));
        }
        
        return url;
    },
    
    
    doRequest: function(operation, callback, scope) {
        throw new Error("The doRequest function has not been implemented on your Ext.data.ServerProxy subclass. See src/data/ServerProxy.js for details");
    },
    
    
    afterRequest: Ext.emptyFn,
    
    onDestroy: function() {
        Ext.destroy(this.reader, this.writer);
        
        Ext.data.ServerProxy.superclass.destroy.apply(this, arguments);
    }
});

Ext.data.AjaxProxy = Ext.extend(Ext.data.ServerProxy, {
    
    actionMethods: {
        create : 'POST',
        read   : 'GET',
        update : 'POST',
        destroy: 'POST'
    },
    
    
    
    constructor: function() {
        this.addEvents(
            
            'exception'
        );
        
        Ext.data.AjaxProxy.superclass.constructor.apply(this, arguments);    
    },
    
    
    doRequest: function(operation, callback, scope) {
        var writer  = this.getWriter(),
            request = this.buildRequest(operation, callback, scope);
            
        if (operation.allowWrite()) {
            request = writer.write(request);
        }
        
        Ext.apply(request, {
            headers       : this.headers,
            timeout       : this.timeout,
            scope         : this,
            callback      : this.createRequestCallback(request, operation, callback, scope),
            method        : this.getMethod(request),
            disableCaching: false 
        });
        
        Ext.Ajax.request(request);
        
        return request;
    },
    
    
    getMethod: function(request) {
        return this.actionMethods[request.action];
    },
    
    
    createRequestCallback: function(request, operation, callback, scope) {
        var me = this;
        
        return function(options, success, response) {
            if (success === true) {
                var reader  = me.getReader(),
                    result  = reader.read(response),
                    records = result.records,
                    length  = records.length,
                    mc      = new Ext.util.MixedCollection(true, function(r) {return r.getId();}),
                    record, i;
                
                mc.addAll(operation.records);
                for (i = 0; i < length; i++) {
                    record = mc.get(records[i].getId());
                    
                    if (record) {
                        record.set(record.data);
                    }
                }

                
                Ext.apply(operation, {
                    response : response,
                    resultSet: result
                });
                
                operation.setCompleted();
                operation.setSuccessful();
            } else {
                me.fireEvent('exception', this, response, operation);
                
                
                operation.setException();                
            }
            
            
            if (typeof callback == 'function') {
                callback.call(scope || me, operation);
            }
            
            me.afterRequest(request, true);
        };
    }
});

Ext.data.ProxyMgr.registerType('ajax', Ext.data.AjaxProxy);


Ext.data.HttpProxy = Ext.data.AjaxProxy;

Ext.data.RestProxy = Ext.extend(Ext.data.AjaxProxy, {
    
    appendId: true,
    
    
    
    
    actionMethods: {
        create : 'POST',
        read   : 'GET',
        update : 'PUT',
        destroy: 'DELETE'
    },
    
    api: {
        create : 'create',
        read   : 'read',
        update : 'update',
        destroy: 'destroy'
    },
    
    
    buildUrl: function(request) {
        var records = request.operation.records || [],
            record  = records[0],
            format  = this.format,
            url     = request.url || this.url;
        
        if (this.appendId && record) {
            if (!url.match(/\/$/)) {
                url += '/';
            }
            
            url += record.getId();
        }
        
        if (format) {
            if (!url.match(/\.$/)) {
                url += '.';
            }
            
            url += format;
        }
        
        request.url = url;
        
        return Ext.data.RestProxy.superclass.buildUrl.apply(this, arguments);
    }
});

Ext.data.ProxyMgr.registerType('rest', Ext.data.RestProxy);
Ext.apply(Ext, {
    
    getHead : function() {
        var head;
        
        return function() {
            if (head == undefined) {
                head = Ext.get(document.getElementsByTagName("head")[0]);
            }
            
            return head;
        };
    }()
});


Ext.data.ScriptTagProxy = Ext.extend(Ext.data.ServerProxy, {
    defaultWriterType: 'base',
    
    
    callbackParam : "callback",
    
    
    scriptIdPrefix: 'stcScript',
    
    
    callbackPrefix: 'stcCallback',
    
    
    recordParam: 'records',
    
    
    lastRequest: undefined,
    
    
    autoAppendParams: true,
    
    constructor: function(){
        this.addEvents(
            
            'exception'
        );
        
        Ext.data.ScriptTagProxy.superclass.constructor.apply(this, arguments);    
    },

    
    doRequest: function(operation, callback, scope) {
        
        var format     = Ext.util.Format.format,
            transId    = ++Ext.data.ScriptTagProxy.TRANS_ID,
            scriptId   = format("{0}{1}", this.scriptIdPrefix, transId),
            stCallback = format("{0}{1}", this.callbackPrefix, transId);
        
        var writer  = this.getWriter(),
            request = this.buildRequest(operation),
            
            url     = Ext.urlAppend(request.url, format("{0}={1}", this.callbackParam, stCallback));
            
        if (operation.allowWrite()) {
            request = writer.write(request);
        }
        
        
        Ext.apply(request, {
            url       : url,
            transId   : transId,
            scriptId  : scriptId,
            stCallback: stCallback
        });
        
        
        request.timeoutId = Ext.defer(this.createTimeoutHandler, this.timeout, this, [request, operation]);
        
        
        window[stCallback] = this.createRequestCallback(request, operation, callback, scope);
        
        
        var script = document.createElement("script");
        script.setAttribute("src", url);
        script.setAttribute("async", true);
        script.setAttribute("type", "text/javascript");
        script.setAttribute("id", scriptId);
        
        Ext.getHead().appendChild(script);
        operation.setStarted();
        
        this.lastRequest = request;
        
        return request;
    },
    
    
    createRequestCallback: function(request, operation, callback, scope) {
        var me = this;
        
        return function(response) {
            var reader = me.getReader(),
                result = reader.read(response);
            
            
            Ext.apply(operation, {
                response : response,
                resultSet: result
            });
            
            operation.setCompleted();
            operation.setSuccessful();
            
            
            if (typeof callback == 'function') {
                callback.call(scope || me, operation);
            }
            
            me.afterRequest(request, true);
        };
    },
    
    
    afterRequest: function() {
        var cleanup = function(functionName) {
            return function() {
                window[functionName] = undefined;
                
                try {
                    delete window[functionName];
                } catch(e) {}
            };
        };
        
        return function(request, isLoaded) {
            Ext.get(request.scriptId).remove();
            clearTimeout(request.timeoutId);
            
            var callbackName = request.stCallback;
            
            if (isLoaded) {
                cleanup(callbackName)();
                this.lastRequest.completed = true;
            } else {
                
                window[callbackName] = cleanup(callbackName);
            }
        };
    }(),
    
    
    buildUrl: function(request) {
        var url     = Ext.data.ScriptTagProxy.superclass.buildUrl.call(this, request),  
            params  = Ext.apply({}, request.params),
            filters = params.filters,
            filter, i;
            
        delete params.filters;
        
        if (this.autoAppendParams) {
            url = Ext.urlAppend(url, Ext.urlEncode(params));
        }
        
        if (filters && filters.length) {
            for (i = 0; i < filters.length; i++) {
                filter = filters[i];
                
                if (filter.value) {
                    url = Ext.urlAppend(url, filter.property + "=" + filter.value);
                }
            }
        }
        
        
        var records = request.records;
        
        if (Ext.isArray(records) && records.length > 0) {
            url = Ext.urlAppend(url, Ext.util.Format.format("{0}={1}", this.recordParam, this.encodeRecords(records)));
        }
        
        return url;
    },
    
    
    destroy: function() {
        this.abort();
        
        Ext.data.ScriptTagProxy.superclass.destroy.apply(this, arguments);
    },
        
    
    isLoading : function(){
        var lastRequest = this.lastRequest;
        
        return (lastRequest != undefined && !lastRequest.completed);
    },
    
    
    abort: function() {
        if (this.isLoading()) {
            this.afterRequest(this.lastRequest);
        }
    },
        
    
    encodeRecords: function(records) {
        var encoded = "";
        
        for (var i = 0, length = records.length; i < length; i++) {
            encoded += Ext.urlEncode(records[i].data);
        }
        
        return encoded;
    },
    
    
    createTimeoutHandler: function(request, operation) {
        this.afterRequest(request, false);

        this.fireEvent('exception', this, request, operation);
        
        if (typeof request.callback == 'function') {
            request.callback.call(request.scope || window, null, request.options, false);
        }        
    }
});

Ext.data.ScriptTagProxy.TRANS_ID = 1000;

Ext.data.ProxyMgr.registerType('scripttag', Ext.data.ScriptTagProxy);

Ext.data.ClientProxy = Ext.extend(Ext.data.Proxy, {
    
    clear: function() {
        throw new Error("The Ext.data.ClientProxy subclass that you are using has not defined a 'clear' function. See src/data/ClientProxy.js for details.");
    }
});

Ext.data.MemoryProxy = Ext.extend(Ext.data.ClientProxy, {
    
    
    constructor: function(config) {
        Ext.data.MemoryProxy.superclass.constructor.call(this, config);
        
        
        this.setReader(this.reader);
    },
    
    
    read: function(operation, callback, scope) {
        var reader = this.getReader(),
            result = reader.read(this.data);

        Ext.apply(operation, {
            resultSet: result
        });
        
        operation.setCompleted();
        
        if (typeof callback == 'function') {
            callback.call(scope || this, operation);
        }
    },
    
    clear: Ext.emptyFn
});

Ext.data.ProxyMgr.registerType('memory', Ext.data.MemoryProxy);

Ext.data.WebStorageProxy = Ext.extend(Ext.data.ClientProxy, {
    
    id: undefined,

    
    constructor: function(config) {
        Ext.data.WebStorageProxy.superclass.constructor.call(this, config);
        
        
        this.cache = {};

        if (this.getStorageObject() == undefined) {
            throw "Local Storage is not supported in this browser, please use another type of data proxy";
        }

        
        this.id = this.id || (this.store ? this.store.storeId : undefined);

        if (this.id == undefined) {
            throw "No unique id was provided to the local storage proxy. See Ext.data.LocalStorageProxy documentation for details";
        }

        this.initialize();
    },

    
    create: function(operation, callback, scope) {
        var records = operation.records,
            length  = records.length,
            ids     = this.getIds(),
            id, record, i;
        
        operation.setStarted();

        for (i = 0; i < length; i++) {
            record = records[i];

            if (record.phantom) {
                record.phantom = false;
                id = this.getNextId();
            } else {
                id = record.getId();
            }

            this.setRecord(record, id);
            ids.push(id);
        }

        this.setIds(ids);

        operation.setCompleted();
        operation.setSuccessful();

        if (typeof callback == 'function') {
            callback.call(scope || this, operation);
        }
    },

    
    read: function(operation, callback, scope) {
        

        var records = [],
            ids     = this.getIds(),
            length  = ids.length,
            i, recordData, record;
        
        
        if (operation.id) {
            record = this.getRecord(operation.id);
            
            if (record) {
                records.push(record);
                operation.setSuccessful();
            }
        } else {
            for (i = 0; i < length; i++) {
                records.push(this.getRecord(ids[i]));
            }
            operation.setSuccessful();
        }
        
        operation.setCompleted();

        operation.resultSet = new Ext.data.ResultSet({
            records: records,
            total  : records.length,
            loaded : true
        });

        if (typeof callback == 'function') {
            callback.call(scope || this, operation);
        }
    },

    
    update: function(operation, callback, scope) {
        var records = operation.records,
            length  = records.length,
            ids     = this.getIds(),
            record, id, i;

        operation.setStarted();

        for (i = 0; i < length; i++) {
            record = records[i];
            this.setRecord(record);
            
            
            
            id = record.getId();
            if (id !== undefined && ids.indexOf(id) == -1) {
                ids.push(id);
            }
        }
        this.setIds(ids);

        operation.setCompleted();
        operation.setSuccessful();

        if (typeof callback == 'function') {
            callback.call(scope || this, operation);
        }
    },

    
    destroy: function(operation, callback, scope) {
        var records = operation.records,
            length  = records.length,
            ids     = this.getIds(),

            
            newIds  = [].concat(ids),
            i;

        for (i = 0; i < length; i++) {
            newIds.remove(records[i].getId());
            this.removeRecord(records[i], false);
        }

        this.setIds(newIds);

        if (typeof callback == 'function') {
            callback.call(scope || this, operation);
        }
    },

    
    getRecord: function(id) {
        if (this.cache[id] == undefined) {
            var rawData = Ext.decode(this.getStorageObject().getItem(this.getRecordKey(id))),
                data    = {},
                Model   = this.model,
                fields  = Model.prototype.fields.items,
                length  = fields.length,
                i, field, name, record;

            for (i = 0; i < length; i++) {
                field = fields[i];
                name  = field.name;

                if (typeof field.decode == 'function') {
                    data[name] = field.decode(rawData[name]);
                } else {
                    data[name] = rawData[name];
                }
            }

            record = new Model(data, id);
            record.phantom = false;

            this.cache[id] = record;
        }
        
        return this.cache[id];
    },

    
    setRecord: function(record, id) {
        if (id) {
            record.setId(id);
        } else {
            id = record.getId();
        }

        var rawData = record.data,
            data    = {},
            model   = this.model,
            fields  = model.prototype.fields.items,
            length  = fields.length,
            i, field, name;

        for (i = 0; i < length; i++) {
            field = fields[i];
            name  = field.name;

            if (typeof field.encode == 'function') {
                data[name] = field.encode(rawData[name], record);
            } else {
                data[name] = rawData[name];
            }
        }

        var obj = this.getStorageObject(),
            key = this.getRecordKey(id);
        
        
        this.cache[id] = record;
        
        
        obj.removeItem(key);
        obj.setItem(key, Ext.encode(data));
    },

    
    removeRecord: function(id, updateIds) {
        if (id instanceof Ext.data.Model) {
            id = id.getId();
        }

        if (updateIds !== false) {
            var ids = this.getIds();
            ids.remove(id);
            this.setIds(ids);
        }

        this.getStorageObject().removeItem(this.getRecordKey(id));
    },

    
    getRecordKey: function(id) {
        if (id instanceof Ext.data.Model) {
            id = id.getId();
        }

        return Ext.util.Format.format("{0}-{1}", this.id, id);
    },

    
    getRecordCounterKey: function() {
        return Ext.util.Format.format("{0}-counter", this.id);
    },

    
    getIds: function() {
        var ids    = (this.getStorageObject().getItem(this.id) || "").split(","),
            length = ids.length,
            i;

        if (length == 1 && ids[0] == "") {
            ids = [];
        } else {
            for (i = 0; i < length; i++) {
                ids[i] = parseInt(ids[i], 10);
            }
        }

        return ids;
    },

    
    setIds: function(ids) {
        var obj = this.getStorageObject(),
            str = ids.join(",");
        
        obj.removeItem(this.id);
        
        if (!Ext.isEmpty(str)) {
            obj.setItem(this.id, str);
        }
    },

    
    getNextId: function() {
        var obj  = this.getStorageObject(),
            key  = this.getRecordCounterKey(),
            last = obj[key],
            ids, id;
        
        if (last == undefined) {
            ids = this.getIds();
            last = ids[ids.length - 1] || 0;
        }
        
        id = parseInt(last, 10) + 1;
        obj.setItem(key, id);
        
        return id;
    },

    
    initialize: function() {
        var storageObject = this.getStorageObject();
        storageObject.setItem(this.id, storageObject.getItem(this.id) || "");
    },

    
    clear: function() {
        var obj = this.getStorageObject(),
            ids = this.getIds(),
            len = ids.length,
            i;

        
        for (i = 0; i < len; i++) {
            this.removeRecord(ids[i]);
        }

        
        obj.removeItem(this.getRecordCounterKey());
        obj.removeItem(this.id);
    },

    
    getStorageObject: function() {
        throw new Error("The getStorageObject function has not been defined in your Ext.data.WebStorageProxy subclass");
    }
});

Ext.data.LocalStorageProxy = Ext.extend(Ext.data.WebStorageProxy, {
    
    getStorageObject: function() {
        return window.localStorage;
    }
});

Ext.data.ProxyMgr.registerType('localstorage', Ext.data.LocalStorageProxy);

Ext.data.SessionStorageProxy = Ext.extend(Ext.data.WebStorageProxy, {
    
    getStorageObject: function() {
        return window.sessionStorage;
    }
});

Ext.data.ProxyMgr.registerType('sessionstorage', Ext.data.SessionStorageProxy);

Ext.data.Reader = Ext.extend(Object, {
    
    idProperty: 'id',

    
    totalProperty: 'total',

    
    successProperty: 'success',

    
    root: '',
    
    
    implicitIncludes: true,
    
    
    nullResultSet: new Ext.data.ResultSet({
        total  : 0,
        count  : 0,
        records: [],
        success: true
    }),

    constructor: function(config) {
        Ext.apply(this, config || {});

        this.model = Ext.ModelMgr.getModel(config.model);
        if (this.model) {
            this.buildExtractors();
        }
    },

    
    setModel: function(model, setOnProxy) {
        this.model = Ext.ModelMgr.getModel(model);
        this.buildExtractors(true);
        
        if (setOnProxy && this.proxy) {
            this.proxy.setModel(this.model, true);
        }
    },

    
    read: function(response) {
        var data = response;
        
        if (response && response.responseText) {
            data = this.getResponseData(response);
        }
        
        if (data) {
            return this.readRecords(data);
        } else {
            return this.nullResultSet;
        }
    },

    
    readRecords: function(data) {
        
        this.rawData = data;

        data = this.getData(data);

        var root    = this.getRoot(data),
            total   = root.length,
            success = true,
            value, records, recordCount;

        if (this.totalProperty) {
            value = parseInt(this.getTotal(data), 10);
            if (!isNaN(value)) {
                total = value;
            }
        }

        if (this.successProperty) {
            value = this.getSuccess(data);
            if (value === false || value === 'false') {
                success = false;
            }
        }

        records = this.extractData(root, true);
        recordCount = records.length;

        return new Ext.data.ResultSet({
            total  : total || recordCount,
            count  : recordCount,
            records: records,
            success: success
        });
    },

    
    extractData : function(root, returnRecords) {
        var values  = [],
            records = [],
            Model   = this.model,
            length  = root.length,
            idProp  = this.idProperty,
            node, id, record, i;

        for (i = 0; i < length; i++) {
            node   = root[i];
            values = this.extractValues(node);
            id     = this.getId(node);

            if (returnRecords === true) {
                record = new Model(values, id);
                record.raw = node;
                records.push(record);
                
                if (this.implicitIncludes) {
                    this.readAssociated(record, node);
                }
            } else {
                values[idProp] = id;
                records.push(values);
            }
        }

        return records;
    },
    
    
    readAssociated: function(record, data) {
        var associations = record.associations.items,
            length       = associations.length,
            association, associationName, associatedModel, associationData, inverseAssociation, proxy, reader, store, i;
        
        for (i = 0; i < length; i++) {
            association     = associations[i];
            associationName = association.name;
            associationData = this.getAssociatedDataRoot(data, association.associationKey || associationName);
            associatedModel = association.associatedModel;
            
            if (associationData) {
                proxy = associatedModel.proxy;
                
                
                if (proxy) {
                    reader = proxy.getReader();
                } else {
                    reader = new this.constructor({
                        model: association.associatedName
                    });
                }
                
                if (association.type == 'hasMany') {
                    store = record[associationName]();
                    
                    store.add.apply(store, reader.read(associationData).records);
                    
                    
                    
                    inverseAssociation = associatedModel.prototype.associations.findBy(function(assoc) {
                        return assoc.type == 'belongsTo' && assoc.associatedName == record.constructor.modelName;
                    });
                    
                    
                    if (inverseAssociation) {
                        store.data.each(function(associatedRecord) {
                            associatedRecord[inverseAssociation.instanceName] = record;
                        });                        
                    }

                } else if (association.type == 'belongsTo') {
                    record[association.instanceName] = reader.read([associationData]).records[0];
                }
            }
        }
    },
    
    
    getAssociatedDataRoot: function(data, associationName) {
        return data[associationName];
    },

    
    extractValues: function(data) {
        var fields = this.model.prototype.fields.items,
            length = fields.length,
            output = {},
            field, value, i;

        for (i = 0; i < length; i++) {
            field = fields[i];
            value = this.extractorFunctions[i](data) || field.defaultValue;

            output[field.name] = value;
        }

        return output;
    },

    
    getData: function(data) {
        return data;
    },

    
    getRoot: function(data) {
        return data;
    },

    
    getResponseData: function(response) {
        throw new Error("getResponseData must be implemented in the Ext.data.Reader subclass");
    },

    
    onMetaChange : function(meta) {
        var fields = meta.fields,
            newModel;
        
        Ext.apply(this, meta);
        
        if (fields) {
            newModel = Ext.regModel("JsonReader-Model" + Ext.id(), {fields: fields});
            this.setModel(newModel, true);
        } else {
            this.buildExtractors(true);
        }
    },

    
    buildExtractors: function(force) {
        if (force === true) {
            delete this.extractorFunctions;
        }
        
        if (this.extractorFunctions) {
            return;
        }

        var idProp      = this.id || this.idProperty,
            totalProp   = this.totalProperty,
            successProp = this.successProperty,
            messageProp = this.messageProperty;

        
        if (totalProp) {
            this.getTotal = this.createAccessor(totalProp);
        }

        if (successProp) {
            this.getSuccess = this.createAccessor(successProp);
        }

        if (messageProp) {
            this.getMessage = this.createAccessor(messageProp);
        }

        if (idProp) {
            var accessor = this.createAccessor(idProp);

            this.getId = function(record) {
                var id = accessor(record);

                return (id == undefined || id == '') ? null : id;
            };
        } else {
            this.getId = function() {
                return null;
            };
        }
        this.buildFieldExtractors();
    },

    
    buildFieldExtractors: function() {
        
        var fields = this.model.prototype.fields.items,
            ln = fields.length,
            i  = 0,
            extractorFunctions = [],
            field, map;

        for (; i < ln; i++) {
            field = fields[i];
            map   = (field.mapping !== undefined && field.mapping !== null) ? field.mapping : field.name;

            extractorFunctions.push(this.createAccessor(map));
        }

        this.extractorFunctions = extractorFunctions;
    }
});

Ext.data.Writer = Ext.extend(Object, {

    constructor: function(config) {
        Ext.apply(this, config);
    },

    
    write: function(request) {
        var operation = request.operation,
            records   = operation.records || [],
            ln        = records.length,
            i         = 0,
            data      = [];

        for (; i < ln; i++) {
            data.push(this.getRecordData(records[i]));
        }
        return this.writeRecords(request, data);
    },

    
    getRecordData: function(record) {
        return record.data;
    }
});

Ext.data.WriterMgr.registerType('base', Ext.data.Writer);


Ext.data.JsonWriter = Ext.extend(Ext.data.Writer, {
    
    root: 'records',
    
    
    encode: false,
    
    
    writeRecords: function(request, data) {
        if (this.encode === true) {
            data = Ext.encode(data);
        }
        
        request.jsonData = request.jsonData || {};
        request.jsonData[this.root] = data;
        
        return request;
    }
});

Ext.data.WriterMgr.registerType('json', Ext.data.JsonWriter);


Ext.data.JsonReader = Ext.extend(Ext.data.Reader, {
    root: '',
    
    
    
    
    readRecords: function(data) {
        
        if (data.metaData) {
            this.onMetaChange(data.metaData);
        }

        
        this.jsonData = data;

        return Ext.data.JsonReader.superclass.readRecords.call(this, data);
    },

    
    getResponseData: function(response) {
        try {
            var data = Ext.decode(response.responseText);
        }
        catch (ex) {
            throw 'Ext.data.JsonReader.getResponseData: Unable to parse JSON returned by Server.';
        }

        if (!data) {
            throw 'Ext.data.JsonReader.getResponseData: JSON object not found';
        }

        return data;
    },

    
    buildExtractors : function() {
        Ext.data.JsonReader.superclass.buildExtractors.apply(this, arguments);

        if (this.root) {
            this.getRoot = this.createAccessor(this.root);
        } else {
            this.getRoot = function(root) {
                return root;
            };
        }
    },
    
    
    extractData: function(root, returnRecords) {
        var recordName = this.record,
            data = [],
            length, i;
        
        if (recordName) {
            length = root.length;
            
            for (i = 0; i < length; i++) {
                data[i] = root[i][recordName];
            }
        } else {
            data = root;
        }
        
        return Ext.data.JsonReader.superclass.extractData.call(this, data, returnRecords);
    },

    
    createAccessor: function() {
        var re = /[\[\.]/;

        return function(expr) {
            if (Ext.isEmpty(expr)) {
                return Ext.emptyFn;
            }
            if (Ext.isFunction(expr)) {
                return expr;
            }
            var i = String(expr).search(re);
            if (i >= 0) {
                return new Function('obj', 'return obj' + (i > 0 ? '.' : '') + expr);
            }
            return function(obj) {
                return obj[expr];
            };
        };
    }()
});

Ext.data.ReaderMgr.registerType('json', Ext.data.JsonReader);
Ext.data.TreeReader = Ext.extend(Ext.data.JsonReader, {
    extractData : function(root, returnRecords) {
        var records = Ext.data.TreeReader.superclass.extractData.call(this, root, returnRecords),
            ln = records.length,
            i  = 0,
            record;

        if (returnRecords) {
            for (; i < ln; i++) {
                record = records[i];
                record.doPreload = !!this.getRoot(record.raw);
            }
        }
        return records;
    }
});
Ext.data.ReaderMgr.registerType('tree', Ext.data.TreeReader);

Ext.data.ArrayReader = Ext.extend(Ext.data.JsonReader, {

    
    buildExtractors: function() {
        Ext.data.ArrayReader.superclass.buildExtractors.apply(this, arguments);
        
        var fields = this.model.prototype.fields.items,
            length = fields.length,
            extractorFunctions = [],
            i;
        
        for (i = 0; i < length; i++) {
            extractorFunctions.push(function(index) {
                return function(data) {
                    return data[index];
                };
            }(fields[i].mapping || i));
        }
        
        this.extractorFunctions = extractorFunctions;
    }
});

Ext.data.ReaderMgr.registerType('array', Ext.data.ArrayReader);


Ext.data.ArrayStore = Ext.extend(Ext.data.Store, {
    
    constructor: function(config) {
        config = config || {};

        Ext.applyIf(config, {
            proxy: {
                type: 'memory',
                reader: 'array'
            }
        });

        Ext.data.ArrayStore.superclass.constructor.call(this, config);
    },

    loadData: function(data, append) {
        if (this.expandData === true) {
            var r = [],
                i = 0,
                ln = data.length;

            for (; i < ln; i++) {
                r[r.length] = [data[i]];
            }
            
            data = r;
        }

        Ext.data.ArrayStore.superclass.loadData.call(this, data, append);
    }
});
Ext.reg('arraystore', Ext.data.ArrayStore);


Ext.data.SimpleStore = Ext.data.ArrayStore;
Ext.reg('simplestore', Ext.data.SimpleStore);

Ext.data.JsonStore = Ext.extend(Ext.data.Store, {
    
    constructor: function(config) {
        config = config || {};
              
        Ext.applyIf(config, {
            proxy: {
                type  : 'ajax',
                reader: 'json',
                writer: 'json'
            }
        });
        
        Ext.data.JsonStore.superclass.constructor.call(this, config);
    }
});

Ext.reg('jsonstore', Ext.data.JsonStore);

Ext.data.JsonPStore = Ext.extend(Ext.data.Store, {
    
    constructor: function(config) {
        Ext.data.JsonPStore.superclass.constructor.call(this, Ext.apply(config, {
            reader: new Ext.data.JsonReader(config),
            proxy : new Ext.data.ScriptTagProxy(config)
        }));
    }
});

Ext.reg('jsonpstore', Ext.data.JsonPStore);


Ext.data.XmlWriter = Ext.extend(Ext.data.Writer, {
    
    documentRoot: 'xmlData',

    
    header: '',

    
    record: 'record',

    
    writeRecords: function(request, data) {
        var tpl = this.buildTpl(request, data);

        request.xmlData = tpl.apply(data);

        return request;
    },

    buildTpl: function(request, data) {
        if (this.tpl) {
            return this.tpl;
        }

        var tpl = [],
            root = this.documentRoot,
            record = this.record,
            first,
            key;

        if (this.header) {
            tpl.push(this.header);
        }
        tpl.push('<', root, '>');
        if (data.length > 0) {
            tpl.push('<tpl for="."><', record, '>');
            first = data[0];
            for (key in first) {
                if (first.hasOwnProperty(key)) {
                    tpl.push('<', key, '>{', key, '}</', key, '>');
                }
            }
            tpl.push('</', record, '></tpl>');
        }
        tpl.push('</', root, '>');
        this.tpl = new Ext.XTemplate(tpl.join(''));
        return this.tpl;
    }
});

Ext.data.WriterMgr.registerType('xml', Ext.data.XmlWriter);

Ext.data.XmlReader = Ext.extend(Ext.data.Reader, {
    

    

    createAccessor: function() {
        var selectValue = function(key, root, defaultValue){
            var node = Ext.DomQuery.selectNode(key, root),
                val;
            if (node && node.firstChild) {
                val = node.firstChild.nodeValue;
            }
            return Ext.isEmpty(val) ? defaultValue : val;
        };

        return function(key) {
            var fn;

            if (key == this.totalProperty) {
                fn = function(root, defaultValue) {
                    var value = selectValue(key, root, defaultValue);
                    return parseFloat(value);
                };
            }

            else if (key == this.successProperty) {
                fn = function(root, defaultValue) {
                    var value = selectValue(key, root, true);
                    return (value !== false && value !== 'false');
                };
            }

            else {
                fn = function(root, defaultValue) {
                    return selectValue(key, root, defaultValue);
                };
            }

            return fn;
        };
    }(),

    
    getResponseData: function(response) {
        var xml = response.responseXML;

        if (!xml) {
            throw {message: 'Ext.data.XmlReader.read: XML data not found'};
        }

        return xml;
    },

    
    getData: function(data) {
        return data.documentElement || data;
    },

    
    getRoot: function(data) {
        var nodeName = data.nodeName,
            root     = this.root;
        
        if (!root || (nodeName && nodeName == root)) {
            return data;
        } else {
            return Ext.DomQuery.selectNode(root, data);
        }
    },


    


    

    

    

    
    constructor: function(config) {
        config = config || {};

        
        

        Ext.applyIf(config, {
            idProperty     : config.idPath || config.id,
            successProperty: config.success
        });
        
        Ext.data.XmlReader.superclass.constructor.call(this, config);
    },
    
    
    extractData: function(root, returnRecords) {
        var recordName = this.record;
        
        if (recordName != root.nodeName) {
            root = Ext.DomQuery.select(recordName, root);
        } else {
            root = [root];
        }
        
        return Ext.data.XmlReader.superclass.extractData.call(this, root, returnRecords);
    },
    
    
    getAssociatedDataRoot: function(data, associationName) {
        return Ext.DomQuery.select(associationName, data)[0];
    },

    
    readRecords: function(doc) {
        
        if (Ext.isArray(doc)) {
            doc = doc[0];
        }
        
        
        this.xmlData = doc;
        
        return Ext.data.XmlReader.superclass.readRecords.call(this, doc);
    }
});

Ext.data.ReaderMgr.registerType('xml', Ext.data.XmlReader);

Ext.data.XmlStore = Ext.extend(Ext.data.Store, {
    
    constructor: function(config){
        config = config || {};
        config = config || {};
              
        Ext.applyIf(config, {
            proxy: {
                type: 'ajax',
                reader: 'xml',
                writer: 'xml'
            }
        });
        Ext.data.XmlStore.superclass.constructor.call(this, config);
    }
});
Ext.reg('xmlstore', Ext.data.XmlStore);


Ext.History = new Ext.util.Observable({
    constructor: function() {
        Ext.History.superclass.constructor.call(this, config);
        
        this.addEvents(
            
            'change'
        );
    },
    
    
    init: function() {
        var me = this;
        
        me.setToken(window.location.hash);
        
        if (Ext.supports.History) {
            window.addEventListener('hashchange', this.onChange);
        } else {
            setInterval(function() {
                var newToken = me.cleanToken(window.location.hash),
                    oldToken = me.getToken();
                
                if (newToken != oldToken) {
                    me.onChange();
                }
            }, 50);
        }
    },
    
    
    onChange: function() {
        var me       = Ext.History,
            newToken = me.cleanToken(window.location.hash);
        
        if (me.token != newToken) {
            me.fireEvent('change', newToken);
        }
        
        me.setToken(newToken);
    },
    
    
    setToken: function(token) {
        return this.token = this.cleanToken(token);
    },
    
    
    cleanToken: function(token) {
        return token[0] == '#' ? token.substr(1) : token;
    },
    
    
    getToken: function() {
        return this.token;
    },
    
    
    add: function(token) {
        window.location.hash = this.setToken(token);
        
        if (!Ext.supports.History) {
            this.onChange();
        }
    }
});

Ext.ControllerManager = new Ext.AbstractManager({
    register: function(id, options) {
        options.id = id;
        
        Ext.applyIf(options, {
            application: Ext.ApplicationManager.currentApplication
        });
        
        var controller = new Ext.Controller(options);
        
        if (controller.init) {
            controller.init();
        }
        
        this.all.add(controller);
        
        return controller;
    }
});


Ext.regController = function() {
    return Ext.ControllerManager.register.apply(Ext.ControllerManager, arguments);
};

Ext.Controller = Ext.extend(Ext.util.Observable, {
    constructor: function(config) {
        this.addEvents(
            
            'instance-created',
            
            
            'instance-creation-failed',
            
            
            'instance-updated',
            
            
            'instance-update-failed',
            
            
            'instance-destroyed',
            
            
            'instance-destruction-failed'
        );
        
        Ext.Controller.superclass.constructor.call(this, config);
        
        Ext.apply(this, config || {});
        
        if (typeof this.model == 'string') {
            this.model = Ext.ModelMgr.getModel(this.model);
        }
    },
    
    index: function() {
        this.render('index', {
            listeners: {
                scope  : this,
                edit   : this.edit,
                build  : this.build,
                create : this.onCreateInstance,
                destroy: this.onDestroyInstance
            }
        });
    },
    
    
    edit: function(instance) {
        var view = this.render('edit', {
            listeners: this.getEditListeners()
        });
        
        view.loadModel(instance);
    },
    
    
    build: function() {
        this.render('build', {
            listeners: this.getBuildListeners()
        });
    },
    
    
    create: function(data, options) {
        options = options || {};
        
        var model     = this.getModel(),
            instance  = new model(data),
            successCb = options.success,
            failureCb = options.failure,
            scope     = options.scope || this;
        
        instance.save({
            scope  : this,
            success: function(instance) {
                if (typeof successCb == 'function') {
                    successCb.call(scope, instance);
                }
                
                this.fireEvent('instance-created', instance);
            },
            failure: function(instance, errors) {                
                if (typeof failureCb == 'function') {
                    failureCb.call(scope, instance, errors);
                }
                
                this.fireEvent('instance-creation-failed', instance, errors);
            }
        });
    },
    
    
    update: function(instance, updates, options) {
        options = options || {};
        
        var successCb = options.success,
            failureCb = options.failure,
            scope     = options.scope || this;
        
        if (Ext.isObject(updates)) {
            instance.set(updates);
        }
        
        instance.save({
            scope  : this,
            success: function(instance) {
                if (typeof successCb == 'function') {
                    successCb.call(scope, instance);
                }
                
                this.fireEvent('instance-updated', instance);
            },
            failure: function(instance, errors) {
                if (typeof failureCb == 'function') {
                    failureCb.call(scope, instance, errors);
                }
                
                this.fireEvent('instance-update-failed', instance, errors);
            }
        });
    },
    
    
    destroy: function(instance, options) {
        options = options || {};
        
        var successCb = options.success,
            failureCb = options.failure,
            scope     = options.scope || this;
        
        instance.destroy({
            scope  : this,
            success: function(instance) {
                if (typeof successCb == 'function') {
                    successCb.call(scope, instance);
                }
                
                this.fireEvent('instance-destroyed', instance);
            },
            failure: function(instance, errors) {
                if (typeof failureCb == 'function') {
                    failureCb.call(scope, instance, errors);
                }
                
                this.fireEvent('instance-destruction-failed', instance, errors);
            }
        });
    },
    
    
    getBuildListeners: function() {
        return {
            scope : this,
            save  : this.onCreateInstance,
            cancel: this.onCancelBuild
        };
    },
    
    
    getEditListeners: function() {
        return {
            scope : this,
            save  : this.onUpdateInstance,
            cancel: this.onCancelEdit
        };
    },
    
    
    onCancelEdit: function(view) {
        return this.closeView(view);
    },
    
    
    onCancelBuild: function(view) {
        return this.closeView(view);
    },
    
    
    onCreateInstance: function(view) {
        this.create(view.getValues(), {
            scope  : this,
            success: function(instance) {
                this.closeView(view);
            },
            failure: function(instance, errors) {
                console.log('fail');
            }
        });
    },
    
    
    onUpdateInstance: function(view) {
        this.update(view.getRecord(), view.getValues(), {
            scope  : this,
            success: function(instance) {
                this.closeView(view);
            },
            failure: function(instance, errors) {
                
            }
        });
    },
    
    
    onDestroyInstance: function(instance, view) {
        this.destroy(instance, {
            scope  : this,
            success: function(instance) {
                
            },
            failure: function(instance, errors) {
                
            }
        });
    },
    
    
    setRenderTarget: function(target) {
        
        Ext.Controller.renderTarget = target;
    },
    
    
    render: function(config, target) {
        var Controller  = Ext.Controller,
            application = this.application,
            profile     = application ? application.currentProfile : undefined,
            profileTarget, view;
        
        Ext.applyIf(config, {
            profile: profile
        });
        
        view = Ext.ComponentMgr.create(config);
        
        if (target !== false) {
            
            profileTarget = profile ? profile.getRenderTarget(config, application) : target;
            
            if (target == undefined) {
                target = profileTarget || (application ? application.defaultTarget : undefined);
            }

            if (typeof target == 'string') {
                target = Ext.getCmp(target);
            }

            if (target != undefined && target.add) {
                if (profile) {
                    profile.beforeLayout(view, target, application);
                }
                
                target.add(view);

                if (target.layout && target.layout.setActiveItem) {
                    target.layout.setActiveItem(view);
                }

                target.doComponentLayout();
                
                if (profile) {
                    profile.afterLayout(view, target, application);
                }
            }
        }
        
        return view;
    },
    
        
    control : function(view, actions, itemName) {
        if (!view || !view.isView) {
            throw 'Trying to control a view that doesnt exist';
        }

        var item = itemName ? view.refs[itemName] : view,
            key, value, name, child, listener;
    
        if (!item) {
            throw "No item called " + itemName + " found inside the " + view.name + " view.";
        }        
    	
        for (key in actions) {
            value = actions[key];
    	
            
            
            
            if (Ext.isObject(value) && !value.fn) {
                this.control(view, value, key);
            }
            else {
                
                
                if (item.refs) {
                    for (name in item.refs) {
                        child = item.refs[name];
                        if (child.isObservable && child.events[key]) {
                            child.enableBubble(key);
                        }
                    }
                }
    
                if (!value.fn) {
                    listener = {};
                    listener[key] = value;
                    listener.scope = this;
                }
                else {
                    listener = value;
                    if (listener.scope === undefined) {
                        listener.scope = this;
                    }
                }

                
                item.addListener(listener);
            }
        }

        return view;
    },
    
    
    getModel: function() {
        return Ext.ModelMgr.getModel(this.model);
    },
    
    
    closeView: function(view) {
        var ownerCt = view.ownerCt;
        
        if (ownerCt) {
            ownerCt.remove(view);
            ownerCt.doLayout();
            ownerCt.setActiveItem(ownerCt.items.last());
        }
    }
});

Ext.util.Dispatcher = Ext.extend(Ext.util.Observable, {
    
    constructor: function(config) {
        this.addEvents(
            
            'before-dispatch',
            
            
            'dispatch'
        );
        
        Ext.util.Dispatcher.superclass.constructor.call(this, config);
    },
    
    
    dispatch: function(options) {
        var interaction = new Ext.Interaction(options),
            controller  = interaction.controller,
            action      = interaction.action,
            History     = Ext.History;
        
        if (this.fireEvent('before-dispatch', interaction) !== false) {
            if (History && options.historyUrl) {
                History.suspendEvents(false);
                History.add(options.historyUrl);
                Ext.defer(History.resumeEvents, 100, History);
            }
            
            if (controller && action) {
                controller[action].call(controller, interaction);
                interaction.dispatched = true;
            }
            
            this.fireEvent('dispatch', interaction);
        }
    },
    
    
    redirect: function(options) {
        if (options instanceof Ext.data.Model) {
            
            
        } else if (typeof options == 'string') {
            
            var route = Ext.Router.recognize(options);
            
            if (route) {
                return this.dispatch(route);
            }
        }
        return null;
    },
    
    
    createRedirect: function(url) {
        return function() {
            Ext.Dispatcher.redirect(url);
        };
    }
});


Ext.Dispatcher = new Ext.util.Dispatcher();


Ext.dispatch = function() {
    return Ext.Dispatcher.dispatch.apply(Ext.Dispatcher, arguments);
};


Ext.redirect = function() {
    return Ext.Dispatcher.redirect.apply(Ext.Dispatcher, arguments);
};

Ext.createRedirect = Ext.Dispatcher.createRedirect;

Ext.util.Router = Ext.extend(Ext.util.Observable, {
    
    constructor: function(config) {
        config = config || {};

        Ext.apply(this, config, {
            defaults: {
                action: 'index'
            }
        });
        
        this.routes = [];

        Ext.util.Router.superclass.constructor.call(this, config);
    },
    
    
    connect: function(url, params) {
        params = Ext.apply({url: url}, params || {}, this.defaults);
        var route = new Ext.util.Route(params);
        
        this.routes.push(route);
        
        return route;
    },
    
    
    recognize: function(url) {
        var routes = this.routes,
            length = routes.length,
            i, result;
        
        for (i = 0; i < length; i++) {
            result = routes[i].recognize(url);
            
            if (result != undefined) {
                return result;
            }
        }
        return undefined;
    },
    
    
    draw: function(fn) {
        fn.call(this, this);
    }
});


Ext.Router = new Ext.util.Router();


Ext.util.Route = Ext.extend(Object, {
    
    
    constructor: function(config) {
        Ext.apply(this, config, {
            conditions: {}
        });
        
        
        this.paramMatchingRegex = new RegExp(/:([0-9A-Za-z\_]*)/g);
        
        
        this.paramsInMatchString = this.url.match(this.paramMatchingRegex) || [];
        
        this.matcherRegex = this.createMatcherRegex(this.url);
    },
    
    
    recognize: function(url) {
        if (this.recognizes(url)) {
            var matches = this.matchesFor(url);
            
            return Ext.applyIf(matches, {
                controller: this.controller,
                action    : this.action,
                historyUrl: url
            });
        }
    },
    
    
    recognizes: function(url) {
        return this.matcherRegex.test(url);
    },
    
    
    matchesFor: function(url) {
        var params = {},
            keys   = this.paramsInMatchString,
            values = url.match(this.matcherRegex),
            length = keys.length,
            i;
        
        
        values.shift();

        for (i = 0; i < length; i++) {
            params[keys[i].replace(":", "")] = values[i];
        }

        return params;
    },
    
    
    urlFor: function(config) {
        
    },
    
    
    createMatcherRegex: function(url) {
        
        var paramsInMatchString = this.paramsInMatchString,
            length = paramsInMatchString.length,
            i, cond, matcher;
        
        for (i = 0; i < length; i++) {
            cond    = this.conditions[paramsInMatchString[i]];
            matcher = Ext.util.Format.format("({0})", cond || "[%a-zA-Z0-9\\_\\s,]+");

            url = url.replace(new RegExp(paramsInMatchString[i]), matcher);
        }

        
        return new RegExp("^" + url + "$");
    }
});

Ext.Interaction = Ext.extend(Ext.util.Observable, {
    
    controller: '',
    
    
    action: '',
    
    
    
    
    
    
    dispatched: false,
    
    constructor: function(config) {
        Ext.Interaction.superclass.constructor.apply(this, arguments);
        
        config = config || {};
              
        Ext.applyIf(config, {
            scope: this
        });
        
        Ext.apply(this, config);
        
        if (typeof this.controller == 'string') {
            this.controller = Ext.ControllerManager.get(this.controller);
        }
    }
});

Ext.Application = Ext.extend(Ext.util.Observable, {
    

    
    scope: undefined,

    
    useHistory: true,

    

    
    autoUpdateComponentProfiles: true,

    
    setProfilesOnLaunch: true,

    

    constructor: function(config) {
        this.addEvents(
            
            'launch',

            
            'beforeprofilechange',

            
            'profilechange'
        );

        Ext.Application.superclass.constructor.call(this, config);

        this.bindReady();

        var name = this.name;

        if (name) {
            window[name] = this;

            Ext.ns(
                name,
                name + ".views",
                name + ".stores",
                name + ".models",
                name + ".controllers"
            );
        }

        if (Ext.addMetaTags) {
            Ext.addMetaTags(config);
        }
    },

    
    bindReady : function() {
        Ext.onReady(this.onReady, this);
    },

    
    launch: Ext.emptyFn,

    
    useLoadMask: false,

    
    loadMaskFadeDuration: 1000,

    
    loadMaskRemoveDuration: 1050,

    
    autoInitViewport: true,

    
    dispatch: function(options) {
        return Ext.dispatch(options);
    },

    
    initLoadMask: function() {
        var useLoadMask = this.useLoadMask,
            defaultId   = 'loading-mask',
            loadMaskId  = typeof useLoadMask == 'string' ? useLoadMask : defaultId;

        if (useLoadMask) {
            if (loadMaskId == defaultId) {
                Ext.getBody().createChild({id: defaultId});
            }

            var loadingMask  = Ext.get('loading-mask'),
                fadeDuration = this.loadMaskFadeDuration,
                hideDuration = this.loadMaskRemoveDuration;

            Ext.defer(function() {
                loadingMask.addCls('fadeout');

                Ext.defer(function() {
                    loadingMask.remove();
                }, hideDuration);
            }, fadeDuration);
        }
    },

    
    onBeforeLaunch: function() {
        var History    = Ext.History,
            useHistory = History && this.useHistory,
            profile    = this.determineProfile(true);

        if (useHistory) {
            this.historyForm = Ext.getBody().createChild({
                id    : 'history-form',
                cls   : 'x-hide-display',
                style : 'display: none;',
                tag   : 'form',
                action: '#',
                children: [
                    {
                        tag: 'div',
                        children: [
                            {
                                tag : 'input',
                                id  : History.fieldId,
                                type: 'hidden'
                            },
                            {
                                tag: 'iframe',
                                id : History.iframeId
                            }
                        ]
                    }
                ]
            });

            History.init();
            History.on('change', this.onHistoryChange, this);

            var token = History.getToken();

            if (this.launch.call(this.scope || this, profile) !== false) {
                Ext.redirect(token || this.defaultUrl || {controller: 'application', action: 'index'});
            }
        } else {
            this.launch.call(this.scope || this, profile);
        }

        this.launched = true;

        this.fireEvent('launch', this);

        if (this.setProfilesOnLaunch) {
            this.updateComponentProfiles(profile);
        }
    },

    
    onReady: function() {
        if (this.useLoadMask) {
            this.initLoadMask();
        }

        Ext.EventManager.onOrientationChange(this.determineProfile, this);

        if (this.autoInitViewport) {
            Ext.Viewport.init(this.onBeforeLaunch, this);
        } else {
            this.onBeforeLaunch();
        }

        return this;
    },

    
    determineProfile: function(silent) {
        var currentProfile = this.currentProfile,
            profiles       = this.profiles,
            name;

        for (name in profiles) {
            if (profiles[name]() === true) {
                if (name != currentProfile && this.fireEvent('beforeprofilechange', name, currentProfile) !== false) {
                    if (this.autoUpdateComponentProfiles) {
                        this.updateComponentProfiles(name);
                    }

                    if (silent !== true) {
                        this.fireEvent('profilechange', name, currentProfile);
                    }
                }

                this.currentProfile = name;
                break;
            }
        }

        return this.currentProfile;
    },

    
    updateComponentProfiles: function(profile) {
        Ext.ComponentMgr.each(function(key, component){
            if (component.setProfile) {
                component.setProfile(profile);
            }
        });
    },

    
    getProfile: function() {
        return this.currentProfile;
    },

    
    onHistoryChange: function(token) {
        return Ext.redirect(token);
    }
});

Ext.ApplicationManager = new Ext.AbstractManager({
    register: function(name, options) {
        if (Ext.isObject(name)) {
            options = name;
        } else {
            options.name = name;
        }
        
        var application = new Ext.Application(options);
        
        this.all.add(application);
        
        this.currentApplication = application;
        
        return application;
    }
});


Ext.regApplication = function() {
    return Ext.ApplicationManager.register.apply(Ext.ApplicationManager, arguments);
};



(function() {
var El = Ext.Element = Ext.extend(Object, {
    
    defaultUnit : "px",

    constructor : function(element, forceNew) {
        var dom = typeof element == 'string'
                ? document.getElementById(element)
                : element,
            id;

        if (!dom) {
            return null;
        }

        id = dom.id;
        if (!forceNew && id && Ext.cache[id]) {
            return Ext.cache[id].el;
        }

        
        this.dom = dom;

        
        this.id = id || Ext.id(dom);
        return this;
    },

    
    set : function(o, useSet) {
        var el = this.dom,
            attr,
            value;

        for (attr in o) {
            if (o.hasOwnProperty(attr)) {
                value = o[attr];
                if (attr == 'style') {
                    this.applyStyles(value);
                }
                else if (attr == 'cls') {
                    el.className = value;
                }
                else if (useSet !== false) {
                    el.setAttribute(attr, value);
                }
                else {
                    el[attr] = value;
                }
            }
        }
        return this;
    },

    
    is : function(simpleSelector) {
        return Ext.DomQuery.is(this.dom, simpleSelector);
    },

    
    getValue : function(asNumber){
        var val = this.dom.value;
        return asNumber ? parseInt(val, 10) : val;
    },

    
    addListener : function(eventName, fn, scope, options){
        Ext.EventManager.on(this.dom,  eventName, fn, scope || this, options);
        return this;
    },

    
    removeListener : function(eventName, fn, scope) {
        Ext.EventManager.un(this.dom, eventName, fn, scope);
        return this;
    },

    
    removeAllListeners : function(){
        Ext.EventManager.removeAll(this.dom);
        return this;
    },

    
    purgeAllListeners : function() {
        Ext.EventManager.purgeElement(this, true);
        return this;
    },

    
    remove : function() {
        var me = this,
            dom = me.dom;

        if (dom) {
            delete me.dom;
            Ext.removeNode(dom);
        }
    },

    isAncestor : function(c) {
        var p = this.dom;
        c = Ext.getDom(c);
        if (p && c) {
            return p.contains(c);
        }
        return false;
    },

    
    isDescendent : function(p) {
        return Ext.fly(p, '_internal').isAncestor(this);
    },

    
    contains : function(el) {
        return !el ? false : this.isAncestor(el);
    },

    
    getAttribute : function(name, ns) {
        var d = this.dom;
        return d.getAttributeNS(ns, name) || d.getAttribute(ns + ":" + name) || d.getAttribute(name) || d[name];
    },

    
    setHTML : function(html) {
        if(this.dom) {
            this.dom.innerHTML = html;
        }
        return this;
    },

    
    getHTML : function() {
        return this.dom ? this.dom.innerHTML : '';
    },

    
    hide : function() {
        this.setVisible(false);
        return this;
    },

    
    show : function() {
        this.setVisible(true);
        return this;
    },

    
     setVisible : function(visible, animate) {
        var me = this,
            dom = me.dom,
            mode = this.getVisibilityMode();

        switch (mode) {
            case El.VISIBILITY:
                this.removeCls(['x-hidden-display', 'x-hidden-offsets']);
                this[visible ? 'removeCls' : 'addCls']('x-hidden-visibility');
            break;

            case El.DISPLAY:
                this.removeCls(['x-hidden-visibility', 'x-hidden-offsets']);
                this[visible ? 'removeCls' : 'addCls']('x-hidden-display');
            break;

            case El.OFFSETS:
                this.removeCls(['x-hidden-visibility', 'x-hidden-display']);
                this[visible ? 'removeCls' : 'addCls']('x-hidden-offsets');
            break;
        }

        return me;
    },

    getVisibilityMode: function() {
        var dom = this.dom,
            mode = El.data(dom, 'visibilityMode');

        if (mode === undefined) {
            El.data(dom, 'visibilityMode', mode = El.DISPLAY);
        }

        return mode;
    },

    setVisibilityMode : function(mode) {
        El.data(this.dom, 'visibilityMode', mode);
        return this;
    }
});

var Elp = El.prototype;


El.VISIBILITY = 1;

El.DISPLAY = 2;

El.OFFSETS = 3;


El.addMethods = function(o){
   Ext.apply(Elp, o);
};


Elp.on = Elp.addListener;
Elp.un = Elp.removeListener;


Elp.update = Elp.setHTML;


El.get = function(el){
    var extEl,
        dom,
        id;

    if(!el){
        return null;
    }

    if (typeof el == "string") { 
        if (!(dom = document.getElementById(el))) {
            return null;
        }
        if (Ext.cache[el] && Ext.cache[el].el) {
            extEl = Ext.cache[el].el;
            extEl.dom = dom;
        } else {
            extEl = El.addToCache(new El(dom));
        }
        return extEl;
    } else if (el.tagName) { 
        if(!(id = el.id)){
            id = Ext.id(el);
        }
        if (Ext.cache[id] && Ext.cache[id].el) {
            extEl = Ext.cache[id].el;
            extEl.dom = el;
        } else {
            extEl = El.addToCache(new El(el));
        }
        return extEl;
    } else if (el instanceof El) {
        if(el != El.docEl){
            
            
            el.dom = document.getElementById(el.id) || el.dom;
        }
        return el;
    } else if(el.isComposite) {
        return el;
    } else if(Ext.isArray(el)) {
        return El.select(el);
    } else if(el == document) {
        
        if(!El.docEl){
            var F = function(){};
            F.prototype = Elp;
            El.docEl = new F();
            El.docEl.dom = document;
            El.docEl.id = Ext.id(document);
        }
        return El.docEl;
    }
    return null;
};


El.addToCache = function(el, id){
    id = id || el.id;
    Ext.cache[id] = {
        el:  el,
        data: {},
        events: {}
    };
    return el;
};


El.data = function(el, key, value) {
    el = El.get(el);
    if (!el) {
        return null;
    }
    var c = Ext.cache[el.id].data;
    if (arguments.length == 2) {
        return c[key];
    }
    else {
        return (c[key] = value);
    }
};




El.garbageCollect = function() {
    if (!Ext.enableGarbageCollector) {
        clearInterval(El.collectorThreadId);
    }
    else {
        var id,
            dom,
            EC = Ext.cache;

        for (id in EC) {
            if (!EC.hasOwnProperty(id)) {
                continue;
            }
            if(EC[id].skipGarbageCollection){
                continue;
            }
            dom = EC[id].el.dom;
            if(!dom || !dom.parentNode || (!dom.offsetParent && !document.getElementById(id))){
                if(Ext.enableListenerCollection){
                    Ext.EventManager.removeAll(dom);
                }
                delete EC[id];
            }
        }
    }
};



El.Flyweight = function(dom) {
    this.dom = dom;
};

var F = function(){};
F.prototype = Elp;

El.Flyweight.prototype = new F;
El.Flyweight.prototype.isFlyweight = true;

El._flyweights = {};


El.fly = function(el, named) {
    var ret = null;
    named = named || '_global';

    el = Ext.getDom(el);
    if (el) {
        (El._flyweights[named] = El._flyweights[named] || new El.Flyweight()).dom = el;
        ret = El._flyweights[named];
    }

    return ret;
};


Ext.get = El.get;


Ext.fly = El.fly;



})();


Ext.applyIf(Ext.Element, {
    unitRe: /\d+(px|em|%|en|ex|pt|in|cm|mm|pc)$/i,
    camelRe: /(-[a-z])/gi,
    opacityRe: /alpha\(opacity=(.*)\)/i,
    propertyCache: {},
    defaultUnit : "px",
    borders: {l: 'border-left-width', r: 'border-right-width', t: 'border-top-width', b: 'border-bottom-width'},
    paddings: {l: 'padding-left', r: 'padding-right', t: 'padding-top', b: 'padding-bottom'},
    margins: {l: 'margin-left', r: 'margin-right', t: 'margin-top', b: 'margin-bottom'},

    addUnits : function(size, units) {
        if (size === "" || size == "auto" || size === null || size === undefined) {
            size = size || '';
        }
        else if (!isNaN(size) || !this.unitRe.test(size)) {
            size = size + (units || this.defaultUnit || 'px');
        }
        return size;
    },

    
    parseBox : function(box) {
        if (typeof box != 'string') {
            box = box.toString();
        }
        var parts  = box.split(' '),
            ln = parts.length;

        if (ln == 1) {
            parts[1] = parts[2] = parts[3] = parts[0];
        }
        else if (ln == 2) {
            parts[2] = parts[0];
            parts[3] = parts[1];
        }
        else if (ln == 3) {
            parts[3] = parts[1];
        }

        return {
            top   :parseFloat(parts[0]) || 0,
            right :parseFloat(parts[1]) || 0,
            bottom:parseFloat(parts[2]) || 0,
            left  :parseFloat(parts[3]) || 0
        };
    },
    
    
    unitizeBox : function(box, units) {
        var A = this.addUnits,
            B = this.parseBox(box);
            
        return A(B.top, units) + ' ' +
               A(B.right, units) + ' ' +
               A(B.bottom, units) + ' ' +
               A(B.left, units);
        
    },

    
    camelReplaceFn : function(m, a) {
        return a.charAt(1).toUpperCase();
    },

    
    normalize : function(prop) {
        return this.propertyCache[prop] || (this.propertyCache[prop] = prop == 'float' ? 'cssFloat' : prop.replace(this.camelRe, this.camelReplaceFn));
    },

    
    getDocumentHeight: function() {
        return Math.max(!Ext.isStrict ? document.body.scrollHeight : document.documentElement.scrollHeight, this.getViewportHeight());
    },

    
    getDocumentWidth: function() {
        return Math.max(!Ext.isStrict ? document.body.scrollWidth : document.documentElement.scrollWidth, this.getViewportWidth());
    },

    
    getViewportHeight: function(){
        return window.innerHeight;
    },

    
    getViewportWidth : function() {
        return window.innerWidth;
    },

    
    getViewSize : function() {
        return {
            width: window.innerWidth,
            height: window.innerHeight
        };
    },

    
    getOrientation : function() {
        if (Ext.supports.OrientationChange) {
            return (window.orientation == 0) ? 'portrait' : 'landscape';
        }
        
        return (window.innerHeight > window.innerWidth) ? 'portrait' : 'landscape';
    },

    
    fromPoint: function(x, y) {
        return Ext.get(document.elementFromPoint(x, y));
    }
});


Ext.applyIf(Ext.Element, {
    
    
    getComputedTransformOffset: function(el) {
        if (el instanceof Ext.Element)
            el = el.dom;
            
        var transform = window.getComputedStyle(el).webkitTransform,
            cssMatrix = transform != 'none' ? new WebKitCSSMatrix(transform) : new WebKitCSSMatrix();

        if (typeof cssMatrix.m41 != 'undefined') {
            return new Ext.util.Offset(cssMatrix.m41, cssMatrix.m42);
        } else if (typeof cssMatrix.d != 'undefined') {
            return new Ext.util.Offset(cssMatrix.d, cssMatrix.e);
        }

        return new Ext.util.Offset(0, 0);
    },

    
    cssTransform: function(el, transforms) {
        if (el instanceof Ext.Element)
            el = el.dom;

        var m = new WebKitCSSMatrix();

        Ext.iterate(transforms, function(n, v) {
            v = Ext.isArray(v) ? v : [v];
            m = m[n].apply(m, v);
        });

        
        
        if (Ext.supports.CSS3DTransform) {
            el.style.webkitTransform = 'matrix3d(' +
                                            m.m11+', '+m.m12+', '+m.m13+', '+m.m14+', '+
                                            m.m21+', '+m.m22+', '+m.m23+', '+m.m24+', '+
                                            m.m31+', '+m.m32+', '+m.m33+', '+m.m34+', '+
                                            m.m41+', '+m.m42+', '+m.m43+', '+m.m44+
                                       ')';
        } else {
            el.style.webkitTransform = m;
        }
    },

    
    cssTranslate: function(el, offset) {
        if (el instanceof Ext.Element)
            el = el.dom;

        if (Ext.supports.CSS3DTransform) {
            el.style.webkitTransform = 'translate3d('+offset.x+'px, '+offset.y+'px, 0px)';
        } else {
            el.style.webkitTransform = 'translate('+offset.x+'px, '+offset.y+'px)';
        }
    }

});


Ext.Element.addMethods({
    
    getY : function(el) {
        return this.getXY(el)[1];
    },

    
    getX : function(el) {
        return this.getXY(el)[0];
    },

    
    getXY : function() {
        
        var point = window.webkitConvertPointFromNodeToPage(this.dom, new WebKitPoint(0, 0));
        return [point.x, point.y];
    },

    
    getOffsetsTo : function(el){
        var o = this.getXY(),
            e = Ext.fly(el, '_internal').getXY();
        return [o[0]-e[0],o[1]-e[1]];
    },

    
    setXY : function(pos) {
        var me = this;

        if(arguments.length > 1) {
            pos = [pos, arguments[1]];
        }

        
        var pts = me.translatePoints(pos),
            style = me.dom.style;

        for (pos in pts) {
            if (!pts.hasOwnProperty(pos)) {
                continue;
            }
            if(!isNaN(pts[pos])) style[pos] = pts[pos] + "px";
        }
        return me;
    },

    
    setX : function(x){
        return this.setXY([x, this.getY()]);
    },

    
    setY : function(y) {
        return this.setXY([this.getX(), y]);
    },

    
    setLeft : function(left) {
        this.setStyle('left', Ext.Element.addUnits(left));
        return this;
    },

    
    setTop : function(top) {
        this.setStyle('top', Ext.Element.addUnits(top));
        return this;
    },

    
    setTopLeft: function(top, left) {
        var addUnits = Ext.Element.addUnits;

        this.setStyle('top', addUnits(top));
        this.setStyle('left', addUnits(left));

        return this;
    },

    
    setRight : function(right) {
        this.setStyle('right', Ext.Element.addUnits(right));
        return this;
    },

    
    setBottom : function(bottom) {
        this.setStyle('bottom', Ext.Element.addUnits(bottom));
        return this;
    },

    
    getLeft : function(local) {
        return parseInt(this.getStyle('left'), 10) || 0;
    },

    
    getRight : function(local) {
        return parseInt(this.getStyle('right'), 10) || 0;
    },

    
    getTop : function(local) {
        return parseInt(this.getStyle('top'), 10) || 0;
    },

    
    getBottom : function(local) {
        return parseInt(this.getStyle('bottom'), 10) || 0;
    },

    
    setBox : function(left, top, width, height) {
        var undefined;
        if (Ext.isObject(left)) {
            width = left.width;
            height = left.height;
            top = left.top;
            left = left.left;
        }
        
        if (left !== undefined) {
            this.setLeft(left);
        }
        if (top !== undefined) {
            this.setTop(top);
        }
        if (width !== undefined) {
            this.setWidth(width);
        }
        if (height !== undefined) {
            this.setHeight(height);
        }
    
        return this;
    },

    
    getBox : function(contentBox, local) {
        var me = this,
            dom = me.dom,
            width = dom.offsetWidth,
            height = dom.offsetHeight,
            xy, box, l, r, t, b;

        if (!local) {
            xy = me.getXY();
        }
        else if (contentBox) {
            xy = [0,0];
        }
        else {
            xy = [parseInt(me.getStyle("left"), 10) || 0, parseInt(me.getStyle("top"), 10) || 0];
        }

        if (!contentBox) {
            box = {
                x: xy[0],
                y: xy[1],
                0: xy[0],
                1: xy[1],
                width: width,
                height: height
            };
        }
        else {
            l = me.getBorderWidth.call(me, "l") + me.getPadding.call(me, "l");
            r = me.getBorderWidth.call(me, "r") + me.getPadding.call(me, "r");
            t = me.getBorderWidth.call(me, "t") + me.getPadding.call(me, "t");
            b = me.getBorderWidth.call(me, "b") + me.getPadding.call(me, "b");
            box = {
                x: xy[0] + l,
                y: xy[1] + t,
                0: xy[0] + l,
                1: xy[1] + t,
                width: width - (l + r),
                height: height - (t + b)
            };
        }

        box.left = box.x;
        box.top = box.y;
        box.right = box.x + box.width;
        box.bottom = box.y + box.height;

        return box;
    },

    
    getPageBox : function(getRegion) {
        var me = this,
            el = me.dom,
            w = el.offsetWidth,
            h = el.offsetHeight,
            xy = me.getXY(),
            t = xy[1],
            r = xy[0] + w,
            b = xy[1] + h,
            l = xy[0];
        
        if (!el) {
            return new Ext.util.Region();
        }
        
        if (getRegion) {
            return new Ext.util.Region(t, r, b, l);
        }
        else {
            return {
                left: l,
                top: t,
                width: w,
                height: h,
                right: r,
                bottom: b
            };
        }
    },

    
    translatePoints : function(x, y) {
        y = isNaN(x[1]) ? y : x[1];
        x = isNaN(x[0]) ? x : x[0];
        var me = this,
            relative = me.isStyle('position', 'relative'),
            o = me.getXY(),
            l = parseInt(me.getStyle('left'), 10),
            t = parseInt(me.getStyle('top'), 10);

        l = !isNaN(l) ? l : (relative ? 0 : me.dom.offsetLeft);
        t = !isNaN(t) ? t : (relative ? 0 : me.dom.offsetTop);

        return {left: (x - o[0] + l), top: (y - o[1] + t)};
    }
});

(function() {
    
    Ext.Element.classReCache = {};
    var El = Ext.Element,
        view = document.defaultView;

    El.addMethods({
        marginRightRe: /marginRight/i,
        trimRe: /^\s+|\s+$/g,
        spacesRe: /\s+/,

        
        addCls: function(className) {
            var me = this,
                i,
                len,
                v,
                cls = [];

            if (!Ext.isArray(className)) {
                if (className && !this.hasCls(className)) {
                    me.dom.className += " " + className;
                }
            }
            else {
                for (i = 0, len = className.length; i < len; i++) {
                    v = className[i];
                    if (v && !me.hasCls(v)) {
                        cls.push(v);
                    }
                }
                if (cls.length) {
                    me.dom.className += " " + cls.join(" ");
                }
            }
            return me;
        },
        
        addClass : function() {
            throw new Error("Component: addClass has been deprecated. Please use addCls.");
        },

        
        removeCls: function(className) {
            var me = this,
                i,
                idx,
                len,
                cls,
                elClasses;
            if (!Ext.isArray(className)) {
                className = [className];
            }
            if (me.dom && me.dom.className) {
                elClasses = me.dom.className.replace(this.trimRe, '').split(this.spacesRe);
                for (i = 0, len = className.length; i < len; i++) {
                    cls = className[i];
                    if (typeof cls == 'string') {
                        cls = cls.replace(this.trimRe, '');
                        idx = elClasses.indexOf(cls);
                        if (idx != -1) {
                            elClasses.splice(idx, 1);
                        }
                    }
                }
                me.dom.className = elClasses.join(" ");
            }
            return me;
        },
        
        removeClass : function() {
            throw new Error("Component: removeClass has been deprecated. Please use removeCls.");
        },

        
        mask: function(msg, msgCls, transparent) {
            var me = this,
                dom = me.dom,
                el = Ext.Element.data(dom, 'mask'),
                mask,
                size,
                cls = '';

            me.addCls('x-masked');
            if (me.getStyle("position") == "static") {
                me.addCls('x-masked-relative');
            }
            if (el) {
                el.remove();
            }
            if (Ext.isString(msgCls) && !Ext.isEmpty(msgCls)) {
                cls = ' ' + msgCls;
            }
            else {
                if (msgCls) {
                    cls = ' x-mask-gray';
                }
            }
                        
            mask = me.createChild({
                cls: 'x-mask' + ((transparent !== false) ? '' : ' x-mask-gray'),
                html: msg ? ('<div class="' + (msgCls || 'x-mask-message') + '">' + msg + '</div>') : ''
            });

            size = me.getSize();

            Ext.Element.data(dom, 'mask', mask);

            if (dom === document.body) {
                size.height = window.innerHeight;
                if (me.orientationHandler) {
                    Ext.EventManager.unOrientationChange(me.orientationHandler, me);
                }

                me.orientationHandler = function() {
                    size = me.getSize();
                    size.height = window.innerHeight;
                    mask.setSize(size);
                };

                Ext.EventManager.onOrientationChange(me.orientationHandler, me);
            }
            mask.setSize(size);
            if (Ext.is.iPad) {
                Ext.repaint();
            }
        },

        
        unmask: function() {
            var me = this,
                dom = me.dom,
                mask = Ext.Element.data(dom, 'mask');

            if (mask) {
                mask.remove();
                Ext.Element.data(dom, 'mask', undefined);
            }
            me.removeCls(['x-masked', 'x-masked-relative']);

            if (dom === document.body) {
                Ext.EventManager.unOrientationChange(me.orientationHandler, me);
                delete me.orientationHandler;
            }
        },

        
        radioCls: function(className) {
            var cn = this.dom.parentNode.childNodes,
                v;
            className = Ext.isArray(className) ? className: [className];
            for (var i = 0, len = cn.length; i < len; i++) {
                v = cn[i];
                if (v && v.nodeType == 1) {
                    Ext.fly(v, '_internal').removeCls(className);
                }
            };
            return this.addCls(className);
        },
        
        radioClass : function() {
            throw new Error("Component: radioClass has been deprecated. Please use radioCls.");
        },

        
        toggleCls: function(className) {
            return this.hasCls(className) ? this.removeCls(className) : this.addCls(className);
        },
        
        toggleClass : function() {
            throw new Error("Component: toggleClass has been deprecated. Please use toggleCls.");
        },

        
        hasCls: function(className) {
            return className && (' ' + this.dom.className + ' ').indexOf(' ' + className + ' ') != -1;
        },
        
        hasClass : function() {
            throw new Error("Element: hasClass has been deprecated. Please use hasCls.");
            return this.hasCls.apply(this, arguments);
        },

        
        replaceCls: function(oldClassName, newClassName) {
            return this.removeCls(oldClassName).addCls(newClassName);
        },
        
        replaceClass : function() {
            throw new Error("Component: replaceClass has been deprecated. Please use replaceCls.");
        },

        isStyle: function(style, val) {
            return this.getStyle(style) == val;
        },

        
        getStyle: function(prop) {
            var dom = this.dom,
                result,
                display,
                cs,
                platform = Ext.is,
                style = dom.style;

            prop = El.normalize(prop);
            cs = (view) ? view.getComputedStyle(dom, '') : dom.currentStyle;
            result = (cs) ? cs[prop] : null;

            
            if (result && !platform.correctRightMargin &&
                    this.marginRightRe.test(prop) &&
                    style.position != 'absolute' &&
                    result != '0px') {
                display = style.display;
                style.display = 'inline-block';
                result = view.getComputedStyle(dom, null)[prop];
                style.display = display;
            }

            result || (result = style[prop]);

            
            if (!platform.correctTransparentColor && result == 'rgba(0, 0, 0, 0)') {
                result = 'transparent';
            }

            return result;
        },

        
        setStyle: function(prop, value) {
            var tmp,
                style;

            if (typeof prop == 'string') {
                tmp = {};
                tmp[prop] = value;
                prop = tmp;
            }

            for (style in prop) {
                if (prop.hasOwnProperty(style)) {
                    this.dom.style[El.normalize(style)] = prop[style];
                }
            }

            return this;
        },

        
        applyStyles: function(styles) {
            if (styles) {
                var i,
                    len,
                    dom = this.dom;

                if (typeof styles == 'function') {
                    styles = styles.call();
                }
                if (typeof styles == 'string') {
                    styles = Ext.util.Format.trim(styles).split(/\s*(?::|;)\s*/);
                    for (i = 0, len = styles.length; i < len;) {
                        dom.style[El.normalize(styles[i++])] = styles[i++];
                    }
                }
                else if (typeof styles == 'object') {
                    this.setStyle(styles);
                }
            }
        },

        
        getHeight: function(contentHeight) {
            var dom = this.dom,
                height = contentHeight ? (dom.clientHeight - this.getPadding("tb")) : dom.offsetHeight;
            return height > 0 ? height: 0;
        },

        
        getWidth: function(contentWidth) {
            var dom = this.dom,
                width = contentWidth ? (dom.clientWidth - this.getPadding("lr")) : dom.offsetWidth;
            return width > 0 ? width: 0;
        },

        
        setWidth: function(width) {
            var me = this;
                me.dom.style.width = El.addUnits(width);
            return me;
        },

        
        setHeight: function(height) {
            var me = this;
                me.dom.style.height = El.addUnits(height);
            return me;
        },

        
        setSize: function(width, height) {
            var me = this,
                style = me.dom.style;

            if (Ext.isObject(width)) {
                
                height = width.height;
                width = width.width;
            }

            style.width = El.addUnits(width);
            style.height = El.addUnits(height);
            return me;
        },

        
        getBorderWidth: function(side) {
            return this.sumStyles(side, El.borders);
        },

        
        getPadding: function(side) {
            return this.sumStyles(side, El.paddings);
        },

        
        getMargin: function(side) {
            return this.sumStyles(side, El.margins);
        },

        
        getViewSize: function() {
            var doc = document,
                dom = this.dom;

            if (dom == doc || dom == doc.body) {
                return {
                    width: El.getViewportWidth(),
                    height: El.getViewportHeight()
                };
            }
            else {
                return {
                    width: dom.clientWidth,
                    height: dom.clientHeight
                };
            }
        },

        
        getSize: function(contentSize) {
            var dom = this.dom;
            return {
                width: Math.max(0, contentSize ? (dom.clientWidth - this.getPadding("lr")) : dom.offsetWidth),
                height: Math.max(0, contentSize ? (dom.clientHeight - this.getPadding("tb")) : dom.offsetHeight)
            };
        },

        
        repaint: function() {
            var dom = this.dom;
                this.addCls("x-repaint");
            dom.style.background = 'transparent none';
            setTimeout(function() {
                dom.style.background = null;
                Ext.get(dom).removeCls("x-repaint");
            },
            1);
            return this;
        },

        
        getOuterWidth: function() {
            return this.getWidth() + this.getMargin('lr');
        },

        
        getOuterHeight: function() {
            return this.getHeight() + this.getMargin('tb');
        },

        
        sumStyles: function(sides, styles) {
            var val = 0,
                m = sides.match(/\w/g),
                len = m.length,
                s,
                i;

            for (i = 0; i < len; i++) {
                s = m[i] && parseFloat(this.getStyle(styles[m[i]])) || 0;
                if (s) {
                    val += Math.abs(s);
                }
            }
            return val;
        }
    });
})();

Ext.Element.addMethods({
    
    findParent : function(simpleSelector, maxDepth, returnEl) {
        var p = this.dom,
            b = document.body,
            depth = 0,
            stopEl;

        maxDepth = maxDepth || 50;
        if (isNaN(maxDepth)) {
            stopEl = Ext.getDom(maxDepth);
            maxDepth = Number.MAX_VALUE;
        }
        while (p && p.nodeType == 1 && depth < maxDepth && p != b && p != stopEl) {
            if (Ext.DomQuery.is(p, simpleSelector)) {
                return returnEl ? Ext.get(p) : p;
            }
            depth++;
            p = p.parentNode;
        }
        return null;
    },
    
    
    findParentNode : function(simpleSelector, maxDepth, returnEl) {
        var p = Ext.fly(this.dom.parentNode, '_internal');
        return p ? p.findParent(simpleSelector, maxDepth, returnEl) : null;
    },

    
    up : function(simpleSelector, maxDepth) {
        return this.findParentNode(simpleSelector, maxDepth, true);
    },

    
    select : function(selector, composite) {
        return Ext.Element.select(selector, this.dom, composite);
    },

    
    query : function(selector) {
        return Ext.DomQuery.select(selector, this.dom);
    },

    
    down : function(selector, returnDom) {
        var n = Ext.DomQuery.selectNode(selector, this.dom);
        return returnDom ? n : Ext.get(n);
    },

    
    child : function(selector, returnDom) {
        var node,
            me = this,
            id;
        id = Ext.get(me).id;
        
        id = id.replace(/[\.:]/g, "\\$0");
        node = Ext.DomQuery.selectNode('#' + id + " > " + selector, me.dom);
        return returnDom ? node : Ext.get(node);
    },

     
    parent : function(selector, returnDom) {
        return this.matchNode('parentNode', 'parentNode', selector, returnDom);
