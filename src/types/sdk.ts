export interface AbstractProvider {
  getChainId(): Promise<string>;
  getNetwork(): Promise<{ chainId: string }>;
  call(tx: { to: string; data: string }): Promise<string>;
}

export interface AbstractSigner {
  getAddress(): Promise<string>;
  signTypedData(
    domain: object,
    types: Record<string, Array<object>>,
    value: object,
  ): Promise<string>;
}

export type PermitV2AccessRequirements = {
  contracts: string[];
  projects: string[];
};

type PermitV2AccessRequirementsParams =
  | {
      contracts?: never[];
      projects: string[];
    }
  | {
      contracts: string[];
      projects?: never[];
    };

export type InitializationParams = {
  provider: AbstractProvider;
  signer?: AbstractSigner;
  securityZones?: number[];
  coFheUrl?: string;
} & PermitV2AccessRequirementsParams;
