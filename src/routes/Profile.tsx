import { gql, useApolloClient, useMutation, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom"
import { PHOTO_FRAGMENT } from "../fragments";
import { IFollowUserData, IFollowUserVars, ISeeProfileData, ISeeProfilePhoto, ISeeProfileVars, IUnfollowUserData, IUnfollowUserVars } from "../types";
import { Fragment, useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import styled from "styled-components";
import { FatText, SButton } from "../components/shared";
import { FaComment, FaHeart } from "react-icons/fa";
import Layout from "../components/Layout";
import { Helmet } from "react-helmet-async";
import useUser from "../hooks/useUser";
// import { ME_QUERY } from "../hooks/useUser";

const Header = styled.div`
    display: flex;
`;
const Avatar = styled.img`
    margin-left: 50px;
    height: 160px;
    width: 160px;
    border-radius: 50%;
    margin-right: 150px;
    background-color: #2c2c2c;
`;
const Column = styled.div``;
const Username = styled.h3`
    font-size: 28px;
    font-weight: 400;
`;
const Row = styled.div`
    margin-bottom: 20px;
    font-size: 16px;
    display: flex;
`;
const List = styled.ul`
    display: flex;
`;
const Item = styled.li`
    margin-right: 20px;
`;
const Value = styled(FatText)`
    font-size: 18px;
`;
const Name = styled(FatText)`
    font-size: 20px;
`;

const Grid = styled.div`
    display: grid;
    grid-auto-rows: 290px;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
    margin-top: 50px;
`;

interface IPhotoProps {
    bg:string;
}

const Photo = styled.div<IPhotoProps>`
    background-image: url(${(props) => props.bg});
    background-size: cover;
    position: relative;
`;

const Icons = styled.div`
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    opacity: 0;
    &:hover {
        opacity: 1;
    }
`;

const Icon = styled.span`
    font-size: 18px;
    display: flex;
    align-items: center;
    margin: 0px 5px;
    svg {
        font-size: 14px;
        margin-right: 5px;
    }
`;

const ProfileBtn = styled(SButton).attrs({
    as: "span",
    })`
    margin-left: 10px;
    margin-top: 0px;
    padding: 8px;
    cursor: pointer;
    `;

const SEE_PROFILE_QUERY = gql`
    query seeProfile($username:String!, $myCursor:Int) {
        seeProfile(username:$username) {
            id
            username
            firstName
            lastName
            avatar
            bio
            totalFollowers
            totalFollowings
            photos(myCursor:$myCursor) {
                ...PhotoFragment
            }
            isMe
            isFollowing
        }
    }
    ${PHOTO_FRAGMENT}
`

const FOLLOW_USER_MUTATION = gql`
mutation followUser($username:String!) {
    followUser(username:$username) {
        ok
        id
        error
    }
}`

const UNFOLLOW_USER_MUTATION = gql`
mutation unfollowUser($username:String!) {
    unfollowUser(username:$username) {
        ok
        id
        error
    }
}`

export default function Profile() {

    const { username } = useParams();
    const paramUsername = username || ""

    const { data:userData } = useUser();

    const [myCursor, setMyCursor] = useState<number | undefined>(undefined);
    const [hasMore, setHasMore] = useState(true);

    const { ref, inView } = useInView();
    const [allPhotos, setAllPhotos] = useState<ISeeProfilePhoto[]>([]);

    const client = useApolloClient();
    // mutation의 update 함수의 인자를 이용하지 않더라도 cache에 직접 접근할 수 있음.

    const { data , loading, error, fetchMore } = useQuery<ISeeProfileData, ISeeProfileVars>(SEE_PROFILE_QUERY, {
        variables: {
            username: paramUsername,
            myCursor
        },
        onCompleted: (data) => {
            if (data?.seeProfile.photos) {
              setAllPhotos((prevPhotos) => [...prevPhotos, ...data.seeProfile.photos]);
            }
        }
    });

    const [ followUser, { data:followUserData, loading:follwUserLoading, error:followUserError }] = useMutation<IFollowUserData, IFollowUserVars>(FOLLOW_USER_MUTATION, {
        variables: {
            username:paramUsername
        },
        // refetchQueries: [{query:SEE_PROFILE_QUERY, variables:{username:paramUsername}}, {query:ME_QUERY}]
        // onCompleted: (data) => {
        //     const { followUser: {ok}} = data;

        //     if(!ok) {
        //         return;
        //     }

        //     const { cache } = client;

        //     cache.modify({
        //         id: `User:${paramUsername}`,
        //         // apollo.ts 에서 cache 설정을 이렇게 해줬기 때문, 보통은 id 값으로 함.
        //         fields: {
        //             isFollowing(prev) {
        //                 return true
        //             },
                    // totalFollowers(prev) {
                    //     return prev + 1
                    // }
        //         }
        //     })

        // },
        update: (cache, result) => {
            if(result.data && result.data.followUser) {
                const { data: {followUser: {ok}}} = result;

                if(!ok) {
                    return;
                }

                cache.modify({
                    id: `User:${paramUsername}`,
                    // apollo.ts 에서 cache 설정을 이렇게 해줬기 때문, 보통은 id 값으로 함.
                    fields: {
                        isFollowing(prev) {
                            return true
                        },
                        totalFollowers(prev) {
                            return prev + 1
                        }
                    }
                })

                if(userData && userData.me) {
                    cache.modify({
                        id: `User:${userData.me.username}`,
                        // apollo.ts 에서 cache 설정을 이렇게 해줬기 때문, 보통은 id 값으로 함.
                        fields: {
                            totalFollowings(prev) {
                                return prev + 1
                            }
                        }
                    })
                }
            }
        }
    });
    const [ unfollowUser, { data:unfollowUserData, loading:unfollowUserLoading, error:unfollowUserError }] = useMutation<IUnfollowUserData, IUnfollowUserVars>(UNFOLLOW_USER_MUTATION, {
        variables: {
            username:paramUsername
        },
        // refetchQueries: [{query:SEE_PROFILE_QUERY, variables:{username:paramUsername}}, {query:ME_QUERY}]
        // onCompleted: (data) => {
        //     const { unfollowUser: {ok}} = data;

        //     if(!ok) {
        //         return;
        //     }

        //     const { cache } = client;

        //     cache.modify({
        //         id: `User:${paramUsername}`,
        //         // apollo.ts 에서 cache 설정을 이렇게 해줬기 때문, 보통은 id 값으로 함.
        //         fields: {
        //             isFollowing(prev) {
        //                 return false
        //             },
                        // totalFollowers(prev) {
                        //     return prev - 1
                        // }
        //         }
        //     })

        // },
        update: (cache, result) => {
            if(result.data && result.data.unfollowUser) {
                const { data: {unfollowUser: {ok}}} = result;

                if(!ok) {
                    return;
                }

                cache.modify({
                    id: `User:${paramUsername}`,
                    // apollo.ts 에서 cache 설정을 이렇게 해줬기 때문, 보통은 id 값으로 함.
                    fields: {
                        isFollowing(prev) {
                            return false
                        },
                        totalFollowers(prev) {
                            return prev - 1
                        }
                    }
                })

                if(userData && userData.me) {
                    cache.modify({
                        id: `User:${userData.me.username}`,
                        // apollo.ts 에서 cache 설정을 이렇게 해줬기 때문, 보통은 id 값으로 함.
                        fields: {
                            totalFollowings(prev) {
                                return prev - 1
                            }
                        }
                    })
                }


            }
        }
    });

    const loadMorePhotos = useCallback( () => {

        if (!hasMore || !data) {
            return;
        }
        // 더 불러올 사진이 없으면 LoadMorePhotos를 실행하지 않음.

        if(data) {

            const photosData = data.seeProfile.photos

            if (photosData.length > 0) {

                const lastPhotoId = photosData[photosData.length - 1].id;

                setMyCursor(lastPhotoId);
                fetchMore({

                    variables: {
                        username: username || "",
                        myCursor: lastPhotoId
                    },

                    updateQuery: (previousResult, { fetchMoreResult }) => {

                        if (!fetchMoreResult) {
                            setHasMore(false);
                            return previousResult;
                        }
                
                        return {
                            seeProfile: {
                            ...previousResult.seeProfile,
                            photos: [
                                ...previousResult.seeProfile.photos,
                                ...fetchMoreResult.seeProfile.photos,
                            ],
                            },
                        };
                    },
                });
            }
        }
    }, [hasMore, data, fetchMore, username]);

    useEffect(() => {
        if (inView) {
          loadMorePhotos();
          console.log("InView!")
        }
      }, [hasMore, inView, loadMorePhotos]);

    console.log(data);

    const getProfileBtn = (data:ISeeProfileData) => {
        const { seeProfile : { isMe, isFollowing } } = data;

        if(data) {
            if(isMe) {
                return <ProfileBtn>Edit Profile</ProfileBtn>
            } 
            if(isFollowing) {
                return <ProfileBtn onClick={ () => unfollowUser() }>UnFollow</ProfileBtn>
            } else {
                return <ProfileBtn onClick={ () => followUser() }>Follow</ProfileBtn>
            }
        }
    }

    return (
    <Layout>
        <Helmet><title>{loading ? "Loading..." : `${data?.seeProfile.username}'s Profile | instaclone`}</title></Helmet>
        <div>
            <Header>
                <Avatar src={data?.seeProfile?.avatar} />
                <Column>
                    <Row>
                        <Username>{data?.seeProfile?.username}</Username>
                        {data && getProfileBtn(data)}
                    </Row>
                    <Row>
                        <List>
                            <Item>
                                <span>
                                    <Value>{data?.seeProfile?.totalFollowers}</Value> followers
                                </span>
                            </Item>
                            <Item>
                                <span>
                                    <Value>{data?.seeProfile?.totalFollowings}</Value> following
                                </span>
                            </Item>
                        </List>
                    </Row>
                    <Row>
                        <Name>
                            {data?.seeProfile?.firstName}
                            {"  "}
                            {data?.seeProfile?.lastName}
                        </Name>
                    </Row>
                    <Row>
                        {data?.seeProfile?.bio}
                    </Row>
                </Column>
            </Header>
            <Grid>
            {allPhotos.map((photo) => (
                                                        <Photo key={photo.id} bg={photo.file}>
                                                            <Icons>
                                                                <Icon>
                                                                    <FaHeart />
                                                                    {photo.totalLikes}
                                                                </Icon>
                                                                    <Icon>
                                                                    <FaComment />
                                                                    {photo.totalComments}
                                                                </Icon>
                                                            </Icons>
                                                        </Photo>
            ))}
            </Grid>
        </div>
        <div ref={ref} style={{ height: 20 }}></div> {/* 이 div가 뷰포트에 들어오면 더 많은 데이터를 로드합니다 */}
    </Layout>
    )
}