const { ethers, upgrades } = require("hardhat");

async function main() {
    const [deployer, addr1] = await ethers.getSigners();
    
    const PROXY_ADDRESS = process.env.PROXY_ADDRESS || "0x0000000000000000000000000000000000000000";
    
    if (PROXY_ADDRESS === "0x0000000000000000000000000000000000000000") {
        console.error("\nError: PROXY_ADDRESS not set!");
        console.log("Please set PROXY_ADDRESS in .env file");
        process.exit(1);
    }

    // Address validation and normalization
    let proxyAddress;
    try {
        proxyAddress = ethers.getAddress(PROXY_ADDRESS);
    } catch (error) {
        console.error("\nError: Invalid PROXY_ADDRESS format!");
        console.log("PROXY_ADDRESS must be a valid Ethereum address");
        process.exit(1);
    }

    // Use PiPV2 to get the contract instance, as it inherits all PiPV1 functions + adds new ones
    // This allows access to version() and airdrop() methods in the JavaScript object
    // If contract is still V1, calls to these functions will fail (handled in try-catch below)
    const pip = await ethers.getContractAt("PiPV2", proxyAddress);

    // Proxy Information
    console.log("Proxy Information:");
    console.log("Proxy address:", proxyAddress);
    console.log("Using account:", deployer.address);
    try {
        const implAddress = await upgrades.erc1967.getImplementationAddress(proxyAddress);
        console.log("Implementation address:", implAddress);
    } catch (error) {
        console.log("Error getting implementation address:", error.message);
    }


    // Token Information
    console.log("\nToken Information:");
    const name = await pip.name();
    const symbol = await pip.symbol();
    const decimals = await pip.decimals();
    const totalSupply = await pip.totalSupply();
    const deployerBalance = await pip.balanceOf(deployer.address);
    
    console.log("Name:", name);
    console.log("Symbol:", symbol);
    console.log("Decimals:", decimals.toString());
    console.log("Total Supply:", ethers.formatEther(totalSupply), symbol);
    console.log("Deployer Balance:", ethers.formatEther(deployerBalance), symbol);

    // Owner Information
    console.log("\nOwner Information:");
    try {
        const owner = await pip.owner();
        console.log("Contract owner:", owner);
        console.log("Is deployer owner:", owner.toLowerCase() === deployer.address.toLowerCase());
    } catch (error) {
        console.log("Owner info: N/A");
    }

    // Version Information
    console.log("\nVersion Information:");
    try {
        const version = await pip.version();
        console.log("Version:", version);
    } catch (error) {
        // If contract is V1, version() function doesn't exist → error
        // This is normal, error is handled here
        console.log("Version: V1 (version() function not available)");
    }

    // Airdrop (V2 only)
    console.log("\nAirdrop (V2):");
    try {
        // Check balance BEFORE airdrop
        const balanceBeforeAirdrop = await pip.balanceOf(deployer.address);
        console.log("Balance before airdrop:", ethers.formatEther(balanceBeforeAirdrop), symbol);
        
        const airdropTx = await pip.airdrop(deployer.address);
        await airdropTx.wait();
        console.log("Airdrop successful: 1 token sent to", deployer.address);
        
        // Check balance AFTER airdrop
        const balanceAfterAirdrop = await pip.balanceOf(deployer.address);
        console.log("Balance after airdrop:", ethers.formatEther(balanceAfterAirdrop), symbol);
        
        // Calculate difference
        const difference = balanceAfterAirdrop - balanceBeforeAirdrop;
        console.log("Tokens received:", ethers.formatEther(difference), symbol);
    } catch (error) {
        // If contract is V1, airdrop() function doesn't exist → error
        // This is normal, error is handled here
        console.log("Airdrop: N/A (airdrop() function not available - probably V1)");
    }

    // Interaction Examples
    if (addr1) {
        console.log("\nInteraction Examples:");
        
        // Mint
        const mintAmount = ethers.parseEther("100");
        console.log(`\nMinting ${ethers.formatEther(mintAmount)} ${symbol} to ${addr1.address}...`);
        
        try {
            const mintTx = await pip.mint(addr1.address, mintAmount);
            await mintTx.wait();
            console.log("Mint successful");
            
            const addr1Balance = await pip.balanceOf(addr1.address);
            console.log(`Addr1 balance: ${ethers.formatEther(addr1Balance)} ${symbol}`);
        } catch (error) {
            console.log("Mint failed:", error.message);
        }

        // Transfer
        const transferAmount = ethers.parseEther("50");
        console.log(`\nTransferring ${ethers.formatEther(transferAmount)} ${symbol} from deployer to ${addr1.address}...`);
        
        try {
            const transferTx = await pip.transfer(addr1.address, transferAmount);
            await transferTx.wait();
            console.log("Transfer successful");
            
            const deployerBalanceAfter = await pip.balanceOf(deployer.address);
            const addr1BalanceAfter = await pip.balanceOf(addr1.address);
            
            console.log(`Deployer balance: ${ethers.formatEther(deployerBalanceAfter)} ${symbol}`);
            console.log(`Addr1 balance: ${ethers.formatEther(addr1BalanceAfter)} ${symbol}`);
        } catch (error) {
            console.log("Transfer failed:", error.message);
        }
    }

    console.log("\nInteraction complete");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

