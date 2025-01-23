/**
 */
export function init_panic_hook(): void;
/**
 */
export class CompactFheBool {
    static __wrap(ptr: any): any;
    /**
     * @param {boolean} value
     * @param {TfheCompactPublicKey} client_key
     * @returns {CompactFheBool}
     */
    static encrypt_with_compact_public_key(value: boolean, client_key: TfheCompactPublicKey): CompactFheBool;
    /**
     * @param {Uint8Array} buffer
     * @returns {CompactFheBool}
     */
    static deserialize(buffer: Uint8Array): CompactFheBool;
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {CompactFheBool}
     */
    static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompactFheBool;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @returns {FheBool}
     */
    expand(): FheBool;
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
    /**
     * @param {bigint} serialized_size_limit
     * @returns {Uint8Array}
     */
    safe_serialize(serialized_size_limit: bigint): Uint8Array;
}
/**
 */
export class CompactFheBoolList {
    static __wrap(ptr: any): any;
    /**
     * @param {Uint8Array} buffer
     * @returns {CompactFheBoolList}
     */
    static deserialize(buffer: Uint8Array): CompactFheBoolList;
    /**
     * @param {any[]} values
     * @param {TfheCompactPublicKey} public_key
     * @returns {CompactFheBoolList}
     */
    static encrypt_with_compact_public_key(values: any[], public_key: TfheCompactPublicKey): CompactFheBoolList;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @returns {any[]}
     */
    expand(): any[];
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
}
/**
 */
export class CompactFheInt128 {
    static __wrap(ptr: any): any;
    /**
     * @param {any} value
     * @param {TfheCompactPublicKey} client_key
     * @returns {CompactFheInt128}
     */
    static encrypt_with_compact_public_key(value: any, client_key: TfheCompactPublicKey): CompactFheInt128;
    /**
     * @param {Uint8Array} buffer
     * @returns {CompactFheInt128}
     */
    static deserialize(buffer: Uint8Array): CompactFheInt128;
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {CompactFheInt128}
     */
    static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompactFheInt128;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @returns {FheInt128}
     */
    expand(): FheInt128;
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
    /**
     * @param {bigint} serialized_size_limit
     * @returns {Uint8Array}
     */
    safe_serialize(serialized_size_limit: bigint): Uint8Array;
}
/**
 */
export class CompactFheInt128List {
    static __wrap(ptr: any): any;
    /**
     * @param {any[]} values
     * @param {TfheCompactPublicKey} public_key
     * @returns {CompactFheInt128List}
     */
    static encrypt_with_compact_public_key(values: any[], public_key: TfheCompactPublicKey): CompactFheInt128List;
    /**
     * @param {Uint8Array} buffer
     * @returns {CompactFheInt128List}
     */
    static deserialize(buffer: Uint8Array): CompactFheInt128List;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @returns {any[]}
     */
    expand(): any[];
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
}
/**
 */
export class CompactFheInt16 {
    static __wrap(ptr: any): any;
    /**
     * @param {number} value
     * @param {TfheCompactPublicKey} client_key
     * @returns {CompactFheInt16}
     */
    static encrypt_with_compact_public_key(value: number, client_key: TfheCompactPublicKey): CompactFheInt16;
    /**
     * @param {Uint8Array} buffer
     * @returns {CompactFheInt16}
     */
    static deserialize(buffer: Uint8Array): CompactFheInt16;
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {CompactFheInt16}
     */
    static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompactFheInt16;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @returns {FheInt16}
     */
    expand(): FheInt16;
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
    /**
     * @param {bigint} serialized_size_limit
     * @returns {Uint8Array}
     */
    safe_serialize(serialized_size_limit: bigint): Uint8Array;
}
/**
 */
export class CompactFheInt160 {
    static __wrap(ptr: any): any;
    /**
     * @param {any} value
     * @param {TfheCompactPublicKey} client_key
     * @returns {CompactFheInt160}
     */
    static encrypt_with_compact_public_key(value: any, client_key: TfheCompactPublicKey): CompactFheInt160;
    /**
     * @param {Uint8Array} buffer
     * @returns {CompactFheInt160}
     */
    static deserialize(buffer: Uint8Array): CompactFheInt160;
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {CompactFheInt160}
     */
    static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompactFheInt160;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @returns {FheInt160}
     */
    expand(): FheInt160;
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
    /**
     * @param {bigint} serialized_size_limit
     * @returns {Uint8Array}
     */
    safe_serialize(serialized_size_limit: bigint): Uint8Array;
}
/**
 */
export class CompactFheInt160List {
    static __wrap(ptr: any): any;
    /**
     * @param {any[]} values
     * @param {TfheCompactPublicKey} public_key
     * @returns {CompactFheInt160List}
     */
    static encrypt_with_compact_public_key(values: any[], public_key: TfheCompactPublicKey): CompactFheInt160List;
    /**
     * @param {Uint8Array} buffer
     * @returns {CompactFheInt160List}
     */
    static deserialize(buffer: Uint8Array): CompactFheInt160List;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @returns {any[]}
     */
    expand(): any[];
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
}
/**
 */
export class CompactFheInt16List {
    static __wrap(ptr: any): any;
    /**
     * @param {Uint8Array} buffer
     * @returns {CompactFheInt16List}
     */
    static deserialize(buffer: Uint8Array): CompactFheInt16List;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @returns {any[]}
     */
    expand(): any[];
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
}
/**
 */
export class CompactFheInt256 {
    static __wrap(ptr: any): any;
    /**
     * @param {any} value
     * @param {TfheCompactPublicKey} client_key
     * @returns {CompactFheInt256}
     */
    static encrypt_with_compact_public_key(value: any, client_key: TfheCompactPublicKey): CompactFheInt256;
    /**
     * @param {Uint8Array} buffer
     * @returns {CompactFheInt256}
     */
    static deserialize(buffer: Uint8Array): CompactFheInt256;
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {CompactFheInt256}
     */
    static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompactFheInt256;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @returns {FheInt256}
     */
    expand(): FheInt256;
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
    /**
     * @param {bigint} serialized_size_limit
     * @returns {Uint8Array}
     */
    safe_serialize(serialized_size_limit: bigint): Uint8Array;
}
/**
 */
export class CompactFheInt256List {
    static __wrap(ptr: any): any;
    /**
     * @param {any[]} values
     * @param {TfheCompactPublicKey} public_key
     * @returns {CompactFheInt256List}
     */
    static encrypt_with_compact_public_key(values: any[], public_key: TfheCompactPublicKey): CompactFheInt256List;
    /**
     * @param {Uint8Array} buffer
     * @returns {CompactFheInt256List}
     */
    static deserialize(buffer: Uint8Array): CompactFheInt256List;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @returns {any[]}
     */
    expand(): any[];
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
}
/**
 */
export class CompactFheInt32 {
    static __wrap(ptr: any): any;
    /**
     * @param {number} value
     * @param {TfheCompactPublicKey} client_key
     * @returns {CompactFheInt32}
     */
    static encrypt_with_compact_public_key(value: number, client_key: TfheCompactPublicKey): CompactFheInt32;
    /**
     * @param {Uint8Array} buffer
     * @returns {CompactFheInt32}
     */
    static deserialize(buffer: Uint8Array): CompactFheInt32;
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {CompactFheInt32}
     */
    static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompactFheInt32;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @returns {FheInt32}
     */
    expand(): FheInt32;
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
    /**
     * @param {bigint} serialized_size_limit
     * @returns {Uint8Array}
     */
    safe_serialize(serialized_size_limit: bigint): Uint8Array;
}
/**
 */
