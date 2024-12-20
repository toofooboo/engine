import { createThirdwebClient } from "thirdweb";
import { privateKeyToAccount } from "thirdweb/wallets";

export const ANVIL_PKEY_A =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
export const ANVIL_PKEY_B =
  "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";
export const ANVIL_PKEY_C =
  "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a";
export const ANVIL_PKEY_D =
  "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6";

export const client = createThirdwebClient({
  secretKey: process.env.THIRDWEB_API_SECRET_KEY as string,
});

export const TEST_ACCOUNT_A = privateKeyToAccount({
  client,
  privateKey: ANVIL_PKEY_A,
});

export const TEST_ACCOUNT_B = privateKeyToAccount({
  client,
  privateKey: ANVIL_PKEY_B,
});
