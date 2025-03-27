export type ChatType = {
  _id: string;
  name: string;
  users: string[];
};

export type ChatUnleashType = {
  _id: string;
  name: string;
  users: UserType[];
};

export type MessageType = {
  _id: string;
  index: number;
  text: string;
  isEdited: boolean;
  chatId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UserType = {
  _id: string;
  login: string;
  password: string;
};
