import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Center,
    CircularProgress,
    Container,
    Flex,
    Heading,
    HStack,
    Icon, Image,
    Input,
    SimpleGrid,
    SlideFade, Table, Tbody, Td,
    Text, Th, Thead, Tr,
    useClipboard
} from "@chakra-ui/react";
import {ArrowDownIcon} from "@chakra-ui/icons";
import {getReferralData, getMockupAdData} from "../firebaseUtilities";
import ReferralUserItem from "./ReferralUserItem";
import {AiOutlineClockCircle, BiDownArrow, GiAbstract102, ImTicket, RiFileCopyFill} from "react-icons/all";
import {VFXImg, VFXProvider} from "react-vfx";
import {printText} from "../devUtilities";
import Countdown from "react-countdown";
import {DateTime} from "luxon";

export default function Sweepstakes({userData, userId}) {

    const [referralLink, setReferralLink] = useState("https://cyberbucks.io/?uid=" + userId)
    const [dataIsFetched, setDataIsFetched] = useState(false)
    const [productDataFetched, setProductDataFetched] = useState(false)
    const {hasCopied, onCopy} = useClipboard(referralLink)
    const [referralCount, setReferralCount] = useState(0)
    const [referralData, setReferralData] = useState({})
    const [prizeName, setPrizeName] = useState("product")
    const [prizeImg, setPrizeImg] = useState("/assets/womanneonglasses1.png")
    const [raffleDateString, setRaffleDateString] = useState("")

    const [width, setWidth] = useState(window.innerWidth);

    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }

    useEffect(() => {

      fetchForSweepstake()




        if (userData.referrals !== undefined) {
            // printText("Crew:userData is " + userData)
            // setReferralData(userData.referrals)
            getReferralData(userData, "referrals").then((data) => {
                if (!(data && data.constructor === Object && Object.keys(data).length === 0)) { // empty object check
                    // if (data.availableReferrals !== undefined) {
                    printText("Referrals: data is " + JSON.stringify(data))
                    if (data.availableReferrals !== undefined) {
                        delete data.availableReferrals
                    }
                    printText("Referrals: data before setReferralData " + JSON.stringify(data))
                    if (Object.keys(data).length !== 0) {
                        setReferralData(data)
                        printText("verifiedMembers " + Object.keys(data.allReferrals).length.toString())
                        setDataIsFetched(true)
                    }
                } else {
                    printText("Referrals: data is empty")
                }
                setReferralCount(data.allReferrals.length)
            })


        } else {
            setReferralCount(0)
            setDataIsFetched(true)
        }
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, [userData]);

    let isMobile = (width <= 768)

    const fetchForSweepstake = () => {

      getMockupAdData().then((data) => {



        setPrizeName(data.sweepstake.productName)
        setPrizeImg(data.sweepstake.prizeImg)
        setRaffleDateString(data.sweepstake.raffleDate)
        setProductDataFetched(true)


      }).catch((err) => {
          window.location.reload()
      })

    }

    return (
        <VFXProvider>
            <Box className="contentContainer" mx={[2, 0]}>


                <SlideFade in={true} offsetY="40px">

                  {!productDataFetched ? <Center mx={4} mt={4}>
                          <CircularProgress isIndeterminate color="brand.blue1" size="50px" trackColor="brand.sky"/></Center>
                      :

                    <Container maxW="500rem" centerContent>
                        <Heading><Icon as={BiDownArrow} mx={[4, 10]} pb={1} w={10} h={10}/>SWEEPSTAKES<Icon
                            as={BiDownArrow} mx={[4, 10]} pb={1} w={10} h={10}/></Heading>
                        <Text fontSize="xl" mt={1} mb={5} textAlign="center">Invite friends and join the sweepstakes!</Text>
                          <Text fontSize="2xl" mt={1} mb={5} textAlign="center">We're giving out a <Text as="span" color="brand.purple">{prizeName}</Text> this week!</Text>
                        <Text fontSize="2xl" fontWeight="850"  mt={1} mb={5} textAlign="center"> Every referral grants you one entry to this sweepstake.</Text>

                        {/*<Img width="400px" src="/assets/woman-6194370.png"/>*/}
                        {isMobile ? <Image w={400} mt={5} mb={3} src={prizeImg}
                                           alt="CYBERBUCKS"/> :
                            <Box mt={5} mb={3}>
                                <VFXImg width="400px" src={prizeImg} shader="rgbGlitch"/></Box>}
                    </Container> }

                </SlideFade>


                {!(dataIsFetched && productDataFetched) ? <Center mx={4} mt={4}>
                        <CircularProgress isIndeterminate color="brand.blue1" size="50px" trackColor="brand.sky"/></Center>
                    :
                    <SlideFade in={dataIsFetched} offsetY="40px">
                        <Box mt={10} mx={[1, 10]}>
                            <Table borderColor="brand.blue1" boxShadow="0 0 10px rgba(15, 155, 242, 0.4)"
                                   borderWidth="2px"
                                   mt={5} variant="unstyled">
                                <Thead>
                                    <Tr>
                                        <Th fontSize={["lg", "3xl"]} color="white" textAlign="center" px={[2, 5]} pt={8}>Your
                                            Entries</Th>
                                        <Th fontSize={["lg", "3xl"]} color="white" textAlign="center" px={[2, 5]}
                                            pt={8}>Sweepstake Prize</Th>
                                        <Th fontSize={["lg", "3xl"]} color="white" textAlign="center" px={[2, 5]} pt={8}>Time
                                            Remaining</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    <Tr textAlign="center">
                                        <Td fontSize={["lg", "3xl"]} textAlign="center">{referralCount} <Icon
                                            as={ImTicket} mr={3} pb={1}/></Td>
                                          <Td fontSize={["lg", "3xl"]} textAlign="center">{prizeName}</Td>
                                        <Td fontSize={["lg", "3xl"]} textAlign="center"><Icon as={AiOutlineClockCircle}
                                                                                              mr={3} pb={1}/><Countdown
                                            date={raffleDateString}/></Td>
                                    </Tr>
                                </Tbody>
                            </Table>
                            <Center>
                                <HStack spacing="6px">
                                    <ArrowDownIcon w={6} h={6}/><Text fontSize="xl">Your referral
                                    link</Text><ArrowDownIcon
                                    w={6} h={6}/>
                                </HStack>
                            </Center>
                            <Flex mt={3} mb={10}>
                                <Input w="100%" p={4} color="white" mx={5} borderBottom="2px solid white"
                                       bg="transparent"
                                       boxShadow="0 10px rgba(255, 255, 255, 0.4)"
                                       border="transparent" borderRadius="0px"
                                       value={referralLink} isReadOnly placeholder="Referral Link"
                                       style={{wordWrap: "normal"}} fontSize="xl"
                                       _active={{borderColor: "brand.blue"}}/>
                                <Button onClick={onCopy} py={4} px={8} ml={4} variant="outline" bg="transparent"
                                        boxShadow="0 0 10px rgba(255, 255, 255, 0.4)"
                                        leftIcon={<RiFileCopyFill/>}
                                        borderRadius="0px"
                                        _hover={{
                                            color: "brand.purple",
                                            borderColor: "brand.purple",
                                            boxShadow: "0 0 10px rgba(95, 32, 91, 0.4)"
                                        }}
                                        _active={{transform: "scale(0.98)"}}
                                        size="lg">
                                    {hasCopied ? "Copied" : "Copy Referral Link"}
                                </Button>
                            </Flex>
                        </Box>
                    </SlideFade>
                }
                {dataIsFetched &&
                [referralCount === 0 ?
                    <SlideFade in={dataIsFetched} offsetY="40px">
                        <Box><Text fontSize="xl" textAlign="center">You don't have any referrals.</Text></Box>
                    </SlideFade>
                    :
                    <SlideFade in={dataIsFetched} offsetY="40px">
                        <Box>
                            <Text textAlign="center">{referralCount} referrals</Text>
                            <Center>
                                <SimpleGrid columns={1}>
                                    {Object.keys(referralData.allReferrals).map(function (key, index) {
                                        const {
                                            referralId,
                                            userName,
                                            isActive,
                                            emailVerified
                                        } = referralData.allReferrals[key];
                                        return (
                                            <ReferralUserItem
                                                key={index}
                                                referralId={referralId}
                                                userName={userName}
                                                isActive={isActive}
                                                emailVerified={emailVerified}
                                                linkId={key}/>
                                        );
                                    })}
                                </SimpleGrid>
                            </Center>
                        </Box>
                    </SlideFade>
                ]
                }
            </Box>
        </VFXProvider>
    )
}
