export type DateString = `${number}-${number}-${number}`;

export type Period = {
  start: DateString;
  end?: DateString;
};

export type Project = {
  name: string;
  period: Period;
  roles: string[];
  techs: string[];
  description: string;
  achievements: string[];
};

export type Company = {
  name: string;
  description: string;
  projects: Project[];
};

export type Resume = {
  title: string;
  companies: Company[];
  updatedAt: DateString;
};
