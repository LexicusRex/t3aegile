import * as constants from "@/lib/constants";

export const defaultRoles = [
  {
    name: "Instructor",
    isDefault: false,
    permissions: [
      constants.PERM_COURSE_MANAGE_CORE,
      constants.PERM_TUTORIAL_VIEW,
      constants.PERM_TUTORIAL_MANAGE_ENROLMENTS,
      constants.PERM_TUTORIAL_MANAGE_CORE,
    ],
  },
  {
    name: "Assistant",
    isDefault: false,
    permissions: [
      constants.PERM_COURSE_MANAGE_CORE,
      constants.PERM_TUTORIAL_VIEW,
      constants.PERM_TUTORIAL_MANAGE_ENROLMENTS,
      constants.PERM_TUTORIAL_MANAGE_CORE,
    ],
  },
  {
    name: "Grading Tutor",
    isDefault: false,
    permissions: [
      constants.PERM_TUTORIAL_VIEW,
      constants.PERM_TUTORIAL_MANAGE_ENROLMENTS,
      constants.PERM_TUTORIAL_MANAGE_CORE,
    ],
  },
  {
    name: "Non-Grading Tutor",
    isDefault: false,
    permissions: [
      constants.PERM_TUTORIAL_MANAGE_ENROLMENTS,
      constants.PERM_TUTORIAL_MANAGE_CORE,
    ],
  },
  { name: "Student", isDefault: true, permissions: [] },
];
