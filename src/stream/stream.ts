import { BigNumber, ethers, utils } from "ethers";
import dotenv from "dotenv";
import { notification } from "../telegram/telegram";
import ABI from "../../contract-abi.json";
export const ListeningEvents = async () => {
  const USDCAddress = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
  // const WETHAddress = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
  const FlashLoanProviderAddress = "0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640";
  const provider = new ethers.providers.WebSocketProvider(process.env.WSS_URL!);
  const USDCContract = new ethers.Contract(USDCAddress, ABI, provider);
  // const WETHContract = new ethers.Contract(USDCAddress, ABI, provider);

  const USDCfilterFrom = USDCContract.filters.Transfer(
    FlashLoanProviderAddress
  );
  // const WETHfilterFrom = USDCContract.filters.Transfer(
  //   FlashLoanProviderAddress
  // );

  USDCContract.on(USDCfilterFrom, async (from, to, value, event) => {

    // console.log(event);
    // const myEvent = await provider.getTransaction(event.transactionHash);
     value = (value / 1e6);
    console.log("Your data is:", to, value, event.transactionHash);
    if (Number(value) >= 10) {
      let message = `Flashloan transaction notification :`;
      message += `\n\ntxHash:https://etherscan.io/tx/${event.transactionHash}`;
      message += `\n\namount: ${value} USDC`;
      message += `\n\nto:https://etherscan.io/address/${to}`;
      await notification(message);
    }
  });

 
};
