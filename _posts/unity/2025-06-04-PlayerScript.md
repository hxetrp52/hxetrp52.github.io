---
title : "레바의 모험 모작(2) - 플레이어 스크립트"

categories:
  - unity

tags:
  - [Reva's adventure]

date: 2025-06-05
---

# <span style="color:orange">레바의 모험 모작! 플레이어 스크립트 제작!</span>
레바의 모험에 나오는 플레이어를 만들 예정이다.
일단 설계는 Player란 클래스를 만들고
하위 클래스로 웨펀마스터, 거너, 레인저, 버서커 등 Player를 상속받는 직업군마다 Class를 만들 생각이다.

## <span style="color:orange">전체 코드 </span>
```c#
using UnityEngine;
using UnityEngineInternal;
using System.Collections;
using System.Collections.Generic;

public class Player : MonoBehaviour
{
    [Header("스탯")]
    [SerializeField] private int maxHp = 150;        // 최대 HP
    [SerializeField] protected int hp = 150;         // 현재 HP
    [SerializeField] public int attackPower = 10;    // 기본 공격력
    [SerializeField] protected float moveSpeed = 5f; // 이동 속도
    [SerializeField] protected float jumpForce = 5f; // 점프 힘

    protected bool isStun = false;       // 스턴 상태 여부
    protected bool canMove = false;      // 이동 가능 여부
    protected bool isInvincible = false; // 무적 상태 여부
    protected bool isJump = false;       // 점프 중 여부
    protected bool isBackJump = false;   // 백점프 중 여부

    protected Rigidbody2D playerRigid;   // 플레이어의 Rigidbody2D 컴포넌트
    protected Animator playerAnimator;   // 플레이어 애니메이터

    // 초기화 함수
    protected virtual void Start()
    {
        hp = maxHp; // 현재 HP를 최대 HP로 설정
        playerRigid = GetComponent<Rigidbody2D>();            // Rigidbody2D 컴포넌트 가져오기
        playerAnimator = GetComponentInChildren<Animator>();  // 자식 오브젝트에서 Animator 컴포넌트 가져오기
    }

    // 매 프레임마다 호출
    protected virtual void Update()
    {
        // G 키를 누르면 에어본 상태로 만든다 (디버그용 또는 테스트용)
        if (Input.GetKeyDown(KeyCode.G))
        {
            Airborne(3, 7);
        }
        if (Input.GetKeyDown(KeyCode.Y)) TakeDamage(5);
        if (Input.GetKeyDown(KeyCode.Z)) TakeHeal(5);

        // 스턴 상태거나 이동이 불가능하거나 백점프 중이면 입력 무시
        if (isStun || canMove || isBackJump) return;

        Move(); // 이동 처리
        Jump(); // 점프 처리
    }

    #region 이동&점프
    // 좌우 이동 처리
    private void Move()
    {
        float h = Input.GetAxisRaw("Horizontal"); // 좌우 입력값 (-1, 0, 1)
        Vector2 velocity = new Vector2(h * moveSpeed, playerRigid.linearVelocity.y);
        playerRigid.linearVelocity = velocity; // 속도 설정

        // 방향 전환 (좌우 반전)
        if (h != 0)
            transform.localScale = new Vector3(h > 0 ? 1 : -1, 1, 1);

        // 애니메이션 파라미터 설정
        playerAnimator.SetFloat("MoveSpeed", Mathf.Abs(h));
    }

    // 점프 및 백점프 처리
    private void Jump()
    {
        // 스페이스바를 눌렀고 점프 중이 아닐 때
        if (Input.GetButtonDown("Jump") && !isJump)
        {
            playerRigid.AddForce(Vector2.up * jumpForce, ForceMode2D.Impulse);
            isJump = true;
            playerAnimator.SetTrigger("Jump");
        }

        // ↓ 키를 눌렀고 점프 중이 아닐 때 백점프
        if (Input.GetKeyDown(KeyCode.DownArrow) && !isJump)
        {
            BackJump();
        }
    }

    // 백점프 처리
    private void BackJump()
    {
        isBackJump = true;                  // 백점프 상태로 설정
        playerRigid.linearVelocity = Vector2.zero; // 기존 속도 제거
        Vector2 force = new Vector2(-2f * transform.localScale.x, 4f); // 뒤로 튕겨 오르는 힘
        playerAnimator.SetTrigger("BackJump"); // 백점프 애니메이션
        playerRigid.AddForce(force, ForceMode2D.Impulse); // 힘 가하기
    }
    #endregion

    // 에어본(공중으로 날리기) 처리
    public void Airborne(float flydistance, float flyheight)
    {
        if (isInvincible) return; // 무적 상태면 무시

        isStun = true;  // 스턴 상태로 변경
        isJump = true;  // 점프 상태로 설정
        playerRigid.linearVelocity = Vector2.zero; // 속도 제거
        Vector2 force = new Vector2(-flydistance * transform.localScale.x, flyheight); // 반대 방향으로 날아가는 힘
        playerRigid.AddForce(force, ForceMode2D.Impulse); // 힘 가하기

        // 에어본 애니메이션 상태로 설정
        if (playerAnimator != null)
            playerAnimator.SetBool("Airborne", true);
    }

    #region 체력
    // 힐하는 함수
    public void TakeHeal(int Heal)
    {
        hp += Heal; // 힐하기
        if(hp > maxHp) // hp가 maxHp를 넘으면
        {
            hp = maxHp; // hp를 maxHp로 만들기
        }
    }

    // 데미지를 입는 함수
    public void TakeDamage(int damage)
    {
        if (isInvincible) return; // 무적이면 무시
        hp -= damage;             // 체력 감소
        if (hp <= 0)
        {
            Die(); // 사망 처리
        }
    }

    // 사망 처리
    private void Die()
    {
        isStun = true;        // 스턴 상태
        isInvincible = true;  // 무적 처리 (죽은 뒤에는 무적)
        // 게임 오버 관련 처리 추가 예정
    }

    #endregion

    // 땅과 충돌하면 착지 처리
    void OnCollisionEnter2D(Collision2D collision)
    {
        if (collision.gameObject.CompareTag("Ground"))
        {
            isJump = false;      // 점프 상태 해제
            isBackJump = false;  // 백점프 상태 해제

            // 에어본 상태였다면 스턴 해제 및 애니메이션 복구
            if (isStun)
            {
                isStun = false;
                playerAnimator.SetBool("Airborne", false);
            }
        }
    }
}
```
# <span style="color:orange">코드 설명</span>
### <span style="color:skyblue"> 변수 선언 </span>
일반적으로 변수들은 protected로 선언하였고   
특이하게 attackPower는 public으로 선언했는데 이유는 skill이란 클래스를 따로 선언하고    
그 클래스에서 플레이어 캐릭터의 공격력을 받아서 스킬의 데미지 공식에 맞추기 위해    
public으로 선언 했다      

스탯은 기본적으로 <span style="color:skyblue">[SerializeField]</span>을 통해 유니티의 인스펙터에서도 수정할 수 있게 제작했디.    
bool형 변수들은 **플레이어의 행동 상태를 체크하기 위해 작성**했고   
isJump와 isBackJump의 차이점은 일반 점프는 높게 뛰어오르고 캐릭터를 조종할 수 있지만    
백점프는 살짝 뒤로 뛰어오르고 캐릭터를 조종할 수 없다.    
레바의 모험 시리즈의 폭발물 같은 것은 플레이어가 붙어있는 바닥을 기준으로 터지기 떄문에     
보통 백점프를 이용해서 폭발물을 피한다.
*** 
### <span style="color:skyblue"> 함수 선언 </span>
함수는 기본적으로 private와 public을 사용했다.   
이동같은 것은 private로 Player클래스 안에서만 사용가능해서 다른 곳에서 수정할 수 없게 했고    
적과 상호작용 해야하는 부분(에어본, 데미지받기)은 public으로 제작했다.

## <span style="color:orange"> 마무리 </span>
플레이어의 코드를 작성했다.    
플레이어 코드를 상속하는 직업 클래스를 만들어 
거기에 캐릭터의 정보, 스킬을 담고    
플레이어의 직업군에 따라 대사나 일러스트를 다르게 만들 것 이다.