export class CompactFheInt32List {
    static __wrap(ptr: any): any;
    /**
     * @param {Uint8Array} buffer
     * @returns {CompactFheInt32List}
     */
    static deserialize(buffer: Uint8Array): CompactFheInt32List;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @returns {any[]}
     */
    expand(): any[];
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
}
/**
 */
export class CompactFheInt64 {
    static __wrap(ptr: any): any;
    /**
     * @param {bigint} value
     * @param {TfheCompactPublicKey} client_key
     * @returns {CompactFheInt64}
     */
    static encrypt_with_compact_public_key(value: bigint, client_key: TfheCompactPublicKey): CompactFheInt64;
    /**
     * @param {Uint8Array} buffer
     * @returns {CompactFheInt64}
     */
    static deserialize(buffer: Uint8Array): CompactFheInt64;
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {CompactFheInt64}
     */
    static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompactFheInt64;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @returns {FheInt64}
     */
    expand(): FheInt64;
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
    /**
     * @param {bigint} serialized_size_limit
     * @returns {Uint8Array}
     */
    safe_serialize(serialized_size_limit: bigint): Uint8Array;
}
/**
 */
export class CompactFheInt64List {
    static __wrap(ptr: any): any;
    /**
     * @param {Uint8Array} buffer
     * @returns {CompactFheInt64List}
     */
    static deserialize(buffer: Uint8Array): CompactFheInt64List;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @returns {any[]}
     */
    expand(): any[];
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
}
/**
 */
export class CompactFheInt8 {
    static __wrap(ptr: any): any;
    /**
     * @param {number} value
     * @param {TfheCompactPublicKey} client_key
     * @returns {CompactFheInt8}
     */
    static encrypt_with_compact_public_key(value: number, client_key: TfheCompactPublicKey): CompactFheInt8;
    /**
     * @param {Uint8Array} buffer
     * @returns {CompactFheInt8}
     */
    static deserialize(buffer: Uint8Array): CompactFheInt8;
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {CompactFheInt8}
     */
    static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompactFheInt8;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @returns {FheInt8}
     */
    expand(): FheInt8;
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
    /**
     * @param {bigint} serialized_size_limit
     * @returns {Uint8Array}
     */
    safe_serialize(serialized_size_limit: bigint): Uint8Array;
}
/**
 */
export class CompactFheInt8List {
    static __wrap(ptr: any): any;
    /**
     * @param {Uint8Array} buffer
     * @returns {CompactFheInt8List}
     */
    static deserialize(buffer: Uint8Array): CompactFheInt8List;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @returns {any[]}
     */
    expand(): any[];
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
}
/**
 */
export class CompactFheUint128 {
    static __wrap(ptr: any): any;
    /**
     * @param {any} value
     * @param {TfheCompactPublicKey} client_key
     * @returns {CompactFheUint128}
     */
    static encrypt_with_compact_public_key(value: any, client_key: TfheCompactPublicKey): CompactFheUint128;
    /**
     * @param {Uint8Array} buffer
     * @returns {CompactFheUint128}
     */
    static deserialize(buffer: Uint8Array): CompactFheUint128;
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {CompactFheUint128}
     */
    static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompactFheUint128;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @returns {FheUint128}
     */
    expand(): FheUint128;
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
    /**
     * @param {bigint} serialized_size_limit
     * @returns {Uint8Array}
     */
    safe_serialize(serialized_size_limit: bigint): Uint8Array;
}
/**
 */
export class CompactFheUint128List {
    static __wrap(ptr: any): any;
    /**
     * @param {any[]} values
     * @param {TfheCompactPublicKey} public_key
     * @returns {CompactFheUint128List}
     */
    static encrypt_with_compact_public_key(values: any[], public_key: TfheCompactPublicKey): CompactFheUint128List;
    /**
     * @param {Uint8Array} buffer
     * @returns {CompactFheUint128List}
     */
    static deserialize(buffer: Uint8Array): CompactFheUint128List;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @returns {any[]}
     */
    expand(): any[];
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
}
/**
 */
export class CompactFheUint16 {
    static __wrap(ptr: any): any;
    /**
     * @param {number} value
     * @param {TfheCompactPublicKey} client_key
     * @returns {CompactFheUint16}
     */
    static encrypt_with_compact_public_key(value: number, client_key: TfheCompactPublicKey): CompactFheUint16;
    /**
     * @param {Uint8Array} buffer
     * @returns {CompactFheUint16}
     */
    static deserialize(buffer: Uint8Array): CompactFheUint16;
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {CompactFheUint16}
     */
    static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompactFheUint16;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @returns {FheUint16}
     */
    expand(): FheUint16;
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
    /**
     * @param {bigint} serialized_size_limit
     * @returns {Uint8Array}
     */
    safe_serialize(serialized_size_limit: bigint): Uint8Array;
}
/**
 */
export class CompactFheUint160 {
    static __wrap(ptr: any): any;
    /**
     * @param {any} value
     * @param {TfheCompactPublicKey} client_key
     * @returns {CompactFheUint160}
     */
    static encrypt_with_compact_public_key(value: any, client_key: TfheCompactPublicKey): CompactFheUint160;
    /**
     * @param {Uint8Array} buffer
     * @returns {CompactFheUint160}
     */
    static deserialize(buffer: Uint8Array): CompactFheUint160;
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {CompactFheUint160}
     */
    static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompactFheUint160;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @returns {FheUint160}
     */
    expand(): FheUint160;
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
    /**
     * @param {bigint} serialized_size_limit
     * @returns {Uint8Array}
     */
    safe_serialize(serialized_size_limit: bigint): Uint8Array;
}
/**
 */
export class CompactFheUint160List {
    static __wrap(ptr: any): any;
    /**
     * @param {any[]} values
     * @param {TfheCompactPublicKey} public_key
     * @returns {CompactFheUint160List}
     */
    static encrypt_with_compact_public_key(values: any[], public_key: TfheCompactPublicKey): CompactFheUint160List;
    /**
     * @param {Uint8Array} buffer
     * @returns {CompactFheUint160List}
     */
    static deserialize(buffer: Uint8Array): CompactFheUint160List;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @returns {any[]}
     */
    expand(): any[];
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
}
/**
 */
export class CompactFheUint16List {
    static __wrap(ptr: any): any;
    /**
     * @param {Uint8Array} buffer
     * @returns {CompactFheUint16List}
     */
    static deserialize(buffer: Uint8Array): CompactFheUint16List;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @returns {any[]}
     */
    expand(): any[];
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
}
/**
 */
