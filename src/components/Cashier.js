import React, {useEffect, useState} from 'react';
import {
    Alert,
    AlertIcon,
    Box,
    Button,
    Center,
    Container,
    Flex,
    FormControl,
    Heading,
    Icon,
    Image,
    Input,
    Radio,
    RadioGroup,
    SlideFade,
    Spacer,
    Text, Tooltip
} from "@chakra-ui/react"
import {
    AiFillBank,
    BiDownArrow, FaBitcoin,
    GrPaypal,
    IoQrCodeSharp,
    IoShieldCheckmarkOutline,
    RiTrademarkLine, SiEthereum
} from "react-icons/all";
import WAValidator from "@swyftx/api-crypto-address-validator";
import {VFXImg, VFXProvider} from "react-vfx";
import {printText} from "../devUtilities";


export default function Cashier({userData, userId}) {

    //need to fetch cash
    //
    const [paymentOptionSelected, setPaymentOptionSelected] = useState("btc")
    const [cashAmount, setCashAmount] = useState(100)
    const [coinAddress, setCoinAddress] = useState("")
    const [coinAddressInvalid, setCoinAddressInvalid] = useState(false)

    const [balance, setBalance] = useState(0)

    const [changesLoading, setChangesLoading] = useState(false)
    const [changesLoaded, setChangesLoaded] = useState(false)

    const [messageShown, setMessageShown] = useState(false)
    const [message, setMessage] = useState("")
    const [messageType, setMessageType] = useState("error")

    const [width, setWidth] = useState(window.innerWidth);

    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }

    useEffect(() => {
        setBalance(userData.balance)
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, [userData, userId]);

    let isMobile = (width <= 768)

    const handleAddrChange = (event) => setCoinAddress(event.target.value)

    const requestButton = () => {
        setChangesLoading(true)
        if(userData.balance < cashAmount || userData.balance < 100) {
            setChangesLoading(false)
            setMessage("Insufficient funds")
            setMessageShown(true)
        } else if (coinAddress === "") {
            setCoinAddressInvalid(true)
            setChangesLoading(false)
            setMessage("Please enter your wallet address")
            setMessageShown(true)
        } else if (!WAValidator.validate(coinAddress, paymentOptionSelected, "prod", ["legacy"])) {
            setMessage("Invalid wallet address")
            setMessageShown(true)
            setChangesLoading(false)
            setCoinAddressInvalid(true)
        } else if (!userData.emailVerified) {
            setMessage("You cannot withdraw without verifying your email address")
            setMessageShown(true)
            setChangesLoading(false)
            setChangesLoaded(true)
        } else {
            setCoinAddressInvalid(false)
            setMessageShown(false)
            const requestData = {
                type: paymentOptionSelected,
                recipient: coinAddress,
                amount: cashAmount
            }
            printText(requestData)
            try {
                fetch("/requestPayment", {
                    method: "POST",
                    headers: {
                        "code": userId,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(requestData)
                }).then((response) => {
                    if (response.status === 200) {
                        setChangesLoading(false)
                        setChangesLoaded(true)
                        setMessageType("success")
                        setMessage("Payout request sent successfully")
                        setMessageShown(true)
                    } else {
                        setChangesLoading(false)
                        setMessageType("error")
                        setMessage("An error occurred while sending payout request")
                        setMessageShown(true)
                    }
                })
            } catch (e) {
                setChangesLoading(false)
                setMessageType("error")
                setMessage("An error occurred while sending payout request")
                setMessageShown(true)
                printText(e)
            }
        }
    }

    return (
        <VFXProvider>
            <Box className="contentContainer" mx={[2, 0]}>
                <SlideFade in={true} offsetY="40px">
                    <Box mx={[0, 10]}>
                        <Container maxW="80rem" centerContent>
                            <Heading textAlign="center"><Icon as={BiDownArrow} mr={10} pb={1} w={10}
                                                              h={10}/>BALANCE<Icon
                                as={BiDownArrow} ml={10} pb={1} w={10} h={10}/></Heading>
                            <Heading textAlign="center" mb={1}>${userData.balance}</Heading>
                            {isMobile ? <Image w={400} mt={5} mb={3} src="/assets/cyberwoman.png"
                                               alt="CYBERBUCKS"/> :
                                <Box mt={5} mb={3}>
                                    <VFXImg width="400px" src="/assets/cyberwoman.png" shader="rgbGlitch"/></Box>}
                        </Container>
                        <FormControl isRequired>
                            <RadioGroup onChange={setCashAmount} value={cashAmount} my={5}>
                                <Flex direction="row">
                                    <Spacer/>
                                    <Radio value={100} _checked={{bg: "white", borderColor: "white"}}><Text
                                        fontSize="2xl">$100</Text></Radio>
                                    <Spacer/>
                                    <Radio value={200} _checked={{bg: "white", borderColor: "white"}}><Text
                                        fontSize="2xl">$200</Text></Radio>
                                    <Spacer/>
                                    <Radio value={300} _checked={{bg: "white", borderColor: "white"}}><Text
                                        fontSize="2xl">$300</Text></Radio>
                                    <Spacer/>
                                </Flex>
                            </RadioGroup>
                        </FormControl>
                        <FormControl isRequired>
                            <RadioGroup onChange={setPaymentOptionSelected} value={paymentOptionSelected} my={8}>
                                <Flex direction="row">
                                    <Spacer/>
                                    <Radio value="btc" _checked={{bg: "white", borderColor: "white"}}><Center>
                                        <Icon as={FaBitcoin} color="white" boxSize="2.2em" mr={2}/><Text
                                        fontSize="2xl"
                                        ml={1}>BTC</Text></Center></Radio>
                                    <Spacer/>
                                    <Radio value="doge" _checked={{bg: "white", borderColor: "white"}}><Center><Image
                                        objectFit="contain" boxSize="2.2em" src="/assets/dogecoin.png"/><Text
                                        fontSize="2xl"
                                        ml={1}>DOGE</Text></Center></Radio>
                                    <Spacer/>
                                    <Radio value="eth" _checked={{bg: "white", borderColor: "white"}}><Center>
                                        <Icon as={SiEthereum} color="white" boxSize="2.2em" mr={0}/><Text
                                        fontSize="2xl"
                                        ml={1}>ETH</Text></Center></Radio>
                                    <Spacer/>

                                    <Radio value="paypal" _checked={{bg: "white", borderColor: "white"}}
                                           _disabled={{bg: "transparent", borderColor: "red"}}
                                           isDisabled={userData.balance > 99}>
                                        {userData.balance > 99 ? <Tooltip hasArrow label="Temporarily unavailable" fontSize="xl" bg="red.600"><Center><Icon as={GrPaypal} color="white" boxSize="2em" mr={2}/><Text
                                        fontSize="2xl" ml={1}>Paypal</Text></Center></Tooltip>
                                            : <Center><Icon as={GrPaypal} color="white" boxSize="2em" mr={2}/><Text fontSize="2xl" ml={1}>Paypal</Text></Center>}
                                        </Radio>

                                    <Spacer/>
                                    <Radio value="wire" _checked={{bg: "white", borderColor: "white"}}
                                           _disabled={{bg: "transparent", borderColor: "red"}}
                                           isDisabled={userData.balance > 99}>
                                        {userData.balance > 99 ? <Tooltip hasArrow label="Not available in your country" fontSize="xl" bg="red.600"><Center><Icon as={AiFillBank} color="white" boxSize="2.1em" mr={2}/><Text
                                        fontSize="2xl" ml={1}>Wire Transfer</Text></Center></Tooltip>
                                            : <Center><Icon as={AiFillBank} color="white" boxSize="2.1em" mr={2}/><Text fontSize="2xl" ml={1}>Wire Transfer</Text></Center>}
                                    </Radio>
                                    <Spacer/>
                                </Flex>
                            </RadioGroup>
                        </FormControl>
                        <FormControl>
                            <Input
                                value={coinAddress}
                                onChange={handleAddrChange}
                                focusBorderColor="brand.blue1"
                                placeholder="Coin Address"
                                isInvalid={coinAddressInvalid}
                                w="100%" p={4} color="white" my={3} borderBottom="2px solid white" bg="transparent"
                                border="transparent" borderRadius="0px"
                                style={{wordWrap: "normal"}} fontSize="xl"
                                _active={{borderColor: "brand.blue"}}
                            />
                        </FormControl>
                        <Button onClick={requestButton} py={4} mt={4} variant="outline" bg="transparent"
                                leftIcon={<IoQrCodeSharp/>} isFullWidth
                                borderRadius="0px"
                                isLoading={changesLoading} isDisabled={changesLoaded}
                                _hover={{color: "brand.purple", borderColor: "brand.purple"}}
                                _active={{transform: "scale(0.98)"}}
                                size="lg">Request</Button>
                        <SlideFade in={messageShown}>
                            <Alert status={messageType} mt={5} color="white" bg="transparent" fontSize="xl"
                                   alignItems="center"
                                   justifyContent="center">
                                <AlertIcon/>
                                {message}
                            </Alert>
                        </SlideFade>
                        <Text textAlign="center" my={3}>Payouts take additional time to be manually reviewed and
                            processed
                            when
                            you make a request for the first time.</Text>
                        <Center mt={2}><Icon as={IoShieldCheckmarkOutline}/><Text ml={1}>Processed and secured by Reline
                            Payments</Text><Icon as={RiTrademarkLine}/></Center>

                    </Box>
                </SlideFade>
            </Box>
        </VFXProvider>
    );
}
