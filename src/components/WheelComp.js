import React, {useEffect, useState, useRef} from 'react';
import {Wheel} from 'react-custom-roulette';
import { useDencrypt } from "use-dencrypt-effect";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




import {
    addJackpotEntry,
    authLogout,
    firebaseApp,
    getUserData,
    initiateRaffle,
    setUserAdblock,
    getJackpotData,
    getMockupAdData
} from "../firebaseUtilities";
import {
    Alert, AlertIcon,
    Box,
    Button,
    Center,
    CircularProgress,
    Container,
    Flex,
    IconButton,
    Image,
    Link,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Spacer,
    Text,
    useDisclosure,
    Heading,
    Icon,
    SlideFade,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr
} from "@chakra-ui/react"
import {HamburgerIcon} from '@chakra-ui/icons'
import {Link as ReactLink, useHistory} from "react-router-dom";
import Jackpot from './Jackpot';

import RefillTimer from './RefillTimer';
import {useDetectAdBlock} from "adblock-detect-react";
import {
    AiOutlineClockCircle,
    BiDownArrow,
    GiAbstract102,
    BiSupport,
    FaUserAlt,
    FaUserPlus,
    FaUsers,
    FiExternalLink,
    GiCarWheel,
    ImSpinner9,
    ImTicket,
    MdCreditCard,
    RiLogoutBoxFill,
    RiSafeFill,
    SiJsonwebtokens,
    GiSpeaker,
    GiSpeakerOff,
    MdLocalOffer, WiMoonAltNew
} from "react-icons/all";
import {printText} from "../devUtilities";
import preval from "preval.macro";
import '../styles/solarFlare.css';
import {VFXImg, VFXProvider} from "react-vfx";
import {DateTime} from "luxon";
import Countdown from "react-countdown";
import useSound from 'use-sound';

import glitchSound from '../styles/sounds/glitchEffect.mp3';



const data = [
  { option: 'Empty', style: { textColor: '#A22F2F'}},
  { option: 'Cash' , style: { textColor: '#55A726'}},
  { option: 'Token' , style: { textColor: '#F8D62F'}},
  { option: 'Empty', style: { textColor: '#A22F2F'}},
  { option: 'Cash' , style: { textColor: '#55A726'}},
  { option: 'Empty', style: { textColor: '#A22F2F'}},
  { option: 'Ticket', style: { textColor: '#D22576'}},
  { option: 'Cash' , style: { textColor: '#55A726'}},
  { option: 'Empty', style: { textColor: '#A22F2F'}},
  { option: 'Token' , style: { textColor: '#F8D62F'}},
  { option: 'Glitch' , style: { textColor: '#9031A4'}},
];



const options = {
interval: 1
}

var localToastAds = []

const backgroundColors = ['#9E2E8A', '#E547C9'];
const textColors = ['#eeeeee'];
const outerBorderColor = 'black';
const outerBorderWidth = 5;
const innerBorderColor = '#eeeeee';
const innerBorderWidth = 0;
const innerRadius = 0;
const radiusLineColor = 'black';
const radiusLineWidth = 1;
const fontSize = 25;
const textDistance = 60;

let postSpinModalMessage = (
  <h1>Message Template</h1>
)

let postSpinGlitchedMessage = "Glitch Example"

let prizeIsEmpty = false


// Modal.setAppElement('#root')


