import React, {useEffect, useState} from 'react';
import {addCoins, getReferralData, updateReferralGoldCollection} from "../firebaseUtilities";
import {
    Box,
    Button,
    Center,
    CircularProgress,
    Container,
    Heading,
    HStack,
    Icon, Image,
    SimpleGrid,
    SlideFade,
    Text
} from "@chakra-ui/react";
import CrewUserItem from "./CrewUserItem";
import {BiDownArrow} from "react-icons/all";
import {VFXImg, VFXProvider} from "react-vfx";
import {printText} from "../devUtilities";

export default function Crew({userData, userId}) {

    const [referralData, setReferralData] = useState({})
    const [availableReferralIds, setAvailableReferralIds] = useState([])
    const [dataIsFetched, setDataIsFetched] = useState(false)
    const [verifiedMembers, setVerifiedMembers] = useState(0)
    const [isCollectGoldActive, setIsCollectGoldActive] = useState(false)

    const collectGold = () => {
        addCoins(userId, availableReferralIds.size)
        for (const referralId of availableReferralIds) {
            updateReferralGoldCollection(userId, referralId)
        }
    }

    const [width, setWidth] = useState(window.innerWidth);

    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }

    useEffect(() => {
        if (userData.referrals !== undefined) {
            // printText("Crew:userData is " + userData)
            // setReferralData(userData.referrals)
            getReferralData(userData, "crew").then((data) => {
                if (!(data && data.constructor === Object && Object.keys(data).length === 0)) { // empty object check
                    // if (data.availableReferrals !== undefined) {
                    printText("Crew: data is " + JSON.stringify(data))
                    if (data.availableReferrals !== undefined) {
                        printText("Crew: availableReferrals is defined")
                        setAvailableReferralIds(data.availableReferrals)
                        setIsCollectGoldActive(true)
                        delete data.availableReferrals
                        printText("Crew: availableReferrals deleted")
                    } else {
                        printText("Crew: no available referrals")
                        setAvailableReferralIds([0])
                        setIsCollectGoldActive(false)
                    }
                    printText("Crew: data before setReferralData " + JSON.stringify(data))
                    if (Object.keys(data).length !== 0) {
                        setReferralData(data)
                        printText("verifiedMembers " + Object.keys(data.allReferrals).length.toString())
                        setVerifiedMembers(Object.keys(data.allReferrals).length)
                        setDataIsFetched(true)
                    }
                } else {
                    printText("Crew: data is empty")
                }
            })
        } else {
            setAvailableReferralIds([0])
            setIsCollectGoldActive(false)
            setVerifiedMembers(-1)
            setDataIsFetched(true)
        }
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, [userData]);

    let isMobile = (width <= 768)

    return (
        <VFXProvider>
            <Box className="contentContainer" mx={[2, 0]}>
                <SlideFade in={true} offsetY="40px">
                    <Container maxW="500rem" centerContent>
                        <Heading><Icon as={BiDownArrow} mx={[4, 10]} pb={1} w={10} h={10}/>CREW<Icon as={BiDownArrow}
                                                                                                     mx={[4, 10]}
                                                                                                     pb={1} w={10}
                                                                                                     h={10}/></Heading>
                        <Text fontSize="xl" my={2}>Get tokens for each verified partner.</Text>
                        <Text fontSize="xl" mt={1} mb={5}>Get a token every 24 hours as long as they confirm email and
                            stay
                            active!</Text>
                        {/*<Img width="400px" src="/assets/woman-6175236.png"/>*/}
                        {isMobile ? <Image w={400} mt={5} mb={3} src="/assets/crewphoto.png"
                                                     alt="CYBERBUCKS"/> :
                            <Box mt={5} mb={3}>
                        <VFXImg width="400px" src="/assets/crewphoto.png" shader="rgbGlitch"/></Box>}
                    </Container>
                </SlideFade>

                {!dataIsFetched ?
                    <Center mx={4} mt={4}><CircularProgress isIndeterminate color="brand.blue1" size="50px"
                                                            trackColor="brand.sky"/></Center>
                    :
                    [verifiedMembers === -1 ?
                        <SlideFade in={dataIsFetched} offsetY="40px">
                            <Container maxW="80rem" centerContent mx={4} mt={4}>
                                <Text fontSize="xl" textAlign="center">You don't have any verified members.</Text>
                            </Container>
                        </SlideFade>
                        :
                        <SlideFade in={dataIsFetched} offsetY="40px">
                            <Container maxW="80rem" centerContent mx={4} mt={4}>
                                <Text fontSize="xl">{verifiedMembers} verified members</Text>
                                <SimpleGrid columns={1}>
                                    {Object.keys(referralData.allReferrals).map(function (key, index) {
                                        const {
                                            referralId,
                                            userName,
                                            isActive,
                                            isGoldAvailable,
                                            goldWait
                                        } = referralData.allReferrals[key];
                                        return (
                                            <CrewUserItem
                                                key={index}
                                                referralId={referralId}
                                                userName={userName}
                                                isActive={isActive}
                                                isGoldAvailable={isGoldAvailable}
                                                goldWait={goldWait}
                                                linkId={key}/>
                                        );
                                    })}
                                </SimpleGrid>
                                <HStack spacing={30} mt={5}>
                                    <Text fontSize="2xl">Total Tokens:
                                        {isCollectGoldActive ? [availableReferralIds.length] : " 0"}</Text>
                                    <Button onClick={collectGold} isDisabled={!isCollectGoldActive}
                                            boxShadow="0 0 10px rgba(255, 255, 255, 0.4)"
                                            variant="outline" py={4} px={8}
                                            _hover={{
                                                color: "brand.purple",
                                                borderColor: "brand.purple",
                                                boxShadow: "0 0 10px rgba(95, 32, 91, 0.4)"
                                            }}
                                            _active={{transform: "scale(0.98)"}}
                                            size="lg" borderRadius="0px"
                                    >Collect Token</Button>
                                </HStack>
                            </Container>
                        </SlideFade>]
                }
            </Box>
        </VFXProvider>
    );
}
