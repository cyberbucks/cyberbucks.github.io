import { extendTheme } from "@chakra-ui/react"

export const overrides = {
    fonts: {
        heading: "Blender Heading",
        body: "Blender Body",
    },
    colors: {
        brand: {
            purple: "#f252e8",
            sky: "#020426",
            blue1: "#0F9BF2",
            blue2: "#14d9d9",
            sun: "#f2a594",
            dark: "#0F0422",
            yellow: '#FFC233',
            orange: '#E73F20',
            blue1old: "#1ac6d9",
            darkold: "#130622",
        }
    },
    styles: {
        global: {
            body: {
                margin: "0",
                padding: "0",
                minHeight: "100%",
                color: "white",
            }
        }
    },
    components: {
        Link: {
            _hover: {
                textDecoration: "none",
                borderBottomStyle: "none",
                textDecorationColor: "transparent"
            },
            textDecoration: "none",
            borderBottomStyle: "none",
            textDecorationColor: "transparent"
        },
        Button: {
            _hover: {
                textDecoration: "none",
                borderBottomStyle: "none",
                textDecorationColor: "transparent"
            },
            textDecoration: "none",
            borderBottomStyle: "none",
            textDecorationColor: "transparent"
        }
    }
}

export default extendTheme(overrides)