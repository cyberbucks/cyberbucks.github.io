import React, {useEffect, useState} from 'react';
import {getLinkData} from "../firebaseUtilities";
import {
    Box,
    Button,
    Center,
    CircularProgress,
    Container,
    Heading,
    Icon,
    Link,
    SimpleGrid,
    SlideFade,
    Text
} from "@chakra-ui/react";
import Card from "./Card";
import {AiFillWarning, BiDownArrow, IoAdd} from "react-icons/all";
import {Link as ReactLink} from "react-router-dom";
import {printText} from "../devUtilities";

export default function Websites({userData}) {

    const [linkData, setLinkData] = useState({})
    const [dataIsFetched, setDataIsFetched] = useState(false)
    const [userVisited, setUserVisited] = useState([])


    useEffect(() => {
        if (userData.linksInfo !== undefined) { //checking so we don't try to reach into the linksInfo prop before our parent gives us the updated userData prop

            var visitArray = [];

            getLinkData().then((data) => {
                delete data[0] //remove the empty object that's keeping the parent node from deleted so it doesn't get shown to the end user
                setLinkData(data)

                Object.keys(data).map(function (key, index) {

                    if (userData.linksInfo[key] !== undefined) { //since our userData does not have all the link info in the link pool, we set (not visited) as default in this local array if our userData does not have the said link
                        visitArray.push({[key]: userData.linksInfo[key].visited})
                    } else {
                        visitArray.push({[key]: false})
                    }

                })

                setUserVisited(visitArray)

                setDataIsFetched(true)

            })
        }


    }, [userData]);


    return (
        <Box className="contentContainer" mx={[2, 0]}>
            <SlideFade in={true} offsetY="40px">
                <Container maxW="500rem" centerContent>
                    <Heading mb={5}><Icon as={BiDownArrow} mx={[4, 10]} pb={1} w={10} h={10}/>WEBSITES<Icon
                        as={BiDownArrow} mx={[4, 10]} pb={1} w={10} h={10}/></Heading>
                    <Text fontSize="xl" mt={1} mb={2}>View sponsored links and earn tokens!</Text>
                    <Center mt={1} mb={2}><Icon as={AiFillWarning} color="brand.purple" size={20}/><Text fontSize="md"
                                                                                                         mx={2}>Please
                        remain careful when visiting user-submitted links.</Text></Center>
                    <Center my={5}><Link as={ReactLink} to="/addlink">
                        <Button variant="outline" bg="transparent" leftIcon={<IoAdd size={25}/>}
                                boxShadow="0 0 10px rgba(255, 255, 255, 0.4)"
                                _hover={{
                                    color: "brand.purple",
                                    borderColor: "brand.purple",
                                    boxShadow: "0 0 10px rgba(95, 32, 91, 0.4)"
                                }}
                                _active={{transform: "scale(0.98)"}} borderRadius="0px"
                                size="lg"> Add Your Link</Button>
                    </Link></Center>
                </Container>
            </SlideFade>

            {!dataIsFetched ? <Center mx={4} mt={4}>
                    <CircularProgress isIndeterminate color="brand.blue1" size="50px" trackColor="brand.sky"/></Center>
                :

                <SlideFade in={dataIsFetched} offsetY="40px">
                    <Container maxW="80rem" centerContent>
                        <SimpleGrid columns={[1, 2, 1, 2]}>
                            {Object.keys(linkData).map(function (key, index) {
                                const {
                                    addr,
                                    coinPrize,
                                    currentVisits,
                                    desc,
                                    logo,
                                    minDurSec,
                                    sponsored,
                                    title,
                                    visitGoal
                                } = linkData[key];
                                // printText("testHere " + userData.linksInfo[1901].visited)
                                // const userVisited = userData.linksInfo[key].visited
                                return (
                                    <Card
                                        key={index}
                                        addr={addr}
                                        currentVisits={currentVisits}
                                        coinPrize={coinPrize}
                                        desc={desc}
                                        logo={logo}
                                        minDurSec={minDurSec}
                                        sponsored={sponsored}
                                        title={title}
                                        linkId={key}
                                        visitGoal={visitGoal}
                                        userVisited={userVisited[index][key]}
                                    />
                                );
                            })}
                        </SimpleGrid>
                    </Container>
                </SlideFade>


            }
        </Box>
    );
}
