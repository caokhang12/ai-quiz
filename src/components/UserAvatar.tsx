import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "next-auth";
import React from "react";

type Props = {
  user: Pick<User, "name" | "image">;
};

const UserAvatar = ({ user }: Props) => {
  return (
    <Avatar className="">
      {user.image ? (
        <AvatarImage src={user.image} />
      ) : (
        <AvatarFallback><span className="">{user?.name}</span></AvatarFallback>
      )}
    </Avatar>
  );
};

export default UserAvatar;
