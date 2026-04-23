export interface User {
  uid: string;
  email: string;
  username: string;
  displayName: string;
  bio: string;
  photoURL: string;
}

export const currentUser: User = {
  uid: "user-123",
  email: "user@example.com",
  username: "mylink_user",
  displayName: "홍길동",
  bio: "안녕하세요! 다양한 채널의 링크를 모아두는 공간입니다. 🚀",
  photoURL: "https://github.com/shadcn.png", // 예시 프로필 이미지
};
