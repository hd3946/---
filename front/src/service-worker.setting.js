export default () => {
    const isSupported = process.browser && 'serviceWorker' in navigator;
  
    if (!isSupported) {
      return;
    }
  
    console.log('서비스 워커가 지원되는 브라우저 입니다.');
  
    const runtime = require('serviceworker-webpack-plugin/lib/runtime');
  
    runtime.register().then(res => {
      console.log('서비스 워커 설치 성공 ->', res);
    }).catch(e => {
      console.log('서비스 워커 설치 실패 ㅜㅜ -> ', e);
    });
  }