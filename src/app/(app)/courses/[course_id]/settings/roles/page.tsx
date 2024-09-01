import { Separator } from "@/components/ui/separator";

export default async function CourseSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="font-semibold leading-none tracking-tight">
          Roles & Permission
        </h3>
        <p className="text-sm text-muted-foreground">
          Overview of how roles and permissions work.
        </p>
      </div>
      <Separator />
      <div className="space-y-6 font-sans">
        <p>
          Here, you can manage and configure the roles and permissions for your
          course participants. Roles help define what each user can access and
          perform within the course. Whether you want to assign administrative
          privileges, moderate content, or limit access to specific sections,
          this is where you can customize those settings to suit your
          course&apos;s needs.
        </p>
        <ul className="ms-8 list-disc space-y-2">
          <li>
            <span className="font-semibold">Manage Roles:</span> Create, edit,
            or delete roles tailored to different levels of participation (e.g.,
            admin, instructor, student).
          </li>
          <li>
            <span className="font-semibold">Assign Permissions:</span> Control
            what actions each role can perform, such as content creation,
            grading, or course management.
          </li>
          <li>
            <span className="font-semibold">Role Hierarchy:</span> Set role
            priorities to establish a clear structure, ensuring that higher
            roles inherit the permissions of lower roles.
          </li>
        </ul>
        <p>
          This tool ensures that your course is securely managed, with each
          participant having the right level of access and control.
        </p>

        <h2 className="text-lg font-bold">Disclaimers</h2>
        <ul className="ms-8 list-decimal space-y-2">
          <li>
            <span className="font-semibold">Changes Are Immediate:</span> Any
            changes made to roles and permissions will take effect immediately.
            Please review adjustments carefully before saving.
          </li>
          <li>
            <span className="font-semibold">Access Restrictions:</span> Be
            cautious when modifying roles that affect access to critical course
            content or administration. Incorrect permissions may limit essential
            functionalities for users.
          </li>
          <li>
            <span className="font-semibold">No Undo for Deletion:</span>{" "}
            Deleting a role will remove it permanently, along with any
            associated permissions. This action cannot be undone, so
            double-check before proceeding.
          </li>
          <li>
            <span className="font-semibold">Inherited Permissions:</span> Roles
            may inherit permissions from lower roles, so altering permissions
            for one role may impact others. Review your hierarchy settings to
            ensure consistency.
          </li>
          <li>
            <span className="font-semibold">Compliance and Privacy:</span>{" "}
            Ensure that role assignments and permissions comply with any
            applicable privacy regulations and institutional policies.
            Misconfigurations may inadvertently expose sensitive information to
            unauthorized users.
          </li>
          <li>
            <span className="font-semibold">Support:</span> If you encounter any
            issues or need help with role management, please contact the system
            administrator or refer to the course management documentation.
          </li>
        </ul>
        <p>
          By using this page, you acknowledge that you have the necessary rights
          to configure roles and that any changes made will impact user access
          and functionality within the course.
        </p>
      </div>
      <Separator />
      <div className="space-y-6 font-sans">
        <p>
          Here, you can manage and configure the roles and permissions for your
          course participants. Roles help define what each user can access and
          perform within the course. Whether you want to assign administrative
          privileges, moderate content, or limit access to specific sections,
          this is where you can customize those settings to suit your
          course&apos;s needs.
        </p>
        <ul className="ms-8 list-disc space-y-2">
          <li>
            <span className="font-semibold">Manage Roles:</span> Create, edit,
            or delete roles tailored to different levels of participation (e.g.,
            admin, instructor, student).
          </li>
          <li>
            <span className="font-semibold">Assign Permissions:</span> Control
            what actions each role can perform, such as content creation,
            grading, or course management.
          </li>
          <li>
            <span className="font-semibold">Role Hierarchy:</span> Set role
            priorities to establish a clear structure, ensuring that higher
            roles inherit the permissions of lower roles.
          </li>
        </ul>
        <p>
          This tool ensures that your course is securely managed, with each
          participant having the right level of access and control.
        </p>

        <h2 className="text-lg font-bold">Disclaimers</h2>
        <ul className="ms-8 list-decimal space-y-2">
          <li>
            <span className="font-semibold">Changes Are Immediate:</span> Any
            changes made to roles and permissions will take effect immediately.
            Please review adjustments carefully before saving.
          </li>
          <li>
            <span className="font-semibold">Access Restrictions:</span> Be
            cautious when modifying roles that affect access to critical course
            content or administration. Incorrect permissions may limit essential
            functionalities for users.
          </li>
          <li>
            <span className="font-semibold">No Undo for Deletion:</span>{" "}
            Deleting a role will remove it permanently, along with any
            associated permissions. This action cannot be undone, so
            double-check before proceeding.
          </li>
          <li>
            <span className="font-semibold">Inherited Permissions:</span> Roles
            may inherit permissions from lower roles, so altering permissions
            for one role may impact others. Review your hierarchy settings to
            ensure consistency.
          </li>
          <li>
            <span className="font-semibold">Compliance and Privacy:</span>{" "}
            Ensure that role assignments and permissions comply with any
            applicable privacy regulations and institutional policies.
            Misconfigurations may inadvertently expose sensitive information to
            unauthorized users.
          </li>
          <li>
            <span className="font-semibold">Support:</span> If you encounter any
            issues or need help with role management, please contact the system
            administrator or refer to the course management documentation.
          </li>
        </ul>
        <p>
          By using this page, you acknowledge that you have the necessary rights
          to configure roles and that any changes made will impact user access
          and functionality within the course.
        </p>
      </div>
    </div>
  );
}
