# Module 7 - Upgradeable Contract Report

## Project Overview

**Contract Name:** Points in Play (PiP)  
**Token Symbol:** PiP  
**Standard:** ERC-20 Upgradeable (UUPS Pattern)  
**Network:** Core Testnet  
**Deployer Account:** `0x8047e80AF5C5B757D606205364BBbf8c679D4394`

---

## 1. Initial Deployment (V1)

### Deployed Contracts

| Contract | Address | Transaction |
|----------|---------|-------------|
| **Proxy** | `0x22d652C478a161Eff67499Af203e763e1f7E46d9` | [View Tx](https://scan.test2.btcs.network/tx/0xa2c6344d4430f5d2558890637f51a50c67abca72364a84b38dd974505101feef) |
| **Implementation V1** | `0x26c12EaE632BB2542d70d13F394e7A4CFD3fEC8d` | [View Tx](https://scan.test2.btcs.network/tx/0xe0a8e39f164018763b5374cf9e6397d360fa05d8162bf5b0214663dbbb8eab2e) |

### V1 Verification Log
```
Token Name: Points in Play
Symbol: PiP
Decimals: 18
Total Supply: 999,999 PiP
Version: V1 (version() function not available)
Airdrop: N/A (not available in V1)
```

---

## 2. Upgrade to V2

### Upgrade Transactions

| Transaction | Description | Link |
|-------------|-------------|------|
| Deploy Implementation V2 | Deploy new PiPV2 contract code | [View Tx](https://scan.test2.btcs.network/tx/0x68dcaa55295f3e5605d4bd8e39d65d221bef5cba0c7cf743929ad2b5bbab03bd) |
| upgradeToAndCall | Switch Proxy to V2 implementation | [View Tx](https://scan.test2.btcs.network/tx/0x8c0b8dfa5c9e85bfb4d5f25340b158add109c9e30be1912a17c9cf12a840be83) |

### Contracts After Upgrade

| Contract | Address | Notes |
|----------|---------|-------|
| **Proxy** (unchanged) | `0x22d652C478a161Eff67499Af203e763e1f7E46d9` | Same address |
| **Implementation V2** | `0xcd84e1bDFa6fC6d39b7E144dFe1500FC05f33a32` | New implementation |

### V2 Verification & Airdrop Test

```
Token Name: Points in Play
Symbol: PiP
Decimals: 18
Total Supply: 999,999 PiP → 1,000,000 PiP (after airdrop)
Version: V2
Airdrop: ✅ Working
```

| Test | Result | Transaction |
|------|--------|-------------|
| Balance before airdrop | 999,999 PiP | - |
| Airdrop function call | +1 PiP | [View Tx](https://scan.test2.btcs.network/tx/0xfd52c079eccd8b622e79e2ebda00f5ce424cbb94d6ebf14d5879da42783d222f) |
| Balance after airdrop | 1,000,000 PiP ✅ | - |
