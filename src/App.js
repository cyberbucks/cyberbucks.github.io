import './styles/App.css';
import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Route, Switch, useLocation} from "react-router-dom";
import {firebaseApp, getUserData, getUserDatabaseRef, runLoginRoutine, setUserPush} from "./firebaseUtilities";

import WheelComp from './components/WheelComp';
import Home from "./components/landingPage/Home";
import About from './components/static/About';
import Faq from './components/static/Faq';
import Privacy from './components/static/Privacy';
import Terms from './components/static/Terms';
import Jackpot from './components/Jackpot';
import Refill from './components/Refill';
import Header from './components/Header';
import Websites from './components/Websites';
import Website from './components/Website';
import AddLink from './components/AddLink';
import Footer from './components/static/Footer';
import Profile from './components/Profile';
import Support from './components/static/Support';
import VipStatus from './components/static/VipStatus';
import Cashier from './components/Cashier';
import Crew from './components/Crew';
import Offers from './components/Offers';
import Referrals from "./components/Referrals";
import AdminPanel from "./components/adminPanel/AdminPanel";
import {
    Box,
    Button,
    Center,
    CircularProgress,
    CircularProgressLabel,
    Container,
    Flex,
    Spacer,
    Text,
    useToast
} from "@chakra-ui/react";
import NotFound from "./components/static/NotFound";
import {printText} from "./devUtilities";
import {CheckIcon, CloseIcon} from "@chakra-ui/icons";
import CookieConsent from "react-cookie-consent";
import FAuth from "./components/FAuth";
import Sweepstakes from "./components/Sweepstakes";
import SocialMediaEvent from "./components/SocialMediaEvent";


//We fetch the user's own data from this parent component, child components fetch any data they specifically need other than that


