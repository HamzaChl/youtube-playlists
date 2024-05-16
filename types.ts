export interface Root {
    videos: Video[];
}

export interface Video{
    title: string;
    url: string;
    description: string;
    rating: number;
};

export interface User{
    username:string;
    password:string;
}