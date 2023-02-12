import React, {useEffect, useRef} from 'react';
import {Box, Button, Heading, Icon, Image, Link, Stack, Text} from "@chakra-ui/react";
import {FiExternalLink} from "react-icons/all";
import {Link as ReactLink} from "react-router-dom";

function Card(props) {
    const {
        addr,
        coinPrize,
        currentVisits,
        desc,
        logo,
        minDurSec,
        sponsored,
        title,
        linkId,
        visitGoal,
        userVisited
    } = props;
    // const dynamicAddr = "website/" + linkId
    const dynamicAddr = "websiteShow?linkId=" + linkId

    const openLinkInNewTab = () => {
        window.open(dynamicAddr, "_blank")
    }

    const imgRef = useRef()

    const fixBrokenLogo = () => {
      imgRef.current.src = "https://i.imgur.com/H7oV8eK.png"
    }

    return (
        <Box
            p={4}
            display={{md: "flex"}}
            maxWidth="32rem"
            borderWidth={2}
            margin={2}
            boxShadow="0 0 10px rgba(255, 255, 255, 0.4)"
            _hover={{borderColor: "brand.blue1", boxShadow: "0 0 10px rgba(15, 155, 242, 0.4)"}}
        >

            <Box boxSize={["2xs", "sm"]}>
                {logo === "" ? <Icon as={FiExternalLink} boxSize={9}/> : <Image ref={imgRef} src={logo} onError={fixBrokenLogo} />}
            </Box>


            <Stack
                align={{base: "center", md: "stretch"}}
                textAlign={{base: "center", md: "left"}}
                mt={{base: 4, md: 0}}
                ml={{md: 6}}
            >
                <Heading
                    fontWeight="bold"
                    textTransform="uppercase"
                    fontSize="2xl"
                    letterSpacing="wide"
                >
                    {title}
                </Heading>
                <Text fontSize="lg">
                    {desc}
                </Text>
                <Text my={1} color="blue.500" fontSize="lg">
                    Visit Duration: {minDurSec} seconds
                </Text>
                <Text my={1} color="gray.500" fontSize="lg">
                    Token Prize: {coinPrize} coins
                </Text>
                <Text my={1} color="red.500" fontSize="lg">
                    {currentVisits}/{visitGoal}
                </Text>
                {userVisited ? <Button isDisabled maxWidth="200px" my={2} boxShadow="0 0 10px rgba(255, 255, 255, 0.4)"
                                       variant="outline" bg="transparent" leftIcon={<FiExternalLink/>}
                                       borderRadius="0px" size="lg">
                        Already visited
                    </Button>
                    :
                    <Link to={dynamicAddr} as={ReactLink} target="_blank">
                        <Button maxWidth="120px" my={2}
                                boxShadow="0 0 10px rgba(255, 255, 255, 0.4)"
                                variant="outline" bg="transparent" leftIcon={<FiExternalLink/>}
                                _hover={{
                                    color: "brand.purple",
                                    borderColor: "brand.purple",
                                    boxShadow: "0 0 10px rgba(95, 32, 91, 0.4)"
                                }}
                                _active={{transform: "scale(0.98)"}} borderRadius="0px"
                                size="lg">
                            Visit
                        </Button>
                    </Link>
                }
            </Stack>
        </Box>
    );
}

export default Card;
