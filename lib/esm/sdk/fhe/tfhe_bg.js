let wasm;
export function __wbg_set_wasm(val) {
    wasm = val;
}
const heap = new Array(128).fill(undefined);
heap.push(undefined, null, true, false);
let heap_next = heap.length;
function addHeapObject(obj) {
    if (heap_next === heap.length)
        heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];
    heap[idx] = obj;
    return idx;
}
function getObject(idx) {
    return heap[idx];
}
function dropObject(idx) {
    if (idx < 132)
        return;
    heap[idx] = heap_next;
    heap_next = idx;
}
function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}
const lTextDecoder = typeof TextDecoder === "undefined"
    ? (0, module.require)("util").TextDecoder
    : TextDecoder;
let cachedTextDecoder = new lTextDecoder("utf-8", {
    ignoreBOM: true,
    fatal: true,
});
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
    if (cachedBigInt64Memory0 === null ||
        cachedBigInt64Memory0.byteLength === 0) {
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
    if (type == "number" || type == "boolean" || val == null) {
        return `${val}`;
    }
    if (type == "string") {
        return `"${val}"`;
    }
    if (type == "symbol") {
        const description = val.description;
        if (description == null) {
            return "Symbol";
        }
        else {
            return `Symbol(${description})`;
        }
    }
    if (type == "function") {
        const name = val.name;
        if (typeof name == "string" && name.length > 0) {
            return `Function(${name})`;
        }
        else {
            return "Function";
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = "[";
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for (let i = 1; i < length; i++) {
            debug += ", " + debugString(val[i]);
        }
        debug += "]";
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    }
    else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == "Object") {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return "Object(" + JSON.stringify(val) + ")";
        }
        catch (_) {
            return "Object";
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
const lTextEncoder = typeof TextEncoder === "undefined"
    ? (0, module.require)("util").TextEncoder
    : TextEncoder;
let cachedTextEncoder = new lTextEncoder("utf-8");
const encodeString = typeof cachedTextEncoder.encodeInto === "function"
    ? function (arg, view) {
        return cachedTextEncoder.encodeInto(arg, view);
    }
    : function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length,
        };
    };
function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8Memory0()
            .subarray(ptr, ptr + buf.length)
            .set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }
    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;
    const mem = getUint8Memory0();
    let offset = 0;
    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7f)
            break;
        mem[ptr + offset] = code;
    }
    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, (len = offset + arg.length * 3), 1) >>> 0;
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);
        offset += ret.written;
    }
    WASM_VECTOR_LEN = offset;
    return ptr;
}
/**
 */
export function init_panic_hook() {
    wasm.init_panic_hook();
}
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
function passArrayJsValueToWasm0(array, malloc) {
    const ptr = malloc(array.length * 4, 4) >>> 0;
    const mem = getUint32Memory0();
    for (let i = 0; i < array.length; i++) {
        mem[ptr / 4 + i] = addHeapObject(array[i]);
    }
    WASM_VECTOR_LEN = array.length;
    return ptr;
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
    }
    catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}
/**
 */
