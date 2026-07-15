import type { MicroCMSQueries } from "microcms-js-sdk";

import type {
  ProfileObj as Profile,
  ProfileResponse,
  SandboxResponse,
  WorksResponse,
} from "@/gen/types/microcms-schemas";

import { client } from "./micro-cms";

export const getProfile = async (queries?: MicroCMSQueries) => {
  const res = await client.getObject<ProfileResponse>({
    endpoint: "profile",
    queries,
  });

  const profile: Omit<Profile, "skills"> = {
    name: res.name,
    bio: res.bio,
    description: res.description,
    icon: res.icon,
  };

  return { profile, skills: res.skills };
};

export type WorksListItem = Pick<WorksResponse, "title" | "tags" | "releaseDate">;

export const getWorksList = async (queries?: MicroCMSQueries) => {
  return client.getList<WorksListItem>({
    endpoint: "works",
    queries: {
      orders: "-releaseDate",
      limit: 100,
      fields: ["title", "tags", "releaseDate"],
      ...queries,
    },
  });
};

export const getWorksDetail = async (contentId: string, queries?: MicroCMSQueries) => {
  return client.getListDetail<WorksResponse>({
    endpoint: "works",
    contentId,
    queries,
  });
};

export const getSandboxList = async (queries?: MicroCMSQueries) => {
  return client.getList<SandboxResponse>({
    endpoint: "sandbox",
    queries,
  });
};
