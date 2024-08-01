import { gql, useMutation } from "@apollo/client";
import { ICreateCommentData, ICreateCommentVars } from "../../types";
import { useForm } from "react-hook-form";
import useUser from "../../hooks/useUser";
import styled from "styled-components";

const PostCommentContainer = styled.div`
    margin-top: 10px;
    padding-top: 15px;
    padding-bottom: 10px;
    border-top: 1px solid ${(props) => props.theme.borderColor};
`;

const PostCommentInput = styled.input`
    width: 100%;
    &::placeholder {
        font-size: 12px;
    }
`;

const CREATE_COMMENT_MUTATION = gql`
    mutation createComment($photoId:Int!, $payload:String!) {
        createComment(photoId:$photoId, payload:$payload) {
            ok
            id
            error
        }
    }
`

interface ICreateCommentFormProps {
    photoId:number;
}

interface ICreateCommentForm {
    payload:string;
}

export default function CreateCommentForm( props : ICreateCommentFormProps ) {

    const { data:userData } = useUser();
    const { register, handleSubmit, formState : {errors, isValid}, setValue, getValues } = useForm<ICreateCommentForm>();
    const [ createComment, { data:createCommentData, loading:createCommentLoading, error:createCommentError } ] = useMutation<ICreateCommentData, ICreateCommentVars>(CREATE_COMMENT_MUTATION, {
        onCompleted: (data) => {

        },
        update: (cache, result) => {

            const { payload } = getValues();
            setValue("payload", "");

            if (result.data && result.data.createComment) {

                const { ok, id } = result.data.createComment;

                if(ok && userData?.me) {

                    const newComment = {
                        __typename: "Comment",
                        createdAt: String(Date.now()),
                        id:id,
                        isMine:true,
                        payload:payload,
                        user: {
                            ...userData.me
                        }
                    };

                    const newCacheComment = cache.writeFragment({
                        fragment: gql`
                            fragment CommentFragment on Comment {
                                id,
                                createdAt,
                                isMine,
                                payload,
                                user {
                                    username
                                    avatar
                                }
                            }
                        `,
                        data: newComment
                    })

                    // writeFragment를 통해서 새로 만들어진 result 속 진짜 Comment 형태를 캐시에 심어줘야 삭제 등의 기능을 캐시 상태에서도 할 수 있음.
                    // newComment 형태로만 보여지게 하면 흉내만 내는 것일 뿐 다른 기능으로 확장 불가능.
                    // 이렇게 해야 graphQL의 cache에 실제 DB와 같은 형태의 Comment가 생성되므로 새로고침하지 않고 삭제를 곧바로 진행할 수 있는 것.
                    // like는 필드 하나를 수정하는 것이므로 이렇게까지 안해도 됨. 다만 생성과 삭제 개념이 들어가면 이렇게 해야하는 듯.

                    cache.modify({
                        id: `Photo:${props.photoId}`,
                                fields: {
                                    comments(prev) {
                                        // const newComments = prev.push(newComment);
                                        // return newComments;
                                        return [...prev, newCacheComment]
                                        //기존 comments에 NEwComment를 추가하여 리턴
                                    },
                                    totalComments(prev) {
                                        return prev + 1
                                    }
                                }
                    })
                }
            }
        },
        onError: (error) => {
            // console.log(error)
        }
    })

    const onSubmit = ({ payload } : ICreateCommentForm) => {
        if(createCommentLoading) {
            return;
        }

        createComment({
            variables: {
                photoId:props.photoId,
                payload:payload
            }
        })
    }


    return (
            <PostCommentContainer>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <PostCommentInput {...register("payload", {required:true})}
                    type="text"
                    placeholder="Write a comment..."
                    />
                </form>
            </PostCommentContainer>
    )
}