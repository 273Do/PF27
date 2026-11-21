import type {
  Profile,
  ProfileCustomFieldSkill,
  Works,
  WorksCustomFieldTech,
} from "@/gen/microcms-types";

export type { Sandbox } from "@/gen/microcms-types";

export type Skill = ProfileCustomFieldSkill;

export type Tech = WorksCustomFieldTech;

export type ProfileOnly = Pick<Profile, "name" | "bio" | "description" | "icon">;

export type FooterProfile = Pick<Profile, "mail" | "links">;

export type WorksListItem = Pick<Works, "id" | "title" | "tags" | "releaseDate" | "pickup">;

export type WorksDetail = Pick<
  Works,
  "title" | "releaseDate" | "techs" | "tags" | "githubLink" | "appLink" | "otherLink" | "pickup"
>;

export type AroundWorksIds = {
  aroundWorksIds: {
    prevId?: string;
    nextId?: string;
  };
};
