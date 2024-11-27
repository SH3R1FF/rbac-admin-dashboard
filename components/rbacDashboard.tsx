"use client"

import React, { useState, useMemo } from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Plus, 
  Trash2, 
  Check, 
  X,
  Pencil,
  Search
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue,
  SelectLabel,
  SelectGroup 
} from "@/components/ui/select";

// Define base types
type UserStatus = 'active' | 'inactive';
type PermissionType = 'create' | 'read' | 'update' | 'delete';

// Define interfaces for main entities
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: UserStatus;
}

interface Role {
  id: number;
  name: string;
  description: string;
  permissions: PermissionType[];
}

// Define interfaces for State management
interface NewUser {
  name: string;
  email: string;
  role: string;
  status: UserStatus;
}

interface NewRole {
  name: string;
  description: string;
  permissions: PermissionType[];
}

interface EditingState {
  userId: number | null;
  field: 'status' | 'role' | null;
}

const RBACDashboard: React.FC = () => {
  
  // Sample initial data with proper typing for User
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'editor', status: 'active' },
    { id: 3, name: 'Nathan Lyon', email: 'nathan@example.com', role: 'editor', status: 'inactive' },
    { id: 4, name: 'Virat Kohli', email: 'virat@example.com', role: 'viewer', status: 'active' },
    { id: 5, name: 'Rey Mysterio', email: 'rey@example.com', role: 'admin', status: 'active' },
    { id: 6, name: 'Bob Wilson', email: 'bob@example.com', role: 'viewer', status: 'inactive' },
    { id: 7, name: 'Ryan Renolds', email: 'ryan@example.com', role: 'viewer', status: 'active' },
    { id: 8, name: 'Stan Lee', email: 'stan@example.com', role: 'admin', status: 'active' },
  ]);

  // Sample initial data with proper typing for Roles
  const [roles, setRoles] = useState<Role[]>([
    { 
      id: 1, 
      name: 'admin', 
      description: 'Full system access',
      permissions: ['create', 'read', 'update', 'delete']
    },
    { 
      id: 2, 
      name: 'editor', 
      description: 'Can edit content',
      permissions: ['read', 'update']
    },
    { 
      id: 3, 
      name: 'viewer', 
      description: 'Read-only access',
      permissions: ['read']
    },
  ]);

  // Sample initial data with proper typing for Permissions
  const [permissions] = useState<PermissionType[]>([
    'create', 'read', 'update', 'delete'
  ]);

  // New state for search and filters
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const [isAddingUser, setIsAddingUser] = useState<boolean>(false);
  const [isAddingRole, setIsAddingRole] = useState<boolean>(false);
  const [editing, setEditing] = useState<EditingState>({ userId: null, field: null });
  const [newUser, setNewUser] = useState<NewUser>({ 
    name: '', 
    email: '', 
    role: '', 
    status: 'active' 
  });
  const [newRole, setNewRole] = useState<NewRole>({ 
    name: '', 
    description: '', 
    permissions: [] 
  });

  // Filtered and Searched Users

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = !roleFilter || user.role === roleFilter;
      const matchesStatus = !statusFilter || user.status === statusFilter;
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  const addUser = (): void => {
    setUsers([...users, { id: users.length + 1, ...newUser }]);
    setNewUser({ name: '', email: '', role: '', status: 'active' });
    setIsAddingUser(false);
    toast("User has been added.")
  };

  const addRole = (): void => {
    setRoles([...roles, { id: roles.length + 1, ...newRole }]);
    setNewRole({ name: '', description: '', permissions: [] });
    setIsAddingRole(false);
    toast("Role has been added.")
  };

  const deleteUser = (id: number): void => {
    setUsers(users.filter(user => user.id !== id));
    toast("User has been deleted.")
  };

  const deleteRole = (id: number): void => {
    setRoles(roles.filter(role => role.id !== id));
    toast("Role has been deleted.")
  };

  const togglePermission = (roleId: number, permission: PermissionType): void => {
    setRoles(roles.map(role => {
      if (role.id === roleId) {
        const newPermissions = role.permissions.includes(permission)
          ? role.permissions.filter(p => p !== permission)
          : [...role.permissions, permission];
        return { ...role, permissions: newPermissions };
      }
      return role;
    }));
  };

  const startEditing = (userId: number, field: 'status' | 'role') => {
    setEditing({ userId, field });
  };

  const updateUser = (userId: number, field: 'status' | 'role', value: string) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        return { ...user, [field]: value };
      }
      return user;
    }));
    setEditing({ userId: null, field: null });
    toast(`User ${field} has been updated.`);
  };

  const renderEditableField = (user: User, field: 'status' | 'role') => {
    const isEditing = editing.userId === user.id && editing.field === field;

    if (!isEditing) {
      return (
        <div className="flex items-center space-x-2">
          <Badge 
            variant={field === 'status' ? (user[field] === 'active' ? 'default' : 'destructive') : 'secondary'}
            className={field === 'role' ? (user[field] === 'admin' ? 'dark:bg-blue-600 bg-blue-400' : '') : "secondary"}
          >
            {user[field]}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => startEditing(user.id, field)}
            className="h-6 w-6"
          >
            <Pencil className="h-3 w-3" />
          </Button>
        </div>
      );
    }

    if (field === 'status') {
      return (
        <div className="flex items-center space-x-2">
          <select
            className="p-1 border rounded text-sm"
            value={user.status}
            onChange={(e) => updateUser(user.id, 'status', e.target.value)}
            autoFocus
          >
            <option value="active">active</option>
            <option value="inactive">inactive</option>
          </select>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-2">
        <select
          className="p-1 border rounded text-sm"
          value={user.role}
          onChange={(e) => updateUser(user.id, 'role', e.target.value)}
          autoFocus
        >
          {roles.map(role => (
            <option key={role.id} value={role.name}>{role.name}</option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">RBAC Admin Dashboard</h1>
      
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
        </TabsList>

        {/* Users tab content */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage system users and their roles</CardDescription>
                </div>
                <Dialog open={isAddingUser} onOpenChange={setIsAddingUser}>
                  <DialogTrigger asChild>
                    <Button className='dark:bg-blue-600 dark:text-white'>
                      <Plus className="w-4 h-4 mr-2" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                  <DialogHeader>
                      <DialogTitle>Add New User</DialogTitle>
                      <DialogDescription>Create a new user account</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Input
                          placeholder="Name"
                          value={newUser.name}
                          onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Input
                          placeholder="Email"
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">

                        <select
                          className="w-full p-2 border rounded"
                          value={newUser.role}
                          onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                        >
                          <option value="">Select Role</option>
                          {roles.map(role => (
                            <option key={role.id} value={role.name}>{role.name}</option>
                          ))}
                        </select>

                      </div>
                      <Button className='dark:bg-blue-600 dark:text-white' onClick={addUser}>Add User</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search and Filter Section */}
              <div className="flex space-x-4 mb-4">
                <div className="relative flex-grow">
                  <Input 
                    placeholder="Search users..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                </div>
                
                <Select 
            value={roleFilter} 
            onValueChange={setRoleFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Role - " />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Roles</SelectLabel>
                <SelectItem>All</SelectItem>
                {roles.map(role => (
                  <SelectItem key={role.id} value={role.name}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

                <Select 
                  value={statusFilter} 
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by Status -  " />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                      <SelectItem>All</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-bold">Name</th>
                      <th className="text-left p-4 font-bold">Email</th>
                      <th className="text-left p-4 font-bold">Role</th>
                      <th className="text-left p-4 font-bold">Status</th>
                      <th className="text-left p-4 font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user.id} className="border-b hover:bg-gray-50 dark:hover:bg-neutral-900">
                        <td className="p-4">{user.name}</td>
                        <td className="p-4 text-neutral-400">{user.email}</td>
                        <td className="p-4">
                          {renderEditableField(user, 'role')}
                        </td>
                        <td className="p-4">
                          {renderEditableField(user, 'status')}
                        </td>
                        <td className="p-4">
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => deleteUser(user.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredUsers.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    No users found matching your search or filter criteria.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roles tab content */}
        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Role Management</CardTitle>
                  <CardDescription>Define and manage role permissions</CardDescription>
                </div>
                <Dialog open={isAddingRole} onOpenChange={setIsAddingRole}>
                  <DialogTrigger asChild>
                    <Button className='dark:bg-blue-600 dark:text-white'>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Role
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Role</DialogTitle>
                      <DialogDescription>Create a new role with permissions</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <Input
                        placeholder="Role Name"
                        value={newRole.name}
                        onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                      />
                      <Input
                        placeholder="Description"
                        value={newRole.description}
                        onChange={(e) => setNewRole({...newRole, description: e.target.value})}
                      />
                      <div className="space-y-2">
                        <h4 className="font-medium">Permissions</h4>
                        {permissions.map(permission => (
                          <div key={permission} className="flex items-center space-x-2">
                            <Checkbox
                              checked={newRole.permissions.includes(permission)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setNewRole({
                                    ...newRole,
                                    permissions: [...newRole.permissions, permission]
                                  });
                                } else {
                                  setNewRole({
                                    ...newRole,
                                    permissions: newRole.permissions.filter(p => p !== permission)
                                  });
                                }
                              }}
                            />
                            <label className="capitalize">{permission}</label>
                          </div>
                        ))}
                      </div>
                      <Button className='dark:bg-blue-600 dark:text-white' onClick={addRole}>Add Role</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-bold">Role</th>
                      <th className="text-left p-4 font-bold">Description</th>
                      <th className="text-left p-4 font-bold">Permissions</th>
                      <th className="text-left p-4 font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roles.map(role => (
                      <tr key={role.id} className="border-b hover:bg-gray-50 dark:hover:bg-neutral-900">
                        <td className="p-4 font-medium">{role.name}</td>
                        <td className="p-4 text-neutral-400">{role.description}</td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {permissions.map(permission => (
                              <Badge
                                key={permission}
                                variant={role.permissions.includes(permission) ? "default" : "outline"}
                                // className="cursor-pointer"
                                className={role.permissions.includes(permission) ? "dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white cursor-pointer" : "dark:bg-white dark:text-black cursor-pointer"}
                                onClick={() => togglePermission(role.id, permission)}
                              >
                                {permission}
                                {role.permissions.includes(permission) ? 
                                  <Check className="ml-1 h-3 w-3" /> : 
                                  <X className="ml-1 h-3 w-3" />
                                }
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="p-4">
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => deleteRole(role.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
                
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RBACDashboard;