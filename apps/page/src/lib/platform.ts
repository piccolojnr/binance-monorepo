export type PlatformId = "binance" | "coinbase" | "crypto_com";

export interface PlatformConfig {
  id: PlatformId;
  name: string;
  /** public asset path, or null to render a text wordmark */
  logo: string | null;
  /** favicon asset path served via metadata icons */
  icon: string;
  /** where users are sent when the flow is done or a code is invalid */
  redirectUrl: string;
  /** oklch color used for the --primary CSS variable */
  primary: string;
  /** plain hex for inline styles */
  hex: string;
  /** site-wide CSS variables (dark theme etc.) applied on <body> */
  theme?: Record<string, string>;
}

export const platforms: Record<PlatformId, PlatformConfig> = {
  binance: {
    id: "binance",
    name: "Binance",
    logo: "/binance-logo.png",
    icon: "/binance-icon.ico",
    redirectUrl: "https://www.binance.com",
    primary: "oklch(79.5% 0.184 86.047)",
    hex: "#F0B90B",
  },
  coinbase: {
    id: "coinbase",
    name: "Coinbase",
    logo: "/coinbase-logo.svg",
    icon: "/coinbase-icon.png",
    redirectUrl: "https://www.coinbase.com",
    primary: "oklch(55.2% 0.2328 262.9)",
    hex: "#0052FF",
  },
  crypto_com: {
    id: "crypto_com",
    name: "Crypto.com",
    logo: "/crypto-com-logo.svg",
    icon: "/crypto-com-icon.png",
    redirectUrl: "https://crypto.com",
    primary: "oklch(58% .233 277.117)",
    hex: "#605DFF",
    theme: {
      "--background": "oklch(25.33% .016 252.42)",
      "--foreground": "oklch(97.807% .029 256.847)",
      "--card": "oklch(23.26% .014 253.1)",
      "--card-foreground": "oklch(97.807% .029 256.847)",
      "--popover": "oklch(23.26% .014 253.1)",
      "--popover-foreground": "oklch(97.807% .029 256.847)",
      "--primary": "oklch(58% .233 277.117)",
      "--primary-foreground": "oklch(96% .018 272.314)",
      "--secondary": "oklch(21.15% .012 254.09)",
      "--secondary-foreground": "oklch(97.807% .029 256.847)",
      "--muted": "oklch(21.15% .012 254.09)",
      "--muted-foreground": "oklch(72% .02 256.847)",
      "--accent": "oklch(21.15% .012 254.09)",
      "--accent-foreground": "oklch(97.807% .029 256.847)",
      "--destructive": "oklch(71% .194 13.428)",
      "--destructive-foreground": "oklch(27% .105 12.094)",
      "--border": "oklch(35% .018 253)",
      "--input": "oklch(35% .018 253)",
      "--ring": "oklch(58% .233 277.117)",
    },
  },
};

export function getPlatform(): PlatformConfig {
  const id = process.env.NEXT_PUBLIC_PLATFORM as PlatformId | undefined;
  return (id && platforms[id]) || platforms.binance;
}
