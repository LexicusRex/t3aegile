export const PERM_COURSE_MANAGE_ENROLMENTS = "course:manage-enrolments";
export const PERM_COURSE_MANAGE_CORE = "course:manage-core";
export const PERM_ROLE_MANAGE = "role:manage";
export const PERM_TUTORIAL_MANAGE_CORE = "tutorial:manage-core";
export const PERM_TUTORIAL_MANAGE_ENROLMENTS = "tutorial:manage-enrolments";
export const PERM_TUTORIAL_MULTI_ENROL = "tutorial:multi-enrol";
export const PERM_TUTORIAL_VIEW = "tutorial:view";
export const PERM_GROUP_MANAGE_CORE = "group:manage-core";
export const PERM_GROUP_MANAGE_ENROLMENTS = "group:manage-enrolments";
export const PERM_GROUP_MANAGE_SELF_ENROLMENT = "group:manage-self-enrolment";
export const PERM_GROUP_VIEW = "group:view";
export const PERM_ASSIGNMENT_MANAGE_CORE = "assignment:manage-core";
export const PERM_SUBMISSION_SUBMIT = "submission:submit";
export const PERM_SUBMISSION_VIEW = "submission:view";
export const PERM_SUBMISSION_RESUBMIT = "submission:resubmit";

export const permissionsList = [
  PERM_COURSE_MANAGE_ENROLMENTS,
  PERM_COURSE_MANAGE_CORE,
  PERM_ROLE_MANAGE,
  PERM_TUTORIAL_MANAGE_CORE,
  PERM_TUTORIAL_MANAGE_ENROLMENTS,
  PERM_TUTORIAL_MULTI_ENROL,
  PERM_TUTORIAL_VIEW,
  PERM_GROUP_MANAGE_CORE,
  PERM_GROUP_MANAGE_ENROLMENTS,
  PERM_GROUP_MANAGE_SELF_ENROLMENT,
  PERM_GROUP_VIEW,
  PERM_ASSIGNMENT_MANAGE_CORE,
  PERM_SUBMISSION_SUBMIT,
  PERM_SUBMISSION_VIEW,
  PERM_SUBMISSION_RESUBMIT,
] as const;
