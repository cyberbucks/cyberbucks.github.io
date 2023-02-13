import React from 'react';
import {Box, Button, Center, Heading, Image, Link, SlideFade, Text} from "@chakra-ui/react";
import {Link as ReactLink} from "react-router-dom";
import {IoMdReturnLeft} from "react-icons/all";


export default function Privacy() {


    return (
        <SlideFade in={true} offsetY="40px">
            <Center margin="2%">
                <Image w={400} mt={12} mb={1} src="/assets/logo_en.png"/>
            </Center>
            <Center>
                <Box width="60rem" borderColor="white" borderWidth={2}>
                    <Heading m={5}>PRIVACY POLICY NOTICE</Heading>
                    <Text ml={5}>Last Updated: 2021-09-09</Text>
                    <Box m={5}><Text fontSize="md">
                        CyberHunt ("Company", "we", "us", "our") is committed to protecting your personal information
                        and your right to privacy. If you have any questions or concerns about this privacy notice, or
                        our practices with regards to your personal information, please contact us.
                    </Text><Text fontSize="md">
                        When you visit our website (the "Website"), and more generally, use any of our services (the
                        "Services", which include the Website), we collect and use as little personal information as
                        possible to ensure fluent working of our Services. We take your privacy very seriously. In this
                        privacy notice, we explain you iwhat information we collect, how we use it and what rights you
                        have in relation to it. We hope you take some time to read through it carefully, as it is
                        important. If there are any terms in this privacy notice that you do not agree with, please
                        discontinue use of our Services immediately.
                    </Text><Text fontSize="md">
                        This privacy notice applies to all information collected through our Services (which, as
                        described above, includes our Website an Mobile Application), as well as, any related services,
                        sales, marketing or events.
                    </Text><Text fontSize="md">
                        Please read this privacy notice carefully.
                    </Text><Text fontSize="md">
                        This privacy notice complements our Terms of Service.
                    </Text><Text fontSize="lg" mt={5}>
                        INFORMATION COLLECTION
                    </Text><Text fontSize="md">
                        We collect personal information that you willingly provide to us when you participate in
                        activities on the Website or otherwise when you contact us.
                    </Text><Text fontSize="md">
                        The personal information that we collect depends on the context of your interactions with us and
                        the Website, the choices you make and the features you use. The personal information we collect
                        may include the following: your chosen username, hash of your chosen password (one-way encoded
                        and not visible to any party), email address, payment information (required to pay out rewards),
                        IP address.
                    </Text><Text fontSize="md">
                        All personal information that you provide to us must be true, complete and accurate, and you
                        must notify us of any changes to such personal information.
                    </Text><Text fontSize="md">
                        Some information — such as your Internet Protocol (IP) address and/or browser and device
                        characteristics — is collected automatically when you visit our Website.
                    </Text><Text fontSize="md">
                        Some information (your browser characteristics and IP address) is collected automatically by
                        third parties including Cloudflare.inc and Google.inc.
                    </Text><Text fontSize="md">
                        We automatically collect certain information when you visit, use or navigate the Website. This
                        information does not reveal your specific identity (like your name or contact information) but
                        may include device and usage information, such as your IP address, browser and device
                        characteristics, operating system, language preferences, referring URLs, device name, country,
                        location, information about how and when you use our Website and other technical information.
                        This information is needed to maintain the security and operation of our Website, and for our
                        internal analytics and reporting purposes.
                    </Text><Text fontSize="md">
                        We also collect information through cookies and similar technologies.
                    </Text><Text fontSize="lg" mt={5}>
                        INFORMATION SHARING
                    </Text><Text fontSize="md">
                        We only share information with your consent, to comply with laws, to provide you with services,
                        to protect your rights, or to fulfill business obligations.
                    </Text><Text fontSize="md">
                        This information includes your username and created/uploaded content and is only shared
                        internally on the Website.
                    </Text><Text fontSize="md">
                        We do not share your contact details or real name or other personally identifiable information
                        anywhere on the Website or to any third party.
                    </Text><Text fontSize="lg" mt={5}>
                        COOKIES
                    </Text><Text fontSize="md">
                        We use cookies and other tracking technologies to collect and store your information as this is
                        required to ensure correct and fluent working of the Services we provide.
                    </Text><Text fontSize="md">
                        We use cookies and similar tracking technologies (like web beacons and pixels) to access or
                        store information, track your progress and to facilitate login system.
                    </Text><Text fontSize="lg" mt={5}>
                        INFORMATION STORING
                    </Text><Text fontSize="md">
                        We keep your information for as long as necessary to fulfill the purposes outlined in this
                        privacy notice unless otherwise required by law.
                    </Text><Text fontSize="md">
                        We will only keep your personal information for as long as it is necessary for the purposes set
                        out in this privacy notice, unless a longer retention period is required or permitted by law
                        (such as tax, accounting or other legal requirements).
                    </Text><Text fontSize="md">
                        When we have no ongoing legitimate business need to process your personal information, we will
                        either delete or anonymize such information, or, if this is not possible (for example, because
                        your personal information has been stored in backup archives), then we will securely store your
                        personal information and isolate it from any further processing until deletion is possible.
                    </Text><Text fontSize="lg" mt={5}>
                        MINORS
                    </Text><Text fontSize="md">
                        We do not knowingly collect data from or market to children under 13 years of age.
                    </Text><Text fontSize="lg" mt={5}>
                        YOUR PRIVACY RIGHTS
                    </Text><Text fontSize="md">
                        You may review, change, or terminate your account at any time.
                    </Text><Text fontSize="md">
                        If you are a resident in the European Economic Area and you believe we are unlawfully processing
                        your personal information, you also have the right to complain to your local data protection
                        supervisory authority. You can find their contact details here:
                        http://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.htm.
                    </Text><Text fontSize="md">
                        If you are a resident in Switzerland, the contact details for the data protection authorities
                        are available here: https://www.edoeb.admin.ch/edoeb/en/home.html.
                    </Text><Text fontSize="md">
                        You can contact us directly at any time via info@cyberbucks.io to initiate the process of
                        completely and permanently deleting your data from this Service.
                    </Text><Text fontSize="lg" mt={5}>
                        ACCOUNT INFORMATION
                    </Text><Text fontSize="md">
                        If you would at any time like to review or change the information in your account or terminate
                        your account, you can: Upon your request to terminate your account, we will deactivate or delete
                        your account and information from our active databases. However, we may retain some information
                        in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce
                        our Terms of Use and/or comply with applicable legal requirements.
                    </Text><Text fontSize="md">
                        You can unsubscribe from our marketing email list at any time by clicking on the unsubscribe
                        link in the emails that we send or by editing settings in your Profile section. You will then be
                        removed from the marketing email list — however, we may still communicate with you, for example
                        to send you service-related emails that are necessary for the administration and use of your
                        account (password or email changes).
                    </Text><Text fontSize="lg" mt={5}>
                        UPDATES
                    </Text><Text fontSize="md">
                        We will update this notice as necessary to stay compliant with relevant laws.
                    </Text><Text fontSize="lg" mt={5}>
                        CONTACTS
                    </Text><Text fontSize="md">
                        All questions regarding Privacy Policy shall be sent to email info@cyberbucks.io
                    </Text>
                    </Box>

                    <Center mb={5}><Link as={ReactLink} to="/">
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
