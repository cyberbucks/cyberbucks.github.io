import firebase from 'firebase';
import {checkUserActivityDate, getRandomId, getUserName, newUserData} from "./userUtilities";
import {DateTime} from 'luxon'
import publicIp from "public-ip";
import {printText} from "./devUtilities";
import preval from "preval.macro";


// Initialize Firebase
export const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyA_fUr0kLrUN_WIQRFd98SfnoKXxN5zotM",
    authDomain: "memosh-81256.firebaseapp.com",
    databaseURL: "https://memosh-81256-default-rtdb.firebaseio.com",
    projectId: "memosh-81256",
    storageBucket: "memosh-81256.appspot.com",
    messagingSenderId: "692838001332",
    appId: "1:692838001332:web:ed77ec564c72ae513b85e1",
    measurementId: "G-LMS0QMKHEL"
});

if(process.env.NODE_ENV !== "development") {
    const appCheck = firebaseApp.appCheck();
// Pass your reCAPTCHA v3 site key (public key) to activate(). Make sure this
// key is the counterpart to the secret key you set in the Firebase console.
    appCheck.activate('6LdQbWAcAAAAALLJXbg2L9jYK6hKGvVHIGgYdYR-',
        // Optional argument. If true, the SDK automatically refreshes App Check
        // tokens as needed.
        true);
}

firebaseApp.performance()
firebaseApp.analytics()

// navigator.serviceWorker
//     .register('/firebase-messaging-sw.js')
//     .then((registration) => {
//         firebaseApp.messaging().useServiceWorker(registration);
//     });

export const registerNewUserToDatabase = (uid, email, referredBy) => {
    // const database = firebaseApp.database();
    const dbRef = getUserDatabaseRef()
    const userName = getUserName(email)

    const currentTime = new Date();
    const lastSpinTime = new Date(currentTime.getTime() - 10000).toISOString(); //current time minus 10 seconds, so the spin API can let the user spin after checking if 10 seconds has passed since lastSpinTime
    const linksInfo = {
      0: {
        obtainDate: "0",
        visited: false
      }
    }

    publicIp.v4().then(ip => {
        let userDataToRegister = {
            ...newUserData,
            referredBy: referredBy === undefined ? "none" : referredBy,
            userName: userName,
            lastOnline: DateTime.now().toISO(),
            registerDate: DateTime.now().toISO(),
            lastSpinTime: lastSpinTime,
            ipAddress: ip,
            hasAdblock: false,
            refillRequested: false,
            lastRefillRequest: 0,
            linksInfo: linksInfo
        }
        // For special promotions
        if(referredBy !== undefined && (referredBy === "0rlGbicgIZWpk4Vhcx1RimbJo4v2"
            || referredBy === "jGVqlhJJBffIAr5yESPOc0owr9D3"
            || referredBy === "U33BhUYaZSdYB0hO5mq2JmFWjpv2"
            || referredBy === "wfvmWfaeeXMD81j2fpMxvIjbpkr1"
            || referredBy === "8IZgPHE8NsVCrLNq9fHoFJrhfPB3")) {
            userDataToRegister.balance = 10.0;
            userDataToRegister.coins += 50;
        }
        dbRef.child(uid).update(userDataToRegister).catch((error) => {
            console.error(error)
        })
    }).catch((error) => {
        console.error(error)
    })
}

export const addJSONObjectToDatabase = (ref, object) => {
    // const database = firebaseApp.database();
    const dbRef = getDatabaseRef(ref)
    dbRef.set(object);
}

/**
 // WARNING: Backend handles add referral to user requests. This will throw an error.
 @deprecated
 **/