export class CompactFheUint256 {
    static __wrap(ptr: any): any;
    /**
     * @param {any} value
     * @param {TfheCompactPublicKey} client_key
     * @returns {CompactFheUint256}
     */
    static encrypt_with_compact_public_key(value: any, client_key: TfheCompactPublicKey): CompactFheUint256;
    /**
     * @param {Uint8Array} buffer
     * @returns {CompactFheUint256}
     */
    static deserialize(buffer: Uint8Array): CompactFheUint256;
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {CompactFheUint256}
     */
    static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompactFheUint256;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @returns {FheUint256}
     */
    expand(): FheUint256;
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
    /**
     * @param {bigint} serialized_size_limit
     * @returns {Uint8Array}
     */
    safe_serialize(serialized_size_limit: bigint): Uint8Array;
}
/**
 */
export class CompactFheUint256List {
    static __wrap(ptr: any): any;
    /**
     * @param {any[]} values
     * @param {TfheCompactPublicKey} public_key
     * @returns {CompactFheUint256List}
     */
    static encrypt_with_compact_public_key(values: any[], public_key: TfheCompactPublicKey): CompactFheUint256List;
    /**
     * @param {Uint8Array} buffer
     * @returns {CompactFheUint256List}
     */
    static deserialize(buffer: Uint8Array): CompactFheUint256List;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @returns {any[]}
     */
    expand(): any[];
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
}
/**
 */
export class CompactFheUint32 {
    static __wrap(ptr: any): any;
    /**
     * @param {number} value
     * @param {TfheCompactPublicKey} client_key
     * @returns {CompactFheUint32}
     */
    static encrypt_with_compact_public_key(value: number, client_key: TfheCompactPublicKey): CompactFheUint32;
    /**
     * @param {Uint8Array} buffer
     * @returns {CompactFheUint32}
     */
    static deserialize(buffer: Uint8Array): CompactFheUint32;
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {CompactFheUint32}
     */
    static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompactFheUint32;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @returns {FheUint32}
     */
    expand(): FheUint32;
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
    /**
     * @param {bigint} serialized_size_limit
     * @returns {Uint8Array}
     */
    safe_serialize(serialized_size_limit: bigint): Uint8Array;
}
/**
 */
export class CompactFheUint32List {
    static __wrap(ptr: any): any;
    /**
     * @param {Uint8Array} buffer
     * @returns {CompactFheUint32List}
     */
    static deserialize(buffer: Uint8Array): CompactFheUint32List;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @returns {any[]}
     */
    expand(): any[];
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
}
/**
 */
export class CompactFheUint64 {
    static __wrap(ptr: any): any;
    /**
     * @param {bigint} value
     * @param {TfheCompactPublicKey} client_key
     * @returns {CompactFheUint64}
     */
    static encrypt_with_compact_public_key(value: bigint, client_key: TfheCompactPublicKey): CompactFheUint64;
    /**
     * @param {Uint8Array} buffer
     * @returns {CompactFheUint64}
     */
    static deserialize(buffer: Uint8Array): CompactFheUint64;
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {CompactFheUint64}
     */
    static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompactFheUint64;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @returns {FheUint64}
     */
    expand(): FheUint64;
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
    /**
     * @param {bigint} serialized_size_limit
     * @returns {Uint8Array}
     */
    safe_serialize(serialized_size_limit: bigint): Uint8Array;
}
/**
 */
export class CompactFheUint64List {
    static __wrap(ptr: any): any;
    /**
     * @param {Uint8Array} buffer
     * @returns {CompactFheUint64List}
     */
    static deserialize(buffer: Uint8Array): CompactFheUint64List;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @returns {any[]}
     */
    expand(): any[];
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
}
/**
 */
export class CompactFheUint8 {
    static __wrap(ptr: any): any;
    /**
     * @param {number} value
     * @param {TfheCompactPublicKey} client_key
     * @returns {CompactFheUint8}
     */
    static encrypt_with_compact_public_key(value: number, client_key: TfheCompactPublicKey): CompactFheUint8;
    /**
     * @param {Uint8Array} buffer
     * @returns {CompactFheUint8}
     */
    static deserialize(buffer: Uint8Array): CompactFheUint8;
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {CompactFheUint8}
     */
    static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompactFheUint8;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @returns {FheUint8}
     */
    expand(): FheUint8;
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
    /**
     * @param {bigint} serialized_size_limit
     * @returns {Uint8Array}
     */
    safe_serialize(serialized_size_limit: bigint): Uint8Array;
}
/**
 */
export class CompactFheUint8List {
    static __wrap(ptr: any): any;
    /**
     * @param {Uint8Array} buffer
     * @returns {CompactFheUint8List}
     */
    static deserialize(buffer: Uint8Array): CompactFheUint8List;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @returns {any[]}
     */
    expand(): any[];
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
}
/**
 */
export class CompressedFheBool {
    static __wrap(ptr: any): any;
    /**
     * @param {boolean} value
     * @param {TfheClientKey} client_key
     * @returns {CompressedFheBool}
     */
    static encrypt_with_client_key(value: boolean, client_key: TfheClientKey): CompressedFheBool;
    /**
     * @param {Uint8Array} buffer
     * @returns {CompressedFheBool}
     */
    static deserialize(buffer: Uint8Array): CompressedFheBool;
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {CompressedFheBool}
     */
    static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompressedFheBool;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @returns {FheBool}
     */
    decompress(): FheBool;
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
    /**
     * @param {bigint} serialized_size_limit
     * @returns {Uint8Array}
     */
    safe_serialize(serialized_size_limit: bigint): Uint8Array;
}
/**
 */
export class CompressedFheInt128 {
    static __wrap(ptr: any): any;
    /**
     * @param {any} value
     * @param {TfheClientKey} client_key
     * @returns {CompressedFheInt128}
     */
    static encrypt_with_client_key(value: any, client_key: TfheClientKey): CompressedFheInt128;
    /**
     * @param {Uint8Array} buffer
     * @returns {CompressedFheInt128}
     */
    static deserialize(buffer: Uint8Array): CompressedFheInt128;
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {CompressedFheInt128}
     */
    static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompressedFheInt128;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @returns {FheInt128}
     */
    decompress(): FheInt128;
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
    /**
     * @param {bigint} serialized_size_limit
     * @returns {Uint8Array}
     */
    safe_serialize(serialized_size_limit: bigint): Uint8Array;
}
/**
 */
export class CompressedFheInt16 {
    static __wrap(ptr: any): any;
    /**
     * @param {number} value
     * @param {TfheClientKey} client_key
     * @returns {CompressedFheInt16}
     */
    static encrypt_with_client_key(value: number, client_key: TfheClientKey): CompressedFheInt16;
    /**
     * @param {Uint8Array} buffer
     * @returns {CompressedFheInt16}
     */
    static deserialize(buffer: Uint8Array): CompressedFheInt16;
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {CompressedFheInt16}
     */
    static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompressedFheInt16;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @returns {FheInt16}
     */
    decompress(): FheInt16;
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
    /**
     * @param {bigint} serialized_size_limit
     * @returns {Uint8Array}
     */
    safe_serialize(serialized_size_limit: bigint): Uint8Array;
}
/**
 */
export class CompressedFheInt160 {
    static __wrap(ptr: any): any;
    /**
     * @param {any} value
     * @param {TfheClientKey} client_key
     * @returns {CompressedFheInt160}
     */
    static encrypt_with_client_key(value: any, client_key: TfheClientKey): CompressedFheInt160;
    /**
     * @param {Uint8Array} buffer
     * @returns {CompressedFheInt160}
     */
    static deserialize(buffer: Uint8Array): CompressedFheInt160;
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {CompressedFheInt160}
     */
    static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompressedFheInt160;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @returns {FheInt160}
     */
    decompress(): FheInt160;
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
    /**
     * @param {bigint} serialized_size_limit
     * @returns {Uint8Array}
     */
    safe_serialize(serialized_size_limit: bigint): Uint8Array;
}
/**
 */
