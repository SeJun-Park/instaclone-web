////////////login////////////

export interface ILoginVar {
    username: string;
    password: string;
}

export interface ILoginData {
    login: {
        ok:boolean;
        token?:string;
        error?:string;
    }
}


///////////createAccount/////////

export interface ICreateAccountVar {
    email:string;
    firstName:string;
    lastName?:string;
    username:string;
    password:string;
}

export interface ICreateAccountData {
    createAccount: {
        ok:boolean;
        id?:number;
        error?:string;
    }
}


///////////me/////////

export interface IMeData {
    me: {
        id:number;
        username:string;
        avatar?:string;
        // totalFollwers:number;
        // totalFollowings:number;
    }
}

///////////seeFeed/////////

interface ISeeFeedUser {
    id:number;
    username: string;
    avatar: string;
  }

interface ISeeFeedComment {
    id:number;
    payload:string;
    user:ISeeFeedUser;
    isMine:boolean;
    createdAt:string;
}
  
  interface ISeeFeedPhoto {
    id: number;
    user: ISeeFeedUser;
    file: string;
    caption?: string;
    comments: ISeeFeedComment[];
    totalLikes: number;
    totalComments: number;
    createdAt: string; // createdAt은 일반적으로 ISO 문자열입니다.
    isMine: boolean;
    isLiked: boolean;
  }
  
  interface ISeeFeedData {
    seeFeed: ISeeFeedPhoto[];
  }
  
  interface ISeeFeedVars {
    myCursor?: number;
  }
  
  //////toggleLike///////

export interface IToggleLikeData {
    toggleLike: {
        ok:boolean;
        id?:number;
        error?:string;
    }
}

export interface IToggleLikeVar {
    photoId:number;
}

////////////CreateComment

interface ICreateCommentData {
    createComment: {
        ok:boolean;
        id?:number;
        error?:string;
    }
}
  
interface ICreateCommentVars {
    photoId:number;
    payload:string;
}

////////////DeleteComment

interface IDeleteCommentData {
    deleteComment: {
        ok:boolean;
        id?:number;
        error?:string;
    }
}
  
interface IDeleteCommentVars {
    commentId:number;
}

////////////SeeProfile

interface ISeeProfilePhoto {
    id:number;
    file:string;
    totalLikes:number;
    totalComments:number;
    isLiked:boolean;
}

interface ISeeProfileData {
    seeProfile: {
        id:number;
        username:string;
        firstName:string;
        lastName:string;
        avatar:string;
        bio:string;
        totalFollowers:number;
        totalFollowings:number;
        photos:ISeeProfilePhoto[];
        isMe:boolean;
        isFollowing:boolean;
    }
}
  
interface ISeeProfileVars {
    username:string;
    myCursor?:number;
}

////////////FollowUser

export interface IFollowUserData {
    followUser: {
        ok:boolean;
        id?:number;
        error?:string;
    }
}

interface IFollowUserVars {
    username:string;
}


////////////UnFollowUser

export interface IUnfollowUserData {
    unfollowUser: {
        ok:boolean;
        id?:number;
        error?:string;
    }
}

interface IUnfollowUserVars {
    username:string;
}