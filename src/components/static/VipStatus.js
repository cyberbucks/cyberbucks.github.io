import React from 'react';
import {Box, Flex, Heading, Icon, SlideFade, Spacer} from "@chakra-ui/react";
import {BiDownArrow} from "react-icons/all";


export default function VipStatus() {


    return (
        <SlideFade in={true} offsetY="40px">
        <Box>

            <Heading textAlign="center"><Icon as={BiDownArrow} mr={10} pb={1} w={10} h={10}/>VIP STATUS<Icon as={BiDownArrow} ml={10} pb={1} w={10} h={10}/></Heading>
        </Box>
        </SlideFade>
    );
}