export class CompressedFheInt256 {
    static __wrap(ptr: any): any;
    /**
     * @param {any} value
     * @param {TfheClientKey} client_key
     * @returns {CompressedFheInt256}
     */
    static encrypt_with_client_key(value: any, client_key: TfheClientKey): CompressedFheInt256;
    /**
     * @param {Uint8Array} buffer
     * @returns {CompressedFheInt256}
     */
    static deserialize(buffer: Uint8Array): CompressedFheInt256;
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {CompressedFheInt256}
     */
    static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompressedFheInt256;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @returns {FheInt256}
     */
    decompress(): FheInt256;
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
    /**
     * @param {bigint} serialized_size_limit
     * @returns {Uint8Array}
     */
    safe_serialize(serialized_size_limit: bigint): Uint8Array;
}
/**
 */
export class CompressedFheInt32 {
    static __wrap(ptr: any): any;
    /**
     * @param {number} value
     * @param {TfheClientKey} client_key
     * @returns {CompressedFheInt32}
     */
    static encrypt_with_client_key(value: number, client_key: TfheClientKey): CompressedFheInt32;
    /**
     * @param {Uint8Array} buffer
     * @returns {CompressedFheInt32}
     */
    static deserialize(buffer: Uint8Array): CompressedFheInt32;
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {CompressedFheInt32}
     */
    static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompressedFheInt32;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @returns {FheInt32}
     */
    decompress(): FheInt32;
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
    /**
     * @param {bigint} serialized_size_limit
     * @returns {Uint8Array}
     */
    safe_serialize(serialized_size_limit: bigint): Uint8Array;
}
/**
 */
export class CompressedFheInt64 {
    static __wrap(ptr: any): any;
    /**
     * @param {bigint} value
     * @param {TfheClientKey} client_key
     * @returns {CompressedFheInt64}
     */
    static encrypt_with_client_key(value: bigint, client_key: TfheClientKey): CompressedFheInt64;
    /**
     * @param {Uint8Array} buffer
     * @returns {CompressedFheInt64}
     */
    static deserialize(buffer: Uint8Array): CompressedFheInt64;
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {CompressedFheInt64}
     */
    static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompressedFheInt64;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @returns {FheInt64}
     */
    decompress(): FheInt64;
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
    /**
     * @param {bigint} serialized_size_limit
     * @returns {Uint8Array}
     */
    safe_serialize(serialized_size_limit: bigint): Uint8Array;
}
/**
 */
export class CompressedFheInt8 {
    static __wrap(ptr: any): any;
    /**
     * @param {number} value
     * @param {TfheClientKey} client_key
     * @returns {CompressedFheInt8}
     */
    static encrypt_with_client_key(value: number, client_key: TfheClientKey): CompressedFheInt8;
    /**
     * @param {Uint8Array} buffer
     * @returns {CompressedFheInt8}
     */
    static deserialize(buffer: Uint8Array): CompressedFheInt8;
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {CompressedFheInt8}
     */
    static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompressedFheInt8;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @returns {FheInt8}
     */
    decompress(): FheInt8;
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
    /**
     * @param {bigint} serialized_size_limit
     * @returns {Uint8Array}
     */
    safe_serialize(serialized_size_limit: bigint): Uint8Array;
}
/**
 */
export class CompressedFheUint128 {
    static __wrap(ptr: any): any;
    /**
     * @param {any} value
     * @param {TfheClientKey} client_key
     * @returns {CompressedFheUint128}
     */
    static encrypt_with_client_key(value: any, client_key: TfheClientKey): CompressedFheUint128;
    /**
     * @param {Uint8Array} buffer
     * @returns {CompressedFheUint128}
     */
    static deserialize(buffer: Uint8Array): CompressedFheUint128;
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {CompressedFheUint128}
     */
    static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompressedFheUint128;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @returns {FheUint128}
     */
    decompress(): FheUint128;
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
    /**
     * @param {bigint} serialized_size_limit
     * @returns {Uint8Array}
     */
    safe_serialize(serialized_size_limit: bigint): Uint8Array;
}
/**
 */
export class CompressedFheUint16 {
    static __wrap(ptr: any): any;
    /**
     * @param {number} value
     * @param {TfheClientKey} client_key
     * @returns {CompressedFheUint16}
     */
    static encrypt_with_client_key(value: number, client_key: TfheClientKey): CompressedFheUint16;
    /**
     * @param {Uint8Array} buffer
     * @returns {CompressedFheUint16}
     */
    static deserialize(buffer: Uint8Array): CompressedFheUint16;
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {CompressedFheUint16}
     */
    static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompressedFheUint16;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @returns {FheUint16}
     */
    decompress(): FheUint16;
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
    /**
     * @param {bigint} serialized_size_limit
     * @returns {Uint8Array}
     */
    safe_serialize(serialized_size_limit: bigint): Uint8Array;
}
/**
 */
export class CompressedFheUint160 {
    static __wrap(ptr: any): any;
    /**
     * @param {any} value
     * @param {TfheClientKey} client_key
     * @returns {CompressedFheUint160}
     */
    static encrypt_with_client_key(value: any, client_key: TfheClientKey): CompressedFheUint160;
    /**
     * @param {Uint8Array} buffer
     * @returns {CompressedFheUint160}
     */
    static deserialize(buffer: Uint8Array): CompressedFheUint160;
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {CompressedFheUint160}
     */
    static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompressedFheUint160;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @returns {FheUint160}
     */
    decompress(): FheUint160;
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
    /**
     * @param {bigint} serialized_size_limit
     * @returns {Uint8Array}
     */
    safe_serialize(serialized_size_limit: bigint): Uint8Array;
}
/**
 */
export class CompressedFheUint256 {
    static __wrap(ptr: any): any;
    /**
     * @param {any} value
     * @param {TfheClientKey} client_key
     * @returns {CompressedFheUint256}
     */
    static encrypt_with_client_key(value: any, client_key: TfheClientKey): CompressedFheUint256;
    /**
     * @param {Uint8Array} buffer
     * @returns {CompressedFheUint256}
     */
    static deserialize(buffer: Uint8Array): CompressedFheUint256;
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {CompressedFheUint256}
     */
    static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompressedFheUint256;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @returns {FheUint256}
     */
    decompress(): FheUint256;
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
    /**
     * @param {bigint} serialized_size_limit
     * @returns {Uint8Array}
     */
    safe_serialize(serialized_size_limit: bigint): Uint8Array;
}
/**
 */
