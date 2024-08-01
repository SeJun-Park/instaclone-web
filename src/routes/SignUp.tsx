import { FaInstagram } from "react-icons/fa"
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { SFormError, SBox, SButton, SFatLink, SInput } from "../components/shared";
import { gql, useMutation, useReactiveVar } from "@apollo/client";
import { isLoggedInVar } from "../apollo";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { ICreateAccountData, ICreateAccountVar } from "../types";
import { useEffect } from "react";

const HeaderContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`

const SubTitle = styled(SFatLink)`
    font-size: 16px;
    text-align: center;
    margin-top: 16px;
`

const Container = styled.div`
    display: flex;
    height: 100vh;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`;

const TopBox = styled(SBox)`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 35px 40px 25px 40px;
    margin-bottom: 10px;
    form {
        margin-top: 35px;
        width: 100%;
        display: flex;
        justify-items: center;
        flex-direction: column;
        align-items: center;
}
`;

const BottomBox = styled(SBox)`
    padding: 20px 40px;
    text-align: center;
    a {
        font-weight: 600;
        color: ${(props) => props.theme.accentColor};
        margin-left: 3px;
    }
`;

const Wrapper = styled.div`
    max-width: 350px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const Separator = styled.div`
    margin: 30px 0px 0px 0px;
    text-transform: uppercase;
    display: flex;
    justify-content: center;
    width: 100%;
    align-items: center;
    div {
        width: 100%;
        height: 1px;
        background-color: rgb(219, 219, 219);
    }
    span {
        margin: 0px 10px;
        font-weight: 600;
        font-size: 12px;
        color: #8e8e8e;
    }
`;

const CREATE_ACCOUNT_MUTATION = gql`
    mutation createAccount(
        $firstName: String!
        $lastName: String
        $username: String!
        $email: String!
        $password: String!
    ) {
        createAccount(
            firstName:$firstName
            lastName:$lastName             
            username:$username 
            email:$email 
            password:$password 
        ) {
            ok
            error
        }
    }
`

interface ISignUpForm {
    email:string;
    firstName:string;
    lastName:string;
    username: string;
    password: string; 
}

export default function SignUp() {

    const isLoggedIn = useReactiveVar(isLoggedInVar);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/");
        }
    }, [isLoggedIn]);


    const { register, handleSubmit, reset, formState : {errors, isValid}, setError, getValues } = useForm<ISignUpForm>({
        mode: "onChange"
    });

    const [ createAccount, { loading, data, error } ] = useMutation<ICreateAccountData, ICreateAccountVar>(CREATE_ACCOUNT_MUTATION, {
        onCompleted: (data) => {
            console.log('Mutation completed successfully:', data);
            // 추가적인 로직 실행 가능
            const { createAccount : { ok, error } } = data;
            const { username, password } = getValues();
        
            if(!ok) {
                setError("password", {
                    message: error
                })
            }
            navigate("/", {
                state: {
                    message: "Account created. Please Login",
                    username:username,
                    password:password
                }
            })
          },
        onError: (error) => {
            console.log('Mutation failed!', error);
            // 에러 핸들링 로직 실행 가능
          }
    });

    const onSubmit = ({email, firstName, lastName, username, password} : ISignUpForm) => {

        if(loading) {
            return;
        }

        createAccount({
            variables: {
                email:email,
                firstName:firstName, 
                lastName:lastName, 
                username:username, 
                password:password
            }
        })
    }



    return (
        <Container>
            <Helmet>
                <title>sign-up | instaclone</title>
            </Helmet>
            <Wrapper>
                <TopBox>
                    <HeaderContainer>
                        <FaInstagram size={40} />
                        <SubTitle>
                            Sign Up to see photos and videos from your friends
                        </SubTitle>
                    </HeaderContainer>
                    <Separator>
                        <div></div>
                        <span>Or</span>
                        <div></div>
                    </Separator>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <SInput {...register("email", {required:"email is required"})} type="text" placeholder="Email" />
                        {errors.email && <SFormError>{errors.email.message}</SFormError>}
                        <SInput {...register("firstName", {required:"firstName is required"})} type="text" placeholder="First Name" />
                        {errors.firstName && <SFormError>{errors.firstName.message}</SFormError>}
                        <SInput {...register("lastName", {required:"lastName is required"})} type="text" placeholder="Last Name" />
                        {errors.lastName && <SFormError>{errors.lastName.message}</SFormError>}
                        <SInput {...register("username", {required:"username is required", minLength:{value:5,message:"username should be longer than 5"}})} type="text" placeholder="Username" />
                        {errors.username && <SFormError>{errors.username.message}</SFormError>}
                        <SInput {...register("password", {required:"password is required"})} type="password" placeholder="Password" />
                        {errors.password && <SFormError>{errors.password.message}</SFormError>}
                        <SButton type="submit" value={loading ? "loading.." : "Sign Up"} disabled={!isValid || loading} />
                    </form>
                </TopBox>
                <BottomBox>
                    <span>Have an account?</span> 
                    <Link to="/"> Login</Link>
                </BottomBox>
            </Wrapper>
        </Container>
    )
}