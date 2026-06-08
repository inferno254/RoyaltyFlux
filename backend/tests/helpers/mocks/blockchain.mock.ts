import { ethers } from 'ethers';

export const blockchainMock = {
  mintSong: jest.fn().mockResolvedValue({
    wait: () =>
      Promise.resolve({
        hash: '0xmockhash',
        logs: [
          {
            topics: [ethers.id('SongMinted(uint256,address,address,bytes32,uint256)')],
            data: '0x',
          },
        ],
      }),
  }),
  recordStreams: jest.fn().mockResolvedValue({
    wait: () => Promise.resolve({ hash: '0xmockhash2' }),
  }),
};
