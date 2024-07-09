let imports = {};
imports['__wbindgen_placeholder__'] = module.exports;
let wasm;
const { TextDecoder, TextEncoder } = require(`util`);

const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function getObject(idx) { return heap[idx]; }

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachedUint8Memory0 = null;

function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

let cachedBigInt64Memory0 = null;

function getBigInt64Memory0() {
    if (cachedBigInt64Memory0 === null || cachedBigInt64Memory0.byteLength === 0) {
        cachedBigInt64Memory0 = new BigInt64Array(wasm.memory.buffer);
    }
    return cachedBigInt64Memory0;
}

let cachedInt32Memory0 = null;

function getInt32Memory0() {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

let WASM_VECTOR_LEN = 0;

let cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}
/**
*/
module.exports.init_panic_hook = function() {
    wasm.init_panic_hook();
};

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8Memory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

let cachedUint32Memory0 = null;

function getUint32Memory0() {
    if (cachedUint32Memory0 === null || cachedUint32Memory0.byteLength === 0) {
        cachedUint32Memory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachedUint32Memory0;
}

function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getUint32Memory0();
    const slice = mem.subarray(ptr / 4, ptr / 4 + len);
    const result = [];
    for (let i = 0; i < slice.length; i++) {
        result.push(takeObject(slice[i]));
    }
    return result;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}
