import React from 'react';
import {Box, Button, Center, Heading, Icon, Image, Img, Link, SlideFade, Text} from "@chakra-ui/react";
import {Link as ReactLink} from "react-router-dom";
import {AiOutlineWarning, BiError, IoMdReturnLeft} from "react-icons/all";


export default function NotFound() {


    return (
        <SlideFade in={true} offsetY="40px">
            <Center margin="2%">
                <Image w={400} mt={12} mb={1} src="/assets/logo_en.png"/>
            </Center>
            <Center>
                <Box width="60rem" borderColor="white" borderWidth={2}>
                    <Center mt={5}><Icon h={50} w={50} as={AiOutlineWarning}/></Center>
                    <Heading m={5} textAlign="center">PAGE NOT FOUND</Heading>
                    <Center mb={5}><Link as={ReactLink} to="/">
                        <Button leftIcon={<IoMdReturnLeft/>} px={8} color="brand.blue1" variant="outline"
                                borderColor="brand.blue1"
                                borderRadius="0px"
                                _hover={{color: "white", borderColor: "white"}}
                                _active={{transform: "scale(0.98)"}}>
                            BACK TO CYBERBUCKS
                        </Button>
                    </Link></Center>
                </Box>
            </Center>
        </SlideFade>
    );
}