export class CompressedFheUint32 {
    static __wrap(ptr: any): any;
    /**
     * @param {number} value
     * @param {TfheClientKey} client_key
     * @returns {CompressedFheUint32}
     */
    static encrypt_with_client_key(value: number, client_key: TfheClientKey): CompressedFheUint32;
    /**
     * @param {Uint8Array} buffer
     * @returns {CompressedFheUint32}
     */
    static deserialize(buffer: Uint8Array): CompressedFheUint32;
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {CompressedFheUint32}
     */
    static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompressedFheUint32;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @returns {FheUint32}
     */
    decompress(): FheUint32;
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
    /**
     * @param {bigint} serialized_size_limit
     * @returns {Uint8Array}
     */
    safe_serialize(serialized_size_limit: bigint): Uint8Array;
}
/**
 */
export class CompressedFheUint64 {
    static __wrap(ptr: any): any;
    /**
     * @param {bigint} value
     * @param {TfheClientKey} client_key
     * @returns {CompressedFheUint64}
     */
    static encrypt_with_client_key(value: bigint, client_key: TfheClientKey): CompressedFheUint64;
    /**
     * @param {Uint8Array} buffer
     * @returns {CompressedFheUint64}
     */
    static deserialize(buffer: Uint8Array): CompressedFheUint64;
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {CompressedFheUint64}
     */
    static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompressedFheUint64;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @returns {FheUint64}
     */
    decompress(): FheUint64;
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
    /**
     * @param {bigint} serialized_size_limit
     * @returns {Uint8Array}
     */
    safe_serialize(serialized_size_limit: bigint): Uint8Array;
}
/**
 */
export class CompressedFheUint8 {
    static __wrap(ptr: any): any;
    /**
     * @param {number} value
     * @param {TfheClientKey} client_key
     * @returns {CompressedFheUint8}
     */
    static encrypt_with_client_key(value: number, client_key: TfheClientKey): CompressedFheUint8;
    /**
     * @param {Uint8Array} buffer
     * @returns {CompressedFheUint8}
     */
    static deserialize(buffer: Uint8Array): CompressedFheUint8;
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {CompressedFheUint8}
     */
    static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompressedFheUint8;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @returns {FheUint8}
     */
    decompress(): FheUint8;
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
    /**
     * @param {bigint} serialized_size_limit
     * @returns {Uint8Array}
     */
    safe_serialize(serialized_size_limit: bigint): Uint8Array;
}
/**
 */
export class FheBool {
    static __wrap(ptr: any): any;
    /**
     * @param {boolean} value
     * @param {TfheClientKey} client_key
     * @returns {FheBool}
     */
    static encrypt_with_client_key(value: boolean, client_key: TfheClientKey): FheBool;
    /**
     * @param {boolean} value
     * @param {TfhePublicKey} public_key
     * @returns {FheBool}
     */
    static encrypt_with_public_key(value: boolean, public_key: TfhePublicKey): FheBool;
    /**
     * @param {boolean} value
     * @param {TfheCompressedPublicKey} compressed_public_key
     * @returns {FheBool}
     */
    static encrypt_with_compressed_public_key(value: boolean, compressed_public_key: TfheCompressedPublicKey): FheBool;
    /**
     * @param {boolean} value
     * @param {TfheCompactPublicKey} compact_public_key
     * @returns {FheBool}
     */
    static encrypt_with_compact_public_key(value: boolean, compact_public_key: TfheCompactPublicKey): FheBool;
    /**
     * @param {Uint8Array} buffer
     * @returns {FheBool}
     */
    static deserialize(buffer: Uint8Array): FheBool;
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {FheBool}
     */
    static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): FheBool;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @param {TfheClientKey} client_key
     * @returns {boolean}
     */
    decrypt(client_key: TfheClientKey): boolean;
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
    /**
     * @param {bigint} serialized_size_limit
     * @returns {Uint8Array}
     */
    safe_serialize(serialized_size_limit: bigint): Uint8Array;
}
/**
 */
export class FheInt128 {
    static __wrap(ptr: any): any;
    /**
     * @param {any} value
     * @param {TfheClientKey} client_key
     * @returns {FheInt128}
     */
    static encrypt_with_client_key(value: any, client_key: TfheClientKey): FheInt128;
    /**
     * @param {any} value
     * @param {TfhePublicKey} public_key
     * @returns {FheInt128}
     */
    static encrypt_with_public_key(value: any, public_key: TfhePublicKey): FheInt128;
    /**
     * @param {any} value
     * @param {TfheCompressedPublicKey} compressed_public_key
     * @returns {FheInt128}
     */
    static encrypt_with_compressed_public_key(value: any, compressed_public_key: TfheCompressedPublicKey): FheInt128;
    /**
     * @param {any} value
     * @param {TfheCompactPublicKey} compact_public_key
     * @returns {FheInt128}
     */
    static encrypt_with_compact_public_key(value: any, compact_public_key: TfheCompactPublicKey): FheInt128;
    /**
     * @param {Uint8Array} buffer
     * @returns {FheInt128}
     */
    static deserialize(buffer: Uint8Array): FheInt128;
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {FheInt128}
     */
    static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): FheInt128;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @param {TfheClientKey} client_key
     * @returns {any}
     */
    decrypt(client_key: TfheClientKey): any;
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
    /**
     * @param {bigint} serialized_size_limit
     * @returns {Uint8Array}
     */
    safe_serialize(serialized_size_limit: bigint): Uint8Array;
}
/**
 */
export class FheInt16 {
    static __wrap(ptr: any): any;
    /**
     * @param {number} value
     * @param {TfheClientKey} client_key
     * @returns {FheInt16}
     */
    static encrypt_with_client_key(value: number, client_key: TfheClientKey): FheInt16;
    /**
     * @param {number} value
     * @param {TfhePublicKey} public_key
     * @returns {FheInt16}
     */
    static encrypt_with_public_key(value: number, public_key: TfhePublicKey): FheInt16;
    /**
     * @param {number} value
     * @param {TfheCompressedPublicKey} compressed_public_key
     * @returns {FheInt16}
     */
    static encrypt_with_compressed_public_key(value: number, compressed_public_key: TfheCompressedPublicKey): FheInt16;
    /**
     * @param {number} value
     * @param {TfheCompactPublicKey} compact_public_key
     * @returns {FheInt16}
     */
    static encrypt_with_compact_public_key(value: number, compact_public_key: TfheCompactPublicKey): FheInt16;
    /**
     * @param {Uint8Array} buffer
     * @returns {FheInt16}
     */
    static deserialize(buffer: Uint8Array): FheInt16;
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {FheInt16}
     */
    static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): FheInt16;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @param {TfheClientKey} client_key
     * @returns {number}
     */
    decrypt(client_key: TfheClientKey): number;
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
    /**
     * @param {bigint} serialized_size_limit
     * @returns {Uint8Array}
     */
    safe_serialize(serialized_size_limit: bigint): Uint8Array;
}
/**
 */
