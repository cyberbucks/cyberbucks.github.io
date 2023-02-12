import React, {useEffect, useState, useMemo} from 'react';
import { useTable, useSortBy } from 'react-table';
import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Button,
    CircularProgress,
    CircularProgressLabel,
    Container,
    createStandaloneToast,
    Heading,
    HStack,
    Input,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverFooter,
    PopoverHeader,
    PopoverTrigger,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Center
} from "@chakra-ui/react";
import {useHistory} from "react-router-dom";
import {getPaymentRequests, getReferralReports, getAnyDataWithoutChild} from "../../firebaseUtilities";
import PaymentRequestItem from "./PaymentRequestItem";
import ReferralReportItem from "./ReferralReportItem";


export default function AdminPanel(userId) {

    const [jackpotData, setJackpotData] = useState({})
    const [myUserData, setMyUserData] = useState({})
    const [statusText, setStatusText] = useState("Checking authorization")
    const [loading, setLoading] = useState(true)
    const [isAdmin, setIsAdmin] = useState(false)
    const history = useHistory()

    const [paymentData, setPaymentData] = useState()
    const [referralReportsData, setReferralReportsData] = useState()

    const [isDisablePromptOpen, setIsDisablePromptOpen] = useState(false)
    const showDisablePrompt = () => setIsDisablePromptOpen(true)
    const hideDisablePrompt = () => setIsDisablePromptOpen(false)
    const [idToDisable, setIdToDisable] = useState()
    const handleChange = (event) => setIdToDisable(event.target.value)
    const [isDisablingUser, setIsDisablingUser] = useState(false)
    const toast = createStandaloneToast()
    const [data, setData] = useState([
      {
        userName: "Test",
        balance: 2
      },
      {
        userName: "Test",
        balance: 5
      },
      {
        userName: "Test",
        balance: 3
      },
      {
        userName: "Test",
        balance: 4
      },
    ])



    // var data = [
    //   {
    //     userName: "Test",
    //     balance: 3
    //   },
    //   {
    //     userName: "Test",
    //     balance: 3
    //   },
    //   {
    //     userName: "Test",
    //     balance: 3
    //   },
    //   {
    //     userName: "Test",
    //     balance: 3
    //   },
    // ]


 const columns = React.useMemo(
   () => [
     {
       Header: 'User Name',
       accessor: 'userName', // accessor is the "key" in the data
     },
     {
       Header: 'Balance',
       accessor: 'balance',
     },
     {
       Header: 'Coins',
       accessor: 'coins',
     },
     {
       Header: 'Has Adblock',
       accessor: 'hasAdblock',
     },
     {
       Header: 'Email Verified',
       accessor: 'emailVerified',
     },
     {
       Header: 'IP Address',
       accessor: 'ipAddress',
     },
     {
       Header: 'Last Spin Time',
       accessor: 'lastSpinTime',
     },
     {
       Header: 'Referral Reports Created',
       accessor: 'referralReportsCreated',
     },
     {
       Header: 'Register Date',
       accessor: 'registerDate',
     },
     {
       Header: 'Tickets',
       accessor: 'tickets',
     }
   ],
   []
 )

 const {
     getTableProps,
     getTableBodyProps,
     headerGroups,
     rows,
     prepareRow,
   } = useTable({ columns, data }, useSortBy)

    const disableAccount = () => {
        if (!isDisablingUser) {
            setIsDisablingUser(true)
            try {
                fetch("/testAPI", {headers: {code: idToDisable}})
                    .then((res) => {
                        console.log(res)
                        setIsDisablingUser(false)
                        if (res.status === 200) {
                            toast({
                                title: "User disabled successfully.",
                                description: "",
                                status: "success",
                                duration: 9000,
                                isClosable: true,
                            })
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

    const getUserDataFromDB = () => {


      getAnyDataWithoutChild("users").then((userData) => {

        var userDataArray = Object.keys(userData).map((key) => [Number(key), userData[key]])
        console.log('heres data' + userDataArray)
        return userDataArray;



      })
    }

    useEffect(() => {
        if (userId.userId) {

            getUserDataFromDB()
            console.log("AdminPanel: userId is " + JSON.stringify(userId))
            if (userId.userId === "krs6jGkIgXO0Lgrfp2BEwSBnh3j1") {
                setIsAdmin(true)
                setStatusText("Getting payment requests")
                getPaymentRequests().then((result) => {
                    setPaymentData(result)
                    setStatusText("Getting referral reports")
                })
                getReferralReports().then((result) => {
                    setReferralReportsData(result)
                    setStatusText("")
                    setLoading(false)
                    //console.log(result)
                })

                getAnyDataWithoutChild("users").then((userData) => {

                  var tierArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                  var userDataArray = []
                  var keys = Object.keys(userData)
                  var arrLength = keys.length
                  var totalUsers = 0;
                  var poorUsers = 0;

                  for(var x = 0; x < arrLength; x++) {
                    userDataArray.push(userData[keys[x]])
                    var tempUserObj = userData[keys[x]]
                    var tierNo = Math.ceil(tempUserObj.balance / 5)
                    tierArray[tierNo - 1]++
                    totalUsers++
                    if(tempUserObj.balance == 0) poorUsers++


                  }

                  for(var x = 0; x < 20; x++) {
                    console.log("Between " + (x*5) + " and " + (x*5+5) + ": " + tierArray[x] + ". " + ((tierArray[x] / totalUsers) * 100).toFixed(2) + "%")
                  }

                  console.log("Users who have 0 balance: " + poorUsers + ". " + ((poorUsers/totalUsers) * 100).toFixed(2) + "%")

                  // setData(userDataArray)


                })



                // getAnyDataWithoutChild("users").then((userData) => {
                //
                //   var userDataArray = []
                //   var keys = Object.keys(userData)
                //   var arrLength = keys.length
                //
                //   for(var x = 0; x < arrLength; x++) {
                //     userDataArray.push(userData[keys[x]])
                //   }
                //
                //   setData(userDataArray)
                //
                //
                // })





            } else {
                console.log("You are not an adminPanel")
                history.push("/home")
            }
        }
    }, [userId]);

    return (
        <div>
            <Container maxW="container.xl" centerContent>
                {loading ?
                    <CircularProgress isIndeterminate color="purple" size="120px" thickness="4px">
                        <CircularProgressLabel fontSize="0.1em">{statusText}</CircularProgressLabel>
                    </CircularProgress>
                    :
                    <Box>
                        <HStack>
                            <Heading as="h3">Disable Account By ID</Heading>
                            <Input value={idToDisable} placeholder="Enter ID here" onChange={handleChange}/>
                            <Popover
                                onClose={hideDisablePrompt}
                                closeOnBlur={true}>
                                <PopoverTrigger>
                                    <Button isLoading={isDisablingUser} colorScheme="red">
                                        Disable User Account</Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <PopoverHeader fontWeight="semibold">Confirmation</PopoverHeader>
                                    <PopoverArrow/>
                                    <PopoverCloseButton/>
                                    <PopoverBody>
                                        Are you sure you want to disable this user account?
                                    </PopoverBody>
                                    <PopoverFooter d="flex" justifyContent="flex-end">
                                        <Button onClick={() => disableAccount()}
                                                colorScheme="red">Apply</Button>
                                    </PopoverFooter>
                                </PopoverContent>
                            </Popover>
                        </HStack>
                        <Tabs isFitted variant="enclosed">
                            <TabList mb="1em">
                                <Tab fontSize="xl">Payment Requests</Tab>
                                <Tab fontSize="xl">Referral Reports</Tab>
                            </TabList>
                            <TabPanels>
                                <TabPanel>
                                    <Accordion allowToggle>
                                        {Object.keys(paymentData).map(function (key, index) {
                                            const {
                                                paymentId,
                                                userId,
                                                date,
                                                type,
                                                amount
                                            } = paymentData[key];
                                            return (
                                                <AccordionItem>
                                                    <h2>
                                                        <AccordionButton>
                                                            <Box flex="1" textAlign="left" fontSize="xl">
                                                                {Object.keys(paymentData)[0]}
                                                            </Box>
                                                            <AccordionIcon/>
                                                        </AccordionButton>
                                                    </h2>
                                                    <AccordionPanel pb={4}>
                                                        <PaymentRequestItem
                                                            key={index}
                                                            paymentId={Object.keys(paymentData)[0]}
                                                            userId={userId}
                                                            date={date}
                                                            type={type}
                                                            amount={amount}
                                                            linkId={key}
                                                        />
                                                    </AccordionPanel>
                                                </AccordionItem>
                                            );
                                        })}
                                    </Accordion>
                                </TabPanel>
                                <TabPanel>
                                    {/*<HStack>*/}
                                    {/*    <Heading as="h3">Disable Account By ID</Heading>*/}
                                    {/*    <Input value={idToDisable} placeholder="Enter ID here" onChange={handleChange}/>*/}
                                    {/*    <Popover*/}
                                    {/*        onClose={hideDisablePrompt}*/}
                                    {/*        closeOnBlur={true}>*/}
                                    {/*        <PopoverTrigger>*/}
                                    {/*            <Button isLoading={isDisablingUser} colorScheme="red">*/}
                                    {/*                Disable User Account</Button>*/}
                                    {/*        </PopoverTrigger>*/}
                                    {/*        <PopoverContent>*/}
                                    {/*            <PopoverHeader fontWeight="semibold">Confirmation</PopoverHeader>*/}
                                    {/*            <PopoverArrow/>*/}
                                    {/*            <PopoverCloseButton/>*/}
                                    {/*            <PopoverBody>*/}
                                    {/*                Are you sure you want to disable this user account?*/}
                                    {/*            </PopoverBody>*/}
                                    {/*            <PopoverFooter d="flex" justifyContent="flex-end">*/}
                                    {/*                <Button onClick={() => disableAccount()}*/}
                                    {/*                        colorScheme="red">Apply</Button>*/}
                                    {/*            </PopoverFooter>*/}
                                    {/*        </PopoverContent>*/}
                                    {/*    </Popover>*/}
                                    {/*</HStack>*/}
                                    <Accordion allowToggle>
                                        {Object.keys(referralReportsData).map(function (key, index) {
                                            console.log("referralReportsData[key]" + JSON.stringify(referralReportsData[key]))
                                            return (
                                                <AccordionItem>
                                                    <h2>
                                                        <AccordionButton>
                                                            <Box flex="1" textAlign="left" fontSize="xl">
                                                                {referralReportsData[key].mainUser.userId}
                                                            </Box>
                                                            <AccordionIcon/>
                                                        </AccordionButton>
                                                    </h2>
                                                    <AccordionPanel pb={4}>
                                                        <ReferralReportItem
                                                            key={index}
                                                            reportData={referralReportsData[key]}
                                                            linkId={key}
                                                        />
                                                    </AccordionPanel>
                                                </AccordionItem>
                                            );
                                        })}
                                    </Accordion>
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </Box>
                }
            </Container>

            <Center>

              <table {...getTableProps()} style={{ border: 'solid 1px blue' }}>
         <thead>
           {headerGroups.map(headerGroup => (
             <tr {...headerGroup.getHeaderGroupProps()}>
               {headerGroup.headers.map(column => (
                 <th
                   {...column.getHeaderProps(column.getSortByToggleProps())}
                   style={{
                     borderBottom: 'solid 3px red',
                     background: 'aliceblue',
                     color: 'black',
                     fontWeight: 'bold',
                   }}
                 >
                   {column.render('Header')}
                   <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? ' 🔽'
                          : ' 🔼'
                        : ''}
                    </span>
                 </th>
               ))}
             </tr>
           ))}
         </thead>
         <tbody {...getTableBodyProps()}>
           {rows.map(row => {
             prepareRow(row)
             return (
               <tr {...row.getRowProps()}>
                 {row.cells.map(cell => {
                   return (
                     <td
                       {...cell.getCellProps()}
                       style={{
                         padding: '10px',
                         border: 'solid 1px gray',
                         background: 'black',
                       }}
                     >
                       {cell.render('Cell')}
                     </td>
                   )
                 })}
               </tr>
             )
           })}
         </tbody>
       </table>

            </Center>




        </div>
    );
}
