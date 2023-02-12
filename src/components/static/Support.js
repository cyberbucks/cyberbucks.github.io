import React from 'react';
import {Box, Container, Heading, Icon, Link, SlideFade, Text} from "@chakra-ui/react";
import {BiDownArrow} from "react-icons/all";
import {Link as ReactLink} from "react-router-dom";


export default function Support() {


    return (
        <SlideFade in={true} offsetY="40px">
            <Box className="contentContainer" mx={[2, 0]}>
                <Container maxW="80rem" centerContent>
                    <Heading textAlign="center"><Icon as={BiDownArrow} mr={10} pb={1} w={10} h={10}/>SUPPORT<Icon
                        as={BiDownArrow} ml={10} pb={1} w={10} h={10}/></Heading>
                    <Text fontSize="xl" my={2}>IMPORTANT: Please read <Link as={ReactLink} to="/faq"
                                                                            color="brand.blue1">F.A.Q.</Link> and <Link
                        as={ReactLink} to="/about" color="brand.blue1">About</Link> sections before creating a
                        ticket.</Text>
                    <Text fontSize="xl" my={2}>At the moment we only answer requests in English.</Text>
                    <Box borderColor="brand.blue1" borderWidth="2px" p={5} my={5} mx={8}><Text fontSize="xl" my={2}
                                                                                               textAlign="center">Please
                        note that due to high user activity it may take some time for the support to answer your
                        questions. Contact us only if you cannot find the information in About and FAQ sections. Thank
                        you for your patience and understanding!</Text></Box>
                    <Box borderColor="brand.purple" borderWidth="2px" p={5} my={3} mx={8}><Text fontSize="xl" my={2}
                                                                                                textAlign="center">Support
                        is temporarily offline due to high number of requests. We will be back soon.</Text></Box>
                </Container>
            </Box>
        </SlideFade>
    );
}
