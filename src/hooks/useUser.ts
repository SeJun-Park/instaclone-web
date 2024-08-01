import { gql, useQuery, useReactiveVar } from "@apollo/client"
import { isLoggedInVar, logUserOut } from "../apollo";
import { IMeData } from "../types";
import { useEffect } from "react";

const ME_QUERY = gql`
    query me {
        me {
            id
            username
            avatar
            # totalFollowers
            # totalFollowings
        }
    }
`

export default function useUser() {

    const isLoggedIn = useReactiveVar(isLoggedInVar);
    const { data, loading, error } = useQuery<IMeData>(ME_QUERY, {
        skip: !isLoggedIn
        // 사실은 토큰을 가지고 있는 지를 보고 있음. isLoggedIn이 false이면 이 과정을 SKip 결국엔 DATA.me는 NULL
    });
    useEffect(() => {
        if(data?.me === null) {
            console.log("there is a token on lS but the token did not work on the backend")
            logUserOut();
            // 토큰이 유효하지 않으면 백엔드에서 NULL을 뱉어내므로 (protectedResolver logic) 이 경우 로그아웃 시킴.
        }
    }, [data])
    // console.log(data)
    return { data, loading };
}