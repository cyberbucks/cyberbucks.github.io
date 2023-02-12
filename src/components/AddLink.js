import React, {useEffect, useState} from 'react';
import {addNewLink, chargeUser, getAllData, getAnyDataWithoutChild, getUserData} from "../firebaseUtilities";

import {
    Alert, AlertIcon,
    Box,
    Button,
    Checkbox,
    Heading,
    Icon,
    Input,
    SlideFade,
    Slider,
    SliderFilledTrack,
    SliderThumb,
    SliderTrack,
    Stack,
    Text
} from "@chakra-ui/react"
import {BiDownArrow, FaRegCheckCircle, ImCodepen} from "react-icons/all";
import 'url-search-params-polyfill';
import {printText} from "../devUtilities";


export default function AddLink({userId}) {

    const [visitGoal, setVisitGoal] = useState(10)
    const [visitTime, setVisitTime] = useState(10)
    const [totalPrice, setTotalPrice] = useState(0.00)
    const [enteredURL, setEnteredURL] = useState("https://www.website.com/")

    const [checkLoading, setCheckLoading] = useState(false)
    const [submitLoading, setSubmitLoading] = useState(false)
    const [changesLoaded, setChangesLoaded] = useState(false)

    const [messageShown, setMessageShown] = useState(false)
    const [message, setMessage] = useState("")
    const [messageType, setMessageType] = useState("error")

    useEffect(() => {


    }, [userId]);

    const urlChecker = () => {
        return new Promise((resolve, reject) => {
            let url = enteredURL
            if (!(enteredURL.includes("http://") || enteredURL.includes("https://"))) {
                url = "https://" + enteredURL
            }
            try {
                new URL(url)
            } catch (err) {
                printText(err)
                setMessageType("error")
                setMessage("Please check if the URL you entered is correct.")
                setMessageShown(true)
                setSubmitLoading(false)
            }
            fetch("/urlCheck?" + new URLSearchParams({
                urlToBeChecked: url
            }), {headers: {code: userId}})
                .then((res) => res.json())
                .then((data) => {
                    if(data.code === 403) {
                        setMessageType("error")
                        setMessage("Please try adding a link after your previous link hits its goal")
                        setMessageShown(true)
                        setSubmitLoading(false)
                        setChangesLoaded(true)
                    }
                    try {
                        const xFrameOptions = data.xFrameOptions;
                        if (xFrameOptions.substring(0, 10) === "SAMEORIGIN") { //cutting a substring because some websites return "SAMEORIGIN/SAMEORIGIN" and some only "SAMEORIGIN"
                            resolve(data)
                        } else if (data.description === "inappropriate content") {
                            setMessageType("error")
                            setMessage("Inappropriate content found. Please try another website")
                            setMessageShown(true)
                            setSubmitLoading(false)
                        }
                        else {
                            // reject(new Error("Bad URL."))
                            setMessageType("error")
                            setMessage("Please check if the URL you entered is correct.")
                            setMessageShown(true)
                            setSubmitLoading(false)
                        }
                    } catch (err) {
                        printText(err)
                        setMessageType("error")
                        setMessage("Please check if the URL you entered is correct.")
                        setMessageShown(true)
                        setSubmitLoading(false)
                    }
                }).catch((error) => {
                    printText(error)
                    setMessageType("error")
                    setMessage("Network error occurred")
                    setMessageShown(true)
                    setSubmitLoading(false)
            });
        });
    }

    const preSubmit = (costCash) => { //promise
        //todo: check url for iFrame compatibility and other security reasons
        //after ^^, get URL's title-desc-logo

        setSubmitLoading(true)
        return new Promise((resolve, reject) => {


            urlChecker(enteredURL).then((urlData) => {

                // getAllData().then((data) => { //fetching data on the spot from DB and not getting it from our parent for extra security while checking user's funds
                getUserData(userId).then((data) => {
                    if (data.balance > costCash) {
                        //other checks will be added

                        getAnyDataWithoutChild("links").then((linkData) => {
                            const linkKeys = Object.keys(linkData)
                            const linkId = Number(linkKeys[linkKeys.length - 1]) + 1

                            const preSubmitData = {
                                linkId: linkId,
                                title: urlData.title,
                                description: urlData.description,
                                logo: urlData.logo
                            }

                            resolve(preSubmitData)
                        })
                    } else {
                        setSubmitLoading(false)
                        // reject(new Error("Insufficient funds."))
                        setMessageType("error")
                        setMessage("Insufficient funds. You have " + data.balance + ". However, you need " + costCash)
                        setMessageShown(true)
                    }

                })

            })
                .catch(error => {
                    printText(error)
                    setSubmitLoading(false)
                    setMessageType("error")
                    setMessage("An error occurred")
                    setMessageShown(true)
                })


        });
    }


    const submitLink = () => {
        setMessageShown(false)

        const costCash = 35 + (visitTime * 0.5) + (visitGoal * 0.05);
        //will run preSubmit first as a promise
        const linkData = {
            addr: enteredURL,
            coinPrize: 2, //todo: will fix this
            minDurSec: visitTime,
            visitGoal: visitGoal,
            title: "placeholder",
            description: "placeholder",
            logo: "placeholder"

        };

        preSubmit(costCash).then((preSubmitData) => {

            linkData.title = preSubmitData.title
            linkData.description = preSubmitData.description
            linkData.logo = preSubmitData.logo

            addNewLink(linkData, preSubmitData.linkId, userId) //hardcoded linkID and userId
            chargeUser(costCash, userId)
            setSubmitLoading(false)
            setChangesLoaded(true)
            setMessageType("success")
            setMessage("Link added successfully")
            setMessageShown(true)
        })
            .catch(error => {
                printText("Can't add link. " + error)
                setMessageType("error")
                setMessage("An error occurred")
                setMessageShown(true)
                setSubmitLoading(false)
            })


    }


    return (
        <Box className="contentContainer" mx={[2, 0]}>
            <SlideFade in={true} offsetY="40px">
                <Heading textAlign="center"><Icon as={BiDownArrow} mr={10} pb={1} w={10} h={10}/>ADD LINK<Icon
                    as={BiDownArrow} ml={10} pb={1} w={10} h={10}/></Heading>

                <Stack spacing={4} direction="column" align="center" mx={12}>

                    <Text fontSize="xl" mt={5}>Enter URL*</Text>
                    <Input
                        focusBorderColor="brand.blue1"
                        onChange={(event) => {
                            setEnteredURL(event.target.value)
                        }} isRequired="true" maxWidth="50%" placeholder="https://www.website.com/" size="lg"
                        w="100%" p={4} color="white" mx={5} my={3} borderBottom="2px solid white" bg="transparent"
                        border="transparent" borderRadius="0px"
                        style={{wordWrap: "normal"}} fontSize="xl"
                        _active={{borderColor: "brand.blue"}} _focus={{borderColor: "brand.blue"}}/>

                    <Text fontSize="xl" mt={5}>Choose number of visits*</Text>

                    <Text fontSize="xl">{visitGoal} visits</Text>

                    <Slider onChange={(val) => {
                        setVisitGoal(val)
                    }} maxWidth="30%" aria-label="slider-ex-1" defaultValue={10}>
                        <SliderTrack>
                            <SliderFilledTrack/>
                        </SliderTrack>
                        <SliderThumb/>
                    </Slider>


                    <Text fontSize="xl" mt={5}>Choose visit time*</Text>

                    <Text fontSize="xl">{visitTime} seconds</Text>

                    <Slider onChange={(val) => {
                        setVisitTime(val)
                    }} maxWidth="30%" aria-label="slider-ex-1" defaultValue={10}>
                        <SliderTrack>
                            <SliderFilledTrack/>
                        </SliderTrack>
                        <SliderThumb/>
                    </Slider>

                    {/*<Checkbox fontSize="xl" mt={5}>Add Premium package?</Checkbox>*/}

                    <Text fontSize="xl" mt={10}>Total
                        Price: ${35 + (visitTime * 0.5) + (visitGoal * 0.05)}</Text> {/*todo: price will be determined dynamically*/}

                    <Button onClick={submitLink} py={4} px={8} mx={5} mt={5} variant="outline" bg="transparent"
                            leftIcon={<ImCodepen/>} isFullWidth
                            boxShadow="0 0 10px rgba(255, 255, 255, 0.4)"
                            isLoading={submitLoading} isDisabled={changesLoaded}
                            borderRadius="0px"
                            _hover={{
                                color: "brand.purple",
                                borderColor: "brand.purple",
                                boxShadow: "0 0 10px rgba(95, 32, 91, 0.4)"
                            }}
                            _active={{transform: "scale(0.98)"}}
                            size="lg">Submit</Button>
                    {/*<Button onClick={urlChecker} py={4} px={8} mx={5} mt={5} mb={5} variant="outline" bg="transparent"*/}
                    {/*        leftIcon={<FaRegCheckCircle/>} isFullWidth*/}
                    {/*        boxShadow="0 0 10px rgba(255, 255, 255, 0.4)"*/}
                    {/*        borderRadius="0px"*/}
                    {/*        _hover={{*/}
                    {/*            color: "brand.purple",*/}
                    {/*            borderColor: "brand.purple",*/}
                    {/*            boxShadow: "0 0 10px rgba(95, 32, 91, 0.4)"*/}
                    {/*        }}*/}
                    {/*        _active={{transform: "scale(0.98)"}}*/}
                    {/*        size="lg">Check URL</Button>*/}
                    <SlideFade in={messageShown}>
                        <Alert status={messageType} mt={5} color="white" bg="transparent" fontSize="xl"
                               alignItems="center"
                               justifyContent="center">
                            <AlertIcon/>
                            {message}
                        </Alert>
                    </SlideFade>
                    <Text fontSize="md">Link Rules</Text>
                    <Text fontSize="md">All links have to be approved by administration before going live. We do not
                        allow misleading titles or descriptions, adult sites, faucets, malicious links, file downloads
                        and other potentially dangerous or illegal content. YouTube links will be converted to embed
                        videos. </Text>
                </Stack>
            </SlideFade>
        </Box>
    );
}
