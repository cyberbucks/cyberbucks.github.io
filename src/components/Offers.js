import React, {useEffect, useState} from 'react';
import {addCoins, getReferralData, updateReferralGoldCollection} from "../firebaseUtilities";
import Iframe from 'react-iframe'
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


    const [dataIsFetched, setDataIsFetched] = useState(false)
    const [offerWallLink, setOfferWallLink] = useState("")




    const [width, setWidth] = useState(window.innerWidth);

    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }

    useEffect(() => {

        var tempOfferWallLink = "https://wall.adgaterewards.com/oKeVqA/" + userId
        setOfferWallLink(tempOfferWallLink)
        setDataIsFetched(true)

        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, [userData, userId]);

    let isMobile = (width <= 768)

    return (
        <VFXProvider>
            <Box className="contentContainer" mx={[2, 0]}>
                <SlideFade in={true} offsetY="40px">
                    <Container maxW="500rem" centerContent>
                        <Heading><Icon as={BiDownArrow} mx={[4, 10]} pb={1} w={10} h={10}/>OFFERS<Icon as={BiDownArrow}
                                                                                                     mx={[4, 10]}
                                                                                                     pb={1} w={10}
                                                                                                     h={10}/></Heading>
                        <Text fontSize="xl" my={2}>Receive free tokens by completing the offers below.</Text>
                        <Text fontSize="xl" mt={1} mb={5}>Use only real information and follow the instructions carefully! Some offers may take time to get counted after completion. </Text>
                        {/*<Img width="400px" src="/assets/woman-6175236.png"/>*/}

                    </Container>
                </SlideFade>

                {!dataIsFetched ?
                    <Center mx={4} mt={4}><CircularProgress isIndeterminate color="brand.blue1" size="50px"
                                                            trackColor="brand.sky"/></Center>
                    :
                    <Box>


                    <Iframe url={offerWallLink}
                            width="450px"
                            height="450px"
                            id="myId"
                            className="iframeContainer"
                            display="initial"
                            position="relative"/>
                    </Box>
                }
            </Box>
        </VFXProvider>
    );
}
