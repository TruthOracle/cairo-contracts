import { Account, cairo, Contract, RpcProvider } from 'starknet';

(async () => {
  const privateKey = '0xFindPrivateKey';
  const accountAddress = '0x07eCF9980139156FC1bF10E756EEe318c20bD738561F3d6C190d226c897c3A4a';
  
  // prediction market contract address
  const contractAddress = '0x0289c4516f675cd5cf06b430f21f5fa295966f4743a0972667e0c8ea382ec399';
  
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

  // const addAdminCall = contract.populate('add_admin', [
  //   accountAddress
  // ]);
  
  // const addAdminRes = await contract.add_admin(addAdminCall.calldata);

  // const addAdminResponse = await provider.waitForTransaction(addAdminRes.transaction_hash);
  // console.log('add_admin response: ', addAdminResponse);

  // const setTreasuryCall = contract.populate('set_treasury_wallet', [
  //   accountAddress // it could be any wallet where you want to store platform fees
  // ]);
  
  // const setTreasuryRes = await contract.set_treasury_wallet(setTreasuryCall.calldata);

  // const setTreasuryResponse = await provider.waitForTransaction(setTreasuryRes.transaction_hash);
  // console.log('set_treasury_wallet response: ', setTreasuryResponse);

  const createMarketCall = contract.populate('create_market', [
    "ETH at $5k by April 30, 2025?",
    "Will ETH Token pass $5k mark by April 30, 2025?",
    cairo.tuple(cairo.felt('Yes'), cairo.felt('No')),
    cairo.felt('Crypto Market'),
    "https://i.postimg.cc/50qnRPqb/eth.png",
    1746000000
  ]);
  
  const createMarketRes = await contract.create_market(createMarketCall.calldata);

  // const createMarketCall = contract.populate('create_crypto_market', [
  //   "ETH at $5k by April 30, 2025?",
  //   "Will ETH Token pass $5k mark by April 30, 2025?",
  //   cairo.tuple(cairo.felt('Yes'), cairo.felt('No')),
  //   cairo.felt('Crypto Market'),
  //   "https://i.postimg.cc/50qnRPqb/eth.png",
  //   1746000000,
  //   1,
  //   cairo.felt(40000),
  //   cairo.felt(40000),
  // ]);
  
  // const createMarketRes = await contract.create_crypto_market(createMarketCall.calldata);
  
  const response = await provider.waitForTransaction(createMarketRes.transaction_hash);
  console.log('create_market response: ', response);
})().catch(err => {
  console.error(err);
});