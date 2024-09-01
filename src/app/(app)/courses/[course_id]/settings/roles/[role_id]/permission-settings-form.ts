import * as constants from "@/lib/constants";

const permissionsSettingsFormStructure = [
  {
    name: "General Course Permissions",
    permissions: [
      {
        name: "Manage Course Enrolments",
        slug: constants.PERM_COURSE_MANAGE_ENROLMENTS,
        description:
          "Manage course enrolments, including adding or removing students.",
      },
      {
        name: "Manage Course Settings",
        slug: constants.PERM_COURSE_MANAGE_CORE,
        description:
          "Manage core course settings, including editing course details and status.",
      },
    ],
  },
  {
    name: "Role Management",
    permissions: [
      {
        name: "Manage Roles & Permissions",
        slug: constants.PERM_ROLE_MANAGE,
        description: "Manage roles and permissions within the system.",
      },
    ],
  },
  {
    name: "Tutorial Access Permissions",
    permissions: [
      {
        name: "Manage Tutorial Settings",
        slug: constants.PERM_TUTORIAL_MANAGE_CORE,
        description:
          "Manage core tutorial settings, including tutorial details and participants.",
      },
      {
        name: "Manage Tutorial Enrolments",
        slug: constants.PERM_TUTORIAL_MANAGE_ENROLMENTS,
        description:
          "Manage tutorial enrolments, including adding or removing participants.",
      },
      {
        name: "View Tutorials Externally",
        slug: constants.PERM_TUTORIAL_VIEW,
        description: "View tutorial information and details.",
      },
    ],
  },
  {
    name: "Group Permissions",
    permissions: [
      {
        name: "Manage Group Settings",
        slug: constants.PERM_GROUP_MANAGE_CORE,
        description:
          "Manage core group settings, including group details and participants.",
      },
      {
        name: "Manage Group Enrolments",
        slug: constants.PERM_GROUP_MANAGE_ENROLMENTS,
        description:
          "Manage group enrolments, including adding or removing participants.",
      },
      {
        name: "Manage Self Enrolments",
        slug: constants.PERM_GROUP_MANAGE_SELF_ENROLMENT,
        description: "Manage self-enrolment settings for groups.",
      },
      {
        name: "View External Groups",
        slug: constants.PERM_GROUP_VIEW,
        description: "View group information and details.",
      },
    ],
  },
  {
    name: "Assignment Management",
    permissions: [
      {
        name: "Manage Assignment Settings",
        slug: constants.PERM_ASSIGNMENT_MANAGE_CORE,
        description:
          "Manage core assignment settings, including creating or editing assignments.",
      },
    ],
  },
  {
    name: "Submission Management",
    permissions: [
      {
        name: "Submit",
        slug: constants.PERM_SUBMISSION_SUBMIT,
        description: "Submit assignments to the system.",
      },
      {
        name: "View External Submissions",
        slug: constants.PERM_SUBMISSION_VIEW,
        description: "View submitted assignments.",
      },
      {
        name: "Resubmit",
        slug: constants.PERM_SUBMISSION_RESUBMIT,
        description: "Resubmit assignments after the initial submission.",
      },
    ],
  },
];

export default permissionsSettingsFormStructure;
