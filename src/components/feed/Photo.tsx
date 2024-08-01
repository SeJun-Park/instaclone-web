
import styled from "styled-components";
import { FaBookmark, FaComment, FaHeart, FaPaperPlane, FaRegBookmark, FaRegComment, FaRegHeart, FaRegPaperPlane } from "react-icons/fa";
import Avatar from "../Avatar";
import { FatText } from "../shared";
import { gql, useMutation } from "@apollo/client";
import { ICreateAccountVar, ICreateCommentData, ICreateCommentVars, IToggleLikeData, IToggleLikeVar } from "../../types";
import React, { useEffect } from "react";
import { FEED_QUERY } from "../../routes/Home";
import Comment from "./Comment";
import sanitizeHtml from "sanitize-html";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import CreateCommentForm from "./CreateCommentForm";

const PhotoContainer = styled.div`
    background-color: white;
    border: 1px solid ${(props) => props.theme.borderColor};
    margin-bottom: 20px;
    max-width: 615px;
`;
const PhotoHeader = styled.div`
    padding: 15px;
    display: flex;
    align-items: center;
`;

const Username = styled(FatText)`
    font-size: 12px;
    margin-left: 15px;
`

const PhotoFile = styled.img`
    min-width: 100%;
    max-width: 100%;
`

const PhotoData = styled.div`
    padding: 15px;
`;

const PhotoActions = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;

    div {
        display: flex;
        align-items: center;
    }

    /* svg {
        font-size: 20px;
    } */
`;

const PhotoAction = styled.div`
    margin-right: 10px;
    cursor: pointer;
`;

const Likes = styled(FatText)`
    margin-top: 15px;
    display: block;
`;

const TOGGLE_LIKE_MUTATION = gql`
    mutation toggleLike($photoId:Int!) {
        toggleLike(photoId:$photoId) {
            ok
            error
        }
    }
`

const CommentsContainer = styled.div`
    margin-top: 20px;
`;

const Caption = styled.div`

`;

const CaptionPayload = styled.span`
    margin-left: 10px;
    a {
        background-color: inherit;
        color: ${(props) => props.theme.accentColor};
        cursor: pointer;
        &:hover {
            text-decoration: underline;
        }
    }
`;

const CommentCount = styled.span`
    opacity: 0.7;
    margin: 10px 0px;
    display: block;
    font-weight: 600;
    font-size: 10px;
