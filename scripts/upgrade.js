const { ethers, upgrades } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Upgrading contract with account:", deployer.address);

    const PROXY_ADDRESS = process.env.PROXY_ADDRESS || "0x0000000000000000000000000000000000000000";
    
    if (PROXY_ADDRESS === "0x0000000000000000000000000000000000000000") {
        console.error("\nError: PROXY_ADDRESS not set!");
        console.log("Please set PROXY_ADDRESS in .env file");
        process.exit(1);
    }

    // Address validation
    let proxyAddress;
    try {
        proxyAddress = ethers.getAddress(PROXY_ADDRESS);
    } catch (error) {
        console.error("\nError: Invalid PROXY_ADDRESS format!");
        console.log("PROXY_ADDRESS must be a valid Ethereum address");
        process.exit(1);
    }

    console.log("Proxy address:", proxyAddress);
    
    // Get Implementation address BEFORE upgrade
    const oldImplementationAddress = await upgrades.erc1967.getImplementationAddress(proxyAddress);
    console.log("Current Implementation address (V1):", oldImplementationAddress);
    
    console.log("\nDeploying PiP V2 implementation...");
    console.log("Note: To force a new implementation address, change _DEPLOYMENT_ID in PiPV2.sol");
    
    const PiPV2 = await ethers.getContractFactory("PiPV2");
    
    const pipV2 = await upgrades.upgradeProxy(proxyAddress, PiPV2, {
        kind: "uups"
    });

    await pipV2.waitForDeployment();
    
    // Wait for blockchain to sync (testnet can be slow)
    console.log("\nWaiting for blockchain confirmation...");
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Retry reading implementation address up to 3 times
    let newImplementationAddress;
    for (let i = 0; i < 3; i++) {
        newImplementationAddress = await upgrades.erc1967.getImplementationAddress(proxyAddress);
        if (oldImplementationAddress.toLowerCase() !== newImplementationAddress.toLowerCase()) {
            break;
        }
        console.log(`Retry ${i + 1}/3: waiting for implementation update...`);
        await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    console.log("\nUpgrade successful");
    console.log("Proxy address (unchanged):", proxyAddress);
    console.log("New Implementation address (V2):", newImplementationAddress);
    
    if (oldImplementationAddress.toLowerCase() === newImplementationAddress.toLowerCase()) {
        console.log("\nWarning: Implementation address appears unchanged.");
        console.log("This may be a node sync delay. Run 'npm run interact:core' to verify.");
    } else {
        console.log("\nImplementation address changed successfully!");
    }    
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
