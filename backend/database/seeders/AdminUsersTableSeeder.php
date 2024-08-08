<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AdminUsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'username'   => 'super_laravel',
                'password'   => '$2y$10$IKeTQQ7fQSpP2bOUi9389OrrHYSFY6XADO5doFrn8tsR409UN0AJK',
                'nickName'   => '超级管理员',
                'roles'      => '[1]',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
        ];

        DB::table('admin_users')->insert($users);
    }
}
