import React from 'react';
import {
    Box,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Center,
    Flex,
    HStack,
    Icon,
    Spacer,
    Text
} from "@chakra-ui/react"
import {FaWaveSquare, GoLock, IoShieldCheckmarkOutline} from "react-icons/all";
import {Link as ReactLink} from "react-router-dom";


export default function Footer() {

    return (
        <Flex direction="column" margin="auto" mx={[2, 2, 2, 0]}>
            <Flex direction="row" className="contentContainer" mb={7} pt={10}>
                <Box bg="transparent" width={["50%", "13rem"]} height="4rem" mb={-1} ml={-1}
                     borderBottom="4px solid white"
                    // boxShadow="-2px 2px rgba(255, 255, 255, 0.4)"
                     borderLeft="4px solid white"
                    // className="neonLeftBottomBox"
                     borderRadius="0px"/>
                <Spacer/>
                <Box bg="transparent" width={["50%", "13rem"]} height="4rem" mb={-1} mr={-1}
                     borderBottom="4px solid white"
                    // boxShadow="2px 2px rgba(255, 255, 255, 0.4)"
                     borderRight="4px solid white"
                    // className="neonRightBottomBox"
                     borderRadius="0px"/>
            </Flex>
            <Flex direction="row" mx={[2, 0]}>
                <Box borderColor="white" borderWidth={2} p={2} boxShadow="0 0 10px rgba(255, 255, 255, 0.4)"
                     userSelect="none"
                     className="contentContainer">
                    <HStack my={1}><Icon as={IoShieldCheckmarkOutline} w={4} h={4}/><Icon as={GoLock} w={4} h={4}/><Text
                        fontSize="xs">VERIFIED SECURE</Text></HStack>
                    <Text fontSize="sm" textAlign="center">256 BIT ENCRYPTION</Text>
                </Box>
                <Spacer/>
                <Center>
                    <Breadcrumb separator={<FaWaveSquare/>} textAlign={["right", "left"]}>
                        <BreadcrumbItem>
                            <BreadcrumbLink as={ReactLink} to="about" color="brand.blue1">About</BreadcrumbLink>
                        </BreadcrumbItem>

                        <BreadcrumbItem>
                            <BreadcrumbLink as={ReactLink} to="faq" color="brand.blue1">F.A.Q.</BreadcrumbLink>
                        </BreadcrumbItem>

                        <BreadcrumbItem>
                            <BreadcrumbLink as={ReactLink} to="terms" color="brand.blue1">Terms</BreadcrumbLink>
                        </BreadcrumbItem>

                        <BreadcrumbItem>
                            <BreadcrumbLink as={ReactLink} to="privacy" color="brand.blue1">Privacy</BreadcrumbLink>
                        </BreadcrumbItem>
                    </Breadcrumb>
                </Center>
            </Flex>
            <Center mt={5} mb={5} mx={[2, 0]}>
                <Text wordBreak="break-word">CYBERBUCKS is a free to play gaming service operating under domain cyberbucks.github.io
                    . All policies regarding management, rewards, payment and support services related to the operation of the website
                    are disclosed in the Terms of Service section. This service does not require and does not accept any
                    form of monetary deposit. This service is not a casino or a gambling platform. This service requires
                    browser Cookies to be enabled in order to operate. Read more about Cookies in Privacy Policy
                    section. </Text>
            </Center>
            <Spacer/>
        </Flex>
    );
}
