import axios from 'axios';
import oauth from 'oauth'; 

function getAuthorization(httpMethod, baseUrl, reqParams) {
    
// Get acces keys
const consumerKey       = process.env.TWITTER_CONSUMER_KEY,
    consumerSecret      = process.env.TWITTER_CONSUMER_SECRET,
    accessToken         = process.env.TWITTER_ACCESS_TOKEN_KEY,
    accessTokenSecret   = process.env.TWITTER_ACCESS_TOKEN_SECRET;

//헤더파일 인증 생성
var consumer = new oauth.OAuth(
    "https://twitter.com/oauth/request_token", "https://twitter.com/oauth/access_token", 
    consumerKey ,  consumerSecret, "1.0A", "http://127.0.0.1:3000/sessions/callback", "HMAC-SHA1");
var parameters2 = consumer._prepareParameters(accessToken, accessTokenSecret, httpMethod, baseUrl);
var headers = consumer._buildAuthorizationHeaders(parameters2);

    //console.log(headers);  
    return headers;
}

const searchUser = async (text) => {
  
    const baseURL = "https://api.twitter.com/1.1/statuses/user_timeline.json";
    
    const searchParams = `?screen_name=${text}&count=1`;
    const URL = baseURL + searchParams;
    
    const tweetRequest =  await axios(URL, { 
      headers: {
        Authorization: getAuthorization(
            'GET',
            URL
        )
    }
      });

    let twitdata = {
        name: '',
        description: '',
        profile_image: '',
        created_at: 0,
        text: '',
        url: '',
        media_url: '',
    }  
    const tdata = tweetRequest.data;
    //console.log("profile_image:",tdata);

    for(let key in tdata){
        //console.log("생성날짜:",tdata[key].created_at);
        twitdata.created_at = tdata[key].created_at;
        //console.log("텍스트:",tdata[key].text);
        twitdata.text = tdata[key].text;
        let edata = tdata[key].entities.urls
        let mdata = tdata[key].entities.media   
        let udata = tdata[key].user
        //console.log("name:",udata.name);
        twitdata.name = udata.name;
        //console.log("description:",udata.description);
        twitdata.description = udata.description;
        //console.log("profile_image:",udata.profile_image_url);
        twitdata.profile_image = udata.profile_image_url;
        for(let i in edata){
            //console.log("링크:",edata[key].url);
            twitdata.url = edata[i].url;
        }
        for(let i in mdata){
            //console.log("media:",mdata[key].media_url);   //사진
            twitdata.media_url = mdata[i].media_url;
        }
    }
    //console.log(twitdata);
    return twitdata;
  };

/*
"text"
entities:{
    
    media 데이터가 없을수도 있음{
        "media_url"
    }
}
*/


  export default searchUser;