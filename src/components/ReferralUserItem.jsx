import React, {useEffect, useState} from "react";
import {Box, Flex, Spacer, Text} from "@chakra-ui/react";
import {CheckIcon, CloseIcon} from "@chakra-ui/icons";

function ReferralUserItem(props) {
    const {referralId, userName, isActive, emailVerified} = props;

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
                {emailVerified ? <CheckIcon w={6} h={6} color="green.500" mt={0.8}/>
                    : <CloseIcon w={5} h={5} color="red.500" mt={1}/>
                }
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
                <Text fontSize="lg" ml={[10, 0]}>{emailVerified ? "Email verified" : "Email not verified"}</Text>
            </Flex>
        </Box>
    );
}

export default ReferralUserItem;
