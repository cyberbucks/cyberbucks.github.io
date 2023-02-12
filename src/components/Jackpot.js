import React, {useEffect, useState} from 'react';
import {getJackpotData} from "../firebaseUtilities";
import {
    Box,
    Center,
    CircularProgress,
    Container,
    Flex,
    Heading,
    Icon, Image,
    SlideFade,
    Spacer,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr
} from "@chakra-ui/react"
import {DateTime} from "luxon";
import Countdown from "react-countdown";
import {AiOutlineClockCircle, BiDownArrow, FaUserAlt, GiAbstract102, ImTicket} from "react-icons/all";
import {VFXImg, VFXProvider} from "react-vfx";
import {printText} from "../devUtilities";

export default function Jackpot({userData, isForDashboard}) { //a smaller portion of the Jackpot component is used at the Wheel page, we divide that part using the "isForDashboard" prop

    const [jackpotData, setJackpotData] = useState({})
    const [myUserData, setMyUserData] = useState({})
    const [loading, setLoading] = useState(true)


    //data that needs to be fetched for this page;
    //jackpot winners of last x days (username, ticketCount, xDaysAgo, jackpotPrize)
    //how many entries the visitor has for the jackpot to be drawn
    //prize of the jackpot to be drawn
    //time remaining until the draw of the next jackpot/jackpot to be drawn
    //how many entries the jackpot to be drawn has
    //how many jokers the visitor has

    const [width, setWidth] = useState(window.innerWidth);

    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }

    useEffect(() => {
        printText("tickets: " + userData.tickets)
        setMyUserData(userData)
        fetchJackpotAndUserData()

        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, [userData]);

    let isMobile = (width <= 768)

    const fetchJackpotAndUserData = () => {
        getJackpotData().then((data) => {
            setJackpotData(data)
            setLoading(false)
        })


    }


    return (
        <VFXProvider>
            <Box className="contentContainer" mx={[2, 0]}>
                <SlideFade in={true} offsetY="40px">
                    <Container maxW="500rem" centerContent>
                        <Heading mb={1}><Icon as={BiDownArrow} mx={[3, 10]} pb={1} w={10} h={10}/>
                            DAILY JACKPOT<Icon as={BiDownArrow} mx={[3, 10]} pb={1} w={10} h={10}/></Heading>
                        {isMobile ? <Image w={400} mt={5} mb={3} src="/assets/cyberman.png"
                                           alt="CYBERBUCKS"/> :
                            <Box mt={5} mb={3}>
                                <VFXImg width="400px" src="/assets/cyberman.png" shader="rgbGlitch"/></Box>}
                    </Container>
                </SlideFade>
                {loading ? <Center mx={4} mt={4}>
                        <CircularProgress isIndeterminate color="brand.blue1" size="50px" trackColor="brand.sky"/></Center>
                    :
                    <SlideFade in={!loading} offsetY="40px">
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


                            {isForDashboard ? <Box/>
                                :
                                <Box mt={5}>
                                    <Text fontSize="xl" textAlign="center" mt={8} mb={5}>Daily Jackpot Winners</Text>
                                    <Center>
                                        <ul>
                                            {jackpotData.pastJackpots.map((jackpot, index) =>
                                                <Box
                                                    key={index}
                                                    py={4}
                                                    px={[2, 12]}
                                                    width={["100%", "65rem"]}
                                                    maxWidth="80rem"
                                                    borderWidth={2}
                                                    my={2}
                                                    boxShadow="0 0 10px rgba(255, 255, 255, 0.4)"
                                                    _hover={{
                                                        borderColor: "brand.blue1",
                                                        boxShadow: "0 0 10px rgba(15, 155, 242, 0.4)"
                                                    }}>
                                                    <Flex direction="row">
                                                        <Icon as={FaUserAlt} w={5} h={5}/>
                                                        <Text
                                                            fontWeight="bold"
                                                            textTransform="uppercase"
                                                            fontSize="lg"
                                                            letterSpacing="wide"
                                                            color="brand.blue1"
                                                            ml={6}>
                                                            {jackpot.userName}
                                                        </Text>
                                                        <Spacer/>
                                                        <Text fontSize="lg">{jackpot.ticketCount} tickets</Text>
                                                        <Spacer/>
                                                        {/*<Text fontSize="lg">{timeAgo(jackpot.date)}</Text>*/}
                                                        {/*<Spacer/>*/}
                                                        <Text fontSize="lg">Prize: ${jackpot.prize}</Text>
                                                    </Flex>
                                                </Box>
                                            )}
                                        </ul>
                                    </Center>
                                    <Text fontSize="xl" textAlign="center" mt={8} mb={5}>Jackpot Rules</Text>
                                    <Text fontSize="lg" mx={[2, 0]}>You participate in the jackpot if you spin at least
                                        1 ticket on the
                                        wheel. 1 ticket is 1 entry. If you spin 3 jokers in a row, 1000 tickets
                                        (entries)
                                        are added to your ticket balance immediately. You can have unlimited amount of
                                        tickets for each jackpot but this number resets as soon as the jackpot ends and
                                        somebody wins it. We currently have one jackpot every 24 hours. Only one winning
                                        ticket is chosen randomly. There are chances to win for everyone who has at
                                        least
                                        one ticket. Having more tickets increases your chances but does not guarantee
                                        winning.</Text>
                                </Box>

                            }


                        </Box>
                    </SlideFade>


                }
                {/*<button onClick={() => getJackpotData()}>GET JACKPOT DATA</button>*/}
            </Box>
        </VFXProvider>
    );
}
