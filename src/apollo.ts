import { ApolloClient, InMemoryCache, makeVar, ApolloLink, HttpLink } from "@apollo/client";

const TOKEN = "token";
const DARK_MODE = "DARK_MODE"

export const isLoggedInVar = makeVar(Boolean(localStorage.getItem(TOKEN)));

export const logUserIn = (token:string) => {
    localStorage.setItem(TOKEN, token);
    isLoggedInVar(true)
}

export const logUserOut = () => {
    localStorage.removeItem(TOKEN);
    isLoggedInVar(false)
    window.location.reload();
}


export const darkModeVar = makeVar(Boolean(localStorage.getItem(DARK_MODE)));

export const enableDarkMode = () => {
    localStorage.setItem(DARK_MODE, "enabled");
    darkModeVar(true);
}

export const disableDarkMode = () => {
    localStorage.removeItem(DARK_MODE);
    darkModeVar(false);
}

// HttpLink 설정: GraphQL 서버 URI 지정
const httpLink = new HttpLink({ uri: 'http://localhost:4001/graphql' });

// AuthLink 설정: 요청(request)에 인증 헤더 추가
const authLink = new ApolloLink((operation, forward) => {
  // operation.setContext를 사용하여 컨텍스트 설정 --> 이름은 CONTExt지만 context가 아닌 req에 추가해주는 과정인 듯.
  operation.setContext(({ headers = {} }) => {
    // {headers} 라고 작성해도 됨, = {} 는 기본값을 설정해주는 것임.
    // const token = localStorage.getItem(TOKEN);
    return {
      headers: {
        ...headers,
        // token: token ? `Bearer ${token}` : "",
        token : localStorage.getItem(TOKEN)
      }
    };
    // return 을 통해 기존 request.headers에 token을 추가해주고 있음.
  });

  // 다음 링크로 요청 전달
  return forward(operation);
});


export const client = new ApolloClient({
    // uri: "http://localhost:4001/graphql",
    cache: new InMemoryCache({
        typePolicies: {
            User: {
                keyFields: (obj) => `User:${obj.username}`
            }
        }
        // ID를 받아오기 싫을 때 이렇게 하면 해당 필드 (USERNAME)를 고유식별자로 객체를 참조할 수 있음.
    }),
    connectToDevTools: true,
    link: ApolloLink.from([authLink, httpLink]),
    // apollo client 가 데이터 소스와 소통하는 방식
    // uri 도 link 방식으로 연결해줄 수 있음.
    // ApolloLink.from을 사용하여 authLink와 httpLink를 결합합니다.
})