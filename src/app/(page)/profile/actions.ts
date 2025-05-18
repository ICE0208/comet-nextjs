"use server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export const profileInfoAction = async () => {
  const userInfo = await getCurrentUser();
  if (!userInfo) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { id: userInfo.id },
    select: {
      _count: {
        select: {
          followers: true,
          following: true,
          novels: true,
        },
      },
    },
  });
  if (!user) {
    redirect("/");
  }

  const profileInfo = {
    userId: userInfo.userId,
    location: "-------",
    about: "-".repeat(150),
    followCount: {
      following: user._count.following,
      follower: user._count.followers,
    },
    stats: {
      novelCount: user._count.novels,
      readerCount: "--",
      reviewCount: "--",
      averageRating: "--",
    },
  };

  return profileInfo;
};

export const novelLibraryAction = async () => {
  const userInfo = await getCurrentUser();
  if (!userInfo) {
    redirect("/");
  }

  const novelLibrary = await prisma.user.findUnique({
    where: { id: userInfo.id },
    select: {
      novels: {
        select: {
          id: true,
          title: true,
          description: true,
          createdAt: true,
          imageUrl: true,
          _count: {
            select: {
              episodes: true,
              novelLike: true,
            },
          },
        },
      },
      novelLikes: {
        select: {
          novelId: true,
          novel: {
            select: {
              title: true,
              imageUrl: true,
              author: {
                select: {
                  userId: true,
                },
              },
            },
          },
        },
      },
    },
  });
  if (!novelLibrary) {
    redirect("/");
  }

  return novelLibrary;
};
