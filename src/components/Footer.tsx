import { useReactiveVar } from "@apollo/client"
import styled from "styled-components"
import { darkModeVar, disableDarkMode, enableDarkMode } from "../apollo"
import { FaRegMoon, FaRegSun } from "react-icons/fa"

const FooterStyle = styled.footer`
    padding: 50px 0px;
    display: flex;
    align-items: center;
    justify-content: center;
`

const Wrapper = styled.div`
    max-width: 930px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const DarkModeBtn = styled.span`
    cursor: pointer;
`
export default function Footer() {

    const darkMode = useReactiveVar(darkModeVar);

    return (
        <FooterStyle>
            <Wrapper>
                <DarkModeBtn onClick={darkMode ? disableDarkMode : enableDarkMode}>
                    {darkMode ? <FaRegSun /> : <FaRegMoon />}
                </DarkModeBtn>
            </Wrapper>
        </FooterStyle>
    )
}