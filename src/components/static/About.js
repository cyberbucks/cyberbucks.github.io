import React from 'react';
import {Box, Button, Center, Heading, Image, Img, Link, SlideFade, Text} from "@chakra-ui/react";
import {Link as ReactLink} from "react-router-dom";
import {IoMdReturnLeft} from "react-icons/all";


export default function About() {


    return (
        <SlideFade in={true} offsetY="40px">
            <Center margin="2%">
                <Image w={400} mt={12} mb={1} src="/assets/logo_en.png"/>
            </Center>
            <Center>
                <Box width="60rem" borderColor="white" borderWidth={2} background="brand.dark">
                    <Heading m={5}>ABOUT</Heading>
                    <Text style={{wordWrap: "normal"}} m={5} fontSize="xl">CYBERBUCKS is a rewards platform with a
                        twist.
                        Register and become a part of our club. No risks or deposits involved. Playing and trying your
                        luck
                        is completely free, forever. We refill your tokens needed to spin the wheel so that you can
                        keep playing.</Text>
                    <Text style={{wordWrap: "normal"}} m={5} fontSize="xl">CyberBucks is a club which gives you the
                        chance to spin the wheel and get instant cash rewards. Run out of tokens? We will give more for
                        free!</Text>
                    <Text style={{wordWrap: "normal"}} m={5} fontSize="xl">There are more ways to win! Our daily
                        jackpots
                        contain huge rewards and you just need to spin the wheel to participate. Nothing else is
                        needed.</Text>
                    <Text style={{wordWrap: "normal"}} m={5} fontSize="xl">Thank you for being a part of our
                        club.</Text>
                    <Text style={{wordWrap: "normal"}} m={5} fontSize="xl">Best of luck.</Text>
                    <Center><Img width="400px" src="/assets/cybercouple2.png"/></Center>
                    <Center><Box width="80%" background="#6c757d" mt={5} p={5} borderRadius="5px"><Text
                        textAlign="center" fontSize="lg">Default wheel of fortune payouts</Text></Box></Center>
                    <Center><Box width="80%" background="#343a40" p={5}><Text fontSize="lg">Cash: Win cash with a random
                        amount from $0.01 up to $10.00.</Text></Box></Center>
                    <Center><Box width="80%" background="#343a40" p={5}><Text fontSize="lg">Token: Win tokens with a
                        random amount from 1 to 100 tokens.</Text></Box></Center>
                    <Center><Box width="80%" background="#343a40" p={5}><Text fontSize="lg">Ticket: Win 1 entry to the
                        the daily jackpot.</Text></Box></Center>
                    <Center><Box width="80%" background="#343a40" p={5}><Text fontSize="lg">Joker: Spin Joker 3
                        consecutive times and get 1000 jackpot entries at once.</Text></Box></Center>
                    <Center><Box width="80%" background="#343a40" p={5}><Text fontSize="lg">Empty: No
                        prize.</Text></Box></Center>
                    {/*<Center><Box width="80%" background="gray" p={5}><Text fontSize="lg">Default wheel of fotrune payouts</Text></Box></Center>*/}
                    {/*<Center><Box width="80%" background="gray" p={5}><Text fontSize="lg">Default wheel of fotrune payouts</Text></Box></Center>*/}
                    <Center><Box width="80%" background="#6c757d" mb={5} p={5} borderRadius="5px"><Text
                        textAlign="center" fontSize="md">Payouts are subject to our Terms of Service and winning
                        algorithms and may vary for individual members.</Text></Box></Center>
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