function App() {

    const [myUserData, setMyUserData] = useState({})
    const [dataIsFetched, setDataIsFetched] = useState(false)
    const [myUid, setMyUid] = useState()
    const [isScriptsAdded, setIsScriptsAdded] = useState(false)

    const toast = useToast()
    const toastIdRef = React.useRef()
    const confirmPush = (uid) => {
        firebaseApp.messaging().requestPermission().then()
        setUserPush(uid, true)
        if (toastIdRef.current) {
            toast.close(toastIdRef.current)
        }
    }

    const denyPush = (uid) => {
        setUserPush(uid, false)
        if (toastIdRef.current) {
            toast.close(toastIdRef.current)
        }
    }

    // let location = useLocation()

    // useEffect(() => {
    //     if(!isScriptsAdded) {
    //         if (window.location.href !== window.location.protocol + "//" + window.location.hostname + "/") {
    //             if (!isScriptsAdded) {
    //                 printText("additional scripts added")
    //                 var interstitialScript = document.createElement('script');
    //                 interstitialScript.async = true
    //                 interstitialScript.src = "https://upgulpinon.com/1?z=4579800";
    //                 document.head.appendChild(interstitialScript);
    //
    //                 var pushNotifScript = document.createElement('script');
    //                 pushNotifScript.async = true
    //                 pushNotifScript.src = "//itweepinbelltor.com/pfe/current/tag.min.js?z=4579804";
    //                 document.head.appendChild(pushNotifScript);
    //
    //                 var popUnderScript = document.createElement('script');
    //                 popUnderScript.text = "(function(s,u,z,p){s.src=u,s.setAttribute('data-zone',z),p.appendChild(s);})(document.createElement('script'),'https://iclickcdn.com/tag.min.js',4579795,document.body||document.documentElement)";
    //                 document.head.appendChild(popUnderScript);
    //
    //                 var inpagePushScript = document.createElement('script');
    //                 inpagePushScript.text = "(function(d,z,s){s.src='//'+d+'/400/'+z;try{(document.body||document.documentElement).appendChild(s)}catch(e){}})('rndhaunteran.com',4579745,document.createElement('script'))";
    //                 document.head.appendChild(inpagePushScript);
    //
    //                 setIsScriptsAdded(true)
    //             }
    //         }
    //     }
    // })

    useEffect(() => {

        let uid
        firebaseApp.auth().onAuthStateChanged((user) => {
            if (user) {
                // User logged in already or has just logged in.
                uid = user.uid;
                setMyUid(uid)
                if (!dataIsFetched) setDataIsFetched(true)

                // updateLastOnline(uid)
                // fetch("/updateUserObject", {headers: {code: uid}}).then(r => {
                //     printText("App.js: updateUserObject reponse: " + r.json().status)
                    runLoginRoutine(uid, user.emailVerified)
                // })
                getUserData(uid).then((data) => {
                    setMyUserData(data)
                    // if (!data.pushPrompted) {
                    //     toastIdRef.current = toast({
                    //         position: "bottom",
                    //         duration: null,
                    //         render: () => (
                    //             <Container centerContent color="white" p={4} bg="brand.dark" mb={3}
                    //                        border="2px solid white" width="100%">
                    //                 <Text fontSize="2xl">Receive Notifications to Never Miss An Event</Text>
                    //                 <Center>
                    //                     <Button onClick={() => confirmPush(uid)}
                    //                             variant="outline" bg="transparent"
                    //                             boxShadow="0 0 10px rgba(255, 255, 255, 0.4)"
                    //                             leftIcon={<CheckIcon/>}
                    //                             my={2} borderRadius="0px"
                    //                             _hover={{
                    //                                 color: "brand.purple",
                    //                                 borderColor: "brand.purple",
                    //                                 boxShadow: "0 0 10px rgba(95, 32, 91, 0.4)"
                    //                             }}
                    //                             _active={{transform: "scale(0.98)"}}
                    //                             size="md">YES</Button>
                    //                     <Button onClick={() => denyPush(uid)}
                    //                             variant="outline" bg="transparent" ml={10}
                    //                             boxShadow="0 0 10px rgba(255, 255, 255, 0.4)"
                    //                             leftIcon={<CloseIcon/>}
                    //                             my={2} borderRadius="0px"
                    //                             _hover={{
                    //                                 color: "brand.purple",
                    //                                 borderColor: "brand.purple",
                    //                                 boxShadow: "0 0 10px rgba(95, 32, 91, 0.4)"
                    //                             }}
                    //                             _active={{transform: "scale(0.98)"}}
                    //                             size="md">NO</Button></Center>
                    //             </Container>
                    //         ),
                    //     })
                    // }
                })
                getUserDatabaseRef().child(uid).on('value', (snapshot) => {
                    setMyUserData(snapshot.val())
                    printText("event fired")
                })

            } else {
                if (!dataIsFetched) setDataIsFetched(true)
                // User not logged in or has just logged out.
            }
        });

    }, []);


    return (
        <Box style={{
            backgroundColor: "brand.dark",
            overflow: "hidden",
            height: "100%",
            minHeight: "100%",
        }}>
            <Flex direction="column" justifyContent="space-between">

                {!dataIsFetched ? <Box style={{display: "flex", justifyContent: "center", height: "100%"}}>
                        <Flex direction="column">
                            <Spacer/>
                            <CircularProgress isIndeterminate color="brand.blue1" size={["400px", "600px"]} thickness="1px">
                                <CircularProgressLabel color="white">LOADING</CircularProgressLabel>
                            </CircularProgress>
                            <Spacer/>
                        </Flex>
                    </Box>
                    :
                    <Router>
                        <Switch>
                            <Route path="/dashboard">
                                <Box className="backgroundContainer">
                                    <Box width={["100%", "70%"]} margin="auto">
                                        <WheelComp userData={myUserData} userId={myUid}/>
                                        <Footer/>
                                    </Box>
                                </Box>
                            </Route>

                            <Route path="/jackpot">
                                <Box className="backgroundContainer">
                                    <Box width={["100%", "70%"]} margin="auto">
                                        <Header userData={myUserData} uid={myUid}/>
                                        <Jackpot userData={myUserData} isForDashboard={false}/>
                                        <Footer/>
                                    </Box>
                                </Box>
                            </Route>

                            <Route path="/profile">
                                <Box className="backgroundContainer">
                                    <Box width={["100%", "70%"]} margin="auto">
                                        <Header userData={myUserData} uid={myUid}/>
                                        <Profile userData={myUserData}/>
                                        <Footer/>
                                    </Box>
                                </Box>
                            </Route>

                            <Route path="/support">
                                <Box className="backgroundContainer">
                                    <Box width={["100%", "70%"]} margin="auto">
                                        <Header userData={myUserData} uid={myUid}/>
                                        <Support/>
                                        <Footer/>
                                    </Box>
                                </Box>
                            </Route>

                            <Route path="/vipstatus">
                                <Box className="backgroundContainer">
                                    <Box width={["100%", "70%"]} margin="auto">
                                        <Header userData={myUserData} uid={myUid}/>
                                        <VipStatus/>
                                        <Footer/>
                                    </Box>
                                </Box>
                            </Route>

                            <Route path="/cashier">
                                <Box className="backgroundContainer">
                                    <Box width={["100%", "70%"]} margin="auto">
                                        <Header userData={myUserData} uid={myUid}/>
                                        <Cashier userData={myUserData} userId={myUid}/>
                                        <Footer/>
                                    </Box>
                                </Box>
                            </Route>

                            <Route path="/refill">
                                <Box className="backgroundContainer">
                                    <Box width={["100%", "70%"]} margin="auto">
                                        <Header userData={myUserData} uid={myUid}/>
                                        <Refill userData={myUserData} userId={myUid}/>
                                        <Footer/>
                                    </Box>
                                </Box>
                            </Route>

                            <Route path="/referral">
                                <Box className="backgroundContainer">
                                    <Box width={["100%", "70%"]} margin="auto">
                                        <Header userData={myUserData} uid={myUid}/>
                                        <Referrals userData={myUserData} userId={myUid}/>
                                        <Footer/>
                                    </Box>
                                </Box>
                            </Route>

                            <Route path="/crew">
                                <Box className="backgroundContainer">
                                    <Box width={["100%", "70%"]} margin="auto">
                                        <Header userData={myUserData} uid={myUid}/>
                                        <Crew userData={myUserData} userId={myUid}/>
                                        <Footer/>
                                    </Box>
                                </Box>
                            </Route>

                            <Route path="/offers">
                                <Box className="backgroundContainer">
                                    <Box width={["100%", "70%"]} margin="auto">
                                        <Header userData={myUserData} uid={myUid}/>
                                        <Offers userData={myUserData} userId={myUid}/>
                                        <Footer/>
                                    </Box>
                                </Box>
                            </Route>

                            <Route path="/websites">
                                <Box className="backgroundContainer">
                                    <Box width={["100%", "70%"]} margin="auto">
                                        <Header userData={myUserData} uid={myUid}/>
                                        <Websites userData={myUserData}/>
                                        <Footer/>
                                    </Box>
                                </Box>
                            </Route>

                            <Route path="/website/:linkId">
                                <Box width="100rem" margin="auto">
                                    <Website userId={myUid}/>
                                    <Footer/>
                                </Box>
                            </Route>

                            <Route path="/websiteShow">
                                <Box width="100rem" margin="auto">
                                    <Website userId={myUid}/>
                                    <Footer/>
                                </Box>
                            </Route>

                            <Route path="/addlink">
                                <Box className="backgroundContainer">
                                    <Box width={["100%", "70%"]} margin="auto">
                                        <Header userData={myUserData} uid={myUid}/>
                                        <AddLink userId={myUid}/>
                                        <Footer/>
                                    </Box>
                                </Box>
                            </Route>

                            <Route path="/website/:linkId">
                                <Referrals userData={myUserData} userId={myUid}/>
                                <Footer/>
                            </Route>

                            <Route path="/adminon">
                                <AdminPanel userId={myUid}/>
                            </Route>

                            <Route path="/sweepstakes">
                                <Box className="backgroundContainer">
                                    <Box width={["100%", "70%"]} margin="auto">
                                        <Header userData={myUserData} uid={myUid}/>
                                        <Sweepstakes userData={myUserData} userId={myUid}/>
                                        <Footer/>
                                    </Box>
                                </Box>
                            </Route>

                            <Route path="/event">
                                <Box className="backgroundContainer">
                                    <Box width={["100%", "70%"]} margin="auto">
                                        <Header userData={myUserData} uid={myUid}/>
                                        <SocialMediaEvent/>
                                        <Footer/>
                                    </Box>
                                </Box>
                            </Route>

                            {/* Authentication is not needed for the routes below */}

                            <Route path="/auth">
                                <Box width={["100%", "70%"]} margin="auto">
                                    <FAuth/>
                                    <Footer/>
                                </Box>
                            </Route>

                            <Route path="/about">
                                <Box width={["100%", "70%"]} margin="auto">
                                    <About/>
                                    <Footer/>
                                </Box>
                            </Route>

                            <Route path="/faq">
                                <Box width={["100%", "70%"]} margin="auto">
                                    <Faq/>
                                    <Footer/>
                                </Box>
                            </Route>

                            <Route path="/privacy">
                                <Box width={["100%", "70%"]} margin="auto">
                                    <Privacy/>
                                    <Footer/>
                                </Box>
                            </Route>

                            <Route path="/terms">
                                <Box width={["100%", "70%"]} margin="auto">
                                    <Terms/>
                                    <Footer/>
                                </Box>
                            </Route>

                            <Route exact path={["/", "/home"]}>
                                <Home/>
                                <Box width={["100%", "70%"]} margin="auto">
                                    <Footer/>
                                </Box>
                            </Route>

                            <Route>
                                <NotFound/>
                                <Footer/>
                            </Route>

                        </Switch>
                    </Router>
                }
                <Spacer/>
            </Flex>
            <CookieConsent style={{ background: "#0F0422", boxShadow: "0 0 20px rgba(15, 155, 242, 1.0)"}}
                           buttonStyle={{ fontWeight: "bold", background: "#FFC233" }}>
                We use cookies to enhance your user experience and provide you better functionality.{" "}
            </CookieConsent>

        </Box>
    );
}

export default App;
