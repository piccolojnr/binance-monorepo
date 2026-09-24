export type PlatformId = "binance" | "coinbase" | "crypto_com";

export interface PlatformConfig {
  id: PlatformId;
  name: string;
  /** public asset path, or null to render a text wordmark */
  logo: string | null;
  /** where users are sent when the flow is done or a code is invalid */
  redirectUrl: string;
  /** oklch color used for the --primary CSS variable */
  primary: string;
  /** plain hex for inline styles */
  hex: string;
}

export const platforms: Record<PlatformId, PlatformConfig> = {
  binance: {
    id: "binance",
    name: "Binance",
    logo: "/binance-logo.png",
    redirectUrl: "https://www.binance.com",
    primary: "oklch(79.5% 0.184 86.047)",
    hex: "#F0B90B",
  },
  coinbase: {
    id: "coinbase",
    name: "Coinbase",
    logo: "/coinbase-logo.svg",
    redirectUrl: "https://www.coinbase.com",
    primary: "oklch(55.2% 0.2328 262.9)",
    hex: "#0052FF",
  },
  crypto_com: {
    id: "crypto_com",
    name: "Crypto.com",
    logo: "/crypto-com-logo.svg",
    redirectUrl: "https://crypto.com",
    primary: "oklch(55% 0.17 255)",
    hex: "#3B6CE0",
  },
};

export function getPlatform(): PlatformConfig {
  const id = process.env.NEXT_PUBLIC_PLATFORM as PlatformId | undefined;
  return (id && platforms[id]) || platforms.binance;
}
