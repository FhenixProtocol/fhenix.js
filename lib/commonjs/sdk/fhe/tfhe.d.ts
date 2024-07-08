/* tslint:disable */
/* eslint-disable */
/**
*/
export function init_panic_hook(): void;
/**
*/
export enum ShortintEncryptionKeyChoice {
  Big = 0,
  Small = 1,
}
/**
*/
export enum ShortintParametersName {
  PARAM_MESSAGE_1_CARRY_0_KS_PBS = 0,
  PARAM_MESSAGE_1_CARRY_1_KS_PBS = 1,
  PARAM_MESSAGE_2_CARRY_0_KS_PBS = 2,
  PARAM_MESSAGE_1_CARRY_2_KS_PBS = 3,
  PARAM_MESSAGE_2_CARRY_1_KS_PBS = 4,
  PARAM_MESSAGE_3_CARRY_0_KS_PBS = 5,
  PARAM_MESSAGE_1_CARRY_3_KS_PBS = 6,
  PARAM_MESSAGE_2_CARRY_2_KS_PBS = 7,
  PARAM_MESSAGE_3_CARRY_1_KS_PBS = 8,
  PARAM_MESSAGE_4_CARRY_0_KS_PBS = 9,
  PARAM_MESSAGE_1_CARRY_4_KS_PBS = 10,
  PARAM_MESSAGE_2_CARRY_3_KS_PBS = 11,
  PARAM_MESSAGE_3_CARRY_2_KS_PBS = 12,
  PARAM_MESSAGE_4_CARRY_1_KS_PBS = 13,
  PARAM_MESSAGE_5_CARRY_0_KS_PBS = 14,
  PARAM_MESSAGE_1_CARRY_5_KS_PBS = 15,
  PARAM_MESSAGE_2_CARRY_4_KS_PBS = 16,
  PARAM_MESSAGE_3_CARRY_3_KS_PBS = 17,
  PARAM_MESSAGE_4_CARRY_2_KS_PBS = 18,
  PARAM_MESSAGE_5_CARRY_1_KS_PBS = 19,
  PARAM_MESSAGE_6_CARRY_0_KS_PBS = 20,
  PARAM_MESSAGE_1_CARRY_6_KS_PBS = 21,
  PARAM_MESSAGE_2_CARRY_5_KS_PBS = 22,
  PARAM_MESSAGE_3_CARRY_4_KS_PBS = 23,
  PARAM_MESSAGE_4_CARRY_3_KS_PBS = 24,
  PARAM_MESSAGE_5_CARRY_2_KS_PBS = 25,
  PARAM_MESSAGE_6_CARRY_1_KS_PBS = 26,
  PARAM_MESSAGE_7_CARRY_0_KS_PBS = 27,
  PARAM_MESSAGE_1_CARRY_7_KS_PBS = 28,
  PARAM_MESSAGE_2_CARRY_6_KS_PBS = 29,
  PARAM_MESSAGE_3_CARRY_5_KS_PBS = 30,
  PARAM_MESSAGE_4_CARRY_4_KS_PBS = 31,
  PARAM_MESSAGE_5_CARRY_3_KS_PBS = 32,
  PARAM_MESSAGE_6_CARRY_2_KS_PBS = 33,
  PARAM_MESSAGE_7_CARRY_1_KS_PBS = 34,
  PARAM_MESSAGE_8_CARRY_0_KS_PBS = 35,
  PARAM_MESSAGE_1_CARRY_1_PBS_KS = 36,
  PARAM_MESSAGE_2_CARRY_2_PBS_KS = 37,
  PARAM_MESSAGE_3_CARRY_3_PBS_KS = 38,
  PARAM_MESSAGE_4_CARRY_4_PBS_KS = 39,
  PARAM_MESSAGE_1_CARRY_2_COMPACT_PK_KS_PBS = 40,
  PARAM_MESSAGE_1_CARRY_3_COMPACT_PK_KS_PBS = 41,
  PARAM_MESSAGE_1_CARRY_4_COMPACT_PK_KS_PBS = 42,
  PARAM_MESSAGE_1_CARRY_5_COMPACT_PK_KS_PBS = 43,
  PARAM_MESSAGE_1_CARRY_6_COMPACT_PK_KS_PBS = 44,
  PARAM_MESSAGE_1_CARRY_7_COMPACT_PK_KS_PBS = 45,
  PARAM_MESSAGE_2_CARRY_1_COMPACT_PK_KS_PBS = 46,
  PARAM_MESSAGE_2_CARRY_2_COMPACT_PK_KS_PBS = 47,
  PARAM_MESSAGE_2_CARRY_3_COMPACT_PK_KS_PBS = 48,
  PARAM_MESSAGE_2_CARRY_4_COMPACT_PK_KS_PBS = 49,
  PARAM_MESSAGE_2_CARRY_5_COMPACT_PK_KS_PBS = 50,
  PARAM_MESSAGE_2_CARRY_6_COMPACT_PK_KS_PBS = 51,
  PARAM_MESSAGE_3_CARRY_1_COMPACT_PK_KS_PBS = 52,
  PARAM_MESSAGE_3_CARRY_2_COMPACT_PK_KS_PBS = 53,
  PARAM_MESSAGE_3_CARRY_3_COMPACT_PK_KS_PBS = 54,
  PARAM_MESSAGE_3_CARRY_4_COMPACT_PK_KS_PBS = 55,
  PARAM_MESSAGE_3_CARRY_5_COMPACT_PK_KS_PBS = 56,
  PARAM_MESSAGE_4_CARRY_1_COMPACT_PK_KS_PBS = 57,
  PARAM_MESSAGE_4_CARRY_2_COMPACT_PK_KS_PBS = 58,
  PARAM_MESSAGE_4_CARRY_3_COMPACT_PK_KS_PBS = 59,
  PARAM_MESSAGE_4_CARRY_4_COMPACT_PK_KS_PBS = 60,
  PARAM_MESSAGE_5_CARRY_1_COMPACT_PK_KS_PBS = 61,
  PARAM_MESSAGE_5_CARRY_2_COMPACT_PK_KS_PBS = 62,
  PARAM_MESSAGE_5_CARRY_3_COMPACT_PK_KS_PBS = 63,
  PARAM_MESSAGE_6_CARRY_1_COMPACT_PK_KS_PBS = 64,
  PARAM_MESSAGE_6_CARRY_2_COMPACT_PK_KS_PBS = 65,
  PARAM_MESSAGE_7_CARRY_1_COMPACT_PK_KS_PBS = 66,
  PARAM_MESSAGE_1_CARRY_1_COMPACT_PK_PBS_KS = 67,
  PARAM_MESSAGE_2_CARRY_2_COMPACT_PK_PBS_KS = 68,
  PARAM_MESSAGE_3_CARRY_3_COMPACT_PK_PBS_KS = 69,
  PARAM_MESSAGE_4_CARRY_4_COMPACT_PK_PBS_KS = 70,
  PARAM_MESSAGE_1_CARRY_2_COMPACT_PK_KS_PBS_TUNIFORM_2M40 = 71,
  PARAM_MESSAGE_1_CARRY_3_COMPACT_PK_KS_PBS_TUNIFORM_2M40 = 72,
  PARAM_MESSAGE_1_CARRY_4_COMPACT_PK_KS_PBS_TUNIFORM_2M40 = 73,
  PARAM_MESSAGE_1_CARRY_5_COMPACT_PK_KS_PBS_TUNIFORM_2M40 = 74,
  PARAM_MESSAGE_1_CARRY_6_COMPACT_PK_KS_PBS_TUNIFORM_2M40 = 75,
  PARAM_MESSAGE_1_CARRY_7_COMPACT_PK_KS_PBS_TUNIFORM_2M40 = 76,
  PARAM_MESSAGE_2_CARRY_1_COMPACT_PK_KS_PBS_TUNIFORM_2M40 = 77,
  PARAM_MESSAGE_2_CARRY_2_COMPACT_PK_KS_PBS_TUNIFORM_2M40 = 78,
  PARAM_MESSAGE_2_CARRY_3_COMPACT_PK_KS_PBS_TUNIFORM_2M40 = 79,
  PARAM_MESSAGE_2_CARRY_4_COMPACT_PK_KS_PBS_TUNIFORM_2M40 = 80,
  PARAM_MESSAGE_2_CARRY_5_COMPACT_PK_KS_PBS_TUNIFORM_2M40 = 81,
  PARAM_MESSAGE_2_CARRY_6_COMPACT_PK_KS_PBS_TUNIFORM_2M40 = 82,
  PARAM_MESSAGE_3_CARRY_1_COMPACT_PK_KS_PBS_TUNIFORM_2M40 = 83,
  PARAM_MESSAGE_3_CARRY_2_COMPACT_PK_KS_PBS_TUNIFORM_2M40 = 84,
  PARAM_MESSAGE_3_CARRY_3_COMPACT_PK_KS_PBS_TUNIFORM_2M40 = 85,
  PARAM_MESSAGE_3_CARRY_4_COMPACT_PK_KS_PBS_TUNIFORM_2M40 = 86,
  PARAM_MESSAGE_3_CARRY_5_COMPACT_PK_KS_PBS_TUNIFORM_2M40 = 87,
  PARAM_MESSAGE_4_CARRY_1_COMPACT_PK_KS_PBS_TUNIFORM_2M40 = 88,
  PARAM_MESSAGE_4_CARRY_2_COMPACT_PK_KS_PBS_TUNIFORM_2M40 = 89,
  PARAM_MESSAGE_4_CARRY_3_COMPACT_PK_KS_PBS_TUNIFORM_2M40 = 90,
  PARAM_MESSAGE_4_CARRY_4_COMPACT_PK_KS_PBS_TUNIFORM_2M40 = 91,
  PARAM_MESSAGE_5_CARRY_1_COMPACT_PK_KS_PBS_TUNIFORM_2M40 = 92,
  PARAM_MESSAGE_5_CARRY_2_COMPACT_PK_KS_PBS_TUNIFORM_2M40 = 93,
  PARAM_MESSAGE_5_CARRY_3_COMPACT_PK_KS_PBS_TUNIFORM_2M40 = 94,
  PARAM_MESSAGE_6_CARRY_1_COMPACT_PK_KS_PBS_TUNIFORM_2M40 = 95,
  PARAM_MESSAGE_6_CARRY_2_COMPACT_PK_KS_PBS_TUNIFORM_2M40 = 96,
  PARAM_MESSAGE_7_CARRY_1_COMPACT_PK_KS_PBS_TUNIFORM_2M40 = 97,
  PARAM_MESSAGE_1_CARRY_0 = 98,
  PARAM_MESSAGE_1_CARRY_1 = 99,
  PARAM_MESSAGE_2_CARRY_0 = 100,
  PARAM_MESSAGE_1_CARRY_2 = 101,
  PARAM_MESSAGE_2_CARRY_1 = 102,
  PARAM_MESSAGE_3_CARRY_0 = 103,
  PARAM_MESSAGE_1_CARRY_3 = 104,
  PARAM_MESSAGE_2_CARRY_2 = 105,
  PARAM_MESSAGE_3_CARRY_1 = 106,
  PARAM_MESSAGE_4_CARRY_0 = 107,
  PARAM_MESSAGE_1_CARRY_4 = 108,
  PARAM_MESSAGE_2_CARRY_3 = 109,
  PARAM_MESSAGE_3_CARRY_2 = 110,
  PARAM_MESSAGE_4_CARRY_1 = 111,
  PARAM_MESSAGE_5_CARRY_0 = 112,
  PARAM_MESSAGE_1_CARRY_5 = 113,
  PARAM_MESSAGE_2_CARRY_4 = 114,
  PARAM_MESSAGE_3_CARRY_3 = 115,
  PARAM_MESSAGE_4_CARRY_2 = 116,
  PARAM_MESSAGE_5_CARRY_1 = 117,
  PARAM_MESSAGE_6_CARRY_0 = 118,
  PARAM_MESSAGE_1_CARRY_6 = 119,
  PARAM_MESSAGE_2_CARRY_5 = 120,
  PARAM_MESSAGE_3_CARRY_4 = 121,
  PARAM_MESSAGE_4_CARRY_3 = 122,
  PARAM_MESSAGE_5_CARRY_2 = 123,
  PARAM_MESSAGE_6_CARRY_1 = 124,
  PARAM_MESSAGE_7_CARRY_0 = 125,
  PARAM_MESSAGE_1_CARRY_7 = 126,
  PARAM_MESSAGE_2_CARRY_6 = 127,
  PARAM_MESSAGE_3_CARRY_5 = 128,
  PARAM_MESSAGE_4_CARRY_4 = 129,
  PARAM_MESSAGE_5_CARRY_3 = 130,
  PARAM_MESSAGE_6_CARRY_2 = 131,
  PARAM_MESSAGE_7_CARRY_1 = 132,
  PARAM_MESSAGE_8_CARRY_0 = 133,
  PARAM_SMALL_MESSAGE_1_CARRY_1 = 134,
  PARAM_SMALL_MESSAGE_2_CARRY_2 = 135,
  PARAM_SMALL_MESSAGE_3_CARRY_3 = 136,
  PARAM_SMALL_MESSAGE_4_CARRY_4 = 137,
}
/**
*/
export enum BooleanParameterSet {
  Default = 0,
  TfheLib = 1,
  DefaultKsPbs = 2,
  TfheLibKsPbs = 3,
}
/**
*/
export enum BooleanEncryptionKeyChoice {
  Big = 0,
  Small = 1,
}
/**
*/
export class Boolean {
  free(): void;
/**
* @param {number} parameter_choice
* @returns {BooleanParameters}
*/
  static get_parameters(parameter_choice: number): BooleanParameters;
/**
* @param {number} std_dev
* @returns {BooleanNoiseDistribution}
*/
  static new_gaussian_from_std_dev(std_dev: number): BooleanNoiseDistribution;
/**
* @param {number} bound_log2
* @returns {BooleanNoiseDistribution}
*/
  static try_new_t_uniform(bound_log2: number): BooleanNoiseDistribution;
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
  static new_parameters(lwe_dimension: number, glwe_dimension: number, polynomial_size: number, lwe_noise_distribution: BooleanNoiseDistribution, glwe_noise_distribution: BooleanNoiseDistribution, pbs_base_log: number, pbs_level: number, ks_base_log: number, ks_level: number, encryption_key_choice: number): BooleanParameters;
/**
* @param {bigint} seed_high_bytes
* @param {bigint} seed_low_bytes
* @param {BooleanParameters} parameters
* @returns {BooleanClientKey}
*/
  static new_client_key_from_seed_and_parameters(seed_high_bytes: bigint, seed_low_bytes: bigint, parameters: BooleanParameters): BooleanClientKey;
/**
* @param {BooleanParameters} parameters
* @returns {BooleanClientKey}
*/
  static new_client_key(parameters: BooleanParameters): BooleanClientKey;
/**
* @param {BooleanClientKey} client_key
* @returns {BooleanPublicKey}
*/
  static new_public_key(client_key: BooleanClientKey): BooleanPublicKey;
/**
* @param {BooleanClientKey} client_key
* @returns {BooleanCompressedServerKey}
*/
  static new_compressed_server_key(client_key: BooleanClientKey): BooleanCompressedServerKey;
/**
* @param {BooleanClientKey} client_key
* @param {boolean} message
* @returns {BooleanCiphertext}
*/
  static encrypt(client_key: BooleanClientKey, message: boolean): BooleanCiphertext;
/**
* @param {BooleanClientKey} client_key
* @param {boolean} message
* @returns {BooleanCompressedCiphertext}
*/
  static encrypt_compressed(client_key: BooleanClientKey, message: boolean): BooleanCompressedCiphertext;
/**
* @param {BooleanCompressedCiphertext} compressed_ciphertext
* @returns {BooleanCiphertext}
*/
  static decompress_ciphertext(compressed_ciphertext: BooleanCompressedCiphertext): BooleanCiphertext;
/**
* @param {BooleanPublicKey} public_key
* @param {boolean} message
* @returns {BooleanCiphertext}
*/
  static encrypt_with_public_key(public_key: BooleanPublicKey, message: boolean): BooleanCiphertext;
/**
* @param {boolean} message
* @returns {BooleanCiphertext}
*/
  static trivial_encrypt(message: boolean): BooleanCiphertext;
/**
* @param {BooleanClientKey} client_key
* @param {BooleanCiphertext} ct
* @returns {boolean}
*/
  static decrypt(client_key: BooleanClientKey, ct: BooleanCiphertext): boolean;
/**
* @param {BooleanCiphertext} ciphertext
* @returns {Uint8Array}
*/
  static serialize_ciphertext(ciphertext: BooleanCiphertext): Uint8Array;
/**
* @param {Uint8Array} buffer
* @returns {BooleanCiphertext}
*/
  static deserialize_ciphertext(buffer: Uint8Array): BooleanCiphertext;
/**
* @param {BooleanCompressedCiphertext} ciphertext
* @returns {Uint8Array}
*/
  static serialize_compressed_ciphertext(ciphertext: BooleanCompressedCiphertext): Uint8Array;
/**
* @param {Uint8Array} buffer
* @returns {BooleanCompressedCiphertext}
*/
  static deserialize_compressed_ciphertext(buffer: Uint8Array): BooleanCompressedCiphertext;
/**
* @param {BooleanClientKey} client_key
* @returns {Uint8Array}
*/
  static serialize_client_key(client_key: BooleanClientKey): Uint8Array;
/**
* @param {Uint8Array} buffer
* @returns {BooleanClientKey}
*/
  static deserialize_client_key(buffer: Uint8Array): BooleanClientKey;
/**
* @param {BooleanPublicKey} public_key
* @returns {Uint8Array}
*/
  static serialize_public_key(public_key: BooleanPublicKey): Uint8Array;
/**
* @param {Uint8Array} buffer
* @returns {BooleanPublicKey}
*/
  static deserialize_public_key(buffer: Uint8Array): BooleanPublicKey;
/**
* @param {BooleanCompressedServerKey} server_key
* @returns {Uint8Array}
*/
  static serialize_compressed_server_key(server_key: BooleanCompressedServerKey): Uint8Array;
/**
* @param {Uint8Array} buffer
* @returns {BooleanCompressedServerKey}
*/
  static deserialize_compressed_server_key(buffer: Uint8Array): BooleanCompressedServerKey;
}
/**
*/
export class BooleanCiphertext {
  free(): void;
}
/**
*/
export class BooleanClientKey {
  free(): void;
}
/**
*/
export class BooleanCompressedCiphertext {
  free(): void;
}
/**
*/
export class BooleanCompressedServerKey {
  free(): void;
}
/**
*/
export class BooleanNoiseDistribution {
  free(): void;
}
/**
*/
export class BooleanParameters {
  free(): void;
}
/**
*/
export class BooleanPublicKey {
  free(): void;
}
/**
*/
export class CompactFheBool {
  free(): void;
/**
* @param {boolean} value
* @param {TfheCompactPublicKey} client_key
* @returns {CompactFheBool}
*/
  static encrypt_with_compact_public_key(value: boolean, client_key: TfheCompactPublicKey): CompactFheBool;
/**
* @returns {FheBool}
*/
  expand(): FheBool;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
/**
* @param {Uint8Array} buffer
* @returns {CompactFheBool}
*/
  static deserialize(buffer: Uint8Array): CompactFheBool;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {CompactFheBool}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompactFheBool;
}
/**
*/
export class CompactFheBoolList {
  free(): void;
/**
* @returns {any[]}
*/
  expand(): any[];
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
/**
* @param {Uint8Array} buffer
* @returns {CompactFheBoolList}
*/
  static deserialize(buffer: Uint8Array): CompactFheBoolList;
}
/**
*/
export class CompactFheUint128 {
  free(): void;
/**
* @param {any} value
* @param {TfheCompactPublicKey} client_key
* @returns {CompactFheUint128}
*/
  static encrypt_with_compact_public_key(value: any, client_key: TfheCompactPublicKey): CompactFheUint128;
/**
* @returns {FheUint128}
*/
  expand(): FheUint128;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
/**
* @param {Uint8Array} buffer
* @returns {CompactFheUint128}
*/
  static deserialize(buffer: Uint8Array): CompactFheUint128;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {CompactFheUint128}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompactFheUint128;
}
/**
*/
export class CompactFheUint16 {
  free(): void;
/**
* @param {number} value
* @param {TfheCompactPublicKey} client_key
* @returns {CompactFheUint16}
*/
  static encrypt_with_compact_public_key(value: number, client_key: TfheCompactPublicKey): CompactFheUint16;
/**
* @returns {FheUint16}
*/
  expand(): FheUint16;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
/**
* @param {Uint8Array} buffer
* @returns {CompactFheUint16}
*/
  static deserialize(buffer: Uint8Array): CompactFheUint16;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {CompactFheUint16}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompactFheUint16;
}
/**
*/
export class CompactFheUint160 {
  free(): void;
/**
* @param {any} value
* @param {TfheCompactPublicKey} client_key
* @returns {CompactFheUint160}
*/
  static encrypt_with_compact_public_key(value: any, client_key: TfheCompactPublicKey): CompactFheUint160;
/**
* @returns {FheUint160}
*/
  expand(): FheUint160;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
/**
* @param {Uint8Array} buffer
* @returns {CompactFheUint160}
*/
  static deserialize(buffer: Uint8Array): CompactFheUint160;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {CompactFheUint160}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompactFheUint160;
}
/**
*/
export class CompactFheUint16List {
  free(): void;
/**
* @returns {any[]}
*/
  expand(): any[];
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
/**
* @param {Uint8Array} buffer
* @returns {CompactFheUint16List}
*/
  static deserialize(buffer: Uint8Array): CompactFheUint16List;
}
/**
*/
export class CompactFheUint256 {
  free(): void;
/**
* @param {any} value
* @param {TfheCompactPublicKey} client_key
* @returns {CompactFheUint256}
*/
  static encrypt_with_compact_public_key(value: any, client_key: TfheCompactPublicKey): CompactFheUint256;
/**
* @returns {FheUint256}
*/
  expand(): FheUint256;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
/**
* @param {Uint8Array} buffer
* @returns {CompactFheUint256}
*/
  static deserialize(buffer: Uint8Array): CompactFheUint256;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {CompactFheUint256}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompactFheUint256;
}
/**
*/
export class CompactFheUint32 {
  free(): void;
/**
* @param {number} value
* @param {TfheCompactPublicKey} client_key
* @returns {CompactFheUint32}
*/
  static encrypt_with_compact_public_key(value: number, client_key: TfheCompactPublicKey): CompactFheUint32;
/**
* @returns {FheUint32}
*/
  expand(): FheUint32;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
/**
* @param {Uint8Array} buffer
* @returns {CompactFheUint32}
*/
  static deserialize(buffer: Uint8Array): CompactFheUint32;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {CompactFheUint32}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompactFheUint32;
}
/**
*/
export class CompactFheUint32List {
  free(): void;
/**
* @returns {any[]}
*/
  expand(): any[];
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
/**
* @param {Uint8Array} buffer
* @returns {CompactFheUint32List}
*/
  static deserialize(buffer: Uint8Array): CompactFheUint32List;
}
/**
*/
export class CompactFheUint64 {
  free(): void;
/**
* @param {bigint} value
* @param {TfheCompactPublicKey} client_key
* @returns {CompactFheUint64}
*/
  static encrypt_with_compact_public_key(value: bigint, client_key: TfheCompactPublicKey): CompactFheUint64;
/**
* @returns {FheUint64}
*/
  expand(): FheUint64;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
/**
* @param {Uint8Array} buffer
* @returns {CompactFheUint64}
*/
  static deserialize(buffer: Uint8Array): CompactFheUint64;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {CompactFheUint64}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompactFheUint64;
}
/**
*/
export class CompactFheUint64List {
  free(): void;
/**
* @returns {any[]}
*/
  expand(): any[];
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
/**
* @param {Uint8Array} buffer
* @returns {CompactFheUint64List}
*/
  static deserialize(buffer: Uint8Array): CompactFheUint64List;
}
/**
*/
export class CompactFheUint8 {
  free(): void;
/**
* @param {number} value
* @param {TfheCompactPublicKey} client_key
* @returns {CompactFheUint8}
*/
  static encrypt_with_compact_public_key(value: number, client_key: TfheCompactPublicKey): CompactFheUint8;
/**
* @returns {FheUint8}
*/
  expand(): FheUint8;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
/**
* @param {Uint8Array} buffer
* @returns {CompactFheUint8}
*/
  static deserialize(buffer: Uint8Array): CompactFheUint8;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {CompactFheUint8}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompactFheUint8;
}
/**
*/
export class CompactFheUint8List {
  free(): void;
/**
* @returns {any[]}
*/
  expand(): any[];
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
/**
* @param {Uint8Array} buffer
* @returns {CompactFheUint8List}
*/
  static deserialize(buffer: Uint8Array): CompactFheUint8List;
}
/**
*/
export class CompressedFheBool {
  free(): void;
/**
* @param {boolean} value
* @param {TfheClientKey} client_key
* @returns {CompressedFheBool}
*/
  static encrypt_with_client_key(value: boolean, client_key: TfheClientKey): CompressedFheBool;
/**
* @returns {FheBool}
*/
  decompress(): FheBool;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
/**
* @param {Uint8Array} buffer
* @returns {CompressedFheBool}
*/
  static deserialize(buffer: Uint8Array): CompressedFheBool;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {CompressedFheBool}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompressedFheBool;
}
/**
*/
export class CompressedFheUint16 {
  free(): void;
/**
* @param {number} value
* @param {TfheClientKey} client_key
* @returns {CompressedFheUint16}
*/
  static encrypt_with_client_key(value: number, client_key: TfheClientKey): CompressedFheUint16;
/**
* @returns {FheUint16}
*/
  decompress(): FheUint16;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
/**
* @param {Uint8Array} buffer
* @returns {CompressedFheUint16}
*/
  static deserialize(buffer: Uint8Array): CompressedFheUint16;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {CompressedFheUint16}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompressedFheUint16;
}
/**
*/
export class CompressedFheUint32 {
  free(): void;
/**
* @param {number} value
* @param {TfheClientKey} client_key
* @returns {CompressedFheUint32}
*/
  static encrypt_with_client_key(value: number, client_key: TfheClientKey): CompressedFheUint32;
/**
* @returns {FheUint32}
*/
  decompress(): FheUint32;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
/**
* @param {Uint8Array} buffer
* @returns {CompressedFheUint32}
*/
  static deserialize(buffer: Uint8Array): CompressedFheUint32;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {CompressedFheUint32}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompressedFheUint32;
}
/**
*/
export class CompressedFheUint64 {
  free(): void;
/**
* @param {bigint} value
* @param {TfheClientKey} client_key
* @returns {CompressedFheUint64}
*/
  static encrypt_with_client_key(value: bigint, client_key: TfheClientKey): CompressedFheUint64;
/**
* @returns {FheUint64}
*/
  decompress(): FheUint64;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
/**
* @param {Uint8Array} buffer
* @returns {CompressedFheUint64}
*/
  static deserialize(buffer: Uint8Array): CompressedFheUint64;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {CompressedFheUint64}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompressedFheUint64;
}
/**
*/
export class CompressedFheUint8 {
  free(): void;
/**
* @param {number} value
* @param {TfheClientKey} client_key
* @returns {CompressedFheUint8}
*/
  static encrypt_with_client_key(value: number, client_key: TfheClientKey): CompressedFheUint8;
/**
* @returns {FheUint8}
*/
  decompress(): FheUint8;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
/**
* @param {Uint8Array} buffer
* @returns {CompressedFheUint8}
*/
  static deserialize(buffer: Uint8Array): CompressedFheUint8;
/**
* @param {bigint} serialized_size_limit
* @returns {Uint8Array}
*/
  safe_serialize(serialized_size_limit: bigint): Uint8Array;
/**
* @param {Uint8Array} buffer
* @param {bigint} serialized_size_limit
* @returns {CompressedFheUint8}
*/
  static safe_deserialize(buffer: Uint8Array, serialized_size_limit: bigint): CompressedFheUint8;
}
/**
*/
export class FheBool {
  free(): void;
/**
* @param {boolean} value
* @param {TfheCompactPublicKey} compact_public_key
* @returns {FheBool}
*/
  static encrypt_with_compact_public_key(value: boolean, compact_public_key: TfheCompactPublicKey): FheBool;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class FheUint128 {
  free(): void;
/**
* @param {any} value
* @param {TfheCompactPublicKey} compact_public_key
* @returns {FheUint128}
*/
  static encrypt_with_compact_public_key(value: any, compact_public_key: TfheCompactPublicKey): FheUint128;
}
/**
*/
export class FheUint16 {
  free(): void;
/**
* @param {number} value
* @param {TfheCompactPublicKey} compact_public_key
* @returns {FheUint16}
*/
  static encrypt_with_compact_public_key(value: number, compact_public_key: TfheCompactPublicKey): FheUint16;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class FheUint160 {
  free(): void;
/**
* @param {any} value
* @param {TfheCompactPublicKey} compact_public_key
* @returns {FheUint160}
*/
  static encrypt_with_compact_public_key(value: any, compact_public_key: TfheCompactPublicKey): FheUint160;
}
/**
*/
export class FheUint256 {
  free(): void;
/**
* @param {any} value
* @param {TfheCompactPublicKey} compact_public_key
* @returns {FheUint256}
*/
  static encrypt_with_compact_public_key(value: any, compact_public_key: TfheCompactPublicKey): FheUint256;
}
/**
*/
export class FheUint32 {
  free(): void;
/**
* @param {number} value
* @param {TfheCompactPublicKey} compact_public_key
* @returns {FheUint32}
*/
  static encrypt_with_compact_public_key(value: number, compact_public_key: TfheCompactPublicKey): FheUint32;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class FheUint64 {
  free(): void;
/**
* @param {bigint} value
* @param {TfheCompactPublicKey} compact_public_key
* @returns {FheUint64}
*/
  static encrypt_with_compact_public_key(value: bigint, compact_public_key: TfheCompactPublicKey): FheUint64;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class FheUint8 {
  free(): void;
/**
* @param {number} value
* @param {TfheCompactPublicKey} compact_public_key
* @returns {FheUint8}
*/
  static encrypt_with_compact_public_key(value: number, compact_public_key: TfheCompactPublicKey): FheUint8;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
}
/**
*/
export class Shortint {
  free(): void;
/**
* @param {number} message_bits
* @param {number} carry_bits
* @returns {ShortintParameters}
*/
  static get_parameters(message_bits: number, carry_bits: number): ShortintParameters;
/**
* @param {number} message_bits
* @param {number} carry_bits
* @returns {ShortintParameters}
*/
  static get_parameters_small(message_bits: number, carry_bits: number): ShortintParameters;
/**
* @param {number} std_dev
* @returns {ShortintNoiseDistribution}
*/
  static new_gaussian_from_std_dev(std_dev: number): ShortintNoiseDistribution;
/**
* @param {number} bound_log2
* @returns {ShortintNoiseDistribution}
*/
  static try_new_t_uniform(bound_log2: number): ShortintNoiseDistribution;
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
  static new_parameters(lwe_dimension: number, glwe_dimension: number, polynomial_size: number, lwe_noise_distribution: ShortintNoiseDistribution, glwe_noise_distribution: ShortintNoiseDistribution, pbs_base_log: number, pbs_level: number, ks_base_log: number, ks_level: number, message_modulus: number, carry_modulus: number, max_noise_level: number, log2_p_fail: number, modulus_power_of_2_exponent: number, encryption_key_choice: number): ShortintParameters;
/**
* @param {bigint} seed_high_bytes
* @param {bigint} seed_low_bytes
* @param {ShortintParameters} parameters
* @returns {ShortintClientKey}
*/
  static new_client_key_from_seed_and_parameters(seed_high_bytes: bigint, seed_low_bytes: bigint, parameters: ShortintParameters): ShortintClientKey;
/**
* @param {ShortintParameters} parameters
* @returns {ShortintClientKey}
*/
  static new_client_key(parameters: ShortintParameters): ShortintClientKey;
/**
* @param {ShortintClientKey} client_key
* @returns {ShortintPublicKey}
*/
  static new_public_key(client_key: ShortintClientKey): ShortintPublicKey;
/**
* @param {ShortintClientKey} client_key
* @returns {ShortintCompressedPublicKey}
*/
  static new_compressed_public_key(client_key: ShortintClientKey): ShortintCompressedPublicKey;
/**
* @param {ShortintClientKey} client_key
* @returns {ShortintCompressedServerKey}
*/
  static new_compressed_server_key(client_key: ShortintClientKey): ShortintCompressedServerKey;
/**
* @param {ShortintClientKey} client_key
* @param {bigint} message
* @returns {ShortintCiphertext}
*/
  static encrypt(client_key: ShortintClientKey, message: bigint): ShortintCiphertext;
/**
* @param {ShortintClientKey} client_key
* @param {bigint} message
* @returns {ShortintCompressedCiphertext}
*/
  static encrypt_compressed(client_key: ShortintClientKey, message: bigint): ShortintCompressedCiphertext;
/**
* @param {ShortintCompressedCiphertext} compressed_ciphertext
* @returns {ShortintCiphertext}
*/
  static decompress_ciphertext(compressed_ciphertext: ShortintCompressedCiphertext): ShortintCiphertext;
/**
* @param {ShortintPublicKey} public_key
* @param {bigint} message
* @returns {ShortintCiphertext}
*/
  static encrypt_with_public_key(public_key: ShortintPublicKey, message: bigint): ShortintCiphertext;
/**
* @param {ShortintCompressedPublicKey} public_key
* @param {bigint} message
* @returns {ShortintCiphertext}
*/
  static encrypt_with_compressed_public_key(public_key: ShortintCompressedPublicKey, message: bigint): ShortintCiphertext;
/**
* @param {ShortintClientKey} client_key
* @param {ShortintCiphertext} ct
* @returns {bigint}
*/
  static decrypt(client_key: ShortintClientKey, ct: ShortintCiphertext): bigint;
/**
* @param {ShortintCiphertext} ciphertext
* @returns {Uint8Array}
*/
  static serialize_ciphertext(ciphertext: ShortintCiphertext): Uint8Array;
/**
* @param {Uint8Array} buffer
* @returns {ShortintCiphertext}
*/
  static deserialize_ciphertext(buffer: Uint8Array): ShortintCiphertext;
/**
* @param {ShortintCompressedCiphertext} ciphertext
* @returns {Uint8Array}
*/
  static serialize_compressed_ciphertext(ciphertext: ShortintCompressedCiphertext): Uint8Array;
/**
* @param {Uint8Array} buffer
* @returns {ShortintCompressedCiphertext}
*/
  static deserialize_compressed_ciphertext(buffer: Uint8Array): ShortintCompressedCiphertext;
/**
* @param {ShortintClientKey} client_key
* @returns {Uint8Array}
*/
  static serialize_client_key(client_key: ShortintClientKey): Uint8Array;
/**
* @param {Uint8Array} buffer
* @returns {ShortintClientKey}
*/
  static deserialize_client_key(buffer: Uint8Array): ShortintClientKey;
/**
* @param {ShortintPublicKey} public_key
* @returns {Uint8Array}
*/
  static serialize_public_key(public_key: ShortintPublicKey): Uint8Array;
/**
* @param {Uint8Array} buffer
* @returns {ShortintPublicKey}
*/
  static deserialize_public_key(buffer: Uint8Array): ShortintPublicKey;
/**
* @param {ShortintCompressedPublicKey} public_key
* @returns {Uint8Array}
*/
  static serialize_compressed_public_key(public_key: ShortintCompressedPublicKey): Uint8Array;
/**
* @param {Uint8Array} buffer
* @returns {ShortintCompressedPublicKey}
*/
  static deserialize_compressed_public_key(buffer: Uint8Array): ShortintCompressedPublicKey;
/**
* @param {ShortintCompressedServerKey} server_key
* @returns {Uint8Array}
*/
  static serialize_compressed_server_key(server_key: ShortintCompressedServerKey): Uint8Array;
/**
* @param {Uint8Array} buffer
* @returns {ShortintCompressedServerKey}
*/
  static deserialize_compressed_server_key(buffer: Uint8Array): ShortintCompressedServerKey;
}
/**
*/
export class ShortintCiphertext {
  free(): void;
}
/**
*/
export class ShortintClientKey {
  free(): void;
}
/**
*/
export class ShortintCompressedCiphertext {
  free(): void;
}
/**
*/
export class ShortintCompressedPublicKey {
  free(): void;
}
/**
*/
export class ShortintCompressedServerKey {
  free(): void;
}
/**
*/
export class ShortintNoiseDistribution {
  free(): void;
}
/**
*/
export class ShortintParameters {
  free(): void;
/**
* @returns {number}
*/
  lwe_dimension(): number;
/**
* @param {number} new_value
*/
  set_lwe_dimension(new_value: number): void;
/**
* @returns {number}
*/
  glwe_dimension(): number;
/**
* @param {number} new_value
*/
  set_glwe_dimension(new_value: number): void;
/**
* @returns {number}
*/
  polynomial_size(): number;
/**
* @param {number} new_value
*/
  set_polynomial_size(new_value: number): void;
/**
* @returns {ShortintNoiseDistribution}
*/
  lwe_noise_distribution(): ShortintNoiseDistribution;
/**
* @param {ShortintNoiseDistribution} new_value
*/
  set_lwe_noise_distribution(new_value: ShortintNoiseDistribution): void;
/**
* @returns {ShortintNoiseDistribution}
*/
  glwe_noise_distribution(): ShortintNoiseDistribution;
/**
* @param {ShortintNoiseDistribution} new_value
*/
  set_glwe_noise_distribution(new_value: ShortintNoiseDistribution): void;
/**
* @returns {number}
*/
  pbs_base_log(): number;
/**
* @param {number} new_value
*/
  set_pbs_base_log(new_value: number): void;
/**
* @returns {number}
*/
  pbs_level(): number;
/**
* @param {number} new_value
*/
  set_pbs_level(new_value: number): void;
/**
* @returns {number}
*/
  ks_base_log(): number;
/**
* @param {number} new_value
*/
  set_ks_base_log(new_value: number): void;
/**
* @returns {number}
*/
  ks_level(): number;
/**
* @param {number} new_value
*/
  set_ks_level(new_value: number): void;
/**
* @returns {number}
*/
  message_modulus(): number;
/**
* @param {number} new_value
*/
  set_message_modulus(new_value: number): void;
/**
* @returns {number}
*/
  carry_modulus(): number;
/**
* @param {number} new_value
*/
  set_carry_modulus(new_value: number): void;
/**
* @returns {number}
*/
  encryption_key_choice(): number;
/**
* @param {number} new_value
*/
  set_encryption_key_choice(new_value: number): void;
/**
* @param {number} name
*/
  constructor(name: number);
}
/**
*/
export class ShortintPublicKey {
  free(): void;
}
/**
*/
export class TfheClientKey {
  free(): void;
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
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
/**
* @param {Uint8Array} buffer
* @returns {TfheClientKey}
*/
  static deserialize(buffer: Uint8Array): TfheClientKey;
}
/**
*/
export class TfheCompactPublicKey {
  free(): void;
/**
* @param {TfheClientKey} client_key
* @returns {TfheCompactPublicKey}
*/
  static new(client_key: TfheClientKey): TfheCompactPublicKey;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
/**
* @param {Uint8Array} buffer
* @returns {TfheCompactPublicKey}
*/
  static deserialize(buffer: Uint8Array): TfheCompactPublicKey;
}
/**
*/
export class TfheCompressedCompactPublicKey {
  free(): void;
/**
* @param {TfheClientKey} client_key
* @returns {TfheCompressedCompactPublicKey}
*/
  static new(client_key: TfheClientKey): TfheCompressedCompactPublicKey;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
/**
* @param {Uint8Array} buffer
* @returns {TfheCompressedCompactPublicKey}
*/
  static deserialize(buffer: Uint8Array): TfheCompressedCompactPublicKey;
/**
* @returns {TfheCompactPublicKey}
*/
  decompress(): TfheCompactPublicKey;
}
/**
*/
export class TfheCompressedPublicKey {
  free(): void;
/**
* @param {TfheClientKey} client_key
* @returns {TfheCompressedPublicKey}
*/
  static new(client_key: TfheClientKey): TfheCompressedPublicKey;
/**
* @returns {TfhePublicKey}
*/
  decompress(): TfhePublicKey;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
/**
* @param {Uint8Array} buffer
* @returns {TfheCompressedPublicKey}
*/
  static deserialize(buffer: Uint8Array): TfheCompressedPublicKey;
}
/**
*/
export class TfheCompressedServerKey {
  free(): void;
/**
* @param {TfheClientKey} client_key
* @returns {TfheCompressedServerKey}
*/
  static new(client_key: TfheClientKey): TfheCompressedServerKey;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
/**
* @param {Uint8Array} buffer
* @returns {TfheCompressedServerKey}
*/
  static deserialize(buffer: Uint8Array): TfheCompressedServerKey;
}
/**
*/
export class TfheConfig {
  free(): void;
}
/**
*/
export class TfheConfigBuilder {
  free(): void;
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
/**
* @param {ShortintParameters} block_parameters
* @returns {TfheConfigBuilder}
*/
  use_custom_parameters(block_parameters: ShortintParameters): TfheConfigBuilder;
/**
* @returns {TfheConfig}
*/
  build(): TfheConfig;
}
/**
*/
export class TfhePublicKey {
  free(): void;
/**
* @param {TfheClientKey} client_key
* @returns {TfhePublicKey}
*/
  static new(client_key: TfheClientKey): TfhePublicKey;
/**
* @returns {Uint8Array}
*/
  serialize(): Uint8Array;
/**
* @param {Uint8Array} buffer
* @returns {TfhePublicKey}
*/
  static deserialize(buffer: Uint8Array): TfhePublicKey;
}
/**
*/
export class tfhe {
  free(): void;
}
