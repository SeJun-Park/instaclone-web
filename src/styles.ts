import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

export const GlobalStyle = createGlobalStyle`
    ${reset};
    input {
        all:unset;
    }
    * {
        box-sizing: border-box;
    }
    body {
        background-color: ${props => props.theme.bgColor};
        font-family: "Open Sans", sans-serif;
        color: ${props => props.theme.fontColor};
    }
    a {
        text-decoration: none;
        color: inherit;
    }
`