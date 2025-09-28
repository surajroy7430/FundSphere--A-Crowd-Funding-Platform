import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CircleAlert, Ellipsis } from "lucide-react";

const UserRowActions = ({
  item,
  currentUserRole,
  onRoleChange,
  onActivate,
  onDeactivate,
  onDelete,
}) => {
  const [showDialog, setShowDialog] = useState(false);

  const canManage = currentUserRole === "admin" || item.role !== "admin";
  if (!canManage) return null;

  const roles = ["user", "moderator"];
  const availableRoles = roles.filter((role) => role !== item.role);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex justify-end pr-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Edit item"
              className="text-muted-foreground/60 shadow-none"
            >
              <Ellipsis size={20} className="size-5" aria-hidden="true" />
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-auto">
          <DropdownMenuGroup>
            {item.status === "Active" ? (
              <DropdownMenuItem onClick={() => onDeactivate(item._id)}>
                Deactivate Account
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => onActivate(item._id)}>
                Activate Account
              </DropdownMenuItem>
            )}
            {availableRoles.map((role) => (
              <DropdownMenuItem
                key={role}
                onClick={() => onRoleChange(item._id, role)}
              >
                Change to {role.charAt(0).toUpperCase() + role.slice(1)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setShowDialog(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent className="sm:max-w-sm">
          <div className="flex flex-col gap-2 items-center justify-center">
            <div
              aria-hidden="true"
              className="flex items-center justify-center size-9 shrink-0 rounded-full border border-border"
            >
              <CircleAlert size={16} className="opacity-80" />
            </div>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-center">
                Are you absolutely sure?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-center">
                This action cannot be undone.
                <br />
                <span className="mt-2">
                  This will permanently delete the user.
                </span>
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={async () => {
                await onDelete(item._id);
                setShowDialog(false);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserRowActions;
