import React, { useEffect, useState } from 'react';

import firebase from "firebase";
// Import instance of firebase app
import {
    firebaseApp,
    checkUserExists,
    registerNewUserToDatabase,
    addReferralToUser,
    checkUserExistsPromise
} from "../firebaseUtilities";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import {getRandomId, getUserName, newUserData} from "../userUtilities"
import {Box, Heading} from "@chakra-ui/react";
import {printText} from "../devUtilities";
import 'url-search-params-polyfill';


let referredBy;

const search = window.location.search; // could be '?foo=bar'
const params = new URLSearchParams(search);
const refId = params.get('uid');
printText("authcomponent refId is " + refId)

// Configure FirebaseUI.
const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    tosUrl: "/terms",
    privacyPolicyUrl: "/privacy",
    signInOptions: [
        {
            provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,

            //Display name is first and last name - we don't need them
            requireDisplayName: false,
        }
        // firebaseApp.auth.GoogleAuthProvider.PROVIDER_ID,
        // firebaseApp.auth.FacebookAuthProvider.PROVIDER_ID
    ],
    callbacks: {
        // Avoid redirects after sign-in.
        signInSuccessWithAuthResult: function(authResult, redirectUrl) {
            const user = authResult.user;
            const credential = authResult.credential;
            const isNewUser = authResult.additionalUserInfo.isNewUser;
            const providerId = authResult.additionalUserInfo.providerId;
            const operationType = authResult.operationType;

            printText("callback")
            printText(user)
            printText("isnewuser is " + user)

            // Write to realtime database if the user is new
            if(isNewUser) {
                registerNewUserToDatabase(user.uid, user.email, referredBy)
                printText("isnewuser true")
                printText("referredBy inside is " + referredBy)
                if(referredBy !== "none") {
                    // addReferralToUser(referredBy, user.uid)
                    const requestData = {
                        referredBy: referredBy,
                        referral: user.uid,
                    }
                    fetch("/addReferralToUser", {
                        method: "POST",
                        headers: {
                            "code": user.uid,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(requestData)
                    }).then(() => {
                        return false
                    })
                }
            }
            // Return type determines whether we continue the redirect
            // automatically or whether we leave that to developer to handle.
            return false;
        }
    },
};

function SignInScreen() {
    const [isSignedIn, setIsSignedIn] = useState(false); // Local signed-in state.

    // if(props.uid !== undefined && checkUserExists(props.uid)) {
    //     referredBy = props.uid;
    // } else {
    //     referredBy = "none";
    // }

    // if(refId !== null && checkUserExists(refId)) {
    //     referredBy = refId;
    // } else {
    //     referredBy = "none";
    // }
    if(refId !== null) {
        checkUserExists(refId).then((result) => {
            if (result) {
                referredBy = refId
            } else {
                referredBy = "none"
            }
        })
    }
    printText("referredBy in function is " + refId)

    firebaseApp.auth().onAuthStateChanged((user) => {
        if (user) {
            // User logged in already or has just logged in.
            printText(user.uid);
        } else {
            // User not logged in or has just logged out.
        }
    });


    // Listen to the Firebase Auth state and set the local state.
    useEffect(() => {
        const unregisterAuthObserver = firebaseApp.auth().onAuthStateChanged(user => {
            setIsSignedIn(!!user);
        });
        return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
    }, []);

    if (!isSignedIn) {
        return (
            <Box>
                <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebaseApp.auth()}/>
            </Box>
        );
    }
    return (
        <Box>
            <p>Welcome {firebaseApp.auth().currentUser.displayName}! You are now signed-in!</p>
            <a onClick={() => firebaseApp.auth().signOut()}>Sign-out</a>
        </Box>
    );
}

export default SignInScreen;