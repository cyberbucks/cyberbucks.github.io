import React from 'react';
import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Button,
    Center,
    Heading,
    Image,
    Link,
    SlideFade
} from "@chakra-ui/react";
import {Link as ReactLink} from "react-router-dom";
import {IoMdReturnLeft} from "react-icons/all";


export default function Faq() {
    return (
        <SlideFade in={true} offsetY="40px">
            <Center margin="2%">
                <Image w={400} mt={12} mb={1} src="/assets/logo_en.png"/>
            </Center>
            <Center>
                <Box width="60rem" borderColor="white" borderWidth={2}>
                    <Heading m={5}>FREQUENTLY ASKED QUESTIONS</Heading>
                    <Accordion allowMultiple allowToggle>
                        <AccordionItem>
                            <h2>
                                <AccordionButton>
                                    <Box flex="1" textAlign="left" fontSize="lg">
                                        HOW CAN I START PLAYING?
                                    </Box>
                                    <AccordionIcon/>
                                </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4} fontSize="lg">
                                Register for an account and join our club to start winning! Whenever you run out of
                                tokens,
                                we refill them for you for free, so that you can keep playing.
                            </AccordionPanel>
                        </AccordionItem>
                        <AccordionItem>
                            <h2>
                                <AccordionButton>
                                    <Box flex="1" textAlign="left" fontSize="lg">
                                        DO I NEED TO DEPOSIT MONEY?
                                    </Box>
                                    <AccordionIcon/>
                                </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4} fontSize="lg">
                                Never. No. We don't accept any deposits. We are here to offer you rewards, this is not
                                a casino!
                            </AccordionPanel>
                        </AccordionItem>
                        <AccordionItem>
                            <h2>
                                <AccordionButton>
                                    <Box flex="1" textAlign="left" fontSize="lg">
                                        WHY DID MY FREE AUTOMATIC TOKEN REFILLS DECREASE?
                                    </Box>
                                    <AccordionIcon/>
                                </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4} fontSize="lg">
                                We always have free tokens for you. However, the free token refill amount differs
                                according to your cash balance. You can get more tokens from your referrals and active
                                partners.
                            </AccordionPanel>
                        </AccordionItem>
                        <AccordionItem>
                            <h2>
                                <AccordionButton>
                                    <Box flex="1" textAlign="left" fontSize="lg">
                                        HOW TO GET MORE TOKENS?
                                    </Box>
                                    <AccordionIcon/>
                                </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4} fontSize="lg">
                                We refill your tokens every hour automatically, if you run out of them. Click on your
                                token balance and request more tokens. Inviting referrals and having active referral
                                partners increase your sources of free tokens.
                            </AccordionPanel>
                        </AccordionItem>
                        <AccordionItem>
                            <h2>
                                <AccordionButton>
                                    <Box flex="1" textAlign="left" fontSize="lg">
                                        CAN I LOSE MY CASH BALANCE?
                                    </Box>
                                    <AccordionIcon/>
                                </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4} fontSize="lg">
                                We never meddle with your cash balance! You get to keep whatever you earn. You don't
                                risk any money.
                            </AccordionPanel>
                        </AccordionItem>
                        <AccordionItem>
                            <h2>
                                <AccordionButton>
                                    <Box flex="1" textAlign="left" fontSize="lg">
                                        WHAT ARE THE WHEEL OF FORTUNE PAYOUTS?
                                    </Box>
                                    <AccordionIcon/>
                                </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4} fontSize="lg">
                                You can see our offers in the wheel in the About section.
                            </AccordionPanel>
                        </AccordionItem>
                        <AccordionItem>
                            <h2>
                                <AccordionButton>
                                    <Box flex="1" textAlign="left" fontSize="lg">
                                        HOW DOES THE WINNING ALGORITHM WORK?
                                    </Box>
                                    <AccordionIcon/>
                                </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4} fontSize="lg">
                                Our algorithm is mainly random and based on luck, with some of its parts based on your
                                activity and actions on our site. Every move and activity on our site increases your
                                chances of winning. Invite friends and family, click on ADs, play more and win more.
                                Our algorithm is as fair as possible.
                            </AccordionPanel>
                        </AccordionItem>
                        {/*<AccordionItem>*/}
                        {/*    <h2>*/}
                        {/*        <AccordionButton>*/}
                        {/*            <Box flex="1" textAlign="left" fontSize="lg">*/}
                        {/*                WHAT IS VIP STATUS?*/}
                        {/*            </Box>*/}
                        {/*            <AccordionIcon/>*/}
                        {/*        </AccordionButton>*/}
                        {/*    </h2>*/}
                        {/*    <AccordionPanel pb={4} fontSize="lg">*/}
                        {/*        You can use your Piratewins balance to buy VIP status for a certain amount of time.*/}
                        {/*        During that time you will be able to enjoy many perks including faster Gold refills,*/}
                        {/*        less advertisements, bigger offer payouts and many more!*/}
                        {/*    </AccordionPanel>*/}
                        {/*</AccordionItem>*/}
                        {/*<AccordionItem>*/}
                        {/*    <h2>*/}
                        {/*        <AccordionButton>*/}
                        {/*            <Box flex="1" textAlign="left" fontSize="lg">*/}
                        {/*                DO I NEED VIP STATUS TO CASH OUT?*/}
                        {/*            </Box>*/}
                        {/*            <AccordionIcon/>*/}
                        {/*        </AccordionButton>*/}
                        {/*    </h2>*/}
                        {/*    <AccordionPanel pb={4} fontSize="lg">*/}
                        {/*        No, all our members can win and cash out without restrictions! VIP just makes it easier*/}
                        {/*        for you to reach the payment!*/}
                        {/*    </AccordionPanel>*/}
                        {/*</AccordionItem>*/}
                        <AccordionItem>
                            <h2>
                                <AccordionButton>
                                    <Box flex="1" textAlign="left" fontSize="lg">
                                        HOW DO YOU MAKE MONEY?
                                    </Box>
                                    <AccordionIcon/>
                                </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4} fontSize="lg">
                                We make money by showing advertisements and sponsored messages. These contribute
                                directly to the prize pool and help you earn more.
                            </AccordionPanel>
                        </AccordionItem>
                        <AccordionItem>
                            <h2>
                                <AccordionButton>
                                    <Box flex="1" textAlign="left" fontSize="lg">
                                        SHOULD I DISABLE ADBLOCK FOR CYBERBUCKS?
                                    </Box>
                                    <AccordionIcon/>
                                </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4} fontSize="lg">
                                Definitely. Disabling ADBlock means we can show you ads and that provides bigger
                                prizes for our members.
                            </AccordionPanel>
                        </AccordionItem>
                        <AccordionItem>
                            <h2>
                                <AccordionButton>
                                    <Box flex="1" textAlign="left" fontSize="lg">
                                        HOW DO I PARTICIPATE IN THE JACKPOT?
                                    </Box>
                                    <AccordionIcon/>
                                </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4} fontSize="lg">
                                Spining ticket on the wheel grants you entry in the jackpot. 1 ticket is equivalent to
                                1 entry and if you spin 3 jokers consecutively, you get 1000 entries at once. There is
                                no limit to how many entries you can have. We have jackpots every day.
                            </AccordionPanel>
                        </AccordionItem>
                        <AccordionItem>
                            <h2>
                                <AccordionButton>
                                    <Box flex="1" textAlign="left" fontSize="lg">
                                        HOW MANY TICKETS DO I NEED TO HAVE IN ORDER TO WIN THE JACKPOT?
                                    </Box>
                                    <AccordionIcon/>
                                </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4} fontSize="lg">
                                Jackpot is based purely on luck. So, only 1 ticket may be enough to win. More tickets
                                mean increased chances but does not guarantee winning it.
                            </AccordionPanel>
                        </AccordionItem>
                        <AccordionItem>
                            <h2>
                                <AccordionButton>
                                    <Box flex="1" textAlign="left" fontSize="lg">
                                        WHAT IS THE DIFFERENCE BETWEEN TOKEN AND TICKETS?
                                    </Box>
                                    <AccordionIcon/>
                                </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4} fontSize="lg">
                                Tokens are needed to spin the wheel and tickets are used to enter daily jackpots.
                            </AccordionPanel>
                        </AccordionItem>
                        <AccordionItem>
                            <h2>
                                <AccordionButton>
                                    <Box flex="1" textAlign="left" fontSize="lg">
                                        WHAT DO I GET FOR 3 JOKERS IN A ROW?
                                    </Box>
                                    <AccordionIcon/>
                                </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4} fontSize="lg">
                                3 Jokers grant you 1000 Jackpot tickets.
                            </AccordionPanel>
                        </AccordionItem>
                        <AccordionItem>
                            <h2>
                                <AccordionButton>
                                    <Box flex="1" textAlign="left" fontSize="lg">
                                        WHICH COUNTRIES ARE ELLIGIBLE FOR REWARDS?
                                    </Box>
                                    <AccordionIcon/>
                                </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4} fontSize="lg">
                                Users from all countries are welcome as long as our Terms of Service comply with their
                                local laws.
                            </AccordionPanel>
                        </AccordionItem>
                        <AccordionItem>
                            <h2>
                                <AccordionButton>
                                    <Box flex="1" textAlign="left" fontSize="lg">
                                        HOW MANY ACCOUNTS CAN I REGISTER?
                                    </Box>
                                    <AccordionIcon/>
                                </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4} fontSize="lg">
                                We don't allow multiple accounts per person. Having more than one account may result
                                in a ban.
                            </AccordionPanel>
                        </AccordionItem>
                        <AccordionItem>
                            <h2>
                                <AccordionButton>
                                    <Box flex="1" textAlign="left" fontSize="lg">
                                        HOW TO WITHDRAW MY WINNINGS?
                                    </Box>
                                    <AccordionIcon/>
                                </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4} fontSize="lg">
                                Click on your cash balance to see your progress and withdrawal options. We offer payouts
                                through the most popular processors, including (but not limited to): PayPal, Bitcoin,
                                Litecoin, and Wire transfers. Some payment options may be available
                                only to select list of countries.
                            </AccordionPanel>
                        </AccordionItem>
                        <AccordionItem>
                            <h2>
                                <AccordionButton>
                                    <Box flex="1" textAlign="left" fontSize="lg">
                                        I DID NOT RECEIVE MY CONFIRMATION OR PASSWORD RESET EMAIL.
                                    </Box>
                                    <AccordionIcon/>
                                </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4} fontSize="lg">
                                If you are trying to confirm your email or reset password but the email never arrives,
                                check your junk folder and mark the message as important (move to your inbox) to ensure
                                that you will receive our communication in the future.
                            </AccordionPanel>
                        </AccordionItem>
                        <AccordionItem>
                            <h2>
                                <AccordionButton>
                                    <Box flex="1" textAlign="left" fontSize="lg">
                                        I FORGOT MY PASSWORD.
                                    </Box>
                                    <AccordionIcon/>
                                </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4} fontSize="lg">
                                You can use password reminder function (click "Forgot password" when logging in). You
                                need to be logged out to request a new password. New random password is generated and
                                shown only once, remember to save it somewhere and change after logging in!
                            </AccordionPanel>
                        </AccordionItem>
                        <AccordionItem>
                            <h2>
                                <AccordionButton>
                                    <Box flex="1" textAlign="left" fontSize="lg">
                                        THE LINK IN MY EMAIL SAYS "INCORRECT OR EXPIRED".
                                    </Box>
                                    <AccordionIcon/>
                                </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4} fontSize="lg">
                                This can happen in several occasions:
                                1. When you have already clicked that verification or password reset link before.
                                2. When you request a new link but then you click an older link in your email (which
                                arrived earlier and is no longer active).
                                In both situations just click the most recent link in your email, or request a new one
                                (you need to wait several minutes between requests).
                            </AccordionPanel>
                        </AccordionItem>
                        <AccordionItem>
                            <h2>
                                <AccordionButton>
                                    <Box flex="1" textAlign="left" fontSize="lg">
                                        DO YOU OFFER PARTNERSHIPS FOR TWITCH STREAMERS AND YOUTUBERS?
                                    </Box>
                                    <AccordionIcon/>
                                </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4} fontSize="lg">
                                Yes, we are always open to partnerships with various content creators. If you think you
                                have an audience who would be interested in CYBERBUCKS, drop us a line via
                                info@cyberbucks.io.
                            </AccordionPanel>
                        </AccordionItem>
                    </Accordion>
                    <Center m={5}><Link as={ReactLink} to="/">
                        <Button leftIcon={<IoMdReturnLeft/>} px={8} color="brand.blue1" variant="outline"
                                borderColor="brand.blue1" borderRadius="0px"
                                _hover={{color: "white", borderColor: "white"}} _active={{transform: "scale(0.98)"}}>
                            BACK TO CYBERBUCKS
                        </Button>
                    </Link></Center>
                </Box>
            </Center>
        </SlideFade>
    );
}