export class FheInt160 {
    static __wrap(ptr: any): any;
    /**
     * @param {any} value
     * @param {TfheClientKey} client_key
     * @returns {FheInt160}
     */
    static encrypt_with_client_key(value: any, client_key: TfheClientKey): FheInt160;
    /**
     * @param {any} value
     * @param {TfhePublicKey} public_key
     * @returns {FheInt160}
     */
    static encrypt_with_public_key(value: any, public_key: TfhePublicKey): FheInt160;
    /**
     * @param {any} value
     * @param {TfheCompressedPublicKey} compressed_public_key
     * @returns {FheInt160}
     */
    static encrypt_with_compressed_public_key(value: any, compressed_public_key: TfheCompressedPublicKey): FheInt160;
    /**
     * @param {any} value
     * @param {TfheCompactPublicKey} compact_public_key
     * @returns {FheInt160}
     */
    static encrypt_with_compact_public_key(value: any, compact_public_key: TfheCompactPublicKey): FheInt160;
    /**
     * @param {Uint8Array} buffer
     * @returns {FheInt160}
     */
    static deserialize(buffer: Uint8Array): FheInt160;
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {FheInt160}
     */
    static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): FheInt160;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @param {TfheClientKey} client_key
     * @returns {any}
     */
    decrypt(client_key: TfheClientKey): any;
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
    /**
     * @param {bigint} serialized_size_limit
     * @returns {Uint8Array}
     */
    safe_serialize(serialized_size_limit: bigint): Uint8Array;
}
/**
 */
export class FheInt256 {
    static __wrap(ptr: any): any;
    /**
     * @param {any} value
     * @param {TfheClientKey} client_key
     * @returns {FheInt256}
     */
    static encrypt_with_client_key(value: any, client_key: TfheClientKey): FheInt256;
    /**
     * @param {any} value
     * @param {TfhePublicKey} public_key
     * @returns {FheInt256}
     */
    static encrypt_with_public_key(value: any, public_key: TfhePublicKey): FheInt256;
    /**
     * @param {any} value
     * @param {TfheCompressedPublicKey} compressed_public_key
     * @returns {FheInt256}
     */
    static encrypt_with_compressed_public_key(value: any, compressed_public_key: TfheCompressedPublicKey): FheInt256;
    /**
     * @param {any} value
     * @param {TfheCompactPublicKey} compact_public_key
     * @returns {FheInt256}
     */
    static encrypt_with_compact_public_key(value: any, compact_public_key: TfheCompactPublicKey): FheInt256;
    /**
     * @param {Uint8Array} buffer
     * @returns {FheInt256}
     */
    static deserialize(buffer: Uint8Array): FheInt256;
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {FheInt256}
     */
    static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): FheInt256;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @param {TfheClientKey} client_key
     * @returns {any}
     */
    decrypt(client_key: TfheClientKey): any;
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
    /**
     * @param {bigint} serialized_size_limit
     * @returns {Uint8Array}
     */
    safe_serialize(serialized_size_limit: bigint): Uint8Array;
}
/**
 */
export class FheInt32 {
    static __wrap(ptr: any): any;
    /**
     * @param {number} value
     * @param {TfheClientKey} client_key
     * @returns {FheInt32}
     */
    static encrypt_with_client_key(value: number, client_key: TfheClientKey): FheInt32;
    /**
     * @param {number} value
     * @param {TfhePublicKey} public_key
     * @returns {FheInt32}
     */
    static encrypt_with_public_key(value: number, public_key: TfhePublicKey): FheInt32;
    /**
     * @param {number} value
     * @param {TfheCompressedPublicKey} compressed_public_key
     * @returns {FheInt32}
     */
    static encrypt_with_compressed_public_key(value: number, compressed_public_key: TfheCompressedPublicKey): FheInt32;
    /**
     * @param {number} value
     * @param {TfheCompactPublicKey} compact_public_key
     * @returns {FheInt32}
     */
    static encrypt_with_compact_public_key(value: number, compact_public_key: TfheCompactPublicKey): FheInt32;
    /**
     * @param {Uint8Array} buffer
     * @returns {FheInt32}
     */
    static deserialize(buffer: Uint8Array): FheInt32;
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {FheInt32}
     */
    static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): FheInt32;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @param {TfheClientKey} client_key
     * @returns {number}
     */
    decrypt(client_key: TfheClientKey): number;
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
    /**
     * @param {bigint} serialized_size_limit
     * @returns {Uint8Array}
     */
    safe_serialize(serialized_size_limit: bigint): Uint8Array;
}
/**
 */
export class FheInt64 {
    static __wrap(ptr: any): any;
    /**
     * @param {bigint} value
     * @param {TfheClientKey} client_key
     * @returns {FheInt64}
     */
    static encrypt_with_client_key(value: bigint, client_key: TfheClientKey): FheInt64;
    /**
     * @param {bigint} value
     * @param {TfhePublicKey} public_key
     * @returns {FheInt64}
     */
    static encrypt_with_public_key(value: bigint, public_key: TfhePublicKey): FheInt64;
    /**
     * @param {bigint} value
     * @param {TfheCompressedPublicKey} compressed_public_key
     * @returns {FheInt64}
     */
    static encrypt_with_compressed_public_key(value: bigint, compressed_public_key: TfheCompressedPublicKey): FheInt64;
    /**
     * @param {bigint} value
     * @param {TfheCompactPublicKey} compact_public_key
     * @returns {FheInt64}
     */
    static encrypt_with_compact_public_key(value: bigint, compact_public_key: TfheCompactPublicKey): FheInt64;
    /**
     * @param {Uint8Array} buffer
     * @returns {FheInt64}
     */
    static deserialize(buffer: Uint8Array): FheInt64;
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {FheInt64}
     */
    static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): FheInt64;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @param {TfheClientKey} client_key
     * @returns {bigint}
     */
    decrypt(client_key: TfheClientKey): bigint;
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
    /**
     * @param {bigint} serialized_size_limit
     * @returns {Uint8Array}
     */
    safe_serialize(serialized_size_limit: bigint): Uint8Array;
}
/**
 */
export class FheInt8 {
    static __wrap(ptr: any): any;
    /**
     * @param {number} value
     * @param {TfheClientKey} client_key
     * @returns {FheInt8}
     */
    static encrypt_with_client_key(value: number, client_key: TfheClientKey): FheInt8;
    /**
     * @param {number} value
     * @param {TfhePublicKey} public_key
     * @returns {FheInt8}
     */
    static encrypt_with_public_key(value: number, public_key: TfhePublicKey): FheInt8;
    /**
     * @param {number} value
     * @param {TfheCompressedPublicKey} compressed_public_key
     * @returns {FheInt8}
     */
    static encrypt_with_compressed_public_key(value: number, compressed_public_key: TfheCompressedPublicKey): FheInt8;
    /**
     * @param {number} value
     * @param {TfheCompactPublicKey} compact_public_key
     * @returns {FheInt8}
     */
    static encrypt_with_compact_public_key(value: number, compact_public_key: TfheCompactPublicKey): FheInt8;
    /**
     * @param {Uint8Array} buffer
     * @returns {FheInt8}
     */
    static deserialize(buffer: Uint8Array): FheInt8;
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {FheInt8}
     */
    static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): FheInt8;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @param {TfheClientKey} client_key
     * @returns {number}
     */
    decrypt(client_key: TfheClientKey): number;
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
    /**
     * @param {bigint} serialized_size_limit
     * @returns {Uint8Array}
     */
    safe_serialize(serialized_size_limit: bigint): Uint8Array;
}
/**
 */
