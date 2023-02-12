import React, {useEffect, useState} from 'react';
import '../styles/Header.css';
import {
    Box,
    Button,
    Center,
    Flex, Icon,
    IconButton,
    Image,
    Link,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Skeleton,
    Spacer,
    Text
} from "@chakra-ui/react"
import {HamburgerIcon} from '@chakra-ui/icons'
import {authLogout, firebaseApp, getMockupAdData} from "../firebaseUtilities";
import {Link as ReactLink, useHistory, useLocation} from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    BiSupport,
    FaUserAlt,
    FaUserPlus,
    FaUsers,
    FiExternalLink,
    GiCarWheel,
    ImTicket,
    MdCreditCard,
    RiLogoutBoxFill,
    RiSafeFill,
    RiVipFill,
    SiJsonwebtokens,
    MdLocalOffer, AiTwotoneWallet, WiMoonAltNew
} from "react-icons/all";
import preval from 'preval.macro'
import {printText} from "../devUtilities";


var localToastAds = []


export default function Header({uid, userData}) {

    const [myCash, setMyCash] = useState(0.0)
    const [myGold, setMyGold] = useState(0)
    const [dataIsFetched, setDataIsFetched] = useState(false) //using this to ensure the data from props is shown as our props get updated after the fetch in the parent component
    const [toastAd, setToastAd] = useState({
      text: "Do this and earn EASY $100!",
      href: "http://fumacrom.com/2962T"
    })
    const [topBannerSrc, setTopBannerSrc] = useState({})
    // const [bottomBannersSrcs, setBottomBannersSrcs] = useState([{
    //   href: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Youtube_loading_symbol_1_(wobbly).gif",
    //   src: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Youtube_loading_symbol_1_(wobbly).gif"
    // },
    // {
    //   href: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Youtube_loading_symbol_1_(wobbly).gif",
    //   src: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Youtube_loading_symbol_1_(wobbly).gif"
    // },
    // {
    //   href: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Youtube_loading_symbol_1_(wobbly).gif",
    //   src: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Youtube_loading_symbol_1_(wobbly).gif"
    // },
    // {
    //   href: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Youtube_loading_symbol_1_(wobbly).gif",
    //   src: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Youtube_loading_symbol_1_(wobbly).gif"
    // }])
    // This block is also present in WheelComp.js
    // Don't forget to work on them both (or find a solution for duplicate code)
    const history = useHistory()
    const logoutClick = () => {
        authLogout().then(r => {
            history.push("/")
        })
    }

    const location = useLocation();

    useEffect(() => {

        var tempUserData = 0;
        if(userData.balance > 0) tempUserData = userData.balance //can't use parseFloat on null, so we need this
        setMyCash(parseFloat(tempUserData.toFixed(2)))
        setMyGold(userData.coins)
        // fetchMockupAdSources()
        setDataIsFetched(true)
        firebaseApp.auth().onAuthStateChanged((user) => {
            if (user) {

            } else {
                history.push("/")
            }
        })
    }, [uid, userData]); //updated when props change, else the fetched data does not get recognized as props from the parent component

    useEffect(() => {

      // const toastInterval = setInterval(() => {
      //   notifyAds()
      // }, 5000)
      //
      // return () => clearInterval(toastInterval);


    }, []);

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

    const notifyAds = () => {


      var toastDelayRandomizerMs = Math.floor((Math.random() * 5) + 1) * 1000
      var toastRandomizer = Math.floor(Math.random() * localToastAds.length)
      setToastAd(localToastAds[toastRandomizer])
      toast(localToastAds[toastRandomizer].text)


    }

    const fetchMockupAdSources = () => {

      getMockupAdData().then((data) => {

        var localTopBanners = []
        // var localBottomBanners = []


        Object.values(data.topBanners).forEach(val => {
          localTopBanners.push(val)
        })

        // Object.values(data.bottomBoxes).forEach(val => {
        //   localBottomBanners.push(val)
        // })

        Object.values(data.toastAds).forEach(val => {
          localToastAds.push(val)
        })




        // var shuffledTopBanners = [...localTopBanners].sort(() => 0.5 - Math.random())
        // var shuffledBottomBanners = [...localBottomBanners].sort(() => 0.5 - Math.random())
        // var shuffledToastAds = [...localToastAds].sort(() => 0.5 - Math.random())

        // var bottomBannersToBeUsed = shuffledBottomBanners.slice(0, 4)

        // setTopBannerSrc(shuffledTopBanners[0])
        // setBottomBannersSrcs(bottomBannersToBeUsed)
        // setToastAd(shuffledToastAds[0])


      }).catch((err) => {
          window.location.reload()
      })


    }
    return (
        <Box>
            <Flex direction="column" justify="center">
                <Center margin="2%">
                    <Image w={800} mt={12} mb={1} src="/assets/logo_en.png"/>
                </Center>
                <Flex direction={["column", "column", "column", "row"]} my={[0, 0, 0, 10]} alignItems={["center", ""]}>
                    <Spacer/>
                    <Link as={ReactLink} to="/dashboard" my={[2, 3, 3, 0]}>
                        <Button leftIcon={<GiCarWheel/>} px={8} borderRadius="0px" bg="brand.dark"
                                boxShadow={location.pathname === "/dashboard" ? "0 0 8px #fff" : "0 0 10px rgba(15, 155, 242, 0.4)"}
                                color={location.pathname === "/dashboard" ? "white" : "brand.blue1"} variant="outline"
                            // borderColor={location.pathname === "/dashboard" ? "white" : "brand.blue1"}
                                className={location.pathname === "/dashboard" ? "neonBlueHeaderActive" : "neonBlueHeader"}
                                _hover={{color: "white", borderColor: "white", boxShadow: "0 0 8px #fff"}}
                                _active={{transform: "scale(0.98)"}}
                                _focus={{}}>
                            WHEEL
                        </Button>
                    </Link>
                    <Link as={ReactLink} to="/offers" marginLeft={[0, 0, 0, "3%"]} my={[2, 3, 3, 0]}>
                        <Button leftIcon={<MdLocalOffer/>} px={8} borderRadius="20px" bg="brand.dark"
                                boxShadow={location.pathname === "/offers" ? "0 0 8px #fff" : "0 0 10px rgba(15, 155, 242, 0.4)"}
                                color={location.pathname === "/offers" ? "white" : "yellow"} variant="outline"
                            // borderColor={location.pathname === "/offers" ? "white" : "yellow"}
                                className={location.pathname === "/offers" ? "neonBlueHeaderActive" : "neonBlueHeader"}
                                _hover={{color: "white", borderColor: "white", boxShadow: "0 0 8px #fff"}}
                                _active={{transform: "scale(0.98)"}}
                                _focus={{}}>
                            OFFERS <Icon as={WiMoonAltNew} className="blinkingBox" ml={1} color="red"/>
                        </Button>
                    </Link>
                    <Link as={ReactLink} to="/referral" marginLeft={[0, 0, 0, "3%"]} my={[2, 3, 3, 0]}>
                        <Button leftIcon={<FaUserPlus/>} px={8} borderRadius="0px" bg="brand.dark"
                                boxShadow={location.pathname === "/referral" ? "0 0 8px #fff" : "0 0 10px rgba(15, 155, 242, 0.4)"}
                                color={location.pathname === "/referral" ? "white" : "brand.blue1"} variant="outline"
                            // borderColor={location.pathname === "/referral" ? "white" : "brand.blue1"}
                                className={location.pathname === "/referral" ? "neonBlueHeaderActive" : "neonBlueHeader"}
                                _hover={{color: "white", borderColor: "white", boxShadow: "0 0 8px #fff"}}
                                _active={{transform: "scale(0.98)"}}
                                _focus={{}}>
                            REFERRALS
                        </Button>
                    </Link>
                    <Link as={ReactLink} to="/crew" marginLeft={[0, 0, 0, "3%"]} my={[2, 3, 3, 0]}>
                        <Button leftIcon={<FaUsers/>} px={8} borderRadius="0px" bg="brand.dark"
                                boxShadow={location.pathname === "/crew" ? "0 0 8px #fff" : "0 0 10px rgba(15, 155, 242, 0.4)"}
                                color={location.pathname === "/crew" ? "white" : "brand.blue1"} variant="outline"
                            // borderColor={location.pathname === "/crew" ? "white" : "brand.blue1"}
                                className={location.pathname === "/crew" ? "neonBlueHeaderActive" : "neonBlueHeader"}
                                _hover={{color: "white", borderColor: "white", boxShadow: "0 0 8px #fff"}}
                                _active={{transform: "scale(0.98)"}}
                                _focus={{}}>
                            CREW
                        </Button>
                    </Link>
                    <Link as={ReactLink} to="/websites" marginLeft={[0, 0, 0, "3%"]} my={[2, 3, 3, 0]}>
                        <Button leftIcon={<FiExternalLink/>} px={8} borderRadius="0px" bg="brand.dark"
                                boxShadow={location.pathname === "/websites" ? "0 0 8px #fff" : "0 0 10px rgba(15, 155, 242, 0.4)"}
                                color={location.pathname === "/websites" ? "white" : "brand.blue1"} variant="outline"
                            // borderColor={location.pathname === "/websites" ? "white" : "brand.blue1"}
                                className={location.pathname === "/websites" ? "neonBlueHeaderActive" : "neonBlueHeader"}
                                _hover={{color: "white", borderColor: "white", boxShadow: "0 0 8px #fff"}}
                                _active={{transform: "scale(0.98)"}}
                                _focus={{}}>
                            LINKS
                        </Button>
                    </Link>
                    <Link as={ReactLink} to="/jackpot" marginLeft={[0, 0, 0, "3%"]} my={[2, 3, 3, 0]}>
                        <Button leftIcon={<ImTicket/>} px={8} borderRadius="0px" bg="brand.dark"
                                boxShadow={location.pathname === "/jackpot" ? "0 0 8px #fff" : "0 0 10px rgba(15, 155, 242, 0.4)"}
                                color={location.pathname === "/jackpot" ? "white" : "brand.blue1"} variant="outline"
                            // borderColor={location.pathname === "/jackpot" ? "white" : "brand.blue1"}
                                className={location.pathname === "/jackpot" ? "neonBlueHeaderActive" : "neonBlueHeader"}
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

                            {uid === "krs6jGkIgXO0Lgrfp2BEwSBnh3j1" &&
                            <MenuItem borderWidth="1px"
                                      borderColor="transparent"
                                      _hover={{
                                          background: "transparent",
                                          border: "1px solid white",
                                          boxShadow: "0 0 8px #fff"
                                      }} _active={{}}
                                      _focus={{}}>Build Date: {preval`module.exports = new Date().toLocaleString("en-US", {timeZone: "Asia/Istanbul"});`}</MenuItem>
                            }
                        </MenuList>

                    </Menu>

                </Flex>
                {/*<Center mb="5">*/}
                {/*  <a href={topBannerSrc.href}*/}
                {/*    target="_blank"*/}
                {/*    >*/}
                {/*    <Image*/}

                {/*       htmlWidth="1000px"*/}
                {/*       htmlHeight="200px"*/}
                {/*       objectFit="cover"*/}
                {/*       src={topBannerSrc.src}*/}
                {/*     />*/}
                {/* </a>*/}

                {/*</Center>*/}
                {!dataIsFetched ? <Skeleton startColor="brand.blue1" height="5px"/>
                    :
                    <Flex direction="row" pb={6} className="contentContainer" mx={[2, 0]} mt={[2, 0]}>
                        <Link as={ReactLink} to="/refill" mt={-1} ml={-1}>
                            <Button variant="outline" bg="transparent" leftIcon={<SiJsonwebtokens size={25}/>}
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
                                <Text fontSize="3xl">{myGold} TOKENS</Text>
                            </Button>
                        </Link>
                        <Spacer/>


                        <Link as={ReactLink} to="/cashier" mt={-1} mr={-1}>
                            <Button variant="outline" leftIcon={<MdCreditCard size={30}/>} borderRadius="0px"
                                // boxShadow="2px -2px rgba(255, 255, 255, 0.4)"
                                    _hover={{
                                        borderColor: "brand.blue2",
                                        color: "brand.blue2",
                                        boxShadow: "4px -4px rgba(15, 155, 242, 0.4)"
                                    }}
                                    _active={{transform: "scale(0.98)"}}
                                    _focus={{}} size="lg" px={[2, 6]} py={8}
                                // className="neonRightTopBox"
                                    borderTop="4px solid white" borderRight="4px solid white"
                                    border="transparent">
                                <Text fontSize="3xl">${myCash}</Text>
                            </Button>

                        </Link>

                    </Flex>
                }
            </Flex>
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
