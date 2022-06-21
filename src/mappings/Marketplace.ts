import { BigInt } from "@graphprotocol/graph-ts";
import {
  CreateListing as CreateListingEvent,
  RemoveListing as RemoveListingEvent,
  UpdatePrice as UpdatePriceEvent,
  Purchase as PurchaseEvent,
  User,
  Transaction,
  Listing,
  Marketplace,
  CreateListing
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
  ADDRESS_ZERO,
  ONE_BI,
  ZERO_BI
} from "./helpers";

export function handleCreateListing(event: CreatedListing): void {
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
    marketplace.listingCount = marketplace.listingCount + 1;
    marketplace.txCount = marketplace.txCount + 1;
    marketplace.save();

    let user = User.load(event.params.seller.toHexString());
    if (user === null) {
        user = new User(event.params.seller.toHexString());
        user.totalNumberOfSales = 0;
        user.componentsSold = 0;
        user.tradingBotsSold = 0;
        user.componentInstancesSold = 0;
        user.totalVolume = ZERO_BI;
        user.componentVolume = ZERO_BI;
        user.tradingBotVolume = ZERO_BI;
        user.componentInstancesVolume = ZERO_BI;
        user.totalFeesPaid = ZERO_BI;
        user.save();
    }

    let listing = new Listing(event.params.marketplaceListingIndex.toString());
    listing.exists = true;
    listing.seller = user.id;
    listing.contractType = event.params.contractType;
    listing.componentID = event.params.componentID;
    listing.tokenID = event.params.tokenID;
    listing.price = event.params.price;
    listing.save();

    let transaction = new Transaction(event.transaction.hash.toHexString());
    transaction.blockNumber = event.block.number;
    transaction.timestamp = event.block.timestamp;
    transaction.user = user.id;
    transaction.contractType = event.params.contractType;
    transaction.componentID = event.params.componentID;
    transaction.tokenID = event.params.tokenID;
    transaction.save();

    let create = new CreateListingEvent(event.transaction.hash.toHexString().concat("-createListing"));
    create.transaction = transaction.id;
    create.timestamp = event.block.timestamp;
    create.seller = event.params.seller.toHexString();
    create.contractType = event.params.contractType;
    create.componentID = event.params.componentID;
    create.tokenID = event.params.tokenID;
    create.price = event.params.price;
    create.index = event.params.marketplaceListingIndex;
    create.save();

    transaction.createListing = create.id;
    transaction.save();

    updateMarketplaceDayData(event);
}

export function handleRemoveListing(event: RemovedListing): void {
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
    marketplace.listingCount = (marketplace.listingCount == 0) ? 0 : marketplace.listingCount - 1;
    marketplace.txCount = marketplace.txCount + 1;
    marketplace.save();

    let user = User.load(event.params.seller.toHexString());
    if (user === null) {
        user = new User(event.params.seller.toHexString());
        user.totalNumberOfSales = 0;
        user.componentsSold = 0;
        user.tradingBotsSold = 0;
        user.componentInstancesSold = 0;
        user.totalVolume = ZERO_BI;
        user.componentVolume = ZERO_BI;
        user.tradingBotVolume = ZERO_BI;
        user.componentInstancesVolume = ZERO_BI;
        user.totalFeesPaid = ZERO_BI;
        user.save();
    }

    let listing = Listing.load(event.params.marketplaceListingIndex.toString());

    let transaction = new Transaction(event.transaction.hash.toHexString());
    transaction.blockNumber = event.block.number;
    transaction.timestamp = event.block.timestamp;
    transaction.user = user.id;
    transaction.contractType = listing.contractType;
    transaction.componentID = listing.componentID;
    transaction.tokenID = listing.tokenID;
    transaction.save();

    // Update listing.
    listing.exists = false;
    listing.seller = ADDRESS_ZERO;
    listing.componentID = ZERO_BI;
    listing.tokenID = ZERO_BI;
    listing.price = ZERO_BI;
    listing.save();

    let remove = new RemoveListingEvent(event.transaction.hash.toHexString().concat("-removeListing"));
    remove.transaction = transaction.id;
    remove.timestamp = event.block.timestamp;
    remove.seller = event.params.seller.toHexString();
    remove.index = event.params.marketplaceListingIndex;
    remove.save();

    transaction.removeListing = remove.id;
    transaction.save();

    updateMarketplaceDayData(event);
}

