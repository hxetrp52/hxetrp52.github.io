---
title : "후배들을 위한 깃허브 사용법"

categories:
  - GitHub
  
toc : true
toc_sticky: true
  
date: 2025-06-10
---

# <span style="color : orange"> 깃허브를 사용해보자! </span>
> ### 준비물 
> - 깃허브 계정
> - 2개 중에 원하는 깃 GUI 설치
>   - [GitHub DeskTop](https://docs.github.com/ko/desktop/installing-and-authenticating-to-github-desktop/installing-github-desktop)
>   - [Git Fork](https://git-fork.com/)
> - 사용할 프로젝트
> - 팀원과 협업하겠다는 강한 의지

## <span style="color : orange">깃허브 개요 </span>
**깃허브**는 프로그래머들이 자신의 작업물을 공유하거나    
프로그래머끼리 협업을 하기 위한 온라인 저장소라 생각하면된다. <span style="color : gray">(구글 드라이브 코딩 버전?) </span>    
       
**서울디지텍고등학교**에선 포트폴리오에 넣을 프로젝트를 저장하거나    
팀원들과 협업하기 위해 사용한다.    
 <span style="color : gray">(그래픽도 이미지같은거 올리면 좋긴한데 그래픽은 구글 드라이브가 확실히 편하다...) </span>    
***
 ### <span style="color : orange">GitHub DeskTop? Fork? 둘이 뭔 차이인가요?</span>
 깃허브는 기본적으로 커맨드 라인 기반으로 cmd같은 터미널 창 열어서 거기서     
 /git push, /git pull 같이 명령어 적어야 하는데 이걸 해결하기위해 Git GUI를 사용한다.   

 Git GUI는 사용자가 사용하기 쉽게 만든 그래픽 중심의 UI다.   
 원래는 명령어치고 경로 찾고해야하는 걸 그냥 "버튼 딸깍"으로 해결할 수 있기 때문에     
 사용하기 쉽고 프로젝트를 터트릴 확률이 낮아지기 때문에 사용하자.

 **서울디지텍고등학교**에서 사용되는 GIt GUI는 크게 2개로 나뉜다.
 >  <span style="color : skyblue">**GitHub DeskTop**</span>        
 >  - 간편하고 라이트함
 >  - 직관적인 UI
 >  - 소형 프로젝트에 적합
 >
 >  <span style="color : skyblue">**Git Fork**</span>
 >  - 엄청 많은 기능
 >  - 프로젝트를 기록 관리에 용이
 >  - 대형 프로젝트에 적합      
 >
 >  깃허브 데스크탑은 가볍게 사용하기 좋고 버튼 큼직하게 있어서 좋지만   
 >  Fork보다 GUI내에서 지원하는 기능이 적고 프로젝트에 기록을 확인 하기 어렵다.     
 >  <span style="color : gray">(커밋 기록이나 브랜치 기록 등)   

 이 글을 끄는 나는 각 GUI를 용도를 나눠서 사용한다.   
 간단하게 개인 저장의 용도로만 사용할려면 <span style="color : skyblue">GitHub DeskTop</span>을 사용하고    
 팀원과 협업을 하는 프로젝트 또는 장기 프로젝트면 <span style="color : skyblue">Git Fork</span>를 사용한다.     

## <span style="color : orange">GUI 사용법 </span>
어떤 GUI를 사용하던 먼저 해야하는 작업이 있다.   
이 작업 후에 각 GUI애서 작업하면된다.

### <span style="color : skyblue">1. 새 리포지토리 생성 </span>
일단 깃허브 웹사이트에서 공유될 저장소를 생성해야한다.     
[깃허브 웹사이트](https://github.com/)      

가장 먼저 깃허브 웹사이트에 들어가 로그인부터 한다.
![image](/assets/Image/GitGUI/GitWebSite.png){: width="80%" height="80%"}
<br>
여기서 오른쪽 상단의 동그란 아이콘을 눌러서 사이드 바를 펼치고   
Your repositories에 들어가면 오른쪽 중상단에 누가봐도 누르고싶게 생긴    
<span style="color : yellowgreen">초록색 [📗New] 버튼</span>을 눌러 새 리포지토리를 생성한다.

![image](/assets/Image/GitGUI/GitRepositolieSetting.png){: width="80%" height="80%"}
<br>

### <span style="color : skyblue">2. 리포지토리 세팅하기 </span>
> ### 리포지토리 세팅
>  - <span style="color : pink">Owner</span> : 소유자, 디폴트 설정은 자기로 되어있음
>  - <span style="color : pink">Repository name</span> : 저장소 이름, 프로젝트 이름 또는 게임 이름
>  - <span style="color : pink">Description</span> : 설명, 이건 써도되고 안써도되고 
>  - <span style="color : pink">Public / Private</span> : 외부 공개 여부     
 <span style="color:red"> 저작권 보호되는 내용, 유료 에셋같은 게 포함되어있는데 public으로 만들면 깃허브 계정이 정지될 수 있으니 조심.</span> 
>     - <span style="color : Plum">Public</span> : 외부에 공개 허용, 다른 사람들이 이 리포지토리에 있는 코드나 이미지를 볼 수 있음
>     - <span style="color : Plum">Private</span> : 외부 공개 허용 안 함, 외부에서 이 프로젝트를 확인 할 수 없음<span style="color:gray"> (Private라도 협업에 지장없음)</span>
> - <span style="color : pink">Add a README file</span> : 저장소를 소개하거나 아니면 라이센스 정보같은 걸 적을 수 있는 저장소의 배너같은 역할을 하는 README 파일을 생성할 것이냐는 체크박스이다.
> - <span style="color : pink">Add .gitignore</span> : 파일 포맷 형식, 유니티로 작업할거면 unity라고 검색해서 적용하면된다.    
<span style="color:gray">깜빡하고 설정 안 했다면 인터넷에서 찾아서 넣으면 된다.</span>
> - <span style="color : pink">Choose a license</span> : 라이센스 선택, 보통 라이센스를 걸을 만한 프로젝트면 private로 만드는 걸 권장함.    
> 

이렇게 리포지토리를 세팅해서 생성을 하면 된다.

### <span style="color : skyblue">3. 팀원 초대 + GUI에 클론 </span>
이제 리포지토리를 생성하는 것을 끝냈으니 이걸 사용해서 협업하는 법을 알아보자면,

![image](/assets/Image/GitGUI/Gitcollabo.png){: width="80%" height="80%"}  
<br>
만든 리포지토리에 들어가서   
**Settings 탭-> Collaboratirs**에 들어가서 **[Add People]** 버튼을 눌러 팀원의 깃허브 아이디를 적으면된다.   
적힌 팀원의 깃허브와 연동된 메일로 초대 확인하라는 메일을 열어서 거기 있는 초대 수락을 클릭하거나    
깃허브 상단 본인 아이콘 옆에 있는 상자 모양 아이콘을 클릭하여 초대를 수락하면 된다.

#### <span style="color : skyblue">리포지토리 클론 </span>
생성한 리포지토리는 아직 온라인에서만 존재하지만 그것을 다운받아서 수정하면 된다.     
생성한 리포지토리에 들어가서 <span style="color : yellowgreen">초록색[<>Code] 버튼</span>을 클릭하여 HTTPS경로를 복사해주면된다.    
![image](/assets/Image/GitGUI/CloneWeb.png){: width="80%" height="80%"}  

복사 한 뒤 원하는 GUI에서 **File 탭 -> Clone**을 누르면 된다.

깃허브 데스크탑에서는 **File -> Clone repository -> URL**을 들어가 경로 설정하고 Clone을 하면된다.   
포크에서는 **File -> Clone**에 들어가 경로 설정하고 Clone하면 된다.     
<span style="color:gray">C나 D같이 드라이브 바로 밑에 git폴더를 만들고 거기서 관리하는 것이 편하다.</span>      

경로를 지정하고 생성했다면 그 리포지토리 페이지가 clone된 것이 GUI에 보여진다면 잘 생성된 것이다.    

### <span style="color : skyblue">4. 유니티 프로젝트 옮기기 + 커밋 올리기 </span>
이제 만들어진 clone 폴더에 만들었던 유니티 프로젝트를 옮기는 법과 커밋 올리기까지하면 협업의 준비가 완료되었다.

깃허브 데스크탑같은 경우에는 왼쪽 상단에 리포지토리 이름 나오고 리포지토리를 선택 할 수 있는 부분에 **마우스 우클릭 -> Show in Explorer**를 통해 파일 경로를 쉽게 찾을 수 있고

포크 같은 경우엔 오른쪽 상단에 **Open in -> Open in File Explorer**를 클릭하여   
파일 경로를 찾을 수 있다.

유니티의 경우엔 프로젝트를 열고 project창에서     
**마우스 우클릭 -> Show in Explorer**를 통해서 경로를 열고

![image](/assets/Image/GitGUI/UnityFile.png){: width="80%" height="80%"} 

안에 있는 내용물들을 깃허브데스크탑 또는 포크에서 열었던 파일 경로로 다 옮기면 된다.    
![image](/assets/Image/GitGUI/uploadrepo.png){: width="80%" height="80%"}  
<br>

그 후 유니티 허브에서 추가(add)란 버튼을 눌러 깃허브데스크탑 또는 포크에서 만들고 유니티 프로젝트를 옮긴 폴더를 추가하여 프로젝트를 추가하면 된다
![image](/assets/Image/GitGUI/addunity.png){: width="80%" height="80%"}  



그렇게 프로젝트가 잘 실행되는지 테스트 해보고   
다시 깃 GUI로 돌아가보면 Local changes란게 숫자가 써져있을텐데     
그것은 변경된 사항들을 알려주는 것이다.

변경된 사항들은 기본적으로 로컬 환경, 그러니까 자기 컴에서만 변경되었을 뿐이고   
다른 사람들의 환경에는 변경되지 않았기 때문에 자신의 변경 사항을 온라인에 있는    
저장소에 저장하기 위해 우리는 "커밋"이란걸 해야한다.

커밋은 온라인에 내 변경사항을 올리는 것인데    
포크를 기준으로 설명하겠다. 
<span style="color : gray">(깃허브 데스크탑도 결국엔 UI배치 차이라 사용 방법은 똑같다.)</span>

![image](/assets/Image/GitGUI/forkcommit.png){: width="80%" height="80%"}  
<br>
먼저 로컬체인지에 들어가서 Unstaged에 있는 변경된 사항들을 Ctrl + A를    
누른 후 stage 버튼을 눌러 staged로 옮긴다.    
여기서 변경하고 싶지 않은 것들은 클릭 후 delete를 눌러 지우면된다.

오른쪽에 커밋명과 설명을 적는 공간이 있다.   
- Commit subject : 커밋명, 보통 작업한 핵심 내용을 적는다.    
- Description : 설명, 보통 작업한 기능과 부분을 적는다.

이것을 작성 후에 오른쪽 하단에 **commit버튼**을 눌러 커밋을 한다.

![image](/assets/Image/GitGUI/commitCheck.png){: width="80%" height="80%"}  
<br>
커밋을 완료했다면 왼쪽 부분에 main으로 적힌 부분 옆에 화살표가 있다면 커밋을 생성했다는 것 이다.    
이제 이 커밋을 온라인 저장소로 업로드를 할 것인데 그 전에  
**Fetch, Pull, Push에 대해 정리 해볼 것이다.**
> - Fetch   
>   Fetch는 새로고침이라 생각하면된다. 현재의 온라인 저장소를 확인하고   
>   변경된 내용에 대해 업데이트해 사용자에게 알려준다.
> - Pull   
>   온라인 저장소에서 다른 사람이 변경한 내용을 다운로드 받는 것 이다.   
>   협업시에 팀원이 한 내용을 다운받기 위해 사용한다.
> - Push    
>   내가 한 작업들을 커밋의 형태로 저장하고 저장된 커밋을 온라인 저장소로    
>   업로드한다

이렇게 정리할 수 있다.    
여기서 팀원이 어떤 걸 작업한 걸 Push를 했다는 걸 알려줬다면   
**Fetch->Pull로 팀원이 작업한 내용을 먼저 받고 Push를 해야한다.**

같이 작업하다가 겹치는 부분이 생기면 Merge를 해야한다고 경고창이 뜰 것이다.   
이것이 뜨는 이유는 작업한 부분이 겹치면 그걸 합쳐야한다고 경고가 뜬다.

간단히 말해서, 1개를 살리고 나머지는 버려야한다.     
그렇기에 깃에 대해 익숙하지 않다면 이게 뜨면 선배님한테 물어보자.

이 Merge를 예방하기 위해 사용하는 방법이 있는데 가장 쉬운 방법은  
유니티에서 협업을 할 때 서로의 이름으로 파일을 만들고   
그 파일에 새로운 씬을 만들고 각자 다른 기능을 만들고   
개발 마지막 부분 때 1명이 여태까지 만들어둔 기능들을 합치는 것이   
첫 깃허브 협업에서 바랄 수 있는 이상향이다.   

만약 한 씬에서 여러명이 작업하면 그만큼 겹치는 부분이 많이 때문에 역할분담을 잘 해보자.

일단 깃에 대해 초기 설정 부분과 커밋 부분만 적어보았고   
나중에 깃의 작동 원리에 대해 정리해보겠다.

이 글을 읽고 이해되는 사람도 있을거고 안되는 사람도 있을건데    
일단 잘 모르겠으면 선배님한테 물어보면 친절히 알려줄거니까    
너무 걱정하지 말고 물어봐주면 좋겠다.
