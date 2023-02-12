import {
    Alert, AlertIcon,
    Box,
    Button,
    Center,
    CircularProgress, Container, Flex, FormControl, FormHelperText,
    FormLabel,
    Heading,
    Image,
    Img, Input,
    Link,
    SlideFade, Spacer,
    Text
} from "@chakra-ui/react";
import {Link as ReactLink, useHistory} from "react-router-dom";
import {ImCodepen, IoMdReturnLeft} from "react-icons/all";
import React, {useEffect, useState} from "react";
import {authLogout, firebaseApp} from "../firebaseUtilities";
import 'url-search-params-polyfill';
import {ViewIcon, ViewOffIcon} from "@chakra-ui/icons";
import firebase from "firebase";
import {printText} from "../devUtilities";

export default function FAuth() {

    const [dataIsFetched, setDataIsFetched] = useState(false)
    const [messageText, setMessageText] = useState("")
    const [codeChecked, setCodeChecked] = useState(false)

    const search = window.location.search; // could be '?foo=bar'
    const params = new URLSearchParams(search)
    const mode = params.get("mode")
    const oobCode = params.get("oobCode")
    const history = useHistory()

    const [changesLoading, setChangesLoading] = useState(false)
    const [changesLoaded, setChangesLoaded] = useState(false)
    const [messageShown, setMessageShown] = useState(false)
    const [newPasswordShow, setNewPasswordShow] = useState(false)
    const handleNewPasswordClick = () => setNewPasswordShow(!newPasswordShow)
    const [newPasswordInvalid, setNewPasswordInvalid] = useState(false)
    const [newPassword, setNewPassword] = useState("")
    const handleNewPasswordChange = (event) => {
        setNewPassword(event.target.value)
        if (event.target.value.toString().length > 5) {
            setNewPasswordInvalid(false)
        }
    }
    const [message, setMessage] = useState("")
    const [messageType, setMessageType] = useState("error")

    useEffect(() => {
        // printText(userData)
        if(mode === undefined || oobCode === undefined) {
            history.push("/")
        } else {
            if(!codeChecked) {
                firebaseApp.auth().checkActionCode(oobCode).then((info) => {
                    setCodeChecked(true)
                    if(!dataIsFetched && mode !== "resetPassword") {
                        firebaseApp.auth().applyActionCode(oobCode).then(() => {
                            setDataIsFetched(true)
                            if (mode === "verifyEmail") {
                                setMessageText("Email verified successfully")
                            } else {
                                setMessageText("Operation completed successfully")
                            }
                        }).catch((error) => {
                            setDataIsFetched(true)
                            setMessageText(error.message)
                            console.log(error)
                            console.log("Error caught by the inner catch")
                        })
                    } else if(mode === "resetPassword") {
                        setDataIsFetched(true)
                    }
                }).catch((error) => {
                    setDataIsFetched(true)
                    setMessageText(error.message)
                    console.log(error)
                    console.log("Error caught by the outer catch")
                })
            }
        }
    });

    const submitChanges = () => {
        if (!newPassword || newPassword.length < 6) {
            setNewPasswordInvalid(true)
            setMessageType("error")
            setMessage("Credentials you have entered are not valid")
            setMessageShown(true)
        } else {
            setChangesLoading(true)
            setNewPasswordInvalid(false)
            setMessageShown(false)

            firebaseApp.auth().confirmPasswordReset(oobCode, newPassword)
                .then( () => {
                    setChangesLoading(false)
                    setChangesLoaded(true)
                    setMessageType("success")
                    setMessage("Credentials updated successfully")
                    setMessageShown(true)
                }).catch((error) => {
                    setChangesLoading(false)
                    printText("submitChanges: An error occurred: " + error)
                    setMessageType("error")
                    setMessage(error.message)
                    setMessageShown(true)
            })
        }
    }

    return (
<Box>
    <Center margin="2%">
        <Image w={400} mt={12} mb={1} src="/assets/logo_en.png"/>
    </Center>
        {!dataIsFetched ?
        <Center mx={4} mt={4}><CircularProgress isIndeterminate color="brand.blue1" size="50px"
                                                trackColor="brand.sky"/></Center>
        :
        <SlideFade in={true} offsetY="40px">
            <Center>
                <Box width="60rem" borderColor="white" borderWidth={2} background="brand.dark">
                    <Heading m={5}>ACCOUNT OPERATION</Heading>
                    {mode === "resetPassword" ?
                        <Container>
                        <Flex direction="row" width="100%" mb={10}>
                            <FormControl id="password" w="100%" color="white" isRequired mt={3}>
                                <FormLabel fontSize="lg">RESET PASSWORD</FormLabel>
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
                        : <Text style={{wordWrap: "normal"}} m={5} fontSize="xl">{messageText}</Text>}

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
}
</Box>
    );
}