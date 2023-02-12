import React, {useEffect, useState} from "react";
import {
    Button,
    createStandaloneToast,
    Divider,
    Heading,
    HStack,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverFooter,
    PopoverHeader,
    PopoverTrigger,
    SimpleGrid,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    VStack
} from "@chakra-ui/react";
import {DateTime} from "luxon";
import {printText} from "../../devUtilities";

function ReferralReportItem(props) {
    const {reportData} = props
    const [disabledAccount, setDisabledAccount] = useState(false)
    const [isDisablingUser, setIsDisablingUser] = useState(false)

    const toast = createStandaloneToast()

    const [reportDate, setReportDate] = useState("1923")

    const disableAccount = () => {
        if (!isDisablingUser) {
            setIsDisablingUser(true)
            try {
                fetch("/disableUser", {headers: {code: reportData.mainUser.userId}})
                    .then((res) => {
                        printText(res)
                        setIsDisablingUser(false)
                        if (res.status === 200) {
                            toast({
                                title: "User disabled successfully.",
                                description: "",
                                status: "success",
                                duration: 9000,
                                isClosable: true,
                            })
                            setDisabledAccount(true)
                        } else {
                            toast({
                                title: "An error occurred: " + res.status.toString(),
                                description: "Unable to disable user account.",
                                status: "error",
                                duration: 9000,
                                isClosable: true,
                            })
                        }
                        setIsDisablingUser(false)
                    })
            } catch (e) {
                toast({
                    title: "An error occurred: " + e,
                    description: "",
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                })
            }
        }
    }

    const [isDisablePromptOpen, setIsDisablePromptOpen] = useState(false)
    const showDisablePrompt = () => setIsDisablePromptOpen(true)
    const hideDisablePrompt = () => setIsDisablePromptOpen(false)

    useEffect(() => {
        if (reportData) {
            setReportDate(DateTime.fromISO(reportData.reportDate).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY))
            printText("ReportItem: reportData" + JSON.stringify(reportData))
        }
    }, [reportData]);

    return (
        <VStack
            p={4}
            display={{md: "flex"}}
            borderWidth={1}
            margin={2}>
            <Heading mb={4} size="xl">{reportData.mainUser.userName} - {reportData.mainUser.userId}</Heading>
            <Heading mb={7} size="lg">Report Details</Heading>
            <SimpleGrid colums={1} spacing={10}>
                <SimpleGrid columns={3} spacing={10}>
                    <Text fontSize="xl">Report Date: {reportDate}</Text>
                    <Text fontSize="xl">Trigger: {reportData.trigger}</Text>
                    <Popover
                        enabled={!disabledAccount}
                        onClose={hideDisablePrompt}
                        closeOnBlur={true}>
                        <PopoverTrigger>
                            <Button isLoading={isDisablingUser} isDisabled={disabledAccount} colorScheme="red"
                            >Disable User Account</Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <PopoverHeader fontWeight="semibold">Confirmation</PopoverHeader>
                            <PopoverArrow/>
                            <PopoverCloseButton/>
                            <PopoverBody fontSize="xl">
                                Are you sure you want to disable the main user account?
                            </PopoverBody>
                            <PopoverFooter d="flex" justifyContent="flex-end">
                                <Button onClick={() => disableAccount()} colorScheme="red">Apply</Button>
                            </PopoverFooter>
                        </PopoverContent>
                    </Popover>
                </SimpleGrid>
                <Divider/>
                <Heading size="md">Flag Counts - Total: {reportData.totalFlags}</Heading>
                <SimpleGrid columns={3} spacing={10}>
                    {Object.entries(reportData.flagData).map(function ([key, value]) {
                        return (<HStack><Text fontSize="xl">{key}: </Text><Text fontSize="xl">{value}</Text></HStack>);
                    })}
                </SimpleGrid>
                <Divider/>
                <Heading size="md">IP Matches with Main
                    - {reportData.ipMatchesWithMain.length}/{reportData.referralUsers.length}</Heading>
                <SimpleGrid columns={3} spacing={10}>
                    {Object.values(reportData.ipMatchesWithMain).map(function (key, index) {
                        return (<Text fontSize="xl">{key}</Text>);
                    })}
                </SimpleGrid>
                <Divider/>
                <Heading size="md">Email Addresses Not Verified
                    - {reportData.emailNonVerified.length}/{reportData.referralUsers.length}</Heading>
                <SimpleGrid columns={3} spacing={10}>
                    {Object.values(reportData.emailNonVerified).map(function (key, index) {
                        return (<Text fontSize="xl">{key}</Text>);
                    })}
                </SimpleGrid>
                <Divider/>
                <Heading size="md">Below Threshold
                    - {reportData.belowThreshold.length}/{reportData.referralUsers.length}</Heading>
                <SimpleGrid columns={3} spacing={10}>
                    {Object.values(reportData.belowThreshold).map(function (key, index) {
                        return (<Text fontSize="xl">{key}</Text>);
                    })}
                </SimpleGrid>
                <Divider/>
                <Heading size="md">Referrals</Heading>
                <Table variant="simple" colorScheme="teal">
                    <Thead>
                        <Tr>
                            <Th fontSize="xl">Username</Th>
                            <Th fontSize="xl">User Id</Th>
                            <Th fontSize="xl">Register Date</Th>
                            <Th fontSize="xl">Last Online</Th>
                            <Th isNumeric fontSize="xl">Balance</Th>
                            <Th fontSize="xl">Threshold</Th>
                            <Th fontSize="xl">Adblock</Th>
                            <Th isNumeric fontSize="xl">Earned Since Last Refill</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {Object.keys(reportData.referralUsers).map(function (key, index) {
                            for (const element of Object.values(reportData.referralUsers[key])) {
                                return (
                                    <Tr key={key}>
                                        <Td fontSize="xl">{element.userName}</Td>
                                        <Td fontSize="xl">{Object.keys(reportData.referralUsers[key])}</Td>
                                        <Td fontSize="xl">{DateTime.fromISO(element.registerDate).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)}</Td>
                                        <Td fontSize="xl">{DateTime.fromISO(element.lastOnline).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)}</Td>
                                        <Td isNumeric fontSize="xl">{element.balance}</Td>
                                        <Td fontSize="xl">{element.passedThreshold.toString()}</Td>
                                        <Td fontSize="xl">{element.hasAdblock.toString()}</Td>
                                        <Td isNumeric fontSize="xl">{element.cashEarnedSinceRefill}</Td>
                                    </Tr>
                                )
                            }
                        })}
                    </Tbody>
                </Table>
            </SimpleGrid>
        </VStack>
    );
}

export default ReferralReportItem;
