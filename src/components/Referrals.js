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
    SlideFade,
    Text,
    useClipboard
} from "@chakra-ui/react";
import {ArrowDownIcon} from "@chakra-ui/icons";
import {getReferralData} from "../firebaseUtilities";
import ReferralUserItem from "./ReferralUserItem";
import {BiDownArrow, RiFileCopyFill} from "react-icons/all";
import {VFXImg, VFXProvider} from "react-vfx";
import {printText} from "../devUtilities";

export default function Referrals({userData, userId}) {

    const [referralLink, setReferralLink] = useState("https://cyberbucks.io/?uid=" + userId)
    const [dataIsFetched, setDataIsFetched] = useState(false)
    const {hasCopied, onCopy} = useClipboard(referralLink)
    const [referralCount, setReferralCount] = useState(0)
    const [referralData, setReferralData] = useState({})

    const [width, setWidth] = useState(window.innerWidth);

    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }

    useEffect(() => {
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

    return (
        <VFXProvider>
            <Box className="contentContainer" mx={[2, 0]}>
                <SlideFade in={true} offsetY="40px">
                    <Container maxW="500rem" centerContent>
                        <Heading><Icon as={BiDownArrow} mx={[4, 10]} pb={1} w={10} h={10}/>REFERRALS<Icon
                            as={BiDownArrow} mx={[4, 10]} pb={1} w={10} h={10}/></Heading>
                        <Text fontSize="xl" mt={1} mb={5} textAlign="center">Need more tokens? Invite new partners and
                            get free tokens!</Text>
                        {/*<Img width="400px" src="/assets/woman-6194370.png"/>*/}
                        {isMobile ? <Image w={400} mt={5} mb={3} src="/assets/womanneonglasses1.png"
                                           alt="CYBERBUCKS"/> :
                            <Box mt={5} mb={3}>
                                <VFXImg width="400px" src="/assets/womanneonglasses1.png" shader="rgbGlitch"/></Box>}
                    </Container>
                </SlideFade>

                {!dataIsFetched ? <Center mx={4} mt={4}>
                        <CircularProgress isIndeterminate color="brand.blue1" size="50px" trackColor="brand.sky"/></Center>
                    :
                    <SlideFade in={dataIsFetched} offsetY="40px">
                        <Box mt={10} mx={10}>
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
