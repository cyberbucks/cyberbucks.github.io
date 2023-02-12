import React, {useEffect, useState} from 'react';
import {
    Alert,
    AlertIcon,
    Box,
    Button,
    Center,
    Container,
    Flex,
    FormControl,
    FormHelperText,
    FormLabel,
    Heading,
    Icon,
    Input, Link,
    SlideFade,
    Spacer,
    Text
} from "@chakra-ui/react";
import {BiDownArrow, ImCodepen} from "react-icons/all";
import {CheckIcon, CloseIcon, ViewIcon, ViewOffIcon} from "@chakra-ui/icons";
import {firebaseApp} from "../firebaseUtilities";
import firebase from "firebase";
import {printText} from "../devUtilities";


export default function Profile(userData) {

    const [newPasswordShow, setNewPasswordShow] = useState(false)
    const handleNewPasswordClick = () => setNewPasswordShow(!newPasswordShow)
    const [currentPasswordShow, setCurrentPasswordShow] = useState(false)
    const handleCurrentPasswordClick = () => setCurrentPasswordShow(!currentPasswordShow)

    const [newPasswordInvalid, setNewPasswordInvalid] = useState(false)
    const [currentPasswordInvalid, setCurrentPasswordInvalid] = useState(false)
    const [currentPassword, setCurrentPassword] = useState("")
    const handleCurrentPasswordChange = (event) => {
        setCurrentPassword(event.target.value)
        setCurrentPasswordInvalid(false)
    }
    const [newPassword, setNewPassword] = useState("")
    const handleNewPasswordChange = (event) => {
        setNewPassword(event.target.value)
        if (event.target.value.toString().length > 5) {
            setNewPasswordInvalid(false)
        }
    }

    const [changesLoading, setChangesLoading] = useState(false)
    const [changesLoaded, setChangesLoaded] = useState(false)
    const [messageShown, setMessageShown] = useState(false)
    const [message, setMessage] = useState("")
    const [messageType, setMessageType] = useState("error")

    useEffect(() => {
        // printText(userData)
    }, [userData]);

    const [emailMessage, setEmailMessage] = useState("")
    const [emailMessageType, setEmailMessageType] = useState("warning")

    const sendEmail = () => {
        firebaseApp.auth().currentUser.sendEmailVerification().then(() => {
            setEmailMessageType("info")
            setEmailMessage("Verification email sent.")
        })
    }

    const submitChanges = () => {
        if (!currentPassword || !newPassword || newPassword.length < 6) {
            setMessageType("error")
            setMessage("Credentials you have entered are not valid")
            setMessageShown(true)
            if (!currentPassword) {
                setCurrentPasswordInvalid(true)
            }
            if (!newPassword || newPassword.length < 6) {
                setNewPasswordInvalid(true)
            }
        } else {
            setChangesLoading(true)
            setCurrentPasswordInvalid(false)
            setNewPasswordInvalid(false)
            setMessageShown(false)

            const credential = firebase.auth.EmailAuthProvider.credential(firebaseApp.auth().currentUser.email, currentPassword)
            firebaseApp.auth().currentUser.reauthenticateWithCredential(credential).then((result) => {
                firebaseApp.auth().currentUser.updatePassword(newPassword).then(() => {
                    setChangesLoading(false)
                    setChangesLoaded(true)
                    setMessageType("success")
                    setMessage("Credentials updated successfully")
                    setMessageShown(true)
                })
            }).catch((error) => {
                setChangesLoading(false)
                printText("submitChanges: An error occurred: " + error)
                setMessageType("error")
                setMessage("Wrong password")
                setMessageShown(true)
            })
        }
    }

    return (
        <Box className="contentContainer" mx={[2, 0]}>
            <SlideFade in={true} offsetY="40px">
                <Box mx={10}>
                    <Heading textAlign="center"><Icon as={BiDownArrow} mr={10} pb={1} w={10} h={10}/>PROFILE<Icon
                        as={BiDownArrow} ml={10} pb={1} w={10} h={10}/></Heading>
                    {!firebaseApp.auth().currentUser.emailVerified &&
                    <Box>
                        <Alert status={emailMessageType} color="white" bg="brand.orange" fontSize="lg"
                               alignItems="center" justifyContent="center">
                            <AlertIcon color="white"/>
                            {message === "" ? <Text>You have not verified your email yet.
                                <Link onClick={sendEmail}> Click here to send verification email.
                                </Link></Text> : <Text>{emailMessage}</Text>}
                        </Alert>
                    </Box>
                    }
                    <Container maxW="80rem" centerContent mt={3}>
                        <Flex direction="row" width="100%">
                            <FormControl id="email" w="100%" color="white" isRequired>
                                <FormLabel fontSize="lg">USERNAME</FormLabel>
                                <Input type="email" borderBottom="2px solid white" bg="transparent"
                                       focusBorderColor="brand.blue1"
                                       border="transparent" borderRadius="0px"
                                       isReadOnly
                                       value={userData.userData.userName} placeholder="Email Address"
                                       style={{wordWrap: "normal"}} fontSize="xl"
                                       _active={{}}/>
                                <FormHelperText color="white" fontSize="md">Mark emails from us as important and never
                                    miss an event.</FormHelperText>
                            </FormControl>
                            <Spacer/>
                            {userData.userData.emailVerified ?
                                <Center w="20rem"><CheckIcon w={8} h={8} color="green.500" mt={0.8}/><Text
                                    fontSize="lg" ml={5}>EMAIL VERIFIED</Text></Center> :
                                <Center w="20rem"><CloseIcon w={7} h={7} color="red.500" mt={1} ml={5}/><Text
                                    fontSize="lg" ml={5}>EMAIL NOT VERIFIED</Text></Center>}
                        </Flex>
                        <Flex direction="row" width="100%" mb={10}>
                            <FormControl id="password" w="100%" color="white" isRequired mt={3}>
                                <FormLabel fontSize="lg">CHANGE PASSWORD</FormLabel>
                                <Input
                                    focusBorderColor="brand.blue1"
                                    pr="4.5rem"
                                    type={newPasswordShow ? "text" : "password"}
                                    borderBottom="2px solid white" bg="transparent"
                                    border="transparent" borderRadius="0px"
                                    value={newPassword} isInvalid={newPasswordInvalid}
                                    onChange={handleNewPasswordChange}
                                    style={{wordWrap: "normal"}} fontSize="xl"
                                    _active={{}}
                                />
                                <FormHelperText color="white" fontSize="md">Passwords must be at least 6
                                    characters.</FormHelperText>
                            </FormControl>
                            <Spacer/>
                            <Center w="20rem">
                                <Button onClick={handleNewPasswordClick}
                                        leftIcon={newPasswordShow ? <ViewOffIcon/> : <ViewIcon/>}
                                        variant="outline" bg="transparent"
                                        boxShadow="0 0 10px rgba(255, 255, 255, 0.4)"
                                        borderRadius="0px"
                                        _hover={{
                                            color: "brand.purple",
                                            borderColor: "brand.purple",
                                            boxShadow: "0 0 10px rgba(95, 32, 91, 0.4)"
                                        }}
                                        _active={{transform: "scale(0.98)"}}
                                        size="lg">
                                    {newPasswordShow ? "Hide" : "Show"}
                                </Button>
                            </Center>
                        </Flex>
                        <Flex direction="row" width="100%" mt={10}>
                            <FormControl id="password" w="100%" color="white" isRequired>
                                <FormLabel fontSize="lg">ENTER CURRENT PASSWORD TO CONFIRM CHANGES</FormLabel>
                                <Input
                                    focusBorderColor="brand.blue1"
                                    pr="4.5rem"
                                    type={currentPasswordShow ? "text" : "password"}
                                    borderBottom="2px solid white" bg="transparent"
                                    border="transparent" borderRadius="0px"
                                    value={currentPassword} isInvalid={currentPasswordInvalid}
                                    onChange={handleCurrentPasswordChange}
                                    style={{wordWrap: "normal"}} fontSize="xl"
                                    _active={{}}
                                />
                            </FormControl>
                            <Spacer/>
                            <Center w="20rem">
                                <Button onClick={handleCurrentPasswordClick}
                                        leftIcon={currentPasswordShow ? <ViewOffIcon/> : <ViewIcon/>}
                                        variant="outline" bg="transparent"
                                        boxShadow="0 0 10px rgba(255, 255, 255, 0.4)"
                                        borderRadius="0px"
                                        _hover={{
                                            color: "brand.purple",
                                            borderColor: "brand.purple",
                                            boxShadow: "0 0 10px rgba(95, 32, 91, 0.4)"
                                        }}
                                        _active={{transform: "scale(0.98)"}}
                                        size="lg">
                                    {currentPasswordShow ? "Hide" : "Show"}
                                </Button>
                            </Center>
                        </Flex>
                        <Button onClick={submitChanges} py={4} px={8} mx={5} mt={8} variant="outline" bg="transparent"
                                leftIcon={<ImCodepen/>} isFullWidth
                                isLoading={changesLoading} isDisabled={changesLoaded}
                                boxShadow="0 0 10px rgba(255, 255, 255, 0.4)"
                                borderRadius="0px"
                                _hover={{
                                    color: "brand.purple",
                                    borderColor: "brand.purple",
                                    boxShadow: "0 0 10px rgba(95, 32, 91, 0.4)"
                                }}
                                _active={{transform: "scale(0.98)"}}
                                size="lg">Submit Changes</Button>
                        <SlideFade in={messageShown}>
                            <Alert status={messageType} mt={5} color="white" bg="transparent" fontSize="xl"
                                   alignItems="center"
                                   justifyContent="center">
                                <AlertIcon/>
                                {message}
                            </Alert>
                        </SlideFade>
                    </Container>
                </Box>
            </SlideFade>
        </Box>
    );
}
