import { ApolloProvider, useReactiveVar } from "@apollo/client";
import { RouterProvider } from "react-router-dom";
import { client, darkModeVar, isLoggedInVar } from "./apollo";
import { GlobalStyle } from "./styles";
import { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "./theme";
import router from "./router";
import { HelmetProvider } from "react-helmet-async";

function App() {

  // const isLoggedIn = useReactiveVar(isLoggedInVar);
  // isLoggedInVar(true)
  const darkMode = useReactiveVar(darkModeVar);

  return (
      <HelmetProvider> 
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
          <GlobalStyle />
          <ApolloProvider client={client}>
            <RouterProvider router={router} />
          </ApolloProvider>
        </ThemeProvider>
      </HelmetProvider>
  )
}

export default App;
