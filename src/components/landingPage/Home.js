import React, {useEffect, useState} from 'react';


import AuthComponent from "../Auth";
import {firebaseApp, getAnyDataWithoutChild} from "../../firebaseUtilities";
import {Redirect} from "react-router-dom";
import {
    Badge,
    Box,
    Button,
    Center,
    Container,
    Flex,
    Heading,
    HStack,
    Icon,
    Image,
    Img,
    Link,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    SimpleGrid,
    Spacer,
    Text,
    useDisclosure,
    VStack
} from "@chakra-ui/react";
import {
    AiFillBank,
    AiOutlineClockCircle,
    BsTrophy,
    FaBitcoin,
    GrPaypal,
    RiLoginBoxFill, SiEthereum,
    SiLitecoin,
    SiWebmoney
} from "react-icons/all";

import ChakraCarousel from "./ChakraCarousel";
import {DateTime} from "luxon";
import Countdown from "react-countdown";
import {VFXImg, VFXProvider} from "react-vfx";


export default function Home(props) {
    const {isOpen, onOpen, onClose} = useDisclosure()
    const [isLoggedIn, setLoggedIn] = useState(false)

    const [bigPayouts, setBigPayouts] = useState([{"payout":290,"userName":"guangZHOUMYGOD"},{"payout":277,"userName":"mwwking"},{"payout":262,"userName":"Zakgor"},{"payout":208,"userName":"TreeDeS"},{"payout":203,"userName":"callmefit"}])
    const [latestPayouts, setLatestPayouts] = useState([{"date":DateTime.now().plus({days: 1}).toISODate().toString(),"paymentType":"Wire Transfer","payout":"⌬200","userName":"atsisibcarupt73"},{"date":"2021-08-31T15:58:36.961+03:00","paymentType":"BTC","payout":"0.00624376","userName":"haloa1"},{"date":"2021-08-31T16:28:36.961+03:00","paymentType":"WebMoney","payout":"⌬200","userName":"TheRealRove"},{"date":"2021-08-31T14:28:36.961+03:00","paymentType":"WebMoney","payout":"⌬200","userName":"Redwallzyl"},{"date":"2021-08-31T14:55:36.961+03:00","paymentType":"Wire Transfer","payout":"⌬100","userName":"Amerdox97"},{"date":"2021-08-31T16:45:36.961+03:00","paymentType":"DOGE","payout":"1065.390093","userName":"PM_ME_MC_LEAKS"},{"date":"2021-08-31T14:58:36.961+03:00","paymentType":"Skrill","payout":"⌬300","userName":"DangerousBore"},{"date":"2021-08-31T15:45:36.961+03:00","paymentType":"Paypal","payout":"⌬100","userName":"robertborathean"},{"date":"2021-08-31T16:56:36.961+03:00","paymentType":"Skrill","payout":"⌬300","userName":"Hylar92"},{"date":"2021-08-31T15:59:36.961+03:00","paymentType":"Payeer","payout":"⌬300","userName":"Mstam1"}])
    const [jackpotData, setJackpotData] = useState({"drawDate": DateTime.now().toISODate(), "entries": 3, "prize": 100})

    const decideTrophyIcon = (index) => {
        switch (index) {
            case 0:
                return (<Icon as={BsTrophy} color="#ffcd47" mr={2} ml={4}/>)
            case 1:
                return (<Icon as={BsTrophy} color="#bcbcbc" mr={2} ml={4}/>)
            case 2:
                return (<Icon as={BsTrophy} color="#df7301" mr={2} ml={4}/>)
            case 3:
                return (<Text ml={4}>4.</Text>)
            case 4:
                return (<Text ml={4}>5.</Text>)
            default:
                return (<Text ml={4}>0.</Text>)
        }
    }
    const decidePaymentIcon = (paymentType) => {
        switch (paymentType) {
            case "BTC":
                // return (<Image objectFit="contain" boxSize="48px" src="/assets/bitcoin.png" />)
                return (<Icon as={FaBitcoin} color="white" boxSize="2em" mr={2}/>)
            case "ETH":
                // return (<Image objectFit="contain" boxSize="48px" src="/assets/litecoin.png" />)
                return (<Icon as={SiEthereum} color="white" boxSize="2em" mr={2}/>)
            case "Paypal":
                // return (<Image objectFit="contain" boxSize="48px" src="/assets/paypal.png" />)
                return (<Icon as={GrPaypal} color="white" boxSize="2em" mr={2}/>)
            case "Skrill":
                return (<Image objectFit="contain" boxSize="2em" src="/assets/skrill.png" mr={2}/>)
            case "WebMoney":
                // return (<Image objectFit="contain" boxSize="48px" src="/assets/webmoney.png" />)
                return (<Icon as={SiWebmoney} color="white" boxSize="2em" mr={2}/>)
            case "Payeer":
                return (<Image objectFit="contain" boxSize="2em" src="/assets/payeer.png" mr={2}/>)
            case "DOGE":
                return (<Image objectFit="contain" boxSize="2.1em" src="/assets/dogecoin.png" />)
                // return (<Icon as={FaBitcoin} color="white" boxSize="2em" mr={2}/>)
            case "Wire Transfer":
                // return (<Image objectFit="contain" boxSize="48px" src="/assets/bank.png" />)
                return (<Icon as={AiFillBank} color="white" boxSize="2.1em" mr={2}/>)
            default:
                return (<Text>0. </Text>)
        }
    }

    const [width, setWidth] = useState(window.innerWidth);

    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }

    useEffect(() => {
        firebaseApp.auth().onAuthStateChanged((user) => {
            if (user) {
                // User logged in already or has just logged in.
                setTimeout(function(){
                    setLoggedIn(true)
                }, 1000);
            }
        })
        getAnyDataWithoutChild("currentJackpot").then((data) => {
            setJackpotData(data)
        })
        getAnyDataWithoutChild("landingPageData").then((data) => {
            setBigPayouts(data.bigPayouts)
            setLatestPayouts(data.latestPayouts)
        })
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

    let isMobile = (width <= 768)

    if (isLoggedIn) {
        return <Redirect push to="/dashboard"/>
    } else {
        return (
            <VFXProvider>
                <Box style={{
                    backgroundImage: `url('/assets/cyberpunk-6487723.jpg')`,
                    backgroundColor: "brand.dark",
                    backgroundPositionX: "0%",
                    backgroundPositionY: "0%",
                    backgroundSize: "100%",
                    backgroundRepeat: "no-repeat",
                }}>
                    {/*<SlideFade in={true} offsetY="40px">*/}
                    <Container maxW="80rem" mt={9}>
                        {/*<Flex mt={9}>*/}
                        {/*    <Spacer />*/}
                        {/*    <Button leftIcon={<FaUserAlt />} onClick={() => openAuthenticationModal()}*/}
                        {/*            px={8} color="brand.blue1" variant="outline"*/}
                        {/*            borderColor="brand.blue1"*/}
                        {/*            borderRadius="0px"*/}
                        {/*            _hover={{color: "white", borderColor: "white"}}*/}
                        {/*            _active={{transform: "scale(0.98)"}}>Register</Button>*/}
                        {/*</Flex>*/}
                        <Container maxW="80rem" centerContent>
                            {/*<Image maxW="280px" src="/assets/logo_en.png" alt="Cyber Hunt" />*/}
                            <Img w={800} mt={12} mb={3} src="/assets/logo_en.png"/>
                            <Heading mt="10" className="neonWhiteHeaderNoAnim">WELCOME</Heading>
                            <Text fontSize="2xl" mt="3" maxW="40rem" align="center" className="neonWhiteHeaderNoAnim">Complete
                            jobs to increase your street credit. Spin the wheel of fortune. Collect token and cash.</Text>
                            <br/>
                            <Text fontSize="2xl" mt="3" fontWeight="bold" className="neonWhiteHeaderNoAnim"
                                  textAlign="center">Play for free. Win real cash and crypto.</Text>
                            {/*VFXImg is rendered as always on top and thus overlaps login modal*/}
                            {isOpen || isMobile ? <Image maxW="600px" mt={5} mb={3} src="assets/pexels-mikhail-nilov-8107832.png"
                                             alt="CYBERBUCKS"/> :
                                <Box mt={10} mb={3}><VFXImg src="assets/pexels-mikhail-nilov-8107832.png"
                                                    shader="rgbGlitch"/></Box>}
                            <Button px={8} color="white" bg="brand.sky" mb={5}
                                    boxShadow="0 0 7px #fff, 0 0 10px #0F9BF2, 0 0 21px #0F9BF2, 0 0 42px #0F9BF2,
                                inset 0 0 10px #0F9BF2;"
                                    _hover={{
                                        color: "white",
                                        borderColor: "white",
                                        boxShadow: "0 0 7px #fff, 0 0 10px #0F9BF2, 0 0 21px #fff"
                                    }}
                                    _active={{transform: "scale(0.98)"}} onClick={() => onOpen()} w={[320, 400]} p={8}
                                    fontSize="4xl">CLICK HERE TO JOIN</Button>
                            <Text fontSize="xl" mt={10} textColor="white" className="neonWhiteHeaderNoAnim" textAlign="center">Get your welcome
                                bonus of 100 tokens. Start winning now!</Text>
                            <Text fontSize="md" mt="5" textColor="white" className="neonWhiteHeaderNoAnim">...or <Link
                                onClick={() => onOpen()} color="brand.blue1">sign in </Link>with an existing
                                account</Text>
                            <Image w={[280, 500]} mt={8} mb={10} src="/assets/award_list.png" alt="Rewards"/>
                            <SimpleGrid columns={[1, 2]} mt={5} mb={5}>
                                {/*<Flex direction="row" mt={10} justify="center">*/}
                                <Image width={[200, 500]} objectFit="contain" mb={5} src="/assets/wheellandingpage.png"
                                       alt="Rewards" alignContent="center"/>
                                <Flex direction="column" p={7} ml={[0, 4]}>
                                    <Spacer/>
                                    {/*<Heading fontSize="36px" align="center" textColor="white">Free to play</Heading>*/}
                                    <Heading fontSize="4xl" align="center" textColor="white"
                                             className="neonWhiteTextNoAnim">FREE TO PLAY</Heading>
                                    {/*<VFXSpan shader="glitch" textColor="#ffffff">Free to play</VFXSpan>*/}
                                    <Text mt={4} align="center" fontSize="2xl" textColor="white">Use your Tokens to
                                        spin the wheel and win cash. Used all your tokens? We will refill them for you,
                                        for free, forever!</Text>
                                    <Spacer/>
                                </Flex>
                                {/*</Flex>*/}
                                {/*<Flex direction="row" justify="center" mt={10} justifyContent="space-between">*/}
                                <Flex direction="column" p={7} mr={[0, 5]} mt={[5, 0]}>
                                    <Spacer/>
                                    <Heading fontSize="4xl" align="center" textColor="white"
                                             className="neonWhiteTextNoAnim">DAILY JACKPOTS</Heading>
                                    <Text mt={4} align="center" fontSize="2xl" textColor="white">We hold daily jackpots
                                        and one of our members brings all the cash home. Collect entries by playing the
                                        game.</Text>
                                    <Spacer/>
                                </Flex>
                                <Flex
                                    justifyContent="center"
                                    flexDirection="column"
                                    py={8}
                                    px={24}
                                    mt={10}
                                    mb={10}
                                    className="neonBlueBoxNoAnim"
                                >
                                    <VStack mb={2} pt={4} pb={4}>
                                        <Heading
                                            fontSize={{base: "4xl", md: "5xl"}}
                                            textAlign="center"
                                            mb={2}>JACKPOT</Heading>
                                        <Text w="full" fontSize="5xl" align="center"
                                              color="green">⌬{jackpotData.prize}</Text>
                                        <HStack>
                                            <Icon as={AiOutlineClockCircle} color="#ffcd47" w={10} h={10}/>
                                            <Text w="full" fontSize="4xl">
                                                <Countdown date={DateTime.fromISO(jackpotData.drawDate)} daysInHours/>
                                            </Text>
                                        </HStack>
                                    </VStack>
                                </Flex>
                                <Flex
                                    justifyContent="space-between"
                                    flexDirection="column"
                                    py={8}
                                    px={10}
                                    mr={[0, 5]}
                                    mt={10}
                                    mb={5}
                                    className="neonBlueBoxNoAnim"
                                ><HStack>
                                    <Text fontSize="3xl" textColor="white">BIGGEST RECENT PAYOUTS</Text>
                                    <Badge bg="red" textColor="white" fontSize="2xl"
                                           className="blinkingBox">LIVE</Badge>
                                </HStack>
                                    {Object.values(bigPayouts).map(function (key, index) {
                                        return (
                                            <Flex key={index} borderWidth="2px" borderColor="white" my={[0, 1]} py={2}>
                                                <div>{decideTrophyIcon(index)}</div>
                                                <Text align="center">{key.userName}</Text>
                                                <Spacer/>
                                                <Text mr={5}>⌬{key.payout.toString()}</Text>
                                            </Flex>
                                        )
                                    })}
                                </Flex>
                                <Flex direction="column" p={7} ml={[0, 5]} mt={[5, 0]}>
                                    <Spacer/>
                                    <Heading fontSize="4xl" align="center" textColor="white"
                                             className="neonWhiteTextNoAnim">BIG PAYOUTS</Heading>
                                    <Text mt={4} align="center" fontSize="2xl" textColor="white">Our members earn big.
                                        See how much our top members make. It's time to join and enter that list!</Text>
                                    <Spacer/>
                                </Flex>
                                {/*</Flex>*/}
                            </SimpleGrid>
                            <Text mt={14} mb={6} fontSize="xl" textColor="white" textAlign="center">Withdraw your money through
                                the most popular processors and cryptocurrencies!</Text>
                            <SimpleGrid columns={[2, 5]} mt={5} mb={5}>
                                <Center className="neonBlueBoxNoAnim"
                                        py={3} px={2} mr={3} my={[3, 0]}><Icon as={FaBitcoin} color="white" boxSize="2em"
                                                                               mr={2}/><Text fontSize="xl">Bitcoin</Text></Center>
                                {/*<Box boxShadow="0 0 10px rgba(15, 155, 242, 0.4)" borderWidth={2} borderColor="brand.blue1"*/}
                                {/*    py={2} px={2} mx={3}><Image maxW="90px" src="/assets/skrill_b.png" alt="Skrill" /></Box>*/}
                                {/*<Box boxShadow="0 0 10px rgba(15, 155, 242, 0.4)" borderWidth={2} borderColor="brand.blue1"*/}
                                {/*    py={2} px={2} mx={3}><Image maxW="90px" src="/assets/webmoney_b.png" alt="WebMoney" /></Box>*/}
                                {/*<Box boxShadow="0 0 10px rgba(15, 155, 242, 0.4)" borderWidth={2} borderColor="brand.blue1"*/}
                                {/*    py={2} px={2} mx={3} ><Image maxW="90px" src="/assets/payeer_b.png" alt="Payeer" /></Box>*/}
                                <Center className="neonBlueBoxNoAnim"
                                        py={3} px={2} mr={[0, 3]} my={[3, 0]}><Image objectFit="contain" boxSize="2em"
                                                                                     src="/assets/dogecoin.png" mr={2}/><Text
                                    fontSize="xl">Dogecoin</Text></Center>
                                <Center className="neonBlueBoxNoAnim"
                                        py={3} px={2} mr={[3]} my={[3, 0]}><Icon as={SiEthereum} color="white"
                                                                                 boxSize="2em" mr={2}/><Text
                                    fontSize="xl">Ethereum</Text></Center>
                                <Center className="neonBlueBoxNoAnim"
                                        py={3} px={2} mr={[0, 3]} my={[3, 0]}>
                                    <Icon as={GrPaypal} color="white"
                                          boxSize="2em" mr={2}/><Text
                                    fontSize="xl">Paypal</Text></Center>
                                <Center className="neonBlueBoxNoAnim" colSpan={[2, 1]}
                                        py={3} px={2} mr={[3]} my={[3, 0]}><Icon as={AiFillBank} color="white"
                                                                                 boxSize="2.1em" mr={2}/><Text
                                    fontSize="xl">Wire Transfer</Text></Center>
                            </SimpleGrid>
                            {isOpen || isMobile ? <Image maxW="400px" my={3} src="assets/cybercouple.png" alt="CYBERBUCKS"/> :
                                <Box mt={10} mb={4}><VFXImg src="assets/cybercouple.png"
                                                    shader="rgbGlitch"/></Box>}

                            <Text mt={3} fontSize="4xl" textColor="white">Let's win some cash!</Text>
                            <Button px={8} color="white" bg="brand.sky" mb={5} mt={3}
                                    boxShadow="0 0 7px #fff, 0 0 10px #0F9BF2, 0 0 21px #0F9BF2, 0 0 42px #0F9BF2,
                                inset 0 0 10px #0F9BF2;"
                                    _hover={{
                                        color: "white",
                                        borderColor: "white",
                                        boxShadow: "0 0 7px #fff, 0 0 10px #0F9BF2, 0 0 21px #fff"
                                    }}
                                    _active={{transform: "scale(0.98)"}} onClick={() => onOpen()} w={[320, 400]} p={8}
                                    fontSize="4xl">CLICK HERE TO JOIN</Button>
                            <Text fontSize="xl" mt={7} textColor="white" className="neonWhiteHeaderNoAnim" textAlign="center">Get your welcome
                                bonus of 100 tokens. Start winning now!</Text>
                            <Text fontSize="md" mt="5" textColor="white" className="neonWhiteHeaderNoAnim">...or <Link
                                onClick={() => onOpen()} color="brand.blue1">sign in </Link>with an existing
                                account</Text>
                            <Container
                                py={8}
                                px={0}
                                mt={5}
                                maxW={{
                                    base: "100%",
                                    sm: "35rem",
                                    md: "43.75rem",
                                    lg: "57.5rem",
                                    xl: "75rem",
                                    xxl: "87.5rem"
                                }}>
                                <ChakraCarousel gap={32} autoPlay>
                                    {Object.values(latestPayouts).map(function (key, index) {
                                        return (
                                            <Flex
                                                key={index}
                                                // boxShadow="rgba(20, 217, 217, 0.23) 3px 3px 3px, rgba(20, 217, 217, 0.23) -6px -6px 6px"
                                                boxShadow="0 0 3px #fff,
                                                            0 0 8px #fff,
                                                            0 0 14px #0F9BF2,
                                                            inset 0 0 3px #fff,
                                                            inset 0 0 8px #fff,
                                                            inset 0 0 20px #0F9BF2"
                                                flexDirection="column"
                                                overflow="hidden"
                                                flex={1}
                                                p={2}
                                            >

                                                <Heading
                                                    fontSize={{base: "l", md: "xl"}}
                                                    textAlign="center"
                                                    mb={2}
                                                >
                                                    {key.userName}
                                                </Heading>
                                                <VStack mt={1}>
                                                    <Center>
                                                        <Box>{decidePaymentIcon(key.paymentType)}</Box>
                                                        <Text w="full" fontSize="lg"
                                                              textAlign="center">{key.payout}</Text>
                                                    </Center>
                                                    <Spacer/>
                                                    <Center>
                                                        <Icon as={AiOutlineClockCircle} color="#ffcd47" w={6} h={6}
                                                              mr={2}/>
                                                        <Text w="full" fontSize="md" textAlign="center">
                                                            {DateTime.fromISO(key.date).toLocaleString(DateTime.TIME_24_SIMPLE)}
                                                        </Text>
                                                    </Center>
                                                </VStack>
                                            </Flex>
                                        )
                                    })}
                                </ChakraCarousel>
                            </Container>
                        </Container>
                    </Container>
                    {/*</SlideFade>*/}

                    <Modal
                        isOpen={isOpen}
                        onClose={onClose}
                        isCentered
                        motionPreset="slideInBottom"
                        size="lg"
                    >
                        <ModalOverlay/>
                        <ModalContent background="brand.sky" fontSize="2xl"
                                      boxShadow="0 0 4px #fff, 0 0 11px #fff, 0 0 19px #0F9BF2, 0 0 40px #0F9BF2, 0 0 80px #0F9BF2,
                    inset 0 0 4px #fff, inset 0 0 11px #fff, inset 0 0 19px #0F9BF2;"
                                      pt={4} pb={6} px={4}>
                            <ModalHeader fontSize="4xl"><Icon as={RiLoginBoxFill} mr={3}/>REGISTER/SIGN IN</ModalHeader>
                            <ModalBody>
                                <AuthComponent/>
                            </ModalBody>
                        </ModalContent>
                    </Modal>
                </Box>
            </VFXProvider>
        );
    }
}
