import React, {useEffect, useState} from "react";
import {Box, Flex, Icon, Spacer, Text} from "@chakra-ui/react";
import {GiProtectionGlasses} from "react-icons/all";

function CrewUserItem(props) {
    const {referralId, userName, isActive, isGoldAvailable, goldWait} = props;
    const [descriptionText, setDescriptionText] = useState("Unavailable")

    useEffect(() => {
        let text
        if (!isActive) {
            text = "Inactive"
        } else {
            text = isGoldAvailable ? "Available" : "Wait for " + goldWait
        }
        setDescriptionText(text)
    })

    return (
        <Box
            py={4}
            px={[3, 12]}
            width={["100%", "100%", "100%", "65rem"]}
            maxWidth="80rem"
            borderWidth={2}
            my={2}
            boxShadow="0 0 4px #fff"
            _hover={{borderColor: "brand.blue1", boxShadow: "0 0 4px rgba(15, 155, 242, 0.4)"}}>
            <Flex direction="row">
                {/*<StarIcon w={5} h={5} color={isActive ? "green.500" : "red.500"}/>*/}
                <Icon as={GiProtectionGlasses} w={9} h={9} color={isActive ? "green.500" : "red.500"} mt={-1}/>
                <Text
                    fontWeight="bold"
                    textTransform="uppercase"
                    fontSize="lg"
                    letterSpacing="wide"
                    color="brand.blue1"
                    ml={[2, 2, 2, 6]}>
                    {userName}
                </Text>
                <Spacer display={["none", "none", "none", "block"]}
                        visibility={["hidden", "hidden", "hidden", "visible"]}/>
                <Text fontSize="lg" ml={[10, 0]}>{descriptionText}</Text>
            </Flex>
        </Box>
    );
}

export default CrewUserItem;
