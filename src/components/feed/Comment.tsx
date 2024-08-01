import styled from "styled-components";
import { FatText } from "../shared";
import sanitizeHtml from "sanitize-html";
import React from "react";
import { Link } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { IDeleteCommentData, IDeleteCommentVars } from "../../types";

const SComment = styled.div`
    margin-bottom: 7px;
`;

const CommentPayload = styled.span`
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

const DELETE_COMMENT_MUTATION = gql`
    mutation deleteComment($commentId:Int!) {
        deleteComment(commentId:$commentId) {
            ok
            error
        }
    }
`


interface ICommentsProps {
    commentId:number;
    username:string;
    payload:string;
    isMine:boolean;
    photoId:number;
}

export default function Comment(props:ICommentsProps) {

    const [deleteComment, { data, loading, error }] = useMutation<IDeleteCommentData, IDeleteCommentVars>(DELETE_COMMENT_MUTATION, {
        update: (cache, result) => {

            if (result.data && result.data.deleteComment) {

                const { ok } = result.data.deleteComment;

                if(ok) {

                    cache.evict({ id: `Comment:${props.commentId}` })
                    // 캐시에서 객체를 제거하고 있음.

                    cache.modify({
                        id: `Photo:${props.photoId}`,
                                fields: {
                                    totalComments(prev) {
                                        return prev - 1
                                    }
                                }
                    }) 
                }
            }
        }
    });

    const onDeleteClick = () => {
        deleteComment({
            variables: {
                commentId:props.commentId
            }
        })
    }

    return (
            <SComment>
                <Link to={`/users/${props.username}`}>
                    <FatText>{props.username}</FatText>
                </Link>
                {/* <CommentPayload dangerouslySetInnerHTML={{__html:sanitizeHtml(props.payload.replace(/#[\w]+/g, "<mark>$&</mark>"), {allowedTags:["mark"]})}}/> */}
                <CommentPayload>
                    {props.payload.split(" ").map((word, index) =>
                                                            /#[\w]+/.test(word) ? (
                                                                <React.Fragment key={index}>
                                                                    <Link to={`/hashtags/${word}`}>{word} </Link>{" "}
                                                                </React.Fragment>
                                                            ) : (
                                                                <React.Fragment key={index}>{word} </React.Fragment>
                                                                // key 문제 때문에 추가한 것, React.Fragment 는 혈식적인 것. <></> 와 같은 것.
                                                            )
                                                            )}
                </CommentPayload>
                {props.isMine ? <button onClick={onDeleteClick}>✖️</button> : null}
            </SComment>
        )
}