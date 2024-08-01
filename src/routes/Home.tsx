import { gql, useQuery, useReactiveVar } from "@apollo/client";
import Login from "./Login";
import { isLoggedInVar, logUserOut } from "../apollo";
import { FatText, SButton } from "../components/shared";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ISeeFeedData, ISeeFeedVars } from "../types";
import styled from "styled-components";
import Avatar from "../components/Avatar";
import { FaBookmark, FaComment, FaHeart, FaPaperPlane, FaRegBookmark, FaRegComment, FaRegHeart, FaRegPaperPlane } from "react-icons/fa";
import Photo from "../components/feed/Photo";
import { Helmet } from "react-helmet-async";
import { COMMENT_FRAGMENT, PHOTO_FRAGMENT } from "../fragments";


export const FEED_QUERY = gql`
query seeFeed($myCursor:Int) {
    seeFeed(myCursor:$myCursor) {
        ...PhotoFragment
        user {
            id
            username
            avatar
        }
        caption
        comments {
            ...CommentFragment
        }
        createdAt
        isMine
    }
}
    ${PHOTO_FRAGMENT}
    ${COMMENT_FRAGMENT}
`
// id, file, totalLikes, totalComments, isLiked 등 자주 사용하는 것들은 FRAGMENT로 분리해서 사용할 수 있음.
// seeFeed는 실제로 [Photo] 로 배열이지만 Photo에서 받고 싶은 정보만 쓰고 배열이라는 건 굳이 따로 작성하지 않아도 되는 듯.

export default function Home() {

    const isLoggedIn = useReactiveVar(isLoggedInVar);
    // const navigate = useNavigate();

    // useEffect(() => {
    //     if (!isLoggedIn) {
    //         navigate("/login");
    //     }
    // }, [isLoggedIn]);

    const { data, loading, error } = useQuery<ISeeFeedData, ISeeFeedVars>(FEED_QUERY);
    // console.log(data)

    return (
        <Layout>
            <Helmet><title>Home</title></Helmet>
            {isLoggedIn && data?.seeFeed.map((photo) => <Photo key={photo.id}
                                                                id={photo.id} 
                                                                avatar={photo.user.avatar}
                                                                username={photo.user.username}
                                                                caption={photo.caption}
                                                                comments={photo.comments}
                                                                file={photo.file}
                                                                isLiked={photo.isLiked}
                                                                totalLikes={photo.totalLikes}
                                                                totalComments={photo.totalComments} />)}

            {isLoggedIn ? <SButton type="submit" value={"logOut"} onClick={logUserOut}></SButton> : <h1>Please Log in</h1>}
        </Layout>
    )
}