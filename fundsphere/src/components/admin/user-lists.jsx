import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Check,
  ChevronDown,
  ChevronUp,
  ShieldUser,
  User,
  UserCheck,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useFetch } from "../../hooks/use-fetch";
import UserRowActions from "./user-row-actions";

const headers = ["username", "_id", "email", "role", "status"];

const renderCell = (user, key) => {
  switch (key) {
    case "_id":
      return (
        <span className="text-muted-foreground/80 text-sm">{user._id}</span>
      );

    case "username":
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.photoUrl} alt={user.username} />
            <AvatarFallback>
              {user.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{user.username}</span>
        </div>
      );

    case "role":
      return (
        <Badge
          className={`flex items-center gap-1 py-0.5 px-2 text-sm text-zinc-700 capitalize ${
            user.role === "admin"
              ? "bg-green-100"
              : user.role === "moderator"
              ? "bg-blue-100"
              : "bg-amber-100"
          }`}
        >
          {user.role === "admin" ? (
            <ShieldUser
              size={14}
              className="text-green-600"
              strokeWidth={2.6}
              aria-hidden="true"
            />
          ) : user.role === "moderator" ? (
            <UserCheck
              size={14}
              className="text-blue-600"
              strokeWidth={2.6}
              aria-hidden="true"
            />
          ) : (
            <User
              size={14}
              className="text-amber-600"
              strokeWidth={3}
              aria-hidden="true"
            />
          )}
          {user.role}
        </Badge>
      );

    case "status":
      return (
        <Badge
          variant="outline"
          className={`flex items-center gap-1 py-0.5 px-2 text-sm ${
            user.status === "Active" ? "text-primary" : "text-muted-foreground"
          }`}
        >
          {user.status === "Active" ? (
            <Check
              size={14}
              className="text-green-600"
              strokeWidth={3}
              aria-hidden="true"
            />
          ) : (
            "- "
          )}
          {user.status}
        </Badge>
      );

    case "email":
      return <span className="text-muted-foreground">{user.email}</span>;

    default:
      return user[key];
  }
};

const UserLists = ({
  users,
  setUsers,
  onSort,
  isLoading,
  order,
  selectedUsers,
  setSelectedUsers,
}) => {
  const { user } = useAuth();
  const { request } = useFetch();

  const toggleUser = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (user?.role === "moderator") {
      const selectableUsers = users
        .filter((u) => u.role !== "admin")
        .map((u) => u._id);

      if (selectedUsers.length === selectableUsers.length) {
        setSelectedUsers([]);
      } else {
        setSelectedUsers(selectableUsers);
      }
    } else {
      if (selectedUsers.length === users.length) {
        setSelectedUsers([]);
      } else {
        setSelectedUsers(users.map((u) => u._id));
      }
    }
  };

  const changeRole = async (userId, newRole) => {
    if (!user) return;

    const res = await request({
      url: `/api/admin/${userId}/role`,
      method: "PATCH",
      data: { role: newRole },
    });

    if (res.success) {
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
    }
  };

  const activateUser = async (userId) => {
    if (!user) return;

    const res = await request({
      url: `/api/admin/${userId}/activate`,
      method: "PATCH",
    });

    if (res.success) {
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, status: "Active" } : u))
      );
    }
  };

  const deactivateUser = async (userId) => {
    if (!user) return;

    const res = await request({
      url: `/api/admin/${userId}/deactivate`,
      method: "PATCH",
    });

    if (res.success) {
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, status: "Inactive" } : u))
      );
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!user) return;

    const res = await request({
      url: `/api/admin/${userId}/delete`,
      method: "DELETE",
    });

    if (res.success) {
      setUsers((prev) => prev.filter((user) => user._id !== userId));
    }
  };

  return (
    <Table className="min-w-max border-separate border-spacing-0 [&_tr:not(:last-child)_td]:border-b">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          {/* Checkbox */}
          <TableHead className="bg-sidebar w-8 border-y border-border border-l rounded-l-lg">
            <Checkbox
              aria-label="Select all"
              checked={
                selectedUsers.length ===
                  users.filter(
                    (u) => !(user.role === "moderator" && u.role === "admin")
                  ).length &&
                users.filter(
                  (u) => !(user.role === "moderator" && u.role === "admin")
                ).length > 0
              }
              onCheckedChange={toggleAll}
              className="border-muted-foreground/60"
            />
          </TableHead>
          {/* Keys */}
          {headers.map((key) => (
            <TableHead key={key} className="bg-sidebar border-y border-border">
              {key === "username" ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSort}
                  className="h-fit hover:bg-transparent has-[>svg]:px-0"
                >
                  <span className="capitalize">Name</span>
                  {order ? (
                    <ChevronDown
                      size={16}
                      aria-hidden="true"
                      className="shrink-0 opacity-60"
                    />
                  ) : (
                    <ChevronUp
                      size={16}
                      aria-hidden="true"
                      className="shrink-0 opacity-60"
                    />
                  )}
                </Button>
              ) : key === "_id" ? (
                <span className="uppercase">ID</span>
              ) : (
                <span className="capitalize">{key}</span>
              )}
            </TableHead>
          ))}
          {/* Actions */}
          <TableHead className="bg-sidebar w-15 border-y border-border border-r rounded-r-lg">
            <span className="flex justify-end pr-1 sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <tbody className="table-row h-1" aria-hidden="true"></tbody>
      <TableBody>
        {isLoading ? (
          <TableRow
            className="hover:bg-transparent [&:first-child>td:first-child]:rounded-tl-lg 
                [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg 
                [&:last-child>td:last-child]:rounded-br-lg pointer-events-none"
          >
            <TableCell
              colSpan={headers.length + 2}
              className="h-24 text-center"
            >
              Loading...
            </TableCell>
          </TableRow>
        ) : users?.length ? (
          users.map((u) => (
            <TableRow
              key={u._id}
              className="border-0 [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg h-px hover:bg-accent/50"
            >
              {/* Checkbox */}
              <TableCell className="h-[inherit]">
                <Checkbox
                  aria-label="Select row"
                  checked={selectedUsers.includes(u._id)}
                  onCheckedChange={() => {
                    if (!(user.role === "moderator" && u.role === "admin")) {
                      toggleUser(u._id);
                    }
                  }}
                  className={`border-muted-foreground/60 ${
                    user.role === "moderator" && u.role === "admin"
                      ? "opacity-50 pointer-events-none"
                      : ""
                  }`}
                />
              </TableCell>
              {/* Values */}
              {headers.map((key) => (
                <TableCell key={key} className="h-[inherit]">
                  {renderCell(u, key)}
                </TableCell>
              ))}
              {/* Actions */}
              <TableCell className="py-0 h-[inherit]">
                <UserRowActions
                  item={u}
                  currentUserRole={user?.role}
                  onRoleChange={changeRole}
                  onActivate={activateUser}
                  onDeactivate={deactivateUser}
                  onDelete={handleDeleteUser}
                />
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow
            className="hover:bg-transparent [&:first-child>td:first-child]:rounded-tl-lg 
                [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg 
                [&:last-child>td:last-child]:rounded-br-lg pointer-events-none"
          >
            <TableCell
              colSpan={headers.length + 2}
              className="h-24 text-center"
            >
              No Results
            </TableCell>
          </TableRow>
        )}
      </TableBody>
      <tbody aria-hidden="true" className="table-row h-1"></tbody>
    </Table>
  );
};

export default UserLists;