export default function WheelComp({userData, userId}) {


    const [mustSpin, setMustSpin] = useState(false)
    const [prize, setPrize] = useState()
    const [postSpinModalIsOpen, setPostSpinModalIsOpen] = useState(false)
    const [addGoldModalIsOpen, setAddGoldModalIsOpen] = useState(false)
    const [prizeCash, setPrizeCash] = useState(0.0)
    const [myCash, setMyCash] = useState(0.0)
    const [myGold, setMyGold] = useState(0)
    const [dataIsFetched, setDataIsFetched] = useState(false)
    const [jackpotData, setJackpotData] = useState({})

    const {isGoldModalOpen, onGoldModalOpen, onGoldModalClose} = useDisclosure()

    const adBlockDetected = useDetectAdBlock();
    let [animationTrigger, setAnimationTrigger] = useState(0)

    const [prizeNumberFromComp, setPrizeNumberFromComp] = useState({value: 0, type: 0})

    const sendPrizeNumberToParent = (prizeNum) => {
      setPrizeNumberFromComp(prizeNum)
    }
    const [initialFetchHappened, setInitialFetchHappened] = useState(false)
    const [myUserData, setMyUserData] = useState({})
    const [showAccountMessage, setShowAccountMessage] = useState(false)

    const [playGlitch] = useSound(glitchSound)

    const { result, dencrypt } = useDencrypt(options)

    const [bottomBannersSrcs, setBottomBannersSrcs] = useState([{
      href: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Youtube_loading_symbol_1_(wobbly).gif",
      src: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Youtube_loading_symbol_1_(wobbly).gif"
    },
    {
      href: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Youtube_loading_symbol_1_(wobbly).gif",
      src: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Youtube_loading_symbol_1_(wobbly).gif"
    },
    {
      href: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Youtube_loading_symbol_1_(wobbly).gif",
      src: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Youtube_loading_symbol_1_(wobbly).gif"
    },
    {
      href: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Youtube_loading_symbol_1_(wobbly).gif",
      src: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Youtube_loading_symbol_1_(wobbly).gif"
    }])

    const [toastAd, setToastAd] = useState({
      text: "Do this and earn EASY $100!",
      href: "http://fumacrom.com/2962T"
    })

    const [speakerOn, setSpeakerOn] = useState(true)





    // This block is also present in Header.js
    // Don't forget to work on them both (or find a solution for duplicate code)
    const history = useHistory()
    const logoutClick = () => {
        authLogout().then(r => {
            history.push("/")
        })
    }


    useEffect(() => {

      handleGlitchChange("Reset")

      prizeIsEmpty = false

      if(prizeNumberFromComp.type == 0 || prizeNumberFromComp.type == 3 || prizeNumberFromComp.type == 5 || prizeNumberFromComp.type == 8) {

        postSpinGlitchedMessage = "Sorry, you couldn't earn anything."

        prizeIsEmpty = true
      } else if (prizeNumberFromComp.type == 1 || prizeNumberFromComp.type == 4 || prizeNumberFromComp.type == 7) {

        postSpinGlitchedMessage = "You earned $" + prizeNumberFromComp.value + "!"

      } else if (prizeNumberFromComp.type == 6) {

        postSpinGlitchedMessage = "You earned a ticket!"

      } else if (prizeNumberFromComp.type == 10 && prizeNumberFromComp.value == 999) {

        postSpinGlitchedMessage = "You've earned 1000 tickets!"

      } else if (prizeNumberFromComp.type == 10) {

        postSpinGlitchedMessage = "You've found a joker! Find three jokers in a row and earn 1000 tickets."

      } else if (prizeNumberFromComp.type == 2 || prizeNumberFromComp.type == 9) {

        postSpinGlitchedMessage = "You earned " + prizeNumberFromComp.value + " tokens!"

      } else if (prizeNumberFromComp.type == -1 && prizeNumberFromComp.value == -1) {

        postSpinGlitchedMessage = "There was a problem with the server."


      } else if (prizeNumberFromComp.type == -2) {

        postSpinGlitchedMessage = "An error has occurred. Try refreshing the page and spinning again."

      } else if (prizeNumberFromComp.type == -3) {

        postSpinGlitchedMessage = "You can't spin more than one wheel at a time."

      }

      options.interval = 280 / postSpinGlitchedMessage.length



    }, [prizeNumberFromComp]);



    useEffect(() => {

        if(!initialFetchHappened) {

          // fetchMockupAdSources()
          updateCashAndCoin()
          fetchJackpotAndUserData()

          setInitialFetchHappened(true)

          setUserAdblock(userId, adBlockDetected)
          printText("adblock detected? : " + adBlockDetected)
        }


        firebaseApp.auth().onAuthStateChanged((user) => {
            if (user) {

            } else {
                history.push("/")
            }
        })

    }, [userData, userId]);





    // useEffect(() => {
    //
    //   const toastInterval = setInterval(() => {
    //     notifyAds()
    //   }, 5000)
    //
    //   return () => clearInterval(toastInterval);
    //
    //
    // }, []);

    const [width, setWidth] = useState(window.innerWidth);

    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }

    const [isScriptsAdded, setIsScriptsAdded] = useState(false)

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    },[isScriptsAdded])

    let isMobile = (width <= 768)


    const updateCashAndCoin = () => {


        getUserData(userId).then((data) => {

            let tempUserData = data
            // setMyCash(tempUserData.balance)
            setMyCash(parseFloat(tempUserData.balance.toFixed(2)))
            setMyGold(tempUserData.coins)
            setMyUserData(tempUserData)
            if(tempUserData.hasOwnProperty("accountMessage")) {
                setShowAccountMessage(tempUserData.accountMessage !== 0 && tempUserData.accountMessage !== "none")
            }
            setDataIsFetched(true)
        })

    }

    const fetchJackpotAndUserData = () => {
        getJackpotData().then((data) => {
            setJackpotData(data)
        })
      }

      const fetchMockupAdSources = () => {

        getMockupAdData().then((data) => {

          var localTopBanners = []
          var localBottomBanners = []


          Object.values(data.topBanners).forEach(val => {
            localTopBanners.push(val)
          })

          Object.values(data.bottomBoxes).forEach(val => {
            localBottomBanners.push(val)
          })

          Object.values(data.toastAds).forEach(val => {
            localToastAds.push(val)
          })

          var shuffledBottomBanners = [...localBottomBanners].sort(() => 0.5 - Math.random())
          var shuffledToastAds = [...localToastAds].sort(() => 0.5 - Math.random())

          var bottomBannersToBeUsed = shuffledBottomBanners.slice(0, 4)

          if(bottomBannersToBeUsed != undefined) setBottomBannersSrcs(bottomBannersToBeUsed)
          if(shuffledToastAds.length > 0) setToastAd(shuffledToastAds[0])


        }).catch((err) => {
            window.location.reload()
        })


      }


    const [message, setMessage] = useState("")
    const [messageType, setMessageType] = useState("warning")

    const sendEmail = () => {
        firebaseApp.auth().currentUser.sendEmailVerification().then(() => {
           setMessageType("info")
            setMessage("Verification email sent.")
        })
    }





    const spinTheWheel = () => {




        // setAnimationTrigger(++animationTrigger)

        //Backend no longer accepts uid query, URLSearchParams can be deleted later
        if (myGold > 0) {

                    setMustSpin(true)

        } else {
            openAddGoldModal()
        }



    }

    const handleGlitchChange = newMessage => {
      dencrypt(newMessage)
    }

    const notifyAds = () => {


      var toastDelayRandomizerMs = Math.floor((Math.random() * 5) + 1) * 1000
      var toastRandomizer = Math.floor(Math.random() * localToastAds.length)
      if(localToastAds[toastRandomizer] != undefined) setToastAd(localToastAds[toastRandomizer])


      toast(toastAd.text)


    }

    const toggleSpeaker = () => {
      if (speakerOn) {
        setSpeakerOn(false)
      } else {
        setSpeakerOn(true)
      }
    }

    function openPostSpinModal() {



        if(!prizeIsEmpty) {
          setPostSpinModalIsOpen(true);
          handleGlitchChange(postSpinGlitchedMessage)
          if(speakerOn) playGlitch()
        }
        setMyUserData(userData)
        setMustSpin(false);
        updateCashAndCoin() //coin and cash (in DOM) must get updated when the spin stops so the user does not see the spin result immediately
    }

    function closePostSpinModal() {
        setPostSpinModalIsOpen(false);

    }

    function openAddGoldModal() {
        setAddGoldModalIsOpen(true);


    }

    function closeAddGoldModal() {
        setAddGoldModalIsOpen(false);

    }




    return (
        <Box>


            {/*Header start*/}
            <Box>
                <Flex direction="column" justify="center">
                    <Center margin="2%">
                        <Image w={800} mt={12} mb={1} src="/assets/logo_en.png"/>
                    </Center>
                    <Flex direction={["column", "column", "column", "row"]} my={[0, 0, 0, 10]}
                          alignItems={["center", ""]}>
                        <Spacer/>
                        <Link as={ReactLink} to="/dashboard" my={[2, 3, 3, 0]}>
                            <Button leftIcon={<GiCarWheel/>} px={8} borderRadius="0px" bg="brand.dark"
                                    boxShadow="0 0 8px #fff"
                                    color="white" variant="outline"
                                // borderColor={location.pathname === "/dashboard" ? "white" : "brand.blue1"}
                                    className="neonBlueHeaderActive"
                                    _hover={{color: "white", borderColor: "white", boxShadow: "0 0 8px #fff"}}
                                    _active={{transform: "scale(0.98)"}}
                                    _focus={{}}>
                                WHEEL
                            </Button>
                        </Link>
                        {/*<Link as={ReactLink} to="/offers" marginLeft={[0, 0, 0, "3%"]} my={[2, 3, 3, 0]}>*/}
                        {/*    <Button leftIcon={<MdLocalOffer/>} px={8} borderRadius="20px" bg="brand.dark"*/}
                        {/*            boxShadow="0 0 10px rgba(15, 155, 242, 0.4)"*/}
                        {/*            color="yellow" variant="outline"*/}
                        {/*            className="neonBlueHeader"*/}
                        {/*            _hover={{color: "white", borderColor: "white", boxShadow: "0 0 8px #fff"}}*/}
                        {/*            _active={{transform: "scale(0.98)"}}*/}
                        {/*            _focus={{}}>*/}
                        {/*        OFFERS <Icon as={WiMoonAltNew} className="blinkingBox" ml={1} color="red"/>*/}
                        {/*    </Button>*/}
                        {/*</Link>*/}
                        <Link as={ReactLink} to="/referral" marginLeft={[0, 0, 0, "3%"]} my={[2, 3, 3, 0]}>
                            <Button leftIcon={<FaUserPlus/>} px={8} borderRadius="0px" bg="brand.dark"
                                    boxShadow="0 0 10px rgba(15, 155, 242, 0.4)"
                                    color="brand.blue1" variant="outline"
                                    className="neonBlueHeader"
                                    _hover={{color: "white", borderColor: "white", boxShadow: "0 0 8px #fff"}}
                                    _active={{transform: "scale(0.98)"}}
                                    _focus={{}}>
                                REFERRALS
                            </Button>
                        </Link>
                        <Link as={ReactLink} to="/crew" marginLeft={[0, 0, 0, "3%"]} my={[2, 3, 3, 0]}>
                            <Button leftIcon={<FaUsers/>} px={8} borderRadius="0px" bg="brand.dark"
                                    boxShadow="0 0 10px rgba(15, 155, 242, 0.4)"
                                    color="brand.blue1" variant="outline"
                                    className="neonBlueHeader"
                                    _hover={{color: "white", borderColor: "white", boxShadow: "0 0 8px #fff"}}
                                    _active={{transform: "scale(0.98)"}}
                                    _focus={{}}>
                                CREW
                            </Button>
                        </Link>
                        <Link as={ReactLink} to="/websites" marginLeft={[0, 0, 0, "3%"]} my={[2, 3, 3, 0]}>
                            <Button leftIcon={<FiExternalLink/>} px={8} borderRadius="0px" bg="brand.dark"
                                    boxShadow="0 0 10px rgba(15, 155, 242, 0.4)"
                                    color="brand.blue1" variant="outline"
                                    className="neonBlueHeader"
                                    _hover={{color: "white", borderColor: "white", boxShadow: "0 0 8px #fff"}}
                                    _active={{transform: "scale(0.98)"}}
                                    _focus={{}}>
                                LINKS
                            </Button>
                        </Link>
                        <Link as={ReactLink} to="/jackpot" marginLeft={[0, 0, 0, "3%"]} my={[2, 3, 3, 0]}>
                            <Button leftIcon={<ImTicket/>} px={8} borderRadius="0px" bg="brand.dark"
                                    boxShadow="0 0 10px rgba(15, 155, 242, 0.4)"
                                    color="brand.blue1" variant="outline"
                                // borderColor={location.pathname === "/jackpot" ? "white" : "brand.blue1"}
                                    className="neonBlueHeader"
                                    _hover={{color: "white", borderColor: "white", boxShadow: "0 0 8px #fff"}}
                                    _active={{transform: "scale(0.98)"}}
                                    _focus={{}}>
                                JACKPOT
                            </Button>
                        </Link>
                        <Spacer/>
                        <Menu closeOnSelect my={[2, 3, 3, 0]}>
                            <MenuButton
                                as={IconButton}
                                icon={<HamburgerIcon/>}
                                boxShadow="0 0 10px rgba(15, 155, 242, 0.4)"
                                className="neonBlueHeader" bg="brand.dark"
                                color="brand.blue1" variant="outline" borderColor="brand.blue1" borderRadius="0px"
                                _hover={{color: "white", borderColor: "white", boxShadow: "0 0 8px #fff"}}
                                _focus={{}}
                                _active={{color: "white", borderColor: "white"}}
                            />
                            <MenuList bg="brand.sky" borderColor="brand.blue1" borderRadius="0px"
                                      boxShadow="0 0 10px rgba(15, 155, 242, 0.4)"
                                      className="neonBlueHeader"
                                      _hover={{borderColor: "white", textColor: "white", boxShadow: "0 0 8px #fff"}}>

                                <MenuItem as={ReactLink} to="/profile" icon={<FaUserAlt size={15}/>} borderWidth="1px"
                                          borderColor="transparent"
                                          _focus={{}} _active={{}}
                                          _hover={{
                                              background: "transparent",
                                              border: "1px solid white",
                                              boxShadow: "0 0 8px #fff"
                                          }}>
                                    Profile
                                </MenuItem>

                                {/*<MenuItem as={ReactLink} to="/vipstatus" icon={<RiVipFill size={20}/>} borderWidth="1px"*/}
                                {/*          borderColor="transparent"*/}
                                {/*          _focus={{}} _active={{}}*/}
                                {/*          _hover={{*/}
                                {/*              background: "transparent",*/}
                                {/*              border: "1px solid white",*/}
                                {/*              boxShadow: "0 0 8px #fff"*/}
                                {/*          }}>*/}
                                {/*    VIP Status*/}
                                {/*</MenuItem>*/}

                                <MenuItem as={ReactLink} to="/cashier" icon={<RiSafeFill size={20}/>} borderWidth="1px"
                                          borderColor="transparent"
                                          _focus={{}} _active={{}}
                                          _hover={{
                                              background: "transparent",
                                              border: "1px solid white",
                                              boxShadow: "0 0 8px #fff"
                                          }}>
                                    Cashier
                                </MenuItem>

                                <MenuItem as={ReactLink} to="/support" icon={<BiSupport size={20}/>} borderWidth="1px"
                                          borderColor="transparent"
                                          _focus={{}} _active={{}}
                                          _hover={{
                                              background: "transparent",
                                              border: "1px solid white",
                                              boxShadow: "0 0 8px #fff"
                                          }}>
                                    Support
                                </MenuItem>

                                <MenuItem onClick={logoutClick} icon={<RiLogoutBoxFill size={20}/>} borderWidth="1px"
                                          borderColor="transparent"
                                          _hover={{
                                              background: "transparent",
                                              border: "1px solid white",
                                              boxShadow: "0 0 8px #fff"
                                          }} _active={{}}
                                          _focus={{}}>Logout</MenuItem>

                                {userId === "krs6jGkIgXO0Lgrfp2BEwSBnh3j1" &&
                                <MenuItem borderWidth="1px"
                                          borderColor="transparent"
                                          _hover={{
                                              background: "transparent",
                                              border: "1px solid white",
                                              boxShadow: "0 0 8px #fff"
                                          }} _active={{}}
                                          _focus={{}}>Build Date: {preval`module.exports = new Date().toLocaleString();`}</MenuItem>
                                }

                            </MenuList>
                        </Menu>
                    </Flex>
                    <Flex direction="row" pb={6} className="contentContainer" mx={[2, 0]} mt={[2, 0]}>
                        <Link as={ReactLink} to="/refill" mt={-1} ml={-1}>
                            <Button variant="outline" bg="transparent" leftIcon={<SiJsonwebtokens size={35}/>}
                                    borderRadius="0px"
                                // boxShadow="-2px -2px rgba(255, 255, 255, 0.4)"
                                    _hover={{
                                        borderColor: "brand.purple",
                                        color: "brand.purple",
                                        boxShadow: "-4px -4px rgba(95, 32, 91, 0.4)"
                                    }}
                                    _active={{transform: "scale(0.98)"}}
                                    _focus={{}} size="lg" px={[2, 6]} py={8}
                                // className="neonLeftTopBox"
                                    borderTop="4px solid white" borderLeft="4px solid white"
                                    border="transparent">
                                {!dataIsFetched ? <Center m={4}>
                                        <CircularProgress isIndeterminate color="white" size="50px" trackColor="brand.sky"/></Center>
                                    : <Box>
                                        <Text fontSize="3xl">{myGold} TOKENS</Text>
                                        <RefillTimer userData={userData}/></Box>}
                            </Button>
                        </Link>
                        <Spacer/>
                        <Link as={ReactLink} to="/cashier" mt={-1} mr={-1}>
                            <Button variant="outline" leftIcon={<MdCreditCard size={40}/>} borderRadius="0px"
                                // boxShadow="2px -2px rgba(255, 255, 255, 0.4)"
                                    _hover={{
                                        borderColor: "brand.purple",
                                        color: "brand.purple",
                                        boxShadow: "4px -4px rgba(95, 32, 91, 0.4)"
                                    }}
                                    _active={{transform: "scale(0.98)"}}
                                    _focus={{}} size="lg" px={[2, 6]} py={8}
                                // className="neonRightTopBox"
                                    borderTop="4px solid white" borderRight="4px solid white"
                                    border="transparent">
                                {!dataIsFetched ? <Center m={4}>
                                        <CircularProgress isIndeterminate color="white" size="50px" trackColor="brand.sky"/></Center>
                                    :
                                    <Text fontSize="3xl">${myCash}</Text>}
                            </Button>
                        </Link>
                    </Flex>
                </Flex>
                {showAccountMessage && <Alert status={myUserData.accountMessageType}
                       color="white" bg="brand.orange" fontSize="xl" alignItems="center" justifyContent="center">
                    <AlertIcon color="white"/>
                    <Text textAlign="center" fontWeight="bold">{myUserData.accountMessage}</Text>
                </Alert>}
            </Box>




            <Box className="contentContainer" mx={[2, 0]} key={animationTrigger} >

              {speakerOn ?

                  <Icon ml="5" cursor="pointer" onClick={toggleSpeaker} as={GiSpeaker} w={14} h={14} color="white"
                _hover={{ color: "brand.purple" }}
                />



                :
                <Icon ml="5" cursor="pointer" onClick={toggleSpeaker} as={GiSpeakerOff} w={14} h={14} color="white"
                  _hover={{ color: "brand.purple" }}
                  />

              }




                {!firebaseApp.auth().currentUser.emailVerified &&
                    <Box>
                        <Alert status={messageType} color="white" bg="brand.orange" fontSize="lg"
                               alignItems="center" justifyContent="center">
                            <AlertIcon color="white"/>
                            {message === "" ? <Text>You have not verified your email yet.
                                <Link onClick={sendEmail}> Click here to send verification email.
                                </Link></Text> : <Text>{message}</Text>}
                        </Alert>
                    </Box>
                }
                <Center>
                  <Container maxW="80rem" centerContent mx={4} pt={10} mb={10}>
                      {!isMobile &&
                    [!firebaseApp.auth().currentUser.emailVerified ?
                      <div id="ui" style={{top: "52%"}}>
                    <div className="sun">
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_fire">
                            <div className="sun_fire_inner"></div>
                        </div>
                        <div className="sun_border"></div>
                    </div>
                    <div className="cover"></div>
                </div>
                :
                <div id="ui" >
              <div className="sun">
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_fire">
                      <div className="sun_fire_inner"></div>
                  </div>
                  <div className="sun_border"></div>
              </div>
              <div className="cover"></div>
          </div>
        ]
                      }


                      <Box onClick={spinTheWheel} className="wheelContainer" opacity="1.0">

                        <Wheel
                            mustStartSpinning={mustSpin}
                            prizeNumber={6}
                            onStopSpinning={openPostSpinModal}
                            data={data}
                            backgroundColors={['#3e3e3e', '#df3428']}
                            textColors={['#ffffff']}
                            sendPrizeNumToParent={sendPrizeNumberToParent}
                            userId={userId}
                            backgroundColors={backgroundColors}
                            textColors={textColors}
                            fontSize={fontSize}
                            outerBorderColor={outerBorderColor}
                            outerBorderWidth={outerBorderWidth}
                            innerRadius={innerRadius}
                            innerBorderColor={innerBorderColor}
                            innerBorderWidth={innerBorderWidth}
                            radiusLineColor={radiusLineColor}
                            radiusLineWidth={radiusLineWidth}
                            textDistance={textDistance}
                        />

                      </Box>


                      <Button onClick={() => spinTheWheel()}
                              variant="outline" bg="transparent"
                              boxShadow="0 0 10px rgba(255, 255, 255, 0.4)"
                              leftIcon={<ImSpinner9/>}
                              my={10} borderRadius="0px"
                              _hover={{
                                  color: "brand.purple",
                                  borderColor: "brand.purple",
                                  boxShadow: "0 0 10px rgba(95, 32, 91, 0.4)"
                              }}
                              _active={{transform: "scale(0.98)"}}
                              size="lg">SPIN</Button>

                  </Container>
                </Center>

                <Box className="contentContainer" mx={[2, 0]}>
                    <SlideFade in={true} offsetY="40px">
                        <Container maxW="500rem" centerContent>
                            <Heading mb={1}><Icon as={BiDownArrow} mx={[1, 10]} pb={1} w={9} h={9}/>
                                DAILY JACKPOT<Icon as={BiDownArrow} mx={[1, 10]} pb={1} w={9} h={9}/></Heading>

                        </Container>
                    </SlideFade>
                    {!initialFetchHappened ? <Center mx={4} mt={4}>
                            <CircularProgress isIndeterminate color="brand.blue1" size="50px" trackColor="brand.sky"/></Center>
                        :

                        <div>
                          <SlideFade in={initialFetchHappened} offsetY="40px">
                              <Box mt={0} mx={[0, 10]}>
                                  <Table borderColor="brand.blue1" boxShadow="0 0 10px rgba(15, 155, 242, 0.4)"
                                         borderWidth="2px"
                                         mt={5} variant="unstyled">
                                      <Thead>
                                          <Tr>
                                              <Th fontSize={["lg", "3xl"]} color="white" textAlign="center" px={[2, 5]} pt={8}>Your
                                                  Entries</Th>
                                              <Th fontSize={["lg", "3xl"]} color="white" textAlign="center" px={[2, 5]}
                                                  pt={8}>Jackpot</Th>
                                              <Th fontSize={["lg", "3xl"]} color="white" textAlign="center" px={[2, 5]} pt={8}>Time
                                                  Remaining</Th>
                                          </Tr>
                                      </Thead>
                                      <Tbody>
                                          <Tr textAlign="center">
                                              <Td fontSize={["lg", "3xl"]} textAlign="center">{myUserData.tickets} <Icon
                                                  as={ImTicket} mr={3} pb={1}/></Td>
                                              <Td fontSize={["lg", "3xl"]} textAlign="center">${jackpotData.prize}</Td>
                                              <Td fontSize={["lg", "3xl"]} textAlign="center"><Icon as={AiOutlineClockCircle}
                                                                                                    mr={3} pb={1}/><Countdown
                                                  date={DateTime.fromISO(jackpotData.drawDate)}
                                                  daysInHours/></Td>
                                          </Tr>
                                          <Tr>
                                              <Td/>
                                              <Td fontSize={["lg", "3xl"]} textAlign="center"
                                                  fontWeight="bold">JOKERS: {myUserData.jokerStreak}/3 <Icon
                                                  as={GiAbstract102}/></Td>
                                              <Td/>
                                          </Tr>
                                      </Tbody>
                                  </Table>






                              </Box>
                          </SlideFade>

                          {/*<Center mt="10">*/}
                          {/*  <Flex direction="row" justifyContent="spaceEvenly">*/}
                          {/*    <a href={bottomBannersSrcs[0].href}*/}
                          {/*      target="_blank"*/}

                          {/*      >*/}
                          {/*      <Image*/}

                          {/*         width="250px"*/}
                          {/*         height="250px"*/}
                          {/*         objectFit="fill"*/}
                          {/*         src={bottomBannersSrcs[0].src}*/}
                          {/*         m="3"*/}
                          {/*       />*/}
                          {/*   </a>*/}

                          {/*   <a href={bottomBannersSrcs[1].href}*/}
                          {/*     target="_blank"*/}
                          {/*     >*/}
                          {/*     <Image*/}

                          {/*         width="250px"*/}
                          {/*         height="250px"*/}
                          {/*        objectFit="fill"*/}
                          {/*        src={bottomBannersSrcs[1].src}*/}
                          {/*        m="3"*/}
                          {/*      />*/}
                          {/*  </a>*/}

                          {/*  <a href={bottomBannersSrcs[2].href}*/}
                          {/*    target="_blank"*/}
                          {/*    >*/}
                          {/*    <Image*/}

                          {/*       width="250px"*/}
                          {/*       height="250px"*/}
                          {/*       objectFit="fill"*/}
                          {/*       src={bottomBannersSrcs[2].src}*/}
                          {/*       m="3"*/}
                          {/*     />*/}
                          {/* </a>*/}

                          {/* <a href={bottomBannersSrcs[3].href}*/}
                          {/*   target="_blank"*/}
                          {/*   >*/}
                          {/*   <Image*/}

                          {/*      width="250px"*/}
                          {/*      height="250px"*/}
                          {/*      objectFit="fill"*/}
                          {/*      src={bottomBannersSrcs[3].src}*/}
                          {/*      m="3"*/}
                          {/*    />*/}
                          {/*</a>*/}

                          {/*  </Flex>*/}


                          {/*</Center>*/}

                        </div>




                    }



                    {/*<button onClick={() => getJackpotData()}>GET JACKPOT DATA</button>*/}
                </Box>

            </Box>

            <Modal
                isOpen={postSpinModalIsOpen}
                onRequestClose={closePostSpinModal}
                isCentered
                motionPreset="slideInBottom"
                size="lg"
            >
                <ModalOverlay/>
                <ModalContent background="brand.sky" fontSize="2xl"
                              boxShadow="0 0 4px #fff, 0 0 11px #fff, 0 0 19px #0F9BF2, 0 0 40px #0F9BF2, 0 0 80px #0F9BF2,
                    inset 0 0 4px #fff, inset 0 0 11px #fff, inset 0 0 19px #0F9BF2;"
                              pt={4} pb={6} px={4}>
                    <ModalBody>


                          <Center>
                            {result}
                          </Center>

                          <div></div>

                          <Center>

                              <Button onClick={closePostSpinModal} px={8} borderRadius="0px"
                                      boxShadow="0 0 10px rgba(15, 155, 242, 0.4)"
                                      color="brand.blue1" variant="outline"
                                      _hover={{color: "white", borderColor: "white", boxShadow: "0 0 8px #fff"}}
                                      _active={{transform: "scale(0.98)"}}
                                      _focus={{}}>
                                  CLOSE
                              </Button>
                          </Center>







                    </ModalBody>
                </ModalContent>
            </Modal>

            <Modal
                isOpen={addGoldModalIsOpen}
                onRequestClose={closeAddGoldModal}
                isCentered
                motionPreset="slideInBottom"
                size="lg"
            >
                <ModalOverlay/>
                <ModalContent  background="brand.sky" fontSize="2xl"
                              boxShadow="0 0 4px #fff, 0 0 11px #fff, 0 0 19px #0F9BF2, 0 0 40px #0F9BF2, 0 0 80px #0F9BF2,
                    inset 0 0 4px #fff, inset 0 0 11px #fff, inset 0 0 19px #0F9BF2;"
                              pt={4} pb={6} px={4}>




                    <ModalHeader  fontSize="4xl">OUT OF TOKENS!</ModalHeader>
                    <ModalBody >

                        <Text fontSize="2xl" color="black.500">
                            You're all out of tokens...
                        </Text>

                        <Text fontSize="2xl" color="black.500">
                            Check out these ways to get some more and continue playing!
                        </Text>

                        <Flex direction="row" justify="center" mt={4}>
                          <Link as={ReactLink} to="/refill">
                              <Button px={8} borderRadius="0px"
                                      boxShadow="0 0 10px rgba(15, 155, 242, 0.4)"
                                      color="brand.blue1" variant="outline"
                                      _hover={{color: "white", borderColor: "white", boxShadow: "0 0 8px #fff"}}
                                      _active={{transform: "scale(0.98)"}}
                                      _focus={{}}>
                                  Free Refills
                              </Button>
                          </Link>
                          <Link as={ReactLink} to="/referral">
                              <Button px={8} borderRadius="0px"
                                      boxShadow="0 0 10px rgba(15, 155, 242, 0.4)"
                                      color="brand.blue1" variant="outline"
                                      _hover={{color: "white", borderColor: "white", boxShadow: "0 0 8px #fff"}}
                                      _active={{transform: "scale(0.98)"}}
                                      _focus={{}}>
                                  Referrals
                              </Button>
                          </Link>
                          <Link as={ReactLink} to="/crew">
                              <Button px={8} borderRadius="0px"
                                      boxShadow="0 0 10px rgba(15, 155, 242, 0.4)"
                                      color="brand.blue1" variant="outline"
                                      _hover={{color: "white", borderColor: "white", boxShadow: "0 0 8px #fff"}}
                                      _active={{transform: "scale(0.98)"}}
                                      _focus={{}}>
                                  Crew
                              </Button>
                          </Link>
                          <Link as={ReactLink} to="/offers">
                              <Button px={8} borderRadius="0px"
                                      boxShadow="0 0 10px rgba(15, 155, 242, 0.4)"
                                      color="brand.blue1" variant="outline"
                                      _hover={{color: "white", borderColor: "white", boxShadow: "0 0 8px #fff"}}
                                      _active={{transform: "scale(0.98)"}}
                                      _focus={{}}>
                                  Offers
                              </Button>
                          </Link>

                        </Flex>


                        <Center>

                            <Button mt={4} onClick={closeAddGoldModal} px={8} borderRadius="0px"
                                    boxShadow="0 0 10px rgba(15, 155, 242, 0.4)"
                                    color="brand.blue1" variant="outline"
                                    _hover={{color: "white", borderColor: "white", boxShadow: "0 0 8px #fff"}}
                                    _active={{transform: "scale(0.98)"}}
                                    _focus={{}}>
                                CLOSE
                            </Button>
                        </Center>

                    </ModalBody>


                </ModalContent>
            </Modal>
              <a
              href={toastAd.href}
              target="_blank"
              >
                  <ToastContainer
                    position="bottom-right"
                    autoClose={5000}
                    hideProgressBar={true}
                    newestOnTop={false}
                    limit={1}
                    closeOnClick
                    rtl={false}
                    draggable
                    >
                </ToastContainer>
              </a>




        </Box>
    );
}
