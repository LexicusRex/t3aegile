export const defaultRoles = [
  {
    name: "Instructor",
    isDefault: false,
    permissions: ["course:view", "course:edit", "tutorial:view"],
  },
  { name: "Assistant", isDefault: false, permissions: ["course:view"] },
  { name: "Grading_Tutor", isDefault: false, permissions: ["course:view"] },
  { name: "Non_Grading_Tutor", isDefault: false, permissions: ["course:view"] },
  { name: "Student", isDefault: true, permissions: ["course:view"] },
];