export class FheUint128 {
    static __wrap(ptr: any): any;
    /**
     * @param {any} value
     * @param {TfheClientKey} client_key
     * @returns {FheUint128}
     */
    static encrypt_with_client_key(value: any, client_key: TfheClientKey): FheUint128;
    /**
     * @param {any} value
     * @param {TfhePublicKey} public_key
     * @returns {FheUint128}
     */
    static encrypt_with_public_key(value: any, public_key: TfhePublicKey): FheUint128;
    /**
     * @param {any} value
     * @param {TfheCompressedPublicKey} compressed_public_key
     * @returns {FheUint128}
     */
    static encrypt_with_compressed_public_key(value: any, compressed_public_key: TfheCompressedPublicKey): FheUint128;
    /**
     * @param {any} value
     * @param {TfheCompactPublicKey} compact_public_key
     * @returns {FheUint128}
     */
    static encrypt_with_compact_public_key(value: any, compact_public_key: TfheCompactPublicKey): FheUint128;
    /**
     * @param {Uint8Array} buffer
     * @returns {FheUint128}
     */
    static deserialize(buffer: Uint8Array): FheUint128;
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {FheUint128}
     */
    static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): FheUint128;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @param {TfheClientKey} client_key
     * @returns {any}
     */
    decrypt(client_key: TfheClientKey): any;
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
    /**
     * @param {bigint} serialized_size_limit
     * @returns {Uint8Array}
     */
    safe_serialize(serialized_size_limit: bigint): Uint8Array;
}
/**
 */
export class FheUint16 {
    static __wrap(ptr: any): any;
    /**
     * @param {number} value
     * @param {TfheClientKey} client_key
     * @returns {FheUint16}
     */
    static encrypt_with_client_key(value: number, client_key: TfheClientKey): FheUint16;
    /**
     * @param {number} value
     * @param {TfhePublicKey} public_key
     * @returns {FheUint16}
     */
    static encrypt_with_public_key(value: number, public_key: TfhePublicKey): FheUint16;
    /**
     * @param {number} value
     * @param {TfheCompressedPublicKey} compressed_public_key
     * @returns {FheUint16}
     */
    static encrypt_with_compressed_public_key(value: number, compressed_public_key: TfheCompressedPublicKey): FheUint16;
    /**
     * @param {number} value
     * @param {TfheCompactPublicKey} compact_public_key
     * @returns {FheUint16}
     */
    static encrypt_with_compact_public_key(value: number, compact_public_key: TfheCompactPublicKey): FheUint16;
    /**
     * @param {Uint8Array} buffer
     * @returns {FheUint16}
     */
    static deserialize(buffer: Uint8Array): FheUint16;
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {FheUint16}
     */
    static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): FheUint16;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @param {TfheClientKey} client_key
     * @returns {number}
     */
    decrypt(client_key: TfheClientKey): number;
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
    /**
     * @param {bigint} serialized_size_limit
     * @returns {Uint8Array}
     */
    safe_serialize(serialized_size_limit: bigint): Uint8Array;
}
/**
 */
export class FheUint160 {
    static __wrap(ptr: any): any;
    /**
     * @param {any} value
     * @param {TfheClientKey} client_key
     * @returns {FheUint160}
     */
    static encrypt_with_client_key(value: any, client_key: TfheClientKey): FheUint160;
    /**
     * @param {any} value
     * @param {TfhePublicKey} public_key
     * @returns {FheUint160}
     */
    static encrypt_with_public_key(value: any, public_key: TfhePublicKey): FheUint160;
    /**
     * @param {any} value
     * @param {TfheCompressedPublicKey} compressed_public_key
     * @returns {FheUint160}
     */
    static encrypt_with_compressed_public_key(value: any, compressed_public_key: TfheCompressedPublicKey): FheUint160;
    /**
     * @param {any} value
     * @param {TfheCompactPublicKey} compact_public_key
     * @returns {FheUint160}
     */
    static encrypt_with_compact_public_key(value: any, compact_public_key: TfheCompactPublicKey): FheUint160;
    /**
     * @param {Uint8Array} buffer
     * @returns {FheUint160}
     */
    static deserialize(buffer: Uint8Array): FheUint160;
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {FheUint160}
     */
    static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): FheUint160;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @param {TfheClientKey} client_key
     * @returns {any}
     */
    decrypt(client_key: TfheClientKey): any;
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
    /**
     * @param {bigint} serialized_size_limit
     * @returns {Uint8Array}
     */
    safe_serialize(serialized_size_limit: bigint): Uint8Array;
}
/**
 */
export class FheUint256 {
    static __wrap(ptr: any): any;
    /**
     * @param {any} value
     * @param {TfheClientKey} client_key
     * @returns {FheUint256}
     */
    static encrypt_with_client_key(value: any, client_key: TfheClientKey): FheUint256;
    /**
     * @param {any} value
     * @param {TfhePublicKey} public_key
     * @returns {FheUint256}
     */
    static encrypt_with_public_key(value: any, public_key: TfhePublicKey): FheUint256;
    /**
     * @param {any} value
     * @param {TfheCompressedPublicKey} compressed_public_key
     * @returns {FheUint256}
     */
    static encrypt_with_compressed_public_key(value: any, compressed_public_key: TfheCompressedPublicKey): FheUint256;
    /**
     * @param {any} value
     * @param {TfheCompactPublicKey} compact_public_key
     * @returns {FheUint256}
     */
    static encrypt_with_compact_public_key(value: any, compact_public_key: TfheCompactPublicKey): FheUint256;
    /**
     * @param {Uint8Array} buffer
     * @returns {FheUint256}
     */
    static deserialize(buffer: Uint8Array): FheUint256;
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {FheUint256}
     */
    static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): FheUint256;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @param {TfheClientKey} client_key
     * @returns {any}
     */
    decrypt(client_key: TfheClientKey): any;
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
    /**
     * @param {bigint} serialized_size_limit
     * @returns {Uint8Array}
     */
    safe_serialize(serialized_size_limit: bigint): Uint8Array;
}
/**
 */
export class FheUint32 {
    static __wrap(ptr: any): any;
    /**
     * @param {number} value
     * @param {TfheClientKey} client_key
     * @returns {FheUint32}
     */
    static encrypt_with_client_key(value: number, client_key: TfheClientKey): FheUint32;
    /**
     * @param {number} value
     * @param {TfhePublicKey} public_key
     * @returns {FheUint32}
     */
    static encrypt_with_public_key(value: number, public_key: TfhePublicKey): FheUint32;
    /**
     * @param {number} value
     * @param {TfheCompressedPublicKey} compressed_public_key
     * @returns {FheUint32}
     */
    static encrypt_with_compressed_public_key(value: number, compressed_public_key: TfheCompressedPublicKey): FheUint32;
    /**
     * @param {number} value
     * @param {TfheCompactPublicKey} compact_public_key
     * @returns {FheUint32}
     */
    static encrypt_with_compact_public_key(value: number, compact_public_key: TfheCompactPublicKey): FheUint32;
    /**
     * @param {Uint8Array} buffer
     * @returns {FheUint32}
     */
    static deserialize(buffer: Uint8Array): FheUint32;
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {FheUint32}
     */
    static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): FheUint32;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @param {TfheClientKey} client_key
     * @returns {number}
     */
    decrypt(client_key: TfheClientKey): number;
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
    /**
     * @param {bigint} serialized_size_limit
     * @returns {Uint8Array}
     */
    safe_serialize(serialized_size_limit: bigint): Uint8Array;
}
/**
 */
