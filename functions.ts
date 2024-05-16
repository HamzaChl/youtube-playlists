

export async function startUp(){
    const resp = await fetch("https://raw.githubusercontent.com/similonap/json/master/videos.json");
    const data: Root = await resp.json();
    const videoArray: video[] = data.videos;
    console.log(videoArray);
    const amount : number = await collection.countDocuments();

    if(amount===0){
        await collection.insertMany(videoArray);
    }
}