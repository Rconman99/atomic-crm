import { useGetIdentity, useListContext } from "ra-core";
import { Link } from "react-router";
import { CreateButton } from "@/components/admin/create-button";
import { ExportButton } from "@/components/admin/export-button";
import { List } from "@/components/admin/list";
import { ListPagination } from "@/components/admin/list-pagination";
import { SortButton } from "@/components/admin/sort-button";
import { Badge } from "@/components/ui/badge";
import { TopToolbar } from "../layout/TopToolbar";
import type { Project } from "../types";

const statusColors: Record<string, string> = {
  "Not Started": "bg-muted text-muted-foreground",
  "In Progress": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "In Review": "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  "Delivered": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  "Maintenance": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
};

export const ProjectList = () => {
  const { identity } = useGetIdentity();
  if (!identity) return null;
  return (
    <List
      title={false}
      perPage={25}
      sort={{ field: "created_at", order: "DESC" }}
      actions={<ProjectListActions />}
      pagination={<ListPagination rowsPerPageOptions={[10, 25, 50]} />}
    >
      <ProjectListContent />
    </List>
  );
};

const ProjectListContent = () => {
  const { data, isPending } = useListContext<Project>();
  if (isPending) return null;
  if (!data?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p className="text-lg font-medium">No projects yet</p>
        <p className="text-sm">Create your first project to get started.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="text-left p-3 font-medium">Project</th>
            <th className="text-left p-3 font-medium">Type</th>
            <th className="text-left p-3 font-medium">Status</th>
            <th className="text-right p-3 font-medium">Contract Value</th>
            <th className="text-left p-3 font-medium">Timeline</th>
          </tr>
        </thead>
        <tbody>
          {data.map((project) => (
            <tr
              key={project.id}
              className="border-b last:border-b-0 hover:bg-muted/30 transition-colors"
            >
              <td className="p-3">
                <Link
                  to={`/projects/${project.id}/show`}
                  className="font-medium hover:underline"
                >
                  {project.name}
                </Link>
                {project.description && (
                  <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[300px]">
                    {project.description}
                  </p>
                )}
              </td>
              <td className="p-3 text-muted-foreground">
                {project.project_type}
              </td>
              <td className="p-3">
                <Badge
                  variant="secondary"
                  className={statusColors[project.status] || ""}
                >
                  {project.status}
                </Badge>
              </td>
              <td className="p-3 text-right">
                {project.contract_value
                  ? Number(project.contract_value).toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 0,
                    })
                  : "—"}
              </td>
              <td className="p-3 text-muted-foreground text-xs">
                {project.start_date && (
                  <>
                    {new Date(project.start_date).toLocaleDateString()}
                    {project.target_end_date && (
                      <> → {new Date(project.target_end_date).toLocaleDateString()}</>
                    )}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ProjectListActions = () => (
  <TopToolbar>
    <SortButton fields={["name", "created_at", "status", "contract_value"]} />
    <ExportButton />
    <CreateButton label="New Project" />
  </TopToolbar>
);
