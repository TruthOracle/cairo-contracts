import { Account, cairo, Contract, RpcProvider } from 'starknet';

(async () => {
  const privateKey = '0xFindThePrivateKey';
  const accountAddress = '0x07eCF9980139156FC1bF10E756EEe318c20bD738561F3d6C190d226c897c3A4a';
  
  // prediction market contract address
  const contractAddress = '0x00396a6f1c19633f019f565f680cd9a8f4326301e098a6b864e98f6819a37a77';
  
  // const account = new Account(provider, accountAddress, privateKey);
  
  const provider = new RpcProvider({
    chainId: '0x534e5f4d41494e' as any,
    nodeUrl: 'https://starknet-mainnet.public.blastapi.io',
  });
  
  const compressedContract = await provider.getClassAt(
    contractAddress,
  );
  const abi = compressedContract.abi;
  
  const account = new Account(provider, accountAddress, privateKey);

  const contract = new Contract(
    abi,
    contractAddress,
    provider,
  );
  
  // Attach the account to the contract for invoking
  contract.connect(account); 

  console.log('Caller Account Address: ', account.address);
  
  const createMarketCall = contract.populate('create_market', [
    "ETH at $5k by April 30, 2025?",
    "Will ETH Token pass $5k mark by April 30, 2025?",
    cairo.tuple(cairo.felt('Yes'), cairo.felt('No')),
    cairo.felt('Crypto Market'),
    "https://i.postimg.cc/50qnRPqb/eth.png",
    1746000000
  ]);
  
  const createMarketRes = await contract.create_market(createMarketCall.calldata);
  
  await provider.waitForTransaction(createMarketRes.transaction_hash);
  
})().catch(err => {
  console.error(err);
});