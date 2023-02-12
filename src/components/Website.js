import React, {useEffect, useState} from 'react';
import Iframe from 'react-iframe'
import {useTimer} from 'react-timer-hook';
import useWindowFocus from 'use-window-focus';
import {collectPrizeFromLink, getAnyDataWithoutChild, getUserData, runLoginRoutine} from "../firebaseUtilities";
import {useLocation} from "react-router-dom";
import {Box, Button, Center, CircularProgress, Heading, Text} from "@chakra-ui/react"
import 'url-search-params-polyfill';
import {printText} from "../devUtilities";

export default function Website({userId}) {
    var time = new Date();

    const [linkAddr, setLinkAddr] = useState()
    const [dataIsFetched, setDataIsFetched] = useState(false)
    const [visitDuration, setVisitDuration] = useState(20)
    const [userVisited, setUserVisited] = useState(false)
    const [linkExpired, setLinkExpired] = useState(false)
    const [coinPrize, setCoinPrize] = useState(0)
    const [idLink, setIdLink] = useState(0)
    const location = useLocation()

    const search = window.location.search; // could be '?foo=bar'
    const params = new URLSearchParams(search);
    const linkId = parseInt(params.get('linkId'))
    let lastVisit = false

    const windowFocused = useWindowFocus()

    const {
        seconds,
        minutes,
        hours,
        days,
        isRunning,
        start,
        pause,
        resume,
        restart,
    } = useTimer({
        time, onExpire: () => {

            setTimerStopped(true)
            document.title = "Click the button to finish!"

        }
    });

    const [timerStopped, setTimerStopped] = useState(false)
    const [prizeCollected, setPrizeCollected] = useState(false)

    const collectPrize = () => {
        printText("Add coin") //will R&D about backend involvement
        collectPrizeFromLink(coinPrize, linkId, userId).then(() => {
            setPrizeCollected(true)
            if(lastVisit) {
                fetch("/endLink", {headers: {code: linkId.toString()}}).then()
            }
        })
        //todo: set userData -> linksInfo -> particularId to visited
    }

    useEffect(() => {
        if (!windowFocused && !timerStopped) {
            pause()
            document.title = "Keep this window focused!"
        } else {
            resume()
        }

        // let linkId = location.pathname.substring(location.pathname.lastIndexOf('/') + 1)
        printText("query is " + linkId)
        printText("visitduration is " + visitDuration)

        setIdLink(linkId)

        // getAllData().then((data) => {
        getAnyDataWithoutChild("links").then((data) => {
            setLinkAddr(data[linkId].addr)
            setVisitDuration(data[linkId].minDurSec)
            time.setSeconds(time.getSeconds() + visitDuration);
            restart(time)
            setCoinPrize(data[linkId].coinPrize)
            getUserData(userId).then((userData) => {
                if (userData.linksInfo[linkId] !== undefined) {
                    if (userData.linksInfo[linkId].visited) setUserVisited(true)
                }
                if (data[linkId].currentVisits >= data[linkId].visitGoal) {
                    setLinkExpired(true)
                    fetch("/endLink", {headers: {code: linkId.toString()}}).then()
                } else if(data[linkId].currentVisits + 1 === data[linkId].visitGoal) {
                    lastVisit = true
                }
                setDataIsFetched(true)
            })
        })
    }, [userId, windowFocused]);

    return (
        <Box my={6}>
            {!dataIsFetched ? <Center m={4}>
                    <CircularProgress isIndeterminate color="brand.blue1" size="50px" trackColor="brand.sky"/></Center>
                :
                <Box>
                    {(userVisited || linkExpired) ?
                        <Text fontSize="xl" textAlign="center">Either this prize is collected or the link has expired.</Text>
                        :
                        <Box>
                            <Box style={{textAlign: 'center'}} mb={3} pb={8} px={8} borderBottom="2px solid white">

                                {timerStopped ? prizeCollected ? <Heading>Completed!</Heading> :
                                        <Button onClick={collectPrize} ml={4} variant="outline" bg="transparent"
                                                borderRadius="0px"
                                                _hover={{color: "brand.purple", borderColor: "brand.purple"}}
                                                _active={{transform: "scale(0.98)"}}
                                                size="lg">Click To Obtain</Button>
                                    :
                                    <Box>
                                        <Text fontSize="2xl" textAlign="center">{minutes}:{seconds}</Text>
                                        {/*todo: add "Already visited or expired." warning by checking userData*/}
                                    </Box>
                                }
                            </Box>
                            <Iframe url={linkAddr}
                                    width="450px"
                                    height="450px"
                                    id="myId"
                                    className="iframeContainer"
                                    display="initial"
                                    position="relative"/>
                        </Box>
                    }
                </Box>
            }
        </Box>
    );
}
