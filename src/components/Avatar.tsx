import styled from "styled-components"

interface SAvatarProps {
    $large: boolean;
}

const SAvatar = styled.div<SAvatarProps>`
    width: ${(props) => props.$large ? "30px" : "25px"};
    height: ${(props) => props.$large ? "30px" : "25px"};
    border-radius: 50%;
    background-color: #2c2c2c;
    overflow: hidden;
`

const Img = styled.img`
    max-width: 100%;
    align-items: center;
`

interface IAvatarProps {
    url:string;
    large?:boolean;
}

export default function Avatar({ url = "" , large=false }:IAvatarProps) {
    return (
        <SAvatar $large={large}>{url !== "" ? <Img src={url}/> : null}</SAvatar>
    )
}