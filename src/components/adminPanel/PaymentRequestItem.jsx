import React, {useEffect, useState} from "react";
import {Button, Heading, SimpleGrid, Text, VStack} from "@chakra-ui/react";
import {getUserData} from "../../firebaseUtilities";
import {DateTime} from "luxon";

function PaymentRequestItem(props) {
    const {paymentId, userId, date, type, amount} = props;
    const [gotUserInfo, setGotUserInfo] = useState(false)
    const [isGettingUserInfo, setIsGettingUserInfo] = useState(false)

    const [username, setUsername] = useState("not loaded")
    const [registerDate, setRegisterDate] = useState("not loaded")
    const [lastOnline, setLastOnline] = useState("not loaded")
    const [balance, setBalance] = useState("not loaded")
    const [adblock, setAdblock] = useState("not loaded")
    const [sinceLastRefill, setSinceLastRefill] = useState("not loaded")
    const [lastRefill, setLastRefill] = useState("not loaded")
    const [referredBy, setReferredBy] = useState("not loaded")

    const getUserInfo = () => {
        setIsGettingUserInfo(true)
        getUserData(userId).then((result) => {
            setUsername(result.userName)
            setRegisterDate(DateTime.fromISO(result.registerDate).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY))
            setLastOnline(DateTime.fromISO(result.lastOnline).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY))
            setLastRefill(DateTime.fromISO(result.lastRefillRequest).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY))
            setBalance(result.balance)
            setAdblock(result.hasAdblock.toString())
            setSinceLastRefill(result.cashEarnedSinceRefill)
            setReferredBy(result.referredBy)
            setIsGettingUserInfo(false)
            setGotUserInfo(true)
        })
    }

    useEffect(() => {

    });

    return (
        <VStack
            p={4}
            display={{md: "flex"}}
            borderWidth={1}
            margin={2}>
            <SimpleGrid colums={1} spacing={10}>
                <Heading mb={4}>Payment Info</Heading>
                <SimpleGrid columns={2} spacing={10}>
                    <Text fontSize="xl">User ID: {userId}</Text>
                    <Button isLoading={isGettingUserInfo} isDisabled={gotUserInfo} colorScheme="green"
                            onClick={() => getUserInfo()}>Get Detailed User Info</Button>
                    <Text fontSize="xl">Request Id: {paymentId}</Text>
                    <Text fontSize="xl">Request
                        Date: {DateTime.fromISO(date).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)}</Text>
                    <Text fontSize="xl">Payment Type: {type}</Text>
                    <Text fontSize="xl">Amount: {amount}</Text>
                </SimpleGrid>
                <Heading mb={4}>Detailed User Info</Heading>
                <SimpleGrid columns={2} spacing={10}>
                    <Text fontSize="xl">Username: {username}</Text>
                    <Text fontSize="xl">Register Date: {registerDate}</Text>
                    <Text fontSize="xl">Last Online: {lastOnline}</Text>
                    <Text fontSize="xl">Balance: {balance}</Text>
                    <Text fontSize="xl">Adblock: {adblock}</Text>
                    <Text fontSize="xl">Cash Earned Since Last Refill: {sinceLastRefill}</Text>
                    <Text fontSize="xl">Last Refill Request: {lastRefill}</Text>
                    <Text fontSize="xl">Referred By: {referredBy}</Text>
                </SimpleGrid>
            </SimpleGrid>
        </VStack>
    );
}

export default PaymentRequestItem;
