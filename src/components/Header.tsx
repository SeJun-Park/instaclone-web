import { useReactiveVar } from "@apollo/client";
import styled from "styled-components";
import { isLoggedInVar } from "../apollo";
import { FaCompass, FaHome, FaInstagram, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import useUser from "../hooks/useUser";
import Avatar from "./Avatar";

const SHeader = styled.header`
    width: 100%;
    border-bottom: 1px solid ${(props) => props.theme.borderColor};
    background-color: ${(props) => props.theme.bgColor};
    padding: 18px 0px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Wrapper = styled.div`
    max-width: 930px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Column = styled.div``;

const Icon = styled.span`
    margin-left: 15px;
`;

const Button = styled.span`
    background-color: ${(props) => props.theme.accentColor};
    border-radius: 4px;
    padding: 4px 10px;
    color: white;
    font-weight: 600;
`

const IconsContainer = styled.div`
    display: flex;
    align-items: center;
`


export default function Header() {
const isLoggedIn = useReactiveVar(isLoggedInVar);
const { data:userData, loading:userLoading } = useUser();

console.log("hey", userData?.me.avatar)

return (
        <SHeader>
            <Wrapper>
                <Column>
                    <FaInstagram />
                </Column>
                <Column>
                    {isLoggedIn ? (
                                    <IconsContainer>
                                        <Icon>
                                            <Link to={"/"}>
                                                <FaHome size={20} />
                                            </Link>
                                        </Icon>
                                        <Icon>
                                            <FaCompass size={20} />
                                        </Icon>
                                        {userData?.me.avatar ? <Icon><Link to={`/users/${userData.me.username}`}><Avatar url={userData?.me?.avatar} large={false} /></Link></Icon> : <Icon><FaUser /></Icon>}
                                    </IconsContainer>
                                    ) : <Link to={"/login"}>
                                            <Button>Log in</Button>
                                        </Link>}
                </Column>
            </Wrapper>
        </SHeader>
);
}