`;

interface IPhotoUser {
    username: string;
    avatar: string;
}

interface IPhotoComment {
    id:number;
    payload:string;
    user:IPhotoUser;
    isMine:boolean;
    createdAt:string;
}

interface IPhotoProps {
    id:number;
    avatar?:string;
    username:string;
    caption?:string;
    comments: IPhotoComment[];
    file:string;
    isLiked:boolean;
    totalLikes:number;
    totalComments:number;
}


export default function Photo( props : IPhotoProps ) {

    const [ toggleLike, { data:ToggleLikeData, loading:ToggleLikeLoading, error:ToggleLikeError }] = useMutation<IToggleLikeData, IToggleLikeVar>(TOGGLE_LIKE_MUTATION, {
        variables: {
            photoId:props.id
        },
        onCompleted: (data) => {

        },
        onError: (error) => {
            console.log(error)
        },
        // refetchQueries: [{query:FEED_QUERY}]
        // 변수가 필요하면 {query:__, variables:{}} 이렇게 작성하면 됨.

        update: (cache, result) => {
            if (result.data && result.data.toggleLike) {
                const { ok } = result.data.toggleLike;
                // Update cache logic
                if(ok) {

                    // const readFragementResult : {isLiked:boolean, totalLikes:number} | null = cache.readFragment({
                    //     id: `Photo:${props.id}`,
                    //     fragment: gql`
                    //         fragment PhotoFragment on Photo {
                    //             isLiked
                    //             totalLikes
                    //         }
                    //     `
                    // })

                    // if(readFragementResult && "isLiked" in readFragementResult && "totalLikes" in readFragementResult) {
                    //     cache.writeFragment({
                    //         id: `Photo:${props.id}`,
                    //         fragment: gql`
                    //             fragment PhotoFragment on Photo {
                    //                 isLiked
                    //                 totalLikes
                    //             }
                    //         `,
                    //         data: {
                    //             isLiked: !readFragementResult.isLiked,
                    //             totalLikes: readFragementResult.isLiked ? readFragementResult.totalLikes - 1 : readFragementResult.totalLikes + 1
                    //         }
                    //     })
                    // }

                    cache.modify({
                        id: `Photo:${props.id}`,
                        fields: {
                            isLiked(prev) {
                                return !prev
                            },
                            totalLikes(prev, { readField }) {
                                const isLiked = readField<boolean>('isLiked');
                                // totalLikes(prev, { readField }) 함수는 readField를 사용하여 isLiked 필드의 현재 값을 읽어옵니다.
                                return isLiked ? prev - 1 : prev + 1;
                            }
                        }
                    })

                    // console.log("readFragementResult", readFragementResult);

                    // cache.writeFragment({
                    //     id: `Photo:${props.id}`,
                    //     fragment: gql`
                    //         fragment PhotoFragment on Photo {
                    //             isLiked
                    //             totalLikes
                    //         }
                    //     `,
                    //     data: {
                    //         isLiked: !props.isLiked,
                    //         totalLikes: props.isLiked ? props.totalLikes - 1 : props.totalLikes + 1
                    //     }
                    // })
                }
            }
        }
        // update는 백엔드에서 받은 데이터를 주는 function - apollo cache에 직접 연결해줌 --> cache, data(result로 이름 다시 지정해줬음 헷갈릴까봐) 를 인자로 받음.
    });


    return (
        <PhotoContainer>
            <PhotoHeader>
                <Link to={`/users/${props.username}`}>
                    <Avatar url={props?.avatar || ""} large={true} />
                </Link>
                <Link to={`/users/${props.username}`}>
                    <Username>{props.username}</Username>
                </Link>
            </PhotoHeader>
            <PhotoFile src={props.file} />
            <PhotoData>
                <PhotoActions>
                    <div>
                        <PhotoAction onClick={() => toggleLike()}>
                            {props.isLiked ? <FaHeart size={20} color="tomato"/> : <FaRegHeart size={20} />}
                        </PhotoAction>
                        <PhotoAction>
                            <FaRegComment size={20} />
                        </PhotoAction>
                        <PhotoAction>
                            <FaRegPaperPlane size={20} />
                        </PhotoAction>
                    </div>
                    <div>
                        <FaRegBookmark size={20} />
                    </div>
                </PhotoActions>
                <Likes>
                {props.totalLikes === 1 ? "1 like" : `${props.totalLikes} likes`}
                </Likes>
                <CommentsContainer>
                    <Caption>
                    <Link to={`/users/${props.username}`}>
                        <FatText>{props.username}</FatText>
                    </Link>
                        {/* {props.caption && <CaptionPayload dangerouslySetInnerHTML={{__html:sanitizeHtml(props.caption.replace(/#[\w]+/g, "<mark>$&</mark>"), {allowedTags:["mark"]})}}/>} */}
                        <CaptionPayload>
                        {props.caption && props.caption.split(" ").map((word, index) =>
                                                                    /#[\w]+/.test(word) ? (
                                                                        <React.Fragment key={index}>
                                                                            <Link to={`/hashtags/${word}`}>{word} </Link>{" "}
                                                                        </React.Fragment>
                                                                    ) : (
                                                                        <React.Fragment key={index}>{word} </React.Fragment>
                                                                    )
                                                                    )}
                        </CaptionPayload>
                    </Caption>
                    <CommentCount>
                        {props.totalComments === 1 ? "1 comment" : `${props.totalComments} comments`}
                    </CommentCount>
                    {props.comments.map((comment) => <Comment key={comment.id} commentId={comment.id} username={comment.user.username} payload={comment.payload} isMine={comment.isMine} photoId={props.id} />)}

                    <CreateCommentForm photoId={props.id} />

                </CommentsContainer>
            </PhotoData>
        </PhotoContainer>
    )
}