import type { MicroCMSQueries } from "microcms-js-sdk";

import type {
  BannersResponse,
  ProfileObj,
  ProfileResponse,
  SandboxResponse,
  WorksObj,
  WorksResponse,
} from "@/gen/types/microcms-schemas";

import { client } from "./micro-cms";

export const getProfile = async (queries?: MicroCMSQueries) => {
  const res = await client.getObject<ProfileResponse>({
    endpoint: "profile",
    queries,
  });

  const profile: Omit<ProfileObj, "skills"> = {
    name: res.name,
    bio: res.bio,
    description: res.description,
    icon: res.icon,
  };

  return { profile, skills: res.skills };
};

export type WorksListItem = Pick<WorksResponse, "title" | "tags" | "releaseDate"> & { id: string };

export const getWorksList = async (queries?: MicroCMSQueries) => {
  return await client.getList<WorksListItem>({
    endpoint: "works",
    queries: {
      orders: "-releaseDate",
      limit: 100,
      fields: ["id", "title", "tags", "releaseDate"],
      ...queries,
    },
  });
};

export const getWorksDetail = async (contentId: string, queries?: MicroCMSQueries) => {
  const res = await client.getListDetail<WorksResponse>({
    endpoint: "works",
    contentId,
    queries,
  });

  const detail: Omit<WorksObj, "article"> = {
    title: res.title,
    releaseDate: res.releaseDate,
    techs: res.techs,
    tags: res.tags,
    githubLink: res.githubLink,
    appLink: res.appLink,
    otherLink: res.otherLink,
  };

  return { detail, article: res.article };
};

export const getSandboxList = async (queries?: MicroCMSQueries) => {
  return await client.getList<SandboxResponse>({
    endpoint: "sandbox",
    queries: {
      limit: 100,
      ...queries,
    },
  });
};

export const getBannerList = async (queries?: MicroCMSQueries) => {
  return await client.getList<BannersResponse>({
    endpoint: "banners",
    queries: {
      limit: 100,
      ...queries,
    },
  });
};
