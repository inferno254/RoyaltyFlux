export const ipfsMock = {
  pinFile: jest.fn().mockResolvedValue('QmMockHash123'),
  pinJSON: jest.fn().mockResolvedValue('QmMockMetaHash'),
  gatewayUrl: jest.fn().mockReturnValue('https://ipfs.io/ipfs/QmMockHash123'),
};
