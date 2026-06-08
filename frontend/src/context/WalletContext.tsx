import { createContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { BrowserProvider, JsonRpcSigner } from 'ethers';
import { CHAIN_ID } from '../lib/web3';
import toast from 'react-hot-toast';

export interface WalletContextValue {
  address: string | null;
  chainId: number | null;
  signer: JsonRpcSigner | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchToAvalanche: () => Promise<void>;
  isConnecting: boolean;
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on?: (event: string, handler: (...args: unknown[]) => void) => void;
      removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
    };
  }
}

export const WalletContext = createContext<WalletContextValue | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      toast.error('Install MetaMask or Core Wallet');
      return;
    }
    setIsConnecting(true);
    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = (await window.ethereum.request({ method: 'eth_requestAccounts' })) as string[];
      const s = await provider.getSigner();
      const network = await provider.getNetwork();
      setAddress(accounts[0]);
      setSigner(s);
      setChainId(Number(network.chainId));
    } catch (err) {
      toast.error('Wallet connection failed');
      console.error(err);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setSigner(null);
  }, []);

  const switchToAvalanche = useCallback(async () => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${CHAIN_ID.toString(16)}` }],
      });
    } catch (err: unknown) {
      // Chain not added
      if (err && typeof err === 'object' && 'code' in err && (err as { code: number }).code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: `0x${CHAIN_ID.toString(16)}`,
              chainName: CHAIN_ID === 43113 ? 'Avalanche Fuji' : 'Avalanche C-Chain',
              nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 },
              rpcUrls: [import.meta.env.VITE_AVALANCHE_RPC],
              blockExplorerUrls: ['https://snowtrace.io/'],
            },
          ],
        });
      }
    }
  }, []);

  useEffect(() => {
    if (!window.ethereum) return;
    const handleAccountsChanged = (accs: unknown) => {
      const a = (accs as string[])[0];
      setAddress(a ?? null);
    };
    const handleChainChanged = (cid: unknown) => setChainId(Number(cid));
    window.ethereum.on?.('accountsChanged', handleAccountsChanged);
    window.ethereum.on?.('chainChanged', handleChainChanged);
    return () => {
      window.ethereum?.removeListener?.('accountsChanged', handleAccountsChanged);
      window.ethereum?.removeListener?.('chainChanged', handleChainChanged);
    };
  }, []);

  return (
    <WalletContext.Provider
      value={{ address, chainId, signer, connect, disconnect, switchToAvalanche, isConnecting }}
    >
      {children}
    </WalletContext.Provider>
  );
}
