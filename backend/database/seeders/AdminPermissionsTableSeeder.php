<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AdminPermissionsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            ['title' => '系统管理', 'permission' => 'sys', 'sort' => 1, 'parentId' => -1, 'dbTable' => null],
            ['title' => '权限管理', 'permission' => 'sys:auth', 'sort' => 3, 'parentId' => 1, 'dbTable' => null],
            ['title' => '用户管理', 'permission' => 'sys:auth:user', 'sort' => 2, 'parentId' => 1, 'dbTable' => null],
            ['title' => '查看', 'permission' => 'sys:auth:user:view', 'sort' => 303, 'parentId' => 3, 'dbTable' => 'admin_users'],
            ['title' => '权限资源管理', 'permission' => 'sys:auth:per', 'sort' => 4, 'parentId' => 2, 'dbTable' => null],
            ['title' => '查看', 'permission' => 'sys:auth:per:view', 'sort' => 301, 'parentId' => 5, 'dbTable' => 'admin_permissions'],
            ['title' => '角色管理', 'permission' => 'sys:auth:role', 'sort' => 2, 'parentId' => 2, 'dbTable' => null],
            ['title' => '查看', 'permission' => 'sys:auth:role:view', 'sort' => 301, 'parentId' => 7, 'dbTable' => 'admin_roles'],
            ['title' => '修改', 'permission' => 'sys:auth:user:edit', 'sort' => 203, 'parentId' => 3, 'dbTable' => 'admin_users'],
            ['title' => '删除', 'permission' => 'sys:auth:user:remove', 'sort' => 101, 'parentId' => 3, 'dbTable' => 'admin_users'],
            ['title' => '添加', 'permission' => 'sys:auth:user:add', 'sort' => 401, 'parentId' => 3, 'dbTable' => 'admin_users'],
            ['title' => '修改', 'permission' => 'sys:auth:role:edit', 'sort' => 201, 'parentId' => 7, 'dbTable' => 'admin_roles'],
            ['title' => '删除', 'permission' => 'sys:auth:role:remove', 'sort' => 101, 'parentId' => 7, 'dbTable' => 'admin_roles'],
            ['title' => '添加', 'permission' => 'sys:auth:role:add', 'sort' => 402, 'parentId' => 7, 'dbTable' => 'admin_roles'],
            ['title' => '修改', 'permission' => 'sys:auth:per:edit', 'sort' => 201, 'parentId' => 5, 'dbTable' => 'admin_permissions'],
            ['title' => '删除', 'permission' => 'sys:auth:per:remove', 'sort' => 101, 'parentId' => 5, 'dbTable' => 'admin_permissions'],
            ['title' => '添加', 'permission' => 'sys:auth:per:add', 'sort' => 401, 'parentId' => 5, 'dbTable' => 'admin_permissions'],
            ['title' => '授权', 'permission' => 'sys:auth:role:authz', 'sort' => 501, 'parentId' => 7, 'dbTable' => 'admin_roles'],
            ['title' => '上传', 'permission' => 'sys:auth:user:upload', 'sort' => 501, 'parentId' => 3, 'dbTable' => 'admin_users'],
        ];

        foreach ($permissions as &$permission) {
            $permission['created_at'] = date('Y-m-d H:i:s');
            $permission['updated_at'] = date('Y-m-d H:i:s');
        }

        DB::table('admin_permissions')->insert($permissions);
    }
}
