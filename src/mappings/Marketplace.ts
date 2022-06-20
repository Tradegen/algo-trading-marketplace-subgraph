import { BigInt } from "@graphprotocol/graph-ts";
import {
  CreateListing as CreateListingEvent,
  RemoveListing as RemoveListingEvent,
  UpdatePrice as UpdatePriceEvent,
  Purchase as PurchaseEvent,
  User,
  Transaction,
  Listing,
  Marketplace
} from "../types/schema";
import {
  CreatedListing,
  RemovedListing,
  UpdatedPrice,
  UpdatedTransactionFee,
  Purchased
} from "../types/Marketplace/Marketplace";
import {
  updateMarketplaceDayData,
} from "./dayUpdates";
import {
  MARKETPLACE_ADDRESS,
  ONE_BI,
  ZERO_BI
} from "./helpers";

export function handleCreateListing(event: CreatedListing): void {
    //TODO
}

export function handleRemoveListing(event: RemovedListing): void {
    //TODO
}

export function handleUpdatePrice(event: UpdatedPrice): void {
    //TODO
}

export function handleUpdatedTransactionFee(event: UpdatedTransactionFee): void {
  let marketplace = Marketplace.load(MARKETPLACE_ADDRESS);
  if (marketplace === null) {
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
  marketplace.transactionFee = event.params.newFee;
  marketplace.txCount = marketplace.txCount + 1;
  marketplace.save();
}

export function handlePurchase(event: Purchased): void {
    //TODO
}