/**
*/
module.exports.ShortintEncryptionKeyChoice = Object.freeze({ Big:0,"0":"Big",Small:1,"1":"Small", });
/**
*/
module.exports.ShortintParametersName = Object.freeze({ PARAM_MESSAGE_1_CARRY_0_KS_PBS:0,"0":"PARAM_MESSAGE_1_CARRY_0_KS_PBS",PARAM_MESSAGE_1_CARRY_1_KS_PBS:1,"1":"PARAM_MESSAGE_1_CARRY_1_KS_PBS",PARAM_MESSAGE_2_CARRY_0_KS_PBS:2,"2":"PARAM_MESSAGE_2_CARRY_0_KS_PBS",PARAM_MESSAGE_1_CARRY_2_KS_PBS:3,"3":"PARAM_MESSAGE_1_CARRY_2_KS_PBS",PARAM_MESSAGE_2_CARRY_1_KS_PBS:4,"4":"PARAM_MESSAGE_2_CARRY_1_KS_PBS",PARAM_MESSAGE_3_CARRY_0_KS_PBS:5,"5":"PARAM_MESSAGE_3_CARRY_0_KS_PBS",PARAM_MESSAGE_1_CARRY_3_KS_PBS:6,"6":"PARAM_MESSAGE_1_CARRY_3_KS_PBS",PARAM_MESSAGE_2_CARRY_2_KS_PBS:7,"7":"PARAM_MESSAGE_2_CARRY_2_KS_PBS",PARAM_MESSAGE_3_CARRY_1_KS_PBS:8,"8":"PARAM_MESSAGE_3_CARRY_1_KS_PBS",PARAM_MESSAGE_4_CARRY_0_KS_PBS:9,"9":"PARAM_MESSAGE_4_CARRY_0_KS_PBS",PARAM_MESSAGE_1_CARRY_4_KS_PBS:10,"10":"PARAM_MESSAGE_1_CARRY_4_KS_PBS",PARAM_MESSAGE_2_CARRY_3_KS_PBS:11,"11":"PARAM_MESSAGE_2_CARRY_3_KS_PBS",PARAM_MESSAGE_3_CARRY_2_KS_PBS:12,"12":"PARAM_MESSAGE_3_CARRY_2_KS_PBS",PARAM_MESSAGE_4_CARRY_1_KS_PBS:13,"13":"PARAM_MESSAGE_4_CARRY_1_KS_PBS",PARAM_MESSAGE_5_CARRY_0_KS_PBS:14,"14":"PARAM_MESSAGE_5_CARRY_0_KS_PBS",PARAM_MESSAGE_1_CARRY_5_KS_PBS:15,"15":"PARAM_MESSAGE_1_CARRY_5_KS_PBS",PARAM_MESSAGE_2_CARRY_4_KS_PBS:16,"16":"PARAM_MESSAGE_2_CARRY_4_KS_PBS",PARAM_MESSAGE_3_CARRY_3_KS_PBS:17,"17":"PARAM_MESSAGE_3_CARRY_3_KS_PBS",PARAM_MESSAGE_4_CARRY_2_KS_PBS:18,"18":"PARAM_MESSAGE_4_CARRY_2_KS_PBS",PARAM_MESSAGE_5_CARRY_1_KS_PBS:19,"19":"PARAM_MESSAGE_5_CARRY_1_KS_PBS",PARAM_MESSAGE_6_CARRY_0_KS_PBS:20,"20":"PARAM_MESSAGE_6_CARRY_0_KS_PBS",PARAM_MESSAGE_1_CARRY_6_KS_PBS:21,"21":"PARAM_MESSAGE_1_CARRY_6_KS_PBS",PARAM_MESSAGE_2_CARRY_5_KS_PBS:22,"22":"PARAM_MESSAGE_2_CARRY_5_KS_PBS",PARAM_MESSAGE_3_CARRY_4_KS_PBS:23,"23":"PARAM_MESSAGE_3_CARRY_4_KS_PBS",PARAM_MESSAGE_4_CARRY_3_KS_PBS:24,"24":"PARAM_MESSAGE_4_CARRY_3_KS_PBS",PARAM_MESSAGE_5_CARRY_2_KS_PBS:25,"25":"PARAM_MESSAGE_5_CARRY_2_KS_PBS",PARAM_MESSAGE_6_CARRY_1_KS_PBS:26,"26":"PARAM_MESSAGE_6_CARRY_1_KS_PBS",PARAM_MESSAGE_7_CARRY_0_KS_PBS:27,"27":"PARAM_MESSAGE_7_CARRY_0_KS_PBS",PARAM_MESSAGE_1_CARRY_7_KS_PBS:28,"28":"PARAM_MESSAGE_1_CARRY_7_KS_PBS",PARAM_MESSAGE_2_CARRY_6_KS_PBS:29,"29":"PARAM_MESSAGE_2_CARRY_6_KS_PBS",PARAM_MESSAGE_3_CARRY_5_KS_PBS:30,"30":"PARAM_MESSAGE_3_CARRY_5_KS_PBS",PARAM_MESSAGE_4_CARRY_4_KS_PBS:31,"31":"PARAM_MESSAGE_4_CARRY_4_KS_PBS",PARAM_MESSAGE_5_CARRY_3_KS_PBS:32,"32":"PARAM_MESSAGE_5_CARRY_3_KS_PBS",PARAM_MESSAGE_6_CARRY_2_KS_PBS:33,"33":"PARAM_MESSAGE_6_CARRY_2_KS_PBS",PARAM_MESSAGE_7_CARRY_1_KS_PBS:34,"34":"PARAM_MESSAGE_7_CARRY_1_KS_PBS",PARAM_MESSAGE_8_CARRY_0_KS_PBS:35,"35":"PARAM_MESSAGE_8_CARRY_0_KS_PBS",PARAM_MESSAGE_1_CARRY_1_PBS_KS:36,"36":"PARAM_MESSAGE_1_CARRY_1_PBS_KS",PARAM_MESSAGE_2_CARRY_2_PBS_KS:37,"37":"PARAM_MESSAGE_2_CARRY_2_PBS_KS",PARAM_MESSAGE_3_CARRY_3_PBS_KS:38,"38":"PARAM_MESSAGE_3_CARRY_3_PBS_KS",PARAM_MESSAGE_4_CARRY_4_PBS_KS:39,"39":"PARAM_MESSAGE_4_CARRY_4_PBS_KS",PARAM_MESSAGE_1_CARRY_2_COMPACT_PK_KS_PBS:40,"40":"PARAM_MESSAGE_1_CARRY_2_COMPACT_PK_KS_PBS",PARAM_MESSAGE_1_CARRY_3_COMPACT_PK_KS_PBS:41,"41":"PARAM_MESSAGE_1_CARRY_3_COMPACT_PK_KS_PBS",PARAM_MESSAGE_1_CARRY_4_COMPACT_PK_KS_PBS:42,"42":"PARAM_MESSAGE_1_CARRY_4_COMPACT_PK_KS_PBS",PARAM_MESSAGE_1_CARRY_5_COMPACT_PK_KS_PBS:43,"43":"PARAM_MESSAGE_1_CARRY_5_COMPACT_PK_KS_PBS",PARAM_MESSAGE_1_CARRY_6_COMPACT_PK_KS_PBS:44,"44":"PARAM_MESSAGE_1_CARRY_6_COMPACT_PK_KS_PBS",PARAM_MESSAGE_1_CARRY_7_COMPACT_PK_KS_PBS:45,"45":"PARAM_MESSAGE_1_CARRY_7_COMPACT_PK_KS_PBS",PARAM_MESSAGE_2_CARRY_1_COMPACT_PK_KS_PBS:46,"46":"PARAM_MESSAGE_2_CARRY_1_COMPACT_PK_KS_PBS",PARAM_MESSAGE_2_CARRY_2_COMPACT_PK_KS_PBS:47,"47":"PARAM_MESSAGE_2_CARRY_2_COMPACT_PK_KS_PBS",PARAM_MESSAGE_2_CARRY_3_COMPACT_PK_KS_PBS:48,"48":"PARAM_MESSAGE_2_CARRY_3_COMPACT_PK_KS_PBS",PARAM_MESSAGE_2_CARRY_4_COMPACT_PK_KS_PBS:49,"49":"PARAM_MESSAGE_2_CARRY_4_COMPACT_PK_KS_PBS",PARAM_MESSAGE_2_CARRY_5_COMPACT_PK_KS_PBS:50,"50":"PARAM_MESSAGE_2_CARRY_5_COMPACT_PK_KS_PBS",PARAM_MESSAGE_2_CARRY_6_COMPACT_PK_KS_PBS:51,"51":"PARAM_MESSAGE_2_CARRY_6_COMPACT_PK_KS_PBS",PARAM_MESSAGE_3_CARRY_1_COMPACT_PK_KS_PBS:52,"52":"PARAM_MESSAGE_3_CARRY_1_COMPACT_PK_KS_PBS",PARAM_MESSAGE_3_CARRY_2_COMPACT_PK_KS_PBS:53,"53":"PARAM_MESSAGE_3_CARRY_2_COMPACT_PK_KS_PBS",PARAM_MESSAGE_3_CARRY_3_COMPACT_PK_KS_PBS:54,"54":"PARAM_MESSAGE_3_CARRY_3_COMPACT_PK_KS_PBS",PARAM_MESSAGE_3_CARRY_4_COMPACT_PK_KS_PBS:55,"55":"PARAM_MESSAGE_3_CARRY_4_COMPACT_PK_KS_PBS",PARAM_MESSAGE_3_CARRY_5_COMPACT_PK_KS_PBS:56,"56":"PARAM_MESSAGE_3_CARRY_5_COMPACT_PK_KS_PBS",PARAM_MESSAGE_4_CARRY_1_COMPACT_PK_KS_PBS:57,"57":"PARAM_MESSAGE_4_CARRY_1_COMPACT_PK_KS_PBS",PARAM_MESSAGE_4_CARRY_2_COMPACT_PK_KS_PBS:58,"58":"PARAM_MESSAGE_4_CARRY_2_COMPACT_PK_KS_PBS",PARAM_MESSAGE_4_CARRY_3_COMPACT_PK_KS_PBS:59,"59":"PARAM_MESSAGE_4_CARRY_3_COMPACT_PK_KS_PBS",PARAM_MESSAGE_4_CARRY_4_COMPACT_PK_KS_PBS:60,"60":"PARAM_MESSAGE_4_CARRY_4_COMPACT_PK_KS_PBS",PARAM_MESSAGE_5_CARRY_1_COMPACT_PK_KS_PBS:61,"61":"PARAM_MESSAGE_5_CARRY_1_COMPACT_PK_KS_PBS",PARAM_MESSAGE_5_CARRY_2_COMPACT_PK_KS_PBS:62,"62":"PARAM_MESSAGE_5_CARRY_2_COMPACT_PK_KS_PBS",PARAM_MESSAGE_5_CARRY_3_COMPACT_PK_KS_PBS:63,"63":"PARAM_MESSAGE_5_CARRY_3_COMPACT_PK_KS_PBS",PARAM_MESSAGE_6_CARRY_1_COMPACT_PK_KS_PBS:64,"64":"PARAM_MESSAGE_6_CARRY_1_COMPACT_PK_KS_PBS",PARAM_MESSAGE_6_CARRY_2_COMPACT_PK_KS_PBS:65,"65":"PARAM_MESSAGE_6_CARRY_2_COMPACT_PK_KS_PBS",PARAM_MESSAGE_7_CARRY_1_COMPACT_PK_KS_PBS:66,"66":"PARAM_MESSAGE_7_CARRY_1_COMPACT_PK_KS_PBS",PARAM_MESSAGE_1_CARRY_1_COMPACT_PK_PBS_KS:67,"67":"PARAM_MESSAGE_1_CARRY_1_COMPACT_PK_PBS_KS",PARAM_MESSAGE_2_CARRY_2_COMPACT_PK_PBS_KS:68,"68":"PARAM_MESSAGE_2_CARRY_2_COMPACT_PK_PBS_KS",PARAM_MESSAGE_3_CARRY_3_COMPACT_PK_PBS_KS:69,"69":"PARAM_MESSAGE_3_CARRY_3_COMPACT_PK_PBS_KS",PARAM_MESSAGE_4_CARRY_4_COMPACT_PK_PBS_KS:70,"70":"PARAM_MESSAGE_4_CARRY_4_COMPACT_PK_PBS_KS",PARAM_MESSAGE_1_CARRY_2_COMPACT_PK_KS_PBS_TUNIFORM_2M40:71,"71":"PARAM_MESSAGE_1_CARRY_2_COMPACT_PK_KS_PBS_TUNIFORM_2M40",PARAM_MESSAGE_1_CARRY_3_COMPACT_PK_KS_PBS_TUNIFORM_2M40:72,"72":"PARAM_MESSAGE_1_CARRY_3_COMPACT_PK_KS_PBS_TUNIFORM_2M40",PARAM_MESSAGE_1_CARRY_4_COMPACT_PK_KS_PBS_TUNIFORM_2M40:73,"73":"PARAM_MESSAGE_1_CARRY_4_COMPACT_PK_KS_PBS_TUNIFORM_2M40",PARAM_MESSAGE_1_CARRY_5_COMPACT_PK_KS_PBS_TUNIFORM_2M40:74,"74":"PARAM_MESSAGE_1_CARRY_5_COMPACT_PK_KS_PBS_TUNIFORM_2M40",PARAM_MESSAGE_1_CARRY_6_COMPACT_PK_KS_PBS_TUNIFORM_2M40:75,"75":"PARAM_MESSAGE_1_CARRY_6_COMPACT_PK_KS_PBS_TUNIFORM_2M40",PARAM_MESSAGE_1_CARRY_7_COMPACT_PK_KS_PBS_TUNIFORM_2M40:76,"76":"PARAM_MESSAGE_1_CARRY_7_COMPACT_PK_KS_PBS_TUNIFORM_2M40",PARAM_MESSAGE_2_CARRY_1_COMPACT_PK_KS_PBS_TUNIFORM_2M40:77,"77":"PARAM_MESSAGE_2_CARRY_1_COMPACT_PK_KS_PBS_TUNIFORM_2M40",PARAM_MESSAGE_2_CARRY_2_COMPACT_PK_KS_PBS_TUNIFORM_2M40:78,"78":"PARAM_MESSAGE_2_CARRY_2_COMPACT_PK_KS_PBS_TUNIFORM_2M40",PARAM_MESSAGE_2_CARRY_3_COMPACT_PK_KS_PBS_TUNIFORM_2M40:79,"79":"PARAM_MESSAGE_2_CARRY_3_COMPACT_PK_KS_PBS_TUNIFORM_2M40",PARAM_MESSAGE_2_CARRY_4_COMPACT_PK_KS_PBS_TUNIFORM_2M40:80,"80":"PARAM_MESSAGE_2_CARRY_4_COMPACT_PK_KS_PBS_TUNIFORM_2M40",PARAM_MESSAGE_2_CARRY_5_COMPACT_PK_KS_PBS_TUNIFORM_2M40:81,"81":"PARAM_MESSAGE_2_CARRY_5_COMPACT_PK_KS_PBS_TUNIFORM_2M40",PARAM_MESSAGE_2_CARRY_6_COMPACT_PK_KS_PBS_TUNIFORM_2M40:82,"82":"PARAM_MESSAGE_2_CARRY_6_COMPACT_PK_KS_PBS_TUNIFORM_2M40",PARAM_MESSAGE_3_CARRY_1_COMPACT_PK_KS_PBS_TUNIFORM_2M40:83,"83":"PARAM_MESSAGE_3_CARRY_1_COMPACT_PK_KS_PBS_TUNIFORM_2M40",PARAM_MESSAGE_3_CARRY_2_COMPACT_PK_KS_PBS_TUNIFORM_2M40:84,"84":"PARAM_MESSAGE_3_CARRY_2_COMPACT_PK_KS_PBS_TUNIFORM_2M40",PARAM_MESSAGE_3_CARRY_3_COMPACT_PK_KS_PBS_TUNIFORM_2M40:85,"85":"PARAM_MESSAGE_3_CARRY_3_COMPACT_PK_KS_PBS_TUNIFORM_2M40",PARAM_MESSAGE_3_CARRY_4_COMPACT_PK_KS_PBS_TUNIFORM_2M40:86,"86":"PARAM_MESSAGE_3_CARRY_4_COMPACT_PK_KS_PBS_TUNIFORM_2M40",PARAM_MESSAGE_3_CARRY_5_COMPACT_PK_KS_PBS_TUNIFORM_2M40:87,"87":"PARAM_MESSAGE_3_CARRY_5_COMPACT_PK_KS_PBS_TUNIFORM_2M40",PARAM_MESSAGE_4_CARRY_1_COMPACT_PK_KS_PBS_TUNIFORM_2M40:88,"88":"PARAM_MESSAGE_4_CARRY_1_COMPACT_PK_KS_PBS_TUNIFORM_2M40",PARAM_MESSAGE_4_CARRY_2_COMPACT_PK_KS_PBS_TUNIFORM_2M40:89,"89":"PARAM_MESSAGE_4_CARRY_2_COMPACT_PK_KS_PBS_TUNIFORM_2M40",PARAM_MESSAGE_4_CARRY_3_COMPACT_PK_KS_PBS_TUNIFORM_2M40:90,"90":"PARAM_MESSAGE_4_CARRY_3_COMPACT_PK_KS_PBS_TUNIFORM_2M40",PARAM_MESSAGE_4_CARRY_4_COMPACT_PK_KS_PBS_TUNIFORM_2M40:91,"91":"PARAM_MESSAGE_4_CARRY_4_COMPACT_PK_KS_PBS_TUNIFORM_2M40",PARAM_MESSAGE_5_CARRY_1_COMPACT_PK_KS_PBS_TUNIFORM_2M40:92,"92":"PARAM_MESSAGE_5_CARRY_1_COMPACT_PK_KS_PBS_TUNIFORM_2M40",PARAM_MESSAGE_5_CARRY_2_COMPACT_PK_KS_PBS_TUNIFORM_2M40:93,"93":"PARAM_MESSAGE_5_CARRY_2_COMPACT_PK_KS_PBS_TUNIFORM_2M40",PARAM_MESSAGE_5_CARRY_3_COMPACT_PK_KS_PBS_TUNIFORM_2M40:94,"94":"PARAM_MESSAGE_5_CARRY_3_COMPACT_PK_KS_PBS_TUNIFORM_2M40",PARAM_MESSAGE_6_CARRY_1_COMPACT_PK_KS_PBS_TUNIFORM_2M40:95,"95":"PARAM_MESSAGE_6_CARRY_1_COMPACT_PK_KS_PBS_TUNIFORM_2M40",PARAM_MESSAGE_6_CARRY_2_COMPACT_PK_KS_PBS_TUNIFORM_2M40:96,"96":"PARAM_MESSAGE_6_CARRY_2_COMPACT_PK_KS_PBS_TUNIFORM_2M40",PARAM_MESSAGE_7_CARRY_1_COMPACT_PK_KS_PBS_TUNIFORM_2M40:97,"97":"PARAM_MESSAGE_7_CARRY_1_COMPACT_PK_KS_PBS_TUNIFORM_2M40",PARAM_MESSAGE_1_CARRY_0:98,"98":"PARAM_MESSAGE_1_CARRY_0",PARAM_MESSAGE_1_CARRY_1:99,"99":"PARAM_MESSAGE_1_CARRY_1",PARAM_MESSAGE_2_CARRY_0:100,"100":"PARAM_MESSAGE_2_CARRY_0",PARAM_MESSAGE_1_CARRY_2:101,"101":"PARAM_MESSAGE_1_CARRY_2",PARAM_MESSAGE_2_CARRY_1:102,"102":"PARAM_MESSAGE_2_CARRY_1",PARAM_MESSAGE_3_CARRY_0:103,"103":"PARAM_MESSAGE_3_CARRY_0",PARAM_MESSAGE_1_CARRY_3:104,"104":"PARAM_MESSAGE_1_CARRY_3",PARAM_MESSAGE_2_CARRY_2:105,"105":"PARAM_MESSAGE_2_CARRY_2",PARAM_MESSAGE_3_CARRY_1:106,"106":"PARAM_MESSAGE_3_CARRY_1",PARAM_MESSAGE_4_CARRY_0:107,"107":"PARAM_MESSAGE_4_CARRY_0",PARAM_MESSAGE_1_CARRY_4:108,"108":"PARAM_MESSAGE_1_CARRY_4",PARAM_MESSAGE_2_CARRY_3:109,"109":"PARAM_MESSAGE_2_CARRY_3",PARAM_MESSAGE_3_CARRY_2:110,"110":"PARAM_MESSAGE_3_CARRY_2",PARAM_MESSAGE_4_CARRY_1:111,"111":"PARAM_MESSAGE_4_CARRY_1",PARAM_MESSAGE_5_CARRY_0:112,"112":"PARAM_MESSAGE_5_CARRY_0",PARAM_MESSAGE_1_CARRY_5:113,"113":"PARAM_MESSAGE_1_CARRY_5",PARAM_MESSAGE_2_CARRY_4:114,"114":"PARAM_MESSAGE_2_CARRY_4",PARAM_MESSAGE_3_CARRY_3:115,"115":"PARAM_MESSAGE_3_CARRY_3",PARAM_MESSAGE_4_CARRY_2:116,"116":"PARAM_MESSAGE_4_CARRY_2",PARAM_MESSAGE_5_CARRY_1:117,"117":"PARAM_MESSAGE_5_CARRY_1",PARAM_MESSAGE_6_CARRY_0:118,"118":"PARAM_MESSAGE_6_CARRY_0",PARAM_MESSAGE_1_CARRY_6:119,"119":"PARAM_MESSAGE_1_CARRY_6",PARAM_MESSAGE_2_CARRY_5:120,"120":"PARAM_MESSAGE_2_CARRY_5",PARAM_MESSAGE_3_CARRY_4:121,"121":"PARAM_MESSAGE_3_CARRY_4",PARAM_MESSAGE_4_CARRY_3:122,"122":"PARAM_MESSAGE_4_CARRY_3",PARAM_MESSAGE_5_CARRY_2:123,"123":"PARAM_MESSAGE_5_CARRY_2",PARAM_MESSAGE_6_CARRY_1:124,"124":"PARAM_MESSAGE_6_CARRY_1",PARAM_MESSAGE_7_CARRY_0:125,"125":"PARAM_MESSAGE_7_CARRY_0",PARAM_MESSAGE_1_CARRY_7:126,"126":"PARAM_MESSAGE_1_CARRY_7",PARAM_MESSAGE_2_CARRY_6:127,"127":"PARAM_MESSAGE_2_CARRY_6",PARAM_MESSAGE_3_CARRY_5:128,"128":"PARAM_MESSAGE_3_CARRY_5",PARAM_MESSAGE_4_CARRY_4:129,"129":"PARAM_MESSAGE_4_CARRY_4",PARAM_MESSAGE_5_CARRY_3:130,"130":"PARAM_MESSAGE_5_CARRY_3",PARAM_MESSAGE_6_CARRY_2:131,"131":"PARAM_MESSAGE_6_CARRY_2",PARAM_MESSAGE_7_CARRY_1:132,"132":"PARAM_MESSAGE_7_CARRY_1",PARAM_MESSAGE_8_CARRY_0:133,"133":"PARAM_MESSAGE_8_CARRY_0",PARAM_SMALL_MESSAGE_1_CARRY_1:134,"134":"PARAM_SMALL_MESSAGE_1_CARRY_1",PARAM_SMALL_MESSAGE_2_CARRY_2:135,"135":"PARAM_SMALL_MESSAGE_2_CARRY_2",PARAM_SMALL_MESSAGE_3_CARRY_3:136,"136":"PARAM_SMALL_MESSAGE_3_CARRY_3",PARAM_SMALL_MESSAGE_4_CARRY_4:137,"137":"PARAM_SMALL_MESSAGE_4_CARRY_4", });
/**
*/
module.exports.BooleanParameterSet = Object.freeze({ Default:0,"0":"Default",TfheLib:1,"1":"TfheLib",DefaultKsPbs:2,"2":"DefaultKsPbs",TfheLibKsPbs:3,"3":"TfheLibKsPbs", });
/**
*/
module.exports.BooleanEncryptionKeyChoice = Object.freeze({ Big:0,"0":"Big",Small:1,"1":"Small", });
/**
*/
class Boolean {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_boolean_free(ptr);
    }
    /**
    * @param {number} parameter_choice
    * @returns {BooleanParameters}
    */
    static get_parameters(parameter_choice) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.boolean_get_parameters(retptr, parameter_choice);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return BooleanParameters.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {number} std_dev
    * @returns {BooleanNoiseDistribution}
    */
    static new_gaussian_from_std_dev(std_dev) {
        const ret = wasm.boolean_new_gaussian_from_std_dev(std_dev);
        return BooleanNoiseDistribution.__wrap(ret);
    }
    /**
    * @param {number} bound_log2
    * @returns {BooleanNoiseDistribution}
    */
    static try_new_t_uniform(bound_log2) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.boolean_try_new_t_uniform(retptr, bound_log2);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return BooleanNoiseDistribution.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {number} lwe_dimension
    * @param {number} glwe_dimension
    * @param {number} polynomial_size
    * @param {BooleanNoiseDistribution} lwe_noise_distribution
    * @param {BooleanNoiseDistribution} glwe_noise_distribution
    * @param {number} pbs_base_log
    * @param {number} pbs_level
    * @param {number} ks_base_log
    * @param {number} ks_level
    * @param {number} encryption_key_choice
    * @returns {BooleanParameters}
    */
    static new_parameters(lwe_dimension, glwe_dimension, polynomial_size, lwe_noise_distribution, glwe_noise_distribution, pbs_base_log, pbs_level, ks_base_log, ks_level, encryption_key_choice) {
        _assertClass(lwe_noise_distribution, BooleanNoiseDistribution);
        _assertClass(glwe_noise_distribution, BooleanNoiseDistribution);
        const ret = wasm.boolean_new_parameters(lwe_dimension, glwe_dimension, polynomial_size, lwe_noise_distribution.__wbg_ptr, glwe_noise_distribution.__wbg_ptr, pbs_base_log, pbs_level, ks_base_log, ks_level, encryption_key_choice);
        return BooleanParameters.__wrap(ret);
    }
    /**
    * @param {bigint} seed_high_bytes
    * @param {bigint} seed_low_bytes
    * @param {BooleanParameters} parameters
    * @returns {BooleanClientKey}
    */
    static new_client_key_from_seed_and_parameters(seed_high_bytes, seed_low_bytes, parameters) {
        _assertClass(parameters, BooleanParameters);
        const ret = wasm.boolean_new_client_key_from_seed_and_parameters(seed_high_bytes, seed_low_bytes, parameters.__wbg_ptr);
        return BooleanClientKey.__wrap(ret);
    }
    /**
    * @param {BooleanParameters} parameters
    * @returns {BooleanClientKey}
    */
    static new_client_key(parameters) {
        _assertClass(parameters, BooleanParameters);
        const ret = wasm.boolean_new_client_key(parameters.__wbg_ptr);
        return BooleanClientKey.__wrap(ret);
    }
    /**
    * @param {BooleanClientKey} client_key
    * @returns {BooleanPublicKey}
    */
    static new_public_key(client_key) {
        _assertClass(client_key, BooleanClientKey);
        const ret = wasm.boolean_new_public_key(client_key.__wbg_ptr);
        return BooleanPublicKey.__wrap(ret);
    }
    /**
    * @param {BooleanClientKey} client_key
    * @returns {BooleanCompressedServerKey}
    */
    static new_compressed_server_key(client_key) {
        _assertClass(client_key, BooleanClientKey);
        const ret = wasm.boolean_new_compressed_server_key(client_key.__wbg_ptr);
        return BooleanCompressedServerKey.__wrap(ret);
    }
    /**
    * @param {BooleanClientKey} client_key
    * @param {boolean} message
    * @returns {BooleanCiphertext}
    */
    static encrypt(client_key, message) {
        _assertClass(client_key, BooleanClientKey);
        const ret = wasm.boolean_encrypt(client_key.__wbg_ptr, message);
        return BooleanCiphertext.__wrap(ret);
    }
    /**
    * @param {BooleanClientKey} client_key
    * @param {boolean} message
    * @returns {BooleanCompressedCiphertext}
    */
    static encrypt_compressed(client_key, message) {
        _assertClass(client_key, BooleanClientKey);
        const ret = wasm.boolean_encrypt_compressed(client_key.__wbg_ptr, message);
        return BooleanCompressedCiphertext.__wrap(ret);
    }
    /**
    * @param {BooleanCompressedCiphertext} compressed_ciphertext
    * @returns {BooleanCiphertext}
    */
    static decompress_ciphertext(compressed_ciphertext) {
        _assertClass(compressed_ciphertext, BooleanCompressedCiphertext);
        const ret = wasm.boolean_decompress_ciphertext(compressed_ciphertext.__wbg_ptr);
        return BooleanCiphertext.__wrap(ret);
    }
    /**
    * @param {BooleanPublicKey} public_key
    * @param {boolean} message
    * @returns {BooleanCiphertext}
    */
    static encrypt_with_public_key(public_key, message) {
        _assertClass(public_key, BooleanPublicKey);
        const ret = wasm.boolean_encrypt_with_public_key(public_key.__wbg_ptr, message);
        return BooleanCiphertext.__wrap(ret);
    }
    /**
    * @param {boolean} message
    * @returns {BooleanCiphertext}
    */
    static trivial_encrypt(message) {
        const ret = wasm.boolean_trivial_encrypt(message);
        return BooleanCiphertext.__wrap(ret);
    }
    /**
    * @param {BooleanClientKey} client_key
    * @param {BooleanCiphertext} ct
    * @returns {boolean}
    */
    static decrypt(client_key, ct) {
        _assertClass(client_key, BooleanClientKey);
        _assertClass(ct, BooleanCiphertext);
        const ret = wasm.boolean_decrypt(client_key.__wbg_ptr, ct.__wbg_ptr);
        return ret !== 0;
    }
    /**
    * @param {BooleanCiphertext} ciphertext
    * @returns {Uint8Array}
    */
    static serialize_ciphertext(ciphertext) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(ciphertext, BooleanCiphertext);
            wasm.boolean_serialize_ciphertext(retptr, ciphertext.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} buffer
    * @returns {BooleanCiphertext}
    */
    static deserialize_ciphertext(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.boolean_deserialize_ciphertext(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return BooleanCiphertext.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {BooleanCompressedCiphertext} ciphertext
    * @returns {Uint8Array}
    */
    static serialize_compressed_ciphertext(ciphertext) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(ciphertext, BooleanCompressedCiphertext);
            wasm.boolean_serialize_compressed_ciphertext(retptr, ciphertext.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} buffer
    * @returns {BooleanCompressedCiphertext}
    */
    static deserialize_compressed_ciphertext(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.boolean_deserialize_compressed_ciphertext(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return BooleanCompressedCiphertext.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {BooleanClientKey} client_key
    * @returns {Uint8Array}
    */
    static serialize_client_key(client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, BooleanClientKey);
            wasm.boolean_serialize_client_key(retptr, client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} buffer
    * @returns {BooleanClientKey}
    */
    static deserialize_client_key(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.boolean_deserialize_client_key(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return BooleanClientKey.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {BooleanPublicKey} public_key
    * @returns {Uint8Array}
    */
    static serialize_public_key(public_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(public_key, BooleanPublicKey);
            wasm.boolean_serialize_public_key(retptr, public_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} buffer
    * @returns {BooleanPublicKey}
    */
    static deserialize_public_key(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.boolean_deserialize_public_key(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return BooleanPublicKey.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {BooleanCompressedServerKey} server_key
    * @returns {Uint8Array}
    */
    static serialize_compressed_server_key(server_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(server_key, BooleanCompressedServerKey);
            wasm.boolean_serialize_compressed_server_key(retptr, server_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} buffer
    * @returns {BooleanCompressedServerKey}
    */
    static deserialize_compressed_server_key(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.boolean_deserialize_compressed_server_key(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return BooleanCompressedServerKey.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.Boolean = Boolean;
/**
*/
class BooleanCiphertext {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(BooleanCiphertext.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_booleanciphertext_free(ptr);
    }
}
module.exports.BooleanCiphertext = BooleanCiphertext;
/**
*/
class BooleanClientKey {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(BooleanClientKey.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_booleanclientkey_free(ptr);
    }
}
module.exports.BooleanClientKey = BooleanClientKey;
/**
*/
class BooleanCompressedCiphertext {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(BooleanCompressedCiphertext.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_booleancompressedciphertext_free(ptr);
    }
}
module.exports.BooleanCompressedCiphertext = BooleanCompressedCiphertext;
/**
*/
class BooleanCompressedServerKey {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(BooleanCompressedServerKey.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_booleancompressedserverkey_free(ptr);
    }
}
module.exports.BooleanCompressedServerKey = BooleanCompressedServerKey;
/**
*/
class BooleanNoiseDistribution {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(BooleanNoiseDistribution.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_booleannoisedistribution_free(ptr);
    }
}
module.exports.BooleanNoiseDistribution = BooleanNoiseDistribution;
/**
*/
class BooleanParameters {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(BooleanParameters.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_booleanparameters_free(ptr);
    }
}
module.exports.BooleanParameters = BooleanParameters;
/**
*/
class BooleanPublicKey {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(BooleanPublicKey.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_booleanpublickey_free(ptr);
    }
}
module.exports.BooleanPublicKey = BooleanPublicKey;
/**
*/
class CompactFheBool {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CompactFheBool.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_compactfhebool_free(ptr);
    }
    /**
    * @param {boolean} value
    * @param {TfheCompactPublicKey} client_key
    * @returns {CompactFheBool}
    */
    static encrypt_with_compact_public_key(value, client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheCompactPublicKey);
            wasm.compactfhebool_encrypt_with_compact_public_key(retptr, value, client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheBool.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {FheBool}
    */
    expand() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfhebool_expand(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheBool.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfhebool_serialize(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} buffer
    * @returns {CompactFheBool}
    */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compactfhebool_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheBool.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {bigint} serialized_size_limit
    * @returns {Uint8Array}
    */
    safe_serialize(serialized_size_limit) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfhebool_safe_serialize(retptr, this.__wbg_ptr, serialized_size_limit);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} buffer
    * @param {bigint} serialized_size_limit
    * @returns {CompactFheBool}
    */
    static safe_deserialize(buffer, serialized_size_limit) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compactfhebool_safe_deserialize(retptr, ptr0, len0, serialized_size_limit);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheBool.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.CompactFheBool = CompactFheBool;
/**
*/
class CompactFheBoolList {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CompactFheBoolList.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_compactfheboollist_free(ptr);
    }
    /**
    * @returns {any[]}
    */
    expand() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheboollist_expand(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 4);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheboollist_serialize(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} buffer
    * @returns {CompactFheBoolList}
    */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compactfheboollist_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheBoolList.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.CompactFheBoolList = CompactFheBoolList;
/**
*/
class CompactFheUint128 {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CompactFheUint128.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_compactfheuint128_free(ptr);
    }
    /**
    * @param {any} value
    * @param {TfheCompactPublicKey} client_key
    * @returns {CompactFheUint128}
    */
    static encrypt_with_compact_public_key(value, client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheCompactPublicKey);
            wasm.compactfheuint128_encrypt_with_compact_public_key(retptr, addHeapObject(value), client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheUint128.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {FheUint128}
    */
    expand() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheuint128_expand(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint128.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheuint128_serialize(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} buffer
    * @returns {CompactFheUint128}
    */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compactfheuint128_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheUint128.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {bigint} serialized_size_limit
    * @returns {Uint8Array}
    */
    safe_serialize(serialized_size_limit) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheuint128_safe_serialize(retptr, this.__wbg_ptr, serialized_size_limit);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} buffer
    * @param {bigint} serialized_size_limit
    * @returns {CompactFheUint128}
    */
    static safe_deserialize(buffer, serialized_size_limit) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compactfheuint128_safe_deserialize(retptr, ptr0, len0, serialized_size_limit);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheUint128.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.CompactFheUint128 = CompactFheUint128;
/**
*/
class CompactFheUint16 {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CompactFheUint16.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_compactfheuint16_free(ptr);
    }
    /**
    * @param {number} value
    * @param {TfheCompactPublicKey} client_key
    * @returns {CompactFheUint16}
    */
    static encrypt_with_compact_public_key(value, client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheCompactPublicKey);
            wasm.compactfheuint16_encrypt_with_compact_public_key(retptr, value, client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheUint16.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {FheUint16}
    */
    expand() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheuint16_expand(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint16.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheuint16_serialize(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} buffer
    * @returns {CompactFheUint16}
    */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compactfheuint16_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheUint16.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {bigint} serialized_size_limit
    * @returns {Uint8Array}
    */
    safe_serialize(serialized_size_limit) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheuint16_safe_serialize(retptr, this.__wbg_ptr, serialized_size_limit);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} buffer
    * @param {bigint} serialized_size_limit
    * @returns {CompactFheUint16}
    */
    static safe_deserialize(buffer, serialized_size_limit) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compactfheuint16_safe_deserialize(retptr, ptr0, len0, serialized_size_limit);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheUint16.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.CompactFheUint16 = CompactFheUint16;
/**
*/
class CompactFheUint160 {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CompactFheUint160.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_compactfheuint160_free(ptr);
    }
    /**
    * @param {any} value
    * @param {TfheCompactPublicKey} client_key
    * @returns {CompactFheUint160}
    */
    static encrypt_with_compact_public_key(value, client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheCompactPublicKey);
            wasm.compactfheuint160_encrypt_with_compact_public_key(retptr, addHeapObject(value), client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheUint160.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {FheUint160}
    */
    expand() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheuint160_expand(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint160.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheuint160_serialize(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} buffer
    * @returns {CompactFheUint160}
    */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compactfheuint160_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheUint160.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {bigint} serialized_size_limit
    * @returns {Uint8Array}
    */
    safe_serialize(serialized_size_limit) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheuint160_safe_serialize(retptr, this.__wbg_ptr, serialized_size_limit);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} buffer
    * @param {bigint} serialized_size_limit
    * @returns {CompactFheUint160}
    */
    static safe_deserialize(buffer, serialized_size_limit) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compactfheuint160_safe_deserialize(retptr, ptr0, len0, serialized_size_limit);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheUint160.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.CompactFheUint160 = CompactFheUint160;
/**
*/
class CompactFheUint16List {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CompactFheUint16List.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_compactfheuint16list_free(ptr);
    }
    /**
    * @returns {any[]}
    */
    expand() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheuint16list_expand(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 4);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheuint16list_serialize(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} buffer
    * @returns {CompactFheUint16List}
    */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compactfheuint16list_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheUint16List.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.CompactFheUint16List = CompactFheUint16List;
/**
*/
class CompactFheUint256 {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CompactFheUint256.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_compactfheuint256_free(ptr);
    }
    /**
    * @param {any} value
    * @param {TfheCompactPublicKey} client_key
    * @returns {CompactFheUint256}
    */
    static encrypt_with_compact_public_key(value, client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheCompactPublicKey);
            wasm.compactfheuint256_encrypt_with_compact_public_key(retptr, addHeapObject(value), client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheUint256.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {FheUint256}
    */
    expand() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheuint256_expand(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint256.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheuint256_serialize(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} buffer
    * @returns {CompactFheUint256}
    */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compactfheuint256_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheUint256.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {bigint} serialized_size_limit
    * @returns {Uint8Array}
    */
    safe_serialize(serialized_size_limit) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheuint256_safe_serialize(retptr, this.__wbg_ptr, serialized_size_limit);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} buffer
    * @param {bigint} serialized_size_limit
    * @returns {CompactFheUint256}
    */
    static safe_deserialize(buffer, serialized_size_limit) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compactfheuint256_safe_deserialize(retptr, ptr0, len0, serialized_size_limit);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheUint256.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.CompactFheUint256 = CompactFheUint256;
/**
*/
class CompactFheUint32 {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CompactFheUint32.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_compactfheuint32_free(ptr);
    }
    /**
    * @param {number} value
    * @param {TfheCompactPublicKey} client_key
    * @returns {CompactFheUint32}
    */
    static encrypt_with_compact_public_key(value, client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheCompactPublicKey);
            wasm.compactfheuint32_encrypt_with_compact_public_key(retptr, value, client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheUint32.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {FheUint32}
    */
    expand() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheuint32_expand(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint32.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheuint32_serialize(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} buffer
    * @returns {CompactFheUint32}
    */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compactfheuint32_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheUint32.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {bigint} serialized_size_limit
    * @returns {Uint8Array}
    */
    safe_serialize(serialized_size_limit) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheuint32_safe_serialize(retptr, this.__wbg_ptr, serialized_size_limit);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} buffer
    * @param {bigint} serialized_size_limit
    * @returns {CompactFheUint32}
    */
    static safe_deserialize(buffer, serialized_size_limit) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compactfheuint32_safe_deserialize(retptr, ptr0, len0, serialized_size_limit);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheUint32.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.CompactFheUint32 = CompactFheUint32;
/**
*/
class CompactFheUint32List {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CompactFheUint32List.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_compactfheuint32list_free(ptr);
    }
    /**
    * @returns {any[]}
    */
    expand() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheuint32list_expand(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 4);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheuint32list_serialize(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} buffer
    * @returns {CompactFheUint32List}
    */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compactfheuint32list_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheUint32List.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.CompactFheUint32List = CompactFheUint32List;
/**
*/
class CompactFheUint64 {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CompactFheUint64.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_compactfheuint64_free(ptr);
    }
    /**
    * @param {bigint} value
    * @param {TfheCompactPublicKey} client_key
    * @returns {CompactFheUint64}
    */
    static encrypt_with_compact_public_key(value, client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheCompactPublicKey);
            wasm.compactfheuint64_encrypt_with_compact_public_key(retptr, value, client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheUint64.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {FheUint64}
    */
    expand() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheuint64_expand(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint64.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheuint64_serialize(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} buffer
    * @returns {CompactFheUint64}
    */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compactfheuint64_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheUint64.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {bigint} serialized_size_limit
    * @returns {Uint8Array}
    */
    safe_serialize(serialized_size_limit) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheuint64_safe_serialize(retptr, this.__wbg_ptr, serialized_size_limit);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} buffer
    * @param {bigint} serialized_size_limit
    * @returns {CompactFheUint64}
    */
    static safe_deserialize(buffer, serialized_size_limit) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compactfheuint64_safe_deserialize(retptr, ptr0, len0, serialized_size_limit);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheUint64.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.CompactFheUint64 = CompactFheUint64;
/**
*/
class CompactFheUint64List {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CompactFheUint64List.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_compactfheuint64list_free(ptr);
    }
    /**
    * @returns {any[]}
    */
    expand() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheuint64list_expand(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 4);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheuint64list_serialize(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} buffer
    * @returns {CompactFheUint64List}
    */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compactfheuint64list_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheUint64List.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.CompactFheUint64List = CompactFheUint64List;
/**
*/
class CompactFheUint8 {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CompactFheUint8.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_compactfheuint8_free(ptr);
    }
    /**
    * @param {number} value
    * @param {TfheCompactPublicKey} client_key
    * @returns {CompactFheUint8}
    */
    static encrypt_with_compact_public_key(value, client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheCompactPublicKey);
            wasm.compactfheuint8_encrypt_with_compact_public_key(retptr, value, client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheUint8.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {FheUint8}
    */
    expand() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheuint8_expand(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint8.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheuint8_serialize(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} buffer
    * @returns {CompactFheUint8}
    */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compactfheuint8_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheUint8.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {bigint} serialized_size_limit
    * @returns {Uint8Array}
    */
    safe_serialize(serialized_size_limit) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheuint8_safe_serialize(retptr, this.__wbg_ptr, serialized_size_limit);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} buffer
    * @param {bigint} serialized_size_limit
    * @returns {CompactFheUint8}
    */
    static safe_deserialize(buffer, serialized_size_limit) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compactfheuint8_safe_deserialize(retptr, ptr0, len0, serialized_size_limit);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheUint8.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.CompactFheUint8 = CompactFheUint8;
/**
*/
class CompactFheUint8List {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CompactFheUint8List.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_compactfheuint8list_free(ptr);
    }
    /**
    * @returns {any[]}
    */
    expand() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheuint8list_expand(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 4);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheuint8list_serialize(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} buffer
    * @returns {CompactFheUint8List}
    */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compactfheuint8list_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheUint8List.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.CompactFheUint8List = CompactFheUint8List;
/**
*/
class CompressedFheBool {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CompressedFheBool.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_compressedfhebool_free(ptr);
    }
    /**
    * @param {boolean} value
    * @param {TfheClientKey} client_key
    * @returns {CompressedFheBool}
    */
    static encrypt_with_client_key(value, client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheClientKey);
            wasm.compressedfhebool_encrypt_with_client_key(retptr, value, client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompressedFheBool.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {FheBool}
    */
    decompress() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compressedfhebool_decompress(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheBool.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compressedfhebool_serialize(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} buffer
    * @returns {CompressedFheBool}
    */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compressedfhebool_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompressedFheBool.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {bigint} serialized_size_limit
    * @returns {Uint8Array}
    */
    safe_serialize(serialized_size_limit) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compressedfhebool_safe_serialize(retptr, this.__wbg_ptr, serialized_size_limit);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} buffer
    * @param {bigint} serialized_size_limit
    * @returns {CompressedFheBool}
    */
    static safe_deserialize(buffer, serialized_size_limit) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compressedfhebool_safe_deserialize(retptr, ptr0, len0, serialized_size_limit);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompressedFheBool.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.CompressedFheBool = CompressedFheBool;
/**
*/
class CompressedFheUint16 {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CompressedFheUint16.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_compressedfheuint16_free(ptr);
    }
    /**
    * @param {number} value
    * @param {TfheClientKey} client_key
    * @returns {CompressedFheUint16}
    */
    static encrypt_with_client_key(value, client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheClientKey);
            wasm.compressedfheuint16_encrypt_with_client_key(retptr, value, client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompressedFheUint16.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {FheUint16}
    */
    decompress() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compressedfheuint16_decompress(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint16.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compressedfheuint16_serialize(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} buffer
    * @returns {CompressedFheUint16}
    */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compressedfheuint16_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompressedFheUint16.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {bigint} serialized_size_limit
    * @returns {Uint8Array}
    */
    safe_serialize(serialized_size_limit) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compressedfheuint16_safe_serialize(retptr, this.__wbg_ptr, serialized_size_limit);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} buffer
    * @param {bigint} serialized_size_limit
    * @returns {CompressedFheUint16}
    */
    static safe_deserialize(buffer, serialized_size_limit) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compressedfheuint16_safe_deserialize(retptr, ptr0, len0, serialized_size_limit);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompressedFheUint16.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.CompressedFheUint16 = CompressedFheUint16;
/**
*/
class CompressedFheUint32 {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CompressedFheUint32.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_compressedfheuint32_free(ptr);
    }
    /**
    * @param {number} value
    * @param {TfheClientKey} client_key
    * @returns {CompressedFheUint32}
    */
    static encrypt_with_client_key(value, client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheClientKey);
            wasm.compressedfheuint32_encrypt_with_client_key(retptr, value, client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompressedFheUint32.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {FheUint32}
    */
    decompress() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compressedfheuint32_decompress(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint32.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compressedfheuint32_serialize(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} buffer
    * @returns {CompressedFheUint32}
    */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compressedfheuint32_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompressedFheUint32.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {bigint} serialized_size_limit
    * @returns {Uint8Array}
    */
    safe_serialize(serialized_size_limit) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compressedfheuint32_safe_serialize(retptr, this.__wbg_ptr, serialized_size_limit);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} buffer
    * @param {bigint} serialized_size_limit
    * @returns {CompressedFheUint32}
    */
    static safe_deserialize(buffer, serialized_size_limit) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compressedfheuint32_safe_deserialize(retptr, ptr0, len0, serialized_size_limit);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompressedFheUint32.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.CompressedFheUint32 = CompressedFheUint32;
/**
*/
class CompressedFheUint64 {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CompressedFheUint64.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_compressedfheuint64_free(ptr);
    }
    /**
    * @param {bigint} value
    * @param {TfheClientKey} client_key
    * @returns {CompressedFheUint64}
    */
    static encrypt_with_client_key(value, client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheClientKey);
            wasm.compressedfheuint64_encrypt_with_client_key(retptr, value, client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompressedFheUint64.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {FheUint64}
    */
    decompress() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compressedfheuint64_decompress(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint64.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compressedfheuint64_serialize(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} buffer
    * @returns {CompressedFheUint64}
    */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compressedfheuint64_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompressedFheUint64.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {bigint} serialized_size_limit
    * @returns {Uint8Array}
    */
    safe_serialize(serialized_size_limit) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compressedfheuint64_safe_serialize(retptr, this.__wbg_ptr, serialized_size_limit);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} buffer
    * @param {bigint} serialized_size_limit
    * @returns {CompressedFheUint64}
    */
    static safe_deserialize(buffer, serialized_size_limit) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compressedfheuint64_safe_deserialize(retptr, ptr0, len0, serialized_size_limit);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompressedFheUint64.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.CompressedFheUint64 = CompressedFheUint64;
/**
*/
class CompressedFheUint8 {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CompressedFheUint8.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_compressedfheuint8_free(ptr);
    }
    /**
    * @param {number} value
    * @param {TfheClientKey} client_key
    * @returns {CompressedFheUint8}
    */
    static encrypt_with_client_key(value, client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheClientKey);
            wasm.compressedfheuint8_encrypt_with_client_key(retptr, value, client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompressedFheUint8.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {FheUint8}
    */
    decompress() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compressedfheuint8_decompress(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint8.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compressedfheuint8_serialize(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} buffer
    * @returns {CompressedFheUint8}
    */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compressedfheuint8_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompressedFheUint8.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {bigint} serialized_size_limit
    * @returns {Uint8Array}
    */
    safe_serialize(serialized_size_limit) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compressedfheuint8_safe_serialize(retptr, this.__wbg_ptr, serialized_size_limit);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} buffer
    * @param {bigint} serialized_size_limit
    * @returns {CompressedFheUint8}
    */
    static safe_deserialize(buffer, serialized_size_limit) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compressedfheuint8_safe_deserialize(retptr, ptr0, len0, serialized_size_limit);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompressedFheUint8.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.CompressedFheUint8 = CompressedFheUint8;
/**
*/
class FheBool {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(FheBool.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_fhebool_free(ptr);
    }
    /**
    * @param {boolean} value
    * @param {TfheCompactPublicKey} compact_public_key
    * @returns {FheBool}
    */
    static encrypt_with_compact_public_key(value, compact_public_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(compact_public_key, TfheCompactPublicKey);
            wasm.fhebool_encrypt_with_compact_public_key(retptr, value, compact_public_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheBool.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.fhebool_serialize(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.FheBool = FheBool;
/**
*/
class FheUint128 {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(FheUint128.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_fheuint128_free(ptr);
    }
    /**
    * @param {any} value
    * @param {TfheCompactPublicKey} compact_public_key
    * @returns {FheUint128}
    */
    static encrypt_with_compact_public_key(value, compact_public_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(compact_public_key, TfheCompactPublicKey);
            wasm.fheuint128_encrypt_with_compact_public_key(retptr, addHeapObject(value), compact_public_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint128.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.FheUint128 = FheUint128;
/**
*/
class FheUint16 {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(FheUint16.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_fheuint16_free(ptr);
    }
    /**
    * @param {number} value
    * @param {TfheCompactPublicKey} compact_public_key
    * @returns {FheUint16}
    */
    static encrypt_with_compact_public_key(value, compact_public_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(compact_public_key, TfheCompactPublicKey);
            wasm.fheuint16_encrypt_with_compact_public_key(retptr, value, compact_public_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint16.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.fheuint16_serialize(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.FheUint16 = FheUint16;
/**
*/
class FheUint160 {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(FheUint160.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_fheuint160_free(ptr);
    }
    /**
    * @param {any} value
    * @param {TfheCompactPublicKey} compact_public_key
    * @returns {FheUint160}
    */
    static encrypt_with_compact_public_key(value, compact_public_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(compact_public_key, TfheCompactPublicKey);
            wasm.fheuint160_encrypt_with_compact_public_key(retptr, addHeapObject(value), compact_public_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint160.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.FheUint160 = FheUint160;
/**
*/
class FheUint256 {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(FheUint256.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_fheuint256_free(ptr);
    }
    /**
    * @param {any} value
    * @param {TfheCompactPublicKey} compact_public_key
    * @returns {FheUint256}
    */
    static encrypt_with_compact_public_key(value, compact_public_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(compact_public_key, TfheCompactPublicKey);
            wasm.fheuint256_encrypt_with_compact_public_key(retptr, addHeapObject(value), compact_public_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint256.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.FheUint256 = FheUint256;
/**
*/
class FheUint32 {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(FheUint32.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_fheuint32_free(ptr);
    }
    /**
    * @param {number} value
    * @param {TfheCompactPublicKey} compact_public_key
    * @returns {FheUint32}
    */
    static encrypt_with_compact_public_key(value, compact_public_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(compact_public_key, TfheCompactPublicKey);
            wasm.fheuint32_encrypt_with_compact_public_key(retptr, value, compact_public_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint32.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.fheuint32_serialize(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.FheUint32 = FheUint32;
/**
*/
class FheUint64 {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(FheUint64.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_fheuint64_free(ptr);
    }
    /**
    * @param {bigint} value
    * @param {TfheCompactPublicKey} compact_public_key
    * @returns {FheUint64}
    */
    static encrypt_with_compact_public_key(value, compact_public_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(compact_public_key, TfheCompactPublicKey);
            wasm.fheuint64_encrypt_with_compact_public_key(retptr, value, compact_public_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint64.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.fheuint64_serialize(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.FheUint64 = FheUint64;
/**
*/
class FheUint8 {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(FheUint8.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_fheuint8_free(ptr);
    }
    /**
    * @param {number} value
    * @param {TfheCompactPublicKey} compact_public_key
    * @returns {FheUint8}
    */
    static encrypt_with_compact_public_key(value, compact_public_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(compact_public_key, TfheCompactPublicKey);
            wasm.fheuint8_encrypt_with_compact_public_key(retptr, value, compact_public_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint8.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.fheuint8_serialize(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.FheUint8 = FheUint8;
/**
*/
class Shortint {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_shortint_free(ptr);
    }
    /**
    * @param {number} message_bits
    * @param {number} carry_bits
    * @returns {ShortintParameters}
    */
    static get_parameters(message_bits, carry_bits) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.shortint_get_parameters(retptr, message_bits, carry_bits);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return ShortintParameters.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {number} message_bits
    * @param {number} carry_bits
    * @returns {ShortintParameters}
    */
    static get_parameters_small(message_bits, carry_bits) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.shortint_get_parameters_small(retptr, message_bits, carry_bits);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return ShortintParameters.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {number} std_dev
    * @returns {ShortintNoiseDistribution}
    */
    static new_gaussian_from_std_dev(std_dev) {
        const ret = wasm.boolean_new_gaussian_from_std_dev(std_dev);
        return ShortintNoiseDistribution.__wrap(ret);
    }
    /**
    * @param {number} bound_log2
    * @returns {ShortintNoiseDistribution}
    */
    static try_new_t_uniform(bound_log2) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.shortint_try_new_t_uniform(retptr, bound_log2);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return ShortintNoiseDistribution.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {number} lwe_dimension
    * @param {number} glwe_dimension
    * @param {number} polynomial_size
    * @param {ShortintNoiseDistribution} lwe_noise_distribution
    * @param {ShortintNoiseDistribution} glwe_noise_distribution
    * @param {number} pbs_base_log
    * @param {number} pbs_level
    * @param {number} ks_base_log
    * @param {number} ks_level
    * @param {number} message_modulus
    * @param {number} carry_modulus
    * @param {number} max_noise_level
    * @param {number} log2_p_fail
    * @param {number} modulus_power_of_2_exponent
    * @param {number} encryption_key_choice
    * @returns {ShortintParameters}
    */
    static new_parameters(lwe_dimension, glwe_dimension, polynomial_size, lwe_noise_distribution, glwe_noise_distribution, pbs_base_log, pbs_level, ks_base_log, ks_level, message_modulus, carry_modulus, max_noise_level, log2_p_fail, modulus_power_of_2_exponent, encryption_key_choice) {
        _assertClass(lwe_noise_distribution, ShortintNoiseDistribution);
        _assertClass(glwe_noise_distribution, ShortintNoiseDistribution);
        const ret = wasm.shortint_new_parameters(lwe_dimension, glwe_dimension, polynomial_size, lwe_noise_distribution.__wbg_ptr, glwe_noise_distribution.__wbg_ptr, pbs_base_log, pbs_level, ks_base_log, ks_level, message_modulus, carry_modulus, max_noise_level, log2_p_fail, modulus_power_of_2_exponent, encryption_key_choice);
        return ShortintParameters.__wrap(ret);
    }
    /**
    * @param {bigint} seed_high_bytes
    * @param {bigint} seed_low_bytes
    * @param {ShortintParameters} parameters
    * @returns {ShortintClientKey}
    */
    static new_client_key_from_seed_and_parameters(seed_high_bytes, seed_low_bytes, parameters) {
        _assertClass(parameters, ShortintParameters);
        const ret = wasm.shortint_new_client_key_from_seed_and_parameters(seed_high_bytes, seed_low_bytes, parameters.__wbg_ptr);
        return ShortintClientKey.__wrap(ret);
    }
    /**
    * @param {ShortintParameters} parameters
    * @returns {ShortintClientKey}
    */
    static new_client_key(parameters) {
        _assertClass(parameters, ShortintParameters);
        const ret = wasm.shortint_new_client_key(parameters.__wbg_ptr);
        return ShortintClientKey.__wrap(ret);
    }
    /**
    * @param {ShortintClientKey} client_key
    * @returns {ShortintPublicKey}
    */
    static new_public_key(client_key) {
        _assertClass(client_key, ShortintClientKey);
        const ret = wasm.shortint_new_public_key(client_key.__wbg_ptr);
        return ShortintPublicKey.__wrap(ret);
    }
    /**
    * @param {ShortintClientKey} client_key
    * @returns {ShortintCompressedPublicKey}
    */
    static new_compressed_public_key(client_key) {
        _assertClass(client_key, ShortintClientKey);
        const ret = wasm.shortint_new_compressed_public_key(client_key.__wbg_ptr);
        return ShortintCompressedPublicKey.__wrap(ret);
    }
    /**
    * @param {ShortintClientKey} client_key
    * @returns {ShortintCompressedServerKey}
    */
    static new_compressed_server_key(client_key) {
        _assertClass(client_key, ShortintClientKey);
        const ret = wasm.shortint_new_compressed_server_key(client_key.__wbg_ptr);
        return ShortintCompressedServerKey.__wrap(ret);
    }
    /**
    * @param {ShortintClientKey} client_key
    * @param {bigint} message
    * @returns {ShortintCiphertext}
    */
    static encrypt(client_key, message) {
        _assertClass(client_key, ShortintClientKey);
        const ret = wasm.shortint_encrypt(client_key.__wbg_ptr, message);
        return ShortintCiphertext.__wrap(ret);
    }
    /**
    * @param {ShortintClientKey} client_key
    * @param {bigint} message
    * @returns {ShortintCompressedCiphertext}
    */
    static encrypt_compressed(client_key, message) {
        _assertClass(client_key, ShortintClientKey);
        const ret = wasm.shortint_encrypt_compressed(client_key.__wbg_ptr, message);
        return ShortintCompressedCiphertext.__wrap(ret);
    }
    /**
    * @param {ShortintCompressedCiphertext} compressed_ciphertext
    * @returns {ShortintCiphertext}
    */
    static decompress_ciphertext(compressed_ciphertext) {
        _assertClass(compressed_ciphertext, ShortintCompressedCiphertext);
        const ret = wasm.shortint_decompress_ciphertext(compressed_ciphertext.__wbg_ptr);
        return ShortintCiphertext.__wrap(ret);
    }
    /**
    * @param {ShortintPublicKey} public_key
    * @param {bigint} message
    * @returns {ShortintCiphertext}
    */
    static encrypt_with_public_key(public_key, message) {
        _assertClass(public_key, ShortintPublicKey);
        const ret = wasm.shortint_encrypt_with_public_key(public_key.__wbg_ptr, message);
        return ShortintCiphertext.__wrap(ret);
    }
    /**
    * @param {ShortintCompressedPublicKey} public_key
    * @param {bigint} message
    * @returns {ShortintCiphertext}
    */
    static encrypt_with_compressed_public_key(public_key, message) {
        _assertClass(public_key, ShortintCompressedPublicKey);
        const ret = wasm.shortint_encrypt_with_compressed_public_key(public_key.__wbg_ptr, message);
        return ShortintCiphertext.__wrap(ret);
    }
    /**
    * @param {ShortintClientKey} client_key
    * @param {ShortintCiphertext} ct
    * @returns {bigint}
    */
    static decrypt(client_key, ct) {
        _assertClass(client_key, ShortintClientKey);
        _assertClass(ct, ShortintCiphertext);
        const ret = wasm.shortint_decrypt(client_key.__wbg_ptr, ct.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
    * @param {ShortintCiphertext} ciphertext
    * @returns {Uint8Array}
    */
    static serialize_ciphertext(ciphertext) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(ciphertext, ShortintCiphertext);
            wasm.shortint_serialize_ciphertext(retptr, ciphertext.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} buffer
    * @returns {ShortintCiphertext}
    */
    static deserialize_ciphertext(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.shortint_deserialize_ciphertext(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return ShortintCiphertext.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {ShortintCompressedCiphertext} ciphertext
    * @returns {Uint8Array}
    */
    static serialize_compressed_ciphertext(ciphertext) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(ciphertext, ShortintCompressedCiphertext);
            wasm.shortint_serialize_compressed_ciphertext(retptr, ciphertext.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} buffer
    * @returns {ShortintCompressedCiphertext}
    */
    static deserialize_compressed_ciphertext(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.shortint_deserialize_compressed_ciphertext(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return ShortintCompressedCiphertext.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {ShortintClientKey} client_key
    * @returns {Uint8Array}
    */
    static serialize_client_key(client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, ShortintClientKey);
            wasm.shortint_serialize_client_key(retptr, client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} buffer
    * @returns {ShortintClientKey}
    */
    static deserialize_client_key(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.shortint_deserialize_client_key(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return ShortintClientKey.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {ShortintPublicKey} public_key
    * @returns {Uint8Array}
    */
    static serialize_public_key(public_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(public_key, ShortintPublicKey);
            wasm.shortint_serialize_public_key(retptr, public_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} buffer
    * @returns {ShortintPublicKey}
    */
    static deserialize_public_key(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.shortint_deserialize_public_key(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return ShortintPublicKey.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {ShortintCompressedPublicKey} public_key
    * @returns {Uint8Array}
    */
    static serialize_compressed_public_key(public_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(public_key, ShortintCompressedPublicKey);
            wasm.shortint_serialize_compressed_public_key(retptr, public_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} buffer
    * @returns {ShortintCompressedPublicKey}
    */
    static deserialize_compressed_public_key(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.shortint_deserialize_compressed_public_key(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return ShortintCompressedPublicKey.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {ShortintCompressedServerKey} server_key
    * @returns {Uint8Array}
    */
    static serialize_compressed_server_key(server_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(server_key, ShortintCompressedServerKey);
            wasm.shortint_serialize_compressed_server_key(retptr, server_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} buffer
    * @returns {ShortintCompressedServerKey}
    */
    static deserialize_compressed_server_key(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.shortint_deserialize_compressed_server_key(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return ShortintCompressedServerKey.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.Shortint = Shortint;
/**
*/
class ShortintCiphertext {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ShortintCiphertext.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_shortintciphertext_free(ptr);
    }
}
module.exports.ShortintCiphertext = ShortintCiphertext;
/**
*/
class ShortintClientKey {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ShortintClientKey.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_shortintclientkey_free(ptr);
    }
}
module.exports.ShortintClientKey = ShortintClientKey;
/**
*/
class ShortintCompressedCiphertext {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ShortintCompressedCiphertext.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_shortintcompressedciphertext_free(ptr);
    }
}
module.exports.ShortintCompressedCiphertext = ShortintCompressedCiphertext;
/**
*/
class ShortintCompressedPublicKey {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ShortintCompressedPublicKey.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_shortintcompressedpublickey_free(ptr);
    }
}
module.exports.ShortintCompressedPublicKey = ShortintCompressedPublicKey;
/**
*/
class ShortintCompressedServerKey {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ShortintCompressedServerKey.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_shortintcompressedserverkey_free(ptr);
    }
}
module.exports.ShortintCompressedServerKey = ShortintCompressedServerKey;
/**
*/
class ShortintNoiseDistribution {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ShortintNoiseDistribution.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_shortintnoisedistribution_free(ptr);
    }
}
module.exports.ShortintNoiseDistribution = ShortintNoiseDistribution;
/**
*/
class ShortintParameters {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ShortintParameters.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_shortintparameters_free(ptr);
    }
    /**
    * @returns {number}
    */
    lwe_dimension() {
        const ret = wasm.shortintparameters_lwe_dimension(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} new_value
    */
    set_lwe_dimension(new_value) {
        wasm.shortintparameters_set_lwe_dimension(this.__wbg_ptr, new_value);
    }
    /**
    * @returns {number}
    */
    glwe_dimension() {
        const ret = wasm.shortintparameters_glwe_dimension(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} new_value
    */
    set_glwe_dimension(new_value) {
        wasm.shortintparameters_set_glwe_dimension(this.__wbg_ptr, new_value);
    }
    /**
    * @returns {number}
    */
    polynomial_size() {
        const ret = wasm.shortintparameters_polynomial_size(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} new_value
    */
    set_polynomial_size(new_value) {
        wasm.shortintparameters_set_polynomial_size(this.__wbg_ptr, new_value);
    }
    /**
    * @returns {ShortintNoiseDistribution}
    */
    lwe_noise_distribution() {
        const ret = wasm.shortintparameters_glwe_noise_distribution(this.__wbg_ptr);
        return ShortintNoiseDistribution.__wrap(ret);
    }
    /**
    * @param {ShortintNoiseDistribution} new_value
    */
    set_lwe_noise_distribution(new_value) {
        _assertClass(new_value, ShortintNoiseDistribution);
        wasm.shortintparameters_set_lwe_noise_distribution(this.__wbg_ptr, new_value.__wbg_ptr);
    }
    /**
    * @returns {ShortintNoiseDistribution}
    */
    glwe_noise_distribution() {
        const ret = wasm.shortintparameters_glwe_noise_distribution(this.__wbg_ptr);
        return ShortintNoiseDistribution.__wrap(ret);
    }
    /**
    * @param {ShortintNoiseDistribution} new_value
    */
    set_glwe_noise_distribution(new_value) {
        _assertClass(new_value, ShortintNoiseDistribution);
        wasm.shortintparameters_set_glwe_noise_distribution(this.__wbg_ptr, new_value.__wbg_ptr);
    }
    /**
    * @returns {number}
    */
    pbs_base_log() {
        const ret = wasm.shortintparameters_pbs_base_log(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} new_value
    */
    set_pbs_base_log(new_value) {
        wasm.shortintparameters_set_pbs_base_log(this.__wbg_ptr, new_value);
    }
    /**
    * @returns {number}
    */
    pbs_level() {
        const ret = wasm.shortintparameters_pbs_level(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} new_value
    */
    set_pbs_level(new_value) {
        wasm.shortintparameters_set_pbs_level(this.__wbg_ptr, new_value);
    }
    /**
    * @returns {number}
    */
    ks_base_log() {
        const ret = wasm.shortintparameters_ks_base_log(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} new_value
    */
    set_ks_base_log(new_value) {
        wasm.shortintparameters_set_ks_base_log(this.__wbg_ptr, new_value);
    }
    /**
    * @returns {number}
    */
    ks_level() {
        const ret = wasm.shortintparameters_ks_level(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} new_value
    */
    set_ks_level(new_value) {
        wasm.shortintparameters_set_ks_level(this.__wbg_ptr, new_value);
    }
    /**
    * @returns {number}
    */
    message_modulus() {
        const ret = wasm.shortintparameters_message_modulus(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} new_value
    */
    set_message_modulus(new_value) {
        wasm.shortintparameters_set_message_modulus(this.__wbg_ptr, new_value);
    }
    /**
    * @returns {number}
    */
    carry_modulus() {
        const ret = wasm.shortintparameters_carry_modulus(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} new_value
    */
    set_carry_modulus(new_value) {
        wasm.shortintparameters_set_carry_modulus(this.__wbg_ptr, new_value);
    }
    /**
    * @returns {number}
    */
    encryption_key_choice() {
        const ret = wasm.shortintparameters_encryption_key_choice(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} new_value
    */
    set_encryption_key_choice(new_value) {
        wasm.shortintparameters_set_encryption_key_choice(this.__wbg_ptr, new_value);
    }
    /**
    * @param {number} name
    */
    constructor(name) {
        const ret = wasm.shortintparameters_new(name);
        return ShortintParameters.__wrap(ret);
    }
}
module.exports.ShortintParameters = ShortintParameters;
/**
*/
class ShortintPublicKey {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ShortintPublicKey.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_shortintpublickey_free(ptr);
    }
}
module.exports.ShortintPublicKey = ShortintPublicKey;
/**
*/
class TfheClientKey {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(TfheClientKey.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_tfheclientkey_free(ptr);
    }
    /**
    * @param {TfheConfig} config
    * @returns {TfheClientKey}
    */
    static generate(config) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(config, TfheConfig);
            wasm.tfheclientkey_generate(retptr, config.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return TfheClientKey.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {TfheConfig} config
    * @param {any} seed
    * @returns {TfheClientKey}
    */
    static generate_with_seed(config, seed) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(config, TfheConfig);
            wasm.tfheclientkey_generate_with_seed(retptr, config.__wbg_ptr, addHeapObject(seed));
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return TfheClientKey.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.tfheclientkey_serialize(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} buffer
    * @returns {TfheClientKey}
    */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.tfheclientkey_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return TfheClientKey.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.TfheClientKey = TfheClientKey;
/**
*/
class TfheCompactPublicKey {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(TfheCompactPublicKey.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_tfhecompactpublickey_free(ptr);
    }
    /**
    * @param {TfheClientKey} client_key
    * @returns {TfheCompactPublicKey}
    */
    static new(client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheClientKey);
            wasm.tfhecompactpublickey_new(retptr, client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return TfheCompactPublicKey.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.tfhecompactpublickey_serialize(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} buffer
    * @returns {TfheCompactPublicKey}
    */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.tfhecompactpublickey_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return TfheCompactPublicKey.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.TfheCompactPublicKey = TfheCompactPublicKey;
/**
*/
class TfheCompressedCompactPublicKey {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(TfheCompressedCompactPublicKey.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_tfhecompressedcompactpublickey_free(ptr);
    }
    /**
    * @param {TfheClientKey} client_key
    * @returns {TfheCompressedCompactPublicKey}
    */
    static new(client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheClientKey);
            wasm.tfhecompressedcompactpublickey_new(retptr, client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return TfheCompressedCompactPublicKey.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.tfhecompressedcompactpublickey_serialize(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} buffer
    * @returns {TfheCompressedCompactPublicKey}
    */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.tfhecompressedcompactpublickey_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return TfheCompressedCompactPublicKey.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {TfheCompactPublicKey}
    */
    decompress() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.tfhecompressedcompactpublickey_decompress(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return TfheCompactPublicKey.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.TfheCompressedCompactPublicKey = TfheCompressedCompactPublicKey;
/**
*/
class TfheCompressedPublicKey {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(TfheCompressedPublicKey.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_tfhecompressedpublickey_free(ptr);
    }
    /**
    * @param {TfheClientKey} client_key
    * @returns {TfheCompressedPublicKey}
    */
    static new(client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheClientKey);
            wasm.tfhecompressedpublickey_new(retptr, client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return TfheCompressedPublicKey.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {TfhePublicKey}
    */
    decompress() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.tfhecompressedpublickey_decompress(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return TfhePublicKey.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.tfhecompressedpublickey_serialize(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} buffer
    * @returns {TfheCompressedPublicKey}
    */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.tfhecompressedpublickey_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return TfheCompressedPublicKey.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.TfheCompressedPublicKey = TfheCompressedPublicKey;
/**
*/
class TfheCompressedServerKey {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(TfheCompressedServerKey.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_tfhecompressedserverkey_free(ptr);
    }
    /**
    * @param {TfheClientKey} client_key
    * @returns {TfheCompressedServerKey}
    */
    static new(client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheClientKey);
            wasm.tfhecompressedserverkey_new(retptr, client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return TfheCompressedServerKey.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.tfhecompressedserverkey_serialize(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} buffer
    * @returns {TfheCompressedServerKey}
    */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.tfhecompressedserverkey_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return TfheCompressedServerKey.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.TfheCompressedServerKey = TfheCompressedServerKey;
/**
*/
class TfheConfig {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(TfheConfig.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_tfheconfig_free(ptr);
    }
}
module.exports.TfheConfig = TfheConfig;
/**
*/
class TfheConfigBuilder {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(TfheConfigBuilder.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_tfheconfigbuilder_free(ptr);
    }
    /**
    * @returns {TfheConfigBuilder}
    */
    static default() {
        const ret = wasm.tfheconfigbuilder_default();
        return TfheConfigBuilder.__wrap(ret);
    }
    /**
    * @returns {TfheConfigBuilder}
    */
    static default_with_small_encryption() {
        const ret = wasm.tfheconfigbuilder_default_with_small_encryption();
        return TfheConfigBuilder.__wrap(ret);
    }
    /**
    * @returns {TfheConfigBuilder}
    */
    static default_with_big_encryption() {
        const ret = wasm.tfheconfigbuilder_default();
        return TfheConfigBuilder.__wrap(ret);
    }
    /**
    * @param {ShortintParameters} block_parameters
    * @returns {TfheConfigBuilder}
    */
    use_custom_parameters(block_parameters) {
        const ptr = this.__destroy_into_raw();
        _assertClass(block_parameters, ShortintParameters);
        const ret = wasm.tfheconfigbuilder_use_custom_parameters(ptr, block_parameters.__wbg_ptr);
        return TfheConfigBuilder.__wrap(ret);
    }
    /**
    * @returns {TfheConfig}
    */
    build() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.tfheconfigbuilder_build(ptr);
        return TfheConfig.__wrap(ret);
    }
}
module.exports.TfheConfigBuilder = TfheConfigBuilder;
/**
*/
class TfhePublicKey {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(TfhePublicKey.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_tfhepublickey_free(ptr);
    }
    /**
    * @param {TfheClientKey} client_key
    * @returns {TfhePublicKey}
    */
    static new(client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheClientKey);
            wasm.tfhepublickey_new(retptr, client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return TfhePublicKey.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.tfhepublickey_serialize(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} buffer
    * @returns {TfhePublicKey}
    */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.tfhepublickey_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return TfhePublicKey.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.TfhePublicKey = TfhePublicKey;
/**
*/
class tfhe {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_tfhe_free(ptr);
    }
}
module.exports.tfhe = tfhe;

module.exports.__wbindgen_bigint_from_u64 = function(arg0) {
    const ret = BigInt.asUintN(64, arg0);
    return addHeapObject(ret);
};

module.exports.__wbindgen_shr = function(arg0, arg1) {
    const ret = getObject(arg0) >> getObject(arg1);
    return addHeapObject(ret);
};

module.exports.__wbindgen_object_drop_ref = function(arg0) {
    takeObject(arg0);
};

module.exports.__wbindgen_jsval_eq = function(arg0, arg1) {
    const ret = getObject(arg0) === getObject(arg1);
    return ret;
};

module.exports.__wbindgen_error_new = function(arg0, arg1) {
    const ret = new Error(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

module.exports.__wbindgen_bigint_from_str = function(arg0, arg1) {
    const ret = BigInt(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

module.exports.__wbindgen_bit_and = function(arg0, arg1) {
    const ret = getObject(arg0) & getObject(arg1);
    return addHeapObject(ret);
};

module.exports.__wbg_fhebool_new = function(arg0) {
    const ret = FheBool.__wrap(arg0);
    return addHeapObject(ret);
};

module.exports.__wbg_fheuint8_new = function(arg0) {
    const ret = FheUint8.__wrap(arg0);
    return addHeapObject(ret);
};

module.exports.__wbg_fheuint16_new = function(arg0) {
    const ret = FheUint16.__wrap(arg0);
    return addHeapObject(ret);
};

module.exports.__wbg_fheuint32_new = function(arg0) {
    const ret = FheUint32.__wrap(arg0);
    return addHeapObject(ret);
};

module.exports.__wbg_fheuint64_new = function(arg0) {
    const ret = FheUint64.__wrap(arg0);
    return addHeapObject(ret);
};

module.exports.__wbg_new_abda76e883ba8a5f = function() {
    const ret = new Error();
    return addHeapObject(ret);
};

module.exports.__wbg_stack_658279fe44541cf6 = function(arg0, arg1) {
    const ret = getObject(arg1).stack;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len1;
    getInt32Memory0()[arg0 / 4 + 0] = ptr1;
};

module.exports.__wbg_error_f851667af71bcfc6 = function(arg0, arg1) {
    let deferred0_0;
    let deferred0_1;
    try {
        deferred0_0 = arg0;
        deferred0_1 = arg1;
        console.error(getStringFromWasm0(arg0, arg1));
    } finally {
        wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
    }
};

module.exports.__wbg_crypto_c48a774b022d20ac = function(arg0) {
    const ret = getObject(arg0).crypto;
    return addHeapObject(ret);
};

module.exports.__wbindgen_is_object = function(arg0) {
    const val = getObject(arg0);
    const ret = typeof(val) === 'object' && val !== null;
    return ret;
};

module.exports.__wbg_process_298734cf255a885d = function(arg0) {
    const ret = getObject(arg0).process;
    return addHeapObject(ret);
};

module.exports.__wbg_versions_e2e78e134e3e5d01 = function(arg0) {
    const ret = getObject(arg0).versions;
    return addHeapObject(ret);
};

module.exports.__wbg_node_1cd7a5d853dbea79 = function(arg0) {
    const ret = getObject(arg0).node;
    return addHeapObject(ret);
};

module.exports.__wbindgen_is_string = function(arg0) {
    const ret = typeof(getObject(arg0)) === 'string';
    return ret;
};

module.exports.__wbg_require_8f08ceecec0f4fee = function() { return handleError(function () {
    const ret = module.require;
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbindgen_string_new = function(arg0, arg1) {
    const ret = getStringFromWasm0(arg0, arg1);
    return addHeapObject(ret);
};

module.exports.__wbg_msCrypto_bcb970640f50a1e8 = function(arg0) {
    const ret = getObject(arg0).msCrypto;
    return addHeapObject(ret);
};

module.exports.__wbg_randomFillSync_dc1e9a60c158336d = function() { return handleError(function (arg0, arg1) {
    getObject(arg0).randomFillSync(takeObject(arg1));
}, arguments) };

module.exports.__wbg_getRandomValues_37fa2ca9e4e07fab = function() { return handleError(function (arg0, arg1) {
    getObject(arg0).getRandomValues(getObject(arg1));
}, arguments) };

module.exports.__wbindgen_is_function = function(arg0) {
    const ret = typeof(getObject(arg0)) === 'function';
    return ret;
};

module.exports.__wbg_newnoargs_581967eacc0e2604 = function(arg0, arg1) {
    const ret = new Function(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

module.exports.__wbg_call_cb65541d95d71282 = function() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).call(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_self_1ff1d729e9aae938 = function() { return handleError(function () {
    const ret = self.self;
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_window_5f4faef6c12b79ec = function() { return handleError(function () {
    const ret = window.window;
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_globalThis_1d39714405582d3c = function() { return handleError(function () {
    const ret = globalThis.globalThis;
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_global_651f05c6a0944d1c = function() { return handleError(function () {
    const ret = global.global;
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbindgen_is_undefined = function(arg0) {
    const ret = getObject(arg0) === undefined;
    return ret;
};

module.exports.__wbg_call_01734de55d61e11d = function() { return handleError(function (arg0, arg1, arg2) {
    const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_buffer_085ec1f694018c4f = function(arg0) {
    const ret = getObject(arg0).buffer;
    return addHeapObject(ret);
};

module.exports.__wbg_newwithbyteoffsetandlength_6da8e527659b86aa = function(arg0, arg1, arg2) {
    const ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
};

module.exports.__wbg_new_8125e318e6245eed = function(arg0) {
    const ret = new Uint8Array(getObject(arg0));
    return addHeapObject(ret);
};

module.exports.__wbg_set_5cf90238115182c3 = function(arg0, arg1, arg2) {
    getObject(arg0).set(getObject(arg1), arg2 >>> 0);
};

module.exports.__wbg_newwithlength_e5d69174d6984cd7 = function(arg0) {
    const ret = new Uint8Array(arg0 >>> 0);
    return addHeapObject(ret);
};

module.exports.__wbg_subarray_13db269f57aa838d = function(arg0, arg1, arg2) {
    const ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
};

module.exports.__wbindgen_object_clone_ref = function(arg0) {
    const ret = getObject(arg0);
    return addHeapObject(ret);
};

module.exports.__wbindgen_bigint_get_as_i64 = function(arg0, arg1) {
    const v = getObject(arg1);
    const ret = typeof(v) === 'bigint' ? v : undefined;
    getBigInt64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? BigInt(0) : ret;
    getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);
};

module.exports.__wbindgen_debug_string = function(arg0, arg1) {
    const ret = debugString(getObject(arg1));
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len1;
    getInt32Memory0()[arg0 / 4 + 0] = ptr1;
};

module.exports.__wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

module.exports.__wbindgen_memory = function() {
    const ret = wasm.memory;
    return addHeapObject(ret);
};

const path = require('path').join(__dirname, 'tfhe_bg.wasm');
const bytes = require('fs').readFileSync(path);

const wasmModule = new WebAssembly.Module(bytes);
const wasmInstance = new WebAssembly.Instance(wasmModule, imports);
wasm = wasmInstance.exports;
module.exports.__wasm = wasm;

