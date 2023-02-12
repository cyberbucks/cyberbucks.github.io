import {DateTime} from 'luxon'

const {customAlphabet} = require('nanoid');

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 10);

// nanoid() //=> "pBV5dH7WaT"
export const getRandomId = () => {
    return nanoid()
}

export const checkUserActivityDate = (lastOnlineDate) => {
    const lastOnline = DateTime.fromISO(lastOnlineDate);
    return DateTime.now() <= lastOnline.plus({days: 1});
}

export const getUserName = (email) => {
    return email.match(/^([^@]*)@/)[1];
}

export const newUserData = {
    accountMessage: "none",
    accountMessageType: "error",
    balance: 0.0,
    coins: 50,
    jokerStreak: 0,
    lastPrize: "empty",
    lastPrizeValue: 0,
    referrals: [],
    emailVerified: false,
    passedThreshold: false,
    cashEarnedSinceRefill: 0,
    referralReportsCreated: 0,
    pushEnabled: false,
    tickets: 0,
}

export const newPaymentData = {
    type: "none", // cash, btc etc.
    amount: 0,
    recipient: "", // wallet address etc.
}

export const paymentData = {
    paymentId: "",
    userId: "",
    requestDate: DateTime.now().toISO(),
    type: "",
    amount: "",
}

export const initReferredBy = () => {
    return "none"
}

export const initIPField = () => {
    return "192.1268.123123.1231"
}

export const userDatabaseFields = {
    referredBy: initReferredBy(),
    ipAddress: initIPField()
}

// exports.getUserId = getUserId()
// exports.getUserName = getUserName(email)
// exports.newUserData = newUserData