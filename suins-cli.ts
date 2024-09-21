import { SuinsClient, SuinsTransaction } from "@mysten/suins";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { decodeSuiPrivateKey } from "@mysten/sui/cryptography";
import { toHEX } from "@mysten/sui/utils";

const NETWORK = "mainnet"; // make it configurable
const KEYPAIR = Uint8Array; // to-do

const client = new SuiClient({ url: getFullnodeUrl(NETWORK) });
const suinsClient = new SuinsClient({
	client,
	network: NETWORK,
});

/* Register a new SuiNS name */
const register = async (name: string, years: number) => {
	const priceList = await suinsClient.getPriceList();
	const transaction = new Transaction();
	const suinsTransaction = new SuinsTransaction(suinsClient, transaction);

	const nft = suinsTransaction.register({
		name,
		years,
		price: suinsClient.calculatePrice({ name, years, priceList }),
	});

	transaction.transferObjects([nft], transaction.pure.address("0x96d9350245709cbf3c96f45a978a434c322c0e8794614004d286f19d13bd3954")); // find a way to get address from keypair

	const tx = await client.signAndExecuteTransaction({
		transaction: transaction,
		signer: KEYPAIR,
	});
}

/* Register a new SuiNS subname */
const createSubname = async (subName: string, parentNftId: string, expirationMs: number, childCreation: boolean, timeExtension: boolean) => {
	const transaction = new Transaction();
	const suinsTransaction = new SuinsTransaction(suinsClient, transaction);

	const subNameNft = suinsTransaction.createSubName({
		parentNft: parentNftId,
		name: subName,
		expirationTimestampMs: expirationMs,
		allowChildCreation: childCreation,
		allowTimeExtension: timeExtension,
	});

	transaction.transferObjects([subNameNft], transaction.pure.address("0x96d9350245709cbf3c96f45a978a434c322c0e8794614004d286f19d13bd3954")); // find a way to get address from keypair

	const tx = await client.signAndExecuteTransaction({
		transaction: transaction,
		signer: KEYPAIR,
	});
}

