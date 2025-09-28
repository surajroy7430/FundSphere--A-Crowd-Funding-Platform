import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useDebounce } from "../../hooks/use-debounce";
import { useFetch } from "../../hooks/use-fetch";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CircleAlert, CircleX, Funnel, Search, Trash2 } from "lucide-react";
import UserLists from "./user-lists";
import PaginationControl from "../pagination-control";

const FilterGroup = ({
  title,
  options,
  filterKey,
  selectedFilters,
  toggleFilter,
  allUsers,
}) => {
  return (
    <>
      <div className="text-xs font-medium uppercase text-muted-foreground/60">
        {title}
      </div>
      {options.map((option) => (
        <div key={option} className="space-y-3">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={selectedFilters[filterKey].includes(option)}
              onCheckedChange={() => toggleFilter(filterKey, option)}
            />
            <Label className="flex grow justify-between gap-2 font-normal">
              {option}{" "}
              <span className="ms-2 text-xs text-muted-foreground">
                {allUsers.filter((user) => user[filterKey] === option).length}
              </span>
            </Label>
          </div>
        </div>
      ))}
    </>
  );
};

const UsersTable = () => {
  const { user } = useAuth();
  const { request, loading } = useFetch();
  const [users, setUsers] = useState([]);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [sortOrder, setSortOrder] = useState(true);
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [selectedFilter, setSelectedFilter] = useState({
    status: [],
    role: [],
  });

  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchUsers = async () => {
      const res = await request({
        url: "/api/admin/users",
        method: "GET",
      });
      if (res.success) {
        setUsers(res.data?.users);
      }
    };

    fetchUsers();
  }, [user, request]);

  const deleteUsers = async () => {
    if (!user || selectedUsers.length === 0) return;

    const res = await request({
      url: "/api/admin/delete-users",
      method: "DELETE",
      data: { ids: selectedUsers },
    });

    if (res.success) {
      toast.success(res.msg);
      setUsers((prev) => prev.filter((u) => !selectedUsers.includes(u._id)));
      setSelectedUsers([]);
    }
  };

  useEffect(() => {
    let result = [...users];

    // Search by name
    if (debouncedSearch.trim()) {
      result = result.filter((user) =>
        user.username.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    // filter by status
    if (selectedFilter.status.length > 0) {
      result = result.filter((user) =>
        selectedFilter.status.includes(user.status)
      );
    }

    // filter by role
    if (selectedFilter.role.length > 0) {
      result = result.filter((user) => selectedFilter.role.includes(user.role));
    }

    // sort by username
    result.sort((a, b) => {
      if (sortOrder) {
        return a.username.localeCompare(b.username);
      } else {
        return b.username.localeCompare(a.username);
      }
    });

    setFilteredUsers(result);
  }, [users, debouncedSearch, selectedFilter, sortOrder]);

  const toggleFilter = (type, value) => {
    setSelectedFilter((prev) => {
      const current = prev[type];
      return {
        ...prev,
        [type]: current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });
  };

  const handleSort = () => setSortOrder((prev) => !prev);

  return (
    <div className="space-y-4">
      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Search Input */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className="absolute inset-y-0 start-0 grid place-items-center ps-2 
              text-muted-foreground/60"
            >
              <Search
                size={20}
                aria-hidden="true"
                className="pointer-events-none"
              />
            </div>
            <Input
              placeholder="Search by name"
              aria-label="Search by name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="ps-9 min-w-60 bg-background px-8 py-2"
            />
            {search && (
              <button
                className="absolute inset-y-0 end-0 h-full w-9 grid place-items-center
                  rounded-e-lg text-muted-foreground/60 outline-offset-2 transition-colors 
                  hover:text-foreground focus:z-10 focus-visible:outline-2 
                  focus-visible:outline-ring/70 disabled:pointer-events-none 
                  disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Clear filter"
                onClick={() => setSearch("")}
              >
                <CircleX size={16} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        {/* Filter options */}
        <div className="flex items-center gap-3">
          {/* Delete Button Dialog */}
          {selectedUsers.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  <Trash2
                    size={16}
                    aria-hidden="true"
                    className="-ms-1 opacity-60"
                  />
                  Delete
                  <span className="-me-1 ms-1 inline-flex h-5 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
                    {selectedUsers.length}
                  </span>
                </Button>
              </AlertDialogTrigger>
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
                        This will permanently delete {selectedUsers.length}{" "}
                        {selectedUsers.length === 1 ? "user" : "users"}
                      </span>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-500 hover:bg-red-600"
                    onClick={deleteUsers}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {/* Filter Button */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Funnel
                  size={20}
                  aria-hidden="true"
                  className="size-5 -ms-1.5 text-muted-foreground/60"
                />
                Filter
                <span className="-me-1 ms-3 inline-flex h-5 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
                  {selectedFilter.status.length + selectedFilter.role.length}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto min-w-36 p-3" align="end">
              <div className="space-y-3">
                <FilterGroup
                  title="Status"
                  options={["Active", "Inactive"]}
                  filterKey="status"
                  selectedFilters={selectedFilter}
                  toggleFilter={toggleFilter}
                  allUsers={filteredUsers}
                />
                <FilterGroup
                  title="Role"
                  options={["admin", "moderator", "user"]}
                  filterKey="role"
                  selectedFilters={selectedFilter}
                  toggleFilter={toggleFilter}
                  allUsers={filteredUsers}
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Table + Pagination */}
      <PaginationControl data={filteredUsers}>
        {(paginatedData) => (
          <div className="overflow-x-auto w-full">
            <UserLists
              users={paginatedData}
              setUsers={setUsers}
              onSort={handleSort}
              isLoading={loading}
              order={sortOrder}
              selectedUsers={selectedUsers}
              setSelectedUsers={setSelectedUsers}
            />
          </div>
        )}
      </PaginationControl>
    </div>
  );
};

export default UsersTable;
