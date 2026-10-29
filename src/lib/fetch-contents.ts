import type { MicroCMSQueries } from "microcms-js-sdk";

import type { Banners, Profile, Sandbox, Works } from "@/gen/microcms-types";

import type { FooterProfile, ProfileOnly, WorksDetail, WorksListItem } from "./types";

import { client } from "./micro-cms";

export const getProfile = async (queries?: MicroCMSQueries) => {
  const res = await client.getObject<Profile>({
    endpoint: "profile",
    queries,
  });

  const profile: ProfileOnly = {
    name: res.name,
    bio: res.bio,
    description: res.description,
    icon: res.icon,
  };

  return { profile, skills: res.skills ?? [] };
};

export const getFooterProfile = async (queries?: MicroCMSQueries) => {
  const res = await client.getObject<FooterProfile>({
    endpoint: "profile",
    queries,
  });

  return { mail: res.mail, links: res.links ?? [] };
};

export const getWorksList = async (queries?: MicroCMSQueries) => {
  return await client.getList<WorksListItem>({
    endpoint: "works",
    queries: {
      orders: "-releaseDate",
      limit: 100,
      fields: ["id", "title", "tags", "releaseDate", "pickup"],
      ...queries,
    },
  });
};

export const getWorksDetail = async (contentId: string, queries?: MicroCMSQueries) => {
  const res = await client.getListDetail<Works>({
    endpoint: "works",
    contentId,
    queries,
  });

  const detail: WorksDetail = {
    title: res.title,
    releaseDate: res.releaseDate,
    techs: res.techs,
    tags: res.tags,
    githubLink: res.githubLink,
    appLink: res.appLink,
    otherLink: res.otherLink,
    pickup: res.pickup,
  };

  return { detail, article: res.article };
};

export const getSandboxList = async (queries?: MicroCMSQueries) => {
  return await client.getList<Sandbox>({
    endpoint: "sandbox",
    queries: {
      limit: 100,
      ...queries,
    },
  });
};

export const getBannerList = async (queries?: MicroCMSQueries) => {
  return await client.getList<Banners>({
    endpoint: "banners",
    queries: {
      limit: 100,
      ...queries,
    },
  });
};
