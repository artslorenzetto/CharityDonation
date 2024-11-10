const { ethers } = require("hardhat");

async function main() {
    // Connect to the Besu network (or local Hardhat network)
    const [deployer, donor] = await ethers.getSigners(); 

    // Address of the deployed contract
    const CharityDonation = await ethers.getContractFactory("CharityDonation");
    const charityDonation = await CharityDonation.deploy();
    await charityDonation.waitForDeployment();

    console.log("Charity address:", await charityDonation.getAddress()); 
    console.log("Using deployer address:", deployer.address);
    console.log("Using donor address:", donor.address);

    console.log("============= CAUSES CREATIONS ===================");
    // Creating two charity causes with descriptions
    console.log("Creating first cause: Help the Homeless...");
    const tx1 = await charityDonation.createCause(
        "Help the Homeless", 
        "A cause dedicated to providing shelter and food for the homeless population.",
        deployer.address
    );
    await tx1.wait(); // Wait for the transaction to be mined

    console.log("Creating second cause: Save the Oceans...");
    const tx2 = await charityDonation.createCause(
        "Save the Oceans", 
        "A cause focused on cleaning oceans and protecting marine life from pollution.",
        deployer.address
    );
    await tx2.wait(); // Wait for the transaction to be mined
    
    // Checking the details of both causes after creation
    let cause1 = await charityDonation.causes(1);
    let cause2 = await charityDonation.causes(2);
    console.log(`Cause 1 details: ID = ${cause1.id}, Name = ${cause1.name}, Description = ${cause1.description}, Manager = ${cause1.manager}`);
    console.log(`Cause 2 details: ID = ${cause2.id}, Name = ${cause2.name}, Description = ${cause2.description}, Manager = ${cause2.manager}`);

    console.log("============== DONATIONS ==================");
    // Donating to both causes
    const donationAmount1 = 20; // Fictional USD for the first cause
    const donationAmount2 = 15; // Fictional USD for the second cause

    console.log(`Donating ${donationAmount1} USD to Cause 1...`);
    const donateTx1 = await charityDonation.connect(donor).donate(1, donationAmount1);
    await donateTx1.wait(); // Wait for the donation to be processed

    console.log(`Donating ${donationAmount2} USD to Cause 2...`);
    const donateTx2 = await charityDonation.connect(donor).donate(2, donationAmount2);
    await donateTx2.wait(); // Wait for the donation to be processed

    // Checking the total donations after donations
    let totalDonationsCause1 = await charityDonation.getCauseDonations(1);
    let totalDonationsCause2 = await charityDonation.getCauseDonations(2);

    console.log(`Total donations to Cause 1 after donation: ${totalDonationsCause1} USD`);
    console.log(`Total donations to Cause 2 after donation: ${totalDonationsCause2} USD`);

    // Checking donations from the donor for each cause
    let donorDonationsCause1 = await charityDonation.getDonorDonations(donor.address, 1);
    let donorDonationsCause2 = await charityDonation.getDonorDonations(donor.address, 2);

    console.log(`Donor donations to Cause 1: ${donorDonationsCause1} USD`);
    console.log(`Donor donations to Cause 2: ${donorDonationsCause2} USD`);
    
    console.log("============== MORE DONATIONS ==================");
    const donationAmount3 = 10; // Fictional USD for the second cause
    
    console.log(`Donating more ${donationAmount3} USD to Cause 1...`);
    const donateTx3 = await charityDonation.connect(donor).donate(1, donationAmount3);
    await donateTx3.wait();
    
    console.log(`Total donations to Cause 1 after one more donation: ${await charityDonation.getCauseDonations(1)} USD`);
    console.log(`Donor donations to Cause 1: ${await charityDonation.getDonorDonations(donor.address, 1)} USD, Donor donations to Cause 2: ${await charityDonation.getDonorDonations(donor.address, 2)} USD`);

    console.log("============== WITHDRAW ==================");
    // Manager withdraws funds for both causes
    console.log("Manager withdrawing funds for Cause 1...");
    await charityDonation.connect(deployer).withdrawFunds(1);

    console.log("Manager withdrawing funds for Cause 2...");
    await charityDonation.connect(deployer).withdrawFunds(2);

    // Checking total donations after withdrawal
    totalDonationsCause1 = await charityDonation.getCauseDonations(1);
    totalDonationsCause2 = await charityDonation.getCauseDonations(2);

    console.log(`Total donations to Cause 1 after withdrawal: ${totalDonationsCause1} USD`);
    console.log(`Total donations to Cause 2 after withdrawal: ${totalDonationsCause2} USD`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
