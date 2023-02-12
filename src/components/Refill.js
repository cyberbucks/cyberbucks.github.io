import React, {useEffect, useState} from 'react';
import {refillCoins, updateRefillRequest} from "../firebaseUtilities";
import RefillTimer from './RefillTimer';


import {
    Alert,
    AlertIcon,
    Box,
    Button,
    Center,
    Container,
    Heading,
    Icon, Image,
    SlideFade,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr
} from "@chakra-ui/react";
import {AiOutlineClockCircle, BiDownArrow, GiDeliveryDrone, SiJsonwebtokens} from "react-icons/all";
import {VFXImg, VFXProvider} from "react-vfx";

const ONE_HOUR = 60 * 60 * 1000;

let modalContent = (
    <div>
        <h1>anan</h1>
    </div>
)

export default function Refill({userData, userId}) {

    let requestButton;

    const [goldBonus, setGoldBonus] = useState(0)
    const [refillState, setRefillState] = useState(0)

    const [messageShown, setMessageShown] = useState(false)
    const [message, setMessage] = useState("")
    const [messageType, setMessageType] = useState("error")

    const [width, setWidth] = useState(window.innerWidth);

    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }

    useEffect(() => {

        const currTime = new Date()
        const lastRefillRequest = new Date(userData.lastRefillRequest)
        const minRefillTime = new Date(lastRefillRequest.getTime() + ONE_HOUR)

        if (userData.coins > 0) setRefillState(1) //these are for setting the different text and button style for different situations
        if (currTime > minRefillTime && userData.coins === 0 && userData.refillRequested === false) setRefillState(2)
        if (currTime < minRefillTime && userData.coins === 0) setRefillState(3)
        if (currTime > minRefillTime && userData.coins === 0 && userData.refillRequested) setRefillState(4)


        if (userData.balance > 50) {
            setGoldBonus(15)
        } else if (userData.balance > 20) {
            setGoldBonus(20)
        } else {
            setGoldBonus(25)
        }

        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, [userData, userId]);

    let isMobile = (width <= 768)

    const requestCoins = () => { //amount and last refill check may be done on server side for security purposes


        const currTime = new Date()
        const lastRefillRequest = new Date(userData.lastRefillRequest)
        const minRefillTime = new Date(lastRefillRequest.getTime() + ONE_HOUR)


        if (userData.coins > 0) {
            setMessageType("error")
            setMessage("Come back when you have used all your tokens")
            setMessageShown(true)
        }
        //if coins == 0 and not requested yet
        //request button
        if (currTime > minRefillTime && userData.coins === 0 && userData.refillRequested === false) {
            updateRefillRequest(userId)
            //openModal
            setMessageType("success")
            setMessage("Payout request sent successfully")
            setMessageShown(true)
        }
        //if coins == 0 and requested but 1hr not passed yet
        //Delivering... button
        if (currTime < minRefillTime && userData.coins === 0) {
            setMessageType("info")
            setMessage("Your tokens are on your way")
            setMessageShown(true)
        }
        //if coins == 0 and 1 hour has passed
        //Collect button
        if (currTime > minRefillTime && userData.coins === 0 && userData.refillRequested) { //coin addage may be done on server-side for security reasons
            //collectCoins
            //set refillRequested to false
            refillCoins(userId, goldBonus)
            setMessageType("success")
            setMessage("Collected tokens successfully")
            setMessageShown(true)
        }
    }

    if (refillState === 1 || refillState === 2) {

        requestButton = <Button onClick={requestCoins} py={4} px={8} my={5} variant="outline" bg="transparent"
                                leftIcon={<GiDeliveryDrone size={30}/>}
                                borderRadius="0px" isDisabled={refillState === 1}
                                _hover={{color: "brand.purple", borderColor: "brand.purple"}}
                                _active={{transform: "scale(0.98)"}}
                                size="lg"> Request Tokens</Button>

    } else if (refillState === 3) {

        requestButton = <Button onClick={requestCoins} py={4} px={8} my={5} variant="outline" bg="transparent"
                                isLoading loadingText="Delivering..."
                                borderRadius="0px"
                                _hover={{color: "brand.purple", borderColor: "brand.purple"}}
                                _active={{transform: "scale(0.98)"}}
                                size="lg"/>

    } else if (refillState === 4) {

        requestButton = <Button onClick={requestCoins} py={4} px={8} my={5} variant="outline" bg="transparent"
                                leftIcon={<GiDeliveryDrone/>}
                                borderRadius="0px"
                                _hover={{color: "brand.purple", borderColor: "brand.purple"}}
                                _active={{transform: "scale(0.98)"}}
                                size="lg"> Collect</Button>

    }


    return (
        <VFXProvider>
            <Box className="contentContainer" mx={[2, 0]}>
                <SlideFade in={true} offsetY="40px">
                    <Container maxW="500rem" centerContent>

                        <Heading><Icon as={BiDownArrow} mx={[2, 10]} pb={1} w={10} h={10}/>OUT OF TOKENS?<Icon
                            as={BiDownArrow}
                            mx={[2, 10]} pb={1} w={10}
                            h={10}/></Heading>

                        {(refillState === 2 || refillState === 3 || refillState === 4) ?

                            <Text fontSize="xl" mt={1} mb={5} textAlign="center">
                                No worries, new tokens will be on the way.
                            </Text>

                            :

                            <Text fontSize="xl" mt={1} mb={5} textAlign="center">
                                Come back here whenever you have no tokens left.
                            </Text>

                        }
                        {isMobile ? <Image w={400} mt={5} mb={3} src="assets/cybercouple2.png"
                                           alt="CYBERBUCKS"/> :
                            <Box mt={5} mb={3}>
                                <VFXImg width="400px" src="assets/cybercouple2.png" shader="rgbGlitch"/></Box>}
                        <Text fontSize="3xl" mt={5}>Token Bonus: </Text>
                        <Center mt={2}>
                            <Icon as={SiJsonwebtokens} w={50} h={50}/>
                            <Text fontSize="6xl" mx={5}>{goldBonus}</Text>
                        </Center>
                        <Box my={1} bg="white" width="17rem" height="0.1rem"/>
                        <Center>
                            <Icon as={AiOutlineClockCircle} color="brand.blue1" w={6} h={6} my={2} mx={2}/>
                            <RefillTimer userData={userData}/>
                        </Center>
                        <Text fontSize="md" mb={7}>Wait Time</Text>
                        {requestButton}
                        <SlideFade in={messageShown}>
                            <Alert status={messageType} mt={5} color="white" bg="transparent" fontSize="xl"
                                   alignItems="center"
                                   justifyContent="center">
                                <AlertIcon/>
                                {message}
                            </Alert>
                        </SlideFade>
                        <Text fontSize="xl" mt={7}>Free Refill Rates</Text>
                        <Box mx={20} mt={2}>
                            <Table variant="simple">
                                <Thead>
                                    <Tr>
                                        <Th color="white">Your Balance</Th>
                                        <Th color="white">Refill</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    <Tr>
                                        <Td fontSize="lg">up to $20</Td>
                                        <Td fontSize="xl"><Icon as={SiJsonwebtokens} w={4} h={4} pb={1}/> 25</Td>
                                    </Tr>
                                    <Tr>
                                        <Td fontSize="xl">up to $50</Td>
                                        <Td fontSize="xl"><Icon as={SiJsonwebtokens} w={4} h={4} pb={1}/> 20</Td>
                                    </Tr>
                                    <Tr>
                                        <Td fontSize="xl">more than $50</Td>
                                        <Td fontSize="xl"><Icon as={SiJsonwebtokens} w={4} h={4} pb={1}/> 15</Td>
                                    </Tr>
                                </Tbody>
                            </Table>
                        </Box>
                    </Container>
                </SlideFade>
            </Box>
        </VFXProvider>
    );
}
