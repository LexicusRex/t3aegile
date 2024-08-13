export const defaultRoles = [
  {
    displayName: "Instructor",
    permissions: ["course:view", "course:edit", "tutorial:view"],
  },
  { displayName: "Assistant", permissions: ["course:view"] },
  { displayName: "Grading_Tutor", permissions: ["course:view"] },
  { displayName: "Non_Grading_Tutor", permissions: ["course:view"] },
  { displayName: "Student", permissions: ["course:view"] },
];
