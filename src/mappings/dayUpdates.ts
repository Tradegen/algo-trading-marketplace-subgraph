import { BigInt, ethereum } from "@graphprotocol/graph-ts";
import {
  MarketplaceDayData,
  Marketplace,
} from "../types/schema";
import { MARKETPLACE_ADDRESS, ZERO_BI } from "./helpers";

export function updateMarketplaceDayData(event: ethereum.Event): MarketplaceDayData {
  let marketplace = Marketplace.load(MARKETPLACE_ADDRESS);
  if (marketplace === null)
  {
    marketplace = new Marketplace(MARKETPLACE_ADDRESS);
    marketplace.listingCount = 0;
    marketplace.totalVolume = ZERO_BI;
    marketplace.componentVolume = ZERO_BI;
    marketplace.tradingBotVolume = ZERO_BI;
    marketplace.componentInstanceVolume = ZERO_BI;
    marketplace.totalSales = 0;
    marketplace.totalComponentsSold = 0;
    marketplace.totalTradingBotsSold = 0;
    marketplace.totalComponentInstancesSold = 0;
    marketplace.txCount = 0;
    marketplace.collectedFees = ZERO_BI;

  }
  marketplace.save();
  
  let timestamp = event.block.timestamp.toI32();
  let dayID = timestamp / 86400;
  let dayStartTimestamp = dayID * 86400;
  let marketplaceDayData = MarketplaceDayData.load(dayID.toString());
  if (marketplaceDayData === null)
  {
    marketplaceDayData = new MarketplaceDayData(dayID.toString());
    marketplaceDayData.date = dayStartTimestamp;
    marketplaceDayData.dailyCumulativeVolume = ZERO_BI;
    marketplaceDayData.dailyComponentVolume = ZERO_BI;
    marketplaceDayData.dailyTradingBotVolume = ZERO_BI;
    marketplaceDayData.dailyComponentInstancesVolume = ZERO_BI;
    marketplaceDayData.dailyFeesCollected = ZERO_BI;
    marketplaceDayData.totalCumulativeVolume = ZERO_BI;
    marketplaceDayData.totalComponentVolume = ZERO_BI;
    marketplaceDayData.totalTradingBotVolume = ZERO_BI;
    marketplaceDayData.totalComponentInstancesVolume = ZERO_BI;
    marketplaceDayData.totalFeesCollected = ZERO_BI;
    marketplaceDayData.dailyCumulativeSales = 0;
    marketplaceDayData.dailyComponentsSold = 0;
    marketplaceDayData.dailyTradingBotsSold = 0;
    marketplaceDayData.dailyComponentInstancesSold = 0;
    marketplaceDayData.txCount = 0;
  }

  marketplaceDayData.totalCumulativeVolume = marketplace.totalVolume;
  marketplaceDayData.totalComponentVolume = marketplace.componentVolume;
  marketplaceDayData.totalTradingBotVolume = marketplace.tradingBotVolume;
  marketplaceDayData.totalComponentInstancesVolume = marketplace.componentInstanceVolume;
  marketplaceDayData.totalFeesCollected = marketplace.collectedFees;
  marketplaceDayData.txCount = marketplace.txCount;
  marketplaceDayData.save();

  return marketplaceDayData as MarketplaceDayData;
}