export class CompactFheBool {
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
        }
        finally {
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
        }
        finally {
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
        }
        finally {
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
        }
        finally {
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
        }
        finally {
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class CompactFheBoolList {
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
        }
        finally {
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
        }
        finally {
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {any[]} values
     * @param {TfheCompactPublicKey} public_key
     * @returns {CompactFheBoolList}
     */
    static encrypt_with_compact_public_key(values, public_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArrayJsValueToWasm0(values, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            _assertClass(public_key, TfheCompactPublicKey);
            wasm.compactfheboollist_encrypt_with_compact_public_key(retptr, ptr0, len0, public_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheBoolList.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class CompactFheInt128 {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CompactFheInt128.prototype);
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
        wasm.__wbg_compactfheint128_free(ptr);
    }
    /**
     * @param {any} value
     * @param {TfheCompactPublicKey} client_key
     * @returns {CompactFheInt128}
     */
    static encrypt_with_compact_public_key(value, client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheCompactPublicKey);
            wasm.compactfheint128_encrypt_with_compact_public_key(retptr, addHeapObject(value), client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheInt128.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {FheInt128}
     */
    expand() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheint128_expand(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheInt128.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheint128_serialize(retptr, this.__wbg_ptr);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @returns {CompactFheInt128}
     */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compactfheint128_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheInt128.__wrap(r0);
        }
        finally {
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
            wasm.compactfheint128_safe_serialize(retptr, this.__wbg_ptr, serialized_size_limit);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {CompactFheInt128}
     */
    static safe_deserialize(buffer, serialized_size_limit) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compactfheint128_safe_deserialize(retptr, ptr0, len0, serialized_size_limit);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheInt128.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class CompactFheInt128List {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CompactFheInt128List.prototype);
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
        wasm.__wbg_compactfheint128list_free(ptr);
    }
    /**
     * @param {any[]} values
     * @param {TfheCompactPublicKey} public_key
     * @returns {CompactFheInt128List}
     */
    static encrypt_with_compact_public_key(values, public_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArrayJsValueToWasm0(values, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            _assertClass(public_key, TfheCompactPublicKey);
            wasm.compactfheint128list_encrypt_with_compact_public_key(retptr, ptr0, len0, public_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheInt128List.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {any[]}
     */
    expand() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheint128list_expand(retptr, this.__wbg_ptr);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheint128list_serialize(retptr, this.__wbg_ptr);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @returns {CompactFheInt128List}
     */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compactfheint128list_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheInt128List.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class CompactFheInt16 {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CompactFheInt16.prototype);
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
        wasm.__wbg_compactfheint16_free(ptr);
    }
    /**
     * @param {number} value
     * @param {TfheCompactPublicKey} client_key
     * @returns {CompactFheInt16}
     */
    static encrypt_with_compact_public_key(value, client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheCompactPublicKey);
            wasm.compactfheint16_encrypt_with_compact_public_key(retptr, value, client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheInt16.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {FheInt16}
     */
    expand() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheint128_expand(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheInt16.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheint16_serialize(retptr, this.__wbg_ptr);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @returns {CompactFheInt16}
     */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compactfheint16_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheInt16.__wrap(r0);
        }
        finally {
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
            wasm.compactfheint16_safe_serialize(retptr, this.__wbg_ptr, serialized_size_limit);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {CompactFheInt16}
     */
    static safe_deserialize(buffer, serialized_size_limit) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compactfheint16_safe_deserialize(retptr, ptr0, len0, serialized_size_limit);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheInt16.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class CompactFheInt160 {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CompactFheInt160.prototype);
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
        wasm.__wbg_compactfheint160_free(ptr);
    }
    /**
     * @param {any} value
     * @param {TfheCompactPublicKey} client_key
     * @returns {CompactFheInt160}
     */
    static encrypt_with_compact_public_key(value, client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheCompactPublicKey);
            wasm.compactfheint160_encrypt_with_compact_public_key(retptr, addHeapObject(value), client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheInt160.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {FheInt160}
     */
    expand() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheint128_expand(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheInt160.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheint160_serialize(retptr, this.__wbg_ptr);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @returns {CompactFheInt160}
     */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compactfheint160_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheInt160.__wrap(r0);
        }
        finally {
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
            wasm.compactfheint160_safe_serialize(retptr, this.__wbg_ptr, serialized_size_limit);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {CompactFheInt160}
     */
    static safe_deserialize(buffer, serialized_size_limit) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compactfheint160_safe_deserialize(retptr, ptr0, len0, serialized_size_limit);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheInt160.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class CompactFheInt160List {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CompactFheInt160List.prototype);
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
        wasm.__wbg_compactfheint160list_free(ptr);
    }
    /**
     * @param {any[]} values
     * @param {TfheCompactPublicKey} public_key
     * @returns {CompactFheInt160List}
     */
    static encrypt_with_compact_public_key(values, public_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArrayJsValueToWasm0(values, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            _assertClass(public_key, TfheCompactPublicKey);
            wasm.compactfheint160list_encrypt_with_compact_public_key(retptr, ptr0, len0, public_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheInt160List.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {any[]}
     */
    expand() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheint160list_expand(retptr, this.__wbg_ptr);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheint160list_serialize(retptr, this.__wbg_ptr);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @returns {CompactFheInt160List}
     */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compactfheint160list_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheInt160List.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class CompactFheInt16List {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CompactFheInt16List.prototype);
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
        wasm.__wbg_compactfheint16list_free(ptr);
    }
    /**
     * @returns {any[]}
     */
    expand() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheint16list_expand(retptr, this.__wbg_ptr);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheint16list_serialize(retptr, this.__wbg_ptr);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @returns {CompactFheInt16List}
     */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compactfheint16list_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheInt16List.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class CompactFheInt256 {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CompactFheInt256.prototype);
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
        wasm.__wbg_compactfheint256_free(ptr);
    }
    /**
     * @param {any} value
     * @param {TfheCompactPublicKey} client_key
     * @returns {CompactFheInt256}
     */
    static encrypt_with_compact_public_key(value, client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheCompactPublicKey);
            wasm.compactfheint256_encrypt_with_compact_public_key(retptr, addHeapObject(value), client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheInt256.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {FheInt256}
     */
    expand() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheint128_expand(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheInt256.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheint256_serialize(retptr, this.__wbg_ptr);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @returns {CompactFheInt256}
     */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compactfheint256_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheInt256.__wrap(r0);
        }
        finally {
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
            wasm.compactfheint256_safe_serialize(retptr, this.__wbg_ptr, serialized_size_limit);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {CompactFheInt256}
     */
    static safe_deserialize(buffer, serialized_size_limit) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compactfheint256_safe_deserialize(retptr, ptr0, len0, serialized_size_limit);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheInt256.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class CompactFheInt256List {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CompactFheInt256List.prototype);
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
        wasm.__wbg_compactfheint256list_free(ptr);
    }
    /**
     * @param {any[]} values
     * @param {TfheCompactPublicKey} public_key
     * @returns {CompactFheInt256List}
     */
    static encrypt_with_compact_public_key(values, public_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArrayJsValueToWasm0(values, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            _assertClass(public_key, TfheCompactPublicKey);
            wasm.compactfheint256list_encrypt_with_compact_public_key(retptr, ptr0, len0, public_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheInt256List.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {any[]}
     */
    expand() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheint256list_expand(retptr, this.__wbg_ptr);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheint256list_serialize(retptr, this.__wbg_ptr);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @returns {CompactFheInt256List}
     */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compactfheint256list_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheInt256List.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class CompactFheInt32 {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CompactFheInt32.prototype);
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
        wasm.__wbg_compactfheint32_free(ptr);
    }
    /**
     * @param {number} value
     * @param {TfheCompactPublicKey} client_key
     * @returns {CompactFheInt32}
     */
    static encrypt_with_compact_public_key(value, client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheCompactPublicKey);
            wasm.compactfheint32_encrypt_with_compact_public_key(retptr, value, client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheInt32.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {FheInt32}
     */
    expand() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheint128_expand(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheInt32.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheint32_serialize(retptr, this.__wbg_ptr);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @returns {CompactFheInt32}
     */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compactfheint32_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheInt32.__wrap(r0);
        }
        finally {
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
            wasm.compactfheint32_safe_serialize(retptr, this.__wbg_ptr, serialized_size_limit);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {CompactFheInt32}
     */
    static safe_deserialize(buffer, serialized_size_limit) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compactfheint32_safe_deserialize(retptr, ptr0, len0, serialized_size_limit);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheInt32.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class CompactFheInt32List {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CompactFheInt32List.prototype);
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
        wasm.__wbg_compactfheint32list_free(ptr);
    }
    /**
     * @returns {any[]}
     */
    expand() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheint32list_expand(retptr, this.__wbg_ptr);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheint32list_serialize(retptr, this.__wbg_ptr);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @returns {CompactFheInt32List}
     */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compactfheint32list_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheInt32List.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class CompactFheInt64 {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CompactFheInt64.prototype);
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
        wasm.__wbg_compactfheint64_free(ptr);
    }
    /**
     * @param {bigint} value
     * @param {TfheCompactPublicKey} client_key
     * @returns {CompactFheInt64}
     */
    static encrypt_with_compact_public_key(value, client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheCompactPublicKey);
            wasm.compactfheint64_encrypt_with_compact_public_key(retptr, value, client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheInt64.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {FheInt64}
     */
    expand() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheint128_expand(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheInt64.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheint64_serialize(retptr, this.__wbg_ptr);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @returns {CompactFheInt64}
     */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compactfheint64_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheInt64.__wrap(r0);
        }
        finally {
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
            wasm.compactfheint64_safe_serialize(retptr, this.__wbg_ptr, serialized_size_limit);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {CompactFheInt64}
     */
    static safe_deserialize(buffer, serialized_size_limit) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compactfheint64_safe_deserialize(retptr, ptr0, len0, serialized_size_limit);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheInt64.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class CompactFheInt64List {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CompactFheInt64List.prototype);
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
        wasm.__wbg_compactfheint64list_free(ptr);
    }
    /**
     * @returns {any[]}
     */
    expand() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheint64list_expand(retptr, this.__wbg_ptr);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheint64list_serialize(retptr, this.__wbg_ptr);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @returns {CompactFheInt64List}
     */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compactfheint64list_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheInt64List.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class CompactFheInt8 {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CompactFheInt8.prototype);
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
        wasm.__wbg_compactfheint8_free(ptr);
    }
    /**
     * @param {number} value
     * @param {TfheCompactPublicKey} client_key
     * @returns {CompactFheInt8}
     */
    static encrypt_with_compact_public_key(value, client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheCompactPublicKey);
            wasm.compactfheint8_encrypt_with_compact_public_key(retptr, value, client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheInt8.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {FheInt8}
     */
    expand() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheint128_expand(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheInt8.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheint8_serialize(retptr, this.__wbg_ptr);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @returns {CompactFheInt8}
     */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compactfheint8_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheInt8.__wrap(r0);
        }
        finally {
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
            wasm.compactfheint8_safe_serialize(retptr, this.__wbg_ptr, serialized_size_limit);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {CompactFheInt8}
     */
    static safe_deserialize(buffer, serialized_size_limit) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compactfheint8_safe_deserialize(retptr, ptr0, len0, serialized_size_limit);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheInt8.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class CompactFheInt8List {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CompactFheInt8List.prototype);
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
        wasm.__wbg_compactfheint8list_free(ptr);
    }
    /**
     * @returns {any[]}
     */
    expand() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheint8list_expand(retptr, this.__wbg_ptr);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheint8list_serialize(retptr, this.__wbg_ptr);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @returns {CompactFheInt8List}
     */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compactfheint8list_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheInt8List.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class CompactFheUint128 {
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {FheUint128}
     */
    expand() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheint128_expand(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint128.__wrap(r0);
        }
        finally {
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
        }
        finally {
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
        }
        finally {
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
        }
        finally {
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class CompactFheUint128List {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CompactFheUint128List.prototype);
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
        wasm.__wbg_compactfheuint128list_free(ptr);
    }
    /**
     * @param {any[]} values
     * @param {TfheCompactPublicKey} public_key
     * @returns {CompactFheUint128List}
     */
    static encrypt_with_compact_public_key(values, public_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArrayJsValueToWasm0(values, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            _assertClass(public_key, TfheCompactPublicKey);
            wasm.compactfheuint128list_encrypt_with_compact_public_key(retptr, ptr0, len0, public_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheUint128List.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {any[]}
     */
    expand() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheuint128list_expand(retptr, this.__wbg_ptr);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheuint128list_serialize(retptr, this.__wbg_ptr);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @returns {CompactFheUint128List}
     */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compactfheuint128list_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheUint128List.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class CompactFheUint16 {
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {FheUint16}
     */
    expand() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheint128_expand(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint16.__wrap(r0);
        }
        finally {
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
        }
        finally {
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
        }
        finally {
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
        }
        finally {
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class CompactFheUint160 {
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {FheUint160}
     */
    expand() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheint128_expand(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint160.__wrap(r0);
        }
        finally {
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
        }
        finally {
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
        }
        finally {
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
        }
        finally {
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class CompactFheUint160List {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CompactFheUint160List.prototype);
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
        wasm.__wbg_compactfheuint160list_free(ptr);
    }
    /**
     * @param {any[]} values
     * @param {TfheCompactPublicKey} public_key
     * @returns {CompactFheUint160List}
     */
    static encrypt_with_compact_public_key(values, public_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArrayJsValueToWasm0(values, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            _assertClass(public_key, TfheCompactPublicKey);
            wasm.compactfheuint160list_encrypt_with_compact_public_key(retptr, ptr0, len0, public_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheUint160List.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {any[]}
     */
    expand() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheuint160list_expand(retptr, this.__wbg_ptr);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheuint160list_serialize(retptr, this.__wbg_ptr);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @returns {CompactFheUint160List}
     */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compactfheuint160list_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheUint160List.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class CompactFheUint16List {
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
        }
        finally {
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
        }
        finally {
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class CompactFheUint256 {
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {FheUint256}
     */
    expand() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheint128_expand(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint256.__wrap(r0);
        }
        finally {
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
        }
        finally {
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
        }
        finally {
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
        }
        finally {
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class CompactFheUint256List {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CompactFheUint256List.prototype);
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
        wasm.__wbg_compactfheuint256list_free(ptr);
    }
    /**
     * @param {any[]} values
     * @param {TfheCompactPublicKey} public_key
     * @returns {CompactFheUint256List}
     */
    static encrypt_with_compact_public_key(values, public_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArrayJsValueToWasm0(values, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            _assertClass(public_key, TfheCompactPublicKey);
            wasm.compactfheuint256list_encrypt_with_compact_public_key(retptr, ptr0, len0, public_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheUint256List.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {any[]}
     */
    expand() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheuint256list_expand(retptr, this.__wbg_ptr);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheuint256list_serialize(retptr, this.__wbg_ptr);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @returns {CompactFheUint256List}
     */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compactfheuint256list_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompactFheUint256List.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class CompactFheUint32 {
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {FheUint32}
     */
    expand() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheint128_expand(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint32.__wrap(r0);
        }
        finally {
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
        }
        finally {
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
        }
        finally {
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
        }
        finally {
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class CompactFheUint32List {
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
        }
        finally {
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
        }
        finally {
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class CompactFheUint64 {
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {FheUint64}
     */
    expand() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheint128_expand(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint64.__wrap(r0);
        }
        finally {
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
        }
        finally {
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
        }
        finally {
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
        }
        finally {
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class CompactFheUint64List {
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
        }
        finally {
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
        }
        finally {
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class CompactFheUint8 {
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {FheUint8}
     */
    expand() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compactfheint128_expand(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint8.__wrap(r0);
        }
        finally {
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
        }
        finally {
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
        }
        finally {
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
        }
        finally {
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class CompactFheUint8List {
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
        }
        finally {
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
        }
        finally {
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class CompressedFheBool {
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
        }
        finally {
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
        }
        finally {
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
        }
        finally {
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
        }
        finally {
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
        }
        finally {
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class CompressedFheInt128 {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CompressedFheInt128.prototype);
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
        wasm.__wbg_compressedfheint128_free(ptr);
    }
    /**
     * @param {any} value
     * @param {TfheClientKey} client_key
     * @returns {CompressedFheInt128}
     */
    static encrypt_with_client_key(value, client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheClientKey);
            wasm.compressedfheint128_encrypt_with_client_key(retptr, addHeapObject(value), client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompressedFheInt128.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {FheInt128}
     */
    decompress() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compressedfheint128_decompress(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheInt128.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compressedfheint128_serialize(retptr, this.__wbg_ptr);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @returns {CompressedFheInt128}
     */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compressedfheint128_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompressedFheInt128.__wrap(r0);
        }
        finally {
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
            wasm.compressedfheint128_safe_serialize(retptr, this.__wbg_ptr, serialized_size_limit);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {CompressedFheInt128}
     */
    static safe_deserialize(buffer, serialized_size_limit) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compressedfheint128_safe_deserialize(retptr, ptr0, len0, serialized_size_limit);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompressedFheInt128.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class CompressedFheInt16 {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CompressedFheInt16.prototype);
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
        wasm.__wbg_compressedfheint16_free(ptr);
    }
    /**
     * @param {number} value
     * @param {TfheClientKey} client_key
     * @returns {CompressedFheInt16}
     */
    static encrypt_with_client_key(value, client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheClientKey);
            wasm.compressedfheint16_encrypt_with_client_key(retptr, value, client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompressedFheInt16.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {FheInt16}
     */
    decompress() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compressedfheint16_decompress(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheInt16.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compressedfheint16_serialize(retptr, this.__wbg_ptr);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @returns {CompressedFheInt16}
     */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compressedfheint16_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompressedFheInt16.__wrap(r0);
        }
        finally {
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
            wasm.compressedfheint16_safe_serialize(retptr, this.__wbg_ptr, serialized_size_limit);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {CompressedFheInt16}
     */
    static safe_deserialize(buffer, serialized_size_limit) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compressedfheint16_safe_deserialize(retptr, ptr0, len0, serialized_size_limit);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompressedFheInt16.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class CompressedFheInt160 {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CompressedFheInt160.prototype);
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
        wasm.__wbg_compressedfheint160_free(ptr);
    }
    /**
     * @param {any} value
     * @param {TfheClientKey} client_key
     * @returns {CompressedFheInt160}
     */
    static encrypt_with_client_key(value, client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheClientKey);
            wasm.compressedfheint160_encrypt_with_client_key(retptr, addHeapObject(value), client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompressedFheInt160.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {FheInt160}
     */
    decompress() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compressedfheint160_decompress(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheInt160.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compressedfheint160_serialize(retptr, this.__wbg_ptr);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @returns {CompressedFheInt160}
     */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compressedfheint160_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompressedFheInt160.__wrap(r0);
        }
        finally {
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
            wasm.compressedfheint160_safe_serialize(retptr, this.__wbg_ptr, serialized_size_limit);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {CompressedFheInt160}
     */
    static safe_deserialize(buffer, serialized_size_limit) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compressedfheint160_safe_deserialize(retptr, ptr0, len0, serialized_size_limit);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompressedFheInt160.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class CompressedFheInt256 {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CompressedFheInt256.prototype);
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
        wasm.__wbg_compressedfheint256_free(ptr);
    }
    /**
     * @param {any} value
     * @param {TfheClientKey} client_key
     * @returns {CompressedFheInt256}
     */
    static encrypt_with_client_key(value, client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheClientKey);
            wasm.compressedfheint256_encrypt_with_client_key(retptr, addHeapObject(value), client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompressedFheInt256.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {FheInt256}
     */
    decompress() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compressedfheint256_decompress(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheInt256.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compressedfheint256_serialize(retptr, this.__wbg_ptr);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @returns {CompressedFheInt256}
     */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compressedfheint256_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompressedFheInt256.__wrap(r0);
        }
        finally {
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
            wasm.compressedfheint256_safe_serialize(retptr, this.__wbg_ptr, serialized_size_limit);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {CompressedFheInt256}
     */
    static safe_deserialize(buffer, serialized_size_limit) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compressedfheint256_safe_deserialize(retptr, ptr0, len0, serialized_size_limit);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompressedFheInt256.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class CompressedFheInt32 {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CompressedFheInt32.prototype);
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
        wasm.__wbg_compressedfheint32_free(ptr);
    }
    /**
     * @param {number} value
     * @param {TfheClientKey} client_key
     * @returns {CompressedFheInt32}
     */
    static encrypt_with_client_key(value, client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheClientKey);
            wasm.compressedfheint32_encrypt_with_client_key(retptr, value, client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompressedFheInt32.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {FheInt32}
     */
    decompress() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compressedfheint32_decompress(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheInt32.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compressedfheint32_serialize(retptr, this.__wbg_ptr);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @returns {CompressedFheInt32}
     */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compressedfheint32_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompressedFheInt32.__wrap(r0);
        }
        finally {
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
            wasm.compressedfheint32_safe_serialize(retptr, this.__wbg_ptr, serialized_size_limit);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {CompressedFheInt32}
     */
    static safe_deserialize(buffer, serialized_size_limit) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compressedfheint32_safe_deserialize(retptr, ptr0, len0, serialized_size_limit);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompressedFheInt32.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class CompressedFheInt64 {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CompressedFheInt64.prototype);
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
        wasm.__wbg_compressedfheint64_free(ptr);
    }
    /**
     * @param {bigint} value
     * @param {TfheClientKey} client_key
     * @returns {CompressedFheInt64}
     */
    static encrypt_with_client_key(value, client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheClientKey);
            wasm.compressedfheint64_encrypt_with_client_key(retptr, value, client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompressedFheInt64.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {FheInt64}
     */
    decompress() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compressedfheint64_decompress(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheInt64.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compressedfheint64_serialize(retptr, this.__wbg_ptr);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @returns {CompressedFheInt64}
     */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compressedfheint64_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompressedFheInt64.__wrap(r0);
        }
        finally {
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
            wasm.compressedfheint64_safe_serialize(retptr, this.__wbg_ptr, serialized_size_limit);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {CompressedFheInt64}
     */
    static safe_deserialize(buffer, serialized_size_limit) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compressedfheint64_safe_deserialize(retptr, ptr0, len0, serialized_size_limit);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompressedFheInt64.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class CompressedFheInt8 {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CompressedFheInt8.prototype);
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
        wasm.__wbg_compressedfheint8_free(ptr);
    }
    /**
     * @param {number} value
     * @param {TfheClientKey} client_key
     * @returns {CompressedFheInt8}
     */
    static encrypt_with_client_key(value, client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheClientKey);
            wasm.compressedfheint8_encrypt_with_client_key(retptr, value, client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompressedFheInt8.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {FheInt8}
     */
    decompress() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compressedfheint8_decompress(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheInt8.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compressedfheint8_serialize(retptr, this.__wbg_ptr);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @returns {CompressedFheInt8}
     */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compressedfheint8_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompressedFheInt8.__wrap(r0);
        }
        finally {
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
            wasm.compressedfheint8_safe_serialize(retptr, this.__wbg_ptr, serialized_size_limit);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {CompressedFheInt8}
     */
    static safe_deserialize(buffer, serialized_size_limit) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compressedfheint8_safe_deserialize(retptr, ptr0, len0, serialized_size_limit);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompressedFheInt8.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class CompressedFheUint128 {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CompressedFheUint128.prototype);
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
        wasm.__wbg_compressedfheuint128_free(ptr);
    }
    /**
     * @param {any} value
     * @param {TfheClientKey} client_key
     * @returns {CompressedFheUint128}
     */
    static encrypt_with_client_key(value, client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheClientKey);
            wasm.compressedfheuint128_encrypt_with_client_key(retptr, addHeapObject(value), client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompressedFheUint128.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {FheUint128}
     */
    decompress() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compressedfheuint128_decompress(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint128.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compressedfheuint128_serialize(retptr, this.__wbg_ptr);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @returns {CompressedFheUint128}
     */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compressedfheuint128_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompressedFheUint128.__wrap(r0);
        }
        finally {
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
            wasm.compressedfheuint128_safe_serialize(retptr, this.__wbg_ptr, serialized_size_limit);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {CompressedFheUint128}
     */
    static safe_deserialize(buffer, serialized_size_limit) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compressedfheuint128_safe_deserialize(retptr, ptr0, len0, serialized_size_limit);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompressedFheUint128.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class CompressedFheUint16 {
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
        }
        finally {
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
        }
        finally {
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
        }
        finally {
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
        }
        finally {
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
        }
        finally {
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class CompressedFheUint160 {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CompressedFheUint160.prototype);
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
        wasm.__wbg_compressedfheuint160_free(ptr);
    }
    /**
     * @param {any} value
     * @param {TfheClientKey} client_key
     * @returns {CompressedFheUint160}
     */
    static encrypt_with_client_key(value, client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheClientKey);
            wasm.compressedfheuint160_encrypt_with_client_key(retptr, addHeapObject(value), client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompressedFheUint160.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {FheUint160}
     */
    decompress() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compressedfheuint160_decompress(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint160.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compressedfheuint160_serialize(retptr, this.__wbg_ptr);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @returns {CompressedFheUint160}
     */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compressedfheuint160_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompressedFheUint160.__wrap(r0);
        }
        finally {
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
            wasm.compressedfheuint160_safe_serialize(retptr, this.__wbg_ptr, serialized_size_limit);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {CompressedFheUint160}
     */
    static safe_deserialize(buffer, serialized_size_limit) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compressedfheuint160_safe_deserialize(retptr, ptr0, len0, serialized_size_limit);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompressedFheUint160.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class CompressedFheUint256 {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CompressedFheUint256.prototype);
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
        wasm.__wbg_compressedfheuint256_free(ptr);
    }
    /**
     * @param {any} value
     * @param {TfheClientKey} client_key
     * @returns {CompressedFheUint256}
     */
    static encrypt_with_client_key(value, client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheClientKey);
            wasm.compressedfheuint256_encrypt_with_client_key(retptr, addHeapObject(value), client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompressedFheUint256.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {FheUint256}
     */
    decompress() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compressedfheuint256_decompress(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint256.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.compressedfheuint256_serialize(retptr, this.__wbg_ptr);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @returns {CompressedFheUint256}
     */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compressedfheuint256_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompressedFheUint256.__wrap(r0);
        }
        finally {
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
            wasm.compressedfheuint256_safe_serialize(retptr, this.__wbg_ptr, serialized_size_limit);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {CompressedFheUint256}
     */
    static safe_deserialize(buffer, serialized_size_limit) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.compressedfheuint256_safe_deserialize(retptr, ptr0, len0, serialized_size_limit);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CompressedFheUint256.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class CompressedFheUint32 {
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
        }
        finally {
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
        }
        finally {
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
        }
        finally {
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
        }
        finally {
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
        }
        finally {
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class CompressedFheUint64 {
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
        }
        finally {
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
        }
        finally {
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
        }
        finally {
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
        }
        finally {
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
        }
        finally {
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class CompressedFheUint8 {
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
        }
        finally {
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
        }
        finally {
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
        }
        finally {
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
        }
        finally {
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
        }
        finally {
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class FheBool {
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
     * @param {TfheClientKey} client_key
     * @returns {FheBool}
     */
    static encrypt_with_client_key(value, client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheClientKey);
            wasm.fhebool_encrypt_with_client_key(retptr, value, client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheBool.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {boolean} value
     * @param {TfhePublicKey} public_key
     * @returns {FheBool}
     */
    static encrypt_with_public_key(value, public_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(public_key, TfhePublicKey);
            wasm.fhebool_encrypt_with_public_key(retptr, value, public_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheBool.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {boolean} value
     * @param {TfheCompressedPublicKey} compressed_public_key
     * @returns {FheBool}
     */
    static encrypt_with_compressed_public_key(value, compressed_public_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(compressed_public_key, TfheCompressedPublicKey);
            wasm.fhebool_encrypt_with_compressed_public_key(retptr, value, compressed_public_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheBool.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {TfheClientKey} client_key
     * @returns {boolean}
     */
    decrypt(client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheClientKey);
            wasm.fhebool_decrypt(retptr, this.__wbg_ptr, client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return r0 !== 0;
        }
        finally {
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @returns {FheBool}
     */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.fhebool_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheBool.__wrap(r0);
        }
        finally {
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
            wasm.fhebool_safe_serialize(retptr, this.__wbg_ptr, serialized_size_limit);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {FheBool}
     */
    static safe_deserialize(buffer, serialized_size_limit) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.fhebool_safe_deserialize(retptr, ptr0, len0, serialized_size_limit);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheBool.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class FheInt128 {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(FheInt128.prototype);
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
        wasm.__wbg_fheint128_free(ptr);
    }
    /**
     * @param {any} value
     * @param {TfheClientKey} client_key
     * @returns {FheInt128}
     */
    static encrypt_with_client_key(value, client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheClientKey);
            wasm.fheint128_encrypt_with_client_key(retptr, addHeapObject(value), client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheInt128.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {any} value
     * @param {TfhePublicKey} public_key
     * @returns {FheInt128}
     */
    static encrypt_with_public_key(value, public_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(public_key, TfhePublicKey);
            wasm.fheint128_encrypt_with_public_key(retptr, addHeapObject(value), public_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheInt128.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {any} value
     * @param {TfheCompressedPublicKey} compressed_public_key
     * @returns {FheInt128}
     */
    static encrypt_with_compressed_public_key(value, compressed_public_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(compressed_public_key, TfheCompressedPublicKey);
            wasm.fheint128_encrypt_with_compressed_public_key(retptr, addHeapObject(value), compressed_public_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheInt128.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {any} value
     * @param {TfheCompactPublicKey} compact_public_key
     * @returns {FheInt128}
     */
    static encrypt_with_compact_public_key(value, compact_public_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(compact_public_key, TfheCompactPublicKey);
            wasm.fheint128_encrypt_with_compact_public_key(retptr, addHeapObject(value), compact_public_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheInt128.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {TfheClientKey} client_key
     * @returns {any}
     */
    decrypt(client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheClientKey);
            wasm.fheint128_decrypt(retptr, this.__wbg_ptr, client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.fheint128_serialize(retptr, this.__wbg_ptr);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @returns {FheInt128}
     */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.fheint128_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheInt128.__wrap(r0);
        }
        finally {
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
            wasm.fheint128_safe_serialize(retptr, this.__wbg_ptr, serialized_size_limit);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {FheInt128}
     */
    static safe_deserialize(buffer, serialized_size_limit) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.fheint128_safe_deserialize(retptr, ptr0, len0, serialized_size_limit);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheInt128.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class FheInt16 {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(FheInt16.prototype);
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
        wasm.__wbg_fheint16_free(ptr);
    }
    /**
     * @param {number} value
     * @param {TfheClientKey} client_key
     * @returns {FheInt16}
     */
    static encrypt_with_client_key(value, client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheClientKey);
            wasm.fheint16_encrypt_with_client_key(retptr, value, client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheInt16.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {number} value
     * @param {TfhePublicKey} public_key
     * @returns {FheInt16}
     */
    static encrypt_with_public_key(value, public_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(public_key, TfhePublicKey);
            wasm.fheint16_encrypt_with_public_key(retptr, value, public_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheInt16.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {number} value
     * @param {TfheCompressedPublicKey} compressed_public_key
     * @returns {FheInt16}
     */
    static encrypt_with_compressed_public_key(value, compressed_public_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(compressed_public_key, TfheCompressedPublicKey);
            wasm.fheint16_encrypt_with_compressed_public_key(retptr, value, compressed_public_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheInt16.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {number} value
     * @param {TfheCompactPublicKey} compact_public_key
     * @returns {FheInt16}
     */
    static encrypt_with_compact_public_key(value, compact_public_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(compact_public_key, TfheCompactPublicKey);
            wasm.fheint16_encrypt_with_compact_public_key(retptr, value, compact_public_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheInt16.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {TfheClientKey} client_key
     * @returns {number}
     */
    decrypt(client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheClientKey);
            wasm.fheint16_decrypt(retptr, this.__wbg_ptr, client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return r0;
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.fheint16_serialize(retptr, this.__wbg_ptr);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @returns {FheInt16}
     */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.fheint16_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheInt16.__wrap(r0);
        }
        finally {
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
            wasm.fheint16_safe_serialize(retptr, this.__wbg_ptr, serialized_size_limit);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {FheInt16}
     */
    static safe_deserialize(buffer, serialized_size_limit) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.fheint16_safe_deserialize(retptr, ptr0, len0, serialized_size_limit);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheInt16.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class FheInt160 {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(FheInt160.prototype);
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
        wasm.__wbg_fheint160_free(ptr);
    }
    /**
     * @param {any} value
     * @param {TfheClientKey} client_key
     * @returns {FheInt160}
     */
    static encrypt_with_client_key(value, client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheClientKey);
            wasm.fheint160_encrypt_with_client_key(retptr, addHeapObject(value), client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheInt160.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {any} value
     * @param {TfhePublicKey} public_key
     * @returns {FheInt160}
     */
    static encrypt_with_public_key(value, public_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(public_key, TfhePublicKey);
            wasm.fheint160_encrypt_with_public_key(retptr, addHeapObject(value), public_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheInt160.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {any} value
     * @param {TfheCompressedPublicKey} compressed_public_key
     * @returns {FheInt160}
     */
    static encrypt_with_compressed_public_key(value, compressed_public_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(compressed_public_key, TfheCompressedPublicKey);
            wasm.fheint160_encrypt_with_compressed_public_key(retptr, addHeapObject(value), compressed_public_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheInt160.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {any} value
     * @param {TfheCompactPublicKey} compact_public_key
     * @returns {FheInt160}
     */
    static encrypt_with_compact_public_key(value, compact_public_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(compact_public_key, TfheCompactPublicKey);
            wasm.fheint160_encrypt_with_compact_public_key(retptr, addHeapObject(value), compact_public_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheInt160.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {TfheClientKey} client_key
     * @returns {any}
     */
    decrypt(client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheClientKey);
            wasm.fheint160_decrypt(retptr, this.__wbg_ptr, client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.fheint160_serialize(retptr, this.__wbg_ptr);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @returns {FheInt160}
     */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.fheint160_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheInt160.__wrap(r0);
        }
        finally {
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
            wasm.fheint160_safe_serialize(retptr, this.__wbg_ptr, serialized_size_limit);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {FheInt160}
     */
    static safe_deserialize(buffer, serialized_size_limit) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.fheint160_safe_deserialize(retptr, ptr0, len0, serialized_size_limit);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheInt160.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class FheInt256 {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(FheInt256.prototype);
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
        wasm.__wbg_fheint256_free(ptr);
    }
    /**
     * @param {any} value
     * @param {TfheClientKey} client_key
     * @returns {FheInt256}
     */
    static encrypt_with_client_key(value, client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheClientKey);
            wasm.fheint256_encrypt_with_client_key(retptr, addHeapObject(value), client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheInt256.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {any} value
     * @param {TfhePublicKey} public_key
     * @returns {FheInt256}
     */
    static encrypt_with_public_key(value, public_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(public_key, TfhePublicKey);
            wasm.fheint256_encrypt_with_public_key(retptr, addHeapObject(value), public_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheInt256.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {any} value
     * @param {TfheCompressedPublicKey} compressed_public_key
     * @returns {FheInt256}
     */
    static encrypt_with_compressed_public_key(value, compressed_public_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(compressed_public_key, TfheCompressedPublicKey);
            wasm.fheint256_encrypt_with_compressed_public_key(retptr, addHeapObject(value), compressed_public_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheInt256.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {any} value
     * @param {TfheCompactPublicKey} compact_public_key
     * @returns {FheInt256}
     */
    static encrypt_with_compact_public_key(value, compact_public_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(compact_public_key, TfheCompactPublicKey);
            wasm.fheint256_encrypt_with_compact_public_key(retptr, addHeapObject(value), compact_public_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheInt256.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {TfheClientKey} client_key
     * @returns {any}
     */
    decrypt(client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheClientKey);
            wasm.fheint256_decrypt(retptr, this.__wbg_ptr, client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.fheint256_serialize(retptr, this.__wbg_ptr);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @returns {FheInt256}
     */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.fheint256_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheInt256.__wrap(r0);
        }
        finally {
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
            wasm.fheint256_safe_serialize(retptr, this.__wbg_ptr, serialized_size_limit);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {FheInt256}
     */
    static safe_deserialize(buffer, serialized_size_limit) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.fheint256_safe_deserialize(retptr, ptr0, len0, serialized_size_limit);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheInt256.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class FheInt32 {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(FheInt32.prototype);
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
        wasm.__wbg_fheint32_free(ptr);
    }
    /**
     * @param {number} value
     * @param {TfheClientKey} client_key
     * @returns {FheInt32}
     */
    static encrypt_with_client_key(value, client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheClientKey);
            wasm.fheint32_encrypt_with_client_key(retptr, value, client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheInt32.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {number} value
     * @param {TfhePublicKey} public_key
     * @returns {FheInt32}
     */
    static encrypt_with_public_key(value, public_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(public_key, TfhePublicKey);
            wasm.fheint32_encrypt_with_public_key(retptr, value, public_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheInt32.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {number} value
     * @param {TfheCompressedPublicKey} compressed_public_key
     * @returns {FheInt32}
     */
    static encrypt_with_compressed_public_key(value, compressed_public_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(compressed_public_key, TfheCompressedPublicKey);
            wasm.fheint32_encrypt_with_compressed_public_key(retptr, value, compressed_public_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheInt32.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {number} value
     * @param {TfheCompactPublicKey} compact_public_key
     * @returns {FheInt32}
     */
    static encrypt_with_compact_public_key(value, compact_public_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(compact_public_key, TfheCompactPublicKey);
            wasm.fheint32_encrypt_with_compact_public_key(retptr, value, compact_public_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheInt32.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {TfheClientKey} client_key
     * @returns {number}
     */
    decrypt(client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheClientKey);
            wasm.fheint32_decrypt(retptr, this.__wbg_ptr, client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return r0;
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.fheint32_serialize(retptr, this.__wbg_ptr);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @returns {FheInt32}
     */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.fheint32_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheInt32.__wrap(r0);
        }
        finally {
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
            wasm.fheint32_safe_serialize(retptr, this.__wbg_ptr, serialized_size_limit);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {FheInt32}
     */
    static safe_deserialize(buffer, serialized_size_limit) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.fheint32_safe_deserialize(retptr, ptr0, len0, serialized_size_limit);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheInt32.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class FheInt64 {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(FheInt64.prototype);
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
        wasm.__wbg_fheint64_free(ptr);
    }
    /**
     * @param {bigint} value
     * @param {TfheClientKey} client_key
     * @returns {FheInt64}
     */
    static encrypt_with_client_key(value, client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheClientKey);
            wasm.fheint64_encrypt_with_client_key(retptr, value, client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheInt64.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {bigint} value
     * @param {TfhePublicKey} public_key
     * @returns {FheInt64}
     */
    static encrypt_with_public_key(value, public_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(public_key, TfhePublicKey);
            wasm.fheint64_encrypt_with_public_key(retptr, value, public_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheInt64.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {bigint} value
     * @param {TfheCompressedPublicKey} compressed_public_key
     * @returns {FheInt64}
     */
    static encrypt_with_compressed_public_key(value, compressed_public_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(compressed_public_key, TfheCompressedPublicKey);
            wasm.fheint64_encrypt_with_compressed_public_key(retptr, value, compressed_public_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheInt64.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {bigint} value
     * @param {TfheCompactPublicKey} compact_public_key
     * @returns {FheInt64}
     */
    static encrypt_with_compact_public_key(value, compact_public_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(compact_public_key, TfheCompactPublicKey);
            wasm.fheint64_encrypt_with_compact_public_key(retptr, value, compact_public_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheInt64.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {TfheClientKey} client_key
     * @returns {bigint}
     */
    decrypt(client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheClientKey);
            wasm.fheint64_decrypt(retptr, this.__wbg_ptr, client_key.__wbg_ptr);
            var r0 = getBigInt64Memory0()[retptr / 8 + 0];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            return r0;
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.fheint64_serialize(retptr, this.__wbg_ptr);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @returns {FheInt64}
     */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.fheint64_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheInt64.__wrap(r0);
        }
        finally {
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
            wasm.fheint64_safe_serialize(retptr, this.__wbg_ptr, serialized_size_limit);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {FheInt64}
     */
    static safe_deserialize(buffer, serialized_size_limit) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.fheint64_safe_deserialize(retptr, ptr0, len0, serialized_size_limit);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheInt64.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class FheInt8 {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(FheInt8.prototype);
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
        wasm.__wbg_fheint8_free(ptr);
    }
    /**
     * @param {number} value
     * @param {TfheClientKey} client_key
     * @returns {FheInt8}
     */
    static encrypt_with_client_key(value, client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheClientKey);
            wasm.fheint8_encrypt_with_client_key(retptr, value, client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheInt8.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {number} value
     * @param {TfhePublicKey} public_key
     * @returns {FheInt8}
     */
    static encrypt_with_public_key(value, public_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(public_key, TfhePublicKey);
            wasm.fheint8_encrypt_with_public_key(retptr, value, public_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheInt8.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {number} value
     * @param {TfheCompressedPublicKey} compressed_public_key
     * @returns {FheInt8}
     */
    static encrypt_with_compressed_public_key(value, compressed_public_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(compressed_public_key, TfheCompressedPublicKey);
            wasm.fheint8_encrypt_with_compressed_public_key(retptr, value, compressed_public_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheInt8.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {number} value
     * @param {TfheCompactPublicKey} compact_public_key
     * @returns {FheInt8}
     */
    static encrypt_with_compact_public_key(value, compact_public_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(compact_public_key, TfheCompactPublicKey);
            wasm.fheint8_encrypt_with_compact_public_key(retptr, value, compact_public_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheInt8.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {TfheClientKey} client_key
     * @returns {number}
     */
    decrypt(client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheClientKey);
            wasm.fheint8_decrypt(retptr, this.__wbg_ptr, client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return r0;
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.fheint8_serialize(retptr, this.__wbg_ptr);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @returns {FheInt8}
     */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.fheint8_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheInt8.__wrap(r0);
        }
        finally {
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
            wasm.fheint8_safe_serialize(retptr, this.__wbg_ptr, serialized_size_limit);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {FheInt8}
     */
    static safe_deserialize(buffer, serialized_size_limit) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.fheint8_safe_deserialize(retptr, ptr0, len0, serialized_size_limit);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheInt8.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class FheUint128 {
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
     * @param {TfheClientKey} client_key
     * @returns {FheUint128}
     */
    static encrypt_with_client_key(value, client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheClientKey);
            wasm.fheuint128_encrypt_with_client_key(retptr, addHeapObject(value), client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint128.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {any} value
     * @param {TfhePublicKey} public_key
     * @returns {FheUint128}
     */
    static encrypt_with_public_key(value, public_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(public_key, TfhePublicKey);
            wasm.fheuint128_encrypt_with_public_key(retptr, addHeapObject(value), public_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint128.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {any} value
     * @param {TfheCompressedPublicKey} compressed_public_key
     * @returns {FheUint128}
     */
    static encrypt_with_compressed_public_key(value, compressed_public_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(compressed_public_key, TfheCompressedPublicKey);
            wasm.fheuint128_encrypt_with_compressed_public_key(retptr, addHeapObject(value), compressed_public_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint128.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {TfheClientKey} client_key
     * @returns {any}
     */
    decrypt(client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheClientKey);
            wasm.fheuint128_decrypt(retptr, this.__wbg_ptr, client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.fheuint128_serialize(retptr, this.__wbg_ptr);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @returns {FheUint128}
     */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.fheuint128_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint128.__wrap(r0);
        }
        finally {
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
            wasm.fheuint128_safe_serialize(retptr, this.__wbg_ptr, serialized_size_limit);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {FheUint128}
     */
    static safe_deserialize(buffer, serialized_size_limit) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.fheuint128_safe_deserialize(retptr, ptr0, len0, serialized_size_limit);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint128.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class FheUint16 {
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
     * @param {TfheClientKey} client_key
     * @returns {FheUint16}
     */
    static encrypt_with_client_key(value, client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheClientKey);
            wasm.fheuint16_encrypt_with_client_key(retptr, value, client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint16.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {number} value
     * @param {TfhePublicKey} public_key
     * @returns {FheUint16}
     */
    static encrypt_with_public_key(value, public_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(public_key, TfhePublicKey);
            wasm.fheuint16_encrypt_with_public_key(retptr, value, public_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint16.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {number} value
     * @param {TfheCompressedPublicKey} compressed_public_key
     * @returns {FheUint16}
     */
    static encrypt_with_compressed_public_key(value, compressed_public_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(compressed_public_key, TfheCompressedPublicKey);
            wasm.fheuint16_encrypt_with_compressed_public_key(retptr, value, compressed_public_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint16.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {TfheClientKey} client_key
     * @returns {number}
     */
    decrypt(client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheClientKey);
            wasm.fheuint16_decrypt(retptr, this.__wbg_ptr, client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return r0;
        }
        finally {
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @returns {FheUint16}
     */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.fheuint16_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint16.__wrap(r0);
        }
        finally {
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
            wasm.fheuint16_safe_serialize(retptr, this.__wbg_ptr, serialized_size_limit);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {FheUint16}
     */
    static safe_deserialize(buffer, serialized_size_limit) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.fheuint16_safe_deserialize(retptr, ptr0, len0, serialized_size_limit);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint16.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class FheUint160 {
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
     * @param {TfheClientKey} client_key
     * @returns {FheUint160}
     */
    static encrypt_with_client_key(value, client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheClientKey);
            wasm.fheuint160_encrypt_with_client_key(retptr, addHeapObject(value), client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint160.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {any} value
     * @param {TfhePublicKey} public_key
     * @returns {FheUint160}
     */
    static encrypt_with_public_key(value, public_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(public_key, TfhePublicKey);
            wasm.fheuint160_encrypt_with_public_key(retptr, addHeapObject(value), public_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint160.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {any} value
     * @param {TfheCompressedPublicKey} compressed_public_key
     * @returns {FheUint160}
     */
    static encrypt_with_compressed_public_key(value, compressed_public_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(compressed_public_key, TfheCompressedPublicKey);
            wasm.fheuint160_encrypt_with_compressed_public_key(retptr, addHeapObject(value), compressed_public_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint160.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {TfheClientKey} client_key
     * @returns {any}
     */
    decrypt(client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheClientKey);
            wasm.fheuint160_decrypt(retptr, this.__wbg_ptr, client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.fheuint160_serialize(retptr, this.__wbg_ptr);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @returns {FheUint160}
     */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.fheuint160_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint160.__wrap(r0);
        }
        finally {
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
            wasm.fheuint160_safe_serialize(retptr, this.__wbg_ptr, serialized_size_limit);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {FheUint160}
     */
    static safe_deserialize(buffer, serialized_size_limit) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.fheuint160_safe_deserialize(retptr, ptr0, len0, serialized_size_limit);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint160.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class FheUint256 {
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
     * @param {TfheClientKey} client_key
     * @returns {FheUint256}
     */
    static encrypt_with_client_key(value, client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheClientKey);
            wasm.fheuint256_encrypt_with_client_key(retptr, addHeapObject(value), client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint256.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {any} value
     * @param {TfhePublicKey} public_key
     * @returns {FheUint256}
     */
    static encrypt_with_public_key(value, public_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(public_key, TfhePublicKey);
            wasm.fheuint256_encrypt_with_public_key(retptr, addHeapObject(value), public_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint256.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {any} value
     * @param {TfheCompressedPublicKey} compressed_public_key
     * @returns {FheUint256}
     */
    static encrypt_with_compressed_public_key(value, compressed_public_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(compressed_public_key, TfheCompressedPublicKey);
            wasm.fheuint256_encrypt_with_compressed_public_key(retptr, addHeapObject(value), compressed_public_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint256.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {TfheClientKey} client_key
     * @returns {any}
     */
    decrypt(client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheClientKey);
            wasm.fheuint256_decrypt(retptr, this.__wbg_ptr, client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {Uint8Array}
     */
    serialize() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.fheuint256_serialize(retptr, this.__wbg_ptr);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @returns {FheUint256}
     */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.fheuint256_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint256.__wrap(r0);
        }
        finally {
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
            wasm.fheuint256_safe_serialize(retptr, this.__wbg_ptr, serialized_size_limit);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {FheUint256}
     */
    static safe_deserialize(buffer, serialized_size_limit) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.fheuint256_safe_deserialize(retptr, ptr0, len0, serialized_size_limit);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint256.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class FheUint32 {
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
     * @param {TfheClientKey} client_key
     * @returns {FheUint32}
     */
    static encrypt_with_client_key(value, client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheClientKey);
            wasm.fheuint32_encrypt_with_client_key(retptr, value, client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint32.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {number} value
     * @param {TfhePublicKey} public_key
     * @returns {FheUint32}
     */
    static encrypt_with_public_key(value, public_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(public_key, TfhePublicKey);
            wasm.fheuint32_encrypt_with_public_key(retptr, value, public_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint32.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {number} value
     * @param {TfheCompressedPublicKey} compressed_public_key
     * @returns {FheUint32}
     */
    static encrypt_with_compressed_public_key(value, compressed_public_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(compressed_public_key, TfheCompressedPublicKey);
            wasm.fheuint32_encrypt_with_compressed_public_key(retptr, value, compressed_public_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint32.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {TfheClientKey} client_key
     * @returns {number}
     */
    decrypt(client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheClientKey);
            wasm.fheuint32_decrypt(retptr, this.__wbg_ptr, client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return r0 >>> 0;
        }
        finally {
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @returns {FheUint32}
     */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.fheuint32_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint32.__wrap(r0);
        }
        finally {
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
            wasm.fheuint32_safe_serialize(retptr, this.__wbg_ptr, serialized_size_limit);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {FheUint32}
     */
    static safe_deserialize(buffer, serialized_size_limit) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.fheuint32_safe_deserialize(retptr, ptr0, len0, serialized_size_limit);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint32.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class FheUint64 {
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
     * @param {TfheClientKey} client_key
     * @returns {FheUint64}
     */
    static encrypt_with_client_key(value, client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheClientKey);
            wasm.fheuint64_encrypt_with_client_key(retptr, value, client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint64.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {bigint} value
     * @param {TfhePublicKey} public_key
     * @returns {FheUint64}
     */
    static encrypt_with_public_key(value, public_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(public_key, TfhePublicKey);
            wasm.fheuint64_encrypt_with_public_key(retptr, value, public_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint64.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {bigint} value
     * @param {TfheCompressedPublicKey} compressed_public_key
     * @returns {FheUint64}
     */
    static encrypt_with_compressed_public_key(value, compressed_public_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(compressed_public_key, TfheCompressedPublicKey);
            wasm.fheuint64_encrypt_with_compressed_public_key(retptr, value, compressed_public_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint64.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {TfheClientKey} client_key
     * @returns {bigint}
     */
    decrypt(client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheClientKey);
            wasm.fheuint64_decrypt(retptr, this.__wbg_ptr, client_key.__wbg_ptr);
            var r0 = getBigInt64Memory0()[retptr / 8 + 0];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            return BigInt.asUintN(64, r0);
        }
        finally {
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @returns {FheUint64}
     */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.fheuint64_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint64.__wrap(r0);
        }
        finally {
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
            wasm.fheuint64_safe_serialize(retptr, this.__wbg_ptr, serialized_size_limit);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {FheUint64}
     */
    static safe_deserialize(buffer, serialized_size_limit) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.fheuint64_safe_deserialize(retptr, ptr0, len0, serialized_size_limit);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint64.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class FheUint8 {
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
     * @param {TfheClientKey} client_key
     * @returns {FheUint8}
     */
    static encrypt_with_client_key(value, client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheClientKey);
            wasm.fheuint8_encrypt_with_client_key(retptr, value, client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint8.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {number} value
     * @param {TfhePublicKey} public_key
     * @returns {FheUint8}
     */
    static encrypt_with_public_key(value, public_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(public_key, TfhePublicKey);
            wasm.fheuint8_encrypt_with_public_key(retptr, value, public_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint8.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {number} value
     * @param {TfheCompressedPublicKey} compressed_public_key
     * @returns {FheUint8}
     */
    static encrypt_with_compressed_public_key(value, compressed_public_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(compressed_public_key, TfheCompressedPublicKey);
            wasm.fheuint8_encrypt_with_compressed_public_key(retptr, value, compressed_public_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint8.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {TfheClientKey} client_key
     * @returns {number}
     */
    decrypt(client_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(client_key, TfheClientKey);
            wasm.fheuint8_decrypt(retptr, this.__wbg_ptr, client_key.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return r0;
        }
        finally {
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @returns {FheUint8}
     */
    static deserialize(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.fheuint8_deserialize(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint8.__wrap(r0);
        }
        finally {
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
            wasm.fheuint8_safe_serialize(retptr, this.__wbg_ptr, serialized_size_limit);
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {FheUint8}
     */
    static safe_deserialize(buffer, serialized_size_limit) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.fheuint8_safe_deserialize(retptr, ptr0, len0, serialized_size_limit);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FheUint8.__wrap(r0);
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class TfheClientKey {
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
        }
        finally {
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
        }
        finally {
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
        }
        finally {
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class TfheCompactPublicKey {
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
        }
        finally {
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
        }
        finally {
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class TfheCompressedCompactPublicKey {
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
        }
        finally {
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
        }
        finally {
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
        }
        finally {
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class TfheCompressedPublicKey {
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
        }
        finally {
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
        }
        finally {
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
        }
        finally {
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class TfheCompressedServerKey {
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
        }
        finally {
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
        }
        finally {
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class TfheConfig {
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
/**
 */
export class TfheConfigBuilder {
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
     * @returns {TfheConfig}
     */
    build() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.tfheconfigbuilder_build(ptr);
        return TfheConfig.__wrap(ret);
    }
}
/**
 */
export class TfhePublicKey {
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
        }
        finally {
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
        }
        finally {
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
        }
        finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
 */
export class tfhe {
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
export function __wbindgen_bigint_from_u64(arg0) {
    const ret = BigInt.asUintN(64, arg0);
    return addHeapObject(ret);
}
export function __wbindgen_shr(arg0, arg1) {
    const ret = getObject(arg0) >> getObject(arg1);
    return addHeapObject(ret);
}
export function __wbindgen_object_drop_ref(arg0) {
    takeObject(arg0);
}
export function __wbindgen_bigint_from_i64(arg0) {
    const ret = arg0;
    return addHeapObject(ret);
}
export function __wbindgen_jsval_eq(arg0, arg1) {
    const ret = getObject(arg0) === getObject(arg1);
    return ret;
}
export function __wbindgen_error_new(arg0, arg1) {
    const ret = new Error(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
}
export function __wbindgen_bigint_from_i128(arg0, arg1) {
    const ret = (arg0 << BigInt(64)) | BigInt.asUintN(64, arg1);
    return addHeapObject(ret);
}
export function __wbindgen_bigint_from_u128(arg0, arg1) {
    const ret = (BigInt.asUintN(64, arg0) << BigInt(64)) | BigInt.asUintN(64, arg1);
    return addHeapObject(ret);
}
export function __wbg_fheuint16_new(arg0) {
    const ret = FheUint16.__wrap(arg0);
    return addHeapObject(ret);
}
export function __wbg_fheuint160_new(arg0) {
    const ret = FheUint160.__wrap(arg0);
    return addHeapObject(ret);
}
export function __wbg_fheuint256_new(arg0) {
    const ret = FheUint256.__wrap(arg0);
    return addHeapObject(ret);
}
export function __wbg_fheuint32_new(arg0) {
    const ret = FheUint32.__wrap(arg0);
    return addHeapObject(ret);
}
export function __wbg_fheuint128_new(arg0) {
    const ret = FheUint128.__wrap(arg0);
    return addHeapObject(ret);
}
export function __wbg_fheuint8_new(arg0) {
    const ret = FheUint8.__wrap(arg0);
    return addHeapObject(ret);
}
export function __wbg_fheuint64_new(arg0) {
    const ret = FheUint64.__wrap(arg0);
    return addHeapObject(ret);
}
export function __wbg_fheint32_new(arg0) {
    const ret = FheInt32.__wrap(arg0);
    return addHeapObject(ret);
}
export function __wbg_fheint64_new(arg0) {
    const ret = FheInt64.__wrap(arg0);
    return addHeapObject(ret);
}
export function __wbg_fhebool_new(arg0) {
    const ret = FheBool.__wrap(arg0);
    return addHeapObject(ret);
}
export function __wbg_fheint256_new(arg0) {
    const ret = FheInt256.__wrap(arg0);
    return addHeapObject(ret);
}
export function __wbg_fheint160_new(arg0) {
    const ret = FheInt160.__wrap(arg0);
    return addHeapObject(ret);
}
export function __wbg_fheint16_new(arg0) {
    const ret = FheInt16.__wrap(arg0);
    return addHeapObject(ret);
}
export function __wbg_fheint8_new(arg0) {
    const ret = FheInt8.__wrap(arg0);
    return addHeapObject(ret);
}
export function __wbg_fheint128_new(arg0) {
    const ret = FheInt128.__wrap(arg0);
    return addHeapObject(ret);
}
export function __wbindgen_boolean_get(arg0) {
    const v = getObject(arg0);
    const ret = typeof v === "boolean" ? (v ? 1 : 0) : 2;
    return ret;
}
export function __wbindgen_bigint_from_str(arg0, arg1) {
    const ret = BigInt(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
}
export function __wbindgen_bit_and(arg0, arg1) {
    const ret = getObject(arg0) & getObject(arg1);
    return addHeapObject(ret);
}
export function __wbindgen_number_new(arg0) {
    const ret = arg0;
    return addHeapObject(ret);
}
export function __wbindgen_lt(arg0, arg1) {
    const ret = getObject(arg0) < getObject(arg1);
    return ret;
}
export function __wbindgen_neg(arg0) {
    const ret = -getObject(arg0);
    return addHeapObject(ret);
}
export function __wbindgen_shl(arg0, arg1) {
    const ret = getObject(arg0) << getObject(arg1);
    return addHeapObject(ret);
}
export function __wbindgen_add(arg0, arg1) {
    const ret = getObject(arg0) + getObject(arg1);
    return addHeapObject(ret);
}
export function __wbindgen_bit_or(arg0, arg1) {
    const ret = getObject(arg0) | getObject(arg1);
    return addHeapObject(ret);
}
export function __wbg_new_abda76e883ba8a5f() {
    const ret = new Error();
    return addHeapObject(ret);
}
export function __wbg_stack_658279fe44541cf6(arg0, arg1) {
    const ret = getObject(arg1).stack;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len1;
    getInt32Memory0()[arg0 / 4 + 0] = ptr1;
}
export function __wbg_error_f851667af71bcfc6(arg0, arg1) {
    let deferred0_0;
    let deferred0_1;
    try {
        deferred0_0 = arg0;
        deferred0_1 = arg1;
        console.error(getStringFromWasm0(arg0, arg1));
    }
    finally {
        wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
    }
}
export function __wbg_crypto_70a96de3b6b73dac(arg0) {
    const ret = getObject(arg0).crypto;
    return addHeapObject(ret);
}
export function __wbindgen_is_object(arg0) {
    const val = getObject(arg0);
    const ret = typeof val === "object" && val !== null;
    return ret;
}
export function __wbg_process_dd1577445152112e(arg0) {
    const ret = getObject(arg0).process;
    return addHeapObject(ret);
}
export function __wbg_versions_58036bec3add9e6f(arg0) {
    const ret = getObject(arg0).versions;
    return addHeapObject(ret);
}
export function __wbg_node_6a9d28205ed5b0d8(arg0) {
    const ret = getObject(arg0).node;
    return addHeapObject(ret);
}
export function __wbindgen_is_string(arg0) {
    const ret = typeof getObject(arg0) === "string";
    return ret;
}
export function __wbg_require_f05d779769764e82() {
    return handleError(function () {
        const ret = module.require;
        return addHeapObject(ret);
    }, arguments);
}
export function __wbindgen_string_new(arg0, arg1) {
    const ret = getStringFromWasm0(arg0, arg1);
    return addHeapObject(ret);
}
export function __wbg_msCrypto_adbc770ec9eca9c7(arg0) {
    const ret = getObject(arg0).msCrypto;
    return addHeapObject(ret);
}
export function __wbg_randomFillSync_e950366c42764a07() {
    return handleError(function (arg0, arg1) {
        getObject(arg0).randomFillSync(takeObject(arg1));
    }, arguments);
}
export function __wbg_getRandomValues_3774744e221a22ad() {
    return handleError(function (arg0, arg1) {
        getObject(arg0).getRandomValues(getObject(arg1));
    }, arguments);
}
export function __wbindgen_is_function(arg0) {
    const ret = typeof getObject(arg0) === "function";
    return ret;
}
export function __wbg_newnoargs_e643855c6572a4a8(arg0, arg1) {
    const ret = new Function(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
}
export function __wbg_call_f96b398515635514() {
    return handleError(function (arg0, arg1) {
        const ret = getObject(arg0).call(getObject(arg1));
        return addHeapObject(ret);
    }, arguments);
}
export function __wbg_self_b9aad7f1c618bfaf() {
    return handleError(function () {
        const ret = self.self;
        return addHeapObject(ret);
    }, arguments);
}
export function __wbg_window_55e469842c98b086() {
    return handleError(function () {
        const ret = window.window;
        return addHeapObject(ret);
    }, arguments);
}
export function __wbg_globalThis_d0957e302752547e() {
    return handleError(function () {
        const ret = globalThis.globalThis;
        return addHeapObject(ret);
    }, arguments);
}
export function __wbg_global_ae2f87312b8987fb() {
    return handleError(function () {
        const ret = global.global;
        return addHeapObject(ret);
    }, arguments);
}
export function __wbindgen_is_undefined(arg0) {
    const ret = getObject(arg0) === undefined;
    return ret;
}
export function __wbg_call_35782e9a1aa5e091() {
    return handleError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    }, arguments);
}
export function __wbg_buffer_fcbfb6d88b2732e9(arg0) {
    const ret = getObject(arg0).buffer;
    return addHeapObject(ret);
}
export function __wbg_newwithbyteoffsetandlength_92c251989c485785(arg0, arg1, arg2) {
    const ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
}
export function __wbg_new_bc5d9aad3f9ac80e(arg0) {
    const ret = new Uint8Array(getObject(arg0));
    return addHeapObject(ret);
}
export function __wbg_set_4b3aa8445ac1e91c(arg0, arg1, arg2) {
    getObject(arg0).set(getObject(arg1), arg2 >>> 0);
}
export function __wbg_newwithlength_89eca18f2603a999(arg0) {
    const ret = new Uint8Array(arg0 >>> 0);
    return addHeapObject(ret);
}
export function __wbg_subarray_7649d027b2b141b3(arg0, arg1, arg2) {
    const ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
}
export function __wbindgen_object_clone_ref(arg0) {
    const ret = getObject(arg0);
    return addHeapObject(ret);
}
export function __wbindgen_bigint_get_as_i64(arg0, arg1) {
    const v = getObject(arg1);
    const ret = typeof v === "bigint" ? v : undefined;
    getBigInt64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? BigInt(0) : ret;
    getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);
}
export function __wbindgen_debug_string(arg0, arg1) {
    const ret = debugString(getObject(arg1));
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len1;
    getInt32Memory0()[arg0 / 4 + 0] = ptr1;
}
export function __wbindgen_throw(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
}
export function __wbindgen_memory() {
    const ret = wasm.memory;
    return addHeapObject(ret);
}
//# sourceMappingURL=tfhe_bg.js.map