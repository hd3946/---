import fs from 'fs';
const dialogflow = require("dialogflow");
const keyFile = JSON.parse(fs.readFileSync("Chat_Bot_key.json"));
//const keyFile = JSON.parse(fs.readFileSync("DialogFlow_key.json"));

const projectId = keyFile["project_id"];
const privateKey = keyFile["private_key"];
const clientEmail = keyFile["client_email"];

//console.log("dialogflow_key확인",projectId, privateKey, clientEmail);

const config = {
  credentials: {
    private_key: privateKey,
    client_email: clientEmail
  }
};
const sessionClient = new dialogflow.SessionsClient(config);

async function tryDF(data) {
    let response = await detectIntent(projectId, "123456789", data, "ko-KR");
    //console.log("response:" + response.queryResult.fulfillmentText);        // 응답문 
    //console.log(response.queryResult.action);
    //console.log("파라미터:",response.queryResult.parameters.fields.TWICE.stringValue);    //파라미터 잘라내기
    //console.log(response.queryResult.allRequiredParamsPresent);
    //console.log(response.queryResult.outputContexts);
     let parameters_data = '';
     let payload = response.queryResult.fulfillmentMessages.find(elem=>{
       return elem.message ==='payload'
      });

     if (payload){
       //console.log("PAYLOAD:",payload.payload.fields.hint.stringValue);  //  payload 이용 
      }
      console.log("파라미터:",response.queryResult.parameters.fields); 
      if(!isEmpty(response.queryResult.parameters.fields)){
        if(!isEmpty(response.queryResult.parameters.fields.idol)){
          parameters_data = response.queryResult.parameters.fields.idol.stringValue;
        }
      }
      //console.log("PAYLOAD:",isEmpty(parameters_data.fields));  //  값 확인

    const message = {message:"bot: " + response.queryResult.fulfillmentText, parameters: parameters_data};
    return message;
}

async function detectIntent(projectId, sessionId, query, languageCode) {
// The path to identify the agent that owns the created intent.
const sessionPath = sessionClient.sessionPath(projectId, sessionId);

// The text query request.
const request = {
  session: sessionPath,
  queryInput: {
    text: {
      text: query,
      languageCode: languageCode
    }
  }
};

  const responses = await sessionClient.detectIntent(request);
  //console.log("ㅅㄷㄴㅅ", responses);
  return responses[0];
} 

const isEmpty = function(value){ 
  if( value == "" || value == null || value == undefined || ( value != null && typeof value == "object" && !Object.keys(value).length ) ){
    return true 
    }
  else{
    return false 
  } 
};


export default tryDF;