export const addReferralToUser = (referredBy, referral) => {
    // const database = firebaseApp.database();
    const dbRef = getUserDatabaseRef()
    let data
    dbRef.child(referredBy).get().then((snapshot) => {
        if (snapshot.exists()) {
            data = snapshot.val();
            printText(data);
            data.coins += 5
            let referralObject = {id: referral, lastGoldCollection: "none"}
            if(data.hasOwnProperty("referrals")) {
                // data.referrals.push(referral);
                data.referrals.push(referralObject)
            } else {
                data = {
                    ...data,
                    // referrals: [referral]
                    referrals: [referralObject]
                }
            }
            dbRef.child(referredBy).update(data).then()
        } else {
            printText("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
}

/**
// WARNING: Backend handles payment requests. This will throw an error.
 @deprecated
 **/
export const addWithdrawalRequest = (requestData, uid) => {

  const dbRef = getDatabaseRef("withdrawalRequests")
  let data
  dbRef.get().then((snapshot) => {
      if (snapshot.exists()) {
          data = snapshot.val();
          data[uid] = {
            addrType: requestData.addrType,
            coinAddr: requestData.coinAddr,
            cashAmount: requestData.cashAmount,
          }
          dbRef.update(data).then()
      } else {
          printText("No data available");

      }
  }).catch((error) => {
      console.error(error);
  });
}



export const addJackpotEntry = (ticketCount, uid) => {

  const dbRef = getUserDatabaseRef()
  let data
  dbRef.child(uid).get().then((snapshot) => {
      if (snapshot.exists()) {
          data = snapshot.val();
          printText(data);
          data.tickets += ticketCount
          dbRef.child(uid).update(data).then()
      } else {
          printText("No data available");

      }
  }).catch((error) => {
      console.error(error);
  });
}



export const getJackpotData = () => {

  return new Promise((resolve, reject) => {

    const dbRef = getDatabaseRef("currentJackpot")
    let data
    dbRef.get().then((snapshot) => {
        if (snapshot.exists()) {
            data = snapshot.val();
            printText(data);
             resolve(data)

        } else {
            printText("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });

  });
}

export const getMockupAdData = () => {

  return new Promise((resolve, reject) => {

    const dbRef = getDatabaseRef("mockupAds")
    let data
    dbRef.get().then((snapshot) => {
        if (snapshot.exists()) {
            data = snapshot.val();
            printText(data);
             resolve(data)

        } else {
            printText("No data available");
        }
    }).catch((error) => {
        console.error(error);
        // window.location.reload()
    });

  });
}

export const getLinkData = () => {

  return new Promise((resolve, reject) => {

    const dbRef = getDatabaseRef("links")
    let data
    dbRef.get().then((snapshot) => {
        if (snapshot.exists()) {
            data = snapshot.val();
            printText(data);
             resolve(data)
        } else {
            printText("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });

  });
}

export const addNewLink = (linkData, linkId, uid) => {

  const dbRef = getDatabaseRef("links")
  let data
  dbRef.get().then((snapshot) => {
      if (snapshot.exists()) {
          data = snapshot.val();
          printText(data);

          data[linkId] = {
            addr: linkData.addr,
            coinPrize: linkData.coinPrize,
            minDurSec: linkData.minDurSec,
            visitGoal: linkData.visitGoal,
            userId: uid,
            desc: linkData.description,
            logo: linkData.logo,
            sponsored: false,
            title: linkData.title,
            currentVisits: 0

            //may add more props here
          }


          dbRef.update(data).then()
      } else {
          printText("No data available");

      }
  }).catch((error) => {
      console.error(error);
  });
}
/**
 * WARNING: Will cause permission denied error. Use getAnyDataWithoutChild instead.
 * @deprecated
 */
export const getAllData = () => {

  return new Promise((resolve, reject) => {               //promise

    const dbRef = firebaseApp.database().ref()
    let data
      dbRef.get().then((snapshot) => {
          if (snapshot.exists()) {
              data = snapshot.val();
              printText(data);
              resolve(data)

          } else {
              printText("No data available");

          }
      }).catch((error) => {
          console.error(error);
      });


});
}


export const getUserData = (uid) => {

  return new Promise((resolve, reject) => {               //promise

    const dbRef = getUserDatabaseRef()
    let data
      dbRef.child(uid).get().then((snapshot) => {
          if (snapshot.exists()) {
              data = snapshot.val();
              printText(data);
              resolve(data)

          } else {
              printText("No data available");

          }
      }).catch((error) => {
          console.error(error);
      });
});
}

export const updateUserData = (uid, userData) => {
    return new Promise((resolve, reject) => {               //promise
        const dbRef = getUserDatabaseRef()
        dbRef.child(uid).update(userData).then(() => {
            resolve()
        }).catch((error) => {
            reject()
            console.error(error);
        });
    });
}

export const chargeUser = (costCash, uid) => {

  const dbRef = getUserDatabaseRef()
  let data
  dbRef.child(uid).get().then((snapshot) => {
      if (snapshot.exists()) {
          data = snapshot.val();
          printText(data);
          data.balance -= costCash
          dbRef.child(uid).update(data).then()
      } else {
          printText("No data available");

      }
  }).catch((error) => {
      console.error(error);
  });
}

export const collectPrizeFromLink = (coinPrize, linkId, uid) => {
    return new Promise((resolve, reject) => {
        getUserData(uid).then((userData) => {
            userData.linksInfo = {
                ...userData.linksInfo,
                [linkId]: {
                    obtainDate: DateTime.now().toISO(),
                    visited: true
                }
            }
            userData.coins += coinPrize
            updateUserData(uid, userData).then(() => {
                getAnyDataWithoutChild("links/" + linkId).then((linkData) => {
                    linkData.currentVisits += 1
                    const dbRef = getDatabaseRef("links")
                    dbRef.child(linkId).update(linkData).then(() => {
                        resolve()
                    })
                })
            })
        }).catch((error) => {
            console.error(error);
        });
  })
}

export const updateLastOnline = (userId) => {
    const dbRef = getUserDatabaseRef()
    let data
    dbRef.child(userId).get().then((snapshot) => {
        if (snapshot.exists()) {
            data = snapshot.val();
            printText(data);
            data.lastOnline = DateTime.now().toISO()
            dbRef.child(userId).update(data).then()
        } else {
            printText("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
}

export const authLogout = () => {
    return new Promise((resolve, reject) => {
        firebaseApp.auth().signOut().then(r => {
            printText("logoutClick: Logged out!")
            resolve(true)
        })
    })}

export const setUserAdblock = (userId, hasAdblock) => {
    const dbRef = getUserDatabaseRef()
    let data = {}
    dbRef.child(userId).get().then((snapshot) => {
        if (snapshot.exists()) {
            data = snapshot.val();
            printText(data);
            try {
                data.hasAdblock = hasAdblock
            }
            catch (e) {
                printText("setUserAdblock: User does not have the property hasAdblock")
            }
            dbRef.child(userId).update(data).then()
        } else {
            printText("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
}

export const setUserPush = (userId, pushEnabled) => {
    const dbRef = getUserDatabaseRef()
    let data = {}
    dbRef.child(userId).get().then((snapshot) => {
        if (snapshot.exists()) {
            data = snapshot.val();
            printText(data);
            try {
                data.pushPrompted = true
                data.pushEnabled = pushEnabled
            }
            catch (e) {
                printText("setUserAdblock: User does not have the property hasAdblock")
            }
            dbRef.child(userId).update(data).then()
        } else {
            printText("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
}

export const setUserIP = (userId) => {
    const dbRef = getUserDatabaseRef()
    let data = {}
    dbRef.child(userId).get().then((snapshot) => {
        if (snapshot.exists()) {
            data = snapshot.val();
            printText(data);
            publicIp.v4().then(result => {
                try {
                    data.ipAddress = result
                }
                catch (e) {
                    printText("setUserIP: User does not have the property ipAddress")
                }
                dbRef.child(userId).update(data).then()
            })
        } else {
            printText("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
}

// Should be updated when new user data fields are added and need to be
// updated at every login
export const runLoginRoutine = (userId, emailVerified) => {
    const dbRef = getUserDatabaseRef()
    let data = {}
    dbRef.child(userId).get().then((snapshot) => {
        if (snapshot.exists()) {
            data = snapshot.val();
            printText(data);
            publicIp.v4().then(result => {
                try {
                    data.ipAddress = result
                }
                catch (e) {
                    printText("setUserIP: User does not have the property ipAddress")
                }
                data.lastOnline = DateTime.now().toISO();
                data.emailVerified = emailVerified
                dbRef.child(userId).update(data).then()
            })
        } else {
            printText("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
}


// Requester can either be crew or referrals
// Crew: return data about gold collection
// Referrals: return more data about the referral user
export const getReferralData = (userData, requester) => {
    return new Promise((resolve, reject) => {               //promise
        const dbRef = getUserDatabaseRef()
        let data = {}
        if (userData.hasOwnProperty("referrals") && userData.referrals.length > 0) {
            printText("getReferralData: userData has referrals property")
            for (const referral of userData.referrals) {
                printText("getReferralData:current referral id is " + referral.id)
                dbRef.child(referral.id).get().then((snapshot) => {
                    if (snapshot.exists()) {
                        // data[referral.id] = snapshot.val()
                        const referralId = referral.id
                        const userName = snapshot.val().userName
                        const isActive = checkUserActivityDate(snapshot.val().lastOnline)
                        printText("getReferralData: isActive is " + isActive.toString() + " for " + referralId)
                        // data[referralId].userName = snapshot.val().userName
                        // data[referralId].isActive = checkUserActivityDate(snapshot.val().lastOnline)
                        if(requester === "crew") {
                            let nextGoldCollection
                            nextGoldCollection = DateTime.fromISO(referral.lastGoldCollection).plus({days: 1})
                            if (!nextGoldCollection.isValid) {
                                nextGoldCollection = DateTime.now().minus({days: 1})
                            }
                            printText("getReferralData: nextGoldCollection is " + nextGoldCollection.toString() + " for " + referralId)
                            let isGoldAvailable, goldWait
                            if (isActive && nextGoldCollection < DateTime.now()) {
                                // Referral is active
                                printText("getReferralData: referral available")
                                // data[referralId].isGoldAvailable = true
                                isGoldAvailable = true
                                goldWait = "none"
                                // data["availableReferrals"].push(referralId)
                                if (data.hasOwnProperty("availableReferrals")) {
                                    // data.referrals.push(referral);
                                    data.availableReferrals.push(referralId)
                                    printText("data has availableReferrals property")
                                } else {
                                    data = {
                                        ...data,
                                        availableReferrals: [referralId]
                                    }
                                    printText("getReferralData: added availableReferrals property")
                                }
                                printText("getReferralData: availableReferrals: " + data.availableReferrals.toString())
                            } else {
                                // Referral is not active
                                // data[referralId].isGoldAvailable = false
                                isGoldAvailable = false
                                const goldWaitHours = nextGoldCollection.diff(DateTime.now()).hours
                                // data[referralId].goldWait = goldWaitHours < 1 ? (goldWaitHours*60).toString() + "m" : goldWaitHours.toString() + "h"
                                goldWait = goldWaitHours < 1 ? (goldWaitHours * 60).toString() + "m" : goldWaitHours.toString() + "h"
                            }
                            if (data.hasOwnProperty("allReferrals")) {
                                // data.referrals.push(referral);
                                printText("getReferralData: data has referralId property")
                                data.allReferrals.push({
                                    referralId: referralId, userName: userName, isActive: isActive,
                                    isGoldAvailable: isGoldAvailable, goldWait: goldWait
                                })
                            } else {
                                printText("getReferralData: added referralId property")
                                data = {
                                    ...data,
                                    allReferrals: [{
                                        referralId: referralId, userName: userName, isActive: isActive,
                                        isGoldAvailable: isGoldAvailable, goldWait: goldWait
                                    }]
                                }
                            }
                        } else if(requester === "referrals") {
                            const emailVerified = snapshot.val().emailVerified
                            if (data.hasOwnProperty("allReferrals")) {
                                // data.referrals.push(referral);
                                printText("getReferralData: data has referralId property")
                                data.allReferrals.push({
                                    referralId: referralId, userName: userName, isActive: isActive,
                                    emailVerified: emailVerified
                                })
                            } else {
                                printText("getReferralData: added referralId property")
                                data = {
                                    ...data,
                                    allReferrals: [{
                                        referralId: referralId, userName: userName, isActive: isActive,
                                        emailVerified: emailVerified
                                    }]
                                }
                            }
                        }
                    } else {
                        printText("getReferralData: No data available")
                    }
                    if(data.allReferrals.length === userData.referrals.length) {
                        printText("getReferralData: filled resolved data " + JSON.stringify(data))
                        resolve(data)
                    }
                }).catch((error) => {
                    console.error(error);
                    // reject()
                });
            }
            // printText("getReferralData: filled resolved data " + JSON.stringify(data))
            // resolve(data)
        } else {
            // User has no referrals
            printText("getReferralData: empty resolved data " + JSON.stringify(data))
            resolve(data)
        }
    });
}

export const addCoins = (uid, coin) => {

    const dbRef = getUserDatabaseRef()
    let data
    dbRef.child(uid).get().then((snapshot) => {
        if (snapshot.exists()) {
            data = snapshot.val();
            data.coins += coin
            dbRef.child(uid).update(data).then()
        } else {
            printText("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
}

export const updateRefillRequest = (uid) => {

    var ONE_HOUR = 60 * 60 * 1000; //ms

    const dbRef = getUserDatabaseRef()
    let data
    dbRef.child(uid).get().then((snapshot) => {
        if (snapshot.exists()) {
            data = snapshot.val();

            var lastRefillRequest = new Date(data.lastRefillRequest) //converting the date from ISO ot Date object
            var minRefillTime = new Date(lastRefillRequest.getTime() + ONE_HOUR) //creating a date object that's one hour later from the last refill date, so we have a reference for our earliest refill possible

            if(DateTime.now() > minRefillTime && data.coins == 0) {
              data.lastRefillRequest = DateTime.now().toISO()
              data.refillRequested = true
              dbRef.child(uid).update(data).then()
            } else {
              printText("Time requirement not met.")
            }


        } else {
            printText("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
}

export const refillCoins = (uid, coinAmount) => {

    var ONE_HOUR = 60 * 60 * 1000; //ms

    const dbRef = getUserDatabaseRef()
    let data
    dbRef.child(uid).get().then((snapshot) => {
        if (snapshot.exists()) {
            data = snapshot.val();

            var lastRefillRequest = new Date(data.lastRefillRequest)
            var minRefillTime = new Date(lastRefillRequest.getTime() + ONE_HOUR)

            if(DateTime.now() > minRefillTime && data.coins == 0) {
              data.coins += coinAmount
              data.refillRequested = false
              dbRef.child(uid).update(data).then()
            } else {
              printText("Time requirement not met.")
            }


        } else {
            printText("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
}

export const getPaymentRequests = () => {
    return new Promise((resolve, reject) => {               //promise
        const dbRef = getDatabaseRef()
        let data
        dbRef.child("paymentRequests").get().then((snapshot) => {
            if (snapshot.exists()) {
                data = snapshot.val();
                resolve(data)
            } else {
                printText("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
    });
}

export const getReferralReports = () => {
    return new Promise((resolve, reject) => {               //promise
        const dbRef = getDatabaseRef()
        let data
        dbRef.child("referralReports").get().then((snapshot) => {
            if (snapshot.exists()) {
                data = snapshot.val();
                resolve(data)
            } else {
                printText("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
    });
}

export const updateReferralGoldCollection = (userId, referralId) => {

    const dbRef = getUserDatabaseRef()
    let data
    dbRef.child(userId).get().then((snapshot) => {
        if (snapshot.exists()) {
            data = snapshot.val();
            let i = 0
            for(const referral of data.referrals) {
                if(referral.id === referralId) {
                   data.referrals[i].lastGoldCollection = DateTime.now().toISO()
                }
                i++
            }
            dbRef.child(userId).update(data).then()
        } else {
            printText("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
}


// {
//   pastJackpots: [{
//     userName: "asena",
//     ticketCount: 10,
//     date: 0,
//     prize: 300
//   },
//   {
//     userName: "emre",
//     ticketCount: 5,
//     date: 0,
//     prize: 500
//   }
// ],
//   entries: 0,
//   prize: 100,
//   drawDate: 0
// }

export const initiateRaffle = () => { //may be optimally run from the server instead of the client

  const dbRef = getUserDatabaseRef()
  let data
  dbRef.get().then((snapshot) => {
      if (snapshot.exists()) {
          data = snapshot.val();
          printText(data);

          var usersWithTicketMultipliers = []
          var userIds = Object.keys(data)


          for(var a = 0; a < userIds.length; a++) { //adding each user's Ids for each ticket they have
            for(var b = 0; b <data[userIds[a]].tickets; b++) {
              usersWithTicketMultipliers.push(userIds[a])
            }
          }

          var winnerIndex = Math.floor(Math.random() * usersWithTicketMultipliers.length) //choosing the winner

          printText("Winner is " + data[usersWithTicketMultipliers[winnerIndex]].userName)

      } else {
          printText("No data available");

      }
  }).catch((error) => {
      console.error(error);
  });
}

export const checkUserExists = (uid) => {
    // const database = firebaseApp.database();
    const dbRef = getUserDatabaseRef()
    return new Promise((resolve, reject) => {
        dbRef.child(uid).get().then((snapshot) => {
            if (snapshot.exists()) {
                printText("checkedUserExists output");
                resolve(true);
            } else {
                printText("User does not exist");
                resolve(false);
            }
        })
    }).catch((error) => {
        console.error(error);
    });
}

export const updateUserLastOnline = (uid) => {
    let data
    const dbRef = getUserDatabaseRef()
    dbRef.child(uid).get().then((snapshot) => {
        if (snapshot.exists()) {
            data = snapshot.val();
            printText(data);
            data.lastOnline = DateTime.now().toISO();
            dbRef.child(uid).update(data).then()
        } else {
            printText("Could not update user's last online date");
        }
    })
}

export const isUserActive = (uid) => {
    let data
    const dbRef = getUserDatabaseRef()
    return new Promise((resolve, reject) => {
        dbRef.child(uid).get().then((snapshot) => {
            if (snapshot.exists()) {
                data = snapshot.val();
                resolve(checkUserActivityDate(data.lastOnline))
                // const lastOnline = DateTime.fromISO(data.lastOnline);
                // if(DateTime.now() > lastOnline.plus({days: 1})) {
                //     // Inactive account
                //     resolve(false)
                // } else {
                //     // Active account
                //     resolve(true)
                // }
            } else {
                printText("User does not exist");
                reject();
            }
        })
    }).catch((error) => {
        console.error(error);
    });
}

export const getAnyDataWithoutChild = (ref) => {
    let data
    const dbRef = getDatabaseRef(ref)
    return new Promise((resolve, reject) => {
        dbRef.get().then((snapshot) => {
            if (snapshot.exists()) {
                data = snapshot.val();
                //printText(ref + ":"  + " = " + JSON.stringify(data))
                resolve(data)
            } else {
                printText(ref + " does not exist");
                reject();
            }
        }).catch((error) => {
            console.error(error)
        })
    }).catch((error) => {
        console.error(error);
    });
}

export const getUserDatabaseRef = () => {
    const database = firebaseApp.database();
    return database.ref("users");
}

const getDatabaseRef = (ref) => {
    const database = firebaseApp.database();
    return database.ref(ref);
}
