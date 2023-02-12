import React, {useEffect, useState} from 'react';
import {useTimer} from 'react-timer-hook';
import {Box, Text} from "@chakra-ui/react";

const ONE_HOUR = 60 * 60 * 1000;

function MyTimer({expiryTimestamp}) {
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

    } = useTimer({expiryTimestamp, onExpire: () => console.warn('onExpire called')});

    useEffect(() => {


    }, [expiryTimestamp]);


    return (
        <Box>

            <Box>
                <Text fontSize="20px">{minutes}:{seconds}</Text>
            </Box>


        </Box>
    );
}


export default function RefillTimer({userData}) {

    let refillTimer;

    const [refillDate, setRefillDate] = useState(new Date())
    const [timerDataIsFetched, setTimerDataIsFetched] = useState(false)
    const [refillState, setRefillState] = useState(0)

    useEffect(() => {

        const lastRefillRequest = new Date(userData.lastRefillRequest) //converting the ISO format that came from our DB to a Date object

        if (isNaN(lastRefillRequest) === false) { //checking if we fetched the date properly yet, else we pass the invalid date to the timer component and get an error

            const currTime = new Date()
            const minRefill = new Date(lastRefillRequest.getTime() + ONE_HOUR) //eareliest fullfil time for our refill request

            if (userData.coins > 0) setRefillState(1) //these are for setting the different text and button style for different situations
            if (currTime > minRefill && userData.coins === 0 && userData.refillRequested === false) setRefillState(2)
            if (currTime < minRefill && userData.coins === 0) setRefillState(3)
            if (currTime > minRefill && userData.coins === 0 && userData.refillRequested) setRefillState(4)

            setRefillDate(minRefill)
            setTimerDataIsFetched(true)


        }


    }, [userData]);

    if (refillState === 1 || refillState === 2) {

        refillTimer = <Text fontSize="xl">--:--</Text>

    } else if (refillState === 3) {

        refillTimer = (

            <Box>
                <MyTimer expiryTimestamp={refillDate}/>
                <Text fontSize="xl">until refill</Text>
            </Box>

        )

    } else if (refillState === 4) {

        refillTimer = <Text fontSize="xl">Your coins are ready!</Text>

    }


    return (
        <Box>

            {!timerDataIsFetched ? <Text fontSize="xl">Waiting for data</Text>
                :
                <Box>
                    {refillTimer}
                </Box>


            }


        </Box>
    );
}
