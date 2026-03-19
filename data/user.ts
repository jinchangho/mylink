export interface User {
  uid: string;
  email: string;
  username: string;
  display_name: string;
  bio: string;
  photo_url: string;
}

export const currentUser: User = {
  uid: "user-123",
  email: "user@example.com",
  username: "mylink_user",
  display_name: "홍길동",
  bio: "안녕하세요! 다양한 채널의 링크를 모아두는 공간입니다. 🚀",
  photo_url: "https://github.com/shadcn.png", // 예시 프로필 이미지
};
