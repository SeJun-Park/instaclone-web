import styled from "styled-components";

export const SBox = styled.div`
    background-color: ${(props) => props.theme.bgColor};
    border: 1px solid ${(props) => props.theme.borderColor};
    width: 100%;
`;

export const SInput = styled.input`
    width: 100%;
    border-radius: 3px;
    padding: 7px;
    background-color: #fafafa;
    border: 0.5px solid ${(props) => props.theme.borderColor};
    margin-top: 5px;
    box-sizing: border-box;
    &::placeholder {
        font-size: 12px;
    }
    &:focus {
        border-color: rgb(38, 38, 38);
    }
`

export const SButton = styled.input`
    width: 100%;
    border: none;
    /* margin-top: 12px; */
    background-color: ${(props) => props.theme.accentColor};
    color: white;
    text-align: center;
    padding: 8px 0px;
    font-weight: 600;
    opacity: ${(props) => props.disabled ? 0.2 : 1};
`

export const SFatLink = styled.span`
    font-weight: 600;
    color: rgb(142, 142, 142);
`

export const SFormError = styled.span`
    color: tomato;
    font-weight: 600;
    font-size: 12px;
    margin: 5px 0px 5px 0px;
`

export const SNotification = styled.div`
    color: #2ecc71;
`

export const FatText = styled.span`
    font-weight: 600;
`