export class FheUint64 {
    static __wrap(ptr: any): any;
    /**
     * @param {bigint} value
     * @param {TfheClientKey} client_key
     * @returns {FheUint64}
     */
    static encrypt_with_client_key(value: bigint, client_key: TfheClientKey): FheUint64;
    /**
     * @param {bigint} value
     * @param {TfhePublicKey} public_key
     * @returns {FheUint64}
     */
    static encrypt_with_public_key(value: bigint, public_key: TfhePublicKey): FheUint64;
    /**
     * @param {bigint} value
     * @param {TfheCompressedPublicKey} compressed_public_key
     * @returns {FheUint64}
     */
    static encrypt_with_compressed_public_key(value: bigint, compressed_public_key: TfheCompressedPublicKey): FheUint64;
    /**
     * @param {bigint} value
     * @param {TfheCompactPublicKey} compact_public_key
     * @returns {FheUint64}
     */
    static encrypt_with_compact_public_key(value: bigint, compact_public_key: TfheCompactPublicKey): FheUint64;
    /**
     * @param {Uint8Array} buffer
     * @returns {FheUint64}
     */
    static deserialize(buffer: Uint8Array): FheUint64;
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {FheUint64}
     */
    static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): FheUint64;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @param {TfheClientKey} client_key
     * @returns {bigint}
     */
    decrypt(client_key: TfheClientKey): bigint;
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
    /**
     * @param {bigint} serialized_size_limit
     * @returns {Uint8Array}
     */
    safe_serialize(serialized_size_limit: bigint): Uint8Array;
}
/**
 */
export class FheUint8 {
    static __wrap(ptr: any): any;
    /**
     * @param {number} value
     * @param {TfheClientKey} client_key
     * @returns {FheUint8}
     */
    static encrypt_with_client_key(value: number, client_key: TfheClientKey): FheUint8;
    /**
     * @param {number} value
     * @param {TfhePublicKey} public_key
     * @returns {FheUint8}
     */
    static encrypt_with_public_key(value: number, public_key: TfhePublicKey): FheUint8;
    /**
     * @param {number} value
     * @param {TfheCompressedPublicKey} compressed_public_key
     * @returns {FheUint8}
     */
    static encrypt_with_compressed_public_key(value: number, compressed_public_key: TfheCompressedPublicKey): FheUint8;
    /**
     * @param {number} value
     * @param {TfheCompactPublicKey} compact_public_key
     * @returns {FheUint8}
     */
    static encrypt_with_compact_public_key(value: number, compact_public_key: TfheCompactPublicKey): FheUint8;
    /**
     * @param {Uint8Array} buffer
     * @returns {FheUint8}
     */
    static deserialize(buffer: Uint8Array): FheUint8;
    /**
     * @param {Uint8Array} buffer
     * @param {bigint} serialized_size_limit
     * @returns {FheUint8}
     */
    static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): FheUint8;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @param {TfheClientKey} client_key
     * @returns {number}
     */
    decrypt(client_key: TfheClientKey): number;
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
    /**
     * @param {bigint} serialized_size_limit
     * @returns {Uint8Array}
     */
    safe_serialize(serialized_size_limit: bigint): Uint8Array;
}
/**
 */
export class TfheClientKey {
    static __wrap(ptr: any): any;
    /**
     * @param {TfheConfig} config
     * @returns {TfheClientKey}
     */
    static generate(config: TfheConfig): TfheClientKey;
    /**
     * @param {TfheConfig} config
     * @param {any} seed
     * @returns {TfheClientKey}
     */
    static generate_with_seed(config: TfheConfig, seed: any): TfheClientKey;
    /**
     * @param {Uint8Array} buffer
     * @returns {TfheClientKey}
     */
    static deserialize(buffer: Uint8Array): TfheClientKey;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
}
/**
 */
export class TfheCompactPublicKey {
    static __wrap(ptr: any): any;
    /**
     * @param {TfheClientKey} client_key
     * @returns {TfheCompactPublicKey}
     */
    static "new"(client_key: TfheClientKey): TfheCompactPublicKey;
    /**
     * @param {Uint8Array} buffer
     * @returns {TfheCompactPublicKey}
     */
    static deserialize(buffer: Uint8Array): TfheCompactPublicKey;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
}
/**
 */
export class TfheCompressedCompactPublicKey {
    static __wrap(ptr: any): any;
    /**
     * @param {TfheClientKey} client_key
     * @returns {TfheCompressedCompactPublicKey}
     */
    static "new"(client_key: TfheClientKey): TfheCompressedCompactPublicKey;
    /**
     * @param {Uint8Array} buffer
     * @returns {TfheCompressedCompactPublicKey}
     */
    static deserialize(buffer: Uint8Array): TfheCompressedCompactPublicKey;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
    /**
     * @returns {TfheCompactPublicKey}
     */
    decompress(): TfheCompactPublicKey;
}
/**
 */
export class TfheCompressedPublicKey {
    static __wrap(ptr: any): any;
    /**
     * @param {TfheClientKey} client_key
     * @returns {TfheCompressedPublicKey}
     */
    static "new"(client_key: TfheClientKey): TfheCompressedPublicKey;
    /**
     * @param {Uint8Array} buffer
     * @returns {TfheCompressedPublicKey}
     */
    static deserialize(buffer: Uint8Array): TfheCompressedPublicKey;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @returns {TfhePublicKey}
     */
    decompress(): TfhePublicKey;
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
}
/**
 */
export class TfheCompressedServerKey {
    static __wrap(ptr: any): any;
    /**
     * @param {TfheClientKey} client_key
     * @returns {TfheCompressedServerKey}
     */
    static "new"(client_key: TfheClientKey): TfheCompressedServerKey;
    /**
     * @param {Uint8Array} buffer
     * @returns {TfheCompressedServerKey}
     */
    static deserialize(buffer: Uint8Array): TfheCompressedServerKey;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
}
/**
 */
export class TfheConfig {
    static __wrap(ptr: any): any;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
}
/**
 */
export class TfheConfigBuilder {
    static __wrap(ptr: any): any;
    /**
     * @returns {TfheConfigBuilder}
     */
    static default(): TfheConfigBuilder;
    /**
     * @returns {TfheConfigBuilder}
     */
    static default_with_small_encryption(): TfheConfigBuilder;
    /**
     * @returns {TfheConfigBuilder}
     */
    static default_with_big_encryption(): TfheConfigBuilder;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @returns {TfheConfig}
     */
    build(): TfheConfig;
}
/**
 */
export class TfhePublicKey {
    static __wrap(ptr: any): any;
    /**
     * @param {TfheClientKey} client_key
     * @returns {TfhePublicKey}
     */
    static "new"(client_key: TfheClientKey): TfhePublicKey;
    /**
     * @param {Uint8Array} buffer
     * @returns {TfhePublicKey}
     */
    static deserialize(buffer: Uint8Array): TfhePublicKey;
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
    /**
     * @returns {Uint8Array}
     */
    serialize(): Uint8Array;
}
/**
 */
export class tfheBrowser {
    __destroy_into_raw(): number | undefined;
    __wbg_ptr: number | undefined;
    free(): void;
}
export default __wbg_init;
export function initSync(module: any): any;
declare function __wbg_init(input: any): Promise<any>;
//# sourceMappingURL=tfhe-browser.d.ts.map