// scripts/interact.js
const { ethers } = require("hardhat");

async function deployContract() {
  const [donor, entity] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", donor.address, entity.address);

  const CharityDonation = await ethers.getContractFactory("CharityDonation");
  const charity = await CharityDonation.deploy();
  await charity.waitForDeployment();
  console.log("Contract deployed to address:", await charity.getAddress());

  return charity.getAddress();
}

async function makeDonation(contractAddress, causeId, amount) {
  const [donor] = await ethers.getSigners(); // Get the signer (donor's account)
  const charityContract = await ethers.getContractAt("CharityDonation", contractAddress);

  console.log(`Donor address: ${donor.address}`);
  console.log(`Making a donation of ${amount} ETH to cause ${causeId}`);

  // Execute the donation transaction
  const tx = await charityContract.donate(causeId, { value: ethers.utils.parseEther(amount) });
  await tx.wait(); // Wait for the transaction to be mined

  console.log(`Donation of ${amount} ETH made to cause ${causeId}`);
}

async function listCauses(contractAddress) {
  const charityContract = await ethers.getContractAt("CharityDonation", contractAddress);

  console.log("Listing all causes:");
  const causes = await charityContract.listCauses();

  causes.forEach((cause, index) => {
    console.log(`Cause ${index}: ${cause.name} - Total Donations: ${cause.totalDonations} ETH`);
  });
}

async function getCauseDonations(contractAddress, causeId) {
  const charityContract = await ethers.getContractAt("CharityDonation", contractAddress);

  const totalDonations = await charityContract.getCauseTotalDonations(causeId);
  console.log(`Total donations for cause ${causeId}: ${totalDonations} ETH`);
}

async function addCause(contractAddress, causeName, recipientAddress) {
  const [admin] = await ethers.getSigners();  // Get the signer (admin's account)
  const charityContract = await ethers.getContractAt("CharityDonation", contractAddress);

  console.log(`Adding new cause: ${causeName} with recipient ${recipientAddress}`);

  // Add a new cause
  const tx = await charityContract.addCause(causeName, recipientAddress);
  await tx.wait(); // Wait for the transaction to be mined

  console.log(`Cause "${causeName}" added successfully.`);
}

async function main() {
  const contractAddress = "0x4bebB371A695aeE0A041833526B405BDFf518Bbb";  // Replace with your deployed contract address

  // You can use this script to perform the following actions:

  // 1. Deploy contract (only if not deployed yet)
  // const contractAddress = await deployContract();

  // 2. Add a cause
  // await addCause(contractAddress, "Education Fund", "0x0A28430d61ff0097CC09e3B572FbeFA51589a2B5");
  // await addCause(contractAddress, "Kids Fund", "0x0A28430d61ff0097CC09e3B572FbeFA51589a2B5");
  // await addCause(contractAddress, "Education Fund", "0x0A28430d61ff0097CC09e3B572FbeFA51589a2B5");

  // 3. List all causes
  // await listCauses(contractAddress);

  // // 4. Make a donation (e.g., donate 1 ETH to cause 0)
  // await makeDonation(contractAddress, 0, "1");

  // 5. Get total donations for a cause
  await getCauseDonations(contractAddress, 0);
}

// Execute the script
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// Esse script faz o seguinte:

// 1. Implanta o contrato na rede.
// 2. Realiza uma doação de 0.1 ETH.
// 3. Verifica o saldo do contrato.
// 4. Permite que o dono do contrato retire os fundos.
// async function main() {
//   const [deployer, donor] = await ethers.getSigners(); // Use two different accounts: one for deployment, one for donation
//   console.log("Deployer address:", deployer.address);
//   console.log("Donor address:", donor.address);

//   const CharityDonation = await ethers.getContractFactory("CharityDonation");
//   const charityDonation = await CharityDonation.deploy();
//   console.log("CharityDonation contract deployed to:", charityDonation.address);

//   // Create a cause (only the deployer can do this)
//   await charityDonation.createCause("Helping Kids", deployer.address);
//   console.log("Cause created: Helping Kids");

//   // Donor makes a donation
//   const donationAmount = ethers.utils.parseEther("0.1"); // 0.1 Ether
//   const causeId = 0; // Assume this is the first cause
//   await charityDonation.connect(donor).donate(causeId, { value: donationAmount });
//   console.log(`Donor donated ${ethers.utils.formatEther(donationAmount)} ETH to Cause ID ${causeId}`);

//   // Get total donations for the cause
//   const totalDonations = await charityDonation.getTotalDonations(causeId);
//   console.log(`Total donations for Cause ID ${causeId}: ${ethers.utils.formatEther(totalDonations)} ETH`);

//   // Get the donor's donation amount
//   const userDonation = await charityDonation.getUserDonation(causeId);
//   console.log(`Donor's donation to Cause ID ${causeId}: ${ethers.utils.formatEther(userDonation)} ETH`);
// }

// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });


// async function main() {
//     // Obtenha os signers (contas)
//     const [donor, owner] = await ethers.getSigners();
  
//     // scripts/interact_donation.js

//     // Obtenha o contrato
//     const Donation = await ethers.getContractFactory("Donation");
    
//     // Conecte-se ao contrato já implantado na rede Besu
//     const donationAddress = "0x0A28430d61ff0097CC09e3B572FbeFA51589a2B5"; // Substitua pelo endereço do contrato implantado
//     const donation = new ethers.Contract(donationAddress, Donation.interface, donor); // Conecte o contrato ao donor

//     console.log("Interagindo com o contrato no endereço:", donation.address);

//     // Faça uma doação
//     const donationAmount = ethers.utils.parseEther("0.1"); // Doação de 0.1 ETH
//     console.log(`Fazendo uma doação de ${ethers.utils.formatEther(donationAmount)} ETH...`);
    
//     const tx = await donation.connect(donor).donate({ value: donationAmount });
    
//     // Aguardar a transação ser confirmada
//     await tx.wait();  // Espera a transação ser minerada (confirmação)

//     console.log("Doação realizada com sucesso!");

//     // Verifique o saldo do contrato
//     const balance = await donation.getBalance();
//     console.log("Saldo do contrato:", ethers.utils.formatEther(balance), "ETH");

//     // O dono pode retirar os fundos
//     const ownerBalanceBefore = await owner.getBalance();
//     console.log("Saldo do dono antes do saque:", ethers.utils.formatEther(ownerBalanceBefore));

//     const txWithdraw = await donation.connect(owner).withdraw();
//     await txWithdraw.wait();  // Espera a transação de saque ser confirmada

//     const ownerBalanceAfter = await owner.getBalance();
//     console.log("Saldo do dono depois do saque:", ethers.utils.formatEther(ownerBalanceAfter));
//    console.log("Saldo do dono depois do saque:", ethers.utils.formatEther(ownerBalanceAfter));
//   }
  
//   main()
//     .then(() => process.exit(0))
//     .catch((error) => {
//       console.error(error);
//       process.exit(1);
//     });
  