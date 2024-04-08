import { Request, Response, NextFunction } from "express";
import NodeCache = require("node-cache");
import { extractTriggerDataFromRequest } from "../utils/extractor";
import _ from "lodash";



/**
 * Middleware for AI Network trigger call. It will filter duplicated request triggered by same transaction.
 * It will reject requests which is not from AI Network trigger.
 * @param {Request} request - Request data 
 * @param {Res} response - Response data
 * @param {NextFunction} next - Next function
 * @returns Null if if request is duplicated.
 */
blockchainTriggerFilter = async (req: Request, res: Response, next: NextFunction) => {
  //check if request is from blockchain trigger
  try {
    const { triggerPath, triggerValue, txHash } = extractTriggerDataFromRequest(req);
    if(!triggerPath || !triggerValue || !txHash) {
      throw new Error("Not from blockchain");
    }
    // NOTE(yoojin): Validation will changed. Temp comment out.
    // const result = await this.ain.getValue(triggerPath);
    
    // If request is first reque st, set cache 
    if (this.cache.get(txHash) && this.cache.get(txHash) !== "error") {
      res.send("Duplicated");
      return;
    }
    this.cache.set(txHash, "in_progress", 500);
    // NOTE(yoojin): Validation will changed. Temp comment out.
    // _.isEqual(result, triggerValue) ? next(): res.send("Not from blockchain");
    next();
  } catch (e) {
    console.log("Filtering Error ", e)
    res.send(e);
    return;
  }
}