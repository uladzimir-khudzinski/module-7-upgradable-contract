const { ethers, upgrades } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contract with account:", deployer.address);

    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("Account balance:", ethers.formatEther(balance), "CORE");

    console.log("\nDeploying PiP V1 as upgradeable contract (UUPS)...");
    console.log("Note: To force a new implementation address, change _DEPLOYMENT_ID in PiPV1.sol");
    
    const PiPV1 = await ethers.getContractFactory("PiPV1");
    
    const pip = await upgrades.deployProxy(
        PiPV1,
        [ethers.parseEther("999999")],
        { 
            initializer: "initialize",
            kind: "uups"
        }
    );

    await pip.waitForDeployment();
    const proxyAddress = await pip.getAddress();
    
    console.log("\nDeployment successful");
    console.log("Proxy address:", proxyAddress);
    
    const implementationAddress = await upgrades.erc1967.getImplementationAddress(proxyAddress);
    console.log("Implementation address (V1):", implementationAddress);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
