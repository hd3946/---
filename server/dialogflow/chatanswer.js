function answer(data) { 
  if(data.includes('트와이스'))
        {
          var text = "TWICE";
          return text;
        }    
        else if(data.includes('블랙핑크'))
        {
          var text = "Blackpink";
          return text;
        }
        else if(data.includes('방탄소년단'))
        {
          var text = "BTS";
          return text;
        }
        else if(data.includes('마마무'))
        {
          var text = "MaMaMu";
          return text;
        }
        else if(data.includes('레드벨벳'))
        {
          var text = "RedVelVet";
          return text;
        }
        else if(data.includes('유저'))
        {
          var text = "User";
          return text;
        }
        else{
            return data;
        }
}

var isEmpty = function(value){ 
  if( value == "" || value == null || value == undefined || ( value != null && typeof value == "object" && !Object.keys(value).length ) ){
    return true 
    }
  else{
    return false 
  } 
};      
export default answer;
            