export function handleUpdatePrice(event: UpdatedPrice): void {
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
    marketplace.txCount = marketplace.txCount + 1;
    marketplace.save();

    let user = User.load(event.params.seller.toHexString());
    if (user === null) {
        user = new User(event.params.seller.toHexString());
        user.totalNumberOfSales = 0;
        user.componentsSold = 0;
        user.tradingBotsSold = 0;
        user.componentInstancesSold = 0;
        user.totalVolume = ZERO_BI;
        user.componentVolume = ZERO_BI;
        user.tradingBotVolume = ZERO_BI;
        user.componentInstancesVolume = ZERO_BI;
        user.totalFeesPaid = ZERO_BI;
        user.save();
    }

    // Update the listing price.
    let listing = Listing.load(event.params.marketplaceListingIndex.toString());
    listing.price = event.params.newPrice;
    listing.save();

    let transaction = new Transaction(event.transaction.hash.toHexString());
    transaction.blockNumber = event.block.number;
    transaction.timestamp = event.block.timestamp;
    transaction.user = user.id;
    transaction.contractType = listing.contractType;
    transaction.componentID = listing.componentID;
    transaction.tokenID = listing.tokenID;
    transaction.save();

    let updatePrice = new UpdatePriceEvent(event.transaction.hash.toHexString().concat("-updatePrice"));
    updatePrice.transaction = transaction.id;
    updatePrice.timestamp = event.block.timestamp;
    updatePrice.seller = event.params.seller.toHexString();
    updatePrice.newTokenPrice = event.params.newPrice;
    updatePrice.index = event.params.marketplaceListingIndex;
    updatePrice.save();

    transaction.updatePrice = updatePrice.id;
    transaction.save();

    updateMarketplaceDayData(event);
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
    let listing = Listing.load(event.params.marketplaceListingIndex.toString());

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
    let fee = listing.price.times(marketplace.transactionFee).div(BigInt.fromString("10000"));
    marketplace.txCount = marketplace.txCount + 1;
    marketplace.collectedFees = marketplace.collectedFees.plus(fee);
    marketplace.save();

    let transaction = new Transaction(event.transaction.hash.toHexString());
    transaction.blockNumber = event.block.number;
    transaction.timestamp = event.block.timestamp;
    transaction.user = event.params.buyer.toHexString();
    transaction.contractType = listing.contractType;
    transaction.componentID = listing.componentID;
    transaction.tokenID = listing.tokenID;
    transaction.save();

    let purchase = new PurchaseEvent(event.transaction.hash.toHexString().concat("-purchase"));
    purchase.transaction = transaction.id;
    purchase.timestamp = event.block.timestamp;
    purchase.buyer = event.params.buyer.toHexString();
    purchase.contractType = event.params.contractType;
    purchase.componentID = event.params.componentID;
    purchase.tokenID = event.params.tokenID;
    purchase.price = event.params.price;
    purchase.index = event.params.marketplaceListingIndex;
    purchase.save();

    transaction.purchase = purchase.id;
    transaction.save();

    let buyer = User.load(event.params.buyer.toHexString());
    if (buyer === null) {
        buyer = new User(event.params.buyer.toHexString());
        buyer.totalNumberOfSales = 0;
        buyer.componentsSold = 0;
        buyer.tradingBotsSold = 0;
        buyer.componentInstancesSold = 0;
        buyer.totalVolume = ZERO_BI;
        buyer.componentVolume = ZERO_BI;
        buyer.tradingBotVolume = ZERO_BI;
        buyer.componentInstancesVolume = ZERO_BI;
        buyer.totalFeesPaid = ZERO_BI;
    }
    buyer.totalFeesPaid = (buyer.totalFeesPaid as BigInt).plus(fee);
    buyer.save();

    let seller = User.load(listing.seller);
    if (seller === null) {
        seller = new User(listing.seller);
        seller.totalNumberOfSales = 0;
        seller.componentsSold = 0;
        seller.tradingBotsSold = 0;
        seller.componentInstancesSold = 0;
        seller.totalVolume = ZERO_BI;
        seller.componentVolume = ZERO_BI;
        seller.tradingBotVolume = ZERO_BI;
        seller.componentInstancesVolume = ZERO_BI;
        seller.totalFeesPaid = ZERO_BI;
    }
    seller.totalNumberOfSales = seller.totalNumberOfSales + 1;
    seller.totalVolume = seller.totalVolume.plus(listing.price);
    seller.save();

    let marketplaceDayData = updateMarketplaceDayData(event);
    marketplaceDayData.dailyCumulativeVolume = marketplaceDayData.dailyCumulativeVolume.plus(listing.price);
    marketplaceDayData.dailyFeesCollected = marketplaceDayData.dailyFeesCollected.plus(fee);

    if (event.params.contractType == ZERO_BI) {
        marketplace.tradingBotVolume = marketplace.tradingBotVolume.plus(listing.price);
        marketplace.totalTradingBotsSold = marketplace.totalTradingBotsSold + 1;
        marketplace.save();

        marketplaceDayData.dailyTradingBotVolume = marketplaceDayData.dailyTradingBotVolume.plus(listing.price);
        marketplaceDayData.dailyTradingBotsSold = marketplaceDayData.dailyTradingBotsSold + 1;
        marketplaceDayData.save();

        seller.tradingBotsSold = seller.tradingBotsSold + 1;
        seller.tradingBotVolume = seller.tradingBotVolume.plus(listing.price);
        seller.save();
    }
    else if (event.params.contractType == BigInt.fromString("1")) {
        marketplace.componentVolume = marketplace.componentVolume.plus(listing.price);
        marketplace.totalComponentsSold = marketplace.totalComponentsSold + 1;
        marketplace.save();

        marketplaceDayData.dailyComponentVolume = marketplaceDayData.dailyComponentVolume.plus(listing.price);
        marketplaceDayData.dailyComponentsSold = marketplaceDayData.dailyComponentsSold + 1;
        marketplaceDayData.save();

        seller.componentsSold = seller.componentsSold + 1;
        seller.componentVolume = seller.componentVolume.plus(listing.price);
        seller.save();
    }
    else if (event.params.contractType == BigInt.fromString("2")) {
        marketplace.componentInstanceVolume = marketplace.componentInstanceVolume.plus(listing.price);
        marketplace.totalComponentInstancesSold = marketplace.totalComponentInstancesSold + 1;
        marketplace.save();

        marketplaceDayData.dailyComponentInstancesVolume = marketplaceDayData.dailyComponentInstancesVolume.plus(listing.price);
        marketplaceDayData.dailyComponentInstancesSold = marketplaceDayData.dailyComponentInstancesSold + 1;
        marketplaceDayData.save();

        seller.componentInstancesSold = seller.componentInstancesSold + 1;
        seller.componentInstancesVolume = seller.componentInstancesVolume.plus(listing.price);
        seller.save();
    }

    listing.exists = false;
    listing.seller = ADDRESS_ZERO;
    listing.componentID = ZERO_BI;
    listing.tokenID = ZERO_BI;
    listing.save();
}