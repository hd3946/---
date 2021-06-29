import multer from 'multer';   //이미지 업로드
import path from 'path';
const upload_path = path.resolve(__dirname, '../uploads');  //업로드 위치

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, upload_path) // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
    },
    filename: function (req, file, cb) {
      cb(null,  Date.now()  + '-' + file.originalname);
    }
  })

const upload = multer({ storage: storage })   


export default upload;