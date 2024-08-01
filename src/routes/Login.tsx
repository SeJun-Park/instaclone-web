import { FaFacebookSquare, FaInstagram, FaRegMoon, FaRegSun } from "react-icons/fa"
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { SFormError, SNotification, SBox, SButton, SInput } from "../components/shared";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { gql, useMutation } from "@apollo/client";
import { ILoginData, ILoginVar } from "../types";
import { client, logUserIn } from "../apollo";

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
    margin: 20px 0px 30px 0px;
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

const FacebookLogin = styled.div`
    color: #385285;
    span {
        margin-left: 10px;
        font-weight: 600;
    }
`;


const LOGIN_MUTATION = gql`
    mutation login($username:String!, $password:String!) {
        login(username:$username, password:$password) {
            ok
            token
            error
        }
    }
`
// const LOGIN_MUTATION = gql`mutation login($username:String!, $password:String!) 여기까지 프론드엔드 설정 그 뒤로 백엔드랑 연결 설정이라고 이해하면 쉬움. 여기서의 login은 임의로 설정 가능.

interface ILoginForm {
    username: string;
    password: string;
}

export default function Login() {

    const location = useLocation();
    const navigate = useNavigate();

    const { register, handleSubmit, reset, formState : {errors, isValid}, setError } = useForm<ILoginForm>({
        // mode: "onBlur"
        mode: "onChange",
        // 유효성을 검증하는 많은 mode 중 하나, 기본적으로 OnSubmit 지금은 OnChange로 변경하여 실시간으로 검증하고 있음.
        defaultValues: {
            username: location?.state?.username || "",
            password: location?.state?.password || ""
        }
    });

    const [ login, { loading, data, error }] = useMutation<ILoginData, ILoginVar>(LOGIN_MUTATION, {
        onCompleted: (data) => {
            console.log('Mutation completed successfully:', data);
            // 추가적인 로직 실행 가능
            const { login : { ok, token, error } } = data;
            if(!ok) {
                setError("password", {
                    message: error
                })
            }

            if(token) {
                logUserIn(token);
            }

            navigate("/")
            window.location.reload();
            // 임시 방편, 쿼리로 하는 방법 있을 듯?
          },
        onError: (error) => {
            console.log('Mutation failed:', error);
            // 에러 핸들링 로직 실행 가능
          }
    });

    const onSubmit = ({ username, password }:ILoginForm) => {

        if(loading) {
            return;
        }

        login({
            variables: {
                username:username,
                password:password
            }
        })
    }

    return (
        <Container>
            <Helmet>
                <title>LogIn | instaclone</title>
            </Helmet>
            <Wrapper>
                <TopBox>
                    <div>
                        <FaInstagram size={40} />
                    </div>
                    <SNotification>{location?.state?.message}</SNotification>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <SInput {...register("username", {required:"username is required", minLength:{value:5,message:"username should be longer than 5"}})} type="text" placeholder="Username" />
                        {errors.username && <SFormError>{errors.username.message}</SFormError>}
                        <SInput {...register("password", {required:"password is required"})} type="password" placeholder="Password" />
                        {errors.password && <SFormError>{errors.password.message}</SFormError>}
                        <SButton type="submit" value={loading ? "loading.." : "Log in"} disabled={!isValid || loading} />
                    </form>
                    <Separator>
                        <div></div>
                        <span>Or</span>
                        <div></div>
                    </Separator>
                    <FacebookLogin>
                        <FaFacebookSquare />
                        <span>Log in with Facebook</span>
                    </FacebookLogin>
                </TopBox>
                <BottomBox>
                    <span>Don't have an account?</span> 
                    <Link to="/signup"> Sign Up</Link>
                </BottomBox>
            </Wrapper>
        </Container>
    )
}