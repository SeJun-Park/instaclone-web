import { createBrowserRouter } from 'react-router-dom';
import Home from './routes/Home';
import NotFound from './routes/NotFound';
import Root from './routes/Root';
import SignUp from './routes/SignUp';
import Login from './routes/Login';
import Profile from './routes/Profile';

const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <Root />,
            children: [
                {
                    path: "",
                    element: <Home />,
                },
                {
                    path: "users/:username",
                    element: <Profile />
                }
            ],
            errorElement: <NotFound />
        },
        {
            path: "login",
            element: <Login />
        },
        {
            path: "signup",
            element: <SignUp />
        }
    ]
)

export default router;