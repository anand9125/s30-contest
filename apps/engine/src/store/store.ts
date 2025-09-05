import { OpenTrade, PRICE, User } from "../type";

export const price:PRICE = {};

export const users = new Map<string,User>()
export const openTrade = new Map<string,OpenTrade>()