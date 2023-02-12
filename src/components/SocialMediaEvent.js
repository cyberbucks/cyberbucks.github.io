import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Center,
    CircularProgress,
    Container,
    Heading,
    Icon,
    Image,
    Link,
    ListItem,
    SlideFade,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    UnorderedList
} from "@chakra-ui/react";
import {getMockupAdData} from "../firebaseUtilities";
import {
    AiOutlineClockCircle,
    BiDownArrow,
    FaFacebook,
    FaYoutube,
    ImTicket,
    IoCheckmarkDoneSharp,
    RiInstagramFill,
    SiJsonwebtokens,
    SiTiktok,
    SiTwitter
} from "react-icons/all";
import {VFXImg, VFXProvider} from "react-vfx";
import Countdown from "react-countdown";

export default function SocialMediaEvent({userData, userId}) {

    const [dataIsFetched, setDataIsFetched] = useState(false)
    const [raffleDateString, setRaffleDateString] = useState("")
    const [eventEnglishTicket, setEventEnglishTicket] = useState(0)
    const [eventEnglishToken, setEventEnglishToken] = useState(0)
    const [eventNativeTicket, setEventNativeTicket] = useState(0)
    const [eventNativeToken, setEventNativeToken] = useState(0)
    const [width, setWidth] = useState(window.innerWidth);

    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }

    useEffect(() => {
        fetchForEvent()
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    });

    let isMobile = (width <= 768)

    const fetchForEvent = () => {
        getMockupAdData().then((data) => {
            setRaffleDateString(data.event.date)
            setEventEnglishTicket(data.event.englishTicket)
            setEventEnglishToken(data.event.englishToken)
            setEventNativeTicket(data.event.nativeTicket)
            setEventNativeToken(data.event.nativeToken)
            setDataIsFetched(true)
        }).catch((err) => {
            window.location.reload()
        })
    }

    return (
        <VFXProvider>
            <Box className="contentContainer" mx={[2, 0]}>
                <SlideFade in={true} offsetY="40px">
                    {!setDataIsFetched ? <Center mx={4} mt={4}>
                            <CircularProgress isIndeterminate color="brand.blue1" size="50px"
                                              trackColor="brand.sky"/></Center>
                        :
                        <Container maxW="500rem" centerContent>
                            <Heading><Icon as={BiDownArrow} mx={[4, 10]} pb={1} w={10} h={10}/>SOCIAL MEDIA EVENT<Icon
                                as={BiDownArrow} mx={[4, 10]} pb={1} w={10} h={10}/></Heading>
                            <Text fontSize="xl" mt={1} mb={5} textAlign="center">Spread the word!</Text>
                            <Text fontSize="2xl" mt={1} mb={5} textAlign="center">Share a video of our website on YouTube, TikTok, Instagram, Facebook or Twitter and earn
                                token and ticket rewards!</Text>
                            <Text fontSize="2xl" fontWeight="850" mt={1} mb={5} textAlign="center">
                                <Link
                                    color="brand.purple"
                                    to='#'
                                    onClick={(e) => {
                                        window.location = "mailto:info@cyberbucks.io";
                                        e.preventDefault();
                                    }}
                                >
                                    Send us an email
                                </Link> with the link of your post.</Text>

                            {/*<Img width="400px" src="/assets/woman-6194370.png"/>*/}
                            {isMobile ? <Image w={400} mt={5} mb={3} src="/assets/event.png"
                                               alt="CYBERBUCKS"/> :
                                <Box mt={5} mb={3}>
                                    <VFXImg width="400px" src="/assets/event.png" shader="rgbGlitch"/></Box>}
                        </Container>}
                </SlideFade>

                {!dataIsFetched ? <Center mx={4} mt={4}>
                        <CircularProgress isIndeterminate color="brand.blue1" size="50px" trackColor="brand.sky"/></Center>
                    :
                    <SlideFade in={dataIsFetched} offsetY="40px">
                        <Box mt={10} mx={[1, 10]}>
                            <Text fontSize="2xl" mt={1} mb={5} textAlign="center">
                                Upload a video of our website on YouTube, TikTok, Instagram, Facebook or Twitter in English or in your native language.
                                Then, <Link color="brand.purple" to='#' onClick={(e) => {
                                window.location = "mailto:info@cyberbucks.io";
                                e.preventDefault();
                            }}>
                                send us an email
                            </Link> with the link of your post.</Text>
                            <Center mt={1} mb={5}><Link to='#'
                                          onClick={(e) => {
                                              window.location = "mailto:info@cyberbucks.io";
                                              e.preventDefault();
                                          }}><Text fontSize="2xl" textAlign="center" fontWeight="850" as='u'>
                                Email: info@cyberbucks.io</Text></Link></Center>
                            <Center>
                                <Link color="brand.purple" to='#'
                                      onClick={(e) => {
                                          window.location = "mailto:info@cyberbucks.io";
                                          e.preventDefault();
                                      }}>
                                    <Button py={4} px={8} variant="outline" bg="transparent"
                                            boxShadow="0 0 10px rgba(255, 255, 255, 0.4)"
                                            leftIcon={<IoCheckmarkDoneSharp size={32}/>}
                                            borderRadius="0px"
                                            _hover={{
                                                color: "brand.purple",
                                                borderColor: "brand.purple",
                                                boxShadow: "0 0 10px rgba(95, 32, 91, 0.4)",
                                                transform: "scale(1.2)"
                                            }}
                                            _active={{transform: "scale(0.9)"}}
                                            size="lg">
                                        Send Us Your Link!
                                    </Button></Link></Center>
                            <Table borderColor="brand.blue1" boxShadow="0 0 10px rgba(15, 155, 242, 0.4)"
                                   borderWidth="2px"
                                   mt={5} mb={3} variant="unstyled">
                                <Thead>
                                    <Tr>
                                        <Th fontSize={["lg", "3xl"]} color="white" textAlign="left" px={[2, 5]}
                                            pt={8}>Reward</Th>
                                        <Th fontSize={["lg", "3xl"]} color="white" textAlign="center" px={[2, 5]}
                                            pt={8}>Time
                                            Remaining</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    <Tr textAlign="center">
                                        <Td fontSize={["lg", "3xl"]} textAlign="left" pr={-2}>
                                            English Video: {eventEnglishTicket} <Icon
                                            as={ImTicket} mr={3} pb={1}/> and {eventEnglishToken} <Icon
                                            as={SiJsonwebtokens} mx={1} pb={1}/></Td>
                                        <Td fontSize={["lg", "3xl"]} textAlign="center"><Icon as={AiOutlineClockCircle}
                                                                                              mr={3} pb={1}/><Countdown
                                            date={raffleDateString}/></Td>
                                    </Tr>
                                    <Tr textAlign="center">
                                        <Td fontSize={["lg", "3xl"]} textAlign="left" pr={-2}>
                                            Native Language Video: {eventNativeTicket} <Icon
                                            as={ImTicket} mr={3} pb={1}/> and {eventNativeToken} <Icon
                                            as={SiJsonwebtokens} mx={1} pb={1}/></Td>
                                        <Td fontSize={["lg", "3xl"]} textAlign="center"/>
                                    </Tr>
                                    <Tr textAlign="center">
                                        <Td fontSize={["lg", "3xl"]} textAlign="left" pr={-2}><Text as="u">
                                            <Text as="b">AND + 300 <Icon
                                            as={ImTicket} mr={3} pb={1}/> and 300 <Icon
                                            as={SiJsonwebtokens} mx={1} pb={1}/> per 1k Views</Text></Text></Td>
                                        <Td fontSize={["lg", "3xl"]} textAlign="center"/>
                                    </Tr>
                                </Tbody>
                            </Table>
                            <Table borderWidth="0px" mt={5} mb={3} variant="unstyled">
                                <Thead>
                                    <Tr>
                                        <Th fontSize={["lg", "3xl"]} color="white" textAlign="center"/>
                                        <Th fontSize={["lg", "3xl"]} color="white" textAlign="center"/>
                                        <Th fontSize={["lg", "3xl"]} color="white" textAlign="center">
                                            Eligible Platforms</Th>
                                        <Th fontSize={["lg", "3xl"]} color="white" textAlign="center"/>
                                        <Th fontSize={["lg", "3xl"]} color="white" textAlign="center"/>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    <Tr textAlign="center">
                                        <Td fontSize={["lg", "3xl"]} textAlign="center">
                                            YouTube <Icon as={FaYoutube}/></Td>
                                        <Td fontSize={["lg", "3xl"]} textAlign="center">
                                            TikTok <Icon as={SiTiktok}/></Td>
                                        <Td fontSize={["lg", "3xl"]} textAlign="center">
                                            Instagram <Icon as={RiInstagramFill}/></Td>
                                        <Td fontSize={["lg", "3xl"]} textAlign="center">
                                            Facebook <Icon as={FaFacebook}/></Td>
                                        <Td fontSize={["lg", "3xl"]} textAlign="center">
                                            Twitter <Icon as={SiTwitter}/></Td>
                                    </Tr>
                                </Tbody>
                            </Table>
                            <Text fontSize={["md", "xl"]} textAlign="left" mt={10} mb={1}>Event Rules</Text>
                            <UnorderedList fontSize={["md", "xl"]}>
                                <ListItem >You must create a video with the title in English if you are uploading to YouTube.</ListItem>
                                <ListItem >You participate in the event if you share a video on
                                    any eligible platform
                                    and email us the link of the post.</ListItem>
                                <ListItem>Your entry must be shared publicly and must not be removed
                                at least until the event ends.</ListItem>
                                <ListItem>You must have an active CyberBucks user account.</ListItem>
                                <ListItem>After the event is over, our team will review entries
                                    and will reward you if the conditions are met.</ListItem>
                            </UnorderedList>
                        </Box>
                    </SlideFade>
                }
            </Box>
        </VFXProvider>
    )
}
