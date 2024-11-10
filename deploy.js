async function main() {
    // Step 1: Deploy the Charity contract
    const Charity = await ethers.getContractFactory("CharityDonation");
    const charity = await Charity.deploy();
    await charity.waitForDeployment();
    console.log("Charity address:", await charity.getAddress());

    const CharityDonation = await ethers.deployContract("CharityDonation");
    await CharityDonation.waitForDeployment();
    console.log("Contrato implantado em: ", CharityDonation.target);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });